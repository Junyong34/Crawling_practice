const path = {
	sysId: null,
	sysConTier({ tierId } = '') {
		let URL = '/admin/system/';

		return {
			tier: URL + `${this.sysId}/tier`,
			tier_Id: URL + `${this.sysId}/tier/${tierId}`,
			tierMap: URL + `${this.sysId}/tiermap/${tierId}`,
			instance: URL + `${this.sysId}/tiermap/${tierId}/instance`,
		};
	},
	/* key = e2e_txn, history, history2, instance, was_txn */
	train({ instId } = '') {
		let URL = '/admin/system/train/';

		return {
			e2e_txn: URL + `${this.sysId}/e2e_txn`,
			history: URL + `${this.sysId}/history`,
			history2: URL + `${this.sysId}/history/${instId}`,
			instance: URL + `${this.sysId}/instance/`,
			was_txn: URL + `${this.sysId}/was_txn`,
		};
	},

	/* key = channel, channel2 list */
	alarmChannel({ channelUserId } = '') {
		let URL = '/admin/alarm/channel';

		return {
			channel: URL,
			channel2: URL + `/${channelUserId}`,
			list: URL + `/list`,
		};
	},

	alarmDashboard() {
		let URL = '/admin/alarm/dashboard';

		return {
			dashboard: URL,
			dashboard2: URL + `/${this.sysId}`,
			list: URL + `/list`,
		};
	},

	alarmLevel() {
		let URL = '/admin/alarm/level';

		return {
			level: URL + `/${this.sysId}`,
			list: URL + `/list`,
		};
	},

	systemApi({ yyyymm, instId, parentId, targetId } = '') {
		let URL = '/admin/system';

		return {
			system: URL + `/${this.sysId}`,
			system2: URL + `/${this.sysId}`,
			systemList: '/system',
			systemIns: `/system/${this.sysId}/instance`,
			failureHistory: URL + `/${this.sysId}/failurehistory/${yyyymm}`,
			failureHistoryStatus: URL + `/${this.sysId}/failurehistory/${yyyymm}/status`,
			instance: URL + `/${this.sysId}/instance`,
			instanceId: URL + `/${this.sysId}/instance/${instId}`,
			instanceEnable: URL + `/${this.sysId}/instance/${instId}/enable`,
			instanceTraining: URL + `/${this.sysId}/instance/${instId}/training`,
			os: URL + `/${this.sysId}/os`,
			osId: URL + `/${this.sysId}/os/${instId}`,
			osEnable: URL + `/${this.sysId}/os/${instId}/enable`,
			osTraining: URL + `/${this.sysId}/os/${instId}/training`,
			osInstance: URL + `/${this.sysId}/os/${parentId}/instance`,
			progress: URL + `/${this.sysId}/train/${instId}/progress`,
			txnTraining: URL + `/${this.sysId}/txn/${targetId}/training`,
			trainingE2eTxn: URL + `/instance/training/e2e_txn/${this.sysId}`,
			trainingWasTxn: URL + `/instance/training/was_txn/${instId}`,
			trainingDelete: URL + `/instance/training/${this.sysId}/${instId}`,
			trainingList: URL + `/instance/training/list`,
		};
	},

	authorization() {
		let URL = '/admin/auth';

		return {
			auth: URL,
		};
	},

	ectApi({ serviceName } = '') {
		let URL = '/topic';

		return {
			adhoc: '/adhoc',
			shutdown: '/shutdown',
			topicAll: URL + `/ALL`,
			topicList: URL + `/list`,
			topic: URL + `/${serviceName}`,
		};
	},

	adminService({ serviceName } = '') {
		let URL = '/service';

		return {
			service: URL + `/${serviceName}`,
			serviceList: URL + `/list`,
			start: `/start/${serviceName}`,
			stop: `/stop/${serviceName}`,
			update: `/update/${serviceName}`,
		};
	},

	adminTxn({ moduleName, instType } = '') {
		let URL = '/admin/system/txn';

		return {
			txnResult: URL + `/result/${this.sysId}/${moduleName}`,
			txnResultLngtrm: URL + `/result/${this.sysId}/lngtrm`,
			txnTarget: URL + `/target/${this.sysId}/${moduleName}`,
			txnTargetLngtrm: URL + `/target/${this.sysId}/lngtrm/${instType}`,
		};
	},
	loginHistory() {
		let URL = '/login_history';

		return {
			historyList: `/admin/${URL}/list`,
			history: `${URL}`,
		};
	},

	roleManager({ authId } = '') {
		let URL = '/admin/role_manager';

		return {
			role: URL,
			roleAuthId: URL + `/${authId}`,
			menu: URL + `/menu`,
		};
	},

	trainMeta() {
		let URL = '/admin/system';

		return {
			trainmanual: URL + `/${this.sysId}/trainmanual`,
			trainmeta: URL + `/${this.sysId}/trainmeta`,
		};
	},

	basicInfo() {
		let URL = '';

		return {
			instance: URL + `/instance-info`,
			failureCount: URL + `/failure-count`,
			anomalySummary: URL + `/anomaly-summary-info`,
			alarmSenderHistory: URL + `/alarm-sender-history`,
			metric: URL + `/dashboard/metric/${this.sysId}`,
			menu: 'dashboard/menu2',
		};
	},

	fcst() {
		let URL = '';

		return {
			data: URL + `/v1/module/fcst/txn/data`,
			train: URL + `/v1/module/fcst/txn/train`,
			txns: URL + `/v1/module/fcst/txns`,
		};
	},

	userAuth({ instType, userId } = '') {
		let URL = '/admin/system';

		return {
			metric: URL + `/${this.sysId}/metric/${instType}`,
			auth: URL + `/user/auth`,
			authUserId: URL + `/user/auth/${userId}`,
		};
	},

	instancePerformance() {
		return {
			latelyTime: `/get-performance-lately-time/${this.sysId}`,
			instPerformance: `/instance-performance`,
			detection: `/instance-performance/detection`,
			overall: `/overall-performance`,
		};
	},

	login() {
		let URL = '/login';

		return {
			login: URL,
		};
	},

	timeLine() {
		let URL = '/time-line';

		return {
			timeLine: `${URL}/${this.sysId}`,
		};
	},

	workloadPattern({ radarId, instantId } = {}) {
		return {
			radarData: `/v1/module/wclst/data/${radarId}`, //부하 클러스터링 레이더 조회
			radarList: `/v1/module/wclst/list/${instantId}`, //부하 클러스터링 레이더 목록
			train: '/v1/module/wclst/train',
		};
	},

	dashboard({ id, userId } = {}) {
		let URL = '/api/dashboard';

		return {
			dashboard: URL,
			dashboardId: URL + `/${id}`,
			dashboardUserId: URL + `?userId=${userId}`,
			template: URL + '/template',
			idThumbnail: URL + `/${id}/dashboardThumbnail`,
			thumbnailId: URL + `/dashboardThumbnail/${id}`,
		};
	},
};

export default path;
