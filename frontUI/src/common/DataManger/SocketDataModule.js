// 워커영역 처리
const DataModule = {
	dataType(data) {
		const type = data.key;
		data.callType = 'socketMsg';

		// 리로드 패킷 들어올 때 처리
		switch (type) {
			case 'reload':
				this.reloadPaket(data);
				break;
			case 'alarmData':
				// console.log('알람', data);
				self.postMessage(data);
				// this.metricPaket(data);
				break;
			case 'alert':
				// console.log("알람", data);
				self.postMessage(data);
				// this.metricPaket(data);
				break;
			case 'error':
				this.eroroPaket(data);
				// this.metricPaket(data);
				break;
			default:
		}
	},
	eroroPaket(data) {
		const datas = data.data;

		console.error(datas.message);
		// console.log
		// 에러 패킷이 들어오는 경우 알람으로 알려준다.
	},

	metricPaket(data) {
		const key = data.key;

		switch (key) {
			case 'metric':
				self.postMessage(data);
				break;
			default:
		}
	},

	reloadPaket(data) {
		const type = data.data;
		switch (type) {
			case 'info':
				self.postMessage(data);
				break;
			case '5s':
				self.postMessage(data);
				break;
			default:
		}
	},
};

export default DataModule;
