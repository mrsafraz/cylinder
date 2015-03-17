import breeze from 'breeze';
import {DataService} from 'framework';
import {Paginator} from 'framework';

var {EntityManager, EntityQuery} = breeze;

class Demo {
	constructor(entityManager: EntityManager, dataService: DataService){
		this.entityManager = entityManager;
		this.items = [];
		this.db = dataService;
		this.myName = 'Safraz';
	}
	load(){
		var criteria = {};
		var options = {
			expand: {
				profile: true
			},
			limit: 5,
			// localFirst: false,
		};
		this.db.findAll('Employee', criteria, craci).then(parties => {
			this.items = parties;
		});
	}
	activate(){
		// this.db.findAll('Branch').then((items) => {
		// 	this.items = items;
		// });
		return;
		// this.items = this.db.getAll('Item'); return;
		// this.items = this.entityManager.getEntities('Item'); return;
		// var query = new EntityQuery().from('Item');
		// this.entityManager.executeQuery(query).then((data)=> {
		// 	this.items = data.results;
		// });
	}
}

export default Demo;