<style lang="scss" scoped>
.load-pattern-view {
	position: relative;
	display: grid;
	grid-template-rows: 50px auto;
	width: 100%;
	height: 100%;
	border: 1px solid cornflowerblue;

	.header {
		display: flex;
		padding: 0 20px;
		align-items: center;
		justify-content: space-between;
		border: 1px solid cornflowerblue;
	}

	.contents {
		position: relative;
		display: grid;
		width: 100%;
		height: 100%;
		grid-gap: 3px;
		grid-template-rows: 33% 33% 33%;
		grid-template-columns: 49.5% 49.5%;

		/*.radar-chart {*/
		/*display: grid;*/
		/*width: 100%;*/
		/*height: 100%;*/
		/*}*/
	}
}
</style>
<template>
	<div class="load-pattern-view">
		<div class="header">
			<el-date-picker
				v-model="duration"
				type="daterange"
				range-separator="-"
				start-placeholder="Start date"
				end-placeholder="End date"
				value-format="timestamp"
				size="small"
				:picker-options="pickerOption"
				:default-time="defaultTime"
			/>
			<el-button
				type="primary"
				icon="el-icon-search"
				size="small"
				round
				@click="startAnalysis"
				>분 석
			</el-button>
		</div>
		<div class="contents">
			<radar-chart
				v-for="(data, idx) in loadPatternData"
				:key="idx"
				:customChartOptions="customChartOptions"
				:radarData="data"
			></radar-chart>
		</div>
	</div>
</template>
<script>
import moment from 'moment';
import viewMixin from '@/mixins/viewMixin';
import RadarChart from '@/components/common/chart/radar-echart';

export default {
	name: 'LoadPatternView',
	mixins: [viewMixin],
	components: {
		RadarChart,
	},
	props: {},
	data() {
		return {
			serviceIns: this.$webCaller.serviceIns,
			api: {
				uri: this.$api.workloadPattern().train,
				params: {
					inst_id: 34,
					// from_date: '20200405',
					// to_date: '20200406',
				},
			},
			loadPatternData: [],
			customChartOptions: {
				radar: {
					indicator: [
						{ max: 1, text: 'execution count' },
						{ max: 1, text: 'elapsed time' },
						{ max: 1, text: 'cpu time' },
						{ max: 1, text: 'sql elapsed' },
						{ max: 1, text: 'fetch time' },
						{ max: 1, text: 'db connect count' },
						{ max: 1, text: 'remote time' },
						{ max: 1, text: 'exception count' },
					],
				},
			},
			duration: [
				moment(new Date())
					.add(-2, 'd')
					.valueOf(),
				moment(new Date())
					.add(-1, 'd')
					.valueOf(),
			],
			defaultTime: ['00:00:00', '23:59:59'],
			pickerOption: {
				shortcuts: [
					{
						text: '3 Days',
						onClick(picker) {
							const dateStr = picker.maxDate || picker.minDate;
							let start;
							let end;

							if (dateStr) {
								start = new Date(dateStr);
								end = new Date(dateStr);
							} else {
								start = new Date();
								end = new Date();
							}

							start.setTime(start.getTime() - 3600 * 1000 * 24 * 2);
							picker.$emit('pick', [start, end]);
						},
					},
					{
						text: '1 Week',
						onClick(picker) {
							const dateStr = picker.maxDate || picker.minDate;
							let start;
							let end;

							if (dateStr) {
								start = new Date(dateStr);
								end = new Date(dateStr);
							} else {
								start = new Date();
								end = new Date();
							}

							start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
							picker.$emit('pick', [start, end]);
						},
					},
				],
			},
		};
	},
	// computed: {},
	// watch: {},
	created() {
		// const randomData = [];
		// for (let i = 0; i < 5; i++) {
		// 	randomData.push([
		// 		{
		// 			name: `Cluster 0${i + 1}`,
		// 			value: [
		// 				+Math.random().toFixed(2),
		// 				+Math.random().toFixed(2),
		// 				+Math.random().toFixed(2),
		// 				+Math.random().toFixed(2),
		//
		// 				+Math.random().toFixed(2),
		// 				+Math.random().toFixed(2),
		// 				+Math.random().toFixed(2),
		// 				+Math.random().toFixed(2),
		// 			],
		// 		},
		// 	]);
		// }
		// this.loadPatternData = randomData;
	},
	// mounted() {
	// 	this.$nextTick(() => {});
	// },
	// beforeDestroy() {},
	// destroyed() {},
	methods: {
		startAnalysis() {
			const params = this.api.params;
			const startDate = this.duration[0];
			const endDate = this.duration[1];

			params.from_date = moment(startDate).format('YYYYMMDD');
			params.to_date = moment(endDate).format('YYYYMMDD');
			this.requestData();
		},
		requestData() {
			const serviceIns = this.serviceIns;
			const api = this.api;

			// serviceIns.setApiPath(serviceApiUri);
			this.$emit('data-wait', true);
			serviceIns.post(api.uri, api.params, (status, res) => {
				try {
					if (status === 200 && res) {
						if (res.success) {
							this.loadPatternData = res.data;
						} else {
							console.error(`500 Server Error : ${res.message}`);
						}
						this.$emit('data-wait', false);
					} else {
						this.$emit('data-wait', false);
					}
				} catch (e) {
					console.log(e);
				}
			});
		},
	},
};
</script>
