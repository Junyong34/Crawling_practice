<template>
	<div class="xai-anomaly-summary" ref="anomalySummary">
		<div class="anomaly-summary-header">
			<div class="alert-current-time">
				<span class="alert-text">
					Root Cause Analysis
					<span class="time-text">{{ time }}</span>
				</span>
				<span class="alert-close" @click="onClickClose">
					<i class="el-icon-close"></i>
				</span>
			</div>
			<div class="alert-causation-type">
				<div class="alert-type-item" v-for="(item, key) in typeData" :key="key">
					<div class="alert-type-text">{{ item.name }}</div>
					<div class="alert-count-rect">{{ item.count }}</div>
				</div>
			</div>
			<div class="alert-summary">
				<div class="summary-title">Summary Information</div>
				<div class="summary-content" ref="summaryBox"></div>
			</div>
		</div>
		<div class="anomaly-summary-body">
			<div class="txn-area">
				<div class="txn-title">Transaction</div>
				<div class="txn-content" ref="txnBox"></div>
			</div>
			<div class="was-area">
				<div class="was-title">WAS</div>
				<div class="was-content" ref="wasBox"></div>
			</div>
			<div class="db-area">
				<div class="db-title">DB</div>
				<div class="db-content" ref="dbBox"></div>
			</div>
			<div class="os-area">
				<div class="os-title">OS</div>
				<div class="os-content" ref="osBox"></div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.xai-anomaly-summary {
	position: fixed;
	width: 672px;
	height: calc(100% - 100px);
	right: -672px;
	bottom: 0;
	border: solid 1px rgba(213, 204, 255, 0.5);
	box-shadow: 0 2px 26px 0 rgba(0, 0, 0, 0.77);
	background-color: #080808;
	opacity: 0.9;
	z-index: 999;
	transition: {
		property: transform;
		duration: 500ms;
	}

	.anomaly-summary-header {
		height: 315px;

		.alert-current-time {
			height: 50px;
			@include flex-align($a: center);
			padding-left: 20px;
			font-size: 20px;

			.alert-text {
				font-weight: 300;

				.time-text {
					font-weight: bold;
					letter-spacing: 0.67px;
				}
			}

			.alert-close {
				cursor: pointer;
				margin: 0 10px 0 auto;
			}
		}

		.alert-causation-type {
			height: 35px;
			border-top: 1px solid rgba(213, 204, 255, 0.5);
			@include flex-align($a: center);
			padding-left: 20px;

			.alert-type-item {
				@include flex-align($a: center);
				margin-right: 16px;
				font: {
					size: 14px;
					weight: 500;
				}

				.alert-type-text {
					color: #eae4ff;
					margin-right: 8px;
				}

				.alert-count-rect {
					width: 16px;
					height: 16px;
					background-color: #ff453a;
					text-align: center;
					line-height: 14px;
					color: #000000;
				}
			}
		}

		.alert-summary {
			height: 230px;
			border-top: 1px solid rgba(213, 204, 255, 0.5);
			font-size: 12px;
			color: rgba(255, 255, 255, 0.87);
			padding-left: 36px;
			overflow-y: auto;

			.summary-title {
				display: inline-block;
				width: 154px;
				height: 20px;
				border: 1px solid #979797;
				border-radius: 16px;
				margin-top: 13px;
				font-weight: 500;
				letter-spacing: 0.2px;
				text-align: center;
			}

			.summary-content {
				white-space: pre-wrap;
				font-family: AppleSDGothicNeo;
				line-height: 2;
				padding: 2px 39px 10px 0;
			}
		}
	}

	.anomaly-summary-body {
		@mixin causation-type-area {
			flex: 3;
			border-top: 1px solid rgba(213, 204, 255, 0.5);
			padding-left: 88px;
			overflow-y: auto;
		}

		@mixin common-title {
			display: inline-block;
			width: 55px;
			height: 16px;
			border-radius: 16px;
			background-color: #84e793;
			margin-top: 11px;
			font: {
				size: 12px;
				weight: 500;
			}
			letter-spacing: 0.2px;
			text-align: center;
			color: rgba(18, 18, 18, 0.87);
			line-height: 16px;
		}

		@mixin common-content {
			white-space: pre-wrap;
			font: {
				family: AppleSDGothicNeo;
				size: 11px;
			}
			line-height: 1.64;
			letter-spacing: 0.3px;
			color: rgba(255, 255, 255, 0.87);
			padding: 2px 39px 37px 35px;
		}

		height: calc(100% - 315px);
		@include flex-align($d: column);

		.txn-area {
			flex: 4;
			border-top: 1px solid rgba(213, 204, 255, 0.5);
			padding-left: 48px;
			overflow-y: auto;

			.txn-title {
				display: inline-block;
				width: 98px;
				height: 16px;
				border-radius: 16px;
				background-color: #ff534e;
				margin-top: 10px;
				font: {
					size: 12px;
					weight: 500;
				}
				letter-spacing: 0.2px;
				text-align: center;
				color: rgba(18, 18, 18, 0.87);
				line-height: 16px;
			}

			.txn-content {
				@include common-content;
			}
		}

		.was-area {
			@include causation-type-area;

			.was-title {
				@include common-title;
			}

			.was-content {
				@include common-content;
			}
		}

		.db-area {
			@include causation-type-area;

			.db-title {
				@include common-title;
			}

			.db-content {
				@include common-content;
			}
		}

		.os-area {
			@include causation-type-area;

			.os-title {
				@include common-title;
			}

			.os-content {
				@include common-content;
			}
		}
	}
}
</style>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'anomaly-summary',
	components: {},
	props: {},
	data() {
		return {
			time: '',
			typeData: [
				{
					key: 'tran',
					name: 'Transaction',
					count: 0,
				},
				{
					key: 'was',
					name: 'WAS',
					count: 0,
				},
				{
					key: 'ora',
					name: 'DB',
					count: 0,
				},
				{
					key: 'os',
					name: 'OS',
					count: 0,
				},
			],
			onOffSummary: true,
		};
	},
	computed: {
		...mapGetters({
			getSystemId: 'params/getSystemId',
			getLatelyTime: 'params/getLatelyTime',
		}),
	},
	watch: {
		getSystemId: {
			handler(newVal, oldVal) {
				// this.inst = null; // systemId 변경되서 초기화
				// this.apiCall();
			},
		},
		getLatelyTime: {
			handler(newVal, oldVal) {
				if (!newVal) return;
				if (newVal === oldVal) return;
				this.apiCall(newVal);
			},
		},
	},
	created() {
		this.$EventBus.$on('ANOMALY_SUMMARY_ON_OFF', this.changeOnOff);
	},
	mounted() {
		this.$nextTick(() => {
			// this.apiCall();
		});
	},
	beforeDestroy() {
		this.$EventBus.$off('ANOMALY_SUMMARY_ON_OFF', this.changeOnOff);
	},
	destroyed() {},
	methods: {
		apiCall(date) {
			const serviceIns = this.$webCaller.serviceIns;
			const path = this.$api.basicInfo().anomalySummary;
			const params = {
				sys_id: this.getSystemId,
				date,
			};

			serviceIns.get(path, params, (status, response) => {
				this.parseData(response && response.data);
			});
		},
		parseData(data) {
			if (!data) return;
			const {
				summaryText,
				txtTran,
				txtWas,
				txtOra,
				txtOs,
				anomalyCountMap,
				anomaly,
				// detail,
				time,
			} = data;

			// set message
			const summaryBox = this.$refs.summaryBox;
			const txnBox = this.$refs.txnBox;
			const wasBox = this.$refs.wasBox;
			const dbBox = this.$refs.dbBox;
			const osBox = this.$refs.osBox;

			summaryBox.innerHTML = summaryText;
			txnBox.innerHTML = txtTran;
			wasBox.innerHTML = txtWas;
			dbBox.innerHTML = txtOra;
			osBox.innerHTML = txtOs;

			// set count
			const typeData = this.typeData;

			typeData.forEach(t => {
				Object.keys(anomalyCountMap).some(key => {
					if (key === t.key) {
						t.count = anomalyCountMap[key];
						return true;
					}

					return false;
				});
			});

			// set time
			this.time = time;

			const isNormal = !txtTran && !txtWas && !txtOra && !txtOs;

			if (this.onOffSummary) {
				this.slideSummary(anomaly || !isNormal);
			}
		},
		slideSummary(flag) {
			const target = this.$refs.anomalySummary;
			let changeStyle = '';

			if (flag) changeStyle = `translateX(-${target.offsetWidth + 40}px)`;

			target.style.transform = changeStyle;
		},
		changeOnOff(flag) {
			this.onOffSummary = flag;
		},
		onClickClose() {
			this.slideSummary(false);
		},
	},
};
</script>
