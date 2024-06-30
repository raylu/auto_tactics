import {type Engine, type PointerEvent, ScreenElement, vec, type Vector} from 'excalibur';
import {spellIcons} from './sprites';

const tooltip = document.querySelector<HTMLElement>('tooltip')!;

class Spell {
	name: string;
	icon: ScreenElement;
	iconPos: Vector;
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
		this.icon.on('pointermove', (event: PointerEvent) => {
			tooltip.style.top = event.pagePos.y - 100 + 'px';
			tooltip.style.left = event.pagePos.x + 'px';
		});
		this.iconPos = vec(0, 0);
	}
	placeIcon(x: number, y: number) {
		this.iconPos = vec(x, y);
		this.icon.pos = this.iconPos.clone();
	}
}

const spells = [
	new Spell('ice blast', 3, 2),
	new Spell('ice nova', 4, 1),
];

export function initSpells(game: Engine) {
	spells.forEach((spell, i) => {
		spell.placeIcon(80 + i * 40, game.drawHeight - 120);
		game.add(spell.icon);
	});

	let draggedSpell: Spell | null = null;
	game.input.pointers.primary.on('down', (event: PointerEvent) => {
		if (draggedSpell !== null)
			return;
		for (const spell of spells)
			if (spell.icon.contains(event.screenPos.x, event.screenPos.y)) {
				draggedSpell = spell;
				break;
			}
	});
	game.input.pointers.primary.on('move', (event: PointerEvent) => {
		if (draggedSpell === null)
			return;
		draggedSpell.icon.pos = event.screenPos;
	});
	game.input.pointers.primary.on('up', (event: PointerEvent) => {
		if (draggedSpell === null)
			return;
		draggedSpell.icon.actions.moveTo(draggedSpell.iconPos, 1000);
		draggedSpell = null;
	});
}
