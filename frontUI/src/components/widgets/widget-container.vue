<template>
	<div
		:class="containerClass"
		ref="widgetContainer"
		:style="containerStyle"
		v-resize="setMaximizeRect"
	>
		<slot>
			<el-tooltip
				placement="bottom-start"
				:visible-arrow="false"
				:disabled="!Object.keys(errorObj).length"
			>
				<div slot="content">
					<p>
						<span>Status:&emsp;</span><i style="color: red;">{{ errorObj.status }}</i>
					</p>
					<p>
						<span>Code:&emsp;</span
						><i style="color: red;">{{ `[ ${errorObj.code} ] ${errorObj.massage}` }}</i>
					</p>
				</div>
				<div>
					<component
						ref="widgetHeader"
						:is="headerComp"
						:class="headerClass"
						:i="i"
						:title="title"
						:description="description"
						:static="this.static"
						:maximize="maximize"
						:location="widgetOptions.location"
						:widgetHandler="widgetHandler"
						v-bind="component"
						@maximize="maximizeHandle"
						@static="staticHandle"
						@edit="editHandle"
						@remove="removeHandle"
						@close="closeHandle"
						@location="onLocation"
						@refresh="onRefresh"
						@mouseenter.native="headerHover = true"
						@mouseleave.native="headerHover = false"
						:style="headerStyle"
					/>
				</div>
			</el-tooltip>
			<component
				ref="widgetView"
				:key="reRenderKey"
				:is="bodyComp"
				:class="['widget-view', widgetOptions.resizable ? 'resizable' : '']"
				:expand="expand"
				:widget="widget"
				v-bind="component"
				:i="i"
				:pause="pause"
				:view-rect="viewRect"
				:is-popup-open="isPopupOpen"
				@data-wait="contentWaitHandler"
				@error="errorHandle"
				@popup-enable="popupEnableHandle"
				:style="viewStyle"
			>
				<div
					v-if="widgetOptions.expandable || false"
					slot="expand"
					class="widget-expand-wrap"
					@click="onExpand"
				>
					<div class="widget-expand-btn">
						<template v-if="expand">
							<img
								:src="require(`@/assets/svg/widget/expand_off.svg`)"
								alt="expand"
							/>
						</template>
						<template v-else>
							<img :src="require(`@/assets/svg/widget/expand_on.svg`)" alt="expand" />
						</template>
					</div>
					<span>{{ expand ? 'Fewer details' : 'More details' }}</span>
				</div>
			</component>
			<div v-if="showPopupBtn" class="setting-popup-btn-box" :style="popupBtnStyle">
				<img
					:src="require('@/assets/svg/common/service-change-btn.svg')"
					@click="() => togglePopup(true)"
				/>
			</div>
		</slot>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import WidgetSettingPopup from '@/components/widgets/popup/widget-setting-popup';

export default {
	name: 'widget',
	inheritAttrs: false,
	props: {
		i: {
			type: String,
			default: null,
		},
		h: {
			type: Number,
		},
		widget: {
			type: Object,
			default: () => ({}),
		},
		component: {
			type: Object,
			default: () => ({}),
		},
		rowHeight: {
			type: Number,
			default: 20,
		},
		expand: {
			type: Boolean,
			default: false,
		},
		location: null,
		pause: {
			type: Boolean,
			default: false,
		},
		static: {
			type: Boolean,
			default: false,
		},
		headerHeight: {
			type: Number,
			default: 28,
		},
		rect: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			maximize: false,
			previousH: true,
			maximizeRect: {},
			headerComp: null,
			bodyComp: null,
			isSelected: false,
			isSubject: null,
			errorObj: {},
			isDataWait: false,
			isError: false,
			headerHover: false,
			showPopupBtn: false,
			isPopupOpen: false,
			reRenderKey: 0,
			popupBtnStyle: {},
		};
	},
	computed: {
		...mapGetters({
			getActiveView: 'getActiveView',
			// getMainLayerPopup: 'paramsGlobal/getMainLayerPopup',
		}),
		title() {
			return this.widget.title;
		},
		description() {
			return this.widget.description;
		},
		visualization() {
			return this.component.visualization || {};
		},
		widgetOptions() {
			return this.widget.options || {};
		},
		containerClass() {
			const classList = ['widget-container'];

			if (this.isSelected) classList.push('selected');

			if (this.isSubject) classList.push('subject');

			if (this.i === 'addedItem') classList.push('background-none');

			if (!this.showHeader && this.isDataWait) classList.push('data-wait');

			return classList;
		},
		showHeader() {
			return this.title || this.headerHover;
		},
		headerClass() {
			const classList = ['widget-header'];

			if (!this.showHeader) classList.push('is-hidden');

			if (this.isError) {
				classList.push('data-error');
			} else if (this.showHeader && this.isDataWait) {
				classList.push('data-wait');
			}

			return classList;
		},
		headerRect() {
			if (this.maximize) {
				return { h: this.headerHeight, w: this.maximizeRect.w };
			} else {
				return { h: this.headerHeight, w: this.rect.w };
			}
		},
		viewRect() {
			if (this.maximize) {
				return {
					h:
						this.maximizeRect.h -
						(this.headerComp && this.title ? this.headerHeight : 0),
					w: this.maximizeRect.w,
				};
			} else {
				return {
					h: this.rect.h - (this.headerComp && this.title ? this.headerHeight : 0),
					w: this.rect.w,
				};
			}
		},
		containerStyle() {
			if (this.maximize) {
				return {
					position: 'fixed',
					height: `${this.maximizeRect.h}px`,
					width: `${this.maximizeRect.w}px`,
					left: `${this.maximizeRect.x}px`,
					top: `${this.maximizeRect.y}px`,
					backgroundColor: 'rgba(0, 0, 0, 0.9)',
					zIndex: 100,
				};
			} else {
				return {
					height: `${this.rect.h}px`,
					width: `${this.rect.w}px`,
					backgroundColor: this.visualization.background,
				};
			}
		},
		headerStyle() {
			if (!this.headerRect) return;
			return {
				height: `${this.headerRect.h}px`,
				position: this.title ? 'relative' : 'absolute',
			};
		},
		viewStyle() {
			if (!this.viewRect) return;
			return {
				height: `${this.viewRect.h}px`,
			};
		},
		widgetHandler() {
			let list = [{ name: 'Maximize', id: 'maximize' }];

			if (
				this.getActiveView.name === 'documentDashboardLayout' ||
				this.getActiveView.name === 'createDashboardLayout'
			) {
				list = [
					...list,
					...[
						// { name: 'Refresh', id: 'refresh' },
						{ name: 'Static', id: 'static' },
						// { name: 'Edit', id: 'edit' },
						{ name: 'Remove', id: 'remove' },
					],
				];
			}

			return list;
		},
	},
	watch: {
		h: {
			immediate: true,
			handler(data) {
				this.setPreviousHeight(data);
			},
		},
		widget: {
			handler(data) {
				this.setHeaderComp(data.header);
				this.setBodyComp(data.body);
			},
		},
		// getMainLayerPopup: {
		// 	handler(data) {
		// 		if (!(data && data.show)) this.isPopupOpen = false;
		// 	},
		// 	deep: true,
		// },
	},
	created() {
		this.setHeaderComp(this.widget.header);
		this.setBodyComp(this.widget.body);
		this.$EventBus.$on('WIDGET_INIT_TARGET_SETTING', this.initTargetSettingHandle);
		this.$EventBus.$on('SELECT_ELEMENTS', this.selectedHandler);
	},
	mounted() {
		this.setPreviousHeight(this.h);
	},
	beforeDestroy() {
		this.$EventBus.$off('WIDGET_INIT_TARGET_SETTING', this.initTargetSettingHandle);
		this.$EventBus.$off('SELECT_ELEMENTS', this.selectedHandler);
	},
	methods: {
		errorHandle(isError, error) {
			this.isError = isError;

			let errorObj = {};

			if (this.isError && error) {
				const errorData = error.response.data;
				const msgCode = errorData.code || 'None Code';
				const msg = this.$t(`error.${msgCode}`);

				errorObj.status = errorData.status;
				errorObj.code = msgCode;
				errorObj.massage = msg;
			} else {
				errorObj = {};
			}

			this.errorObj = errorObj;
		},
		setHeaderComp(data) {
			if (!data) return;

			this.headerComp = () => import(`@/components/widgets/headers/${data}`);
		},
		setBodyComp(data) {
			if (!data) return;

			this.bodyComp = () => import(`@/components/widgets/views/${data}`);
		},
		setPreviousHeight(height) {
			if (this.previousH !== height) {
				this.previousH = this.h;
			}
		},
		contentWaitHandler(v) {
			this.isDataWait = v;
		},
		maximizeHandle() {
			this.maximize = !this.maximize;

			if (this.maximize) {
				document.addEventListener('keydown', this.onKeyDown);
				this.setMaximizeRect();
			} else {
				document.removeEventListener('keydown', this.onKeyDown);
			}
		},
		staticHandle() {
			this.$emit('update:static', !this.static);
		},
		removeHandle() {
			this.$emit('remove', this.i);
		},
		setMaximizeRect() {
			const mainView = document.body.querySelector('.main-view-area-content');
			const margin = 10;
			const mainViewRect = mainView.getBoundingClientRect();

			this.maximizeRect = {
				h: mainView.offsetHeight - margin * 2,
				w: mainView.offsetWidth - margin * 2,
				x: mainViewRect.left + margin,
				y: mainViewRect.top + margin,
			};
		},
		onKeyDown(e) {
			if (e.key === 'Escape') this.maximize = false;
		},
		onExpand() {
			this.$emit('toggle-expand');
		},
		onLocation() {
			this.$emit('toggle-location');
		},
		editHandle() {
			const rootRect = this.$root.$el.getBoundingClientRect();
			const popupRect = { w: 750, h: 750 };

			const popupData = {
				show: true,
				titleLabel: `Widget Settings`,
				contentsComp: WidgetSettingPopup,
				params: {
					i: this.i,
					widget: this.widget,
					component: this.component,
				},
				x: (rootRect.width - popupRect.w) / 2,
				y: (rootRect.height - popupRect.h) / 2,
				w: popupRect.w,
				h: popupRect.h,
				z: 100,
			};

			this.$store.dispatch('paramsGlobal/main_layer_popup', popupData);
		},
		selectedHandler(e, selection) {
			if (this.isSubject) return;

			if (!selection.length && !(e.ctrlKey || e.shiftKey)) {
				this.isSelected = false;
			}

			const parentEl = this.$parent.$el;

			for (let ix = 0; ix < selection.length; ix++) {
				if (parentEl === selection[ix]) {
					if (e.ctrlKey) {
						this.isSelected = !this.isSelected;
					} else if (e.shiftKey) {
						this.isSelected = true;
					} else {
						this.isSelected = true;
					}
					return;
				} else if (!(e.ctrlKey || e.shiftKey)) {
					this.isSelected = false;
				}
			}
		},
		initTargetSettingHandle(subjectId, selection) {
			if (this.i === subjectId) {
				this.isSubject = true;
			} else if (Array.isArray(selection) && selection.includes(this.i)) {
				this.isSelected = true;
			} else {
				this.isSubject = false;
				this.isSelected = false;
			}
		},
		closeHandle() {
			this.$emit('close', this.i);
		},
		togglePopup(flag) {
			this.isPopupOpen = flag;
		},
		onRefresh() {
			this.reRenderKey += 1;
		},
		popupEnableHandle(position) {
			if (!position) {
				this.popupBtnStyle = {
					top: `${this.headerHeight}px`,
					right: 0,
				};
			} else {
				this.popupBtnStyle = position;
			}

			this.showPopupBtn = true;
		},
	},
};
</script>

<style lang="scss" scoped>
.floating-item .widget-container {
	opacity: 0.85;
}

.drag-handle {
	position: absolute;
	z-index: 5;
	height: 16px;
	margin-top: 2px;
	top: 0;
}

/*.resize-handle {*/
/*    position: absolute;*/
/*    height: 8px;*/
/*    width: 8px;*/
/*    bottom: 5px;*/
/*    right: 5px;*/
/*    border-right: 2px solid #787878;*/
/*    border-bottom: 2px solid #787878;*/
/*}*/

@keyframes spin {
	100% {
		transform: rotate(360deg);
	}
}

.widget-container {
	@include xai-get-style(background-color, background, container);
	height: 100%;
	width: 100%;
	/*transition: all 200ms ease;*/
	/*transition-property: left, top, right;*/
	position: absolute;
	border-radius: 2px;

	&.subject {
		box-shadow: 0 0 1px 2px #1cbe85;
	}

	&.selected {
		box-shadow: 0 0 1px 2px #2172ff;
	}

	&.background-none {
		background: none;
	}

	&.data-wait:after {
		position: absolute;
		top: 10px;
		left: 10px;
		content: '';
		width: 8px;
		height: 8px;
		border-width: 2px;
		border-style: solid;
		border-color: #fffe #fff2 #fff6 #fffa;
		border-radius: 50%;
		animation-name: spin;
		animation-duration: 1.5s;
		animation-iteration-count: infinite;
	}
}

.widget-header {
	top: 0;
	@include flex-align($a: center, $j: space-between);
	width: 100%;
	z-index: 1;
	opacity: 1;
	transition: opacity 0.25s ease;

	&.is-hidden {
		opacity: 0;
	}

	&:hover {
		@include xai-get-style(background-color, background, containerHighlight);
		transition: background-color 0.25s ease;
		z-index: 100;
	}

	& /deep/ .widget-header-title {
		&:after {
			display: none;
		}
	}

	&.data-error {
		/deep/ .widget-header-title:before {
			display: inline-block;
			content: '';
			background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgd2lkdGg9IjI0Ij48cGF0aCBkPSJNMCAwaDI0djI0SDB6IiBmaWxsPSJub25lIi8+PHBhdGggIGZpbGw9InJlZCIgZD0iTTEgMjFoMjJMMTIgMiAxIDIxem0xMi0zaC0ydi0yaDJ2MnptMC00aC0ydi00aDJ2NHoiLz48L3N2Zz4NCg==);
			background-size: contain;
			width: 18px;
			height: 18px;
			margin-right: 5px;
			text-align: center;
		}
	}

	&.data-wait {
		/deep/ .widget-header-title:after {
			content: '';
			width: 8px;
			height: 8px;
			border-width: 2px;
			border-style: solid;
			border-color: #fffe #fff2 #fff6 #fffa;
			border-radius: 50%;
			margin: 0 10px;
			animation-name: spin;
			animation-duration: 1.5s;
			animation-iteration-count: infinite;
			display: inline-block;
		}
	}
}

.widget-view {
	@include flex-align($a: center, $j: center);
	user-select: none;
	width: 100%;
	position: relative;

	.widget-type {
		position: absolute;
		@include flex-align($a: center, $j: center);
		height: calc(100% - 20px);
		width: calc(100% - 20px);
		cursor: pointer;
		z-index: 2;

		.icon-wrap {
			position: relative;
			height: 38px;

			img {
				opacity: 0.85;
				transition: all 0.1s;
			}

			.type-icon {
				z-index: 1;
				height: 100%;
				opacity: 0;
			}

			.setting-icon {
				position: absolute;
				top: -14px;
				right: -18px;
				opacity: 0;
			}
		}

		&:hover .type-icon,
		&:hover .type-icon.label {
			opacity: 1;
			filter: brightness(2.5);
			z-index: 2;
		}

		&:hover .setting-icon {
			opacity: 1;
		}
	}
}

.widget-expand-wrap {
	@include flex-align($a: center);
	margin-top: 5px;
	padding-left: 5px;
	margin-right: auto;
	cursor: pointer;

	.widget-expand-btn {
		@include flex-align($a: center, $j: center);
		@include xai-get-style(background-color, background, containerHeader);
		border-radius: 50%;

		img {
			height: 16px;
			width: 16px;
		}
	}

	span {
		margin-left: 10px;
		font-size: 12px;
	}
}

.widget-info-wrap {
	@include flex-align($d: column);
	max-height: 100%;
	max-width: 100%;
	opacity: 0.5;
	overflow-y: auto;
	font-size: 12px;
	margin: 0 10px;
	padding: 5px 0;

	.info {
		@include flex-align($a: center);
		border-bottom: 1px solid #5e5e5e;
		width: 100%;
	}

	.info-key {
		width: 20%;
		min-width: 80px;
		text-align: center;
		padding: 2.5px 0;
	}

	.info-value {
		@include flex-align($w: wrap);
		max-width: calc(80% - 20px);
		padding: 2.5px 10px 0 10px;

		.info-tag {
			margin: 1px;
		}
	}
}

.setting-popup-btn-box {
	position: absolute;
	z-index: 1;
	top: 0;
	right: 0;

	img {
		height: 25px;
		width: 25px;
		padding: 5px;
		opacity: 0.75;
	}

	img:hover {
		z-index: 200;
		opacity: 1;
		cursor: pointer;
	}
}
</style>
