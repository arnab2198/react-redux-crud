import { get, map } from 'lodash';

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

function getCSVFile(args, customExportFields, customKeys, customDataManage) {
	let result = '';
	let ctr = '';
	let keys = '';
	let columnDelimiter = '';
	let lineDelimiter = '';
	let data = '';


	data = args.data || null;
	if (data == null || !data.length) {
		return null;
	}

	columnDelimiter = args.columnDelimiter || ',';
	lineDelimiter = args.lineDelimiter || '\n';
	keys = customExportFields;
	result = '';
	result += customKeys;
	result += lineDelimiter;
	data.forEach(function (item, dtIndex) {
		ctr = 0;
		keys.forEach(function (key) {
			if (ctr > 0) {
				result += columnDelimiter;
			}
			result = customDataManage(item, key, dtIndex, result)
			ctr++;
		});
		result += lineDelimiter;
	});

	return result;
}

export { GetValue, uuid, Map, trimValue, getBase64, getCSVFile };
