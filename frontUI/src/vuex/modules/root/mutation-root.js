import * as types from './mutation-types-root';

export default {
	[types.ACCESS_TOKEN]: (state, accessToken) => {
		state.accessToken = accessToken;
	},
	[types.TOKEN_TYPE]: (state, tokenType) => {
		state.tokenType = tokenType;
	},
	[types.USER_ID]: (state, userId) => {
		state.userId = userId;
	},
	[types.ACTIVE_VIEW]: (state, activeView) => {
		state.activeView = activeView;
	},
	[types.MENU_LIST]: (state, menuList) => {
		state.menu_list = menuList;
	},
};
