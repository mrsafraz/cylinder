import {DataService, Paginator} from 'framework';
import {Toast} from 'framework';
import {Dialog} from 'framework';
import TestDialog from './test-dialog/test-dialog';
import {ChartFactory} from 'framework';

class MyModel {
	constructor(){
		this.someDate = new Date();
		this.color = null;
	}
}

class Widgets {
	constructor(db: DataService, paginator: Paginator, toast: Toast, testDialog: TestDialog, chartFactory: ChartFactory){
		this.db = db;
		this.longText = 'Lorem ipsum dolor sit amet. Consectetur adipiscing elit. Integer molestie lorem at massa. Facilisis in pretium nisl aliquet. Nulla volutpat aliquam velit. Phasellus iaculis neque. Purus sodales ultricies. Vestibulum laoreet porttitor sem. Ac tristique libero volutpat at. Faucibus porta lacus fringilla vel. Aenean sit amet erat nunc. Eget porttitor lorem.  Consectetur adipiscing elit. Integer molestie lorem at massa. Facilisis in pretium nisl aliquet. Nulla volutpat aliquam velit. Phasellus iaculis neque. Purus sodales ultricies. Vestibulum laoreet porttitor sem. Ac tristique libero volutpat at. Faucibus porta lacus fringilla vel. Aenean sit amet erat nunc.';
		this.myModel = new MyModel();
		this.colors = [
			'blue', 'orange', 'red', 'green',
		];
		this.selectedBranch = null;
		this.branches = [];
	    this.paginator = paginator.create('Branch', {}, {}, (results) => {
	      this.branches = results;
	    });
	    this.paginator.pageSize = 3; // for testing
	    this.attachment = this.db.create('File');
	    this.toast = toast;
	    this.testDialog = testDialog;
	    this.popoverPositions = ['bottom', 'top', 'right', 'left'];
	    this.popoverPosition = 'bottom';
	    this.popoverAlignments = ['center', 'top', 'right', 'left', 'bottom'];
	    this.popoverAlignment = 'center';
	    this.chartFactory = chartFactory;
	    this.initTestChart();
	}

	initTestChart(){
		this.testChart = this.chartFactory.generate({
		    data: {
		        columns: [
		            ['data1', 30, 200, 100, 400, 150, 250],
		            ['data2', 50, 20, 10, 40, 15, 25]
		        ]
		    }
		});
		setTimeout(()=> {
		    this.testChart.load({
		        columns: [
		            ['data1', 230, 190, 300, 500, 300, 400]
		        ]
		    });
		}, 3000);
	}

	treeSelect($event){
		Dialog.showInstance('cylinder/_widgets/tree-selector', {}, {
			popover: $event.target,
			autoclose: true,
		});
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

	navigation($event){
		Dialog.showInstance('cylinder/_widgets/navigation-popup', {
			entity: this.selectedBranch,
			property: 'branchType.name',
		}, {
			popover: $event.target,
			autoclose: true,
		});
	}

	dropdown($event){
		// 		<dropdown-picker object.bind="myModel" property.bind="'color'" 
		// 		options.bind="colors" caption.bind="'-- Choose Color --'"></dropdown-picker>
		Dialog.showInstance('cylinder/_widgets/lookup-popup', {
			object: this.myModel,
			property: 'color',
			options: this.colors,
			caption: '-- Choose Color --',
		}, {
			popover: $event.target,
			autoclose: true,
		});
	}

	showToast(variant = ''){
		this.toast['show' + variant]('This is a ' + variant + ' Toast')
	}

	showDialog($event){
		var data = {};
		var options = {
			autoclose: true,
			// overlay: false
		};
		if($event){
			options.popover = $event.target;
			options.position = this.popoverPosition + ' ' + this.popoverAlignment;
		}
		// this.testDialog.show(data, options);
		Dialog.showInstance('cylinder/demo/widgets/test-dialog', data, options).then(result=> {
			// alert(result);
		});
	}

	activate(){
		this.selectedBranch = this.db.getOne('Branch');
		// console.log('iiii', this.item);
		this.paginator.activate();
	}
}

export default Widgets;
