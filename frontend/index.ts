import {score} from '../shared/score';
import {sounds} from './sounds';
import {JsfxrResource} from '@excaliburjs/plugin-jsfxr';
import {Actor, Color, Engine, Font, Label, Random, ScreenElement, vec} from 'excalibur';
import {blueWitchIdle, enemyIdle, terrainGrass} from './sprites';

const game = new Engine({
	canvasElement: document.querySelector('canvas#game') as HTMLCanvasElement,
	width: 600,
	height: 400,
	backgroundColor: Color.fromHSL(0.15, 0.50, 0.20),
	pixelArt: true,
	suppressConsoleBootMessage: true,
});

const sndPlugin = new JsfxrResource();
void sndPlugin.init();
for (const sound in sounds)
	sndPlugin.loadSoundConfig(sound, sounds[sound]);

const referenceGrassSprite = terrainGrass.getSprite(0, 0);
const random = new Random();
for (let x = 0; x < game.drawWidth / referenceGrassSprite.width; x++) {
	for (let y = 0; y < game.drawHeight / referenceGrassSprite.height; y++) {
		const background = new Actor({pos: vec(referenceGrassSprite.width * x, referenceGrassSprite.height * y)});
		background.graphics.use(terrainGrass.getSprite(random.integer(0, 3), random.integer(0, 1)));
		game.add(background);
	}
}

const blueWitch = new Actor({
	pos: vec(100, 150),
});
blueWitch.graphics.use(blueWitchIdle);
game.add(blueWitch);

const enemy = new Actor({
	pos: vec(450, 150),
	scale: vec(2, 2),
});
enemy.graphics.use(enemyIdle);
enemy.graphics.flipHorizontal = true;
game.add(enemy);

const scoreDisplay = new Label({
	visible: false,
	pos: vec(game.drawWidth - 15, 10),
	font: new Font({size: 24}),
});
game.add(scoreDisplay);

const button = new ScreenElement({
	x: game.drawWidth / 2,
	y: game.drawHeight - 80,
	width: 100,
	height: 40,
	color: Color.Vermilion,
});
button.on('pointerup', () => {
	sndPlugin.playSound('hit');
	scoreDisplay.text = String(score());
	scoreDisplay.pos.x = game.drawWidth - 15 * scoreDisplay.text.length;
	scoreDisplay.graphics.visible = true;
});
game.add(button);

void game.start();
