$(document).ready(function() {

    $("#manual-select").click(function() {
        $("#auto-select-btn").toggleClass("hidden");
        $("#manual-select-btn").toggleClass("hidden");
    });

    $("#modal-manual-select").click(function() {
        $("#modal-auto-select-btn").toggleClass("hidden");
        $("#modal-manual-select-btn").toggleClass("hidden");
    });

});
