
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
        'stageReference',
        'TWEEN'
    ],
    function(app, config, $, inputController, uiController, scheduleController, sectionController, locationController, preloaderController, stageReference, TWEEN) {

        app.container = null;

        function init(data){

            config.data = data;
            app.container = $('#app');

            stageReference.init();
            stageReference.onRender.add(_onTWEENUpdate, null, null, null, -9999);
            stageReference.startRender();
            stageReference.onResize.add(onResize);
            stageReference.onResize.dispatch();

            inputController.init();
            uiController.init();
            locationController.init();
            scheduleController.init();
            sectionController.preInit();
            sectionController.init();

            //preloaderController.init();
            //preloaderController.add($('#app'));

            // weird bug on iOS6 that the requestAnimationFrame has conflict and it doesnt work.
            //stageReference.onRender.add(startPreload);
        }

        function _onTWEENUpdate(){
            TWEEN.update();
        }

        function startPreload(){
            stageReference.onRender.remove(startPreload);
            preloaderController.start(start);
        }

        function onResize(){
            config.stageWidth = stageReference.stageWidth;
            config.stageHeight = stageReference.stageHeight;
        }

        function start(){
            sectionController.init();
        }

        app.init = init;
        app.onResize = onResize;
        app.start = start;

        window.app = app;

    }
);
