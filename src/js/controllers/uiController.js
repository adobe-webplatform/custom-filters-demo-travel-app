define(
    [
        'exports',
        'config',
        'jquery',
        'ui/header',
        'stageReference'
    ],

    function(uiController, config, $, header, stageReference) {

        var _transform3DStyle = config.transform3DStyle;

        function init(){
            header.init();
        }

        function updateHeader(nodes){
            header.update(nodes);
        }

        uiController.init = init;
        uiController.updateHeader = updateHeader;

        return uiController;

    }

);
