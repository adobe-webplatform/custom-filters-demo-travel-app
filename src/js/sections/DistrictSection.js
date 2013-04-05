define([
        'config',
        'jquery',
        './AbstractSection',
        'hbs!templates/sections/district'
    ], function(config, $, AbstractSection, template){

        function DistrictSection(){
            _super.constructor.call(this, 'district', template);

            this.init();
        }

        var _super = AbstractSection.prototype;
        var _p = DistrictSection.prototype = new AbstractSection();
        _p.constructor = DistrictSection;


        return DistrictSection;
    }
)