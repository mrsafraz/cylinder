import {Widget, DataService} from 'framework';
import {SearchCriteriaBuilder} from './SearchCriteriaBuilder';
import moment from 'moment';
import $ from 'jquery';

class SearchInputWidget extends Widget  {

  constructor(dataService: DataService, searchCriteriaBuilder: SearchCriteriaBuilder){
    this.dataService = dataService;
    this.searchCriteriaBuilder = searchCriteriaBuilder;
    this.searchText = '';
    this.paginator = null;
    this.properties = [];
    this.label = 'Search...';
    this.lastSearched = new Date();
    this.view = null;
  }

  criteriaArray(searchKeyword){
    return this.searchCriteriaBuilder.getOrCriteria(searchKeyword, this.paginator.entityType, this.properties);
  }

  doSearch(){
      var searchText = $.trim(this.searchText);
      var criteriaArray = [];
      var searchTextArray = searchText.split(' ');
      searchTextArray = [searchText];
      for(var searchKeyword of searchTextArray){
        criteriaArray = criteriaArray.concat(this.criteriaArray(searchKeyword));
      }
  //    this.criteria['purchaseInvoice.invoiceNo'] = {$contains: this.searchText};
      this.paginator.criteria['$or'] = criteriaArray;
      this.paginator.currentPage = 1;
      this.paginator.refresh();
  }
  
  search(){
    window.setTimeout(()=> {
      this.doSearch();
    }, 1);
  }
  
  instantSearch(){
    this.search();
  }
  
  reset(){
    this.searchText = '';
    this.search();
    if(this.view){
      $(this.view).find('input[type="search"]').focus();
    }
  }

  attached(view){
    this.view = view;
  }

  activate(settings){
    this.paginator = settings.paginator;
    this.properties = settings.properties;
    if(settings.label){
      this.label = settings.label;
    }
  }

}

export default SearchInputWidget;