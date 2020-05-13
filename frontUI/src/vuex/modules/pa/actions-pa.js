import * as types from './mutation-types-pa';

export default {
	sample: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.SAMPLE0, data);
	},
};
