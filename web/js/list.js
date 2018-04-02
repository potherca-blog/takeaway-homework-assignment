(function (window, $, Mustache){
    'use strict';

    window.THA = window.THA || {};

    function populateList(p_sTemplate, p_aItems, p_oSortMap, p_oStateMap) {
        var oData, aListItems, aSortItems, sRendered, $ListItems;

        aListItems = [];

        Mustache.parse(p_sTemplate);

        p_aItems.forEach(function (p_oItem) {

            aSortItems = [];

            $.each(p_oSortMap, function (p_sKey, p_iValue){
                var oItem;

                oItem = p_iValue;
                oItem.value = p_oItem.sortingValues[p_sKey];
                oItem.key = p_sKey;

                aSortItems.push(oItem);
            });

            oData = {
                name: p_oItem.name,
                status: p_oStateMap[p_oItem.status],
                sortItems: aSortItems
            };

            sRendered = Mustache.render(p_sTemplate, oData);

            aListItems.push($(sRendered));
        });

        /* Convert the array of jQuery objects to a single jQuery object */
        $ListItems = aListItems.reduce($.merge);

        return Promise.resolve($ListItems);
    }

    window.THA.list = {
        populate: function (p_sTemplate, p_aItems, p_oSortMap, p_oStateMap) {
            return populateList(p_sTemplate, p_aItems, p_oSortMap, p_oStateMap);
        },
    };
}(window, jQuery, Mustache));
