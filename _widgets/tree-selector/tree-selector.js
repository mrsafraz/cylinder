import {Widget} from 'framework';
import {Node} from 'framework';
import TreeSelectorPopup from './popup/popup';

class TreeSelector {
	constructor(treeSelectorPopup: TreeSelectorPopup){
		this.treeSelectorPopup = treeSelectorPopup;
		this.chosenNode = null;
		this.nodes = [];
	}
	treeSelect($event){
		this.treeSelectorPopup.show({
			onSelect: this.onSelect,
			selected: this.chosenNode,
			nodes: this.nodes
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
	}
}

export default TreeSelector;