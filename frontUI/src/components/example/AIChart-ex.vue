<template>
	<div class="ai-monitoring-container">
		<div class="contents-wrapper1">
			<AiChart
				:chart-data="chartData"
				series-type="sub"
				:show-legend="true"
				:chartHeight="150"
				legend-position="right"
			></AiChart>
		</div>
		<div class="contents-wrapper2">
			<AiChart
				:chart-data="chartData2"
				series-type="sub"
				:chartHeight="150"
				:show-legend="true"
				legend-position="right"
			></AiChart>
		</div>
		<div class="contents-wrapper3"></div>
		<div class="contents-wrapper4"></div>
	</div>
</template>
<script>
import defaultMixin from '@/mixins/defaultMixin';
import AiChart from '@/components/common/chart/XAIOpse-chart';
import { mapGetters } from 'vuex';

export default {
	name: 'aiMonitoring',
	mixins: [defaultMixin],
	components: {
		AiChart,
	},
	props: {},
	data() {
		return {
			chartData: [],
			chartData2: [],
			serviceIns: this.$webCaller.serviceIns,
			paramsList: {
				view_1: {
					date: 20200225151700,
					stat: 'active_tx_count',
					sys_id: 2,
					inst_id: 22,
					// interval: 90,
				},
				view_2: {
					date: 20200225151700,
					stat: 'concurrency wait time',
					sys_id: 2,
					inst_id: 21,
					// interval: 90,
				},
			},
		};
	},
	computed: {
		...mapGetters({
			getLatelyTime: 'params/getLatelyTime',
		}),
	},
	watch: {
		getLatelyTime: {
			handler(newDate, oldDate) {
				if (!newDate) return;
				if (newDate === oldDate) return;
				debugger;
				this.paramsList.view_1.date = newDate;
				this.paramsList.view_2.date = newDate;
				this.apiCall();
			},
		},
	},
	created() {
		this.$EventBus.$on(this.$EventBus.type.AI_CHART_CLICK, p => {
			this.$webCaller.repeatTime.clear();
		});
		this.$EventBus.$on(this.$EventBus.type.RELOAD_CALL_25SECS, () => {
			// this.apiCall();
		});
	},
	mounted() {
		this.$webCaller.initRepeatTime();
		this.$nextTick(() => {
			this.$webCaller.addSubscribe('wsEvent', 2, 'alarm', 'alarmData', 'alarmTopic');
			// this.randomData();
			// this.$refs.baseChart.$on('click', param => {
			// 	console.log(param);
			// });
			// this.$refs.baseChart.$on('rendered', param => {
			// 	debugger;
			// 	console.log(param);
			// });
			// this.$refs.baseChart.$on('finished', param => {
			// 	debugger;
			// 	console.log(param);
			// });
		});
	},
	beforeDestroy() {},
	destroyed() {},
	methods: {
		apiCall() {
			this.chartData_1_Call();
			this.chartData_2_Call();
		},
		chartData_1_Call() {
			const params = {
				...this.paramsList.view_1,
			};
			this.serviceIns.get(
				this.$api.instancePerformance().detection,
				params,
				(status, response) => {
					this.chartData = response.data.body;
				},
			);
		},
		chartData_2_Call() {
			const params = {
				...this.paramsList.view_2,
			};
			this.serviceIns.get(
				this.$api.instancePerformance().detection,
				params,
				(status, response) => {
					this.chartData2 = response.data.body;
				},
			);
		},
	},
};
</script>

<style lang="scss" scoped>
.ai-monitoring-container {
	// @include general-grid-container;
	width: 100%;
	height: 100%;
	display: grid;
	grid: {
		template-columns: repeat(2, 1fr);
		template-rows: repeat(3, 1fr);
		column-gap: 5px;
		row-gap: 5px;
	}
	padding: 10px;

	.contents-wrapper1 {
		grid: {
			column: 1/2;
			row: 1/2;
		}
		/*width: 375px;*/
		/*height: 135px;*/
	}

	.contents-wrapper2 {
		grid: {
			column: 2/3;
			row: 1/2;
		}
	}

	.contents-wrapper3 {
		grid: {
			column: 1/3;
			row: 2/3;
		}
	}

	.contents-wrapper4 {
		grid: {
			column: 1/3;
			row: 3/4;
		}
	}
}
</style>
