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

    function updateUI(p_oData, p_sActiveItem, p_oSortMap) {
        return THA.list.populate(
            sRestaurantItemTemplate,
            p_oData.restaurants,
            p_oSortMap
        ).then(function (p_$List) {
            p_$List.find('[data-sort-option="' + p_sActiveItem + '"]')
                .find('.sort-option__value')
                .addClass('sort-option__value--is-active')
            ;

            $RestaurantList.append(p_$List);
        });
    }

    function sortItemClickHandler(p_$ActiveItem, p_$ListItems, p_oSortMap) {
        var sActiveItem;

        if(p_$ActiveItem.data('sort-option') === undefined) {
            p_$ActiveItem = p_$ActiveItem.parents('[data-sort-option]');
        }

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

    function attachtmlListItems(p_$ListItems, p_oSortMap) {
        var $Previous = $('.restaurant-filters .panel-heading');

        p_$ListItems.each(function (p_iIndex, p_oListItem){
            var $ListItem;

            $ListItem = $(p_oListItem);

            $Previous.after($ListItem);

            $Previous = $ListItem;

            $ListItem.on('click', function (p_oEvent) {
                sortItemClickHandler($(p_oEvent.target), p_$ListItems, p_oSortMap);
            });
        });
    }

    /*/ Add error handling /*/
    window.addEventListener('error', function (p_oError) {
        THA.modal.showError(p_oError, 'Javascript Error');
    });

    /*/ Retrieve HTML templates /*/
    sRestaurantItemTemplate = $('#restaurant-item-template').html();
    sSortItemTemplate = $('#sortingOptions-item-template').html();

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
    $Loading = $('.loading-spinner');
    $RestaurantList = $('.restaurant-list');
    $SearchFilter = $('.js-search-filter');

    THA.sortOptions.populate(sSortItemTemplate, oSortMap).then(
        function (p_$ListItems) {

            attachtmlListItems(p_$ListItems, oSortMap);

            /*/ Load initial list /*/
            p_$ListItems.first().trigger('click');
        }
    );
}(window, jQuery, THA));

/*EOF*/
