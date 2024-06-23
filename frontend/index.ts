import {score} from '../shared/score';
import {sounds} from './sounds';
import {JsfxrResource} from '@excaliburjs/plugin-jsfxr';
import {Actor, Color, Engine, Font, Label, Random, ScreenElement, TileMap, vec} from 'excalibur';
import {witch, enemyIdle, loader, spellIcons, terrainGrass} from './sprites';

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
blueWitch.graphics.use(witch.idle);
game.add(blueWitch);

const enemy = new Actor({
	pos: vec(500, 150),
	scale: vec(2, 2),
});
enemy.graphics.use(enemyIdle);
enemy.graphics.flipHorizontal = true;
game.add(enemy);

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
	blueWitch.graphics.use(witch.charge);
	sndPlugin.playSound('hit');
	scoreDisplay.text = String(score());
	scoreDisplay.pos.x = game.drawWidth - 10 - scoreDisplay.text.length * 15;
	scoreDisplay.graphics.visible = true;
});
game.add(button);

void game.start(loader);
