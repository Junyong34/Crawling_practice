<template>
	<div>
		<AiChart
			:chart-data="chartData"
			:header-data="headerData"
			series-type="main"
			:auto-resize="true"
			:show-legend="true"
			legend-position="right"
			:chart-height="chartHeight"
			@scatter-click="clickEvent"
		></AiChart>
	</div>
</template>

<style scoped></style>

<script>
import { mapGetters } from 'vuex';
import AiChart from '@/components/common/chart/XAIOpse-chart';

export default {
	name: 'sample',
	components: { AiChart },
	props: {
		params: {
			type: Object,
			default: () => {},
		},
		viewRect: {
			type: Object,
			default: () => {},
		},
		id: {
			type: String,
			default: '',
		},
		api: {
			type: String,
			default: '',
		},
	},
	watch: {
		getLatelyTime: {
			handler(newDate, oldDate) {
				if (!newDate) return;
				if (newDate === oldDate) return;
				this.chartParams.date = newDate;
				this.apiCall();
			},
		},
	},
	data() {
		return {
			sampleView: '',
			chartData: [],
			chartHeight: 120,
			chartParams: {},
			headerData: null,
			serviceIns: this.$webCaller.serviceIns,
		};
	},
	computed: {
		...mapGetters({
			getLatelyTime: 'params/getLatelyTime',
		}),
	},
	created() {
		// this.$EventBus.$on(this.$EventBus.type.AI_CHART_CLICK, p => {
		// 	console.log(this.headerData.type);
		// });
	},
	mounted() {
		this.$nextTick(() => {
			// console.log(this.params, this.id, this.api);
			this.chartHeight = this.$el.clientHeight;
		});
	},
	methods: {
		loadingCreateList() {
			this.$loading.create(this.i, {
				container: this.$refs[this.i],
			});
		},
		clickEvent(params) {
			console.log(this.headerData.type);
		},
		apiCall() {
			this.chartData_Call();
		},
		chartData_Call() {
			this.chartParams.sys_id = this.params.sys_id;
			this.chartParams.inst_id = this.params.inst_id;
			this.chartParams.stat = this.params.stat;
			this.serviceIns.get(this.api, this.chartParams, (status, response) => {
				this.chartData = response.data.body;
				this.headerData = response.data.header;
			});
		},
	},
	destroyed() {},
};
</script>
