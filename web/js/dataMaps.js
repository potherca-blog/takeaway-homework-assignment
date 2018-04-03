(function (window){
    'use strict';

    window.THA = window.THA || {};

    var oSortMap, oStateMap;

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

    window.THA.dataMaps = {
        sort: oSortMap,
        state: oStateMap
    };
}(window));
