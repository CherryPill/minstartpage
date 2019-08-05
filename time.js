//gets from config in local storage
//year: numeric, 2-digit, month: long short, weekday: long short,
//date_post_fx: true false, _am_pm: true false, seconds true false

let testTimePattern = "%A, %B %dd, %Y | %H:%M:%S"; //current time format
//supported time format specifiers
testTimePattern = "%a : %A : %b %d %f: %R %p";


var SavedTimeOptions = {
    "a": false,
    "A": false,
    "b": false,
    "R": false,
};

var TimeUtils = {
    currentTime: new Date(),
    "A": () => {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        return this.currentTime.toLocaleString("en-us",
            {weekday: "short"});
    },
    "a": () => {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        return this.currentTime.toLocaleString("en-us",
            {weekday: "long"});
    },
    "b": () => {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        return this.currentTime.toLocaleString("en-us",
            {month: "short"});
    },
    "B": () => {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        return this.currentTime.toLocaleString("en-us",
            {month: "long"});
    },
    "c": () => {
        /*this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        return this.currentTime.toLocaleString("en-us",
            {month: "long"});*/
    },
    //Year divided by 100 and truncated to integer (00-99)
    "C": () => {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        return parseInt(this.currentTime.getFullYear()/100);
    },
    //Day of the month, zero-padded (01-31)
    "d": () => {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        return this.currentTime.toLocaleString("en-us",
            {day: "2-digit"});

    },
    //	Short MM/DD/YY date, equivalent to %m/%d/%y
    "D": () => {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        return `${this.currentTime.getMonth()}/${this.currentTime.getDate()}/${this.getFullYear()}`;
    },
    //Day of the month, space-padded ( 1-31)
    "e": () => {

    },
    //	Short YYYY-MM-DD date, equivalent to %Y-%m-%d
    "F": () => {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        return `${this.currentTime.getFullYear()}-${this.currentTime.getMonth()}-${this.getDate()}`;

    },
    //day of the month postfix (th, nd, rd, etc)
    "f": () => {
        timeObj.dateNameNow = this.currentTime.getDate();
        console.log(timeObj.dateNameNow);
        timeObj.getDayPostFix();
        return timeObj.dayPostFix;

    },
    //Week-based year, last two digits (00-99)
    "g": () => {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        return this.currentTime.getFullYear();
    },
    //	Week-based year
    "G": () => {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        return this.currentTime.toLocaleString("en-us",
            {day: "2-digit"});
    },

    //Abbreviated month name * (same as %b)
    "h": () => {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        return this.currentTime.toLocaleString("en-us",
            {month: "short"});
    },
    //Hour in 24h format (00-23)
    "H": () => {
        return this.currentTime.getHours();
    },
    //Hour in 12h format (01-12)
    "I": () => {

    },
    //Day of the year (001-366)
    "j": () => {

    },
    //Month as a decimal number (01-12)
    "m": () => {
        return this.currentTime.getMonth();
    },
    //Minute (00-59)
    "M": () => {
        this.currentTime.getMinutes();
    },
    //New-line character ('\n')
    "n": () => {
        return "\n";
    },
    //AM or PM designation
    //works
    "p": () => {
        timeObj.hrsNow = this.currentTime.getHours();
        timeObj.resolveAmPm();
        return timeObj.amPM;
    },
    //12-hour clock time *
    "r": () => {

    },

    "R": () => {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        let minNow = this.currentTime.getMinutes();
        let hrsNow = this.currentTime.getHours(2);
        return `${hrsNow}:${minNow}`;
    },
    //Second (00-61)
    "S": () => {
        return this.currentTime.getSeconds();
    },
    //Horizontal-tab character ('\t')
    "t": () => {
        return "\t";
    },
    //ISO 8601 time format (HH:MM:SS), equivalent to %H:%M:%S
    "T": () => {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        let minNow = this.currentTime.getMinutes();
        let hrsNow = this.currentTime.getHours();
        let secNow = this.currentTime.getSeconds();
        return `${hrsNow}:${minNow}:${secNow}`;
    },
    //ISO 8601 weekday as number with Monday as 1 (1-7)
    "u": () => {
        return this.currentTime.getDay();
    },
    //Week number with the first Sunday as the first day of week one (00-53)
    "U": () => {

    },
    //ISO 8601 week number (01-53)
    "V": () => {

    },
    //Weekday as a decimal number with Sunday as 0 (0-6)
    "w": () => {

    },
    //Week number with the first Monday as the first day of week one (00-53)
    "W": () => {

    },
    //Date representation
    "x": () => {

    },
    //Time representation
    "X": () => {

    },
    //Year, last two digits (00-99)
    "y": () => {

    },
    //Year
    "Y": () => {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;

        return this.currentTime.getFullYear();
    },
    //ISO 8601 offset from UTC in timezone (1 minute=1, 1 hour=100)
    // If timezone cannot be determined, no characters
    "z": () => {
        this.currentTime === undefined ? this.currentTime = new Date() : this.currentTime;
        return this.currentTime.getTimezoneOffset()
    },
    //Timezone name or abbreviation *
    // If timezone cannot be determined, no characters
    "Z": () => {
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
    for (let setOption in SavedTimeOptions) {
        if (SavedTimeOptions[setOption] === true) {
            finalTimeString = finalTimeString.replace("%" + setOption,
                eval("TimeUtils." + setOption + "()"));
        }
    }
    alert(finalTimeString);
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
    resolveAmPm: function () {
        if (this.hrsNow === 0) {
            this.hrsNow = 12;
            this.amPM = "AM";
        } else if (this.hrsNow < 12) {
            this.amPM = "AM";
        } else if (this.hrsNow === 12) {
            this.amPM = "PM";
        } else {
            this.hrsNow -= 12;
            this.amPM = "PM";
        }
    }
};

function initTimeScript() {
    parseTimePattern();
    /*let dummyOptions = new TimeOptions("numeric", "long", "long", true, true, true);
    timeObj.htmlClockElement.innerHTML = "Today is " + timeObj.getTimeStr(dummyOptions); //str;
    let t = setTimeout(function () {
        initTimeScript()
    }, 500);*/
}
