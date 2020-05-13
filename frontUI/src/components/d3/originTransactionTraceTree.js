import * as d3 from 'd3';

export default class OriginTree {
	constructor(id, parentElement) {
		this.id = id;
		this.parentElement = parentElement;
		// this.config = conf;

		this.xyLineWidth = 15; // x축 시작점과 y축 text 사이의 거리.
		this.textWidth = 300; // y축에 표시할 텍스트 넓이
		this.xAxisHeight = 20; // x축을 표시할 높이
		this.legendHeight = 16; // 이값은 설정되는 font-size 에 의해서 변경할 필요가 있음.
		this.tidTextHeight = 20; // 상단의 tid 텍스트를 표시할 높이
		this.showElapseValue = false;

		this.isInit = false;
		this.isInitDataSetting = false;
		this.methodList = [];
		this.elapseTime = [];
		this.lowerBound = [];
		this.upperBound = [];
		this.meanValue = [];
		this.abnormal = [];
		this.boundValue = [];
		this.tid = [];
		this.rowCount = 0;
		this.maxValue = 0;

		this.margin = {
			top: 20,
			right: 30,
			bottom: 20,
			left: 20,
		};

		this.lineCount = 7; // 라인을 표시할 수
		this.colorObj = {
			meanBar: '#91c729',
			boundBar: '#d0d04b',
			normalLineBar: '#0000b4',
			abnormalLineBar: '#fb7e4f',
			barText: '#ffffff',
			strokeLine: '#adadad',
		};

		this.legendList = [];
		// common.Util.CTR('Elapse Time (normal)'),
		// common.Util.CTR('Elapse Time (abnormal)'),
		// common.Util.CTR('Tolerance Range'),
		// common.Util.CTR('Tolerance Range Average')],
		// ];

		this.init();
	}

	init() {
		// resize에 대응하기 위해 추가 background container 생성
		// this.parentElement = Ext.create("Exem.Container", {
		//     width: "100%",
		//     height: "100%",
		//     listeners: {
		//         resize: function () {
		//             if (this.isInit) {
		//                 this.clearChart();
		//                 this.setChartSize();
		//                 this.draw();
		//             }
		//         }.bind(this),
		//     },
		//     style: "background : #FFFFFF",
		// });
		//
		// this.target.add(this.parentElement);

		// this.initProperty();
		this.setChartSize();
		// this.draw();
	}

	// initProperty() {
	//
	// }

	setChartSize() {
		// 차트 전체 Size 지정
		// this.svgWidth = this.parentElement.getWidth();
		// this.svgHeight = this.parentElement.getHeight();
		this.svgWidth = this.parentElement.clientWidth;
		this.svgHeight = this.parentElement.clientHeight;

		this.chartWidth =
			this.svgWidth -
			this.margin.left -
			this.xyLineWidth -
			this.margin.right -
			this.textWidth;
		this.chartHeight =
			this.svgHeight -
			this.margin.bottom -
			this.margin.top -
			this.legendHeight -
			this.tidTextHeight -
			this.xAxisHeight;
	}

	destroy() {
		for (const key in this) {
			const target = this[key];

			if (target && target.remove) {
				target.remove();
			}
			this[key] = null;
		}
	}

	clearChart() {
		if (this.svg) {
			this.svg.selectAll('g').remove();
		}
	}

	dataReset() {
		this.methodList = [];
		this.elapseTime = [];
		this.lowerBound = [];
		this.upperBound = [];
		this.meanValue = [];
		this.abnormal = [];
		this.boundValue = [];
		this.tid = [];
	}

	// 생성된 SVG DOM의 attr에 size 정보 처리
	draw() {
		if (!this.isInit) {
			this.svg = d3.select(`#${this.parentElement.id}`).append('svg');
			this.createToolTip();
			this.isInit = true;
		}
		this.svg
			.attr('width', this.svgWidth)
			.attr('height', this.svgHeight)
			.style('width', '100%')
			.style('height', '100%');

		this.dataSetting();
		this.scaleSetting();

		this.createAxisX();
		this.createAxisY();

		this.createLegend();

		this.createStrokeLine();
		this.createElapseBars();
		this.createBoundBars();
		this.createMeanBars();

		this.createTidText();
	}

	createToolTip() {
		this.toolTip = d3.select(`#${this.parentElement.id}`).append('div');

		this.toolTip
			.style('position', 'absolute')
			.style('display', 'none')
			.style('z-index', 20000)
			.style('color', '#000')
			.style('background-color', '#cccccc')
			.style('border', '1px solid #868686')
			.style('border-radius', '3px')
			.style('text-anchor', 'center')
			.style('line-height', '20px');
	}

	setData(data) {
		this.dataReset();

		for (let i = 0, dLen = data.length; i < dLen; i++) {
			const traceItem = data[i];

			this.methodList.push(traceItem.method_sig); // method_sig
			this.elapseTime.push(traceItem.elapse_time); // elapse_time
			this.meanValue.push(traceItem.mean); // mean
			this.upperBound.push(traceItem.upper_bound); // upper_bound
			this.lowerBound.push(traceItem.lower_bound); // lower_bound
			this.abnormal.push(traceItem.abnormal); // method_abnormal
			this.boundValue.push(traceItem.upper_bound - traceItem.lower_bound);
		}

		this.rowCount = data.length;
	}

	dataSetting() {
		let ix;
		let ixLen;
		let elapseMax;
		let upperMax;
		let rangeCount;

		for (ix = 0, ixLen = this.rowCount; ix < ixLen; ix++) {
			if (!elapseMax || elapseMax < this.elapseTime[ix]) {
				elapseMax = this.elapseTime[ix];
			}

			if (!upperMax || upperMax < this.upperBound[ix]) {
				upperMax = this.upperBound[ix];
			}
		}

		this.maxValue = Math.max(elapseMax, upperMax) || 0;

		if (!this.isInitDataSetting) {
			this.isInitDataSetting = true;
			rangeCount = 1;
		} else {
			rangeCount = this.lineCount;
		}

		const rangeValue = Math.round(this.maxValue / this.lineCount);

		this.strokeLine = d3.range(rangeCount).map(() => ({
			x1: 0,
			y1: 0,
			x2: 0,
			y2: this.chartHeight,
		}));

		this.tickVal = this.strokeLine.map((d, i) => {
			if (i === 0) {
				return 0;
			} else {
				return i * rangeValue;
			}
		});
	}

	scaleSetting() {
		this.xscale = d3
			.scaleLinear()
			.domain([0, this.maxValue])
			.range([0, this.chartWidth]);

		this.yscale = d3
			.scaleLinear()
			.domain([0, this.rowCount + 1])
			.range([0, this.chartHeight]);

		this.abnormalScale = d3
			.scaleQuantize()
			.domain([0, this.abnormal.length])
			.range(this.abnormal);

		this.legendScale = d3
			.scaleLinear()
			.domain([0, this.legendList.length])
			.range([0, this.textWidth + this.chartWidth + this.xyLineWidth]);
	}

	createAxisX() {
		const x = this.margin.left + this.xyLineWidth + this.textWidth;
		const y = this.chartHeight + this.margin.top + this.tidTextHeight;

		this.svg
			.append('g')
			.attr('transform', `translate(${x},${y})`)
			.attr('id', 'xAxis')
			.call(
				d3
					.axisBottom(this.xscale)
					.tickSize(1)
					.tickValues(this.tickVal),
			);
	}

	createAxisY() {
		const x = this.margin.left + this.textWidth;
		const y = this.margin.top + this.tidTextHeight;

		this.svg
			.append('g')
			.attr('id', 'yAxis')
			.attr('transform', `translate(${x},${y})`)
			.call(
				d3
					.axisRight(this.yscale)
					.tickSize(1)
					.tickFormat(() => null)
					.tickValues(d3.range(this.rowCount + 1)),
			);

		this.svg
			.append('g')
			.attr('id', 'yAxisArea')
			.attr('transform', `translate(${x},${y})`)
			.selectAll()
			.data(this.methodList)
			.enter()
			.append('foreignObject')
			.attr('id', (d, i) => `yAxisText${i}`)
			.attr('x', `-${this.textWidth}`)
			.attr('y', (d, i) => this.yscale(i + 1) - 7)
			.text(d => d)
			.style('width', `${this.textWidth - 5}px`)
			.style('height', '14px')
			.style('overflow', 'hidden')
			.style('text-overflow', 'ellipsis')
			.style('white-space', 'nowrap')
			.style('text-align', 'right')
			.style('z-index', 100)
			.style('color', (d, i) => {
				if (this.abnormalScale(i) === true) {
					return 'red';
				}
				return null;
			})
			.on('mouseover', d => {
				// const svg = this.svg[0][0].getBoundingClientRect();

				if (d) {
					this.toolTip
						.text(d)
						// .style("top", `${d3.event.pageY - svg.top + 10}px`)
						// .style("left", `${d3.event.pageX - svg.left + 10}px`);
						.style('top', `${d3.event.pageY}px`)
						.style('left', `${d3.event.pageX}px`);
				}
				this.toolTip.style('display', 'block');
			})
			.on('mouseleave', () => {
				this.toolTip.style('display', 'none');
			});
	}

	createLegend() {
		const x = this.margin.left;
		const y = this.margin.top + this.chartHeight + this.tidTextHeight + this.xAxisHeight;

		const legendArea = this.svg
			.append('g')
			.attr('transform', `translate(${x},${y})`)
			.attr('id', 'legend')
			.append('svg');

		const legendSvg = legendArea
			.selectAll('#legend')
			.data(this.legendList)
			.enter()
			.append('g')
			.attr('transform', (d, i) => {
				if (i === 0) {
					return 'translate(0,5)';
				} else {
					return `translate(${this.legendScale(i)}, 5)`;
				}
			});

		legendSvg
			.append('rect')
			.attr('x', 0)
			.attr('y', 0)
			.attr('width', 10)
			.attr('height', 10)
			.style('fill', (d, i) => {
				let displayColor;

				switch (i) {
					case 0:
						displayColor = this.colorObj.normalLineBar;
						break;
					case 1:
						displayColor = this.colorObj.abnormalLineBar;
						break;
					case 2:
						displayColor = this.colorObj.boundBar;
						break;
					case 3:
						displayColor = this.colorObj.meanBar;
						break;
					default:
						break;
				}
				return displayColor;
			});

		legendSvg
			.append('text')
			.attr('x', 20)
			.attr('y', 10)
			.text(d => d)
			.style('text-anchor', 'start')
			.style('font-size', 14);
	}

	createTidText() {
		const x =
			this.margin.left +
			this.textWidth +
			this.xyLineWidth +
			this.xscale(this.maxValue / 2) -
			75;

		const y = this.margin.top + this.tidTextHeight - 6;

		if (this.tid.length) {
			this.svg
				.append('g')
				.attr('transform', `translate(${x},${y})`)
				.selectAll()
				.data(this.tid)
				.enter()
				.append('text')
				.text(d => `tid : ${d}`);
		}
	}

	createStrokeLine() {
		const x = this.margin.left + this.textWidth + this.xyLineWidth;

		const y = this.margin.top + this.tidTextHeight;

		this.svg
			.append('g')
			.attr('transform', `translate(${x},${y})`)
			.attr('id', 'strokeLine')
			.selectAll('line')
			.data(this.strokeLine)
			.enter()
			.append('line')
			.attr('x1', (d, i) => this.xscale(this.tickVal[i]))
			.attr('y1', d => d.y1)
			.attr('x2', (d, i) => this.xscale(this.tickVal[i]))
			.attr('y2', d => d.y2)
			.style('stroke', this.colorObj.strokeLine)
			.style('stroke-width', '1px');
	}

	createElapseBars() {
		const x = this.margin.left + this.textWidth + this.xyLineWidth;

		const y = this.margin.top + this.tidTextHeight;

		this.svg
			.append('g')
			.attr('transform', `translate(${x},${y})`)
			.attr('id', 'elapseBars')
			.selectAll('rect')
			.data(this.elapseTime)
			.enter()
			.append('rect')
			.attr('width', d => this.xscale(d))
			.attr('height', 12)
			.attr('x', 0)
			.attr('y', (d, i) => this.yscale(i + 1) - 6)
			.style('fill', (d, i) => {
				if (this.abnormalScale(i) === true) {
					return this.colorObj.abnormalLineBar;
				} else {
					return this.colorObj.normalLineBar;
				}
			});

		if (this.showElapseValue) {
			this.displayElapseBarValue();
		}
	}

	createBoundBars() {
		const x = this.margin.left + this.textWidth + this.xyLineWidth;

		const y = this.margin.top + this.tidTextHeight;

		this.svg
			.append('g')
			.attr('transform', `translate(${x},${y})`)
			.attr('id', 'boundBars')
			.selectAll('rect')
			.data(this.boundValue)
			.enter()
			.append('rect')
			.attr('height', 8)
			.attr('x', (d, i) => this.xscale(this.lowerBound[i]))
			.attr('y', (d, i) => this.yscale(i + 1) - 4)
			.style('fill', this.colorObj.boundBar)
			.style('opacity', '0.7')
			.attr('width', d => this.xscale(d));
	}

	createMeanBars() {
		const x = this.margin.left + this.textWidth + this.xyLineWidth;

		const y = this.margin.top + this.tidTextHeight;

		this.svg
			.append('g')
			.attr('transform', `translate(${x},${y})`)
			.attr('id', 'meanBars')
			.selectAll('rect')
			.data(this.meanValue)
			.enter()
			.append('rect')
			.attr('height', 16)
			.attr('x', (d, i) => this.xscale(this.meanValue[i]) - 4)
			.attr('y', (d, i) => this.yscale(i + 1) - 8)
			.style('fill', this.colorObj.meanBar)
			.style('opacity', '0.8')
			.attr('width', () => 8);
	}

	displayElapseBarValue() {
		d3.select('#elapseBars')
			.selectAll('text')
			.data(this.elapseTime)
			.enter()
			.append('text')
			.attr('x', d => this.xscale(d) / 2 - 4)
			.attr('y', (d, i) => this.yscale(i + 1) + 5)
			.text(d => d)
			.style('fill', this.colorObj.barText)
			.style('font-size', '12px');
	}
}
