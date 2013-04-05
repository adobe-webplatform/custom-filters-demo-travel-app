define([
        'exports',
        '../browser/getStyle'
    ],
    function(imageLoader, getStyle){

        imageLoader.VERSION = '0.0.1';

        imageLoader.isLoading = false;

        // added images.
        imageLoader._added = {};

        // added images.
        imageLoader._loaded = {};

        imageLoader._imageWidths = {};
        imageLoader._imageHeights = {};

        imageLoader._sum = 0;
        imageLoader._weight = 0;
        imageLoader._onLoading = null;

        var _added = imageLoader._added;
        var _loaded = imageLoader._loaded;
        var _imageWidths = imageLoader._imageWidths;
        var _imageHeights = imageLoader._imageHeights;
        var _loadList = [];

        var _bufferList;

        /**
         * [preload description]
         * @param  {[String, DomElement, Array of Strings or Array of DomElements]} target [description]
         */
        function add(target) {
            var len = target.length;
            if(len && typeof target !== "string") {
                var i = -1;
                while(++i < len) _addSingle(target[i]);
            } else {
                _addSingle(target);
            }
        }

        function _addSingle(item) {
            if(item.nodeType && item.style) {
                _addDom(item);
            } else {
                _addURL(item);
            }
        }

        function _addDom(dom) {
            _bufferList = [];
            if(dom.nodeName.toLowerCase() == 'img' && _isImageURL(dom.src)) {
                _bufferList.push(dom.src);
            }
            getStyle(dom).getPropertyValue('background-image').replace(/s?url\(\s*?[\'\"]?(.*?)[\'\"]?\s*?\)/g, addBackgroundUrl);
            var i = -1;
            var len = _bufferList.length;
            while(++i < len){
                _addURL(_bufferList[i]);
            }
        }

        function addBackgroundUrl(str, url) {
            if(_isImageURL(url)) {
                _bufferList.push(url);
            }
        }


        function _isImageURL(url) {
            return url.indexOf('data:') !== 0;
        }

        function _addURL(url) {
            if(!_added[url]) {
                _added[url] = true;
                _loadList.push(url);
                imageLoader._weight++;
            }
        }

        function start(onLoading){
            if(!imageLoader.isLoading) {
                var url, img;
                imageLoader._onLoading = onLoading;
                imageLoader.isLoading = true;
                while (_loadList[0]) {
                    url = _loadList.shift();
                    loadSingleImage(url, _onImageLoaded);
                }
            }
        }

        function loadSingleImage(url, callback) {
            if(!_added[url]) {
                _added[url] = true;
            }
            if(_loaded[url]) {
                callback.call(_loaded[url]);
                return;
            }
            var img = new Image();
            // inject the __url__ in case some browser will convert the src url into absolute url 
            img.src = img.__url__ = url;
            if(img.width) {
                _onSingleImageLoaded.call(img, callback);
            }else {
                img.onload = function(){
                    _onSingleImageLoaded.call(img, callback);
                };
            }
        }

        function _onSingleImageLoaded(callback){
            var url = this.__url__;
            if(!_loaded[url]) {
                _loaded[url] = this;
                _imageWidths[url] = this.width;
                _imageHeights[url] = this.height;
            }
            callback.call(this);
        }

        function _onImageLoaded(){
            var url = this.__url__;
            imageLoader._sum ++;
            var percent = imageLoader._sum / imageLoader._weight;

            if(percent == 1) {
                imageLoader.isLoading = false;
                imageLoader._sum = 0;
                imageLoader._weight = 0;
            }
            if(imageLoader._onLoading) imageLoader._onLoading( percent, url );
        }

        imageLoader.add = add;
        imageLoader.start = start;
        imageLoader.loadSingleImage = loadSingleImage;

    }

);
