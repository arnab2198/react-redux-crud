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

const getCSVFile = (args, customExportFields, customKeys, customDataManage) => {
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

const importCSVFile = (file, func) => {
	let newJSON = [];
	const blockedData = [undefined, null, '', ' '];
	const acceptedHeaders = [
		{ key: 'Sr. No', name: 'sr_no' },
		{ key: 'Task Name', name: 'task_name' },
		{ key: 'Task Description', name: 'task_description' },
		{ key: 'Start Date', name: 'start_date' },
		{ key: 'End date', name: 'end_date' },
		{ key: 'Priority', name: 'priority' },
		{ key: 'Status', name: 'status' }
	]
	const reader = new FileReader();
	let text;
	reader.onload = function (e) {
		text = e.target.result;
		let arr = text.split('\n');
		let jsonObj = [];
		let headers = arr[0].split(',');
		for (let i = 1; i < arr.length; i++) {
			let data = arr[i].split(',').filter((tex) => !blockedData.includes(tex));
			let obj = {};
			for (let j = 0; j < data.length; j++) {
				obj[headers[j].trim()] = data[j].trim();
			}

			jsonObj.push(obj);
		}

		const isAllHeadMatched = acceptedHeaders.every((head) => headers.includes(head.key));

		newJSON = jsonObj.filter((obj) => Object.keys(obj).length > 1);

		if (isAllHeadMatched) {
			newJSON.map((obj) => {
				acceptedHeaders.forEach((head) => {
					obj.id = uuid();
					obj[head.name] = obj[head.key];
					delete obj[head.key];
				})
				return obj;
			})
		}
		func(newJSON);
	}
	reader.readAsText(file);
}

export { GetValue, uuid, Map, trimValue, getBase64, getCSVFile, importCSVFile };
