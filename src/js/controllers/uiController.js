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

        uiController.updateHeader = updateHeader;
        uiController.showAbout = showAbout;
        uiController.hideAbout = hideAbout;
        return uiController;

    }

);
