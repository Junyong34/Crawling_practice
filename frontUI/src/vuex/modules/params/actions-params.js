// import moment from 'moment';
// import _ from 'lodash-es';
import moment from 'moment';
import _ from 'lodash-es';
import * as types from './mutation-types-params';

export default {
	setSystemList: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.SYSTEM_LIST, data);
	},
	setTxnList: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.TXN_LIST, data);
	},
	setInstanceList: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.INSTANCE_LIST, data);
	},
	setMetricList: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.METRIC_LIST, data);
	},
	setSystemId: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.SYSTEM_ID, data);
	},
	latelyTime: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.LATELY_TIME, data);
	},
	pause: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.PAUSE, data);
	},
	timeLine: ({ dispatch, commit, getters, rootGetters, state }, { data }) => {
		if (state.pause) return;

		commit(types.TIME_LINE, data);

		const currentTime = moment().format('YYYY-MM-DD HH:mm');
		let targetTime = moment(currentTime).valueOf();

		if (data.length > 0) {
			// 학습된 시간의 인덱스를 찾는다.
			const lastIndex = _.findLastIndex(data, d => {
				return Number(d.type) !== -1;
			});

			if (lastIndex !== -1) {
				targetTime = moment(data[lastIndex].time).valueOf();
			}
		}

		commit(types.LATELY_TIME, new Date(targetTime).valueOf());
	},
	main_layer_popup: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.MAIN_LAYER_POPUP, data);
	},
	anomaly_summary: ({ dispatch, commit, getters, rootGetters }, { data }) => {
		commit(types.ANOMALY_SUMMARY, data);
	},
	failure_count: ({ dispatch, commit, getters, rootGetters }, { data }) => {
		commit(types.FAILURE_COUNT, data);
	},
	selected_master_row: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.SELECTED_MASTER_ROW, data);
	},
	setUserId: ({ dispatch, commit, getters, rootGetters }, data) => {
		commit(types.USER_ID, data);
	},
};
