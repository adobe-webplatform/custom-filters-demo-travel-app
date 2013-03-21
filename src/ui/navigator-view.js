define(["mobileui/views/layout-view",
        "mobileui/views/layout-params",
        "mobileui/ui/navigator-top-bar-view",
        "mobileui/ui/navigator-content-view"], 
function(LayoutView, LayoutParams, NavigatorTopBarView, NavigatorContentView) {

    var NavigatorView = LayoutView.extend({
        initialize: function() {
            NavigatorView.__super__.initialize.call(this);
            this.matchParentSize().setLayout("vertical");

            this._topBarView = new NavigatorTopBarView();
            this.append(this._topBarView.render());

            this._contentView = new NavigatorContentView();
            this.append(this._contentView.render());

            this._historyCards = [];
            this._activeCard = null;
            this._nextCard = null;
        },

        render: function() {
            this.$el.addClass("js-navigator-view");
            return NavigatorView.__super__.render.call(this);
        },

        topBarView: function() {
            return this._topBarView;
        },

        contentView: function() {
            return this._contentView;
        },

        activeCard: function() {
            return this._activeCard;
        },

        prepareNextCard: function(card) {
            // Animation started, add a new card in the back.
            if (this._nextCard)
                this.revertNextCard();
            this._nextCard = card;
            if (this._activeCard)
                this.contentView().before(this._nextCard, this._activeCard);
            else
                this.contentView().append(this._nextCard);
            this._nextCard._setNavigatorView(this);
            this._nextCard.trigger("card:next");
            return this;
        },

        revertNextCard: function() {
            if (!this._nextCard)
                return;
            this._nextCard.trigger("card:revert");
            this._nextCard._setNavigatorView(null);
            this._nextCard.remove();
            this._nextCard = null;
            return this;
        },

        commitNextCard: function() {
            if (!this._nextCard)
                return;
            if (this._activeCard) {
                this._activeCard.trigger("deactivate");
                this._activeCard._setNavigatorView(null).detach();
                this._historyCards.push(this._activeCard);
                this._activeCard = null;
            }
            this._activeCard = this._nextCard;
            this._nextCard = null;
            this._activeCard.trigger("card:commit");
            this._activeCard.trigger("activate");
            return this;
        },

        pushCard: function(card) {
            var previousActiveCard = this._activeCard;
            if (this._activeCard) {
                this._activeCard.trigger("deactivate");
                this._historyCards.push(this._activeCard);
                this._activeCard = null;
            }
            var options = {
                goingBack: false,
                promise: null
            };
            if (card) {
                this._activeCard = card;
                this._activeCard._setNavigatorView(this);
                this._activeCard.trigger("activate", options);
                this._contentView.append(card);
            }
            if (previousActiveCard) {
                if (!options.promise)
                    previousActiveCard._setNavigatorView(null).detach();
                else
                    options.promise.then(function() {
                        previousActiveCard._setNavigatorView(null).detach();
                    });
            }
        },

        popCard: function() {
            var previousActiveCard = this._activeCard;
            if (this._activeCard) {
                this._activeCard.trigger("deactivate");
                this._activeCard = null;
            }
            var options = {
                goingBack: true,
                promise: null
            };
            if (this._historyCards.length) {
                this._activeCard = this._historyCards.pop();
                this._contentView.append(this._activeCard);
                this._activeCard._setNavigatorView(this);
                this._activeCard.trigger("activate", options);
            }
            if (previousActiveCard) {
                if (!options.promise)
                    previousActiveCard._setNavigatorView(null).remove();
                else
                    options.promise.then(function() {
                        previousActiveCard._setNavigatorView(null).remove();
                    });
            }
            return this._activeCard;
        }
    });

    return NavigatorView;

});