#Moment Duration Format

###Format plugin for the Moment Duration object.

This is a plugin to the Moment.js JavaScript date library to add comprehensive formatting to Moment Durations.

Format template grammar is patterned on the existing Moment Date format template grammar, with a few modifications because durations are fundamentally different from dates.

This plugin does not have any dependencies beyond Moment.js itself, and may be used in the browser and on the server.

---

### Installation

##### Node.js
`npm install moment-duration-format`

##### Bower
`bower install moment-duration-format`

##### Browser
`<script src="path/to/moment-duration-format.js"></script>`

When using this plugin in the browser, be sure to include moment.js on your page first.

---

### Usage

##### Module

To use this plugin as a module, use the `require` function:
```
require("moment-duration-format");
```

The plugin does not export anything, so there is no need to assign the require output to a variable.

The plugin depends on moment.js, which is not specified as a package dependency in the currently published version.

##### Arguments

The duration format method may be called with three optional arguments:
```
moment.duration.format([template] [, precision] [, settings])
```

`template` is a string. It is parsed for moment-token characters, which are replaced with the duration value for that type.
Moment-tokens may be be customized (see test cases for examples), but the default token map is:
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

`precision` is an integer. Positive precision defines the number of decimal digits to display. Negative precision will truncate the value to the left of the decimal point.

Both the `template` and `precision` arguments may be specified as properties of a single `settings` object argument if desired, or they may be passed separately along with an optional settings object. 


##### Basics
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

See the test cases and the default settings for more thorough option descriptions.
