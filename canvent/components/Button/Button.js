import { DomListener } from '../DomListener/DomListener';
import { CanventText } from '../Text/Text';

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
		this.text = new CanventText(ctx, coords, settings.common);

		this.btnHandler = getMouseAreaPosition(coords, settings.common, this.reset);

		this.init();
	}

	create(mx, my, color) {
		this.coords.forEach(coord => {
			let { x, y, w, h, fill, r, stroke } = coord;
			let { 
				r: comR, 
				fill: comFill,
				w: comW,
				h: comH } = this.settings.common;
			let textColor = '';

			r = r ? r : comR;
			fill = fill ? fill : comFill;
			h = h ? h : comH;
			w = w ? w : comW;

			if (mx === x && my === y) {
				fill = color;
				textColor = this.settings.common.colorHover;
			}

			this.ctx.roundRect(x, y, w, h, fill, r, stroke);
			this.text.create(coord, textColor);
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
		const hoverColor = this.settings.common.hover || 'black';

		this.btnHandler(e, ({x, y}) => this.update(x, y, hoverColor));
	}

	clickHandler = (e) => {
		this.btnHandler(e, ({x, y}) => this.update(x, y, 'black'));
	}

	init() {
		this.initListeners();
	}
}

function getMouseAreaPosition(coords, common, reset) {
	return function(e, handler) {
		const x = e.clientX;
		const y = e.clientY;

		for (let coord of coords) {
			const cH = coord.h || common.h;
			const cW = coord.w || common.w;

			if (x >= coord.x && 
					x <= coord.x + cW &&
					y >= coord.y && 
					y <= coord.y + cH) {
				handler(coord);
				return;
			}
		}

		reset();
	}
}