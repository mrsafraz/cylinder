import router from 'plugins/router';
import breeze from 'breeze';

import {Config} from '../core/config';
import {Storage} from './storage';
import {DataService} from './data-service';

var _metadataFetched = false;
var _routesGuarded = false;
var _previousRouteGuard = null;

var {EntityManager, EntityQuery} = breeze;

export class Preloader {

  constructor(entityManager: EntityManager, config: Config, storage: Storage, dataService: DataService){
    this.entityManager = entityManager;
    this.config = config;
    this.storage = storage;
    this.dataService = dataService;
  }

  importMetadata(data) {
    var metadata = data; //typeof (data) === "string" ? JSON.parse(data) : data;
    if (metadata) {
      try {
        this.entityManager.metadataStore.importMetadata(metadata);
        _metadataFetched = true;
        return metadata;
      } catch (e) {
        throw new Error('Metadata Import Failed: ' + e);
      }
    } else {
      throw new Error('Metadata is invalid');
    }
  }

  ensureMetadata(){
    return new Promise((resolve, reject)=> {
      if (_metadataFetched) {
        window.setTimeout(() => resolve(), 1);
        return;
      }
      if(this.config.cachePreloadedData){
        var preloadedMetadata = this.storage.get('PRELOAD_METADATA');
        if(preloadedMetadata){
          this.importMetadata(preloadedMetadata);
          window.setTimeout(()=> resolve(), 1);
          return;
        }
      }
      else {
        this.storage.set('PRELOAD_METADATA', null);
      }
      this.entityManager.fetchMetadata().then((metadata)=> {
        try {
          metadata = this.importMetadata(metadata);
          if(this.config.cachePreloadedData){
            this.storage.set('PRELOAD_METADATA', this.entityManager.metadataStore.exportMetadata());
          }
          resolve(metadata);
        }
        catch(e){
          reject(e);
        }
      }, reject).catch(reject);
    });
  }

  onProgress(listener){
    this.progressListener = listener;
  }

  emitProgress(progress){
    if(this.progressListener){
      this.progressListener(progress);
    }
  }

  preload(entities = [], shouldBlockUi = false) {
    return new Promise((resolve, reject) => {
      this.ensureMetadata().then((metadata) => {
        this.emitProgress({
          metadata
        })
        this.preloadEntities(entities).then(() => {
          resolve();
          if(shouldBlockUi){
            this.unBlockUi();
          }
        });
      });
      if(shouldBlockUi){
        this.blockUi();
      }
    });
  }

  preloadEntities(entities = []){
    if(this.config.cachePreloadedData){
      var preloadedEntities = this.storage.get('PRELOAD_ENTITIES');
      if(preloadedEntities){
        return new Promise((resolve, reject)=> {
          this.entityManager.importEntities(preloadedEntities);
          resolve();
        });
      }
    }
    else {
      this.storage.set('PRELOAD_ENTITIES', null);
    }
    return new Promise((resolve, reject)=> {
      var entityTypes = [];
      for(var i = 0; i < entities.length; i++){
        var entityType = {
          resourceName: entities[i].entityType || entities[i],
          criteria: entities[i].criteria || {},
          options: entities[i].options || {},
        };
        entityTypes.push(entityType);
      }
      if(!entityTypes.length){
        resolve();
        return;
      }
      var fetched = {};
      function tryToResolve(){
        var allFetched = true;
        var fetchedEntityTypes = [];
        for(var entityType of entityTypes){
          var resourceName = entityType.resourceName;
          allFetched = allFetched && fetched[resourceName];
          if(fetched[resourceName]){
            fetchedEntityTypes.push(entityType);
          }
        }
        this.emitProgress({
          fetchedEntityTypes,
          entityTypes
        });
        if(allFetched){
          var preloadEntities = this.entityManager.exportEntities(undefined, false);
          this.storage.set('PRELOAD_ENTITIES', preloadEntities);
          resolve();
        }
      }
      for(var entityType of entityTypes){
        // block scope needed!
        let resourceName = entityType.resourceName;
        // let query = new EntityQuery().from(resourceName);
        // this.entityManager.executeQuery(query).then((data) => {
        let criteria = entityType.criteria;
        let options = entityType.options;
        this.dataService.findAll(resourceName, criteria, options).then((results)=> {
          fetched[resourceName] = true;
          tryToResolve.apply(this);
        }, (error)=> {
          reject(error);
          return;
        });
      }
    });
  }

  blockUi(){

    if(_routesGuarded){
      return;
    }
    _previousRouteGuard = router.guardRoute;
    router.guardRoute = function(instance, instruction){
      if(instruction.fragment == 'loading'){
        return true;
      }
      return false;
    };
    _routesGuarded = true;
  }

  unBlockUi(){
    router.guardRoute = _previousRouteGuard; //|| function(){};
  }

}