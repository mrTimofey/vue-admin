# HTTP requests

Just see the code:

```javascript
/**
 * The Axios instance configured with a server API prefix from config as a base path.
 * Headers:
 *     X-Requested-With: XMLHttpRequest
 *     Accept: application/json
 *     Authorization: Bearer {api token}
 * @see https://github.com/axios/axios
 */
import http from `vue-admin-front/src/http`;

http.get('url')
    .then(res => res.data)
    .catch(err => err.response.status);

http.post('url', { /** post data */ });
http.delete('url');
```