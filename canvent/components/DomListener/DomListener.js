import { toMethodName } from '../tools/utils';

export class DomListener {
	constructor({ listeners, target }) {
		this.listeners = listeners;
		this.target = target;
	}

	initListeners() {
		this.listeners.forEach(listener => {
			const name = toMethodName(listener);
			const func = this[name];

			this.target.addEventListener(listener, func);
		})
	}

	removeListeners() {
		this.listeners.forEach(listener => {
			const name = toMethodName(listener);
			const func = this[name];

			this.target.removeEventListener(listener, func);
		})
	}
}
