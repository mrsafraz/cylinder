import {Widget} from 'framework';
import {Node} from './popup/popup';
import TreeSelectorPopup from './popup/popup';

class TreeSelector {
	constructor(treeSelectorPopup: TreeSelectorPopup){
		this.treeSelectorPopup = treeSelectorPopup;
		this.chosenNode = null;
		this.nodes = [];
	}
	treeSelect($event){
		this.treeSelectorPopup.show({
			selected: this.chosenNode,
			nodes: [
				new Node('Visiting Inquiry'),
				new Node('Telephone Inquiry'),
				new Node('Web Inquiry'),
				new Node('Some Parent', [
					new Node('A child'),
					new Node('A child 2'),
				]),
				new Node('Some Other Parent', [
					new Node('A child'),
					new Node('A child 2'),
					new Node('A child with Children', [
						new Node('Level 3?'),
						new Node('Oh no!', [
							new Node('This is too much!'),
							new Node('Enough!'),
						]),
						new Node('Yes'),
					]),
					new Node('Some Parent', [
						new Node('one and only'),
					]),
				]),
			]
		}, {
			popover: $event.target,
			autoclose: true,
		}).then((chosenNode)=> {
			if(chosenNode){
				this.chosenNode = chosenNode;
			}
		});
	}
}

export default TreeSelector;