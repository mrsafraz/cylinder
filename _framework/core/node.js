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