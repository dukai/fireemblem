/**
 * The Util module for framework 
 */
this.util = this.util || {};
(function(win, util){
	var document = win.document;
	var random = function(min, max){
		return (~~(Math.random() * (max - min + 1)) + min);
	};
	util.random = random;
	
	var randomColor = function(){
		var red = this.random(0, 255);
		var green = this.random(0, 255);
		var blue = this.random(0, 255);
		return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
	};
	util.randomColor = randomColor;
		
	var g = function(){
		return document.getElementById(arguments[0]);
	};
	util.g = g;
		
	var getScroll = function() {
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
	}
	util.getScroll = getScroll;
		
	var getPosInDoc = function(target) {
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
	};
	util.getPosInDoc = getPosInDoc;

	var loadXMLDoc = function(docName){
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
	};
	util.loadXMLDoc = loadXMLDoc;

	var parseXMLString = function(text){
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
	};
	util.parseXMLString = parseXMLString;

	var getTextWidth = function(text, styles, context){
		for(var attr in styles){
			context[attr] = styles[attr];
		}

		return context.measureText(text).width;
	};
	util.getTextWidth = getTextWidth;

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
	/**
	 * A canvas and context creator 
	 * @param {int} width
	 * @param {int} height
	 * @return {object} {canvas: canvas, context: context}
	 */
	var createCanvas = function(width, height){
		var canvas = document.createElement("canvas");
		width !== undefined ? canvas.setAttribute('width', width) : null;
		height !== undefined ? canvas.setAttribute('height', height) : null;
		var context = canvas.getContext('2d');
		
		return {canvas: canvas, context: context};
	}
	util.createCanvas = createCanvas;
	
})(window, util);