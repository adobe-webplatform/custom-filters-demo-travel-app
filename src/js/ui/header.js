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
