// import Vue from "vue";
import * as types from '../../mutation-types';

export default {
	[types.POD_SOCKET]: (state, soPod) => {
		state.pod = soPod;
	},
	[types.CONTAINER_SOCKET]: (state, soContainer) => {
		state.pod = soContainer;
	},
};
