<template>
	<div class="widget-view-container" :ref="i">
		<div class="predict-chart-area">
			<div class="name">
				<span class="ins">{{ instName }}</span>
				<span class="metric">{{ statName }}</span>
			</div>
			<div class="popup-btn-box">
				<img
					:src="require('@/assets/svg/common/service-change-btn.svg')"
					style="width: 15px; height: 15px;"
					@click="openPopup"
				/>
			</div>
		</div>
		<div class="predict-chart" ref="pChart">
			<AiChart
				:chart-data="chartData"
				:cursor-type="cursorType"
				:header-data="headerData"
				series-type="main"
				:auto-resize="true"
				:show-legend="true"
				legend-position="right"
				:chart-height="chartHeight"
				@scatter-click="clickEvent"
			></AiChart>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.widget-view-container {
	height: 100%;
	width: 100%;
	// min-width: 80%;
	@include flex-align($f: flex, $d: column, $j: center);

	.predict-chart-area {
		flex-basis: 25px;
		width: 100%;
		@include xai-get-style(background-color, background, container);
		@include flex-align($f: inline-flex, $d: row, $j: flex-start);

		.name {
			flex: 1;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			.ins {
				margin-left: 10px;
				margin-right: 3px;
				color: #d8d8d8;
				/* background: rgba(165, 165, 165, 0.28); */
			}
			.metric {
				color: #d8d8d8;
			}
			span {
				font-size: 12px;
			}
		}

		.popup-btn-box {
			height: 15px;
			@include flex-align($j: flex-end);

			img {
				margin-right: 4px;
			}

			img:hover {
				cursor: pointer;
			}
		}
	}

	.predict-chart {
		flex: 1;
		height: 100%;
	}
}
</style>

<script>
import { mapGetters } from 'vuex';
import AiChart from '@/components/common/chart/XAIOpse-chart';
import ChangePopup from '@/components/realTime/ins-metric-change-popup';

export default {
	name: 'osPredictAIChart-view',
	components: {
		AiChart,
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
		i: {
			type: String,
			default: '',
		},
	},
	watch: {
		getSystemId: {
			handler(newData, oldData) {
				this.inst = null; // systemId 변경되서 초기화
				// this.apiCall();
			},
		},
		getLatelyTime: {
			handler(newDate, oldDate) {
				if (!newDate) return;
				if (newDate === oldDate) return;
				// this.chartParams.date = newDate;
				this.apiCall();
			},
		},
		params: {
			handler(newData, oldData) {
				this.apiCall();
			},
			deep: true,
		},
		viewRect: {
			handler(newData, oldData) {
				this.chartHeight = newData.h;
			},
		},
	},
	data() {
		return {
			sampleView: '',
			chartData: [],
			chartHeight: 120,
			chartParams: {},
			cursorType: 'none',
			headerData: {},
			serviceIns: this.$webCaller.serviceIns,
			sys_id: this.params.sys_id,
			inst: this.params.inst,
			metric: this.params.metric,
			isPredict: true,
			type: 'os',
			uri: this.$api.instancePerformance().instPerformance,
		};
	},
	computed: {
		...mapGetters({
			getLatelyTime: 'params/getLatelyTime',
			getInstanceList: 'params/getInstanceList',
			getMetricList: 'params/getMetricList',
			getSystemId: 'params/getSystemId',
		}),
		instName() {
			return this.headerData
				? `[${this.headerData.tier_name || ''}]${this.headerData.inst_name || ''}`
				: '';
		},
		statName() {
			const unit = this.headerData
				? this.headerData.unit !== ''
					? `(${this.headerData.unit || ''})`
					: this.headerData.unit
				: '';
			return this.headerData ? `━ ${this.headerData.stat || ''}${unit}` : '';
		},
	},
	created() {
		// this.$EventBus.$on(this.$EventBus.type.AI_CHART_CLICK, p => {
		// 	console.log(this.headerData.type);
		// });
	},
	mounted() {
		this.$nextTick(() => {
			// console.log(this.params, this.id, this.api);
			this.chartHeight = this.$refs.pChart.clientHeight;
			this.apiCall();
			this.loadingCreateList();
		});
	},
	methods: {
		loadingCreateList() {
			this.$loading.create(this.i, {
				container: this.$refs[this.i],
			});
		},
		clickEvent(params) {
			console.log(this.headerData.type);
		},
		apiCall() {
			if (!this.getInstanceList) return null;
			// inst 값이 없으면 기본 0번쨰를 선택한다.
			if (this.inst) {
				this.inst = !this.params.inst ? this.inst : this.params.inst;

				this.metric = !this.params.metric ? this.metric : this.params.metric;
				this.chartData_Call();
			} else {
				this.defaultSetting();
				this.chartData_Call();
			}
		},
		defaultSetting() {
			this.inst = this.getInstanceList.filter(inst => {
				return inst.sys_id === this.getSystemId && inst.type === this.type;
			})[0];
			this.metric = this.getMetricList.filter(metric => {
				return metric.inst_type === this.type && metric.predict === this.isPredict;
			})[0];
		},
		chartData_Call() {
			if (!this.getLatelyTime) return;
			this.chartParams.sys_id = this.getSystemId;
			this.chartParams.inst_id = this.inst.inst_id;
			this.chartParams.stat = this.metric.metric_id;
			this.chartParams.date = this.getLatelyTime;
			this.serviceIns.get(this.uri, this.chartParams, (status, response) => {
				this.chartData = response.data.body;
				this.headerData = response.data.header;
				this.cursorType = this.headerData.type;
			});
		},
		openPopup() {
			this.$loading.show(this.i);
			const params = {
				show: true,
				x: 760, // 960-w/2
				y: 353, // 528-h/2
				w: 330,
				h: 250,
				z: 800,
				titleLabel: 'chart Option',
				contentsComp: ChangePopup, // contents component
				loadingId: this.i,
				params: {
					widgetId: this.i,
					inst: this.inst,
					uri: this.uri,
					metric: this.metric,
					type: this.type,
					predict: this.isPredict,
				},
				resizable: false, // resize 여부
				draggable: false, // drag 여부
				minimizable: false, // 최소화 여부
				modal: true, // modal 여부
			};

			this.$store.dispatch('params/main_layer_popup', params);
		},
	},
	destroyed() {},
};
</script>
