import {Widget} from 'framework';
import $ from 'jquery';
import dialog from 'plugins/dialog';

class ClampedText extends Widget {
	constructor(){
		this.text = null;
		this.originalText = null;
		this.lines = 1000;
		this.shouldClamp = false;
		this.clamped = false;
		this.reveal = true;
		this.view = null;
	}

	reveal(){
		$(this.view).find('.clamped-text').hide();
		$(this.view).find('.original-text').show();
		this.clamped = false;
        window.setTimeout(()=> {
        	$(this.view).find('a').focus();
        }, 100);
	}

	clamp(){
		$(this.view).find('.original-text').hide();
		var $clampElem = $(this.view).find('.clamped-text');
		$clampElem.show();
		var oldContent = $clampElem.text();
        console.log('OLD>>> ', oldContent);
		this.text = this.originalText;
        var clamped = $clamp($clampElem.get(0), {clamp: this.lines, useNativeClamp: false, animate: true});
        this.clamped = true;
        if(this.shouldClamp){
        	return;
        }
        window.setTimeout(()=> {
	        var newContent = $clampElem.text();
	        if(oldContent != newContent){
		        this.shouldClamp = true;
	    	}
	    }, 500);
	}

	showMore(event){
		if(typeof this.reveal === 'function'){
			return this.reveal(event);
		}
		this.revealContent(event);
	}

	revealContent(event){
		var item = {
			text: this.text,
			getView: function(){
				return $(`<div class="grid-content text-justify" style="padding-top: 1rem">
					<p>\${text}</p>
					<a href="#" class="secondary expand button" click.delegate="close()">Close</a>
				</div>`).get(0);
			},
			autoclose: true,
			// animationIn: 'hingeInFromMiddleX',
			// animationOut: 'hingeOutFromMiddleX',
			animationIn: 'fadeIn',
			animationOut: 'fadeOut',
			animationSpeed: 'fast',
			overlay: true,
			position: 'left',
			size: 'small',
			close: function(){
				dialog.close(this);
			},
			target: $(this.view).find('.popup-target').get(0),
			// target: $(this.view).find('a').get(0),
		};
		dialog.show(item);
		// dialog.showPopup(item);
		// dialog.showActionsheet(item);
	}

	attached(view){
		this.view = view;
		// this.clamp();
		var lineHeight = $(view).css('line-height');
		lineHeight = parseFloat(('' + lineHeight).replace('px', ''));
		$(view).css({
			height: this.lines * lineHeight,
		})
		// alert($(view).css('line-height'));
	}

	activate(settings){
		this.originalText = settings.text;
		this.text = '' + this.originalText;
		this.lines = settings.lines;
		this.reveal = true;
		if(settings.reveal !== undefined){
			this.reveal = settings.reveal;
		}
	}
}

export default ClampedText;