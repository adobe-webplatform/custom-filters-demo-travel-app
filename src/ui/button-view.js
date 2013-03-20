define(["mobileui/views/gesture-view"], function(GestureView) {

    var ButtonView = GestureView.extend({
        initialize: function() {
            ButtonView.__super__.initialize.call(this);
            this._label = "Button";
            this.bounds().setSize(70, 40);
            this.on("tapstart", this._onTapStart, this);
            this.on("tapend", this._onTapEnd, this);
            this._state = "up";
            this._prevState = null;
            this.$labelEl = $("<div />").addClass("js-button-view-label");
        },

        setLabel: function(label) {
            this._label = label;
            this.invalidate("label");
            return this;
        },

        render: function() {
            ButtonView.__super__.render.call(this);
            this.$el.addClass("js-button-view")
                    .append(this.$labelEl);
            this._validateLabel();
            this._validateState();
            return this;
        },

        _validateLabel: function() {
            this.$labelEl.text(this._label);
        },

        _validateState: function() {
            if (this._prevState)
                this.$el.removeClass("js-button-view-" + this._prevState);
            this.$el.addClass("js-button-view-" + this._state);
            this._prevState = this._state;
        },

        _onTapStart: function() {
            this._state = "down";
            this.invalidate("state");
        },

        _onTapEnd: function() {
            this._state = "up";
            this.invalidate("state");
        }
    });

    return ButtonView;

});