(function (window, document, $){
    'use strict';

    var $Modal;

    window.THA = window.THA || {};

    function showModal(p_sBody, p_sTitle) {
        $Modal.find('.modal-card-body').html(p_sBody);
        $Modal.find('.modal-card-title').html(p_sTitle);

        $Modal.show();
    }

    function hideModal() {
        $Modal.hide();

        $Modal.find('.modal-card-body').html('');
        $Modal.find('.modal-card-title').html('');
    }

    function setup () {
        if ($Modal === undefined) {
            var sHtml = '' +
                '<div class="modal">' +
                '  <div class="modal-background"></div>' +
                '  <div class="modal-card">' +
                '    <header class="modal-card-head">' +
                '      <p class="modal-card-title"></p>' +
                '      <button class="delete modal-close-button" aria-label="close"></button>' +
                '    </header>' +
                '    <section class="modal-card-body">' +
                '    </section>' +
                '    <footer class="modal-card-foot">' +
                // '      <button class="button is-success">Save changes</button>' +
                '      <button class="button modal-close-button">Close</button>' +
                '    </footer>' +
                '  </div>' +
                '  <button class="modal-close modal-close-button is-large " aria-label="close">' +
                '</button>' +
                '</div>'
            ;

            $Modal = $(sHtml);

            $(document.body).append($Modal);

            $Modal.find('.modal-background, .modal-close-button').on('click', function () {
                hideModal();
            });
        }
    }

    setup();

    window.THA.modal = {
        hide: function () {
            hideModal();
        },
        show: function (p_sBody, p_sTitle) {
            showModal(p_sBody, p_sTitle);
        }
    };
}(window, document, jQuery));