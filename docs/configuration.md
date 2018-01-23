# Configuration

You can create a custom configuration file `vue-admin-front.config.js` within your project home directory to extend or replace default values.

```javascript
// vue-admin-front.config.js

// require default configuration
const base = require('vue-admin-front/config.default');

module.exports = {
    ...base,
    { /* your configuration is here */ }
};

// OR

module.exports = Object.assign(base, {
    /* your configuration is here */
});
```

All options and their descriptions are available in the [default configuration file](https://github.com/mrTimofey/vue-admin/blob/master/config.default.js) itself.

## Webpack

Default webpack configuration `webpack.config.js` ([here](https://github.com/mrTimofey/vue-admin/blob/master/webpack.config.js)) supports the following assets:
* JS sources (with [buble-loader](https://github.com/sairion/buble-loader))
* [Pug templates](https://pugjs.org)
* [Vue.js single file components](https://vuejs.org/v2/guide/single-file-components.html)
* Font files (woff, woff2, eot, otf, ttf)
* Images (jpg, png, gif, svg)
* Documents (pdf, doc[x], ppt[x], rtf, txt)
* CSS
* [Stylus](http://stylus-lang.com)

See `webpackConfigModifier` in the [default configuration](https://github.com/mrTimofey/vue-admin/blob/master/config.default.js) if you want to extend default Webpack configuration.