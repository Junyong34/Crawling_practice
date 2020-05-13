<script>
import BaseChart from './base-chart';

export default {
	name: 'lineChart',
	extends: BaseChart,
	methods: {
		mixSeries(series, index) {
			const colors = this.chartColor;

			if (this.useArea) {
				series.areaStyle = {
					color: colors[index],
				};
			}
			return series;
		},
		onResize() {
			this.$refs.baseChart.resize();
		},
	},
};
</script>
