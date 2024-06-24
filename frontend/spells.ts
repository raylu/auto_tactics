import {type PointerEvent, ScreenElement, vec} from 'excalibur';
import {spellIcons} from './sprites';

const tooltip = document.querySelector<HTMLElement>('tooltip')!;

class Spell {
	name: string;
	icon: ScreenElement;
	constructor(name: string, iconX: number, iconY: number) {
		this.name = name;

		this.icon = new ScreenElement({scale: vec(2, 2)});
		this.icon.graphics.use(spellIcons.getSprite(iconX, iconY));
		this.icon.pointer.useGraphicsBounds = true;
		this.icon.on('pointerenter', () => {
			tooltip.innerText = name;
			tooltip.style.opacity = '0.9';
		});
		this.icon.on('pointerleave', () => {
			tooltip.style.opacity = '0';
		});
		this.icon.on('pointermove', (event: PointerEvent) => {
			tooltip.style.top = event.pagePos.y - 100 + 'px';
			tooltip.style.left = event.pagePos.x + 'px';
		});
	}
	placeIcon(x: number, y: number) {
		this.icon.pos = vec(x, y);
	}
}

export const spells = [
	new Spell('ice blast', 3, 2),
	new Spell('ice nova', 4, 1),
];
