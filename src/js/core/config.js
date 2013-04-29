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
        'jquery'
    ],
    function(config, $) {

        var undef;

        config.transitionStyle = Modernizr.prefixed('transition');
        config.animationStyle = Modernizr.prefixed('animation');
        config.transformStyle = Modernizr.prefixed('transform');
        config.transform3DStyle = Modernizr.csstransforms3d ? config.transformStyle : false;
        config.transformPerspectiveStyle = Modernizr.prefixed('perspective');
        config.isRetina = window.devicePixelRatio && window.devicePixelRatio >= 1.5;
        config.transformCSS2DStyle =  config.transformStyle ? config.transformStyle.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-') : false;
        config.transformCSS3DStyle =  Modernizr.csstransforms3d ? config.transformCSS2DStyle : false;
        config.isOldIE = $('html').hasClass('lt-ie9');
        config.hasTouch = $('html').hasClass('touch');
        config.opacity = Modernizr.opacity;
        config.filterStyle = Modernizr.__prefixedFilter;

        config.data = null;
        config.isIFrame = window.top !== window.self;

        return config;

    }
);
