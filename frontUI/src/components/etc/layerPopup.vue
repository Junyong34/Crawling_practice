<template>
	<div
		ref="xaiLayerPopup"
		:style="style"
		:class="{
			active: enabled,
			resizing: resizing,
		}"
		class="xai-layerPopup"
		@mousedown.stop="layerEleDown"
	>
		<div v-if="resizable">
			<div
				v-for="handle in handles"
				:key="handle"
				:style="{ display: enabled ? 'block' : 'none' }"
				:class="'resize-' + handle"
				class="xai-layerPopup-resize"
				@mousedown="handleDown(handle, $event)"
			></div>
		</div>
		<div
			:style="popupguideSize"
			:class="isGuideLine ? 'div-guide-show' : 'div-guide-hide'"
			class="xai-layerPopup-resize-guide"
		></div>
		<div v-if="modal" class="xai-layerPopup-background"></div>
		<div
			:style="popupSize"
			:class="{
				dragging: dragging,
			}"
			class="xai-layerPopup-all-layout"
			ref="popupAllLayout"
		>
			<div class="xai-layerPopup-container">
				<div class="xai-layerPopup-head">
					<div class="xai-layerPopup-container-title">
						<label class="popup-title">
							{{ title }}
						</label>
					</div>
					<div
						v-if="minimizable"
						class="xai-layerPopup-minimize"
						@click="onClickMinimize"
					>
						<i class="el-icon-minus" />
					</div>
					<!--<a href="#" class="xai-layerPopup-maxsize" @click="fillParent">-->
					<!--ㅁ-->
					<!--</a>-->
					<div v-if="closeHandle" class="xai-layerPopup-close" @click="closePopup()">
						Χ
					</div>
				</div>
				<div
					class="xai-layerPopup-content"
					ref="popupContents"
					:style="{
						height: `calc(100% - ${
							popupType === 'alert' || popupType === 'confirm' ? 80 : 32
						}px)`,
					}"
				>
					<component :is="getContentsTarget" v-bind="params"></component>
				</div>
				<!--<div class="xai-layerPopup-confirm"
                     :style="{
                        height:`${popupType === 'alert' || popupType === 'confirm' ? 48 : 0}px`,
                    }"
                >
                    <el-button v-if="popupType === 'confirm'"
                               style="width: 70px; float: right; margin-right: 5px;"
                               align="right"
                               size="mini"
                               type="info"
                               @click="onCancelBtClick"
                    >Cancel</el-button>
                    <el-button v-if="popupType === 'alert' || popupType === 'confirm'"
                               style="width: 70px; float: right; margin-right: 5px;"
                               type="info"
                               size="mini"
                               @click="onOkBtClick"
                    >Ok</el-button>
                </div>-->
			</div>
		</div>
	</div>
</template>

<style scoped>
.xai-layerPopup {
	position: absolute;
	box-sizing: border-box;
	z-index: 800;
}

.xai-layerPopup-resize {
	box-sizing: border-box;
	display: none;
	position: absolute;
	font-size: 1px;
	background: transparent;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

/**
      * 리사이즈 핸들
      tl - 왼쪽 상단
      tm - 중간 상단
      tr - 오른쪽 상단
      ml - 왼쪽 중단
      mr - 오른쪽 중단
      bl - 왼쪽 하단
      bm - 중간 하단
      br - 오른쪽 하단
      */

.resize-tl {
	width: 5px;
	height: 5px;
	top: -6px;
	left: -6px;
	cursor: nw-resize;
	z-index: 11;
}

.resize-tm {
	width: 100%;
	height: 5px;
	top: -6px;
	/*left: 50%;*/
	/*margin-left: -5px;*/
	cursor: n-resize;
	z-index: 11;
}

.resize-tr {
	width: 5px;
	height: 5px;
	top: -6px;
	right: -6px;
	cursor: ne-resize;
	z-index: 11;
}

.resize-ml {
	width: 5px;
	height: 100%;
	/*top: 50%;*/
	/*margin-top: -5px;*/
	left: -6px;
	cursor: w-resize;
	z-index: 11;
}

.resize-mr {
	width: 5px;
	height: 100%;
	/*top: 50%;*/
	/*margin-top: -5px;*/
	right: -6px;
	cursor: e-resize;
	z-index: 11;
}

.resize-bl {
	width: 5px;
	height: 5px;
	bottom: -6px;
	left: -6px;
	cursor: sw-resize;
	z-index: 11;
}

.resize-bm {
	width: 100%;
	height: 5px;
	bottom: -6px;
	/*left: 50%;*/
	/*margin-left: -5px;*/
	cursor: s-resize;
	z-index: 11;
}

.resize-br {
	width: 5px;
	height: 5px;
	bottom: -6px;
	right: -6px;
	cursor: se-resize;
	z-index: 11;
}

/*모달 설정시 백그라운드*/
.xai-layerPopup-background {
	position: fixed;
	left: 0px;
	top: 0px;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 0.4);
}

/*전체 레이아웃*/
.xai-layerPopup-all-layout {
	position: relative;
	background: rgb(50, 53, 58);
	/*border-radius: 5px;*/
	border: 1px solid #1c1c26;
	/*top:-2px;*/
	/*left:-2px;*/
	/*box-shadow: 0px 0px 10px -7px #fff;*/
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.xai-layerPopup-container {
	width: 100%;
	height: 100%;
	box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12),
		0 6px 10px 0 rgba(0, 0, 0, 0.2);
	background-color: #272727;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	overflow: hidden;
}

.xai-layerPopup-head {
	/*background: #DDD;*/
	border-bottom: 1px solid #3c3c3c;
	position: relative;
	height: 30px;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.xai-layerPopup-close {
	/*border-left: 1px solid #BBB;*/
	/*color: #666;*/
	display: block;
	font-size: 11px;
	/*font-weight: 700;*/
	/*background-color: #666666;*/
	line-height: 30px;
	position: absolute;
	right: 0;
	text-align: center;
	text-decoration: none;
	top: 0;
	width: 26px;
	color: #666666;
	/* height: 100%; */
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.xai-layerPopup-close:hover {
	background: #333333;
	color: #fff;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	cursor: pointer;
}

.xai-layerPopup-minimize:hover {
	background: #333333;
	color: #fff;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.xai-layerPopup-minimize {
	/*border-left: 1px solid #BBB;*/
	/*color: #666;*/
	display: block;
	font-size: 18px;
	font-weight: 700;
	line-height: 30px;
	position: absolute;
	right: 26px;
	text-align: center;
	text-decoration: none;
	top: 0px;
	width: 26px;
	/* height: 100%; */
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}
.xai-layerPopup-container-title {
	position: relative;
	height: 100%;
}
.popup-title {
	margin-left: 10px;
	position: relative;
	height: 100%;
	white-space: nowrap;
	text-overflow: ellipsis;
	line-height: 30px;
	font-size: 12px;
	font-weight: normal;
	font-stretch: normal;
	font-style: normal;
	letter-spacing: normal;
	color: rgba(255, 255, 255, 0.87);
	overflow: hidden;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

.xai-layerPopup-content {
	width: 100%;
	/*height: calc(100% - 80px);*/
	padding: 5px 10px;
	/*background: #383b42;*/
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	overflow: auto;
}

/*.xai-layerPopup-confirm{
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 10px;
    }*/

.xai-layerPopup-content .popup-contents-text {
	padding: 10px;
	word-wrap: break-word;
}

.xai-layerPopup-resize-guide {
	border: 1px dashed #3b5a82;
	position: absolute;
	overflow: hidden;
}

.div-guide-show {
	display: block;
	z-index: 10;
}

.div-guide-hide {
	display: none;
}

.dragging {
	opacity: 0.3;
}
</style>

<script>
import utils from './container.utils';

export default {
	name: 'LayerPopup',
	props: {
		/**
		 * 레이어 팝업이 활성화 상태 여부 확인
		 */
		active: {
			type: Boolean,
			default: true,
		},
		/**
		 * 드래이그 가능 여부 확인
		 */
		draggable: {
			type: Boolean,
			default: true,
		},
		/**
		 * loading Id
		 */
		loadingId: {
			type: String,
			default: 'loading',
		},
		/**
		 * title를 적용합니다.
		 */
		title: {
			type: String,
			default: '',
		},
		/**
		 * 사이즈 변경 여부 확인
		 */
		resizable: {
			type: Boolean,
			default: false,
		},
		/**
		 * guide 넓이 설정
		 */
		gw: {
			type: Number,
			default: 200,
			validator(val) {
				return val > 0;
			},
		},
		/**
		 * guide 높이 설정
		 */
		gh: {
			type: Number,
			default: 200,
			validator(val) {
				return val > 0;
			},
		},
		/**
		 * 초기 넓이 설정
		 */
		w: {
			type: Number,
			default: 300,
			validator(val) {
				return val > 0;
			},
		},
		/**
		 * 초기 높이 설정
		 */
		h: {
			type: Number,
			default: 300,
			validator(val) {
				return val > 0;
			},
		},
		/**
		 * 최소 넓이 설정
		 */
		minw: {
			type: Number,
			default: 100,
			validator(val) {
				return val > 0;
			},
		},
		/**
		 * 최소 높이 설정
		 */
		minh: {
			type: Number,
			default: 50,
			validator(val) {
				return val > 0;
			},
		},
		/**
		 * 초기 x축
		 */
		x: {
			type: Number,
			default: 0,
			validator(val) {
				return typeof val === 'number';
			},
		},
		/**
		 * 초기 Y축
		 */
		y: {
			type: Number,
			default: 10,
			validator(val) {
				return typeof val === 'number';
			},
		},
		/**
		 * guide x축
		 */
		gx: {
			type: Number,
			default: 0,
			validator(val) {
				return typeof val === 'number';
			},
		},
		/**
		 * guide Y축
		 */
		gy: {
			type: Number,
			default: 0,
			validator(val) {
				return typeof val === 'number';
			},
		},
		/**
		 * Z index 값
		 */
		z: {
			type: [String, Number],
			default: 'auto',
			validator(val) {
				const valid = typeof val === 'string' ? val === 'auto' : val >= 0;

				return valid;
			},
		},
		/**
             * 리사이즈 핸들
             tl - 왼쪽 상단
             tm - 중간 상단
             tr - 오른쪽 상단
             ml - 왼쪽 중단
             mr - 오른쪽 중단
             bl - 왼쪽 하단
             bm - 중간 하단
             br - 오른쪽 하단
             */
		handles: {
			type: Array,
			default() {
				return ['tl', 'tm', 'tr', 'ml', 'mr', 'bl', 'bm', 'br'];
			},
			validator(val) {
				const s = new Set(['tl', 'tm', 'tr', 'ml', 'mr', 'bl', 'bm', 'br']);

				return new Set(val.filter(h => s.has(h))).size === val.length;
			},
		},
		/**
		 * 드래이그 선택 요소
		 * */
		dragHandle: {
			type: String,
			default: '.xai-layerPopup-container-title',
		},
		/**
		 * 드래이그 초기화 방지
		 * */
		dragCancel: {
			type: String,
			default: null,
		},
		/**
		 * 마우스 드래이그 이동 가능한 축 설정
		 */
		axis: {
			type: String,
			default: 'both',
			validator(val) {
				return ['x', 'y', 'both'].indexOf(val) !== -1;
			},
		},
		/**
		 * 부모 영역 안에서만 이동 가능 여부
		 */
		parent: {
			type: Boolean,
			default: true,
		},
		/**
		 * 동적 팝업 인덱스 값
		 */
		arrayIndex: {
			type: Number,
			default: 0,
		},
		/**
		 * 최대 크기 설정
		 */
		maximize: {
			type: Boolean,
			default: true,
		},
		/**
		 * 모달 여부
		 */
		modal: {
			type: Boolean,
			default: true,
		},
		/**
		 *  팝업 정보
		 */
		popupType: {
			type: String,
			default: 'normal',
		},
		popupOpener: {
			type: Object,
			default: null,
		},
		contentsComp: {
			type: Object,
			default: null,
		},
		contentsText: {
			type: String,
			default: '',
		},
		contentsURI: {
			type: String,
			default: '',
		},
		params: {
			type: Object,
			default: () => {},
		},
		/**
		 * 투명도
		 */
		opacity: {
			type: Number,
			default: 1,
		},
		/**
		 * 최소화 버튼 여부
		 */
		minimizable: {
			type: Boolean,
			default: false,
		},
		/**
		 * 닫기 버튼 활성화 여부
		 * */
		closeHandle: {
			type: Boolean,
			default: true,
		},
	},
	data() {
		return {
			top: this.y,
			left: this.x,
			width: this.w,
			height: this.h,
			resizing: false,
			dragging: false,
			enabled: this.active,
			handle: null,
			zIndex: this.z,
			maximizeTop: 0,
			maximizeLeft: 0,
			maximizeWidth: 0,
			maximizeHeight: 0,
			isMaximize: true,
			isGuideLine: false,
			guideTop: this.gy,
			guideLeft: this.gx,
			guideWidth: this.gw,
			guideHeight: this.gh,
			dynamicIndex: this.arrayIndex, // 동적으로 팝업생성시 발생되는 인덱스 값
			bgOpacity: this.opacity,
			isMinimize: false,
			contentsHeight: 0,
		};
	},
	computed: {
		style() {
			return {
				top: `${this.top}px`,
				left: `${this.left}px`,
				width: `${this.width}px`,
				height: `${this.height}px`,
				zIndex: this.zIndex,
				opacity: this.bgOpacity,
			};
		},
		popupSize() {
			return {
				width: `${this.width}px`,
				height: `${this.height}px`,
			};
		},
		popupguideSize() {
			return {
				top: `${this.guideTop}px`,
				left: `${this.guideLeft}px`,
				width: `${this.guideWidth + 3}px`,
				height: `${this.guideHeight + 3}px`,
			};
		},
		getContentsTarget() {
			let target = null;

			if (this.contentsComp) {
				target = this.contentsComp;
			} else if (this.contentsURI) {
				// TODO
			} else if (this.contentsText) {
				target = this.$Vue.component('popup-contents-text', {
					render: h =>
						h(
							'p',
							{
								// attrs: {
								//     style: "background: red;",
								// },
							},
							[this.contentsText],
						),
				});
			}

			return target;
		},
	},
	watch: {
		z(val) {
			if (val >= 0 || val === 'auto') {
				this.zIndex = val;
			}
		},
	},
	created() {
		// 초기 변수값
		// 부모 div 정보
		this.parentX = 0;
		this.parentW = 9999;
		this.parentY = 0;
		this.parentH = 9999;

		this.mouseX = 0;
		this.mouseY = 0;
		// down 이벤트 move에 사용
		this.lastMouseX = 0;
		this.lastMouseY = 0;

		this.elmX = 0;
		this.elmY = 0;

		this.elmW = 0;
		this.elmH = 0;
	},
	mounted() {
		// layer Dom 초기 좌표 셋팅
		this.elmX = parseInt(this.$el.style.left, 10);
		this.elmY = parseInt(this.$el.style.top, 10);
		// layer Dom 초기 넓이 높이 셋팅
		this.elmW = this.$el.offsetWidth || this.$el.clientWidth;
		this.elmH = this.$el.offsetHeight || this.$el.clientHeight;

		this.init();
	},
	methods: {
		init() {
			// 최소 넓이 높이 체크
			if (this.minw > this.w) {
				this.width = this.minw;
			}
			if (this.minh > this.h) {
				this.height = this.minh;
			}
			// 부모 영역 제한
			if (this.parent) {
				const parentW = parseInt(this.$el.parentNode.clientWidth, 10);
				const parentH = parseInt(this.$el.parentNode.clientHeight, 10);

				//
				// this.parentW = parentW;
				// this.parentH = parentH;
				// // 부모 넓이 보다 자식 더 크면 부모넓이 사용
				// if (this.w > this.parentW) this.width = parentW;
				// if (this.h > this.parentH) this.height = parentH;

				if (this.x + this.w > this.parentW) this.width = parentW - this.x;
				if (this.y + this.h > this.parentH) this.height = parentH - this.y;

				// 초기  가드라인 셋팅
				this.guideWidth = this.width;
				this.guideHeight = this.height;
			}
			// Dom size 정의
			this.elmW = this.width;
			this.elmH = this.height;
			// resizing 이벤트 생성
			this.$emit('resizing', this.left, this.top, this.width, this.height);
		},
		layerEleDown(e) {
			const target = e.target || e.srcElement;

			document.addEventListener('mousemove', this.layerMove, false);
			document.addEventListener('mouseup', this.layerUp, false);
			this.mouseX = e.pageX || e.clientX + this.$el.parentNode.scrollLeft;
			this.mouseY = e.pageY || e.clientY + this.$el.parentNode.scrollTop;

			// 마우스 다운 지점 정보저장
			this.lastMouseX = this.mouseX;
			this.lastMouseY = this.mouseY;
			const matchesParent = utils.matchesSelectorToParentElements;

			if (this.$el.contains(target)) {
				if (
					// dragHandle  체크
					(this.dragHandle && !matchesParent(target, this.dragHandle, this.$el)) ||
					(this.dragCancel && matchesParent(target, this.dragCancel, this.$el))
				) {
					return;
				}
				// this.allLayerPopUpzindex();
				this.zIndex = this.z;
				if (this.draggable) {
					this.dragging = true;
				}
				this.layerMove(event);
			}
		},
		// layerPopup resize
		handleDown(handle, e) {
			this.handle = handle;
			this.handleX = e.pageX;
			this.handleY = e.pageY;
			if (!this.isGuideLine) {
				this.guideLeft = -1;
				this.guideTop = -1;
			}
			// layerPopup 가이드 라인 활성화
			this.isGuideLine = true;

			// if (e.stopPropagation) e.stopPropagation();
			// if (e.preventDefault) e.preventDefault();
			// resize 여부
			this.resizing = true;
		},
		fillParent() {
			// 부모가 존재 하고 , 리사이즈 가능하고 , 최대사이즈 가능할 때
			if (!this.parent || !this.resizable || !this.maximize) return;

			if (this.isMaximize) {
				// 사이즈를 최대화 하기전 정보를 남긴다.
				this.maximizeTop = this.top;
				this.maximizeLeft = this.left;
				this.maximizeWidth = this.width;
				this.maximizeHeight = this.height;

				// 최대화
				if (this.axis === 'x' || this.axis === 'both') {
					this.width = this.parentW;
					this.left = 0;
				}

				if (this.axis === 'y' || this.axis === 'both') {
					this.height = this.parentH;
					this.top = 0;
				}
				this.isMaximize = false;
				this.elmX = 0;
				this.elmY = 0;
				this.zIndex = 999;
			} else {
				// 원래 사이즈로 원복
				if (this.axis === 'x' || this.axis === 'both') {
					this.width = this.maximizeWidth;
					this.left = this.maximizeLeft;
				}

				if (this.axis === 'y' || this.axis === 'both') {
					this.height = this.maximizeHeight;
					this.top = this.maximizeTop;
				}
				this.isMaximize = true;
				// 최소화 하게되면 diffx가 0이라 값이 좌표값이 잘못됨 저장해놓은 좌표 할당
				this.elmX = this.maximizeLeft;
				this.elmY = this.maximizeTop;
				this.zIndex = 10;
			}

			this.$emit('resizing', this.left, this.top, this.width, this.height);
		},
		layerMove(e) {
			// layer popup Drag div 클릭
			// 마우스 좌표 선택
			this.mouseX = e.pageX || e.clientX + this.$el.parentNode.scrollLeft;
			this.mouseY = e.pageY || e.clientY + this.$el.parentNode.scrollTop;
			const diffX = this.mouseX - this.lastMouseX;
			const diffY = this.mouseY - this.lastMouseY;

			// this.mouseOffX = this.mouseOffY;
			// this.mouseOffY = 0;
			this.lastMouseX = this.mouseX;
			this.lastMouseY = this.mouseY;
			//
			// this.parentOffsetLet = this.$parent.$el.offsetLeft;
			// this.parentOffsetTop = this.$parent.$el.offsetTop;
			// // 마우스 무브 사이즈
			// const dX = diffX;
			// const dY = diffY;

			// layer popup resize div 클릭
			let resizeX = null;
			let resizeY = null;
			let resizeTop = null;
			let resizeLeft = null;

			resizeX = this.mouseX - this.handleX;
			resizeY = this.mouseY - this.handleY;
			// layer size 변경 처리
			if (this.resizing) {
				// reight resize
				if (this.handle.indexOf('r') >= 0) {
					// 최소 사이즈
					if (this.elmW + resizeX > this.minw) {
						this.elmW = this.width + resizeX;
					}
				}
				// bottom resize
				if (this.handle.indexOf('b') >= 0) {
					if (this.elmH + resizeY > this.minh) {
						this.elmH = this.height + resizeY;
					}
				}

				// top rezise
				if (this.handle.indexOf('t') >= 0) {
					if (this.elmH - resizeY > this.minh) {
						resizeTop = resizeY;
						this.elmY = this.top + resizeY;
						this.elmH = this.height - resizeY;
					}
					if (this.handle.indexOf('tl') === -1) {
						resizeLeft = -1;
					}
				}

				// left resize
				if (this.handle.indexOf('l') >= 0) {
					if (this.elmW - resizeX > this.minw) {
						resizeLeft = resizeX;
						this.elmX = this.left + resizeX;
						this.elmW = this.width - resizeX;
					}
					if (this.handle.indexOf('tl') === -1) {
						resizeTop = -1;
					}
				}

				this.guideTop = resizeTop;
				this.guideLeft = resizeLeft;
				this.guideWidth = this.elmW;
				this.guideHeight = this.elmH;

				this.$emit('resizing', this.left, this.top, this.width, this.height);
			} else if (this.dragging) {
				// layer drag 처리
				if (this.parent) {
					this.elmX = this.left + diffX;
					this.elmY = this.top + diffY;

					this.dockCantainerSelectX = this.$el.parentNode.offsetLeft;
					this.dockCantainerSelectY = this.$el.parentNode.offsetTop;

					if (this.axis === 'x' || this.axis === 'both') {
						this.left = this.elmX;
					}
					if (this.axis === 'y' || this.axis === 'both') {
						this.top = this.elmY;
					}

					this.$emit('dragging', this.left, this.top);
				}
			}
		},
		layerUp() {
			// 리사이즈  마우스 업이벤트.
			if (this.resizing) {
				// layerPopup 가이드 라인 비활성화
				this.isGuideLine = false;

				// guide resize 변경
				// layerPopup 사이즈/좌표 적용
				// this.left = this.guideLeft;
				// this.top = this.guideTop;
				// top rezise
				if (this.handle.indexOf('t') >= 0) {
					this.top = this.elmY;
					this.height = this.elmH;
				}
				// bottom resize
				if (this.handle.indexOf('b') >= 0) {
					this.height = this.elmH;
				}
				// left resize
				if (this.handle.indexOf('l') >= 0) {
					this.left = this.elmX;
					this.width = this.elmW;
				}
				// reight resize
				if (this.handle.indexOf('r') >= 0) {
					this.width = this.elmW;
				}
				// guid line 값 변경 된 값으로 셋팅
				this.guideLeft = this.left;
				this.guideTop = this.top;

				// 변경된 사이즈로 변경 초기화
				this.elmW = this.width;
				this.elmH = this.height;
				this.guideWidth = this.elmW;
				this.guideHeight = this.elmH;
				this.resizing = false;
				this.$emit('resizestop', this.left, this.top, this.width, this.height);
			}
			// layerpopup 드래이그 무빙 처리
			if (this.dragging) {
				// if (this.vmDock !== null) {
				//   // dock객체 존재 할때만
				//   this.isSelectLayer(false, this.vmDock);
				// }

				// 추후 도킹 추가 될떄마다 data Map 생성
				// if (this.isRootPos !== null && this.addDockPosition !== null) { // 도킹을 선택했다.
				//   if (this.vmMainFrame.$el.children[0].querySelector(".dockcontainer") === null) { // 제일 처음 도킹
				//     this.rootCreateDockFrame("root");
				//   } else if (this.isRootPos) {
				//     // root 도킹 여부 판단
				//     this.addRootDockFrame();
				//   } else {
				//     this.addDockFrame();
				//   }
				// }
				//  선택 된 도킹 영역 class 삭제
				// if (this.currentDroppable !== null) {
				//   this.currentDroppable.classList.remove("select-Dock-border");
				//   this.currentDroppable = null;
				// }
				// 드래이그 무빙 끝나면 도킹상태 flag 다시 변경  root 바로 밑 자식
				// this.isSelectLayer(false, this.vmMainFrame);
				this.dragging = false;
				this.$emit('dragstop', this.left, this.top);
			}
			this.handle = null;
			this.elmX = this.left;
			this.elmY = this.top;
			document.removeEventListener('mousemove', this.layerMove, false);
			document.removeEventListener('mouseup', this.layerUp, false);
		},
		closePopup() {
			this.$loading.hide(this.loadingId);
			this.$emit('close');
		},
		/*
            onOkBtClick(e) {
                if (this.popupOpener && this.popupOpener.onOk) {
                    this.popupOpener.onOk(e);
                }
                this.$store.dispatch("paramsGlobal/main_layer_popup", {show: false});
            },
            onCancelBtClick(e) {
                if (this.popupOpener && this.popupOpener.onCancel) {
                    this.popupOpener.onCancel(e);
                }
                this.$store.dispatch("paramsGlobal/main_layer_popup", {show: false});
            },
            */
		onClickMinimize(e) {
			this.isMinimize = !this.isMinimize;

			const allLayout = this.$refs.popupAllLayout;
			const contents = this.$refs.popupContents;
			const allLayoutHeight = allLayout.offsetHeight;

			if (this.isMinimize) {
				this.contentsHeight = contents.offsetHeight;
				allLayout.style.height = `${allLayoutHeight - this.contentsHeight}px`;
				contents.style.height = `0px`;
			} else {
				allLayout.style.height = `${allLayoutHeight + this.contentsHeight}px`;
				contents.style.height = `${this.contentsHeight}px`;
			}
		},
	},
};
</script>
