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
        'exports',
        'config',
        'TWEEN',
        'mout/object/mixIn',
        'mout/function/bind',
        'stageReference'
    ],
    function( tweenHelper, config, TWEEN, mixIn, bind,stageReference){

        var undef;

        var _transform3DStyle = config.transform3DStyle;

        function add(obj) {
            kill(obj);
            obj.__tween =  new TWEEN.Tween(obj);

            //override TWEEN onComplete
            obj.__tween.onComplete(bind(_onComplete, obj.__tween));
            obj.__tween.onComplete = function(func){
                this.__onComplete = func;
                return this;
            };
            obj.__tween.__isAnimating = true;
            _onStart();
            return obj.__tween;
        }

        function kill(obj) {
            if(obj.__tween && obj.__tween.__isAnimating) {
                _onComplete.call(obj.__tween);
                TWEEN.remove(obj.__tween);
            }
        }

        function addDom(dom, defaultValues) {
            kill(dom);
            dom.__tweenObj = dom.__tweenObj || {};
            if(!dom.__tweenObj.__dom) dom.__tweenObj.__dom = dom;
            if(defaultValues) mixIn(dom.__tweenObj, defaultValues);
            dom.__tween =  add(dom.__tweenObj);
            return dom.__tween;
        }

        function _onStart(){
            if(TWEEN.getAll().length === 0) {
                stageReference.onRender.add(_onTWEENUpdate, null, null, null, -9999);
            }
        }

        function _onComplete(){
            if(this.__onComplete) this.__onComplete();
            if(TWEEN.getAll().length === 1) {
                stageReference.onRender.remove(_onTWEENUpdate, null, null, null, -9999);
            }
            this.__isAnimating = false;
        }

        function _onTWEENUpdate(){
            TWEEN.update();
        }

        function translateXY3DCallback(){
            this.__dom.style[_transform3DStyle] = 'translate3d(' + (this.x | 0) + 'px,' + (this.y | 0) + 'px,0)';
        }


        tweenHelper.add = add;
        tweenHelper.addDom = addDom;
        tweenHelper.kill = kill;
        tweenHelper.Easing = TWEEN.Easing;

        tweenHelper.translateXY3DCallback = translateXY3DCallback;

        return tweenHelper;

    }

);
