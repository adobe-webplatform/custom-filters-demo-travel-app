define(
    [
        'exports',
        'config',
        'jquery',
        'ui/preloader',
        'edankwan/loader/imageLoader',
        'stageReference'
    ],

    function(preloaderController, config, $, preloader, imageLoader, stageReference) {

        var _container;

        var _callback;
        var _tweenObj = {percent: 0};

        var _transform3DStyle = config.transform3DStyle;

        function init(){
            preloader.init();
        }

        function add(target){
            if(target.jquery) {
                target = target.add(target.find('*'));
            }
            imageLoader.add(target);
        }

        function getImageSize(url){
            return {width: imageLoader._imageWidths[url], height: imageLoader._imageHeights[url]};
        }

        function start(callback) {
            preloader.show( function(){
                imageLoader.start(preloader.onLoading);
            }, callback );
        }

        function _onLoaded(){
            preloader.hide();
        }

        preloaderController.init = init;
        preloaderController.start = start;
        preloaderController.add = add;
        preloaderController.getImageSize = getImageSize;

        return preloaderController;

    }

);
