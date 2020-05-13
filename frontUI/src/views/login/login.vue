<template>
	<div class="login-container" ondragstart="return false">
		<div class="login-contents-wrapper">
			<div class="login-contents-box">
				<div class="wrapper-btn-box">
					<div class="pos-btn">
						<el-button
							type="primary"
							size="small"
							@click="call_api('mask', isMaskCall)"
						>
							mask {{ isMask }}
						</el-button>
					</div>
					<div class="pos-btn">
						<el-button type="primary" size="small" @click="call_api('?')">
							?
						</el-button>
					</div>
					<div class="pos-btn">
						<el-button type="primary" size="small" @click="call_api('?')">
							?
						</el-button>
					</div>
					<div class="pos-btn">
						<el-button type="primary" size="small" @click="call_api('?')">
							?
						</el-button>
					</div>
					<div class="pos-btn">
						<el-button type="primary" size="small" @click="call_api('?')">
							?
						</el-button>
					</div>
				</div>
			</div>
		</div>
		<div class="login-image-wrapper">
			<img :src="require('@/assets/svg/login/login-animation.svg')" />
		</div>
	</div>
</template>
<style lang="scss" scoped>
.login-container {
	height: 100%;
	min-width: 1380px;
	min-height: 870px;
	display: flex;

	.login-contents-wrapper {
		flex: 1 1 27%;
		display: flex;
		background-color: #12151c;

		.login-contents-box {
			margin: auto;
			.wrapper-btn-box {
				width: 400px;
				height: 660px;
				padding: 0 25px 0 25px;
				@include flex-align($d: column, $a: center, $j: center);
				.pos-btn {
					flex: 0 0 30px;
					margin-bottom: 10px;
					width: 100%;
				}
			}
		}
	}
	.login-image-wrapper {
		flex: 1 1 73%;
		display: flex;
		background-image: linear-gradient(
			128deg,
			#744ff1 10%,
			#ac92f9 66%,
			#cdc3ff 100%,
			#a283ff 100%
		);

		img {
			width: 100%;
		}
	}
}
</style>
<script>
// import LoginContents from '@/components/login/login-contents';
// eslint-disable

export default {
	name: 'login',
	components: {},
	data() {
		return {
			errorMessage: '',
			serviceIns: this.$webCaller.serviceIns,
			isCtrl: false,
			isShift: false,
			isMaskCall: true,
			isMask: 'Off',
		};
	},
	computed: {},
	watch: {},
	created() {},
	mounted() {},
	beforeDestroy() {},
	destroyed() {},
	methods: {
		async handleSubmit(inputInfo) {
			// Id, password 유효성 검사
			const check = this.validationCheck(inputInfo);

			if (!check) {
				this.errorMessage = 'Invalid Id or Password';
				return;
			}

			// create new worker
			if (this.$webCaller.worker == null) {
				this.$webCaller.initWorker();
				this.$webCaller.workEventListener();
			}

			const loginRes = await this.loginCall(inputInfo);

			if (!loginRes.success) {
				this.errorMessage = 'Invalid Id or Password';
				return;
			}

			const loginInfo = loginRes.data;

			// login_id: 실제 입력한 Id , user_id: 일종의 unique key
			const systemInfoRes = await this.systemListCall(loginInfo.user_id);
			const menuList = await this.menuListCall(loginInfo.user_id);

			if (!systemInfoRes.success) {
				this.errorMessage = 'Unable to retrieve system information';
				return;
			}

			this.setSystemInfo(systemInfoRes.data);

			// 추후 서버로 메뉴 데이터 api 호출할 경우 다른 api 들과 sync 고려
			this.setMenuList(menuList);
			this.initRepeatTime();
			this.initSocket();
			this.movePage('overview');
		},
		validationCheck({ userId, userPw }) {
			/**
			 *  a-z, A-Z, 0-9, _만 허용
			 *  4 ~ 20자 사이
			 */
			const regUserId = /^[a-zA-Z0-9_]{4,20}$/;

			return userId !== '' && /*userPw !== '' && */ regUserId.test(userId);
		},
		loginCall({ userId, userPw }) {
			const path = this.$api.login().login;
			const params = { id: userId, pw: userPw };

			return this.serviceIns
				.put(path, params, (status, response) => response)
				.then(response => {
					const userId = response.data['login_id'];
					this.setUserId(userId);

					return response;
				})
				.catch(e => e.response);
		},
		call_api(type, isCall) {
			switch (type) {
				case 'mask':
					this.serviceIns
						.get('/naverStore/miima', { type: isCall }, (status, response) => response)
						.then(response => {
							this.isMask = isCall ? 'On' : 'Off';
							this.isMaskCall = !isCall;
						})
						.catch(e => e.response);
					break;
				case '5s':
					break;
				default:
			}
		},
	},
};
</script>
