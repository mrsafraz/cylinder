import {Dialog} from 'framework';

class TreeSelector extends Dialog {
	constructor(){
		super();
		this.rootNodes = [];
		this.nodes = [];
		this.parentNodes = [];
		this.chosenNode = null;
		this.chosenNodeLast = null;
		this.leafOnly = true;
		this.rootTitle = 'All';
	}

	reset(){
		this.nodes = this.rootNodes;
		this.parentNodes = [];
	}

	navigateNode(node, index){
		this.chooseNode(node);
	}

	isChosenNode(node){
		if(!this.chosenNode){
			return false;
		}
		return node.equals(this.chosenNode);
	}

	setParentNodes(node){
		var parentNodes = [];
		var i = 0;
		while(true){
			if(!node){
				break;
			}
			if(node.children){
				parentNodes.push(node);
			}
			node = node.parent;
		}
		this.parentNodes = parentNodes.reverse();
	}

	chooseNode(node, close = true){
		this.setParentNodes(node);
		this.chosenNodeLast = node;
		if(node.children){
			if(typeof node.children == 'function'){
				var children = node.children();
				if(children.length){
					this.nodes = children;
					return;
				}
				if(children.then){
					children.then((nodes)=> {
						this.nodes = nodes;
					});
				}
			}
			else {
				this.nodes = node.children;
			}
			return;
		}
		this.chosenNode = node;
		if(close){
			this.selectAndClose(node);
		}
	}

	selectAndClose(node){
		this.close(node);
	}

	done(){
		this.selectAndClose(this.chosenNodeLast);
	}

	activate(settings){
		this.rootNodes = settings.nodes;
		this.leafOnly = settings.leafOnly !== false;
		var selectedNode = settings.selected;
		this.chosenNode = null;
		this.chosenNodeLast = null;
		this.onSelect = settings.onSelect;
		if(settings.title){
			this.rootTitle = settings.title;
		}
		this.reset();
		if(selectedNode){
			if(selectedNode.parent){
				this.chooseNode(selectedNode.parent);
			}
			this.chooseNode(selectedNode, false);
		}
	}
}

export default TreeSelector;