$(document).ready(function() {
	module("Moment Duration Format");

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
		equal(moment.duration(40, "seconds").format("m", 5), "0.66666");
		equal(moment.duration(45, "seconds").format("m", 1), "0.7");
		equal(moment.duration(59, "seconds").format("m", 0), "0");
		equal(moment.duration(59, "seconds").format("m"), "0");
	});

	test("Negative Precision", function () {
		equal(moment.duration(123, "seconds").format("s", -2), "100");
	});

	test("Multiple Token Instances", function () {
		equal(moment.duration(123, "seconds").format("s s s"), "123 123 123");
		equal(moment.duration(123, "seconds").format("s s ssssss"), "123 123 000123");
	});

	test("Escape Tokens", function () {
		equal(moment.duration(123, "seconds").format("[All] [tokens] [escaped]"), "All tokens escaped");
		equal(moment.duration(123, "seconds").format("s[s]"), "123s");
	});

	test("All Moment Tokens", function () {
		// obviously a duration of 100,000,000,013 ms will vary in the number of days based on leap years, etc.
		// this test ensures the internal duration/format math remains consistent
		equal(moment.duration(100000000013, "ms").format("y[y] M[mo] w[w] d[d] h[h] m[m] s[s] S[ms]"), "3y 2mo 0w 2d 9h 46m 40s 13ms");
	});

	test("Output To Lesser Units", function () {
		equal(moment.duration(1, "years").format("y"), "1");
		equal(moment.duration(1, "years").format("M"), "12");
		equal(moment.duration(1, "years").format("w"), "52");
		equal(moment.duration(1, "years").format("d"), "365");
		equal(moment.duration(1, "years").format("h"), "8760");
		equal(moment.duration(1, "years").format("m"), "525600");
		equal(moment.duration(1, "years").format("s"), "31536000");
		equal(moment.duration(1, "years").format("S"), "31536000000");
	});

	test("Output To Greater Units", function () {
		equal(moment.duration(1, "milliseconds").format("y", 15), "0.000000000031709");
		equal(moment.duration(1, "milliseconds").format("M", 13), "0.0000000003858");
		equal(moment.duration(1, "milliseconds").format("w", 12), "0.000000001653");
		equal(moment.duration(1, "milliseconds").format("d", 11), "0.00000001157");
		equal(moment.duration(1, "milliseconds").format("h", 10), "0.0000002777");
		equal(moment.duration(1, "milliseconds").format("m", 7), "0.0000166");
		equal(moment.duration(1, "milliseconds").format("s", 3), "0.001");
		equal(moment.duration(1, "milliseconds").format("S"), "1");
	});

	test("Custom Token Types List", function () {
		equal(moment.duration(12345, "seconds").format("d [days] m [minutes] h [(hours is not a token type now)]", {
			types: "escape years months weeks days minutes seconds milliseconds general"
		}), "205 minutes h (hours is not a token type now)");
	});

	test("Custom Escape RegExp", function () {
		equal(moment.duration(1234, "hours").format("d (days), h (hours)", {
			escape: /\((.+?)\)/
		}), "51 days, 10 hours");
	});

	test("Custom Moment Token RegExp", function () {
		equal(moment.duration(1234, "days").format("x yrs", {
			years: /x+/,
			seconds: /z+/,
			precision: 2
		}), "3.38 yrs");
	});
	
	test("Using Only Settings Argument", function () {
		equal(moment.duration(1234.55, "hours").format({
			template: "d (days), h (hours)",
			escape: /\((.+?)\)/,
			precision: 1
		}), "51 days, 10.5 hours");
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
		equal(moment.duration(100, "days").format(), "3m 10d");
		equal(moment.duration(100, "weeks").format(), "23m 5d");
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
		}), "3 months, 1 weeks, 3 days, 0 hours, 0 minutes, 0 seconds");
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
		equal(moment.duration(-1, "years").format("s"), "-31536000");
		equal(moment.duration(-1, "seconds").format("y", 15), "-0.000000031709791");
		equal(moment.duration(-65, "seconds").format("m:ss"), "-1:05");
		equal(moment.duration(-65, "seconds").format("m:ss", 2), "-1:05.00");
		equal(moment.duration(-65.667, "seconds").format("m:ss", 2), "-1:05.66");
		equal(moment.duration(-65.667, "days").format("d", 2), "-65.66");
		equal(moment.duration(-65.667, "days").format("d [days], h [hours]"), "-65 days, 16 hours");
	});
});