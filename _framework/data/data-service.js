import breeze from 'breeze';
import {Deferred} from '../core/promise-adapter';
import sugar from 'breeze.sugar';
import {Storage} from './storage';

var _queriesFetched = new Map();

var {EntityManager, EntityQuery, EntityState, Predicate, FetchStrategy} = breeze;

export class DataService {

  constructor(entityManager: EntityManager, storage: Storage){
    this.entityManager = entityManager;
    this.storage = storage;
  }

  find(...params){
    return this.findAll(...params);
  }

  findAll(from, criteria = {}, options = {}){
    var queryId = JSON.stringify({from, criteria, options});
//    var queryId = JSON.stringify({from, criteria: Object.keys(criteria), options: Object.keys(options)});
    var query = sugar.createQuery(from, criteria, options);
    if(options.count){
      query = query.inlineCount(true);
    }
    var localFirst = options.localFirst;
    if(options.expand && !_queriesFetched.get(queryId)){
      localFirst = false;
    }
    _queriesFetched.set(queryId, true);
    
    // console.log('QUERYID', queryId, localFirst);
    
    var deferred = new Deferred();
    
    var findFromServer = true;
    if(localFirst !== false){
      var results = this.getAll(from, criteria, options);
      if(results.length){
        deferred.resolve(results);
        findFromServer = false;
      }
    }
    if(findFromServer) {
      this.findResultsByQuery(query, false, false, true).then((results)=> {
        if(localFirst === false){
          deferred.resolve(results);
        }
        else {
          deferred.resolve(this.getAll(from, criteria, options, results.count));
        }
      }, (error)=> {
        deferred.reject(error);
      });
    }
//    return this.findResultsByQuery(query, localFirst !== false, false, true);
    return deferred.promise;
  }

  findOne(from, criteria, options = {}){
    options.limit = 1;
    var queryId = JSON.stringify({from, criteria, options});
    var queryIdOne = 'ONE:' + queryId;
    var query = sugar.createQuery(from, criteria, options);
    if(options.expand && (!_queriesFetched.get(queryId) || _queriesFetched.get(queryIdOne))){
      options.localFirst = false;
    }
    _queriesFetched.set(queryIdOne, query);
    return this.findResultsByQuery(query, options.localFirst !== false, true, true);
  }

  getAll(from, criteria, options = {}, inlineCount = null){
    var queryId = JSON.stringify({from, criteria, options});
    var query = sugar.createQuery(from, criteria, options);
    var results = this.getResults(query, false);
    if(options.count){
      var countOptions = {
        sort: options.sort,
      }
      var countQuery = sugar.createQuery(from, criteria, countOptions);
      var allResults = this.getResults(countQuery, false);
      results.count = allResults.length;
      if(inlineCount > results.count){
        results.count = inlineCount;
      }
    }
    return results;
  }

  getOne(from, criteria, options = {}){
    options.limit = 1;
    var query = sugar.createQuery(from, criteria, options);
    return this.getResults(query, true);
  }

  createEntity(entityTypeName, data){
    return this.entityManager.createEntity(entityTypeName, data);    
  }

  create(...params){
    return this.createEntity(...params);
  }

  getResults(query: EntityQuery, singleResult: boolean = false){
    try {
      var results = this.entityManager.executeQueryLocally(query);
      return singleResult ? results[0] : results;
    }
    catch(e){
      console.log(e);
      console.log(e.stack);
      // fail silently
      return singleResult ? null : [];
    }
  }

  findResultsByQueryNEW(query: EntityQuery, localFirst: boolean = true, singleResult: boolean = false): Promise {
    var deferred = new Deferred();
    var executeServer = function(){
      this.entityManager.executeQuery(query).then(function(data){
          deferred.resolve(singleResult ? data.results[0] : data.results);
      }, function(error){
          deferred.reject(error);
      });
    }
    if(localFirst){
      query.using(FetchStrategy.FromLocalCache)
      .using(this.entityManager.original).execute()
        .then((data) => {
          if(data.results.length){
            deferred.resolve(singleResult ? data.results[0] : data.results);
          }
          else {
            executeServer.apply(this);
          }
        }, (error) => {
          deferred.reject(error);
      });
    }
    else {
      executeServer.apply(this);
    }
    return deferred.promise;
  }

  findResultsByQuery(query: EntityQuery, localFirst: boolean = true, singleResult: boolean = false, resultsOnly = true): Promise {
    var deferred = new Deferred();
    var results = [];
    if(localFirst){
        results = this.getResults(query, singleResult) || [];
        if(results.length){
            deferred.resolve(resultsOnly ? results : {results});
        }
    }
    if(!localFirst || !results.length){
        this.entityManager.executeQuery(query).then(function(data){
          if(data.inlineCount){
            data.results.count = data.inlineCount;
          }
          deferred.resolve(singleResult ? data.results[0] : (resultsOnly ? data.results : data));
        }, function(error){
            deferred.reject(error);
        });
    }
    return deferred.promise;
  }

  getEntityByCode(entityTypeName, code){
    var query = new EntityQuery().from(entityTypeName).where('code', '==', code);
    var results = this.entityManager.executeQueryLocally(query);
    var entity;
    if(results.length){
        entity = results[0];
    }
    else {
        var name = code;
        entity = this.entityManager.createEntity(entityTypeName, {code, name});
    }
    return entity;
  }

  removeEntity(entity){
    if(entity.entityAspect){
      entity.entityAspect.setDeleted();
    }
  }

  remove(...params){
    return this.removeEntity(...params); 
  }

  saveChanges(entities){
    if(entities){
      var deletedEntities = this.entityManager.getEntities(null, EntityState.Deleted);
      entities = entities.concat(deletedEntities);
      return this.entityManager.saveChanges(entities);
    }
    else {
      return this.entityManager.saveChanges();
    }
  }

  saveEntities(entities){
    return this.saveChanges(entities);
  }
  
}
