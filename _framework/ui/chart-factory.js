import d3 from 'd3';
import c3 from 'c3';
// import $ from 'jquery';

import {ColorFactory} from './color-factory';

export class Chart {
	constructor(){
		this.data = {columns: []};
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

class ColorManager {
	constructor(colorFactory: ColorFactory){
		this.colorFactory = colorFactory;
		this.colorMap = {};
	}
	getColor(key){
		if(this.colorMap[key]){
			return this.colorMap[key];
		}
		// return color;
		return this.colorFactory.getColor(key);
	}
}

export class ChartFactory {
	constructor(colorManager: ColorManager){
		this.colorManager = colorManager;
	}
	mapColors(colorMap){
		this.colorManager.colorMap = colorMap;
	}
	generate(options = {}){
		// return c3.generate(options);
		var chart = new Chart();
		for(var key in options){
			chart[key] = options[key];
		}
		if(!(chart.data && chart.data.color)){
			chart.data.color = (color, d)=> {
				var key = d.id || d;
				return this.colorManager.getColor(key);
			};
		}
		chart.color = {};
		var cat1 = d3.scale.category20c().range().concat([]),
		cat2 = d3.scale.category20b().range().concat([]),
		cat3 = d3.scale.category20().range().concat([]);

		chart.color.pattern = [].concat(
			// cat1.splice(0, 3),
			// cat1.splice(3, 3),
			cat1,
			[
				'rgb(107, 174, 214)',
				'rgb(158, 202, 225)',

				// 'rgb(198, 219, 239)',

				// 'rgb(165, 81, 148)',
				'rgb(206, 109, 189)',
				'rgb(222, 158, 214)',

				'rgb(231, 150, 156)',

				'rgb(107, 110, 207)',
				'rgb(156, 158, 222)',
				//
				'rgb(150, 150, 150)',
				'rgb(189, 189, 189)',
			],
			// cat1.splice(0, 5),
			// cat1.splice(4, 5)
			// cat2.reverse()
			// cat1
			[]
		);

		chart.color.pattern = [].concat(
			// cat1,
			// cat3,
			// cat3.splice(0, 3),

			//
			[
			cat1[0], cat1[1], //cat1[2],
			cat1[12], cat1[13], //cat1[14],
			cat1[16], cat1[17], //cat1[18],

			cat2[0], cat2[1], //cat2[2],
			],
			[]);
		// chart.color.pattern = cat3;
		return chart;
	}
}