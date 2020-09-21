import { DomListener } from '../DomListener/DomListener';
import { CanventText } from '../Text/Text';

import { capitalize } from '../tools/utils';

export class CanventChart {
	constructor(ctx, data, settings) {	
		this.ctx = ctx;
		this.data = data;
		this.settings = settings;

		this.wholeArc = 0;
		this.startPoint = 0;
		this.endPoint = null;

		this.calcValues();
	}

	create() {
		const type = capitalize(this.settings.type);
		this.data.forEach(this[`create${type}Chart`])
	}

	createPieChart = (data, i) => {
		const { fill, strokeColor, value } = data;
		const { x, y, r, h, w, line, board } = this.settings;
		const color = strokeColor || this.settings.strokeColor || '#000';
		this.endPoint += Math.PI * 2 / this.wholeArc * value;

		this.ctx.beginPath();
		this.ctx.fillStyle = fill || this.settings.fill;
		this.ctx.moveTo(x + w / 2, y + h / 2);
		this.ctx.arc(x + w / 2, y + h / 2, r, this.startPoint, this.endPoint);
		this.ctx.lineTo(x + w / 2, y + h / 2);
		this.ctx.fill()
		if (this.settings.stroke) {
			stroke(this.ctx, color, line);
		}
		this.ctx.closePath();

		this.startPoint = this.endPoint;

		if (i === this.data.length - 1) {
			composite(this.ctx, 'destination-atop');
			fillRect(this.ctx, x, y, w, h, this.settings.fill);
		}

	}

	calcValues() {
		this.data.forEach(({value}) => {
			this.wholeArc += value;
		})
	}

	createDoughnutChart = (data, i) => {
		const { x, y, w, h, holeSize, holeFill } = this.settings;

		this.createPieChart(data, i);
		this.ctx.beginPath();
		composite(this.ctx, 'source-over');
		this.ctx.fillStyle = holeFill;
		this.ctx.arc(x + w / 2, y + h / 2, holeSize, 0, 2 * Math.PI);
		this.ctx.fill();
		if (this.settings.stroke) {
			this.ctx.stroke();
		}
		this.ctx.closePath()
	}

	createVerticalChart = (data, i) => {
		const { fill, strokeColor, value } = data;
		const { x, y, h, w, gap = 0, line = 2 } = this.settings;
		const color = fill || this.settings.fill;
		const length = this.data.length;
		const rectH = h / this.wholeArc * value;
		const rectW = (w - line - gap * (length - 1)) / length;
		const rectX = x + (rectW * i + gap * i) + line / 2;
		const rectY = y + h - rectH - line / 2;

		this.ctx.beginPath();
		this.ctx.rect(x, y, w, h);
		stroke(this.ctx, this.settings.strokeColor, line);
		this.ctx.closePath();

		this.ctx.beginPath();
		fillRect(this.ctx, rectX, rectY, rectW, rectH, color);

		if (this.settings.stroke) {
			stroke(this.ctx, strokeColor, line);
		}
		this.ctx.closePath();
	}

	createHorizontalChart = (data, i) => {
		const { fill, strokeColor, value } = data;
		const { x, y, h, w, gap = 0, line = 2 } = this.settings;
		const color = fill || this.settings.fill;
		const length = this.data.length;
		const rectW = w / this.wholeArc * value;
		const rectH = (h - line - gap * (length - 1)) / length;
		const rectY = y + (rectH * i + gap * i) + line / 2;
		const rectX = x + line / 2;

		this.ctx.beginPath();
		this.ctx.rect(x, y, w, h);
		stroke(this.ctx, this.settings.strokeColor, line);
		this.ctx.closePath();

		this.ctx.beginPath();
		fillRect(this.ctx, rectX, rectY, rectW, rectH, color);

		if (this.settings.stroke) {
			stroke(this.ctx, strokeColor, line);
		}
		this.ctx.closePath();
	}
}

function stroke(ctx, color, width) {
	ctx.lineWidth = width;
	ctx.strokeStyle = color;
	ctx.stroke();
}

function fillRect(ctx, x, y, w, h, color) {
	ctx.fillStyle = color;
	ctx.rect(x, y, w, h);
	ctx.fill();
}

function combine(...args) {
	args.forEach(arg => arg());
}

function composite(ctx, type) {
	ctx.globalCompositeOperation = type;
}