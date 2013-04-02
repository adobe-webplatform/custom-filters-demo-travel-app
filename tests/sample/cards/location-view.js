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

define(["mobileui/views/content-view",
        "mobileui/views/measured-view",
        "mobileui/views/scroll-view",
        "mobileui/views/layout-view",
        "mobileui/views/layer-view",
        "mobileui/utils/transform",
        "views/app-card-view",
        "data/locations",
        "app"],
    function(ContentView,
            MeasuredView,
            ScrollView,
            LayoutView,
            LayerView,
            Transform,
            AppCardView,
            LocationLabels,
            app) {

    var imagePaddingHeight = 150;

    var LocationView = AppCardView.extend({
        initialize: function(options) {
            LocationView.__super__.initialize.call(this);
            this._hadPictureScrollScale = false;

            this._scrollView = new ScrollView().setScrollDirection("vertical");
            this._scrollView.matchParentSize();
            this._scrollView
                .on("scroll", this._onScroll, this)
                .on("scroll:animation", this._onScrollAnimation, this);
            this.append(this._scrollView.render());

            this._contentView = new LayoutView().setLayout("vertical")
                .addClass("js-location-content-view");
            this._contentView.ensureParams().matchParentWidth().matchChildrenHeight();
            this._contentView.margin().setTop(imagePaddingHeight);
            this._scrollView.setContentView(this._contentView.render());

            this._labelView = new ContentView()
                .addClass("js-location-view-label")
                .addContentClass("center");
            this._labelView.ensureParams().matchParentWidth();
            this._labelView.bounds().setHeight(100);
            this._contentView.append(this._labelView.render());

            if (options && options.path) {
                var decodedPath = decodeURIComponent(options.path);
                this.model = LocationLabels.find(function(item) {
                    return item.get("label") == decodedPath;
                });
            }
            if (!this.model)
                this.model = LocationLabels.first();
            this._labelView.setTextContent(this.model.get("label"));

            this._twoColumnView1 = new LayoutView().setLayout("horizontal")
                .addClass("js-location-two-column-view");
            this._twoColumnView1.ensureParams().matchParentWidth().matchChildrenHeight();
            this._contentView.append(this._twoColumnView1.render());

            this._labelView1 = new ContentView()
                .addClass("js-location-two-column-cell-view")
                .addContentClass("center");
            this._labelView1.ensureParams().fillParentWidth();
            this._labelView1.bounds().setHeight(40);
            this._labelView1.setTextContent("Label1");
            this._twoColumnView1.append(this._labelView1.render());

            this._labelView2 = new ContentView()
                .addClass("js-location-two-column-cell-view")
                .addContentClass("center");
            this._labelView2.ensureParams().fillParentWidth();
            this._labelView2.bounds().setHeight(40);
            this._labelView2.setTextContent("Label2");
            this._twoColumnView1.append(this._labelView2.render());

            this._twoColumnView2 = new LayoutView().setLayout("horizontal")
                .addClass("js-location-two-column-view");
            this._twoColumnView2.ensureParams().matchParentWidth().matchChildrenHeight();
            this._contentView.append(this._twoColumnView2.render());

            this._labelView3 = new ContentView()
                .addClass("js-location-two-column-cell-view")
                .addContentClass("center");
            this._labelView3.ensureParams().fillParentWidth();
            this._labelView3.bounds().setHeight(40);
            this._labelView3.setTextContent("Label3");
            this._twoColumnView2.append(this._labelView3.render());

            this._labelView4 = new ContentView()
                .addClass("js-location-two-column-cell-view")
                .addContentClass("center");
            this._labelView4.ensureParams().fillParentWidth();
            this._labelView4.bounds().setHeight(40);
            this._labelView4.setTextContent("Label4");
            this._twoColumnView2.append(this._labelView4.render());

            this._textContentView = new MeasuredView().setContent(
                "<div class='js-location-view-paragraph'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin aliquam velit a ante tincidunt vitae tristique purus pharetra. Maecenas ut bibendum augue. Suspendisse dignissim vestibulum feugiat. Nulla facilisi. Nam purus risus, vehicula quis adipiscing sed, rhoncus nec tellus. Cras elementum, odio et pharetra elementum, est mauris pharetra magna, non malesuada nunc elit non augue. Duis commodo nisl vel augue semper eget tincidunt neque ultrices.</div>" +
                "<div class='js-location-view-paragraph'>Phasellus in velit mauris. Quisque cursus dapibus imperdiet. Aliquam erat volutpat. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum ut elit dui, ac sagittis nisi. Donec porta magna sit amet ante vulputate in semper neque interdum. Nulla non lacus quam, et tempor mauris. Vestibulum non suscipit est. Donec mollis lectus eu purus lobortis cursus. Mauris facilisis ligula vitae mauris suscipit tempus. Praesent malesuada rhoncus quam, in interdum tortor pulvinar in. Fusce suscipit, nisl et lobortis convallis, sapien massa pharetra felis, vitae adipiscing libero est dictum mi. Integer lobortis diam ut quam ultricies quis auctor dui pulvinar. Nulla facilisi. Ut pellentesque adipiscing tempor.</div>" +
                "<div class='js-location-view-paragraph'>Nullam at lobortis justo. Sed vel sapien sem. Aliquam elementum erat non tortor vehicula porttitor. Nam euismod, nulla vitae semper aliquam, quam tortor convallis mi, quis hendrerit mauris nisl at elit. Nunc eu leo orci, vitae fringilla ipsum. Praesent urna massa, sodales eget faucibus et, ultrices at augue. Nunc sit amet augue vel mi posuere sagittis in sed lacus. Proin ac enim sed sem placerat laoreet sed nec lectus. Suspendisse porta libero eget urna imperdiet at rhoncus risus molestie.</div>");
            this._textContentView.padding().setAll(10);
            this._textContentView.ensureParams().matchParentWidth();
            this._contentView.append(this._textContentView.render());

            // Append the picture view first, so that it displays under
            // the content of our card when it is scrolled.
            this._pictureScrollView = new ScrollView().setScrollDirection("horizontal").setSnapToChildrenBounds()
                .addClass("js-location-picture-scroll-view")
                .forceLayer();
            this._pictureScrollView.on("scroll", this._onPictureViewScroll, this);
            this._pictureScrollView.ensureParams().matchParentWidth();
            this._pictureScrollView.bounds().setHeight(imagePaddingHeight);
            this._scrollView.before(this._pictureScrollView.render(), this._contentView);

            this._pictureView =  new LayoutView().setLayout("horizontal");
            this._pictureView.ensureParams().matchChildrenWidth().matchParentHeight();
            this._pictureScrollView.setContentView(this._pictureView.render());

            var colors = ["DeepSkyBlue", "PaleVioletRed", "MediumSlateBlue", "DarkSeaGreen", "BurlyWood"];
            for (var i = 0; i < colors.length; ++i) {
                var picture = new LayerView();
                picture.addGestureDetector()
                    .on("tap", this._onPictureTap.bind(this, picture));
                picture.color = colors[i];
                picture.index = i + 1;
                picture.ensureParams().matchWidthOf(this._pictureScrollView).matchParentHeight();
                picture.$el.css("background-color", colors[i])
                    .append($("<div />")
                        .css("font-size", "2.5em")
                        .addClass("center")
                        .text(i + 1));
                this._pictureView.append(picture.render());
            }
        },

        _onPictureTap: function(view) {
            app.mainView.navigatorView().pushCard(app.router.lookupCard("Picture View",
                encodeURIComponent(view.color + ":" + view.index)), {
                scaleFrom: this._pictureScrollView
            });
        },

        _onScroll: function() {
            var scrollTop = this._scrollView.scrollTop();
            if (this._hadPictureScrollScale)
                this._pictureScrollView.animation().get("scroll-scale").removeAll();
            if (scrollTop < 0) {
                this._hadPictureScrollScale = true;
                var height = imagePaddingHeight - scrollTop,
                    scaleRatio = height / imagePaddingHeight;
                this._pictureScrollView.forceLayer()
                    .transform()
                        .get("scale")
                        .setX(scaleRatio)
                        .setY(scaleRatio);
            } else if (this._hadPictureScrollScale) {
                this._hadPictureScrollScale = false;
                this._pictureScrollView.transform().clear();
            }
        },

        _onScrollAnimation: function(scrollLeft, scrollTop, duration) {
            if (!this._hadPictureScrollScale && scrollTop >= 0)
                return;
            var height = imagePaddingHeight - scrollTop,
                scaleRatio = height / imagePaddingHeight;
            this._pictureScrollView.animation().start()
                .get("scroll-scale")
                .removeAll()
                .chain()
                .transform(duration, new Transform().scale(scaleRatio, scaleRatio))
                .setTimingFunction("easeOut")
                .callback(function() {
                    this._hadPictureScrollScale = scrollTop < 0;
                }, this);

            if (this._pictureScrollView.transform().get('scale').y() > 1.5) {
                var view = this._pictureScrollView.selectedView();
                if (view)
                    this._onPictureTap(view);
            }
        },

        _onPictureViewScroll: function() {
            if (this._scrollView.scrollTop() > 0 && !this._scrollView.isScrolling())
                this._scrollView.scrollToWithAnimation(0, 0);
        },

        render: function() {
            this.$el.addClass("js-location-view");

            return LocationView.__super__.render.call(this);
        },

        url: function() {
            return "card/" + encodeURIComponent("Location View") + "/" + encodeURIComponent(this.model.get("label"));
        }
    });

    return {
        label: "Location View",
        view: LocationView
    };

});