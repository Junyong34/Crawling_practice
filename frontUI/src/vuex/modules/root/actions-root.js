import * as types from './mutation-types-root';

export default {
	setAccessToken: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.ACCESS_TOKEN, data);
	},
	setTokenType: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.TOKEN_TYPE, data);
	},
	activeView: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.ACTIVE_VIEW, data);
	},
	setUserId: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.USER_ID, data);
	},
	menu_list: ({ dispatch, commit, getters, rootGetters }, { data }) => {
		commit(types.MENU_LIST, data);
	},
};
