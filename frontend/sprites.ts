import {Animation, ImageSource, SpriteSheet, range} from 'excalibur';

const blueWitchIdleImg = new ImageSource('static/sprites/blue_witch/idle.png');
void blueWitchIdleImg.load();
export const blueWitchIdle = Animation.fromSpriteSheet(SpriteSheet.fromImageSource({
	image: blueWitchIdleImg,
	grid: {
		rows: 6,
		columns: 1,
		spriteHeight: 48,
		spriteWidth: 32,
	},
}), range(0, 5), 100);

const enemyImg = new ImageSource('static/sprites/enemy.png');
void enemyImg.load();
const enemySprites = SpriteSheet.fromImageSource({
	image: enemyImg,
	grid: {
		rows: 17,
		columns: 6,
		spriteHeight: 44,
		spriteWidth: 69,
	},
});
export const enemyIdle = Animation.fromSpriteSheet(enemySprites, range(0, 5), 100);
