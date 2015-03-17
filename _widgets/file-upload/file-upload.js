import {Widget} from 'framework';
import $ from 'jquery';
import ko from 'knockout';
//import fileBindings from 'lib/kobindings/fileBindings';
import koFileBindings from 'knockout-file-bindings';
import {ColorFactory} from './ColorFactory';


// define(['kingdom', 'jquery', 'knockout', 'lib/kobindings/fileBindings'], function(kingdom, $, ko, fileBindings) {

class FileUploadWidget extends Widget {
    constructor(){
        this.settings = {
            editable: true,
            fileData: null,
            data: [],
            buttonClass: 'btn -btn-success',
            fileNameClass: 'disabled form-control',
            // accept: 'image/*',
            onClear: function(fileData, options){
                if(typeof fileData.clear === 'function'){
                    fileData.clear();
                }
            },
            file: null,
        };
        this.ok = false;
    }

    get customFileInputSettings(){
        return {
            // wrapperClass: 'input-group',
            // fileNameClass: 'disabled form-control',
            noFileText: 'No file chosen',
            // buttonGroupClass: 'input-group-btn',
            // buttonClass: 'btn btn-primary',
            clearButtonClass: 'btn btn-default',
            buttonText: 'Choose File',
            changeButtonText: 'Change',
            clearButtonText: 'Clear',
            fileName: true,
            clearButton: true,
            //
            wrapperClass: 'file-input-wrapper',
            buttonClass: 'btn btn-success',
            fileNameClass: 'hidden',
            buttonGroupClass: 'file-input-button-group',
            onClear: this.settings.onClear,
        };
    }

    prepareSettings(settings){
        if(settings.accept){
            this.settings.accept = settings.accept;
        }
        if(settings.fileData){
            this.settings.fileData = settings.fileData;
        }
        this.settings.editable = settings.editable !== false;
        if(settings.file){
            this.settings.file = settings.file;
            this.ok = true;
        }
        else {
            this.ok = false;
        }
        return;
    }

    resetFile(){
        var fileData = this.getFileData();
        if(fileData && typeof fileData.clear === 'function'){
            fileData.clear();
        }
    }

    activate(settings){
        this.prepareSettings(settings);
        var file = ko.unwrap(this.settings.file);
        if (!this.settings.fileData && file) {
            console.log("FILE DATA: ", this.settings.fileData);
            if(file.fileData){
                this.settings.fileData = file.fileData;
            }
            console.log("FILE DATA ADTER: ", this.settings.fileData);
        }
    }

    getExt(file){
        var parts = file.name.split('.');
        if(parts.length > 1){
            return parts[parts.length-1];
        }
        return '';
    }

    getColor(txt){
        var colorFactory = new ColorFactory();
        return colorFactory.getColor(txt.toUpperCase());
    }

    getSize(bytes) {
       if(bytes == 0) return '0 Byte';
       var k = 1000;
       var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
       var i = Math.floor(Math.log(bytes) / Math.log(k));
       return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }

    handleError(){
    }

    getFile(){
        var fileInfo = {isEmpty: true};
        var staticFile = true;
        if(this.getFileData().dataURL()){
            var file = this.getFileData().file();
            if(file){
                staticFile = false;
                fileInfo.name = file.name;
                fileInfo.ext = this.getExt(file);
                fileInfo.color = this.getColor(fileInfo.ext);
                fileInfo.url = this.getFileData().dataURL();
                fileInfo.isImage = file.type.indexOf('image/') === 0; 
                fileInfo.size = this.getSize(file.size);
                fileInfo.isEmpty = false;
            }
        }
        if(staticFile){// && !this.settings.editable) {
            var file = ko.unwrap(this.settings.file);
            if(file){
                fileInfo.name = file.name;
                fileInfo.ext = file.extension || '';
                fileInfo.color = this.getColor(fileInfo.ext);
                // fileInfo.url = file.url();
                fileInfo.url = file;
                fileInfo.isImage = (file.mimeType || '').indexOf('image/') === 0;
                // fileInfo.size = this.getSize(file.size);
                fileInfo.isEmpty = false;
            }
        }
        return fileInfo;
    }

    // isNoFile(){
    //     return !this.getFileData().dataURL();
    // }

    // isImageFile(){
    //     if(this.isNoFile()){
    //         return false;
    //     }
    // }

    // getImageSrc(){
    //     if(!this.isImageFile()){
    //         return '';
    //     }
    //     return this.getFileData().dataURL();
    // }

    // getFileName(){
    //     if(this.isNoFile()){
    //         return false;
    //     }
    //     var fileData = this.getFileData();
    //     console.log(fileData);
    //     console.log(fileData.dataURL());
    //     console.log(fileData.file && fileData.file());
    // }

    // getFileExt(){

    // }

    getFileData(){
        if(!this.settings.fileData){
            return {
                dataURL: function(){},
                file: function(){},
            };
        }
        var fileData = this.settings.fileData;
        fileData = typeof fileData === 'function' ? fileData() : fileData;
        return fileData;
    }


}


export default FileUploadWidget;
// });