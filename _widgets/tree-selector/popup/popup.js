import {Dialog} from 'framework';

export class Node {
	constructor(name, children = null){
		this.name = name;
		this.children = children;
		this.parent = null;
		this.assignParent();
	}

	assignParent(){
		if(this.children && this.children.length){
			for(var child of this.children){
				child.parent = this;
			}
		}
	}

	toString(){
		return this.name;
	}

	equals(node){
		var isSame = true;
		if(this.parent){
			isSame = isSame && (node.parent && node.parent.name == this.parent.name);
		}
		if(this.id){
			isSame = isSame && this.id === node.id;
		}
		isSame = isSame && this.name === node.name;
		return isSame;
	}
}

class TreeSelector extends Dialog {
	constructor(){
		this.rootNodes = [];
		this.nodes = [];
		this.parentNodes = [];
		this.chosenNode = null;
		this.chosenNodeLast = null;
		this.leafOnly = true;
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
			this.close(node);
		}
	}

	done(){
		this.close(this.chosenNodeLast);
	}

	activate(settings){
		this.rootNodes = settings.nodes;
		this.leafOnly = settings.leafOnly !== false;
		var selectedNode = settings.selected;
		this.chosenNode = null;
		this.chosenNodeLast = null;
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