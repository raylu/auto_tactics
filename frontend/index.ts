import {Color, DisplayMode, Engine, Font, Label, Random, TextAlign, TileMap, vec} from 'excalibur';

import {score} from '../shared/score';
import {loader} from './loader';
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
}, {maxHP: 40, idleAnimation: blueWitchAnims.idle, deathAnimation: blueWitchAnims.death, spellSlots: spellSlots.blueWitch});
game.add(blueWitch);
blueWitchAnims.takeDamage.events.on('end', () => {
	blueWitch.graphics.use(blueWitchAnims.idle);
});

const redWitch = new Unit({
	pos: vec(100, 300),
	offset: vec(0, 4),
	scale: vec(1.5, 1.5),
	height: 48,
	width: 24,
}, {maxHP: 40, idleAnimation: redWitchAnims.idle, deathAnimation: redWitchAnims.death, spellSlots: spellSlots.redWitch});
game.add(redWitch);

const ENEMY_START = vec(500, 200);
const enemy = new Unit({
	pos: ENEMY_START,
	offset: vec(-4, -3),
	scale: vec(2, 2),
	width: 22,
	height: 36,
}, {maxHP: 100, idleAnimation: enemyAnims.idle, deathAnimation: enemyAnims.death, spellSlots: []});
enemy.graphics.flipHorizontal = true;
game.add(enemy);
function enemyAttack(): Promise<void> {
	enemyAnims.attack.reset();
	enemy.graphics.use(enemyAnims.attack);
	const {promise, resolve} = Promise.withResolvers<void>();
	enemy.actions
		.moveTo(vec(blueWitch.pos.x + 60, blueWitch.pos.y), 1000)
		.delay(200)
		.callMethod(() => {
			sndPlugin.playSound('kinetic');
			blueWitchAnims.takeDamage.reset();
			blueWitch.graphics.use(blueWitchAnims.takeDamage);
		})
		.delay(500)
		.moveTo(ENEMY_START, 2000)
		.callMethod(() => {
			enemy.graphics.use(enemyAnims.idle);
			blueWitch.setHealth(blueWitch.health - 10);
			if (blueWitch.health === 0)
				void blueWitch.die().then(resolve);
			else
				resolve();
		});
	return promise;
}

const scoreDisplay = new Label({
	visible: false,
	pos: vec(game.drawWidth - 10, 10),
	font: new Font({size: 24}),
});
game.add(scoreDisplay);
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

	const playerUnits = [blueWitch, redWitch];
	let playerTurn = true;
	while ((blueWitch.health + redWitch.health) > 0 && enemy.health > 0) {
		if (playerTurn)
			for (const witch of playerUnits)
				await witch.resolveTurn(game, enemy);
		else {
			for (const witch of playerUnits)
				witch.graphics.use(witch.idleAnimation);
			if (!enemy.resolveFreeze())
				await enemyAttack();
		}
		playerTurn = !playerTurn;
	}

	scoreDisplay.text = String(score());
	scoreDisplay.pos.x = game.drawWidth - 10 - scoreDisplay.text.length * 15;
	scoreDisplay.graphics.visible = true;

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
	blueWitch.reset();
	enemy.reset();

	for (const spell of spells)
		spell.resetCooldown();
	endText.text = '';
	restart.style.display = 'none';
	start.disabled = gameState.simulating = false;
});

void game.start(loader);
