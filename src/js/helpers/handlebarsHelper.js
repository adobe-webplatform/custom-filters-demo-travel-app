define([
        'exports',
        'handlebars'
    ],
    function( handlebarsHelper, Handlebars){

        var undef;

        function define(property, value) {
            Handlebars.registerHelper(property, function(opts) {
                return typeof value === 'function' ? value.apply(this, arguments) : value;
            });
        }

        handlebarsHelper.define = define;

        return handlebarsHelper;

    }

);
