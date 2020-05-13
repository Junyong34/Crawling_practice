<script>
import moment from 'moment';
import BaseChart from './base-chart';
import chartUtil from './chartUtil';

export default {
	name: 'barChart',
	extends: BaseChart,
	props: {
		tooltipFormatter: {
			type: Function,
			default: param => {
				const date = moment(param.name * 1).format('YYYY-MM-DD HH:mm');
				const data = Number(param.data[param.seriesName]).toFixed(2);

				return `<b>${date}</b></br>${param.marker}${param.seriesName} : ${data}`;
			},
		},
		barWidth: {
			type: Number,
		},
		chartColor: {
			type: Array,
			default: () => chartUtil.defaultColor,
		},
	},
	methods: {
		mixSeries(series) {
			series.type = 'bar';
			series.barWidth = this.barWidth;

			return series;
		},
		mixOption(option) {
			option.xAxis = {};
			option.xAxis.boundaryGap = true;
			option.xAxis.axisTick = {
				show: this.xAxisTickShow,
				length: 5, // data 구분선 길이
			};

			option.tooltip = {
				trigger: 'item', // single tooltip
			};

			option.brush = {
				toolbox: ['none'],
				borderWidth: 2,
				color: '#a9f5',
				borderColor: '#a9f',
				throttleType: 'debounce',
				throttleDelay: 300,
			};

			return option;
		},
		mixEvents() {
			this.$refs.baseChart.$on('brushselected', param => {
				if (param.batch.length) {
					this.$EventBus.$emit('BRUSH_SELECTED', param.batch[0].selected);
				}
			});
		},
		mixActions() {
			this.$refs.baseChart.dispatchAction({
				type: 'takeGlobalCursor',
				key: 'brush',
				brushOption: {
					brushType: 'lineX',
					brushMode: 'single',
				},
			});
		},
		onResize() {
			this.$refs.baseChart.resize();
		},
	},
};
</script>
