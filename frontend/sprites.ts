import {Animation, AnimationStrategy, DefaultLoader, ImageSource, SpriteSheet, range, type Loadable} from 'excalibur';

const resources: Loadable<any>[] = [];

function witchAnimation(name: string, rows: number, width: number, strategy?: AnimationStrategy) {
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
	}), range(0, rows - 1), 100, strategy);
}
export const witchAnims = {
	idle: witchAnimation('idle', 6, 32),
	charge: witchAnimation('charge', 5, 48),
	takeDamage: witchAnimation('take_damage', 3, 32, AnimationStrategy.Freeze),
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
export const enemyAnims = {
	idle: Animation.fromSpriteSheet(enemySprites, range(0, 5), 100),
	attack: Animation.fromSpriteSheet(enemySprites, range(6, 25), 50, AnimationStrategy.Freeze),
} as const;

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

const iceBlastProjectileImg = new ImageSource('static/sprites/ice_blast/projectile.png');
const iceBlastProjectile = SpriteSheet.fromImageSource({
	image: iceBlastProjectileImg,
	grid: {
		rows: 6,
		columns: 5,
		spriteHeight: 64,
		spriteWidth: 64,
	},
});
export const iceBlastAnims = {
	startup: Animation.fromSpriteSheet(iceBlastProjectile, range(0, 3), 100, AnimationStrategy.Freeze),
	projectile: Animation.fromSpriteSheet(iceBlastProjectile, range(4, 20), 100),
} as const;

export const loader = new DefaultLoader();
loader.addResources([...resources, enemyImg, terrainGrassImg, spellIconsImg, iceBlastProjectileImg]);
