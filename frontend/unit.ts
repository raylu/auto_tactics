import {Actor} from 'excalibur';

export class Unit extends Actor {
	freeze = 0;

	resolveFreeze(): boolean {
		if (this.freeze >= 100) {
			this.freeze -= 100;
			return true;
		}
		return false;
	}
}
