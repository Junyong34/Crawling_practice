(this["webpackJsonp"] = this["webpackJsonp"] || []).push([[1],{

/***/ "./src/components/common/chart/chartUtil.js":
/*!**************************************************!*\
  !*** ./src/components/common/chart/chartUtil.js ***!
  \**************************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.concat */ "./node_modules/core-js/modules/es.array.concat.js");
/* harmony import */ var core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_find_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.find-index */ "./node_modules/core-js/modules/es.array.find-index.js");
/* harmony import */ var core_js_modules_es_array_find_index__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_find_index__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.array.for-each */ "./node_modules/core-js/modules/es.array.for-each.js");
/* harmony import */ var core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_for_each__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_array_index_of__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.array.index-of */ "./node_modules/core-js/modules/es.array.index-of.js");
/* harmony import */ var core_js_modules_es_array_index_of__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_index_of__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_array_map__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.array.map */ "./node_modules/core-js/modules/es.array.map.js");
/* harmony import */ var core_js_modules_es_array_map__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_map__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es_array_reduce__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es.array.reduce */ "./node_modules/core-js/modules/es.array.reduce.js");
/* harmony import */ var core_js_modules_es_array_reduce__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_reduce__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es_number_to_fixed__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es.number.to-fixed */ "./node_modules/core-js/modules/es.number.to-fixed.js");
/* harmony import */ var core_js_modules_es_number_to_fixed__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_number_to_fixed__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es_object_entries__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es.object.entries */ "./node_modules/core-js/modules/es.object.entries.js");
/* harmony import */ var core_js_modules_es_object_entries__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_entries__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es.regexp.exec */ "./node_modules/core-js/modules/es.regexp.exec.js");
/* harmony import */ var core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_regexp_exec__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/web.dom-collections.for-each */ "./node_modules/core-js/modules/web.dom-collections.for-each.js");
/* harmony import */ var core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_for_each__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var C_webCrawling_crawling_front_frontUI_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/toConsumableArray */ "./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js");
/* harmony import */ var C_webCrawling_crawling_front_frontUI_node_modules_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/typeof */ "./node_modules/@babel/runtime/helpers/esm/typeof.js");












// const defaultColor = ["#00c5cd", "#009bc7", "#cacaff", "#ffc125", "#df6264", "#2b99f0", "#8ac449", "#009697", "#959c2c", "#004ae7", "#01cc00", "#15679a", "#43bcd7", "#e76627", "#5C8558", "#A8A5A3", "#498700", "#832C2D", "#C98C5A", "#3478BE", "#BCF061", "#B26600", "#27358F", "#A4534D", "#B89630", "#A865B4", "#254763", "#536859", "#3ca0ff", "#90db3b", "#00c4c5", "#ffde00", "#ff7781", "#8470ff", "#75cd8e", "#48d1cc", "#fec64f", "#fe984f", "#0052ff", "#00a48c", "#83cfde", "#dfe32d", "#ff7d40", "#99c7ff", "#a5fee3", "#0379c9", "#eef093", "#ffa891", "#E9F378", "#888A79", "#D67D4B", "#2BEC69", "#4A2BEC", "#2BBEEC", "#DDACDF"];
var defaultColor = ['#198fff', '#15efb4', '#e97fd7', '#ffb960', '#8c4ee6', '#e2e2e2', '#fbff60', '#ef4a79', '#58b632', '#5f52dc', '#105393', '#0f6b52', '#842073', '#845212', '#541f9f', '#7d7d7d', '#aeb143', '#642033', '#5d844e', '#637cb2'];
var stackChartColor = ['#cdcdcd', '#28ad90', '#d32f76', '#446b0d', '#ffac4f', '#97d5e2', '#ec542e', '#1d4c8b', '#f6d257', '#479de2'];
var barChartColor = ['#f70000', '#fbdd00', '#76ff9d', '#928aff', '#10d6d6'];
var extraColor = ['#4caf50', '#f44336', '#ff9800', '#2196f3'];
var markLineColor = ['#ff7a17', '#ff1357'];
var alarmColor = {
  warning: '#f8a30d',
  critical: '#ff1f3f'
};
var itemDataset = {
  normal: {// color: function(params) {
    //     // build a color map as your need.
    //     var colorList = [
    //         "#00c5cd", "#009bc7", "#cacaff", "#ffc125", "#df6264",
    //         "#2b99f0", "#8ac449", "#009697", "#959c2c", "#004ae7", "#01cc00", "#15679a",
    //         "#43bcd7", "#e76627", "#5C8558", "#A8A5A3", "#498700", "#832C2D", "#C98C5A", "#3478BE",
    //         "#BCF061", "#B26600", "#27358F", "#A4534D", "#B89630", "#A865B4", "#254763", "#536859",
    //         "#3ca0ff", "#90db3b", "#00c4c5", "#ffde00", "#ff7781",
    //         "#8470ff", "#75cd8e", "#48d1cc", "#fec64f", "#fe984f",
    //         "#0052ff", "#00a48c", "#83cfde", "#dfe32d", "#ff7d40",
    //         "#99c7ff", "#a5fee3", "#0379c9", "#eef093", "#ffa891",
    //         "#E9F378", "#888A79", "#D67D4B", "#2BEC69", "#4A2BEC", "#2BBEEC", "#DDACDF"];
    //     return colorList[params.dataIndex]
    // },
  },
  emphasis: {
    barBorderWidth: 1,
    shadowBlur: 10,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowColor: 'rgba(0,0,0,0.5)'
  }
};

var quantity = function quantity(input) {
  var output;

  if (typeof input === 'string' || typeof input === 'number') {
    var match = /^(normal|(\d+(?:\.\d+)?)(px|%)?)$/.exec(input);
    output = match ? {
      value: +match[2],
      unit: match[3] || undefined
    } : undefined;
  } else {
    output = undefined;
  }

  return output;
};

var hexToRgb = function hexToRgb(hex) {
  if (!hex) {
    return false;
  }

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);
  return "".concat(r, ",").concat(g, ",").concat(b);
};

var optionMixin = function optionMixin(opt1, opt2) {
  return Object.assign(opt1, opt2);
};

var toDecimal = function toDecimal(n, d) {
  if (typeof n === 'number') {
    var pow = Math.pow(10, d); // console.log(Math.round(n * pow), pow, Math.round(n * pow) / pow);

    return Math.round(n * pow) / pow;
  }

  return n;
};

var networkUnit = function networkUnit(n) {
  var cal = n / Math.pow(1024, 2);
  return toDecimal(cal, 2);
};

var memoryUnit = function memoryUnit(n) {
  var cal = n / Math.pow(1024, 3);
  return toDecimal(cal, 2);
};

var fromBytes = function fromBytes(bytes, unit) {
  var decimals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 2;
  var k = 1024;
  var dm = decimals < 0 ? 0 : decimals;
  var sizes = ['byte', 'Kib', 'Mib', 'Gib'];
  var i = sizes.findIndex(function (v) {
    return v.toLowerCase() === unit.toLowerCase();
  });

  if (i === -1) {
    return bytes;
  }

  return (parseFloat(bytes) / Math.pow(k, i)).toFixed(dm);
};

var fromSec = function fromSec(sec) {
  var k = 1000;
  var _sec = sec;
  var i = 0;
  var sizes = ['sec', 'ms', 'μs', 'ns', 'ps'];

  while (_sec < 0.1) {
    _sec *= k;
    i++;
  }

  return {
    unit: sizes[i],
    mul: Math.pow(k, i)
  };
};

var getChartMaxData = function getChartMaxData(dataSet) {
  // 배열로 입력된 값 중 가장 큰 값의 단위를 찾는다.
  if (dataSet.length === 0) {
    return 0;
  }

  var numberSet = dataSet.map(function (v) {
    return v * 1;
  });
  var maxValue = numberSet.reduce(function (prev, curr) {
    return prev > curr ? prev : curr;
  });
  return maxValue;
};

var autoBytesUnit = function autoBytesUnit(arr) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  /**
   * 배열로 된 숫자 값이 오면 가장 큰 용량의 단위로 변환해서 표기해준다.
   * 변환하는 값은 0.1 보다 커야한다.
   */
  var k = 1024;
  var sizes = ['byte', 'KiB', 'MiB', 'GiB'];
  var index = 0;
  var maxResult;

  if (Object(C_webCrawling_crawling_front_frontUI_node_modules_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_11__[/* default */ "a"])(arr) === 'object') {
    maxResult = getChartMaxData(arr);
  }

  for (var jx = 0; jx < sizes.length; jx++) {
    if (maxResult / k > 0.2) {
      maxResult /= k;
      index++;
    } else {
      break;
    }
  } // 소숫점인지 유무를 체크해서 소숫점은 2자리까지 표기해준다.


  var result = arr.map(function (v) {
    var value = v / Math.pow(k, index);

    if (value % 1 !== 0) {
      return value.toFixed(2);
    }

    return value;
  });
  var bytes = {
    data: result,
    units: sizes[index]
  };
  return !type ? bytes : bytes[type];
};

var autoSecondsUnit = function autoSecondsUnit(arr) {
  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  /**
   * 배열로 된 숫자 값이 오면 가장 작은 처리속도 단위로 변환해서 표기해준다.
   * 변환하는 값은 0.1 보다 작아야한다.
   */
  var k = 1000;
  var unit = ['sec', 'ms', 'µs', 'ns'];
  var index = 0;
  var maxResult;

  if (Object(C_webCrawling_crawling_front_frontUI_node_modules_babel_runtime_helpers_esm_typeof__WEBPACK_IMPORTED_MODULE_11__[/* default */ "a"])(arr) === 'object') {
    maxResult = getChartMaxData(arr);
  }

  for (var jx = 0; jx < unit.length; jx++) {
    if (maxResult !== 0 && maxResult * k < 0.1) {
      maxResult *= k;
      index++;
    }
  }

  var result = arr.map(function (v) {
    return (v * Math.pow(k, index)).toFixed(2);
  });
  var seconds = {
    data: result,
    units: unit[index]
  };
  return !type ? seconds : seconds[type];
};

var getData = function getData(data, locations) {
  // console.log(data, locations);
  var returnData = [];

  if (Array.isArray(locations)) {
    returnData = data;
    locations.forEach(function (location) {
      if (returnData) {
        if (Array.isArray(returnData)) {
          returnData = returnData.map(function (v) {
            return v[location];
          });
        } else {
          returnData = returnData[location];
        }
      }
    });
  } else {
    returnData = data[locations];
  } // console.log(returnData);


  return returnData;
};

var parsingChartData = function parsingChartData(chartData, formatters) {
  if (!chartData) {
    return null;
  }

  var parseData = [];
  var arrFormatter = Object.entries(formatters);
  var key = '';
  var format = {};

  var func = function func() {};

  var arg = [];
  var ix = 0;
  chartData.forEach(function (d) {
    var data = {};
    arrFormatter.forEach(function (formatter) {
      // formatter[0] - key, formatter[1] - value
      // [key, format] = formatter;
      key = formatter[0];
      format = formatter[1]; // chartData 에서 원하는 property 값을 가져온다.
      // default값이 있다면 default값을 넣어준다.

      data[key] = format.default ? format.default : getData(d, format.locations); // TODO: 불필요한 반복문 실행이 될수 있음..
      // 설정한 type이 있다면 type을 변화 시켜준다.

      if (format.type) {
        if (Array.isArray(data[key])) {
          data[key] = data[key].map(function (v) {
            return format.type(v);
          });
        } else {
          // data[key] = format.type(data[key]);
          data[key] = [];
        }
      } // 함수가 있을 경우 함수를 실행해 반환값을 받아온다.


      if (format.converter) {
        // value.converter - [function, arguments]
        // [func, arg] = format.converter;
        func = format.converter[0]; // shallow copy..

        arg = Object(C_webCrawling_crawling_front_frontUI_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_10__[/* default */ "a"])(format.converter[1]); // 각각 개별로 처리할 경우 value, 전부를 처리할 경우 values

        if (arg.indexOf('value') !== -1) {
          ix = arg.indexOf('value');

          if (Array.isArray(data[key])) {
            data[key] = data[key].map(function (v) {
              // 배열 데이터(data, timestamp)는 숫자로 변경.
              arg[ix] = v;
              return func.apply(void 0, Object(C_webCrawling_crawling_front_frontUI_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_10__[/* default */ "a"])(arg));
            });
          } else {
            // 하나일 경우는 id일 경우..
            arg[ix] = data[key];
            data[key] = func.apply(void 0, Object(C_webCrawling_crawling_front_frontUI_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_10__[/* default */ "a"])(arg));
          }
        } else if (arg.indexOf('values') !== -1) {
          ix = arg.indexOf('values');

          if (Array.isArray(data[key])) {
            arg[ix] = data[key];
            data[key] = func.apply(void 0, Object(C_webCrawling_crawling_front_frontUI_node_modules_babel_runtime_helpers_esm_toConsumableArray__WEBPACK_IMPORTED_MODULE_10__[/* default */ "a"])(arg));
          }
        } else {
          // TODO: 매개변수가 없을 경우 고려..
          console.error("don't exist value or values");
        }
      }
    });
    parseData.push(data);
  }); // TODO: 한개면 배열로 보내지 않는다...
  // return parseData.length === 1 ? parseData[0] : parseData;

  return parseData;
};

var timeConverter = [function (value) {
  return value * 1000;
}, ['value']];
/* harmony default export */ __webpack_exports__["a"] = ({
  defaultColor: defaultColor,
  stackChartColor: stackChartColor,
  barChartColor: barChartColor,
  extraColor: extraColor,
  markLineColor: markLineColor,
  alarmColor: alarmColor,
  itemDataset: itemDataset,
  quantity: quantity,
  hexToRgb: hexToRgb,
  optionMixin: optionMixin,
  toDecimal: toDecimal,
  networkUnit: networkUnit,
  memoryUnit: memoryUnit,
  fromBytes: fromBytes,
  fromSec: fromSec,
  autoBytesUnit: autoBytesUnit,
  autoSecondsUnit: autoSecondsUnit,
  parsingChartData: parsingChartData,
  timeConverter: timeConverter
});

/***/ })

}]);
//# sourceMappingURL=1.1.9b701453.js.map