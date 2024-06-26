import {Actor, Color, type Engine, type PointerEvent, range, ScreenElement, type Vector, vec} from 'excalibur';
import {blueWitchIconImg, iceBlastAnims, iceNovaAnims, spellIcons, witchAnims} from './sprites';
import {iceSound, sndPlugin} from './sounds';

const tooltip = document.querySelector<HTMLElement>('tooltip')!;

interface SpellSlot {
	readonly slot: ScreenElement;
	spell: Spell | null;
}
type CastFn = (game: Engine, caster: Actor, target: Actor) => void;

class Spell {
	name: string;
	icon: ScreenElement;
	iconPos: Vector;
	spellSlot: SpellSlot | null = null;
	castFn: CastFn;
	constructor(name: string, iconX: number, iconY: number, castFn: CastFn) {
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

		this.castFn = castFn;
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

function iceBlast(game: Engine, caster: Actor, target: Actor) {
	caster.graphics.use(witchAnims.charge);
	const iceBlastProj = new Actor({
		pos: caster.pos,
	});
	iceBlastAnims.startup.reset();
	iceBlastProj.graphics.use(iceBlastAnims.startup);
	iceBlastAnims.startup.events.once('end', () => {
		iceBlastProj.graphics.use(iceBlastAnims.projectile);
		caster.graphics.use(witchAnims.idle);
		iceBlastProj.actions.meet(target, 800);
	});
	game.add(iceBlastProj);
	iceBlastProj.events.on('actioncomplete', () => {
		iceBlastAnims.impact.reset();
		iceBlastProj.graphics.use(iceBlastAnims.impact);
		sndPlugin.playSound('spell');
		iceSound.volume = 0.1;
	});
	iceBlastAnims.impact.events.once('end', () => {
		iceBlastProj.kill();
	});
	void iceSound.play(0.5);
}

function iceNova(game: Engine, caster: Actor, target: Actor) {
	caster.graphics.use(witchAnims.charge);
	const iceNovaVortex = new Actor({
		pos: target.pos,
	});
	iceNovaAnims.startup.reset();
	iceNovaVortex.graphics.use(iceNovaAnims.startup);
	iceNovaAnims.startup.events.once('end', () => {
		iceNovaAnims.nova.reset();
		iceNovaVortex.graphics.use(iceNovaAnims.nova);
		caster.graphics.use(witchAnims.idle);
	});
	iceNovaAnims.nova.events.once('end', () => {
		iceNovaAnims.end.reset();
		iceNovaVortex.graphics.use(iceNovaAnims.end);
		sndPlugin.playSound('spellBig');
		iceSound.volume = 0.1;
	});
	iceNovaAnims.end.events.once('end', () => {
		iceNovaVortex.kill();
	});
	game.add(iceNovaVortex);
	void iceSound.play(0.5);
}

const spells = [
	new Spell('ice blast', 3, 2, iceBlast),
	new Spell('ice nova', 4, 1, iceNova),
];

export const spellSlots = {
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
			color: Color.fromRGB(92, 97, 128),
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
