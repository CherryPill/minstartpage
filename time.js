//gets from config in local storage
//year: numeric, 2-digit, month: long short, weekday: long short,
//date_post_fx: true false, _am_pm: true false, seconds true false

let testTimePattern = "%A, %B %Y | %H:%M:%S"; //current time format
//supported time format specifiers
//testTimePattern = "%a : %A : %b %B %d %f: %R %p %r %x";
//testTimePattern = "%M";

const timeMeridianModes = {
    AM_PM_UPPERCASE: 0,
    AM_PM_LOWERCASE: 1,
};

const constStrings = {
    AM_UPPERCASE: "AM",
    AM_LOWERCASE: "am",
    PM_UPPERCASE: "PM",
    PM_LOWERCASE: "pm",
};


var SavedTimeOptions = {};

var TimeUtils = {
    currentTime: new Date(),
    /**
     * @return {string}
     */
    A: function () {
        return this.currentTime.toLocaleString("en-us",
            {weekday: "short"});
    },
    a: function () {
        return this.currentTime.toLocaleString("en-us",
            {weekday: "long"});
    },
    b: function () {
        return this.currentTime.toLocaleString("en-us",
            {month: "short"});
    },
    /**
     * @return {string}
     */
    B: function () {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        return this.currentTime.toLocaleString("en-us",
            {month: "long"});
    },
    c: function () {
        return `${window["TimeUtils"]["a"]()} ${window["TimeUtils"]["b"]()} ${window["TimeUtils"]["d"]()} ${window["TimeUtils"]["T"]()} ${window["TimeUtils"]["G"]()}`;
    },
    //Year divided by 100 and truncated to integer (00-99)
    /**
     * @return {number}
     */
    C: function () {
        return parseInt(this.currentTime.getFullYear() / 100);
    },
    //Day of the month, zero-padded (01-31)
    d: function () {
        return this.currentTime.toLocaleString("en-us",
            {day: "2-digit"});

    },
    //	Short MM/DD/YY date, equivalent to %m/%d/%y
    /**
     * @return {string}
     */
    D: function () {
        return `${this.currentTime.getMonth()}/${this.currentTime.getDate()}/${this.currentTime.getFullYear()}`;
    },
    //Day of the month, space-padded ( 1-31)
    e: function () {
        return this.currentTime.getDate();
    },
    //	Short YYYY-MM-DD date, equivalent to %Y-%m-%d
    /**
     * @return {string}
     */
    F: function () {
        return `${this.currentTime.getFullYear()}-${this.currentTime.getMonth()}-${this.currentTime.getDate()}`;

    },
    //day of the month postfix (th, nd, rd, etc)
    f: function () {
        timeObj.dateNameNow = this.currentTime.getDate();
        timeObj.getDayPostFix();
        return timeObj.dayPostFix;

    },
    //Week-based year, last two digits (00-99)
    g: function () {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        return this.currentTime.getFullYear();
    },
    //	Week-based year
    /**
     * @return {string}
     */
    G: function () {
        return this.currentTime.toLocaleString("en-us",
            {year: "numeric"});
    },

    //Abbreviated month name * (same as %b)
    h: function () {
        return this.currentTime.toLocaleString("en-us",
            {month: "short"});
    },
    //Hour in 24h format (00-23)
    /**
     * @return {number}
     */
    H: function () {
        return this.currentTime.getHours();
    },
    //Hour in 12h format (01-12)
    /**
     * @return {number}
     */
    I: function () {
        return convertTo12HRFormat(this.currentTime.getHours());
    },
    //Day of the year (001-366)
    j: function () {
        return this.currentTime.getDate();
    },
    //Month as a decimal number (01-12)
    m: function () {
        return this.currentTime.getMonth();
    },
    //Minute (00-59)
    /**
     * @return {number}
     */
    M: function () {
        return digitCorrectionNew(this.currentTime.getMinutes());
    },
    //AM or PM designation
    //works
    p: function () {
        return resolveAmPmNew(this.currentTime.getHours(), timeMeridianModes.AM_PM_UPPERCASE);
    },
    //12-hour clock time *
    r: function () {
        return `${this.currentTime.getHours()}:${this.currentTime.getMinutes()}:${this.currentTime.getSeconds()} ${resolveAmPmNew(this.currentTime.getHours(), timeMeridianModes.AM_PM_LOWERCASE)}`
    },
    /**
     * @return {string}
     */
    R: function () {
        let minNow = this.currentTime.getMinutes();
        let hrsNow = this.currentTime.getHours(2);
        return `${hrsNow}:${minNow}`;
    },
    //Second (00-61)
    /**
     * @return {number}
     */
    S: function () {
        return this.currentTime.getSeconds();
    },
    //Horizontal-tab character ('\t')
    t: function () {
        return "\t";
    },
    //ISO 8601 time format (HH:MM:SS), equivalent to %H:%M:%S
    /**
     * @return {string}
     */
    T: function () {
        let minNow = this.currentTime.getMinutes();
        let hrsNow = this.currentTime.getHours();
        let secNow = this.currentTime.getSeconds();
        return `${hrsNow}:${minNow}:${secNow}`;
    },
    //ISO 8601 weekday as number with Monday as 1 (1-7)
    u: function () {
        return this.currentTime.getDay();
    },
    //Week number with the first Sunday as the first day of week one (00-53)
    U: function () {
        //not implemented
    },
    //ISO 8601 week number (01-53)
    V: function () {
        //not implemented
    },
    //Weekday as a decimal number with Sunday as 0 (0-6)
    w: function () {
        return this.currentTime.getDay();
    },
    //Week number with the first Monday as the first day of week one (00-53)
    W: function () {
        //not implemented
    },
    //Date representation
    x: function () {
        return window["TimeUtils"]["D"]();
    },
    //Time representation
    /**
     * @return {string}
     */
    X: function () {
        return `${this.currentTime.getMinutes()}:${this.currentTime.getHours()}:${this.getSeconds()}`;
    },
    //Year, last two digits (00-99)
    y: function () {
        return this.currentTime.toLocaleString("en-us", {"year": "2-digit"});
    },
    //Year
    /**
     * @return {number}
     */
    Y: function () {
        return this.currentTime.getFullYear();
    },
    //ISO 8601 offset from UTC in timezone (1 minute=1, 1 hour=100)
    // If timezone cannot be determined, no characters
    z: function () {
        return this.currentTime.getTimezoneOffset()
    },
    //Timezone name or abbreviation *
    // If timezone cannot be determined, no characters
    /**
     * @return {string}
     */
    Z: function () {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    },

};

function parseTimePattern() {
    let finalTimeString = testTimePattern;
    for (let c = 0; c < testTimePattern.length - 1; c++)
        if (testTimePattern[c] === "%" &&
            (testTimePattern.charCodeAt(c + 1) >= 65 &&
                testTimePattern.charCodeAt(c + 1) <= 122)) {
            SavedTimeOptions[testTimePattern[c + 1]] = true;
        }
    console.log(SavedTimeOptions);
        TimeUtils.currentTime = new Date();
    for (let setOption in SavedTimeOptions) {
        if (SavedTimeOptions[setOption] === true) {
            finalTimeString = finalTimeString.replace("%" + setOption,
                TimeUtils[setOption]());
        }
    }
    return finalTimeString;
}

//%dd means [01-31]+th
function TimeOptions(_year, _month, _weekday, _date_post_fx, _am_pm, _seconds) {
    this.year = _year;
    this.month = _month;
    this.weekday = _weekday;
    this.date_post_fx = _date_post_fx;
    this.am_pm = _am_pm;
    this.seconds = _seconds;
}

let timeObj = {
    htmlClockElement: document.getElementById("clock"),
    timeNow: null,
    amPM: null,
    dateNameNow: null,
    dayNameNow: null,
    monthNameNow: null,
    dayPostFix: null,
    hrsNow: null,
    minNow: null,
    secNow: null,
    yearNow: null,
    getTimeStr: function (options) {
        this.timeNow = new Date();
        this.yearNow = this.timeNow.toLocaleString("en-us", {year: options.year});
        this.dayNameNow = this.timeNow.toLocaleString("en-us", {weekday: options.weekday});
        this.monthNameNow = this.timeNow.toLocaleString("en-us", {month: options.month});
        this.dateNameNow = this.timeNow.getDate();
        this.secNow = this.timeNow.getSeconds();
        this.minNow = this.timeNow.getMinutes();
        this.hrsNow = this.timeNow.getHours(2);
        this.minNow = this.digitCorrection(this.minNow);
        if (options.year === "2-digit") {
            let t = this.yearNow.split("");
            t.unshift("'");
            this.yearNow = t.join("");
        }
        if (options.date_post_fx)
            this.getDayPostFix();
        if (options.seconds)
            this.secNow = this.digitCorrection(this.secNow);
        if (options.am_pm)
            this.resolveAmPm();
        return this.formString();
    },
    formString: function () {
        return this.dayNameNow + ", " + this.monthNameNow + " " +
            this.dateNameNow + this.dayPostFix + ", " +
            this.yearNow + " | " +
            this.hrsNow + ":" + this.minNow + ":" + this.secNow + this.amPM + "<br />";
    },
    getDayPostFix: function () {
        if (this.dateNameNow < 4) {
            switch (this.dateNameNow) {
                case 1:
                    this.dayPostFix = "st";
                    break;
                case 2:
                    this.dayPostFix = "nd";
                    break;
                default:
                    this.dayPostFix = "rd";
                    break;
            }
        } else if (this.dateNameNow > 20) {
            if (!(this.dateNameNow % 11))
                this.dayPostFix = "nd";
            else if (this.dateNameNow === 23 || this.dateNameNow === 33)
                this.dayPostFix = "rd";
            else if (this.dateNameNow === 21 || this.dateNameNow === 31)
                this.dayPostFix = "st";
            else
                this.dayPostFix = "th";
        } else {
            this.dayPostFix = "th";
        }
    },
    digitCorrection: function (c) {
        if (c < 10) {
            c = "0" + c;
        }
        return c;
    },
    resolveAmPm: function (mode) {
        this.hrsNow = convertTo12HRFormat(this.hrsNow);
        if (this.hrsNow === 0) {
            this.amPM = "AM";
        } else if (this.hrsNow < 12) {
            this.amPM = "AM";
        } else if (this.hrsNow === 12) {
            this.amPM = "PM";
        } else {
            this.amPM = "PM";
        }
    }
};

function convertTo12HRFormat(hrs) {
    if (hrs === 0) {
        hrs = 12;
    } else if (hrs === 12) {
    } else {
        hrs -= 12;
    }
    return hrs;
}

function resolveAmPmNew(hrsNow, caseMode) {
    let amPmString;
    hrsNow = convertTo12HRFormat(hrsNow);
    if (hrsNow === 0) {
        amPmString = timeMeridianModes.AM_PM_UPPERCASE ? constStrings.AM_UPPERCASE : constStrings.AM_LOWERCASE
    } else if (hrsNow < 12) {
        amPmString = caseMode === timeMeridianModes.AM_PM_UPPERCASE ? constStrings.AM_UPPERCASE : constStrings.AM_LOWERCASE;
    } else if (hrsNow === 12) {
        amPmString = timeMeridianModes.AM_PM_UPPERCASE ? constStrings.PM_UPPERCASE : constStrings.PM_LOWERCASE;
    } else {
        amPmString = timeMeridianModes.AM_PM_UPPERCASE ? constStrings.PM_UPPERCASE : constStrings.PM_LOWERCASE;
    }
    return amPmString;
}

function digitCorrectionNew(c) {
    return c < 10 ? c = "0" + c : c;
}

function initTimeScript() {
    timeObj.htmlClockElement.innerHTML = "Today is " + parseTimePattern();
    let t = setTimeout(function () {
        initTimeScript()
    }, 500);
}
