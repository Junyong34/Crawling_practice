<template>
	<div class="chart-change-popup-container">
		<div class="contents-wrapper">
			<div class="instance-box">
				<label for="txnId">
					<span>트랜잭션 :</span>
				</label>
				<el-select v-model="txnName" id="txnId" size="small" @change="txnIdChange">
					<el-option
						v-for="txn in txnList"
						:label="txn.txn_name"
						:key="txn.txn_id"
						:value="txn"
					>
					</el-option>
				</el-select>
			</div>
			<div class="metric-box">
				<label for="metricId">
					<span>지표 :</span>
				</label>
				<el-select v-model="metricName" id="metricId" size="small" @change="metricIdChange">
					<el-option
						v-for="metricId in metricList"
						:label="metricId.metric_name + ' (' + metricId.unit + ')'"
						:key="metricId.metric_name"
						:value="metricId"
					>
					</el-option>
				</el-select>
			</div>
		</div>
		<div class="btns-wrapper">
			<el-button type="close" size="small" @click="closePopup">
				Cancel
			</el-button>
			<el-button type="primary" size="small" @click="onClickSave">
				Save
			</el-button>
		</div>
	</div>
</template>
<script>
import { mapGetters } from 'vuex';
// import _merge from 'lodash/merge';
// import vuexUtil from '@/vuex/vuexUtil';

export default {
	name: 'chart-change-popup',
	components: {},
	props: {
		widgetId: String,
		type: String,
		predict: Boolean,
		uri: String,
		txn: Object,
		metric: Object,
	},
	data() {
		return {
			InsList: [],
			txnName: this.txn.txn_name,
			txnData: this.txn,
			metricData: this.metric,
			isPredict: this.predict,
			// metricId: this.stat,
			metricName: this.metric.metric_name + ` (${this.metric.unit})`,
			metricList: [],
			txnList: [],
			serviceIns: this.$webCaller.serviceIns,
			initType: this.type,
		};
	},
	computed: {
		...mapGetters({
			getTxnList: 'params/getTxnList',
			getMetricList: 'params/getMetricList',
			getSystemId: 'params/getSystemId',
		}),
	},
	watch: {
		getTxnList: {
			handler(data) {
				this.txnFilter(data);
			},
			immediate: true,
		},
		getMetricList: {
			handler(data) {
				this.metricFilter(data);
			},
			immediate: true,
		},
	},
	created() {},
	mounted() {
		this.$nextTick(() => {});
	},
	beforeDestroy() {},
	destroyed() {},
	methods: {
		txnIdChange(txn) {
			this.txnData = txn;
			this.txnName = txn.name;
			this.metricFilter(this.getMetricList);
			this.selectMetric();
		},
		metricIdChange(metric) {
			this.metricData = metric;
			this.metricName = metric.metric_name + ` (${metric.unit})`;
		},
		txnFilter(list) {
			this.txnList = list.filter(txn => {
				return txn.sys_id === this.getSystemId;
			});

			// this.txnData = list.filter(txn => {
			// 	return txn.txn_id === Number(this.txnId);
			// })[0];
		},
		metricFilter(list) {
			this.metricList = list.filter(metric => {
				return metric.inst_type === this.type && metric.predict === this.isPredict;
			});
		},
		selectMetric() {
			this.metricData = this.metricList[0];
			this.metricName = this.metricData.metric_name + ` (${this.metricData.unit})`;
		},
		onClickSave() {
			const data = {
				component: {
					uri: this.uri,
					params: {
						// ...this.params
						txn: this.txnData,
						metric: this.metricData,
					},
				},
			};
			this.$EventBus.$emit('UPDATE_WIDGET', this.widgetId, data, true);
			this.closePopup();
		},

		closePopup() {
			this.$loading.hide(this.widgetId);
			this.$store.dispatch('params/main_layer_popup', { show: false });
		},
	},
};
</script>
<style lang="scss" scoped>
.chart-change-popup-container {
	height: 100%;
	@include flex-align($d: column);

	.contents-wrapper {
		flex: 1;
		padding: 0 10px 0 10px;
		margin-top: 5px;
		@include flex-align($d: column);

		.instance-box {
			flex: 1;
			@include flex-align($a: center);

			> label {
				text-align: right;
				margin-right: 10px;
				flex: 1;
			}

			> div {
				flex: 3;
			}
		}

		.metric-box {
			flex: 1;
			@include flex-align($a: center);

			> label {
				text-align: right;
				margin-right: 10px;
				flex: 1;
			}

			> div {
				flex: 3;
			}
		}
	}

	.btns-wrapper {
		flex: 0.5;
		margin-bottom: 5px;
		@include flex-align($a: center, $j: center);
	}
}
</style>
