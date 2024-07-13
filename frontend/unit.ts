import {Actor, type ActorArgs, type Animation, Color, Debug, Engine, type ExcaliburGraphicsContext, type Rectangle,
	Vector, vec} from 'excalibur';
import {SLOT_DEFAULT_COLOR, type SpellSlot} from './spells';
import type {UnitAnimations} from './sprites';

interface UnitConfig {
	maxHP: number;
	animations: UnitAnimations,
	spellSlots: SpellSlot[];
}

export class Unit extends Actor {
	maxHP: number;
	health: number;
	healthBar: Actor;
	barMaxWidth: number;
	freeze = 0;
	animations: UnitAnimations;
	spellSlots: SpellSlot[];

	constructor(config: ActorArgs & {width: number, height: number}, unitConfig: UnitConfig) {
		super(config);

		this.maxHP = this.health = unitConfig.maxHP;
		this.barMaxWidth = config.width - 1;
		this.healthBar = new Actor({
			width: this.barMaxWidth,
			height: 5,
			color: Color.Chartreuse,
			pos: vec(-config.width / 2 + 1, -config.height / 2 - 6),
			anchor: vec(0, 1),
		});
		this.healthBar.graphics.onPostDraw = (gfx: ExcaliburGraphicsContext) => {
			gfx.drawRectangle(vec(0, -6), config.width, 7, Color.Transparent, Color.fromRGB(100, 200, 100), 1);
		};
		this.addChild(this.healthBar);

		this.animations = unitConfig.animations;
		this.graphics.use(unitConfig.animations.idle);

		this.spellSlots = unitConfig.spellSlots;
	}

	onPostUpdate(engine: Engine<any>, delta: number): void {
		Debug.drawLine(
			this.pos,
			this.pos.add(Vector.Down.scale(75)), {
			color: Color.Red,
		});
		Debug.drawPoint(this.pos, {
			size: 4,
			color: Color.Violet,
		});
		Debug.drawCircle(this.pos, 75, {
			color: Color.Transparent,
			strokeColor: Color.Black,
			width: 1,
		});
		Debug.drawBounds(this.collider.bounds, {color: Color.Yellow});
	}

	setHealth(health: number) {
		this.health = Math.max(health, 0);
		(this.healthBar.graphics.current as Rectangle).width = this.health / this.maxHP * this.barMaxWidth;
	}

	async resolveTurn(game: Engine, target: Unit, allUnits: Unit[]) {
		if (this.health === 0 || this.resolveFreeze())
			return;
		let casted = false;
		for (const {spell, slot} of this.spellSlots) {
			if (spell === null)
				continue;
			if (!casted && (spell.cooldown?.remaining ?? 0) == 0) {
				slot.color = Color.Viridian;
				await spell.cast(game, this, target, allUnits);
				slot.color = SLOT_DEFAULT_COLOR;
				casted = true;
			} else
				spell.decrementCooldown();
		}
	}

	resolveFreeze(): boolean {
		const animation = this.graphics.current as Animation;
		if (this.freeze >= 100) {
			animation.tint = Color.ExcaliburBlue;
			animation.pause();
			this.freeze -= 100;
			return true;
		} else {
			this.unfreeze();
			return false;
		}
	}

	unfreeze() {
		const animation = this.graphics.current as Animation;
		// @ts-expect-error
		animation.tint = null;
		animation.play();
	}

	reset() {
		this.setHealth(this.maxHP);
		this.freeze = 0;
		this.unfreeze();
		this.graphics.use(this.animations.idle);
	}

	die(): Promise<void> {
		this.unfreeze();
		this.animations.death.reset();
		this.graphics.use(this.animations.death);
		const {promise, resolve} = Promise.withResolvers<void>();
		this.animations.death.events.once('end', () => {
			resolve();
		});
		return promise;
	}
}
