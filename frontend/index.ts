import {score} from '../shared/score';
import {iceSound, sounds} from './sounds';
import {JsfxrResource} from '@excaliburjs/plugin-jsfxr';
import {ActionContext, ActionSequence, Actor, Color, Engine, Font, Label, Random, ScreenElement, TileMap, vec} from 'excalibur';
import {enemyAnims, iceBlastAnims, terrainGrass, witchAnims} from './sprites';
import {loader} from './loader';
import {spells} from './spells';

const game = new Engine({
	canvasElement: document.querySelector('canvas#game') as HTMLCanvasElement,
	width: 640,
	height: 640,
	backgroundColor: Color.fromRGB(50, 0, 50),
	pixelArt: true,
	suppressConsoleBootMessage: true,
});

const sndPlugin = new JsfxrResource();
void sndPlugin.init();
for (const sound in sounds)
	sndPlugin.loadSoundConfig(sound, sounds[sound]);

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
const ENEMY_ATTACK_POS = vec(blueWitch.pos.x + 40, blueWitch.pos.y);
const enemy = new Actor({
	pos: ENEMY_START,
	scale: vec(2, 2),
});
enemy.graphics.use(enemyAnims.idle);
enemy.graphics.flipHorizontal = true;
game.add(enemy);
const enemyAttack = new ActionSequence(enemy, (ctx: ActionContext) => {
	ctx
		.moveTo(ENEMY_ATTACK_POS, 1000)
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

spells.forEach((spell, i) => {
	spell.placeIcon(80 + i * 40, game.drawHeight - 120);
	game.add(spell.icon);
});

const button = new ScreenElement({
	x: 400,
	y: game.drawHeight - 80,
	width: 100,
	height: 40,
	color: Color.Vermilion,
});
button.on('pointerup', () => {
	let playerTurn = true;
	const interval = setInterval(() => {
		if (playerTurn) {
			blueWitch.graphics.use(witchAnims.charge);
			const iceBlast = new Actor({
				pos: blueWitch.pos,
			});
			iceBlastAnims.startup.reset();
			iceBlast.graphics.use(iceBlastAnims.startup);
			iceBlastAnims.startup.events.once('end', () => {
				iceBlast.graphics.use(iceBlastAnims.projectile);
			});
			game.add(iceBlast);
			iceBlast.actions.meet(enemy, 600);
			iceBlast.events.on('actioncomplete', () => {
				iceBlastAnims.impact.reset();
				iceBlast.graphics.use(iceBlastAnims.impact);
				sndPlugin.playSound('spell');
				iceSound.volume = 0.1;
				blueWitch.graphics.use(witchAnims.idle);
			});
			iceBlastAnims.impact.events.once('end', () => {
				iceBlast.kill();
			});
			void iceSound.play(0.5);
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
	}, 6000);
});
game.add(button);

void game.start(loader);
