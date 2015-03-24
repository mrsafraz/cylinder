var gulp = require('gulp');
var fs = require('fs');

gulp.task('generate-module', function(){
  writeFiles('app', 'import {Module} from \'framework\';\n\nclass '
            + '{ModuleName}Module extends Module  {\n'
            + '\n  constructor(){\n    \n  }\n'
            + '\n  activate(settings){\n    \n  }\n'
            + '\n}\n\n'
            + 'export default {ModuleName}Module;',
             '<section>\n  <div>\n    Change This\n  </div>\n</section>', '');
});

gulp.task('generate-widget', function(){
  writeFiles('app', 'import {Widget} from \'framework\';\n\nclass '
            + '{ModuleName}Widget extends Widget  {\n'
            + '\n  constructor(){\n    \n  }\n'
            + '\n  activate(settings){\n    \n  }\n'
            + '\n}\n\n'
            + 'export default {ModuleName}Widget;',
             '<section>\n  <div>\n    Change This\n  </div>\n</section>', '');
});

gulp.task('generate-dialog', function(){
  
var htmlContent = [
'<section class="modal-content">',
'  <div class="modal-header">',
'    <h3 class="modal-title">${\'Change This\'|trans}</h3>',
'  </div>',
'',
'  <div class="modal-body">Hello</div>',
'',
'  <div class="modal-footer">',
'    <button on-click="ok()" class="btn btn-primary">${\'OK\'|trans}</button>',
'    <button on-click="cancel()" class="btn btn-default">${\'Cancel\'|trans}</button>',
'  </div>',
'</section>'
].join('\n');

  writeFiles('app', 'import {Dialog} from \'framework\';\n\nclass '
            + '{ModuleName}Dialog extends Dialog  {\n' 
             + '\n  ok(){\n  }\n\n  cancel(){\n    return this.close();\n  }\n'
             + '\n}\n\n'
            + 'export default {ModuleName}Dialog;',
             htmlContent, '');
});

function writeFiles(basePath, jsContent, htmlContent, lessContent){
  jsContent = jsContent || ''; htmlContent = htmlContent || ''; lessContent = lessContent || '';
  var path;
  process.argv.forEach(function(val, index, array) {
    if(val.indexOf('--path=') === 0){
      path = val.replace('--path=', '');
    }
  });
  if(!path){
    console.log('ERROR: The --path parameter is required.');
    return;
  }
  
  var split = path.split('/');
  
  var lastPath = '', path;
  // console.log(split);
  split.forEach(function(val, index, array){
    lastPath += '/' + val;
    path = basePath + lastPath;
   (function(path){return function(){
        fs.exists(path, function (exists) {
          if(!exists) {
            fs.mkdir(path, function(err){
              if(err){
                console.log('DIRECTORY NOT CREATED: ' + err.message);
              }
            });
          }
        });
     }})(path)();
  });

  var moduleId = split.pop();
  
  var moduleIdFull = moduleId + '/' + moduleId;
  
  var moduleName = CamelCase(moduleId);
  
  var modulePath = split.join('/');
  
  writeFile(basePath + '/' + modulePath + '/' + moduleIdFull + '.html', htmlContent);
  writeFile(basePath + '/' + modulePath + '/' + moduleIdFull + '.js', 
            jsContent.replace(/\{ModuleName\}/g, moduleName));
  // writeFile(basePath + '/' + modulePath + '/' + moduleIdFull + '.less', lessContent);
  
};


function writeFile(fileName, content){
    fs.exists(fileName, function (exists) {
        if(!exists){
          fs.writeFile(fileName, content, function(err) {
            if(err) {
                console.log('FILE NOT CREATED: ' + err.message);
            } else {
                console.log('FILE SAVED: "' + fileName + '"');
            }
          });
        }
        else {
          console.log('FILE EXISTS: "' + fileName + '"');
        }
    });
}

function camelCase(input) {
    return input.toLowerCase().replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
}

function CamelCase(input) {
  var output = camelCase(input);
  output = output.charAt(0).toUpperCase() + output.slice(1);
  return output;
}