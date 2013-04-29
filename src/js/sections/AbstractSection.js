/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 Adobe System Incorporated
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
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
            if(sectionController.currentSection !== this) {
                this.container.hide();
            }
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
