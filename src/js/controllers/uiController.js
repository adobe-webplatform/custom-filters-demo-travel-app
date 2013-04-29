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
        'signals',
        'ui/header',
        'ui/about',
        'sectionController',
        'stageReference'
    ],

    function(uiController, config, $, signals, header, about, sectionController, stageReference) {

        var _transform3DStyle = config.transform3DStyle;
        var _killTaskCallback = null;
        var _isKillingTask = false;

        var onAboutShow = uiController.onAboutShow = new signals.Signal();
        var onAboutHide = uiController.onAboutHide = new signals.Signal();

        uiController.isOccupied = isOccupied;

        function init(){
            header.init();
            about.init();
        }

        function showHeader(){
            header.show();
        }

        function updateHeader(nodes){
            header.update(nodes);
        }

        function showAbout(){
            if(sectionController.isAnimating()) return;
            _killTaskCallback = onAboutHide;
            onAboutShow.dispatch();
        }

        function hideAbout(){
            if(sectionController.isAnimating()) return;
            onAboutHide.dispatch();
        }

        function isOccupied(){
            return !!_killTaskCallback;
        }

        function killTask(){
            if(_isKillingTask) return;
            _isKillingTask = true;
            _killTaskCallback.dispatch();
        }

        function onTaskKilled(){
            _isKillingTask = false;
            _killTaskCallback = null;
            if(sectionController.isWaitingForUIResponse) {
                sectionController.preparsePath();
            }
        }

        uiController.init = init;
        uiController.isOccupied = isOccupied;
        uiController.killTask = killTask;
        uiController.onTaskKilled = onTaskKilled;

        uiController.showHeader = showHeader;
        uiController.updateHeader = updateHeader;
        uiController.showAbout = showAbout;
        uiController.hideAbout = hideAbout;
        return uiController;

    }

);
