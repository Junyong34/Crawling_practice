import { getItem } from '@/common/LocalStorageMemager';
import * as moduleList from '@/vuex/vuex-main';

const basicInfoSetting = vm => {
	// 기본 데이터 셋팅 할때 값이 null 로컬스토리지에서 가져옴
	if (!vm.$store.state.userId) {
		vm.$store.dispatch('setUserId', getItem('userId'));
	}
	if (!vm.$store.state.params.system_list) {
		vm.$store.dispatch('params/setSystemList', getItem('system_list'));
	}
	if (!vm.$store.state.params.systemId) {
		const systemId = getItem('systemId');

		vm.$store.dispatch('params/setSystemId', systemId);
		vm.$api.sysId = systemId;
	}
	if (!vm.$webCaller.repeatTime) {
		vm.$webCaller.initRepeatTime();
	}
};
const MyMixin = {
	beforeRouteEnter(to, from, next) {
		console.log(
			`%c #### from: ${from.path} , to: ${to.path}  beforeRouteEnter ####`,
			'color: #ffc00f',
		);
		const moduleKey = to.matched[0].meta.moduleName;
		if (!Object.keys(moduleList.store.state).includes(moduleKey)) {
			moduleList.store.registerModule(
				moduleKey,
				moduleList[`${moduleKey}Module`],
				// {
				// 	preserveState: true,
				// },
			);
		}
		next(vm => {
			vm.$store.dispatch('activeView', to);
			basicInfoSetting(vm);
			if (!vm.$webCaller.isSocketConn) {
				// vm.$webCaller.setToken();
				vm.$webCaller.initSocket();
				vm.$webCaller.addSubscribe(
					'wsEvent',
					getItem('systemId'),
					'alarm',
					'alarmData',
					'alarmTopic',
				);
			}
			vm.$store.dispatch('activeView', to);
			vm.$loading.create('full').show();
		});
	},
	beforeRouteLeave(to, from, next) {
		const toPath = to.matched[0].name;
		const fromPath = from.matched[0].name;
		const moduleKey = from.matched[0].meta.moduleName;

		if (toPath !== fromPath) {
			if (Object.keys(moduleList.store.state).includes(moduleKey)) {
				moduleList.store.unregisterModule(moduleKey, moduleList[`${moduleKey}Module`]);
			}
		}
		// 페이저 떠나면 소켓 전부 unsubscribe
		if (this.$webCaller.worker != null) {
			this.$webCaller.deleteSubscribe('all', null);
		}
		this.$loading.removeAll();
		console.log(
			`%c #### from: ${from.path} , to: ${to.path}  beforeRouteLeave ####`,
			'color: #ff090963',
		);
		next();
		// 이 컴포넌트를 렌더링하는 라우트가 이전으로 네비게이션 될 때 호출됩니다.
		// `this` 컴포넌트 인스턴스에 접근 할 수 있습니다.
	},
	methods: {
		// getNamespace(clusterId, callbackFn) {
		// 	const userId = this.$store.state.userId;
		//
		// 	this.serviceIns.setApiPath(
		// 		`${this.$api.userPermission.permission}/${userId}/permissions/clusters/${clusterId}/namespaces`,
		// 	);
		// 	return this.serviceIns
		// 		.get('', (status, response) => response && response.data)
		// 		.then(callbackFn);
		// },
		// callMetric() {
		// 	this.serviceIns.setApiPath(this.$api.metric.meta);
		// 	const promise = this.serviceIns.get(
		// 		{ inUse: true },
		// 		(status, response) => response,
		// 	);
		//
		// 	return promise;
		// },
	},
	mounted() {
		this.$nextTick(() => {
			this.$loading.hide('full');
		});
	},
};

export default MyMixin;
