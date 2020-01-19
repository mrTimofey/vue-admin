<script>
	import { mapGetters } from 'vuex';
	import { authenticate } from 'src/http';
	import { httpErrorModalData } from 'src/utils';

	// noinspection JSUnusedGlobalSymbols
	export default {
		name: 'LoginForm',
		data: () => ({
			form: {
				login: '',
				password: '',
				remember: true,
			},
			error: '',
			loading: false,
		}),
		computed: {
			...mapGetters(['logoTitle']),
		},
		methods: {
			login() {
				this.loading = true;
				authenticate(this.form.login, this.form.password, this.form.remember)
					.then(res => {
						this.$emit('done', res.data.user);
					})
					.catch(err => {
						this.error = err.response ? err.response.status : 500;
						if (process.env.NODE_ENV !== 'production' && this.error === 500)
							this.$modal.open('error', httpErrorModalData(err));
					})
					.then(() => {
						this.loading = false;
					});
			},
		},
	};
</script>
<template lang="pug">
	.login-box
		.login-logo(v-html="logoTitle" style="color:white")
		.login-box-body
			p.login-box-msg
				span.text-danger(v-if="error === 400") {{ $t('errors.login') }}
				span.text-danger(v-else-if="error") {{ $t('httpCodes.' + error) }}
				span(v-else) {{ $t('authenticateMessage') }}
			form(@submit.prevent="login()")
				.form-group.has-feedback
					input.form-control(:placeholder="$t('login')" v-model="form.login")
				.form-group.has-feedback
					input.form-control(type="password" :placeholder="$t('password')" v-model="form.password")
				field(type="checkbox" v-model="form.remember" :label="$t('rememberMe')")
				.row
					.col-xs-4
						button.btn.btn-primary.btn-block.btn-flat(type='submit' v-bind:class="{disabled: loading}") {{ $t('login') }}

</template>