import {Animation, AnimationStrategy, ImageSource, type Loadable, SpriteSheet, range} from 'excalibur';
import {loader} from './loader';

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
export const blueWitchIconImg = new ImageSource('static/sprites/blue_witch/icon.gif');

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
const iceBlastImpactImg = new ImageSource('static/sprites/ice_blast/impact.png');
const iceBlastImpact = SpriteSheet.fromImageSource({
	image: iceBlastImpactImg,
	grid: {
		rows: 4,
		columns: 4,
		spriteHeight: 64,
		spriteWidth: 64,
	},
});
export const iceBlastAnims = {
	startup: Animation.fromSpriteSheet(iceBlastProjectile, range(0, 3), 200, AnimationStrategy.Freeze),
	projectile: Animation.fromSpriteSheet(iceBlastProjectile, range(4, 20), 100),
	impact: Animation.fromSpriteSheet(iceBlastImpact, range(0, 14), 50, AnimationStrategy.Freeze),
} as const;

const iceNovaVortexImg = new ImageSource('static/sprites/ice_nova/vortex.png');
const iceNovaVortex = SpriteSheet.fromImageSource({
	image: iceNovaVortexImg,
	grid: {
		rows: 3,
		columns: 4,
		spriteHeight: 128,
		spriteWidth: 128,
	},
});
const iceNovaEndImg = new ImageSource('static/sprites/ice_nova/end.png');
const iceNovaEnd = SpriteSheet.fromImageSource({
	image: iceNovaEndImg,
	grid: {
		rows: 3,
		columns: 3,
		spriteHeight: 128,
		spriteWidth: 128,
	},
});
export const iceNovaAnims = {
	startup: Animation.fromSpriteSheet(iceNovaVortex, range(0, 2), 250, AnimationStrategy.Freeze),
	nova: Animation.fromSpriteSheet(iceNovaVortex, range(3, 11), 50, AnimationStrategy.Freeze),
	end: Animation.fromSpriteSheet(iceNovaEnd, range(0, 7), 50, AnimationStrategy.Freeze),
} as const;

loader.addResources([...resources, blueWitchIconImg, enemyImg, terrainGrassImg, spellIconsImg, iceBlastProjectileImg,
	iceBlastImpactImg, iceNovaVortexImg, iceNovaEndImg]);
