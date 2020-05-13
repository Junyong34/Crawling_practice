<template>
	<div>
		<el-table
			ref="elementTable"
			:data="displayData"
			:span-method="spanMethod"
			v-bind="tableOptions"
			v-on="listeners"
			@row-click="onRowClick"
			@cell-dblclick="onEdit"
			@cell-click="onEdit"
			@header-click="onHeaderClick"
		>
			<el-table-column v-if="selection" type="selection" width="35"></el-table-column>
			<template v-for="header in headerData">
				<el-table-column
					v-if="!header.hidden"
					:key="header.value"
					v-bind="Object.assign({}, header, { sortable: false })"
				>
					<!-- Header 부분 -->
					<template slot="header">
						<slot :name="`header-${header.value}`" :header="header">
							{{ header.label }}
							<span v-if="header.sortable" class="sort-arrow"></span>
						</slot>
					</template>
					<!-- Header 병합 부분 -->
					<el-table-column
						v-for="item in header.children"
						:key="item.value"
						v-bind="Object.assign({}, item, { sortable: false })"
					>
						<template slot-scope="props">
							<slot
								:name="item.value"
								:row="props.row"
								:column="props.column"
								:$index="props.$index"
							>
								<template>
									{{ props.row[header.value] }}
								</template>
							</slot>
						</template>
					</el-table-column>
					<!-- Body 부분 -->
					<template slot-scope="props">
						<slot
							:name="header.value"
							:row="props.row"
							:column="props.column"
							:$index="props.$index"
						>
							<editable-content
								v-if="header.editOptions"
								:props="props"
								:option="header"
								:property="header.value"
								:editing-data="editingData"
								:formatter="header.formatter"
								v-on="listeners"
								@cell-change="updateRow"
							>
							</editable-content>
							<template v-else>
								{{ props.row[header.value] }}
							</template>
						</slot>
					</template>
				</el-table-column>
			</template>
			<el-table-column
				v-if="deleteRowEnable"
				prop="delete"
				width="80"
				:label="$t('table.header.delete')"
				align="center"
			>
				<template slot-scope="props">
					<slot
						name="delete"
						:row="props.row"
						:column="props.column"
						:$index="props.$index"
					>
						<el-checkbox
							v-model="props.row.flag"
							true-label="D"
							false-label="U"
						></el-checkbox>
					</slot>
				</template>
			</el-table-column>
		</el-table>
		<div v-if="pagination && tableData.length">
			<el-pagination
				layout="prev, pager, next"
				:total="tableData.length"
				:page-size="pageSize"
				:current-page.sync="currentPage"
				@current-change="currentChange"
			/>
		</div>
		<div v-else-if="pagination" class="empty-pagination"></div>
	</div>
</template>
<script>
import tableUtil from '@/components/common/table/tableUtil';
import EditableContent from './cellContent/editable-content';

export default {
	name: 'basic-table',
	components: { EditableContent },
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
		pagination: {
			type: Boolean,
			default: false,
		},
		pageSize: {
			type: Number,
			default: 15,
		},
		deleteRowEnable: {
			type: Boolean,
			default: false,
		},
		spanMethod: {
			// 셀 병합
			type: Function,
			default: () => {},
		},
		onRowClick: {
			type: Function,
			default: () => {},
		},
	},
	watch: {
		tableData() {
			this.currentPage = 1;
		},
		tableOptions() {
			this.setPaginationTableHeight();
		},
	},
	computed: {
		displayData() {
			if (this.pagination) {
				return this.tableData.slice(
					(this.currentPage - 1) * this.pageSize,
					this.currentPage * this.pageSize,
				);
			}
			return this.tableData;
		},
		listeners() {
			return this.$listeners;
		},
		rowKey() {
			return this.tableOptions.rowKey;
		},
	},
	data() {
		return {
			editingData: null, // 클릭된 cell의 정보를 담기 위한 data
			sortSelected: null,
			sortDirection: null,
			currentPage: 1,
			appendTableData: [],
		};
	},
	mounted() {
		this.$nextTick(() => {
			this.setPaginationTableHeight();
			this.$el.style.height = '100%';
		});
	},
	methods: {
		onEdit(row, column, cell, event) {
			// headers에서 editOptions을 지정한 컬럼만 로직 수행
			if (row.flag === 'D') return;
			const header = this.headerData.find(d => d.value === column.property);

			if (!header || !Object.prototype.hasOwnProperty.call(header, 'editOptions')) {
				return;
			}

			if (event.type === 'click' && header.editOptions.type !== 'checkbox') return;

			this.editingData = {
				row,
				column,
				cell,
			};
		},
		onHeaderClick(column, evt) {
			if (
				!this.headerData.find(h => (column.property ? h.value === column.property : true))
					.sortable
			)
				return;
			const columnName = column.property;
			const table = this.$refs.elementTable;

			if (this.sortSelected !== columnName || !this.sortDirection) {
				table.sort(this.sortSelected, null);
				this.sortSelected = columnName;
				this.sortDirection = 'ascending';
			} else {
				this.sortDirection = this.sortDirection === 'descending' ? null : 'descending';
			}

			table.sort(columnName, this.sortDirection);
		},
		setCurrentRow(selectRow) {
			return this.$refs.elementTable.setCurrentRow(selectRow);
		},
		currentChange(currentPage) {
			this.currentPage = currentPage;
		},
		setPaginationTableHeight() {
			if (this.pagination) {
				if (typeof this.tableOptions.height === 'number') {
					this.tableOptions.height -= 30;
				} else {
					this.tableOptions.height = `calc(${this.tableOptions.height} - 30px)`;
				}
			}
		},
		insertRow(row, prepend = false) {
			row.flag = 'I';
			this.tableData[prepend ? 'unshift' : 'push'](row);
		},
		updateRow(column, newVal, oldVal, row) {
			row.flag = row.flag || 'U';
		},
		findRow(value) {
			return this.tableData.find(r => r[this.rowKey] === value);
		},
	},
};
</script>
<style lang="scss" scoped>
.sort-arrow {
	position: absolute;
	right: 4px;
	width: 0;
	height: 0;
	border-right: 4px solid transparent;
	border-left: 4px solid transparent;
	opacity: 0;
}

.ascending {
	.cell .sort-arrow {
		opacity: 1;
		top: calc(50% - 4px);
		border-top: 4px solid transparent;
		border-bottom: 4px solid #a7a7a7;
	}
}

.descending {
	.cell .sort-arrow {
		opacity: 1;
		top: 50%;
		border-top: 4px solid #a7a7a7;
		border-bottom: 4px solid transparent;
	}
}
</style>
