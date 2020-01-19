function classArray(input) {
	if (!input) return [];
	if (Array.isArray(input)) return input;
	// noinspection JSCheckFunctionSignatures
	return input.toString().split(' ').filter(s => s);
}

function closeOnEscape(vm) {
	const onEscape = e => {
		if (e.keyCode === 27 || e.key === 'Escape' || e.key === 'Esc') {
			window.removeEventListener('keydown', onEscape);
			vm.close();
		}
	};
	window.addEventListener('keydown', onEscape);
}

export default {
	props: {
		tag: String,
		innerTag: {
			type: String,
			default: 'div',
		},
		innerClass: {
			type: [String, Array],
			default: 'inner',
		},
	},
	data: () => ({
		comp: null,
		compProps: null,
		compClass: null,
	}),
	computed: {
		innerClassArray() {
			return classArray(this.innerClass).concat(classArray(this.compClass));
		},
	},
	methods: {
		openModal(comp, compProps, compClass) {
			if (!comp) throw new Error('Vue modal plugin: trying to open modal without component name');
			const data = { comp, compProps, compClass };
			this.$emit('before-open', data);
			this.$nextTick(() => {
				Object.keys(data).forEach(k => { this.$data[k] = data[k]; });
				this.$emit('opened', data);
				closeOnEscape(this);
			});
			return new Promise(resolve => { this.$once('closed', resolve); });
		},
		close(result = null) {
			this.$emit('before-close', this.$data);
			this.$nextTick(() => {
				this.comp = null;
				this.compProps = null;
				this.compClass = null;
				this.$emit('closed', result);
			});
		},
	},
	created() {
		this.$modal.masterComponent = this;
	},
	render(h) {
		return this.comp && h(
			this.tag || this.$vnode.data.tag || 'div',
			{ on: {
				click: e => {
					const target = e.target || e.srcElement;
					if (this.$el !== target && this.$el.contains(target)) return;
					this.close();
				},
			} },
			[
				this.$slots.before,
				h(
					this.innerTag,
					{
						class: this.innerClassArray,
					},
					[
						this.$slots.innerBefore,
						// show modal component itself
						h(this.comp, { props: this.compProps }, this.$slots.default),
						this.$slots.innerAfter,
					]
				),
				this.$slots.after,
			]
		);
	},
	components: {},
};
