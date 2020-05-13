<template>
	<div class="timeline-chart">
		<v-chart :options="options" auto-resize ref="timelineChart" />
		<div ref="chartTooltip" class="pcm-hi-timeline-tooltip" style="display: none;"></div>
	</div>
</template>

<style lang="scss">
.timeline-chart {
	width: 100%;
	height: 100%;
}
.pcm-hi-timeline-tooltip {
	position: absolute;
	white-space: nowrap;
	z-index: 9999999;
	background-color: rgba(18, 18, 18, 0.85);
	border-radius: 4px;
	color: rgb(204, 204, 204);
	font: 9px/14px 'Microsoft YaHei';
	padding: 5px;
	user-select: none;

	.circle {
		display: inline-block;
		margin-right: 5px;
		border-radius: 10px;
		width: 10px;
		height: 10px;
	}
}
</style>

<script>
import moment from 'moment';
import _ from 'lodash-es';
import ECharts from './eCharts';

export default {
	name: 'timelineChart',
	components: {
		'v-chart': ECharts,
	},
	props: {
		chartData: Array,
		configState: Object,
	},
	data() {
		return {
			isPointerDragging: false,
			isTickClicked: false,
			draggingTickIndex: null,
			options: {
				animation: false,
				grid: {
					height: 11,
					left: 12,
					right: 12,
					bottom: 17,
				},
				tooltip: {
					show: false,
					trigger: 'none',
					triggerOn: 'click',
				},
				xAxis: [
					{
						type: 'category',
						position: 'bottom',
						axisTick: {
							show: false,
						},
						axisLabel: {
							show: true,
							margin: -23,
							color: '#ccc',
							fontSize: 10,
							formatter(tick, index) {
								let ret = '';

								if (index % 10 === 0) {
									ret = `${tick}`;
								}
								return ret;
							},
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#999',
							},
						},
						axisPointer: {
							show: true,
							snap: false,
							triggerOn: 'none',
							triggerTooltip: false,
							lineStyle: {
								width: 0,
							},
							label: {
								show: false,
							},
							handle: {
								show: true,
								margin: 5,
								color: '#7ff',
								shadowBlur: 0,
								shadowOffsetY: 0,
								throttle: 1,
								icon:
									'image://data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KICAgIDxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdHJhbnNmb3JtPSJyb3RhdGUoMTgwIDkuNSAxMS41KSI+CiAgICAgICAgPHBhdGggZmlsbD0iI0U1RTVFNSIgZD0iTTEyIDBjMS4xMDUgMCAyIC44OTUgMiAydjlMNyAyMiAuMDAxIDExSDBWMkMwIC44OTUuODk1IDAgMiAwaDEweiIvPgogICAgICAgIDxjaXJjbGUgY3g9IjciIGN5PSI2LjUiIHI9IjMuNSIgZmlsbD0iIzEzMTMxNyIvPgogICAgPC9nPgo8L3N2Zz4K',
								size: 20,
							},
						},
						zlevel: -2,
					},
					{
						type: 'category',
						position: 'top',
						axisTick: {
							show: false,
						},
						axisLabel: {
							show: false,
						},
						axisLine: {
							show: true,
							lineStyle: {
								color: '#999',
							},
						},
						axisPointer: {
							show: false,
						},
						zlevel: -2,
					},
				],
				yAxis: {
					type: 'category',
					show: false,
				},
				toolbox: {
					show: false,
				},
				visualMap: {
					type: 'piecewise',
					bottom: '-500px',
				},
				series: [],
			},
		};
	},
	computed: {
		getChart() {
			return this.$refs.timelineChart;
		},
	},
	watch: {
		chartData: {
			handler(dataSet) {
				this.onData(dataSet);

				const index = this.getCurrentTickIndex(dataSet);

				this.setTickIndex(index);
				this.onTickChange(index, 'dataIn');
			},
		},
	},
	mounted() {
		this.$nextTick(() => {
			const chart = this.getChart;
			const cv = chart.$el.querySelectorAll('canvas')[1];

			cv.addEventListener('mouseup', evt => {
				if (this.isPointerDragging) {
					this.onTickChange(this.draggingTickIndex);
				}
				this.isPointerDragging = false;
			});

			cv.addEventListener('mouseleave', evt => {
				if (this.isPointerDragging) {
					this.onTickChange(this.draggingTickIndex);
				}
				this.isPointerDragging = false;
			});

			chart.chart.on('click', info => {
				this.onTickChange(info.dataIndex);
				this.isTickClicked = true;
			});

			chart.chart.on('updateaxispointer', info => {
				if (!info.axesInfo) {
					return;
				} else {
					this.draggingTickIndex = info.dataIndex;
				}

				if (info.dataIndex == null) {
					if (this.isPointerDragging) {
						this.onTickChange(info.axesInfo[0].value);
					}
					this.isPointerDragging = false;
				} else if (this.isTickClicked) {
					this.isTickClicked = false;
				} else {
					this.isPointerDragging = true;
				}
			});

			chart.chart.on('mouseover', info => {
				const x = info.event.event.pageX - 125;
				const y = info.event.event.pageY - 150;
				const data = info.data;

				this.showTooltip(x, y, data);
			});

			chart.chart.on('mouseout', info => {
				this.hideTooltip();
			});

			this.setMapPieces();
		});
	},
	methods: {
		onData(dataSet) {
			const chart = this.getChart;
			const configState = this.configState;
			const ticks = [];
			const seriesData = [];

			const newData = new Array(60 * 3 + 1);

			// tick, data 초기화
			for (let ix = 0, ixLen = newData.length; ix < ixLen; ix++) {
				const data = dataSet[ix];
				const type = data.type; // -1, 0, 1, 2
				const unixtime = moment(data.time).unix();

				ticks[ix] = moment(data.time).format('HH:mm');
				newData[ix] = {
					unixtime,
					visualization: { text: configState[type].text, color: configState[type].color },
					// data: { index: ix, data: { time: unixtime, type } },
					value: [ix, 0, type], // xAxis, yAxis, value
				};
			}

			seriesData.push({
				type: 'heatmap',
				emphasis: {
					itemStyle: {
						shadowBlur: 5,
						shadowColor: '#fff',
					},
				},
				itemStyle: {
					borderWidth: 1,
					borderColor: '#121212',
				},
				data: newData,
				zlevel: -2,
			});

			chart.mergeOptions({
				xAxis: [
					{ data: ticks, axisLine: { show: false } },
					{ data: [], axisLine: { show: false } },
				],
				series: seriesData,
			});
		},
		getCurrentTickIndex(dataSet) {
			// 학습된 시간의 인덱스를 찾는다.
			const lastIndex = _.findLastIndex(dataSet, o => {
				return Number(o.type) !== -1;
			});

			let index = lastIndex;

			if (lastIndex === -1) {
				index = dataSet.length - 1;
			}

			return index;
		},
		setTickIndex(v) {
			const value = v === -1 ? 0 : v;

			this.getChart.mergeOptions({ xAxis: { axisPointer: { value } } });
		},
		// type === undefined : update chartData
		onTickChange(tickIndex, type) {
			this.$EventBus.$emit('EVENT_TIMELINE_TICK_CHANGE', { type, tickIndex });
		},
		setMapPieces() {
			const data = this.configState;
			const pieces = [];
			const chart = this.getChart;

			for (const key in data) {
				pieces.push({ value: data[key].type, color: data[key].color });
			}

			if (!this.options.visualMap.pieces) {
				this.options.visualMap.pieces = pieces;
			}

			if (chart && chart.chart) {
				const opt = chart.delegateMethod('getOption');

				if (!opt.visualMap.pieces) {
					chart.mergeOptions({ visualMap: { pieces } });
				}
			}
		},
		showTooltip(x, y, data) {
			const tooltip = this.$refs.chartTooltip;
			const time = moment(data.unixtime * 1000).format('YYYY-MM-DD HH:mm');
			const result = [`<span style="font-size:9pt;font-weight:bold;">${time}</span><br/>`];
			const visualization = data.visualization;

			result.push(`<br/>`);
			result.push(
				`<span class="circle" style="background-color: ${visualization.color};"></span>`,
			);
			result.push(`<span style="font-size:9pt;">${visualization.text}</span><br/>`);
			tooltip.style = `left:${x}px; top:${y}px; display:block;`;
			tooltip.innerHTML = result.join('');
		},
		hideTooltip() {
			const tooltip = this.$refs.chartTooltip;

			tooltip.style.display = 'none';
		},
	},
};
</script>
