define(
    [
        'exports',
        'config',
        'jquery',
        'hbs!templates/ui/header',
        'inputController',
        'sectionController',
        'stageReference'
    ],

    function(header, config, $, template, inputController, sectionController, stageReference) {

        var _container;
        var _tabs;
        var _currentNodes = [];

        var _transform3DStyle = config.transform3DStyle;

        function init(){
            _container = $(template(config.data.header));
            _tabs = _container.find('.tab');
            $('#app').append(_container);


            inputController.add(_tabs, 'click', _onClick);
        }

        function _onClick(e){
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
                _tabs[0].__url = sectionController.DEFAULT_PATH;

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
        header.update = update;

        return header;

    }

);
