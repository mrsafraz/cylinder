import system from 'durandal/system';
import composition from 'durandal/composition';
import $ from 'jquery';

    function guessIsReverseTransition(context) {
        if(!context.activeView){
            return false;
        }
        var router = context.model.router;
        if(!router && context.bindingContext && context.bindingContext.$data && context.bindingContext.$data.router){
            router = context.bindingContext.$data.router;
        }
        if(!router){
            return false;
        }

        var activeViewId = $(context.activeView).data('view');
        var childId = $(context.child).data('view');
        var sameParent = false, childLevel = 0, activeViewLevel = 0;
        router.routes.forEach(function(route){
            if(activeViewId == route.moduleId){
                sameParent = true;
                activeViewLevel = route.depth || 0;
            }
            if(childId == route.moduleId){
                childLevel = route.depth || 0;
            }
        });
        return sameParent && (childLevel < activeViewLevel);
    }

    function removeAnimationClasses(ele, classList){
        for(var i = 0; i < classList.length; i++){
            ele.classList.remove(classList[i]);
        }
    }

    function addAnimationClasses(ele, classList){
        for(var i = 0; i < classList.length; i++){
            ele.classList.add(classList[i]);
        }
    }

    function getContextValue(context, property){
        if(typeof context[property] === 'function'){
            return context[property]();
        }
        return context[property];
    }

    var animate = function(context) {
        return system.defer(function(dfd) {

            // @TODO support reverse transition
            // var isReverse = guessIsReverseTransition(context);

            var animationIn = getContextValue(context, 'animateIn') || 'fadeInRightSmall',
             animationOut = getContextValue(context, 'animateOut') || 'fadeOut';

             var cssPrefix = context.prefix || 'animated';

             animationIn = animationIn.split(' ');
             animationOut = animationOut.split(' ');
             animationIn.push(cssPrefix);
             animationOut.push(cssPrefix);

            function endTransition() {
                dfd.resolve();
            }

            function scrollIfNeeded() {
                if (!context.keepScrollPosition) {
                    $(document).scrollTop(0);
                }
            }

            if (!context.child) {
                $(context.activeView).fadeOut(100, endTransition);
            } else {
                var $child = $(context.child);
                var startValues = {
                    display: 'block',
                    // opacity: 0,
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                };
                var clearValues = {
                    left: '',
                    top: '',
                    right: '',
                    bottom:'',
                    position:'',
                    opacity: ''
                };

                var startTransition = function() {
                    scrollIfNeeded();
                    context.triggerAttach();
                    removeAnimationClasses(context.child, animationIn.concat(animationOut));
                    addAnimationClasses(context.child, animationIn);
                    // $child.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
                    // });
                    setTimeout(function () {
                        removeAnimationClasses(context.child, animationIn.concat(animationOut));
                        if(context.activeView){
                            removeAnimationClasses(context.activeView, animationIn.concat(animationOut));
                        }
                        $child.css(clearValues);
                        endTransition();
                    }, 1000);
                };

                $child.css(startValues);

                if(context.activeView) {
                    removeAnimationClasses(context.activeView, animationIn.concat(animationOut));
                    addAnimationClasses(context.activeView, animationOut);
                }
                window.setTimeout(function(){
                    startTransition();
                }, 1);
            }
        }).promise();
    };

export {animate as Animate};
