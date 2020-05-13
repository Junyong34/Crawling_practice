<template>
	<div class="xai-side-bar">
		<div class="side-bar-main">
			<div class="side-bar-arrow" @click="$emit('toggle-side-bar', !showSideBar)">
				<img :src="require('@/assets/svg/sidebar/arrow-left.svg')" :style="arrowStyle" />
			</div>
			<div class="side-bar-alert-bell">
				<span class="badge-num" v-show="isShowAlertBadge" ref="badge">
					{{ alertCount }}
				</span>
				<img ref="alertButton" :src="require('@/assets/svg/sidebar/bell.svg')" />
			</div>
			<div class="side-bar-anomaly-state">
				<div class="side-bar-state-item" v-for="(item, key) in stateData" :key="key">
					<div :class="['side-bar-state-circle', `alert-${item.name}`]">
						<div class="side-bar-state-count">
							{{ item.count }}
						</div>
					</div>
				</div>
			</div>
			<div class="timeline-message-controller">
				<div class="timeline-message-icon">
					<img :src="require('@/assets/svg/sidebar/message-exist.svg')" />
				</div>
				<div class="timeline-message-button">
					<el-switch
						v-model="onOffSummary"
						:width="24"
						active-color="#A184FF"
						inactive-color="#00cca8"
					>
					</el-switch>
				</div>
			</div>
		</div>
		<div class="side-bar-body" ref="sideBarAlert">
			<div class="side-bar-alert-header">
				<div class="side-bar-alert-title">
					<span class="side-bar-alert-title-text">
						Alert List
					</span>
				</div>
				<div class="side-bar-alert-legend">
					<div class="side-bar-legend-item" v-for="(item, key) in stateData" :key="key">
						<div :class="['side-bar-legend-circle', `alert-${item.name}`]"></div>
						<div class="side-bar-legend-text">{{ item.name }}</div>
					</div>
				</div>
			</div>
			<div class="side-bar-alert-contents">
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
	</div>
</template>

<style lang="scss" scoped>
.xai-side-bar {
	.side-bar-main {
		position: fixed;
		width: 40px;
		height: calc(100% - 48px);
		@include flex-align($d: column, $a: center);
		background-color: #1c1c1c;
		z-index: 1000;
		user-select: none;

		.side-bar-arrow {
			margin-top: 48px;
			transform: rotate(180deg);
			cursor: pointer;
		}

		.side-bar-alert-bell {
			margin-top: 16px;
			position: relative;
			@include flex-align($a: center, $j: center);

			.badge-num {
				position: absolute;
				top: 40px;
				left: 5px;
				box-sizing: border-box;
				background: #ff2910;
				cursor: default;
				border-radius: 50%;
				color: #fff;
				font-weight: bold;
				font-size: 0.3rem;
				letter-spacing: 0.1rem;
				line-height: 1.65;
				margin-top: -1rem;
				margin-left: 0.1rem;
				/*border: 0.15rem solid #fff;*/
				text-align: center;
				display: inline-block;
				width: 1.3rem;
				height: 1.3rem;
				box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
				/*animation: pulse 1.5s 1;*/
				animation: 1.4s pulse 0s infinite;
			}
			.badge-num:after {
				content: '';
				position: absolute;
				top: -0.1rem;
				left: -0.1rem;
				border: 2px solid rgba(255, 0, 0, 0.5);
				opacity: 0;
				border-radius: 50%;
				width: 100%;
				height: 100%;
				/*animation: sonar 1.5s 1;*/
				animation: 1.4s sonar 0s infinite;
			}
			@keyframes sonar {
				0% {
					transform: scale(1);
					opacity: 1;
				}
				100% {
					transform: scale(2);
					opacity: 0;
				}
			}
			@keyframes pulse {
				0% {
					transform: scale(1);
				}
				20% {
					transform: scale(1.4);
				}
				50% {
					transform: scale(0.9);
				}
				80% {
					transform: scale(1.2);
				}
				100% {
					transform: scale(1);
				}
			}
			grid: {
				column: 1/1;
				row: 19/21;
			}

			img {
				cursor: pointer;
				z-index: 10;
			}
		}

		.side-bar-anomaly-state {
			margin-top: 16px;
			@include flex-align($d: column, $a: center);

			.side-bar-state-item {
				margin-bottom: 10px;

				.side-bar-state-circle {
					width: 24px;
					height: 24px;
					border-radius: 50%;
					cursor: pointer;

					.side-bar-state-count {
						font-size: 10px;
						line-height: 22px;
						text-align: center;
					}
				}
			}
		}

		.timeline-message-controller {
			width: 28px;
			height: 71px;
			@include flex-align($d: column, $a: center);
			margin: auto 0 0;
			border-top: 1px solid #666666;

			.timeline-message-icon {
				margin-top: 10px;
			}
		}
	}

	.side-bar-body {
		position: fixed;
		right: -840px;
		width: 800px;
		height: 500px;
		opacity: 0.87;
		border: solid 1px #787878;
		background-color: #000000;

		transition: {
			property: transform;
			duration: 300ms;
		}
		z-index: 200;

		.side-bar-alert-header {
			height: 50px;
			@include flex-align;
			padding: 10px;

			.side-bar-alert-title {
				flex: 1 1 40%;

				.side-bar-alert-title-text {
					font: {
						size: 24px;
						weight: bold;
					}
					letter-spacing: 0.8px;
				}
			}

			.side-bar-alert-legend {
				flex: 1 1 60%;
				@include flex-align($j: flex-end);
				padding-top: 15px;

				.side-bar-legend-item {
					@include flex-align($a: center);
					margin-left: 10px;

					.side-bar-legend-circle {
						width: 10px;
						height: 10px;
						border-radius: 50%;
						cursor: pointer;
					}
					.side-bar-legend-text {
						font-size: 11px;
						margin-left: 5px;
					}
				}
			}
		}
		.side-bar-alert-contents {
			height: calc(100% - 50px);
		}
	}
}
</style>

<script>
import { mapGetters } from 'vuex';
import basicTable from '@/components/common/table/basic-table';
import tableUtil from '@/components/common/table/tableUtil';

export default {
	name: 'side-bar',
	components: { basicTable },
	props: {
		showSideBar: Boolean,
	},
	data() {
		return {
			arrowStyle: {
				transform: 'rotate(0deg)',
			},
			isShowAlertBadge: false,
			alertCount: 0,
			headerData: [],
			tableOptions: {},
			onOffSummary: true,
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
			alertData: [],
		};
	},
	computed: {
		...mapGetters({
			getActiveView: 'getActiveView',
			getUserAlertData: 'socket/getUserAlertData',
		}),
	},
	watch: {
		getUserAlertData: {
			handler(data) {
				this.parseAlert(data);
			},
		},
		showSideBar: {
			handler(flag) {
				this.slideSideBar(flag);
			},
		},
		onOffSummary: {
			handler(data) {
				this.changeSummaryOnOff(data);
			},
		},
	},
	created() {
		this.$EventBus.$on('SIDE_BAR_SWITCH_ON', this.switchOn);
	},
	mounted() {
		this.$nextTick(() => {
			this.setHeaderData();
			this.InitTableOptions();
		});
	},
	beforeDestroy() {
		this.$EventBus.$off('SIDE_BAR_SWITCH_ON', this.switchOn);
	},
	methods: {
		switchOn() {
			this.onOffSummary = true;
		},
		parseAlert(dataSet) {
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
				const value = data.value === 0 ? data.value : +data.value.toFixed(2);
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
		slideSideBar(flag) {
			const targetStyle = this.$refs.sideBarAlert.style;
			let changeStyle = '';

			if (flag) {
				changeStyle = 'translateX(-880px)';
				this.arrowStyle = { transform: 'rotate(180deg)' };
				this.$emit('toggle-side-bar', this.showSideBar);
			} else {
				this.arrowStyle = { transform: 'rotate(0deg)' };
			}

			targetStyle.transform = changeStyle;
		},
		changeSummaryOnOff(flag) {
			this.$EventBus.$emit('ANOMALY_SUMMARY_ON_OFF', flag);
		},
		setHeaderData() {
			const data = [
				{
					headerAlign: 'center',
					align: 'left',
					label: this.$t('table.header.time'),
					value: 'time',
					width: 125,
				},
				{
					headerAlign: 'center',
					align: 'left',
					label: this.$t('table.header.type', ['Server ']),
					value: 'serverType',
					width: 85,
				},
				{
					headerAlign: 'center',
					align: 'left',
					label: this.$t('table.header.name', ['']),
					value: 'instanceName',
					width: 80,
				},
				{
					headerAlign: 'center',
					align: 'left',
					label: this.$t('table.header.name', ['Metric ']),
					value: 'metricName',
					width: 95,
				},
				{
					headerAlign: 'center',
					align: 'right',
					label: this.$t('table.header.value'),
					value: 'value',
					width: 100,
				},
				{
					headerAlign: 'center',
					align: 'center',
					label: this.$t('table.header.status'),
					value: 'status',
					width: 55,
				},
				{
					headerAlign: 'center',
					align: 'right',
					label: this.$t('table.header.score'),
					value: 'score',
					width: 50,
				},
				{
					headerAlign: 'center',
					align: 'left',
					label: this.$t('table.header.description'),
					value: 'description',
					// width: 70,
				},
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
					height: '47px',
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
