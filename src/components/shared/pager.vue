<script>
	function range(from, to) {
		let res = [];
		for (let i = from; i <= to; ++i) res.push(i);
		return res;
	}

	export default {
		name: 'Pager',
		props: {
			page: {
				type: Number,
				required: true
			},
			lastPage: {
				type: Number,
				required: true
			},
			loading: {
				type: Boolean,
				default: false
			}
		},
		model: {
			prop: 'page',
			event: 'input'
		},
		computed: {
			noWindow() {
				return this.lastPage < 8;
			},
			leftWindow() {
				if (this.page >= 5) return [1];
				return false;
			},
			currentWindow() {
				if (this.page < 3) return range(1, 3);
				else if (this.page < 5) return range(1, this.page + 1);
				else if (this.page > this.lastPage - 2) return range(this.lastPage - 2, this.lastPage);
				else if (this.page > this.lastPage - 4) return range(this.page - 1, this.lastPage);
				else return range(this.page - 1, this.page + 1);
			},
			rightWindow() {
				if (this.page <= this.lastPage - 4) return [this.lastPage];
				return false;
			},
			hrefPrefix() {
				const href = (this.$router.options.base ? this.$router.options.base : '') +
					this.$route.fullPath.replace(/([?&])page=[0-9]+&?/, '$1');
				if (href.endsWith('&') || href.endsWith('?')) return href;
				if (href.indexOf('?') === -1) return href + '?';
				return href + '&';
			}
		},
		methods: {
			change(page) {
				if (!this.loading) {
					this.$emit('change', { page, href: this.href(page) });
					this.$emit('input', page);
				}
			},
			href(page) {
				return page > 1 ? (this.hrefPrefix + 'page=' + page) : this.hrefPrefix.slice(0, -1);
			}
		}
	};
</script>
<template lang="pug">
	nav(':class'="{ loading }" v-if="lastPage > 1")
		ul.pagination.hidden-xs
			li(':class'!="{ disabled: page === 1 }")
				a(@click.prevent="change(page - 1)" v-if!="page > 1" ':href'="href(page - 1)") &laquo;
				span(v-else) &laquo;
			template(v-if!="noWindow")
				li(v-for="i in lastPage" ':class'="{ active: page === i }")
					span(v-if="i === page") {{ i }}
					a(v-else @click.prevent="change(i)" ':href'="href(i)") {{ i }}
			template(v-else)
				template(v-if="leftWindow")
					li(v-for="i in leftWindow" ':class'="{ active: page === i }")
						span(v-if="i === page") {{ i }}
						a(v-else @click.prevent="change(i)" ':href'="href(i)") {{ i }}
					li.dots: span ...
				li(v-for="i in currentWindow" ':class'="{ active: page === i }")
					span(v-if="i === page") {{ i }}
					a(v-else @click.prevent="change(i)" ':href'="href(i)") {{ i }}
				template(v-if="rightWindow")
					li.dots: span ...
					li(v-for="i in rightWindow" ':class'="{ active: page === i }")
						span(v-if="i === page") {{ i }}
						a(v-else @click.prevent="change(i)" ':href'="href(i)") {{ i }}
			li(':class'!="{ disabled: page === lastPage }")
				a(@click.prevent="change(page + 1)" v-if="page !== lastPage" ':href'="href(page + 1)") &raquo;
				span(v-else) &raquo;
		ul.pager.visible-xs
			li.previous(':class'!="{ disabled: page === 1 }")
				a(@click.prevent="change(page - 1)" v-if!="page > 1" ':href'="href(page - 1)") &laquo;
				span(v-else) &laquo;
			li.pager-stats: span {{ page }} / {{ lastPage }}
			li.next(':class'!="{ disabled: page === lastPage }")
				a(@click.prevent="change(page + 1)" v-if="page !== lastPage" ':href'="href(page + 1)") &raquo;
				span(v-else) &raquo;
</template>
<style lang="stylus">
	.pagination
		> li.dots span
			pointer-events none
			cursor default
			color rgba(black, 0.3)
</style>