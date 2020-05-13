import Vue from 'vue';
import clogSysbols from 'log-symbols';
import ElementUI from 'element-ui';
import loading from '@/components/loading';
import VueGridLayout from 'vue-grid-layout';
import './plugins/element-ui';
import { store } from '@/vuex/vuex-main';
import WebService from '@/common/WebService';
import api from '@/common/ServletPathInfo';
import EventBusType from '@/common/EventBusType';
import '@/style/sass/main.scss';
import './globalVueEnv';
import i18n from './i18n';
import router from './routers/router';
import App from './App.vue';
import ClickOutside from './plugins/clickOutside';
import Resize from './plugins/resize';

Vue.config.productionTip = false;
window.appEnv.clog = clogSysbols;

Vue.directive('resize', Resize);
Vue.directive('click-outside', ClickOutside);
Vue.use(ElementUI);
Vue.use(loading);
Vue.use(VueGridLayout);
Vue.prototype.$Vue = Vue;

const EventBus = new Vue();
const WebCaller = new WebService();
EventBus.type = EventBusType;
// process.env.NODE_ENV = (process.env.NODE_ENV && (process.env.NODE_ENV).trim().toLowerCase() === "production") ? "production" : "development";
if (process.env.NODE_ENV === 'production') {
	console.log(` ${clogSysbols.info} Production Mode`);
} else if (process.env.NODE_ENV === 'development') {
	console.log(`  ${clogSysbols.info}Development Mode`);
} else {
	console.log(`  ${clogSysbols.info}Demo Mode`);
}
Object.defineProperties(Vue.prototype, {
	$webCaller: {
		get() {
			return WebCaller;
		},
	},
	$EventBus: {
		get() {
			return EventBus;
		},
	},
	$api: {
		get() {
			return api;
		},
	},
});

// import qs from "qs";

const app = new Vue({
	router,
	store,
	i18n,
	data() {
		return {
			call: null,
		};
	},
	// beforeCreate() {
	//     console.log("beforeCreate,js", this, this.$webCaller);
	// },
	created() {
		document.addEventListener('keydown', this.localStorageClear.bind(this));
		document.addEventListener('keyup', this.keyCheck.bind(this));
		// console.log("main.js");
		// 워커에서 사용하지 않는 서블릿 axios
		// 새로고침 기본 환경 새로 셋팅
		// const localstoreageAccessToken = getItem('accessToken');
		// const localstoreageTokenType = getItem('tokenType');
		// debugger;
		this.$webCaller.setVmConfig({ vm: this });
		this.$webCaller.initServlet();
		// if (this.$http.TokenKey === '' && localstoreageAccessToken) {
		// 	this.$store
		// 		.dispatch('params/setAccessToken', localstoreageAccessToken)
		// 		.then(() =>
		// 			this.$store.dispatch('params/setTokenType', localstoreageTokenType),
		// 		)
		// 		.then(() => {
		// 			this.$http.TokenKey = localstoreageAccessToken;
		// 			this.$http.TokenType = localstoreageTokenType;
		// 			this.$webCaller.token.TokenKey = localstoreageAccessToken;
		// 			this.$webCaller.token.TokenType = localstoreageTokenType;
		// 			this.$webCaller.setToken();
		// 		});
		// }
	},
	methods: {
		keyCheck(e) {
			if (e.keyCode === 17) this.isCtrl = false;
			if (e.keyCode === 16) this.isShift = false;
		},
		localStorageClear(e) {
			if (e.keyCode === 17) this.isCtrl = true;
			if (e.keyCode === 16) this.isShift = true;
			if (this.isCtrl && this.isShift && e.keyCode === 76) {
				localStorage.clear();
				this.$router.push({ name: 'login' });
				location.reload();
				return false;
			}
		},
	},
	mounted() {
		this.$nextTick(() => {});
	},
	beforeDestroy() {},
	render: h => h(App),
});

store.$app = app;
app.$mount('#app');
