import breeze from 'breeze';
var {EntityManager} = breeze;

export class SearchCriteriaBuilder {

	constructor(entityManager: EntityManager){
		this.entityManager = entityManager;
	}

	getOrCriteria(searchKeyword, entityType, properties){
		if(!Array.isArray(properties)){
			properties = [properties];
		}
    if(searchKeyword === ''){
      return [];
    }
    var criteriaArray = [];
    var metadataStore = this.entityManager.metadataStore; // model metadata known to this EntityManager instance
    var entityType = metadataStore.getEntityType(entityType);
    for(var propertyPath of properties){
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
}