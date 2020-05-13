<template>
	<div :class="['profile-container', isShow ? 'is-show' : '']">
		<div class="profile-company">EXEM</div>
		<div class="profile-user"><span>XAIops.</span>{{ getUserId }} <span>접속중</span></div>
		<div class="btn-list">
			<img
				v-if="activeLogout"
				:src="require('@/assets/svg/03.Sidemenu/00.Logout/02.Selected.svg')"
				width="72"
				height="24"
				@mouseleave="activeLogout = false"
				@click="onLogout"
			/>
			<img
				v-else
				:src="require('@/assets/svg/03.Sidemenu/00.Logout/01.Unselected.svg')"
				width="72"
				height="24"
				@mouseenter="activeLogout = true"
			/>
			<!--            <img v-if="activeEdit"-->
			<!--                 :src="require('@/assets/svg/03.Sidemenu/00.Logout/02.Selected.svg')"-->
			<!--                 width="72" height="24"-->
			<!--                 @mouseleave="activeEdit = false" @click="onEdit">-->
			<!--            <img v-else-->
			<!--                 :src="require('@/assets/svg/03.Sidemenu/00.Logout/01.Unselected.svg')"-->
			<!--                 width="72" height="24"-->
			<!--                 @mouseenter="activeEdit = true">-->
		</div>
		<div class="btn-list">
			<div class="empty-box"></div>
		</div>
		<div class="btn-list">
			<img
				v-if="activePDF"
				:src="require('@/assets/svg/00.Logo/02-pdf-hover.svg')"
				width="192"
				height="33"
				@mouseleave="activePDF = false"
				@click="linkMove('PDF')"
			/>
			<img
				v-else
				:src="require('@/assets/svg/00.Logo/01-normal.svg')"
				width="192"
				height="33"
				@mouseenter="activePDF = true"
			/>
		</div>
		<div class="btn-list">
			<img
				v-if="activeManual"
				:src="require('@/assets/svg/00.Logo/02-manual-hover.svg')"
				width="192"
				height="33"
				@mouseleave="activeManual = false"
				@click="linkMove('info')"
			/>
			<img
				v-else
				:src="require('@/assets/svg/00.Logo/01-manual.svg')"
				width="192"
				height="33"
				@mouseenter="activeManual = true"
			/>
		</div>

		<!--        <div class="logout-btn" @click="onLogout">Logout</div>-->
	</div>
</template>

<style lang="scss" scoped>
.profile-container {
	@include flex-align($d: column);
	visibility: hidden;
	position: absolute;
	left: 58%;
	top: 58%;
	width: 0;
	height: 0;
	border-radius: 0 13px 13px 13px;
	box-shadow: 0 10px 11px 0 rgba(0, 0, 0, 0.6);
	background-color: rgba(0, 0, 0, 0.8);
	padding: 12px 20px;
	transition: all 0.2s;
	opacity: 0;
	z-index: 102;

	&.is-show {
		visibility: visible;
		opacity: 1;
		width: 232px;
		height: 224px;
	}

	& > * {
		opacity: 0;
	}

	&.is-show > * {
		opacity: 1;
		transition-delay: 0.2s;
		transition-duration: 0.1s;
	}

	.profile-company {
		font-family: AppleSDGothicNeo, sans-serif;
		font-weight: bold;
		font-size: 15px;
		color: #c0c5ca;
		text-align: left;
	}

	.profile-user {
		font-family: Roboto, sans-serif;
		font-size: 12px;
		color: #c0c5ca;
		margin-bottom: 5px;
		text-align: left;
		word-break: keep-all;
	}

	.btn-list {
		margin-top: 5px;

		img {
			cursor: pointer;
		}
		.empty-box {
			height: 30px;
		}
	}
}
</style>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'profile',
	components: {},
	props: {
		isShow: Boolean,
	},
	watch: {
		getNotification: {
			handler(d) {
				// 로직
			},
		},
	},
	data() {
		return {
			activeLogout: false,
			activeEdit: false,
			activePDF: false,
			activeManual: false,
		};
	},
	computed: {
		...mapGetters({
			getUserId: 'getUserId',
		}),
	},
	created() {},
	mounted() {
		this.$nextTick(() => {});
	},
	methods: {
		onLogout() {
			this.$emit('logout');
		},
		onEdit() {
			this.$router.push({ name: 'userSettings' });
		},
		linkMove(type) {
			let URL = '';

			if (type === 'PDF') {
				URL = 'docs/user_manual.pdf';
			} else {
				URL = 'docs/user_manual.html';
			}
			const win = window.open(URL, '_blank');

			win.focus();
		},
	},
	destroyed() {},
};
</script>
