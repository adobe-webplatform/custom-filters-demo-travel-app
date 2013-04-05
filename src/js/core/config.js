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
