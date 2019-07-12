//gets from config in local storage
//year: numeric, 2-digit, month: long short, weekday: long short,
//date_post_fx: true false, _am_pm: true false, seconds true false

let testTimePattern = "%A, %B %dd, %Y | %H:%M:%S" ;

function parseTimePattern(){}
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
    let dummyOptions = new TimeOptions("numeric", "long", "long", true, true, true);
    timeObj.htmlClockElement.innerHTML = "Today is " + timeObj.getTimeStr(dummyOptions); //str;
    let t = setTimeout(function () {
        initTimeScript()
    }, 500);
}
