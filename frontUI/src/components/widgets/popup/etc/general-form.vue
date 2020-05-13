<template>
	<el-form
		class="info-area"
		size="mini"
		ref="generalForm"
		:model="form"
		label-width="20%"
		label-position="left"
		@submit.native.prevent
	>
		<div class="info-item-wrap">
			<el-form-item label="Title" prop="title" size="mini">
				<el-input
					v-model="form.title"
					size="mini"
					type="textarea"
					placeholder="Please enter a title."
					:autosize="{ minRows: 1, maxRows: 4 }"
				/>
			</el-form-item>
			<el-form-item label="Description" prop="description" size="mini">
				<el-input v-model="form.description" type="textarea" :rows="2" size="mini" />
			</el-form-item>
			<!--			<el-form-item label="Tags" size="mini">-->
			<!--				<div class="tag-list">-->
			<!--					&lt;!&ndash;                    <el-tooltip content="The default tag.">&ndash;&gt;-->
			<!--					&lt;!&ndash;                        <el-tag class="tag"&ndash;&gt;-->
			<!--					&lt;!&ndash;                                size="medium"&ndash;&gt;-->
			<!--					&lt;!&ndash;                                effect="dark"&ndash;&gt;-->
			<!--					&lt;!&ndash;                                disable-transitions&ndash;&gt;-->
			<!--					&lt;!&ndash;                                type="success">{{id}}&ndash;&gt;-->
			<!--					&lt;!&ndash;                        </el-tag>&ndash;&gt;-->
			<!--					&lt;!&ndash;                    </el-tooltip>&ndash;&gt;-->
			<!--					<el-tag-->
			<!--						v-for="(tag, i) in tags"-->
			<!--						:key="i"-->
			<!--						class="tag"-->
			<!--						closable-->
			<!--						size="medium"-->
			<!--						effect="dark"-->
			<!--						disable-transitions-->
			<!--						@close="deleteTag(tag)"-->
			<!--						>{{ tag }}-->
			<!--					</el-tag>-->
			<!--					<el-input-->
			<!--						v-if="tagsInputVisible"-->
			<!--						v-model="newTag"-->
			<!--						class="new-tag-input"-->
			<!--						ref="tagInput"-->
			<!--						size="mini"-->
			<!--						style="width: 100px;"-->
			<!--						@keyup.enter.native="addTag"-->
			<!--						@blur="addTag"-->
			<!--					/>-->
			<!--					<el-button-->
			<!--						v-else-->
			<!--						class="new-tag-btn"-->
			<!--						:disabled="form.tags.length > 10"-->
			<!--						size="mini"-->
			<!--						icon="el-icon-plus"-->
			<!--						@click="showInput"-->
			<!--					>-->
			<!--					</el-button>-->
			<!--				</div>-->
			<!--			</el-form-item>-->
		</div>
	</el-form>
</template>

<script>
export default {
	name: 'general-form',
	props: {
		form: {
			type: Object,
			default: () => ({
				title: null,
				description: null,
				// tags: [],
			}),
		},
	},
	data() {
		return {
			// tags: [],
			// newTag: null,
			tagsInputVisible: false,
		};
	},
	created() {
		// this.tags = this.form.tags;
	},
	watch: {},
	methods: {
		// deleteTag(tag) {
		// 	const tags = this.tags;
		// 	const index = tags.findIndex(t => t === tag);
		//
		// 	tags.splice(index, 1);
		// },
		// addTag() {
		// 	const tags = this.tags;
		//
		// 	if (!tags.includes(this.newTag) && this.newTag) tags.push(this.newTag);
		//
		// 	this.tagsInputVisible = false;
		// 	this.newTag = null;
		// },
		// showInput() {
		// 	this.tagsInputVisible = true;
		// 	this.$nextTick(() => {
		// 		this.$refs.tagInput.$refs.input.focus();
		// 	});
		// },
	},
};
</script>

<style lang="scss" scoped>
.tag-list {
	@include flex-align($a: center, $w: wrap);

	.tag,
	.new-tag-input,
	.new-tag-btn {
		margin: 0 5px 5px 0;
	}
}

.info-area {
	@include flex-align($a: center);
	padding: 4px 8px;
	/*flex: 1;*/

	.info-item-wrap {
		flex: 1;
	}

	.checkbox-group-wrap {
		@include flex-align($d: column);
		padding-left: 4px;
	}

	.checkbox-group {
		margin-left: -30%;
		width: 130%;

		.el-checkbox {
			width: calc(50% - 30px);
		}
	}
}
</style>
