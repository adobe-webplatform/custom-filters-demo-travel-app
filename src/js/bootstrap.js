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

( function() {

    function getRequestPaths(opts) {

        var requirePaths = {

            // folders
            'edankwan' : 'libs/edankwan',
            'mout' : 'libs/mout',
            'polyfills' : 'libs/polyfills',
            'templates' : '../assets/templates',
            'jq' : 'libs/jquery',

            // libs
            'jquery' : 'libs/jquery/jquery',
            'handlebars' : 'libs/handlebars',
            'signals' : 'libs/signals',
            'history' : 'libs/history',
            'hasher' : 'libs/hasher',
            'crossroads' : 'libs/crossroads',
            'TWEEN' : 'libs/Tween',

            'imageLoader' : 'libs/edankwan/loader/imageLoader',
            'stageReference' : 'libs/edankwan/display/stageReference',

            'inputController' : 'controllers/inputController',
            'preloaderController' : 'controllers/preloaderController',
            'sectionController' : 'controllers/sectionController',
            'locationController' : 'controllers/locationController',
            'uiController' : 'controllers/uiController',
            'scheduleController' : 'controllers/scheduleController',
            'trackingController' : 'controllers/trackingController',

            'config' : 'core/config',

            'hbs' : 'libs/require/hbs',
            'text' : 'libs/require/text',
            'json' : 'libs/require/json'

        };

        if(opts) {

        }

        return requirePaths;

    }

    function getShim(opts){
        return {
            'TWEEN' : {exports: 'TWEEN'}
        };
    }

    function getMap(opts){
        var map = {
            '*' : {
                'jquery': 'libs/jquery/jquery.amd'
            },
            'libs/jquery/jquery.amd': {
                'jquery': 'libs/jquery/jquery'
            }
        };
        return map;
    }

    // FOR BROWSER
    if(typeof window !== 'undefined') {
        var IS_LOCAL = /(:\/\/localhost|file:\/\/)/.test(document.location.href);
        var isDeploy = VERSION_ARGS.indexOf('dev') === -1;
        var requireConfig = {
            paths : getRequestPaths(),
            shim: getShim(),
            map: getMap(),
            waitSeconds : ( IS_LOCAL ? 20 : 600),
            hbs : {
                disableI18n : true,
                templateExtension : 'html',
                helperDirectory : 'helpers/hbs/'
            },
            urlArgs : isDeploy ? VERSION_ARGS : 'v=' + ( + new Date()),
            priority : []
        };

        require.config(requireConfig);

        define([
                'app',
                'json!../lang/en.js?v=' + (+ new Date())
            ],
            function( app, data) {
                app.init(data);
            }
        );
    } else {
    // FOR NODE BUILD SCRIPT
        module.exports.getRequestPaths = getRequestPaths;
        module.exports.getShim = getShim;
        module.exports.getMap = getMap;
    }

}());
