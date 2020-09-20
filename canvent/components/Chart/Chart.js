import { DomListener } from '../DomListener/DomListener';
import { CanventText } from '../Text/Text';

export class CanventChart {
	constructor(ctx, data, settings) {	
		this.ctx = ctx;
		this.data = data;
		this.settings = settings;

		this.wholeArc = 0;
		this.startArc = 0;
		this.endArc = null;

		this.calcValues();
	}

	create() {
		if (this.settings.type === 'pie') {
			this.data.forEach(this.createPie);
		}

		if (this.settings.type === 'doughnut') {
			this.data.forEach(this.createDoughnut);
		}
	}

	createPie = (data) => {
		const { fill, strokeColor, value } = data;
		const { x, y, r, line } = this.settings;
		this.endArc += Math.PI * 2 / this.wholeArc * value;

		this.ctx.beginPath();
		this.ctx.fillStyle = fill || this.settings.fill;
		this.ctx.lineWidth = line;
		this.ctx.strokeStyle = strokeColor || this.settings.strokeColor || '#000';
		this.ctx.moveTo(x, y);
		this.ctx.arc(x, y, r, this.startArc, this.endArc);
		this.ctx.lineTo(x, y);
		this.ctx.fill()
		if (this.settings.stroke) {
			this.ctx.stroke()
		}
		this.ctx.closePath();

		this.startArc = this.endArc;
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
}