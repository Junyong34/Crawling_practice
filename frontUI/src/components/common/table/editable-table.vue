<template>
	<el-table
		ref="elementTable"
		:data="tableData"
		v-bind="tableOptions"
		v-on="listeners"
		@cell-dblclick="onEdit"
		@cell-click="onEdit"
	>
		<el-table-column v-if="selection" type="selection" width="35"></el-table-column>
		<template v-for="header in headerData">
			<el-table-column v-if="!header.hidden" :key="header.value" v-bind="header">
				<template slot-scope="props">
					<slot
						:name="header.value"
						:row="props.row"
						:column="props.column"
						:$index="props.$index"
					>
						<editable-content
							:props="props"
							:option="header"
							:property="header.value"
							:editing-data="editingData"
							:formatter="header.formatter"
							@row-change="onEditCellBlur"
						>
						</editable-content>
					</slot>
				</template>
			</el-table-column>
		</template>
	</el-table>
</template>
<script>
import tableUtil from '@/components/common/table/tableUtil';
import EditableContent from './cellContent/editable-content';

export default {
	name: 'editable-table',
	components: {
		EditableContent,
	},
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
		selection: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		listeners() {
			return this.$listeners;
		},
	},
	data() {
		return {
			editingData: null, // 클릭된 cell의 정보를 담기 위한 data
		};
	},
	methods: {
		onEdit(row, column, cell, event) {
			// headers에서 editOptions을 지정한 컬럼만 로직 수행
			const header = this.headerData.find(d => d.value === column.property);

			if (!header || !Object.prototype.hasOwnProperty.call(header, 'editOptions')) {
				return;
			}

			if (event.type === 'dblclick' || header.editOptions.type === 'checkbox') {
				this.editingData = {
					row,
					column,
					cell,
				};
			}
		},
		onEditCellBlur(row) {
			this.$emit('row-change', row);
		},
	},
};
</script>
<style scoped></style>
