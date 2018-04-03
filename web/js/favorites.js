(function (window){
    'use strict';

    window.THA = window.THA || {};

    var sStorageKey = 'favorite-restaurants';

    function getFavorites(){
        var aFavorites;

        aFavorites = window.JSON.parse(
            window.localStorage.getItem(sStorageKey)
        );

        if (aFavorites === null) {
            aFavorites = [];
        }

        return aFavorites;
    }

    window.THA.favorites = {
        'length': function () {
            return getFavorites().length;
        },
        'get': function () {
            return getFavorites();
        },
        'set': function(p_aFavorites){
            window.localStorage.setItem(
                sStorageKey,
                window.JSON.stringify(p_aFavorites)
            );
        }
    };
}(window));
