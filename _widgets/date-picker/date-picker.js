import {Widget} from 'framework';
// import dialog from 'plugins/dialog';
import $ from 'jquery';
import {Observer} from 'framework';
import DatePopupDialog from './popup/popup';

class DatePickerWidget extends Widget {
	constructor(datePopupDialog: DatePopupDialog){
		this.datePopupDialog = datePopupDialog;
		this.settings = {};
		this.selectedValue = null;//new Date();
		this.caption = 'Select';
		this.valueObservable = ()=> {};
		this.onChange = false;
	}

	editDate(event){
		var $target = $(event.target);
		if(!$target.hasClass('date-picker-container')){
			$target = $target.parents('.date-picker-container');
		}
		var target = $target.get(0);
		var settings = this.settings;
		settings.date = this.valueObservable();
		this.datePopupDialog.showAsPopup(settings, {
			popover: target,
			position: 'bottom',
			autoclose: true,
		}).then(date => {
			if(date){
				this.valueObservable(date);
				if(typeof this.onChange === 'function'){
					return this.onChange(date, event);
				}
			}
		});
	}

	attached(view){
		$(view).parent().css({
			display: 'inline',
		})
		return;
		$(view).parent().parent().css({
			position: 'relative',
			display: 'inline-block',
		});
		$(view).parent().css({
			position: 'absolute',
			left: 0,
			right: 0,
			top: 0,
			bottom: 0,
			width: '100%',
			height: '100%',
			opacity: 0,
			'z-index': 2,
			'background': 'rgba(255, 0, 0, 0.25)',
		});
	}

	activate(settings){
		this.settings = settings;
		this.valueObservable = Observer.getObservable(this.settings.object, this.settings.property);
		this.caption = this.settings.caption;
		this.onChange = this.settings.onChange;
	}
}

export default DatePickerWidget;