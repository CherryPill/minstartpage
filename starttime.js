//time script for starеpage

var timeNow = new Date();


var amPM;
//get time

var nowSec = timeNow.getSeconds();
var nowMin = timeNow.getMinutes();
var nowHrs = timeNow.getHours(2);

if(nowMin<10){
	nowMin="0"+nowMin;
	}
var monthsName = new Array("Jan", "Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec");
var daysName = new Array("Sun", "Mon", "Tue","Wed","Thu","Fri","Sat");

//var japMonthsName = new Array("睦月","如月","弥生", "卯月", "皐月","水無月","文月","葉月","長月","神無月","霜月","師走");
//var japDaysName = new Array("日","月","火","水","木","金","土");

//jap



//eng
var dayNameNow = timeNow.getMonth();
var dateNow = timeNow.getDate();
var getDayNum = timeNow.getDay();

//setting day and month names for eng
var dayName = daysName[getDayNum];
var monthName = monthsName[dayNameNow];

//for jp

//var dayName = japDaysName[getDayNum];
//var monthName = japMonthsName[dayNameNow];


var dayPostFix;
if(dateNow < 4) {
	switch(dateNow) {
		case 1:{
			dayPostFix = "st";
			break;
		}
		case 2:{
			dayPostFix = "nd";
			break;
		}
		default:{
			dayPostFix = "rd";
			break;
		}
	}
}
else if(dateNow>20) {
	if(!(dateNow%11))
		dayPostFix = "nd";
	else if(dateNow == 23 || dateNow == 33)
		dayPostFix = "rd";
	else if(dateNow == 21 || dateNow == 31)
		dayPostFix = "st";
	else
		dayPostFix = "th";
	}
else {
	dayPostFix = "th";
}
//am | pm
if(nowHrs < 12)
	amPM = "AM";
else if(nowHrs == 12) {
	nowHrs=1;
	amPM = "PM";
}
else if(nowHrs == 0){
	nowHrs=12;
	amPM = "AM";
}
else {
	nowHrs-=12;
	amPM = "PM";
}
//japanese time fix
//var dayNameJap = dayName;
//var nowHrsJap = nowHrs+6;
//if(nowHrs>18)
//{
	//dayNameJap = japDaysName[getDayNum+1];
	//}
var a = document.getElementById("time");
a.innerHTML = monthName+" "+dateNow+dayPostFix+", "+dayName+" <b>"+nowHrs+":"+nowMin+":"+nowSec+amPM+"</b><br />";
//document.write("You're running "+navigator.appCodeName+" version: "+navigator.userAgent);
