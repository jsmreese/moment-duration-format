#Moment Duration Format

###Format plugin for the Moment Duration object.

This is a plugin to the Moment.js JavaScript date library to add comprehensive formatting to Moment Durations.

Format template grammar is patterned on the existing Moment Date format template grammar, with a few modifications because durations are fundamentally different from dates.

This plugin does not have any dependencies beyond Moment.js itself, and may be used in the browser and in Node.js.

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

##### Basics

The duration format method can format any moment duration. If no template or other arguments are provided, the default template function will generate a template string based on the duration's value.

```
moment.duration(123, "minutes").format();
// "2:03:00"

moment.duration(123, "months").format();
// "10y 3m"
```

The duration format method may be called with three optional arguments:
```
moment.duration.format([template] [, precision] [, settings])
```

##### Template

`template` (string|function) is the string used to create the formatted output, or a function that returns the string to be used as the format template.

```
moment.duration(123, "minutes").format("h:mm");
// "2:03"
```

The template string is parsed for moment-token characters, which are replaced with the duration's value for each unit type. The default tokens are:
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

Token characters may be customized (see below for an example).

Escape token characters within the template string using square brackets.
```
moment.duration(123, "minutes").format("h [hrs], m [min]");
// "2 hrs, 3 min"
```

Escape characters may also be customized (see below for an example).



##### Precision

`precision` (number) defines the number of digits to display for the final value.

The default precison value is `0`.
```
moment.duration(123, "minutes").format("h [hrs]");
// "2 hrs"
```

Positive precision defines the number of digits to display to the right of the decimal point.
```
moment.duration(123, "minutes").format("h [hrs]", 2);
// "2.04 hrs"
```

Negative precision will truncate the value to the left of the decimal point.
```
moment.duration(123, "minutes").format("m [min]", -1);
// "120 min"
```

##### Settings

`settings` is an object that can override any of the default moment duration format options.

Both the `template` and `precision` arguments may be specified as properties of a single `settings` object argument, or they may be passed separately along with an optional settings object.

###### Trim

Leading tokens are automatically trimmed when they have no value.
```
moment.duration(123, "minutes").format("d[d] h:mm:ss");
// "2:03:00"
```

To stop that behavior, set `{ trim: false }`.
```
moment.duration(123, "minutes").format("d[d] h:mm:ss", { trim: false });
// "0d 2:03:00"
```

Use `{ trim: "right" }` to trim from the right.
```
moment.duration(123, "minutes").format("[seconds:] s -- [minutes:] m -- [hours:] h -- [days:] d", { trim: "right" });
// "seconds: 0 -- minutes: 3 -- hours: 2"
```


##### Module

To use this plugin as a module, use the `require` function:
```
require("moment-duration-format");
```

The plugin does not export anything, so there is no need to assign the require output to a variable.

The plugin depends on moment.js, which is not specified as a package dependency in the currently published version.
