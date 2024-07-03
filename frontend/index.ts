import {score} from '../shared/score';
import {sndPlugin} from './sounds';
import {ActionContext, ActionSequence, Actor, Color, Engine, Font, Label, Random, TileMap, vec} from 'excalibur';
import {enemyAnims, terrainGrass, witchAnims} from './sprites';
import {loader} from './loader';
import {initSpells, spellSlots} from './spells';
import {gameState} from './state';

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

const blueWitch = new Actor({
	pos: vec(100, 150),
	scale: vec(1.5, 1.5),
});
blueWitch.graphics.use(witchAnims.idle);
game.add(blueWitch);
witchAnims.takeDamage.events.on('end', () => {
	blueWitch.graphics.use(witchAnims.idle);
});

const ENEMY_START = vec(500, 150);
const enemy = new Actor({
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
			for (const {spell} of spellSlots.blueWitch) {
				if (spell === null || (spell.cooldown?.remaining ?? 0) > 0)
					continue;
				spell.castFn(game, blueWitch, enemy);
				if (spell.cooldown !== null)
					spell.cooldown.remaining = spell.cooldown.base;
				break;
			}
		} else {
			blueWitch.graphics.use(witchAnims.idle);
			enemyAnims.attack.reset();
			enemy.graphics.use(enemyAnims.attack);
			enemy.actions.runAction(enemyAttack);
		}
		playerTurn = !playerTurn;
	}, 1500);

	setTimeout(() => {
		clearInterval(interval);
		scoreDisplay.text = String(score());
		scoreDisplay.pos.x = game.drawWidth - 10 - scoreDisplay.text.length * 15;
		scoreDisplay.graphics.visible = true;
		start.disabled = gameState.simulating = false;
	}, 6000);
});

void game.start(loader);
