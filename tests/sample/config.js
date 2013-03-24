requirejs.config({
    paths: {
        "mobileui": "../../src/"
    },
    urlArgs: "bust=" +  (new Date()).getTime()
});
require(["main"]);