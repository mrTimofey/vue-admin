# Global style variables

Just create `admin/src/styles/shared.styl` file and define your stuff here.
Note that this file does not suppress the original [`vue-admin-front/src/styles/shared.styl`](https://github.com/mrTimofey/vue-admin/blob/master/src/shared.styl) so you do not need to import it manually.
Both files will be included in every component style or a standalone stylus file.

**Do not add any styles or other code producing side effects here!**
`shared.styl` is only for shared variables and mixins.