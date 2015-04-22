import {Widget, Observer} from 'framework';
import $ from 'jquery';
import ko from 'knockout';

class DropdownPicker extends Widget  {

  constructor(){
    super();
    this.editMode = false;
    this.view = null;
    this.searchText = '';
    this.object = null;
    this.property = null;
    this.optionsAll = [];
    this.options = [];
    this.caption = ' -- Select -- ';
    this.valueObservable = null;
    this.displayText = object => '' + object;
    Observer.observe(this, 'searchText', 'applyFilter');
  }

  attached(view){
    this.view = view;
  }

  startEditing(){
    this.editMode = true;
    window.setTimeout(()=> {
      $(this.view).find('.form-control').first().focus();
    }, 100);
  }

  stopEditing(){
    window.setTimeout(()=> {
      this.editMode = false;
      this.searchText = '';
    }, 100);
  }

  reset(){
    // alert('col');
    this.searchText = '';
    window.setTimeout(()=> {
      this.startEditing();
    }, 101);
  }

  selectValue(value){
    if(this.valueObservable() === value){
      this.valueObservable(null);
      return;
    }
    if(this.multiple){
      var alreadyIndex = this.valueObservable.indexOf(value);
      if(alreadyIndex !== -1){
        this.valueObservable.splice(alreadyIndex, 1);
      }
      else {
        this.valueObservable.push(value);
      }
      return;
    }
    this.valueObservable(value);
    this.dismiss();
  }

  dismiss(){
    this.editMode = false;
    this.searchText = '';
  }

  getSelectedValue(){
    if(!this.valueObservable()){
      return this.caption;
    }
    if(this.multiple){
      var values = [];
      for(var value of this.valueObservable()){
        values.push(this.displayText(value));
      }
      if(!values.length){
        return this.caption;
      }
      return values.join(', ');
    }
    return this.displayText(this.valueObservable());
  }

  applyFilter(searchText){
    if(searchText === undefined || searchText === ''){
      this.options = this.optionsAll;
      return;
    }
    searchText = ('' + searchText).toLowerCase();
    var optionsFiltered = [];
    for(var i = 0; i < this.optionsAll.length; i++){
      if(this.displayText(this.optionsAll[i]).toLowerCase().indexOf(searchText) !== -1){
        optionsFiltered.push(this.optionsAll[i]);
      }
    }
    this.options = optionsFiltered;
  }

  getOptionsText(option){
    return this.displayText(option);
  }

  isOptionSelected(option){
    if(this.multiple){
      return this.valueObservable.indexOf(option) !== -1;
    }
    return this.valueObservable() === option;
  }

  activate(settings){
    this.object = settings.object;
    this.property = settings.property;
    this.optionsAll = settings.options;
    if(settings.caption){
      this.caption = settings.caption;
    }
    this.valueObservable = Observer.getObservable(this.object, this.property);
    this.multiple = ko.isObservable(this.valueObservable) && 'push' in this.valueObservable;
    if(settings.displayText){
      this.displayText = settings.displayText;
    }
    this.applyFilter(this.searchText);
  }

}

export default DropdownPicker;