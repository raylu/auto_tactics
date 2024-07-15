import {Color, DisplayMode, Engine, Font, Label, Random, TextAlign, TileMap, vec} from 'excalibur';

import {loader} from './loader';
import {ScoreDisplay} from './score_display';
import {sndPlugin} from './sounds';
import {initSpells, spellSlots, spells} from './spells';
import {blueWitchAnims, enemyAnims, redWitchAnims, terrainGrass} from './sprites';
import {gameState} from './state';
import {Unit} from './unit';

const game = new Engine({
	canvasElement: document.querySelector('canvas#game') as HTMLCanvasElement,
	width: 640,
	height: 640,
	displayMode: DisplayMode.FitContainer,
	backgroundColor: Color.fromRGB(50, 0, 50),
	pixelArt: true,
	suppressConsoleBootMessage: true,
});

const referenceGrassSprite = terrainGrass.getSprite(0, 0);
const background = new TileMap({
	rows: 448 / referenceGrassSprite.height,
	columns: game.drawWidth / referenceGrassSprite.width,
	tileHeight: referenceGrassSprite.height,
	tileWidth: referenceGrassSprite.width,
});
const random = new Random();
for (const tile of background.tiles)
	tile.addGraphic(terrainGrass.getSprite(random.integer(0, 3), random.integer(0, 1)));
game.add(background);

const blueWitch = new Unit({
	pos: vec(100, 150),
	offset: vec(1, 0),
	scale: vec(1.5, 1.5),
	height: 40,
	width: 24,
}, {
	maxHP: 40,
	animations: blueWitchAnims,
	spellSlots: spellSlots.blueWitch,
});
game.add(blueWitch);

const redWitch = new Unit({
	pos: vec(100, 300),
	offset: vec(0, 2),
	scale: vec(1.5, 1.5),
	height: 48,
	width: 24,
}, {
	maxHP: 40,
	animations: redWitchAnims,
	spellSlots: spellSlots.redWitch,
});
game.add(redWitch);

const playerUnits = [blueWitch, redWitch];
for (const witch of playerUnits)
	witch.animations.takeDamage.events.on('end', () => {
		witch.graphics.use(witch.animations.idle);
	});

const ENEMY_START = vec(500, 200);
const enemy = new Unit({
	pos: ENEMY_START,
	offset: vec(-4, -3),
	scale: vec(2, 2),
	width: 22,
	height: 36,
}, {
	maxHP: null,
	animations: {...enemyAnims, charge: enemyAnims.idle, takeDamage: enemyAnims.idle},
	spellSlots: [],
});
enemy.graphics.flipHorizontal = true;
game.add(enemy);
function enemyAttack(target: Unit): Promise<void> {
	enemyAnims.attack.reset();
	enemy.graphics.use(enemyAnims.attack);
	const {promise, resolve} = Promise.withResolvers<void>();
	enemy.actions
		.moveTo(vec(target.pos.x + 60, target.pos.y), 1000)
		.delay(200)
		.callMethod(() => {
			sndPlugin.playSound('kinetic');
			target.animations.takeDamage.reset();
			target.graphics.use(target.animations.takeDamage);
		})
		.delay(500)
		.moveTo(ENEMY_START, 2000)
		.callMethod(() => {
			enemy.graphics.use(enemyAnims.idle);
			target.takeDamage(10);
			if (target.isDead())
				void target.die().then(resolve);
			else
				resolve();
		});
	return promise;
}
const allUnits = [...playerUnits, enemy];

const scoreDisplay = new ScoreDisplay(game);
const endText = new Label({
	pos: vec(game.drawWidth / 2, game.drawHeight / 2 - 50),
	font: new Font({
		family: 'Metrophobic',
		bold: true,
		size: 48,
		textAlign: TextAlign.Center,
		shadow: {offset: vec(1, 1), color: Color.Black},
	}),
});
game.add(endText);

initSpells(game);

const start = document.querySelector('button#start') as HTMLButtonElement;
const restart = document.querySelector('button#restart') as HTMLButtonElement;
game.on('initialize', () => {
	start.style.display = 'block';
});

// eslint-disable-next-line @typescript-eslint/no-misused-promises
start.addEventListener('click', async () => {
	if (gameState.simulating)
		return;
	start.disabled = gameState.simulating = true;
	for (const witch of playerUnits)
		for (const {spell} of witch.spellSlots)
			spell?.startCooldown();

	let playerTurn = true;
	while (!redWitch.isDead() || !blueWitch.isDead()) {
		if (playerTurn)
			for (const witch of playerUnits) {
				const damage = await witch.resolveTurn(game, enemy, allUnits);
				if (damage > 0)
					scoreDisplay.add(damage);
			}
		else {
			if (!enemy.resolveFreeze())
				for (const witch of playerUnits)
					if (!witch.isDead()) {
						await enemyAttack(witch);
						break;
					}
		}
		playerTurn = !playerTurn;
	}

	if (enemy.health === 0) {
		endText.text = 'victory!';
		endText.font.color = Color.fromRGB(96, 255, 128);
	} else {
		endText.text = 'defeat';
		endText.font.color = Color.fromRGB(255, 96, 128);
	}
	restart.style.display = 'block';
});

restart.addEventListener('click', () => {
	for (const unit of allUnits)
		unit.reset();

	for (const spell of spells)
		spell.clearCooldown();
	endText.text = '';
	restart.style.display = 'none';
	scoreDisplay.clear();
	start.disabled = gameState.simulating = false;
});

void game.start(loader);
