<template>
	<el-popover
		:class="['dashboard-toolbox-dropdown', visible && 'is-active']"
		popper-class="widget-list-popper"
		ref="widgetListDropdown"
		trigger="manual"
		v-model="visible"
		placement="left-start"
		width="455"
		:visible-arrow="false"
		v-click-outside="
			() => {
				this.visible = false;
			}
		"
	>
		<div
			slot="reference"
			:class="['widget-list-btn', visible && 'is-active']"
			@click="visible = !visible"
		/>
		<div class="widget-list-wrapper">
			<div class="widget-list">
				<div class="widget-list-label">Widget</div>
				<div
					v-for="(item, key) in getWidgetFormatList"
					:id="key"
					:key="key"
					:ref="`${key}Widget`"
					class="widget-list-item"
				>
					{{ transmitWidgetKey(key) }}
				</div>
			</div>
			<div class="widget-info">
				<div class="widget-thumbnail">
					<div class="shape-circle"></div>
					<div class="shape-triangle"></div>
				</div>
			</div>
		</div>
		<!--		<el-dropdown-smenu slot="dropdown" class="dashboard-combobox-list">-->
		<!--			<el-dropdown-item-->
		<!--				class="dashboard-combobox-list-item"-->
		<!--				v-for="(item, i) in getWidgetFormatList"-->
		<!--				:key="i"-->
		<!--				:command="item"-->
		<!--			>-->
		<!--				<div class="widget-type-wrap" :ref="`${item.widgetType}-widget`">-->
		<!--					<img :src="require(`@/assets/svg/widget/${item.widgetType}.svg`)" alt="type" />-->
		<!--					<span>{{ kebabToSpacingUpperCase(item.widgetType) }}</span>-->
		<!--				</div>-->
		<!--			</el-dropdown-item>-->
		<!--		</el-dropdown-smenu>-->
	</el-popover>
</template>

<style lang="scss">
.widget-list-popper {
	border-radius: 0;
	background-color: #272727;
	box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12),
		0 6px 10px 0 rgba(0, 0, 0, 0.2);
	padding: 0;
	&[x-placement^='left'] {
		margin-right: 0;
	}

	.widget-list-wrapper {
		@include flex-align();

		.widget-list {
			box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12),
				0 6px 10px 0 rgba(0, 0, 0, 0.2);
			width: 240px;
			padding-bottom: 6px;

			.widget-list-label {
				font-size: 12px;
				font-weight: 500;
				opacity: 0.45;
				padding: 10px 16px;
			}

			.widget-list-item {
				padding: 8px 16px;
				font-size: 12px;
				font-weight: 500;
				text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
				color: rgba(255, 255, 255, 0.7);
				box-sizing: border-box;
				cursor: pointer;
				user-select: none;

				&:hover {
					border: dashed 2px #906aff;
					background-color: #121212;
					padding: 6px 14px;
				}
			}
		}

		.widget-info {
			min-height: 280px;
			flex: 1;

			.widget-thumbnail {
				margin: 20px;
				height: 100px;
				width: calc(100% - 40px);
				background-color: #000;
				position: relative;

				.shape-circle {
					position: absolute;
					top: 38px;
					left: 50px;
					height: 46px;
					width: 46px;
					border-radius: 50%;
					background-color: #d8d8d8;
				}

				.shape-triangle {
					position: absolute;
					right: 48px;
					bottom: 37px;
					width: 48px;
					height: 96px;
					border-top: solid 48px transparent;
					border-left: solid 24px transparent;
					border-right: solid 24px transparent;
					border-bottom: solid 48px #696969;
				}
			}
		}
	}
}
</style>

<style lang="scss" scoped>
.widget-add-btn {
	font-size: 22px;
	@include xai-get-style(color, button, primary);
}

.dashboard-toolbox-dropdown {
	@include flex-align($a: center, $j: center);
	height: 36px;
	width: 36px;
	transition: all 0.3s;

	&.is-active {
		background-color: #7e51ff;
	}

	.widget-list-btn {
		height: 100%;
		width: 100%;
		cursor: pointer;
		padding: 8px;
		outline-style: none;
		mask: url('../../assets/svg/common/add-circle.svg');
		mask-size: 20px;
		mask-repeat: no-repeat;
		mask-position: center;
		background-color: #b2b2b2;

		&.is-active {
			mask: url('../../assets/svg/common/remove-circle.svg');
			mask-size: 20px;
			mask-repeat: no-repeat;
			mask-position: center;
			background-color: #eae4ff;
		}
	}
}

.dashboard-combobox-list {
	background-color: #1c1c26;
	border-color: #1c1c26;
	user-select: none;

	.dashboard-combobox-list-item {
		@include flex-align($a: center);
		color: #fff;
		padding: 0;
		.widget-type-wrap {
			width: 100%;
			padding: 0 20px;
		}

		img {
			height: 18px;
			margin-right: 10px;
		}

		&:hover {
			background: #7d7d7d;
		}
	}
}
</style>

<script>
import { mapGetters } from 'vuex';
import interact from 'interactjs';

export default {
	name: 'sample',
	inheritAttrs: false,
	components: {},
	props: {},
	watch: {},
	data() {
		return {
			visible: false,
			interactObjList: [],
		};
	},
	computed: {
		...mapGetters({
			getWidgetFormatList: 'widget/getWidgetFormatList',
		}),
	},
	created() {},
	mounted() {
		this.$nextTick(() => {
			this.tryMakeDraggable();
		});
	},
	methods: {
		transmitWidgetKey(key) {
			const splitStr = key.split('_');

			return splitStr.map(str => str.charAt(0).toUpperCase() + str.slice(1)).join(' ');
		},
		tryMakeDraggable() {
			const self = this;
			const keys = Object.keys(this.$refs);

			keys.forEach(key => {
				if (key.includes('Widget')) {
					const interactObj = interact(self.$refs[key][0]);

					interactObj.draggable({});
					interactObj.styleCursor(false);

					interactObj.on('dragstart', self.dragHandle);

					self.interactObjList.push(interactObj);
				}
			});
		},
		dragHandle(e) {
			const key = e.target.id;

			const widgetFormat = this.getWidgetFormatList[key];

			this.$store.dispatch('widget/selected_widget_format', widgetFormat);
			this.visible = false;
		},
	},
	beforeDestroy() {
		this.$store.dispatch('widget/selected_widget_format', null);

		// interact draggable event listeners remove
		this.interactObjList.forEach(interactObj => {
			interactObj.off('dragstart');
			interactObj.unset();
		});

		this.interactObjList = null;
	},
};
</script>
