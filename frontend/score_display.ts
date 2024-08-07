import {type Action, Color, EaseTo, EasingFunctions, type Engine, Fade, Font, Label, ParallelActions, TextAlign,
	type Vector, coroutine, vec} from 'excalibur';

export class ScoreDisplay {
	readonly game: Engine;
	total: number;
	readonly totalDisplay: Label;
	readonly totalStart: Vector;
	readonly incremental: Label;
	readonly incrementalStart: Vector;
	readonly consolidateIncremental: Action;

	constructor(game: Engine) {
		this.game = game;

		this.total = 0;
		this.totalStart = vec(game.drawWidth - 12, 10);
		this.totalDisplay = new Label({
			pos: this.totalStart.clone(),
			font: new Font({family: 'Metrophobic', size: 36, textAlign: TextAlign.Right,
				color: Color.fromRGB(255, 96, 128), shadow: {offset: vec(1, 1), color: Color.Black}}),
		});
		game.add(this.totalDisplay);

		this.incrementalStart = vec(game.drawWidth / 2, 16);
		this.incremental = new Label({
			pos: this.incrementalStart.clone(),
			font: new Font({family: 'Metrophobic', size: 24, textAlign: TextAlign.Center,
				shadow: {offset: vec(1, 1), color: Color.Gray}}),
		});
		game.add(this.incremental);
		this.consolidateIncremental = new ParallelActions([
			new EaseTo(this.incremental, this.totalDisplay.pos.x, this.incrementalStart.y, 500, EasingFunctions.EaseInQuad),
			new Fade(this.incremental, 0, 500),
		]);
	}

	add(score: number) {
		this.total += score;

		this.incremental.actions.clearActions();
		this.incremental.pos = this.incrementalStart.clone();
		this.incremental.graphics.opacity = 1;
		this.incremental.text = String(score);
		this.incremental.actions.delay(250).runAction(this.consolidateIncremental);

		const total = this.total;
		const totalDisplay = this.totalDisplay;
		void coroutine(this.game, function *() {
			yield 250;
			let displayed = totalDisplay.text === '' ? 0 : Number.parseInt(totalDisplay.text);
			while (displayed < total) {
				totalDisplay.text = String(++displayed);
				yield 20;
			}
		});
	}

	center() {
		const width = this.totalDisplay.font.measureText(this.totalDisplay.text).width;
		this.totalDisplay.actions.easeTo(vec(this.game.drawWidth / 2 + width / 2, 250), 1000, EasingFunctions.EaseOutQuad);
	}

	clear() {
		this.total = 0;
		this.totalDisplay.text = '';
		this.totalDisplay.pos = this.totalStart.clone();
	}
}
