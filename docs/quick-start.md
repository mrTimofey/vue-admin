# Quick start

1. Install the package:
    
    ```bash
    npm i -S vue-admin-front cross-env rimraf
    ```

2. Add npm scripts to your `package.json`:

    ```json
    {
        "scripts": {
            "admin:dev": "node node_modules/vue-admin-front/index.js",
            "admin:build": "rimraf public/admin-dist && cross-env NODE_ENV=production webpack --config node_modules/vue-admin-front/webpack.config.js --progress --hide-modules"
        }
    }
    ```

    \**Replace `admin:dev`'s `rimraf public/admin-dist` part if you use different build destination.*
    \**Replace `admin:build`'s `node_modules/vue-admin-front/webpack.config.js` if you have an extended version of a Webpack config.*

3. [Configure](configuration.md).

4. Run `npm run admin:dev` to start dev server listening on port 8080 (by default).
Run `npm run admin:build` to create a static bundle in `public/admin-dist` folder (by default).

5. Install and configure one of the [supported server API solutions or make your own one](server-api-prerequisities.md).