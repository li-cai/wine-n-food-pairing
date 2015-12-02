// canvasModule.js
"use strict";

var app = app || {};

/**
 * Define the canvas module and immediately invoke it
 */
app.canvasModule = (function() {
    var animationId = 0,
        WINE_FOOD_MAP = {
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
            '#boldred': {
                color: '#96370a', 
                pairings: [
                    '#bread',
                    '#hardcheese',
                    '#steak',
                    '#salami'
                ],
            }
        },
        TOP_OFFSET = 25,
        BOTTOM_OFFSET = 370,
        canvas, ctx;

    function init() {
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext('2d');

        update();
    }

    function draw() {
        $.each(WINE_FOOD_MAP, function(wineID, attributes) {
            $.each(attributes.pairings, function(index, foodID) {
                var x1 = calculateLeft(wineID) - 12;
                var y1 = canvas.height + calculateTop(wineID);
                var x2 = calculateLeft(foodID) - 15;
                var y2 = TOP_OFFSET;

                ctx.strokeStyle = attributes.color;
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
        ctx.lineWidth = 2;
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

    function calculateTop(id) {
        return $(id).position().top - BOTTOM_OFFSET;
    }

    return {
        init: init,
    };
}());