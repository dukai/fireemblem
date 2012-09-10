(function(win, undefined){

var extend = function(subClass, baseClass){
	subClass.parentConstructor = baseClass;
	subClass.parent = {};

	baseClass.call(subClass.parent);


	for(var method in baseClass.prototype){
		subClass.prototype[method] = subClass.parent[method] = baseClass.prototype[method];
	}
};

window.extend = extend;
})(window);

(function(win){
	var util = {
		random : function(min, max){
			return (~~(Math.random() * (max - min + 1)) + min);
		},
		randomColor: function(){
			var red = this.random(0, 255);
			var green = this.random(0, 255);
			var blue = this.random(0, 255);
			return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
		},
		
		g: function(){
			return document.getElementById(arguments[0]);
		},
		
		getScroll: function() {
			var scrollx, scrolly;
			if (typeof(win.pageXOffset) == 'number') {
				scrollx = win.pageXOffset;
				scrolly = win.pageYOffset;
			} else {
				scrollx = document.documentElement.scrollLeft;
				scrolly = document.documentElement.scrollTop;
			}
			return {
				left: scrollx,
				top: scrolly
			};
		},
		
		getPosInDoc: function(target) {
			if (!target) {
				return null;
			}
			var left = 0,
				top = 0;
				
			do {
				left += target.offsetLeft || 0;
				top += target.offsetTop || 0;
				target = target.offsetParent;
			} while (target);
			
			return {
				left: left,
				top: top
			};
		},

		loadXMLDoc: function(docName){
			try{ //Internet Explorer
				xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			}
			catch(e){
				try{ //Firefox, Mozilla, Opera, etc.
					xmlDoc=document.implementation.createDocument("","",null);
				}catch(e) {
					console.log(e.message)
				}
			}

			try{
				xmlDoc.async=false;
				xmlDoc.load(dname);
				return(xmlDoc);
			}catch(e) {
				console.log(e.message)
			}

			return(null);
		},

		parseXMLString: function(text){
			var xmlDoc = null;
			try{ //Internet Explorer
				xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async="false";
				xmlDoc.loadXML(text);

			}catch(e){
				try{ //Firefox, Mozilla, Opera, etc.
			
					parser=new DOMParser();
					xmlDoc=parser.parseFromString(text,"text/xml");
				}
				catch(e) {
					console.log(e.message);
				}
			}

			return xmlDoc;
		},

		getTextWidth: function(text, styles, context){
			for(var attr in styles){
				context[attr] = styles[attr];
			}

			return context.measureText(text).width;
		}
	};

	var Base64 = {
		decode: function(input){
			if(win.atob){
				return win.atob(input);
			}else{
				var output = [], chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

				while (i < input.length) {
					enc1 = _keyStr.indexOf(input.charAt(i++));
					enc2 = _keyStr.indexOf(input.charAt(i++));
					enc3 = _keyStr.indexOf(input.charAt(i++));
					enc4 = _keyStr.indexOf(input.charAt(i++));

					chr1 = (enc1 << 2) | (enc2 >> 4);
					chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
					chr3 = ((enc3 & 3) << 6) | enc4;

					output.push(String.fromCharCode(chr1));

					if (enc3 != 64) {
						output.push(String.fromCharCode(chr2));
					}
					if (enc4 != 64) {
						output.push(String.fromCharCode(chr3));
					}
				}

				output = output.join('');
				return output;
			}
		},

		decodeAsArray: function(input, bytes){
			bytes = bytes || 1;

			var dec = this.decode(input), ar = [], i, j, len;

			for (i = 0, len = dec.length / bytes; i < len; i++) {
				ar[i] = 0;
				for (j = bytes - 1; j >= 0; --j) {
					ar[i] += dec.charCodeAt((i * bytes) + j) << (j << 3);
				}
			}
			return ar;
		}
	};

	util.Base64 = Base64;
	/**
	 * A xml dom node parser
	 * @param {XMLDOM}node
	 * @return {Object} parser object
	 * @constructor
	 */
	util.DOMParser = function(node){
		return {
			attr: function(attrName){
				return node.getAttribute(attrName);
			},

			intAttr: function(attrName){
				return parseInt(this.attr(attrName));
			},

            floatAttr: function(attrName){
                return parseFloat(this.attr(attrName));
            },

            getElementsByTagName: function(tagName){
                return node.getElementsByTagName(tagName);
            },

            getFirstElement: function(){
                return node.firstElementChild;
            }
		};
	};
	
	win.util = util;
})(window);/**
* Ajax Module
*/

(function(win, util){

var options = {url: '', success: function(){}, error: function(){}, method: 'GET', dataType: ''}
var Request = function(options){
	var self = this;
	self.requestHeaders = {'DK_AJAX_REQUEST': 'ajax-reqeust'};
	self.options = {url: '', success: function(){}, error: function(){}, method: 'GET'};
	for(var i in options){
		self.options[i] = options[i];
	}
	
	if(self.options.dataType == 'jsonp'){
	
		var jsonpCallbackName = 'dkjsonp_' + new Date().getTime() + parseInt(Math.random() * 1000 )
		self.options.url = self.options.url.replace('callback=?', 'callback=' + jsonpCallbackName);
		
		win[jsonpCallbackName] = win[jsonpCallbackName] || function(data){
			self.options.success(data);
			
			win[ jsonpCallbackName ] = undefined;
			
			try{
				delete win[jsonpCallbackName];
			}catch(e){}
		};
		
		var head = document.getElementsByTagName('head')[0] || document.documentElement;
		var script = document.createElement("script");
		script.src = self.options.url;
		var done = false;

		// Attach handlers for all browsers
		script.onload = script.onreadystatechange = function() {
			if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
				done = true;

				// Handle memory leak in IE
				script.onload = script.onreadystatechange = null;
				if ( head && script.parentNode ) {
					head.removeChild( script );
				}
			}
		};
		
		head.insertBefore( script, head.firstChild );
		
		self.send = function(){};
		return;
	}
	
	var xhr = null;
	if(win.XMLHttpRequest){
		xhr = new XMLHttpRequest();
	}else{
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xhr.onreadystatechange = function(){
		switch(xhr.readyState){
			case 1:
				self.loading();
				break;
			case 2:
				self.loaded();
				break;
			case 3:
				self.interactive();
				break;
			case 4:
				self.complete(xhr.status, xhr.statusText, xhr.responseText, xhr.responseXML);
				break;
		}
	};
	
	if(xhr.upload && self.options.progress){
		xhr.upload.addEventListener('progress', self.options.progress, false);
	}
	
	self.send = function(data){
		xhr.open(self.options.method, self.options.url, true);
		for(var i in self.requestHeaders){
			xhr.setRequestHeader(i, self.requestHeaders[i]);
		}
		data = data ? data : null;
		xhr.send(data);
	};
	
	self.setRequestHeader = function(label, content){
		self.requestHeaders[label] = content;
	};
	
	self.loading = function(){};
	self.loaded = function(){};
	self.interactive = function(){};
	self.complete = function(status, statusText, responseText, responseXML){
		if(status == 200){
			if(self.options.success){
				var responseObj;
				if(self.options.dataType){
					switch(self.options.dataType){
						case 'json':
							responseObj = util.JSON.parse(responseText);
							break;
						case 'html':
							responseObj = responseText;
							break;
						case 'xml':
							if(responseXML){
								responseObj = responseXML;
							}else{
								responseObj = responseText;
							}
							break;
					}
				}else{
					if(responseXML){
						responseObj = responseXML;
					}else{
						responseObj = responseText;
					}
				}
				self.options.success.call(self, responseObj, statusText, xhr);
			}
		}else{
			self.options.error && self.options.error(statusText, xhr);
		}
	};
};

if(!util){
	var util = win.util = {};
}

util.Request = Request;

})(window, util);(function(window){

var HitMap = function(map){
	
	this.getWidth = function(){
		return map[0].length;
	};
	
	this.getHeight = function(){
		return map.length;
	};
	
	this.getPassable = function(x, y){
		if(this.getReachable(x, y)){
			return map[y][x] !== 1;
		}
		return true;
	};
	
	this.getReachable = function(x, y){
		if(x >= 0 && y >= 0 && x < this.getWidth() && y < this.getHeight()){
			return true;
		}
		
		return false;
	};

	this.get = function(x, y){
		return map[y][x];
	};
	
	this.set = function(x, y, value){
		map[y][x] = value;
	};
};

var Node = function(x, y){
	this.F = null;
	this.G = null;
	this.H = null;
	this.x = x;
	this.y = y;
	this.parentNode = null;
	this.passable = false;
	
	this.checkReachable = function(map){
		this.passable = map.getPassable(this.x, this.y);
		return map.getReachable(this.x, this.y);
	};
	
	this.equal = function(node){
		if(this.x == node.x && this.y == node.y){
			return true;
		}
		
		return false;
	};
	
	this.getDistance = function(node){
		var dx = Math.abs(this.x - node.x);
		var dy = Math.abs(this.y - node.y);
		
		return {dx: dx, dy: dy};
	};
	
	this.setH = function(node){
		var d = this.getDistance(node);
		//this.H = ~~(Math.sqrt(d.dx * d.dx + d.dy * d.dy) * 10);
		this.H = (d.dx + d.dy) * 10;
	};
	
	this.setG = function(node){
		var g = this.getRelativeG(node);
		this.G = node.G + g;
	};
	
	this.getRelativeG = function(node){
		var d = this.getDistance(node);
		var dsum = d.dx + d.dy;
		if(dsum == 2){
			return 14;
		}else if(dsum == 1){
			return 10;
		}else if(dsum == 0){
			return 0;
		}
		return 20;
		//return ~~(Math.sqrt(d.dx * d.dx + d.dy * d.dy));
	}
	
	this.getF = function(){
		if(this.F === null){
			this.F = this.G + this.H;
		}
		return this.F;
	};
	
	this.setParent = function(node){
		this.parentNode = node;
	}
	
	this.getSurroundNodes = function(map){
		var mapWidth = map.getWidth();
		var mapHeight = map.getHeight();
		var nextColumn = this.x + 1;
		var preColumn = this.x - 1;
		var nextRow = this.y + 1;
		var preRow = this.y - 1;
		var nodelist = [];
		
		for(var x = preColumn; x <= nextColumn; x++){
			for(var y = preRow; y <= nextRow; y++){
				var n = new Node(x, y);
				if(n.checkReachable(map) && n.passable && !this.equal(n)){
					nodelist.push(n);
				}
			}
		}
		return nodelist;
	};
	
	this.print = function(){
		//console.log(this.x + ' - ' + this.y);
	}
};

var NodeList = function(startNode, endNode){
	this.nodelist = [];
	this.add = function(node){
		//node.setG(startNode);
		node.setH(endNode);
		
		this.nodelist.push(node);
	};
	
	this.remove = function(node){
		this.nodelist.splice(this.nodelist.indexOf(node), 1);
	};
	
	this.getMinPoint = function(){
		var nodelist = this.nodelist;
		var minF = nodelist[0].getF();
		var currIndex = 0;
		for(var i = 0, len = nodelist.length; i < len; i++){
			if(minF > nodelist[i].getF()){
				minF = nodelist[i].getF();
				currIndex = i;
			}
		}
		
		return nodelist.splice(currIndex, 1)[0];
	};
	
	this.getCount = function(){
		return this.nodelist.length;
	};
	
	this.exists = function(node){
		for(var i = 0, len = this.nodelist.length; i < len; i++){
			if(this.nodelist[i].equal(node)){
				return true;
			}
		}
		
		return false;
	}
};


var AStar = function(map, startNode, endNode){
	this.openList = new NodeList(startNode, endNode);
	this.closeList = new NodeList(startNode, endNode);
	startNode.G = 0;
	this.openList.add(startNode);
	
	this.getPath = function(){
		var isFinded = false;
		var startTime = new Date().getTime();
		var openList = this.openList;
		var closeList = this.closeList;
		while(openList.getCount() !== 0){
			var minPoint = openList.getMinPoint();
			closeList.add(minPoint);
			var surroundPoints = minPoint.getSurroundNodes(map);
			
			for(var i = 0, len = surroundPoints.length; i < len; i++){
				var tempNode = surroundPoints[i];
				tempNode.print();
				
				if(closeList.exists(tempNode)){
					continue;
				}
				
				if(openList.exists(tempNode)){
					if(tempNode.getRelativeG(minPoint) < tempNode.G){
						tempNode.setG(minPoint);
						tempNode.setParent(minPoint);
					}
					continue;
				}
				
				tempNode.setG(minPoint);
				tempNode.setParent(minPoint);
				
				openList.add(tempNode);
			}
			
			if(openList.exists(endNode)){
				//closeList.add(endNode);
				isFinded = true;
				break;
			}
		}
		
		var endTime = new Date().getTime();
		this.diffTime = endTime - startTime;
		
		if(isFinded){
			return closeList;
		}else{
			return false;
		}
	};
};

window.PathFinder = {
	AStar: AStar,
	Node: Node,
	NodeList: NodeList,
	HitMap: HitMap
};
})(window);(function(win, util){
/*
    http://www.JSON.org/json2.js
    2011-10-19

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, regexp: true */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

var JSON;
if (!JSON) {
    JSON = {};
}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear()     + '-' +
                    f(this.getUTCMonth() + 1) + '-' +
                    f(this.getUTCDate())      + 'T' +
                    f(this.getUTCHours())     + ':' +
                    f(this.getUTCMinutes())   + ':' +
                    f(this.getUTCSeconds())   + 'Z'
                : null;
        };

        String.prototype.toJSON      =
            Number.prototype.toJSON  =
            Boolean.prototype.toJSON = function (key) {
                return this.valueOf();
            };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                    ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                    : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                    .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                        .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                        .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

if(!util){
	var util = win.util = {};
}

util.JSON = JSON;

})(window, util);/**
 * A 2D Vector
 * @param {int} x
 * @param {int} y
 */
var Vector = function(x, y){
	this.x = x;
	this.y = y;
	
	this.add = function(v){
		this.x += v.x;
		this.y += v.y;
	};
	
	this.remove = function(v){
		this.x -= v.x;
		this.y -= v.y;
	};
	
	/**
	 * Vector multiply a number
	 * @param {int}  num
	 */
	this.multiplyNum = function(num){
		this.x *= num;
		this.y *= num;
	}
	
	this.clone = function(){
		return new Vector(this.x, this.y);
	};
	
	this.equal = function(v){
		if(this.x === v.x && this.y === v.y){
			return true;
		}
		return false;
	};
}

/**
* A Rectangle Object
* @param {Vector} pos
* @param {int} width
* @param {int} height
*/
var Rect = function(pos, width, height){
	this.position = pos;
	this.width = width;
	this.height = height;

	this.setWidth = function(value){
		this.width = width;
	};

	this.setHeight = function(value){
		this.height = value;
	}

	this.clone = function(){
		return new Rect(this.position, this.width, this.height);
	}

	this.checkHit = function(rect){
		if(Math.abs((this.position.x + this.width / 2) - (rect.position.x + rect.width / 2)) < (this.width + rect.width) / 2 && Math.abs((this.position.y + this.height / 2) - (rect.position.y + rect.height / 2)) < (this.height + rect.height) / 2){
			return true;
		}
		return false;
	};
	
	this.checkContain = function(v, offsetV){
		if(offsetV === undefined){
			offsetV = new Vector(0, 0);
		}
		if((v.x > this.position.x + offsetV.x) && (v.y > this.position.y + offsetV.y) && v.x < this.position.x + offsetV.x + this.width && v.y < this.position.y + offsetV.y + this.height){
			return true;
		}
		return false;
	}
};

/**
*基础实体对象，所有可绘制对象的基类
*@param {Vector} pos object position
*@param {int} width
*@param {int} height 
*@param {int} styles optional
*/

var EntityObject = function(pos, width, height, styles){

	EntityObject.parentConstructor.call(this, pos, width, height);

	this.guid = EntityObject.guid++;
	this.clickable = false;
	this.hitable = false;
	this.collisionMap = null;
	this.visual = false;
	this.styles = styles;
	
	this._events = {};
	
	this.setStyles = function(styles){
		this.styles = styles;		
	}
	
	this.drawRect = function(context, styles){
		if(!styles){
			return false;
		}
		if(styles.border){
			context.strokeStyle = styles.border.color
			context.lineWidth = styles.border.width;
			context.strokeRect(this.position.x, this.position.y, this.width, this.height);
		}
		
		if(styles.fill){
			context.fillStyle = styles.fill;
			context.fillRect(this.position.x, this.position.y, this.width, this.height);
		}
	};
	
	this._draw = function(context){
		this.drawRect(context, this.styles);
	};

	this._update = function(){};

	this.draw = function(context){
		context.save();
		this._update();
		this._draw(context);
		context.restore();
	};
	
	
	this.setCollisionMap = function(map){
		this.collisionMap = map;
	};
};
/**
*extends Rect
*/
extend(EntityObject, Rect);

EntityObject.guid = 1;

/**
 *Text Entity Object
 * @param {string} content
 * @param {Vector} pos
 * @param {object} styles {fillStyle: '', font: '', 'textBaseline: ''}
 * @param {int} width optional
 * @param {int} height optional  
 */
var TextEntityObject = function(content, pos, styles, width, height){
	
	(width === undefined) && (width = util.getTextWidth(content, styles, MainApp.dContext));
	(height === undefined) && (height = parseInt(/(\d+?)px/.exec(styles.font)[1]));

	TextEntityObject.parentConstructor.call(this, pos, width, height);

	this.content = content;
	
	this.setContent = function(content){
		this.content = content;
	};
	
	this.setStyle = function(s){
		for(var attr in s){
			styles[attr] = s[attr];
		}
	};
	
	this._draw = function(context){
		
		//TextEntityObject.parent.drawRect.call(this, context, {border: {width: .5, color:'#000'}});

		for(var attr in styles){
			context[attr] = styles[attr];
		}
		
		context.fillText(this.content, this.position.x, this.position.y);
	};

}

extend(TextEntityObject, EntityObject);


var ImageEntityObject = function(img, pos, width, height){
	
	(width === undefined) && (width = img.width);
	(height === undefined) && (height = img.height);

	ImageEntityObject.parentConstructor.call(this, pos, width, height);

	this.img = img;

	this._draw = function(context){
		context.drawImage(this.img, this.position.x, this.position.y);
	};
};

extend(ImageEntityObject, EntityObject);


var LoadScreen = function(){
	LoadScreen.parentConstructor.call(this, new Vector(0, 0), 0, 0);

	var backgroundRect = new EntityObject(new Vector(267, 210), 106, 10, {border: {color: '#ccc', width: '2'}});
	var forgroundRect = new EntityObject(new Vector(270, 213), 0, 4, {fill: '#999'});
	var text = new TextEntityObject('正在为您载入', new Vector(281, 190), {fillStyle: '#000', font: 'bold 12px 微软雅黑', 'textBaseline': 'top'});

	this._draw = function(context){
		backgroundRect.draw(context);
		forgroundRect.draw(context);
		text.draw(context);
	}
	
	this.setProgress = function(percent){
		forgroundRect.width = 100 * percent;
	}
};

extend(LoadScreen, EntityObject);


var CollisionEntityObject = function(pos, width, height){
	CollisionEntityObject.parentConstructor.call(this, pos, width, height);
};

extend(CollisionEntityObject, EntityObject);

var CollistionMap = function(){
	var objectsIds = [];
	var objects = {};
	
	this.add = function(o){
		objectsIds.push(o.guid);
		objects[o.guid] = o;
	};
	
	this.remove = function(o){
		var index = objectsIds.indexOf(o.guid);
		delete objects[o.guid];
		objectsIds.splice(index, 1);
	};
	
	this.checkCollide = function(rect){
		for(var i = 0, len = objectsIds.length; i < len; i++){
			var co = objects[objectsIds[i]];
			
			if(co.checkHit(rect)){
				return true;
			}
		}
		
		return false;
	};
};
/**
* Sprint Animate Object
* @param {Vector} pos
* @param {img} img
* @param {animType} Sprite.ANIM_TYPE
* @param {split}
*/

var Sprite = function(pos, img, animType, split, speed){
	
	this.img = img;
	this.animType = animType;
	if(animType === Sprite.ANIM_TYPE.VERTICAL){
		this.width = img.width;
		this.height = split;
		this.frames = ~~(img.height / split);
	}else if(animType === Sprite.ANIM_TYPE.HORIZONTAL){
		this.width = split;
		this.height = img.height;
		this.frames = ~~(img.width / split);
	}
	
	Sprite.parentConstructor.call(this, pos, this.width, this.height);
	
	!!speed ? (this.speed = speed) : (this.speed = new Vector(0, 0));
	this.currFrame = 0;
	
	
	
	this._update = function(){
		this.currFrame += (MainApp.nowTime - MainApp.startTime) * 10 / 1000;
		this.currFrame %= this.frames;
		
		this.position.x += (MainApp.diffTime) * this.speed.x / 1000;
		this.position.y += MainApp.diffTime * this.speed.y / 1000;
		if(this.position.x > 640){
			//this.position.x = 0;
		}
	};
	
	this._draw = function(context){
		var f = ~~this.currFrame;
		if(this.animType === Sprite.ANIM_TYPE.VERTICAL){
			context.drawImage(this.img, 0,  f * this.height , this.width, this.height, this.position.x, this.position.y, this.width, this.height);
		}else if(this.animType === Sprite.ANIM_TYPE.HORIZONTAL){
			context.drawImage(this.img, f * this.width, 0 , this.width, this.height, this.position.x, this.position.y, this.width, this.height);
		}
	}
};

extend(Sprite, EntityObject);

Sprite.ANIM_TYPE = {
	VERTICAL: 1,
	HORIZONTAL: 2
}

var CommonLayer = function(viewport){
	var objects = [];
	
	CommonLayer.parentConstructor.call(this, viewport.position, viewport.getRealX(), viewport.getRealY());
	this.canvas = window.document.createElement('canvas');
	this.canvas.setAttribute('width', this.width);
	this.canvas.setAttribute('height', this.height);
	this.context = this.canvas.getContext('2d');
	
	this.add = function(o){
		objects.push(o);
	}
	
	this.remove = function(o){
		objects.splice(objects.indexOf(o), 1);
	}
	
	this.empty = function(){
		objects = [];
	}
	
	this._draw = function(context){
		this.context.clearRect(0, 0, this.width, this.height);
		for(var i = 0, len = objects.length; i < len; i++){
			objects[i].draw(this.context);
		}
		
		context.drawImage(this.canvas, viewport.position.x, this.position.y);
	};
}

extend(CommonLayer, EntityObject);

var ViewPort = function(minX, minY, maxX, maxY, realX, realY){
	ViewPort.parentConstructor.call(this, new Vector(minX, minY), maxX - minX, maxY - minY);
	
	this._move = {
		duration: 0,
		speed: new Vector(0, 0),
		keep: false
	};

	this._shake = {
		duration: 0
	};
	
	this.move = function(speed, duration){
		this._move.duration = duration === undefined ? 1000 : duration * 1000;
		this._move.speed = speed;
	};
	

	this.shake = function(duration){
		(duration === undefined) && (duration =.2);
		this._shake.duration = duration * 1000;
	};


	
	this._update = function(){
		if(this._move.duration > 0 || this._move.keep){
			this._move.duration -= MainApp.diffTime;
			var distance = this._move.speed.clone();
			distance.multiplyNum(MainApp.diffTime / 1000);
			this.position.add(distance);
			if(this.width - this.position.x >= realX || this.position.x > minX){
				this.position.x -= distance.x;
			}
			
			if(this.height - this.position.y >= realY || this.position.y > minY){
				this.position.y -= distance.y;
			}

			this.position.x = ~~this.position.x;
			this.position.y = ~~this.position.y;
		};

		if(this._shake.duration > 0){
			if(!this._shake.originPosition)
				this._shake.originPosition = this.position.clone();

			this._shake.duration -= MainApp.diffTime;

			this.position.x =  ~~ (Math.random() * 10) + this._shake.originPosition.x;
			this.position.y =  ~~ (Math.random() * 10) + this._shake.originPosition.y;

		}else{
			if(this._shake.originPosition){
				this.position.x = this._shake.originPosition.x;
				this.position.y = this._shake.originPosition.y;
				this._shake.originPosition = null;
			}
		}

	};
	
	this.setRealX = function(x){
		realX = x;
	};
	
	this.getRealX = function(){
		return realX;
	}
	
	this.setRealY = function(y){
		realY = y;
	};
	
	this.getRealY = function(){
		return realY;
	}
	
	this._draw = function(){};
};

extend(ViewPort, EntityObject);
(function(window){
window.requestAnimFrame = (function() {
	return window.requestAnimationFrame
			|| window.webkitRequestAnimationFrame
			|| window.mozRequestAnimationFrame
			|| window.oRequestAnimationFrame
			|| window.msRequestAnimationFrame || function() {
				//return setTimeout(arguments[0], 1000 / 60);
				return -1;
			} // return -1 if unsupported
})();

window.cancelRequestAnimFrame = (function() {
	return window.cancelAnimationFrame
			|| window.webkitCancelRequestAnimationFrame
			|| window.mozCancelRequestAnimationFrame
			|| window.oCancelRequestAnimationFrame
			|| window.msCancelRequestAnimationFrame || function() {
				return -1;
			} // return -1 if unsupported
})();

Array.prototype.indexOf = function(o){
	for(var i = 0, len = this.length; i < len; i++){
		if(this[i] === o){
			return i;
		}
	}
};


String.prototype.trim = function(){
	return this.replace(/^(\s+)|(\s+)$/g, '');
}

})(window);(function(window){
	
var TiledTile = function(gid, pos, width, height, tileset){
	
	TiledTile.parentConstructor.call(this, pos, width, height);

	this._draw = function(context){
		context.drawImage(tileset.getImage(), tileset.getSourceX(gid), tileset.getSourceY(gid) , this.width, this.height, this.position.x, this.position.y, this.width, this.height);
	};
};

extend(TiledTile, EntityObject);

var TiledLayer = function(pos, name, widthCount, heightCount, tileWidth, tileHeight, tilesData, tilesetMgr, visible){
	this.name = name;
	this.widthCount = widthCount;
	this.heightCount = heightCount;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	this.width = this.widthCount * this.tileWidth;
	this.height = this.heightCount * this.tileHeight;
	this.tilesData = tilesData;
	this.tilesetMgr = tilesetMgr;
	this.visible = visible;
	this.tiledObjects = [];

	this.canvas = window.document.createElement('canvas');

	this.canvas.setAttribute('width', this.width);
	this.canvas.setAttribute('height', this.height);
	this.context = this.canvas.getContext('2d');

	this.initTiles = function(){
		for(var i = 0, len = tilesData.length; i < len; i++){

			var x = i % this.widthCount;
			var y = ~~(i / this.widthCount);
			var gid = tilesData[i];
			if(gid > 0){
				var tileset = tilesetMgr.getTileset(gid);
				var tilePos = new Vector(x * tileset.tileWidth, y * tileset.tileHeight);

				var tiledObj = new TiledTile(gid, tilePos, tileset.tileWidth, tileset.tileHeight, tileset);
				tiledObj.draw(this.context);
				this.tiledObjects.push(tiledObj);
			}

		}
	}
	if(this.visible){
		this.initTiles();
	}

	this.setVisible = function(visible){
		if(visible && this.tiledObjects.legnth === 0){
			this.initTiles();
		}

		this.visible = visible;
	};

	TiledLayer.parentConstructor.call(this, pos, this.width, this.height);

	this._draw = function(context){
		if(!this.visible){
			return false;
		}

		context.drawImage(this.canvas, this.position.x, this.position.y);
	};
};

extend(TiledLayer, EntityObject);

var Tileset = function(name, firstgid, tileWidth, tileHeight, totalWidth, totalHeight){
	this.name = name;
	this.firstgid = firstgid;
	this.tileWidth = tileWidth;
	this.tileHeight = tileHeight;
	this.totalWidth = totalWidth;
	this.totalHeight = totalHeight;

	this.widthCount = ~~(totalWidth / tileWidth);
	this.heightCount = ~~(totalHeight / tileHeight);

	this.totalCount = this.widthCount * this.heightCount;

	this.lastgid = this.firstgid + this.totalCount - 1;


	this.isContain = function(gid){
		if(gid >= this.firstgid && gid <= this.lastgid){
			return true;
		}

		return false;
	};

	this.getImage = function(){
		return MainApp.resourceLoader.get(this.name);
	}

	this.getSourceX = function(gid){
		return (gid - this.firstgid) % this.widthCount * this.tileWidth;
	}

	this.getSourceY = function(gid){
		return parseInt(((gid - this.firstgid) / this.widthCount)) * this.tileHeight;
	}
};

var TilesetManager = function(){

	var tilesets = [];


	this.add = function(tileset){
		tilesets.push(tileset);

		tileset.firstgid
		tileset.lastgid
	};

	this.remove = function(tileset){
		tilesets.splice(tilesets.indexOf(tileset), 1);
	};

	this.getTileset = function(gid){
		for(var i = 0, len = tilesets.length; i < len; i++){
			if(tilesets[i].isContain(gid)){
				return tilesets[i];
			}
		}
	}
};

var TiledLayerManager = function(){
	var layers = [];

};
/**
 * An common TiledObject, for player and so on
 * @param {String} name
 * @param {Vector} pos
 * @param {Image} img
 * @param {int} width
 * @param {int} height
 * @param {enum} animType
 * @param {int} split
 * @constructor
 */
var TiledObject = function(name, pos, img, width, height, animType, split, px, py){
	//TODO: adjust the animType and process the offsetX and offsetY
	var offsetX = (img.width - width) / 2;
	var offsetY = (split - height);
	var self = this;
	pos.x -= offsetX;
	pos.y -= offsetY;  
	
	TiledObject.parentConstructor.call(this, pos, img, animType, split, new Vector(0, 0));
	
	this.node = PathFinder.Node(px, py);
	
	
	this.getRange = function(maxRange, minRange){
		var target = new PathFinder.Node(px, py);
		var preColumn = target.x - maxRange;
		var nextColumn = target.x + maxRange;
		var preRow = target.y - maxRange;
		var nextRow = target.y + maxRange;
	
		var list = [];
	
	
		for(var x = preColumn; x <= nextColumn; x++){
			for(var y = preRow; y <= nextRow; y++){
				var dx = Math.abs(x - target.x);
				var dy = Math.abs(y - target.y);
				var dd = dx * dx + dy * dy;
				if(dx + dy <= maxRange && (minRange === undefined || dx + dy > minRange)){
					var n = new PathFinder.Node(x, y);
					
					n.equal(target) || list.push(n);
				}
			}
		}
		return list;
	}
	
	MainApp.addEventListener(this, 'click', function(e){
		MainApp.renderRangeLayer(self.getRange(2), self.getRange(5, 3));
	});
};

extend(TiledObject, Sprite);


/**
 * A tiled object entities layer
 * @param {Vector} pos
 * @param {string} name
 * @param {int} width
 * @param {int} height
 * @constructor
 */
var TiledObjectLayer = function(pos, name, width, height){
	this.name = name;
	this.width = width;
	this.height = height;
	this.objects = [];
	this.objectsHashTable = {};

	this.canvas = window.document.createElement('canvas');

	this.canvas.setAttribute('width', width);
	this.canvas.setAttribute('height', height);
	this.context = this.canvas.getContext('2d');

	TiledObjectLayer.parentConstructor.call(this, pos, width, height);
	/**
	 * Add a TiledObject to this layer
	 * @param {TiledObject} obj
	 */
	this.add = function(obj){
		this.objects.push(obj);
		this.objectsHashTable[obj.name] = obj;
	};

	this.remove = function(obj){
		this.objects.splice(this.objects.indexof(obj), 1);
		delete this.objectsHashTable[obj.name];
	}

	this._draw = function(context){
		this.context.clearRect(0, 0, this.width, this.height);
		for(var i = 0, len = this.objects.length; i < len; i++){
			this.objects[i].draw(this.context);
		}

		context.drawImage(this.canvas, this.position.x, this.position.y);
	};
};

extend(TiledObjectLayer, EntityObject);

var TiledMap = function(tmxDoc, viewport){

	this.viewport = viewport;
	this.tiledLayers = [];
	this.tilesetMgr = new TilesetManager();
	this.mapInfo  = null;

	this.getMapInfo = function(){
		var mapDom = tmxDoc.getElementsByTagName('map')[0];

		var info = {};

		info.widthCount = parseInt(mapDom.getAttribute('width'));
		info.heightCount = parseInt(mapDom.getAttribute('height'));
		info.tileWidth = parseInt(mapDom.getAttribute('tilewidth'));
		info.tileHeight = parseInt(mapDom.getAttribute('tileheight'));
		info.width = info.widthCount * info.tileWidth;
		info.height = info.heightCount * info.tileHeight;
		this.mapInfo = info;
	}


	this.parseAllLayer = function(){
		var mapDom = tmxDoc.getElementsByTagName('map')[0];

		var children = mapDom.childNodes;
		for(var i = 0, len = children.length; i < len; i++){
			var node = children[i];

			if(node.nodeType === 3){
				continue;
			}

			switch(node.tagName.toLowerCase()){
				case TiledMap.OBJ_TYPE.TILESET: {
					var tileset = this.getTileset(node);
                    this.tilesetMgr.add(tileset);
					break;
				}

				case TiledMap.OBJ_TYPE.LAYER: {
                    var layer = this.getTiledLayer(node);
					this.tiledLayers.push(layer);
                    break;
				}

				case TiledMap.OBJ_TYPE.OBJECTGROUP: {
					var objectgroup = this.getObjectGroup(node);
					this.tiledLayers.push(objectgroup);
					break;
				}
			}
		}
	};

	this.getTileset = function(node){
		var parser = util.DOMParser(node);
		var img = parser.getElementsByTagName('image')[0];
        var imgParser = util.DOMParser(img);

        return new Tileset(parser.attr('name'),
			parser.intAttr('firstgid'),
			parser.intAttr('tilewidth'),
			parser.intAttr('tileheight'),
			imgParser.intAttr('width'),
			imgParser.intAttr('height'));
	};

    this.getTiledLayer = function(node){
        var parser = util.DOMParser(node);
        var data = parser.getFirstElement();
	    var tileArray = util.Base64.decodeAsArray(data.textContent.trim(), 4);
        var visible = parser.attr('visible');
		visible = visible === undefined ? true : (visible === '0' ? false : true);
	    if(parser.attr('name') === 'terrain'){
		    return new CursorPointerLayer(
			    this.position,
			    parser.attr('name'),
			    parser.intAttr('width'),
			    parser.intAttr('height'),
			    this.mapInfo.tileWidth,
			    this.mapInfo.tileHeight,
			    tileArray
		    );
	    }else if(parser.attr('name') === 'collision'){
			this.collisionLayer = new CollisionLayer(
				this.position, 
				parser.attr('name'), 
				parser.intAttr('width'), 
				parser.intAttr('height'), 
				this.mapInfo.tileWidth, 
				this.mapInfo.tileHeight, 
				tileArray, 
				this.tilesetMgr
			);
			
			return this.collisionLayer;
		}else{
            return new TiledLayer(
		        this.position,
	            parser.attr('name'),
	            parser.intAttr('width'),
	            parser.intAttr('height'),
	            this.mapInfo.tileWidth,
	            this.mapInfo.tileHeight,
	            tileArray,
	            this.tilesetMgr,
	            visible
            );
	    }
    };

	this.getObjectGroup = function(node){
		var parser = util.DOMParser(node);
		var objectGroup = new TiledObjectLayer(
			this.position,
			parser.attr('name'),
			this.mapInfo.width,
			this.mapInfo.height
		);
		var objects = parser.getElementsByTagName('object');

		for(var i = 0, len = objects.length; i < len; i++){
			var tiledObject = this.getTiledObject(objects[i]);
			objectGroup.add(tiledObject);
		}

		return objectGroup;
	};

	this.getTiledObject = function(node){
		var parser = util.DOMParser(node);
		var animType, image, split;


		var properties = parser.getElementsByTagName('property');
		for(var i = 0, len = properties.length; i < len; i++){
			var property = util.DOMParser(properties[i]);
			var name = property.attr('name');
			switch(name){
				case 'anim_type':{
					animType = Sprite.ANIM_TYPE[property.attr('value')];
					break;
				}

				case 'image': {
					image = MainApp.resourceLoader.get(property.attr('value'));
					break;
				}

				case 'split': {
					split = property.intAttr('value');
					break;
				}

			}
		}

		var tiledObject = new TiledObject(parser.attr('name'),
			new Vector(parser.intAttr('x'), parser.intAttr('y')),
			image,
			parser.intAttr('width'),
			parser.intAttr('height'),
			animType,
			split,
			~~(parser.intAttr('x') / this.mapInfo.tileWidth),
			~~(parser.intAttr('y') / this.mapInfo.tileHeight)
		);

		return tiledObject;
	}


	this.getMapInfo();

	TiledMap.parentConstructor.call(this, this.viewport.position, this.mapInfo.width, this.mapInfo.height);

	this.parseAllLayer();

	this.viewport.setRealX(this.mapInfo.width);
	this.viewport.setRealY(this.mapInfo.height);



	this._draw = function(context){
		for(var i = 0, len = this.tiledLayers.length; i < len; i++){
			var layer = this.tiledLayers[i];
			layer.draw(context);
			//context.drawImage(layer.canvas, this.position.x, this.position.y);
		}
	}
}


extend(TiledMap, EntityObject);
/**
 * TiledMap object types enum
 * @type {Enum}
 */
TiledMap.OBJ_TYPE = {
	TILESET: 'tileset',
	LAYER: 'layer',
	OBJECTGROUP: 'objectgroup'
}

window.TiledMap = TiledMap;

})(window);
/**
 *The Main App 
 */

(function(window, util){

//主程序
var MainApp = {
	startTime: null,
	nowTime: null,
	diffTime: null,
	canvasId: 'sence',
	canvas: 'sence',
	context: null,
	dContext: null,
	runStatus: true,
	viewport: null,
	
	
	init: function(config){
		for(var attr in config){
			this[attr] = config[attr];
		}
		this.canvas = util.g(this.canvasId);
		this.context = this.canvas.getContext('2d');
		this.viewport = new ViewPort(0, 0, this.canvas.width, this.canvas.height, this.canvas.width, this.canvas.height);
		this.canvasPos = util.getPosInDoc(this.canvas);
		
		this.initEvent();


		var dCanvas = window.document.createElement('canvas');
		dCanvas.setAttribute('width', 640);
		dCanvas.setAttribute('height', 480);
		this.dContext = dCanvas.getContext('2d');
	},
	/**
	 *可碰撞的对象
	 */
	collisionPool: (function(){
		var objectsIds = [];
		var objects = {};
		return {
			add: function(){},
			remove: function(obj){
				delete objects[obj.guid];
				for(var i = 0, len = objectsIds.length; i < len; i++){
					if(objectsIds[i] === obj.guid){
						this.objectsIds.splice(i, 1);
					}
				}
			},
			foreach: function(callback){
				for(var i = 0, len = objectsIds.length; i < len; i++){
					callback.call(objects[objectsIds[i]], index);
				}
			}
		};
	})(),
	
	
	INPUT: {
		KEY: {
			UP: 38,
			DOWN: 40,
			LEFT: 37,
			RIGHT: 39
		},
		
		KEY_LOCK: {
			UP: false,
			DOWN: false,
			LEFT: false,
			RIGHT: false
		}
	},
	
	eventsPool: {
		keydown: [],
		keyup: [],
		click: [],
		keypress: [],
		mousemove: [],
		mouseover: [],
		mouseout: [],
		collide: [],
		hit: []
	},
	
	emptyEventsPool: function(){
		this.eventsPool = {
			keydown: [],
			keyup: [],
			click: [],
			keypress: [],
			mousemove: [],
			mouseover: [],
			mouseout: [],
			collide: [],
			hit: []
		}
	},

	events: {
		mouse: {relX: -1, relY: -1}
	},
	
	addEventListener: function(target, eventType, callback){
		var event = {
			target: target, 
			callback: callback,
			init: false
		};	
		
		if(eventType == 'mouseover' || eventType == 'mouseout'){
			event.target.mouseover = false;
		}
		
		this.eventsPool[eventType].push(event);
	},
	
	initEvent: function(){
		var self = this;
		var KEY = this.INPUT.KEY;
		var LOCK = this.INPUT.KEY_LOCK;
		var document = window.document;
		document.onkeydown = function(e){
			switch(e.which){
				case KEY.UP:
					!LOCK.UP || (LOCK.UP = true);
					break;
				case KEY.DOWN:
					!LOCK.DOWN || (LOCK.DOWN = true);
					break;
				case KEY.LEFT:
					!LOCK.LEFT || (LOCK.LEFT = true);
					break;
				case KEY.RIGHT:
					!LOCK.RIGHT || (LOCK.RIGHT = true);
					break;
			}
		
			for(var i = 0, len = MainApp.eventsPool.keydown.length; i < len; i++){
				var event = MainApp.eventsPool.keydown[i];
				event.callback.call(event.target, e);
			}
		};
	
		document.onkeyup = function(e){
			switch(e.which){
				case KEY.UP:
					LOCK.UP || (LOCK.UP = false);
					break;
				case KEY.DOWN:
					LOCK.DOWN || (LOCK.DOWN = false);
					break;
				case KEY.LEFT:
					LOCK.LEFT || (LOCK.LEFT = false);
					break;
				case KEY.RIGHT:
					LOCK.RIGHT || (LOCK.RIGHT = false);
					break;
			}
			for(var i = 0, len = MainApp.eventsPool.keyup.length; i < len; i++){
				var event = MainApp.eventsPool.keyup[i];
				event.callback.call(event.target, e);
			}
		};
		
		
		document.onclick = function(e){
			var scroll = util.getScroll();
			e.relX = e.clientX - self.canvasPos.left + scroll.left;
			e.relY = e.clientY - self.canvasPos.top + scroll.top;
			var mPos = new Vector(e.relX, e.relY);
			mPos.remove(self.viewport.position);
			for(var i = 0, len = MainApp.eventsPool.click.length; i < len; i++){
				var event = MainApp.eventsPool.click[i];
				if(event.target.checkContain(mPos)){
					event.callback.call(event.target, e);
				}
			}
		};
		
		this.canvas.addEventListener('mousemove', function(e){
			var scroll = util.getScroll();
			e.relX = e.clientX - self.canvasPos.left + scroll.left;
			e.relY = e.clientY - self.canvasPos.top + scroll.top;
			MainApp.events.mouse.relX = e.relX;
			MainApp.events.mouse.relY = e.relY;
			var mPos = new Vector(e.relX, e.relY);

			for(var i = 0, len = MainApp.eventsPool.mousemove.length; i < len; i++){
				var event = MainApp.eventsPool.mousemove[i];
				if(!event.target.visual){
					continue;
				}
				var status = event.target.checkContain(mPos);
				if(status){
					event.callback.call(event.target, e);
				}
			}
			
			for(var i = 0, len = MainApp.eventsPool.mouseover.length; i < len; i++){
				var event = MainApp.eventsPool.mouseover[i];
				if(!event.target.visual){
					continue;
				}
				var status = event.target.checkContain(mPos);
				
				if(event.target.mouseStatus === undefined){
					event.target.mouseStatus = status;
					
					status && event.callback.call(event.target, e);
				}else{
					if(!event.target.mouseStatus){
						status && event.callback.call(event.target, e);
						event.target.mouseStatus = status;
					}
				}
			}
			
			for(var i = 0, len = MainApp.eventsPool.mouseout.length; i < len; i++){
				var event = MainApp.eventsPool.mouseout[i];
				if(!event.target.visual){
					continue;
				}
				var status = event.target.checkContain(mPos);
				
				if(event.target.mouseStatus === undefined){
					event.target.mouseStatus = status;
					if(!status){
						event.callback.call(event.target, e);
					}
					
				}else{
					if(event.target.mouseStatus){
						status || event.callback.call(event.target, e);
						event.target.mouseStatus = status;
					}
				}
			}
			
		}, false);
	},
	
	checkHit: function(target){
		for(var i = 0, len = MainApp.eventsPool.hit.length; i < len; i++){
			var event = MainApp.eventsPool.hit[i];
			if(event.target.guid === target.guid){
				continue;
			}
			
			if(event.target.checkHit(target)){
				event.callback.call(event.target, {relatedTarget: target});
			}
		}
	},
	
	startRun: function(){
		this.startTime = new Date().getTime();
		var self = this;
		window.requestAnimFrame(function(){
			self.renderFrame();
		});
	},
	
	stopRun: function(){
		this.runStatus = false;
	},
	
	renderFrame: function(){
		var self = this;
		this.nowTime = new Date().getTime();
		this.context.clearRect(0, 0, 640, 480);
		this.diffTime = this.nowTime - this.startTime;
		ScreenObjPool.foreach(this.context);
		
		this.startTime = this.nowTime;
		
		if(self.runStatus)
			window.requestAnimFrame(function(){
				self.renderFrame();
			});
	},
	
	renderRangeLayer: function(nodes, attacks){
		if(this.rangelayer){
			this.rangelayer.empty();
		}else{
			this.rangelayer = new CommonLayer(this.viewport);
			MainApp.ScreenObjPool.add(this.rangelayer);
		}
		
		for(var i = 0, len = nodes.length; i < len; i++){
			var n = nodes[i];
			var o = new EntityObject(new Vector(n.x * 32, n.y * 32), 32, 32, {fill: 'rgba(255, 0, 0, .5)'});
			this.rangelayer.add(o);
		}
		
		for(var i = 0, len = attacks.length; i < len; i++){
			var n = attacks[i];
			var o = new EntityObject(new Vector(n.x * 32, n.y * 32), 32, 32, {fill: 'rgba(0, 0, 0, .5)'});
			this.rangelayer.add(o);
		}
	}


};

window.MainApp = MainApp;

//资源载入器
var resourceLoader = {
	totalCount: 0,
	loadedCount: 0,
	resources: {},
	get: function(name){
		if(this.resources[name] !== undefined){
			return this.resources[name];
		}else{
			console.log('Error on get resource: ' + name);
			return false;
		}
	},
	load: function(resources){
		this.totalCount = resources.length;
		var self = this;
		for(var i = 0, len = resources.length; i < len; i++){
			switch(resources[i].type){
				case 'image':{
					this.loadImage(resources[i]);
					break;
				}

				case 'tmx':{
					this.loadXML(resources[i]);
					break;
				}

				case 'audio':{
					break;
				}
			}
		};
	},

	loadImage: function(resource){
		var self = this;
		var img = new Image();
		img.dataName =resource.name;
		img.onload = function(){
			++self.loadedCount;
			self.onProgress({loadedCount: self.loadedCount, totalCount: self.totalCount});
			self.resources[this.dataName] = this;
			if(self.totalCount === self.loadedCount){
				self.onComplete();
			}
		};
		
		img.onerror = function(){
			console.log('Error on: ' + this.dataName);
		};
		
		img.src = resource.src;
	},
	
	loadXML: function(resource){
		var self = this;
		
		var request = new util.Request({
			url: resource.src,
			dataType: 'xml',
			success: function(rep, statusText, xhr){
				++self.loadedCount;
				self.resources[this.dataName] = rep;
				self.onProgress({loadedCount: self.loadedCount, totalCount: self.totalCount});

				if(self.totalCount === self.loadedCount){
					self.onComplete();
				}
			},
			error: function(statusText){
				console.log('Error on: ' + statusText);
			}
		});
		request.dataName = resource.name;


		request.send();
	},

	loadAudio: function(){

	},

	onProgress: function(){},
	
	onComplete: function(){}
};
MainApp.resourceLoader = resourceLoader;

})(window, window.util);
/**
 *The Screen Objects Pool 
 */
this.MainApp = MainApp || {};
(function(win, mainApp){
	
var ScreenObjPool = {
	startTime: null,
	objects: {},
	objectsIds: [],
	add: function(entityObj){
		var objects = this.objects, objectsIds = this.objectsIds;
		if(!this.objects[entityObj.guid]){
			entityObj.visual = true;
			this.objects[entityObj.guid] = entityObj;
			this.objectsIds.push(entityObj.guid);
		}
	},
	remove: function(entityObj){
		entityObj.visual =false;
		var objects = this.objects, objectsIds = this.objectsIds;
		delete this.objects[entityObj.guid];
		for(var i = 0, len = objectsIds.length; i < len; i++){
			if(this.objectsIds[i] === entityObj.guid){
				this.objectsIds.splice(i, 1);
			}
		}
	},
	
	empty: function(){
		this.objects = {};
		this.objectsIds = [];
	},
	
	foreach: function(context){
		var objects = this.objects, objectsIds = this.objectsIds;
		for(var i = 0, len = objectsIds.length; i < len; i++){
			var o = objects[objectsIds[i]];
			o.draw(context);
			
			if(o.hitable){
				MainApp.checkHit(o);
			}
		}
	},
	
	init: function(context){
		this.context = context;
		this.runStatus = true;
		MainApp.startTime = new Date().getTime();
		if(win.requestAnimFrame){
			this.renderFrame = this.rafRenderFrame;
			var self = this;
			window.requestAnimFrame(function(){
				self.renderFrame();
			});
		}else{
			this.renderFrame = this.intervalRenderFrame;
			setInterval(function(){
				this.timer = self.renderFrame();
			}, 1000 / 60);
		}
	},
	
	renderFrame: function(){
	},
	
	rafRenderFrame: function(){
		var self = this;
		MainApp.nowTime = new Date().getTime();
		this.context.clearRect(0, 0, 640, 480);
		MainApp.diffTime = MainApp.nowTime - MainApp.startTime;
		ScreenObjPool.foreach(this.context);
		
		MainApp.startTime = MainApp.nowTime;
		
		if(self.runStatus){
			window.requestAnimFrame(function(){
				self.renderFrame();
			});
		}
	},
	
	intervalRenderFrame: function(){
		var self = this;
		MainApp.nowTime = new Date().getTime();
		this.context.clearRect(0, 0, 640, 480);
		MainApp.diffTime = MainApp.nowTime - MainApp.startTime;
		ScreenObjPool.foreach(this.context);
		
		MainApp.startTime = MainApp.nowTime;
	},
	
	stop: function(){
		this.runStatus = false;
		this.timer && clearInterval(this.timer);
	}
};

MainApp.ScreenObjPool = ScreenObjPool;

})(window, MainApp);
