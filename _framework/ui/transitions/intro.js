import animate from './animate';
// import entrance from './entrance';
import entrance from './slide';
import zoom from './zoom-anim';

// export default entrance;

export default function intro(context) {
  return new Promise((resolve, reject)=> {
    var homeModuleId = 'home/home';
    var shellModuleId = 'shell/shell';
    var homeOnly = context.homeOnly !== false;
    var toHome = context.model && context.model.__moduleId__ && (context.model.__moduleId__.indexOf(homeModuleId) !== -1 || context.model.__moduleId__.indexOf(shellModuleId) !== -1);
    var fromHome = $(context.activeView) && $(context.activeView).data('view') == homeModuleId;

    // if (homeOnly && !(toHome || fromHome)) {
    //     entrance(context).then(()=> {
    //         resolve();
    //     });
    //     return;
    // }
    context.isOposite = toHome;
    zoom(context).then(()=> {
        resolve();
    });
    return;

    if(toHome){
        context.animateIn = 'zoomExitInSmall';
        context.animateOut = 'zoomExitOutSmall';
    }
    else {
        context.animateIn = 'zoomEnterInSmall';
        context.animateOut = 'zoomEnterOutSmall';
    }
    animate(context).then(()=> {
        resolve();
    });
  });
}