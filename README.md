#Moment Duration Format

###Format plugin for the Moment Duration object.

This is a plugin to the Moment.js JavaScript date library to add comprehensive formatting to Moment Durations.

Format template grammar is patterned on the existing Moment Date format template grammar, with a few modifications because durations are fundamentally different from dates.

This plugin depends on <a href="http://lodash.com/">Lo-Dash</a> or <a href="http://http://underscorejs.org//">Underscore</a>, and is tested with both libraries.

---

### Installation

##### Node.js
`npm install moment-duration-format`

##### Bower
`bower install moment-duration-format`

##### Browser
`<script src="path/to/moment-duration-format.js"></script>`

Be sure to include moment.js and lodash.js or underscore.js on your page before loading this plugin.

---

### Usage

The format function may be called with three optional arguments:
```
moment.duration.format([template] [, precision] [, settings])
```

Both the `template` and `precision` arguments may be specified as part of a single `settings` object argument if desired.

Within the `template` string, moment-token characters will be replaced with the duration value for that type.
Moment-tokens maybe be customized (see test cases for examples), but the default token map is:
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


Basic usage:
```
moment.duration(123, "minutes").format();
// "2:03:00"

moment.duration(123, "minutes").format("h:mm");
// "2:03"

moment.duration(123, "minutes").format("h [hrs], m [min]");
// "2 hrs, 3 min"
// escape moment-tokens using square brackets
// this can be customized using `settings.escape`

moment.duration(123, "minutes").format("h [hrs]", 2);
// "2.04 hrs"
// show arbitrary decimal precision with positive precision

moment.duration(123, "minutes").format("m [min]", -1);
// "120 min"
// truncate the final value with negative precision

moment.duration(123, "minutes").format("d[d] h:mm:ss");
// "2:03:00"
// automatically trim leading tokens that have no value

moment.duration(123, "minutes").format("[seconds:] s -- [minutes:] m -- [hours:] h -- [days:] d", { trim: "right" });
// "seconds: 0 -- minutes: 3 -- hours: 2"
// or trim from the right

moment.duration(123, "minutes").format("d[d] h:mm:ss", { trim: false });
// "0d 2:03:00"
// or don't trim at all
```

See the test cases and the default options for more thorough option descriptions.