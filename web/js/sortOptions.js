(function (window, $, Mustache){
    'use strict';

    window.THA = window.THA || {};

    function populateList(p_oItems, p_sActiveItem, p_fClickHandler) {
        var aKey, oData, sRendered, sTemplate;

        sTemplate = $('#sortingValues-item-template').html();
        Mustache.parse(sTemplate);

        aKey = Object.keys(p_oItems).reverse();

        aKey.forEach(function (p_sKey) {
            oData = p_oItems[p_sKey];
            oData.key = p_sKey;
            oData.active = (p_sKey === p_sActiveItem);

            sRendered = Mustache.render(sTemplate, oData);

            var $Element = $(sRendered);

            $Element.on('click', p_fClickHandler);

            $('.restaurant-filters .panel-heading').after($Element);
        });
    }

    window.THA.sortOptions = {
        populate: function (p_aItems, p_sActiveItem, p_fClickHandler) {
            populateList(p_aItems, p_sActiveItem, p_fClickHandler);
        },
    };
}(window, jQuery, Mustache));
