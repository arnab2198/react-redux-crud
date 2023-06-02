import { get, map } from 'lodash';
import { headers } from './Constants';

const GetValue = get;
const Map = map;

function uuid() {
	let dt = new Date().getTime();
	const uuidNum = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (dt + Math.random() * 16) % 16 | 0;
		dt = Math.floor(dt / 16);
		return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuidNum;
}


const trimValue = (data) => {
	if (!data) return;
	const splited = data.split(' ');
	let words = [];
	splited.forEach((it) => {
		if (it) {
			let arr = [...words, it];
			words = arr;
		}
	})
	const finalText = words.join(' ');
	return finalText;
}

const getBase64 = (file) => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = error => reject(error);
		reader.readAsDataURL(file);
	});
}

const getCSVFile = (items = []) => {
	if (!items) return;
	const blockedTypes = [undefined, null, ''];
	let csv = ''
	// const newItems = headers.map((head) => { if (head.exportCSV) return head.key }).filter(hD => typeof hD !== 'undefined');
	if (Array.isArray(items)) {
		for (let row = 0; row < items.length; row++) {
			let keysAmount = Object.keys(items[row]).length
			let keysCounter = 0
			if (row === 0) {
				for (let key in items[row]) {
					csv += key + (keysCounter + 1 < keysAmount ? ',' : '\r\n')
					keysCounter++
				}
			} else {
				for (let key in items[row]) {
					console.log('typeof items[row][key]', items[row]);
					const value = blockedTypes.includes(typeof items[row][key]) ? 'N/A' : items[row][key]
					csv += value + (keysCounter + 1 < keysAmount ? ',' : '\r\n')
					keysCounter++
				}
			}
			keysCounter = 0
		}
	}
	return csv;
}

export { GetValue, uuid, Map, trimValue, getBase64, getCSVFile };
