import { DomListener } from '../DomListener/DomListener';

import { changeCursor } from '../tools/utils';

export class CanventButton extends DomListener {
	constructor(ctx, coords, settings) {
		super({
			listeners: settings.actions,
			target: settings.canvas
		});

		this.ctx = ctx;
		this.coords = coords;
		this.settings = settings;

		this.domlist = null;
		this.btnHandler = getMouseAreaPosition(this.coords, this.reset);

		this.init();
	}

	create(mx, my, color) {
		this.coords.forEach(coord => {
			let { x, y, w, h, fill, r, stroke } = coord;
			let { 
				r: comR, 
				fill: comFill,
				x: comX,
				y: comY,
				w: comW,
				h: comH } = this.settings.common;

			r = r ? r : comR;
			fill = fill ? fill : comFill;
			h = h ? h : comH;
			w = w ? w : comW;
			x = x ? x : comX;
			y = y ? y : comY;
			
			if (mx === x && my === y) {
				fill = color;
			}

			this.ctx.roundRect(x, y, w, h, fill, r, stroke);
		});
	}

	update(mx, my, fill) {
		changeCursor('pointer');
		this.create(mx, my, fill);
	}

	reset = () => {
		changeCursor('default');
		this.create();
	}

	mousemoveHandler = (e) => {
		this.btnHandler(e, ({x, y}) => this.update(x, y, 'yellow'));
	}

	clickHandler = (e) => {
		this.btnHandler(e, ({x, y}) => this.update(x, y, 'black'));
	}

	init() {
		this.initListeners();
	}
}

function getMouseAreaPosition(coords, reset) {
	return function(e, handler) {
		const x = e.clientX;
		const y = e.clientY;

		for (let coord of coords) {
			if (x >= coord.x && x <= coord.x + coord.w &&
					y >= coord.y && y <= coord.y + coord.h) {
				handler(coord);
				return;
			}
		}

		reset();
	}
}