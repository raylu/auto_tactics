import {Actor, type ActorArgs, type Animation, Color, vec, Engine, Debug, Vector} from 'excalibur';

export class Unit extends Actor {
	freeze = 0;

	constructor(config: ActorArgs & {height: number}) {
		super(config);
		const healthBar = new Actor({
			width: 20,
			height: 5,
			color: Color.Chartreuse,
			pos: vec(0, -config.height / 2 - 6),
		});
		this.addChild(healthBar);
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
}
