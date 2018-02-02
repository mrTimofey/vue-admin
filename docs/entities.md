# Entities

All stuff you can edit, create, overview, delete and whatever else you want to do is called **entity**. That includes users, posts, categories, tags, products, etc. Meta-data about each entity should be fetched from a server API and contains the following:
* Entity name used as a prefix for routes and API calls (examples: `posts`, `users`, `user-roles`)
* Primary key field name
* Titles for each type of entity pages (index, create and edit)
* Index fields config
* Filter fields config
* Create/edit fields config
* Permissions

Refer to [Server API prerequisities section](server-api-prerequisities.md) for more information.

## Entity pages

Each entity section consists of these pages:
* **Entity index** page shows a table with entity items. Each column represents a specified entity field. Supported features are: entity item deleting, bulk deleting, inline field editing, different display formats, filters, ordering. You can customize entity index page by extending default component from `src/pages/entities/_generic/index.vue` in `src/pages/entities/**entity-name**/index.[vue|js]`.
* **Entity create/edit form** page shows a create/edit form with configured fields. Each field has a specified type, entity field name and other properties defined by a particular field type. All available out-of-the-box field types are listed in the [available field types section](fields.md#available-field-types). You can customize form itself by extending default entity form component from `src/pages/entities/_generic/item.vue` in `src/pages/entities/**entity-name**/item.[vue|js]`.

See [extending entity pages section](customization/extending-entity-pages.md) for more information about customization.