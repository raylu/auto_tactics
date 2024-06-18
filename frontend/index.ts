import {score} from '../shared/score';
import {sounds} from './sounds';
import {JsfxrResource} from '@excaliburjs/plugin-jsfxr';
import {Color, Engine, ScreenElement} from 'excalibur';

const game = new Engine({
	canvasElement: document.querySelector('canvas#game') as HTMLCanvasElement,
	width: 600,
	height: 400,
});

const sndPlugin = new JsfxrResource();
void sndPlugin.init();
for (const sound in sounds)
	sndPlugin.loadSoundConfig(sound, sounds[sound]);

const button = new ScreenElement({
	x: game.drawWidth / 2,
	y: game.drawHeight - 80,
	width: 100,
	height: 40,
	color: Color.Vermilion,
});
button.on('pointerup', () => {
	sndPlugin.playSound('hit');
});
game.add(button);

void game.start();
