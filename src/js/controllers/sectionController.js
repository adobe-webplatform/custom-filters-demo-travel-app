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
 define(
    [
        'exports',
        'config',
        'jquery',
        'hasher',

        'uiController',

        'sections/SplashSection',
        'sections/HomeSection',
        'sections/MoodSection',
        'sections/ScheduleSection',
        'sections/LocationListSection',
        'sections/OverviewSection',

        'stageReference',
        'mout/array/map',
        'mout/function/bind'
    ],

    function(sectionController, config, $, hasher, uiController, SplashSection, HomeSection, MoodSection, ScheduleSection, LocationListSection, OverviewSection, stageReference, map, bind) {

        sectionController.currentSection = null;
        sectionController.previousSection = null;
        sectionController.currentNodes = [];
        sectionController.previousNodes = [];
        sectionController.currentDepth = -1;
        sectionController.previousDepth = 0;
        sectionController.isFirstRoute = true;

        sectionController.isWaitingForUIResponse = false;

        sectionController.sections = {};
        sectionController.sectionList = [];
        sectionController.DEFAULT_PATH = '';

        sectionController.appearedSection  = null;

        var _pathStack = [];

        var _nextParsedPath = null;
        var _latestPath = null;
        var _oldPath = null;

        var _isHidden = true;
        var _isShown = true;

        var _transform3DStyle = config.transform3DStyle;
        var SECTION_CLASSES = [SplashSection, HomeSection, MoodSection, ScheduleSection, LocationListSection, OverviewSection];


        function preInit(){
            // Pre-initialize the sections
            var i, len, section;
            var sections = sectionController.sections;
            var sectionList = sectionController.sectionList;
            for(i = 0, len = SECTION_CLASSES.length; i < len; i++) {
                section = new SECTION_CLASSES[i]();
                sections[section.id] = sectionList[i] = section;
            }
        }

        function setShown(){
            _isShown = true;
            _tryParsingNextPath();
        }

        function setHidden(){
            _isHidden = true;
            _tryParsingNextPath();
        }

        function _tryParsingNextPath(){
            if(!isAnimating()) {
                if(sectionController.previousSection && sectionController.previousSection != sectionController.currentSection){
                    sectionController.previousSection.disappear();
                }
                if(_pathStack.length > 0) {
                    _nextParsedPath = _pathStack.shift();
                    preparsePath();
                }
            }
        }

        function isAnimating(){
            return !_isShown || !_isHidden;
        }

        function init(){
            var i, len, route;
            var routes = config.data.routes;
            routes.push({route: '.+', section: 'splash'});
            for(i = 0, len = routes.length; i < len; i++) {
                route = routes[i];
                route.route = new RegExp(routes[i].route);
                route.section = sectionController.sections[route.section];
            }
            hasher.changed.add(_onHashChange);
            hasher.initialized.add(_onHashInit);
            hasher.init();
        }


        function _onHashInit(newPath){
            _onHashChange(newPath, '');
        }

        function _onHashChange(newPath, oldPath){
            if(newPath === '') {
                window.location.href = '#/' + sectionController.DEFAULT_PATH;
            }
            if (newPath == _latestPath) return;
            _oldPath = _latestPath;
            _latestPath = newPath;

            if(isAnimating()){
                for(var i = 0; i < _pathStack.length; i++) {
                    if(_pathStack[i] === newPath) break;
                }
                if( i < _pathStack.length ) {
                    _pathStack.splice( i + 1, _pathStack.length - i - 1 );
                } else {
                    _pathStack.push(newPath);
                }
            } else {
                _nextParsedPath = newPath;
                preparsePath();
            }
        }

        function preparsePath(){
            _isShown = false;
            if(!sectionController.isFirstRoute) _isHidden = false;
            if(!uiController.isOccupied()) {
                sectionController.isWaitingForUIResponse = false;
                _parsePath(_nextParsedPath);
            } else {
                sectionController.isWaitingForUIResponse = true;
                uiController.killTask();
            }
        }

        function getRoute(path){
            var route;
            var routes = config.data.routes;
            for(i = 0, len = routes.length; i < len; i++) {
                route = routes[i];
                if(path.match(route.route)) break;
            }
            var nodes = path.split('/');
            if(nodes[nodes.length - 1] === '') nodes.pop();
            return {
                section: route.section,
                nodes: nodes
            };
        }

        function appearTarget(path, opts){
            var route = getRoute(path);
            if(sectionController.appearedSection) sectionController.appearedSection.disappear();
            sectionController.appearedSection = route.section;
            route.section.appear.apply(route.section, [route.nodes, opts]);
        }

        function disappearTarget(path, opts){
            var route = getRoute(path);
            route.section.disappear();
        }

        function _parsePath(path){
            var route = getRoute(path);
            var section = route.section;
            var nodes = route.nodes;

            sectionController.previousSection = sectionController.currentSection;
            sectionController.currentSection = section;

            sectionController.previousNodes = sectionController.currentNodes;
            sectionController.currentNodes = nodes;

            sectionController.previousDepth = sectionController.currentDepth;
            sectionController.currentDepth = route.nodes.length;

            uiController.updateHeader(nodes);


            if(sectionController.previousSection) {
                sectionController.previousSection.hide.apply(sectionController.previousSection, [section, nodes]);
            }
            section.show.apply(section, [nodes, sectionController.previousSection, sectionController.previousNodes]);

            if(sectionController.isFirstRoute) {
                sectionController.isFirstRoute= false;
                $('html').removeClass('is-first-route');
            }
        }

        function goTo(route){
            window.location.href = '#/' + route;
        }

        sectionController.preInit = preInit;
        sectionController.setShown = setShown;
        sectionController.setHidden = setHidden;
        sectionController.isAnimating = isAnimating;
        sectionController.init = init;
        sectionController.preparsePath = preparsePath;
        sectionController.goTo = goTo;
        sectionController.getRoute = getRoute;

        sectionController.appearTarget = appearTarget;
        sectionController.disappearTarget = disappearTarget;

        return sectionController;

    }

);
