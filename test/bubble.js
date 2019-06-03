var abs = Math.abs;
var round = Math.round;
var ceil = Math.ceil;
var floor = Math.floor;

var AVERAGE_DAYS_PER_MONTH = 30.436875;
var MONTHS_THRESHOLD = 0.0164274420419588;
// Selected so that 2 years have 730 days.
var DAYS_THRESHOLD = 0.514;

function thresholdRound (num, threshold) {
    // Assumes num >= 0.
    var ceilNum = ceil(num);
    var difference = ceilNum - num;

    return difference < threshold ? ceilNum : floor(num);
}

function daysToMonths (days) {
    var posneg = days < 0 ? -1 : 1;
    var absDays = abs(days);
    var fractionOfAverageMonth = absDays / AVERAGE_DAYS_PER_MONTH;
    var wholeMonths = thresholdRound(fractionOfAverageMonth, MONTHS_THRESHOLD);
    var daysInWholeMonths = monthsToDays(wholeMonths);
    var daysInNextMonth = monthsToDays(wholeMonths + 1) - daysInWholeMonths;
    var leftoverDays = absDays - daysInWholeMonths;

    return posneg * (wholeMonths + leftoverDays / daysInNextMonth);
}

function monthsToDays (months) {
    var posneg = months < 0 ? -1 : 1;
    var absMonths = abs(months);
    var wholeMonths = floor(absMonths);
    var monthFraction = absMonths - wholeMonths;
    var daysInWholeMonths = thresholdRound(wholeMonths * AVERAGE_DAYS_PER_MONTH, DAYS_THRESHOLD);
    var daysInNextMonth = thresholdRound((wholeMonths + 1) * AVERAGE_DAYS_PER_MONTH, DAYS_THRESHOLD) - daysInWholeMonths;

    return posneg * (daysInWholeMonths + monthFraction * daysInNextMonth);
}
