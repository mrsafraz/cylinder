import {Widget} from 'framework';

import d3 from 'd3';
import c3 from 'c3';

import $ from 'jquery';

// import {Chart, ChartFactory} from '_common/Chart';

class ChartWidget extends Widget {

	constructor(){
		super();
		// this.view = null;
		// this._chartObj = {};
	}

	draw(view){
		var $elem = $(view).find('.chart');
		var elem = $elem.get(0);
		// this._chartObj.bindto = elem;
		// $elem.append(this._chartObj.element);
		var isActive = this._chartObj.isActive;
		if(!isActive){
			var chart = c3.generate(this._chartObj);
			this._chartObj.setChart(chart);
		}
		// alert($(this._chartObj.element).height());
		$elem.append(this._chartObj.element);
		if(!isActive){
			window.setTimeout(()=> {
				// this._chartObj.flush();
				$(window).trigger('resize');
			}, 500);
		}
	}

	drawOld(view){
		var $elem = $(view).find('.chart');
		var elem = $elem.get(0);
		this._chartObj.bindto = elem;
		var chart = c3.generate(this._chartObj);
		this._chartObj.setChart(chart);
	}

	attached(view){
		// this.view = view;
		this.drawOld(view);
	}

	activate(settings){
		this._chartObj = settings.chart;
	}

}

export default ChartWidget;