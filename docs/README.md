# Introduction

This package aims to provide a standard, flexible and reusable, fully configurable and customizable backend-agnostic administrative interface solution. It is also complete enough to be used out-of-the-box.

Admin panel is an SPA based on Vue.js so almost everything is a Vue component. Obviously, you should be familiar with Vue.js to customize it.

Some fundamental concepts:
* All application entities/models/whatever data should be provided by an application server API. That includes main navigation, data fields configuration, filtering and ordering capabilities, permissions, etc.
* Any Vue components such as fields, modal windows, pages can be replaced by their customized versions or extended with additional custom components made from scratch or based on default ones.
* Custom components are implicitly included to a bundle if following conventions. These conventions are described in the [customization section](customization/README.md).