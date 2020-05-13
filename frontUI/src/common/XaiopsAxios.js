import axios from 'axios';
import moment from 'moment';
import qs from 'qs';

class ServiceCall {
	constructor(props) {
		// 헤더정보
		this.initProperty();
		if (props !== null) {
			this.createAxios(props);
		}
	}

	createAxios(props) {
		Object.keys(props).forEach(key => {
			this[key] = props[key];
		});
		const service = axios.create({
			baseURL: this.URL,
			timeout: 1000 * 60 * 5,
		});
		const resolveFn = this.handleSuccess;
		const errorFn = this.handleError;

		service.interceptors.response.use(resolveFn, errorFn);

		this.service = service;
	}

	reTryOriginalReq(req) {
		return axios(req);
	}

	initProperty() {
		// this.handleSuccess = this.interceptorResolve;
		// this.handleError = this.interceptorReject;
		this.handleSuccess = null;
		this.handleError = null;
		this.URL = '';
		this.HEADERS = '';
		this.TokenType = '';
		this.AccessToken = '';
		this.refreshToken = '';
		this.appEnv = '';
		this.useView = '';
		this.isExternal = false; // 외부요청 인경우
	}

	interceptorResolve = response => response;

	interceptorReject = error => {
		if (error.response.status === 401) {
			return Promise.resolve(this.refreshTokenCall(error));
		}
		return Promise.reject(error);
	};

	refreshTokenCall(error) {
		const originalReq = error.response.config;

		if (this.refreshToken === '') return Promise.reject(error);
		const params = {
			refresh_token: this.refreshToken,
		};

		// 리프레쉬 토큰으로 Token 재발급
		return this.post('/refreshToken', params, (status, response) => {
			this.TokenType = response.token_type;
			this.AccessToken = response.access_token;
			this.refreshToken = response.refresh_token;
			return response;
		}).then(response => {
			originalReq.headers.Authorization = `${response.token_type} ${response.access_token}`;
			return this.reTryOriginalReq(originalReq);
		});
	}

	// 공통 토큰 추가
	// static commonHeaderToken(Token) {
	//     axios.defaults.headers.common.Authorization = `${Token.tokenType} ${Token.accessToken}`;
	// }
	//
	// // 토큰 셋팅 여부 확인
	// static isToken() {
	//     if (axios.defaults.headers.common.Authorization != null) {
	//         return false;
	//     } else {
	//         return true;
	//     }
	// }
	//
	// static clearToken() {
	//     axios.defaults.headers.common.Authorization = null;
	// }

	// response 전에 처리할 로직 집어 넣기
	// handleSuccess = response => response;
	// // 에러코드 처리 vue에서는 라우터에서 할듯 싶음
	// handleError = error => {
	//     // switch (error.response.status) {
	//     //     case 401:
	//     //         this.redirectTo(document, "/");
	//     //         break;
	//     //     case 404:
	//     //         this.redirectTo(document, "/404");
	//     //         break;
	//     //     default:
	//     //         this.redirectTo(document, "/500");
	//     //         break;
	//     // }
	//     console.error(error);
	//     return Promise.reject(error);
	// };
	// // 페이지 이동 처리 현재 사용하지 않음
	// redirectTo = (document, path) => {
	//     // document.location = path;
	// };

	// setApiPath(path) {
	// 	this.path = path;
	// }

	// getParamString(param) {
	//     let paramStr = "";
	//
	//     switch (typeof param) {
	//         case "string":
	//             paramStr = param;
	//             break;
	//         case "object":
	//             if (Object.keys(param).length === 0) {
	//                 break;
	//             } else {
	//                 const paramArr = [];
	//
	//                 for (const value in param) {
	//                     paramArr.push(`${value}=${param[value]}`);
	//                 }
	//                 paramStr = paramArr.join("&");
	//             }
	//             break;
	//         default:
	//             break;
	//     }
	//     return paramStr;
	// }
	authErrorRecursive(error, callback, method) {
		// this.path = error.request.response.path;
		return this[method](error.response.config.params, callback);
		// const timer = setTimeout(() => {
		// 	this.path = error.request.response.path;
		// 	return this.get(error.response.config.params, callback).finally(() => {
		// 		clearTimeout(timer);
		// 	});
		// }, 1); // 토큰 발급로 직 시간 18ms정도 평균 걸림
	}
	get(url, payload, callback, contentType = 'application/json', responseType = 'json') {
		return this.service
			.request({
				method: 'get',
				url: url + `?${qs.stringify(payload)}`,
				responseType,
				// params: qs.stringify(payload),
				headers: {
					'Content-Type': contentType,
					Authorization: `${this.TokenType} ${this.AccessToken}`,
				},
			})
			.then(response => callback(response.status, response.data))
			.catch(error => {
				// const errorCode = !error.response.data.code ? 'NoCode' : error.response.data.code;
				// // 토큰 만료면 다시 재귀 호출한다
				// if (error.response.status === 401 && errorCode === 'JWT_000') {
				// 	return this.authErrorRecursive(error, callback);
				// }
				ServiceCall.servletError(error, this.appEnv, this.useView, this.isExternal);
				// return error.response.data;
				return new Promise((resolve, reject) => {
					reject(error);
				});
			});
	}

	patch(url, payload, callback, contentType = 'application/json') {
		return this.service
			.request({
				method: 'PATCH',
				url: url,
				responseType: 'json',
				data: payload,
				headers: {
					'Content-Type': contentType,
					Authorization: `${this.TokenType} ${this.AccessToken}`,
				},
			})
			.then(response => callback(response.status, response.data))
			.catch(error => {
				// const errorCode = !error.response.data.code ? 'NoCode' : error.response.data.code;
				// // 토큰 만료면 다시 재귀 호출한다
				// if (error.response.status === 401 && errorCode === 'JWT_000') {
				// 	return this.authErrorRecursive(error, callback);
				// }
				ServiceCall.servletError(error, this.appEnv, this.useView, this.isExternal);
				// return error.response.data;
				return new Promise((resolve, reject) => {
					reject(error);
				});
			});
	}

	post(url, payload, callback, contentType = 'application/json') {
		return this.service
			.request({
				method: 'POST',
				url: url,
				responseType: 'json',
				data: payload,
				headers: {
					'Content-Type': contentType,
					Authorization: `${this.TokenType} ${this.AccessToken}`,
				},
			})
			.then(response => callback(response.status, response.data))
			.catch(error => {
				// const errorCode = !error.response.data.code ? 'NoCode' : error.response.data.code;
				// // 토큰 만료면 다시 재귀 호출한다
				// if (error.response.status === 401 && errorCode === 'JWT_000') {
				// 	return this.authErrorRecursive(error, callback);
				// }
				ServiceCall.servletError(error, this.appEnv, this.useView, this.isExternal);
				// return error.response.data;
				return new Promise((resolve, reject) => {
					reject(error);
				});
			});
	}

	put(url, payload, callback, contentType = 'application/json') {
		return this.service
			.request({
				method: 'PUT',
				url: url,
				responseType: 'json',
				data: payload,
				headers: {
					'Content-Type': contentType,
					Authorization: `${this.TokenType} ${this.AccessToken}`,
				},
			})
			.then(response => callback(response.status, response.data))
			.catch(error => {
				// const errorCode = !error.response.data.code ? 'NoCode' : error.response.data.code;
				// // 토큰 만료면 다시 재귀 호출한다
				// if (error.response.status === 401 && errorCode === 'JWT_000') {
				// 	return this.authErrorRecursive(error, callback);
				// }
				ServiceCall.servletError(error, this.appEnv, this.useView, this.isExternal);
				// return error.response.data;
				return new Promise((resolve, reject) => {
					reject(error);
				});
			});
	}

	delete(url, payload, callback, contentType = 'application/json') {
		return this.service
			.request({
				method: 'DELETE',
				url: url,
				responseType: 'json',
				data: payload,
				headers: {
					'Content-Type': contentType,
					Authorization: `${this.TokenType} ${this.AccessToken}`,
				},
			})
			.then(response => callback(response.status, response.data))
			.catch(error => {
				// const errorCode = !error.response.data.code ? 'NoCode' : error.response.data.code;
				// // 토큰 만료면 다시 재귀 호출한다
				// if (error.response.status === 401 && errorCode === 'JWT_000') {
				// 	return this.authErrorRecursive(error, callback);
				// }
				ServiceCall.servletError(error, this.appEnv, this.useView, this.isExternal);
				// return error.response.data;
				return new Promise((resolve, reject) => {
					reject(error);
				});
			});
	}

	static servletError(error, clog, useNm, isExternal) {
		if (isExternal) {
			console.error(error.request);
		} else if (error.response) {
			const errorType = error.response.data;
			const icon = clog;

			console.group(
				`%c ${icon.error} API error Log Info`,
				`font-weight: bold; font-size: 15px;color: #FF0000;`,
			);
			console.log(useNm);
			console.log(
				`%c ${icon.error} - occurrence time: ${moment(errorType.timestamp).format(
					'YYYY-MM-DD HH:mm:ss',
				)}`,
				'font-size: 13px;color: red;',
			);
			console.log(
				`%c ${icon.error} - HTTP status: ${errorType.status} - error: ${errorType.error}`,
				'font-size: 13px;color: red;',
			);
			console.log(
				`%c ${icon.error} - API Error MSG: ${errorType.message}`,
				'font-size: 13px;color: red;',
			);
			console.log(
				`%c ${icon.error} - Server Error MSG: ${errorType.exception}`,
				'font-size: 13px;color: red;',
			);
			console.log(
				`%c ${icon.error} - API Call Path: ${errorType.path}`,
				'font-size: 13px;color: red;',
			);
			console.log(
				`%c ${icon.error} - CODE: ${errorType.code}`,
				'font-size: 13px;color: red;',
			);
			console.log(`%c ${icon.error} - ParamMap: `, 'font-size: 13px;color: red;');
			Object.keys(errorType.parameterMap).forEach((p, index) => {
				console.log(
					`%c ${icon.error} - Param ${index}: ${p}  :  ${errorType.parameterMap[p].join(
						',',
					)}`,
					'font-size: 13px;color: red;',
				);
			});
		} else if (error.request) {
			console.error(error.request);
		} else {
			console.error('Error', error.message);
		}
		console.groupEnd();
		// console.error(error.config);
	}
}

export default ServiceCall;
