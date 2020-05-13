<template>
	<div class="ai-monitoring-container">
		<div class="contents-wrapper1">
			<img :src="require('@/assets/svg/motion/main_normal.svg')" />
		</div>
		<div class="contents-wrapper2">
			<bar-chart :chart-data="chartData" :chart-height="200"></bar-chart>
		</div>
		<div class="contents-wrapper3">
			<line-chart
				:chart-data="chartData"
				:time-data="timeData"
				:chart-height="200"
				chart-title="Area Stack Chart"
				showLegend
				useArea
			></line-chart>
		</div>
		<div class="contents-wrapper4" ref="tableSpinner">
			<basic-table
				:header-data="headerData"
				:table-data="tableData"
				:table-options="tableOptions"
				@row-click="onRowClick"
				@cell-change="onCellChange"
				@row-dblclick="onRowDbClick"
			>
			</basic-table>
		</div>
	</div>
</template>
<script>
import moment from 'moment';
import defaultMixin from '@/mixins/defaultMixin';
import basicTable from '@/components/common/table/basic-table';
import tableUtil from '@/components/common/table/tableUtil';
import lineChart from '@/components/common/chart/line-chart';
import barChart from '@/components/common/chart/bar-chart';

export default {
	name: 'aiMonitoring',
	mixins: [defaultMixin],
	components: {
		basicTable,
		lineChart,
		barChart,
	},
	props: {},
	data() {
		return {
			headerData: [],
			tableData: [],
			chartData: [],
			chartColor: ['#F08080', '#66CDAA'],
			timeData: [],
		};
	},
	computed: {
		tableOptions() {
			return tableUtil.mergeOptions({});
		},
	},
	watch: {},
	created() {
		this.$EventBus.$on('BRUSH_SELECTED', this.brushSelected);
	},
	mounted() {
		this.$nextTick(() => {
			this.$webCaller.addSubscribe('wsEvent', 2, 'alarm', 'alarmData', 'alarmTopic');
			this.spinnerList();
			this.$loading.show('tableSpinner');
			// this.$loading.hide('tableSpinner');
			this.headerData = this.setHeaderData();
			this.tableData = this.setTableData();
			this.randomData();
		});
	},
	beforeDestroy() {},
	destroyed() {},
	methods: {
		spinnerList() {
			this.$loading.create('tableSpinner', {
				container: this.$refs.tableSpinner,
			});
		},
		onRowClick() {
			console.log('Row Click');
		},
		onCellChange() {
			console.log('Cell Change');
		},
		onRowDbClick() {
			console.log('Row Double Click');
			const params = {
				show: true,
				titleLabel: `popup test`,
				// contentsComp: , // contents component
				// params: {
				//     clusterId: this.clusterId,
				//     channelId,
				// },
				resizable: false, // resize 여부
				draggable: false, // drag 여부
				minimizable: false, // 최소화 여부
				modal: true, // modal 여부
				x: 710,
				y: 290,
				w: 500,
				h: 500,
				z: 800,
			};

			this.$store.dispatch('params/main_layer_popup', params);
		},
		setTableData() {
			const data = [
				{
					no: 1,
					name: 'A',
				},
				{
					no: '2',
					name: 'B',
				},
				{
					no: '3',
					name: 'C',
				},
				{
					no: '4',
					name: 'D',
				},
				{
					no: '5',
					name: 'E',
				},
				{
					no: '6',
					name: 'F',
				},
				{
					no: '7',
					name: 'G',
				},
				{
					no: '8',
					name: 'H',
				},
			];

			return data;
		},
		setHeaderData() {
			const data = [
				{
					value: 'no',
					label: this.$t('table.header.no'),
					headerAlign: 'center',
					align: 'right',
					width: 50,
				},
				{
					value: 'name',
					label: this.$t('table.header.name', ['XAI']),
					headerAlign: 'center',
					editOptions: { type: 'text' },
				},
			];

			return tableUtil.initializationHeader(data);
		},
		randomData() {
			const data = [];
			const maxCount = 10;

			for (let ix = 0; ix < maxCount; ix++) {
				data.push({
					data: [
						(Math.random() * 100).toFixed(2),
						(Math.random() * 100).toFixed(2),
						(Math.random() * 100).toFixed(2),
						(Math.random() * 100).toFixed(2),
					],
					name: `test${ix}`,
					timestamp: [1558512318000, 1558512618000, 1558512918000, 1558513098000],
				});
			}

			// this.timeData = [1558512318000, 1558512618000, 1558512918000, 1558513098000];
			this.chartData = data;
		},
		xAxisFormatter(value) {
			return moment(value * 1000).format('MM-DD HH');
		},
		brushSelected(e) {
			// console.log(e);
		},
		test() {
			// this.$webCaller.service.get(`${this.$api.user.users}/admin`);
			// this.$http.get(`${this.$api.user.users}/admin`).then(r => {
			//     this.$webCaller.WorkerHttp(
			//         "get",
			//         `${this.$api.user.users}/admin`,
			//         "",
			//         "ALARM_CHANNEL",
			//     );
			// });
			//
			// console.log("HI");
		},
	},
};
</script>

<style lang="scss" scoped>
.ai-monitoring-container {
	// @include general-grid-container;
	width: 100%;
	height: 100%;
	display: grid;
	grid: {
		template-columns: repeat(2, 1fr);
		template-rows: repeat(3, 1fr);
		column-gap: 5px;
		row-gap: 5px;
	}
	padding: 10px;

	.contents-wrapper1 {
		width: 420px;
		height: 420px;
		grid: {
			column: 1/2;
			row: 1/2;
		}
	}

	.contents-wrapper2 {
		grid: {
			column: 2/3;
			row: 1/2;
		}
	}

	.contents-wrapper3 {
		grid: {
			column: 1/3;
			row: 2/3;
		}
	}

	.contents-wrapper4 {
		grid: {
			column: 1/3;
			row: 3/4;
		}
		position: relative;
	}
}
</style>
