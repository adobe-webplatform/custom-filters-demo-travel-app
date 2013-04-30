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
        'exports',
        'config',
        'jquery',
        'inputController',
        'uiController',
        'scheduleController',
        'sectionController',
        'locationController',
        'preloaderController',
        'stageReference'
    ],
    function(app, config, $, inputController, uiController, scheduleController, sectionController, locationController, preloaderController, stageReference) {

        app.container = null;

        function init(data){

            config.data = data;
            app.container = $('#app');

            stageReference.init();
            stageReference.onResize.add(onResize);
            stageReference.onResize.dispatch();

            inputController.init();
            uiController.init();
            locationController.init();
            scheduleController.init();
            sectionController.preInit();

            preloaderController.init();
            preloaderController.add($('#app'));

            preloaderController.start(start);
        }

        function onResize(){
            config.stageWidth = stageReference.stageWidth;
            config.stageHeight = stageReference.stageHeight;
        }

        function start(){
            uiController.showHeader();
            sectionController.init();
        }

        app.init = init;
        app.onResize = onResize;
        app.start = start;

        window.app = app;

    }
);
