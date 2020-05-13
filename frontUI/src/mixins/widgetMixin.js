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
		console.log(vm.$api.sysId);
		vm.$webCaller.initRepeatTime();
	}
};
// const TokenSetting = vm => {
//     // 기본 데이터 셋팅 할때 값이 null 로컬스토리지에서 가져옴
//     if (vm.$store.state.params.token.accessToken === null) {
//         vm.$store.state.params.token.accessToken = getItem("accessToken");
//         vm.$store.state.params.token.tokenType = getItem("tokenType");
//     }
// };

const MyMixin = {
	beforeRouteEnter(to, from, next) {
		console.log(
			`%c #### from: ${from.path} , to: ${to.path}  beforeRouteEnter ####`,
			'color: #ffc00f',
		);
		if (!Object.keys(moduleList.store.state).includes('widget')) {
			moduleList.store.registerModule('widget', moduleList.widgetModule);
		}
		next(vm => {
			// vm.$store.state.params.activeView = to;
			basicInfoSetting(vm);
			vm.$loading.create('full').show();
			// 소케 연결 확인 F5 눌렀을때 제거 되기떄문에
			if (!vm.$webCaller.isSocketConn) {
				vm.$webCaller.initSocket();
			}
			// 화면 name이 해당 api 서블릿 key로 사용
			// vm.$store.state.params.activeView = to;
			vm.$store.dispatch('activeView', to);
		});
	},
	beforeRouteLeave(to, from, next) {
		// 페이저 떠나면 소켓 전부 unsubscribe
		// 이 컴포넌트를 렌더링하는 라우트가 이전으로 네비게이션 될 때 호출됩니다.
		// `this` 컴포넌트 인스턴스에 접근 할 수 있습니다.
		this.$loading.removeAll();
		next();
	},
	mounted() {
		this.$nextTick(() => {
			this.$loading.hide('full');
		});
	},
};

export default MyMixin;
