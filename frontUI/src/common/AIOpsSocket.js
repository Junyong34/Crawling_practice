import SocketJS from 'sockjs-client';
import Stomp from 'stompjs';
import socketModule from '@/common/DataManger/SocketDataModule';

class SocketModule {
	constructor(props) {
		// 헤더정보
		this.initProperty();
		Object.keys(props).forEach(key => {
			this[key] = props[key];
		});

		if (this.automaticOpen === true) {
			this.wsOpen();
		}
	}

	initProperty() {
		// Default settings

		// 로그 찍어보는 플래그
		this.debug = false;

		// 웹소켓이 바로 연결 시도 여부
		this.automaticOpen = false;

		// 연결 성공여부
		this.isConneted = false;

		// 재연결 주기
		this.reconnectInterval = 1000;
		// 재연결를 시도 할 수 있는 최대 시간
		this.maxReconnectInterval = 30000;
		// 재연결 지연 증가율. 문제가 지속될 경우 다시 연결 시도 허용
		this.reconnectDecay = 1.5;

		// 연결을 닫고 다시 시도하기 전에 연결에 성공할 때까지 대기할 최대 시간(밀리초).
		this.timeoutInterval = 2000;

		// 최대 재연결 시도 횟수. null인 경우 제한 없음
		this.maxReconnectAttempts = null;

		// 이진 형식; 가능한 값 'blob' 또는 'arraybuffer'; 기본값 'blob'.
		this.binaryType = 'arraybuffer';

		// 연결 url
		this.url = null;

		this.ip = null;

		// 마지막으로 성공?
		this.reconnectAttempts = 0;

		// 연결상태
		this.readyState = WebSocket.CONNECTING;

		this.option = { park: 'AAAA' };

		this.stompClient = null;

		// 프로트콜
		this.protocol = null;

		// 연결된 리스트 정보 담는다.
		this.subscribeList = [];

		// subscribe Map 정보
		this.subscribeDataMap = {};

		this.reloadSubscribe = null;

		this.token = {};

		// 구독 id
		// this.subscribeId = null;

		this.paketInfo();
	}

	paketInfo() {
		this.subscribeURL = {
			alarm: '/topic/send-anomaly-alarm/',
			// metricV2: "/subscribe/metric/v2",
			// reload: "/subscribe/reload",
			// alert: "/subscribe/alert",
		};

		// subscribe key로 관리
		// this.paketKey = ["nodes", "pods", "nodes_pods", "containers"];
	}

	wsOpen() {
		this.ws = new SocketJS(this.url, this.protocol || [], this.option);
		this.stompClient = Stomp.over(this.ws);
		// this.ws = new WebSocket(this.url, this.protocol || []);
		// this.ws.binaryType = this.binaryType;
		// stomp 연결 체크
		this._connect();
		// const localWs = this.ws;
		//
		// this.timeout = setTimeout(() => {
		//     if (this.debug) {
		//         console.debug("ReconnectingWebSocket", "connection-timeout", this.url);
		//     }
		//     localWs.close();
		// }, this.timeoutInterval);
		//
		//
		// this.ws.onopen = event => {
		//     clearTimeout(this.timeout);
		//     if (this.debug) {
		//         console.debug("ReconnectingWebSocket", "onopen", this.url);
		//     }
		//     this.protocol = this.ws.protocol;
		//     this.readyState = WebSocket.OPEN;
		//     this.reconnectAttempts = 0;
		// };
		//
		this.wsClose();
		// this.wsMessage();
		this.wsError();
	}

	_connect() {
		// 값이 없으면 연결  시도
		if (this.stompClient == null) {
			this.wsOpen();
		}
		// 연결이 안되어 있으면 연결
		if (!this.stompClient.connected) {
			// {
			//     headers: {Authorization: `${this.token.tokenType} ${this.token.accessToken}`},
			// }
			this.stompClient.connect({}, frame => {
				this.isConneted = true;
				if (this.debug) {
					console.debug(
						'ReconnectingWebSocket',
						'attempt-connect',
						this.url,
						`Connected: ${frame}`,
					);
				}
				// 리로드, 알람 패킷은 닫지 않음 로그아웃 할때 까지.
				// this.wsReloadSubscribe();
				// this.wsAlertSubscribe();
			});
		}
	}

	// 고정
	wsReloadSubscribe() {
		this.reloadSubscribe = this.stompClient.subscribe(
			this.subscribeURL.reload,
			data => {
				// console.log(this.subscribeList, this.subscribeDataMap);
				// 여기에서 리로드 패킷 들어오면 서블릿 새로 호출
				socketModule.dataType(JSON.parse(data.body));
				// this.subscribeList[0].unsubscribe();
			},
			{},
		);
		// this.subscribeList.push(this.reloadSubscribe);
		// this.subscribeDataMap.reload = this.reloadSubscribe.id;
	}

	// 고정
	wsAlertSubscribe() {
		this.reloadSubscribe = this.stompClient.subscribe(
			this.subscribeURL.alert,
			data => {
				const JsonObject = JSON.parse(data.body);

				socketModule.dataType(JsonObject);
				// console.log(this.subscribeList, this.subscribeDataMap);
				// 여기에서 리로드 패킷 들어오면 서블릿 새로 호출
				// console.log(this.reloadSubscribe, this.subscribeDataMap);
				// console.log(data.body);
				// socketModule.dataType(JSON.parse(data.body));
				// this.subscribeList[0].unsubscribe();
			},
			{},
		);
		// this.subscribeList.push(this.reloadSubscribe);
		// this.subscribeDataMap.reload = this.reloadSubscribe.id;
	}

	// 화면별 메트릭 정보 연결
	wsSubscribe(param, urlInfo) {
		if (this.isConneted) {
			if (this.reConnetws) {
				clearTimeout(this.reConnetws);
			}
			// stomp 연결 체크
			const paramBuffer = SocketModule.paramUrl(param);
			const subscribeURL = this.subscribeURL[urlInfo];

			// const subscribeId = this.stompClient.subscribe(subscribeURL + paramBuffer, data => {
			const subscribeId = this.stompClient.subscribe(subscribeURL + paramBuffer, data => {
				// this.subscribeList[0].unsubscribe();
			});

			this.subscribeList.push(subscribeId);
		} else {
			this.reConnetws = setTimeout(
				this.wsSubscribe.bind(this, param, urlInfo),
				this.timeoutInterval,
			);
		}
	}

	// 화면 이벤트 별 메트릭 정보 연결
	wsEventSubscribe(param, urlInfo, key, subKey) {
		if (this.isConneted) {
			if (this.reConnetWsEvent) {
				clearTimeout(this.reConnetWsEvent);
			}
			// 이미 연결된 subKey가 있으면 제거하고 다시 연결한다.
			this.wsUnsubscribe(subKey);

			const paramBuffer = SocketModule.paramUrl(param);
			const subscribeURL = this.subscribeURL[urlInfo];
			const subscribeId = this.stompClient.subscribe(subscribeURL + paramBuffer, data => {
				// console.log(JSON.parse(data.body), "키값");

				const JsonObject = JSON.parse(data.body);

				// 소켓 데이터 파서 구분 key
				JsonObject.key = key;
				socketModule.dataType(JsonObject);
				// this.subscribeList[0].unsubscribe();
			});

			this.subscribeList.push(subscribeId);
			this.subscribeDataMap[subKey] = subscribeId.id;
			// console.log(this.subscribeDataMap);
		} else {
			this.reConnetWsEvent = setTimeout(
				this.wsEventSubscribe.bind(this, param, urlInfo, key, subKey),
				this.timeoutInterval,
			);
		}
	}

	Allunsubscribe() {
		// 리로드 패킷은 지우지 않는다.
		if (this.subscribeList.length !== 0) {
			this.subscribeList.forEach(topic => topic.unsubscribe());
			// 전부 삭제하고 초기화
			this.subscribeList = [];
			this.subscribeDataMap = {};
		}
	}

	wsUnsubscribe(subKey) {
		const removeKey = this.subscribeList.filter(
			data => data.id === this.subscribeDataMap[subKey],
		);

		if (removeKey.length === 0) return;
		removeKey[0].unsubscribe();
		this.subscribeList = removeKey;
		delete this.subscribeDataMap[subKey];
	}

	wsreloadUnsubscribe() {
		if (!this.reloadSubscribe) {
			return;
		}
		this.reloadSubscribe.unsubscribe();
	}

	_disConneted() {
		this.isConneted = false;
		this.stompClient.disconnect();
	}

	// wsEventSubscribe(param) {
	//     subscribeId[0] = stompClient.subscribe("/user/subscribe/metric/node", data => {
	//         showData(`/user/subscribe/metric/node : ${data.body}`);
	//     }, {nodeId: "asd"});
	// }

	wsClose() {
		this.ws.onclose = () => {
			// clearTimeout(this.timeout);
			// // 초기화 처리
			this.ws = null;
			self.readyState = WebSocket.CONNECTING;
			//
			// if (this.debug) {
			//     console.debug("ReconnectingWebSocket", "onclose", this.url);
			// }
			//
			// const timeout = this.reconnectInterval *
			//     Math.pow(this.reconnectDecay, this.reconnectAttempts);
			//
			// setTimeout(() => {
			//     this.reconnectAttempts++;
			//     this.wsOpen(true);
			// }, timeout > self.maxReconnectInterval ? self.maxReconnectInterval : timeout);
		};
	}

	wsMessage() {
		this.ws.onmessage = event => {
			if (this.debug) {
				console.debug('ReconnectingWebSocket', 'onmessage', this.url, event.data);
			}

			const data = JSON.parse(event.data);

			socketModule.dataType(data);

			// console.log(event.data);
			// 데이터 처리 로직 추가
			// 로직 끝
		};
	}

	wsError() {
		this.ws.onerror = event => {
			if (this.debug) {
				console.debug('ReconnectingWebSocket', 'onerror', this.url, event);
			}
		};
	}

	wsSend(data) {
		if (this.ws) {
			if (this.debug) {
				console.debug('ReconnectingWebSocket', 'send', this.url, data);
			}
			return this.ws.send(data);
		} else {
			console.error('Pausing to reconnect websocket');
			return null;
		}
	}

	wsRefresh() {
		if (this.ws) {
			this.ws.close();
		}
	}

	wsDisconnect() {
		if (this.ws) {
			this.ws.close();
			this.stompClient.disconnect();
		}
	}

	conifg({ url }) {
		this.url = url;
	}

	static paramUrl(paramObj) {
		let paramBuffer = '';

		if (typeof paramObj === 'object') {
			Object.keys(paramObj).forEach(d => {
				// null 처리
				if (!paramObj[d]) {
					paramBuffer += `${d}`;
				} else {
					paramBuffer += `${d}/${paramObj[d]}`;
				}
			});
		} else {
			paramBuffer = paramObj;
		}

		return paramBuffer;
	}
}

export default SocketModule;
