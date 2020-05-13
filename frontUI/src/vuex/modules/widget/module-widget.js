import widgetGetters from './getters-widget';
import widgetActions from './actions-widget';
import widgetMutation from './mutation-widget';

const widgetModule = {
	namespaced: true,
	state: {
		dashboard_layout: null,
		is_use_widget_list: (() => {
			const arr = [];

			for (let ix = 0; ix < 30; ix++) {
				arr.push({ i: `widget${ix}`, isUse: false });
			}
			return arr;
		})(),
		widget_format_list: {
			// empty: {
			// 	...{ w: 8, h: 9, minW: 8, minH: 6, maxW: 48, maxH: 30 },
			// 	component: {
			// 		visualization: {},
			// 	},
			// 	widget: { header: 'default-header', body: 'empty-view' },
			// },
			timeline: {
				...{ w: 48, h: 4, minW: 48, minH: 3 },
				component: {
					params: {},
				},
				widget: {
					title: '',
					header: 'default-header',
					body: 'overview/timeline-view',
				},
			},
			overall_performance: {
				...{ w: 16, h: 8 },
				component: {
					params: {
						// sys_id: '2',
						// stat: 'cpu_sys',
						// inst_id: null,
						date: null,
						// inst_name: 'FEP_AP_OS',
						metric: null,
						// header: null,
						// inst_type: 'all',
						// type: 'os,',
					},
				},
				widget: {
					title: 'Overall Performance(전체 트랜잭션 성능)',
					header: 'default-header',
					body: 'overview/e2e-performance-Frame-view',
				},
			},
			instance_performance: {
				...{ w: 16, h: 8 },
				component: {
					// uri: this.$api.instancePerformance().instPerformance,
					params: {
						// sys_id: '2',
						// stat: 'cpu_sys',
						// inst_id: null,
						date: null,
						// inst_name: 'FEP_AP_OS',
						inst: null,
						metric: null,
						// header: null,
						// inst_type: 'all',
						// type: 'os,',
					},
				},
				widget: {
					title: 'Instance Performance(개별성능)',
					header: 'default-header',
					body: 'overview/predict-allInstance-Frame-view',
				},
			},
			DB_anomaly_detection: {
				...{ w: 16, h: 8 },
				component: {
					header: {
						type: 'DB',
						frame: 'anomaly',
					},
					params: {
						// sys_id: '2',
						// stat: 'cpu_sys',
						// inst_id: null,
						date: null,
						// inst_name: 'FEP_AP_OS',
						inst: null,
						metric: null,
						// header: null,
						// inst_type: 'all',
						// type: 'os,',
					},
				},
				widget: {
					title: '이상탐지',
					header: 'aiChart-type-header',
					body: 'overview/AnomalyDetection/DB-detection-Frame',
				},
			},
			OS_anomaly_detection: {
				...{ w: 16, h: 8 },
				component: {
					header: {
						type: 'OS',
						frame: 'anomaly',
					},
					params: {
						// sys_id: '2',
						// stat: 'cpu_sys',
						// inst_id: null,
						date: null,
						// inst_name: 'FEP_AP_OS',
						inst: null,
						metric: null,
						// header: null,
						// inst_type: 'all',
						// type: 'os,',
					},
				},
				widget: {
					title: '이상탐지',
					header: 'aiChart-type-header',
					body: 'overview/AnomalyDetection/OS-detection-Frame',
				},
			},
			WAS_anomaly_detection: {
				...{ w: 16, h: 8 },
				component: {
					header: {
						type: 'WAS',
						frame: 'anomaly',
					},
					params: {
						// sys_id: '2',
						// stat: 'cpu_sys',
						// inst_id: null,
						date: null,
						// inst_name: 'FEP_AP_OS',
						inst: null,
						metric: null,
						// header: null,
						// inst_type: 'all',
						// type: 'os,',
					},
				},
				widget: {
					title: '이상탐지',
					header: 'aiChart-type-header',
					body: 'overview/AnomalyDetection/WAS-detection-Frame',
				},
			},
			DB_predict: {
				...{ w: 16, h: 8 },
				component: {
					header: {
						type: 'DB',
						frame: 'predict',
					},
					// uri: this.$api.instancePerformance().instPerformance,
					params: {
						// sys_id: '2',
						// stat: 'cpu_sys',
						// inst_id: null,
						date: null,
						// inst_name: 'FEP_AP_OS',
						inst: null,
						metric: null,
						// header: null,
						// inst_type: 'all',
						// type: 'os,',
					},
				},
				widget: {
					title: '부하예측',
					header: 'aiChart-type-header',
					body: 'overview/loadPrediction/DB-predict-Frame',
				},
			},
			OS_predict: {
				...{ w: 16, h: 8 },
				component: {
					header: {
						type: 'OS',
						frame: 'predict',
					},
					// uri: this.$api.instancePerformance().instPerformance,
					params: {
						// sys_id: '2',
						// stat: 'cpu_sys',
						// inst_id: null,
						date: null,
						// inst_name: 'FEP_AP_OS',
						inst: null,
						metric: null,
						// header: null,
						// inst_type: 'all',
						// type: 'os,',
					},
				},
				widget: {
					title: '부하예측',
					header: 'aiChart-type-header',
					body: 'overview/loadPrediction/OS-predict-Frame',
				},
			},
			WAS_predict: {
				...{ w: 16, h: 8 },
				component: {
					header: {
						type: 'WAS',
						frame: 'predict',
					},
					// uri: this.$api.instancePerformance().instPerformance,
					params: {
						// sys_id: '2',
						// stat: 'cpu_sys',
						// inst_id: null,
						date: null,
						// inst_name: 'FEP_AP_OS',
						inst: null,
						metric: null,
						// header: null,
						// inst_type: 'all',
						// type: 'os,',
					},
				},
				widget: {
					title: '부하예측',
					header: 'aiChart-type-header',
					body: 'overview/loadPrediction/WAS-predict-Frame',
				},
			},
			TXN_predict: {
				...{ w: 16, h: 8 },
				component: {
					header: {
						type: 'TXN',
						frame: 'predict',
					},
					// uri: this.$api.instancePerformance().instPerformance,
					params: {
						// sys_id: '2',
						// stat: 'cpu_sys',
						// inst_id: null,
						date: null,
						// inst_name: 'FEP_AP_WAS',
						txn: null,
						metric: null,
						// header: null,
						// inst_type: 'all',
						// type: 'os,',
					},
				},
				widget: {
					title: '부하예측',
					header: 'aiChart-type-header',
					body: 'overview/loadPrediction/TXN-predict-Frame',
				},
			},
			AI_motion: {
				...{ w: 20, h: 23, minW: 13, minH: 17 },
				component: {
					params: {
						date: null,
						color: 'green',
					},
				},
				widget: {
					title: 'AI Monitoring',
					header: 'default-header',
					body: 'overview/main-motion',
				},
			},
			WAS_motion: {
				...{ w: 8, h: 10, minW: 8, minH: 8 },
				component: {
					params: {
						widType: 'WAS',
						color: 'green',
					},
				},
				widget: {
					title: 'WAS',
					header: 'default-header',
					body: 'overview/sub-motion',
				},
			},
			DB_motion: {
				...{ w: 8, h: 10, minW: 8, minH: 8 },
				component: {
					params: {
						widType: 'DB',
						color: 'green',
					},
				},
				widget: {
					title: 'DB',
					header: 'default-header',
					body: 'overview/sub-motion',
				},
			},
			OS_motion: {
				...{ w: 8, h: 10, minW: 8, minH: 8 },
				component: {
					params: {
						widType: 'OS',
						color: 'green',
					},
				},
				widget: {
					title: 'OS',
					header: 'default-header',
					body: 'overview/sub-motion',
				},
			},
		},
		dashboard_list: null,
		selected_dashboard: null,
		selected_widget_format: null,
	},
	mutations: widgetMutation,
	actions: widgetActions,
	getters: widgetGetters,
};
export default widgetModule;
