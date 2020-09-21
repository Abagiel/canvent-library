import { DomListener } from '../DomListener/DomListener';
import { CanventText } from '../Text/Text';

import { capitalize } from '../tools/utils';

export class CanventChart {
	constructor(ctx, data, settings) {	
		this.ctx = ctx;
		this.data = sort(settings.sort, data);
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

		vertHorChartsRender(this.ctx, x, y, w, h, this.settings.strokeColor, rectX, rectY, rectW, rectH, strokeColor, line, this.settings.stroke, color);
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

		vertHorChartsRender(this.ctx, x, y, w, h, this.settings.strokeColor, rectX, rectY, rectW, rectH, strokeColor, line, this.settings.stroke, color);
	}
}

function vertHorChartsRender(ctx, x, y, w, h, mainStrokeColor, rectX, rectY, rectW, rectH, strokeColor, line, mainStroke, color) {
	ctx.beginPath();
	ctx.rect(x, y, w, h);
	stroke(ctx, mainStrokeColor, line);
	ctx.closePath();

	ctx.beginPath();
	fillRect(ctx, rectX, rectY, rectW, rectH, color);

	if (mainStroke) {
		stroke(ctx, strokeColor, line);
	}
	ctx.closePath();
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

function sort(type, data) {
	if (!type) return data;

	if (type === 'down') {
		return data.sort((a, b) => a.value - b.value);
	} else {
		return data.sort((a, b) => b.value - a.value);
	}
}