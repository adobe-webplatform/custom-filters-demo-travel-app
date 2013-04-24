define(
    [
        'exports',
        'config',
        'jquery',
        'hbs!templates/ui/schedulePrompt',
        'helpers/datetimeHelper',
        'inputController',
        'scheduleController',
        'stageReference'
    ],

    function(schedulePrompt, config, $, template, datetimeHelper, inputController, scheduleController, stageReference) {

        var _container;

        var _form;
        var _locationInput;
        var _dateInput;
        var _noteInput;
        var _saveBtn;
        var _cancelBtn;
        var _closeBtn;

        var _timeout = null;

        var _transform3DStyle = config.transform3DStyle;

        var _item = null;

        schedulePrompt.isShown = false;

        function init(){
            var currentTime = new Date();
            _container = $(template(config.data.schedule_prompt));

            _form = _container.find('.schedule-form');
            _locationInput = _container.find('.location');
            _dateInput = _container.find('.date');
            _noteInput = _container.find('.note');
            _saveBtn = _container.find('.save');
            _cancelBtn = _container.find('.cancel');
            _closeBtn = _container.find('.close');

            $('#app').append(_container);


            _form.on('submit', _onSave);
            inputController.add(_cancelBtn.add(_closeBtn), 'click', _onCancel);
        }

        function show(item, isEvent){
            _item = item;
            _datetime = item.datetime;
            isEvent = !!isEvent;

            _locationInput.val(item.name);
            _dateInput.val(item.datetime);
            _noteInput.val(item.note);

            _dateInput.attr('readonly', isEvent);
            _noteInput.attr('readonly', isEvent);
            _container.toggleClass('is-event', isEvent);
            _container.show();
            clearTimeout(_timeout);
            _timeout = setTimeout(function(){
                _container.addClass('show');
            });
            schedulePrompt.isShown = true;
        }

        function hide(){
            _container.removeClass('show').addClass('hide');
            clearTimeout(_timeout);
            _timeout = setTimeout(function(){
                _container.removeClass('hide');
                _container.hide();
            }, 1000);
            schedulePrompt.isShown = false;
        }

        function _onSave(e){
            _item.datetime = _dateInput.val();
            _item.note = _noteInput.val();
            scheduleController.save(_item, true);
            scheduleController.hidePrompt();
        }

        function _onCancel(e){
            scheduleController.hidePrompt();
        }

        schedulePrompt.init = init;

        schedulePrompt.show = show;
        schedulePrompt.hide = hide;

        return schedulePrompt;

    }

);
