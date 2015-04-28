var colorMap = {};

// http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript
function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

export class ColorFactory {

	constructor(){
		this.lastIndex = 0;
		this.keysUpper = 'SFAXIYCZHEDROJGPMWUQVLKTBN' + 'AESYBUDMVCRPKLNZWGTHOQIJFX';
		this.keysLower = 'stjlcuxkovpmgdbnrizhyawqef' + 'ndsitmgjorfplhcvzuwqkxebay';
		this.keysDigits = '8294063175' + '6859217430' + '2905863741' +'9863720451' + '0756913842';
		this.keysPad = 'IfATHpu1a9svr3nqDG2VzcmiwK0OEygbdkeSULWZl4NMCJXP8tx75j6oBQFRhY';
		// this.keysPad = 'afA5Hfdda9svr3nqDG2VzcmiwK0OEygbdkeSULWZl4NMCJXP8tx75j6oBQFRhY';
		var cat20 = d3.scale.category20().range();
		var cat20c = d3.scale.category20c().range().concat([]);
		var cat20b = d3.scale.category20b().range().concat([]);
		this.pattern = [].concat(
				cat20,
				cat20b,
				cat20c,
				[
				cat20c[0], cat20c[1], //cat1[2],
				cat20c[12], cat20c[13], //cat1[14],
				cat20c[16], cat20c[17], //cat1[18],

				cat20b[0], cat20b[1], //cat2[2],
				],
			[]);
		// shuffle(this.pattern);

	}

	getColorFromColors(name){
		var hash = 5381;
		for (var i = 0; i < name.length; i++) {
			var char = name.charCodeAt(i);
			hash = ((hash<<5)+hash) + char;
			hash = hash & hash; // Convert to 32bit integer
		}
		console.log(name, hash);
		var colorLen = this.colors.length;
		var index = ((hash%colorLen)+colorLen)%colorLen;
		var color = this.colors [ index ];
		return color;
	}

	shuffle(o) {
		for ( var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
			;
		return o;
	}

	shuffleColors(){
		this.shuffle(this.colors);
	}

	hashCode(str) { // java String#hashCode
	    var hash = 0;
	    for (var i = 0; i < str.length; i++) {
	       hash = str.charCodeAt(i) + ((hash << 5) - hash);
	    }
	    return hash;
	}

	intToARGB(i){
	    return ((i>>24)&0xFF).toString(16) + 
	           ((i>>16)&0xFF).toString(16) + 
	           ((i>>8)&0xFF).toString(16) + 
	           (i&0xFF).toString(16);
	}
	stringToColor(str) {
		str = '' + str;
		str = (str + this.keysPad).substr(0, this.keysPad.length);
		var tokens = str.split('');
		var strNew = '';
		for(var i = 0; i < tokens.length; i++){
			strNew += tokens[i] + this.keysUpper[i] + this.keysLower[i] + this.keysDigits[i];
		}
		str = strNew;

	    // str to hash
	    // for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));

	    var hash = this.hashCode(str);

	    // int/hash to hex
	    for (var i = 0, color = "#"; i < 3; color += ("00" + ((hash >> i++ * 8) & 0xFF)
	    	.toString(16)).slice(-2));

	    return color;
	}

	getColorForKey(key) {
		if(!colorMap[key]){
			colorMap[key] = this.pattern[this.lastIndex];
		}
		this.lastIndex++;
		return colorMap[key];
		// return this.stringToColor(key);
	}

	getColor(name){
		return this.getColorForKey(name);
		return this.stringToColor(name);
		// return this.getColorFromColors(name);
		var color = this.intToARGB(this.hashCode(name));
		console.log('ALL COLORSSS...', color);
	}

}