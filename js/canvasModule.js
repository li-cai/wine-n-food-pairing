// canvasModule.js
"use strict";

var app = app || {};

/**
 * Define the canvas module and immediately invoke it
 */
app.canvasModule = (function() {
    var animationId = 0,
        WINE_FOOD_MAP = {
            '#drywhite': {
                color: '#7e875a',
                pairings: [
                '#cabbage',
                '#kebab',
                '#fish'
                ],
            },
            '#sweetwhite': {
                color: '#7e875a',
                pairings: [
                    '#cheese',
                    '#hardcheese',
                    '#salami',
                    '#cupcake'
                ],
            },
            '#richwhite': {
                color: '#dab153',
                pairings: [
                    '#cheese',
                    '#bread',
                    '#fish',
                    '#crab',
                    '#chicken'
                ],
            },
            '#dessertwine': {
                color: '#e58423', 
                pairings: [
                    '#cupcake',
                    '#bread',
                    '#salami'
                ],
            },
            '#lightred': {
                color: '#f04e26', 
                pairings: [
                    '#crab',
                    '#bread',
                    '#chicken',
                    '#kebab'
                ],
            },
            '#mediumred': {
                color: '#a73f12',
                pairings: [
                    '#kebab',
                    '#cheese',
                    '#bread',
                    '#chicken',
                    '#steak',
                    '#salami'
                ],
            },
            '#sparkling': {
                color: '#7eb9ab',
                pairings: [
                    '#fish',
                    '#bread',
                    '#hardcheese',
                    '#cheese',
                    '#cabbage'
                ],
            },
            '#boldred': {
                color: '#96370a', 
                pairings: [
                    '#bread',
                    '#hardcheese',
                    '#steak',
                    '#salami'
                ],
            },
        },
        foodMap = {},
        FOOD_X_SPACING = 10,
        FOOD_X_OFFSET = 15,
        FOOD_Y_OFFSET = 25,
        WINE_X_OFFSET = 12,
        WINE_Y_OFFSET = 370,
        canvas, ctx;

    function init() {
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext('2d');

        update();
    }

    function draw() {
        foodMap = {};

        $.each(WINE_FOOD_MAP, function(wineID, attributes) {
            $.each(attributes.pairings, function(index, foodID) {
                var x1 = calculateWineX(wineID);
                var y1 = calculateWineY(wineID);
                var x2 = calculateFoodX(foodID);
                var y2 = calculateFoodY(foodID);

                ctx.strokeStyle = attributes.color;
                ctx.fillStyle = attributes.color;

                drawConnection(x1, y1, x2, y2);
                drawDot(x2, y2, 4);
            });
        });
    }

    function drawConnection(x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function drawDot(x, y, r) {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
    }

    function update() {
        animationId = requestAnimationFrame(update.bind(this));

        canvas.height = $(canvas).parent().height();
        draw();
    }

    function calculateCenterX(id) {
        return $(id).position().left + ($(id).width() / 2);
    }

    function calculateWineX(id) {
        return calculateCenterX(id) - WINE_X_OFFSET;
    }

    function calculateWineY(id) {
        var offset = $('#dessertwine').position().top + 2;
        return canvas.height + $(id).position().top - offset;
    }

    function calculateFoodX(id) {
        var offset = FOOD_X_SPACING;

        if (foodMap[id]) {
            foodMap[id] += 1;
        } else {
            foodMap[id] = 1;
        }

        offset *= foodMap[id] % 2 == 0 ? 1 : -1;
        offset *= Math.floor(foodMap[id] / 2);

        return calculateCenterX(id) - FOOD_X_OFFSET + offset;
    }

    function calculateFoodY(id) {
        return FOOD_Y_OFFSET;
    }

    return {
        init: init,
    };
}());