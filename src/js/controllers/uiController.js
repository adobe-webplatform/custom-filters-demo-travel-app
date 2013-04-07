define(
    [
        'exports',
        'config',
        'jquery',
        'ui/header',
        'ui/schedulePrompt',
        'stageReference'
    ],

    function(uiController, config, $, header, schedulePrompt, stageReference) {

        var _transform3DStyle = config.transform3DStyle;

        function init(){
            header.init();

            schedulePrompt.init();
            //schedulePrompt.show();
        }

        function updateHeader(nodes){
            header.update(nodes);
        }

        function showSchedulePrompt(){
            schedulePrompt.show();
        }

        function hideSchedulePrompt(){
            schedulePrompt.hide();
        }

        uiController.init = init;
        uiController.updateHeader = updateHeader;

        uiController.showSchedulePrompt = showSchedulePrompt;
        uiController.hideSchedulePrompt = hideSchedulePrompt;

        return uiController;

    }

);
