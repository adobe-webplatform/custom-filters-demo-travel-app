define(['handlebars'], function (Handlebars) {

    Handlebars.registerHelper("each_with_index", function(array, opts) {
        var buffer = "";
        for (var i = 0, j = array.length; i < j; i++) {
            var item = array[i];
            item.index = i+1;
            buffer += opts.fn(item);
        }
        return buffer;
    });

});

