import { roundRect } from './components/tools/extensions';

import { CanventButton } from './components/Button/Button';

export class Canvent {
	constructor(canvas, ctx) {
		this.canvas = canvas;
		this.ctx = ctx;
	}

	createBtns(coords = [], settings) {
		settings = {
			...settings, 
			canvas: this.canvas,
			actions: toEvents(settings.actions)
		};
		const btns = new CanventButton(this.ctx, coords, settings);
		btns.create();
	}
}

function toEvents(actions) {
	return actions.map(actionNameToEvent)
}

function actionNameToEvent(name) {
	switch(name.toLowerCase()) {
		case 'hover':
			return 'mousemove';
		case 'click':
			return 'click';

		default: return null;
	}
}


CanvasRenderingContext2D.prototype.roundRect = roundRect;