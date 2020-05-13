<script>
// import ECharts from '@/components/common/chart/eCharts';
import BaseChart from './base-aiChart';

export default {
	name: 'AiChart',
	extends: BaseChart,
	data() {
		return {
			series: [],
			seriesAllList: {
				current: {
					name: 'currentVal',
					id: 'overall',
					type: 'line',
					symbol: 'none',
					itemStyle: {
						color: '#b29bff',
					},
					lineStyle: {
						color: '#b29bff',
					},
				},
				moving: {
					name: 'movingAvg',
					type: 'line',
					symbol: 'none',
					lineStyle: {
						color: 'transparent', // 데이터가 의미없어서 일단 투명으로그린다
					},
				},
				band: {
					name: 'band',
					type: 'line',
					// stack: 'band1',
					connectNulls: true,
					symbol: 'none',
					lineStyle: {
						type: 'dotted',
						color: '#dadada',
						opacity: 0.7,
					},
					areaStyle: {
						color: {
							x: 0,
							y: 0,
							x2: 0,
							y2: 1,
							type: 'linear',
							global: false,
							colorStops: [
								{
									offset: 0,
									color: `rgba(194, 227, 223, 0.25)`,
								},
								{
									offset: 0.2,
									color: `rgba(81, 176, 187, 0.25)`,
								},
								{
									offset: 0.4,
									color: `rgba(51, 122, 130, 0.25)`,
								},
								{
									offset: 0.6,
									color: `rgba(23, 55, 59, 0.25)`,
								},
								{
									offset: 1,
									color: `rgba(21, 42, 47, 0.25)`,
								},
							],
						},
						// color: new ECharts.graphic.LinearGradient(0, 0, 0, 1, [
						// 	{
						// 		offset: 0,
						// 		color: '#660099',
						// 	},
						// 	{
						// 		offset: 1,
						// 		color: 'transparent',
						// 		// color: '#000000',
						// 	},
						// ]),
					},
				},
				predictVal: {
					name: 'predictVal',
					type: 'line',
					symbol: 'none',
					connectNulls: true,
					itemStyle: {
						color: '#ff534e',
					},
					lineStyle: {
						width: 1.5,
						type: 'dashed',
						color: '#ff534e',
					},
				},
				predictBand: {
					name: 'predictBand',
					type: 'line',
					// stack: 'band2',
					connectNulls: true,
					symbol: 'none',
					// step: true,
					lineStyle: {
						opacity: 0.7,
						color: 'rgba(255,222,0,0.85)',
					},
					areaStyle: {
						color: '#ffde00',
						opacity: 0.2,
						// origin: 'end',
					},
				},
				effectScatter: {
					type: 'effectScatter',
					name: 'overflowEffect',
					symbolSize: '8',
					symbol: 'circle',
					// symbolRotate: 180,
					color: '#FF6259',
					rippleEffect: {
						scale: 6,
						period: 3,
						brushType: 'fill',
						// brushType: 'stroke',
					},
					data: [],
					cursor: 'normal',
				},
				scatter: {
					type: 'scatter',
					name: 'overflow',
					symbol: 'circle',
					symbolSize: '7',
					itemStyle: {
						color: '#FF6259',
						// borderColor: '#58ef49',
						// borderWidth: 2,
						// opacity: 0.3,
					},
					cursor: 'normal',
					data: [],
				},
			},
		};
	},
	methods: {
		mixSeries(type) {
			this.selectSeries(type);
			return this.series;
		},
		selectSeries(type) {
			switch (type) {
				case 'main':
					return this.combineSeries(
						['current', 'band', 'predictVal', 'predictBand', 'scatter'],
						type,
					);
				case 'sub':
					return this.combineSeries(['current', 'moving', 'band', 'scatter'], type);
				case 'overall':
					return this.combineSeries(['current', 'band', 'scatter'], type);
				default:
				// this.fn_noneTypeData(status, data);
			}
		},
		combineSeries(list, type) {
			this.series = [];
			this.seriesAllList['current'].id = type;
			if (this.cursorType === 'was' || this.cursorType === 'ora') {
				this.seriesAllList['scatter'].cursor = 'pointer';
			} else {
				this.seriesAllList['scatter'].cursor = 'normal';
			}
			list.forEach(series => {
				this.series.push(this.seriesAllList[series]);
			});
		},
		onResize() {
			this.$refs.baseAiChart.resize();
		},
	},
};
</script>
