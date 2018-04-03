(function (window, $, THA){
    'use strict';

    var $ShowFavoritesButton, $SortOptions, $TabFilters;

    function getTarget(p_oEvent, p_sSelector) {
        var $ActiveItem;

        $ActiveItem = $(p_oEvent.target);

        if($ActiveItem.is(p_sSelector) === false) {
            $ActiveItem = $ActiveItem.parents(p_sSelector);
        }

        return $ActiveItem;
    }

    function updateShowFavoriteButton(iFavCount){
        $ShowFavoritesButton.find('.js-favorites-count').text(iFavCount);

        if (iFavCount > 0) {
            $ShowFavoritesButton.show();
        } else {
            $ShowFavoritesButton
                .hide()
                .removeClass('show-favorites--is-active')
            ;
        }
    }

    function displayAjaxError(p_oXHR, p_sStatus, p_sError) {
        THA.modal.showError({
            filename: 'Could not complete request',
            lineno: p_oXHR.url,
            message: p_oXHR.status + ' ' + p_sError
        }, 'AJAX Error');
    }

    function favoriteClickHandler(p_$ActiveItem) {
        var aFavorites, bActive, sRestaurant;

        sRestaurant = p_$ActiveItem.data('restaurant-name');

        aFavorites = THA.favorites.get();

        if ($.inArray(sRestaurant, aFavorites) === -1) {
            bActive = true;
            aFavorites.push(sRestaurant);
        } else {
            bActive = false;
            aFavorites = $.grep(aFavorites, function(p_iItem) {
                return p_iItem !== sRestaurant;
            });
        }

        THA.favorites.set(aFavorites);

        p_$ActiveItem.attr('data-favorite', bActive);

        updateShowFavoriteButton(aFavorites.length);
    }

    function filterRestaurantList (p_$ListItems) {
        var bShowFavorites, sActiveState, $Show;

        bShowFavorites = $ShowFavoritesButton.hasClass('show-favorites--is-active');
        sActiveState = $('.restaurant-filters__tab--is-active').text().trim();

        $Show = p_$ListItems;

        if (sActiveState !== 'All') {
            $Show = $Show.has('.card-footer-item:contains(' + sActiveState + ')');
        }
        if (bShowFavorites === true) {
            $Show = $Show.has('[data-favorite="true"]');
        }

        p_$ListItems.hide();
        $Show.show();
    }

    function filterTabClickHandler(
        p_$ActiveItem,
        p_$ListItems
    ) {
        $TabFilters.removeClass('restaurant-filters__tab--is-active');

        p_$ActiveItem.addClass('restaurant-filters__tab--is-active');

        filterRestaurantList(p_$ListItems);
    }

    function markFavorites(p_$RestaurantList, p_aFavorites){
        if (p_aFavorites !== null) {
            p_aFavorites.forEach(function(p_sRestaurant){
                p_$RestaurantList
                    .find('[data-restaurant-name="'+p_sRestaurant+'"]')
                    .attr('data-favorite', true)
                ;
            });
        }
    }

    function decorateListItem(p_$List, p_sActiveItem) {
        /*/ Mark active sort-options as active /*/
        p_$List.find('[data-sort-option="' + p_sActiveItem + '"]')
            .find('.sort-option__value')
            .addClass('sort-option__value--is-active')
        ;

        /*/ Mark favorites as favorite /*/
        markFavorites(p_$List, THA.favorites.get());

        /*/ Add "favorite this" event handler /*/
        p_$List.find('.js-favorite-button').on('click', function (p_oEvent) {
            var $ActiveItem;

            $ActiveItem = getTarget(p_oEvent, '.js-favorite-button');

            favoriteClickHandler($ActiveItem);
        });

        return Promise.resolve(p_$List);
    }

    function attachFilterTabs() {
        $('.js-tab-filter-container').append($TabFilters);

        $TabFilters.on('click', function (p_oEvent) {
            var $ActiveItem;

            $ActiveItem = getTarget(p_oEvent, '.restaurant-filters__tab');

            filterTabClickHandler(
                $ActiveItem,
                $('.restaurant-list__item')
            );
        });
    }

    function attachtSortOptions(p_oSortMap, p_$Attach) {
        var $Previous = p_$Attach;

        $SortOptions.each(function (p_iIndex, p_oSortOption){
            var $SortOption;

            $SortOption = $(p_oSortOption);

            $Previous.after($SortOption);

            $Previous = $SortOption;
        });
    }

    window.THA.view = {
        attachFilterTabs: function () {
            return attachFilterTabs();
        },
        attachtSortOptions: function (p_oSortMap, p_$Attach) {
            return attachtSortOptions(p_oSortMap, p_$Attach);
        },
        decorateListItem: function (p_$List, p_sActiveItem) {
            return decorateListItem(p_$List, p_sActiveItem);
        },
        displayAjaxError: function (p_oXHR, p_sStatus, p_sError) {
            return displayAjaxError(p_oXHR, p_sStatus, p_sError);
        },
        filterRestaurantList: function (p_$ListItems) {
            return filterRestaurantList(p_$ListItems);
        },
        getTarget: function (p_oEvent, p_sSelector) {
            return getTarget(p_oEvent, p_sSelector);
        },
        updateShowFavoriteButton: function (iFavCount) {
            updateShowFavoriteButton(iFavCount);
        },
        setup: function (p_$ShowFavoritesButton, p_$SortOptions, p_$TabFilters) {
            $ShowFavoritesButton = p_$ShowFavoritesButton;
            $SortOptions = p_$SortOptions;
            $TabFilters = p_$TabFilters;
        },
    };
}(window, jQuery, window.THA));

