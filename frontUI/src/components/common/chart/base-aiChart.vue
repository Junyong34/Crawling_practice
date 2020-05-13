<template>
	<div class="base-main" :style="{ height: `${this.chartHeight}px` }">
		<div :class="computedClassName" :style="computedStyle">
			<v-chart :options="chartOption" ref="baseAiChart" :auto-resize="autoResize" />
		</div>
		<div
			v-if="showLegend && legendPosition === 'right'"
			style="float: right; width: 120px; height: 100%; text-align: left"
		>
			<ai-chart-legend
				show-legend="show-legend"
				:legend-position="legendPosition"
				:legend-list="legendData"
				@legend-click="filterSeries"
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
	width: calc(100% - 120px);
	/*margin: 0 10px;*/
	/*padding-bottom: 10px;*/
}
</style>
<script>
import moment from 'moment/moment';
import ECharts from './eCharts';
import chartUtil from './chartUtil';
import AiChartLegend from './aiChart-legend';

export default {
	name: 'baseAiChart',
	components: {
		AiChartLegend,
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
		headerData: {
			type: Object,
			default: () => {},
		},
		cursorType: {
			type: String,
			default: '',
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
				return moment(value).format('HH:mm');
			},
		},
		yAxisFormatter: {
			type: Function,
			default: value => value,
		},
		seriesList: {
			type: Array,
			default: () => [],
		},
		seriesType: {
			type: String,
			default: 'main',
		},
		tooltipFormatter: {
			type: Function,
			default: params => {
				if (!params) return;
				let obj = [];
				obj.push(`<div style="width: 100%; text-align: center; font-weight: bold">`);
				obj.push(`Time ${moment(params[0].axisValue).format('HH:mm')}</div>`);
				if (params[0].seriesId === 'sub') {
					// params.forEach((param, index) => {
					obj.push(`<div style="display: flex; justify-content: space-between">`);
					obj.push(
						`<span>${params[0].marker} ${params[0].seriesName}&emsp;&emsp;</span>`,
					);
					obj.push(`<span>${params[0].value[1]}</span></div>`);

					obj.push(`<div style="display: flex; justify-content: space-between">`);

					obj.push(`<span><span style=" width: 10px;
						height: 10px;display: inline-block; margin-right: 5px;
						border: dotted 0.5px #dadada;border-radius:10px;
						background-color: rgba(81, 176, 187, 0.5);"></span> normal range&emsp;&emsp;</span>`);
					obj.push(`<span>${params[2].value[3]} ~ ${params[5].value[3]}</span></div>`);
				} else if (params[0].seriesId === 'main') {
					if (params[0].value[1]) {
						// 현재값
						obj.push(`<div style="display: flex; justify-content: space-between">`);
						obj.push(
							`<span>${params[0].marker} ${params[0].seriesName}&emsp;&emsp;</span>`,
						);
						obj.push(`<span>${params[0].value[1]}</span></div>`);
					}

					if (params[0].value[2] || params[1].value[2]) {
						// 기본밴드
						obj.push(`<div style="display: flex; justify-content: space-between">`);

						obj.push(`<span><span style=" width: 10px;
						height: 10px;display: inline-block; margin-right: 5px;
						border: dotted 0.5px #dadada;border-radius:10px;
						background-color: rgba(81, 176, 187, 0.5);"></span> normal range&emsp;&emsp;</span>`);
						obj.push(
							`<span>${params[0].value[2] || 0} ~ ${params[1].value[2] ||
								0}</span></div>`,
						);
					}
					if (params[4]?.value[3]) {
						// 예측값
						obj.push(`<div style="display: flex; justify-content: space-between">`);
						obj.push(
							`<span>${params[4].marker} ${params[4].seriesName}&emsp;&emsp;</span>`,
						);
						obj.push(`<span>${params[4].value[3]}</span></div>`);
					}
					if (params[6]?.value[4] || params[7]?.value[4]) {
						// 예측값
						// 예측 밴드

						obj.push(`<div style="display: flex; justify-content: space-between">`);

						obj.push(`<span><span style=" width: 10px;
  height: 10px;display: inline-block; margin-right: 5px;
  border: solid 0.5px #ffde00;border-radius:10px;
  background-color: rgba(255,214,0,0.52);"></span> predict range&emsp;&emsp;</span>`);
						obj.push(
							`<span>${params[6].value[4] || 0} ~ ${params[7].value[4] ||
								0}</span></div>`,
						);
					}
				} else {
					// params.forEach((param, index) => {
					obj.push(`<div style="display: flex; justify-content: space-between">`);
					obj.push(
						`<span>${params[0].marker} ${params[0].seriesName}&emsp;&emsp;</span>`,
					);
					obj.push(`<span>${params[0].value[1]}</span></div>`);

					obj.push(`<div style="display: flex; justify-content: space-between">`);

					if (params[0]?.value[2] || params[3]?.value[2]) {
						obj.push(`<span><span style=" width: 10px;
						height: 10px;display: inline-block; margin-right: 5px;
						border: dotted 0.5px #dadada;border-radius:10px;
						background-color: rgba(81, 176, 187, 0.5);"></span> normal range&emsp;&emsp;</span>`);
						obj.push(
							`<span>${params[0].value[2]} ~ ${params[3].value[2]}</span></div>`,
						);
					}
				}
				return obj.join('');
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
			default: 3,
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
			legendList: {
				currentVal: {
					name: ['currentVal'],
					label: this.$t('AiChart.currentValue'),
					isSelected: false,
					color: '#b29bff',
				},
				predictVal: {
					name: ['predictVal'],
					label: this.$t('AiChart.predictedValue'),
					isSelected: false,
					color: '#ff534e',
				},
				band: {
					name: ['band'],
					label: this.$t('AiChart.normalRange'),
					isSelected: false,
					color: 'rgba(81, 176, 187, 0.5)',
				},
				predictBand: {
					name: ['predictBand'],
					label: this.$t('AiChart.predictRange'),
					isSelected: false,
					color: '#ffde00',
				},
				overFlow: {
					name: ['overflow', 'overflowEffect'],
					label: this.$t('AiChart.anomalyStatus'),
					isSelected: false,
					color: '#FF6259',
				},
			},
			option: {
				animation: false,
				grid: {
					// y: this.chartTitle ? '40' : '20',
					// x: this.titleLeft ? this.titleLeft + 10 : '10%',
					// bottom: '20',
					// right: this.showLegend ? '10%' : '6%',
					y: 10,
					left: '3%',
					right: '1%',
					bottom: 10,
					containLabel: true,
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
					formatter: this.tooltipCreateDom,
					backgroundColor: 'rgba(35, 35, 35, 0.8)',
					borderWidth: 0,
					borderColor: '#ccc',
					padding: 10,
					confine: true,
					textStyle: {
						fontSize: 12,
						color: '#fff',
					},
					showDelay: false,
					// position: this.tooltipPosition,
					axisPointer: {
						type: 'cross',
						animation: false,
						label: {
							show: false,
						},
					},
					extraCssText: 'transition: none',
					transitionDuration: 0,
				},
				xAxis: {
					type: 'category',
					splitNumber: this.splitNumber,
					axisLabel: {
						show: true,
						// margin: this.xAxisRotate ? 35 : 15,
						// rotate: this.xAxisRotate ? 45 : 0,
						margin: 15,
						rotate: 0,
						fontSize: this.axisLabelFontSize,
						textStyle: {
							baseline: 'middle',
							color: '#fff',
						},
						interval: this.xAxisInterval,
						formatter: this.xAxisFormatter,
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: '#a6a6a6',
						},
					},
					splitLine: {
						show: false,
						lineStyle: {
							color: '#515151',
						},
					},
					axisTick: {
						show: true,
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
					axisPointer: {
						show: true,
						lineStyle: {
							type: 'solid',
						},
					},
					axisTick: {
						show: false,
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: '#a6a6a6',
						},
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: '#515151',
						},
					},
					// min: this.yAxisMinMax[0],
					// max: this.yAxisMinMax[1],
					minInterval: this.yAxisMinInterval,
				},
				legend: {
					show: false,
				},
				dataset: {
					source: [],
				},
				series: [],
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
			exceptionColor: '#ffcccc',
			legendData: [],
			clickedLegend: null,
			chartRect: 0,
			source: [],
			dimension: [],
			timer: null,
			anomalyData: [],
		};
	},
	computed: {
		chartOption() {
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
	created() {},
	mounted() {
		this.chartRect = this.$el.getBoundingClientRect();
		this.mixEvents();
		this.onData();
	},
	methods: {
		toolTipDomDataSet(key) {
			const domList = {};
			return domList.key;
		},
		tooltipCreateDom(params) {
			if (!params) return;
			let obj = [];
			obj.push(`<div style="width: 100%; text-align: center; font-weight: bold">`);
			obj.push(`Time ${moment(params[0].axisValue).format('HH:mm')}</div>`);
			if (params[0].seriesId === 'sub') {
				// params.forEach((param, index) => {
				if (params[0].value[1]) {
					obj.push(`<div style="display: flex; justify-content: space-between">`);
					obj.push(
						`<span>${params[0].marker} ${params[0].seriesName}&emsp;&emsp;</span>`,
					);
					obj.push(`<span>${params[0].value[1]}</span></div>`);
				}
				if (params[4].value[3] || params[3].value[3]) {
					obj.push(`<div style="display: flex; justify-content: space-between">`);
					obj.push(`<span><span style=" width: 10px;
						height: 10px;display: inline-block; margin-right: 5px;
						border: dotted 0.5px #dadada;border-radius:10px;
						background-color: rgba(81, 176, 187, 0.5);"></span> normal range&emsp;&emsp;</span>`);
					obj.push(`<span>${params[4].value[3]} ~ ${params[3].value[3]}</span></div>`);
				}
			} else if (params[0].seriesId === 'main') {
				if (params[0].value[1]) {
					// 현재값
					obj.push(`<div style="display: flex; justify-content: space-between">`);
					obj.push(
						`<span>${params[0].marker} ${params[0].seriesName}&emsp;&emsp;</span>`,
					);
					obj.push(`<span>${params[0].value[1]}</span></div>`);
				}
				if (params[2].value[2] || params[3].value[2]) {
					// 기본밴드
					obj.push(`<div style="display: flex; justify-content: space-between">`);

					obj.push(`<span><span style=" width: 10px;
						height: 10px;display: inline-block; margin-right: 5px;
						border: dotted 0.5px #dadada;border-radius:10px;
						background-color: rgba(81, 176, 187, 0.5);"></span> normal range&emsp;&emsp;</span>`);
					obj.push(
						`<span>${params[2].value[2] || 0} ~ ${params[3].value[2] ||
							0}</span></div>`,
					);
				}
				if (params[4].value[3]) {
					// 예측값
					obj.push(`<div style="display: flex; justify-content: space-between">`);
					obj.push(
						`<span>${params[4].marker} ${params[4].seriesName}&emsp;&emsp;</span>`,
					);
					obj.push(`<span>${params[4].value[3]}</span></div>`);
				}

				if (params[6].value[4] || params[7].value[4]) {
					// 예측 밴드
					obj.push(`<div style="display: flex; justify-content: space-between">`);
					obj.push(`<span><span style=" width: 10px;
  height: 10px;display: inline-block; margin-right: 5px;
  border: solid 0.5px #ffde00;border-radius:10px;
  background-color: rgba(255,214,0,0.52);"></span> predict range&emsp;&emsp;</span>`);
					obj.push(
						`<span>${params[6].value[4] || 0} ~ ${params[7].value[4] ||
							0}</span></div>`,
					);
				}
			} else {
				if (params[0].value[1]) {
					obj.push(`<div style="display: flex; justify-content: space-between">`);
					obj.push(
						`<span>${params[0].marker} ${params[0].seriesName}&emsp;&emsp;</span>`,
					);
					obj.push(`<span>${params[0].value[1]}</span></div>`);
				}

				if (params[2].value[2] || params[3].value[2]) {
					obj.push(`<div style="display: flex; justify-content: space-between">`);
					obj.push(`<span><span style=" width: 10px;
						height: 10px;display: inline-block; margin-right: 5px;
						border: dotted 0.5px #dadada;border-radius:10px;
						background-color: rgba(81, 176, 187, 0.5);"></span> normal range&emsp;&emsp;</span>`);
					obj.push(`<span>${params[2].value[2]} ~ ${params[3].value[2]}</span></div>`);
				}
			}
			return obj.join('');
		},
		displayNoData() {
			const chart = this.$refs.baseAiChart;

			chart.refresh();
			chart.mergeOptions(Object.assign({}, this.noData));

			this.timer = setTimeout(() => {
				this.$EventBus.$emit('CHART_COMPLETED', true);
			}, 2000);
		},
		onData() {
			const dataSet = this.chartData;
			const chart = this.$refs.baseAiChart;

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
				const newOption = this.dataParser(dataSet);

				if (newOption !== null) {
					chart.refresh();
					chart.mergeOptions(newOption);
					this.mixActions();
				}
				if (this.showLegend) {
					this.legendData = this.getLegendData();
				}
			}
			this.$EventBus.$emit('CHART_COMPLETED', true);
		},
		dataParser(dataSet) {
			const createSeries = this.mixSeries(this.seriesType);
			const dataParser = this.aiDataParser(Object.assign([], dataSet), createSeries);

			return {
				id: this.seriesType,
				dataset: {
					source: dataParser,
				},
				series: createSeries,
				// xAxis: {
				//     data: time[0].timestamp,
				// },
			};
		},
		mixSeries() {
			return {};
		},
		aiDataParser(dataSet, createSeries) {
			let chartData = dataSet;
			if (this.seriesType === 'main') {
				chartData = this.mainChartDataParser(chartData);
				this.seriesDataInsert(createSeries, 4); // 스케터 데이터 삽입
			} else if (this.seriesType === 'sub') {
				chartData = this.subChartDataParser(chartData);
				this.seriesDataInsert(createSeries, 3); // 스케터 데이터 삽입
			} else {
				chartData = this.overAllChartDataParser(chartData);
				this.seriesDataInsert(createSeries, 2); // 스케터 데이터 삽입
			}
			return chartData;
		},
		decimalPoint(arrayData, num) {
			arrayData.forEach((value, index) => {
				if (index !== 0 && value) value.toFixed(num);
			});
		},
		overAllChartDataParser(dataSet) {
			this.anomalyData = [];
			const resultData = dataSet;
			const endData = [];
			const firstData = [];
			let ix = 0;
			const ixLen = dataSet.length;
			for (ix = 0; ix < ixLen; ix++) {
				const chartData = resultData[ix];
				const lastData = resultData[ixLen - (ix + 1)];

				endData.push([
					lastData[0], // time
					null, // current value
					lastData[3], // band low
				]);
				this.anomalyScatterData(chartData[1], chartData[2], chartData[3], chartData[0]);
				firstData.push([
					chartData[0], // time
					chartData[1], // current value
					chartData[2], // band low
				]);
			}
			return [...firstData, ...endData];
		},
		subChartDataParser(dataSet) {
			this.anomalyData = [];
			const resultData = dataSet;
			const endData = [];
			const firstData = [];
			let ix = 0;
			const ixLen = dataSet.length;
			for (ix = 0; ix < ixLen; ix++) {
				const chartData = resultData[ix];
				const lastData = resultData[ixLen - (ix + 1)];

				endData.push([
					lastData[0], // time
					null, // current value
					null, // movingAvg
					lastData[4], // band low
				]);
				this.anomalyScatterData(chartData[1], chartData[3], chartData[4], chartData[0]);
				firstData.push([
					chartData[0], // time
					chartData[1], // current value
					chartData[2], // movingAvg
					chartData[3], // band low
				]);
			}
			return [...firstData, ...endData];
		},
		mainChartDataParser(dataSet) {
			this.anomalyData = [];
			const resultData = dataSet;
			const endData = [];
			const firstData = [];
			let isConnect = true;
			let ix = 0;
			const ixLen = dataSet.length;
			for (ix = 0; ix < ixLen; ix++) {
				const chartData = resultData[ix];
				const lastData = resultData[ixLen - (ix + 1)];

				endData.push([
					lastData[0], // time
					null, // current value
					lastData[3], // low
					null, // predict value
					lastData[6], // predict low
				]);
				this.anomalyScatterData(chartData[1], chartData[2], chartData[3], chartData[0]);

				// 차트 끊기는거 이어줘야함
				if (chartData[4] !== null && isConnect) {
					isConnect = false;
					const beforeChartData = dataSet[ix - 1];
					const firstConnectData = firstData[firstData.length - 1];
					const endConnectData = endData[ixLen - ix];
					endConnectData[4] = beforeChartData[1];
					// endConnectData[5] = beforeChartData[1];
					firstConnectData[3] = beforeChartData[1];
					firstConnectData[4] = beforeChartData[1];
				}
				firstData.push([
					chartData[0], // time
					chartData[1], // current value
					chartData[2], // low
					chartData[4], // predict value
					chartData[5], // predict low
				]);
			}
			return [...firstData, ...endData];
		},
		anomalyScatterData(currentValue, lowBand, highBand, xAxisData) {
			if (currentValue > highBand && currentValue != null) {
				this.anomalyData.push([xAxisData, currentValue]);
			}
			if (currentValue < lowBand && currentValue != null) {
				this.anomalyData.push([xAxisData, currentValue]);
			}
		},
		setVerticalLine(index) {
			this.$refs.baseAiChart.chart.dispatchAction({
				type: 'showTip',
				seriesIndex: 0,
				dataIndex: index,
			});
		},
		seriesDataInsert(series, index) {
			series[index].data = this.anomalyData; // scatter 고정
			// series[index + 1].data = this.anomalyData; // scatter 고정
			return series;
		},
		mixOption(option) {
			return option;
		},
		mixEvents() {
			this.$refs.baseAiChart.$on('click', param => {
				this.$emit('scatter-click', param);
				// this.$EventBus.$emit(this.$EventBus.type.AI_CHART_CLICK, param);
			});
		},
		mixActions() {},
		// selectLegend() {},
		legendSelected(legendSelect) {
			const legendInfo = [];
			legendSelect.forEach(legend => {
				legendInfo.push(this.legendList[legend]);
			});
			return legendInfo;
		},
		getLegendData() {
			switch (this.seriesType) {
				case 'main':
					return this.legendSelected([
						'currentVal',
						'band',
						'predictVal',
						'predictBand',
						'overFlow',
					]);
				case 'sub':
					return this.legendSelected(['currentVal', 'band', 'overFlow']);
				case 'overall':
					return this.legendSelected(['currentVal', 'band', 'overFlow']);
				default:
				// this.fn_noneTypeData(status, data);
			}
		},
		filterSeries(legend) {
			if (legend.isSelected) {
				legend.name.forEach(l => {
					this.$refs.baseAiChart.dispatchAction({
						type: 'legendUnSelect',
						name: l,
					});
				});
			} else {
				legend.name.forEach(l => {
					this.$refs.baseAiChart.dispatchAction({
						type: 'legendSelect',
						name: l,
					});
				});
			}
		},
	},
	beforeDestroy() {
		if (this.timer) {
			clearTimeout(this.timer);
		}
	},
	destroyed() {},
};
</script>
