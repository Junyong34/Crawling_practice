<template>
	<div style="width: 100%; height: 100%;"></div>
</template>
<script>
import echarts from 'echarts';
import debounce from 'lodash/debounce';
import { addListener, removeListener } from 'resize-detector';

// enumerating ECharts events for now
const EVENTS = [
	'legendselectchanged',
	'legendselected',
	'legendunselected',
	'legendunscroll',
	'datazoom',
	'datarangeselected',
	'timelinechanged',
	'timelineplaychanged',
	'restore',
	'dataviewchanged',
	'magictypechanged',
	'geoselectchanged',
	'geoselected',
	'geounselected',
	'pieselectchanged',
	'pieselected',
	'pieunselected',
	'mapselectchanged',
	'mapselected',
	'mapunselected',
	'axisareaselected',
	'focusnodeadjacency',
	'unfocusnodeadjacency',
	'brush',
	'brushselected',
	'rendered',
	'finished',
	'click',
	'dblclick',
	'mouseover',
	'mouseout',
	'mousemove',
	'mousedown',
	'mouseup',
	'globalout',
	'contextmenu',
];

export default {
	props: {
		options: Object,
		theme: [String, Object],
		initOptions: Object,
		group: String,
		autoResize: Boolean,
		watchShallow: Boolean,
		manualUpdate: Boolean,
		chartType: {
			type: String,
			default: '',
		},
	},
	data() {
		return {
			lastArea: 0,
		};
	},
	watch: {
		group(group) {
			this.chart.group = group;
		},
	},
	methods: {
		// provide a explicit merge option method
		mergeOptions(options, notMerge, lazyUpdate) {
			if (this.manualUpdate) {
				this.manualOptions = options;
			}

			if (!this.chart) {
				this.init();
			} else {
				this.delegateMethod('setOption', options, notMerge, lazyUpdate);

				// NoData 텍스트는 차트의 타이틀로 교체
				// if (options.series && options.series.length === 0 && this.chartType !== "bar") {
				//     if (!this.chart._dom.getElementsByClassName("pcm-chart-nodata").length) {
				//         const nodata = document.createElement("div");
				//
				//         nodata.innerHTML = "<div class='pcm-chart-nodata'>No data available</div>";
				//         this.chart._dom.appendChild(nodata);
				//     }
				// }
			}
		},
		// just delegates ECharts methods to Vue component
		// use explicit params to reduce transpiled size for now
		appendData(params) {
			this.delegateMethod('appendData', params);
		},
		resize(options) {
			// debugger;
			// options = {
			//     width: 700,
			//     height: 600,
			// };
			this.delegateMethod('resize', options);
		},
		dispatchAction(payload) {
			this.delegateMethod('dispatchAction', payload);
		},
		convertToPixel(finder, value) {
			return this.delegateMethod('convertToPixel', finder, value);
		},
		convertFromPixel(finder, value) {
			return this.delegateMethod('convertFromPixel', finder, value);
		},
		containPixel(finder, value) {
			return this.delegateMethod('containPixel', finder, value);
		},
		showLoading(type, options) {
			this.delegateMethod('showLoading', type, options);
		},
		hideLoading() {
			this.delegateMethod('hideLoading');
		},
		getDataURL(options) {
			return this.delegateMethod('getDataURL', options);
		},
		getConnectedDataURL(options) {
			return this.delegateMethod('getConnectedDataURL', options);
		},
		clear() {
			this.delegateMethod('clear');
		},
		dispose() {
			this.delegateMethod('dispose');
		},
		delegateMethod(name, ...args) {
			if (!this.chart) {
				this.init();
			}
			return this.chart[name](...args);
		},
		delegateGet(name, method) {
			if (!this.chart) {
				this.init();
			}
			return this.chart[method]();
		},
		getArea() {
			return this.$el.offsetWidth * this.$el.offsetHeight;
		},
		init() {
			if (this.chart) {
				return;
			}

			const chart = echarts.init(this.$el, this.theme, this.initOptions);

			if (this.group) {
				chart.group = this.group;
				echarts.connect(this.group);
			}

			chart.setOption(this.manualOptions || this.options || {}, true);

			// expose ECharts events as custom events
			EVENTS.forEach(event => {
				chart.on(event, params => {
					this.$emit(event, params);
				});
			});

			if (this.autoResize) {
				this.lastArea = this.getArea();
				this.__resizeHandler = debounce(
					() => {
						const dom = this.$el;

						if (
							dom.offsetLeft + dom.offsetTop + dom.offsetWidth + dom.offsetHeight ===
							0
						) {
							// display == none
							return;
						}
						if (this.lastArea === 0) {
							// emulate initial render for initially hidden charts
							this.mergeOptions({}, true);
							this.resize();
							this.mergeOptions(this.options || this.manualOptions || {}, true);
						} else {
							this.resize();
						}
						this.lastArea = this.getArea();
					},
					100,
					{ leading: true },
				);
				addListener(this.$el, this.__resizeHandler);
			}

			Object.defineProperties(this, {
				// Only recalculated when accessed from JavaScript.
				// Won't update DOM on value change because getters
				// don't depend on reactive values
				width: {
					configurable: true,
					get: () => this.delegateGet('width', 'getWidth'),
				},
				height: {
					configurable: true,
					get: () => this.delegateGet('height', 'getHeight'),
				},
				isDisposed: {
					configurable: true,
					get: () => !!this.delegateGet('isDisposed', 'isDisposed'),
				},
				computedOptions: {
					configurable: true,
					get: () => this.delegateGet('computedOptions', 'getOption'),
				},
			});

			this.chart = chart;
		},
		destroy() {
			if (this.autoResize) {
				removeListener(this.$el, this.__resizeHandler);
			}
			this.dispose();
			this.chart = null;
		},
		refresh() {
			if (this.chart) {
				this.destroy();
				this.init();
			}
		},
		download(series, timestamp, downloadOption) {
			const link = document.createElement('a');
			const printChartOption = {
				grid: {
					left: '10%',
					top: '10%',
				},
				xAxis: {
					data: timestamp,
					axisLabel: {
						textStyle: {
							color: '#000',
							fontSize: 11,
						},
					},
				},
				yAxis: {
					axisLabel: {
						show: true,
						textStyle: {
							color: '#000',
							fontSize: 11,
						},
					},
				},
				series,
			};

			// downloadOption = { // for test
			//     // fileType: "svg",
			//     fileType: "jpeg",
			//     backgroundColor: "#095", // action only canvas type
			// };

			const fileType = downloadOption && downloadOption.fileType; // default png
			const imageOption = {
				type: fileType,
				backgroundColor: (downloadOption && downloadOption.backgroundColor) || null,
			};
			let initOption = null;

			if (fileType === 'svg') {
				initOption = { renderer: 'svg' }; // default renderer "canvas"
			}

			// link.download = `chart.${fileType}`; // If the image data has a Mime type, the file type seems to be meaningless.
			link.download = 'scatter-chart.vue';
			// link.href = temp.getDataURL();
			link.href = this.getImageData(printChartOption, imageOption, initOption);
			link.target = '_blank';
			link.click();
		},
		getImageData(chartOption, imageOption, initOption) {
			const dom = document.createElement('div');
			const chart = this.chart;
			const theme = null; // not used
			let width = 430;
			let height = 160;
			let currentOption = {};

			if (chart) {
				currentOption = chart.getOption();
				width = chart.getWidth();
				height = chart.getHeight();
			}
			if (
				Object.hasOwnProperty.call(imageOption, 'width') &&
				Object.hasOwnProperty.call(imageOption, 'height')
			) {
				width = imageOption.width;
				height = imageOption.height;
			}
			const tempOption = Object.assign(currentOption, chartOption);

			dom.style.width = `${width}px`;
			dom.style.height = `${height}px`;

			const temp = echarts.init(dom, theme, initOption);

			temp.setOption(tempOption);
			let result = temp.getDataURL(imageOption);

			if (initOption) {
				result = `data:image/svg+xml;base64,${btoa(result.slice(result.indexOf('<svg')))}`;
			}
			return result;
		},
	},
	created() {
		if (!this.manualUpdate) {
			this.$watch(
				'options',
				(val, oldVal) => {
					if (!this.chart && val) {
						this.init();
					} else {
						// mutating `options` will lead to merging
						// replacing it with new reference will lead to not merging
						// eg.
						// `this.options = Object.assign({}, this.options, { ... })`
						// will trigger `this.chart.setOption(val, true)
						// `this.options.title.text = 'Trends'`
						// will trigger `this.chart.setOption(val, false)`
						this.chart.setOption(val, val !== oldVal);
					}
				},
				{ deep: !this.watchShallow },
			);
		}

		const watched = ['theme', 'initOptions', 'autoResize', 'manualUpdate', 'watchShallow'];

		watched.forEach(prop => {
			this.$watch(
				prop,
				() => {
					this.refresh();
				},
				{ deep: true },
			);
		});
	},
	mounted() {
		// auto init if `options` is already provided
		if (this.options) {
			this.init();
		}
	},
	activated() {
		if (this.autoResize) {
			this.chart && this.chart.resize();
		}
	},
	beforeDestroy() {
		if (!this.chart) {
			return;
		}
		this.destroy();
	},
	connect(group) {
		if (typeof group !== 'string') {
			group.map(chart => chart.chart);
		}
		echarts.connect(group);
	},
	disconnect(group) {
		echarts.disConnect(group);
	},
	registerMap(mapName, geoJSON, specialAreas) {
		echarts.registerMap(mapName, geoJSON, specialAreas);
	},
	registerTheme(name, theme) {
		echarts.registerTheme(name, theme);
	},
	graphic: echarts.graphic,
};
</script>
<style></style>
