import { get, map } from 'lodash';
import { headers } from './Constants';

const GetValue = get;
const Map = map;

function uuid() {
	let dt = new Date().getTime();
	const uuidNum = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (dt + Math.random() * 16) % 16 | 0;
		dt = Math.floor(dt / 16);
		// eslint-disable-next-line
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

const formatData = (data) => {
	const blockValues = [null, undefined, ''];
	if (Array.isArray(data)) {
		data.forEach((item) => {
			Object.keys(item).map((obj) => {
				if (blockValues.includes(item[obj])) {
					item[obj] = 'N/A';
					return item;
				}
				return item;
			})
			return item;
		})
	}
	return data;
}

const getCSVFile = (items = []) => {
	if (!items) return;
	let csv = ''
	// eslint-disable-next-line
	const csvExportFields = headers.map((head) => { if (head.exportCSV) return head.key }).filter(hD => typeof hD !== 'undefined');
	if (Array.isArray(items)) {
		const newItems = formatData(items);
		for (let row = 0; row < newItems.length; row++) {
			let keysAmount = Object.keys(newItems[row]).length
			let keysCounter = 0
			if (row === 0) {
				for (let key in newItems[row]) {
					if (csvExportFields.includes(key)) {
						csv += key + (keysCounter + 1 < keysAmount ? ',' : '\r\n')
					}
					keysCounter++
				}
			} else {
				for (let key in newItems[row]) {
					if (csvExportFields.includes(key)) {
						csv += newItems[row][key] + (keysCounter + 1 < keysAmount ? ',' : '\r\n')
					}
					keysCounter++
				}
			}
			keysCounter = 0
		}
	}
	return csv;
}

export { GetValue, uuid, Map, trimValue, getBase64, getCSVFile };
