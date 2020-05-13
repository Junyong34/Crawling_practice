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
	name: 'dashboard-settings',
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
			viewKey: 'mainOverView2-1',
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
					...{ i: 'widget1', x: 0, y: 5, w: 24, h: 36 },
					component: {
						params: {
							date: null,
							color: 'blue',
						},
					},
					widget: {
						title: 'AI Monitoring',
						header: 'default-header',
						body: 'overview/main-motion',
					},
				},
				{
					...{ i: 'widget2', x: 24, y: 5, w: 24, h: 13 },
					component: {
						params: {
							// sys_id: '2',
							// stat: 'cpu_sys',
							// inst_id: null,
							date: null,
							// inst_name: 'FEP_AP_OS',
							metric: null,
							// header: null,
							// inst_type: 'all',
							// type: 'os,',
						},
					},
					widget: {
						title: 'Overall Performance(전체 트랜잭션 성능)',
						header: 'default-header',
						body: 'overview/e2e-performance-Frame-view',
					},
				},
				{
					...{ i: 'widget3', x: 24, y: 18, w: 24, h: 13 },
					component: {
						params: {
							// sys_id: '2',
							// stat: 'cpu_sys',
							// inst_id: null,
							date: null,
							// inst_name: 'FEP_AP_OS',
							metric: null,
							// header: null,
							// inst_type: 'all',
							// type: 'os,',
						},
					},
					widget: {
						title: 'Overall Performance(전체 트랜잭션 성능)',
						header: 'default-header',
						body: 'overview/e2e-performance-Frame-view',
					},
				},
				{
					...{ i: 'widget4', x: 24, y: 31, w: 24, h: 13 },
					component: {
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
						title: 'Instance Performance(개별성능)',
						header: 'default-header',
						body: 'overview/predict-allInstance-Frame-view',
					},
				},
				{
					...{ i: 'widget5', x: 24, y: 44, w: 24, h: 13 },
					component: {
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
						title: 'Instance Performance(개별성능)',
						header: 'default-header',
						body: 'overview/predict-allInstance-Frame-view',
					},
				},
				{
					...{ i: 'widget6', x: 0, y: 41, w: 8, h: 16 },
					component: {
						params: {
							widType: 'WAS',
							color: 'blue',
						},
					},
					widget: {
						title: 'WAS',
						header: 'default-header',
						body: 'overview/sub-motion',
					},
				},
				{
					...{ i: 'widget7', x: 8, y: 41, w: 8, h: 16 },
					component: {
						params: {
							widType: 'DB',
							color: 'blue',
						},
					},
					widget: {
						title: 'DB',
						header: 'default-header',
						body: 'overview/sub-motion',
					},
				},
				{
					...{ i: 'widget8', x: 16, y: 41, w: 8, h: 16 },
					component: {
						params: {
							widType: 'OS',
							color: 'blue',
						},
					},
					widget: {
						title: 'OS',
						header: 'default-header',
						body: 'overview/sub-motion',
					},
				},
			];
		}
		this.$nextTick(() => {
			this.generateActiveView();
		});
	},
	mounted() {},
	methods: {
		callDashboard() {
			// const params = {
			// 	title: this.viewId,
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
