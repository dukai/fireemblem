(function(win, util){
/**
* Ajax Module
*/

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

})(window, util);