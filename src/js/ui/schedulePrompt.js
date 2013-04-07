define(
    [
        'exports',
        'config',
        'jquery',
        'hbs!templates/ui/schedulePrompt',
        'inputController',
        'stageReference'
    ],

    function(schedulePrompt, config, $, template, inputController, stageReference) {

        var _container;

        var _transform3DStyle = config.transform3DStyle;

        schedulePrompt.isShown = false;

        function init(){
            _container = $(template(config.data.schedule_prompt));
            $('#app').append(_container);


        }

        function show(){
            _container.show();
            schedulePrompt.isShown = true;
        }

        function hide(){
            _container.hide();
            schedulePrompt.isShown = false;
        }

        schedulePrompt.init = init;

        schedulePrompt.show = show;
        schedulePrompt.hide = hide;

        return schedulePrompt;

    }

);
