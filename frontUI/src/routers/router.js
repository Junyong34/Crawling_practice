import Vue from 'vue';
import Router from 'vue-router';
import * as moduleList from '@/vuex/vuex-main';

import { getItem } from '@/common/LocalStorageMemager';
import LoginView from '@/views/login/login.vue';
// import AdminView from "../views/admin/admin.vue";
import BodyView from '@/components/mainFrame/main-frame';
/* sub route */

/* Infrastructure */
// import TopologyInfra from "../views/topologyView/topologyView";

Vue.use(Router);
const RouterConfig = {
	base: process.env.BASE_URL,
};

const authCheck = () => {
	const accessToken = moduleList.store.state.accessToken;

	if (accessToken == null) {
		const localstoreageAccessTokenn = getItem('accessToken');
		const localstoreageTokenType = getItem('tokenType');

		if (localstoreageAccessTokenn == null) {
			// 로그인 페이지로 돌린다.
			return true;
		} else {
			// moduleList.vuex에 token 담는다.
			moduleList.store.state.accessToken = localstoreageAccessTokenn;
			moduleList.store.state.tokenType = localstoreageTokenType;

			return true;
		}
	} else {
		return true;
	}
};

const loginRecord = {
	path: '/',
	name: 'login',
	component: LoginView,
};

const realTimeRecord = {
	path: '/realTime',
	name: 'realTime',
	// beforeEnter: requireAuth(),
	meta: {
		authRequired: true,
		moduleName: 'rtm',
	},
	component: BodyView,
	children: [
		{
			path: 'anomalyDetection',
			name: 'anomalyDetection',
			// component: namespace,
			component: () => import('../views/realTime/anomaly-detection-overview'),
			// meta: {
			//     authRequired: true,
			// },
			// component: TopologyInfra,
			// () => import("../views/topologyView/topologyView"),
			// beforeEnter: requireAuth(),
		},
		{
			path: 'loadPrediction',
			name: 'loadPrediction',
			// component: namespace,
			component: () => import('../views/realTime/load-prediction-overview'),
			// meta: {
			//     authRequired: true,
			// },
			// component: TopologyInfra,
			// () => import("../views/topologyView/topologyView"),
			// beforeEnter: requireAuth(),
		},
		{
			path: 'overview',
			name: 'overview',
			// component: namespace,
			component: () => import('../views/realTime/overview'),
			// meta: {
			//     authRequired: true,
			// },
			// component: TopologyInfra,
			// () => import("../views/topologyView/topologyView"),
			// beforeEnter: requireAuth(),
		},
		{
			path: 'overview2',
			name: 'overview2',
			// component: namespace,
			component: () => import('../views/realTime/overview2'),
			// meta: {
			//     authRequired: true,
			// },
			// component: TopologyInfra,
			// () => import("../views/topologyView/topologyView"),
			// beforeEnter: requireAuth(),
		},
		{
			path: 'trendChart',
			name: 'trendChart',
			// component: namespace,
			component: () => import('../views/realTime/trend-chart'),
			// meta: {
			//     authRequired: true,
			// },
			// component: TopologyInfra,
			// () => import("../views/topologyView/topologyView"),
			// beforeEnter: requireAuth(),
		},
	],
};

const performanceAnalysisRecord = {
	path: '/performanceAnalysis',
	name: 'performanceAnalysis',
	// beforeEnter: requireAuth(),
	meta: {
		authRequired: true,
		moduleName: 'pa',
	},
	component: BodyView,
	children: [
		{
			path: 'performanceTrendAnalysis',
			name: 'performanceTrendAnalysis',
			component: () => import('../views/performanceAnalysis/performance-trend-analysis'),
		},
	],
};

const dashboardRecord = {
	path: '/dashboard',
	name: 'dashboard',
	meta: {
		authRequired: true,
		moduleName: 'dashboard',
	},
	component: BodyView,
	children: [
		{
			path: '/documentDashboard',
			name: 'documentDashboard',
			props: true,

			component: () => import('../views/dashboard/dashboard-list'),
		},
		{
			path: '/documentDashboard/create',
			name: 'createDashboardLayout',
			props: true,

			component: () => import('../views/dashboard/dashboard'),
			meta: {
				// triggerBus: true, // 대쉬보드 이벤트 버스
			},
		},
		{
			path: '/documentDashboard/:viewId',
			name: 'documentDashboardLayout',
			props: true,

			component: () => import('../views/dashboard/dashboard'),
			meta: {
				// triggerBus: true, // 대쉬보드 이벤트 버스
			},
		},
		{
			path: '/templateDashboard',
			name: 'templateDashboard',
			props: true,

			component: () => import('../views/dashboard/dashboard-list'),
		},
		{
			path: '/templateDashboard/:viewId',
			name: 'templateDashboardLayout',
			props: true,

			component: () => import('../views/dashboard/dashboard'),
			meta: {
				// triggerBus: true, // 대쉬보드 이벤트 버스
			},
		},
		{
			path: 'anomalyTransactionDetection',
			name: 'anomalyTransactionDetection',
			component: () => import('../views/performanceAnalysis/anormaly-transaction'),
		},
		{
			path: 'loadPatternAnalysis',
			name: 'loadPatternAnalysis',
			component: () => import('../views/performanceAnalysis/load-pattern-analysis'),
		},
	],
};

const configRecord = {
	path: '/setting',
	name: 'setting',
	meta: {
		authRequired: true,
		moduleName: 'env',
	},
	component: BodyView,
	children: [
		{
			path: '/templateDashboard',
			name: 'templateDashboard',
			props: true,

			component: () => import('../views/dashboard/dashboard-list'),
		},
	],
};
const router = new Router({
	RouterConfig,
	// mode: "history",
	routes: [
		loginRecord,
		realTimeRecord,
		performanceAnalysisRecord,
		dashboardRecord,
		configRecord,
		{
			path: '*',
			redirect: {
				name: 'login',
			},
		},
	],
});

router.beforeEach((to, from, next) => {
	console.log(`%c #### from: ${from.path} , to: ${to.path}  beforeEach ####`, 'color: #10d6d6');
	moduleList.store.state.activeView = to;
	// 로그인 페이지는 권한체크 X
	if (to.name === 'login') {
		console.log(`%c #### -> login Page Go ####`, 'color: #1A5AD6');
		next();
	} else if (authCheck()) {
		console.log(`%c #### -> next() Call ####`, 'color: #1A5AD6');
		// 인증 성공
		next();
	} else {
		console.log(`%c #### -> auth error ####`, 'color: #1A5AD6');
		// 인증 실패 로그인 페이지 이동
		// next({name: "login"});
		router.push({
			path: '/',
		});
	}
	// Vue.nextTick(() => {
	// });
});

export default router;
