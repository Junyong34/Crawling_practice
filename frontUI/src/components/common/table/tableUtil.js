import moment from 'moment/moment';

const detchObject = (obj, start, end) => {
	// 타입을 확인한다.
	const type = Object.prototype.toString.call(obj);
	const value = type.slice(start, end);

	return value;
};

const timerCalc = value => {
	const podAge = moment(+new Date() + value);
	const currentTime = moment(+new Date());
	const diffYear = podAge.diff(currentTime, 'year');

	// [year, month, day, hour, minute, second, millisecond]
	if (diffYear === 0) {
		const diffMonth = podAge.diff(currentTime, 'month');

		if (diffMonth === 0) {
			const diffDay = podAge.diff(currentTime, 'day');

			if (diffDay === 0) {
				const diffHour = podAge.diff(currentTime, 'hour');

				if (diffHour === 0) {
					const diffMinute = podAge.diff(currentTime, 'minute');

					if (diffMinute === 0) {
						return [0, 'second'];
					} else {
						return [diffMinute, 'minute'];
					}
				} else {
					return [diffHour, 'hour'];
				}
			} else {
				return [diffDay, 'day'];
			}
		} else {
			return [diffMonth, 'month'];
		}
	} else {
		return [diffYear, 'year'];
	}
};
const isObject = obj => {
	const value = detchObject(obj, 8, 14);

	return value === 'Object';
};

const isArray = obj => Array.isArray(obj);

const getHeader = names => {
	const dataSet = [];

	if (!isObject(names)) return dataSet;

	for (const key in names) {
		const format = {
			align: 'center',
			text: '',
			value: '',
			// width: 50,
			class: ['data-table-column'],
			tooltip: true,
		};

		dataSet.push(Object.assign(format, { text: names[key], value: key }));
	}
	return dataSet;
};

const mergeHeaderOptions = (headers, opt) => {
	const dataSet = headers;

	for (let ix = 0, ixLen = dataSet.length; ix < ixLen; ix++) {
		if (Object.prototype.hasOwnProperty.call(opt, dataSet[ix].value)) {
			dataSet[ix] = Object.assign(dataSet[ix], opt[dataSet[ix].value]);
		}
	}
	return dataSet;
};

const defaultOptions = {
	rowKey: 'id',
	indent: 50,
	border: true,
	size: 'mini',
	highlightCurrentRow: true,
	selectOnIndeterminate: false,
	fit: true,
	height: '100%',
	style: {
		border: 'none',
		backgroundColor: '#1F1F25',
	},
	headerRowStyle: {
		backgroundColor: '#0F0F11',
	},
	headerCellStyle: ({ row, column, rowIndex, columnIndex }, option = {}) => ({
		...{
			borderLeft: columnIndex || rowIndex ? '1px solid #9e9e9f55' : 'none',
			borderTop: rowIndex ? '1px solid #9e9e9f55' : 'none',
			borderBottom: 'none',
			background: 'none',
			color: '#A7A7A7',
			fontSize: '11px',
			fontFamily: 'Roboto-Regular',
		},
		...option,
	}),
	rowStyle: ({ row, column, rowIndex, columnIndex }, option = {}) => ({
		...{
			backgroundColor:
				row.flag === 'D' ? '#59595e' : rowIndex % 2 === 0 ? '#24242C' : '#1F1F25',
			transition: 'background 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)',
		},
		...option,
	}),
	cellStyle: ({ row, column, rowIndex, columnIndex }, option = {}) => ({
		...{
			borderLeft: columnIndex ? '1px solid #9e9e9f55' : '',
			borderTop: 'none',
			borderBottom: 'none',
			background: 'none',
			color: '#FFF',
			fontSize: '11px',
			fontFamily: 'Roboto-Regular',
			padding: '0',
			fontWeight: '400',
			cursor: row.flag === 'D' && column.property !== 'delete' ? 'not-allowed' : 'default',
		},
		...option,
	}),
};

const mergeOptions = options => {
	const keys = [...Object.keys(defaultOptions), ...Object.keys(options)];
	const dataSet = { ...defaultOptions };

	keys.forEach(key => {
		const defaultOpt = defaultOptions[key];
		const customOpt = options[key];

		let data;

		if (defaultOpt && customOpt) {
			const defaultOptType = typeof defaultOpt;
			const customOptType = typeof customOpt;

			if (defaultOptType === 'function') {
				if (customOptType === 'function') {
					data = args => ({
						...defaultOpt.call(this, args),
						...customOpt.call(this, args),
					});
				} else if (customOptType === 'object') {
					data = args => defaultOpt.call(this, args, customOpt);
				}
			} else if (defaultOptType === 'object') {
				if (customOptType === 'object') {
					data = { ...defaultOpt, ...customOpt };
				}
			} else {
				data = customOpt || defaultOpt;
			}
		} else {
			data = typeof customOpt === 'boolean' ? customOpt : customOpt || defaultOpt;
		}
		dataSet[key] = data;
	});
	return dataSet;
};

const defaultHeader = {
	align: 'left',
	fixed: false,
	showOverflowTooltip: true,
	resizable: true,
	sortable: true,
};

const initializationHeader = data => {
	const headers = data || [];

	for (let ix = 0, ixLen = headers.length; ix < ixLen; ix++) {
		const header = Object.assign({}, defaultHeader, headers[ix]);

		header.label = header.label || header.value;

		header.value = header.value || header.label;

		header.key = header.key || header.value;

		header.prop = header.prop || header.value;

		header.headerAlign = header.headerAlign || header.align;

		if (header.children) {
			header.children = initializationHeader(header.children);
		}

		headers[ix] = header;
	}

	return headers;
};

const dateFormatter = value => moment(new Date(value)).format('YYYY-MM-DD HH:mm');

const sizeFormatter = value => {
	const kb = 1024;
	const mb = kb ** 2;
	const gb = kb ** 3;

	if (value < kb) {
		return `${value} Byte`;
	} else if (value < mb) {
		return `${(value / kb).toFixed(2)} KB`;
	} else if (value < gb) {
		return `${(value / mb).toFixed(2)} MB`;
	} else {
		return `${(value / gb).toFixed(2)} GB`;
	}
};

const toDecimal = (n, d) => {
	if (typeof n === 'number') {
		return n.toFixed(d);
	}
	return n;
};

const networkUnit = n => {
	const cal = n / Math.pow(1024, 2);

	return toDecimal(cal, 2);
};

const filesystemUnit = n => {
	const cal = n / Math.pow(1024, 3);

	return toDecimal(cal, 2);
};

const diskUnit = n => {
	const cal = n * 1000;

	return toDecimal(cal, 2);
};

const memoryUnit = n => {
	const cal = n / Math.pow(1024, 3);

	return toDecimal(cal, 2);
};

const getLastValueInArray = (arr, key) => {
	let value = 0;

	if (!isArray(arr)) {
		return value;
	}
	if (arr.length) {
		value = arr[arr.length - 1][key];
	}
	return value;
};

const getSumInArray = arr => arr.reduce((acc, val) => acc + val);

const cuttingWord = (val, count) => {
	const str = val.substring(0, count);

	return `${str}...`;
};

const ageFormatter = age => {
	const ageObj = timerCalc(age);

	return `${ageObj[0]} ${ageObj[1]}`;
};

// const Lang = {
//     NODE_ID: "Node Id",
//     PODS_ALLOCATION: "Pods Allocation",
//     CPU_USAGE_COUNT: "CPU usage (Cores)",
//     CPU_LIMITS_ALLOCATION: "CPU Limits Allocation",
//     RESTART_COUNT: "Restart Count",
//     LAST_RUN_TIME: "Last Run Time",
//     POD_ID: "Pod Id",
//     MAX_METRIC_ID: "Max Metric Id",
//     MAX_METRIC_SCORE: "Max Score",
//     TIME: "Time",
//     // METRIC META SETTINGS
//     ID: "ID",
//     // EVENT LOG
//     CLUSTER_ID: "ClusterId",
//     FIRST_TIME: "FirstTime",
//     LAST_TIME: "LastTime",
//     USER_ID: "User ID",
//     VALUE: "Value",
//     DATE: "Date",
//     // REPORT
//     CREATED_BY: "Created By",
//     UPDATE_TIME: "Update Time",
//     LAST_BUILD_REPORT: "Last Build Report",
//     DIRECTORY: "Directory",
//     REPORT: "Report",
//     MODIFIED_BY: "Modified By",
//     CREATION_TIME: "Creation Time",
//     MODIFICATION_TIME: "Modification Time",
//     // TOPOLOGY
//     SEVERITY: "Severity",
//     TARGET_ID: "Target ID",
// };

export default {
	getHeader,
	defaultOptions,
	mergeOptions,
	mergeHeaderOptions,
	initializationHeader,
	networkUnit,
	diskUnit,
	memoryUnit,
	filesystemUnit,
	toDecimal,
	getLastValueInArray,
	timerCalc,
	cuttingWord,
	getSumInArray,
	sizeFormatter,
	dateFormatter,
	ageFormatter,
};
