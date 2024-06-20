import {Animation, DefaultLoader, ImageSource, SpriteSheet, range} from 'excalibur';

const blueWitchIdleImg = new ImageSource('static/sprites/blue_witch/idle.png');
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

const terrainGrassImg = new ImageSource('static/sprites/terrain/tileset_grass.png');
export const terrainGrass = SpriteSheet.fromImageSource({
	image: terrainGrassImg,
	grid: {
		rows: 4,
		columns: 4,
		spriteHeight: 64,
		spriteWidth: 64,
	},
});

export const loader = new DefaultLoader();
loader.addResources([blueWitchIdleImg, enemyImg, terrainGrassImg]);
