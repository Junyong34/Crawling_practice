import Vue from 'vue';
import Vuex from 'vuex';
import dashboardModule from './modules/dashboard/module-dashboard';
import envModule from './modules/env/module-env';
import rtmModule from './modules/rtm/module-rtm';
import paModule from './modules/pa/module-pa';
import paramsModule from './modules/params/module-params';
import rootModule from './modules/root/module-root';
import widgetModule from './modules/widget/module-widget';
import socketModule from './modules/socket/module-socket';

Vue.use(Vuex);

// const myPlugin = store => {
//     // store.subscribeAction((action, state) => {
//     //     console.log(action);
//     //     console.log(state);
//     // });
//     store.subscribe((mutation, state) => {
//         console.log(mutation);
//         console.log(state);
//     });
// };
// export default
const store = new Vuex.Store({
	...rootModule,
	modules: {
		// store: mainModule,
		// params: params,
		// env: envState,
		// pa: paState,
	},
	// plugins: [myPlugin],
	// strict: true,
});

store.registerModule('params', paramsModule);
store.registerModule('socket', socketModule);
store.registerModule('widget', widgetModule);
// store.registerModule("pa", paState);
export {
	store,
	dashboardModule,
	envModule,
	rtmModule,
	paModule,
	paramsModule,
	socketModule,
	widgetModule,
};
//
// store.state.a // -> moduleA'의 상태
// store.state.b // -> moduleB'의 상태
