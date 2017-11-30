<script>
	import { mapGetters } from 'vuex';

	function itemHref(item) {
		return item.path || item.route || item.entity && ('/entity/' + item.entity);
	}

	export default {
		name: 'SidebarMenuItem',
		props: {
			item: [String, Object]
		},
		data: () => ({
			expanded: false
		}),
		computed: {
			...mapGetters(['entitiesData']),
			hasActiveItem() {
				return this.item.items && !!this.item.items
					.find(sub => this.$route.path.startsWith(itemHref(sub))) || false;
			},
			href() {
				return itemHref(this.item);
			}
		},
		methods: {
			available(entity, action) {
				return this.entitiesData[entity] &&
					(!this.entitiesData[entity].permissions ||
					this.entitiesData[entity].permissions[action] !== false);
			},
			toggle() {
				this.expanded = !this.expanded;
			}
		},
		created() {
			this.expanded = this.hasActiveItem;
		}
	};
</script>
<template lang="pug">
	li.header(v-if="typeof item === 'string'" v-html="item")
	li(v-else-if="item.path"): a(':href'="href")
		i.fa(v-if="item.fa" ':class'="'fa-' + item.fa")
		!=' '
		span(v-html="item.title")
	router-link(v-else-if="item.route" tag="li" ':to'="href"): a
		i.fa(v-if="item.fa" ':class'="'fa-' + item.fa")
		!=' '
		span(v-html="item.title")
	router-link(v-else-if="item.entity && available(item.entity, 'index')" tag="li" ':to'="href"): a
		i.fa(v-if="item.fa" ':class'="'fa-' + item.fa")
		!=' '
		span(v-html="item.title || entitiesData[item.entity].title || ('[' + $t('undefined') + ']')")
	li.treeview(v-else-if="item.items && item.items.length" ':class'="{ 'menu-open': expanded, active: hasActiveItem }")
		a('@click.prevent'="toggle()" style="cursor:pointer")
			i.fa(v-if="item.fa" ':class'="'fa-' + item.fa")
			!=' '
			span(v-html="item.title")
			!=' '
			span.pull-right-container: i.fa.fa-angle-left.pull-right
		ul.treeview-menu(':style'="{ display: expanded ? 'block' : 'none' }")
			sidebar-menu-item(v-for="(sub, i) in item.items" ':key'="i" ':item'="sub")
</template>