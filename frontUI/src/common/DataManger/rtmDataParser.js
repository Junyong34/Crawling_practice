// import _ from 'lodash-es';
import * as ServletType from '@/common/ServletType';

const rtmParser = {
	errorData({ type, data }) {
		data.callType = type;
		self.postMessage(data);
	},
	dataTypePostMsg({ type, data }) {
		data.callType = 'servletMsg';
		switch (type) {
			case ServletType.AI_CHART_DATA:
				this.fn_aiChart(data);
				break;
			case ServletType.LATELY_TIME:
				this.fn_lately_date(data);
				break;
			case ServletType.TIME_LINE:
				this.fn_timeLine(data);
				break;
			default:
			// this.fn_noneTypeData(status, data);
		}
	},
	fn_timeLine(data) {
		self.postMessage(data);
	},
	fn_aiChart(data) {
		self.postMessage(data);
	},
	fn_lately_date(data) {
		self.postMessage(data);
	},
};

export default rtmParser;
