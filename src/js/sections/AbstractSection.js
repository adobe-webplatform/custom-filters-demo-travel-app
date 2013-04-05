define([
        'config',
        'jquery',
        'sectionController',
        'mout/array/map'
    ], function(config, $, sectionController, map){

        function AbstractSection(id, template, data){
            if(!id) return;
            this.id = id;
            this.data = config.data.sections[id];
            this.template = template;
            this.isAppeared = false;
        }

        var _p = AbstractSection.prototype;

        function init(){
            this.container = $(this.template(this.data || {}));
            $('#app').append(this.container);
        }

        // this will be called for just showing the page but not necessarily routing to this page. It can be cancelled by disappear();
        function appear(route, options){
            this.container.show();
        }

        function disappear(){
            this.container.hide();
        }

        // override this
        function show(nodes, previousSection, previousNodes){
            this.container.show();
            this._setShown();
        }

        function _setShown(){
            sectionController.setShown();
        }

        // override this
        function hide(currentSection, currentNodes){
            // dont need to hide the container here as the sectionController will trigger the disappear() when the show/hide animation is done.
            //this.container.hide();
            this._setHidden();
        }

        function _setHidden(){
            sectionController.setHidden();
        }

        // override this. This is for the header node name
        function getNodeName(node) {
            return 'foo';
        }

        _p.init = init;

        _p.appear = appear;
        _p.disappear = disappear;
        _p.show = show;
        _p._setShown = _setShown;
        _p.hide = hide;
        _p._setHidden = _setHidden;
        _p.getNodeName = getNodeName;

        return AbstractSection;

    }
)
