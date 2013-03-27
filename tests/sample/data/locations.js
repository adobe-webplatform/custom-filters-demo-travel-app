define(function() {
    var LocationLabels = [
        {
            label: "The Abbey (club)"
        },
        {
            label: "Alameda Corridor"
        },
        {
            label: "Alex Theatre"
        },
        {
            label: "Ambassador Hotel (Los Angeles)"
        },
        {
            label: "Amoeba Music"
        },
        {
            label: "Andaz West Hollywood"
        },
        {
            label: "Anderton Court Shops"
        },
        {
            label: "Angels Flight"
        },
        {
            label: "Angelus Temple"
        },
        {
            label: "Los Angeles Aqueduct"
        },
        {
            label: "ArcLight Hollywood"
        },
        {
            label: "Avalon Hollywood"
        },
        {
            label: "Avenel Cooperative Housing Project"
        },
        {
            label: "The Abbey (club)"
        }
    ];

    var collection = new Backbone.Collection();
    collection.add(_.map(LocationLabels, function(item, i) {
        return new Backbone.Model(item).set("index", i);
    }));

    return collection;
});