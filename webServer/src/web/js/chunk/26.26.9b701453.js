(this["webpackJsonp"] = this["webpackJsonp"] || []).push([[26],{

/***/ "./node_modules/core-js/internals/correct-is-regexp-logic.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/internals/correct-is-regexp-logic.js ***!
  \*******************************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var wellKnownSymbol = __webpack_require__(/*! ../internals/well-known-symbol */ "./node_modules/core-js/internals/well-known-symbol.js");

var MATCH = wellKnownSymbol('match');

module.exports = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (e) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (f) { /* empty */ }
  } return false;
};


/***/ }),

/***/ "./node_modules/core-js/internals/not-a-regexp.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/internals/not-a-regexp.js ***!
  \********************************************************/
/*! no static exports found */
/*! all exports used */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

var isRegExp = __webpack_require__(/*! ../internals/is-regexp */ "./node_modules/core-js/internals/is-regexp.js");

module.exports = function (it) {
  if (isRegExp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};


/***/ }),

/***/ "./node_modules/core-js/modules/es.array.includes.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es.array.includes.js ***!
  \***********************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var $includes = __webpack_require__(/*! ../internals/array-includes */ "./node_modules/core-js/internals/array-includes.js").includes;
var addToUnscopables = __webpack_require__(/*! ../internals/add-to-unscopables */ "./node_modules/core-js/internals/add-to-unscopables.js");
var arrayMethodUsesToLength = __webpack_require__(/*! ../internals/array-method-uses-to-length */ "./node_modules/core-js/internals/array-method-uses-to-length.js");

var USES_TO_LENGTH = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });

// `Array.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-array.prototype.includes
$({ target: 'Array', proto: true, forced: !USES_TO_LENGTH }, {
  includes: function includes(el /* , fromIndex = 0 */) {
    return $includes(this, el, arguments.length > 1 ? arguments[1] : undefined);
  }
});

// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('includes');


/***/ }),

/***/ "./node_modules/core-js/modules/es.string.includes.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es.string.includes.js ***!
  \************************************************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $ = __webpack_require__(/*! ../internals/export */ "./node_modules/core-js/internals/export.js");
var notARegExp = __webpack_require__(/*! ../internals/not-a-regexp */ "./node_modules/core-js/internals/not-a-regexp.js");
var requireObjectCoercible = __webpack_require__(/*! ../internals/require-object-coercible */ "./node_modules/core-js/internals/require-object-coercible.js");
var correctIsRegExpLogic = __webpack_require__(/*! ../internals/correct-is-regexp-logic */ "./node_modules/core-js/internals/correct-is-regexp-logic.js");

// `String.prototype.includes` method
// https://tc39.github.io/ecma262/#sec-string.prototype.includes
$({ target: 'String', proto: true, forced: !correctIsRegExpLogic('includes') }, {
  includes: function includes(searchString /* , position = 0 */) {
    return !!~String(requireObjectCoercible(this))
      .indexOf(notARegExp(searchString), arguments.length > 1 ? arguments[1] : undefined);
  }
});


/***/ }),

/***/ "./src/mixins/defaultMixin.js":
/*!************************************!*\
  !*** ./src/mixins/defaultMixin.js ***!
  \************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.concat */ "./node_modules/core-js/modules/es.array.concat.js");
/* harmony import */ var core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_concat__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_includes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.includes */ "./node_modules/core-js/modules/es.array.includes.js");
/* harmony import */ var core_js_modules_es_array_includes__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es_function_name__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es.function.name */ "./node_modules/core-js/modules/es.function.name.js");
/* harmony import */ var core_js_modules_es_function_name__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_function_name__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es_object_keys__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es.object.keys */ "./node_modules/core-js/modules/es.object.keys.js");
/* harmony import */ var core_js_modules_es_object_keys__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_object_keys__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es_string_includes__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es.string.includes */ "./node_modules/core-js/modules/es.string.includes.js");
/* harmony import */ var core_js_modules_es_string_includes__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_string_includes__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _common_LocalStorageMemager__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @/common/LocalStorageMemager */ "./src/common/LocalStorageMemager.js");
/* harmony import */ var _vuex_vuex_main__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @/vuex/vuex-main */ "./src/vuex/vuex-main.js");








var basicInfoSetting = function basicInfoSetting(vm) {
  // 기본 데이터 셋팅 할때 값이 null 로컬스토리지에서 가져옴
  if (!vm.$store.state.userId) {
    vm.$store.dispatch('setUserId', Object(_common_LocalStorageMemager__WEBPACK_IMPORTED_MODULE_5__[/* getItem */ "a"])('userId'));
  }

  if (!vm.$store.state.params.system_list) {
    vm.$store.dispatch('params/setSystemList', Object(_common_LocalStorageMemager__WEBPACK_IMPORTED_MODULE_5__[/* getItem */ "a"])('system_list'));
  }

  if (!vm.$store.state.params.systemId) {
    var systemId = Object(_common_LocalStorageMemager__WEBPACK_IMPORTED_MODULE_5__[/* getItem */ "a"])('systemId');
    vm.$store.dispatch('params/setSystemId', systemId);
    vm.$api.sysId = systemId;
  }

  if (!vm.$webCaller.repeatTime) {
    vm.$webCaller.initRepeatTime();
  }
};

var MyMixin = {
  beforeRouteEnter: function beforeRouteEnter(to, from, next) {
    console.log("%c #### from: ".concat(from.path, " , to: ").concat(to.path, "  beforeRouteEnter ####"), 'color: #ffc00f');
    var moduleKey = to.matched[0].meta.moduleName;

    if (!Object.keys(_vuex_vuex_main__WEBPACK_IMPORTED_MODULE_6__["store"].state).includes(moduleKey)) {
      _vuex_vuex_main__WEBPACK_IMPORTED_MODULE_6__["store"].registerModule(moduleKey, _vuex_vuex_main__WEBPACK_IMPORTED_MODULE_6__["".concat(moduleKey, "Module")] // {
      // 	preserveState: true,
      // },
      );
    }

    next(function (vm) {
      vm.$store.dispatch('activeView', to);
      basicInfoSetting(vm);

      if (!vm.$webCaller.isSocketConn) {
        // vm.$webCaller.setToken();
        vm.$webCaller.initSocket();
        vm.$webCaller.addSubscribe('wsEvent', Object(_common_LocalStorageMemager__WEBPACK_IMPORTED_MODULE_5__[/* getItem */ "a"])('systemId'), 'alarm', 'alarmData', 'alarmTopic');
      }

      vm.$store.dispatch('activeView', to);
      vm.$loading.create('full').show();
    });
  },
  beforeRouteLeave: function beforeRouteLeave(to, from, next) {
    var toPath = to.matched[0].name;
    var fromPath = from.matched[0].name;
    var moduleKey = from.matched[0].meta.moduleName;

    if (toPath !== fromPath) {
      if (Object.keys(_vuex_vuex_main__WEBPACK_IMPORTED_MODULE_6__["store"].state).includes(moduleKey)) {
        _vuex_vuex_main__WEBPACK_IMPORTED_MODULE_6__["store"].unregisterModule(moduleKey, _vuex_vuex_main__WEBPACK_IMPORTED_MODULE_6__["".concat(moduleKey, "Module")]);
      }
    } // 페이저 떠나면 소켓 전부 unsubscribe


    if (this.$webCaller.worker != null) {
      this.$webCaller.deleteSubscribe('all', null);
    }

    this.$loading.removeAll();
    console.log("%c #### from: ".concat(from.path, " , to: ").concat(to.path, "  beforeRouteLeave ####"), 'color: #ff090963');
    next(); // 이 컴포넌트를 렌더링하는 라우트가 이전으로 네비게이션 될 때 호출됩니다.
    // `this` 컴포넌트 인스턴스에 접근 할 수 있습니다.
  },
  methods: {// getNamespace(clusterId, callbackFn) {
    // 	const userId = this.$store.state.userId;
    //
    // 	this.serviceIns.setApiPath(
    // 		`${this.$api.userPermission.permission}/${userId}/permissions/clusters/${clusterId}/namespaces`,
    // 	);
    // 	return this.serviceIns
    // 		.get('', (status, response) => response && response.data)
    // 		.then(callbackFn);
    // },
    // callMetric() {
    // 	this.serviceIns.setApiPath(this.$api.metric.meta);
    // 	const promise = this.serviceIns.get(
    // 		{ inUse: true },
    // 		(status, response) => response,
    // 	);
    //
    // 	return promise;
    // },
  },
  mounted: function mounted() {
    var _this = this;

    this.$nextTick(function () {
      _this.$loading.hide('full');
    });
  }
};
/* harmony default export */ __webpack_exports__["a"] = (MyMixin);

/***/ }),

/***/ "./src/views/performanceAnalysis/performance-trend-analysis.vue":
/*!**********************************************************************************!*\
  !*** ./src/views/performanceAnalysis/performance-trend-analysis.vue + 4 modules ***!
  \**********************************************************************************/
/*! exports provided: default */
/*! all exports used */
/*! ModuleConcatenation bailout: Cannot concat with ./src/mixins/defaultMixin.js */
/*! ModuleConcatenation bailout: Cannot concat with ./node_modules/vue-loader/lib/runtime/componentNormalizer.js */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"74f39337-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/views/performanceAnalysis/performance-trend-analysis.vue?vue&type=template&id=4bb9d8b4&scoped=true&
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "performance-trend-analysis-container" })
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./src/views/performanceAnalysis/performance-trend-analysis.vue?vue&type=template&id=4bb9d8b4&scoped=true&

// EXTERNAL MODULE: ./src/mixins/defaultMixin.js
var defaultMixin = __webpack_require__("./src/mixins/defaultMixin.js");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/views/performanceAnalysis/performance-trend-analysis.vue?vue&type=script&lang=js&
//
//
//
//

/* harmony default export */ var performance_trend_analysisvue_type_script_lang_js_ = ({
  name: 'performanceTrendAnalysis',
  mixins: [defaultMixin["a" /* default */]],
  components: {},
  data: function data() {
    return {};
  },
  computed: {},
  watch: {},
  created: function created() {},
  mounted: function mounted() {},
  beforeDestroy: function beforeDestroy() {},
  destroyed: function destroyed() {},
  methods: {}
});
// CONCATENATED MODULE: ./src/views/performanceAnalysis/performance-trend-analysis.vue?vue&type=script&lang=js&
 /* harmony default export */ var performanceAnalysis_performance_trend_analysisvue_type_script_lang_js_ = (performance_trend_analysisvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__("./node_modules/vue-loader/lib/runtime/componentNormalizer.js");

// CONCATENATED MODULE: ./src/views/performanceAnalysis/performance-trend-analysis.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  performanceAnalysis_performance_trend_analysisvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "4bb9d8b4",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/views/performanceAnalysis/performance-trend-analysis.vue"
/* harmony default export */ var performance_trend_analysis = __webpack_exports__["default"] = (component.exports);

/***/ })

}]);
//# sourceMappingURL=26.26.9b701453.js.map