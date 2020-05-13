import * as types from './mutation-types-rtm';

export default {
	sample: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.SAMPLE0, data);
	},
};
