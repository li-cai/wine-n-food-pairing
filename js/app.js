"use strict";

/**
 * If app exists use the existing copy
 * else create a new object literal
 */
var app = app || {};

window.onload = function() {
    app.main.init();
}

app.main = {
    YUMMLY_API_URL: 'http://api.yummly.com/v1/api/recipes?_app_id={0}&_app_key={1}',
    YUMMLY_API_ID: 'e4d75399',
    YUMMLY_API_KEY: '670a6497e397e2f8837a536ce46019ea',
    SNOOTH_API_URL: 'http://api.snooth.com/wines/?akey=',
    SNOOTH_API_KEY: 'scvnwdnxu9kvwl2aylpnz8dohqczmownq9h75igbrzur1i67',

    init: function() {
        var that = this;

        $('#fish').click(function() {
            that.getData('fish');
        });

        $('#cabbage').click(function() {
            that.getData('vegetables');
        });

        $('#cheese').click(function() {
            that.getData('cheese');
        });
    },

    getData: function(searchTerm) {
        var url = String.format(
            this.YUMMLY_API_URL,
            this.YUMMLY_API_ID,
            this.YUMMLY_API_KEY
        );

        url += '&?q=' + encodeURI(searchTerm);

        console.log(url);

        $.ajax({
            dataType: 'json',
            url: url,
            data: null,
            success: this.jsonLoaded,
        })
    },

    jsonLoaded: function(response) {
        console.log(JSON.stringify(response));
    }
}

/* http://stackoverflow.com/questions/610406/ */
String.format = function(format) {
    var args = Array.prototype.slice.call(arguments, 1);
    return format.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] != 'undefined'
            ? args[number] 
            : match
        ;
    });
};