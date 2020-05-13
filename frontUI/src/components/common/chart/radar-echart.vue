<style></style>
<template>
	<e-chart :options="chartOptions" ref="chartContainer"></e-chart>
</template>
<script>
import ECharts from '@/components/common/chart/eCharts';
import chartUtil from '@/components/common/chart/chartUtil';

export default {
	name: 'RadarEchart',
	components: {
		'e-chart': ECharts,
	},
	props: {
		replaceText: {
			type: String,
			default: 'No data available',
		},
		indicator: {
			type: Array,
			default: () => [
				{ max: 100, text: 'A' },
				{ max: 100, text: 'B' },
				{ max: 100, text: 'C' },
				{ max: 100, text: 'D' },
				{ max: 100, text: 'E' },
			],
		},
		radarData: {
			type: Array,
			default: () => [
				{
					value: [],
				},
			],
		},
		customChartOptions: {
			type: Object,
			default: () => {},
		},
	},
	// computed: {
	//     chartOption() {
	//         return this.option;
	//     },
	// }
	computed: {
		getChart() {
			return this.$refs.chartContainer.chart;
		},
	},
	data() {
		return {
			defaultChartOptions: null,
			chartOptions: {
				animation: false,
				color: chartUtil.defaultColor,
				radar: [
					{
						indicator: this.indicator,
						max: 1,
						center: ['50%', '50%'],
						// radius: 200,
						startAngle: 90,
						splitNumber: 5,
						shape: 'circle',
						// name: {
						// 	formatter: '【{value}】',
						// 	textStyle: {
						// 		color: '#72ACD1',
						// 	},
						// },
						splitArea: {
							areaStyle: {
								color: [
									'rgba(100, 100, 100, 1)',
									'rgba(100, 100, 100, 0.8)',
									'rgba(100, 100, 100, 0.6)',
									'rgba(100, 100, 100, 0.4)',
									'rgba(100, 100, 100, 0.2)',
								],
								// shadowColor: 'rgba(0, 0, 0, 0.3)',
								// shadowBlur: 10,
							},
						},
						axisLine: {
							lineStyle: {
								// color: 'rgba(255, 255, 255, 1)',
								color: 'rgba(100, 100, 100, 1)',
							},
						},
						splitLine: {
							lineStyle: {
								color: 'rgba(100, 100, 100, 1)',
							},
						},
					},
				],
				title: {
					show: false,
					text: this.replaceText,
					textStyle: {
						color: '#fff',
						fontSize: 14,
						fontWeight: 300,
						fontFamily: 'Roboto',
					},
					left: 'center',
					top: 'center',
				},
				tooltip: {
					trigger: 'item',
					backgroundColor: 'rgba(35, 35, 35, 0.8)',
					borderWidth: 1,
					borderColor: '#ccc',
					padding: 10,
					textStyle: {
						color: '#fff',
					},
				},
				series: [
					{
						type: 'radar',
						symbol: 'circle',
						symbolSize: 5,
						// lineStyle: {
						// 	type: 'dashed',
						// },
						itemStyle: {
							color: '#9449f5',
							// color: 'rgb(100, 100, 255)',
						},
						areaStyle: {
							color: '#9449f5',
							// color: 'rgba(100, 100, 255, 0.5)',
						},
						data: this.radarData,
						// data: [
						//     {
						//         value: [
						//             Math.random(),
						//             Math.random(),
						//             Math.random(),
						//             Math.random(),
						//             Math.random(),
						//             Math.random(),
						//             Math.random(),
						//             Math.random(),
						//         ],
						//     }
						// ],
					},
				],
			},
		};
	},
	watch: {
		indicator: {
			handler(indicator) {
				if (this._isMounted) {
					this.getChart.setOption({
						radar: {
							indicator,
						},
					});
				}
			},
		},
		customChartOptions: {
			handler(opt) {
				if (this._isMounted) {
					const chart = this.getChart;

					chart.setOption(this.defaultChartOptions, true);
					chart.setOption(opt);
				}
			},
		},
	},
	// created() {},
	mounted() {
		this.$nextTick(() => {
			const chart = this.getChart;

			this.defaultChartOptions = chart.getOption();
			chart.on('finished', this.onChartRendered);
			chart.setOption(this.customChartOptions);
		});
	},
	methods: {
		resize(opt) {
			this.getChart.resize(opt);
		},
		onChartRendered() {},
	},
	beforeDestroy() {},
};
</script>
