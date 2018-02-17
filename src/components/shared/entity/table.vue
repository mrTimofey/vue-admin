<script>
	import makeTitle from 'src/filters/title';

	export default {
		name: 'EntityTable',
		props: {
			items: Array,
			fields: Array,
			permissions: {
				type: Object,
				default: () => ({
					destroy: false,
					update: false
				})
			},
			sortable: {
				type: Boolean,
				default: false
			},
			bulk: {
				type: Boolean,
				default: false
			},
			entity: String,
			primaryKey: {
				type: String,
				default: 'id'
			},
			hasItemActions: {
				type: Boolean,
				default: false
			},
			hasBulkActions: {
				type: Boolean,
				default: false
			},
			sortParams: Object
		},
		data: () => ({
			selection: []
		}),
		computed: {
			path() {
				return '/entity/' + this.entity;
			},
			columns() {
				if (this.fields) return this.fields.filter(field => field.type !== 'hidden').map(this.makeField);
				return this.items[0] && Object.keys(this.items[0]).map(this.makeField);
			},
			sorted() {
				const sort = [];
				if (this.sortParams) {
					for (let field of Object.keys(this.sortParams)) {
						let dir = this.sortParams[field];
						sort.push({
							field,
							dir: dir === '1' || dir === 'asc'
						});
					}
				}
				return sort;
			},
			showItemActions() {
				return this.hasItemActions || this.permitted('update') || this.permitted('destroy');
			},
			showBulkActions() {
				return this.bulk && (this.hasBulkActions || this.permitted('update') || this.permitted('destroy'));
			},
			colspan() {
				return (this.columns && this.columns.length || 0) +
					(this.showItemActions ? 1 : 0) +
					(this.showBulkActions ? 1 : 0);
			},
			allSelected: {
				get() {
					return this.selection.length === this.items.length;
				},
				set(v) {
					this.selection = v ? this.items.map(item => item[this.primaryKey]) : [];
				}
			}
		},
		watch: {
			items() {
				this.selection = [];
			}
		},
		methods: {
			makeField(definition) {
				if (typeof definition === 'string') definition = {
					name: definition,
					sortable: this.sortable,
					editable: false
				};

				let sort = null;
				if (this.sortable && (definition.sortable || definition.sortableAs)) {
					const as = definition.sortableAs || definition.name,
						sortedIndex = this.sorted.findIndex(item => item.field === as);
					sort = {
						as,
						index: (this.sorted.length > 1 && sortedIndex > -1) ? sortedIndex : null,
						dir: sortedIndex > -1 ? this.sorted[sortedIndex].dir : null
					};
				}

				return {
					...definition,
					name: definition.name,
					title: definition.title || makeTitle(definition.name),
					sort
				};
			},
			sort(field, exclusive) {
				if (!this.sortable) return;

				const query = this.sortParams ? { ...this.sortParams } : {},
					key = field.sortableAs || field.name;

				let dir = null;
				if (!query[key]) dir = 'asc';
				else if (query[key] === 'asc') dir = 'desc';

				if (exclusive) {
					this.$emit('update:sortParams', dir ? { [key]: dir } : null);
				}
				else {
					if (dir === null) delete query[key];
					else query[key] = dir;
					this.$emit('update:sortParams', query);
				}
			},
			permitted(action) {
				return !this.permissions || this.permissions[action] !== false;
			},
			itemKey(item, i) {
				return this.entity + '-item-' + (item[this.primaryKey] || i);
			},
			fieldKey(item, i, field) {
				return this.itemKey(item, i) + '-' + field.name.split('_').join('-');
			},
			emitBulkAction(name) {
				this.$emit('bulk-' + name, this.selection);
			}
		}
	};
</script>
<template lang="pug">
	table.table.entity-table.table-bordered(v-if="items && items.length")
		thead: tr
			th.item-bulk-cell(v-if="showBulkActions"): label.styled-checkbox
				input(type="checkbox" v-model="allSelected")
				.styled-checkbox-indicator
			th(v-for="field in columns"
				':class'="{ sortable: field.sort, asc: field.sort && field.sort.dir === true, desc: field.sort && field.sort.dir === false, ['item-cell-' + field.name.replace('_', '-')]: true }"
				'@click'="field.sort && sort(field, !$event.shiftKey)")
				slot(':name'="'header-' + field.name.replace('_', '-')" ':field'="field")
					span!='{{ field.title }} '
				small.sort-num(v-if="field.sort && field.sort.index !== null") {{ field.sort.index + 1 }}
			th.table-item-actions(v-if="showItemActions")
		tbody: tr(v-for="(item, i) in items"
			':class'="{ selected: selection.indexOf(item[primaryKey]) > -1 }"
			':key'="itemKey(item, i)"
			':id'="itemKey(item, i)")
			td.item-bulk-cell(v-if="showBulkActions"): label.styled-checkbox
				input(type="checkbox" ':value'="item[primaryKey]" v-model="selection")
				.styled-checkbox-indicator
			td(v-for="field in columns"
				':class'="'item-cell-' + field.name.split('_').join('-')"
				':key'="fieldKey(item, i, field)"
				':id'="fieldKey(item, i, field)")
				slot(':name'="'item-cell-' + field.name.replace('_', '-')" ':item'="item" ':index'="i" ':field'="field")
					field(v-if="field.editable && permitted('update')"
						v-bind="field"
						':value'="item[field.name]"
						title=""
						'@input'="$emit('update', item, field.name, $event)")
					display(v-else ':value'="item[field.name]" v-bind="field")
			td.table-item-actions(v-if="showItemActions")
				.btn-group.btn-group-xs.nowrap
					slot(name="item-actions-before" ':item'="item" ':index'="i")
					router-link.btn.btn-primary(v-if="permitted('update')" ':to'="path + '/item/' + item[primaryKey]")
						i.fa.fa-pencil
					.btn.btn-danger(v-if="permitted('destroy')" '@click'="$emit('destroy', item)")
						i.fa.fa-trash
					slot(name="item-actions-after" ':item'="item" ':index'="i")
		tfoot.bulk-actions(v-if="showBulkActions && selection.length"): tr: td(':colspan'="colspan")
			.btn-group.btn-group-xs
				slot(name="bulk-actions-before" ':selection'="selection")
				//- TODO
				//- router-link.btn.btn-primary(v-if="permitted('update')" ':to'="{ path: path + '/bulk-update', query: { keys: selection } }")
					i.fa.fa-pencil
				.btn.btn-danger(v-if="permitted('destroy')" '@click'="emitBulkAction('destroy')")
					i.fa.fa-trash
				slot(name="bulk-actions-after" ':selection'="selection")
</template>
<style lang="stylus">
	.entity-table
		th.sortable
			user-select none
			padding-right 30px
			cursor pointer
			position relative
			&:after
				content '\e150'
				display block
				absolute false 8px 7px false
				line-height 20px
				font-family 'Glyphicons Halflings'
				opacity 0.25
				color $c-dark-grey
			&.asc:after
				content '\e155'
				opacity 1
			&.desc:after
				content '\e156'
				opacity 1
			&:hover:after
				color $c-black
		tr.selected
			background #fafafa
		.item-cell-id
			width 50px
		.item-cell-sort, .item-cell-order
			width 60px
		.item-bulk-cell
			width 20px
			label
				display block
				size 20px
				line-height 20px
				padding 0
				.styled-checkbox-indicator
					top 0
		.table-item-actions
			width 10px
			padding 7px
		.bulk-actions, .table-item-actions
			.btn
				min-width 23px

		.sort-num
			absolute false 2px 23px false
			font-size 9px
		td > .form-group
			margin-bottom 0
</style>