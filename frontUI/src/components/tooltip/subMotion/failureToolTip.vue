<template>
	<div class="failure-content">
		<div class="header-area">
			<div class="title">User Alert</div>
			<div class="notify-info">
				<div class="right-pos" v-for="(item, key) in stateData" :key="key">
					<div :class="['side-bar-legend-circle', `alert-${item.name}`]"></div>
					<div class="side-bar-legend-text">{{ item.name }}</div>
				</div>
			</div>
		</div>
		<div class="table-area">
			<basic-table
				:header-data="headerData"
				:table-data="alertData"
				:table-options="tableOptions"
			>
				<template slot="status" slot-scope="props">
					<span :class="['xai-table-dot', `alert-${props.row.status}`]"></span>
				</template>
			</basic-table>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.failure-content {
	position: relative;
	width: 100%;
	height: 100%;
	@include flex-align($f: flex, $d: column, $j: center);
	.header-area {
		@include flex-align($f: flex, $d: row, $j: center);
		flex-basis: 30px;
		width: 100%;
		.title {
			flex: 0.6;
			font-size: 16px;
		}
		.notify-info {
			flex: 1;
			margin-left: auto;
			@include flex-align($d: row, $a: center);
			.right-pos {
				@include flex-align($d: row, $a: center);
				flex: 1;
				.side-bar-legend-circle {
					width: 10px;
					height: 10px;
					border-radius: 50%;
					cursor: pointer;
				}
				.side-bar-legend-text {
					font: {
						family: Roboto;
						size: 11px;
					}
					margin-left: 5px;
				}
			}
		}
	}
	.table-area {
		flex: 1;
		width: 100%;
	}
}
</style>

<script>
import { mapGetters } from 'vuex';
import tableUtil from '@/components/common/table/tableUtil';
import basicTable from '@/components/common/table/basic-table';

export default {
	name: 'failureToolTip',
	components: { basicTable },
	inheritAttrs: false,
	props: {
		toolTipData: {
			type: Array,
			default: () => [],
		},
		type: {
			type: String,
			default: 'DB',
		},
	},
	data() {
		return {
			headerData: [],
			alertData: [],
			tableOptions: {},
			stateData: [
				{
					name: 'critical',
					level: 'C',
					count: 0,
				},
				{
					name: 'predict',
					level: null,
					count: 0,
				},
				{
					name: 'warning',
					level: 'B',
					count: 0,
				},
				{
					name: 'attention',
					level: 'A',
					count: 0,
				},
			],
		};
	},
	computed: {
		...mapGetters({}),
	},
	watch: {
		toolTipData: {
			handler(data) {
				this.parseAlert(data);
			},
		},
	},
	created() {},
	beforeDestroy() {},
	mounted() {
		this.$nextTick(() => {
			this.setHeaderData();
			this.InitTableOptions();
		});
	},
	destroyed() {},
	methods: {
		parseAlert(alertList) {
			const dataSet = alertList.filter(alert => {
				if (alert.key === 'ora') {
					return this.type === 'DB';
				} else {
					return this.type === alert.key.toUpperCase();
				}
			});
			const stateData = this.stateData;
			const newData = [];

			for (let ix = 0, ixLen = stateData.length; ix < ixLen; ix++) {
				stateData[ix].count = 0;
			}

			for (let ix = 0, ixLen = dataSet.length; ix < ixLen; ix++) {
				const data = dataSet[ix];

				const time = data.time;
				const serverType = data.type;
				const instanceName = data.name;
				const metricName = data.stat_name;
				const value = data.value === 0 ? data.value : Number(data.value).toFixed(2);
				const level = data.level;
				const score = data.score;
				const predictTime = data.predict_time;
				const description =
					predictTime === ''
						? `anomaly detection ${serverType}`
						: `predict ${serverType} (${predictTime})`;

				let status;

				stateData.some(s => {
					if (s.level === level) {
						status = s.name;
						s.count++;
					}

					return s.level === level;
				});

				newData.push({
					time,
					serverType,
					instanceName,
					metricName,
					value,
					score,
					description,
					status,
				});
			}

			this.alertData = newData;
		},
		setHeaderData() {
			const data = [
				{
					headerAlign: 'center',
					align: 'left',
					label: this.$t('table.header.time'),
					value: 'time',
					width: 70,
				},
				// {
				// 	headerAlign: 'center',
				// 	align: 'left',
				// 	label: this.$t('table.header.type', ['Server ']),
				// 	value: 'serverType',
				// 	width: 85,
				// },
				{
					headerAlign: 'center',
					align: 'left',
					label: this.$t('table.header.name', ['']),
					value: 'instanceName',
					// width: 120,
				},
				{
					headerAlign: 'center',
					align: 'left',
					label: this.$t('table.header.name', ['Metric ']),
					value: 'metricName',
					width: 150,
				},
				// {
				// 	headerAlign: 'center',
				// 	align: 'right',
				// 	label: this.$t('table.header.value'),
				// 	value: 'value',
				// 	width: 100,
				// },
				{
					headerAlign: 'center',
					align: 'center',
					label: this.$t('table.header.status'),
					value: 'status',
					width: 55,
				},
				// {
				// 	headerAlign: 'center',
				// 	align: 'right',
				// 	label: this.$t('table.header.score'),
				// 	value: 'score',
				// 	width: 50,
				// },
				// {
				// 	headerAlign: 'center',
				// 	align: 'left',
				// 	label: this.$t('table.header.description'),
				// 	value: 'description',
				// 	// width: 70,
				// },
			];

			this.headerData = tableUtil.initializationHeader(data);
		},
		InitTableOptions() {
			const opt = {
				style: {
					'background-color': 'rgba(17, 17, 19, 0.8)',
				},
				headerRowStyle: {
					'background-color': '#0B0B0D',
					height: '25px',
				},
				rowStyle: ({ row, column, rowIndex, columnIndex }) => ({
					backgroundColor:
						rowIndex % 2 === 0 ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.7)',
					height: '27px',
				}),
			};

			this.tableOptions = tableUtil.mergeOptions(opt);
		},
	},
};
</script>
