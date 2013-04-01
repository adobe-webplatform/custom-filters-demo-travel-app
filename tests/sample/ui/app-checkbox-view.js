define(["mobileui/ui/checkbox-view",
        "mobileui/views/layout-view",
        "mobileui/views/content-view",
        "mobileui/views/layer-view",
        "mobileui/utils/transform"], 
    function(CheckboxView,
            LayoutView,
            ContentView,
            LayerView,
            Transform) {

    var AppCheckboxView = CheckboxView.extend({
        initialize: function() {
            AppCheckboxView.__super__.initialize.call(this);
            this.addClass("slide-switch-container");
            
            this._slideSwitch = new LayerView().addClass("dark-slide-switch");
            this._slideSwitch.matchParentSize();
            this.append(this._slideSwitch.render());

            this._onOffContainer = new LayoutView()
                .forceLayer()
                .addClass("js-checkbox-on-off-container")
                .setLayout("horizontal");
            this._onOffContainer.ensureParams().matchChildrenWidth().matchParentHeight();
            this._slideSwitch.append(this._onOffContainer.render());

            this._onLabel = new ContentView().addClass("js-checkbox-on-label").setTextContent("ON")
                .matchLineHeight();
            this._onLabel.ensureParams().matchWidthOf(this).matchParentHeight();
            this._onOffContainer.append(this._onLabel.render());

            this._offLabel = new ContentView().addClass("js-checkbox-off-label").setTextContent("OFF")
                .matchLineHeight();
            this._offLabel.ensureParams().matchWidthOf(this).matchParentHeight();
            this._onOffContainer.append(this._offLabel.render());

            this._slideSwitch.append(this._needleView.addClass("switch"));
        },

        render: function() {
            AppCheckboxView.__super__.render.call(this);
            this.$el.addClass("app-checkbox-view");
            return this;
        },

        layout: function() {
            var padding = this.bounds().width() / 2;
            this._onLabel.padding().setRight(padding);
            this._offLabel.padding().setLeft(padding);
            AppCheckboxView.__super__.layout.call(this);
        },

        _onOffContainerPosition: function() {
            return this._checked ? 0 : -this.bounds().width();
        },

        _validateChecked: function() {
            AppCheckboxView.__super__._validateChecked.call(this);
            this._onOffContainer.transform()
                .get("translate")
                .setX(this._onOffContainerPosition());
        },

        _validateCheckedWithAnimation: function() {
            AppCheckboxView.__super__._validateCheckedWithAnimation.call(this);
            this._onOffContainer.animation().start()
                .get("checkbox-transform").removeAll()
                .chain()
                .transform(100, new Transform().translate(this._onOffContainerPosition(), 0));
        },

        _updateDragPosition: function(value) {
            AppCheckboxView.__super__._updateDragPosition.call(this, value);
            var needlePosition = Math.min(this.bounds().width() / 2, Math.max(0, value)),
                position = needlePosition * 2 - this.bounds().width(),
                translate = this._onOffContainer.transform().get("translate");
            translate.setX(position);
        }
    });

    return AppCheckboxView;
});