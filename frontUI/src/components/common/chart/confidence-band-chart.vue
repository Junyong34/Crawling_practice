<template>
	<div style="height: 100%">
		<v-chart :options="option" :auto-resize="autoResize" />
	</div>
</template>

<script>
import ECharts from './eCharts';

export default {
	name: 'confidence-band-chart',
	components: {
		'v-chart': ECharts,
	},
	props: {
		data: {
			type: Array,
			default: () => [],
		},
		autoResize: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			option: {
				title: {
					show: false,
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						animation: false,
					},
					formatter(params) {
						return `${params[2].name}<br />${params[2].value}`;
					},
				},
				grid: {
					height: '300',
					x: '0',
					y: '10',
					right: '10%',
					// left: "3%",
					// right: "4%",
					// bottom: "3%",
					containLabel: true,
				},
				xAxis: {
					type: 'category',
					data: this.data.map(item => item.date),
					axisLabel: {
						formatter(value, idx) {
							const date = new Date(value);

							return idx === 0
								? value
								: [date.getMonth() + 1, date.getDate()].join('-');
						},
					},
					splitLine: {
						show: false,
					},
					boundaryGap: false,
				},
				yAxis: {
					axisLabel: {
						formatter(val) {
							return `${(val - 3) * 100}%`;
						},
					},
					splitNumber: 3,
					splitLine: {
						show: false,
					},
				},
				series: [
					{
						name: 'L',
						type: 'line',
						data: this.data.map(item => item.l + 3),
						lineStyle: {
							normal: {
								opacity: 0,
							},
						},
						stack: 'confidence-band',
						symbol: 'none',
					},
					{
						name: 'U',
						type: 'line',
						data: this.data.map(item => item.u - item.l),
						lineStyle: {
							normal: {
								opacity: 0,
							},
						},
						areaStyle: {
							normal: {
								color: '#ccc',
							},
						},
						stack: 'confidence-band',
						symbol: 'none',
					},
					{
						type: 'line',
						data: this.data.map(item => item.value + 3),
						hoverAnimation: false,
						symbolSize: 6,
						itemStyle: {
							normal: {
								color: '#c23531',
							},
						},
						showSymbol: false,
					},
				],
			},
		};
	},
	computed: {},
	watch: {
		data: {
			handler(a, b) {
				// console.log(a);
			},
		},
	},
	created() {
		// console.log(2);
	},
	mounted() {},
	beforeDestroy() {},
	destroy() {},
	methods: {},
};
</script>

<style lang="scss" scoped></style>
