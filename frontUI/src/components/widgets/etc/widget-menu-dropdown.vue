<template>
	<el-popover
		:class="['dashboard-toolbox-dropdown', visible && 'is-active']"
		popper-class="widget-menu-popper"
		trigger="manual"
		v-model="visible"
		placement="bottom-end"
		width="90"
		v-click-outside="
			() => {
				this.visible = false;
			}
		"
	>
		<div
			slot="reference"
			:class="['widget-menu-btn', visible && 'is-active']"
			@click="visible = !visible"
		/>
		<div class="widget-menu-list-wrap">
			<div
				v-for="(item, i) in handler"
				:key="i"
				class="widget-menu-list-item"
				@click="
					() => {
						$emit(item.id);
					}
				"
			>
				{{ item.name }}
			</div>
		</div>
	</el-popover>
</template>

<script>
export default {
	name: 'widget-menu',
	props: {
		handler: {
			type: Array,
			default: null,
		},
	},
	data() {
		return {
			visible: false,
		};
	},
	computed: {},
	updated() {},
	watch: {},
	created() {},
	mounted() {},
	methods: {},
	destroyed() {},
};
</script>
<style lang="scss">
.widget-menu-popper {
	padding: 6px 0;
	background-color: #313131;
	box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 3px 14px 2px rgba(0, 0, 0, 0.12),
		0 8px 10px 1px rgba(0, 0, 0, 0.14);
	margin-left: 8px;
	margin-right: -8px;

	&[x-placement^='bottom'] .popper__arrow::after {
		border-bottom-color: #313131;
	}

	&.el-popover {
		min-width: 90px;
	}

	.widget-menu-list-item {
		@include flex-align($a: center);
		padding: 0 12px;
		height: 32px;
		font-size: 12px;
		font-weight: 500;
		cursor: pointer;
		color: rgba(255, 255, 255, 0.6);

		&:hover {
			background-color: #7e51ff;
			color: rgba(255, 255, 255, 0.87);
		}
	}
}
</style>
<style lang="scss" scoped>
.widget-menu-btn {
	height: 16px;
	width: 16px;
	cursor: pointer;
	mask: url('../../../assets/svg/common/configuration.svg');
	mask-size: contain;
	mask-repeat: no-repeat;
	mask-position: center;
	background-color: #666666;

	&:hover {
		background-color: #fff;
	}
}

.xai-context-menu {
	background-color: #1c1c26;
	border-color: #1c1c26;

	.xai-context-menu-item {
		color: #fff;
		background: none;
		&:hover {
			color: #3e81f6;
		}
	}
}
</style>
