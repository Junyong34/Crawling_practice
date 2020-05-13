<template>
	<div class="login-contents">
		<div class="login-title-box">
			<span class="main-title">Welcome to <span class="solution-name">XAIOps</span></span>
			<span class="sub-title">Artificial Intelligence for IT Operations</span>
		</div>
		<form class="login-form">
			<div class="login-id-wrapper">
				<div class="login-id-icon-box">
					<img
						:src="require('@/assets/svg/login/login-user-symbol.svg')"
						style="width: 24px; height: 24px;"
					/>
				</div>
				<div class="login-id-input-box">
					<label class="login-id-label">Id</label>
					<input
						type="text"
						class="login-id-input"
						v-model="userId"
						@keyup="rememberUserId"
					/>
				</div>
			</div>
			<div class="login-password-wrapper">
				<div class="login-pw-icon-box">
					<img
						:src="require('@/assets/svg/login/login-password-symbol.svg')"
						style="width: 24px; height: 24px;"
					/>
				</div>
				<div class="login-pw-input-box">
					<label class="login-pw-label">Password</label>
					<input
						type="password"
						class="login-pw-input"
						v-model="userPw"
						@keyup.enter="handleSubmit"
					/>
				</div>
			</div>
			<div class="login-checkbox-wrapper">
				<input
					type="checkbox"
					id="remember"
					class="login-remember-checkbox"
					v-model="checked"
					@click="rememberUserId"
				/>
				<label class="login-remember-checkbox-label" for="remember">Remember user Id</label>
			</div>
			<button type="button" ref="loginButton" :class="buttonClass" @click="handleSubmit">
				<span class="login-button-txt">Log in</span>
			</button>
		</form>
		<div class="login-error-message-box">
			<span class="login-error-message-txt">{{ errorMessage }}</span>
		</div>
	</div>
</template>

<script>
export default {
	name: 'login-content',
	props: {
		errorMessage: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			userId: '',
			userPw: '',
			checked: false,
		};
	},
	computed: {
		buttonClass() {
			return this.errorMessage === '' ? 'login-button' : 'login-button is-error';
		},
	},
	watch: {},
	created() {},
	mounted() {
		this.initUserId();
	},
	beforeDestroy() {},
	destroyed() {},
	methods: {
		initUserId() {
			const savedId = this.getCookie('cookieKey');

			/** 존재하는 쿠키가 없다면 userId = "intermax"로 임시 고정
			 *  배포 시 this.userId = savedId; 를 제외한 if else 구문 삭제
			 */
			if (savedId === '') {
				this.userId = 'intermax';
			} else {
				this.userId = savedId;
			}

			if (this.userId !== '') {
				this.checked = true;
			}
		},
		getCookie(cookieName) {
			const tmpCookieName = `${cookieName}=`;
			const cookieData = document.cookie;

			let start = cookieData.indexOf(tmpCookieName);
			let cookieValue = '';

			if (start !== -1) {
				start += tmpCookieName.length;
				let end = cookieData.indexOf(';', start);

				if (end === -1) {
					end = cookieData.length;
				}
				cookieValue = cookieData.substring(start, end);
			}

			return unescape(cookieValue);
		},
		handleSubmit(evt) {
			this.$emit('handle-submit', {
				userId: this.userId,
				userPw: this.userPw,
			});
		},
		rememberUserId(evt) {
			if (evt.type === 'click') {
				this.checked = !this.checked;
			}

			if (this.checked === true) {
				this.setCookie('cookieKey', this.userId, 7);
			} else {
				if (evt.type === 'keyup') return;
				this.deleteCookie('cookieKey');
			}
		},
		setCookie(cookieName, value, expireDays) {
			const expireDate = new Date();

			expireDate.setDate(expireDate.getDate() + expireDays);

			const cookieValue =
				escape(value) +
				(expireDays === null ? '' : `; expires=${expireDate.toUTCString()}`);

			document.cookie = `${cookieName}=${cookieValue}`;
		},
		deleteCookie(cookieName) {
			const expireDate = new Date();

			expireDate.setDate(expireDate.getDate() - 1);

			document.cookie = `${cookieName}= ; expires=${expireDate.toUTCString()}`;
		},
	},
};
</script>

<style lang="scss" scoped>
.login-contents {
	width: 400px;
	height: 460px;
	color: #ffffff;
	padding: 0 25px 0 25px;

	.login-title-box {
		height: 85px;
		margin-top: 17px;

		.main-title {
			font: {
				family: Roboto;
				size: 37px;
				weight: 300;
			}

			.solution-name {
				font-weight: bold;
			}
		}

		.sub-title {
			display: inline-block;
			color: rgba(255, 255, 255, 0.87);
			font: {
				size: 18px;
			}
			margin-top: 10px;
		}
	}
	.login-form {
		height: 245px;
		padding-right: 10px;
		margin-top: 76px;

		.login-id-wrapper {
			height: 48px;
			position: relative;

			.login-id-icon-box {
				width: 24px;
				height: 24px;
				position: absolute;
				top: 10px;
				z-index: 1;
			}

			.login-id-input-box {
				width: 100%;
				height: 100%;
				position: relative;
				cursor: text;

				.login-id-label {
					height: 20px;
					position: absolute;
					top: -22px;
					font: {
						family: Roboto;
						weight: 500;
						size: 12px;
					}
					color: #ffffff;
				}

				.login-id-input {
					width: 100%;
					height: 100%;
					font-size: 18px;
					border: none;
					border-bottom: solid 2px #cfcfcf;
					padding: 10px 10px 10px 40px;
					background-color: transparent;
					color: #ffffff;
					transition: border 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

					&:focus {
						outline: 0;
						border-bottom-color: #7e51ff;
					}
				}
			}
		}
		.login-password-wrapper {
			height: 48px;
			position: relative;
			margin-top: 40px;

			.login-pw-icon-box {
				width: 24px;
				height: 24px;
				position: absolute;
				top: 10px;
				z-index: 1;
			}

			.login-pw-input-box {
				width: 100%;
				height: 100%;
				position: relative;
				cursor: text;

				.login-pw-label {
					height: 20px;
					position: absolute;
					top: -22px;
					font: {
						family: Roboto;
						weight: 500;
						size: 12px;
					}
					color: #ffffff;
				}

				.login-pw-input {
					width: 100%;
					height: 100%;
					font-size: 18px;
					border: none;
					border-bottom: solid 2px #cfcfcf;
					padding: 10px 10px 10px 40px;
					background-color: transparent;
					color: #ffffff;
					transition: border 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);

					&:focus {
						outline: 0;
						border-bottom-color: #7e51ff;
					}
				}
			}
		}
		.login-checkbox-wrapper {
			height: 30px;
			position: relative;
			margin-top: 15px;
			/*user-select: none;*/

			.login-remember-checkbox {
				width: 0;
				height: 0;
				position: absolute;
			}
			.login-remember-checkbox-label {
				position: relative;
				font: {
					family: Roboto;
					size: 12px;
				}
				color: rgba(255, 255, 255, 0.4);
				cursor: pointer;
				padding-left: 32px;
			}

			.login-remember-checkbox-label:before {
				position: absolute;
				left: 2px;
				width: 16px;
				height: 16px;
				content: '';
				border: 2px solid rgba(255, 255, 255, 0.87);
				border-radius: 3px;
				transition: background-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1),
					border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
			}

			.login-remember-checkbox-label:after {
				display: block;
				content: '';
			}

			.login-remember-checkbox:checked + .login-remember-checkbox-label:before {
				border-color: #0a84ff;
				background-color: #0a84ff;
			}

			.login-remember-checkbox:checked + .login-remember-checkbox-label:after {
				position: absolute;
				top: 0;
				left: 8px;
				width: 6px;
				height: 10px;
				border: {
					style: solid;
					color: #ffffff;
					width: 0 2px 2px 0;
				}
				transform: rotate(45deg);
			}
		}
		.login-button {
			width: 100%;
			height: 40px;
			border: 1px solid #7e51ff;
			border-radius: 4px;
			cursor: pointer;
			user-select: none;
			background-color: #7e51ff;
			margin-top: 17px;

			&.is-error {
				border-color: #ff574d;
				background-color: #ff574d;
			}

			&:focus {
				outline: 0;
			}

			.login-button-txt {
				font: {
					family: Roboto;
					size: 16px;
					weight: 500;
				}
				color: #ffffff;
			}
		}
	}

	.login-error-message-box {
		height: 20px;
		margin-top: 5px;

		.login-error-message-txt {
			font: {
				family: Roboto;
				size: 13px;
			}
			color: #ff453a;
		}
	}
}
</style>
