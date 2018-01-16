# Customization

You can customize anything in this package by following same file structure as package's one. Webpack will try to resolve customized files first so you can just "replace" any default source file.

Package structure:

* `config.default.js` - default configuration file (see [configuration](configuration.md) section for more information)
* `webpack.config.js` - Webpack configuration file
* `index.js` - dev server entry
* `src` - admin panel sources
    * `components` - all reusable components
        * `entity` - components exposed within entity page components as `Entity{ComponentFileName}`
        * `fields` - fields, usable as a `Field` component with type set to field component file name (`<field type="field-name"></field>`)
        * `modals` - modal components, can be used from any component `this.$modal.open('modal-name', { /* props */ })`, `this.$modal.close()`
        * `shared` - components registered globally `Vue.component('file-name', component)`
    * `filters` - Vue.js filters
    * `directives` - Vue.js directives
    * `lang` - translations
    * `pages` - route components
    * `app.vue` - application root component
    * `entry.js` - application entry file
    * `http.js` - http service ([Axios](https://github.com/axios/axios))
    * `i18n.js` - translation plugin config ([vue-i18n](https://github.com/kazupon/vue-i18n))
    * `router.js` - vue-router config
    * `store.js` - vuex config
    * `shared.styl` - shared stylus variables
    * `layout.pug` - application layout template

Use cases and examples:

* Add some HTTP headers to a standard `http.js`:
    ```javascript
    // admin/src/http.js
    
    import http from 'vue-admin-front/http'
    
    http.defaults.headers['X-Custon-Header'] = 'Value';
    
    export default http;
    ```
* Add custom page:
    ```html
    <!-- admin/src/pages/custom-page.vue -->
    <script> export default {} </script>
    <template lang="pug">
        .custom-page
            h1 My custom page
            p URL: /admin/custom-page
    </template>
    <style lang="stylus">
        .custom-page
            background blue
    </style>
    ```
* Add global component:
    ```html
    <!-- admin/src/components/shared/my/component.vue -->
    <script> export default {} </script>
    <template lang="pug">
        .my-component
            p My component is accessible everywhere as my-component
    </template>
    <style lang="stylus">
        .my-component
            background blue
    </style>
    ```