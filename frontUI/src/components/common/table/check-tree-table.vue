<template>
	<el-table
		ref="elementTable"
		:data="tableData"
		v-bind="tableOptions"
		@select="onSelect"
		@select-all="onSelectAll"
		v-on="listeners"
	>
		<el-table-column type="selection"></el-table-column>
		<template v-for="header in headerData">
			<el-table-column v-if="!header.hidden" :key="header.value" v-bind="header">
			</el-table-column>
		</template>
	</el-table>
</template>

<script>
import tableUtil from '@/components/common/table/tableUtil';

export default {
	name: 'checkbox-tree-table',
	components: {},
	props: {
		headerData: {
			type: Array,
			default: () => [],
		},
		tableData: {
			type: Array,
			default: () => [],
		},
		tableOptions: {
			type: Object,
			default: () => tableUtil.mergeOptions({}),
		},
		defaultSelection: {
			type: Array,
			default: () => [],
		},
	},
	watch: {
		tableData: {
			handler(data) {
				this.setRenderRowList(data);
			},
			deep: true,
		},
		defaultSelection: {
			handler(data) {
				this.table.clearSelection();
				this.$nextTick(() => {
					this.defaultSelection.forEach(key => {
						if (this.renderedRowList[key]) {
							this.table.toggleRowSelection(this.renderedRowList[key], true);
						}
					});
				});
			},
			deep: true,
		},
	},
	data() {
		return {
			table: null,
			renderedRowList: {},
			selectedAll: false,
		};
	},
	computed: {
		listeners() {
			return this.$listeners;
		},
	},
	mounted() {
		this.$nextTick(() => {
			this.table = this.$refs.elementTable;

			// 자식, 부모 상관없이 모두 1depth 인 row 의 리스트
			this.setRenderRowList(this.tableData);

			this.defaultSelection.forEach(key => {
				if (this.renderedRowList[key]) {
					this.table.toggleRowSelection(this.renderedRowList[key], true);
				}
			});
		});
	},
	methods: {
		onSelectAll(selection) {
			const cpSelection = [...selection];
			const keys = Object.keys(this.renderedRowList);
			const rootRowKeyList = keys.filter(key => this.renderedRowList[key].level === 1);
			const checked = rootRowKeyList.some(key =>
				cpSelection.includes(this.renderedRowList[key]),
			);

			console.log(cpSelection, rootRowKeyList, checked);
			for (let ix = 0, ixLen = rootRowKeyList.length; ix < ixLen; ix++) {
				const key = rootRowKeyList[ix];
				const row = this.renderedRowList[key];

				this.onSelect(cpSelection, row, checked);
			}
		},
		onSelect(selection, row, checked = selection.includes(row)) {
			if (this.hasProperty(row, 'children')) {
				if (!row.forceCheck) {
					for (let ix = 0, ixLen = row.children.length; ix < ixLen; ix++) {
						const child = row.children[ix];

						// console.log("child");
						this.table.toggleRowSelection(child, checked);
					}
					row.forceCheck = true;
				}
			} else {
				row.forceCheck = true;
			}

			if (row.forceCheck) {
				if (this.hasProperty(row, 'parentId') && this.renderedRowList[row.parentId]) {
					const parent = this.renderedRowList[row.parentId];

					this.renderedRowList[row.parentId].forceCheck = true;

					this.table.toggleRowSelection(
						parent,
						this.hasOwnCheckedChildren(selection, parent),
					);
					this.renderedRowList[row.parentId].forceCheck = false;
				} else {
					row.forceCheck = false;
				}
			}

			row.forceCheck = false;
		},
		getRow(id) {
			return this.renderedRowList[id];
		},
		parentChecekd(selection, row) {
			if (this.hasProperty(row, 'parentId')) {
				const parent = this.renderedRowList[row.parentId];

				if (!this.hasProperty(row, 'children')) {
					this.renderedRowList[row.parentId].forceCheck = true;
				}
				this.table.toggleRowSelection(
					parent,
					this.hasOwnCheckedChildren(selection, parent),
				);
			}
		},
		// selectAllChildren(selection, row, checked) {
		//     // 자식이 있는 경우 현재 row 의 checked 상태로 자식 모두 변경
		//     // if (!row.forceCheck) {
		//     if (this.hasProperty(row, "children")) {
		//         row.forceCheck = true;
		//         for (let ix = 0, ixLen = row.children.length; ix < ixLen; ix++) {
		//             const child = row.children[ix];
		//
		//             // child.forceCheck = true;
		//             this.table.toggleRowSelection(child, checked);
		//             child.forceCheck = true;
		//             // row.forceCheck = false;
		//         }
		//     } else {
		//         row.forceCheck = false;
		//     }
		//     // } else {
		//     //     row.forceCheck = false;
		//     // for (let ix = 0, ixLen = row.children.length; ix < ixLen; ix++) {
		//     //     const child = row.children[ix];
		//     //
		//     //     child.forceCheck = false;
		//     //     // this.table.toggleRowSelection(child, checked);
		//     // }
		//     // }
		// },
		hasOwnCheckedChildren(selection, row) {
			return row.children.some(e => selection.includes(e));
		},
		setRenderRowList(data, level = 1) {
			for (let ix = 0, ixLen = data.length; ix < ixLen; ix++) {
				this.renderedRowList[data[ix].id] = data[ix];
				this.renderedRowList[data[ix].id].forceCheck = false;
				this.renderedRowList[data[ix].id].level = level;
				if (this.hasProperty(data[ix], 'children')) {
					this.setRenderRowList(data[ix].children, level + 1);
				}
			}
		},
		hasProperty(obj, key) {
			return Object.prototype.hasOwnProperty.call(obj, key);
		},
	},
};
</script>

<style scoped></style>
