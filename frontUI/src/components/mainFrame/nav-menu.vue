<template>
	<div class="menu-container">
		<div class="main-menu-container">
			<div class="user-profile-wrapper">
				<div class="user-symbol-box" v-click-outside="onClickOutSide">
					<div
						:class="['user-symbol', showProfile ? 'is-active' : '']"
						@click="onClickProfile"
					>
						<div v-if="profileImg" style="height: 34px;">
							<img
								:src="profileImg"
								style="width: 34px; height: 34px; border-radius: 50%"
							/>
						</div>
						<div v-else>
							<i class="el-icon-user-solid"></i>
						</div>
					</div>
					<profile ref="profile" @logout="logoutHandler" :is-show="showProfile"></profile>
				</div>
			</div>
			<div class="main-menu-wrapper">
				<template v-for="(mainMenu, index) in getMenuList">
					<div
						:key="index"
						:class="[
							'main-menu-item',
							showMenu && openedMenu === mainMenu.name ? 'opened-menu' : '',
						]"
						@click="e => showMenuList(e, mainMenu)"
					>
						<div
							:class="[
								'main-menu-icon-box',
								activeMenu === mainMenu.name ? 'selected' : '',
							]"
						>
							<img
								:src="require(`@/assets/svg/menu/${mainMenu.icon}/Unselected.svg`)"
								:class="['main-menu-icon', showIcon('unselected', mainMenu.name)]"
								:alt="mainMenu.name"
							/>
							<img
								:src="require(`@/assets/svg/menu/${mainMenu.icon}/Selected.svg`)"
								:class="['main-menu-icon', showIcon('selected', mainMenu.name)]"
								:alt="mainMenu.name"
							/>
						</div>
					</div>
				</template>
			</div>
		</div>
		<div :class="['sub-menu-container', showMenu ? 'show-menu' : '']">
			<div class="menu-empty-space"></div>
			<div class="sub-menu-wrapper">
				<div class="main-menu-title">{{ openedMenu }}</div>
				<ul class="sub-menu-item-wrapper">
					<li
						v-for="(subMenu, index) in displayMenuList"
						:key="index"
						:class="[
							'sub-menu-item',
							activeSubMenu === subMenu.to &&
							getActiveView.params.label === subMenu.name
								? 'active-menu'
								: '',
						]"
						@click="movePage({ openedMenu, subMenu })"
					>
						{{ subMenu.name }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>
.menu-container {
	position: relative;
	height: 100%;
	@include flex-align($d: column);
	user-select: none;

	.main-menu-container {
		height: 100%;
		z-index: 100;
		@include xai-get-style(background-color, background, navMenu);

		.user-profile-wrapper {
			@include flex-align($j: center);
			height: 15vh;
			min-height: 100px;

			.user-symbol-box {
				@include flex-align($a: center, $j: center);
				position: relative;
				width: 100%;
				height: 68px;

				.user-symbol {
					@include flex-align($a: center, $j: center);
					width: 34px;
					height: 34px;
					box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.2);
					border-radius: 50%;
					background-color: #fff;
					cursor: pointer;
					transition: all 0.1s;
					box-sizing: initial;
					font-size: 24px;
					color: #9fbecd;

					&.is-active,
					&:hover {
						width: 38px;
						height: 38px;
						border: solid 4px #1f2124;
					}
				}
			}
		}

		.main-menu-wrapper {
			@include flex-align($d: column);
			position: relative;
			height: calc(100% - 15vh);

			.main-menu-item {
				flex: none;
				@include flex-align($a: center, $j: center);
				width: 100%;
				height: 6.4vh;
				min-height: 60px;
				padding: 14px 0;
				cursor: pointer;
				transition: background-color 0.2s;

				&.opened-menu {
					background-color: #7e51ff;
				}

				.main-menu-icon-box {
					flex: 1;
					position: relative;
					@include flex-align($a: center, $j: center);
					height: 100%;
					width: 100%;

					&.selected {
						box-shadow: inset 1.5px 0 0 #7e51ff;
					}

					.main-menu-icon {
						position: absolute;
						height: 2.3vh;
						min-height: 22px;
						opacity: 0;
						transition: opacity 0.4s;

						&.show-icon {
							opacity: 1;
							z-index: 1;
						}
					}
				}
			}
		}
	}

	.sub-menu-container {
		position: absolute;
		top: 0;
		right: 0;
		width: 235px;
		height: 100%;
		transition: all 0.5s;
		background-color: #18191ae6;
		z-index: 50;

		&.show-menu {
			right: -235px;
		}

		.menu-empty-space {
			height: 15vh;
			min-height: 100px;
		}

		.sub-menu-wrapper {
			height: calc(100% - 160px);

			.main-menu-title {
				height: 6.4vh;
				min-height: 60px;
				margin-left: 26px;
				@include flex-align($a: center);
				font : {
					family: Roboto-Regular, sans-serif;
					size: 18px;
				}
				color: #ffffff;
				letter-spacing: 0;
				text-align: left;
				opacity: 1;
			}

			.sub-menu-item-wrapper {
				list-style: none;
				height: calc(100% - 80px);
				overflow: auto;
				padding-right: 10px;

				.sub-menu-item {
					font-family: Roboto-Regular, sans-serif;
					cursor: pointer;
					padding: 10px 0 10px 46px;

					&.active-menu {
						color: #b29bff;
					}

					&:hover {
						background-color: #141516;
						opacity: 1;
					}
				}
			}
		}
	}
}
</style>
<script>
import { mapGetters } from 'vuex';
import { getItem } from '@/common/LocalStorageMemager';
import Profile from '@/components/etc/profile';

export default {
	name: 'nav-menu',
	components: {
		Profile,
	},
	props: {
		showMenu: Boolean,
	},
	computed: {
		...mapGetters({
			getMenuList: 'getMenuList',
			getActiveView: 'getActiveView',
			// getUserId: "params/getUserId",
		}),
	},
	watch: {
		getActiveView: {
			handler(newVal, oldVal) {
				this.changeActiveMenu(newVal);
			},
		},
		showMenu: {
			handler(newVal, oldVal) {
				if (!newVal) this.openedMenu = null;
			},
		},
	},
	data() {
		return {
			showProfile: false,
			openedMenu: null,
			activeMenu: null,
			activeSubMenu: null,
			displayMenuList: [],
			profileImg: null,
		};
	},
	created() {},
	mounted() {
		this.$nextTick(() => {
			this.$store.dispatch('menu_list', getItem('menuList'));
			this.changeActiveMenu();
		});
	},
	beforeDestroy() {},
	destroyed() {},
	methods: {
		showIcon(type, mainMenuName) {
			const className = 'show-icon';

			if (this.activeMenu === mainMenuName) {
				if (this.showMenu && this.openedMenu === mainMenuName) {
					return type === 'unselected' ? className : null;
				} else {
					return type === 'selected' ? className : null;
				}
			} else {
				return type === 'unselected' ? className : null;
			}
		},
		showMenuList(e, mainMenu) {
			e.preventDefault();
			this.$emit('toggle-menu', this.openedMenu !== mainMenu.name);
			this.openedMenu = this.openedMenu === mainMenu.name ? null : mainMenu.name;

			// 특정 메뉴를 hidden 처리하기 위함.
			this.displayMenuList = mainMenu.children.filter(m => m);
		},
		changeActiveMenu(data) {
			let activeView;

			// router 에서 dispatch 한걸 watch 가 감지를 못함..
			if (!data) {
				activeView = Object.assign({}, this.getActiveView);
			} else {
				activeView = Object.assign({}, data);
			}

			// 로그인 이후 첫 진입 화면
			if (Object.keys(activeView.params).length === 0) {
				activeView.params = {
					mainLabel: 'RealTime',
					label: 'AIMonitoring',
					viewId: 'AIMonitoring',
				};

				this.activeMenu = 'RealTime';
				this.activeSubMenu = 'aiMonitoring';

				this.$store.dispatch('activeView', activeView);

				// 메뉴가 데이터가 존재할 경우
			} else if (this.getMenuList && this.getMenuList.length) {
				// 현재 보고 있는 화면이 아닐 경우
				if (this.activeSubMenu !== activeView.name) {
					const mainMenuList = this.getMenuList;

					for (let ix = 0, ixLen = mainMenuList.length; ix < ixLen; ix++) {
						const mainMenu = mainMenuList[ix];
						let exitFlag = false;

						if (mainMenu.children) {
							const subMenuList = mainMenu.children;

							for (let iy = 0, iyLen = subMenuList.length; iy < iyLen; iy++) {
								const subMenu = subMenuList[iy];

								if (subMenu.to === activeView.name) {
									this.activeMenu = mainMenu.name;
									this.activeSubMenu = subMenu.to;
									activeView.params.mainLabel = mainMenu.name;
									activeView.params.label = subMenu.name;
									this.$store.dispatch('activeView', activeView);
									exitFlag = true;
									break;
								}
							}
						}

						if (exitFlag) break;
					}
				}
			}
		},
		movePage({ openedMenu, subMenu }) {
			this.activeMenu = openedMenu;
			this.activeSubMenu = subMenu.to;

			this.$router
				.push({
					name: subMenu.to,
					params: {
						mainLabel: openedMenu,
						label: subMenu.name,
						viewId: subMenu.name,
					},
				})
				.catch(err => {}); // 중복 네비게이션 허용 error 메시지 안보이게 처리

			this.$emit('toggle-menu', false);
		},
		onClickOutSide() {
			this.showProfile = false;
		},
		onClickProfile() {
			this.showProfile = !this.showProfile;
		},
		logoutHandler() {
			// 소켓 연결 해제
			this.$webCaller.socketClose();
			this.$webCaller.workerClose();

			// 로그아웃 토큰 전부 제거
			this.$router.push({ name: 'login' });
		},
	},
};
</script>
