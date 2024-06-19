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
