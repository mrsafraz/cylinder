import {Widget, DataService} from 'framework';
import moment from 'moment';
import $ from 'jquery';

class SearchInputWidget extends Widget  {

  constructor(dataService: DataService){
    this.dataService = dataService;
    this.searchText = '';
    this.paginator = null;
    this.properties = [];
    this.label = 'Search...';
    this.lastSearched = new Date();
    this.view = null;
  }

  criteriaArray(searchKeyword){
    if(searchKeyword === ''){
      return [];
    }
    var criteriaArray = [];
    var metadataStore = this.dataService.entityManager.metadataStore; // model metadata known to this EntityManager instance
    var entityType = metadataStore.getEntityType(this.paginator.entityType);
    for(var propertyPath of this.properties){
      var property = entityType.getProperty(propertyPath);
//        console.log('PROPS to one', property));
//        criteriaArray.push({'purchaseInvoice.invoiceNo': {$contains: searchKeyword}});
//        criteriaArray.push({'supplier.profile.firstName': {$contains: searchKeyword}});



      if(property && property.dataType){
        if(property.dataType.name == 'DateTime'){
          var d = moment.utc(searchKeyword, 'DD/MM/YYYY');
          if(d && d.years() && d.months()+1 && d.date()){
            criteriaArray.push({
              $and: [
                {[propertyPath]: {$gt: moment(d).date(d.date()-1)}},
                {[propertyPath]: {$lt: moment(d).date(d.date()+1)}}
              ]
            });
          }
        }
        else if(property.dataType.name == 'String') {
          criteriaArray.push({[propertyPath]: {$contains: searchKeyword}});
        }
        else if (property.dataType.name.indexOf('Int') === 0){
          if(!isNaN(searchKeyword)){
            criteriaArray.push({[propertyPath]: parseInt(searchKeyword)});
          }
        }
        else {
          criteriaArray.push({[propertyPath]: searchKeyword});
        }
      }
    }
    return criteriaArray;
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