<script>
	import { initGoogleMaps } from 'src/utils';

	function pointToObj(p) {
		return { lat: p[0], lng: p[1] };
	}

	export default {
		props: {
			title: null,
			zoom: {
				type: Number,
				default: 1
			},
			center: {
				type: Array,
				default: () => [0, 0]
			},
			height: {
				type: [Number, String],
				default: 400
			},
			value: null,
			disabled: {
				type: Boolean,
				default: false
			},
			staggerSearch: {
				type: Number,
				default: 300
			}
		},
		data: () => ({
			apiLoaded: false,
			noApiKey: false
		}),
		computed: {
			valuePoint() {
				const src = this.value && this.value.point || this.center;
				return [src[0], src[1]];
			},
			valueZoom() {
				return this.value && this.value.zoom >= 0 ? this.value.zoom : this.zoom;
			},
			heightWithUnit() {
				return typeof this.height === 'string' ? this.height : (this.height + 'px');
			}
		},
		methods: {
			emitValue(obj) {
				if (!this.value && !obj.point) return;
				this.$emit('input', {
					zoom: obj.zoom || this.gmap.getZoom(),
					point: obj.point || this.valuePoint
				});
			},
			clearValue() {
				this.$emit('input', null);
			},
			onClick({ latLng }) {
				this.searchResults = null;
				this.emitValue({ point: [latLng.lat(), latLng.lng()] });
			},
			onZoomChange() {
				this.emitValue({ zoom: this.gmap.getZoom() });
			},
			init() {
				this.apiLoaded = true;
				this.gmap = new google.maps.Map(this.$refs.map, {
					zoom: this.valueZoom,
					center: pointToObj(this.valuePoint)
				});
				this.gmap.addListener('click', this.onClick);
				this.gmap.addListener('zoom_changed', this.onZoomChange);
				this.updatePoint();
				this.initSearch();
			},
			initSearch() {
				const search = new google.maps.places.Autocomplete(this.$refs.searchInput);
				search.bindTo('bounds', this.gmap);
				search.addListener('place_changed', () => {
					const place = search.getPlace();
					if (!place.geometry) return;
					if (place.geometry.viewport) {
						this.gmap.fitBounds(place.geometry.viewport);
					}
					if (place.geometry.location) {
						this.gmap.setCenter(place.geometry.location);
						this.emitValue({
							zoom: this.gmap.getZoom(),
							point: [place.geometry.location.lat(), place.geometry.location.lng()]
						});
					}
				});
			},
			updatePoint() {
				if (!this.value || !this.value.point) {
					if (this.gmapPoint) {
						this.gmapPoint.setMap(null);
						delete this.gmapPoint;
					}
				}
				else {
					if (!this.gmapPoint) this.gmapPoint = new google.maps.Marker({ map: this.gmap });
					this.gmapPoint.setPosition(pointToObj(this.value.point));
				}
			}
		},
		beforeMount() {
			initGoogleMaps()
				.then(this.init)
				.catch(err => {
					if (err.noApiKey) this.noApiKey = true;
					else throw err;
				});
		},
		watch: {
			value() {
				this.updatePoint();
			}
		}
	};
</script>
<template lang="pug">
	.field-geo-point(':class'="{ disabled }")
		.alert.alert-warning(v-if="noApiKey")
			p {{ $t('map.googleApiKeyWarning') }}
			br
			pre: code.
				// vue-admin-front.config.js
				const base = require('vue-admin/config.default');
				module.exports = {
					...base,
					googleMapsApiKey: 'YOUR_API_KEY'
				};
		template(v-else)
			.map-search
				input.form-control(ref="searchInput")
			.map-wrapper(ref="map" ':style'="{ height: heightWithUnit }")
			.map-stats
				template(v-if="value")
					a.text-danger('@click.prevent'="clearValue")
						i.fa.fa-trash
						!=' '
						b {{ $t('map.removePoint') }}
					!=' | '
					span {{ $t('map.zoom') }}: {{ value.zoom }}, {{ $t('map.coords') }}: [{{ value.point.join(', ') }}]
				span(v-else) {{ $t('map.instructions') }}
</template>
<style lang="stylus">
	.field-geo-point
		.map-search
			margin-bottom 10px
		.map-wrapper
			width 100%
		.map-stats
			padding-top 0.5em
			min-height 30px
		&.disabled
			.map-wrapper
				pointer-events none
				opacity 0.5
</style>