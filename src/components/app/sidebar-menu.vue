<script>
	import { mapGetters } from 'vuex';
	import SidebarMenuItem from './sidebar-menu-item.vue';

	export default {
		components: { SidebarMenuItem },
		computed: {
			...mapGetters(['mainNav'])
		}
	};
</script>
<template lang="pug">
	.sidebar-menu
		sidebar-menu-item(v-for="(item, i) in mainNav" ':key'="i" ':item'="item")
</template>