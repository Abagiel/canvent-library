export class CanventText {
	constructor(ctx, coords, common) {
		this.ctx = ctx;

		this.coords = coords;
		this.common = common;
	}

	create(coord, color) {
			let { x, y } = setTextPosition(this.ctx, coord, this.common);
			let textColor = color || coord.color || this.common.color;

			this.ctx.fillStyle = textColor;
			this.ctx.font = `${coord.fontSize || this.common.fontSize} ${coord.fontStyle || this.common.fontStyle}`;
			this.ctx.fillText(coord.text, x, y);
	}
}

function setTextPosition(ctx, coord, common) {
	const align = coord.align || common.align;
	const w = coord.w || common.w;
	const h = coord.h || common.h;

	switch(align) {
		case 'end':
			ctx.textAlign = 'end';
			ctx.textBaseline = 'bottom';
			return {x: coord.x + w, y: coord.y + h};

		case 'center': 
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			return {x: coord.x + w / 2, y: coord.y + h / 2};

		case 'start center':
			ctx.textAlign = 'start';
			ctx.textBaseline = 'middle';
			return {x: coord.x, y: coord.y + h / 2};

		case 'start end':
			ctx.textAlign = 'start';
			ctx.textBaseline = 'bottom';
			return {x: coord.x, y: coord.y + h};

		case 'center start':
			ctx.textAlign = 'center';
			ctx.textBaseline = 'top';
			return {x: coord.x + w / 2, y: coord.y};

		case 'center end':
			ctx.textAlign = 'center';
			ctx.textBaseline = 'bottom';
			return {x: coord.x + w / 2, y: coord.y + h};

		case 'end start':
			ctx.textAlign = 'end';
			ctx.textBaseline = 'top';
			return {x: coord.x + w, y: coord.y};

		case 'end center':
			ctx.textAlign = 'end';
			ctx.textBaseline = 'middle';
			return {x: coord.x + w, y: coord.y + h / 2};

		default: 
			ctx.textAlign = 'start';
			ctx.textBaseline = 'top';
			return {x: coord.x, y: coord.y};
	}
}