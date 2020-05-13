import EnvConfig from '@/env/config.env';
import Service from '@/common/XaiopsAxios';
import rtmModule from '@/common/rtm/ServletDataModule';
import addDataVuex from '@/common/DataManger/SocketDataAddVuex';
// import moment from 'moment/moment';
import { getItem } from '@/common/LocalStorageMemager';
import WebWorker from './manager.worker';
import repeatInterval from './intervalTimer';
// import WebWorker from "worker-loader?publicPath=js/worker/!./XAI.worker";
import widgetModule from './dashboard/widgetServletDataModule';
import * as ServletType from './ServletType';

// import {getItem} from "@/common/LocalStorageMemager";

class WebService {
	constructor() {
		// 헤더정보
		this.initProperty();
		// Object.keys(props).forEach(key => {
		//     this[key] = props[key];
		// });
		// this.initRepeatTime();
		this.initWorker();
		this.refreshToken();
		this.workEventListener();
	}

	initProperty() {
		this.name = 'worker';
		this.ip = EnvConfig.servletURL;
		this.vm = null;
		this.socketUrl = `${EnvConfig.socketURL}`;
		this.token = Object.create(null);
		this.isSocketConn = false;
		// this.TokenKeyName = "";
		// this.socketUrl = "10.10.30.20:8081/ui-server-websocket";
	}

	initRepeatTime() {
		this.repeatTime = new repeatInterval();
		this.reload25s();
		this.rtmTimeCall();
	}
	reload25s() {
		this.repeatTime.clear('reCall');
		this.repeatTime.repeat(
			'25 secs',
			() => {
				// this.reloadHandler();
				this.rtmTimeCall();
			},
			'reCall',
		);
	}
	setVmConfig({ vm }) {
		this.vm = vm;
		rtmModule.vm = vm;
		widgetModule.vm = vm;
	}

	// 최초 로그인에서 실행
	// settingToken(TOKEN) {
	// if (Service.isToken()) {
	//     Service.commonHeaderToken(TOKEN);
	// }
	// 토큰 할당
	// this.setToken();
	// }
	initServlet() {
		// this.refreshToken();
		const commonInfo = {
			URL: `${this.ip}`,
			appEnv: window.appEnv.clog,
			useView: 'main',
			handleSuccess: this.handleSuccess,
			handleError: this.handleError,
		};

		this.serviceIns = new Service(commonInfo);
		this.userId = getItem('userId');
		rtmModule.$http = this.serviceIns;
		widgetModule.$http = this.serviceIns;
		// this.serviceIns.useView = "main";
		// this.setToken();
	}
	initSocket() {
		// reload 패킷만 기본적으로 실행한다.
		const config = {
			ip: this.ip,
			type: 'connect',
			socketUrl: this.socketUrl,
		};

		addDataVuex.vm = this.vm;
		this.worker.postMessage(config);
		this.isSocketConn = true;
	}

	socketClose() {
		const config = { ip: this.ip, type: 'close', socketUrl: this.socketUrl };

		this.isSocketConn = false;
		this.worker.postMessage(config);
	}

	addSubscribe(type, param, urlInfo, key, subKey) {
		// key값으로 구분 여부
		const config = {
			ip: this.ip,
			type: 'subscribe',
			socketUrl: this.socketUrl,
			typeSubcribe: type, // ws, wsEvent  ws는 화면별 wsEvent 개인별
			subKey: subKey != null ? subKey : null, // subscribe key 값 삭제 시 나중에 unsubscribe
			key,
			urlInfo, // metric
			param,
		};

		this.worker.postMessage(config);
	}
	handleSuccess = response => response;

	handleError = error => {
		const errorData = {
			isHttpError: true,
			response: {
				data: error.response.data,
				status: error.response.status,
			},
		};

		// const errorCode = !error.response.data.code ? 'NoCode' : error.response.data.code;
		this.httpErrorMsg(errorData);
		// if (error.response.status === 401 && errorCode === 'JWT_000') {
		// 	if (this.isReTokenCall) {
		// 		this.isReTokenCall = false;
		// 		return this.refreshTokenCall(error);
		// 	}
		// } else {
		// 	this.httpErrorMsg(errorData);
		// }
		// 에러 메시지
		return Promise.reject(error);
	};
	deleteSubscribe(type, subKey) {
		// 특정 key만 삭제 or 전부 삭제 type으로 구분
		const config = {
			ip: this.ip,
			type: 'unsubscribe',
			socketUrl: this.socketUrl,
			typeSubcribe: type, // ket, all
			subKey: subKey != null ? subKey : null, // subscribe key 값 삭제 시 나중에 unsubscribe
		};

		this.worker.postMessage(config);
	}
	rtmTimeCall() {
		const URL = this.vm.$api.timeLine().timeLine;
		this.initSingleServlet(URL, {}, ServletType.TIME_LINE);
	}
	// 새로고침 토큰 셋팅
	refreshToken() {
		// if (Service.isToken()) {
		//     Service.commonHeaderToken(this.token);
		// }
	}

	initWorker() {
		this.worker = new WebWorker();
		rtmModule.$worker = this.worker;
		widgetModule.$worker = this.worker;
	}

	initSingleServlet(URL, PARAM, type) {
		// this.setToken();
		const config = {
			PARAM,
			URL,
			type,
		};
		rtmModule.singleCaller(config);
	}
	widgetServlet(setting) {
		const config = {
			WIDGET_INFO: setting,
		};
		widgetModule.widgetApiCall(config);
	}

	workEventListener() {
		this.worker.addEventListener('message', event => {
			if (event.data.callType === 'servletMsg') {
				this.httpData(event.data);
			} else {
				// 소켓 값 리턴
				this.socketOnMsg(event.data);
			}
			// if (event.data.isError) {
			//     this.handleError(event.data);
			// } else if (event.data.callType === "servletMsg") {
			//     // 서블릿 값 리턴
			//     this.workerOnMsg(event.data);
			// } else if (event.data.viewType === "widget") {
			//     this.widgetData(event.data);
			// } else {
			//     // 소켓 값 리턴
			//     this.socketOnMsg(event.data);
			// }
		});
	}
	widgetReload() {
		// if (this.vm.$store.state.params.activeView.meta.triggerBus) {
		this.vm.$EventBus.$emit('DASHBOARD_TRIGGER', {
			type: 'recall',
		});
		// }
	}
	reloadHandler() {
		this.vm.$EventBus.$emit(this.vm.$EventBus.type.RELOAD_CALL_25SECS, {
			type: 'recall',
		});
	}

	httpData = data => {
		const dataType = data.type;
		switch (dataType) {
			case ServletType.ALARM_CHANNEL:
				return this.vm.$store.dispatch('rtm/node_list', data);
			case ServletType.TIME_LINE:
				return this.vm.$store.dispatch('params/timeLine', data);
			default:
				console.log('not Working Data', data);
		}
		return null;
	};

	socketOnMsg = data => {
		const dataType = data.key;
		// const activeView = this.vm.$store.state.params.activeView.name;

		switch (dataType) {
			case 'metric':
				addDataVuex.metricDataUpdate(data);
				// this.reloadServlet(activeView, dataType);
				break;
			case 'alarmData':
				addDataVuex.addUserAlertData(data);
				break;
			default:
				break;
		}
	};
	httpErrorMsg(msg) {
		this.vm.$EventBus.$emit(this.vm.$EventBus.type.HTTP_ERROR_MSG, msg);
	}

	workerClose() {
		this.worker.terminate();
		this.worker = null;
	}

	clearToken() {}
}

export default WebService;
