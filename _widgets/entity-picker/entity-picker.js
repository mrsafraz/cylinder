import {Widget, Observer} from 'framework';
import {DataService} from 'framework';
import $ from 'jquery';
import {SearchCriteriaBuilder} from '../search-input/SearchCriteriaBuilder';

class EntityPicker extends Widget  {

  constructor(dataService: DataService, searchCriteriaBuilder: SearchCriteriaBuilder){
    this.searchCriteriaBuilder = searchCriteriaBuilder;
    this.dataService = dataService;
    this.editMode = false;
    this.view = null;
    this.searchText = '';
    this.object = null;
    this.property = null;
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
    return this.displayText(this.valueObservable());
  }

  applyFilter(searchText, localOnly = false){
    var criteria = {};
    if(searchText !== undefined && searchText !== '') {
      criteria['$or'] = this.searchCriteriaBuilder.getOrCriteria(searchText,
          this.entityType, this.searchBy);
    }
    var options = {limit: 100};
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
    this.valueObservable = Observer.getObservable(this.object, this.property);
    if(settings.displayText){
      this.displayText = settings.displayText;
    }
    this.applyFilter(this.searchText, true);
  }

}

export default EntityPicker;