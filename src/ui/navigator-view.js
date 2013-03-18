define(["mobileui/views/layout-view",
        "mobileui/views/layout-params",
        "mobileui/ui/navigator-top-bar-view",
        "mobileui/ui/navigator-content-view"], 
function(LayoutView, LayoutParams, NavigatorTopBarView, NavigatorContentView) {

    var NavigatorView = LayoutView.extend({
        initialize: function() {
            NavigatorView.__super__.initialize.call(this);
            this.setLayout("vertical");
            this.matchParentSize();
            this._topBarView = new NavigatorTopBarView();
            this.append(this._topBarView.render());
            this._contentView = new NavigatorContentView();
            this.append(this._contentView.render());

            this._historyCards = [];
            this._activeCard = null;
        },

        render: function() {
            this.$el.addClass("js-navigator-view");
            return NavigatorView.__super__.render.call(this);
        },

        contentView: function() {
            return this._contentView;
        },

        activeCard: function() {
            return this._activeCard;
        },

        pushCard: function(card) {
            if (this._activeCard) {
                this._activeCard.detach();
                this._historyCards.push(this._activeCard);
                this._activeCard = null;
            }
            if (card) {
                this._activeCard = card;
                this._contentView.append(card);
            }
        },

        popCard: function() {
            if (this._activeCard) {
                this._activeCard.remove();
                this._activeCard = null;
            }
            if (this._historyCards.length) {
                this._activeCard = this._historyCards.pop();
                this._contentView.append(this._activeCard);
            }
        }
    });

    return NavigatorView;

});