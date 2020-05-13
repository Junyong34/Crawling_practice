// const defaultColor = ["#00c5cd", "#009bc7", "#cacaff", "#ffc125", "#df6264", "#2b99f0", "#8ac449", "#009697", "#959c2c", "#004ae7", "#01cc00", "#15679a", "#43bcd7", "#e76627", "#5C8558", "#A8A5A3", "#498700", "#832C2D", "#C98C5A", "#3478BE", "#BCF061", "#B26600", "#27358F", "#A4534D", "#B89630", "#A865B4", "#254763", "#536859", "#3ca0ff", "#90db3b", "#00c4c5", "#ffde00", "#ff7781", "#8470ff", "#75cd8e", "#48d1cc", "#fec64f", "#fe984f", "#0052ff", "#00a48c", "#83cfde", "#dfe32d", "#ff7d40", "#99c7ff", "#a5fee3", "#0379c9", "#eef093", "#ffa891", "#E9F378", "#888A79", "#D67D4B", "#2BEC69", "#4A2BEC", "#2BBEEC", "#DDACDF"];
const defaultColor = [
	'#198fff',
	'#15efb4',
	'#e97fd7',
	'#ffb960',
	'#8c4ee6',
	'#e2e2e2',
	'#fbff60',
	'#ef4a79',
	'#58b632',
	'#5f52dc',
	'#105393',
	'#0f6b52',
	'#842073',
	'#845212',
	'#541f9f',
	'#7d7d7d',
	'#aeb143',
	'#642033',
	'#5d844e',
	'#637cb2',
];

const stackChartColor = [
	'#cdcdcd',
	'#28ad90',
	'#d32f76',
	'#446b0d',
	'#ffac4f',
	'#97d5e2',
	'#ec542e',
	'#1d4c8b',
	'#f6d257',
	'#479de2',
];

const barChartColor = ['#f70000', '#fbdd00', '#76ff9d', '#928aff', '#10d6d6'];

const extraColor = ['#4caf50', '#f44336', '#ff9800', '#2196f3'];

const markLineColor = ['#ff7a17', '#ff1357'];

const alarmColor = {
	warning: '#f8a30d',
	critical: '#ff1f3f',
};

const itemDataset = {
	normal: {
		// color: function(params) {
		//     // build a color map as your need.
		//     var colorList = [
		//         "#00c5cd", "#009bc7", "#cacaff", "#ffc125", "#df6264",
		//         "#2b99f0", "#8ac449", "#009697", "#959c2c", "#004ae7", "#01cc00", "#15679a",
		//         "#43bcd7", "#e76627", "#5C8558", "#A8A5A3", "#498700", "#832C2D", "#C98C5A", "#3478BE",
		//         "#BCF061", "#B26600", "#27358F", "#A4534D", "#B89630", "#A865B4", "#254763", "#536859",
		//         "#3ca0ff", "#90db3b", "#00c4c5", "#ffde00", "#ff7781",
		//         "#8470ff", "#75cd8e", "#48d1cc", "#fec64f", "#fe984f",
		//         "#0052ff", "#00a48c", "#83cfde", "#dfe32d", "#ff7d40",
		//         "#99c7ff", "#a5fee3", "#0379c9", "#eef093", "#ffa891",
		//         "#E9F378", "#888A79", "#D67D4B", "#2BEC69", "#4A2BEC", "#2BBEEC", "#DDACDF"];
		//     return colorList[params.dataIndex]
		// },
	},
	emphasis: {
		barBorderWidth: 1,
		shadowBlur: 10,
		shadowOffsetX: 0,
		shadowOffsetY: 0,
		shadowColor: 'rgba(0,0,0,0.5)',
	},
};

const quantity = input => {
	let output;

	if (typeof input === 'string' || typeof input === 'number') {
		const match = /^(normal|(\d+(?:\.\d+)?)(px|%)?)$/.exec(input);

		output = match
			? {
					value: +match[2],
					unit: match[3] || undefined,
			  }
			: undefined;
	} else {
		output = undefined;
	}
	return output;
};

const hexToRgb = hex => {
	if (!hex) {
		return false;
	}

	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

	const r = parseInt(result[1], 16);
	const g = parseInt(result[2], 16);
	const b = parseInt(result[3], 16);

	return `${r},${g},${b}`;
};

const optionMixin = (opt1, opt2) => Object.assign(opt1, opt2);

const toDecimal = (n, d) => {
	if (typeof n === 'number') {
		const pow = Math.pow(10, d);

		// console.log(Math.round(n * pow), pow, Math.round(n * pow) / pow);
		return Math.round(n * pow) / pow;
	}
	return n;
};

const networkUnit = n => {
	const cal = n / Math.pow(1024, 2);

	return toDecimal(cal, 2);
};

const memoryUnit = n => {
	const cal = n / Math.pow(1024, 3);

	return toDecimal(cal, 2);
};

const fromBytes = (bytes, unit, decimals = 2) => {
	const k = 1024;
	const dm = decimals < 0 ? 0 : decimals;
	const sizes = ['byte', 'Kib', 'Mib', 'Gib'];
	const i = sizes.findIndex(v => v.toLowerCase() === unit.toLowerCase());

	if (i === -1) {
		return bytes;
	}
	return (parseFloat(bytes) / Math.pow(k, i)).toFixed(dm);
};

const fromSec = sec => {
	const k = 1000;
	let _sec = sec;
	let i = 0;
	const sizes = ['sec', 'ms', 'μs', 'ns', 'ps'];

	while (_sec < 0.1) {
		_sec *= k;
		i++;
	}

	return { unit: sizes[i], mul: Math.pow(k, i) };
};

const getChartMaxData = dataSet => {
	// 배열로 입력된 값 중 가장 큰 값의 단위를 찾는다.
	if (dataSet.length === 0) {
		return 0;
	}
	const numberSet = dataSet.map(v => v * 1);
	const maxValue = numberSet.reduce((prev, curr) => (prev > curr ? prev : curr));

	return maxValue;
};

const autoBytesUnit = (arr, type = null) => {
	/**
	 * 배열로 된 숫자 값이 오면 가장 큰 용량의 단위로 변환해서 표기해준다.
	 * 변환하는 값은 0.1 보다 커야한다.
	 */
	const k = 1024;
	const sizes = ['byte', 'KiB', 'MiB', 'GiB'];
	let index = 0;
	let maxResult;

	if (typeof arr === 'object') {
		maxResult = getChartMaxData(arr);
	}

	for (let jx = 0; jx < sizes.length; jx++) {
		if (maxResult / k > 0.2) {
			maxResult /= k;
			index++;
		} else {
			break;
		}
	}
	// 소숫점인지 유무를 체크해서 소숫점은 2자리까지 표기해준다.
	const result = arr.map(v => {
		const value = v / Math.pow(k, index);

		if (value % 1 !== 0) {
			return value.toFixed(2);
		}
		return value;
	});

	const bytes = {
		data: result,
		units: sizes[index],
	};

	return !type ? bytes : bytes[type];
};

const autoSecondsUnit = (arr, type = null) => {
	/**
	 * 배열로 된 숫자 값이 오면 가장 작은 처리속도 단위로 변환해서 표기해준다.
	 * 변환하는 값은 0.1 보다 작아야한다.
	 */
	const k = 1000;
	const unit = ['sec', 'ms', 'µs', 'ns'];
	let index = 0;
	let maxResult;

	if (typeof arr === 'object') {
		maxResult = getChartMaxData(arr);
	}

	for (let jx = 0; jx < unit.length; jx++) {
		if (maxResult !== 0 && maxResult * k < 0.1) {
			maxResult *= k;
			index++;
		}
	}

	const result = arr.map(v => (v * Math.pow(k, index)).toFixed(2));

	const seconds = {
		data: result,
		units: unit[index],
	};

	return !type ? seconds : seconds[type];
};

const getData = (data, locations) => {
	// console.log(data, locations);
	let returnData = [];

	if (Array.isArray(locations)) {
		returnData = data;
		locations.forEach(location => {
			if (returnData) {
				if (Array.isArray(returnData)) {
					returnData = returnData.map(v => v[location]);
				} else {
					returnData = returnData[location];
				}
			}
		});
	} else {
		returnData = data[locations];
	}

	// console.log(returnData);
	return returnData;
};

const parsingChartData = (chartData, formatters) => {
	if (!chartData) {
		return null;
	}

	const parseData = [];
	const arrFormatter = Object.entries(formatters);
	let key = '';
	let format = {};
	let func = () => {};
	let arg = [];
	let ix = 0;

	chartData.forEach(d => {
		const data = {};

		arrFormatter.forEach(formatter => {
			// formatter[0] - key, formatter[1] - value
			// [key, format] = formatter;
			key = formatter[0];
			format = formatter[1];

			// chartData 에서 원하는 property 값을 가져온다.
			// default값이 있다면 default값을 넣어준다.
			data[key] = format.default ? format.default : getData(d, format.locations);

			// TODO: 불필요한 반복문 실행이 될수 있음..
			// 설정한 type이 있다면 type을 변화 시켜준다.
			if (format.type) {
				if (Array.isArray(data[key])) {
					data[key] = data[key].map(v => format.type(v));
				} else {
					// data[key] = format.type(data[key]);
					data[key] = [];
				}
			}

			// 함수가 있을 경우 함수를 실행해 반환값을 받아온다.
			if (format.converter) {
				// value.converter - [function, arguments]
				// [func, arg] = format.converter;
				func = format.converter[0];
				// shallow copy..
				arg = [...format.converter[1]];
				// 각각 개별로 처리할 경우 value, 전부를 처리할 경우 values
				if (arg.indexOf('value') !== -1) {
					ix = arg.indexOf('value');
					if (Array.isArray(data[key])) {
						data[key] = data[key].map(v => {
							// 배열 데이터(data, timestamp)는 숫자로 변경.
							arg[ix] = v;
							return func(...arg);
						});
					} else {
						// 하나일 경우는 id일 경우..
						arg[ix] = data[key];
						data[key] = func(...arg);
					}
				} else if (arg.indexOf('values') !== -1) {
					ix = arg.indexOf('values');
					if (Array.isArray(data[key])) {
						arg[ix] = data[key];
						data[key] = func(...arg);
					}
				} else {
					// TODO: 매개변수가 없을 경우 고려..
					console.error("don't exist value or values");
				}
			}
		});
		parseData.push(data);
	});

	// TODO: 한개면 배열로 보내지 않는다...
	// return parseData.length === 1 ? parseData[0] : parseData;
	return parseData;
};

const timeConverter = [value => value * 1000, ['value']];

export default {
	defaultColor,
	stackChartColor,
	barChartColor,
	extraColor,
	markLineColor,
	alarmColor,
	itemDataset,
	quantity,
	hexToRgb,
	optionMixin,
	toDecimal,
	networkUnit,
	memoryUnit,
	fromBytes,
	fromSec,
	autoBytesUnit,
	autoSecondsUnit,
	parsingChartData,
	timeConverter,
};
