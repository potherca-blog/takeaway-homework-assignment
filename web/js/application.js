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
        $SearchFilter
    ;

    function displayAjaxError(p_oXHR, p_sStatus, p_sError) {
        THA.modal.showError({
            filename: 'Could not complete request',
            lineno: p_oXHR.url,
            message: p_oXHR.status + ' ' + p_sError
        }, 'AJAX Error');
    }

    function updateFavorites(p_$RestaurantList, p_aFavorites){
        if (p_aFavorites !== null) {
            p_aFavorites.forEach(function(p_sRestaurant){
                p_$RestaurantList.find('[data-restaurant-name="'+p_sRestaurant+'"]').attr('data-favorite', true);
            });
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
    }

    function updateUI(p_oData, p_sActiveItem, p_oSortMap) {
        return THA.list.populate(
            sRestaurantItemTemplate,
            p_oData.restaurants,
            p_oSortMap,
            oStateMap
        ).then(function (p_$List) {
            p_$List.find('[data-sort-option="' + p_sActiveItem + '"]')
                .find('.sort-option__value')
                .addClass('sort-option__value--is-active')
            ;

            $RestaurantList.append(p_$List);

            $('.restaurant-filters__tab--is-active').trigger('click');

            updateFavorites(p_$List, THA.favorites.get());

            $('.js-favorite-button').on('click', function (p_oEvent) {
                var $ActiveItem;

                $ActiveItem = $(p_oEvent.target);

                if($ActiveItem.is('.js-favorite-button') === false) {
                    $ActiveItem = $ActiveItem.parents('.js-favorite-button');
                }

                favoriteClickHandler($ActiveItem);
            });
        });
    }

    function sortItemClickHandler(p_$ActiveItem, p_$ListItems, p_oSortMap) {
        var sActiveItem;

        p_$ListItems.removeClass('is-active');

        p_$ActiveItem.addClass('is-active');

        sActiveItem = p_$ActiveItem.data('sort-option');

        THA.fetch.fetchList(sActiveItem, function () {
            $Loading.show();
            /*/ Clear out current list and search value /*/
            $RestaurantList.html('');
            $SearchFilter.val('');
        }).then(
            function (p_oData) {
                return updateUI(p_oData, sActiveItem, p_oSortMap);
            },
            displayAjaxError
        ).then(function(){
            /*/ Add search/filter functionality /*/
            $SearchFilter.filterFor('.restaurant-list__item',{
                sortItemSelector: '.card-header-title'
            });
        }).always(function () {
            $Loading.hide();
        });
    }

    function filterTabClickHandler(p_$ActiveItem, p_$TabFilters, p_sListItemSelector) {
        var sActiveState,$ListItems, $Show;

        $ListItems = $(p_sListItemSelector);

        p_$TabFilters.removeClass('restaurant-filters__tab--is-active');

        p_$ActiveItem.addClass('restaurant-filters__tab--is-active');

        sActiveState = p_$ActiveItem.text().trim();

        $Show = $ListItems.has('.card-footer-item:contains(' + sActiveState + ')');

        if (sActiveState === 'All') {
            $Show = $ListItems;
        }

        $ListItems.hide();
        $Show.show();
    }

    function attachtmlListItems(p_$ListItems, p_oSortMap, p_$Attach) {
        var $Previous = p_$Attach;

        p_$ListItems.each(function (p_iIndex, p_oListItem){
            var $ListItem;

            $ListItem = $(p_oListItem);

            $Previous.after($ListItem);

            $Previous = $ListItem;

            $ListItem.on('click', function (p_oEvent) {
                var $ActiveItem;

                $ActiveItem = $(p_oEvent.target);

                if($ActiveItem.data('sort-option') === undefined) {
                    $ActiveItem = $ActiveItem.parents('[data-sort-option]');
                }

                sortItemClickHandler($ActiveItem, p_$ListItems, p_oSortMap);
            });
        });

        return Promise.resolve(p_$ListItems);
    }

    function attachFilterTabs(p_$TabFilters) {
        $('.js-tab-filter-container').append(p_$TabFilters);

        p_$TabFilters.on('click', function (p_oEvent) {
            var $ActiveItem;

            $ActiveItem = $(p_oEvent.target);

            if($ActiveItem.is('.restaurant-filters__tab') === false) {
                $ActiveItem = $ActiveItem.parents('.restaurant-filters__tab');
            }

            filterTabClickHandler($ActiveItem, p_$TabFilters, '.restaurant-list__item');
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

    THA.filterTabs.populate(sFilterTabTemplate, oStateMap).then(
        function (p_$TabFilters) {
            attachFilterTabs(p_$TabFilters).then(function (p_$TabFilters) {
                p_$TabFilters.first().trigger('click');
            });
        }
    );

    THA.sortOptions.populate(sSortItemTemplate, oSortMap).then(
        function (p_$ListItems) {
            attachtmlListItems(
                p_$ListItems,
                oSortMap,
                $('.restaurant-filters .panel-heading')
            ).then(function (p_$ListItems) {
                p_$ListItems.first().trigger('click');
            });
        }
    );
}(window, jQuery, THA));

/*EOF*/
