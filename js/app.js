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
    YUMMLY_API_URL: 'http://api.yummly.com/v1/api/',
    YUMMLY_API_AUTH: '?_app_id={0}&_app_key={1}',
    YUMMLY_API_SEARCH: 'recipes',
    YUMMLY_API_GET: 'recipe/',
    YUMMLY_API_ID: 'e4d75399',
    YUMMLY_API_KEY: '670a6497e397e2f8837a536ce46019ea',
    SNOOTH_API_URL: 'http://api.snooth.com/wines/?akey=',
    SNOOTH_API_KEY: 'scvnwdnxu9kvwl2aylpnz8dohqczmownq9h75igbrzur1i67',
    selectedItem: null,
    selectedVarietal: null,
    selectedVarietalCopy: null,
    currentModal: null,
    canvasModule: null,

    init: function() {
        var self = this;

        $('body').fadeIn();

        this.canvasModule.init();

        var foods = $('#foodRow').children();
        $.each(foods, function(index, food) {
            $(food).click(function() {
                if (!navigator.onLine) {
                    self.showOfflineModal();
                } else {
                    var foodValue = $(this).attr('value');
                    $('#modalHeading').text(foodValue + ' Recipes');

                    self.selectedItem = this;
                    self.getRecipe(foodValue);
                }
            });
        });

        var varietals = $('.wineVarietals').children();
        $.each(varietals, function(index, varietal) {
            $(varietal).click(function() {
                if (!navigator.onLine) {
                    self.showOfflineModal();
                } else {
                    var varietalValue = $(this).attr('value');
                    $('#modalHeading').text(varietalValue);

                    self.selectedItem = $(this).parent().parent();
                    self.selectedVarietal = this;

                    self.getWine(varietalValue);
                }
            });           
        });

        $('#graphIcon').click(function() {
            $('canvas').fadeToggle();
        });

        $('#backdrop').click(function() {
            self.hideModal();
        });

        $(window).resize(function() {
            if (self.currentModal && self.selectedItem) {
                self.displaySelectedItem();
                self.positionModal();
            }
        });
    },

    showOfflineModal: function() {
        this.currentModal = '#offlineModal';
        this.showModal();
    },

    showResultsModal: function() {
        this.currentModal = '#resultsModal';

        this.displaySelectedItem();
        this.positionModal();

        this.showModal();
    },

    showModal: function() {
        $('#backdrop').fadeIn();
        $(this.currentModal).fadeIn();
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
        var self = this;
        var copyIdName = this.getCopyId();
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

        var firstChild = $(copyId).children().first();
        if ($(firstChild).hasClass('wineVarietals')) {
            var varietals = $(firstChild).children();
            $.each(varietals, function(index, varietal) {
                if ($(varietal).attr('value') === $(self.selectedVarietal).attr('value')) {
                    self.toggleSelectedVarietal(varietal);
                }
                self.handleVarietalClick(varietal);
            });
        }

        $(copyId).css({top: itemOffset.top, left: itemOffset.left});
        $(copyId).fadeIn();
    },

    toggleSelectedVarietal: function(selected) {
        $(this.selectedVarietalCopy).removeClass('is-selected');
        $(selected).addClass('is-selected');
        this.selectedVarietalCopy = selected;
    },

    handleVarietalClick: function(varietal) {
        var self = this;
        $(varietal).click(function() {
            self.toggleSelectedVarietal(this);

            var varietalValue = $(this).attr('value');
            $('#modalHeading').text(varietalValue);
            $('#modalResults').fadeOut();
            self.getWine(varietalValue);
        });
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
        var url = this.YUMMLY_API_URL + this.YUMMLY_API_SEARCH;
        url += String.format(
            this.YUMMLY_API_AUTH,
            this.YUMMLY_API_ID,
            this.YUMMLY_API_KEY
        );

        this.getData(url, searchTerm, this.recipesLoaded.bind(this));
    },

    getWine: function(searchTerm) {
        var url = this.SNOOTH_API_URL + this.SNOOTH_API_KEY;

        this.getData(url, searchTerm, this.winesLoaded.bind(this));
    },

    getData: function(url, searchTerm, callback) {
        var self = this;

        if (searchTerm) {
            url += '&q=' + encodeURI(searchTerm);
        }

        $.ajax({
            dataType: 'json',
            async: false,
            url: url,
            data: null,
            success: callback,
            error: function(xhr, textStatus, error) {
                self.showOfflineModal();
            },
        });
    },

    winesLoaded: function(response) {
        var wines = response.wines;
        var self = this;

        this.showResultsModal();

        $.each(wines, function(index, wine) {
            var imageUrl = wine.image ? wine.image : null;
            var link = wine.link;
            var title = wine.name;
            var section1 = '$' + wine.price + ' ' + wine.varietal;
            var section2 = wine.vintage + ' ' + wine.region.replace(/ >/g, ',');

            $('#modalResults').fadeIn();

            var resultElement = self.populateModalResult(
                null, imageUrl, link, title, section1, section2
            );

            $(resultElement).click(function() {
                console.log('hallo');
            });
        });
    },

    recipesLoaded: function(response) {
        var recipes = response.matches;
        var self = this;

        this.showResultsModal();

        // create result element
        $.each(recipes, function(index, recipe) {
            var id = recipe.id;

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

            self.populateModalResult(
                id, imageUrl, null, title, section1, section2
            );
        });
    },

    recipeLoaded: function(response) {
        var recipeUrl = response.source.sourceRecipeUrl;
        if (recipeUrl) {
            window.open(recipeUrl, '_blank');
        }
    },

    populateModalResult: function(id, imageUrl, link, title, section1, section2) {
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
        } else {
            this.handleRecipeLinkClick(resultLink, id);
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

    handleRecipeLinkClick: function(element, recipeId) {
        var self = this;
        var url = this.YUMMLY_API_URL + this.YUMMLY_API_GET + recipeId;
        url += String.format(
            this.YUMMLY_API_AUTH,
            this.YUMMLY_API_ID,
            this.YUMMLY_API_KEY
        );

        $(element).click(function(e) {
            e.preventDefault();
            self.getData(url, null, self.recipeLoaded.bind(self));
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