(function (window, $){
    'use strict';

    window.THA = window.THA || {};

    function fetchList(p_sActiveItem, p_fBeforeSend) {
        var sApiUrl;

        sApiUrl = '/api/' + p_sActiveItem + '.json';

        return $.ajax(
            sApiUrl, {
                dataType: 'json',
                method: 'GET', /* use "type = 'GET'" for jQuery prior to 1.9.0.*/
                beforeSend: function(p_oXHR, p_oSettings) {
                    p_oXHR.url = p_oSettings.url;
                    p_fBeforeSend(p_oXHR, p_oSettings);
                }
            }
        );
    }

    window.THA.fetch = {
        fetchList: function (p_sActiveItem, p_fBeforeSend) {
            return fetchList(p_sActiveItem, p_fBeforeSend);
        },
    };
}(window, jQuery));
