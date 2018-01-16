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

All options and their desciptions are available in the [default configuration file](https://github.com/mrTimofey/vue-admin/blob/master/config.default.js) itself.