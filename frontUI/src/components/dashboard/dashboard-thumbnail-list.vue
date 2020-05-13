<template>
	<div ref="dashboardList" class="xai-dashboard-list">
		<dashboard-thumbnail
			v-for="(item, i) in dashboardList"
			:key="item.id"
			:index="i"
			v-bind="item"
			ref="dashboardListItem"
			v-on="$listeners"
			@dblclick="linkMove(item)"
			@click="
				(e, thumbnailURL) => {
					onClickDashboard(item, i, e, thumbnailURL);
				}
			"
			@click-outside="onClickOutsideDashboard(item, i, $event)"
		/>
		<div class="dashboard-add-btn" @click="createViewMove">Add +</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import DashboardThumbnail from '@/components/dashboard/dashboard-thumbnail';

export default {
	name: 'dashboardList',
	mixins: [],
	components: { DashboardThumbnail },
	props: {
		dashboardList: {
			type: Array,
			default: () => [],
		},
	},
	data() {
		return {
			dashboardSelection: [],
			selectable: false,
		};
	},
	watch: {
		dashboardList: {
			handler(data) {},
		},
	},
	computed: {
		...mapGetters({
			getActiveView: 'getActiveView',
		}),
	},
	mounted() {},
	methods: {
		onClickDashboard(item, index, event, thumbnail) {
			const dom = this.getDashboardListItemDOM(item.id);
			const _item = { ...item, thumbnail };

			dom.classList.add('selected');
			this.dashboardSelection = [_item];

			// this.selectable = event.ctrlKey;
			//
			// const dom = this.getDashboardListItemDOM(item.id);
			// const _item = { ...item, thumbnail };
			//
			// if (!dom) return;
			//
			// if (this.selectable) {
			// 	const idx = this.dashboardSelection.findIndex(d => d.id === _item.id);
			//
			// 	if (idx < 0) {
			// 		this.dashboardSelection.push(_item);
			// 		dom.classList.add('selected');
			// 	} else {
			// 		this.dashboardSelection.splice(idx, 1);
			// 		dom.classList.remove('selected');
			// 	}
			// } else {
			// 	dom.classList.add('selected');
			// 	this.dashboardSelection = [_item];
			// }
			this.$emit('selected-dashboard', this.dashboardSelection, _item);
		},
		onClickOutsideDashboard(item, index, event) {
			if (this.selectable) return;

			if (!event.path.includes(this.$refs.dashboardList)) return;

			if (
				event.path.some(
					dom => dom.className && dom.className.includes('xai-dashboard-list-item'),
				)
			) {
				const dom = this.getDashboardListItemDOM(item.id);

				if (!dom) return;
				dom.classList.remove('selected');
			}
		},
		linkMove(dashboard) {
			console.log(dashboard);
			this.$store.dispatch('widget/selected_dashboard', dashboard);
			this.$store.dispatch('widget/dashboard_layout', JSON.parse(dashboard.layout));

			const dashboardType = this.getActiveView.name.replace('Dashboard', '');

			this.$router.push({
				name: `${this.getActiveView.name}Layout`,
				params: {
					label: dashboardType.charAt(0).toUpperCase() + dashboardType.slice(1),
					mainLabel: 'Dashboard',
					viewId: dashboard.id,
				},
			});
		},
		clearDashboardSelection() {
			const vmList = this.$refs.dashboardListItem;

			if (vmList && Array.isArray(vmList)) {
				vmList.forEach(item => {
					item.$el.classList.remove('selected');
				});
			}
		},
		getDashboardListItemDOM(id) {
			const vmList = this.$refs.dashboardListItem;

			if (!vmList && !vmList.length) return null;

			const vm = vmList.find(item => item.id === id);

			if (!vm) return null;
			return vm.$el;
		},
		createViewMove() {
			// 신규 화면 셋팅
			this.$store.dispatch('widget/dashboard_layout', []);
			this.$store.dispatch('widget/selected_dashboard', null);
			this.$router.push({
				name: 'createDashboardLayout',
				params: {
					label: 'Create',
					mainLabel: 'Dashboard',
				},
			});
		},
	},
	destroyed() {},
};
</script>

<style lang="scss" scoped>
.xai-dashboard-list {
	height: calc(100% - 44px);
	overflow-y: auto;
}

.dashboard-add-btn {
	float: left;
	@include flex-align($a: center, $j: center);
	width: calc(25% - 8px);
	height: calc(25% - 8px);
	margin: 4px;
	opacity: 0.8;
	font-size: 14px;
	position: relative;
	cursor: pointer;
	@include xai-get-style(box-shadow, box-shadow, container);

	&:hover {
		border: solid 1px #906aff;
		background-color: rgba(144, 106, 255, 0.1);
	}
}
</style>
