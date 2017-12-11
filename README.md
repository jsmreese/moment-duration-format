# Moment Duration Format

**Format plugin for the Moment Duration object.**

This is a plugin to the Moment.js JavaScript date library to add comprehensive formatting to Moment Durations.

Format template grammar is patterned on the existing Moment Date format template grammar, with a few modifications because durations are fundamentally different from dates.

This plugin does not have any dependencies beyond Moment.js itself, and may be used in the browser and in Node.js.

---

## Installation

The plugin depends on moment.js, which is not specified as a package dependency in the currently published version.

**Node.js**

`npm install moment-duration-format`

**Bower**

`bower install moment-duration-format`

**Browser**

`<script src="path/to/moment-duration-format.js"></script>`

---

## Usage

This plugin will always try to install itself on the `root.moment` instance, if it exists.

This plugin will install its setup function to `root.momentDurationFormatSetup` so that it may be later called on any moment instance.

### Browser

When using this plugin in the browser, if you do not include moment.js on your page first, you need to manually call `window.momentDurationFormatSetup` on your moment instance once it is created.

### Module

To use this plugin as a module, use the `require` function.

```javascript
var moment = require("moment");
var momentDurationFormatSetup = require("moment-duration-format");
```

The plugin exports the init function so that duration format can be initialized on other moment instances.

To use this plugin with any other moment.js package, for example `moment-timezone`, manually call the exported setup function to install the plugin into the desired package.

```javascript
var moment = require("moment-timezone");
var momentDurationFormatSetup = require("moment-duration-format");

momentDurationFormatSetup(moment);
typeof moment.duration.fn.format === "function"
// true
```

### Basics

The duration format method can format any moment duration. If no template or other arguments are provided, the default template function will generate a template string based on the duration's value.

```javascript
moment.duration(123, "minutes").format();
// "2:03:00"

moment.duration(123, "months").format();
// "10 years, 3 months"
```

The duration format method may be called with three optional arguments:
```javascript
moment.duration.format([template] [, precision] [, settings])
```

### Template

`template` (string|function) is the string used to create the formatted output, or a function that returns the string to be used as the format template.

```javascript
moment.duration(123, "minutes").format("h:mm");
// "2:03"
```

The template string is parsed for moment token characters, which are replaced with the duration's value for each unit type. The moment tokens are:
```
years:   Y or y
months:  M
weeks:   W or w
days:    D or d
hours:   H or h
minutes: m
seconds: s
ms:      S
```

Escape token characters within the template string using square brackets.
```javascript
moment.duration(123, "minutes").format("h [hrs], m [min]");
// "2 hrs, 3 min"
```

#### Token Length

For some time duration formats, a zero-padded value is required. Use multiple token  characters together to create the correct amount of padding.

```javascript
moment.duration(3661, "seconds").format("h:mm:ss");
// "1:01:01"

moment.duration(15, "seconds").format("sss [s]");
// "015 s"
```

When the format template is trimmed, token length on the largest-magnitude rendered token can be trimmed as well. See sections *trim* and *forceLength* below for more details.

```javascript
moment.duration(123, "seconds").format("h:mm:ss");
// "2:03"
```

Token length of `2` for milliseconds is a special case, most likely used to render milliseconds as part of a timer output, such as `mm:ss:SS`. In this case, the milliseconds value is padded to three digits then truncated from the left to render a two digit output.

```javascript
moment.duration(9, "milliseconds").format("mm:ss:SS", {
     trim: false
});
// "00:00:00"

moment.duration(10, "milliseconds").format("mm:ss:SS", {
     trim: false
});
// "00:00:01"

moment.duration(999, "milliseconds").format("mm:ss:SS", {
     trim: false
});
// "00:00:99"

moment.duration(1011, "milliseconds").format("mm:ss:SS", {
     trim: false
});
// "00:01:01"
```

Tokens can appear multiple times in the format template, but all instances must share the same length. If they do not, all instances will be rendered at the length of the first token of that type.

```javascript
moment.duration(15, "seconds").format("ssss sss ss s");
// "0015 0015 0015 0015"

moment.duration(15, "seconds").format("s ss sss ssss");
// "15 15 15 15"
```

### Precision

`precision` (number) defines the number of decimal fraction or integer digits to display for the final value.

The default precison value is `0`.
```javascript
moment.duration(123, "minutes").format("h [hrs]");
// "2 hrs"
```

Positive precision defines the number of decimal fraction digits to display.
```javascript
moment.duration(123, "minutes").format("h [hrs]", 2);
// "2.05 hrs"
```

Negative precision defines the number of integer digits to truncate to zero.
```javascript
moment.duration(223, "minutes").format("m [min]", -2);
// "200 min"
```

### Settings

`settings` is an object that can override any of the default moment duration format options.

Both the `template` and `precision` arguments may be specified as properties of a single `settings` object argument, or they may be passed separately along with an optional settings object.

```javascript
moment.duration(123, "minutes").format({
    template: "h [hrs]",
    precision: 2
});
// "2.05 hrs"
```

#### trim

The default `trim` value is `"largest"`.

Largest-magnitude tokens are automatically trimmed when they have no value.
```javascript
moment.duration(123, "minutes").format("d[d] h:mm:ss");
// "2:03:00"
```

Trimming also functions when the format string is oriented with token magnitude increasing from left to right.
```javascript
moment.duration(123, "minutes").format("s [seconds], m [minutes], h [hours], d [days]");
// "0 seconds, 3 minutes, 2 hours"
```

To stop trimming altogether, set `{ trim: false }`.
```javascript
moment.duration(123, "minutes").format("d[d] h:mm:ss", {
     trim: false
});
// "0d 2:03:00"
```

`trim` can be a string, a delimited list of strings, an array of strings, or a boolean. Accepted values are as follows:

- ##### `"large"`

Trim largest-magnitude zero-value tokens until finding a token with a value, a token identified as `stopTrim`, or the final token of the format string. This is the default `trim` value.

```javascript
moment.duration(123, "minutes").format("d[d] h:mm:ss");
// "2:03:00"

moment.duration(123, "minutes").format("d[d] h:mm:ss", {
     trim: "large"
});
// "2:03:00"

moment.duration(0, "minutes").format("d[d] h:mm:ss", {
     trim: "large"
});
// "0"
```

- ##### `"small"`

Trim smallest-magnitude zero-value tokens until finding a token with a value, a token identified as `stopTrim`, or the final token of the format string.

```javascript
moment.duration(123, "minutes").format("d[d] h:mm:ss", {
     trim: "small"
});
// "0d 2:03"

moment.duration(0, "minutes").format("d[d] h:mm:ss", {
     trim: "small"
});
// "0d"
```

- #####`"both"`

Execute `"large"` trim then `"small"` trim.

```javascript
moment.duration(123, "minutes").format("d[d] h[h] m[m] s[s]", {
     trim: "both"
});
// "2h 3m"

moment.duration(0, "minutes").format("d[d] h[h] m[m] s[s]", {
     trim: "both"
});
// "0s"
```

- ##### `"mid"`

Trim any zero-value tokens that are not the first or last tokens. Usually used in conjunction with `"large"` or `"both"`. e.g. `"large mid"` or `"both mid"`.

```javascript
moment.duration(1441, "minutes").format("w[w] d[d] h[h] m[m] s[s]", {
     trim: "mid"
});
// "0w 1d 1m 0s"

moment.duration(1441, "minutes").format("w[w] d[d] h[h] m[m] s[s]", {
     trim: "large mid"
});
// "1d 1m 0s"

moment.duration(1441, "minutes").format("w[w] d[d] h[h] m[m] s[s]", {
     trim: "small mid"
});
// "0w 1d 1m"

moment.duration(1441, "minutes").format("w[w] d[d] h[h] m[m] s[s]", {
     trim: "both mid"
});
// "1d 1m"

moment.duration(0, "minutes").format("w[w] d[d] h[h] m[m] s[s]", {
     trim: "both mid"
});
// "0s"
```

- ##### `"final"`

Trim the final token if it is zero-value. Use this option with `"large"` or `"both"` to output an empty string when formatting a zero-value duration. e.g. `"large final"` or `"both final"`.

```javascript
moment.duration(0, "minutes").format("d[d] h:mm:ss", {
     trim: "large final"
});
// ""

moment.duration(0, "minutes").format("d[d] h:mm:ss", {
     trim: "small final"
});
// ""

moment.duration(0, "minutes").format("d[d] h[h] m[m] s[s]", {
     trim: "both final"
});
// ""
```

- ##### `"all"`

Trim all zero-value tokens. Shorthand for `"both mid final"`.

```javascript
moment.duration(0, "minutes").format("d[d] h[h] m[m] s[s]", {
     trim: "all"
});
// ""
```

- ##### `"left"`

Maps to `"large"` to support this plugin's version 1 API.

- ##### `"right"`

Maps to `"large"` to support this plugin's version 1 API.

- ##### `true`

Maps to `"large"`.

- ##### `false`

Disables trimming.

#### largest

Set `largest` to a positive integer to output only the `n` largest-magnitude moment tokens that have a value. All lesser-magnitude or zero-value moment tokens will be ignored. Using the `largest` option overrides `trim` to `"all"` and disables `stopTrim`. This option takes effect even when `trim: false` is used.

```javascript
moment.duration(7322, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", {
     largest: 2
});
// "2 hours, 2 minutes"

moment.duration(1216922, "seconds").format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]", {
     largest: 2
});
// "2 weeks, 2 hours"
```

#### stopTrim

Trimming will stop when a token listed in this option is reached.

Option value may be a moment token string, a delimited set of moment token strings, or an array of moment token strings. Alternatively, set `stopTrim` on tokens in the format template string directly using a `*` character before the moment token.

```javascript
moment.duration(23, "minutes").format("d[d] h:mm:ss", {
     stopTrim: "h"
});
// "0:23:00"

moment.duration(23, "minutes").format("d[d] *h:mm:ss");
// "0:23:00"
```

This option affects all trimming modes: `"large"`, `"small"`, `"mid"`, and `"final"`.

```javascript
moment.duration(2, "hours").format("y [years], d [days], h [hours], m [minutes], s [seconds]", {
     trim: "both",
     stopTrim: "d m"
});
// "0 days, 2 hours, 0 minutes"

moment.duration(2, "hours").format("y [years], *d [days], h [hours], *m [minutes], s [seconds]", {
     trim: "both"
});
// "0 days, 2 hours, 0 minutes"
```

`stopTrim` is disabled when using `largest`.

```javascript
moment.duration(2, "hours").format("y [years], d [days], h [hours], m [minutes], s [seconds]", {
     trim: "both",
     stopTrim: "d m",
     largest: 2
});
// "2 hours"
```

#### trunc

Default behavior rounds the final token value.

```javascript
moment.duration(179, "seconds").format("m [minutes]");
// "3 minutes"

moment.duration(3780, "seconds").format("h [hours]", 1);
// "1.1 hours"
```

Set `trunc` to `true` to truncate final token value. This was the default behavior in version 1 of this plugin.

```javascript
moment.duration(179, "seconds").format("m [minutes]", {
     trunc: true
});
// "2 minutes"

moment.duration(3780, "seconds").format("h [hours]", 1, {
     trunc: true
});
// "1.0 hours"
```

Using `trunc` can affect the operation of `trim` and `largest`.

```javascript
moment.duration(59, "seconds").format("d [days], h [hours], m [minutes]", {
     trunc: true,
     trim: "both"
});
// "0 minutes"

moment.duration(59, "seconds").format("d [days], h [hours], m [minutes]", {
     trunc: true,
     trim: "all"
});
// ""

moment.duration(59, "seconds").format("d [days], h [hours], m [minutes]", {
     trunc: true,
     largest: 1
});
// ""
```

#### minValue

Use `minValue` to render generalized output for small duration values, e.g. `"< 5 minutes"`. `minValue` must be a positive integer and is applied to the least-magnitude moment token in the format template. This option affects the operation of `trim`, and is affected by `trunc`.

```javascript
moment.duration(59, "seconds").format("h [hours], m [minutes]", {
     minValue: 1
});
// "< 1 minute"

moment.duration(59, "seconds").format("h [hours], m [minutes]", {
     minValue: 1,
     trim: "both"
});
// "< 1 minute"

moment.duration(7229, "seconds").format("h [hours], m [minutes]", {
     minValue: 1,
     trim: "both"
});
// "2 hours"

moment.duration(59, "seconds").format("h [hours], m [minutes]", {
     minValue: 1,
     trunc: true,
     trim: "all"
});
// ""
```

`minValue` can be used with negative durations, where it has the same effect on the least-magnitude moment token's absolute value.

```javascript
moment.duration(-59, "seconds").format("h [hours], m [minutes]", {
     minValue: 1
});
// "> -1 minute"
```

When `minValue` is reached, only the least-magnitude moment token is output, regardless of `trim` and `largest`.

```javascript
moment.duration(59, "seconds").format("h [hours], m [minutes]", {
     minValue: 1,
     trim: false,
     largest: 2
});
// "< 1 minute"
```

#### maxValue

Use `maxValue` to render generalized output for large duration values, e.g. `"> 60 days"`. `maxValue` must be a positive integer and is applied to the greatest-magnitude moment token in the format template. As with `minValue`, this option affects the operation of `trim`, is affected by `trunc`, and can be used with negative durations.

```javascript
moment.duration(15, "days").format("w [weeks]", {
     maxValue: 2
});
// "> 2 weeks"

moment.duration(-15, "days").format("w [weeks]]", {
     maxValue: 2
});
// "< -2 weeks"
```

When `maxValue` is reached, only the greatest-magnitude moment token is output, regardless of `trim` and `largest`.

```javascript
moment.duration(15, "days").format("w [weeks], d [days]", {
     maxValue: 2,
     trim: false,
     largest: 2
});
// "> 2 weeks"
```

#### forceLength

Force the first moment token with a value to render at full length, even when the template is trimmed and the first moment token has a length of `1`. Sounds more complicated than it is.

```javascript
moment.duration(123, "seconds").format("h:mm:ss");
// "2:03"
```

If you want minutes to always be rendered with two digits, you can use a first token with a length greater than 1 (this stops the automatic token length trimming for the first token that has a value).

```javascript
moment.duration(123, "seconds").format("hh:mm:ss");
// "02:03"
```

Or you can use `{ forceLength: true }`.

```javascript
moment.duration(123, "seconds").format("h:mm:ss", {
     forceLength: true
});
// "02:03"
```

#### useSignificantDigits

When `useSignificantDigits` is set to `true`, the `precision` option determines the maximum significant digits to be rendered. Precision must be a positive integer. Significant digits extend across unit types, e.g. `"6 hours 37.5 minutes"` represents `4` significant digits. Enabling this option causes token length to be ignored. See  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString.

Setting `trunc` affects the operation of `useSignificantDigits`.
```javascript
moment.duration(99999, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", {
     useSignificantDigits: true,
     precision: 3
});
// "1 day, 3 hours, 50 minutes"

moment.duration(99999, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", {
     useSignificantDigits: true,
     precision: 3,
     trunc: true
});
// "1 day, 3 hours, 40 minutes"

moment.duration(99999, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", {
     useSignificantDigits: true,
     precision: 5
});
// "1 day, 3 hours, 46 minutes, 40 seconds"

moment.duration(99999, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", {
     useSignificantDigits: true,
     trunc: true,
     precision: 5
});
// "1 day, 3 hours, 46 minutes, 30 seconds"

moment.duration(99999, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", {
     useSignificantDigits: true,
     precision: 6
});
// "1 day, 3 hours, 46 minutes, 39 seconds"
```

### Localization

Formatted numerical output is rendered using [`toLocaleString`](see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString).

Unit names are now auto-singularized and auto-localized, and are detected using the locale set in moment.js, which can be different from the locale of user's environment (see https://momentjs.com/docs/#/i18n/), and custom extensions to the locale object definition from moment.js (see below).

The options below clearly do not yet address all i18n requirements for duration formatting (such as languages with [multiple forms of plural](https://developer.mozilla.org/en-US/docs/Mozilla/Localization/Localization_and_Plurals)), but they are a significant step in the right direction.

#### userLocale

Numerical output is rendered using the locale of the user's environment. Set the `userLocale` option to render numerical output using a different locale.

```javascript
moment.duration(1234567, "seconds").format("m [minutes]", 3);
// "20,576.117 minutes"

moment.duration(1234567, "seconds").format("m [minutes]", 3, {
     userLocale: "de-DE"
});
// "20.576,117 minutes"
```

#### Auto-localized Unit Labels

The `_` character can be used to generate auto-localized unit labels in the formatted output.

A single underscore `_` will be replaced with the short duration unit label for its associated moment token.

A double underscore `__` will be replaced with the duration unit label for its associated moment token.

```javascript
moment.duration(2, "minutes").format("m _");
// "2 mins"

moment.duration(2, "minutes").format("m __");
// "2 minutes"
```

#### Auto-localized Time Notation

Durations can also be formatted with a localized time notation.

The string `_HMS_` is repalced with a localized `h:mm:ss` notation.

The string `_HM_` is repalced with a localized `h:mm` notation.

The string `_MS_` is repalced with a localized `m:ss` notation.

```javascript
moment.duration(3661, "seconds").format("_HMS_");
// "1:01:01"

moment.duration(3661, "seconds").format("_HM_");
// "1:01"

moment.duration(61, "seconds").format("_MS_");
// "1:01"
```

#### useSingular

Unit labels are automatically singularized when they appear in the text associated with each moment token. The plural form of the unit name must appear in the format template. Long and short unit labels are singularized, based on the locale defined in moment.js.

```javascript
moment.duration(1, "minutes").format("m [minutes]");
// "1 minute"

moment.duration(1, "minutes").format("m [mins]");
// "1 min"
```

Set `useSingular` to `false` to disable auto-singularizing.

```javascript
moment.duration(1, "minutes").format("m [minutes]", {
     useSingular: false
});
// "1 minutes"

moment.duration(1, "minutes").format("m [mins]", {
     useSingular: false
});
// "1 mins"
```

Singularizing is not used when a value is rendered with decimal precision.

```javascript
moment.duration(1, "minutes").format("m [minutes]", 2);
// "1.00 minutes"
```

#### useLeftUnits

The text to the right of each moment token in a format string is treated as that token's units for the purposes of trimming, singularizing, and localizing. To properly singularize or localize a format string where the token/unit association is reversed, set `useLeftUnits` to `true`.

```javascript
moment.duration(7322, "seconds").format("_ h, _ m, _ s", {
     useLeftUnits: true
});
// "hrs 2, mins 2, secs 2"
```

#### useGrouping

Formatted numerical output is rendered using `toLocaleString` with the option `useGrouping` enabled. Set `useGrouping` to `false` to disable digit grouping.

```javascript
moment.duration(1234, "seconds").format("s [seconds]");
// "1,234 seconds"

moment.duration(1234, "seconds").format("s [seconds]", {
     useGrouping: false
});
// "1234 seconds"
```

#### Decimal Separator

Previous versions of the plugin used a `decimalSeparator` option. That option is no longer used and will have no effect. Decimal separators are rendered using `toLocalString` and the user's locale.

```javascript
moment.duration(1234567, "seconds").format("m [minutes]", 3, {
     userLocale: "de-DE"
});
// "20.576,117 minutes"
```

#### Extending Moment's `locale` object

This plugin now extends moment.js's `locale` object with `durations` and `durationsShort` values. The `en` locale is included with this plugin. Other locales may be easily defined to provide auto-singularized and auto-localized unit labels in different languages. If the plugin cannot find the duration locale extensions for the active moment locale, the plugin will replace any `_` or `__` template text with the `en` locale unit label.

Below is the `en` locale extension.

```javascript
moment.updateLocale('en', {

    durations: {
        S: 'millisecond',
        SS: 'milliseconds',
        s: 'second',
        ss: 'seconds',
        m: 'minute',
        mm: 'minutes',
        h: 'hour',
        hh: 'hours',
        d: 'day',
        dd: 'days',
        w: 'week',
        ww: 'weeks',
        M: 'month',
        MM: 'months',
        y: 'year',
        yy: 'years',
        HMS: 'h:mm:ss',
        HM: 'h:mm',
        MS: 'm:ss'
    },
    durationsShort: {
        S: 'msec',
        SS: 'msecs',
        s: 'sec',
        ss: 'secs',
        m: 'min',
        mm: 'mins',
        h: 'hr',
        hh: 'hrs',
        d: 'dy',
        dd: 'dys',
        w: 'wk',
        ww: 'wks',
        M: 'mo',
        MM: 'mos',
        y: 'yr',
        yy: 'yrs'
    }
});
```

Unit labels from the above object (`hour`, `hours`, etc.) are replaced after tokens are parsed, so they need not be escaped. Time format definitions (`durations.HMS`, `durations.HM`, and `durations.MS`) are replaced before tokens are parsed and need to be properly escaped, e.g. `MS: 'mm\[m\]ss\[s\]'`, if that were the way a minute/second duration value were written for a particular locale.
