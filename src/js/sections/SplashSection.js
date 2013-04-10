define([
        'config',
        'jquery',
        './AbstractSection',
        'hbs!templates/sections/splash',
        'inputController',
        'sectionController',
        'effects/Cloth',
        'mout/function/bind',
        'stageReference'
    ], function(config, $, AbstractSection, template, inputController, sectionController, Cloth, bind, stageReference){

        var undef;

        function SplashSection(){
            _super.constructor.call(this, 'splash', template);

            this.init();
            this._initVariables();
            this._initEvents();

        }

        var _super = AbstractSection.prototype;
        var _p = SplashSection.prototype = new AbstractSection();
        _p.constructor = SplashSection;

        var _transform3DStyle = config.transform3DStyle;
        var _filterStyle = config.filterStyle;
        var _renderToggle = 0;

        function _initVariables(){
            this.containerStyle = this.container[0].style;
            this.cloth = new Cloth({}); // hehe
            this.boundRender = bind(_render, this);
        }

        function _initEvents(){
            inputController.add(this.container, 'down', bind(_onDown, this));
            inputController.add(this.container, 'click', bind(_onClick, this));
            stageReference.onResize.add(_onResize, this);
            this._onResize();
        }

        function _onClick(e){
            sectionController.goTo('home');
        }

        function _onDown(e){
            if(this.isDown || sectionController.isAnimating()) return; // ignore multitouch
            e.preventDefault();
            var params = this.cloth.params;
            EKTweener.killTweensOf(params);
            params.downX =  params.toX = e.x / this.width;
            params.downY = params.toY = e.y / this.height;
            params.vX = 0;
            params.vY = 0;
            this.isDown = true;
            sectionController.appearTarget('home');
        }

        function _onMove(e){
            if(!this.isDown || sectionController.isAnimating()) return;
            e.preventDefault();
            this.needRender = true;

            var params = this.cloth.params;
            params.toX = e.x / this.width;
            params.toY = e.y / this.height;
            var dx = params.toX - params.downX;
            var dy = params.toY - params.downY;

            //sectionController.goTo('home');
            //this.isDown = false;
        }

        function _onUp(e){
            if(!this.isDown || sectionController.isAnimating()) return;
            this.isDown = false;
            if(e.distanceY < -100) {
                sectionController.goTo('home');
            } else {
                var params = this.cloth.params;
                EKTweener.to(params, .5, {toX: params.downX, toY: 1, downY: 1, ease: 'easeOutElastic'});
            }
        }

        function _render(){
            if(this.needRender) {
                this.cloth.render();
                if((sectionController.isAnimating() && (_renderToggle ^= 1)) || !sectionController.isAnimating()) {
                    this.containerStyle[_filterStyle] = this.cloth.getStyle();
                } else {
                    this.containerStyle[_transform3DStyle] = 'translate3d(0,-' + (this.cloth.params.translateY / 2) + 'px,0)';
                }
            }
        }

        function _reset(){
            this.isDown = false;
            this.needRender = false;
        }

        function _onResize(){
            this.width = stageReference.stageWidth;
            this.height = stageReference.stageHeight;
        }

        function show(currentNodes, previousSection, previousNodes){
            this.container.removeClass('show');
            this.container.show();
            stageReference.onRender.add(_render, this);
            inputController.onMove.add(_onMove, this);
            inputController.onUp.add(_onUp, this);
            if(!previousSection || previousNodes.length < 0) {
                setTimeout(bind(_setShown, this));
            } else {
                var params = this.cloth.params;
                params.toY = 0;
                params.downY = 1;
                params.translateY = -stageReference.stageHeight / 4;
                this.needRender = true;
                this._renderToggle = 0;
                this._render();
                EKTweener.to(params, .8, {toY: 1, translateY: 0, onComplete: bind(_setShown, this)});
            }
        }

        function _setShown(){
            this.container.addClass('show');
            this.needRender = false;
            _super._setShown.call(this);
        }

        function hide(currentSection, currentNodes){
            var self = this;
            inputController.onMove.remove(_onMove, this);
            inputController.onUp.remove(_onUp, this);
            var params = this.cloth.params;
            this.needRender = true;
            EKTweener.to(params, .4, {toY: 0, downY: 1, translateY: -stageReference.stageHeight / 4, onComplete: function(){
                stageReference.onRender.remove(_render, self);
                this.needRender = false;
                self._setHidden();
            }});
        }



        _p._initVariables = _initVariables;
        _p._initEvents = _initEvents;
        _p._onResize = _onResize;
        _p._render = _render;
        _p.show = show;
        _p._setShown = _setShown;
        _p.hide = hide;
        _p._reset = _reset;


        return SplashSection;
    }
)
