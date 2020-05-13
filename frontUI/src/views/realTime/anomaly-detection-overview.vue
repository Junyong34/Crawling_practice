<template>
	<div class="dashboard-layout-wrap" ref="dashboardLayoutWrap">
		<dashboard-layout :layout.sync="layout" :row-num="57" />
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import defaultMixin from '@/mixins/defaultMixin';
import { setItem, getItem } from '@/common/LocalStorageMemager';

export default {
	name: 'anomalyDetection',
	components: {
		DashboardLayout,
	},
	mixins: [defaultMixin],
	props: {
		viewId: { type: [String, Number] },
	},
	data() {
		return {
			layout: [],
			viewKey: 'ADO-1',
		};
	},
	computed: {
		...mapGetters({
			// getIsUseWidgetList: 'widget/getIsUseWidgetList',
			// getSelectedDashboard: 'widget/getSelectedDashboard',
			// getDashboardLayout: 'widget/getDashboardLayout',
			getActiveView: 'getActiveView',
			// getSelectedWidgetFormat: 'widget/getSelectedWidgetFormat',
		}),
	},
	watch: {
		layout: {
			handler(data) {
				// 선택된 serviceId 추출해서 저장한다.
				this.layout = data;
				setItem(this.viewKey, this.layout);
			},
			// immediate: true,
		},
	},
	created() {
		const browserLayout = getItem(this.viewKey);
		if (browserLayout) {
			this.layout = browserLayout;
		} else {
			this.layout = [
				{
					...{ i: 'widget0', x: 0, y: 0, w: 48, h: 5 },
					component: {
						params: {},
					},
					widget: {
						header: '',
						title: '',
						body: 'overview/timeline-view',
					},
				},
				{
					...{ i: 'widget1', x: 0, y: 5, w: 16, h: 13 },
					component: {
						header: {
							type: 'DB',
							frame: 'anomaly',
						},
						params: {
							// sys_id: '2',
							// stat: 'cpu_sys',
							// inst_id: null,
							date: null,
							// inst_name: 'FEP_AP_OS',
							inst: null,
							metric: null,
							// header: null,
							// inst_type: 'all',
							// type: 'os,',
						},
					},
					widget: {
						title: '이상탐지',
						header: 'aiChart-type-header',
						body: 'overview/AnomalyDetection/DB-detection-Frame',
					},
				},
				{
					...{ i: 'widget2', x: 16, y: 5, w: 16, h: 13 },
					component: {
						header: {
							type: 'WAS',
							frame: 'anomaly',
						},
						params: {
							// sys_id: '2',
							// stat: 'cpu_sys',
							// inst_id: null,
							date: null,
							// inst_name: 'FEP_AP_OS',
							inst: null,
							metric: null,
							// header: null,
							// inst_type: 'all',
							// type: 'os,',
						},
					},
					widget: {
						title: '이상탐지',
						header: 'aiChart-type-header',
						body: 'overview/AnomalyDetection/WAS-detection-Frame',
					},
				},
				{
					...{ i: 'widget3', x: 32, y: 5, w: 16, h: 13 },
					component: {
						header: {
							type: 'OS',
							frame: 'anomaly',
						},
						params: {
							// sys_id: '2',
							// stat: 'cpu_sys',
							// inst_id: null,
							date: null,
							// inst_name: 'FEP_AP_OS',
							inst: null,
							metric: null,
							// header: null,
							// inst_type: 'all',
							// type: 'os,',
						},
					},
					widget: {
						title: '이상탐지',
						header: 'aiChart-type-header',
						body: 'overview/AnomalyDetection/OS-detection-Frame',
					},
				},
				{
					...{ i: 'widget4', x: 0, y: 18, w: 16, h: 13 },
					component: {
						header: {
							type: 'DB',
							frame: 'anomaly',
						},
						// uri: this.$api.instancePerformance().instPerformance,
						params: {
							// sys_id: '2',
							// stat: 'cpu_sys',
							// inst_id: null,
							date: null,
							// inst_name: 'FEP_AP_OS',
							inst: null,
							metric: null,
							// header: null,
							// inst_type: 'all',
							// type: 'os,',
						},
					},
					widget: {
						title: '이상탐지',
						header: 'aiChart-type-header',
						body: 'overview/AnomalyDetection/DB-detection-Frame',
					},
				},
				{
					...{ i: 'widget5', x: 16, y: 18, w: 16, h: 13 },
					component: {
						header: {
							type: 'WAS',
							frame: 'anomaly',
						},
						// uri: this.$api.instancePerformance().instPerformance,
						params: {
							// sys_id: '2',
							// stat: 'cpu_sys',
							// inst_id: null,
							date: null,
							// inst_name: 'FEP_AP_OS',
							inst: null,
							metric: null,
							// header: null,
							// inst_type: 'all',
							// type: 'os,',
						},
					},
					widget: {
						title: '이상탐지',
						header: 'aiChart-type-header',
						body: 'overview/AnomalyDetection/WAS-detection-Frame',
					},
				},
				{
					...{ i: 'widget6', x: 32, y: 18, w: 16, h: 13 },
					component: {
						header: {
							type: 'OS',
							frame: 'anomaly',
						},
						// uri: this.$api.instancePerformance().instPerformance,
						params: {
							// sys_id: '2',
							// stat: 'cpu_sys',
							// inst_id: null,
							date: null,
							// inst_name: 'FEP_AP_OS',
							inst: null,
							metric: null,
							// header: null,
							// inst_type: 'all',
							// type: 'os,',
						},
					},
					widget: {
						title: '이상탐지',
						header: 'aiChart-type-header',
						body: 'overview/AnomalyDetection/OS-detection-Frame',
					},
				},
				{
					...{ i: 'widget7', x: 0, y: 31, w: 16, h: 13 },
					component: {
						header: {
							type: 'DB',
							frame: 'anomaly',
						},
						// uri: this.$api.instancePerformance().instPerformance,
						params: {
							// sys_id: '2',
							// stat: 'cpu_sys',
							// inst_id: null,
							date: null,
							// inst_name: 'FEP_AP_OS',
							inst: null,
							metric: null,
							// header: null,
							// inst_type: 'all',
							// type: 'os,',
						},
					},
					widget: {
						title: '이상탐지',
						header: 'aiChart-type-header',
						body: 'overview/AnomalyDetection/DB-detection-Frame',
					},
				},
				{
					...{ i: 'widget8', x: 16, y: 31, w: 16, h: 13 },
					component: {
						header: {
							type: 'WAS',
							frame: 'anomaly',
						},
						// uri: this.$api.instancePerformance().instPerformance,
						params: {
							// sys_id: '2',
							// stat: 'cpu_sys',
							// inst_id: null,
							date: null,
							// inst_name: 'FEP_AP_WAS',
							inst: null,
							metric: null,
							// header: null,
							// inst_type: 'all',
							// type: 'os,',
						},
					},
					widget: {
						title: '이상탐지',
						header: 'aiChart-type-header',
						body: 'overview/AnomalyDetection/WAS-detection-Frame',
					},
				},
				{
					...{ i: 'widget9', x: 32, y: 31, w: 16, h: 13 },
					component: {
						header: {
							type: 'OS',
							frame: 'anomaly',
						},
						// uri: this.$api.instancePerformance().instPerformance,
						params: {
							// sys_id: '2',
							// stat: 'cpu_sys',
							// inst_id: null,
							date: null,
							// inst_name: 'FEP_AP_WAS',
							inst: null,
							metric: null,
							// header: null,
							// inst_type: 'all',
							// type: 'os,',
						},
					},
					widget: {
						title: '이상탐지',
						header: 'aiChart-type-header',
						body: 'overview/AnomalyDetection/OS-detection-Frame',
					},
				},
				{
					...{ i: 'widget10', x: 0, y: 44, w: 16, h: 13 },
					component: {
						header: {
							type: 'DB',
							frame: 'anomaly',
						},
						// uri: this.$api.instancePerformance().instPerformance,
						params: {
							// sys_id: '2',
							// stat: 'cpu_sys',
							// inst_id: null,
							date: null,
							// inst_name: 'FEP_AP_WAS',
							txn: null,
							metric: null,
							// header: null,
							// inst_type: 'all',
							// type: 'os,',
						},
					},
					widget: {
						title: '이상탐지',
						header: 'aiChart-type-header',
						body: 'overview/AnomalyDetection/DB-detection-Frame',
					},
				},
				{
					...{ i: 'widget11', x: 16, y: 44, w: 16, h: 13 },
					component: {
						header: {
							type: 'WAS',
							frame: 'anomaly',
						},
						// uri: this.$api.instancePerformance().instPerformance,
						params: {
							// sys_id: '2',
							// stat: 'cpu_sys',
							// inst_id: null,
							date: null,
							// inst_name: 'FEP_AP_TXN',
							txn: null,
							metric: null,
							// header: null,
							// inst_type: 'all',
							// type: 'os,',
						},
					},
					widget: {
						title: '이상탐지',
						header: 'aiChart-type-header',
						body: 'overview/AnomalyDetection/WAS-detection-Frame',
					},
				},
				{
					...{ i: 'widget12', x: 32, y: 44, w: 16, h: 13 },
					component: {
						header: {
							type: 'OS',
							frame: 'anomaly',
						},
						// uri: this.$api.instancePerformance().instPerformance,
						params: {
							// sys_id: '2',
							// stat: 'cpu_sys',
							// inst_id: null,
							date: null,
							// inst_name: 'FEP_AP_TXN',
							txn: null,
							metric: null,
							// header: null,
							// inst_type: 'all',
							// type: 'os,',
						},
					},
					widget: {
						title: '이상탐지',
						header: 'aiChart-type-header',
						body: 'overview/AnomalyDetection/OS-detection-Frame',
					},
				},
			];
		}
		this.$nextTick(() => {
			this.generateActiveView();
		});
	},
	mounted() {
		this.$webCaller.initRepeatTime();
		this.$nextTick(() => {
			this.$webCaller.rtmTimeCall();
		});
	},
	methods: {
		callDashboard() {
			// const params = {
			// 	title: noned,
			// };
			//
			// this.serviceIns.setApiPath(this.$api.dashboard.dashboard);
			// this.serviceIns
			// 	.get(params, (status, response) => {
			// 		if (!response || !Array.isArray(response.data)) return;
			// 		const dashboard = response.data.find(e => e.title === this.viewId);
			//
			// 		this.$store.dispatch('widget/selected_dashboard', dashboard);
			// 		const layout = JSON.parse(dashboard.layout);
			//
			// 		this.layout = this.generateLayout(layout);
			// 	})
			// 	.then(() => this.checkedIsUseWidget());
		},
		generateActiveView() {
			// const activeView = this.getActiveView;
			//
			// if (!activeView.params.mainLabel || !activeView.params.label) {
			// 	const params = {
			// 		mainLabel: 'Dashboard',
			// 		label: activeView.name === 'documentDashboardLayout' ? 'Document' : 'Template',
			// 		viewId: this.viewId,
			// 	};
			//
			// 	this.$store.dispatch('activeView', {
			// 		...activeView,
			// 		params,
			// 	});
			// }
		},
		generateLayout(layout = []) {
			// const data = [];
			//
			// const _layout = [...layout];
			//
			// _layout.forEach(e => {
			// 	if (e.info) {
			// 		const i = e.id;
			// 		const info = e.info;
			//
			// 		const item = { ...e };
			// 		const options = e.options;
			// 		const _static = options.static;
			//
			// 		delete item.info;
			// 		delete options.static;
			// 		data.push({
			// 			i,
			// 			...info,
			// 			...item,
			// 			static: _static,
			// 			options,
			// 		});
			// 	} else {
			// 		data.push(e);
			// 	}
			// });
			//
			// return data;
		},
	},
	beforeDestroy() {},
};
</script>

<style lang="scss" scoped>
.dashboard-layout-wrap {
	width: 100%;
	height: 100%;
	overflow-y: auto;

	&::-webkit-scrollbar {
		display: none;
	}
}
</style>
