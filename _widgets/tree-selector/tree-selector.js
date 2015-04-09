import {Widget} from 'framework';
import {Node} from 'framework';
import TreeSelectorPopup from './popup/popup';

class TreeSelector {
	constructor(treeSelectorPopup: TreeSelectorPopup){
		this.treeSelectorPopup = treeSelectorPopup;
		this.chosenNode = null;
		this.nodes = [];
		this.caption = 'Select';
		this.title = 'All';
	}
	treeSelect($event){
		this.treeSelectorPopup.show({
			onSelect: this.onSelect,
			selected: this.chosenNode,
			nodes: this.nodes,
			title: this.title,
		}, {
			popover: $event.target,
			autoclose: true,
		}).then((chosenNode)=> {
			if(chosenNode){
				this.chosenNode = chosenNode;
				// alert(this.chosenNode);
				if(this.onSelect){
					this.onSelect(this.chosenNode);
				}
			}
		});
	}

	activate(settings){
		this.onSelect = settings.onSelect;
		this.nodes = settings.nodes;
		if(settings.caption){
			this.caption = settings.caption;
		}
		if(settings.title){
			this.title = settings.title;
		}
	}
}

export default TreeSelector;