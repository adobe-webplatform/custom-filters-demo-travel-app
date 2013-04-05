
define([
        'exports',
        'config',
        'jquery',
        'inputController',
        'uiController',
        'sectionController',
        'locationController',
        'preloaderController',
        'stageReference'
    ],
    function(app, config, $, inputController, uiController, sectionController, locationController, preloaderController, stageReference) {

        app.container = null;

        function init(data){

            config.data = data;
            app.container = $('#app');

            stageReference.init();
            stageReference.startRender();
            stageReference.onResize.add(onResize);
            stageReference.onResize.dispatch();

            inputController.init();
            uiController.init();
            locationController.init();
            sectionController.preInit();
            sectionController.init();
            
            //preloaderController.init();
            //preloaderController.add($('#app'));

            // weird bug on iOS6 that the requestAnimationFrame has conflict and it doesnt work.
            //stageReference.onRender.add(startPreload);
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
