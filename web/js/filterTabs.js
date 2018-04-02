(function (window, $, Mustache){
    'use strict';

    window.THA = window.THA || {};

    function populateTabs(p_sTemplate, p_oStateMap) {
        var aTabs, sRendered, $Tabs;

        aTabs = [];

        Mustache.parse(p_sTemplate);

        $.each(p_oStateMap, function (p_sState, p_oItem) {
            sRendered = Mustache.render(p_sTemplate, p_oItem);

            aTabs.push($(sRendered));
        });

        /* Convert the array of jQuery objects to a single jQuery object */
        $Tabs = aTabs.reduce($.merge);

        return Promise.resolve($Tabs);
    }

    window.THA.filterTabs = {
        populate: function (p_sTemplate, p_oStateMap) {
            return populateTabs(p_sTemplate, p_oStateMap);
        },
    };
}(window, jQuery, Mustache));
