<template>
	<div class="dashboard-layout-wrap" ref="dashboardLayoutWrap">
		<dashboard-layout
			:layout.sync="layout"
			:row-num="56"
			:drag-allow-from="dragAllowFrom"
			:drag-ignore-from="dragIgnoreFrom"
			:resize-ignore-from="resizeIgnoreFrom"
		/>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import defaultMixin from '@/mixins/defaultMixin';
import { setItem, getItem } from '@/common/LocalStorageMemager';

export default {
	name: 'trend-chart',
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
			viewKey: 'mainOverView',
			dragAllowFrom: '',
			dragIgnoreFrom: '.widget-view, .widget-header-btn-wrap',
			resizeIgnoreFrom: '.widget-container, .added-item',
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
		console.log(browserLayout);
		// if (browserLayout) {
		// 	this.layout = browserLayout;
		// } else {
		// TODO 화면 저장기능 일단 제거
		this.layout = [
			{
				...{ i: 'widget0', x: 0, y: 0, w: 48, h: 4, static: true },
			},
			{
				...{ i: 'widget1', x: 0, y: 4, w: 16, h: 13, static: true },
				widget: {
					header: 'default-header',
				},
				component: {},
			},
			{
				...{ i: 'widget2', x: 16, y: 4, w: 16, h: 13, static: true },
				widget: {
					header: 'default-header',
				},
				component: {},
			},
			{
				...{ i: 'widget3', x: 32, y: 4, w: 16, h: 13, static: true },
				widget: {
					header: 'default-header',
				},
				component: {},
			},
			{
				...{ i: 'widget4', x: 0, y: 17, w: 16, h: 13, static: true },
				widget: {
					header: 'default-header',
				},
				component: {},
			},
			{
				...{ i: 'widget5', x: 16, y: 17, w: 16, h: 13, static: true },
				widget: {
					header: 'default-header',
				},
				component: {},
			},
			{
				...{ i: 'widget6', x: 32, y: 17, w: 16, h: 13, static: true },
				widget: {
					header: 'default-header',
				},
				component: {},
			},
			{
				...{ i: 'widget7', x: 0, y: 30, w: 16, h: 13, static: true },
				widget: {
					header: 'default-header',
				},
				component: {},
			},
			{
				...{ i: 'widget8', x: 16, y: 30, w: 16, h: 13, static: true },
				widget: {
					header: 'default-header',
				},
				component: {},
			},
			{
				...{ i: 'widget9', x: 32, y: 30, w: 16, h: 13, static: true },
				widget: {
					header: 'default-header',
				},
				component: {},
			},
			{
				...{ i: 'widget10', x: 0, y: 43, w: 16, h: 13, static: true },
				widget: {
					header: 'default-header',
				},
				component: {},
			},
			{
				...{ i: 'widget11', x: 16, y: 43, w: 16, h: 13, static: true },
				widget: {
					header: 'default-header',
				},
				component: {},
			},
			{
				...{ i: 'widget12', x: 32, y: 43, w: 16, h: 13, static: true },
				widget: {
					header: 'default-header',
				},
				component: {},
			},
		];
		// }
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
