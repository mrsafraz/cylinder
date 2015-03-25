// import animate from './animate';
// export default animate;

/**
* Durandal 2.1.0 Copyright (c) 2012 Blue Spire Consulting, Inc. All Rights Reserved.
* Available via the MIT license.
* see: http://durandaljs.com or https://github.com/BlueSpire/Durandal for details.
*/
/**
* The entrance transition module.
* @module entrance
* @requires system
* @requires composition
* @requires jquery
*/

import system from 'durandal/system';
import composition from 'durandal/composition';
import $ from 'jquery';


var fadeOutDuration = 100;

function removeAnimationClasses(ele, fadeOnly){
    ele.classList.remove(fadeOnly ? 'entrance-in-fade' : 'entrance-in');
    ele.classList.remove('entrance-out');
}

/**
 * @class EntranceModule
 * @constructor
 */
export default function entrance(context) {
    return new Promise((resolve, reject)=> {
        function endTransition() {
            resolve();
        }
        if (!context.child) {
            $(context.activeView).fadeOut(fadeOutDuration, endTransition);
            return;
        }

        function scrollIfNeeded() {
            if (!context.keepScrollPosition) {
                $(document).scrollTop(0);
            }
        }

        var duration = context.duration || 500;
        var $child = $(context.child);
        var fadeOnly = !!context.fadeOnly;
        var startValues = {
            display: 'block',
            opacity: 0,
            position: 'absolute',
            left: '0px',
            right: 0,
            top: 0,
            bottom: 0,
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

            removeAnimationClasses(context.child, fadeOnly);
            context.child.classList.add(fadeOnly ? 'entrance-in-fade' : 'entrance-in');
            setTimeout(function () {
                removeAnimationClasses(context.child, fadeOnly);
                if(context.activeView){
                    removeAnimationClasses(context.activeView, fadeOnly);
                }
                $child.css(clearValues);
                endTransition();
            }, duration);
        }

        $child.css(startValues);

        if(context.activeView) {
            removeAnimationClasses(context.activeView, fadeOnly);
            context.activeView.classList.add('entrance-out');
            setTimeout(startTransition, fadeOutDuration);
        } else {
            startTransition();
        }
    });
}