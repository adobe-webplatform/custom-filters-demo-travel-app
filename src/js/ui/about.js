define(
    [
        'exports',
        'config',
        'jquery',
        'hbs!templates/ui/about',
        'inputController',
        'uiController',
        'effects/Roll',
        'stageReference',
        'EKTweener'
    ],

    function(about, config, $, template, inputController, uiController, Roll, stageReference, EKTweener) {

        var _container;
        var _containerStyle;
        var _homeIcon;
        var _tabs;
        var _currentNodes = [];

        var _roll;
        var _isRendering = false;

        var _transform3DStyle = config.transform3DStyle;
        var _filterStyle = config.filterStyle;

        function init(){
            _container = $(template(config.data.about));
            _containerStyle = _container[0].style;
            $('#app').append(_container);
            _roll = new Roll({});

            uiController.onAboutShow.add(show);
            uiController.onAboutHide.add(hide);
        }

        function _render(){
            _containerStyle[_filterStyle] = _roll.getStyle();
        }

        function _updateShaderHeader(){
            var minSeg = 3;
            var screenRatio = stageReference.stageWidth / stageReference.stageHeight;
            var maxSeg = Math.ceil( screenRatio > 1 ?  minSeg * screenRatio : minSeg / screenRatio);
            _roll.updateHeader({segX: screenRatio > 1 ? maxSeg : minSeg, segY: screenRatio > 1 ? minSeg : maxSeg});
        }

        function show() {
            _updateShaderHeader();
            if(!_isRendering) stageReference.onRender.add(_render);
            _container.show();
            _isRendering = true;
            EKTweener.fromTo(_roll.params, 1.2, {t: 0}, {t: 1, onComplete: function(){
                _isRendering = false;
                stageReference.onRender.remove(_render);
            }, ease: 'easeOutSine'});
        }

        function hide() {
            _updateShaderHeader();
            if(!_isRendering) stageReference.onRender.add(_render);
            _isRendering = true;
            EKTweener.to(_roll.params, 1.2, {t: 0, onComplete: function(){
                _isRendering = false;
                stageReference.onRender.remove(_render);
                _container.hide();
                uiController.onTaskKilled();
            }, ease: 'easeOutSine'});
        }

        about.init = init;
        about.show = show;
        about.hide = hide;

        return about;

    }

);
