var timeStrings ={
	monthsNames: new Array(
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sept",
	"Oct",
	"Nov",
	"Dec"),
	daysNames: new Array("Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday")
};
var timeObj = {
	htmlE: document.getElementById("time"),
	timeNow: null,
	amPM: null,
	dateName: null,
	dayName: null,
	monthName: null,
	dayPostFix: null,
	nowHrs: null,
	nowMin: null,
	nowSec: null,
	yearNow: null,
	getTimeStr: function(){
		this.timeNow = new Date();
		this.dayName = timeStrings.daysNames[this.timeNow.getDay()];
		this.monthName = timeStrings.monthsNames[this.timeNow.getMonth()];
		this.dateName = this.timeNow.getDate();
		this.yearNow = this.timeNow.getFullYear();
		this.getDayPostFix();
		this.nowSec = this.timeNow.getSeconds();
		this.nowMin = this.timeNow.getMinutes();
		this.nowHrs = this.timeNow.getHours(2);
		this.nowMin = this.digitCorrection(this.nowMin);
		this.nowSec = this.digitCorrection(this.nowSec);
		this.resolveAmPm();
		return this.formString();
	},
	formString: function(){
		return this.dayName+ ", " + this.monthName+" "+
			this.dateName+this.dayPostFix+", "+
			this.yearNow+" | "+
			this.nowHrs+":"+this.nowMin+":"+this.nowSec+this.amPM+"<br />";
	},
	getDayPostFix: function(){
		if(this.dateName < 4){
			switch(this.dateName){
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
		}
		else if(this.dateName>20){
			if(!(this.dateName%11))
				this.dayPostFix = "nd";
			else if(this.dateName == 23 || this.dateName == 33)
				this.dayPostFix = "rd";
			else if(this.dateName == 21 || this.dateName == 31)
				this.dayPostFix = "st";
			else
				this.dayPostFix = "th";
			}
		else{
			this.dayPostFix = "th";
		}
	},
	digitCorrection: function(c){
		if(c<10){
			c="0"+c;
		}
		return c;
	},
	resolveAmPm: function(){
		if(this.nowHrs == 0){
			this.nowHrs=12;
			this.amPM = "AM";
		}
		else if(this.nowHrs < 12){
			this.amPM = "AM";
		}
		else if(this.nowHrs == 12){
			this.amPM = "PM";
			}
		else {
			this.nowHrs-=12;
			this.amPM = "PM";
		}
	}
};
function initTimeScript(){
	timeObj.htmlE.innerHTML = "Today is " + timeObj.getTimeStr(); //str;
	var t = setTimeout(function(){initTimeScript()}, 500);
}
