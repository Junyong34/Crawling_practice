<template>
	<div class="xai-anomaly-summary" ref="anomalySummary">
		<div class="anomaly-summary-header">
			<div class="summary-base-info-wrapper">
				<div class="base-info-contents">
					<div class="summary-current-time">
						<span class="time-text">Occurrence Time</span>
						<br />
						<span class="time-value">{{ time }}</span>
					</div>
					<div class="summary-causation-type">
						<div class="causation-type-title">Causation Type</div>
						<div class="causation-type-item" v-for="(item, key) in typeData" :key="key">
							<div class="causation-type-text">{{ item.name }}</div>
							<div class="causation-count">{{ item.count }}</div>
						</div>
					</div>
				</div>
				<img :src="require('@/assets/svg/common/root_causation_analysis_motion.svg')" />
			</div>
			<div class="summary-contents-wrapper">
				<div class="summary-title">
					<div class="summary-badge">
						<img :src="require('@/assets/svg/common/report.svg')" />
						<span class="summary-badge-text">Summary Information</span>
					</div>
					<div class="summary-close" @click="onClickClose">
						<i class="el-icon-close"></i>
					</div>
				</div>
				<div class="summary-content" ref="summaryContent"></div>
			</div>
		</div>
		<div ref="bodyAni" class="anomaly-summary-body">
			<div class="txn-wrapper">
				<div class="txn-title">
					<span class="txn-txt">Transaction</span>
					<img :src="require('@/assets/svg/common/transaction.svg')" />
				</div>
				<div class="txn-content" ref="txnContent"></div>
			</div>
			<div class="causation-wrapper">
				<div class="line-area">
					<div class="line-item1"></div>
					<div class="line-item2"></div>
					<div class="line-item3"></div>
				</div>
				<div class="box-area">
					<div class="was-box">
						<div class="was-title">
							<span class="was-txt">WAS</span>
							<img :src="require('@/assets/svg/common/WAS.svg')" />
						</div>
						<div class="was-content" ref="wasContent"></div>
					</div>
					<div class="db-box">
						<div class="db-title">
							<span class="db-txt">DB</span>
							<img :src="require('@/assets/svg/common/DB.svg')" />
						</div>
						<div class="db-content" ref="dbContent"></div>
					</div>
					<div class="os-box">
						<div class="os-title">
							<span class="os-txt">OS</span>
							<img :src="require('@/assets/svg/common/OS.svg')" />
						</div>
						<div class="os-content" ref="osContent"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.xai-anomaly-summary {
	$containerWidth: 802px;

	position: fixed;
	width: $containerWidth;
	height: calc(100% - 140px);
	right: -#{$containerWidth};
	bottom: 0;
	border: solid 1px #4c4c4c;
	border-radius: 1px;
	box-shadow: 0 2px 26px 0 rgba(0, 0, 0, 0.77);
	background-color: rgba(8, 8, 8, 0.9);
	z-index: 999;
	transition: {
		property: transform;
		duration: 500ms;
	}

	$headerHeight: 312px;
	.anomaly-summary-header {
		height: $headerHeight;

		@include flex-align;
		.summary-base-info-wrapper {
			width: 160px;
			position: relative;
			@include flex-align($a: center, $j: center);

			.base-info-contents {
				position: absolute;
				width: 128px;
				height: 200px;
				@include flex-align($d: column);

				.summary-current-time {
					flex: 1;
					border-bottom: solid 1px #121212;

					.time-text {
						font-size: 12px;
						font-weight: 600;
						letter-spacing: 0.4px;
						color: rgba(0, 0, 0, 0.87);
					}

					.time-value {
						font-size: 24px;
						font-weight: bold;
						letter-spacing: 0.8px;
						color: rgba(0, 0, 0, 0.87);
					}
				}

				.summary-causation-type {
					flex: 3;
					padding-top: 30px;

					@include flex-align($d: column);
					.causation-type-title {
						flex: 1;
						font-size: 12px;
						font-weight: 600;
						letter-spacing: 0.4px;
						color: rgba(0, 0, 0, 0.87);
					}
					.causation-type-item {
						flex: 1;
						@include flex-align($a: center);
						font-size: 12px;
						font-weight: 600;
						color: rgba(0, 0, 0, 0.87);
						border-bottom: solid 1px #121212;

						.causation-type-text {
							line-height: 0.92;
							margin-right: 8px;
						}

						.causation-count {
							margin-left: auto;
						}
					}
				}
			}
		}

		.summary-contents-wrapper {
			flex: 1;
			background-color: rgba(44, 38, 61, 0.55);
			padding: 10px 0 10px 16px;

			.summary-title {
				height: 25px;
				@include flex-align;

				.summary-badge {
					@include flex-align($a: center, $j: space-evenly);
					width: 162px;
					height: 20px;
					border-radius: 16px;
					background-color: #ffffff;

					.summary-badge-text {
						font-size: 12px;
						font-weight: 600;
						letter-spacing: 0.2px;
						color: rgba(18, 18, 18, 0.87);
					}
				}

				.summary-close {
					cursor: pointer;
					margin: 0 10px 0 auto;
				}
			}

			.summary-content {
				height: calc(100% - 25px);
				overflow-y: auto;
				white-space: pre-wrap;
				padding: 15px 0 0 12px;
				font-family: AppleSDGothicNeo;
				font-size: 11px;
				font-weight: 600;
				line-height: 18px;
				color: rgba(255, 255, 255, 0.87);
			}
		}
	}

	.anomaly-summary-body {
		@include flex-align($d: column);
		padding: 18px 19px 0 21px;
		opacity: 0;
		/*height: calc(100% - #{$headerHeight});*/
		&.body-ani {
			/* 애니메이션 */
			animation-name: folder;
			animation-duration: 460ms;
			animation-timing-function: ease-in;
			animation-delay: 100ms;
			animation-iteration-count: 1;
			animation-direction: normal;
			animation-fill-mode: forwards;
			animation-play-state: running;
		}

		/*@keyframes folder {
			from {
				height: 20%;
			}
			to {
				height: calc(100% - #{$headerHeight});
			}
		}*/
		@keyframes folder {
			0% {
				opacity: 0;
				height: 10px;
			}
			20% {
				opacity: 0.3;
				height: calc(20% - #{$headerHeight});
			}
			40% {
				height: calc(40% - #{$headerHeight});
			}
			60% {
				height: calc(60% - #{$headerHeight});
			}
			80% {
				height: calc(80% - #{$headerHeight});
			}
			100% {
				opacity: 1;
				height: calc(100% - #{$headerHeight});
			}
		}

		.txn-wrapper {
			flex: 1;
			@include flex-align($d: column);
			border: 1px solid #7f7f7f;
			padding: 10px 15px;
			overflow-y: hidden;

			.txn-title {
				flex: 1;
				@include flex-align;

				.txn-txt {
					font: {
						size: 16px;
						weight: bold;
					}
					color: #79ffc5;
				}

				img {
					margin-left: auto;
				}
			}

			.txn-content {
				flex: 5;
				white-space: pre-wrap;
				font: {
					family: AppleSDGothicNeo;
					size: 9px;
				}
				color: #c0c5ca;
				padding-top: 13px;
				overflow-y: auto;
			}
		}

		.causation-wrapper {
			flex: 4;
			padding-left: 24px;
			@include flex-align;
			overflow-y: hidden;

			.line-area {
				width: 27px;

				.line-item1 {
					height: 40px;
					border-left: 1px solid #7f7f7f;
					border-bottom: 1px solid #7f7f7f;
				}

				.line-item2 {
					height: 155px;
					border-left: 1px solid #7f7f7f;
					border-bottom: 1px solid #7f7f7f;
				}

				.line-item3 {
					height: 155px;
					border-left: 1px solid #7f7f7f;
					border-bottom: 1px solid #7f7f7f;
				}
			}

			.box-area {
				flex: 1;
				@include flex-align($d: column);

				.was-box {
					flex: 1;
					@include flex-align($d: column);
					border: 1px solid #7f7f7f;
					margin-top: 14px;
					padding: 10px 15px;
					overflow-y: hidden;

					.was-title {
						flex: 1;
						@include flex-align;
						.was-txt {
							font: {
								size: 16px;
								weight: bold;
							}
							color: #79ffc5;
						}

						img {
							margin-left: auto;
						}
					}

					.was-content {
						flex: 5;
						white-space: pre-wrap;
						font: {
							family: AppleSDGothicNeo;
							size: 9px;
						}
						color: #c0c5ca;
						padding-top: 13px;
						overflow-y: auto;
					}
				}

				.db-box {
					flex: 1;
					@include flex-align($d: column);
					border: 1px solid #7f7f7f;
					margin-top: 14px;
					padding: 10px 15px;
					overflow-y: hidden;

					.db-title {
						flex: 1;
						@include flex-align;

						.db-txt {
							font: {
								size: 16px;
								weight: bold;
							}
							color: #79ffc5;
						}

						img {
							margin-left: auto;
						}
					}

					.db-content {
						flex: 5;
						white-space: pre-wrap;
						font: {
							family: AppleSDGothicNeo;
							size: 9px;
						}
						color: #c0c5ca;
						padding-top: 13px;
						overflow-y: auto;
					}
				}

				.os-box {
					flex: 1;
					@include flex-align($d: column);
					border: 1px solid #7f7f7f;
					margin-top: 14px;
					padding: 10px 15px;
					overflow-y: hidden;

					.os-title {
						flex: 1;
						@include flex-align;

						.os-txt {
							font: {
								size: 16px;
								weight: bold;
							}
							color: #79ffc5;
						}

						img {
							margin-left: auto;
						}
					}

					.os-content {
						flex: 5;
						white-space: pre-wrap;
						font: {
							family: AppleSDGothicNeo;
							size: 9px;
						}
						color: #c0c5ca;
						padding-top: 13px;
						overflow-y: auto;
					}
				}
			}
		}
	}
}
</style>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'anomaly-summary2',
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
			this.bodyAni = this.$refs.bodyAni;
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
			const summaryContent = this.$refs.summaryContent;
			const txnContent = this.$refs.txnContent;
			const wasContent = this.$refs.wasContent;
			const dbContent = this.$refs.dbContent;
			const osContent = this.$refs.osContent;

			summaryContent.innerHTML = summaryText;
			txnContent.innerHTML = txtTran;
			wasContent.innerHTML = txtWas;
			dbContent.innerHTML = txtOra;
			osContent.innerHTML = txtOs;

			this.disableBox([txnContent, wasContent, dbContent, osContent]);

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
				// this.slideSummary(true);
			}
		},
		disableBox(list) {
			list.forEach(box => {
				if (box.innerHTML !== '') {
					box.parentNode.style.opacity = 1;
				} else {
					box.parentNode.style.opacity = 0.3;
				}
			});
		},
		slideSummary(flag) {
			const target = this.$refs.anomalySummary;
			let changeStyle = '';

			if (flag) {
				changeStyle = `translateX(-${target.offsetWidth + 40}px)`;
				this.bodyAni.classList.add('body-ani');
			} else {
				this.bodyAni.classList.remove('body-ani');
			}

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
