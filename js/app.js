"use strict";

/**
 * If app exists use the existing copy
 * else create a new object literal
 */
var app = app || {};

window.onload = function() {
    app.main.canvasModule = app.canvasModule;
    app.main.init();
}

app.main = {
    YUMMLY_API_URL: 'http://api.yummly.com/v1/api/recipes?_app_id={0}&_app_key={1}',
    YUMMLY_API_ID: 'e4d75399',
    YUMMLY_API_KEY: '670a6497e397e2f8837a536ce46019ea',
    SNOOTH_API_URL: 'http://api.snooth.com/wines/?akey=',
    SNOOTH_API_KEY: 'scvnwdnxu9kvwl2aylpnz8dohqczmownq9h75igbrzur1i67',
    selectedItem: null,
    currentModal: null,
    canvasModule: null,

    init: function() {
        var that = this;

        console.log(this.canvasModule);
        this.canvasModule.init();

        var foods = $('#foodRow').children();
        $.each(foods, function(index, food) {
            $(food).click(function() {
                var foodValue = $(this).attr('value');
                $('#modalHeading').text(foodValue + ' Recipes');

                that.getRecipe(foodValue);

                that.selectedItem = this;
                that.showModal();
            });
        });

        var varietals = $('.wineVarietals').children();
        $.each(varietals, function(index, varietal) {
            $(varietal).click(function() {
                var varietalValue = $(this).attr('value');
                $('#modalHeading').text(varietalValue);

                that.getWine(varietalValue);

                that.selectedItem = $(this).parent().parent();
                that.showModal();
            });           
        });

        $('#backdrop').click(function() {
            that.hideModal();
        });

        $(window).resize(function() {
            if (that.currentModal && that.selectedItem) {
                that.displaySelectedItem();
                that.positionModal();
            }
        });
    },

    showModal: function() {
        this.currentModal = '#resultsModal';

        this.displaySelectedItem();
        this.positionModal();

        $('#backdrop').fadeIn();
        $('#resultsModal').fadeIn();
    },

    hideModal: function() {
        $('#backdrop').fadeOut();
        $(this.currentModal).fadeOut();
        $('#' + this.getCopyId()).fadeOut();
        $('#modalResults').empty();

        this.selectedItem = null;
        this.currentModal = null;
    },

    displaySelectedItem: function() {
        var copyIdName = this.getCopyId();
        console.log(copyIdName);
        var copyId = '#' + copyIdName;
        var itemOffset = $(this.selectedItem).offset();
        
        if (!$(copyId).length) {
            var copyElement = $(this.selectedItem).clone();
            $(copyElement).attr({
                'id': copyIdName,
                'class': 'selectedItemCopy'
            });

            $('body').append($(copyElement));
        }

        $(copyId).css({top: itemOffset.top, left: itemOffset.left});
        $(copyId).fadeIn();
    },

    positionModal: function() {
        var itemOffset = $(this.selectedItem).offset();
        var itemPosition = $(this.selectedItem).position();
        var modalWidth = $(this.currentModal).width();

        var adjustmentFactor = itemPosition.left < 550 ? 100 : -20 - modalWidth;

        $(this.currentModal).css({
            top: 75,
            left: itemOffset.left + adjustmentFactor
        });
    },

    getCopyId: function() {
        return $(this.selectedItem).attr('id') + 'Copy';
    },

    getRecipe: function(searchTerm) {
        var url = String.format(
            this.YUMMLY_API_URL,
            this.YUMMLY_API_ID,
            this.YUMMLY_API_KEY
        );

        this.getData(url, searchTerm, this.recipeLoaded.bind(this));
    },

    getWine: function(searchTerm) {
        var url = this.SNOOTH_API_URL + this.SNOOTH_API_KEY;

        this.getData(url, searchTerm, this.winesLoaded.bind(this));
    },

    getData: function(url, searchTerm, callback) {
        url += '&q=' + encodeURI(searchTerm);

        $.ajax({
            dataType: 'json',
            url: url,
            data: null,
            success: callback,
        });
    },

    populateModalResult: function(imageUrl, link, title, section1, section2) {
        var resultElement = document.createElement('div');
        $(resultElement).addClass('modalResult');
        
        var resultImage = document.createElement('div');
        $(resultImage).addClass('resultImage');
        if (imageUrl) {
            $(resultImage).css(
                'background-image', 
                'url(' + imageUrl + ')'
            );
        }
        $(resultElement).append($(resultImage));

        var resultDetail = document.createElement('div');
        $(resultDetail).addClass('resultDetail');

        var resultLink = document.createElement('a');
        $(resultLink).text(title);
        if (link) {
            $(resultLink).attr({
                'href': link,
                'target': '_blank'
            });
        }
        $(resultDetail).append($(resultLink));

        var resultInfo = document.createElement('div');
        $(resultInfo).addClass('resultInfo');
        $(resultInfo).text(section1);
        $(resultDetail).append($(resultInfo));

        var resultIngredients = document.createElement('div');
        $(resultIngredients).addClass('resultIngredients');
        $(resultIngredients).text(section2);
        $(resultDetail).append($(resultIngredients));

        $(resultElement).append($(resultDetail));

        $('#modalResults').append($(resultElement));

        return resultElement;     
    },

    winesLoaded: function(response) {
        var wines = response.wines;
        var that = this;

        console.log(wines);

        $.each(wines, function(index, wine) {
            var imageUrl = wine.image ? wine.image : null;
            var link = wine.link;
            var title = wine.name;
            var section1 = '$' + wine.price + ' ' + wine.region;
            var section2 = wine.varietal;

            var resultElement = that.populateModalResult(
                imageUrl, link, title, section1, section2
            );

            $(resultElement).click(function() {
                console.log('hallo');
            });
        });
    },

    recipeLoaded: function(response) {
        var recipes = response.matches;
        var that = this;

        // create result element
        $.each(recipes, function(index, recipe) {
            var imageUrl;
            if (recipe.smallImageUrls.length > 0) {
                imageUrl = recipe.smallImageUrls[0];
            }

            var title = recipe.recipeName;

            var section1 = String.format(
                '{0} Ingredients. {1} Minutes',
                recipe.ingredients.length,
                recipe.totalTimeInSeconds / 60
            );

            var section2 = recipe.ingredients.join(', ');

            that.populateModalResult(imageUrl, null, title, section1, section2);
        });
    },
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