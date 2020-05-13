// import _ from 'lodash-es';

const widgetParser = {
	dataTypePostMsg({ type, data, id }) {
		data.callType = 'widgetMsg';
		data.id = id;
		switch (type) {
			case 'widgetData':
				this.widgetDataSet(data);
				break;
			default:
				null;
		}
	},
	widgetDataSet(data) {
		self.postMessage(data);
	},
};

export default widgetParser;
