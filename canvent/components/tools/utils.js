export const toMethodName = (str) => `${str}Handler`;

export function changeCursor(type) {
	document.body.style.cursor = type;
}