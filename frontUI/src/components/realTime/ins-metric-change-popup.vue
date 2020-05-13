<template>
	<div class="chart-change-popup-container">
		<div class="contents-wrapper">
			<div class="instance-box">
				<label for="instanceId">
					<span>인스턴스 :</span>
				</label>
				<el-select
					v-model="instanceName"
					id="instanceId"
					size="small"
					@change="instanceIdChange"
				>
					<el-option
						v-for="instanceId in InsList"
						:label="instanceId.name"
						:key="instanceId.inst_id"
						:value="instanceId"
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
		inst: Object,
		metric: Object,
	},
	data() {
		return {
			InsList: [],
			instanceName: this.inst.name,
			instanceData: this.inst,
			metricData: this.metric,
			isPredict: this.predict,
			// metricId: this.stat,
			metricName: this.metric.metric_name + ` (${this.metric.unit})`,
			metricList: [],
			serviceIns: this.$webCaller.serviceIns,
			initType: this.type,
		};
	},
	computed: {
		...mapGetters({
			getInstanceList: 'params/getInstanceList',
			getMetricList: 'params/getMetricList',
			getTxnList: 'params/getTxnList',
			getSystemId: 'params/getSystemId',
		}),
	},
	watch: {
		getInstanceList: {
			handler(data) {
				this.instanceFilter(data);
			},
			immediate: true,
		},
		getMetricList: {
			handler(data) {
				this.metricFilter(data);
			},
			immediate: true,
		},
		getTxnList: {
			handler(data) {},
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
		instanceIdChange(inst) {
			this.instanceData = inst;
			this.instanceName = inst.name;
			this.metricFilter(this.getMetricList);
			this.selectMetric();
		},
		metricIdChange(metric) {
			this.metricData = metric;
			this.metricName = metric.metric_name + ` (${metric.unit})`;
		},
		instanceFilter(list) {
			if (this.type === 'all') {
				this.InsList = list.filter(inst => {
					return inst.sys_id === this.getSystemId;
				});
			} else {
				this.InsList = list.filter(inst => {
					return inst.type === this.type && inst.sys_id === this.getSystemId;
				});
			}
			// this.instanceData = list.filter(inst => {
			// 	return inst.inst_id === Number(this.instId);
			// })[0];
		},
		metricFilter(list) {
			this.metricList = list.filter(metric => {
				return (
					metric.inst_type === this.instanceData.type && metric.predict === this.isPredict
				);
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
						inst: this.instanceData,
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
