import {Widget, Observer} from 'framework';
import {DataService} from 'framework';
import $ from 'jquery';
import {SearchCriteriaBuilder} from '../search-input/SearchCriteriaBuilder';

class EntityPicker extends Widget  {

  constructor(dataService: DataService, searchCriteriaBuilder: SearchCriteriaBuilder){
    super();
    this.searchCriteriaBuilder = searchCriteriaBuilder;
    this.dataService = dataService;
    this.editMode = false;
    this.view = null;
    this.searchText = '';
    this.object = null;
    this.property = null;
    this.searchCriteria = {};
    this.searchOptions = {};
    this.options = [];
    this.caption = ' -- Select -- ';
    this.valueObservable = null;
    this.displayText = object => '' + object;
    this.searchBy = [];
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

  applyFilter(searchText, localOnly = false){
    var criteria = {};
    for(var key in this.searchCriteria){
      criteria[key] = this.searchCriteria[key];
    }
    if(searchText !== undefined && searchText !== '') {
      criteria['$or'] = this.searchCriteriaBuilder.getOrCriteria(searchText,
          this.entityType, this.searchBy);
    }
    var options = {limit: 100};
    for(var key in this.searchOptions){
      options[key] = this.searchOptions[key];
    }
    this.options = this.dataService.getAll(this.entityType, criteria, options);
    if(localOnly){
      return;
    }
    options.limit = 10;
    this.dataService.findAll(this.entityType, criteria, options).then((results)=> {
      this.options = results;
    });
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
    this.entityType = settings.entityType;
    var searchBy = settings.searchBy;
    if(!Array.isArray(searchBy)){
      searchBy = [searchBy];
    }
    this.searchBy = searchBy;
    if(settings.caption){
      this.caption = settings.caption;
    }
    if(settings.criteria){
      this.searchCriteria = settings.criteria;
    }
    if(settings.options){
      this.searchOptions = settings.options;
    }
    this.valueObservable = Observer.getObservable(this.object, this.property);
    this.multiple = ko.isObservable(this.valueObservable) && 'push' in this.valueObservable;
    if(settings.displayText){
      this.displayText = settings.displayText;
    }
    this.applyFilter(this.searchText, true);
  }

}

export default EntityPicker;