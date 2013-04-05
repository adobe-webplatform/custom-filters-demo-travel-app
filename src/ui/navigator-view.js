/*
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(["mobileui/views/layer-view",
        "mobileui/views/layout-params",
        "mobileui/ui/navigator-top-bar-view",
        "mobileui/ui/navigator-content-view"],
function(LayerView, LayoutParams, NavigatorTopBarView, NavigatorContentView) {

    var NavigatorView = LayerView.extend({
        initialize: function() {
            NavigatorView.__super__.initialize.call(this);
            this.matchParentSize();

            this._contentView = new NavigatorContentView()
                .forceLayer();
            this.append(this._contentView.render());

            this._topBarView = new NavigatorTopBarView()
                .forceLayer();
            this._contentView.append(this._topBarView.render());

            this._historyCards = [];
            this._activeCard = null;
            this._nextCard = null;
            this._precommitCard = null;
            this._usesHistory = true;
            this._removeCardAfterCommit = false;
        },

        render: function() {
            this.$el.addClass("js-navigator-view");
            return NavigatorView.__super__.render.call(this);
        },

        setUsesHistory: function(value) {
            this._usesHistory = value;
            return this;
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

        nextCard: function() {
            return this._nextCard;
        },

        canGoBack: function() {
            return this._historyCards.length > 0 ||
                (this._activeCard && this._activeCard.hasPreviousCard());
        },

        previousCard: function() {
            var card = _.last(this._historyCards);
            if (!card && this._activeCard)
                card = this._activeCard.previousCard();
            return card;
        },

        prepareHistoryCard: function() {
            var card = this.previousCard();
            return this.prepareNextCard(card);
        },

        prepareNextCard: function(card) {
            // Animation started, add a new card in the back.
            if (this._nextCard)
                this.revertNextCard();
            this._removeCardAfterCommit = false;
            this._nextCard = card;
            if (this._activeCard && !this._activeCard.displaysOnTop())
                this.contentView().before(this._nextCard, this._activeCard);
            else
                this.contentView().before(this._nextCard, this._topBarView);
            this._nextCard._setNavigatorView(this);
            this._nextCard.trigger("card:next");
            this.trigger("card:next", this._nextCard);
            return this;
        },

        _isLastHistoryCard :function(card) {
            return _.last(this._historyCards) == this._nextCard;
        },

        revertNextCard: function() {
            if (this._precommitCard)
                return this.commitNextCard();
            if (!this._nextCard)
                return this;
            this._nextCard.trigger("card:revert");
            this.trigger("card:revert", this._nextCard);
            this._nextCard._setNavigatorView(null);
            // If this was a history card, we just put it back and detach.
            if (this._isLastHistoryCard(this._nextCard))
                this._nextCard.detach();
            else
                this._nextCard.remove();
            this._nextCard = null;
            this._removeCardAfterCommit = false;
            return this;
        },

        precommitNextCard: function() {
            if (!this._nextCard)
                return this;
            // Figure out if we are going forward or backwards.
            this._removeCardAfterCommit = !this._usesHistory || this._isLastHistoryCard(this._nextCard);
            if (this._usesHistory) {
                if (this._removeCardAfterCommit)
                    this._historyCards.pop();
                else
                    this._historyCards.push(this._activeCard);
            }
            this._precommitCard = this._activeCard;
            this._activeCard = this._nextCard;
            this._nextCard = null;
            this._activeCard.trigger("card:precommit");
            this.trigger("card:precommit", this._activeCard);
            return this;
        },

        commitNextCard: function() {
            // Figure out if we are going forward or backwards.
            if (this._precommitCard) {
                this._precommitCard.trigger("deactivate");
                this._precommitCard._setNavigatorView(null);
                if (this._removeCardAfterCommit)
                    this._precommitCard.remove();
                else
                    this._precommitCard.detach();
                this._precommitCard = null;
            }
            if (this._activeCard.displaysOnTop())
                this._contentView.append(this._activeCard);
            this._activeCard.trigger("card:commit");
            this.trigger("card:commit", this._activeCard);
            this._activeCard.trigger("activate", { goingBack: false });
            this.trigger("activate", this._activeCard, { goingBack: false });
            return this;
        },

        resetCard: function(card) {
            this.revertNextCard();
            var previousActiveCard = this._activeCard;
            if (this._activeCard) {
                this._activeCard.trigger("deactivate");
                this.trigger("deactivate", this._activeCard);
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
                this.trigger("activate", this._activeCard, options);
                if (card.displaysOnTop())
                    this._contentView.append(card);
                else
                    this._contentView.before(card, this._topBarView);
            }
            if (previousActiveCard) {
                if (!options.promise)
                    previousActiveCard._setNavigatorView(null).remove();
                else
                    options.promise.then(function() {
                        previousActiveCard._setNavigatorView(null).remove();
                    });
            }
        },

        pushCard: function(card, pushOptions) {
            this.revertNextCard();
            var previousActiveCard = this._activeCard;
            if (this._activeCard) {
                this._activeCard.trigger("deactivate");
                this.trigger("deactivate", this._activeCard);
                if (this._usesHistory)
                    this._historyCards.push(this._activeCard);
                this._activeCard = null;
            }
            var options = _.extend({
                goingBack: false,
                promise: null
            }, pushOptions);
            if (card) {
                this._activeCard = card;
                this._activeCard._setNavigatorView(this);
                this._activeCard.trigger("activate", options);
                this.trigger("activate", this._activeCard, options);
                if (card.displaysOnTop())
                    this._contentView.append(card);
                else
                    this._contentView.before(card, this._topBarView);
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
            this.revertNextCard();
            var previousActiveCard = this._activeCard,
                self = this;
            var nextCard = this.previousCard();
            if (this._activeCard) {
                this._activeCard.trigger("deactivate");
                this.trigger("deactivate", this._activeCard);
                this._activeCard = null;
            }
            if (nextCard) {
                var options = {
                    goingBack: true,
                    promise: null,
                    previousCard: previousActiveCard
                };
                this._activeCard = nextCard;
                if (previousActiveCard)
                    this._contentView.before(this._activeCard, previousActiveCard);
                else
                    this._contentView.before(this._activeCard, this._topBarView);
                this._activeCard._setNavigatorView(this);
                this._activeCard.trigger("activate", options);
                this.trigger("activate", this._activeCard);
                if (previousActiveCard) {
                    if (!options.promise) {
                        previousActiveCard._setNavigatorView(null).remove();
                        if (this._activeCard.displaysOnTop())
                            this._contentView.append(this._activeCard);
                    } else
                        options.promise.then(function() {
                            previousActiveCard._setNavigatorView(null).remove();
                            if (self._activeCard.displaysOnTop())
                                self._contentView.append(self._activeCard);
                        });
                }
            } else if (previousActiveCard)
                previousActiveCard._setNavigatorView(null).remove();
            return this._activeCard;
        }
    });

    return NavigatorView;

});