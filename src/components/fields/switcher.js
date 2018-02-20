import Base from './checkbox.vue';

export default {
	extends: Base,
	methods: {
		emitValue({ target }) {
			this.$emit('input', target.checked ? true : null);
		}
	}
};
