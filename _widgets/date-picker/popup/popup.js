import $ from 'jquery';
import {Dialog} from 'framework';

class DatePicker extends Dialog { 
	constructor(){
		super();
		this.months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		this.years = [2015, 2014, 2013, 2012, 2011, 2010];
		// this.weekNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
		this.weekNames = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
		this.weekFirstIsMonday = this.weekNames[0] == 'Mo';
		// this.days = 
		this.dateObj = new Date();
		// this.selectCurrent();
		this.prevDates = [];
		this.dates = [];
		this.nextDates = [];
		// this.calculateDates();

		//TIME
		this.timeHours = '12';
		this.timeMinutes = '00';
		this.timeIsPm = true;
		this.timeAlso = false;

		this.selectCurrent();
	}

	selectCurrent(){
		this.current = {
			year: this.dateObj.getFullYear(),
			month: this.months[this.dateObj.getMonth()],
		};
		this.selected = {
			year: this.current.year,
			month: this.current.month,
			date: this.dateObj.getDate(),
			hours: this.dateObj.getHours(),
			minutes: this.dateObj.getMinutes(),
		};
		var hours = this.dateObj.getHours();
		var minutes = this.dateObj.getMinutes();
		this.timeMinutes = '00';
		if(minutes > 0 && minutes <= 15){
			this.timeMinutes = '15';
		}
		else if(minutes > 15 && minutes <= 30){
			this.timeMinutes = '30';
		}
		else if(minutes > 30 && minutes <= 45){
			this.timeMinutes = '45';
		}
		else if(minutes > 45 && minutes <= 59){
			this.timeMinutes = '00';
			hours++;
		}
		if(hours >= 12){
			this.timeIsPm = true;
			if(hours > 12){
				hours = hours - 12;
			}
		}
		else {
			this.timeIsPm = false;
		}
		this.timeHours = (hours < 10 ? '0' : '') + hours;
		// alert(this.timeHours);
		this.changeTime();
		this.calculateDates();
	}

	toggleTimeIsPm(){
		this.timeIsPm = !this.timeIsPm;
		this.changeTime();
	}

	changeTime(){
		var hours = parseInt(this.timeHours);
		var minutes = parseInt(this.timeMinutes);
		if(this.timeIsPm && hours < 12){
			hours += 12;
		}
		// if(hours == 24){
		// 	hours = 0;
		// }
		this.selected.hours = hours;
		this.selected.minutes = minutes;
	}

	changeMonth(direction = 1){
		var month = this.months.indexOf(this.current.month);
		var changedMonthDate = new Date(this.current.year, month+direction, 1);
		this.current.year = changedMonthDate.getFullYear();
		this.current.month = this.months[changedMonthDate.getMonth()];
		this.calculateDates();
	}

	nextMonth(){
		return this.changeMonth(1);
	}

	prevMonth(){
		return this.changeMonth(-1);
	}

	selectDate(date){
		this.selected.year = this.current.year;
		this.selected.month = this.current.month;
		this.selected.date = date;
		this.isDateActive(date);
		// this.ok();
	}

	selectToday(){
		this.dateObj = new Date();
		this.selectCurrent();
		this.ok();
	}

	isNearDateActive(date, prev = false){
	}

	isNextDateActive(date){
		return this.isDateActive(date, 1);
	}

	isPrevDateActive(date){
		return this.isDateActive(date, -1);
	}

	isDateActive(date, monthAdjust = 0){
		var month = this.months.indexOf(this.current.month);
		month += monthAdjust;
		var year = this.current.year;
		if(month == -1){
			month = 11;
			year--;
		}
		if(month == 12){
			month = 0;
			year++;
		}
		var isActive = date == this.selected.date 
		&& this.months[month] == this.selected.month 
		&& year == this.selected.year;
		return isActive;
	}

	selectPrevDate(date){
		this.prevMonth();
		this.selectDate(date);
		// this.nextMonth();
	}

	selectNextDate(date){
		this.nextMonth();
		this.selectDate(date);
		// this.prevMonth();
	}

	calculateDates(){
		this.dates = [];
		this.prevDates = [];
		this.nextDates = [];
		var month = this.months.indexOf(this.current.month),
		firstDate = new Date(this.current.year, month, 1),
		lastDate = new Date(this.current.year, month+1, 0),
		firstDay = firstDate.getDay();
		if(this.weekFirstIsMonday){
			if(firstDay == 0){
				firstDay = 7;
			}
			firstDay -= 1;
		}
		// var prevFirstDate = new Date(this.current.year, month-1, 1);
		var prevLastDate = new Date(this.current.year, month, 0);
		// alert(firstDay);
		// for(var i = 7-firstDay; i >= 0; i--){
		for(var i = firstDay-1; i >= 0; i--){
			this.prevDates.push(prevLastDate.getDate() - i);
			// this.prevDates.push(i);
		}
		for(var i = 1; i <= lastDate.getDate(); i++){
			this.dates.push(i);
		}
		for(var i = 1; i <= (6*7 - (this.prevDates.length + this.dates.length)); i++){
			this.nextDates.push(i);
		}
	}

	ok(){
		var date =  new Date(this.dateObj.getTime());
		date.setFullYear(this.selected.year);
		var month = this.months.indexOf(this.selected.month);
		date.setMonth(month);
		date.setDate(this.selected.date);
		date.setHours(this.selected.hours);
		date.setMinutes(this.selected.minutes);
		console.log('SELECTED DATE: ', date);
		this.close(date);
	}

	activate(settings){
		this.dateObj = new Date();
		if(settings.date){
			this.dateObj = new Date(settings.date.getTime());
			console.log('SELECTED DATE (DEFAULT): ', this.dateObj);
		}
		if(settings.time){
			this.timeAlso = true;
		}
		this.selectCurrent();
	}
}

export default DatePicker;