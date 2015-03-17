import {Dialog} from 'framework';
import {Widget, Observer} from 'framework';
import $ from 'jquery';

class LookupPopup  {

  constructor(){
  	this.autoclose = true;
    this.editMode = true;
    this.view = null;
    this.searchText = '';
    this.object = null;
    this.property = null;
    this.optionsAll = [];
    this.options = [];
    this.caption = ' -- Select -- ';
    this.valueObservable = null;
    this.displayValue = object => '' + object;
    this.target = null;
    Observer.observe(this, 'searchText', 'applyFilter');
  }

  attached(view){
    this.view = view;
  }

  startEditing(){
    this.editMode = true;
    window.setTimeout(()=> {
      $(this.view).find('.dropdown-picker-container .selector .form-control').focus();
    }, 10);
  }

  stopEditing(){
    window.setTimeout(()=> {
      this.editMode = false;
      this.searchText = '';
    }, 100);
  }

  selectValue(value){
    this.valueObservable(value);
  }

  getSelectedValue(){
    if(!this.valueObservable()){
      return this.caption;
    }
    return this.displayValue(this.valueObservable());
  }

  applyFilter(searchText){
    if(!searchText){
      this.options = this.optionsAll;
      return;
    }
    var optionsFiltered = [];
    for(var i = 0; i < this.optionsAll.length; i++){
      if(this.displayValue(this.optionsAll[i]).toLowerCase().indexOf(searchText) !== -1){
        optionsFiltered.push(this.optionsAll[i]);
      }
    }
    this.options = optionsFiltered;
  }

  activate(settings){
    this.object = settings.object;
    this.property = settings.property;
    this.optionsAll = settings.options;
    if(settings.caption){
      this.caption = settings.caption;
    }
    this.valueObservable = Observer.getObservable(this.object, this.property);
    if(settings.displayValue){
      this.displayValue = settings.displayValue;
    }
    this.target = settings.target;
    this.applyFilter(this.searchText);
    console.log('WIDGGG', this);
    console.log('WIDGGG settings', settings);
    debugger;
  }

}

export default LookupPopup;