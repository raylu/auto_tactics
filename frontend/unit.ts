import {Actor, type ActorArgs, type Animation, Color, Debug, Engine, type ExcaliburGraphicsContext, type Rectangle,
	Vector, vec} from 'excalibur';

interface UnitConfig {
	maxHP: number;
	idleAnimation: Animation;
	deathAnimation: Animation;
}

export class Unit extends Actor {
	maxHP: number;
	health: number;
	healthBar: Actor;
	barMaxWidth: number;
	freeze = 0;
	idleAnimation: Animation;
	deathAnimation: Animation;

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

		this.idleAnimation = unitConfig.idleAnimation;
		this.deathAnimation = unitConfig.deathAnimation;
		this.graphics.use(unitConfig.idleAnimation);
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
		this.health = health;
		(this.healthBar.graphics.current as Rectangle).width = this.health / this.maxHP * this.barMaxWidth;
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
		this.graphics.use(this.idleAnimation);
	}

	die(): Promise<void> {
		this.unfreeze();
		this.deathAnimation.reset();
		this.graphics.use(this.deathAnimation);
		const {promise, resolve} = Promise.withResolvers<void>();
		this.deathAnimation.events.once('end', () => {
			resolve();
		});
		return promise;
	}
}
