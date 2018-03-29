(function (window, document, $, Mustache){
    "use strict";

    window.THA = window.THA || {};

    var oStatusMap = {
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

    function populateList(p_aItems, p_oSortMap, p_sActiveItem) {
        var oData, aSortItems, sRendered, sTemplate;

        sTemplate = $('#restaurant-item-template').html();

        Mustache.parse(sTemplate);

        p_aItems.forEach(function (p_oItem) {

            /*/ Populate sort-item values  /*/
            aSortItems = [];
            $.each(p_oSortMap, function (p_sKey, p_iValue){
                var oItem;

                oItem = p_iValue;
                oItem.value = p_oItem.sortingValues[p_sKey];
                oItem.style = p_sKey === p_sActiveItem ? 'info' : 'light';

                aSortItems.push(oItem);
            });

            oData = {
                name: p_oItem.name,
                status: oStatusMap[p_oItem.status],
                sortItems: aSortItems
            };

            sRendered = Mustache.render(sTemplate, oData);

            $('.restaurant-list').append(sRendered);
        });
    }

    window.THA.list = {
        populate: function (p_aItems, p_oSortMap, p_sActiveItem) {
            populateList(p_aItems, p_oSortMap, p_sActiveItem);
        },
    };
}(window, document, jQuery, Mustache));
