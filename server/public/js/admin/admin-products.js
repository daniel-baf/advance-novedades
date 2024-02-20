$(document).ready(function () {
    $('.unhide-input').change(function () {
        // display the input field
        let target_div = $(`#inputContainer${this.value}`);
        // toggle d-none class into target_div
        target_div.toggleClass('d-none');
    });

    $('#pledge-create-form').submit(function (e) {
        e.preventDefault();
        let form = $(this);
        let url = form.attr('action');
        let form_data = form.serialize();
        let _data = { name: form_data.new_pledge_name };
        console.log(form_data);
        console.log(_data);
        // $.ajax({
        //     type: "POST",
        //     url: url,
        //     data: data,
        //     success: function (response) {
        //         console.log(response);
        //         // if success, reload the page
        //         location.reload();
        //     }
        // });
    });
});