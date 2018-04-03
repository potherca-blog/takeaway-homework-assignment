(function (window, $, THA){
    'use strict';

    function getTarget(p_oEvent, p_sSelector) {
        var $ActiveItem;

        $ActiveItem = $(p_oEvent.target);

        if($ActiveItem.is(p_sSelector) === false) {
            $ActiveItem = $ActiveItem.parents(p_sSelector);
        }

        return $ActiveItem;
    }

    function updateShowFavoriteButton(p_$ShowFavoritesButton, iFavCount){
        p_$ShowFavoritesButton.find('.js-favorites-count').text(iFavCount);

        if (iFavCount > 0) {
            p_$ShowFavoritesButton.show();
        } else {
            p_$ShowFavoritesButton.hide();
        }
    }

    function displayAjaxError(p_oXHR, p_sStatus, p_sError) {
        THA.modal.showError({
            filename: 'Could not complete request',
            lineno: p_oXHR.url,
            message: p_oXHR.status + ' ' + p_sError
        }, 'AJAX Error');
    }

    function favoriteClickHandler(p_$ShowFavoritesButton, p_$ActiveItem) {
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

        updateShowFavoriteButton(p_$ShowFavoritesButton, aFavorites.length);
    }

    function filterRestaurantList (p_$ListItems, p_$ShowFavoritesButton) {
        var bShowFavorites, sActiveState, $Show;

        bShowFavorites = p_$ShowFavoritesButton.hasClass('show-favorites--is-active');
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
        p_$TabFilters,
        p_$ListItems,
        p_$ShowFavoritesButton
    ) {
        p_$TabFilters.removeClass('restaurant-filters__tab--is-active');

        p_$ActiveItem.addClass('restaurant-filters__tab--is-active');

        filterRestaurantList(p_$ListItems, p_$ShowFavoritesButton);
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

    function decorateListItem(p_$List, p_sActiveItem, p_$ShowFavoritesButton) {
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

            favoriteClickHandler(p_$ShowFavoritesButton, $ActiveItem);
        });

        return Promise.resolve(p_$List);
    }

    function attachFilterTabs(p_$TabFilters, p_$ShowFavoritesButton) {
        $('.js-tab-filter-container').append(p_$TabFilters);

        p_$TabFilters.on('click', function (p_oEvent) {
            var $ActiveItem;

            $ActiveItem = getTarget(p_oEvent, '.restaurant-filters__tab');

            filterTabClickHandler(
                $ActiveItem,
                p_$TabFilters,
                $('.restaurant-list__item'),
                p_$ShowFavoritesButton
            );
        });

        return Promise.resolve(p_$TabFilters);
    }

    function attachtSortOptions(p_$SortOptions, p_oSortMap, p_$Attach) {
        var $Previous = p_$Attach;

        p_$SortOptions.each(function (p_iIndex, p_oSortOption){
            var $SortOption;

            $SortOption = $(p_oSortOption);

            $Previous.after($SortOption);

            $Previous = $SortOption;
        });

        return Promise.resolve(p_$SortOptions);
    }

    window.THA.view = {
        attachFilterTabs: function (p_$TabFilters, p_$ShowFavoritesButton) {
            return attachFilterTabs(p_$TabFilters, p_$ShowFavoritesButton);
        },
        attachtSortOptions: function (p_$SortOptions, p_oSortMap, p_$Attach) {
            return attachtSortOptions(p_$SortOptions, p_oSortMap, p_$Attach);
        },
        decorateListItem: function (p_$List, p_sActiveItem, p_$ShowFavoritesButton) {
            return decorateListItem(p_$List, p_sActiveItem, p_$ShowFavoritesButton);
        },
        displayAjaxError: function (p_oXHR, p_sStatus, p_sError) {
            return displayAjaxError(p_oXHR, p_sStatus, p_sError);
        },
        filterRestaurantList: function (p_$ListItems, $ShowFavoritesButton) {
            return filterRestaurantList(p_$ListItems, $ShowFavoritesButton);
        },
        getTarget: function (p_oEvent, p_sSelector) {
            return getTarget(p_oEvent, p_sSelector);
        },
        updateShowFavoriteButton: function (p_$ShowFavoritesButton, iFavCount) {
            updateShowFavoriteButton(p_$ShowFavoritesButton, iFavCount);
        },
    };
}(window, jQuery, window.THA));

