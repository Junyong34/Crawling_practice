<template>
	<div class="widget-view-container" :ref="i">
		<div class="predict-chart-area">
			<div class="name">
				<span class="ins">{{ txnName }}</span>
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
import ChangePopup from '@/components/realTime/txnMetric-change-popup';

export default {
	name: 'txnPredictAIChart',
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
				this.txn = null; // systemId 변경되서 초기화
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
			txn: this.params.txn,
			metric: this.params.metric,
			isPredict: true,
			type: 'txn',
			uri: this.$api.fcst().data,
		};
	},
	computed: {
		...mapGetters({
			getLatelyTime: 'params/getLatelyTime',
			getTxnList: 'params/getTxnList',
			getMetricList: 'params/getMetricList',
			getSystemId: 'params/getSystemId',
		}),
		txnName() {
			return this.headerData ? `${this.headerData.txn_name || ''}` : '';
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
			if (!this.getTxnList || this.getTxnList.length === 0) return null;
			// inst 값이 없으면 기본 0번쨰를 선택한다.
			if (this.txn) {
				this.txn = !this.params.txn ? this.txn : this.params.txn;

				this.metric = !this.params.metric ? this.metric : this.params.metric;
				this.chartData_Call();
			} else {
				this.defaultSetting();
				this.chartData_Call();
			}
		},
		defaultSetting() {
			this.txn = this.getTxnList.filter(inst => {
				return inst.sys_id === this.getSystemId;
			})[0];
			this.metric = this.getMetricList.filter(metric => {
				return metric.inst_type === this.type && metric.predict === this.isPredict;
			})[0];
		},
		chartData_Call() {
			if (!this.getLatelyTime) return;
			this.chartParams.sys_id = this.getSystemId;
			this.chartParams.txn_id = this.txn.txn_id;
			this.chartParams.stat = this.metric.metric_id;
			this.chartParams.date = this.getLatelyTime;
			this.serviceIns.get(this.uri, this.chartParams, (status, response) => {
				this.chartData = response.data.body;
				this.headerData = response.data.header;
				this.cursorType = this.headerData.type;
			});
		},
		openPopup() {
			if (!this.txn) {
				this.$message({
					type: 'info',
					message: '트랜잭션이 존재하지 않습니다.',
				});
				return;
			}
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
					txn: this.txn,
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
