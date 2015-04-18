import {Entity} from './entity';
import ko from 'knockout';
import breeze from 'breeze';

export function getFileUrlForId(urlPrefix, fileId, cachebust) { // OK
    fileId = (fileId || 0);
    cachebust = cachebust || ((fileId && Math.random()) || 0);
    var url = urlPrefix + fileId + '?' + cachebust;
    return url;
}

// export function getThumbUrl(...params){
//   return getFileUrlForId(...params);
// }

// export function getImageUrl(...params){
//   return getFileUrlForId(...params);
// }

function getNoFileUrl() { // OK
    return 'data:image/svg+xml;base64,' + 'PD94bWwgdmVyc2lvbj0iMS4wIj8+DQo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgaGVpZ2h0PSIzMDBweCIgd2lkdGg9IjMwMHB4IiB2ZXJzaW9uPSIxLjAiIHZpZXdCb3g9Ii0zMDAgLTMwMCA2MDAgNjAwIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxjaXJjbGUgc3Ryb2tlPSIjQUFBIiBzdHJva2Utd2lkdGg9IjEwIiByPSIyODAiIGZpbGw9IiNGRkYiLz4NCjx0ZXh0IHN0eWxlPSJsZXR0ZXItc3BhY2luZzoxO3RleHQtYW5jaG9yOm1pZGRsZTt0ZXh0LWFsaWduOmNlbnRlcjtzdHJva2Utb3BhY2l0eTouNTtzdHJva2U6IzAwMDtzdHJva2Utd2lkdGg6MjtmaWxsOiM0NDQ7Zm9udC1zaXplOjM2MHB4O2ZvbnQtZmFtaWx5OkJpdHN0cmVhbSBWZXJhIFNhbnMsTGliZXJhdGlvbiBTYW5zLCBBcmlhbCwgc2Fucy1zZXJpZjtsaW5lLWhlaWdodDoxMjUlO3dyaXRpbmctbW9kZTpsci10YjsiIHRyYW5zZm9ybT0ic2NhbGUoLjIpIj4NCjx0c3BhbiB5PSItNDAiIHg9IjgiPk5PIEZJTEU8L3RzcGFuPg0KPHRzcGFuIHk9IjQwMCIgeD0iOCI+QVZBSUxBQkxFPC90c3Bhbj4NCjwvdGV4dD4NCjwvc3ZnPg==';
}

function getDataURLFromBase64String(base64String, mimeType) { // OK
    if (base64String && mimeType) {
        return 'data:' + mimeType + ';base64,' + base64String;
    }
    return null;
}

function getBase64StringFromDataURL(dataURL) { // OK
    if (typeof dataURL === "string") {
        var resultParts = dataURL.split(",");
        if (resultParts.length === 2) {
            return resultParts[1];
        }
    }
    return null;
}

var dirtyEntities = [];
function clearCache(entity) {
    if(entity){
    	entity.contentBase64 = null;
        return;
    }
    for (var i = 0; i < dirtyEntities.length; i++) {
    	dirtyEntities[i].contentBase64 = null;
    }
}

export class FileEntity extends Entity {
	init(){
		this.addFileData();
	}
    // static getUrl(...params){
    //   return getFileUrlForId(...params);
    // }
    static getNoFileUrl(...params){
      return getNoFileUrl(...params);
    }

    get prefix(){
        return '/file/';
    }

    getUrl(){
        return getFileUrlForId(this.urlPrefix, this.id, null);
    }

	addFileData(){
	    var base64 = (this.fileContent && this.fileContent.contentBase64) || this.contentBase64;
	    var fileData = {
	    	dataURL: ko.observable(base64 && 'data:' + this.mimeType + ';base64,' + base64),
	    	file: ko.observable(),
        };

        fileData.dataURL.subscribe((dataURL)=> {
        	this.contentBase64 = getBase64StringFromDataURL(dataURL);
            dirtyEntities.push(this);
        });

        fileData.file.subscribe((file)=> {
	        if (!file) {
	            return;
	        }
	        if (file.type) {
	        	this.mimeType = file.type;
	        }
	        if (file.name) {
	        	this.name = file.name;
	        }
	        else {
	        	this.name = '';
	        }
        });

        this.fileData = ko.observable(fileData);
        if (!this.url) {
            this.url = ko.computed(()=> {
//                        var url = getFileUrlForId(ko.unwrap(entity.id));
//                        fileData.dataURL(url);
//                        return url;
                if (fileData.dataURL()) { 
                    return fileData.dataURL();
                }
                if (this.mimeType && this.contentBase64) {
                    return getDataURLFromBase64String(this.contentBase64, this.mimeType);
                }
                if (this.entityAspect.entityState == breeze.EntityState.Added) {
                    // return getNoFileUrl();
                }
                if (!this.useBase64
                        && this.entityAspect.entityState != breeze.EntityState.Added
//                        && entity.entityAspect.entityState != breeze.EntityState.Detached
                        ) {
                    var url = this.getUrl();
                    fileData.dataURL(url);
                    return url;
                }
                // return getNoFileUrl();
            });
        }

    }

    toString(){
        return this.url();
    }
}