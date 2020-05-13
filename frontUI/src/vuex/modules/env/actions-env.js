import * as types from './mutation-types-env';

export default {
	sample: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.SAMPLE0, data);
	},
};
