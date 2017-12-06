/*! Moment Duration Format v2.0.0b1
 *  https://github.com/jsmreese/moment-duration-format
 *  Date: 2017-11-21
 *
 *  Duration format plugin function for the Moment.js library
 *  http://momentjs.com/
 *
 *  Copyright 2017 John Madhavan-Reese
 *  Released under the MIT license
 */

(function (root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(['moment'], factory);
	} else if (typeof exports === 'object') {
		// Node. Does not work with strict CommonJS, but only CommonJS-like
		// enviroments that support module.exports, like Node.
		try {
			module.exports = factory(require('moment'))
		} catch (e) {
			// If moment is not available, leave the setup up to the user-friendly
			// (for example when using moment-timezone or similar moment-based package)
			module.exports = factory
		}
	} else {
		// Browser globals.
		root.momentDurationFormat = factory(root.moment);
	}
})(this, function (moment) {

	// repeatZero(qty)
	// Returns "0" repeated qty times.
	function repeatZero(qty) {
		var result = "";

		// Exit early if qty is:
        // - 0
        // - a negative number
        // - doesn't coerce to an integer
		qty = parseInt(qty, 10);
		if (!qty || qty < 1) { return result; }

		while (qty) {
			result += "0";
			qty -= 1;
		}

		return result;
	}

	// padZero(str, len [, isRight])
	// Pads a string with zeros up to a specified length. Will not pad a string
    // if its length is aready greater than or equal to the specified length.
	// Default output pads with zeros on the left. Set isRight to `true` to
    // pad with zeros on the right.
	function padZero(str, len, isRight) {
		if (str == null) { str = ""; }
		str = "" + str;

		return (isRight ? str : "") + repeatZero(len - str.length) + (isRight ? "" : str);
	}

	// isArray
	function isArray(array) {
		return Object.prototype.toString.call(array) === "[object Array]";
	}

	// isObject
	function isObject(obj) {
		return Object.prototype.toString.call(obj) === "[object Object]";
	}

	// findLast
	function findLast(array, callback) {
		var index = array.length;

		while (index -= 1) {
			if (callback(array[index])) { return array[index]; }
		}
	}

	// find
	function find(array, callback) {
		var index = 0,
			max = array.length,
			match;

		if (typeof callback !== "function") {
			match = callback;
			callback = function (item) {
				return item === match;
			};
		}

		while (index < max) {
			if (callback(array[index])) { return array[index]; }
			index += 1;
		}
	}

	// each
	function each(array, callback) {
		var index = 0,
			max = array.length;

		if (!array || !max) { return; }

		while (index < max) {
			if (callback(array[index], index) === false) { return; }
			index += 1;
		}
	}

	// map
	function map(array, callback) {
		var index = 0,
			max = array.length,
			ret = [];

		if (!array || !max) { return ret; }

		while (index < max) {
			ret[index] = callback(array[index], index);
			index += 1;
		}

		return ret;
	}

	// pluck
	function pluck(array, prop) {
		return map(array, function (item) {
			return item[prop];
		});
	}

	// compact
	function compact(array) {
		var ret = [];

		each(array, function (item) {
			if (item) { ret.push(item); }
		});

		return ret;
	}

	// unique
	function unique(array) {
		var ret = [];

		each(array, function (_a) {
			if (!find(ret, _a)) { ret.push(_a); }
		});

		return ret;
	}

	// intersection
	function intersection(a, b) {
		var ret = [];

		each(a, function (_a) {
			each(b, function (_b) {
				if (_a === _b) { ret.push(_a); }
			});
		});

		return unique(ret);
	}

	// rest
	function rest(array, callback) {
		var ret = [];

		each(array, function (item, index) {
			if (!callback(item)) {
				ret = array.slice(index);
				return false;
			}
		});

		return ret;
	}

	// initial
	function initial(array, callback) {
		var reversed = array.slice().reverse();

		return rest(reversed, callback).reverse();
	}

	// extend
	function extend(a, b) {
		for (var key in b) {
			if (b.hasOwnProperty(key)) { a[key] = b[key]; }
		}

		return a;
	}

	// durationFormat([template] [, precision] [, settings])
	function durationFormat() {

		var args = [].slice.call(arguments);

        var settings = extend({}, this.format.defaults);

		// Keep a shadow copy of this moment for calculating remainders.
		var remainder = moment.duration(this);

        // Parse arguments.
		each(args, function (arg) {
			if (typeof arg === "string" || typeof arg === "function") {
				settings.template = arg;
				return;
			}

			if (typeof arg === "number") {
				settings.precision = arg;
				return;
			}

			if (isObject(arg)) {
				extend(settings, arg);
			}
		});

        var momentTokens = {
            years: "y",
			months: "M",
			weeks: "w",
			days: "d",
			hours: "h",
			minutes: "m",
			seconds: "s",
			milliseconds: "S"
        };

        // Most tokenDefs could be built dynamically to save a few bytes.
        var tokenDefs = {
			escape: /\[(.+?)\]/,
			years: /\*?y+/,
			months: /\*?M+/,
			weeks: /\*?w+/,
			days: /\*?d+/,
			hours: /\*?h+/,
			minutes: /\*?m+/,
			seconds: /\*?s+/,
			milliseconds: /\*?S+/,
			general: /.+?/
        };

		// Token type names in order of descending magnitude.
		var types = "escape years months weeks days hours minutes seconds milliseconds general".split(" ");

        // Types array is available in the template function.
        settings.types = types;

		var typeMap = function (token) {
			return find(types, function (type) {
				return tokenDefs[type].test(token);
			});
		};

		var tokenizer = new RegExp(map(types, function (type) {
			return tokenDefs[type].source;
		}).join("|"), "g");

        // Current duration object is available in the template function.
		settings.duration = this;

        // Eval settings functions.
		if (typeof settings.template === "function") {
			settings.template = settings.template.apply(settings);
		}
		if (typeof settings.decimalSeparator === "function") {
			settings.decimalSeparator = settings.decimalSeparator.apply(settings);
		}

		// Parse format string to create raw tokens array.
		var rawTokens = map(settings.template.match(tokenizer), function (token, index) {
			var type, length, stopTrim;

			type = typeMap(token);
			stopTrim = false;

			if (token.slice(0, 1) === "*") {
				token = token.slice(1);
				stopTrim = true;
			}

			length = token.length;

			return {
				index: index,
				length: length,
				stopTrim: stopTrim,
                text: "",

				// Replace escaped tokens with the non-escaped token text.
				token: (type === "escape" ? token.replace(tokenDefs.escape, "$1") : token),

				// Ignore type on non-moment tokens.
				type: ((type === "escape" || type === "general") ? null : type)
			};
		}, this);

        // Associate text tokens with moment tokens.
        var currentToken = {
            index: 0,
            length: 0,
            stopTrim: false,
            token: "",
            text: "",
            type: null
        };

        var tokens = [];

        if (settings.leftUnits) {
            rawTokens.reverse();
        }

        each(rawTokens, function (token) {
            if (token.type) {
                if (currentToken.type || currentToken.text) {
                    tokens.push(currentToken);
                }

                currentToken = token;

                return;
            }

            if (settings.leftUnits) {
                currentToken.text = token.token + currentToken.text;
            } else {
                currentToken.text += token.token;
            }
        });

        if (currentToken.type || currentToken.text) {
            tokens.push(currentToken);
        }

        if (settings.leftUnits) {
            tokens.reverse();
        }

		// Find unique moment token types in the template in order of
        // descending magnitude.
		momentTypes = intersection(types, unique(compact(pluck(tokens, "type"))));

		// Exit early if there are no moment token types.
		if (!momentTypes.length) {
			return pluck(tokens, "text").join("");
		}

        var localeData = moment.localeData();

		// Calculate values for each moment token type in the template.
		each(momentTypes, function (momentType, index) {
			var value, wholeValue, decimalValue, isLeast, isMost, truncMethod, decVal;

			// Is this the least-significant moment token found?
			isLeast = ((index + 1) === momentTypes.length);

			// Is this the most-significant moment token found?
			isMost = (!index);

			// get the value in the current units
			value = remainder.as(momentType);

			// determine the truncation method
			// take floor for positive numbers, ceiling for negative numbers
			truncMethod = (value > 0 ? "floor" : "ceil");

			// calculate integer and decimal value portions
			if (isLeast) {
				// apply precision to least significant token value
				if (settings.precision < 0) {
					wholeValue = Math[settings.trunc ? truncMethod : "round"](value * Math.pow(10, settings.precision)) * Math.pow(10, -settings.precision);
					decimalValue = 0;
				} else if (settings.precision === 0) {
					wholeValue = Math[settings.trunc ? truncMethod : "round"](value);
					decimalValue = 0;
				} else { // settings.precision > 0
					wholeValue = Math[truncMethod](value);

					if (settings.trunc) {
						decVal = value - wholeValue;
					} else {
						decVal = Math.round((value - wholeValue) * Math.pow(10, settings.precision)) * Math.pow(10, -settings.precision)
					}

					decVal = decVal.toString().replace(/^\-/, "").split(/\.|e\-/);

					switch (decVal.length) {
						case 1:
							decimalValue = padZero(decVal[0], settings.precision, true).slice(0, settings.precision);
							break;

						case 2:
							decimalValue = padZero(decVal[1], settings.precision, true).slice(0, settings.precision);
							break;

						case 3:
							decimalValue = padZero(repeatZero((+decVal[2]) - 1) + (decVal[0] || "0") + decVal[1], settings.precision, true).slice(0, settings.precision);
							break;

						default:
							throw "Moment Duration Format: unable to parse token decimal value.";
					}
				}
			} else {
				wholeValue = Math[truncMethod](value);
				decimalValue = value - wholeValue;
			}


			// Update tokens array using this algorithm to not assume anything
            // about the order or frequency of any tokens.
			each(tokens, function (token) {
                var localeStrings, localeKey;

				if (token.type === momentType) {
					extend(token, {
						value: value,
						wholeValue: wholeValue,
						decimalValue: decimalValue,
						isLeast: isLeast,
						isMost: isMost
					});

                    if (settings.singular) {
                        localeKey = momentTokens[momentType];
                        localeStrings = {
                            single: localeData._durations[localeKey],
                            plural: localeData._durations[localeKey + localeKey],
                            singleShort: localeData._durationsShort[localeKey],
                            pluralShort: localeData._durationsShort[localeKey + localeKey]
                        };

                        if (wholeValue === 1 && (!isLeast || isLeast && settings.precision === 0)) {
                            if (localeStrings.plural && localeStrings.single) {
                                token.text = token.text.replace(localeStrings.plural, localeStrings.single);
                            }

                            if (localeStrings.pluralShort && localeStrings.singleShort) {
                                token.text = token.text.replace(localeStrings.pluralShort, localeStrings.singleShort);
                            }
                        }
                    }

					if (isMost) {
						// Note the length of the most-significant moment token:
						// if it is greater than one and forceLength is not set,
                        // then default forceLength to `true`.
                        //
                        // Rationale is this: If the template is "h:mm:ss" and the
                        // moment value is 5 minutes, the user-friendly output is
                        // "5:00", not "05:00". We shouldn't pad the `minutes` token
                        // even though it has length of two if the template is "h:mm:ss";
                        //
                        // If the minutes output should always include the leading zero
						// even when the hour is trimmed then set `{ forceLength: true }`
                        // to output "05:00". If the template is "hh:mm:ss", the user
                        // clearly wanted everything padded so we should output "05:00";
                        //
						// If the user wants the full padded output, they can use
                        // template "hh:mm:ss" and set `{ trim: false }` to output
                        // "00:05:00".
						if (settings.forceLength == null && token.length > 1) {
							settings.forceLength = true;
						}
					}
				}
			});

			// Update remainder.
			remainder.subtract(wholeValue, momentType);
		});

        // Trim tokens array.
        if (settings.trim) {
            tokens = (settings.trim === "right" ? initial : rest)(tokens, function (token) {
                // Stop initial trim from the left or the right on:
                // - the least moment token
                // - a token marked for stopTrim
                // - a moment token that has a whole value
                return !(token.isLeast || token.stopTrim || (token.type != null && token.wholeValue));
            });

            // Handle `largest` option before the right-side trim for `trim: "both"`.
            if (settings.largest) {
                if (settings.trim === "right") {
                    tokens = tokens.slice(-settings.largest);
                } else {
                    tokens = tokens.slice(0, settings.largest);
                }
            }

            // Do not trim from the right for `trim: "both"` if a single token remains.
            if (settings.trim === "both" && tokens.length > 1) {
                tokens = initial(tokens, function (token) {
                    // Stop trimming from the right for `trim: "both"` on:
                    // - a token marked for stopTrim
                    // - a moment token that has a whole value
                    return !(token.stopTrim || (token.type != null && token.wholeValue));
                });
            }
        }

		// Build output.

		// the first moment token can have special handling
		var foundFirst = false;
        var reachedLargest = false;

		// run the map in reverse order if trimming from the right
		if (settings.trim === "right") {
			tokens.reverse();
		}

		tokens = map(tokens, function (token, index) {
			var val,
				decVal;

			if (!token.type) {
				// if it is not a moment token, use the token text as its own value
				return token.text;
			}

			// remove negative sign from the beginning
			val = token.wholeValue.toString().replace(/^\-/, "");

			// apply token length formatting
			// special handling for the first moment token that is not the most significant in a trimmed template
			if (token.length > 1 && (foundFirst || token.isMost || settings.forceLength)) {
				val = padZero(val, token.length);
			}

			// add decimal value if precision > 0
			if (token.isLeast && (settings.precision > 0)) {
				decVal = token.decimalValue.toString();
				val += settings.decimalSeparator + decVal;
			}

			// add a negative sign if the value is negative and token is the first one
			if (token.value < 0 && !index) {
				val = "-" + val;
			}

			foundFirst = true;

			return (settings.leftUnits ? token.text + val : val + token.text);
		});

		// undo the reverse if trimming from the right
		if (settings.trim === "right") {
			tokens.reverse();
		}

        // Trim leading and trailing comma, space, and colon.
        return tokens.join("").replace(/(,| |:)*$/, "").replace(/^(,| |:)*/, "");
	}

	// defaultFormatTemplate
	function defaultFormatTemplate() {
		var dur, lastType;

		dur = this.duration;

		lastType = findLast(this.types, function (type) {
			return dur._data[type];
		});

		// default template strings for each duration dimension type
		switch (lastType) {
			case "seconds":
				return "h:mm:ss";
			case "minutes":
				return "d[d] h:mm";
			case "hours":
				return "d[d] h[h]";
			case "days":
				return "M[m] d[d]";
			case "weeks":
				return "y[y] w[w]";
			case "months":
				return "y[y] M[m]";
			case "years":
				return "y[y]";
			default:
				return "y[y] M[m] d[d] h:mm:ss";
		}
	}

	// defaultDecimalSeparator
	// http://stackoverflow.com/questions/1074660/with-a-browser-how-do-i-know-which-decimal-separator-does-the-client-use
	function defaultDecimalSeparator() {
		return /^1(.+)1$/.exec((1.1).toLocaleString())[1];
	}

	// init
	function init(context) {
		if (!context) {
			throw "Moment Duration Format init cannot find moment instance.";
		}

		context.duration.fn.format = durationFormat;

		context.duration.fn.format.defaults = {
			// format options

			// trim
			// "left" - template tokens are trimmed from the left until the first moment token that has a value >= 1
			// "right" - template tokens are trimmed from the right until the first moment token that has a value >= 1
            // "both" - template tokens are trimmed from the left and the right, removing all leading and trailing zero-value tokens. Leading and trailing space, comma, and colon characters are trimmed from the resulting string. Any non-moment format token is assumed to 'belong' to the previous moment token and will be trimmed or not trimmed based on the status of that 'owning' moment token.
			// `false` - template tokens are not trimmed
            // The final moment token is not trimmed, regardless of value
			trim: "left",

			// precision
			// number of decimal digits to include after (to the right of) the decimal point (positive integer)
			// or the number of digits to truncate to 0 before (to the left of) the decimal point (negative integer)
			precision: 0,

			// trunc
			// default behavior in version 2.0.0 rounds final token value
			// set to `true` to truncate final token value (this was the default behavior in version 1)
			trunc: false,

			// force first moment token with a value to render at full length even when template is trimmed
			// and first moment token has length of 1
			// defaulted to `null` to distinguish between 'not set' and 'set to `false`'
			forceLength: null,

            // set to a positive integer to show only the largest "x" moment tokens
            // all subsequent moment tokens of lesser value will be trimmed
            // This option may require setting `leftUnits: true` to be compatible with `trim: "right"`, depending on the format string.
            // This option will have no effect if `trim` is set to `false`.
            largest: 0,

            // singular will automatically singularize unit names when they are in the text associated with their corresponding moment token. Long and short unit names are singularized, based on locale. e.g. in english, "1 second" or "1 sec" would be rendered instead of "1 seconds" or "1 secs". This option is disabled when a value is rendered with decimal precision. e.g. "1.0 seconds" is never rendered as "1.0 second".
            singular: true,

            // leftUnits associates moment tokens with the text on their left for the purposes of singularizing
            leftUnits: false,

			// template used to format duration
			// may be a function or a string
			// template functions are executed with the `this` binding of the settings object
			// so that template strings may be dynamically generated based on the duration object
			// (accessible via `this.duration`) or any of the other settings
            // Leading and trailing space, comma, and colon characters are trimmed from the resulting string.
			template: defaultFormatTemplate,

			// decimalSeparator
			// can be a string or a function
			// by default will use the decimal separator set in the environment
			decimalSeparator: defaultDecimalSeparator
		};

        context.updateLocale('en', {
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
                yy: 'years'
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
	}

	// initialize duration format on the global moment instance
	init(moment);

	// return the init function so that duration format can be
	// initialized on other moment instances
	return init;
});
