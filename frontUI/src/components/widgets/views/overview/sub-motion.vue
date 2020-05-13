<template>
	<section class="main-section">
		<article class="graphic-article">
			<img
				:src="require(`@/assets/svg/motion_${params.color}/${imgName}_motion.svg`)"
				style="height: 100%; width:100%"
			/>
		</article>
		<article class="value-article">
			<div class="predict">
				<div ref="fontBox" class="value">
					<el-popover placement="right" width="430" trigger="hover">
						<failure-tool-tip
							:tool-tip-data="toolTipDataSet.predict_list"
							:type="type"
						></failure-tool-tip>
						<label ref="predictionVal" :class="prediction" slot="reference">{{
							predictionValue
						}}</label>
					</el-popover>
				</div>
				<div class="name"><label class="normal">Prediction</label></div>
			</div>
			<hr />
			<div class="anomaly">
				<div class="value">
					<el-popover placement="right" width="430" trigger="hover">
						<failure-tool-tip
							:tool-tip-data="toolTipDataSet.anomaly_list"
							:type="type"
						></failure-tool-tip>
						<label ref="detectionVal" :class="detection" slot="reference">{{
							detectionValue
						}}</label>
					</el-popover>
				</div>
				<div class="name"><label class="normal">Anomaly Detection</label></div>
			</div>
		</article>
	</section>
</template>

<style lang="scss">
.main-section {
	height: 100%;
	width: 100%;
	padding: 10px;
	@include flex-align($f: flex, $d: row, $j: flex-start);

	.graphic-article {
		height: 100%;
		flex: 6;
	}

	.value-article {
		height: 100%;
		flex: 4;
		@include flex-align($f: flex, $d: column, $j: center);

		.predict {
			width: 100%;
			@include flex-align($f: flex, $d: column, $j: center, $a: center);
			flex: 1;
			text-align: center;
		}

		hr {
			flex-basis: 1px;
			width: 100%;
			border: thin solid #444444;
		}

		/*background-color: #444444;*/
		.anomaly {
			@include flex-align($f: flex, $d: column, $j: center, $a: center);
			width: 100%;
			flex: 1.2;
			text-align: center;
			padding: 5px;
		}

		.value {
			flex: 1;
			width: 100%;

			label {
				font-size: 2.6vw;
				font-weight: bold;
				font-stretch: normal;
				font-style: normal;
				line-height: normal;
				letter-spacing: 2.07px;
				text-align: center;
			}
		}

		.name {
			/*flex-basis: 20px;*/
			flex: 1;
			width: 100%;
			margin-bottom: 10px;

			label {
				font-size: 0.3vw;
				font-weight: normal;
				font-stretch: normal;
				font-style: normal;
				line-height: normal;
				letter-spacing: 0.4px;
			}
		}

		.prediction {
			color: #ffde00;
		}

		.normal {
			color: #fff;
		}

		.detection {
			color: #00cca8;
		}
	}
}
</style>

<script>
import { mapGetters } from 'vuex';
import failureToolTip from '@/components/tooltip/subMotion/failureToolTip';

export default {
	name: 'subMotion',
	components: {
		failureToolTip,
	},
	props: {
		params: {
			type: Object,
			default: () => {},
		},
		viewRect: {
			type: Object,
			default: () => {},
		},
	},
	watch: {
		getFailureCount: {
			handler(newDate, oldDate) {
				this.setToolTipData(newDate);
				this.setCount(newDate);
			},
		},
		viewRect: {
			handler(newData, oldData) {
				this.subMotionResize();
			},
		},
	},
	data() {
		return {
			sampleView: '',
			prediction: 'prediction',
			detection: 'prediction',
			predictionValue: 0,
			detectionValue: 0,
			toolTipDataSet: {},
			imageFlag: {
				isPrediction: false,
				isDetection: false,
			},
			widgetTypeCount: {
				DB: ['ora_anomaly_count', 'ora_predict_count'],
				WAS: ['was_anomaly_count', 'was_predict_count'],
				OS: ['os_anomaly_count', 'os_predict_count'],
			},
			imgName: 'anomaly',
			type: this.params.widType,
		};
	},
	computed: {
		...mapGetters({
			getFailureCount: 'params/getFailureCount',
		}),
	},
	created() {},
	mounted() {
		this.$nextTick(() => {
			this.selectImg();
		});
	},
	methods: {
		setToolTipData(data) {
			this.toolTipDataSet.anomaly_list = data.anomaly_list;
			this.toolTipDataSet.predict_list = data.predict_list;
		},
		setCount(data) {
			this.detectionValue = data[this.widgetTypeCount[this.type][0]];
			this.predictionValue = data[this.widgetTypeCount[this.type][1]];

			this.prediction = this.predictionValue ? 'prediction' : 'normal';
			this.detection = this.detectionValue ? 'prediction' : 'normal';

			this.imageFlag.isDetection = !!this.detectionValue;
			this.imageFlag.isPrediction = !!this.predictionValue;
			this.selectImg();
		},
		selectImg() {
			let isAnomaly = false;
			let isPrediction = false;

			if (this.imageFlag.isDetection) {
				isAnomaly = true;
			}
			if (this.imageFlag.isPrediction) {
				isPrediction = true;
			}
			if (isAnomaly && isPrediction) {
				this.imgName = 'a_p';
				return;
			}

			if (isPrediction) {
				this.imgName = 'predict';
				return;
			}
			if (isAnomaly) {
				this.imgName = 'anomaly';
				return;
			}
			this.imgName = 'None';
		},
		subMotionResize() {
			const boxWrapper = this.$refs.fontBox.getBoundingClientRect();
			const basicSize =
				boxWrapper.width < boxWrapper.height ? boxWrapper.height : boxWrapper.width;
			// this.$refs.aniFrame.style.width = basicSize / 1.5 + 'px';
			// this.$refs.aniFrame.style.height = basicSize / 1.5 + 'px';
			// // this.$refs.backGroundFrame.style.width = basicSize / 1.5 + 'px';
			// // this.$refs.backGroundFrame.style.height = basicSize / 1.5 + 'px';
			this.$refs.predictionVal.style.fontSize = basicSize / 2.5 + 'px';
			this.$refs.detectionVal.style.fontSize = basicSize / 2.5 + 'px';
		},
	},
	destroyed() {},
};
</script>
