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
            if(this.isDown) return; // ignore multitouch
            var params = this.cloth.params;
            params.downX = params.midX = params.tMidX = params.toX = e.x / this.width;
            params.downY = params.midY = params.tMidY = params.toX = e.y / this.height;
            this.isDown = true;
        }

        function _onMove(e){
            if(!this.isDown || !inputController.isScrollV) return;
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
            if(!this.isDown) return;
            this.isDown = false;
        }

        function _render(){
            if(this.needRender) {
                this.cloth.render();
                this.containerStyle[_filterStyle] = this.cloth.getStyle();
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
                EKTweener.fromTo(this.container, .8, {transform3d: 'translate3d(0,-' + stageReference.stageHeight + 'px,0)'}, {transform3d: 'translate3d(0,0%,0)', onComplete: bind(_setShown, this)});
            }
        }

        function _setShown(){
            this.container.addClass('show');
            _super._setShown.call(this);
        }

        function hide(currentSection, currentNodes){
            var self = this;
            stageReference.onRender.remove(_render, this);
            inputController.onMove.remove(_onMove, this);
            inputController.onUp.remove(_onUp, this);
            EKTweener.to(this.container, .8, {transform3d: 'translate3d(0,-' + stageReference.stageHeight + 'px,0)', onComplete: function(){
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
