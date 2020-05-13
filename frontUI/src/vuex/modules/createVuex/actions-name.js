import * as types from '../../mutation-types';

export default {
	pod: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.POD_SOCKET, data);
	},
	container: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.POD_SOCKET, data);
	},
};
