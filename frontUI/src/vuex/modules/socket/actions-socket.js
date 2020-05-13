import * as types from './mutation-types-socket';

export default {
	user_alert_data: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.USER_ALERT_DATA, data);
	},
};
