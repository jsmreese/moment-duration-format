$(document).ready(function() {
	module("Moment Duration Format");
    moment.duration.fn.format.defaults.userLocale = "en-US";

    var d = moment.duration(1234.55, "hours");
    d.subtract(51, "days");
    console.log(d.as("hours"));

	test("Basic Use", function () {
		equal(moment.duration(1, "milliseconds").format("S"), "1");
		equal(moment.duration(1, "seconds").format("s"), "1");
		equal(moment.duration(1, "minutes").format("m"), "1");
		equal(moment.duration(1, "hours").format("h"), "1");
		equal(moment.duration(1, "hours").format("H"), "1");
		equal(moment.duration(1, "days").format("d"), "1");
		equal(moment.duration(1, "days").format("D"), "1");
		equal(moment.duration(1, "weeks").format("w"), "1");
		equal(moment.duration(1, "weeks").format("W"), "1");
		equal(moment.duration(1, "months").format("M"), "1");
		equal(moment.duration(1, "years").format("y"), "1");
		equal(moment.duration(1, "years").format("Y"), "1");
	});

	test("Trim Left", function () {
		equal(moment.duration(1, "seconds").format("m s"), "1");
		equal(moment.duration(1, "minutes").format("h m s"), "1 0");
	});

	test("Trim Right", function () {
		equal(moment.duration(1, "seconds").format("s m", { trim: "right" }), "1");
		equal(moment.duration(1, "minutes").format("s m h", { trim: "right" }), "0 1");
	});

	test("Trim False", function () {
		equal(moment.duration(1, "seconds").format("m s", { trim: false }), "0 1");
		equal(moment.duration(1, "minutes").format("h m s", { trim: false }), "0 1 0");
	});

	test("Token Length", function () {
		equal(moment.duration(1, "seconds").format("ss"), "01");
		equal(moment.duration(1, "minutes").format("mm ss"), "01 00");
	});

	test("Left Trimmed First Token Length", function () {
		equal(moment.duration(1, "seconds").format("mm ss"), "01");
		equal(moment.duration(1, "seconds").format("m ss"), "1");
		equal(moment.duration(1, "seconds").format("m ss", { forceLength: true }), "01");
	});

	test("Right Trimmed First Token Length", function () {
		equal(moment.duration(1, "seconds").format("ss mm", { trim: "right" }), "01");
		equal(moment.duration(1, "seconds").format("ss m", { trim: "right" }), "1");
		equal(moment.duration(1, "seconds").format("ss m", { trim: "right", forceLength: true }), "01");
	});

	test("Positive Precision", function () {
		equal(moment.duration(15, "seconds").format("m", 2), "0.25");
		equal(moment.duration(20, "seconds").format("m", 3), "0.333");
		equal(moment.duration(30, "seconds").format("m", 4), "0.5000");
		equal(moment.duration(40, "seconds").format("m", 5), "0.66667");
	});

    test("Zero Precision", function () {
        equal(moment.duration(59, "seconds").format("m", 0), "1");
        equal(moment.duration(59, "seconds").format("m"), "1");
        equal(moment.duration(59, "seconds").format("m", 0, { trunc: true }), "0");
        equal(moment.duration(59, "seconds").format("m", { trunc: true }), "0");
    });

	test("Negative Precision", function () {
		equal(moment.duration(15, "seconds").format("s", -1), "20");
		equal(moment.duration(123, "seconds").format("s", -2), "100");
	});

	test("Positive Precision with Trunc", function () {
		equal(moment.duration(15, "seconds").format("m", 2, { trunc: true }), "0.25");
		equal(moment.duration(20, "seconds").format("m", 3, { trunc: true }), "0.333");
		equal(moment.duration(30, "seconds").format("m", 4, { trunc: true }), "0.5000");
		equal(moment.duration(40, "seconds").format("m", 5, { trunc: true }), "0.66666");
	});

	test("Negative Precision with Trunc", function () {
		equal(moment.duration(15, "seconds").format("s", -1, { trunc: true }), "10");
		equal(moment.duration(159, "seconds").format("s", -1, { trunc: true }), "150");
	});

	test("Multiple Token Instances", function () {
		equal(moment.duration(123, "seconds").format("s s s"), "123 123 123");
		equal(moment.duration(123, "seconds").format("s s ssssss"), "123 123 000,123");
	});

	test("Escape Tokens", function () {
		equal(moment.duration(123, "seconds").format("[All] [tokens] [escaped]"), "All tokens escaped");
		equal(moment.duration(123, "seconds").format("s[s]"), "123s");
	});

	test("All Moment Tokens", function () {
		// obviously a duration of 100,000,000,013 ms will vary in the number of days based on leap years, etc.
		// this test ensures the internal duration/format math remains consistent
		equal(moment.duration(100000000013, "ms").format("y[y] M[mo] w[w] d[d] h[h] m[m] s[s] S[ms]"), "3y 2mo 0w 0d 9h 46m 40s 13ms");
	});

	test("Output To Lesser Units", function () {
		equal(moment.duration(1, "years").format("y"), "1");
		equal(moment.duration(1, "years").format("M"), "12");
		equal(moment.duration(1, "years").format("w"), "52");
		equal(moment.duration(1, "years").format("d"), "365");
		equal(moment.duration(1, "years").format("h"), "8,760");
		equal(moment.duration(1, "years").format("m"), "525,600");
		equal(moment.duration(1, "years").format("s"), "31,536,000");
		equal(moment.duration(1, "years").format("S"), "31,536,000,000");
	});

	test("Output To Greater Units", function () {
		equal(moment.duration(1, "milliseconds").format("y", 13), "0.0000000000317");
		equal(moment.duration(1, "milliseconds").format("M", 12), "0.000000000380");
		equal(moment.duration(1, "milliseconds").format("w", 14), "0.00000000165344");
		equal(moment.duration(1, "milliseconds").format("d", 10), "0.0000000116");
		equal(moment.duration(1, "milliseconds").format("h", 9), "0.000000278");
		equal(moment.duration(1, "milliseconds").format("m", 7), "0.0000167");
		equal(moment.duration(1, "milliseconds").format("s", 3), "0.001");
		equal(moment.duration(1, "milliseconds").format("S"), "1");
	});

	test("Using Only Settings Argument", function () {
		equal(moment.duration(1234.55, "hours").format({
			template: "d [days], h [hours]",
			precision: 1
		}), "51 days, 10.6 hours");
	});

	test("Zero Value Duration", function () {
		equal(moment.duration(0, "minutes").format("m"), "0");
		equal(moment.duration(0, "minutes").format("mm"), "00");
		equal(moment.duration(0, "minutes").format("m", -1), "0");
		equal(moment.duration(0, "minutes").format("mm", -1), "00");
		equal(moment.duration(0, "minutes").format("m", 1), "0.0");
	});

	test("Default Template Function", function () {
		equal(moment.duration(100, "milliseconds").format(), "0");
		equal(moment.duration(100, "seconds").format(), "1:40");
		equal(moment.duration(100, "minutes").format(), "1:40");
		equal(moment.duration(100, "hours").format(), "4d 4h");
		equal(moment.duration(100, "days").format(), "3m 9d");
		equal(moment.duration(100, "weeks").format(), "22m 30d");
		equal(moment.duration(100, "months").format(), "8y 4m");
		equal(moment.duration(100, "years").format(), "100y");
	});

	test("Custom Template Function", function () {
		equal(moment.duration(100, "days").format(function () {
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

			var types = this.types,
				dur = this.duration;

			return map(types.slice(1, -2), function (type) {
				return ((type === "months" || type === "milliseconds") ? type[0].toUpperCase() : type[0]) + " [" + type + "]";
			}).join(", ");
		}), "3 months, 1 week, 2 days, 0 hours, 0 minutes, 0 seconds");
	});

	test("Negative Durations", function () {
		equal(moment.duration(-1, "years").format("y"), "-1");
		equal(moment.duration(-1, "months").format("M"), "-1");
		equal(moment.duration(-1, "weeks").format("w"), "-1");
		equal(moment.duration(-1, "days").format("d"), "-1");
		equal(moment.duration(-1, "hours").format("h"), "-1");
		equal(moment.duration(-1, "minutes").format("m"), "-1");
		equal(moment.duration(-1, "seconds").format("s"), "-1");
		equal(moment.duration(-1, "milliseconds").format("S"), "-1");
		equal(moment.duration(-1, "years").format("s"), "-31,536,000");
		equal(moment.duration(-1, "seconds").format("y", 10), "-0.0000000317");
		equal(moment.duration(-65, "seconds").format("m:ss"), "-1:05");
		equal(moment.duration(-65, "seconds").format("m:ss", 2), "-1:05.00");
		equal(moment.duration(-65.667, "seconds").format("m:ss", 2), "-1:05.67");
		equal(moment.duration(-65.667, "days").format("d", 2), "-65.67");
		equal(moment.duration(-65.667, "days").format("d [days], h [hours]"), "-65 days, 16 hours");
        equal(moment.duration(-30, "seconds").format("m", 2), "-0.50");
	});

    test("Negative Durations that have zero value", function () {
        equal(moment.duration(-29, "seconds").format("m"), "0");
        equal(moment.duration(-30, "seconds").format("m"), "0");
        equal(moment.duration(-31, "seconds").format("m", { trunc: true }), "0");
        equal(moment.duration(-59, "seconds").format("m", { trunc: true }), "0");
    });

    test("Negative Durations with leading text", function () {
		equal(moment.duration(-42, "seconds").format("[Leading Text] s", { trim: false }), "Leading Text -42");
	});

	test("Negative Durations and Trimming", function () {
		equal(moment.duration(-42, "seconds").format("h:mm:ss"), "-42");
	});

	test("Stop Trimming with the * Character", function () {
		equal(moment.duration(15, "seconds").format("h:*mm:ss"), "0:15");
		equal(moment.duration(15, "seconds").format("h:*mm:ss", { forceLength: true }), "00:15");
		equal(moment.duration(15, "seconds").format("hh:*mm:ss"), "00:15");
		equal(moment.duration(15, "seconds").format("*h:mm:ss"), "0:00:15");
	});

    // https://github.com/jsmreese/moment-duration-format/issues/59
    test("Rounding errors", function () {
        equal(moment.duration(70300, "milliseconds").format("s", 1), "70.3");
        equal(moment.duration(288957, "milliseconds").format("s", 1), "289.0");
        equal(moment.duration(1087300, "milliseconds").format("s", 1), "1,087.3");
    });

    test("Show only the largest `x` tokens", function () {
        equal(moment.duration(1.55, "days").format("d [days], h [hours], m [minutes], s [seconds]", { largest: 2 }), "1 day, 13 hours");
        equal(moment.duration(1454.4, "minutes").format("d [days], h [hours], m [minutes], s [seconds]", { largest: 2 }), "1 day, 0 hours");
        equal(moment.duration(1454.4, "minutes").format("d [days], h [hours], m [minutes], s [seconds]", { largest: 3 }), "1 day, 0 hours, 14 minutes");
    });

    test("Trim both", function () {
        equal(moment.duration(1, "days").format("M [months], d [days], h [hours], m [minutes], s [seconds]", { trim: "both" }), "1 day");
        equal(moment.duration(90000, "seconds").format("y [years], *M [months], d [days], h [hours], *m [minutes], s [seconds]", { trim: "both" }), "0 months, 1 day, 1 hour, 0 minutes");
        equal(moment.duration(86460, "seconds").format("y [years], *M [months], d [days], h [hours], m [minutes], s [seconds]", { trim: "both" }), "0 months, 1 day, 0 hours, 1 minute");
        equal(moment.duration(86460, "seconds").format("y [years], *M [months], d [days], h [hours], m [minutes], *s [seconds]", { trim: "both" }), "0 months, 1 day, 0 hours, 1 minute, 0 seconds");
        equal(moment.duration(1, "days").format("y [years], M [months]", { trim: "both" }), "0 months");
        equal(moment.duration(0, "days").format("M [months], d [days], h [hours], m [minutes]", { trim: "both" }), "0 minutes");
    });

    test("Trim both with largest", function () {
        equal(moment.duration(1.55, "days").format("M [months], d [days], h [hours], m [minutes], s [seconds]", { largest: 1, trim: "both" }), "1 day");
        equal(moment.duration(1.5, "days").format("M [months], d [days], h [hours], m [minutes], s [seconds]", { largest: 3, trim: "both" }), "1 day, 12 hours");
    });

    test("useSingular", function () {
        equal(moment.duration(0, "ms").format("S [milliseconds]"), "0 milliseconds");
		equal(moment.duration(1, "ms").format("S [milliseconds]"), "1 millisecond");
        equal(moment.duration(0, "ms").format("S [msecs]"), "0 msecs");
		equal(moment.duration(1, "ms").format("S [msecs]"), "1 msec");
        equal(moment.duration(1, "ms").format("S [milliseconds]", { useSingular: false }), "1 milliseconds");

        equal(moment.duration(0, "s").format("s [seconds]"), "0 seconds");
        equal(moment.duration(1, "s").format("s [seconds]"), "1 second");
        equal(moment.duration(0, "s").format("s [secs]"), "0 secs");
        equal(moment.duration(1, "s").format("s [secs]"), "1 sec");
        equal(moment.duration(1, "s").format("s [seconds]", { precision: 1 }), "1.0 seconds");
        equal(moment.duration(1, "s").format("s [seconds]", { useSingular: false }), "1 seconds");

        equal(moment.duration(0, "m").format("m [minutes]"), "0 minutes");
        equal(moment.duration(1, "m").format("m [minutes]"), "1 minute");
        equal(moment.duration(0, "m").format("m [mins]"), "0 mins");
        equal(moment.duration(1, "m").format("m [mins]"), "1 min");
        equal(moment.duration(1, "m").format("m [minutes]", { precision: 1 }), "1.0 minutes");
        equal(moment.duration(1, "m").format("m [minutes]", { useSingular: false }), "1 minutes");

        equal(moment.duration(0, "h").format("h [hours]"), "0 hours");
        equal(moment.duration(1, "h").format("h [hours]"), "1 hour");
        equal(moment.duration(0, "h").format("h [hrs]"), "0 hrs");
        equal(moment.duration(1, "h").format("h [hrs]"), "1 hr");
        equal(moment.duration(1, "h").format("h [hours]", { precision: 1 }), "1.0 hours");
        equal(moment.duration(1, "h").format("h [hours]", { useSingular: false }), "1 hours");

        equal(moment.duration(0, "d").format("d [days]"), "0 days");
        equal(moment.duration(1, "d").format("d [days]"), "1 day");
        equal(moment.duration(0, "d").format("d [dys]"), "0 dys");
        equal(moment.duration(1, "d").format("d [dys]"), "1 dy");
        equal(moment.duration(1, "d").format("d [days]", { precision: 1 }), "1.0 days");
        equal(moment.duration(1, "d").format("d [days]", { useSingular: false }), "1 days");

        equal(moment.duration(0, "w").format("w [weeks]"), "0 weeks");
        equal(moment.duration(1, "w").format("w [weeks]"), "1 week");
        equal(moment.duration(0, "w").format("w [wks]"), "0 wks");
        equal(moment.duration(1, "w").format("w [wks]"), "1 wk");
        equal(moment.duration(1, "w").format("w [weeks]", { precision: 1 }), "1.0 weeks");
        equal(moment.duration(1, "w").format("w [weeks]", { useSingular: false }), "1 weeks");

        equal(moment.duration(0, "months").format("M [months]"), "0 months");
        equal(moment.duration(1, "months").format("M [months]"), "1 month");
        equal(moment.duration(0, "months").format("M [mos]"), "0 mos");
        equal(moment.duration(1, "months").format("M [mos]"), "1 mo");
        equal(moment.duration(1, "months").format("M [months]", { precision: 1 }), "1.0 months");
        equal(moment.duration(1, "months").format("M [months]", { useSingular: false }), "1 months");

        equal(moment.duration(0, "y").format("y [years]"), "0 years");
        equal(moment.duration(1, "y").format("y [years]"), "1 year");
        equal(moment.duration(0, "y").format("y [yrs]"), "0 yrs");
        equal(moment.duration(1, "y").format("y [yrs]"), "1 yr");
        equal(moment.duration(1, "y").format("y [years]", { precision: 1 }), "1.0 years");
        equal(moment.duration(1, "y").format("y [years]", { useSingular: false }), "1 years");
	});

    test("useSingular, multiple tokens", function () {
        equal(moment.duration(3661, "s").format("h [hours], m [minutes], s [seconds]"), "1 hour, 1 minute, 1 second");
        equal(moment.duration(3661, "s").format("h [hours], m [minutes], s [seconds]", { useSingular: false }), "1 hours, 1 minutes, 1 seconds");
        equal(moment.duration(61, "s").format("m [minutes], s [seconds]", { precision: 1 }), "1 minute, 1.0 seconds");
    });

    test("useSingular with rounding", function () {
        equal(moment.duration(119, "seconds").format("m [minutes]")), "2 minutes");
    });

    test("Automatic Locale-based units", function () {
        equal(moment.duration(3661, "s").format("h _, m _, s _"), "1 hr, 1 min, 1 sec");
        equal(moment.duration(3661, "s").format("h _, m _, s _", { useSingular: false }), "1 hrs, 1 mins, 1 secs");
        equal(moment.duration(61, "s").format("m _, s _", { precision: 1 }), "1 min, 1.0 secs");
        equal(moment.duration(1, "milliseconds").format("S _"), "1 msec");
		equal(moment.duration(1, "seconds").format("s _"), "1 sec");
		equal(moment.duration(1, "minutes").format("m _"), "1 min");
		equal(moment.duration(1, "hours").format("h _"), "1 hr");
		equal(moment.duration(1, "days").format("d _"), "1 dy");
		equal(moment.duration(1, "weeks").format("w _"), "1 wk");
		equal(moment.duration(1, "months").format("M _"), "1 mo");
		equal(moment.duration(1, "years").format("y _"), "1 yr");

        equal(moment.duration(1, "milliseconds").format("S __"), "1 millisecond");
		equal(moment.duration(1, "seconds").format("s __"), "1 second");
		equal(moment.duration(1, "minutes").format("m __"), "1 minute");
		equal(moment.duration(1, "hours").format("h __"), "1 hour");
		equal(moment.duration(1, "days").format("d __"), "1 day");
		equal(moment.duration(1, "weeks").format("w __"), "1 week");
		equal(moment.duration(1, "months").format("M __"), "1 month");
		equal(moment.duration(1, "years").format("y __"), "1 year");
    });

    test("Automatic Locale-based time notation", function () {
        equal(moment.duration(3661, "seconds").format("_HMS_"), "1:01:01");
        equal(moment.duration(3661, "seconds").format("_HM_"), "1:01");
        equal(moment.duration(61, "seconds").format("_MS_"), "1:01");
    });

    test("Locale missing durations and durationsShort", function () {
        moment.locale('fr', {
            months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
            monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
            monthsParseExact : true,
            weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
            weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
            weekdaysMin : 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
            weekdaysParseExact : true,
            longDateFormat : {
                LT : 'HH:mm',
                LTS : 'HH:mm:ss',
                L : 'DD/MM/YYYY',
                LL : 'D MMMM YYYY',
                LLL : 'D MMMM YYYY HH:mm',
                LLLL : 'dddd D MMMM YYYY HH:mm'
            },
            calendar : {
                sameDay : '[Aujourd’hui à] LT',
                nextDay : '[Demain à] LT',
                nextWeek : 'dddd [à] LT',
                lastDay : '[Hier à] LT',
                lastWeek : 'dddd [dernier à] LT',
                sameElse : 'L'
            },
            relativeTime : {
                future : 'dans %s',
                past : 'il y a %s',
                s : 'quelques secondes',
                m : 'une minute',
                mm : '%d minutes',
                h : 'une heure',
                hh : '%d heures',
                d : 'un jour',
                dd : '%d jours',
                M : 'un mois',
                MM : '%d mois',
                y : 'un an',
                yy : '%d ans'
            },
            dayOfMonthOrdinalParse : /\d{1,2}(er|e)/,
            ordinal : function (number) {
                return number + (number === 1 ? 'er' : 'e');
            },
            meridiemParse : /PD|MD/,
            isPM : function (input) {
                return input.charAt(0) === 'M';
            },
            // In case the meridiem units are not separated around 12, then implement
            // this function (look at locale/id.js for an example).
            // meridiemHour : function (hour, meridiem) {
            //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
            // },
            meridiem : function (hours, minutes, isLower) {
                return hours < 12 ? 'PD' : 'MD';
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }
        });
        equal(moment.duration(3661, "s").format("h _, m _, s _"), "1 hr, 1 min, 1 sec");
        equal(moment.duration(3661, "s").format("h __, m __, s __"), "1 hours, 1 minutes, 1 seconds");
        equal(moment.duration(3661, "seconds").format("_HMS_"), "1:01:01");
        equal(moment.duration(3661, "seconds").format("_HM_"), "1:01");
        equal(moment.duration(61, "seconds").format("_MS_"), "1:01");
        moment.locale("en");
    });

    test("useLeftUnits", function () {
        equal(moment.duration(0, "s").format("[seconds] s", { useLeftUnits: true }), "seconds 0");
        equal(moment.duration(1, "s").format("[seconds] s", { useLeftUnits: true }), "second 1");
        equal(moment.duration(0, "s").format("__ s", { useLeftUnits: true }), "seconds 0");
        equal(moment.duration(1, "s").format("__ s", { useLeftUnits: true }), "second 1");
        equal(moment.duration(0, "s").format("_ s", { useLeftUnits: true }), "secs 0");
        equal(moment.duration(1, "s").format("_ s", { useLeftUnits: true }), "sec 1");
        equal(moment.duration(1, "s").format("[seconds] s", { precision: 1, useLeftUnits: true }), "seconds 1.0");
        equal(moment.duration(1, "s").format("[seconds] s", { useSingular: false, useLeftUnits: true }), "seconds 1");
        equal(moment.duration(3661, "s").format("[hours] h, [minutes] m, [seconds] s", { useLeftUnits: true }), "hour 1, minute 1, second 1");
        equal(moment.duration(3661, "s").format("[hours] h, [minutes] m, [seconds] s", { useSingular: false, useLeftUnits: true }), "hours 1, minutes 1, seconds 1");
        equal(moment.duration(61, "s").format("[minutes] m, [seconds] s", { precision: 1, useLeftUnits: true }), "minute 1, seconds 1.0");
        equal(moment.duration(61, "minutes").format("__ d, __ h, __ m, __ s", { useLeftUnits: true, trim: "both" }), "hour 1, minute 1");
        equal(moment.duration(61, "minutes").format("__ s, __ m, __ h, __ d", { useLeftUnits: true, trim: "both" }), "minute 1, hour 1");
        equal(moment.duration(61, "minutes").format("__ s, __ m, __ h, __ d", { useLeftUnits: true, trim: "both", largest: 1 }), "hour 1");
    });

    test("userLocale and useGrouping", function () {
		equal(moment.duration(100000.1, "seconds").format("s", { userLocale: "en-GB", precision: 2 }), "100,000.10");
        equal(moment.duration(100000.1, "seconds").format("s", { userLocale: "en-GB", precision: 2, useGrouping: false }), "100000.10");
        equal(moment.duration(100000.1, "seconds").format("s", { userLocale: "de-DE", precision: 2 }), "100.000,10");
        equal(moment.duration(100000.1, "seconds").format("s", { userLocale: "de-DE", precision: 2, useGrouping: false }), "100000,10");
        equal(moment.duration(100000.1, "seconds").format("s", { userLocale: "en", precision: 2 }), "100,000.10");
	});

    test("useSignificantDigits", function () {
		equal(moment.duration(99999, "seconds").format("s", { useSignificantDigits: true, precision: 2 }), "100,000");
        equal(moment.duration(99.99, "seconds").format("s", { useSignificantDigits: true, precision: 3 }), "100");
        equal(moment.duration(99.9944, "seconds").format("s", { useSignificantDigits: true, precision: 5 }), "99.994");
        equal(moment.duration(99.944, "seconds").format("m [minutes], s [seconds]", { useSignificantDigits: true, precision: 3 }), "1 minute, 40 seconds");
        equal(moment.duration(99.944, "seconds").format("m [minutes], s [seconds]", { useSignificantDigits: true, precision: 5 }), "1 minute, 39.94 seconds");
        equal(moment.duration(99999, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", { useSignificantDigits: true, precision: 3 }), "1 day, 3 hours, 50 minutes");
        equal(moment.duration(99999, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", { useSignificantDigits: true, precision: 5 }), "1 day, 3 hours, 46 minutes, 40 seconds");
        equal(moment.duration(99999, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", { useSignificantDigits: true, precision: 6 }), "1 day, 3 hours, 46 minutes, 39 seconds");
        equal(moment.duration(35, "hours").format("d [days], h [hours], m [minutes], s [seconds]", { useSignificantDigits: true, precision: 2 }), "1 day, 10 hours");
        equal(moment.duration(39, "hours").format("d [days], h [hours], m [minutes], s [seconds]", { useSignificantDigits: true, precision: 2 }), "1 day, 20 hours");
	});

    test("useSignificantDigits and trunc", function () {
        equal(moment.duration(99.99, "seconds").format("s", { useSignificantDigits: true, trunc: true, precision: 3 }), "99.9");
        equal(moment.duration(99.944, "seconds").format("m [minutes], s [seconds]", { useSignificantDigits: true, trunc: true, precision: 3 }), "1 minute, 39 seconds");
        equal(moment.duration(99999, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", { useSignificantDigits: true, trunc: true, precision: 5 }), "1 day, 3 hours, 46 minutes, 30 seconds");
        equal(moment.duration(99999, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", { useSignificantDigits: true, trunc: true, precision: 3 }), "1 day, 3 hours, 40 minutes");
        equal(moment.duration(35, "hours").format("d [days], h [hours], m [minutes], s [seconds]", { useSignificantDigits: true, trunc: true, precision: 2 }), "1 day, 10 hours");
        equal(moment.duration(39, "hours").format("d [days], h [hours], m [minutes], s [seconds]", { useSignificantDigits: true, trunc: true, precision: 2 }), "1 day, 10 hours");
    });

    test("Documentation examples", function () {
        equal(moment.duration(123, "minutes").format(), "2:03:00");
        equal(moment.duration(123, "months").format(), "10y 3m");
        equal(moment.duration(123, "minutes").format("h:mm"), "2:03");
        equal(moment.duration(123, "minutes").format("h [hrs], m [min]"), "2 hrs, 3 min");
        equal(moment.duration(3661, "seconds").format("h:mm:ss"), "1:01:01");
        equal(moment.duration(15, "seconds").format("ssss [s]"), "0015 s");
        equal(moment.duration(123, "minutes").format("h [hrs]"), "2 hrs");
        equal(moment.duration(123, "minutes").format("h [hrs]", 2), "2.04 hrs");
        equal(moment.duration(223, "minutes").format("m [min]", -2), "200 min");
        equal(moment.duration(123, "minutes").format({ template: "h [hrs]", precision: 2 }), "2.04 hrs");
        equal(moment.duration(123, "minutes").format("s [seconds], m [minutes], h [hours], d [days]"), "0 seconds, 3 minutes, 2 hours");
        equal(moment.duration(123, "minutes").format("d[d] h:mm:ss", { trim: false }), "0d 2:03:00");
        equal(moment.duration(123, "minutes").format("d[d] h:mm:ss"), "2:03:00");
        equal(moment.duration(123, "minutes").format("d[d] h:mm:ss", { trim: "large" }), "2:03:00");
        equal(moment.duration(0, "minutes").format("d[d] h:mm:ss", { trim: "large" }), "0");
        equal(moment.duration(123, "minutes").format("d[d] h:mm:ss", { trim: "small" }), "0d 2:03");
        equal(moment.duration(0, "minutes").format("d[d] h:mm:ss", { trim: "small" }), "0d");
        equal(moment.duration(123, "minutes").format("d[d] h[h] m[m] s[s]", { trim: "both" }), "2h 3m");
        equal(moment.duration(0, "minutes").format("d[d] h[h] m[m] s[s]", { trim: "both" }), "0s");
        equal(moment.duration(1441, "minutes").format("w[w] d[d] h[h] m[m] s[s]", { trim: "mid" }), "0w 1d 1m 0s");
        equal(moment.duration(1441, "minutes").format("w[w] d[d] h[h] m[m] s[s]", { trim: "large mid" }), "1d 1m 0s");
        equal(moment.duration(1441, "minutes").format("w[w] d[d] h[h] m[m] s[s]", { trim: "small mid" }), "0w 1d 1m");
        equal(moment.duration(1441, "minutes").format("w[w] d[d] h[h] m[m] s[s]", { trim: "both mid" }), "1d 1m");
        equal(moment.duration(0, "minutes").format("w[w] d[d] h[h] m[m] s[s]", { trim: "both mid" }), "0s");
        equal(moment.duration(0, "minutes").format("d[d] h:mm:ss", { trim: "large final" }), "");
        equal(moment.duration(0, "minutes").format("d[d] h:mm:ss", { trim: "small final" }), "");
        equal(moment.duration(0, "minutes").format("d[d] h[h] m[m] s[s]", { trim: "both final" }), "");
        equal(moment.duration(0, "minutes").format("d[d] h[h] m[m] s[s]", { trim: "all" }), "");
        equal(moment.duration(7322, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", { largest: 2 }), "2 hours, 2 minutes");
        equal(moment.duration(1216922, "seconds").format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]", { largest: 2 }), "2 weeks, 2 hours");
        equal(moment.duration(23, "minutes").format("d[d] h:mm:ss", { stopTrim: "h" }), "0:03:00");
        equal(moment.duration(23, "minutes").format("d[d] *h:mm:ss"), "0:03:00");
        equal(moment.duration(2, "hours").format("y [years], d [days], h [hours], m [minutes], s [seconds]", { trim: "both", stopTrim: "d m" }), "0 days, 2 hours, 0 minutes");
        equal(moment.duration(2, "hours").format("y [years], *d [days], h [hours], *m [minutes], s [seconds]", { trim: "both" }), "0 days, 2 hours, 0 minutes");
        equal(moment.duration(2, "hours").format("y [years], d [days], h [hours], m [minutes], s [seconds]", { trim: "both", stopTrim: "d m", largest: 2 }), "2 hours");
        equal(moment.duration(179, "seconds").format("m [minutes]"), "3 minutes");
        equal(moment.duration(3780, "seconds").format("h [hours]", 1), "1.1 hours");
        equal(moment.duration(179, "seconds").format("m [minutes]", { trunc: true }), "2 minutes");
        equal(moment.duration(3780, "seconds").format("h [hours]", 1, { trunc: true }), "1.0 hours");
        equal(moment.duration(59, "seconds").format("d [days], h [hours], m [minutes]", { trunc: true, trim: "both" }), "0 minutes");
        equal(moment.duration(59, "seconds").format("d [days], h [hours], m [minutes]", { trunc: true, trim: "all" }), "");
        equal(moment.duration(59, "seconds").format("d [days], h [hours], m [minutes]", { trunc: true, largest: 1 }), "");
        equal(moment.duration(123, "seconds").format("h:mm:ss"), "2:03");
        equal(moment.duration(123, "seconds").format("hh:mm:ss"), "02:03");
        equal(moment.duration(123, "seconds").format("h:mm:ss", { forceLength: true }), "02:03");
        equal(moment.duration(1234567, "seconds").format("m [minutes]", 3), "20,576.117 minutes");
        equal(moment.duration(1, "minutes").format("m [minutes]"), "1 minute");
        equal(moment.duration(1, "minutes").format("m [mins]"), "1 min");
        equal(moment.duration(1, "minutes").format("m [minutes]", { useSingular: false }), "1 minutes");
        equal(moment.duration(1, "minutes").format("m [mins]", { useSingular: false }), "1 mins");
        equal(moment.duration(1, "minutes").format("m [minutes]", 2), "1.00 minutes");
        equal(moment.duration(7322, "seconds").format("_ h, _ m, _ s", { useLeftUnits: true }), "hrs 2, mins 2, secs 2");
        equal(moment.duration(1234, "seconds").format("s [seconds]"), "1,234 seconds");
        equal(moment.duration(1234, "seconds").format("s [seconds]", { useGrouping: false }), "1234 seconds");
        equal(moment.duration(1234567, "seconds").format("m [minutes]", 3, { userLocale: "de-DE" }), "20.576,117 minutes");
    });

    test("minValue and maxValue", function () {
        equal(moment.duration(59, "seconds").format("h [hours], m [minutes]", { minValue: 1 }), "< 1 minute");
        equal(moment.duration(59, "seconds").format("h [hours], m [minutes]", { minValue: 1, trim: "both" }), "< 1 minute");
        equal(moment.duration(3629, "seconds").format("h [hours], m [minutes]", { minValue: 1, trim: "both" }), "1 hour");
        equal(moment.duration(59, "seconds").format("h [hours], m [minutes]", { minValue: 1, trunc: true, trim: "all" }), "");
        equal(moment.duration(-59, "seconds").format("h [hours], m [minutes]", { minValue: 1 }), "> -1 minute");
        equal(moment.duration(59, "seconds").format("h [hours], m [minutes]", { minValue: 1, trim: false, largest: 2 }), "< 1 minute");
        equal(moment.duration(15, "days").format("w [weeks]", { maxValue: 2 }), "> 2 weeks");
        equal(moment.duration(-15, "days").format("w [weeks]]", { maxValue: 2 }), "< -2 weeks");
        equal(moment.duration(15, "days").format("w [weeks], d [days]", { maxValue: 2, trim: false, largest: 2 }), "> 2 weeks");
    });

    // tests TODO:
    // floating point errors

    // largest with precision and sig figs.
    // What happens when largest could be `1 day 0.5 hours` instead of `1 day 30 minutes`.

    // Add API to output `<1 minute` (and even `>1 minute`?)

    // Default format function docs and tests. Disambiguify based on magnitude of duration. See https://github.com/jsmreese/moment-duration-format/issues/14

    // document trimming of leading/trailing dot (.), space, colon, or comma
});
