define([
        'config',
        'jquery',
        './AbstractSection',
        'hbs!templates/sections/overview',
        'sectionController',
        'locationController',
        'inputController',
        'edankwan/loader/imageLoader',
        'mout/function/bind',
        'stageReference'
    ], function(config, $, AbstractSection, template, sectionController, locationController, inputController, imageLoader, bind, stageReference){

        function OverviewSection(){
            _super.constructor.call(this, 'overview', template);
            this.bgs = {};
            this.init();
            this._initVariables();
            this._initEvents();
        }

        var _super = AbstractSection.prototype;
        var _p = OverviewSection.prototype = new AbstractSection();
        _p.constructor = OverviewSection;

        function _initVariables(){
            this.wrapper = this.container.find('.overview-wrapper');
            this.title = this.wrapper.find('.title');
            this.description = this.wrapper.find('.description');
            this.bottom = this.container.find('.overview-bottom');
            this.line = this.bottom.find('.line');
            this.likeBtn = this.bottom.find('.favorites');
            this.likeCount = this.likeBtn.find('.count');
            this.scheduleBtn = this.bottom.find('.schedule');

            this.bgContainers = this.container.find('.bg-container');
            this.currentBg = this.bgContainers.filter('.current');
            this.previousBg = this.bgContainers.filter('.previous');

            this.spinnerContainer = this.container.find('.spinner-container');
        }

        function _initEvents(){
            //this.wrapper[0].addEventListener(config.transitionStyle + 'End', )
        }

        function _showSpinner(){
            this.spinnerContainer.addClass('show');
        }

        function _hideSpinner(){
            this.spinnerContainer.removeClass('show');
        }

        function appear(nodes, opts){
            this.currentLocationList = nodes[1] === 'search' ? locationController.locationList : locationController.getMatched(nodes[1], nodes[2]);
            this.locationId = nodes[nodes.length - 1];
            this.location = locationController.locations[this.locationId];

            var self = this;
            var url = this.currentImageUrl = this.location.image;
            this.container.show();

            if(imageLoader._loaded[this.location.image]) {
                this._onImageReady();
            } else {
                this._showSpinner();
                if(imageLoader._added[this.location.image]) return;
                imageLoader.loadSingleImage(url, function(){
                    if(this.__url__ != self.currentImageUrl) return;
                    self._onImageReady();
                });
            }
        }

        function _onImageReady(){
            var self = this;
            this._hideSpinner();
            if(this.useAnimation){
                this.previousBg.css('backgroundImage', this.currentBg.css('backgroundImage'));
                this.previousBg.addClass('hide');
                this.currentBg.css('backgroundImage', 'url(' + this.location.image + ')');
                this.wrapper.addClass('hide');
                this.bottom.addClass('hide');
                // TODO - will use transitionEnd event instead
                setTimeout(function(){
                    self.wrapper.removeClass('appear hide');
                    self.bottom.removeClass('appear hide');
                }, 499);
                setTimeout(function(){
                    self._updateLocation();
                }, 500);
            } else {
                if(this._isShow){
                    this.wrapper.removeClass('appear hide');
                    this.bottom.removeClass('appear hide');
                    setTimeout(function(){
                        self._updateLocation();
                    });
                }
                this.currentBg.css('backgroundImage', 'url(' + this.location.image + ')');
            }
        }

        function _updateLocation() {
            var self = this;
            var location = this.location;
            this.title.html(location.name);
            this.description.html(location.description);
            this.likeCount.html(location.like);
            this.wrapper.addClass('appear');
            this.bottom.addClass('appear');
            setTimeout(function(){
                self.wrapper.addClass('show');
                self.bottom.addClass('show');
                setTimeout(function(){
                    self._setShown();
                }, 500);
            });
        }

        function _reset(){
            this.title.html('');
            this.description.html('');
            this.currentBg.css('backgroundImage', 'none');
            this.previousBg.css('backgroundImage', 'none');
            this.wrapper.removeClass('display show hide');
            this.bottom.removeClass('display show hide');
            this._hideSpinner();
            this.useAnimation = false;
            this._isShow = false;
        }

        function disappear(){
            if(sectionController.currentSection !== this) {
                this.container.hide();
                this._reset();
            }
        }

        function show(currentNodes, previousSection, previousNodes){
            if(!sectionController.isFirstRoute && this == previousSection) {
                this.useAnimation = true;
            }
            this._isShow = true;
            this.appear.apply(this, [currentNodes]);
        }

        function hide(currentSection, currentNodes){
            this._setHidden();
        }

        _p._initVariables = _initVariables;
        _p._initEvents = _initEvents;
        _p._updateLocation = _updateLocation;
        _p._onImageReady = _onImageReady;
        _p._reset = _reset;
        _p.show = show;
        _p.hide = hide;
        _p.appear = appear;
        _p.disappear = disappear;

        _p._showSpinner = _showSpinner;
        _p._hideSpinner = _hideSpinner;

        return OverviewSection;
    }
)
