import {DataService, Paginator} from 'framework';
import dialog from 'plugins/dialog';

class MyModel {
	constructor(){
		this.someDate = new Date();
		this.color = null;
	}
}

class Widget {
	constructor(db: DataService, paginator: Paginator){
		this.db = db;
		this.longText = 'Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Integer molestie lorem at massa. Facilisis in pretium nisl aliquet. Nulla volutpat aliquam velit. Phasellus iaculis neque. Purus sodales ultricies. Vestibulum laoreet porttitor sem. Ac tristique libero volutpat at. Faucibus porta lacus fringilla vel. Aenean sit amet erat nunc. Eget porttitor lorem.  Consectetur adipiscing elit. Integer molestie lorem at massa. Facilisis in pretium nisl aliquet. Nulla volutpat aliquam velit. Phasellus iaculis neque. Purus sodales ultricies. Vestibulum laoreet porttitor sem. Ac tristique libero volutpat at. Faucibus porta lacus fringilla vel. Aenean sit amet erat nunc.';
		this.myModel = new MyModel();
		this.colors = [
			'blue', 'orange', 'red', 'green',
		];
		this.selectedItem = null;
		this.items = [];
	    this.paginator = paginator.create('Item', {}, {}, (results) => {
	      this.items = results;
			console.log('IEMS', this.items);
	    });
	    this.paginator.pageSize = 2; // for testing
	    this.attachment = this.db.create('File');
	}

	showMore(event){
		alert(this.longText);
		// dialog.show('complaint/detail/more/more', this.complaint);
	}

	revealCallback(){
		return this.showMore.bind(this);
	}

	updateSomeDate(date){
		alert('Date changed! ' + date);
	}

	datePickerCallback(){
		return this.updateSomeDate.bind(this);
	}

	dropdown($event){
		// 		<dropdown-picker object.bind="myModel" property.bind="'color'" 
		// 		options.bind="colors" caption.bind="'-- Choose Color --'"></dropdown-picker>
		dialog.showActionsheet('_widgets/lookup-popup/lookup-popup', {
			object: this.myModel,
			property: 'color',
			options: this.colors,
			caption: '-- Choose Color --',
			target: $event.target,
		});
	}

	activate(){
		this.selectedItem = this.db.getOne('Item');
		// console.log('iiii', this.item);
		this.paginator.activate();
	}
}

export default Widget;
