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

    var
        sFilterTabTemplate,
        sRestaurantItemTemplate,
        sSortItemTemplate,
        $Loading,
        $RestaurantList,
        $SearchFilter,
        $ShowFavoritesButton
    ;

    function fetchRestaurantList(p_$ActiveItem, p_$ListItems, p_oSortMap) {
        var sActiveItem;

        p_$ListItems.removeClass('is-active');

        p_$ActiveItem.addClass('is-active');

        sActiveItem = p_$ActiveItem.data('sort-option');

        return THA.restaurantList.fetchList(sActiveItem, function () {
            $Loading.show();
            /*/ Clear out current list and search value /*/
            $RestaurantList.html('');
            $SearchFilter.val('');
        }).then(
            function (p_oData) {
                return THA.list.populate(
                    sRestaurantItemTemplate,
                    p_oData.restaurants,
                    p_oSortMap,
                    THA.dataMaps.state
                );
            },
            THA.view.displayAjaxError
        ).then(function(p_$List) {
            return THA.view.decorateListItem(p_$List, sActiveItem);
        }).then(function(p_$List) {

            $RestaurantList.append(p_$List);

            /*/ Move favorites to the top of the list /*/
            $RestaurantList.prepend(p_$List.has('[data-favorite="true"]'));

            /*/ Add search/filter functionality /*/
            $SearchFilter.filterFor('.restaurant-list__item',{
                sortItemSelector: '.card-header-title'
            });
        }).always(function () {
            $Loading.hide();
        });
    }

    /*/ Add error handling /*/
    window.addEventListener('error', function (p_oError) {
        THA.modal.showError(p_oError, 'Javascript Error');
    });

    /*/ Retrieve HTML templates /*/
    sRestaurantItemTemplate = $('#restaurant-item-template').html();
    sSortItemTemplate = $('#sortingOptions-item-template').html();
    sFilterTabTemplate = $('#filter-tab-template').html();

    $Loading = $('.loading-spinner');
    $RestaurantList = $('.restaurant-list');
    $SearchFilter = $('.js-search-filter');
    $ShowFavoritesButton = $('.js-show-favorites');

    $ShowFavoritesButton.on('click', function () {
        $ShowFavoritesButton.toggleClass('show-favorites--is-active');
        THA.view.filterRestaurantList($('.restaurant-list__item'));
    });

    Promise.all([
        THA.filterTabs.populate(sFilterTabTemplate, THA.dataMaps.state),
        THA.sortOptions.populate(sSortItemTemplate, THA.dataMaps.sort)
    ]).then(function(p_aPromiseValues) {
        var $TabFilters = p_aPromiseValues.shift();
        var $SortOptions = p_aPromiseValues.shift();

        THA.view.setup($ShowFavoritesButton, $TabFilters);

        THA.view.attachFilterTabs();

        THA.view.attachtSortOptions(
            $SortOptions,
            THA.dataMaps.sort,
            $('.restaurant-filters .panel-heading')
        ).then(function (p_$SortOptions) {
            p_$SortOptions.on('click', function (p_oEvent) {
                var $ActiveItem;

                $ActiveItem =  THA.view.getTarget(p_oEvent, '[data-sort-option]');

                fetchRestaurantList(
                        $ActiveItem,
                        p_$SortOptions,
                        THA.dataMaps.sort
                    ).then(function (){
                        THA.view.filterRestaurantList(
                            $('.restaurant-list__item')
                        );
                    })
                ;
            });

            p_$SortOptions.first().trigger('click');
        });

        /*/ Set up initial state /*/
        THA.view.updateShowFavoriteButton(THA.favorites.length());
        $TabFilters.first().trigger('click');
    });

}(window, jQuery, THA));

/*EOF*/
