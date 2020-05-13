const widgetDataModule = {
	token: null,
	$worker: null,
	vm: null,
	$http: null,
	widgetApiCall({ WIDGET_INFO }) {
		// console.log("call 중", WIDGET_INFO);
		// serviceIns.setApiPath()
		// viewServletList.VIEW_ID.async
		// if (TOKEN != null) this.settingToken(TOKEN);

		this.syncCaller(WIDGET_INFO)
			.then(widgetDataSet => {
				this.$worker.postMessage(widgetDataSet);
			})
			.catch(e => console.log(e));
	},
	// 순서가 보장되는 caller
	async syncCaller(WIDGET_INFO) {
		const params = WIDGET_INFO.params;
		const commonId = WIDGET_INFO.id;

		if (!params.entityId) return;

		let setParam;
		let resultData;
		const mergeData = [];
		let widgetDataSet = {};

		if (params.entityId.length > 1) {
			widgetDataSet.dataSet = { data: [] };

			for (const entity of params.entityId) {
				setParam = {
					...params,
				};
				setParam.entityId = entity;
				resultData = await this._fnCall(WIDGET_INFO.api, setParam);

				if (!widgetDataSet.type) widgetDataSet.type = resultData.type;
				resultData.dataSet.data.forEach(d => {
					mergeData.push(d);
				});
			}

			widgetDataSet.id = commonId;
			widgetDataSet.dataSet.data = mergeData;
		} else {
			setParam = {
				...params,
			};
			setParam.entityId = setParam.entityId[0];
			resultData = await this._fnCall(WIDGET_INFO.api, setParam);

			widgetDataSet.dataSet = resultData.dataSet;
			widgetDataSet.id = commonId;
			widgetDataSet.type = resultData.type;
		}
		return widgetDataSet;
	},

	_fnCall(url, param) {
		return this.$http.get(url, param, (status, data) => {
			data.status = status;
			return {
				type: 'widgetData',
				dataSet: data,
			};
		});
		// .catch(e => {
		// 	console.log(e, 'asdasdasd');
		// 	this.convertErrorData(e.response);
		// });
	},

	// worker 안에서 function clone 이 불가능 하기 때문
};

export default widgetDataModule;
