/*global jQuery:false, THA:false */
/**
 * This file contains all of the logic that handles the user-interaction of the
 * sample application. This file is assumed to be added to the page LAST, so
 * that the DOM is guaranteed to be ready when this file is loaded.
 *
 * The variable naming scheme used in this code is an adaption of Systems
 * Hungarian which is explained at http://blog.pother.ca/VariableNamingConvention/
 */
(function(window, $, THA){

    'use strict';

    var oSortMap,
        oStateMap,
        sFilterTabTemplate,
        sRestaurantItemTemplate,
        sSortItemTemplate,
        $Loading,
        $RestaurantList,
        $SearchFilter,
        $ShowFavoritesButton
    ;

    // @FIXME: Favorites need to be sorted to the front of the queue

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

    function displayAjaxError(p_oXHR, p_sStatus, p_sError) {
        THA.modal.showError({
            filename: 'Could not complete request',
            lineno: p_oXHR.url,
            message: p_oXHR.status + ' ' + p_sError
        }, 'AJAX Error');
    }

    function markFavorites(p_$RestaurantList, p_aFavorites){
        if (p_aFavorites !== null) {
            p_aFavorites.forEach(function(p_sRestaurant){
                p_$RestaurantList.find('[data-restaurant-name="'+p_sRestaurant+'"]').attr('data-favorite', true);
            });
        }
    }

    function updateShowFavoriteButton(iFavCount){
        $ShowFavoritesButton.find('.js-favorites-count').text(iFavCount);

        if (iFavCount > 0) {
            $ShowFavoritesButton.show();
        } else {
            $ShowFavoritesButton.hide();
        }
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
            aFavorites = jQuery.grep(aFavorites, function(p_iItem) {
                return p_iItem !== sRestaurant;
            });
        }

        THA.favorites.set(aFavorites);

        p_$ActiveItem.attr('data-favorite', bActive);

        updateShowFavoriteButton(aFavorites.length);
    }

    function decorateListItem(p_oData, p_sActiveItem, p_oSortMap) {
        return THA.list.populate(
            sRestaurantItemTemplate,
            p_oData.restaurants,
            p_oSortMap,
            oStateMap
        ).then(function (p_$List) {
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

                $ActiveItem = $(p_oEvent.target);

                if($ActiveItem.is('.js-favorite-button') === false) {
                    $ActiveItem = $ActiveItem.parents('.js-favorite-button');
                }

                favoriteClickHandler($ActiveItem);
            });

            return Promise.resolve(p_$List);
        });
    }

    function fetchRestaurantList(p_$ActiveItem, p_$ListItems, p_oSortMap) {
        var sActiveItem;

        p_$ListItems.removeClass('is-active');

        p_$ActiveItem.addClass('is-active');

        sActiveItem = p_$ActiveItem.data('sort-option');

        /* @TODO: Rename THA.fetch to THA.RestaurantList  */
        return THA.fetch.fetchList(sActiveItem, function () {
            $Loading.show();
            /*/ Clear out current list and search value /*/
            $RestaurantList.html('');
            $SearchFilter.val('');
        }).then(
            function (p_oData) {
                return decorateListItem(p_oData, sActiveItem, p_oSortMap);
            },
            displayAjaxError
        ).then(function(p_$List){
            $RestaurantList.append(p_$List);

            /*/ Add search/filter functionality /*/
            $SearchFilter.filterFor('.restaurant-list__item',{
                sortItemSelector: '.card-header-title'
            });
        }).always(function () {
            $Loading.hide();
        });
    }

    function filterTabClickHandler(p_$ActiveItem, p_$TabFilters, p_$ListItems) {
        p_$TabFilters.removeClass('restaurant-filters__tab--is-active');

        p_$ActiveItem.addClass('restaurant-filters__tab--is-active');

        filterRestaurantList(p_$ListItems);
    }

    function attachtSortOptions(p_$SortOptions, p_oSortMap, p_$Attach) {
        var $Previous = p_$Attach;

        p_$SortOptions.each(function (p_iIndex, p_oSortOption){
            var $SortOption;

            $SortOption = $(p_oSortOption);

            $Previous.after($SortOption);

            $Previous = $SortOption;

            $SortOption.on('click', function (p_oEvent) {
                var $ActiveItem;

                $ActiveItem = $(p_oEvent.target);

                if($ActiveItem.data('sort-option') === undefined) {
                    $ActiveItem = $ActiveItem.parents('[data-sort-option]');
                }

                fetchRestaurantList($ActiveItem, p_$SortOptions, p_oSortMap)
                    .then(function (){
                        filterRestaurantList($('.restaurant-list__item'));
                    })
                ;
            });
        });

        return Promise.resolve(p_$SortOptions);
    }

    function attachFilterTabs(p_$TabFilters) {
        $('.js-tab-filter-container').append(p_$TabFilters);

        p_$TabFilters.on('click', function (p_oEvent) {
            var $ActiveItem;

            $ActiveItem = $(p_oEvent.target);

            if($ActiveItem.is('.restaurant-filters__tab') === false) {
                $ActiveItem = $ActiveItem.parents('.restaurant-filters__tab');
            }

            filterTabClickHandler($ActiveItem, p_$TabFilters, $('.restaurant-list__item'));
        });

        return Promise.resolve(p_$TabFilters);
    }

    /*/ Add error handling /*/
    window.addEventListener('error', function (p_oError) {
        THA.modal.showError(p_oError, 'Javascript Error');
    });

    /*/ Retrieve HTML templates /*/
    sRestaurantItemTemplate = $('#restaurant-item-template').html();
    sSortItemTemplate = $('#sortingOptions-item-template').html();
    sFilterTabTemplate = $('#filter-tab-template').html();

    /*/ Set up initial values /*/
    oSortMap = {
        topRestaurants: {
            'icon-type': 'fas',
            icon: 'utensils',
            label: 'Top Restaurant'
        },
        bestMatch: {
            'icon-type': 'fas',
            icon: 'crosshairs',
            label: 'Best Match'
        },
        newest: {
            'icon-type': 'fas',
            icon: 'certificate',
            label: 'Newest'
        },
        popularity: {
            'icon-type': 'fas',
            icon: 'thumbs-up',
            label: 'Popularity'
        },
        ratingAverage: {
            'icon-type': 'far',
            icon: 'star',
            label: 'Rating Average'
        },
        distance: {
            'icon-type': 'fas',
            icon: 'map-marker-alt',
            label: 'Distance'
        },
        minCost: {
            'icon-type': 'fas',
            icon: 'money-bill-alt',
            label: 'Minimum Costs'
        },
        deliveryCosts: {
            'icon-type': 'fas',
            icon: 'truck',
            label: 'Delivery Costs'
        },
        averageProductPrice: {
            'icon-type': 'fas',
            icon: 'shopping-basket',
            label: 'Average Product Price'
        },
    };
    oStateMap = {
        'all' : {
            color: 'info',
            label: 'All'
        },
        'open' :{
            color: 'success',
            icon: 'check-circle',
            label: 'Open'
        },
        'order ahead' :{
            color:'info',
            icon: 'phone',
            label: 'Order Ahead'
        },
        'closed' :{
            color:'danger',
            icon: 'times',
            label: 'Closed'
        }
    };

    $Loading = $('.loading-spinner');
    $RestaurantList = $('.restaurant-list');
    $SearchFilter = $('.js-search-filter');
    $ShowFavoritesButton = $('.js-show-favorites');

    $ShowFavoritesButton.on('click', function (p_oEvent) {
        $ShowFavoritesButton.toggleClass('show-favorites--is-active');
        filterRestaurantList($('.restaurant-list__item'));
    });

    updateShowFavoriteButton(THA.favorites.length());

    THA.filterTabs.populate(sFilterTabTemplate, oStateMap).then(
        function (p_$TabFilters) {
            attachFilterTabs(p_$TabFilters).then(function (p_$TabFilters) {
                p_$TabFilters.first().trigger('click');
            });
        }
    );

    THA.sortOptions.populate(sSortItemTemplate, oSortMap).then(
        function (p_$SortOptions) {
            attachtSortOptions(
                p_$SortOptions,
                oSortMap,
                $('.restaurant-filters .panel-heading')
            ).then(function (p_$SortOptions) {
                p_$SortOptions.first().trigger('click');
            });
        }
    );
}(window, jQuery, THA));

/*EOF*/
