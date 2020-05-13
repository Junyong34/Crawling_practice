import * as d3 from 'd3';

export default class TransactionTraceTree {
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
			boundBar: '#f0f08b',
			normalLineBar: '#33ee99',
			abnormalLineBar: '#fb7e4f',
			barText: '#ffffff',
			strokeLine: '#adadad',
			abnormal: '#ee5555',
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
		this.setChartSize();
		// this.draw();
		// const svg = this.svg;
		const parentElem = this.parentElement;

		this.svg = d3.select(`#${parentElem.id}`).append('svg');
		// .attr("width", parentElem.clientWidth)
		// .attr("height", parentElem.clientHeight)

		this.transactionTraceTable = this.svg.append('g').attr('id', 'tracelist');

		this.createToolTip();
		// this.svg.attr("width", this.svgWidth).attr("height", this.svgHeight)
		//     .style("width", "100%")
		//     .style("height", "100%");
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

	clearItem() {
		if (this.svg) {
			this.svg.selectAll('.trace-item').remove();
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
		this.clearItem();

		// const screenWidth = window.screen.availWidth;
		// const screenHeight = window.screen.availHeight;
		const rootWidth = this.parentElement.clientWidth;
		const rootHeight = this.parentElement.clientHeight;
		const graphStartPos = 310;
		const graphWidth = rootWidth - graphStartPos;
		const colorTable = this.colorObj;
		const traceItems = this.transactionTraceTable.selectAll('.trace-item').data(this.traceData);
		const newItems = traceItems
			.enter()
			.append('g')
			.attr('class', 'trace-item')
			// .style("fill", "#ff0000")
			.on('mouseover', d => {
				const evt = d3.event;
				const infos = [];

				for (const key in d) {
					infos.push(`${key} : ${d[key]}`);
				}

				this.toolTip
					.style('display', 'block')
					.style('right', `${rootWidth + 15}px`)
					.style(
						'top',
						`${evt.pageY + 10 > rootHeight ? rootHeight + 30 : evt.pageY - 50}px`,
					)
					.text(infos.join('\n'));
			})
			.on('mouseleave', () => {
				this.toolTip.style('display', 'none');
			});

		newItems
			.append('rect')
			.attr('class', 'trace-item-bg')
			.attr('width', rootWidth)
			.attr('height', 16);
		// .style("fill", "#0000");

		newItems
			.append('text')
			.attr('y', 10)
			.attr('fill', d => (d.abnormal ? colorTable.abnormal : colorTable.barText))
			.attr('clip-path', 'polygon(0 0, 0 20px, 300px 20px, 300px 0')
			.text(d => d.method_sig);

		newItems
			.append('rect')
			// .attr("x", 220)
			.attr('x', graphStartPos)
			.attr('y', 6)
			.attr('width', d => `${(d.upper_bound / this.maxValue) * graphWidth}px`)
			.attr('height', 1)
			.style('fill', this.colorObj.boundBar);
		// .style("fill", this.colorObj.meanBar)
		// .style("fill", this.colorObj.normalLineBar)
		// .style("fill", this.colorObj.abnormalLineBar);

		newItems
			.append('rect')
			.attr('x', graphStartPos)
			.attr('y', 0)
			.attr('width', d => {
				const width = (d.elapse_time / this.maxValue) * graphWidth;

				return width < 1 ? '1px' : `${width}px`;
			})
			.attr('height', 12)
			.style('fill', d =>
				d.abnormal ? colorTable.abnormalLineBar : colorTable.normalLineBar,
			);
		// .style("fill", this.colorObj.meanBar)
		// .style("fill", this.colorObj.normalLineBar)
		// .style("fill", this.colorObj.abnormalLineBar);

		// .on("mouseover", this.onMouseOver)
		traceItems.exit().remove();

		traceItems.merge(newItems).attr('transform', (d, i) => `translate(0,${i * 20})`);

		// .attr("stroke", "#555")
		// .attr("stroke-width", 1);
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
			// .style("line-height", "20px")
			.style('white-space', 'pre-line');
	}

	setData(data) {
		// this.dataReset();
		//
		// for (let i = 0, dLen = data.length; i < dLen; i++) {
		//     const traceItem = data[i];
		//
		//     this.methodList.push(traceItem.method_sig); // method_sig
		//     this.elapseTime.push(traceItem.elapse_time); // elapse_time
		//     this.meanValue.push(traceItem.mean); // mean
		//     this.upperBound.push(traceItem.upper_bound); // upper_bound
		//     this.lowerBound.push(traceItem.lower_bound); // lower_bound
		//     this.abnormal.push(traceItem.abnormal); // method_abnormal
		//     this.boundValue.push(traceItem.upper_bound - traceItem.lower_bound);
		// }
		//
		// this.rowCount = data.length;

		this.svg.style('width', '100%').style('height', data.length * 20);

		this.maxValue = data.reduce((ar, cur) => Math.max(cur.elapse_time, cur.upper_bound, ar), 0);
		this.traceData = data;
		this.draw();
	}
}
