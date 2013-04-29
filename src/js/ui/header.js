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
 define(
    [
        'exports',
        'config',
        'jquery',
        'hbs!templates/ui/header',
        'inputController',
        'sectionController',
        'uiController',
        'stageReference'
    ],

    function(header, config, $, template, inputController, sectionController, uiController, stageReference) {

        var _container;
        var _homeIcon;
        var _tabs;
        var _currentNodes = [];

        var _transform3DStyle = config.transform3DStyle;

        function init(){
            _container = $(template(config.data.header));
            _homeIcon = _container.find('.home');
            _tabs = _container.find('.tab');
            _aboutBtn = _container.find('.about');
            $('#app').append(_container);

            _homeIcon[0].__url = sectionController.DEFAULT_PATH;
            inputController.add(_homeIcon, 'click', _onItemClick);
            inputController.add(_tabs, 'click', _onItemClick);
            inputController.add(_aboutBtn, 'click', _onAboutBtnClick);

            uiController.onAboutShow.add(_onAboutShow);
            uiController.onAboutHide.add(_onAboutHide);
        }

        function show(){
            _container.show();
        }

        function _onAboutShow(){
            _aboutBtn.addClass('selected');
        }

        function _onAboutHide(){
            _aboutBtn.removeClass('selected');
        }

        function _onAboutBtnClick(e){
            var target = $(this);
            if(target.hasClass('selected')){
                uiController.hideAbout();
            } else {
                uiController.showAbout();
            }
        }

        function _onItemClick(e){
            sectionController.goTo(this.__url);
        }

        function update(nodes) {
            if(nodes.length > 0) {
                // find the node name
                var i, len, name, tab;
                var path = '';
                //return console.log(sectionController.getRoute('home/mood'));
                for(i = 1, len = nodes.length; i < len; i++ ) {
                    if(nodes[i] !== _currentNodes[i]) {
                        tab = $(_tabs[i]);
                        path += nodes[i - 1];
                        tab.html(sectionController.getRoute(path).section.getNodeName(nodes[i]));
                        tab[0].style[_transform3DStyle] = 'translate3d(0,0,0)';
                        tab[0].style.opacity = 1;
                        _tabs[i - 1].__url = path;
                        path += '/';
                    }
                }
                _tabs[i - 1].__url = path + nodes[i - 1];

                var sum = 0;
                for(; i < 4; i++ ) {
                    tab = $(_tabs[i]);
                    sum += tab.width() + 35;
                    tab[0].style[_transform3DStyle] = 'translate3d(-' + sum + 'px,0,0)';
                    tab[0].style.opacity = 0;
                }
                _tabs.removeClass('selected');
                $(_tabs[nodes.length - 1]).addClass('selected');

                _lastNodes = nodes;
            }
        }

        header.init = init;
        header.show = show;
        header.update = update;

        return header;

    }

);
