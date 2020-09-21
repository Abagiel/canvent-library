import { DomListener } from '../DomListener/DomListener';
import { CanventText } from '../Text/Text';

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
		switch(this.settings.type) {
			case 'pie':
				this.data.forEach(this.createPie);
				break;
			case 'doughnut':
				this.data.forEach(this.createDoughnut);
				break;
			case 'vertical':
				this.data.forEach(this.createVerticalChart);
				break;
			case 'horizontal':
				this.data.forEach(this.createHorizontalChart);
				break;
			default: return;
		}
	}

	createPie = (data) => {
		const { fill, strokeColor, value } = data;
		const { x, y, r, line } = this.settings;
		this.endPoint += Math.PI * 2 / this.wholeArc * value;

		this.ctx.beginPath();
		this.ctx.fillStyle = fill || this.settings.fill;
		this.ctx.lineWidth = line;
		this.ctx.strokeStyle = strokeColor || this.settings.strokeColor || '#000';
		this.ctx.moveTo(x, y);
		this.ctx.arc(x, y, r, this.startPoint, this.endPoint);
		this.ctx.lineTo(x, y);
		this.ctx.fill()
		if (this.settings.stroke) {
			this.ctx.stroke()
		}
		this.ctx.closePath();

		this.startPoint = this.endPoint;
	}

	calcValues() {
		this.data.forEach(({value}) => {
			this.wholeArc += value;
		})
	}

	createDoughnut = (data) => {
		const { x, y, holeSize, holeFill } = this.settings;

		this.createPie(data);
		this.ctx.beginPath();
		this.ctx.fillStyle = holeFill;
		this.ctx.arc(x, y, holeSize, 0, 2 * Math.PI);
		this.ctx.fill();
		if (this.settings.stroke) {
			this.ctx.stroke();
		}
		this.ctx.closePath()
	}

	createVerticalChart = (data, i) => {
		const { fill, strokeColor, value } = data;
		const { x, y, h, w, gap } = this.settings;
		const length = this.data.length;
		const rectH = h / this.wholeArc * value;
		const rectW = w / length - (gap || 0);
		const rectX = x + (w / length * i) + (gap || 0) / 2;
		const rectY = y + h - rectH;

		this.ctx.beginPath();
		this.ctx.rect(x, y, w, h);
		this.ctx.stroke()
		this.ctx.closePath();

		this.ctx.beginPath();
		this.ctx.fillStyle = fill || this.settings.fill;
		this.ctx.rect(rectX, rectY, rectW, rectH);
		this.ctx.fill();

		if (this.settings.stroke) {
			this.ctx.strokeStyle = strokeColor;
			this.ctx.stroke();
		}
		this.ctx.closePath();
	}

	createHorizontalChart = (data, i) => {
		const { fill, strokeColor, value } = data;
		const { x, y, h, w, gap } = this.settings;
		const length = this.data.length;
		const rectW = w / this.wholeArc * value;
		const rectH = h / length - (gap || 0);
		const rectY = y + (h / length * i) + (gap || 0) / 2;
		const rectX = x;

		this.ctx.beginPath();
		this.ctx.rect(x, y, w, h);
		this.ctx.stroke()
		this.ctx.closePath();

		this.ctx.beginPath();
		this.ctx.fillStyle = fill || this.settings.fill;
		this.ctx.rect(rectX, rectY, rectW, rectH);
		this.ctx.fill();

		if (this.settings.stroke) {
			this.ctx.strokeStyle = strokeColor;
			this.ctx.stroke();
		}
		this.ctx.closePath();
	}
}