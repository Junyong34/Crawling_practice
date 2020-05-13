<template>
	<div class="base-main" :style="{ height: `${this.chartHeight}px` }">
		<div v-if="showLegend && legendPosition === 'top'">
			<base-chart-legend
				show-legend="show-legend"
				:legend-position="legendPosition"
				:legend-data="legendData"
			/>
		</div>
		<div :class="computedClassName" :style="computedStyle">
			<v-chart :options="chartOption" ref="baseChart" :auto-resize="autoResize" />
		</div>
		<div
			v-if="showLegend && legendPosition === 'left'"
			style="float: right; width: 120px; text-align: left"
		>
			<base-chart-legend
				show-legend="show-legend"
				:legend-position="legendPosition"
				:legend-data="legendData"
			/>
		</div>
	</div>
</template>
<style scoped>
.base-main {
	width: 100%;
	position: relative;
}
.base-chart {
	position: absolute;
	width: 100%;
}
.base-chart-legend-top {
	position: absolute;
	width: 96%;
}
.base-chart-legend-right {
	position: absolute;
	width: 98%;
	margin: 0 10px;
	padding-bottom: 10px;
}
</style>
<script>
import moment from 'moment/moment';
import ECharts from './eCharts';
import chartUtil from './chartUtil';
import BaseChartLegend from './base-chart-legend';

export default {
	name: 'baseChart',
	components: {
		BaseChartLegend,
		'v-chart': ECharts,
	},
	props: {
		axisLabelFontSize: {
			type: Number,
			default: 11,
		},
		chartBackground: {
			type: String,
			default: 'transparent',
		},
		chartData: {
			type: Array,
			default: () => [],
		},
		chartTitle: {
			type: String,
			default: '',
		},
		chartHeight: {
			type: Number,
			default: 120,
		},
		titleLeft: {
			type: Number,
			default: 30,
		},
		chartThreshold: {
			type: Array,
			default: () => [],
		},
		chartColor: {
			type: Array,
			default: () => chartUtil.defaultColor,
		},
		showLegend: {
			type: Boolean,
			default: false,
		},
		xAxisFormatter: {
			type: Function,
			default: value => {
				const date = new Date(+value);

				return value === '0' ? '' : moment(date).format('HH:mm:ss');
			},
		},
		yAxisFormatter: {
			type: Function,
			default: value => value,
		},
		tooltipFormatter: {
			type: Function,
			default: params => {
				const MAX_COUNT = 5;
				const maxLimit = params.length >= MAX_COUNT ? MAX_COUNT : params.length;
				let html = '';
				let obj = [];

				for (let ix = 0, ixLen = params.length; ix < ixLen; ix++) {
					const param = params[ix];
					const data = Number(param.data[param.seriesName]).toFixed(2);
					const content = `${param.marker}${param.seriesName} : ${data} <br/>`;
					const jx = ix + 1;
					const date = moment(param.axisValue * 1).format('YYYY-MM-DD HH:mm:ss');

					if (ix === 0) {
						html += `<div style="text-align: center;"><b>${date}</b><br/></div><div style='display:flex;'>`;
					}
					obj.push(content);

					if (jx % maxLimit === 0) {
						html += `<div style='float:right; padding-right: 5px'>${obj.join(
							'',
						)}</div>`;
						obj = [];
					} else if (jx === ixLen) {
						html += `<div style='float:right; padding-right: 5px'>${obj.join(
							'',
						)}</div>`;
					}
				}
				return html.concat('</div');
			},
		},
		tooltipPosition: {
			type: Function,
			default: (point, params, dom, rect, size) => {
				const PADDING_RIGHT = 15;
				const [chartWidth, chartHeight] = size.viewSize;
				const clientWidth = dom.clientWidth;
				const clientHeight = dom.clientHeight;
				const [pointX, pointY] = point;
				let relativeX = pointX;
				let relativeY = pointY;

				if (pointX + clientWidth > chartWidth) {
					relativeX = chartWidth - clientWidth - PADDING_RIGHT;
				}

				if (pointY + clientHeight > chartHeight) {
					relativeY = chartHeight - clientHeight;
				}
				return [relativeX, relativeY];
			},
		},
		legendPosition: {
			type: String,
			default: 'left',
		},
		groupName: {
			type: String,
			default: '',
		},
		yAxisMinMax: {
			type: Array,
			default: () => [null, null],
		},
		yAxisScale: {
			type: Boolean,
			default: false,
		},
		yAxisTickShow: {
			type: Boolean,
			default: true,
		},
		xAxisInterval: {
			type: [String, Number],
			default: () => 'auto',
		},
		xAxisTickShow: {
			type: Boolean,
			default: true,
		},
		minChartData: {
			type: Number,
			default: Number.NaN,
		},
		maxChartData: {
			type: Number,
			default: Number.NaN,
		},
		maxPoint: {
			type: Object,
			default: null,
		},
		splitNumber: {
			type: Number,
			default: 5,
		},
		useArea: {
			type: Boolean,
			default: false,
		},
		replaceText: {
			type: String,
			default: 'No Data',
		},
		hideSymbol: {
			type: Boolean,
			default: true,
		},
		// line 타입을 변경하기 위해 사용 ex)"solid, dashed, dotted"
		lineType: {
			type: Array,
			default: () => [],
		},
		autoResize: {
			type: Boolean,
			default: true,
		},
		yAxisMinInterval: {
			type: Number,
			default: 0,
		},
		customGrid: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			option: {
				animation: false,
				grid: {
					y: this.chartTitle ? '40' : '20',
					x: this.titleLeft ? this.titleLeft + 10 : '10%',
					bottom: '20',
					right: this.showLegend ? '10%' : '6%',
				},
				title: {
					text: this.chartTitle,
					textStyle: {
						color: '#fff',
						fontSize: 12,
						fontWeight: 500,
					},
					top: 10,
					left: this.titleLeft,
				},
				tooltip: {
					trigger: 'axis',
					formatter: this.tooltipFormatter,
					backgroundColor: 'rgba(35, 35, 35, 0.8)',
					borderWidth: 0,
					borderColor: '#ccc',
					padding: 10,
					textStyle: {
						fontSize: 12,
						color: '#fff',
					},
					showDelay: false,
					position: this.tooltipPosition,
					axisPointer: {
						animation: false,
					},
					transitionDuration: 0,
				},
				xAxis: {
					type: 'category',
					axisLabel: {
						show: true,
						margin: this.xAxisRotate ? 35 : 15,
						rotate: this.xAxisRotate ? 45 : 0,
						fontSize: this.axisLabelFontSize,
						textStyle: {
							baseline: 'middle',
							color: '#fff',
						},
						interval: this.xAxisInterval,
						formatter: this.xAxisFormatter,
					},
					axisLine: {
						lineStyle: {
							color: '#dfdfdf',
						},
					},
					boundaryGap: false, // 차트 양쪽 축 간격
				},
				yAxis: {
					splitNumber: this.splitNumber,
					axisLabel: {
						show: true,
						fontSize: this.axisLabelFontSize,
						textStyle: {
							color: '#fff',
						},
						formatter: this.yAxisFormatter,
					},
					axisLine: {
						lineStyle: {
							color: '#dfdfdf',
						},
					},
					axisPointer: { show: false },
					splitLine: {
						lineStyle: {
							color: '#555',
						},
					},
					min: this.yAxisMinMax[0],
					max: this.yAxisMinMax[1],
					minInterval: this.yAxisMinInterval,
				},
				legend: {
					show: false,
				},
				dataset: {
					source: [],
				},
				series: [
					{
						type: 'line',
					},
				],
			},
			noData: {
				title: {
					show: true,
					textStyle: {
						color: '#fff',
						fontSize: 13,
						fontWeight: 300,
						fontFamily: 'Roboto',
					},
					text: this.replaceText,
					left: 'center',
					top: 'center',
				},
			},
			selectLegend: '',
			exceptionColor: '#ffcccc',
			legendData: [],
			clickedLegend: null,
			chartRect: 0,
			source: [],
			dimension: [],
		};
	},
	computed: {
		chartOption() {
			const grid = this.customGrid; // 사이즈를 고정해서 사용할 경우에만 허용

			if (grid !== undefined) {
				return Object.assign(this.option, { grid });
			}
			return this.option;
		},
		computedStyle() {
			return `height: ${this.chartHeight}px; background: ${this.chartBackground};`;
		},
		computedClassName() {
			if (this.showLegend) {
				if (this.legendPosition === 'top') {
					return 'base-chart-legend-top';
				} else {
					return 'base-chart-legend-right';
				}
			} else {
				return 'base-chart';
			}
		},
	},
	watch: {
		chartData: {
			handler() {
				this.onData();
			},
			deep: true,
		},
		chartThreshold: {
			handler() {
				this.onData();
			},
		},
	},
	created() {
		this.$EventBus.$on('SELECT_CHART', this.legendSelected);
	},
	mounted() {
		this.chartRect = this.$el.getBoundingClientRect();
		this.mixEvents();
		this.onData();
	},
	methods: {
		displayNoData() {
			const chart = this.$refs.baseChart;

			chart.refresh();
			chart.mergeOptions(Object.assign({}, this.noData));

			setTimeout(() => {
				this.$EventBus.$emit('CHART_COMPLETED', true);
			}, 2000);
		},
		onData() {
			const dataSet = this.chartData;
			const chart = this.$refs.baseChart;

			if (dataSet === null) {
				// display loading
				chart.refresh();
				chart.mergeOptions(
					Object.assign({}, this.noData, {
						title: {
							text: 'Loading...',
							left: 'center',
							top: 'center',
						},
					}),
				);
				return;
			}

			if (chart && dataSet.length === 0) {
				// display noData
				this.displayNoData();
				return;
			} else if (chart) {
				const newOption = this.fillData(dataSet);

				if (newOption !== null) {
					const mixOption = this.mixOption(newOption);

					chart.refresh();
					chart.mergeOptions(mixOption);
					this.mixActions();
				}
				if (this.showLegend) {
					this.legendData = this.getLegendData();
				}
			}
			this.$EventBus.$emit('CHART_COMPLETED', true);
		},
		fillData(dataSet) {
			const newData = [];
			const option = {
				type: 'line',
				areaStyle: {
					color: 'transparent',
				},
				markPoint: this.maxPoint,
				connectNulls: false,
			};

			if (this.hideSymbol) {
				Object.assign(option, { symbol: 'none' });
			}

			const threshold = [];
			const thresholdData = this.chartThreshold;

			// 임계치 설정
			if (thresholdData.length) {
				for (let jx = 0; jx < thresholdData.length; jx++) {
					const markLineColor = chartUtil.markLineColor[jx];

					if (thresholdData[jx] !== null) {
						threshold.push({
							yAxis: thresholdData[jx],
							lineStyle: {
								color: markLineColor,
							},
						});
					}
				}
			}

			const colors = this.chartColor;

			this.source = [];
			this.dimension = ['time'];
			for (let ix = 0, ixLen = dataSet.length; ix < ixLen; ix++) {
				const { name = null, data, timestamp, units = '' } = dataSet[ix];

				if (name === null) return null; // 빈 배열이 오는 경우에 name 만 체크해서 예외처리
				const changeColor = colors[ix];
				const clone = Object.assign({}, option);
				const mergeSeries = Object.assign(clone, {
					// data: Number.isNaN(data) ? 0 : data,
					// name,
					markLine: {
						data: threshold.length ? threshold : [],
					},
					itemStyle: { color: changeColor },
					lineStyle: {
						width: 1,
						color: changeColor,
						type: this.lineType[ix] || 'solid',
					},
				});

				for (let jx = 0, jxLen = data.length; jx < jxLen; jx++) {
					const values = {};
					const findValue = this.source.filter(v => v.time === timestamp[jx]);
					const findIndex = this.source.findIndex(v => v.time === timestamp[jx]);
					const unit = `${name}_unit`;

					values[name] = data[jx];
					values[unit] = units;
					values.time = timestamp[jx];

					if (findValue.length) {
						const merge = Object.assign(findValue[0], values);

						this.source[findIndex] = merge;
					} else {
						this.source.push(values);
					}
				}

				this.dimension.push(name);
				this.mixSeries(mergeSeries, ix);
				newData.push(mergeSeries);
			}

			if (!Number.isNaN(this.minChartData)) {
				newData.push({
					name: 'min',
					type: 'line',
					data: new Array(dataSet[0].data.length).fill(this.minChartData),
					lineStyle: {
						normal: {
							opacity: 0,
						},
					},
					stack: 'confidence-band',
					symbol: 'none',
				});
			}

			if (!Number.isNaN(this.maxChartData && !Number.isNaN(this.minChartData))) {
				newData.push({
					name: 'max',
					type: 'line',
					data: new Array(dataSet[0].data.length).fill({
						origin: { value: this.maxChartData },
						value: this.maxChartData - this.minChartData,
					}),
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
				});
			}
			const time = dataSet.filter(v => {
				if (!Number.isNaN(v.timestamp)) {
					return v.timestamp.length > 0;
				}
				return [];
			});

			if (time.length === 0) {
				this.displayNoData();
				return null;
			}
			return {
				dataset: {
					dimensions: this.dimension,
					source: this.source,
				},
				series: newData,
				// xAxis: {
				//     data: time[0].timestamp,
				// },
			};
		},
		legendSelected(payload) {
			if (this.selectLegend === payload) {
				this.selectLegend = null;
			} else {
				this.selectLegend = payload;
			}
			this.onData();
		},
		setVerticalLine(index) {
			this.$refs.baseChart.chart.dispatchAction({
				type: 'showTip',
				seriesIndex: 0,
				dataIndex: index,
			});
		},
		mixSeries(series, index) {
			return series;
		},
		mixOption(option) {
			return option;
		},
		mixEvents() {},
		mixActions() {},
		getLegendData() {
			const colors = this.chartColor;
			const result = [];

			this.chartData.map((v, index) =>
				result.push({
					name: v.name,
					index,
					color: colors[index],
				}),
			);

			return result;
		},
	},
	beforeDestroy() {},
	destroyed() {
		this.$EventBus.$off('SELECT_CHART', this.legendSelected);
	},
};
</script>
