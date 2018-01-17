# Customization overview

You can customize anything in this package by following same file structure as the package's one. Webpack will try to resolve customized files first so you can just "replace" any default source file.

Just import original module from `vue-admin-front/src` if you want to extend its functionality.

Package structure:

* `config.default.js` - default configuration file (see [configuration](configuration.md) section for more information)
* `webpack.config.js` - Webpack configuration file (use `webpackConfigModifier` configuration option in [default configuration file](https://github.com/mrTimofey/vue-admin/blob/master/config.default.js) to extend dafult Wepback config)
* `index.js` - dev server entry, exports Express application instance to a `module.exports`
* `src` - admin panel sources
    * `components` - all reusable components should be here
        * `entity` - components exposed within all entity page components as `Entity{FileName}`
        * `fields` - fields, usable as a `Field` component with a type prop set to field component file name (`<field type="field-name"></field>`)
        * `modals` - modal components, can be used from any component `this.$modal.open('modal-name', props)`, `this.$modal.close()`
        * `shared` - components registered globally via `Vue.component('file-name', component)`
        * `sidebar-menu.vue` and `sidebar-menu-item.vue` - sidebar main navigation (better do not touch it :) this components strongly depend on configuration fetched from a server API and they are not designed to be customized by any other way)
    * `filters` - Vue.js filters, registered globally via `Vue.filter('file-name', filter)`
    * `directives` - Vue.js directives, registered globally via `Vue.directive('file-name', directive)`
    * `lang` - translations, files named `{lang}.js` (`en` and `ru` are supported by default, see [vue-i18n](https://github.com/kazupon/vue-i18n) for more information)
    * `pages` - route components, each file here will be pointed to the corresponding route same as its file name (excluding files and folders starting with undescore `_`)
        * `entities` - entity pages, create folder to extend or replace default pages
            * `_generic` - default entity page components (mind `_` - these routes are registered explicitly in `router.js`; you can copy this folder with a name of your entity to fully replace default pages with custom ones)
                * `index.vue` - entity list
                * `item.vue` - entity create/edit form
                * `bulk-update.vue` - entity bulk update
    * `app.vue` - application root component
    * `entry.js` - application entry file
    * `http.js` - http service ([Axios](https://github.com/axios/axios))
    * `i18n.js` - translation plugin config ([vue-i18n](https://github.com/kazupon/vue-i18n))
    * `router.js` - vue-router config
    * `store.js` - vuex config
    * `shared.styl` - shared stylus variables
    * `layout.pug` - application layout template
    * `ckeditor-config.js` - CKEditor configuration

Use cases and examples:

* Add some HTTP headers to a standard `http.js`:
    ```javascript
    // admin/src/http.js
    
    import http from 'vue-admin-front/http';
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
    
    import baseComponent from 'vue-admin-front/src/pages/entity/_generic/item.vue';
    
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