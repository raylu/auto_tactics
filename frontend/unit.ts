import {Actor, type ActorArgs, type Animation, Color, vec, Engine, Debug, Vector, type Rectangle} from 'excalibur';

export class Unit extends Actor {
	maxHP: number;
	health: number;
	healthBar: Actor;
	freeze = 0;

	constructor(config: ActorArgs & {height: number}, maxHP: number) {
		super(config);

		this.maxHP = this.health = maxHP;
		this.healthBar = new Actor({
			width: 20,
			height: 5,
			color: Color.Chartreuse,
			pos: vec(0, -config.height / 2 - 6),
		});
		this.addChild(this.healthBar);
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
		(this.healthBar.graphics.current as Rectangle).width = this.health / this.maxHP * 20;
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
		this.unfreeze();
	}
}
