<template>
	<div class="xai-container">
		<div class="main-menu-area-content">
			<nav-menu
				:show-menu="showMenu"
				@toggle-menu="e => (this.showMenu = e)"
				v-click-outside="() => (this.showMenu = false)"
			/>
		</div>
		<div class="main-view-area-content">
			<div class="main-view-area-content-ch">
				<router-view :key="$route.fullPath"></router-view>
			</div>
		</div>
		<div class="main-timeline-summary-area-content">
			<anomaly-summary></anomaly-summary>
		</div>
		<div class="main-side-bar-area-content">
			<side-bar
				:show-side-bar="showSideBar"
				@toggle-side-bar="e => (this.showSideBar = e)"
				v-click-outside="() => (this.showSideBar = false)"
			/>
		</div>
	</div>
</template>
<style lang="scss" scoped>
.xai-container {
	width: 100%;
	height: 100%;
	position: relative;
	@include flex-align($d: row);

	.main-menu-area-content {
		flex-basis: 48px;
	}

	.main-view-area-content {
		@include xai-get-style(background-color, background, main);
		flex: 1;
		position: relative;
		overflow-y: auto;

		.main-view-area-content-ch {
			position: relative;
			height: 100%;
			min-width: 1380px;
			min-height: 870px;
		}

		$scrollbar-size: 4px;
		$scrollbar-padding: 6px;

		&::-webkit-scrollbar {
			height: (($scrollbar-padding * 2) + $scrollbar-size);
			width: (($scrollbar-padding * 2) + $scrollbar-size);
			background-color: rgba(255, 255, 255, 0);
		}

		&::-webkit-scrollbar-track,
		&::-webkit-scrollbar-thumb {
			border-top: 6px solid rgba(255, 255, 255, 0);
			border-right: 6px solid rgba(255, 255, 255, 0);
			border-bottom: 6px solid rgba(255, 255, 255, 0);
			border-radius: 12px;
			background-clip: padding-box;
		}

		&::-webkit-scrollbar-track {
			background-color: #000;
		}

		&::-webkit-scrollbar-thumb {
			background-color: #9f9f9f;

			&:hover {
				border: $scrollbar-padding solid rgba(255, 255, 255, 0);
			}
		}

		&::-webkit-scrollbar-corner {
			background-color: rgba(255, 255, 255, 0);
		}
	}

	.main-timeline-summary-area-content {
		position: relative;
	}

	.main-side-bar-area-content {
		flex-basis: 40px;
		min-width: 40px;
		position: relative;
		@include xai-get-style(background, background, sideBar);
	}
}
</style>
<script>
import NavMenu from '@/components/mainFrame/nav-menu';
import SideBar from '@/components/mainFrame/side-bar';
import AnomalySummary from '@/components/mainFrame/anomaly-summary2';

export default {
	name: 'ContentFrame',
	components: {
		NavMenu,
		SideBar,
		AnomalySummary,
	},
	computed: {},
	data() {
		return {
			showMenu: false,
			showSideBar: false,
		};
	},
	created() {},
	methods: {},
};
</script>
