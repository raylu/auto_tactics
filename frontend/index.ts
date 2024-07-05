import {ActionContext, ActionSequence, Color, Engine, Font, Label, Random, TileMap, vec} from 'excalibur';

import {score} from '../shared/score';
import {loader} from './loader';
import {sndPlugin} from './sounds';
import {initSpells, spellSlots, spells} from './spells';
import {enemyAnims, terrainGrass, witchAnims} from './sprites';
import {gameState} from './state';
import {Unit} from './unit';

const game = new Engine({
	canvasElement: document.querySelector('canvas#game') as HTMLCanvasElement,
	width: 640,
	height: 640,
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
	scale: vec(1.5, 1.5),
});
blueWitch.graphics.use(witchAnims.idle);
game.add(blueWitch);
witchAnims.takeDamage.events.on('end', () => {
	blueWitch.graphics.use(witchAnims.idle);
});

const ENEMY_START = vec(500, 150);
const enemy = new Unit({
	pos: ENEMY_START,
	anchor: vec(2 / 3, 0.5),
	scale: vec(2, 2),
	width: 24,
	height: enemyAnims.idle.height,
});
enemy.graphics.use(enemyAnims.idle);
enemy.graphics.flipHorizontal = true;
game.add(enemy);
const enemyAttack = new ActionSequence(enemy, (ctx: ActionContext) => {
	ctx
		.moveTo(vec(blueWitch.pos.x + 60, blueWitch.pos.y), 1000)
		.delay(200)
		.callMethod(() => {
			sndPlugin.playSound('kinetic');
			witchAnims.takeDamage.reset();
			blueWitch.graphics.use(witchAnims.takeDamage);
		})
		.delay(500)
		.moveTo(ENEMY_START, 2000)
		.callMethod(() => {
			enemy.graphics.use(enemyAnims.idle);
		});
});

const scoreDisplay = new Label({
	visible: false,
	pos: vec(game.drawWidth - 10, 10),
	font: new Font({size: 24}),
});
game.add(scoreDisplay);

initSpells(game);

const start = document.querySelector('button#start') as HTMLButtonElement;
game.on('initialize', () => {
	start.style.display = 'block';
});
start.addEventListener('click', () => {
	if (gameState.simulating)
		return;
	start.disabled = gameState.simulating = true;

	let playerTurn = true;
	const interval = setInterval(() => {
		if (playerTurn) {
			if (!blueWitch.resolveFreeze()) {
				let casted = false;
				for (const {spell} of spellSlots.blueWitch) {
					if (spell === null)
						continue;
					if (!casted && (spell.cooldown?.remaining ?? 0) == 0) {
						spell.cast(game, blueWitch, enemy);
						casted = true;
					} else
						spell.decrementCooldown();
				}
			}
		} else {
			blueWitch.graphics.use(witchAnims.idle);
			if (enemy.resolveFreeze()) {
				enemyAnims.idle.pause();
				enemyAnims.idle.tint = Color.ExcaliburBlue;
			} else {
				enemyAnims.attack.reset();
				enemyAnims.idle.play(); // unfreeze
				// @ts-expect-error
				enemyAnims.idle.tint = null;
				enemy.graphics.use(enemyAnims.attack);
				enemy.actions.runAction(enemyAttack);
			}
		}
		playerTurn = !playerTurn;
	}, 1500);

	setTimeout(() => {
		clearInterval(interval);
		scoreDisplay.text = String(score());
		scoreDisplay.pos.x = game.drawWidth - 10 - scoreDisplay.text.length * 15;
		scoreDisplay.graphics.visible = true;

		enemyAnims.idle.play(); // unfreeze
		// @ts-expect-error
		enemyAnims.idle.tint = null;

		for (const spell of spells)
			spell.resetCooldown();
		start.disabled = gameState.simulating = false;
	}, 12000);
});

void game.start(loader);
