import {Actor, type ActorArgs, type Animation, Color, Debug, Engine, type ExcaliburGraphicsContext, type Rectangle,
	Vector, vec} from 'excalibur';
import {SLOT_DEFAULT_COLOR, type SpellSlot} from './spells';
import type {UnitAnimations} from './sprites';

interface UnitConfig {
	maxHP: number | null;
	animations: UnitAnimations,
	spellSlots: SpellSlot[];
}

export class Unit extends Actor {
	readonly health: null | {
		readonly maxHP: number;
		readonly bar: Actor;
		readonly barMaxWidth: number;
	};
	damageTaken: number;
	freeze = 0;
	animations: UnitAnimations;
	spellSlots: SpellSlot[];

	constructor(config: ActorArgs & {width: number, height: number}, unitConfig: UnitConfig) {
		super(config);

		if (unitConfig.maxHP === null)
			this.health = null;
		else {
			const barMaxWidth = unitConfig.maxHP * 0.8;
			this.health = {
				maxHP: unitConfig.maxHP,
				barMaxWidth,
				bar: new Actor({
					width: barMaxWidth,
					height: 5,
					color: Color.Chartreuse,
					pos: vec(-barMaxWidth / 2 + 1, -config.height / 2 - 6),
					anchor: vec(0, 1),
				}),
			};
			this.health.bar.graphics.onPostDraw = (gfx: ExcaliburGraphicsContext) => {
				gfx.drawRectangle(vec(0, -6), barMaxWidth, 7, Color.Transparent, Color.fromRGB(100, 200, 100), 1);
			};
			this.addChild(this.health.bar);
		}
		this.damageTaken = 0;

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

	takeDamage(damage: number) {
		this.damageTaken += damage;
		if (this.health !== null) {
			const hp = Math.max(this.health.maxHP - this.damageTaken, 0);
			(this.health.bar.graphics.current as Rectangle).width = hp / this.health.maxHP * this.health.barMaxWidth;
		}
	}

	isDead() {
		return this.health !== null && this.damageTaken >= this.health.maxHP;
	}

	async resolveTurn(game: Engine, target: Unit, allUnits: Unit[]): Promise<number> {
		if (this.isDead() || this.resolveFreeze())
			return 0;
		let casted = false;
		let damageDealt = 0;
		for (const {spell, slot} of this.spellSlots) {
			if (spell === null)
				continue;
			if (!casted && (spell.cooldown?.remaining ?? 0) == 0) {
				slot.color = Color.Viridian;
				damageDealt = await spell.cast(game, this, target, allUnits);
				slot.color = SLOT_DEFAULT_COLOR;
				casted = true;
			} else
				spell.decrementCooldown();
		}
		return damageDealt;
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
		this.damageTaken = 0;
		this.takeDamage(0);
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
