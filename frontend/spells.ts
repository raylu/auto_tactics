import {type PointerEvent, ScreenElement, vec, type Vector} from 'excalibur';
import {spellIcons} from './sprites';

const tooltip = document.querySelector<HTMLElement>('tooltip')!;

class Spell {
	name: string;
	icon: ScreenElement;
	iconPos: Vector;
	dragging: boolean = false;
	constructor(name: string, iconX: number, iconY: number) {
		this.name = name;

		const iconSprite = spellIcons.getSprite(iconX, iconY);
		this.icon = new ScreenElement({
			width: iconSprite.width,
			height: iconSprite.height,
			scale: vec(2, 2),
			anchor: vec(0.5, 0.5),
		});
		this.icon.graphics.use(iconSprite);
		this.icon.pointer.useGraphicsBounds = true;
		this.icon.on('pointerenter', () => {
			tooltip.innerText = name;
			tooltip.style.opacity = '0.9';
		});
		this.icon.on('pointerleave', () => {
			tooltip.style.opacity = '0';
		});
		this.icon.on('pointerdragstart', () => {
			this.dragging = true;
		});
		this.icon.on('pointerdragend', () => {
			this.dragging = false;
			this.icon.actions.moveTo(this.iconPos, 1000);
		});
		this.icon.on('pointermove', (event: PointerEvent) => {
			tooltip.style.top = event.pagePos.y - 100 + 'px';
			tooltip.style.left = event.pagePos.x + 'px';
			if (this.dragging)
				this.icon.pos = event.screenPos;
		});
		this.iconPos = vec(0, 0);
	}
	placeIcon(x: number, y: number) {
		this.iconPos = vec(x, y);
		this.icon.pos = this.iconPos.clone();
	}
}

export const spells = [
	new Spell('ice blast', 3, 2),
	new Spell('ice nova', 4, 1),
];
