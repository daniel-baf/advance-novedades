$(document).ready(function () {
    // Handle navigation clicks to show respective panels
    $('.nav-link').on('click', function (e) {
        var targetPanel = $(this).attr('href');
        $('.hide-me-panel').addClass('d-none');
        $(targetPanel).removeClass('d-none');
    });

    $('.close').click(function() {
        $(this).closest('.alert').alert('close');
    });


    // function to handle modals asyncronously
    function handleModal(modalId, action) {
        $(modalId).modal(action);
    }
});