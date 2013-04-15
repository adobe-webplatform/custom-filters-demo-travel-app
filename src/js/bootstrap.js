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

            'imageLoader' : 'libs/edankwan/loader/imageLoader',
            'stageReference' : 'libs/edankwan/display/stageReference',
            'EKTweener' : 'libs/edankwan/animation/EKTweener',

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
            'EKTweener' : {exports: 'EKTweener'}
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
