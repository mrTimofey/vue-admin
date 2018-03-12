# Customization overview

You can customize anything in this package by following same file structure as the package's one. Webpack will try to resolve customized files first so you can just "replace" any default source file.

Just import original module from `vue-admin-front/src` if you want to extend its functionality.

Package structure:

* `config.default.js` - default configuration file (see [configuration](/configuration.md) section for more information)
* `webpack.config.js` - Webpack configuration file (set `webpackConfigModifier` option in your custom config to extend default config)
* `index.js` - dev server entry, exports Express application instance to a `module.exports`
* `src` - admin panel sources
    * `components` - all reusable components should be here
    	* `app` - application layout components
    		* `logo.vue` - top-left corner logotype
    		* `sidebar-menu.vue` and `sidebar-menu-item.vue` - sidebar main navigation (better do not touch it: these components strongly depend on configuration fetched from a server API and they are not designed to be customized by any other way)
    		* `sidebar-user.vue` - current user and logout button
		* `displays` - display components, usable as a `Display` component with `type` prop set to a display component file name (`<display type="field-name"></display>`), [read more here](custom-displays.md)
        * `entity` - components exposed within all entity page components as `Entity{FileName}`
        * `fields` - fields, usable as a `Field` component with `type` prop set to a field component file name (`<field type="field-name"></field>`), [read more here](custom-fields.md)
        * `modals` - modal components, can be used within any component as `this.$modal.open('modal-name', props)`, `this.$modal.close()`, [read more here](custom-modal-windows.md)
        * `shared` - components registered globally via `Vue.component('file-name', component)`
    * `filters` - Vue.js filters, registered globally via `Vue.filter('file-name', filter)`
    * `directives` - Vue.js directives, registered globally via `Vue.directive('file-name', directive)`
    * `lang` - translations, files named `{lang}.js` (`en` and `ru` are supported by default, see [vue-i18n](https://github.com/kazupon/vue-i18n) for more information); you can add your custom translations based on default ones to provide different languages support
    * `pages` - route components, each file here will be pointed to the corresponding route same as its file name (excluding files and folders starting with underscore `_`)
        * `entities` - entity pages, create folder to extend or replace default pages
            * `_generic` - default entity page components (mind the underscore `_` - this folder's routes are registered explicitly in `router.js`; you can copy this folder with a name of your entity to fully replace default pages with custom ones), [read more here](extending-entity-pages.md)
                * `index.vue` - entity list
                * `item.vue` - entity create/edit form
                * `bulk-update.vue` - entity bulk update
	* `styles`
		* `skins` - there you can add your custom AdminLTE skin style, just create a file and set a `skin` field in `initial-state.js` same as a file name
		* `admin-lte.less` - [AdminLTE](https://adminlte.io) style imports (rewriting is not recommended, but you can change AdminLTE or Bootstrap variables in `variables.less`)
		* `bootstrap.less` - [Bootstrap 3](https://getbootstrap.com/docs/3.3/) style imports (rewriting is not recommended, but you can change AdminLTE or Bootstrap variables in `variables.less`)
		* `variables.less` - LESS variables for AdminLTE and Bootstrap 3, there you can completely or partially redefine default values
		* `shared.styl` - shared stylus variables included everywhere, [read more here](global-style-variables.md)
		* `wysiwyg.styl` - WYSIWYG ([CKEditor](https://ckeditor.com/)) field default styles (keep in mind that it is highly recommended to provide a CSS file generated from your frontend styles and [passed with API meta data](/server-api-prerequisities.md) or as a [WYSIWYG field prop](/fields.md#wysiwyg))
    * `app.vue` - application root component
    * `entry.js` - application entry file
    * `http.js` - configured, ready-to-use http service ([Axios](https://github.com/axios/axios))
    * `i18n.js` - translation plugin config ([vue-i18n](https://github.com/kazupon/vue-i18n))
    * `initial-state.js` - exports initial Vuex store state (you can change such things as a page title and AdminLTE skin here)
    * `router.js` - [vue-router](https://github.com/vuejs/vue-router) config
    * `store.js` - [vuex](https://github.com/vuejs/vuex) store config
    * `layout.pug` - application layout template
    * `ckeditor-config.js` - [CKEditor](https://ckeditor.com/) 4 configuration

## Use cases and examples

* Add some HTTP headers to a standard `http.js`:
    ```javascript
    // admin/src/http.js
    
    import http from 'vue-admin-front/src/http';
    http.defaults.headers['X-Custom-Header'] = 'Value';
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
* Extend default `en` translation
    ```javascript
    // admin/src/lang/en.js
    
    import lang from 'vue-admin-front/src/lang/en';
    lang.messages.myMessage = 'My message';
    export default lang;
    ```
* Create custom users create/edit form page
    ```html
    <!--
        Completely replace original component
        admin/src/pages/entity/users/item.vue
    -->
    <script>
        export default {
            routePath: ':id'
        };
    </script>
    <template lang="pug">
        .user-edit-page
            p Your are not welcome here
    </template>
    <style lang="stylus">
        .user-edit-page
            font-size 80px
            p
                text-align center
    </style>    
    ```
    
    ```javascript
    // Add some functionality provided by original component
    // admin/src/pages/entity/users/item.vue
    
    import baseComponent from 'src/pages/entity/_generic/item.vue';
    
    export default {
        routePath: ':id',
        extends: baseComponent,
        computed: {
            // hide some fields if user is not admin
            hiddenFields() {
                if (this.item.role !== 'admin') return ['only_for_admin'];
            }
        }
    };
    ```