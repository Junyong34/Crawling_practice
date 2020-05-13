<template>
	<div class="header-container">
		<div class="header-logo-wrapper">
			<img class="logo" :src="require('@/assets/svg/logo/XAIOps_symbol.svg')" width="25" />
			<img
				class="logoName"
				:src="require('@/assets/svg/logo/XAIOps_text_white.svg')"
				width="70"
			/>
		</div>
		<div class="header-title-wrapper">
			<span style="padding-right: 5px; padding-bottom: 5px">│</span>
			<span style="font-weight: bold;padding-right:5px">{{ mainTitle }}</span>
			<span>{{ subTitle }}</span>
		</div>
		<div class="system-select-wrapper">
			<system-selection-box></system-selection-box>
		</div>
	</div>
</template>
<style lang="scss" scoped>
.header-container {
	@include flex-align($d: row);
	width: 100%;
	height: 100%;
	background-color: #000000;

	.header-logo-wrapper {
		flex: 0 0 auto;
		flex-basis: 110px;
		@include flex-align($a: center, $j: center);
		.logo {
			margin-left: 10px;
			margin-bottom: 2px;
		}
		.logoName {
			margin-left: 13px;
		}
	}

	.header-title-wrapper {
		flex: 1;
		@include flex-align($a: center, $j: left);

		span {
			color: #fff;
			font-size: 16px;
		}
	}

	.system-select-wrapper {
		flex: 0 0 160px;
		padding: 10px;
		display: flex;
		align-items: center;
		user-select: none;
	}
}
</style>
<script>
import { mapGetters } from 'vuex';
import SystemSelectionBox from '@/components/mainFrame/system-selection-box';

export default {
	name: 'headerFrame',
	components: { SystemSelectionBox },
	props: {},
	data() {
		return {
			mainTitle: '',
			subTitle: '',
		};
	},
	computed: {
		...mapGetters({
			getActiveView: 'getActiveView',
		}),
	},
	watch: {
		getActiveView: {
			handler(newVal, oldVal) {
				this.setTitle(newVal);
			},
		},
	},
	created() {},
	mounted() {
		this.$nextTick(() => {
			this.setTitle(this.getActiveView);
		});
	},
	beforeDestroy() {},
	destroyed() {},
	methods: {
		setTitle(viewData) {
			this.mainTitle = viewData.params.mainLabel;
			this.subTitle = viewData.params.label;
		},
	},
};
</script>
