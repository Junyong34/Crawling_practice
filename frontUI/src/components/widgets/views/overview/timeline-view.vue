<template>
	<div class="timeline-view-container">
		<div class="chart-top">
			<div class="chart-title"><span class="title-text">Timeline</span></div>
			<div class="chart-info">
				<div class="chart-legends">
					<div class="legends-item" v-for="(value, key, i) in configState" :key="i">
						<div
							class="color-circle"
							:style="{
								backgroundColor: value.color,
							}"
						></div>
						<div class="text-box">{{ value.text }}</div>
					</div>
				</div>
				<div class="chart-date">
					<el-date-picker
						v-model="calendarTime"
						type="datetime"
						placeholder="Select time"
						format="yyyy/MM/dd HH:mm"
						value-format="timestamp"
						:picker-options="pickerOptions"
						:clearable="false"
						:editable="false"
						size="mini"
						@change="handleChange"
						@focus="handleFocus"
						popper-class="date-pos-change"
					>
					</el-date-picker>
				</div>
			</div>
		</div>
		<div class="chart-bottom">
			<div class="loading-bar">
				<div v-if="pause" class="light-pause"></div>
				<div v-else class="light-play"></div>
			</div>
			<div class="chart-play" @click="togglePlayButton">
				<!--				<img :src="getImgUrl" style="width: 24px; height: 24px;" />-->
				{{ pause ? '▶' : '| |' }}
			</div>
			<div class="chart-wrapper">
				<timeline-chart
					:config-state="configState"
					:chart-data="chartData"
				></timeline-chart>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.timeline-view-container {
	height: 100%;
	width: 100%;
	padding-left: 16px;
	background-color: #1c1c1c;
	@include flex-align($d: column);

	.chart-top {
		flex: 1 1 30px;
		display: flex;

		.chart-title {
			@include flex-align($a: flex-end);

			.title-text {
				font-size: 12px;
				color: rgba(255, 255, 255, 0.87);
			}
		}

		.chart-info {
			flex: 1;
			@include flex-align($j: flex-end);

			.chart-legends {
				@include flex-align($a: flex-end);
				margin-right: 20px;

				.legends-item {
					flex: 1 1 auto;

					.color-circle {
						display: inline-block;
						width: 10px;
						height: 10px;
						border-radius: 50%;
					}

					.text-box {
						display: inline-block;
						font-size: 11px;
						color: rgba(255, 255, 255, 0.87);
						opacity: 0.55;
						padding: 0 8px 0 5px;
					}
				}
			}

			.chart-date {
				@include flex-align($a: flex-end);
				margin-right: 25px;
			}
		}
	}

	.chart-bottom {
		flex: 1 1 50px;
		display: flex;
		position: relative;

		.loading-bar {
			position: absolute;
			top: 100%;
			right: 0px;

			background: linear-gradient(
				90deg,
				#03dac5,
				#7e51ff,
				#47ffb8,
				#e8e3ff,
				#45ffd5,
				#1c1c1c
			);
			/*background: #1c1c1c;*/
			width: calc(100% + 16px);
			height: 1px;
			overflow: hidden;

			.light-pause {
				position: absolute;
				width: 100%;
				height: 1px;
				background: gray;
				left: 0;
			}

			.light-play {
				position: absolute;
				width: 100%;
				height: 1px;
				background: linear-gradient(90deg, #03dac5, #5340d7);
				left: 0;
				animation: loading-ani 4s linear infinite;
				will-change: left;
			}

			@keyframes loading-ani {
				0% {
					left: -1%;
					right: 70%;
				}
				100% {
					left: 101%;
					right: -50%;
				}
			}
		}

		.chart-play {
			@include flex-align($a: center);
			cursor: pointer;
			/*img:hover {
				cursor: pointer;
			}*/
		}

		.chart-wrapper {
			flex: 1;
		}
	}
}
</style>

<script>
import timelineChart from '@/components/common/chart/timeline-chart';
import { mapGetters } from 'vuex';
import moment from 'moment';
import _ from 'lodash-es';

export default {
	name: 'timeline-view',
	components: {
		timelineChart,
	},
	props: {
		params: {
			type: Object,
			default: () => {},
		},
	},
	data() {
		return {
			calendarTime: 0,
			pickerOptions: {
				disabledDate(date) {
					return date.getTime() > Date.now();
				},
			},
			serviceIns: this.$webCaller.serviceIns,
			chartData: [],
			configState: {
				'-1': {
					state: 'empty',
					text: 'Empty',
					color: '#404040',
					type: -1,
				},
				'0': {
					state: 'normal',
					text: 'Normal',
					color: '#00cca8',
					type: 0,
				},
				'1': {
					state: 'abnormal',
					text: 'Abnormal',
					color: '#ffcc00',
					type: 1,
				},
				'2': {
					state: 'obstacle',
					text: 'Obstacle',
					color: '#ff7c75',
					type: 2,
				},
			},
			pause: false,
			Params: {},
		};
	},
	computed: {
		...mapGetters({
			getLatelyTime: 'params/getLatelyTime',
			getTimeLine: 'params/getTimeLine',
			getSystemId: 'params/getSystemId',
		}),
		getImgUrl() {
			let imgUrl;

			if (this.pause) {
				imgUrl = require('@/assets/svg/common/01-play-sq.svg');
			} else {
				imgUrl = require('@/assets/svg/common/01-play-pause.svg');
			}

			return imgUrl;
		},
	},
	watch: {
		getLatelyTime: {
			handler(newVal, oldVal) {
				if (!newVal) return;
				if (newVal === oldVal) return;
				if (!this.getSystemId) return;
				this.Params.sys_id = this.getSystemId;
				this.Params.date = this.getLatelyTime;
				this.summaryCall();
				this.failureCall();
			},
			immediate: true,
		},
		getTimeLine: {
			handler(data) {
				this.parseData(data);
			},
		},
	},
	created() {
		this.$EventBus.$on('EVENT_TIMELINE_TICK_CHANGE', this.chartTickChange);
	},
	mounted() {
		this.$nextTick(() => {
			this.apiCall();
		});
	},
	beforeDestroy() {
		this.$EventBus.$off('EVENT_TIMELINE_TICK_CHANGE', this.chartTickChange);
		this.$store.dispatch('params/pause', false);
	},
	destroyed() {},
	methods: {
		summaryCall() {
			this.serviceIns.get(
				this.$api.basicInfo().failureCount,
				this.Params,
				(status, response) => {
					this.$store.dispatch('params/failure_count', response);
				},
			);
		},
		failureCall() {
			this.serviceIns.get(
				this.$api.basicInfo().anomalySummary,
				this.Params,
				(status, response) => {
					this.$store.dispatch('params/anomaly_summary', response);
				},
			);
		},
		handleFocus(em) {
			const popperEm = em.popperElm;

			if (popperEm !== undefined) {
				// show datepicker calendar
				const nowButton = popperEm.querySelector('.el-button--text');

				if (nowButton && nowButton.style.display === '') {
					nowButton.style.display = 'none';
				}
			}
		},
		handleChange(changeTime) {
			const diffTime = 60 * 60 * 1000 * 3; // 3 hours
			const fromTime = changeTime - diffTime;

			const params = {
				to: changeTime,
				from: fromTime,
			};

			this.setPauseType(true);
			this.sideBarSwitchOn();
			this.apiCall(params);
		},
		apiCall(params = {}) {
			const path = this.$api.timeLine().timeLine;

			this.serviceIns.get(path, params, (status, response) => {
				const data = response.data;
				this.$store.dispatch('params/timeLine', response);
				this.parseData(data);
			});
		},
		parseData(data) {
			this.chartData = data;
			// this.updateLatelyTime(data);
		},
		updateLatelyTime(data) {
			const time = this.getLearningTime(data);

			this.dispatchLatelyTime(time);
		},
		getLearningTime(data) {
			const currentTime = moment().format('YYYY-MM-DD HH:mm');
			let targetTime = moment(currentTime).valueOf();

			if (data.length > 0) {
				// 학습된 시간의 인덱스를 찾는다.
				const lastIndex = _.findLastIndex(data, d => {
					return Number(d.type) !== -1;
				});

				if (lastIndex !== -1) {
					targetTime = moment(data[lastIndex].time).valueOf();
				}
			}

			return targetTime;
		},
		dispatchLatelyTime(time) {
			this.calendarTime = new Date(time).valueOf();
			this.$store.dispatch('params/latelyTime', time);
		},
		chartTickChange(evt) {
			const tickIndex = evt.tickIndex;

			if (tickIndex === -1) {
				console.log('timeline data length 0');
			} else {
				let time = moment(this.chartData[tickIndex].time).valueOf();

				if (evt.type !== 'dataIn') {
					this.setPauseType(true);
					this.sideBarSwitchOn();
				}

				this.dispatchLatelyTime(time);
			}
		},
		togglePlayButton() {
			const flag = !this.pause;

			this.setPauseType(flag);

			if (!flag) {
				this.sideBarSwitchOn();
				this.apiCall();
			}
		},
		setPauseType(flag) {
			this.pause = flag;
			this.$store.dispatch('params/pause', flag);
		},
		sideBarSwitchOn() {
			this.$EventBus.$emit('SIDE_BAR_SWITCH_ON');
		},
	},
};
</script>
