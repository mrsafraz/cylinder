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

var endValues = {
    opacity: 1,
    transform: 'scale(1)',
};
var clearValues = {
    opacity: '',
    display: '',
    transform: '',
//        scale: '',
};

export default function(context) {

    return system.defer(function(dfd) {
        function endTransition() {
            dfd.resolve();
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
//                        scale: 2.5,
//                        transform: 'scale(2.0)',
                transform: 'scale(' + (isOposite ? transformBig : transformSmall) + ')',
                display: 'block'
            };

            var $child = $(context.child);

            $(context.child).css(startValues);

            var hasSplitNav = $(context.child).find('.layout-leftnav-nav').length && $(context.child).find('.layout-leftnav-body').length;

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
            if (hasSplitNav) {
                workaroundStartValues.left = 0;
                workaroundStartValues.top = 0;
            }
//                workaroundStartValues = {};
//                workaroundEndValues = {};
            $(context.child).css(workaroundStartValues);

//                    $(context.child).find('.splitnav-left, .splitnav-right').css({'padding-top': '0 !important'});
//                    $(context.child).find('.splitnav-left, .splitnav-right').attr('style', 'padding-top: 0 !important;'
//                            + ($(context.child).find('.splitnav-left, .splitnav-right').attr('style') || ''));

            $('body').css({overflow: 'hidden'});
            $(context.child).transition(endValues, {
                duration: duration,
//                        easing: 'swing',
                complete: function() {
//                            $child.css(clearValues);
                    $(context.child).css(clearValues);
//                                $(context.child).css({position: 'absolute'});

                    window.setTimeout(function() {
//                                $(context.child).css({position: $(context.child).css('position')});
//                               $(context.child).css({position: ''});
                        $(context.child).css(workaroundEndValues);
                        $('body').css({overflow: ''});//                                $(context.child).find('.splitnav-left, .splitnav-right').css({paddingTop: ''});
                    }, 1);
                    endTransition();
                }
            });
        }

        if (!context.activeView) {
            startTransition();
            return;
        }
//                    $(context.activeView).fadeOut({ duration: fadeOutDuration, complete: startTransition });
      $(context.activeView).css({
        display: 'block',
        position: 'absolute',
        width: '100%',
        height: '100%',
        opacity: 1,
        transform: 'scale(1)',
        overflow: 'hidden',
      });
      $('body').css({overflow: 'hidden'});
      var activeEndValues = {
            transform: 'scale(' + (!isOposite ? transformBig : transformSmall) + ')',
            opacity: opacityLow,
//                        display: 'block',
        };
        $(context.activeView).transition(activeEndValues, {
            duration: duration,
            complete: function() {
//                            $(context.activeView).hide();
                $(context.activeView).css({
                  display: 'none',
                  transform: '',                              
                  position: '',
                  width: '',
                  height: '',
                  overflow: '',
                });
                $('body').css({overflow: ''});
//                                    startTransition();

            }
        });
        window.setTimeout(startTransition, 0);
    }).promise();
}