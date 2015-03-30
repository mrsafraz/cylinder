import app from 'durandal/app';
import dialog from 'plugins/dialog';
import viewEngine from 'durandal/viewEngine';
import $ from 'jquery';

function enableAutoclose(theDialog, targetOnly){
    if(targetOnly === undefined){
        targetOnly = true;
    }
    if (theDialog.owner){
        theDialog.$overlay.on('click', function (e) {
            if(!theDialog.owner.autoclose){
                return;
            }
            if(!targetOnly || e.target == this){ // only if the target itself has been clicked
                theDialog.close();
            }
        });
    }
}

function onAnimationEnd ($elem, callback) {
    $elem.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', callback);
}

function onTransitionEnd ($elem, callback) {
    $elem.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', callback);
}

// function getAnimationClasses(data){
//     return [data.animationIn, data.animationOut, data.animationSpeed, data.animationEasing];
// }

function ensureDialogAnimations(theDialog, defaults){
    var params = ['animationIn', 'animationOut'];
    params.forEach(function(param){
        theDialog[param] = theDialog.owner[param] || defaults[param] || '';
    });
}


dialog.addContext('offcanvas', {
    addHost: function(theDialog){
        var model = theDialog.owner;
        var position = model.position || 'left';
        var $host = $('<div style="z-index: 2;"></div>').addClass(['off-canvas', position].join(' '));
        $('.grid-frame').first().before($host);
        var $overlay = $('<div class="modal-overlay is-active ng-enter fast fadeIn" style="z-index: 1;"></div>').appendTo(document.body);
        if(!model.overlay){
            $overlay.css('background', 'transparent');
        }
        theDialog.host = $host.get(0);
        theDialog.$host = $host;
        theDialog.$overlay = $overlay;
    },
    removeHost: function(theDialog){
        theDialog.$host.removeClass('is-active');
        theDialog.$overlay.removeClass('fadeIn ng-enter ng-enter-active')
            .addClass('fadeOut ng-leave ng-leave-active');
        onAnimationEnd(theDialog.$host, function(){
            theDialog.$host.remove();
            theDialog.$overlay.remove();
        });
    },
    compositionComplete: function(child, parent, context){
        var theDialog = dialog.getDialog(context.model);
        window.setTimeout(function(){
            theDialog.$host.addClass('is-active');
            theDialog.$overlay.addClass('ng-enter-active');
        }, 10);
        enableAutoclose(theDialog);
    }
});


dialog.addContext('popup', {
    addHost: function(theDialog){
        var model = theDialog.owner;
        if(model.content){
            model.getView = function(){
                return viewEngine.processMarkup('<div>' + model.content + '</div>');

            };
        }
        theDialog.$target = $(model.target);
        theDialog.$host = $('<div class="padding popup is-active" style="z-index: 2000;'
         + ' position: fixed;'
         + '"></div>')
        .appendTo(document.body);

        theDialog.host = theDialog.$host.get(0);
        theDialog.$overlay = $('<div class="modal-overlay popup-overlay is-active fadeIn ng-enter fast"></div></div>')
        .appendTo(document.body);
        if(!model.overlay){
            theDialog.$overlay.css('background-color', 'transparent');
        }
    },
    removeHost: function(theDialog) {
        theDialog.$overlay.removeClass('fadeIn ng-enter ng-enter-active')
            .addClass('fadeOut ng-leave ng-leave-active');
        theDialog.$host.removeClass('tether-enabled');
        onAnimationEnd(theDialog.$host, function(){
            theDialog.$host.remove();
            theDialog.$overlay.remove();
        });
    },
    compositionComplete: function(child, parent, context){
        var theDialog = dialog.getDialog(context.model);

        if(theDialog.$target.length){
            var offset = theDialog.$target.offset();
            theDialog.$host.css({
                left: offset.left - $(document).scrollLeft(),
                top: offset.top - $(document).scrollTop() + theDialog.$target.height()
            });
        }
        else {
            theDialog.$host.css({
                left: ($(window).width() - theDialog.$host.width())/2,
                top: ($(window).height() - theDialog.$host.height())/2,
            })
        }
        window.setTimeout(function(){
            theDialog.$host.addClass('tether-enabled');
            theDialog.$overlay.addClass('ng-enter-active'); 
        }, 10);
        enableAutoclose(theDialog);
    }
});


dialog.addContext('actionsheetx', {
    addHost: function(theDialog){
        var model = theDialog.owner;
        if(model.actions){
            model.selectAction = function(action){
                dialog.close(model, action);
            };
            model.getView = function(){
                return viewEngine.processMarkup('<p data-bind="text: title"></p>'
                         + '<ul data-bind="foreach: actions">'
                        +'<li><a href="#" data-bind="text: $data, '
                        + 'click: $parent.selectAction"></a></li></ul>');

            };
        }
        theDialog.$target = $(model.target);
        model.position = model.position || 'bottom';
        theDialog.$host = $('<div class="action-sheet ' + model.position + '" style="z-index: 2000"></div>')
        .appendTo(document.body);
        theDialog.host = theDialog.$host.get(0);
        theDialog.$overlay = $('<div class="modal-overlay action-sheet-overlay is-active fadeIn ng-enter fast"></div></div>')
        .appendTo(document.body);
        if(!model.overlay){
            theDialog.$overlay.css('background-color', 'transparent');
        }
    },
    removeHost: function(theDialog) {
        theDialog.$overlay.removeClass('fadeIn ng-enter ng-enter-active')
            .addClass('fadeOut ng-leave ng-leave-active');
        theDialog.$host.removeClass('is-active');
        onAnimationEnd(theDialog.$host, function(){
            theDialog.$host.remove();
            theDialog.$overlay.remove();
        });
    },
    compositionComplete: function(child, parent, context){
        var theDialog = dialog.getDialog(context.model);
        var model = theDialog.owner;
        if(theDialog.$target.length){
            var offset = theDialog.$target.offset();
            var top = offset.top - $(document).scrollTop(),
            left = offset.left - $(document).scrollLeft();
            var arrowSize = 10, arrowWidth = arrowSize*2;
            var position = model.position;
            if(position == 'bottom' || position == 'top'){
                left -= (theDialog.$host.outerWidth() - theDialog.$target.outerWidth())/2;
                if(position == 'bottom'){
                    top += theDialog.$target.outerHeight() + arrowSize;
                }
                else if(position == 'top'){
                    top -= theDialog.$host.outerHeight() + arrowSize;
                }
            }
            else if(position == 'right' || position == 'left'){
                top -= (theDialog.$host.outerHeight() - theDialog.$target.outerHeight())/2;
                if(position == 'right'){
                    left += theDialog.$target.outerWidth() + arrowSize;
                }
                else if(position == 'left'){
                    left -= theDialog.$host.outerWidth() + arrowSize;
                }
            }
            theDialog.$host.css({
                left: left,
                top: top
            });
        }
        else {
            theDialog.$host.css({
                left: ($(window).width() - theDialog.$host.width())/2,
                top: ($(window).height() - theDialog.$host.height())/2,
            });
        }
        window.setTimeout(function(){
            theDialog.$host.addClass('is-active');
            theDialog.$overlay.addClass('ng-enter-active'); 
        }, 10);
        enableAutoclose(theDialog);
    }
});

function animateIn(theDialog){
    theDialog.$dialog.removeClass('animated ' + theDialog.animationOut)
    .addClass('animated ' + theDialog.animationIn);
    theDialog.$overlay.removeClass('animated fadeOut')
        .addClass('animated fadeIn');
}

function animateOut(theDialog, callback){
    theDialog.$dialog.removeClass('animated ' + theDialog.animationIn)
        .addClass('animated ' + theDialog.animationOut);
    theDialog.$overlay.removeClass('animated fadeIn')
        .addClass('animated fadeOut');
    onAnimationEnd(theDialog.$overlay, function(){
        theDialog.$container.remove();
    });
}

function processTheDialog(theDialog){
    var model = theDialog.owner;
    var size = model.size || '';
    var sizes = {sm: 'sm', lg: 'lg', small: 'sm', large: 'lg'}
    var style = model.style || '';
    theDialog.$container = $('<div class="modal"></div>')
        .appendTo(document.body);
    theDialog.$overlay = $('<div class="modal-backdrop"></div>')
        .appendTo(theDialog.$container);
    theDialog.$dialog = $('<div class="modal-dialog"></div>').appendTo(theDialog.$container);
    theDialog.host = theDialog.$dialog.get(0);
    if(model.overlay === false) {
        theDialog.$overlay.css('background-color', 'transparent');
    }
    if(size){
        theDialog.$dialog.addClass('modal-' + (sizes[size] || size));
    }
    // animateIn(theDialog);
    return theDialog;
}

dialog.addContext('default', {
    addHost: function(theDialog) {
        ensureDialogAnimations(theDialog, {
            animationIn: 'fadeInUp',
            animationOut: 'fadeOutDown',
        });
        processTheDialog(theDialog);
        animateIn(theDialog);
    },
    removeHost: function(theDialog) {
        animateOut(theDialog);
    },
    compositionComplete: function(child, parent, context) {
        var theDialog = dialog.getDialog(context.model);
        theDialog.$container.show();
        enableAutoclose(theDialog);
        $(child).find('.autofocus').first().focus();
    }
});

dialog.addContext('popup', {
    addHost: function(theDialog) {
        var model = theDialog.owner;
        model.position = model.position || 'auto';
        var aniation = {
            animationIn: 'fadeIn',
            animationOut: 'fadeOut',
        };
        processTheDialog(theDialog);
        theDialog.$target = $(model.target);
        theDialog.$container.addClass('modal-popover');
        aniation.animationIn = 'popoverIn';
        aniation.animationOut = 'popoverOut';
        var position = (model.position || '').split(' ');
        theDialog.positionPrimary = position[0];
        theDialog.positionSecondary = position[1];
        if(theDialog.positionPrimary == 'auto' && theDialog.$target){
                theDialog.positionPrimary = 'bottom';
                if(theDialog.$target.offset().top > $(window).height()/2){
                    theDialog.positionPrimary = 'top';
                }
        }
        if(theDialog.positionPrimary){
            theDialog.$dialog.addClass(theDialog.positionPrimary);
            if(theDialog.positionSecondary){
                theDialog.$dialog.addClass([theDialog.positionPrimary, theDialog.positionSecondary].join('-'));
            }
        }
        ensureDialogAnimations(theDialog, aniation);
        animateIn(theDialog);
    },
    removeHost: function(theDialog) {
        animateOut(theDialog);
    },
    compositionComplete: function(child, parent, context) {
        var theDialog = dialog.getDialog(context.model);
        theDialog.$container.show();
        enableAutoclose(theDialog);
        $(child).find('.autofocus').first().focus();
        //
        var theDialog = dialog.getDialog(context.model);
        var model = theDialog.owner;
        if(theDialog.$target.length){
            var offset = theDialog.$target.offset();
            var top = offset.top - $(document).scrollTop();
            var left = offset.left - $(document).scrollLeft();
            var arrowSize = 0;
            var positionPrimary = theDialog.positionPrimary;
            var positionSecondary = theDialog.positionSecondary;
            if(positionPrimary){
                theDialog.$dialog.prepend('<div class="arrow"></div>');
                arrowSize = 10;
            }
            if(positionPrimary == 'bottom' || positionPrimary == 'top'){
                left -= (theDialog.$dialog.outerWidth() - theDialog.$target.outerWidth())/2;
                if(positionPrimary == 'bottom'){
                    top += theDialog.$target.outerHeight() + arrowSize;
                }
                else if(positionPrimary == 'top'){
                    top -= theDialog.$dialog.outerHeight() + arrowSize;
                }
                if(positionSecondary == 'left'){
                    left += theDialog.$dialog.outerWidth()/2 - theDialog.$target.outerWidth()/2;
                }
                if(positionSecondary == 'right'){
                    left -= theDialog.$dialog.outerWidth()/2 - theDialog.$target.outerWidth()/2;
                }
            }
            else if(positionPrimary == 'right' || positionPrimary == 'left'){
                top -= (theDialog.$dialog.outerHeight() - theDialog.$target.outerHeight())/2;
                if(positionPrimary == 'right'){
                    left += theDialog.$target.outerWidth() + arrowSize;
                }
                else if(positionPrimary == 'left'){
                    left -= theDialog.$dialog.outerWidth() + arrowSize;
                }
                if(positionSecondary == 'top'){
                    top += theDialog.$dialog.outerHeight()/2 - theDialog.$target.outerHeight()/2;
                }
                if(positionSecondary == 'bottom'){
                    top -= theDialog.$dialog.outerHeight()/2 - theDialog.$target.outerHeight()/2;
                }
            }

            var $body = theDialog.$dialog.find('.modal-body');
            if(positionPrimary == 'top' || positionSecondary == 'bottom'){
                var bottom = $(window).height() - (top + theDialog.$dialog.outerHeight());
                theDialog.$dialog.css({
                    left: left,
                    top: 'auto',
                    bottom: bottom,
                });
                $body.css({
                    'max-height': ($(window).height() - bottom - 60) + 'px',
                });
            }
            else {
                theDialog.$dialog.css({
                    left: left,
                    top: top
                });
                $body.css({
                    'max-height': ($(window).height() - top - 60) + 'px',
                });
            }
        }
        enableAutoclose(theDialog);
    }
});


dialog.MessageBox.defaultOptions = ['OK'];
// dialog.MessageBox.setDefaults({
//     buttonClass: 'button',
//     primaryButtonClass: ' autofocus',
//     secondaryButtonClass: 'secondary',
//     'class': 'messageBox', style: {width: '100%'}
// });

dialog.MessageBox.defaultViewMarkup = [
'<div data-view="plugins/messageBox" class="modal-content messageBox" data-bind="css: getClass(), style: getStyle()">',
    '<div class="modal-header">',
        '<h3 class="modal-title" data-bind="text: title"></h3>',
    '</div>',
    '<div class="modal-body">',
        '<p class="message" data-bind="text: message"></p>',
    '</div>',
    '<div class="modal-footer">',
        '<!-- ko foreach: options -->',
            '<button data-bind="click: function () { $parent.selectOption($parent.getButtonValue($data)); }, text: $parent.getButtonText($data), css: $parent.getButtonClass($index)"></button>',
        '<!-- /ko -->',
        '<div style="clear:both;"></div>',
    '</div>',
// '</div>',
].join('\n');

dialog.MessageBox.prototype.size = 'small';

dialog.MessageBox.prototype.animationIn = 'popIn';
dialog.MessageBox.prototype.animationOut = 'popOut';
dialog.MessageBox.prototype.animationSpeed = 'fast';
dialog.MessageBox.prototype.animationEasing = 'bounceIn';
dialog.MessageBox.prototype.style = 'height: auto;';

// ['actionsheet', 'offcanvas'].forEach(function(name){
//     var helperName = 'show' + name.substr(0, 1).toUpperCase() + name.substr(1);
//     app[helperName] = dialog[helperName].bind(dialog);
// });

export default {};