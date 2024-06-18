import {score} from '../shared/score';
import {Actor, Color, Engine} from 'excalibur';

const game = new Engine({
	canvasElement: document.querySelector('canvas#game') as HTMLCanvasElement,
	width: 600,
	height: 400,
});
const paddle = new Actor({
	x: 150,
	y: game.drawHeight - 40,
	width: 200,
	height: 20,
	color: Color.Chartreuse,
});
game.add(paddle);

void game.start();
