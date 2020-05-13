import * as types from './mutation-types-socket';

export default {
	[types.USER_ALERT_DATA]: (state, userAlertData) => {
		if (!userAlertData) return;
		const deepCopyObject = JSON.stringify(state.user_alert_data);
		const newData = JSON.parse(deepCopyObject);

		// TODO - 시간값 비교 처리 로직 추가

		if (newData.length < 100) {
			newData.push(userAlertData);
		} else {
			newData.shift();
			newData.push(userAlertData);
		}

		state.user_alert_data = newData;
	},
};
