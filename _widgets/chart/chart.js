import {Widget} from 'framework';

import d3 from 'd3';
import c3 from 'c3';

import $ from 'jquery';

// import {Chart, ChartFactory} from '_common/Chart';

class ChartWidget extends Widget {

	constructor(){
		this.view = null;
		this.chartOptions = {};
	}

	draw(){
		var $elem = $(this.view).find('.chart');
		var elem = $elem.get(0);
		this.chartOptions.bindto = elem;
		var chart = c3.generate(this.chartOptions);
		this.chartOptions.setChart(chart);
	}

	attached(view){
		this.view = view;
		this.draw();
	}

	activate(settings){
		this.chartOptions = settings.chart;
	}

}

export default ChartWidget;