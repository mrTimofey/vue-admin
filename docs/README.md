# Introduction

[Demo with Laravel 5.6 backend](http://admin.shit-free.space).

This package aims to provide a standard, flexible and reusable, fully configurable and customizable backend-agnostic administrative interface solution. It is also complete enough to be used out-of-the-box.

The admin panel is an SPA based on Vue.js so almost everything is a Vue component. Obviously, you should be familiar with Vue.js to customize it.

Some fundamental concepts:
* All application entities/models/whatever data should be provided by an application server API. That includes main navigation, data fields configuration, filtering and ordering capabilities, permissions, etc.
* Any Vue components such as fields, modal windows, pages can be replaced by their customized versions or extended with additional custom components made from scratch or based on default ones.
* Custom components are implicitly included to a bundle if following conventions. These conventions are described in the [customization section](customization/README.md).

Feel free to [contact me](https://github.com/mrTimofey) or open a GitHub issue in case of:
* You think this package is a piece of shit
* You think this documentation is a piece of shit
* You think my English is a piece of shit (probably you do)
* You found some bugs
* You found some grammatic mistakes
* You can make some improvements
* You want to give me money
* You have an awesome work offer
* You just want to tell me this package is cool
* You just want to tell me that I am cool (but I know that)
* Anything else