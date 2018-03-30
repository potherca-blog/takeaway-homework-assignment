(function (window, $, Mustache){
    'use strict';

    window.THA = window.THA || {};

    function populateList(p_sTemplate, p_oItems, p_sActiveItem) {
        var aListItems, oData, sRendered, $ListItems;

        aListItems = [];

        Mustache.parse(p_sTemplate);

        Object.keys(p_oItems).forEach(function (p_sKey) {

            oData = p_oItems[p_sKey];
            oData.key = p_sKey;
            oData.active = (p_sKey === p_sActiveItem);

            sRendered = Mustache.render(p_sTemplate, oData);

            aListItems.push($(sRendered));
        });

        /* Convert the array of jQuery objects to a single jQuery object */
        $ListItems = aListItems.reduce($.merge);

        return Promise.resolve($ListItems);
    }

    window.THA.sortOptions = {
        populate: function (p_sTemplate, p_aItems, p_sActiveItem) {
            return populateList(p_sTemplate, p_aItems, p_sActiveItem);
        },
    };
}(window, jQuery, Mustache));
