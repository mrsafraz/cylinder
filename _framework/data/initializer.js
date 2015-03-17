import breeze from 'breeze';
import {Entity} from './entity';
import {Validator} from './validator';
import {Preloader} from './preloader';
// import {Q} from '../core/promise-adapter';
import {Config} from '../core/config';

var {EntityManager} = breeze;

var _initializedEntityTypesMap = {};

export class Initializer {

  constructor(entityManager: EntityManager, preloader: Preloader, validator: Validator, config: Config){
    this.entityManager = entityManager;
    this.validator = validator;
    this.preloader = preloader;
    this._preloadEntities = config.preload || [];
    this._entityInitializers = config.entities || {};
  }

  initializeEntity(entityTypeName, ctor, initializer){
    if (_initializedEntityTypesMap[entityTypeName]) {
      return false;
    }
    _initializedEntityTypesMap[entityTypeName] = true;
    return this.entityManager.metadataStore
      .registerEntityTypeCtor(entityTypeName, ctor, initializer);
  }

  ensureInitializers(initializers = {}){
    return new Promise((resolve, reject) => {
      var entityTypes = this.entityManager.metadataStore.getEntityTypes();
      for (var key in entityTypes) {
        var shortName = entityTypes[key].shortName;
        if (_initializedEntityTypesMap[shortName]) {
            continue;
        }
        if(!entityTypes.hasOwnProperty(key)){
          continue;
        }
          // eval('var initializer = function ' + shortName + '(){}');
        var ctor = initializers[shortName];
        if(!ctor){
          ctor = new Function("return function " + shortName + "(){}")();
          ctor.prototype = new Entity();
        }

        var that = this;
        var initializer = function(entity){
          that.validator.addValidationForEntity(entity);
          if(entity.init){
            entity.init.apply(entity, [that.entityManager]);
          }
          entity.entityManager = that.entityManager;
          // entity.__validationErrors = ko.observableArray();
          // entity.entityAspect.validationErrorsChanged.subscribe(function(){
          //   entity.__validationErrors(entity.entityAspect.getValidationErrors());
          // });
        }

        this.initializeEntity(shortName, ctor, initializer);
      }
      window.setTimeout(()=> resolve(), 1);
    });
  }

  preload(entities){
    this._preloadEntities = entities;
  }

  ctors(initializers){
    this._entityInitializers = initializers;
  }

  initialize(progressFn = null, async = false){
    // breeze.config.setQ(Q);
    if(typeof progressFn != 'function'){
      progressFn = false;
    }
    if(progressFn){
      var total = this._preloadEntities.length + 1;
      var onProgress = function(progress){
        var loaded = progress.fetchedEntityTypes.length + 1;
        var percentage = loaded / total;
        percentage = Math.round(percentage * 100);
        progressFn(percentage);
      }
      this.preloader.onProgress(onProgress);
    }
    return new Promise((resolve, reject)=> {
      if(!async){
        this.preloader.blockUi();
      }
      this.preloader.ensureMetadata().then((metadata) => {
        this.ensureInitializers(this._entityInitializers);
        if(progressFn){
          onProgress({fetchedEntityTypes: []});
        }
        this.preloader.preloadEntities(this._preloadEntities).then(() => {
          resolve();
          if(!async){
            this.preloader.unBlockUi();
          }
        });
      });
    });
  }

}