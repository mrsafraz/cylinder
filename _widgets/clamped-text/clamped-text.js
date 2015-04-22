import {Widget} from 'framework';
import $ from 'jquery';
import {Dialog} from 'framework';

class RevealDialog extends Dialog {
	constructor(text){
		super();
		this.autoclose = true;
		this.text = text;
	}
	revealAt(target){
		this.show({}, {
			popover: target,
		});
	}
	getView(){
		return $(`<div class="modal-content">
			<div class="modal-body text-justify">
			<p>\${text}</p>
			<a href="#" class="secondary expand button" click.delegate="close()">Close</a>
		</div></div>`).get(0);
	}
}

class ClampedText extends Widget {
	constructor(){
		super();
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

	revealContent($event){
		var revealDialog = new RevealDialog(this.text);
		revealDialog.revealAt($event.target);
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