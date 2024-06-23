import {Animation, DefaultLoader, ImageSource, SpriteSheet, range, type Loadable} from 'excalibur';

const resources: Loadable<any>[] = [];

function witchAnimation(name: string, rows: number, width: number) {
	const image = new ImageSource(`static/sprites/blue_witch/${name}.png`);
	resources.push(image);
	return Animation.fromSpriteSheet(SpriteSheet.fromImageSource({
		image,
		grid: {
			rows,
			columns: 1,
			spriteHeight: 48,
			spriteWidth: width,
		},
	}), range(0, rows - 1), 100);
}
export const witch = {
	idle: witchAnimation('idle', 6, 32),
	charge: witchAnimation('charge', 5, 48),
	takeDamage: witchAnimation('take_damage', 3, 32),
} as const;

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

const spellIconsImg = new ImageSource('static/sprites/spell_icons.gif');
export const spellIcons = SpriteSheet.fromImageSource({
	image: spellIconsImg,
	grid: {
		rows: 6,
		columns: 9,
		spriteHeight: 16,
		spriteWidth: 16,
	},
});

export const loader = new DefaultLoader();
loader.addResources([...resources, enemyImg, terrainGrassImg, spellIconsImg]);
