const addDataVuex = {
	// 소켓 init 할 때 vm 넣어줌
	vm: null,
	metricDataUpdate(data) {
		const key = data.key;

		switch (key) {
			case 'nodes':
				this.addNodeMetric(data);
				break;
			case 'nodesV2':
				this.addNodeMetric(data);
				break;
			case 'pods':
				this.addPodMetric(data);
				break;
			case 'nodes_pods':
				this.addNodePodMetric(data, 'v1');
				break;
			case 'nodes_podsV2':
				this.addNodePodMetric(data, 'v2');
				break;
			case 'containers':
				this.addContainersMetric(data);
				break;
			default:
		}
	},
	addUserAlertData(data) {
		this.vm.$store.dispatch('socket/user_alert_data', data);
	},
	addNodeMetric(data) {
		const nodeList = data.data || null;
		const nodeMetricList = this.vm.$store.state.rtm.node_metric || null;
		// const storeData = nodeMetricList;

		if (nodeList == null || nodeMetricList == null) {
			console.debug('data null');
			return;
		}
		nodeMetricList.forEach(storeData => {
			nodeList.forEach(nodeData => {
				if (storeData.id === nodeData.id) {
					this.addDataSetArry60(storeData.memory, nodeData.memory);
					this.addDataSetArry60(storeData.cpu, nodeData.cpu);
					this.addDataSetArry60(storeData.network, nodeData.network);
					this.addDataSetArry60(storeData.filesystem, nodeData.filesystem);
					this.addDataSetArry60(storeData.swap, nodeData.swap);
					this.addDataSetArry60(storeData.disk, nodeData.disk);
				}
			});
		});
	},
	addContainersMetric(data) {
		const containerList = data.data || null;
		const containerMetricList = this.vm.$store.state.rtm.container_metric || null;

		if (containerList == null || containerMetricList == null) {
			console.debug('data null');
			return;
		}

		containerMetricList.forEach(storeData => {
			containerList.forEach(containerData => {
				if (storeData.id === containerData.id) {
					this.addDataSetArry60(storeData.memory, containerData.memory);
					this.addDataSetArry60(storeData.cpu, containerData.cpu);
					this.addDataSetArry60(storeData.network, containerData.network);
					this.addDataSetArry60(storeData.filesystem, containerData.filesystem);
					this.addDataSetArry60(storeData.swap, containerData.swap);
					this.addDataSetArry60(storeData.disk, containerData.disk);
				}
			});
		});

		// console.log(podMetricList);
	},
	addPodMetric(data) {
		const podList = data.data || null;
		const podMetricList = this.vm.$store.state.rtm.pod_metric || null;

		if (podList == null || podMetricList == null) {
			console.debug('data null');
			return;
		}

		// const podMetricList = this.vm.$store.state.rtm.pod_metric;
		// const storeData = podMetricList;
		podMetricList.forEach(storeData => {
			podList.forEach(podData => {
				if (storeData.id === podData.id) {
					this.addDataSetArry60(storeData.memory, podData.memory);
					this.addDataSetArry60(storeData.cpu, podData.cpu);
					this.addDataSetArry60(storeData.network, podData.network);
					this.addDataSetArry60(storeData.filesystem, podData.filesystem);
					this.addDataSetArry60(storeData.swap, podData.swap);
					this.addDataSetArry60(storeData.disk, podData.disk);
				}
			});
		});

		// console.log(podMetricList);
	},
	addNodePodMetric(data, version) {
		const podList = data.data || null;
		const podMetricList = this.vm.$store.state.rtm.pod_metric || null;

		if (podList == null || podMetricList == null) {
			console.debug('data null');
			return;
		}

		podMetricList.forEach(storeData => {
			podList.forEach(podData => {
				// 버전별 조건로직 변경
				if (version === 'v1' ? storeData.nodeId === podData.nodeId : true) {
					if (storeData.id === podData.id) {
						this.addDataSetArry60(storeData.memory, podData.memory);
						this.addDataSetArry60(storeData.cpu, podData.cpu);
						this.addDataSetArry60(storeData.network, podData.network);
						this.addDataSetArry60(storeData.filesystem, podData.filesystem);
						this.addDataSetArry60(storeData.swap, podData.swap);
						this.addDataSetArry60(storeData.disk, podData.disk);
					}
				}
			});
		});

		// console.log(podMetricList);
	},
	addDataSetArry60(storeData, newData) {
		// null 인 경우 데이터 넣지 않는다.
		if (!storeData) return;
		Object.keys(storeData)
			.filter(f => Array.isArray(storeData[f]))
			.forEach((d, i) => {
				const statData = storeData[d];
				const newStatData = newData[d][0];

				if (newStatData != null) {
					if (statData.length === 60) {
						statData.shift();
						statData.push(newStatData);
						// this.vm.$set(statData, statData.length, newData);
					} else {
						// this.vm.$set(statData, statData.length, newData);
						statData.push(newStatData);
					}
				}
			});
	},
};

export default addDataVuex;
