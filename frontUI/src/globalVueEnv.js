import Vue from 'vue';
import clogSysbols from 'log-symbols';

const isProduction = process.env.NODE_ENV === 'production';

Vue.config.silent = isProduction; // vue의 로그와 경고 출력 여부
Vue.config.devtools = !isProduction; // 개발 도구 툴
Vue.config.errorHandler = (err, vm, info) => {
	/** In case of production replace the functions definition */
	console.error(err);
	console.error(vm);
	console.error(info);
	// 에러 핸들링
	// `type`은 Vue의 에러 타입입니다. 예: 라이프사이클 훅
	// 2.2.0+ 이상에서 사용할 수 있습니다
};

Vue.config.warnHandler = (msg, vm, trace) => {
	console.error(msg);
	console.error(vm);
	console.error(trace);
	// trace는 컴포넌트 계층 구조를 추적합니다.
	// 타임 Vue 경고에 대한 사용자 정의 핸들러를 할당하십시오.
	// 이는 개발 중에만 작동하며 배포시 무시됩니다.
};

Vue.config.performance = !isProduction;
// const version = Number(Vue.version.split(".")[0]);

console.log(
	'%c XAIOps',
	'font-weight: bold; font-size: 50px;color: red; text-shadow: 3px 3px 0 rgb(217,31,38) , 6px 6px 0 rgb(226,91,14) , 9px 9px 0 rgb(245,221,8) , 12px 12px 0 rgb(5,148,68) , 15px 15px 0 rgb(2,135,206) , 18px 18px 0 rgb(4,77,145) , 21px 21px 0 rgb(42,21,113)',
);
console.log(`%c ${clogSysbols.info}#### vue version: ${Vue.version} `, 'color: #4a9663');
