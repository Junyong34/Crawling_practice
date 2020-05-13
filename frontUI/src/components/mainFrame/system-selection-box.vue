<template>
	<el-popover
		trigger="manual"
		placement="bottom"
		v-model="visible"
		popper-class="system-popper"
		v-click-outside="onClickOutside"
	>
		<div slot="reference" :class="selectBoxClass" @click="onClickSelectBox">
			<span class="selected-system-text">{{ activeSystem }}</span>
			<i class="el-icon-arrow-up"></i>
		</div>
		<p class="system-select-title">System List</p>
		<el-collapse v-model="activeCategory" accordion>
			<el-collapse-item
				v-for="(systemCategory, i) in systemList"
				:key="i"
				:name="systemCategory.name"
			>
				<template slot="title">
					{{ systemCategory.name }}
				</template>
				<template v-if="systemCategory.children !== 0">
					<div
						v-for="(system, i) in systemCategory.children"
						:key="i"
						class="system-item-box"
						@click="selectSystem(system)"
					>
						<span class="system-item-text">{{ system.name }}</span>
					</div>
				</template>
			</el-collapse-item>
			<!--<el-collapse-item name="All">
                <template slot="title">
                    All
                </template>
            </el-collapse-item>
            <el-collapse-item name="Academic System">
                <template slot="title">
                    Academic System
                </template>
                <div class="system-item-box" @click="selectSystem">
                    <span class="system-item-text">ERCP 1</span>
                </div>
                <div class="system-item-box" @click="selectSystem">
                    <span class="system-item-text">ERCP 2</span>
                </div>
                <div class="system-item-box" @click="selectSystem">
                    <span class="system-item-text">ERCP 3</span>
                </div>
            </el-collapse-item>
            <el-collapse-item name="System">
                <template slot="title">
                    System
                </template>
            </el-collapse-item>-->
		</el-collapse>
	</el-popover>
</template>

<script>
import { mapGetters } from 'vuex';
import { setItem } from '@/common/LocalStorageMemager';

export default {
	name: 'system-selection-box',
	props: {},
	data() {
		return {
			visible: false,
			selectBoxClass: 'system-select-box',
			activeSystem: '',
			activeCategory: '',
			systemList: [],
			serviceIns: this.$webCaller.serviceIns,
		};
	},
	computed: {
		...mapGetters({
			getSystemList: 'params/getSystemList',
			getSystemId: 'params/getSystemId',
		}),
	},
	watch: {
		getSystemId: {
			handler(newDate, oldDate) {
				if (!newDate) return;
				this.initBasicInfo();
				this.basicInfoCall();
			},
			immediate: true,
		},
	},
	created() {},
	mounted() {
		this.$nextTick(() => {
			this.temporaryParseFn();
		});
	},
	beforeDestroy() {},
	destroyed() {},
	methods: {
		initBasicInfo() {
			this.$store.dispatch('params/setInstanceList', null);
			this.$store.dispatch('params/setMetricList', null);
			this.$store.dispatch('params/setTxnList', null);
		},
		basicInfoCall() {
			this.insListCall();
			this.txnListCall();
			this.metricListCall();
		},
		insListCall() {
			const uri = this.$api.basicInfo().instance;
			this.serviceIns.get(uri, '', (status, response) => {
				this.$store.dispatch('params/setInstanceList', response.data);
				// setItem('instance_list', response.data);
			});
		},
		txnListCall() {
			const uri = this.$api.fcst().txns;
			const params = {
				sys_id: this.getSystemId,
			};
			this.serviceIns.get(uri, params, (status, response) => {
				this.$store.dispatch('params/setTxnList', response.data);
				// setItem('txn_list', response.data);
			});
		},
		metricListCall() {
			const uri = this.$api.basicInfo().metric;
			this.serviceIns.get(uri, '', (status, response) => {
				this.$store.dispatch('params/setMetricList', response.data);
				// setItem('metric_list', response.data);
			});
		},
		temporaryParseFn() {
			const result = [
				{
					name: 'All',
					children: [],
				},
			];

			const systemList = this.deepCopy(this.getSystemList);

			for (let ix = 0, ixLen = systemList.length; ix < ixLen; ix++) {
				const system = systemList[ix];
				result[0].children.push(system);
			}

			this.systemList = result;
			this.setActiveSystem();
		},
		setActiveSystem() {
			const systemList = this.deepCopy(this.systemList);
			const systemId = this.getSystemId;

			systemList.some(category => {
				return category.children.some(system => {
					if (system.sys_id === systemId) {
						this.activeCategory = category.name;
						this.activeSystem = system.name;
						return true;
					} else {
						return false;
					}
				});
			});
		},
		onClickOutside() {
			this.visible = false;
			this.changeClass();
		},
		onClickSelectBox() {
			this.visible = !this.visible;
			this.changeClass();
		},
		selectSystem(system) {
			const systemId = system.sys_id;

			this.$store.dispatch('params/setSystemId', systemId);
			setItem('systemId', systemId);
			this.$api.sysId = systemId;
			this.setActiveSystem();

			this.visible = false;
			this.changeClass();
		},
		changeClass() {
			this.selectBoxClass = this.visible
				? 'system-select-box is-active'
				: 'system-select-box';
		},
		deepCopy(target) {
			const deepCopyObject = JSON.stringify(target);
			return JSON.parse(deepCopyObject);
		},
	},
};
</script>

<style lang="scss" scoped>
.system-select-box {
	width: 160px;
	height: 24px;
	border: solid 1px #787878;
	border-radius: 2px;
	background-color: #121212;
	position: relative;

	&:focus {
		outline: none;
	}

	&:hover {
		cursor: pointer;
		border-color: #7e51ff;

		.selected-system-text {
			opacity: 1;
		}
		.el-icon-arrow-up {
			opacity: 1;
		}
	}

	&.is-active {
		border-color: #7e51ff;

		.selected-system-text {
			opacity: 1;
		}
		.el-icon-arrow-up {
			opacity: 1;
			transform: rotate(180deg);
		}
	}

	.selected-system-text {
		opacity: 0.7;
		font: {
			family: Roboto;
			size: 12px;
		}
		color: #ffffff;
		margin-left: 8px;
	}

	.el-icon-arrow-up {
		position: absolute;
		top: 4px;
		right: 5px;
		opacity: 0.7;
		transition: transform 0.3s;
	}
}
</style>
