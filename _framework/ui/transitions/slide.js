/**
 * The entrance transition module.
 * @module entrance
 * @requires system
 * @requires composition
 * @requires jquery
 */
import system from 'durandal/system';
import $ from 'jquery';
import transit from 'jquery.transit';

var fadeOutDuration = 100;
var transitionDuration = 300;

var transformBig = 2.0;
var transformSmall = 0.5;

var transformBig = 1.1;
var transformSmall = 0.9;

var opacityLow = 0;

export default function(context) {

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

        var duration = context.duration || transitionDuration;
        var fadeOnly = !!context.fadeOnly;

        var isOposite = context.isOposite;

        var startTransition = function() {
            scrollIfNeeded();
            context.triggerAttach();

            var startValues = {
                opacity: opacityLow,
                // transform: 'scale(' + (isOposite ? transformBig : transformSmall) + ')',
                x: 50,
                display: 'block'
            };

            var endValues = {
                opacity: 1,
                // transform: 'scale(1)',
                x: 0,
            };

            var clearValues = {
                opacity: '',
                display: '',
                transform: '',
            };

            var workaroundStartValues = {
                position: 'absolute',
                width: '100%',
                height: '100%',
                overflow: 'hidden',
            };
            var workaroundEndValues = {
                position: '',
                width: '',
                height: '',
                left: '',
                top: '',
                overflow: '',
            };

            $(context.child).css(workaroundStartValues);
            $(context.child).css(startValues);

            $('body').css({overflow: 'hidden'});
            $(context.child).transition(endValues, {
                duration: duration,
                complete: function() {
                    $(context.child).css(clearValues);
                    window.setTimeout(function() {
                        $(context.child).css(workaroundEndValues);
                        $('body').css({overflow: ''});
                    }, 1);
                    endTransition();
                }
            });
        }

        if (!context.activeView) {
            startTransition();
            return;
        }

      $(context.activeView).css({
        display: 'block',
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 1,
        // transform: 'scale(1)',
        x: 0,
        overflow: 'hidden',
      });
      $('body').css({overflow: 'hidden'});
        $(context.activeView).transition({
            // transform: 'scale(' + (!isOposite ? transformBig : transformSmall) + ')',
            x: -20,
            opacity: opacityLow,
        }, {
            duration: duration,
            complete: function() {
                $(context.activeView).css({
                  display: 'none',
                  transform: '',
                  position: '',
                  width: '',
                  height: '',
                  overflow: '',
                });
                $('body').css({overflow: ''});

            }
        });
        window.setTimeout(startTransition, 0);
    });
}