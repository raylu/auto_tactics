import {Color, type Engine, type PointerEvent, range, ScreenElement, type Vector, vec} from 'excalibur';
import {blueWitchIconImg, spellIcons} from './sprites';

const tooltip = document.querySelector<HTMLElement>('tooltip')!;

interface SpellSlot {
	readonly slot: ScreenElement;
	spell: Spell | null;
}

class Spell {
	name: string;
	icon: ScreenElement;
	iconPos: Vector;
	spellSlot: SpellSlot | null = null;
	constructor(name: string, iconX: number, iconY: number) {
		this.name = name;

		const iconSprite = spellIcons.getSprite(iconX, iconY);
		this.icon = new ScreenElement({
			width: iconSprite.width / 2,
			height: iconSprite.height / 2,
			scale: vec(2, 2),
			anchor: vec(0.5, 0.5),
			z: 1,
		});
		this.icon.graphics.use(iconSprite);
		this.icon.on('pointerenter', () => {
			tooltip.innerText = name;
			tooltip.style.opacity = '0.9';
		});
		this.icon.on('pointerleave', () => {
			tooltip.style.opacity = '0';
		});
		this.icon.on('pointermove', (event: PointerEvent) => {
			tooltip.style.top = event.screenPos.y - 100 + 'px';
			tooltip.style.left = event.screenPos.x + 'px';
		});
		this.iconPos = vec(0, 0);
	}
	placeIcon(spellSlot: SpellSlot) {
		spellSlot.spell = this;
		if (this.spellSlot !== null)
			this.spellSlot.spell = null;
		this.spellSlot = spellSlot;
		this.iconPos = spellSlot.slot.pos.clone();
		this.icon.pos = spellSlot.slot.pos.clone();
	}
}

const spells = [
	new Spell('ice blast', 3, 2),
	new Spell('ice nova', 4, 1),
];

const spellSlots = {
	bar: [] as SpellSlot[],
	blueWitch: [] as SpellSlot[],
};

export function initSpells(game: Engine) {
	game.add(new ScreenElement({ // spell bar background
		color: Color.fromRGB(0, 0, 0),
		height: 40,
		width: 162,
		pos: vec(50, game.drawHeight - 150),
		anchor: vec(0, 0.5),
	}));
	spellSlots.bar = range(0, 3).map((i) => {
		const slot = new ScreenElement({
			color: Color.fromRGB(100, 100, 100),
			height: 34,
			width: 34,
			pos: vec(70 + i * 40, game.drawHeight - 150),
			anchor: vec(0.5, 0.5),
		});
		game.add(slot);
		return {slot, spell: null};
	});
	spells.forEach((spell, i) => {
		spellSlots.bar[i].spell = spell;
		spell.placeIcon(spellSlots.bar[i]);
		game.add(spell.icon);
	});

	const blueWitchIcon = new ScreenElement({
		pos: vec(40, game.drawHeight - 70),
		anchor: vec(0.5, 0.5),
	});
	blueWitchIcon.graphics.use(blueWitchIconImg.toSprite());
	game.add(blueWitchIcon);
	game.add(new ScreenElement({ // spell slots background
		color: Color.fromRGB(0, 10, 20),
		height: 60,
		width: 160,
		pos: vec(75, game.drawHeight - 70),
		anchor: vec(0, 0.5),
	}));
	spellSlots.blueWitch = range(0, 2).map((i) => {
		const slot = new ScreenElement({
			color: Color.fromRGB(10, 20, 30),
			height: 40,
			width: 40,
			pos: vec(105 + i * 50, game.drawHeight - 70),
			anchor: vec(0.5, 0.5),
		});
		game.add(slot);
		return {slot, spell: null};
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
		for (const slotGroup of Object.values(spellSlots)) {
			for (const spellSlot of slotGroup)
				if (spellSlot.spell === null && spellSlot.slot.contains(event.screenPos.x, event.screenPos.y)) {
					draggedSpell.placeIcon(spellSlot);
					break;
				}
		}
		draggedSpell.icon.actions.moveTo(draggedSpell.iconPos, 1000);
		draggedSpell = null;
	});
}
