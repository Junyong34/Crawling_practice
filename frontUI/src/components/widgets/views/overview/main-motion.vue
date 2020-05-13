<template>
	<div ref="mainFrame" class="main-motion">
		<div ref="aniFrame" class="ani-pos"></div>
		<img
			:src="require(`@/assets/svg/motion_${params.color}/${mainMotion}.svg`)"
			style="width:100%;height: 100%; z-index: 3"
		/>

		<div class="transition-count">
			<label ref="tranText" class="tran-txt">{{ tranValue }}</label>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.main-motion {
	width: 100%;
	height: 100%;
	position: relative;
	.ani-motion-background {
		position: absolute;
		/*width: 428px;*/
		/*height: 428px;*/
		@include xai-get-style(background-color, background, container);
		border-radius: 50%;
	}
	.ani-pos {
		position: absolute;
	}
	.ani-motion {
		position: absolute;
		/*width: 428px;*/
		/*height: 428px;*/
		background: #ff180a;
		border-radius: 50%;
		animation-timing-function: ease-in-out;
		animation: sonar 2.8s 1.5s infinite;
		/*animation: pulse 2s 1s infinite;*/
	}
	.transition-count {
		position: absolute;
		z-index: 3;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		margin-top: 15px;
		.tran-txt {
			font-size: 8vw;
			font-weight: bold;
			font-stretch: normal;
			font-style: normal;
			line-height: normal;
			letter-spacing: 4.73px;
			color: #ffffff;
		}
	}
}
@keyframes sonar {
	0% {
		transform: scale(0.6);
		opacity: 1;
	}
	70% {
		transform: scale(1);
		opacity: 0.7;
	}
	100% {
		transform: scale(1.3);
		opacity: 0.3;
	}
}
</style>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'mainMotion',
	components: {},
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
		getAnomalySummary: {
			handler(newDate, oldDate) {
				if (!newDate) return;
				const anomalyCountMap = newDate.anomalyCountMap;
				this.anomalySummary = newDate;
				this.tranValue =
					anomalyCountMap.tran +
					anomalyCountMap.os +
					anomalyCountMap.was +
					anomalyCountMap.ora;
			},
		},
		viewRect: {
			handler(newData, oldData) {
				this.motionResize();
			},
		},
	},
	data() {
		return {
			sampleView: '',
			motionValue: 'Main_Motion_Test',
			anomalySummary: {},
			serviceIns: this.$webCaller.serviceIns,
			tranValue: 0,
		};
	},
	computed: {
		...mapGetters({
			getAnomalySummary: 'params/getAnomalySummary',
		}),
		mainMotion() {
			if (this.anomalySummary.anomaly) {
				// this.$refs?.aniFrame?.classList.add('ani-motion');
				return 'main_critical';
			} else {
				// this.$refs?.aniFrame?.classList.remove('ani-motion');
				return 'main_normal';
			}
		},
	},
	created() {},
	mounted() {
		this.$nextTick(() => {
			this.motionResize();
		});
	},
	methods: {
		motionResize() {
			const mainWrapper = this.$refs.mainFrame.getBoundingClientRect();
			const basicSize =
				mainWrapper.width > mainWrapper.height ? mainWrapper.height : mainWrapper.width;
			this.$refs.aniFrame.style.width = basicSize / 1.5 + 'px';
			this.$refs.aniFrame.style.height = basicSize / 1.5 + 'px';
			// this.$refs.backGroundFrame.style.width = basicSize / 1.5 + 'px';
			// this.$refs.backGroundFrame.style.height = basicSize / 1.5 + 'px';
			this.$refs.tranText.style.fontSize = basicSize / 4.5 + 'px';
		},
	},
	destroyed() {},
};
</script>
