// canvasModule.js
"use strict";

var app = app || {};

/**
 * Define the canvas module and immediately invoke it
 */
app.canvasModule = (function() {
    var animationId = 0,
        canvas, ctx;

    function init() {
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext('2d');

        update();
    }

    function update() {
        animationId = requestAnimationFrame(update.bind(this));

        console.log($(canvas).parent().height());
        canvas.height = $(canvas).parent().height();
    }

    return {
        init: init,
    };
}());