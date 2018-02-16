module("moment.duration.fn.format");
moment.duration.fn.format.defaults.userLocale = "en-US";

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

test("Token length when `trim: false`", function () {
    equal(moment.duration(1, 'seconds').format('hh:mm:ss', { trim: false }), "00:00:01");
    equal(moment.duration(1, 'seconds').format('h:mm:ss', { trim: false }), "0:00:01");
    equal(moment.duration(1, 'minutes').format('hh:mm:ss', { trim: false }), "00:01:00");
    equal(moment.duration(1, 'minutes').format('h:mm:ss', { trim: false }), "0:01:00");
    equal(moment.duration(1, 'minutes').format('hh:mm:ss'), "01:00");
    equal(moment.duration(1, 'minutes').format('h:mm:ss'), "1:00");
});

test("Trim errors from years/months to weeks/days", function () {
    equal(moment.duration(1, "year").format("y [years], d [days], h [hours]"), "1 year, 0 days, 0 hours");
    equal(moment.duration(1, "year").format("y [years], M [months], d [days], h [hours]"), "1 year, 0 months, 0 days, 0 hours");
    equal(moment.duration(1, "year").format("y [years], w [weeks], d [days], h [hours]"), "1 year, 0 weeks, 0 days, 0 hours");
    equal(moment.duration(1, "year").format("y [years], h [hours]"), "1 year, 0 hours");
    equal(moment.duration(1, "month").format("M [months], d [days]"), "1 month, 0 days");
    equal(moment.duration(1, "month").format("M [months], w [weeks]"), "1 month, 0 weeks");
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
    equal(moment.duration(15, "seconds").format("ssss sss ss s", { useGrouping: false }), "0015 0015 0015 0015");
    equal(moment.duration(15, "seconds").format("s ss sss ssss"), "15 15 15 15");
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
	equal(moment.duration(123, "seconds").format("s s ssssss"), "123 123 123");
    equal(moment.duration(123, "seconds").format("ssssss s s"), "000,123 000,123 000,123");
});

test("Escape Tokens", function () {
	equal(moment.duration(123, "seconds").format("[All] [tokens] [escaped]"), "All tokens escaped");
	equal(moment.duration(123, "seconds").format("s[s]"), "123s");
});

test("All Moment Tokens", function () {
	// obviously a duration of 100,000,000,013 ms will vary in the number of days based on leap years, etc.
	// this test ensures the internal duration/format math remains consistent
	equal(moment.duration(100000000013, "ms").format("y[y] M[mo] w[w] d[d] h[h] m[m] s[s] S[ms]"), "3y 2mos 0w 0d 9h 46m 40s 13ms");
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
	equal(moment.duration(1234.54, "hours").format({
		template: "d [days], h [hours]",
		precision: 1
	}), "51 days, 10.5 hours");
});

test("Floating point errors", function () {
    equal(moment.duration(3.55, "hours").format("h", 1), "3.6");
});

test("Floating point errors from Moment.js output", function () {
    equal(moment.duration(123.55, "hours").format("d[d] h[h]", 1), "5d 3.6h");
    equal(moment.duration(123.55, "hours").format("d[d] h[h]", 1, { useToLocaleString: false }), "5d 3.6h");
    equal(moment.duration(1234.55, "hours").format({
        template: "d [days], h [hours]",
        precision: 1,
        useToLocaleString: false
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
	equal(moment.duration(100, "milliseconds").format(), "100 milliseconds");
	equal(moment.duration(100, "seconds").format(), "1:40");
	equal(moment.duration(100, "minutes").format(), "1:40:00");
	equal(moment.duration(100, "hours").format(), "4 days, 4 hours");
	equal(moment.duration(100, "days").format(), "3 months, 9 days");
	equal(moment.duration(100, "weeks").format(), "1 year, 10 months, 30 days");
	equal(moment.duration(100, "months").format(), "8 years, 4 months");
	equal(moment.duration(100, "years").format(), "100 years");
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

    function customTemplate() {
        return this.duration.asSeconds() >= 86400 ? "w [weeks], d [days]" : "hh:mm:ss";
    }

    equal(moment.duration(65, 'seconds').format(customTemplate, {
        trim: false
    }), "00:01:05");

    equal(moment.duration(1347840, 'seconds').format(customTemplate, {
        trim: false
    }), "2 weeks, 2 days");
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
    equal(moment.duration(-600, 'seconds').format('hh:mm', {stopTrim: 'h m', forceLength: true}), "-00:10");
});

test("Negative Durations that have zero value", function () {
    equal(moment.duration(-29, "seconds").format("m"), "0");
    equal(moment.duration(-30, "seconds").format("m"), "-1");
    equal(moment.duration(-30, "seconds").format("m", { trunc: true }), "0");
    equal(moment.duration(-59, "seconds").format("m", { trunc: true }), "0");
});

test("Negative Durations with leading text", function () {
	equal(moment.duration(-42, "seconds").format("[Leading Text] s", { trim: false }), "Leading Text -42");
});

test("Negative Durations and Trimming", function () {
	equal(moment.duration(-42, "seconds").format("h:mm:ss"), "-42");
    equal(moment.duration(-360000, "milliseconds").format("hh:mm", { trim: false }), "-00:06");
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
    equal(moment.duration(1454.4, "minutes").format("d [days], h [hours], m [minutes], s [seconds]", { largest: 2 }), "1 day");
    equal(moment.duration(1454.4, "minutes").format("d [days], h [hours], m [minutes], s [seconds]", { largest: 2, trim: false }), "1 day, 0 hours");
    equal(moment.duration(1454.4, "minutes").format("d [days], h [hours], m [minutes], s [seconds]", { largest: 3 }), "1 day, 14 minutes");
    equal(moment.duration(1454.4, "minutes").format("d [days], h [hours], m [minutes], s [seconds]", { largest: 3, trim: false }), "1 day, 0 hours, 14 minutes");
    equal(moment.duration(1216800, "seconds").format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]", {
        largest: 3,
        trim: "both"
    }), "2 weeks, 0 days, 2 hours");

    equal(moment.duration(1216800, "seconds").format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]", {
        largest: 3,
        trim: "both",
        stopTrim: "m"
    }), "2 weeks, 0 days, 2 hours");

    equal(moment.duration(1216800, "seconds").format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]", {
        largest: 4,
        trim: false
    }), "2 weeks, 0 days, 2 hours, 0 minutes");

    equal(moment.duration(7322, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", {
        largest: 2
    }), "2 hours, 2 minutes");

    equal(moment.duration(1216800, "seconds").format("y [years], w [weeks], d [days], h [hours], m [minutes], s [seconds]", {
        largest: 3
    }), "2 weeks, 2 hours");
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

test("usePlural", function () {
    equal(moment.duration(0, "ms").format("S [milliseconds]"), "0 milliseconds");
	equal(moment.duration(1, "ms").format("S [milliseconds]"), "1 millisecond");
    equal(moment.duration(0, "ms").format("S [msecs]"), "0 msecs");
	equal(moment.duration(1, "ms").format("S [msecs]"), "1 msec");
    equal(moment.duration(1, "ms").format("S [milliseconds]", { usePlural: false }), "1 milliseconds");

    equal(moment.duration(0, "s").format("s [seconds]"), "0 seconds");
    equal(moment.duration(1, "s").format("s [seconds]"), "1 second");
    equal(moment.duration(0, "s").format("s [secs]"), "0 secs");
    equal(moment.duration(1, "s").format("s [secs]"), "1 sec");
    equal(moment.duration(1, "s").format("s [seconds]", { precision: 1 }), "1.0 seconds");
    equal(moment.duration(1, "s").format("s [seconds]", { usePlural: false }), "1 seconds");

    equal(moment.duration(0, "m").format("m [minutes]"), "0 minutes");
    equal(moment.duration(1, "m").format("m [minutes]"), "1 minute");
    equal(moment.duration(0, "m").format("m [mins]"), "0 mins");
    equal(moment.duration(1, "m").format("m [mins]"), "1 min");
    equal(moment.duration(1, "m").format("m [minutes]", { precision: 1 }), "1.0 minutes");
    equal(moment.duration(1, "m").format("m [minutes]", { usePlural: false }), "1 minutes");

    equal(moment.duration(0, "h").format("h [hours]"), "0 hours");
    equal(moment.duration(1, "h").format("h [hours]"), "1 hour");
    equal(moment.duration(0, "h").format("h [hrs]"), "0 hrs");
    equal(moment.duration(1, "h").format("h [hrs]"), "1 hr");
    equal(moment.duration(1, "h").format("h [hours]", { precision: 1 }), "1.0 hours");
    equal(moment.duration(1, "h").format("h [hours]", { usePlural: false }), "1 hours");

    equal(moment.duration(0, "d").format("d [days]"), "0 days");
    equal(moment.duration(1, "d").format("d [days]"), "1 day");
    equal(moment.duration(0, "d").format("d [dys]"), "0 dys");
    equal(moment.duration(1, "d").format("d [dys]"), "1 dy");
    equal(moment.duration(1, "d").format("d [days]", { precision: 1 }), "1.0 days");
    equal(moment.duration(1, "d").format("d [days]", { usePlural: false }), "1 days");

    equal(moment.duration(0, "w").format("w [weeks]"), "0 weeks");
    equal(moment.duration(1, "w").format("w [weeks]"), "1 week");
    equal(moment.duration(0, "w").format("w [wks]"), "0 wks");
    equal(moment.duration(1, "w").format("w [wks]"), "1 wk");
    equal(moment.duration(1, "w").format("w [weeks]", { precision: 1 }), "1.0 weeks");
    equal(moment.duration(1, "w").format("w [weeks]", { usePlural: false }), "1 weeks");
});

test("usePlural Months and Years", function () {
    equal(moment.duration(0, "months").format("M [months]"), "0 months");
    equal(moment.duration(1, "months").format("M [months]"), "1 month");
    equal(moment.duration(0, "months").format("M [mos]"), "0 mos");
    equal(moment.duration(1, "months").format("M [mos]"), "1 mo");
    equal(moment.duration(1, "months").format("M [months]", { precision: 1 }), "1.0 months");
    equal(moment.duration(1, "months").format("M [months]", { usePlural: false }), "1 months");

    equal(moment.duration(0, "y").format("y [years]"), "0 years");
    equal(moment.duration(1, "y").format("y [years]"), "1 year");
    equal(moment.duration(0, "y").format("y [yrs]"), "0 yrs");
    equal(moment.duration(1, "y").format("y [yrs]"), "1 yr");
    equal(moment.duration(1, "y").format("y [years]", { precision: 1 }), "1.0 years");
    equal(moment.duration(1, "y").format("y [years]", { usePlural: false }), "1 years");
});

test("usePlural, multiple tokens", function () {
    equal(moment.duration(3661, "s").format("h [hours], m [minutes], s [seconds]"), "1 hour, 1 minute, 1 second");
    equal(moment.duration(3661, "s").format("h [hours], m [minutes], s [seconds]", { usePlural: false }), "1 hours, 1 minutes, 1 seconds");
    equal(moment.duration(61, "s").format("m [minutes], s [seconds]", { precision: 1 }), "1 minute, 1.0 seconds");
});

test("usePlural with rounding", function () {
    equal(moment.duration(119, "seconds").format("m [minutes]"), "2 minutes");
    equal(moment.duration(1.25, "s").format("s [secs]"), "1 sec");
    equal(moment.duration(1.5, "s").format("s [secs]"), "2 secs");
    equal(moment.duration(1.75, "s").format("s [secs]"), "2 secs");
    equal(moment.duration(2, "s").format("s [secs]"), "2 secs");
});

test("Automatic Locale-based units", function () {
    equal(moment.duration(3661, "s").format("h _, m _, s _"), "1 hr, 1 min, 1 sec");
    equal(moment.duration(3661, "s").format("h _, m _, s _", { usePlural: false }), "1 hr, 1 min, 1 sec");
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

test("Locale missing durations labels", function () {
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
    equal(moment.duration(3661, "s").format("h __, m __, s __"), "1 hour, 1 minute, 1 second");
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
    equal(moment.duration(1, "s").format("[seconds] s", { usePlural: false, useLeftUnits: true }), "seconds 1");
    equal(moment.duration(3661, "s").format("[hours] h, [minutes] m, [seconds] s", { useLeftUnits: true }), "hour 1, minute 1, second 1");
    equal(moment.duration(3661, "s").format("[hours] h, [minutes] m, [seconds] s", { usePlural: false, useLeftUnits: true }), "hours 1, minutes 1, seconds 1");
    equal(moment.duration(61, "s").format("[minutes] m, [seconds] s", { precision: 1, useLeftUnits: true }), "minute 1, seconds 1.0");
    equal(moment.duration(61, "minutes").format("__ d, __ h, __ m, __ s", { useLeftUnits: true, trim: "both" }), "hour 1, minute 1");
    equal(moment.duration(61, "minutes").format("__ s, __ m, __ h, __ d", { useLeftUnits: true, trim: "both" }), "minute 1, hour 1");
    equal(moment.duration(61, "minutes").format("__ s, __ m, __ h, __ d", { useLeftUnits: true, trim: "both", largest: 1 }), "hour 1");
});

test("userLocale and useGrouping", function () {
	equal(moment.duration(100000.1, "seconds").format("s", { userLocale: "en-GB", precision: 2 }), "100,000.10");
    equal(moment.duration(100000.1, "seconds").format("s", { userLocale: "en-GB", precision: 2, useGrouping: false }), "100000.10");
    equal(moment.duration(100000.1, "seconds").format("s", { userLocale: "de-DE", precision: 2, decimalSeparator: ",", groupingSeparator: "." }), "100.000,10");
    equal(moment.duration(100000.1, "seconds").format("s", { userLocale: "de-DE", precision: 2, useGrouping: false, decimalSeparator: "," }), "100000,10");
    equal(moment.duration(100000.1, "seconds").format("s", { userLocale: "en", precision: 2 }), "100,000.10");
});

test("useSignificantDigits", function () {
    equal(moment.duration(0, "seconds").format("s", { useSignificantDigits: true, precision: 0 }), "0");
    equal(moment.duration(0, "seconds").format("s", { useSignificantDigits: true, precision: 0, useToLocaleString: false }), "0");
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
    equal(moment.duration(39, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", { useSignificantDigits: true, precision: 2 }), "39 seconds");
    equal(moment.duration(39, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", { useSignificantDigits: true, precision: 1 }), "40 seconds");
    equal(moment.duration(12.55, "hours").format("h:mm", {
        precision: 2,
        useSignificantDigits: true,
        trim: false
    }),
    "13:00");
});

test("useSignificantDigits and trunc", function () {
    equal(moment.duration(99.99, "seconds").format("s", { useSignificantDigits: true, trunc: true, precision: 3 }), "99.9");
    equal(moment.duration(99.944, "seconds").format("m [minutes], s [seconds]", { useSignificantDigits: true, trunc: true, precision: 3 }), "1 minute, 39 seconds");
    equal(moment.duration(99999, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", { useSignificantDigits: true, trunc: true, precision: 5 }), "1 day, 3 hours, 46 minutes, 30 seconds");
    equal(moment.duration(99999, "seconds").format("d [days], h [hours], m [minutes], s [seconds]", { useSignificantDigits: true, trunc: true, precision: 3 }), "1 day, 3 hours, 40 minutes");
    equal(moment.duration(35, "hours").format("d [days], h [hours], m [minutes], s [seconds]", { useSignificantDigits: true, trunc: true, precision: 2 }), "1 day, 10 hours");
    equal(moment.duration(39, "hours").format("d [days], h [hours], m [minutes], s [seconds]", { useSignificantDigits: true, trunc: true, precision: 2 }), "1 day, 10 hours");
    equal(moment.duration(12.55, "hours").format("h:mm", {
        precision: 2,
        useSignificantDigits: true,
        trim: false,
        trunc: true
    }), "12:00");
});

test("useSignificantDigits and trim: false", function () {
    equal(moment.duration(10, "seconds").format("h[h] m[m] s[s]",
    { useSignificantDigits: true, trim: false }), "0h 0m 10s");
    equal(moment.duration(10, "seconds").format("h[h] m[m] s[s]",
    { useSignificantDigits: true, precision: 4, trim: false }), "0h 0m 10s");
});

test("Documentation examples", function () {
    equal(moment.duration(123, "minutes").format(), "2:03:00");
    equal(moment.duration(123, "months").format(), "10 years, 3 months");
    equal(moment.duration(123, "minutes").format("h:mm"), "2:03");
    equal(moment.duration(123, "minutes").format("h [hrs], m [min]"), "2 hrs, 3 mins");
    equal(moment.duration(3661, "seconds").format("h:mm:ss"), "1:01:01");
    equal(moment.duration(15, "seconds").format("sss [s]"), "015 s");
    equal(moment.duration(123, "minutes").format("h [hrs]"), "2 hrs");
    equal(moment.duration(123, "minutes").format("h [hrs]", 2), "2.05 hrs");
    equal(moment.duration(223, "minutes").format("m [min]", -2), "200 mins");
    equal(moment.duration(123, "minutes").format({ template: "h [hrs]", precision: 2 }), "2.05 hrs");
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

    equal(moment.duration(23, "minutes").format("d[d] h:mm:ss", { stopTrim: "h" }), "0:23:00");
    equal(moment.duration(23, "minutes").format("d[d] *h:mm:ss"), "0:23:00");
    equal(moment.duration(2, "hours").format("y [years], d [days], h [hours], m [minutes], s [seconds]", { trim: "both", stopTrim: "d m" }), "0 days, 2 hours, 0 minutes");
    equal(moment.duration(2, "hours").format("y [years], *d [days], h [hours], *m [minutes], s [seconds]", { trim: "both" }), "0 days, 2 hours, 0 minutes");
    equal(moment.duration(2, "hours").format("y [years], d [days], h [hours], m [minutes], s [seconds]", { trim: "both", stopTrim: "d m", largest: 2 }), "0 days, 2 hours");
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
    equal(moment.duration(1, "minutes").format("m [minutes]", { usePlural: false }), "1 minutes");
    equal(moment.duration(1, "minutes").format("m [mins]", { usePlural: false }), "1 mins");
    equal(moment.duration(1, "minutes").format("m [minutes]", 2), "1.00 minutes");
    equal(moment.duration(7322, "seconds").format("_ h, _ m, _ s", { useLeftUnits: true }), "hrs 2, mins 2, secs 2");
    equal(moment.duration(1234, "seconds").format("s [seconds]"), "1,234 seconds");
    equal(moment.duration(1234, "seconds").format("s [seconds]", { useGrouping: false }), "1234 seconds");
    equal(moment.duration(1234567, "seconds").format("m [minutes]", 3, { userLocale: "de-DE", decimalSeparator: ",", groupingSeparator: "." }), "20.576,117 minutes");
});

test("Pluralize singular unit labels", function () {
    equal(moment.duration(2, "minutes").format("m [minute]"), "2 minutes");

    equal(moment.duration(2, "minutes").format("m [min]"), "2 mins");

    equal(moment.duration(2, "minutes").format("m [minute]", {
        usePlural: false
    }), "2 minute");

    equal(moment.duration(2, "minutes").format("m [min]", {
        usePlural: false
    }), "2 min");
});

test("minValue", function () {
    equal(moment.duration(59, "seconds").format("h [hours], m [minutes]", { minValue: 1 }), "< 1 minute");
    equal(moment.duration(59, "seconds").format("h [hours], m [minutes]", { minValue: 1, trim: "both" }), "< 1 minute");
    equal(moment.duration(3629, "seconds").format("h [hours], m [minutes]", { minValue: 1, trim: "both" }), "1 hour");
    equal(moment.duration(59, "seconds").format("h [hours], m [minutes]", { minValue: 1, trunc: true, trim: "all" }), "< 1 minute");
    equal(moment.duration(-59, "seconds").format("h [hours], m [minutes]", { minValue: 1 }), "> -1 minute");
    equal(moment.duration(59, "seconds").format("h [hours], m [minutes]", { minValue: 1, trim: false, largest: 2 }), "< 1 minute");
    equal(moment.duration(59, "seconds").format("h [hours], m [minutes]", {
        minValue: 1,
        trim: false
    }), "< 0 hours, 1 minute");
    equal(moment.duration(60, "seconds").format("m:ss", { minValue: 60 }), "1:00");
    equal(moment.duration(61, "seconds").format("m:ss", { minValue: 60 }), "1:01");
    equal(moment.duration(59, "seconds").format("m:ss", { minValue: 60 }), "< 1:00");
    equal(moment.duration(3600, "seconds").format("h:mm:ss", { minValue: 3600 }), "1:00:00");
    equal(moment.duration(3599, "seconds").format("h:mm:ss", { minValue: 3600 }), "< 1:00:00");
    equal(moment.duration(-60, "seconds").format("m:ss", { minValue: 60 }), "-1:00");
    equal(moment.duration(89, "seconds").format("m", {
        minValue: 1.5,
        precision: 1
    }), "< 1.5");
    equal(moment.duration(90, "seconds").format("m", {
        minValue: 1.5,
        precision: 1
    }), "1.5");
});

test("maxValue", function () {
    equal(moment.duration(15, "days").format("w [weeks]", { maxValue: 2 }), "> 2 weeks");
    equal(moment.duration(-15, "days").format("w [weeks]", { maxValue: 2 }), "< -2 weeks");
    equal(moment.duration(10.01, "minutes").format("m:ss", { maxValue: 10, trim: false }), "> 10:00");
    equal(moment.duration(10.01, "minutes").format("m:ss", { maxValue: 10, trim: "large" }), "> 10:00");
    equal(moment.duration(10.01, "minutes").format("m:ss", { maxValue: 10, trim: "all" }), "> 10");
    equal(moment.duration(15, "days").format("w [weeks], d [days]", { maxValue: 2, trim: false }), "> 2 weeks, 0 days");
    equal(moment.duration(15, "days").format("w [weeks], d [days]", { maxValue: 2, largest: 2 }), "> 2 weeks");
    equal(moment.duration(15, "days").format("w [weeks], d [days]", { maxValue: 2 }), "> 2 weeks");
    equal(moment.duration(15.5, "days").format("w [weeks], d [days], h [hours]", {
        maxValue: 2,
        trim: false,
        largest: 2
    }),
    "> 2 weeks, 0 days");
});

test("stopTrim", function () {
    equal(moment.duration(2, "hours").format("y [years], d [days], h [hours], m [minutes], s [seconds]", { trim: "both", stopTrim: ["d", "m"] }), "0 days, 2 hours, 0 minutes");
});

test("Milliseconds token length === 2", function () {
    equal(moment.duration(1003141).format("mm:ss:SS", { trim: false, precision: 0 }), "16:43:14");
    equal(moment.duration(1003145).format("mm:ss:SS", { trim: false, precision: 0 }), "16:43:14");
    equal(moment.duration(1003149).format("mm:ss:SS", { trim: false, precision: 0 }), "16:43:14");
    equal(moment.duration(1003101).format("mm:ss:SS", { trim: false, precision: 0 }), "16:43:10");
    equal(moment.duration(1003099).format("mm:ss:SS", { trim: false, precision: 0 }), "16:43:09");
    equal(moment.duration(1003091).format("mm:ss:SS", { trim: false, precision: 0 }), "16:43:09");
    equal(moment.duration(9, "milliseconds").format("mm:ss:SS", { trim: false }), "00:00:00");
    equal(moment.duration(10, "milliseconds").format("mm:ss:SS", { trim: false }), "00:00:01");
    equal(moment.duration(999, "milliseconds").format("mm:ss:SS", { trim: false }), "00:00:99");
    equal(moment.duration(1011, "milliseconds").format("mm:ss:SS", { trim: false }), "00:01:01");
});

test("Remove leading/trailing space, comma, colon, dot", function () {
    equal(moment.duration(1, "second").format(".s "), "1");
    equal(moment.duration(1, "second").format(":s,"), "1");
});

test("Invalid durations", function () {
    equal(moment.duration(NaN, "seconds").format(), "0 seconds");
    equal(moment.duration(NaN, "years").format("y"), "0");
});

test("Custom Locale labels, label types, pluralizer", function () {
    // Borowing moment's "fr" locale.
    moment.locale('test_custom_all', {
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
        },
        durationLabelsLong: {
            s: 'sec1.Long',
            ss: 'sec2.Long',
            sss: 'sec3.Long',
            m: 'min1.Long',
            mm: 'min2.Long',
            mmm: 'min3.Long'
        },
        durationLabelsStandard: {
            s: 'sec1.Standard',
            ss: 'sec2.Standard',
            sss: 'sec3.Standard',
            m: 'min1.Standard',
            mm: 'min2.Standard',
            mmm: 'min3.Standard'
        },
        durationLabelsShort: {
            s: 'sec1.Short',
            ss: 'sec2.Short',
            sss: 'sec3.Short',
            m: 'min1.Short',
            mm: 'min2.Short',
            mmm: 'min3.Short'
        },
        durationTimeTemplates: {
            MS: 'mmm:sss'
        },
        durationLabelTypes: [
            { type: "long", string: "___" },
            { type: "standard", string: "__" },
            { type: "short", string: "_" }
        ],
        durationPluralKey: function (token, integerValue, decimalValue) {
            // Decimal value does not affect plural label.

            // "xxx" for > 2.
            if (integerValue > 2) {
                return token + token + token;
            }

            // "x" for === 1.
            if (integerValue === 1) {
                return token;
            }

            // "xx" for others.
            return token + token;
        }
    });
    equal(moment.duration(61, "s").format("m _, s _"), "1 min1.Short, 1 sec1.Short");
    equal(moment.duration(61, "s").format("m __, s __"), "1 min1.Standard, 1 sec1.Standard");
    equal(moment.duration(61, "s").format("m ___, s ___"), "1 min1.Long, 1 sec1.Long");
    equal(moment.duration(122, "s").format("m _, s _"), "2 min2.Short, 2 sec2.Short");
    equal(moment.duration(122, "s").format("m __, s __"), "2 min2.Standard, 2 sec2.Standard");
    equal(moment.duration(122, "s").format("m ___, s ___"), "2 min2.Long, 2 sec2.Long");
    equal(moment.duration(183, "s").format("m _, s _"), "3 min3.Short, 3 sec3.Short");
    equal(moment.duration(183, "s").format("m __, s __"), "3 min3.Standard, 3 sec3.Standard");
    equal(moment.duration(183, "s").format("m ___, s ___"), "3 min3.Long, 3 sec3.Long");
    equal(moment.duration(61, "seconds").format("_MS_"), "001:001");
    moment.locale("en");
});

test("Custom Locale Pluralizer Only", function () {
    // Borowing moment's "fr" locale.
    moment.locale('test_custom_plural', {
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
        },
        durationPluralKey: function (token, integerValue, decimalValue) {
            // Decimal value does not affect plural label.

            // "x" for === 1.
            if (integerValue === 1 && decimalValue === 0) {
                return token;
            }

            // "xx" for others.
            return token + token;
        }
    });
    equal(moment.duration(60, "s").format("m _", 1), "1.0 min");
    equal(moment.duration(60, "s").format("m __", 1), "1.0 minute");
    equal(moment.duration(66, "s").format("m _", 1), "1.1 mins");
    equal(moment.duration(66, "s").format("m __", 1), "1.1 minutes");
    moment.locale("en");
});

test("Custom Locale Standard Labels Only", function () {
    // Borowing moment's "fr" locale.
    moment.locale('test_custom_labels', {
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
        },
        durationLabelsStandard: {
            m: "standard.minute",
            mm: "standard.minutes"
        }
    });
    equal(moment.duration(60, "s").format("m _"), "1 min");
    equal(moment.duration(60, "s").format("m __"), "1 standard.minute");
    equal(moment.duration(120, "s").format("m _"), "2 mins");
    equal(moment.duration(120, "s").format("m __"), "2 standard.minutes");
    moment.locale("en");
});

test("Custom Locale Label Types Only", function () {
    // Borowing moment's "fr" locale.
    moment.locale('test_custom_types', {
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
        },
        durationLabelTypes: [
            { type: "standard", string: "##" },
            { type: "short", string: "#" }
        ]
    });
    equal(moment.duration(60, "s").format("m #"), "1 min");
    equal(moment.duration(60, "s").format("m ##"), "1 minute");
    equal(moment.duration(120, "s").format("m #"), "2 mins");
    equal(moment.duration(120, "s").format("m ##"), "2 minutes");
    moment.locale("en");
});

test("Rounded value bubbling", function () {
    equal(moment.duration(
        moment('2017-12-17T02:00:00+00:00') -
        moment('2017-12-17T00:00:30+00:00')
    ).format('h:mm'), "2:00"); // returns: '1:60' instead of '2:00'
    equal(moment.duration({ hours: 2, seconds: -30 }).format("h:mm"), "2:00"); // "1:60"
    equal(moment.duration(7170, "seconds").format("h:mm"), "2:00"); // "1:60"
    equal(moment.duration(2879, "minutes").format("d[d] h[h]"), "2d 0h"); // "1d 24h"
    equal(moment.duration(2879, "minutes").format("d[d] h[h]", { trim: "all" }), "2d"); // "1d 24h"
    equal(moment.duration(335, "hours").format("w[w], d[d]"), "2w, 0d"); // "1w, 7d"
    equal(moment.duration(335, "hours").format("w[w], d[d]", { trim: "all" }), "2w"); // "1w, 7d"
    equal(moment.duration({ days: 7, seconds: -30 }).format("w[w] d[d] h:mm", { trim: "all" }), "1w"); // "6d 23:60"
    equal(moment.duration({ hours: 2, seconds: -60 }).format("h:mm", { precision: 2, useSignificantDigits: true }), "2"); // 1:60
    equal(moment.duration({ hours: 2, seconds: -60 }).format("h:mm", { precision: 2, useSignificantDigits: true, trim: false }), "2:00"); // 1:60
    equal(moment.duration({ hours: 24, seconds: -30 }).format("ww[w] dd[d] hh:mm", { trim: "all", forceLength: true }), "01d"); // "23:60"
    equal(moment.duration({ days: 7, seconds: -30 }).format("w[w] m[m]", { trim: "all" }), "1w"); // "10,080m"
});

test("forceFormatFallback", function () {
    equal(moment.duration(100000000000, "seconds").format("m", {
        useToLocaleString: false,
        precision: 2,
        decimalSeparator: "*",
        groupingSeparator: "^",
        grouping: [3, 2]
    }), "1^66^66^66^666*67");
    equal(moment.duration(100000000000000000000000, "seconds").format("m", {
        useToLocaleString: false,
        precision: 10,
        useSignificantDigits: true
    }), "1,666,666,667,000,000,000,000");
    equal(moment.duration(100000000000000000000000, "seconds").format("m", {
        useToLocaleString: false,
        precision: 10,
        useSignificantDigits: true,
        useGrouping: false
    }), "1666666667000000000000");
});

module("moment.duration.format");

test("Basic Use", function () {
    deepEqual(moment.duration.format([
        moment.duration(1, "second"),
        moment.duration(1, "minute"),
        moment.duration(1, "hour")],
        "d [days] hh:mm:ss"
    ), ["0:00:01", "0:01:00", "1:00:00"]);
    deepEqual(moment.duration.format([
        moment.duration(1, "second"),
        moment.duration(1, "minute")],
        "d [days] hh:mm:ss"
    ), ["0:01", "1:00"]);
    deepEqual(moment.duration.format([
        moment.duration(1, "second"),
        moment.duration(1, "minute"),
        moment.duration(1, "day")],
        "d [days] hh:mm:ss"
    ), ["0 days 00:00:01", "0 days 00:01:00", "1 day 00:00:00"]);
    deepEqual(moment.duration.format([
        moment.duration(1, "minute"),
        moment.duration(1, "hour"),
        moment.duration(1, "day")
    ], "y [years], w [weeks], d [days], h [hours], m [minutes]"),
    [
        "0 days, 0 hours, 1 minute",
        "0 days, 1 hour, 0 minutes",
        "1 day, 0 hours, 0 minutes"
    ]);
});

test("trim", function () {
    deepEqual(moment.duration.format([
        moment.duration(1, "minute"),
        moment.duration(1, "day")],
        "y [years], d [days], h [hours], m [minutes], s [seconds]",
        { trim: false }
    ), ["0 years, 0 days, 0 hours, 1 minute, 0 seconds", "0 years, 1 day, 0 hours, 0 minutes, 0 seconds"]);
    deepEqual(moment.duration.format([
        moment.duration(1, "minute"),
        moment.duration(1, "day")],
        "y [years], d [days], h [hours], m [minutes], s [seconds]",
        { trim: "large" }
    ), ["0 days, 0 hours, 1 minute, 0 seconds", "1 day, 0 hours, 0 minutes, 0 seconds"]);
    deepEqual(moment.duration.format([
        moment.duration(1, "minute"),
        moment.duration(1, "day")],
        "y [years], d [days], h [hours], m [minutes], s [seconds]",
        { trim: "both" }
    ), ["0 days, 1 minute", "1 day, 0 minutes"]);
    deepEqual(moment.duration.format([
        moment.duration(1, "minute"),
        moment.duration(1, "day"),
        moment.duration(1, "year")],
        "y [years], d [days], h [hours], m [minutes], s [seconds]",
        { trim: "all" }
    ), ["0 years, 0 days, 1 minute", "0 years, 1 day, 0 minutes", "1 year, 0 days, 0 minutes"]);
    deepEqual(moment.duration.format([
        moment.duration(0, "minute"),
        moment.duration(0, "day"),
        moment.duration(0, "year")],
        "y [years], d [days], h [hours], m [minutes], s [seconds]",
        { trim: "all" }
    ), ["", "", ""]);
    deepEqual(moment.duration.format([
        moment.duration(0, "minute"),
        moment.duration(0, "day"),
        moment.duration(1, "year")],
        "y [years], d [days], h [hours], m [minutes], s [seconds]",
        { trim: "all" }
    ), ["0 years", "0 years", "1 year"]);
});

test("stopTrim", function () {
    deepEqual(moment.duration.format([
        moment.duration(1, "hour"),
        moment.duration(1, "week")],
        "y [years], M [months], w [weeks], d [days], h [hours], m [minutes], s [seconds]",
        { trim: "both", stopTrim: "M m" }
    ), ["0 months, 0 weeks, 0 days, 1 hour, 0 minutes", "0 months, 1 week, 0 days, 0 hours, 0 minutes"]);
    deepEqual(moment.duration.format([
        moment.duration(1, "hour"),
        moment.duration(1, "week")],
        "y [years], M [months], w [weeks], d [days], h [hours], m [minutes], s [seconds]",
        { trim: "both", stopTrim: ["M", "m"] }
    ), ["0 months, 0 weeks, 0 days, 1 hour, 0 minutes", "0 months, 1 week, 0 days, 0 hours, 0 minutes"]);
    deepEqual(moment.duration.format([
        moment.duration(1, "hour"),
        moment.duration(1, "week")],
        "y [years], *M [months], w [weeks], d [days], h [hours], *m [minutes], s [seconds]",
        { trim: "both" }
    ), ["0 months, 0 weeks, 0 days, 1 hour, 0 minutes", "0 months, 1 week, 0 days, 0 hours, 0 minutes"]);
});

test("largest", function () {
    deepEqual(moment.duration.format([
        moment.duration(24, "hours"),
        moment.duration(1, "hours"),
        moment.duration(10, "minutes"),
        moment.duration(1, "weeks")],
        "y [years], M [months], w [weeks], d [days], h [hours], m [minutes], s [seconds]",
        { largest: 2 }
    ), ["0 weeks, 1 day", "0 weeks, 0 days", "0 weeks, 0 days", "1 week, 0 days"]);
    deepEqual(moment.duration.format([
        moment.duration(24, "hours"),
        moment.duration(1, "hours"),
        moment.duration(4.12345, "years"),
        moment.duration(10, "minutes"),
        moment.duration(1, "weeks")],
        "y [years], M [months], w [weeks], d [days], h [hours], m [minutes], s [seconds]",
        { largest: 2 }
    ), [
        "0 years, 0 months",
        "0 years, 0 months",
        "4 years, 1 month",
        "0 years, 0 months",
        "0 years, 0 months"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(24, "hours"),
        moment.duration(1, "hours"),
        moment.duration(4.12345, "years"),
        moment.duration(10, "minutes"),
        moment.duration(1, "weeks")],
        "y [years], M [months], w [weeks], d [days], h [hours], m [minutes], s [seconds]",
        { largest: 4 }
    ), [
        "0 years, 0 months, 0 weeks, 1 day",
        "0 years, 0 months, 0 weeks, 0 days",
        "4 years, 1 month, 2 weeks, 1 day",
        "0 years, 0 months, 0 weeks, 0 days",
        "0 years, 0 months, 1 week, 0 days"
    ]);
});

test("precision", function () {
    deepEqual(moment.duration.format([
        moment.duration(100.1234, "second"),
        moment.duration(100.1234, "minute"),
        moment.duration(100.1234, "hour")],
        "d [days] hh:mm:ss",
        { precision: 2 }
    ), [
        "0 days 00:01:40.12",
        "0 days 01:40:07.40",
        "4 days 04:07:24.24"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(100.1234, "second"),
        moment.duration(100, "minute"),
        moment.duration(100, "hour")],
        "d [days] hh:mm:ss",
        { precision: 2 }
    ), [
        "0 days 00:01:40.12",
        "0 days 01:40:00.00",
        "4 days 04:00:00.00"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(123456, "second"),
        moment.duration(123456, "minute"),
        moment.duration(123456, "hour")],
        "y [years], d [days]",
        { precision: -2 }
    ), [
        "0 years, 0 days",
        "0 years, 100 days",
        "14 years, 0 days"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(123456, "second"),
        moment.duration(123456, "minute"),
        moment.duration(123456, "hour")],
        "y [years], d [days]",
        { precision: -1 }
    ), [
        "0 years, 0 days",
        "0 years, 90 days",
        "14 years, 30 days"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(123456, "second"),
        moment.duration(123456, "minute"),
        moment.duration(123456, "hour")],
        "h [hours]",
        { precision: -2 }
    ), [
        "0 hours",
        "2,100 hours",
        "123,500 hours"
    ]);
});

test("maxValue", function () {
    deepEqual(moment.duration.format([
        moment.duration(61, "seconds"),
        moment.duration(59, "seconds"),
        moment.duration(1.1, "minutes"),
        moment.duration(0.9, "minutes"),
        moment.duration(0.017, "hours"),
        moment.duration(0.016, "hours")],
        "m [minutes]",
        { maxValue: 1 }
    ), [
        "> 1 minute",
        "1 minute",
        "> 1 minute",
        "1 minute",
        "> 1 minute",
        "1 minute"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(1, "seconds"),
        moment.duration(59, "seconds"),
        moment.duration(1.25, "minutes"),
        moment.duration(10, "minutes"),
        moment.duration(10.01, "minutes"),
        moment.duration(100, "minutes")],
        "m:ss",
        { maxValue: 10, trim: false }
    ), [
        "0:01",
        "0:59",
        "1:15",
        "10:00",
        "> 10:00",
        "> 10:00"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(1, "minutes"),
        moment.duration(10, "minutes"),
        moment.duration(20, "minutes"),
        moment.duration(100, "minutes")],
        "m:ss",
        { maxValue: 10, trim: false }
    ), [
        "1:00",
        "10:00",
        "> 10:00",
        "> 10:00"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(1, "seconds"),
        moment.duration(59, "seconds"),
        moment.duration(1.25, "minutes"),
        moment.duration(10, "minutes"),
        moment.duration(10.01, "minutes"),
        moment.duration(100, "minutes")],
        "m [minutes], s [seconds]",
        { maxValue: 10 }
    ), [
        "0 minutes, 1 second",
        "0 minutes, 59 seconds",
        "1 minute, 15 seconds",
        "10 minutes, 0 seconds",
        "> 10 minutes",
        "> 10 minutes"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(1, "seconds"),
        moment.duration(59, "seconds"),
        moment.duration(1.25, "minutes"),
        moment.duration(10, "minutes"),
        moment.duration(10.01, "minutes"),
        moment.duration(100, "minutes")],
        "m [minutes], s [seconds]",
        { maxValue: 10, trim: "both" }
    ), [
        "0 minutes, 1 second",
        "0 minutes, 59 seconds",
        "1 minute, 15 seconds",
        "10 minutes, 0 seconds",
        "> 10 minutes, 0 seconds",
        "> 10 minutes, 0 seconds"
    ]);
});

test("maxValue, negative durations", function () {
    deepEqual(moment.duration.format([
        moment.duration(-61, "seconds"),
        moment.duration(-59, "seconds"),
        moment.duration(-1.1, "minutes"),
        moment.duration(-0.9, "minutes"),
        moment.duration(-0.017, "hours"),
        moment.duration(-0.016, "hours")],
        "m [minutes]",
        { maxValue: 1 }
    ), [
        "< -1 minute",
        "-1 minute",
        "< -1 minute",
        "-1 minute",
        "< -1 minute",
        "-1 minute"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(-1, "seconds"),
        moment.duration(-59, "seconds"),
        moment.duration(-1.25, "minutes"),
        moment.duration(-10, "minutes"),
        moment.duration(-10.01, "minutes"),
        moment.duration(-100, "minutes")],
        "m:ss",
        { maxValue: 10, trim: false }
    ), [
        "-0:01",
        "-0:59",
        "-1:15",
        "-10:00",
        "< -10:00",
        "< -10:00"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(-1, "minutes"),
        moment.duration(-10, "minutes"),
        moment.duration(-20, "minutes"),
        moment.duration(-100, "minutes")],
        "m:ss",
        { maxValue: 10, trim: false }
    ), [
        "-1:00",
        "-10:00",
        "< -10:00",
        "< -10:00"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(-1, "seconds"),
        moment.duration(-59, "seconds"),
        moment.duration(-1.25, "minutes"),
        moment.duration(-10, "minutes"),
        moment.duration(-10.01, "minutes"),
        moment.duration(-100, "minutes")],
        "m [minutes], s [seconds]",
        { maxValue: 10 }
    ), [
        "-0 minutes, 1 second",
        "-0 minutes, 59 seconds",
        "-1 minute, 15 seconds",
        "-10 minutes, 0 seconds",
        "< -10 minutes",
        "< -10 minutes"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(-1, "seconds"),
        moment.duration(-59, "seconds"),
        moment.duration(-1.25, "minutes"),
        moment.duration(-10, "minutes"),
        moment.duration(-10.01, "minutes"),
        moment.duration(-100, "minutes")],
        "m [minutes], s [seconds]",
        { maxValue: 10, trim: "both" }
    ), [
        "-0 minutes, 1 second",
        "-0 minutes, 59 seconds",
        "-1 minute, 15 seconds",
        "-10 minutes, 0 seconds",
        "< -10 minutes, 0 seconds",
        "< -10 minutes, 0 seconds"
    ]);
});

test("minValue", function () {
    deepEqual(moment.duration.format([
        moment.duration(61, "seconds"),
        moment.duration(59, "seconds"),
        moment.duration(1.1, "minutes"),
        moment.duration(0.9, "minutes"),
        moment.duration(0.017, "hours"),
        moment.duration(0.016, "hours")],
        "m [minutes]",
        { minValue: 1 }
    ), [
        "1 minute",
        "< 1 minute",
        "1 minute",
        "< 1 minute",
        "1 minute",
        "< 1 minute"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(10, "seconds"),
        moment.duration(9.9999, "seconds"),
        moment.duration(10.0001, "seconds"),
        moment.duration(1, "minutes"),
        moment.duration(1/6 - 0.0001, "minutes"),
        moment.duration(1/6, "minutes")],
        "m:ss",
        { minValue: 10, trim: false }
    ), [
        "0:10",
        "< 0:10",
        "0:10",
        "1:00",
        "< 0:10",
        "0:10"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(1, "minutes"),
        moment.duration(599, "seconds"),
        moment.duration(10, "minutes"),
        moment.duration(9.99, "minutes")],
        "h:mm",
        { minValue: 10, trim: false }
    ), [
        "< 0:10",
        "< 0:10",
        "0:10",
        "< 0:10"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(1, "seconds"),
        moment.duration(59, "seconds"),
        moment.duration(59.9999, "seconds"),
        moment.duration(60, "seconds"),
        moment.duration(0.999, "minutes"),
        moment.duration(1, "minutes"),
        moment.duration(1.001, "minutes")],
        "m:ss",
        { minValue: 60, trim: false }
    ), [
        "< 1:00",
        "< 1:00",
        "< 1:00",
        "1:00",
        "< 1:00",
        "1:00",
        "1:00"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(1, "seconds"),
        moment.duration(59, "seconds"),
        moment.duration(59.9999, "seconds"),
        moment.duration(60, "seconds"),
        moment.duration(0.999, "minutes"),
        moment.duration(1, "minutes"),
        moment.duration(1.001, "minutes")],
        "m:ss",
        { minValue: 60 }
    ), [
        "< 1:00",
        "< 1:00",
        "< 1:00",
        "1:00",
        "< 1:00",
        "1:00",
        "1:00"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(1, "seconds"),
        moment.duration(3599, "seconds"),
        moment.duration(3601, "seconds"),
        moment.duration(59.9, "minutes"),
        moment.duration(60.1, "minutes"),
        moment.duration(937481, "seconds"),
        moment.duration(0.01, "days"),
        moment.duration(0.1, "days")],
        "d[d] hh:mm:ss",
        { minValue: 3600, trim: "large" }
    ), [
        "< 0d 01:00:00",
        "< 0d 01:00:00",
        "0d 01:00:01",
        "< 0d 01:00:00",
        "0d 01:00:06",
        "10d 20:24:41",
        "< 0d 01:00:00",
        "0d 02:24:00"
    ]);
});

test("minValue, negative durations", function () {
    deepEqual(moment.duration.format([
        moment.duration(-1, "seconds"),
        moment.duration(-59, "seconds"),
        moment.duration(-59.9999, "seconds"),
        moment.duration(-60, "seconds"),
        moment.duration(-0.999, "minutes"),
        moment.duration(-1, "minutes"),
        moment.duration(-1.001, "minutes")],
        "m:ss",
        { minValue: 60 }
    ), [
        "> -1:00",
        "> -1:00",
        "> -1:00",
        "-1:00",
        "> -1:00",
        "-1:00",
        "-1:00"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(-1, "seconds"),
        moment.duration(-3599, "seconds"),
        moment.duration(-3601, "seconds"),
        moment.duration(-59.9, "minutes"),
        moment.duration(-60.1, "minutes"),
        moment.duration(-937481, "seconds"),
        moment.duration(-0.01, "days"),
        moment.duration(-0.1, "days")],
        "d[d] hh:mm:ss",
        { minValue: 3600, trim: "large" }
    ), [
        "> -0d 01:00:00",
        "> -0d 01:00:00",
        "-0d 01:00:01",
        "> -0d 01:00:00",
        "-0d 01:00:06",
        "-10d 20:24:41",
        "> -0d 01:00:00",
        "-0d 02:24:00"
    ]);
});

test("Mixed positive and negative durations", function () {
    deepEqual(moment.duration.format([
        moment.duration(-1, "seconds"),
        moment.duration(-3599, "seconds"),
        moment.duration(-23097502, "seconds"),
        moment.duration(-2309823, "seconds"),
        moment.duration(1, "seconds"),
        moment.duration(3599, "seconds"),
        moment.duration(23097502, "seconds"),
        moment.duration(2309823, "seconds")],
        "y[y] M[m] d[d] hh:mm:ss"
    ), [
        "-0m 0d 00:00:01",
        "-0m 0d 00:59:59",
        "-8m 24d 07:58:22",
        "-0m 26d 17:37:03",
        "0m 0d 00:00:01",
        "0m 0d 00:59:59",
        "8m 24d 07:58:22",
        "0m 26d 17:37:03"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(-0, "seconds"),
        moment.duration(-3600, "seconds"),
        moment.duration(-86400, "seconds"),
        moment.duration(0, "seconds"),
        moment.duration(3600, "seconds"),
        moment.duration(86400, "seconds")],
        "y[y] *M[m] d[d] hh:*mm:ss",
        { trim: "all" }
    ), [
        "0m 0d 00:00",
        "-0m 0d 01:00",
        "-0m 1d 00:00",
        "0m 0d 00:00",
        "0m 0d 01:00",
        "0m 1d 00:00"
    ]);
});

test("useSignificantDigits", function () {
    deepEqual(moment.duration.format([
        moment.duration(10, "seconds"),
        moment.duration(1000000, "seconds")],
        "y[y] M[m] d[d] h[h] m[m] s[s]",
        { useSignificantDigits: true, precision: 4, useToLocaleString: false }
    ), ["0d 0h 10s", "11d 14h 0s"]);
    deepEqual(moment.duration.format([
        moment.duration(10, "seconds"),
        moment.duration(100, "seconds"),
        moment.duration(1000, "seconds"),
        moment.duration(10000, "seconds"),
        moment.duration(100000, "seconds"),
        moment.duration(1000000, "seconds")],
        "y[y] M[m] d[d] h[h] m[m] s[s]",
        { useSignificantDigits: true, precision: 6 }
    ), [
        "0d 0h 0m 10s",
        "0d 0h 1m 40s",
        "0d 0h 16m 40s",
        "0d 2h 46m 40s",
        "1d 3h 46m 40s",
        "11d 13h 47m 0s"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(10, "seconds"),
        moment.duration(100, "seconds"),
        moment.duration(1000, "seconds"),
        moment.duration(10000, "seconds"),
        moment.duration(100000, "seconds"),
        moment.duration(1000000, "seconds")],
        "y[y] M[m] d[d] h[h] m[m] s[s]",
        { useSignificantDigits: true, precision: 5 }
    ), [
        "0d 0h 0m 10s",
        "0d 0h 1m 40s",
        "0d 0h 16m 40s",
        "0d 2h 46m 40s",
        "1d 3h 46m 40s",
        "11d 13h 50m 0s"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(10, "seconds"),
        moment.duration(100, "seconds"),
        moment.duration(1000, "seconds"),
        moment.duration(10000, "seconds"),
        moment.duration(100000, "seconds"),
        moment.duration(1000000, "seconds")],
        "y[y] M[m] d[d] h[h] m[m] s[s]",
        { useSignificantDigits: true, precision: 4 }
    ), [
        "0d 0h 0m 10s",
        "0d 0h 1m 40s",
        "0d 0h 16m 40s",
        "0d 2h 46m 40s",
        "1d 3h 47m 0s",
        "11d 14h 0m 0s"
    ]);
});

test("trunc", function () {
    deepEqual(moment.duration.format([
        moment.duration(10, "seconds"),
        moment.duration(100, "seconds"),
        moment.duration(1000, "seconds"),
        moment.duration(10000, "seconds"),
        moment.duration(100000, "seconds"),
        moment.duration(1000000, "seconds")],
        "y[y] M[m] d[d] h[h]",
        { trunc: true, precision: 0 }
    ), [
        "0d 0h",
        "0d 0h",
        "0d 0h",
        "0d 2h",
        "1d 3h",
        "11d 13h"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(10, "seconds"),
        moment.duration(100, "seconds"),
        moment.duration(1000, "seconds"),
        moment.duration(10000, "seconds"),
        moment.duration(100000, "seconds"),
        moment.duration(1000000, "seconds")],
        "y[y] M[m] d[d] h[h]",
        { trunc: true, precision: 2 }
    ), [
        "0d 0.00h",
        "0d 0.02h",
        "0d 0.27h",
        "0d 2.77h",
        "1d 3.77h",
        "11d 13.77h"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(10, "seconds"),
        moment.duration(100, "seconds"),
        moment.duration(1000, "seconds"),
        moment.duration(10000, "seconds"),
        moment.duration(100000, "seconds"),
        moment.duration(1000000, "seconds")],
        "y[y] M[m] d[d] h[h]",
        { trunc: true, precision: 4 }
    ), [
        "0d 0.0027h",
        "0d 0.0277h",
        "0d 0.2777h",
        "0d 2.7777h",
        "1d 3.7777h",
        "11d 13.7777h"
    ]);
});

test("forceLength", function () {
    deepEqual(moment.duration.format([
        moment.duration(10, "seconds"),
        moment.duration(100, "seconds"),
        moment.duration(1000, "seconds"),
        moment.duration(3000, "seconds")],
        "h:mm:ss",
        { forceLength: false }
    ), [
        "0:10",
        "1:40",
        "16:40",
        "50:00"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(10, "seconds"),
        moment.duration(100, "seconds"),
        moment.duration(1000, "seconds"),
        moment.duration(3000, "seconds")],
        "h:mm:ss",
        { forceLength: true }
    ), [
        "00:10",
        "01:40",
        "16:40",
        "50:00"
    ]);
});

test("userLocale, usePlural, useGrouping, useLeftUnits", function () {
    deepEqual(moment.duration.format([
        moment.duration(1000, "seconds"),
        moment.duration(3600, "seconds"),
        moment.duration(10000, "seconds"),
        moment.duration(100000, "seconds"),
        moment.duration(1000000, "seconds"),
        moment.duration(10000000, "seconds")],
        "h [hour]",
        { precision: 2 }
    ), [
        "0.28 hours",
        "1.00 hours",
        "2.78 hours",
        "27.78 hours",
        "277.78 hours",
        "2,777.78 hours"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(1000, "seconds"),
        moment.duration(3600, "seconds"),
        moment.duration(10000, "seconds"),
        moment.duration(100000, "seconds"),
        moment.duration(1000000, "seconds"),
        moment.duration(10000000, "seconds")],
        "h [hour]",
        { precision: 2, userLocale: "de-DE", decimalSeparator: ",", groupingSeparator: "." }
    ), [
        "0,28 hours",
        "1,00 hours",
        "2,78 hours",
        "27,78 hours",
        "277,78 hours",
        "2.777,78 hours"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(1000, "seconds"),
        moment.duration(3600, "seconds"),
        moment.duration(10000, "seconds"),
        moment.duration(100000, "seconds"),
        moment.duration(1000000, "seconds"),
        moment.duration(10000000, "seconds")],
        "h [hour]",
        { precision: 2, useGrouping: false, usePlural: false }
    ), [
        "0.28 hour",
        "1.00 hour",
        "2.78 hour",
        "27.78 hour",
        "277.78 hour",
        "2777.78 hour"
    ]);
    deepEqual(moment.duration.format([
        moment.duration(1000, "seconds"),
        moment.duration(3600, "seconds"),
        moment.duration(10000, "seconds"),
        moment.duration(100000, "seconds"),
        moment.duration(1000000, "seconds"),
        moment.duration(10000000, "seconds")],
        "[hour] h",
        { precision: 2, useLeftUnits: true }
    ), [
        "hours 0.28",
        "hours 1.00",
        "hours 2.78",
        "hours 27.78",
        "hours 277.78",
        "hours 2,777.78"
    ]);
});

test("Template function", function () {
    deepEqual(moment.duration.format([
        moment.duration(1000, "seconds"),
        moment.duration(3600, "seconds"),
        moment.duration(10000, "seconds"),
        moment.duration(100000, "seconds"),
        moment.duration(1000000, "seconds"),
        moment.duration(10000000, "seconds")],
        function () {
            if (this.duration.asSeconds() > 10000) {
                return "d [days], h [hours]";
            }

            return "hh:mm:ss";
        }
    ), [
        "00:16:40",
        "01:00:00",
        "02:46:40",
        "1 day, 4 hours",
        "11 days, 14 hours",
        "115 days, 18 hours"
    ]);
});
