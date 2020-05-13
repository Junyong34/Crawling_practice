<template>
	<div v-if="editOptions" @mouseover="onMouseOver" @mouseleave="onMouseLeave">
		<el-checkbox
			v-if="editOptions.type === 'checkbox'"
			v-model="props.row[property]"
			:disabled="props.row.flag === 'D'"
			@change="onChange(editOptions.type, $event)"
		></el-checkbox>
		<div v-else-if="isEditing">
			<el-input
				v-if="editOptions.type === 'text'"
				ref="elInput"
				v-model="props.row[property]"
				size="mini"
				v-focus
				@focus="onFocus"
				@change="onChange(editOptions.type, $event)"
				@blur="onChange(editOptions.type, $event)"
				@keyup.enter.native="onChange(editOptions.type, $event)"
			></el-input>
			<el-input-number
				v-if="editOptions.type === 'number'"
				ref="elInput"
				v-model="props.row[property]"
				size="mini"
				v-focus
				:controls="false"
				@focus="onFocus"
				@change="onChange(editOptions.type, $event)"
				@blur="onChange(editOptions.type, $event)"
				@keyup.enter.native="onChange(editOptions.type, $event)"
				style="width: 100%;"
			>
			</el-input-number>
			<el-select
				v-if="editOptions.type === 'select'"
				v-model="props.row[property]"
				:value="props.row[property]"
				size="mini"
				v-focus
				@focus="onFocus"
				@visible-change="onChange(editOptions.type, $event)"
				automatic-dropdown
				style="width: 100%"
			>
				<el-option
					v-for="item in editOptions.itemList"
					:key="item.value"
					:label="item.label"
					:value="item.value"
					@change="onChange(editOptions.type, $event)"
				></el-option>
			</el-select>
		</div>
		<div
			v-else
			:class="[
				'cell-content',
				`cell-align-${option.align}`,
				cellValue === null ? 'empty-cell-value' : '',
			]"
		>
			<div class="cell-value">{{ cellValue }}</div>
			<el-tag
				v-if="props.row.flag !== 'D'"
				v-show="tagShow"
				size="mini"
				type="info"
				class="cell-tag"
				disable-transitions
			>
				<i class="el-icon-edit"></i
			></el-tag>
		</div>
	</div>
	<div v-else>
		<span>{{ cellValue }}</span>
	</div>
</template>
<script>
export default {
	name: 'editable-content',
	props: {
		props: Object,
		property: String,
		editingData: Object,
		option: Object,
	},
	data() {
		return {
			isEditing: false,
			inputFocused: false,
			oldValue: null,
			tagShow: false,
		};
	},
	directives: {
		focus: {
			inserted(el, binding, vnode) {
				vnode.componentInstance.focus();
			},
		},
	},
	watch: {
		editingData() {
			if (this.editingData) {
				this.isEditing =
					this.editingData.row === this.props.row &&
					this.property === this.editingData.column.property;
				this.inputFocused = true;
			} else {
				this.isEditing = false;
			}
		},
	},
	computed: {
		editOptions() {
			return this.option.editOptions;
		},
		cellValue() {
			if (this.option.formatter) {
				return this.option.formatter(
					this.props.row,
					this.props.column,
					this.props.row[this.property],
					this.props.$index,
				);
			} else if (this.editOptions && this.editOptions.type === 'select') {
				return this.editOptions.itemList.find(
					d => String(d.value) === String(this.props.row[this.property]),
				).label;
			} else {
				return this.props.row[this.property];
			}
		},
	},
	methods: {
		onFocus() {
			this.oldValue = this.editingData.row[this.property];
		},
		onChange(name, e) {
			const row = this.editingData.row;

			if (e.type === 'keyup') {
				this.isEditing = false;
				return;
			} else if (name !== 'checkbox' && typeof e === 'boolean' && e) {
				return;
			}
			const newValue = row[this.property];

			if (this.oldValue !== newValue) {
				this.$emit('cell-change', this.editingData.column, newValue, this.oldValue, row);
			}
			this.isEditing = false;
		},
		onMouseOver() {
			this.tagShow = true;
		},
		onMouseLeave() {
			this.tagShow = false;
		},
	},
};
</script>
<style scoped>
.cell-content {
	display: flex;
	align-items: center;
	flex: 1;
}

.empty-cell-value {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
}

.cell-value {
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

.cell-align-center {
	justify-content: center;
}

.cell-align-right {
	justify-content: flex-end;
}

.cell-tag {
	position: absolute;
	right: 5px;
	opacity: 0.5;
}
</style>
