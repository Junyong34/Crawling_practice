<template>
	<grid-layout
		ref="dashboardLayout"
		class="dashboard-layout"
		:layout="cloneLayout"
		:col-num="colNum"
		:margin="margin"
		:row-height="rowHeight"
		:vertical-compact="verticalCompact"
		:use-css-transforms="false"
		v-resize="setRowHeight"
		v-on="$listeners"
	>
		<grid-item
			v-for="item in cloneLayout"
			:key="item.i"
			:class="[
				'dashboard-item-wrap',
				addedItem && addedItem.i === item.i ? 'added-item' : null,
				widgetResizable ? '' : 'not-resizable',
			]"
			:ref="item.i"
			:i="item.i"
			:x="item.x"
			:y="item.y"
			:w="item.w"
			:h="item.h"
			:min-w="item.minW"
			:max-w="item.maxW"
			:min-h="item.minH"
			:max-h="item.maxH"
			:static="item.static"
			:drag-allow-from="dragAllowFrom"
			:drag-ignore-from="dragIgnoreFrom"
			:resize-ignore-from="resizeIgnoreFrom"
			@container-resized="resizedHandle"
			@resized="resizedHandle"
			v-on="$listeners"
		>
			<widget-container
				v-if="!(addedItem && addedItem.i === item.i)"
				ref="widget"
				v-bind="item"
				:static.sync="item.static"
				:rect="widgetRectList[item.i]"
				:pause="pause"
				:row-height="rowHeight"
				@remove="removeHandle"
			/>
		</grid-item>
	</grid-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import interact from 'interactjs';
import WidgetContainer from '@/components/widgets/widget-container';
import _ from 'lodash-es';

export default {
	name: 'dashboard-layout',
	components: {
		WidgetContainer,
	},
	props: {
		layout: { type: Array, default: () => [] },
		colNum: { type: Number, default: 48 },
		rowNum: { type: Number, default: 36 },
		margin: { type: Array, default: () => [8, 8] },
		verticalCompact: { type: Boolean, default: true },
		dragAllowFrom: { type: String, default: '' },
		dragIgnoreFrom: { type: String, default: '.widget-container' },
		resizeIgnoreFrom: { type: String, default: '.widget-container' },
		widgetResizable: { type: Boolean, default: false },
	},
	data() {
		return {
			rowHeight: 0,
			pause: false,
			cloneLayout: this.layout,
			addedItem: null,
			widgetRectList: {},
		};
	},
	computed: {
		...mapGetters({
			getIsUseWidgetList: 'widget/getIsUseWidgetList',
			getSelectedWidgetFormat: 'widget/getSelectedWidgetFormat',
		}),
	},
	watch: {
		cloneLayout: {
			handler(data) {
				this.checkedIsUseWidget();
				this.onLayoutUpdate(data);
			},
		},
		layout: {
			handler(data) {
				this.cloneLayout = data;
			},
			immediate: true,
			deep: true,
		},
	},
	created() {
		this.$EventBus.$on('UPDATE_WIDGET', this.updateWidgetHandler);

		this.$nextTick(() => {});
	},
	mounted() {
		this.$nextTick(() => {
			this.tryMakeDropZone();
		});
	},
	methods: {
		resizedHandle(i, h, w, rectH, rectW) {
			this.$set(this.widgetRectList, i, { h: rectH, w: rectW });
		},
		moveHandle() {
			if (this.pause) return;
			this.pause = true;

			document.addEventListener(
				'mouseup',
				() => {
					this.pause = false;
				},
				{ once: true },
			);
		},
		setRowHeight() {
			const margin = this.margin[1];
			let dashboardHeight = this.$el.parentElement.offsetHeight;

			//TODO 반응형으로 변경
			// if (dashboardHeight < 870) {
			// 	dashboardHeight = 870;
			// 	this.$refs.dashboardLayout.layoutUpdate();
			// }

			this.rowHeight = (dashboardHeight - margin) / this.rowNum - margin;
		},
		removeHandle(i) {
			this.$confirm('Are you sure you want to remove this item?', 'Remove', {
				// 내용, 제목, 커스텀 영역
				confirmButtonText: 'OK',
				cancelButtonText: 'Cancel',
				type: 'warning', // success / info / warning / error
			})
				.then(() => {
					this.removeItem(i);
					this.$message({
						type: 'success',
						message: 'Remove completed',
					});
				})
				.catch(() => {
					this.$message({
						type: 'info',
						message: 'Remove canceled',
					});
				});
		},
		removeItem(i) {
			this.cloneLayout.splice(
				this.cloneLayout.findIndex(l => l.i === i),
				1,
			);
		},
		updateWidgetHandler(id, data, deepMerge) {
			const idx = this.cloneLayout.findIndex(l => l.i === id);
			const widget = Object.assign({}, this.cloneLayout[idx]);

			let mergeWidget;
			if (deepMerge) {
				mergeWidget = _.merge(widget, data);
			} else {
				mergeWidget = { ...widget, ...data };
			}

			this.$set(this.cloneLayout, idx, mergeWidget);
			// this.$message({
			// 	message: this.$t('widget.update_widget'),
			// 	type: 'success',
			// });
		},
		checkedIsUseWidget() {
			const isUseWidgetList = this.getIsUseWidgetList;

			isUseWidgetList.forEach(w => {
				w.isUse = this.cloneLayout.some(l => l.i === w.i);
			});

			this.$store.dispatch('widget/is_use_widget_list', isUseWidgetList);
		},
		onLayoutUpdate(layout) {
			this.$emit('update:layout', layout);
		},
		tryMakeDropZone() {
			const self = this;

			this.interactObj = interact(document.body);

			this.interactObj.dropzone({});
			this.interactObj.on('dragenter dropmove dropdeactivate', self.dropHandle);
		},
		dropHandle(event) {
			const dragEvent = event.dragEvent;

			if (!this.getSelectedWidgetFormat) return;
			if (!this.addedItem && dragEvent.type === 'dragmove') {
				dragEvent.type = 'dragstart';

				this.checkedIsUseWidget();

				const widgetFormat = this.getSelectedWidgetFormat;
				const avlWidget = this.getIsUseWidgetList.find(d => !d.isUse);
				const widgetId = avlWidget.i;

				this.addedItem = {
					...widgetFormat,
					i: widgetId,
					static: false,
					x: 0,
					y: 0,
				};

				this.layout.push(this.addedItem);

				this.checkedIsUseWidget();
			}

			if (!this.addedItem) return;

			this.$nextTick(() => {
				const addedItem = this.$refs[this.addedItem.i][0];

				if (addedItem) {
					dragEvent.target = addedItem.$el;
					addedItem.handleDrag(dragEvent);

					if (dragEvent.type === 'dragstart') {
						this.pause = true;
						const pos = this.getWidgetCenterPosition(
							addedItem,
							dragEvent.clientX,
							dragEvent.clientY,
						);

						addedItem.dragging.left = pos.x;
						addedItem.dragging.top = pos.y;
					} else if (dragEvent.type === 'dragend') {
						this.pause = false;
						this.addedItem = null;
						this.$store.dispatch('widget/selected_widget_format', null);
					}
				}
			});
		},
		getWidgetCenterPosition(item, x, y) {
			const dashboardLayout = this.$refs.dashboardLayout;
			const layoutRect = dashboardLayout.$el.getBoundingClientRect();
			return {
				x: x - layoutRect.left - item.$el.offsetWidth / 2,
				y: y - layoutRect.top - item.$el.offsetHeight / 2,
			};
		},
	},
	beforeDestroy() {
		this.$EventBus.$off('UPDATE_WIDGET', this.updateWidgetHandler);
		this.interactObj.unset();
	},
};
</script>

<style lang="scss" scoped>
.dashboard-layout {
	position: absolute;
	overflow: hidden;
	min-height: 100%;
	width: 100%;
}

.dashboard-added-item {
	background: none;
	@include flex-align($a: center, $j: center);
	opacity: 0.8;

	img {
		margin: auto;
		height: 38px;
	}
}

.dashboard-sign {
	position: absolute;
	height: 100%;
	width: 100%;
	@include flex-align($a: center, $j: center);
	font-family: Roboto-Bold, sans-serif;
	font-size: 24px;
	opacity: 0.5;
	user-select: none;
}

.division-line {
	margin: auto;
	border: 1px solid #585858;

	&.horizontal {
		width: calc(100% - 20px);
	}

	&.vertical {
		height: calc(100% - 20px);
	}

	.drag-handle {
		top: 0;
	}

	.resize-handle {
		position: absolute;
		height: 8px;
		width: 8px;
		bottom: 5px;
		right: 5px;
		border-right: 2px solid #787878;
		border-bottom: 2px solid #787878;
	}
}

/deep/ .vue-grid-item {
	&:not(.added-item):not(.not-resizable):hover {
		.vue-resizable-handle {
			visibility: visible;
		}
	}

	&.added-item:hover {
		cursor: move;
	}

	&.resizing {
		opacity: 0.3;
	}

	.vue-resizable-handle {
		visibility: hidden;
		background: none;
		width: 15px;
		height: 15px;
		bottom: 0;
		right: 0;
		z-index: 5;

		&:before {
			position: absolute;
			content: '';
			height: 8px;
			width: 8px;
			bottom: 5px;
			right: 5px;
			border-right: 2px solid #787878;
			border-bottom: 2px solid #787878;
		}
	}
}

/deep/ .vue-grid-placeholder {
	background: none;
	transition: none;
	border: 1px dashed #7e51ff;
	opacity: 0.8;
	z-index: 2;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	-o-user-select: none;
	user-select: none;
}
</style>
