import {score} from '../shared/score';
import {sounds} from './sounds';
import {JsfxrResource} from '@excaliburjs/plugin-jsfxr';
import {ActionCompleteEvent, ActionContext, ActionSequence, Actor, Color, Engine, Font, Label, MoveTo, Random,
	ScreenElement, TileMap, vec} from 'excalibur';
import {enemyAnims, loader, spellIcons, terrainGrass, witchAnims} from './sprites';

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
	ctx.moveTo(ENEMY_ATTACK_POS, 1000).delay(700).moveTo(ENEMY_START, 2000);
});
enemy.events.on('actioncomplete', (event: ActionCompleteEvent) => {
	if (event.action instanceof ActionSequence)
		enemy.graphics.use(enemyAnims.idle);
	else if (event.action instanceof MoveTo && enemy.pos.equals(ENEMY_ATTACK_POS)) {
		setTimeout(() => {
			sndPlugin.playSound('hit');
			witchAnims.takeDamage.reset();
			blueWitch.graphics.use(witchAnims.takeDamage);
		}, 200);
	}
});

const scoreDisplay = new Label({
	visible: false,
	pos: vec(game.drawWidth - 10, 10),
	font: new Font({size: 24}),
});
game.add(scoreDisplay);

const spell1 = new ScreenElement({
	x: 80,
	y: game.drawHeight - 120,
	scale: vec(2, 2),
});
spell1.graphics.use(spellIcons.getSprite(3, 2));
game.add(spell1);
const spell2 = new ScreenElement({
	x: 120,
	y: game.drawHeight - 120,
	scale: vec(2, 2),
});
spell2.graphics.use(spellIcons.getSprite(4, 1));
game.add(spell2);

const button = new ScreenElement({
	x: 400,
	y: game.drawHeight - 80,
	width: 100,
	height: 40,
	color: Color.Vermilion,
});
button.on('pointerup', () => {
	blueWitch.graphics.use(witchAnims.charge);

	enemyAnims.attack.reset();
	enemy.graphics.use(enemyAnims.attack);
	enemy.actions.runAction(enemyAttack);

	scoreDisplay.text = String(score());
	scoreDisplay.pos.x = game.drawWidth - 10 - scoreDisplay.text.length * 15;
	scoreDisplay.graphics.visible = true;
});
game.add(button);

void game.start(loader);
