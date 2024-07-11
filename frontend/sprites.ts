import {Animation, AnimationStrategy, ImageSource, type Loadable, SpriteSheet, range} from 'excalibur';

import {loader} from './loader';

export interface UnitAnimations {
	readonly idle: Animation,
	readonly charge: Animation,
	readonly takeDamage: Animation,
	readonly death: Animation,
}

const resources: Loadable<any>[] = [];

function witchAnimation(name: string, rows: number, width: number, height: number, start = 0, strategy?: AnimationStrategy) {
	const image = new ImageSource(`static/sprites/${name}.png`);
	resources.push(image);
	return Animation.fromSpriteSheet(SpriteSheet.fromImageSource({
		image,
		grid: {
			rows,
			columns: 1,
			spriteHeight: height,
			spriteWidth: width,
		},
	}), range(start, rows - 1), 100, strategy);
}
export const blueWitchAnims: UnitAnimations = {
	idle: witchAnimation('blue_witch/idle', 6, 32, 48),
	charge: witchAnimation('blue_witch/charge', 5, 48, 48),
	takeDamage: witchAnimation('blue_witch/take_damage', 3, 32, 48, 0, AnimationStrategy.Freeze),
	death: witchAnimation('blue_witch/death', 12, 32, 48, 0, AnimationStrategy.Freeze),
} as const;
export const blueWitchIconImg = new ImageSource('static/sprites/blue_witch/icon.gif');
export const redWitchAnims: UnitAnimations = {
	idle: witchAnimation('red_witch/idle', 6, 32, 64),
	charge: witchAnimation('red_witch/charge', 10, 40, 65, 2),
	takeDamage: witchAnimation('red_witch/take_damage', 3, 32, 64, 0, AnimationStrategy.Freeze),
	death: witchAnimation('red_witch/death', 14, 56, 64, 0, AnimationStrategy.Freeze),
} as const;
export const redWitchIconImg = new ImageSource('static/sprites/red_witch/icon.gif');

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
	death: Animation.fromSpriteSheet(enemySprites, range(26, 36), 150, AnimationStrategy.Freeze),
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

const fireballImg = new ImageSource('static/sprites/fireball.png');
const fireball = SpriteSheet.fromImageSource({
	image: fireballImg,
	grid: {
		rows: 1,
		columns: 11,
		spriteHeight: 48,
		spriteWidth: 48,
	},
});
export const fireballAnims = {
	projectile: Animation.fromSpriteSheet(fireball, range(0, 3), 100),
	impact: Animation.fromSpriteSheet(fireball, range(5, 10), 150, AnimationStrategy.Freeze),
} as const;

loader.addResources([...resources, blueWitchIconImg, redWitchIconImg, enemyImg, terrainGrassImg, spellIconsImg,
	iceBlastProjectileImg, iceBlastImpactImg, iceNovaVortexImg, iceNovaEndImg, fireballImg]);
