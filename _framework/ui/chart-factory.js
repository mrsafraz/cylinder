import d3 from 'd3';
import c3 from 'c3';
// import $ from 'jquery';
import {Config} from '../core/config';

import {ColorFactory} from './color-factory';

export class Chart {
	constructor(){
		this.data = {rows: []};
		this.isActive = false;
		this._loadCallbacks = [];
	}
	setChart(chart){
		for(var key in chart){
			this[key] = chart[key];
		}
		this.isActive = true;
		for(var fn of this._loadCallbacks){
			fn(this);
		}
	}
	onGenerate(fn){
		this._loadCallbacks.push(fn);
	}
}

export class ColorManager {
	constructor(colorFactory: ColorFactory, config: Config){
		this.colorFactory = colorFactory;
		this.colorMap = {};
		if(config.chartColors){
		  	for(var key in config.chartColors){
		  		this.colorMap[key] = config.chartColors[key];
		  	}
		}
	}
	getColor(key, colorFactory){
		if(this.colorMap[key]){
			return this.colorMap[key];
		}
		// return color;
		return colorFactory.getColor(key);
	}
}

export class ChartFactory {
	constructor(colorManager: ColorManager){
		this.colorManager = colorManager;
	}
	static get colorPattern(){
		return d3.scale.category20().range();
	}

	mapColors(colorMap){
		for(var key in colorMap){
			this.mapColor(key, colorMap[key]);
		}
	}
	mapColor(key, value){
		this.colorManager.colorMap[key] = value;
	}
	generate(options = {}){
		var colorFactory = new ColorFactory();
		if(!options.data){
			options.data = {rows: []};
		}
		if(!options.data.color){
			// options.data.color = (color, d)=> {
			// 	var key = d.id || d;
			// 	return this.colorManager.getColor(key, colorFactory);
			// };
		}
		// var chart = c3.generate(options); return chart;
		var chart = new Chart();
		for(var key in options){
			chart[key] = options[key];
		}
		if(!chart.color){
			chart.color = {};
			var cat1 = d3.scale.category20c().range().concat([]),
			cat2 = d3.scale.category20b().range().concat([]);
			chart.color.pattern = [].concat(
				[
				cat1[0], cat1[1], //cat1[2],
				cat1[12], cat1[13], //cat1[14],
				cat1[16], cat1[17], //cat1[18],

				cat2[0], cat2[1], //cat2[2],
				],
			[]);
			chart.color.pattern = ChartFactory.colorPattern;
		}
		return chart;
	}
}