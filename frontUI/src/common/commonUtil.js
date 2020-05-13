import { setItem } from '@/common/LocalStorageMemager';

const commonUtil = {
	quantity(input) {
		let output;

		if (typeof input === 'string' || typeof input === 'number') {
			const match = /^(normal|(\d+(?:\.\d+)?)(px|%)?)$/.exec(input);

			output = match ? { value: +match[2], unit: match[3] || undefined } : undefined;
		} else {
			output = undefined;
		}
		return output;
	},
	// hex 코드를 rgb 코드로 변환
	hexToRgb(hex) {
		if (!hex) {
			return false;
		}

		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

		const r = parseInt(result[1], 16);
		const g = parseInt(result[2], 16);
		const b = parseInt(result[3], 16);

		return `${r},${g},${b}`;
	},
	shadeColor(color, percent) {
		const colorVal = color.substr(1);
		const num = parseInt(colorVal, 16);

		const amt = Math.round(2.55 * percent);
		const R = (num >> 16) + amt;
		const G = ((num >> 8) & 0x00ff) + amt;
		const B = (num & 0x0000ff) + amt;

		return `#${(
			0x1000000 +
			(R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
			(G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
			(B < 255 ? (B < 1 ? 0 : B) : 255)
		)
			.toString(16)
			.slice(1)}`;
	},
	optionMixin(opt1, opt2) {
		// TODO - mixin logic
		return Object.assign(opt1, opt2);
	},
	// 비율별 스케일 값을 구한다.
	linearScale(domain, range, clamp) {
		return value => {
			if (domain[0] === domain[1] || range[0] === range[1]) {
				return range[0];
			}
			const ratio = (range[1] - range[0]) / (domain[1] - domain[0]);
			const result = range[0] + ratio * (value - domain[0]);

			return clamp ? Math.min(range[1], Math.max(range[0], result)) : result;
		};
	},
	// 객체 값을 넣으면 get 방식 파마리터 포멧 리턴
	setParam: param => {
		let resultBuffer = '';

		if (Object.keys(param).length === 0) return '';

		for (const value in param) {
			resultBuffer += `${value}=${param[value]}&`;
		}
		return resultBuffer.substring(0, resultBuffer.length - 1);
	},
	// 현재 시간이 0시 기준으로 어느 범위에 속해있는지 반환.
	getTimeRange(currentTime, period) {
		const startTime = currentTime - (currentTime % period);

		return [startTime, startTime + period];
	},
	setToken(serviceIns, token) {
		serviceIns.TokenType = token.tokenType;
		serviceIns.AccessToken = token.accessToken;
		serviceIns.refreshToken = token.refreshToken;
	},
	setGlobalToken(response, vm) {
		const accessTokenDataSet = response.data.token.accessToken;
		const tokenTypeDataSet = response.data.token.tokenType;
		const refreshTokenDataSet = response.data.token.refreshToken;

		// set vuex
		vm.$store.dispatch('params/setAccessToken', accessTokenDataSet);
		vm.$store.dispatch('params/setTokenType', tokenTypeDataSet);
		vm.$store.dispatch('params/setRefreshToken', refreshTokenDataSet);

		// set localStorage
		setItem('accessToken', accessTokenDataSet);
		setItem('refreshToken', refreshTokenDataSet);
		setItem('tokenType', tokenTypeDataSet);
	},
	errorCode(msgCode) {
		switch (msgCode) {
			case 'JWT_001':
				return 'reThe valid token has expired. Please log in again';
			case 'JWT_000':
				return '';
			default:
		}
	},
};
// insignary color palette

export default commonUtil;
export const eventNameTable = {
	TOPOLOGY_NODE_FOCUS: 'EVENT_TOPOLOGY_NODE_FOCUS',
	TOPOLOGY_NODE_CONTEXTMENU: 'EVENT_TOPOLOGY_NODE_CONTEXTMENU',
	TOPOLOGY_UPDATE_LAYOUT: 'EVENT_TOPOLOGY_UPDATE_LAYOUT',
};
export const insignaryColor = {
	grade: {
		A: '#68ffbe',
		B: '#fff66d',
		C: '#ff9f48',
		D: '#ff3868',
	},
	securityRisk: {
		critical: '#ff440c',
		high: '#ff7d00',
		medium: '#ffae00',
		low: '#ffde00',
	},
	license: {
		protective: '#ff440c',
		permissive: '#ffae00',
		others: '#ffde00',
	},
};
