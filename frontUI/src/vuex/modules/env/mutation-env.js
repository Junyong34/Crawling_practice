import * as types from './mutation-types-env';

export default {
	[types.SAMPLE0]: (state, sample) => {
		state.sample = sample;
	},
};
