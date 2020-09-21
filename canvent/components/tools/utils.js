export const toMethodName = (str) => `${str}Handler`;

export function changeCursor(type) {
	document.body.style.cursor = type;
}

export function capitalize(str) {
	return str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
}