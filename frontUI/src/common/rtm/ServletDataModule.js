// import moment from 'moment';
// import cUtil from '@/common/commonUtil';
// import EnvConfig from "@/env/config.env";

const rtmDataModule = {
	token: null,
	$worker: null,
	$http: null,
	vm: null,
	singleCaller({ PARAM, URL, type }) {
		// if (TOKEN != null) this.settingToken(TOKEN);
		// serviceIns.setApiPath(this.servletPathInfo[URL] + URL);
		this.$http.get(URL, PARAM, (status, data) => {
			data.status = status;
			data.type = type;
			// data.callType = 'servletMsg';
			const response = {
				type: 'rtm',
				dataSet: data,
			};
			this.rtmPostMessage(response);
		});
		// .catch(e => {
		// 	this.convertErrorData(e.response);
		// });
	},
	rtmPostMessage(response) {
		this.$worker.postMessage(response);
	},
};

export default rtmDataModule;
