// canvasModule.js
"use strict";

var app = app || {};

/**
 * Define the canvas module and immediately invoke it
 */
app.canvasModule = (function() {
    var animationId = 0,
        WINE_FOOD_MAP = {
            '#sparkling': [
                '#fish', 
                '#bread', 
                '#hardcheese', 
                '#cheese', 
                '#cabbage'
            ],
            '#drywhite': [
                '#cabbage',
                '#kebab',
                '#fish'
            ],
            '#sweetwhite': [
                '#cheese',
                '#hardcheese',
                '#salami',
                '#cupcake'
            ],
            '#richwhite': [
                '#cheese',
                '#bread',
                '#fish',
                '#crab',
                '#chicken'
            ],
            '#dessertwine': [
                '#cupcake',
                '#bread',
                '#salami'
            ],
            '#lightred': [
                '#crab',
                '#bread',
                '#chicken',
                '#kebab'
            ],
            '#mediumred': [
                '#kebab',
                '#cheese',
                '#bread',
                '#chicken',
                '#steak',
                '#salami'
            ],
            '#boldred': [
                '#bread',
                '#hardcheese',
                '#steak',
                '#salami'
            ],
        },
        TOP_OFFSET = 15,
        BOTTOM_OFFSET = 10,
        canvas, ctx;

    function init() {
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext('2d');

        update();
    }

    function draw() {
        $.each(WINE_FOOD_MAP, function(wineID, foods) {
            $.each(foods, function(index, foodID) {
                var x1 = calculateLeft(wineID) - 12;
                var y1 = canvas.height - BOTTOM_OFFSET;
                var x2 = calculateLeft(foodID) - 15;
                var y2 = TOP_OFFSET;

                drawConnection(x1, y1, x2, y2);                
            });
        });

        // ctx.beginPath();
        // ctx.arc(left, canvas.height - 10, 1, 0, Math.PI * 2, false);
        // ctx.closePath();
    }

    function drawConnection(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();

        ctx.strokeStyle = 'mediumSeaGreen';
        ctx.stroke();
    }

    function update() {
        animationId = requestAnimationFrame(update.bind(this));

        canvas.height = $(canvas).parent().height();
        draw();
    }

    function calculateLeft(id) {
        return $(id).position().left + ($(id).width() / 2);
    }

    return {
        init: init,
    };
}());