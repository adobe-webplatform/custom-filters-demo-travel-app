/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Adobe System Incorporated
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
 define([
        'config',
        'jquery',
        './AbstractSection',
        'hbs!templates/sections/overview',
        'sectionController',
        'locationController',
        'scheduleController',
        'inputController',
        'edankwan/loader/imageLoader',
        'mout/function/bind',
        'stageReference',
        'helpers/tweenHelper'
    ], function(config, $, AbstractSection, template, sectionController, locationController, scheduleController, inputController, imageLoader, bind, stageReference, tweenHelper){

        function OverviewSection(){
            _super.constructor.call(this, 'overview', template);

            this.init();
            this._initVariables();
            this._initEvents();

            var images = this.images = this.data.images;
            //preload all images
            for(var mood in images) {
                imageLoader.add(images[mood]);
            }
        }

        var _super = AbstractSection.prototype;
        var _p = OverviewSection.prototype = new AbstractSection();
        _p.constructor = OverviewSection;

        var _transform3DStyle = config.transform3DStyle;

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
            inputController.add(this.scheduleBtn, 'click', bind(_onScheduleClick, this));
            inputController.add(this.likeBtn, 'click', bind(_onLikeClick, this));
            inputController.add(this.container, 'up', bind(_onUp, this));
        }

        function _onUp(e){
            if(inputController.isScrollH) {
                var index = this.locationIndex;
                var locationList = this.currentLocationList;
                if(e.distanceX > 50) {
                    sectionController.goTo(this.urlPrefix + locationList[ index > 0 ? index - 1 : locationList.length - 1].id);
                } else if(e.distanceX < -50) {
                    sectionController.goTo(this.urlPrefix + locationList[index < locationList.length - 1 ? index + 1 : 0].id);
                }
            }
        }

        function _onScheduleClick(){
            scheduleController.showPrompt(this.locationId);
        }

        function _onLikeClick(){
            if(!this.location.liked) {
                var self = this;
                this.location.like++;
                this.likeCount.html(this.location.like);
                this.location.liked = true;
                tweenHelper.addDom(this.likeBtn[0], {}).to({}, 300).easing( tweenHelper.Easing.Back.Out).onUpdate(function(t){
                    var scale = 1.4 - Math.abs(t * 2 - 1) * .4;
                    self.likeCount[0].style[_transform3DStyle] = 'scale3d(' + scale + ',' + scale + ',1)';
                }).start();
            }
        }

        function _showSpinner(){
            this.spinnerContainer.addClass('show');
        }

        function _hideSpinner(){
            this.spinnerContainer.removeClass('show');
        }

        function appear(nodes, opts){
            this.currentLocationList = nodes[1] == 'search' || nodes[1] == 'schedule' ? locationController.locationList : locationController.getMatched(nodes[1], nodes[2]);
            this.locationId = nodes[nodes.length - 1];
            this.location = locationController.locations[this.locationId];

            var self = this;
            var url = this.currentImageUrl = this.location.image;
            this.container.show();

            if(this.useAnimation){
                this.previousBg.css({
                    backgroundImage: this.currentBg.css('backgroundImage'),
                    backgroundColor: this.currentBg.css('backgroundColor')
                });
                this.currentBg.css({
                    backgroundImage: 'url(' + this.images[this.location.mood] + ')',
                    backgroundColor: this.location.bgColor
                }).removeClass('show');
                setTimeout(function(){
                    self.currentBg.addClass('show');
                });
                this.wrapper.removeClass('show').addClass('hide');
                this.bottom.removeClass('show').addClass('hide');
                setTimeout(function(){
                    self.wrapper.removeClass('appear hide');
                    self.bottom.removeClass('appear hide');
                    setTimeout(bind(_updateLocation, self));
                }, 499);
            } else {
                if(this._isShow){
                    this.wrapper.removeClass('appear hide');
                    this.bottom.removeClass('appear hide');
                    setTimeout(function(){
                        self._updateLocation();
                    }, 800);
                }
                this.currentBg.css({
                    backgroundImage: 'url(' + this.images[this.location.mood] + ')',
                    backgroundColor: this.location.bgColor
                }).addClass('show');
            }

        }


        function _updateLocation() {
            var self = this;
            var location = this.location;
            var locationId = this.locationId;
            var locationList = this.currentLocationList;
            var i = locationList.length;
            this.urlPrefix = sectionController.currentNodes.slice(0, sectionController.currentNodes.length - 1).join('/') +'/';
            while(i--) if(locationList[i].id === locationId) break;
            this.locationIndex = i;

            this.title.html(location.name).css('color', location.color);
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
            var self = this;
            if(!sectionController.isFirstRoute && this == previousSection) {
                this.useAnimation = true;
            }
            this._isShow = true;
            self.appear.apply(self, [currentNodes]);
        }

        function hide(currentSection, currentNodes){
            this._setHidden();
        }

        _p._initVariables = _initVariables;
        _p._initEvents = _initEvents;
        _p._updateLocation = _updateLocation;
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
