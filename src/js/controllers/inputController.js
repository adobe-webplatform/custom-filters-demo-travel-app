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
        'config',
        'jquery',
        'signals',
        'mout/array/forEach',
        'mout/array/every'
    ],
    function(config, $, signals, forEach, every) {

        var undef;

        var inputController = {

            hasTouch: config.hasTouch,

            onDown: new signals.Signal(),
            onMove: new signals.Signal(),
            onUp: new signals.Signal(),

            onSwipeH: new signals.Signal(),
            onSwipeV: new signals.Signal(),

            isDown: false,
            isScrollH: false,
            isScrollV: false,

            isFirstTouch: undef, // if it is undefined, which means it is not ready yet. If it is true, which means the first event is touch. If it is false, which means the first event is mouse.

            deltaX: 0,
            deltaY: 0,
            deltaTime: 0,

            downBubbleHistory: [],
            currentBubbleHistory: [],

            isOnSwipePane: false,
            elems: []

        };

        var _hasTouch = inputController.hasTouch;
        var _hasEventListener = 'addEventListener' in window;
        var _documentElement = document.documentElement;

        var _isDown = false;
        var _downTime = 0;
        var _downX = 0;
        var _downY = 0;
        var _currentTime = 0;
        var _currentX = 0;
        var _currentY = 0;

        var LOG_MAX = 5;

        var elems = inputController.elems;

        var TYPE_CONVERSION = _hasTouch ? {
            'over': 'touchstart mouseenter',
            'out': 'touchend mouseleave'
        } : {
            'over': 'mouseenter',
            'out': 'mouseleave'
        };

        var TYPE_LIST = ['over', 'out', 'tap', 'click', 'down', 'move', 'up'];

        function add(elem, type, func) {
            if(elem.jquery) {
                elem.each(function(){add(this, type, func);});
                return;
            }

            if(!elem) return;
            elem['__' + type] = func;
            if(type == 'over' || type == 'out') {
                $(elem).bind(TYPE_CONVERSION[type], func);
            }
            elem.__hasInput = true;
            elems.push(elem);
        }

        function remove(elem, type) {
            if(elem.jquery) {
                elem.each(function(){remove(this, type, func);});
                return;
            }

            if(!elem) return;
            if(type) {
                if(type == 'over' || type == 'out'){
                    if(elem['__' + type]) $(elem).unbind(TYPE_CONVERSION[type], elem['__' + type]);
                }
                elem['__' + type] = undef;
            } else{
                if(elem.__over) $(elem).unbind(TYPE_CONVERSION['over'], elem.__over);
                if(elem.__out) $(elem).unbind(TYPE_CONVERSION['out'], elem.__out);
                forEach(TYPE_LIST, function(e){
                    elem['__' + e] = undef;
                });
                elem.__hasInput = false;
            }
            if(every(TYPE_LIST, function(e){ return !elem['__' + e];})){
                for(var i = 0; i < elems.length; i++) {
                    if(elems[i] == elem) {
                        elems.splice(i, 1);
                        break;
                    }
                }
            }
        }


        function init(){
            document.ondragstart = function () { return false; };
            if(inputController.hasTouch){
                document.addEventListener('touchstart', _bindEventDown, false);
                document.addEventListener('touchmove', _bindEventMove, false);
                document.addEventListener('touchend', _bindEventUp, false);
                document.addEventListener('mousedown', _bindEventDown, false);
                document.addEventListener('mousemove', _bindEventMove, false);
                document.addEventListener('mouseup', _bindEventUp, false);
            } else if(_hasEventListener) {
                document.addEventListener('mousedown', _bindEventDown, false);
                document.addEventListener('mousemove', _bindEventMove, false);
                document.addEventListener('mouseup', _bindEventUp, false);
            }else {
                document.attachEvent('onmousedown', _bindEventDown);
                document.attachEvent('onmousemove', _bindEventMove);
                document.attachEvent('onmouseup', _bindEventUp);
            }

            inputController.onDown.add(_onDown);
            inputController.onMove.add(_onMove);
            inputController.onUp.add(_onUp);

        }

        function _bindEventDown(e){
            return _mixInputEvent.call(this, e, function(e) {inputController.onDown.dispatch(e);});
        }
        function _bindEventMove(e){
            return _mixInputEvent.call(this, e, function(e) {inputController.onMove.dispatch(e);});
        }
        function _bindEventUp(e){
            return _mixInputEvent.call(this, e, function(e) {inputController.onUp.dispatch(e);});
        }

        function _preventDefaultFunc(e){
            return function(){
                if(e.preventDefault){
                    e.preventDefault();
                }else{
                    e.returnValue = false;
                }
            };
        }

        function _mixInputEvent(e, func){
            e = e || window.event;
            var fakedEvent = {
                originalEvent: e,
                preventDefault: _preventDefaultFunc(e)
            };
            var i, elem, x, y, touchEvent, bubbleHistory, target;
            var type = e.type;
            var time = (new Date()).getTime();
            var isDown = type.indexOf('start') > -1 || type.indexOf('down') > -1;
            var isTouch = fakedEvent.isTouch = type.indexOf('touch') >-1;
            if(inputController.isFirstTouch === undef) inputController.isFirstTouch = isTouch;
            if(isTouch){
                touchEvent = e.touches.length ? e.touches[0] : e.changedTouches[0];
                fakedEvent.x = x = touchEvent.pageX;
                fakedEvent.y = y = touchEvent.pageY;
                fakedEvent.target = target =touchEvent.target;
                fakedEvent.isMainPointer = e.touches.length === 0 || e.touches[0].identifier === e.changedTouches[0].identifier;

                var isSkipPreventDefault = false;
                bubbleHistory = inputController.currentBubbleHistory = fakedEvent.bubbleHistory = [];
                while(target) {
                    bubbleHistory.unshift(target);
                    if(!isSkipPreventDefault && target.__skipPreventDefault || (target.getAttribute && !target.getAttribute('controls'))) {
                        isSkipPreventDefault = true;
                    }
                    target = target.parentNode;
                }
                if(!isSkipPreventDefault) e.preventDefault();
            } else{
                fakedEvent.isMainPointer = true;
                fakedEvent.x = x = _hasEventListener? e.pageX: e.clientX + _documentElement.scrollLeft;
                fakedEvent.y = y = _hasEventListener? e.pageY: e.clientY + _documentElement.scrollTop;
                fakedEvent.target = target = e.target ? e.target: e.srcElement;
                bubbleHistory = inputController.currentBubbleHistory = fakedEvent.bubbleHistory = [];
                while(target) {
                    bubbleHistory.unshift(target);
                    target = target.parentNode;
                }
            }

            /* */
            if(isTouch){
                var autoPreventDefault = false;
                i = bubbleHistory.length;
                while(i--) {
                    elem = bubbleHistory[i];
                    if(elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA' || elem.tagName === 'VIDEO') {
                        autoPreventDefault = false;
                        break;
                    }
                    if(elem.__hasInput) {
                        autoPreventDefault = true;
                    }
                }
                if(autoPreventDefault) e.preventDefault();
            }

            if(isDown) {
                _isDown = true;
                _downTime = _currentTime = time;
                _downX = _currentX = x;
                _downY = _currentY = y;
                inputController.downBubbleHistory = bubbleHistory;

                i = bubbleHistory.length;
                while(i--) {
                    elem = bubbleHistory[i];
                    if(isTouch && elem.__over) {
                        fakedEvent.currentTarget = elem;
                        elem.__over.call(elem, fakedEvent);
                    }
                    if(elem.__down) {
                        fakedEvent.currentTarget = elem;
                        elem.__down.call(elem, fakedEvent);
                    }
                }
            }

            if(_isDown) {
                fakedEvent.distanceTime = time - _downTime;
                fakedEvent.distanceX = x - _downX;
                fakedEvent.distanceY = y - _downY;
                fakedEvent.distance = Math.sqrt((x - _downX) * (x - _downX) + (y - _downY) * (y - _downY));
            }

            fakedEvent.deltaTime = time - _currentTime;
            fakedEvent.deltaX = x - _currentX;
            fakedEvent.deltaY = y - _currentY;

            _currentTime = time;
            _currentX = x;
            _currentY = y;

            if(type.indexOf('end') > -1 || type.indexOf('up') > -1){
                _isDown = false;
            }

            func(fakedEvent);
        }



        function _onDown(e){
            inputController.isDown = true;
            var i = e.bubbleHistory.length;
            var target;
            while(i--) {
                target = e.bubbleHistory[i];
                if(target.__tap) {
                    e.currentTarget = target;
                    target.__tap.call(target, e);
                }
            }
        }

        function _onMove(e){
            inputController.currentBubbleHistory = e.bubbleHistory;
            inputController.deltaX = e.deltaX;
            inputController.deltaY = e.deltaY;
            inputController.deltaTime = e.deltaTime;
            inputController.distanceX = e.distanceX;
            inputController.distanceY = e.distanceY;
            inputController.distanceTime = e.distanceTime;
            if(!inputController.isScrollH && !inputController.isScrollV) {
                if(e.distance > 20) {
                    if(Math.abs(e.distanceX) > Math.abs(e.distanceY)){
                        inputController.isScrollH = true;
                        inputController.onSwipeH.dispatch(e);
                    } else{
                        inputController.isScrollV = true;
                        inputController.onSwipeV.dispatch(e);
                    }
                }
            }

            var i = e.bubbleHistory.length;
            var target;
            while(i--) {
                target = e.bubbleHistory[i];
                if(target.__move) {
                    e.currentTarget = target;
                    target.__move.call(target, e);
                }
            }
        }
        function _onUp(e){
            inputController.isDown = false;

            inputController.distanceTime = e.distanceTime;

            var i = e.bubbleHistory.length;
            var target;
            var isClick = e.distanceTime !== null && e.distanceTime < 500 && e.distance < 40;
            while(i--) {
                target = e.bubbleHistory[i];
                if(target.__out) {
                    e.currentTarget = target;
                    target.__out.call(target, e);
                }
                if(target.__up) {
                    e.currentTarget = target;
                    target.__up.call(target, e);
                }
                if(isClick && target.__click) {
                    e.currentTarget = target;
                    target.__click.call(target, e);
                }
            }
            inputController.isScrollH = false;
            inputController.isScrollV = false;
        }

        inputController.init = init;
        inputController.add = add;
        inputController.remove = remove;

        return inputController;

    }
);
