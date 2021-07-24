const cagesURL = "https://rabbit-api--test.herokuapp.com/api/cage/";
const cagesFILTER = "https://rabbit-api--test.herokuapp.com/api/cage/?";

var sidebar_filter = false;
var sidebar_filter_order;
var filter_order;

let filter_object = {
    "_f_farm_number": "&",
    "_f_status": "&",
    "_f_type": "&",
    "_f_number_rabbits_from": "&"
}

function getData(url) {
    const response = fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
}

function countResponse(obj_key, filter) {
    $('#count-results').remove()
    let obj_to_link = cagesFILTER;
    for (let key in filter_object) {
        if (key == obj_key && filter != filter_object[key]) {
            filter_object[key] = filter;
        }
        obj_to_link += filter_object[key]
    }
    getData(obj_to_link)
        .then((value) => {
            return value.json();
        })
        .then((data) => {
            $('#count-results').remove()
            $('#count-results-container').append(
                '<span id="count-results">(' + Object.keys(data).length + ')</span>'
            );
        })
    sidebar_filter_order = obj_to_link;
}

getData(cagesURL)
    .then((value) => {
        return value.json();
    })
    .then((data) => {
        $('#list-wrapper-loading').remove();
        var totalItems = Object.keys(data).length;
        var cage_type;
        var cage_status;

        for (var i = 0; i < totalItems; i++) {

            if (data[i].type == "M" && data[i].is_parallel === false) {
                cage_type = "МАТОЧНАЯ 1"
            } else if (data[i].type == "M" && data[i].is_parallel === true) {
                cage_type = "МАТОЧНАЯ 2"
            } else {
                cage_type = "ОТКОРМОЧНАЯ"
            }

            if (data[i].status[0] === undefined) {
                cage_status = "Убрано, Исправно"
            } else if (Object.keys(data[i].status).length == 2) {
                cage_status = "Треб. уборка, Треб. ремонт"
            } else if (data[i].status[0] == "R") {
                cage_status = "Треб. ремонт"
            } else if (data[i].status[0] == "C") {
                cage_status = "Треб. уборка"
            }

            $('.list-wrapper').append(
                '<div class="list-item">' +
                '<div class="left-item-body">' +
                '<label class="farm-select">' +
                '<input type="checkbox" id="selected-cage-id' + data[i].id + '" name="farm-checkbox">' +
                '<span></span>' +
                '</label>' +
                '<div class="v-wrapper">' +
                '<p>Ферма №' + data[i].farm_number + '</p>' +
                '</div>' +
                '</div>' +
                '<div class="middle-item-body">' +
                '<div class="v-wrapper">' +
                '<p>' + data[i].number + data[i].letter + '</p>' +
                '</div>' +
                '<div class="v-wrapper">' +
                '<div class="h-wrapper">' +
                '<p>' + cage_type + '</p>' +
                '</div>' +
                '</div>' +
                '<div class="v-wrapper">' +
                '<div class="h-wrapper">' +
                '<p class="kind">' + data[i].number_rabbits + '</p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="right-item-body cage-right-item-body">' +
                '<p>' + cage_status + '</p>' +
                '</div>' +
                '</div>'
            )
        }

        document.querySelector(".rightside-filter").addEventListener('change', function(e) {
            if (sidebar_filter) {
                $('#pagination-container>ul').remove();
                $('.list-item').remove()
                $('#list-wrapper').append(
                    '<div id="list-wrapper-loading" class="loading">' +
                    '<img src="/img/loading.gif">' +
                    '</div>'
                )

                console.log(filter_order)

                getData((filter_order += e.target.value))
                    .then((value) => {
                        return value.json();
                    })
                    .then((data) => {

                        $('#list-wrapper-loading').remove();
                        var totalItems = Object.keys(data).length;
                        var cage_type;
                        var cage_status;

                        for (var i = 0; i < totalItems; i++) {

                            if (data[i].type == "M" && data[i].is_parallel === false) {
                                cage_type = "МАТОЧНАЯ 1"
                            } else if (data[i].type == "M" && data[i].is_parallel === true) {
                                cage_type = "МАТОЧНАЯ 2"
                            } else {
                                cage_type = "ОТКОРМОЧНАЯ"
                            }

                            if (data[i].status[0] === undefined) {
                                cage_status = "Убрано, Исправно"
                            } else if (Object.keys(data[i].status).length == 2) {
                                cage_status = "Треб. уборка, Треб. ремонт"
                            } else if (data[i].status[0] == "R") {
                                cage_status = "Треб. ремонт"
                            } else if (data[i].status[0] == "C") {
                                cage_status = "Треб. уборка"
                            }

                            $('.list-wrapper').append(
                                '<div class="list-item">' +
                                '<div class="left-item-body">' +
                                '<label class="farm-select">' +
                                '<input type="checkbox" id="selected-cage-id' + data[i].id + '" name="farm-checkbox">' +
                                '<span></span>' +
                                '</label>' +
                                '<div class="v-wrapper">' +
                                '<p>Ферма №' + data[i].farm_number + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="middle-item-body">' +
                                '<div class="v-wrapper">' +
                                '<p>' + data[i].number + data[i].letter + '</p>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<div class="h-wrapper">' +
                                '<p>' + cage_type + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<div class="h-wrapper">' +
                                '<p class="kind">' + data[i].number_rabbits + '</p>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="right-item-body cage-right-item-body">' +
                                '<p>' + cage_status + '</p>' +
                                '</div>' +
                                '</div>'
                            )
                        }
                        var items = $(".list-wrapper .list-item");
                        var numItems = items.length;
                        var perPage = 10;

                        items.slice(perPage).hide();

                        $('#pagination-container').pagination({
                            items: numItems,
                            itemsOnPage: perPage,
                            prevText: "Предыдущая",
                            nextText: "Следующая",
                            onPageClick: function(pageNumber) {
                                var showFrom = perPage * (pageNumber - 1);
                                var showTo = showFrom + perPage;
                                items.hide().slice(showFrom, showTo).show();
                            }
                        });

                        var count = 0;
                        $(function() {
                            updateCount();
                            $('input[name=farm-checkbox]').change(function() {
                                updateCount(this.checked ? 1 : -1);
                            });
                            $('#invert').click(function(e) {
                                e = $('input[name=farm-checkbox]');
                                e.each(function(i, el) {
                                    el.checked = !el.checked;
                                });
                                updateCount(e.length - count - count);
                            });
                        });

                        function updateCount(a) {
                            count = a ? count + a : $('input[name=farm-checkbox]:checked').length;
                            $('#count').text(count);
                        }

                    });

            } else if (!sidebar_filter) {
                var sidebar_filter_order = cagesFILTER;
                $('#pagination-container>ul').remove();
                $('.list-item').remove()
                $('#list-wrapper').append(
                    '<div id="list-wrapper-loading" class="loading">' +
                    '<img src="/img/loading.gif">' +
                    '</div>'
                )

                getData((sidebar_filter_order += e.target.value))
                    .then((value) => {
                        return value.json()
                    })
                    .then((data) => {
                        $('#list-wrapper-loading').remove();
                        var totalItems = Object.keys(data).length;
                        var cage_type;
                        var cage_status;

                        for (var i = 0; i < totalItems; i++) {

                            if (data[i].type == "M" && data[i].is_parallel === false) {
                                cage_type = "МАТОЧНАЯ 1"
                            } else if (data[i].type == "M" && data[i].is_parallel === true) {
                                cage_type = "МАТОЧНАЯ 2"
                            } else {
                                cage_type = "ОТКОРМОЧНАЯ"
                            }

                            if (data[i].status[0] === undefined) {
                                cage_status = "Убрано, Исправно"
                            } else if (Object.keys(data[i].status).length == 2) {
                                cage_status = "Треб. уборка, Треб. ремонт"
                            } else if (data[i].status[0] == "R") {
                                cage_status = "Треб. ремонт"
                            } else if (data[i].status[0] == "C") {
                                cage_status = "Треб. уборка"
                            }

                            $('.list-wrapper').append(
                                '<div class="list-item">' +
                                '<div class="left-item-body">' +
                                '<label class="farm-select">' +
                                '<input type="checkbox" id="selected-cage-id' + data[i].id + '" name="farm-checkbox">' +
                                '<span></span>' +
                                '</label>' +
                                '<div class="v-wrapper">' +
                                '<p>Ферма №' + data[i].farm_number + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="middle-item-body">' +
                                '<div class="v-wrapper">' +
                                '<p>' + data[i].number + data[i].letter + '</p>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<div class="h-wrapper">' +
                                '<p>' + cage_type + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<div class="h-wrapper">' +
                                '<p class="kind">' + data[i].number_rabbits + '</p>' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="right-item-body cage-right-item-body">' +
                                '<p>' + cage_status + '</p>' +
                                '</div>' +
                                '</div>'
                            )
                        }
                        var items = $(".list-wrapper .list-item");
                        var numItems = items.length;
                        var perPage = 10;

                        items.slice(perPage).hide();

                        $('#pagination-container').pagination({
                            items: numItems,
                            itemsOnPage: perPage,
                            prevText: "Предыдущая",
                            nextText: "Следующая",
                            onPageClick: function(pageNumber) {
                                var showFrom = perPage * (pageNumber - 1);
                                var showTo = showFrom + perPage;
                                items.hide().slice(showFrom, showTo).show();
                            }
                        });

                        var count = 0;
                        $(function() {
                            updateCount();
                            $('input[name=farm-checkbox]').change(function() {
                                updateCount(this.checked ? 1 : -1);
                            });
                            $('#invert').click(function(e) {
                                e = $('input[name=farm-checkbox]');
                                e.each(function(i, el) {
                                    el.checked = !el.checked;
                                });
                                updateCount(e.length - count - count);
                            });
                        });

                        function updateCount(a) {
                            count = a ? count + a : $('input[name=farm-checkbox]:checked').length;
                            $('#count').text(count);
                        }
                    })
            }
        })

        document.querySelector(".count-filtered1").addEventListener('change', function(e) {
            let _f_farm_number = "&" + e.target.value;
            let o_key = "_f_farm_number"

            countResponse(o_key, _f_farm_number)
        });

        document.querySelector(".count-filtered2").addEventListener('change', function(e) {
            let _f_type = "&" + e.target.value;
            let o_key = "_f_type"

            countResponse(o_key, _f_type)
        });

        document.querySelector(".count-filtered3").addEventListener('change', function(e) {
            let _f_number_rabbits_from = e.target.value
            if (_f_number_rabbits_from === "") {
                _f_number_rabbits_from = "&";
            } else {
                _f_number_rabbits_from = "&number_rabbits_from=" + e.target.value;
            }
            let o_key = "_f_number_rabbits_from"

            countResponse(o_key, _f_number_rabbits_from)
        });

        document.querySelector(".count-filtered4").addEventListener('change', function(e) {
            if ($('.count-filtered4').prop('checked')) {
                _f_status = "&" + e.target.value
                if ($('.count-filtered4').prop('checked') && $('.count-filtered5').prop('checked')) {
                    _f_status = "&status=R,C"
                }
            } else if ($('.count-filtered5').prop('checked') && !$('.count-filtered4').prop('checked')) {
                _f_status = "&status=R"
            } else {
                _f_status = "&"
            }

            let o_key = "_f_status"

            countResponse(o_key, _f_status)
        });

        document.querySelector(".count-filtered5").addEventListener('change', function(e) {
            if ($('.count-filtered5').prop('checked')) {
                _f_status = "&" + e.target.value
                if ($('.count-filtered5').prop('checked') && $('.count-filtered4').prop('checked')) {
                    _f_status = "&status=R,C"
                }
            } else if ($('.count-filtered4').prop('checked') && !$('.count-filtered5').prop('checked')) {
                _f_status = "&status=C"
            } else {
                _f_status = "&"
            }

            let o_key = "_f_status"

            countResponse(o_key, _f_status)
        });

        $('.submit-btn').click(function() {
            $('#pagination-container>ul').remove();
            $('.list-item').remove()
            $('#list-wrapper').append(
                '<div id="list-wrapper-loading" class="loading">' +
                '<img src="/img/loading.gif">' +
                '</div>'
            )

            if(sidebar_filter_order === undefined){
                sidebar_filter_order = cagesFILTER;
            } else {
                filter_order = sidebar_filter_order;
            }

            sidebar_filter = true;

            getData(sidebar_filter_order)
                .then((value) => {
                    return value.json()
                })
                .then((data) => {
                    $('#list-wrapper-loading').remove();
                    var totalItems = Object.keys(data).length;
                    var cage_type;
                    var cage_status;

                    for (var i = 0; i < totalItems; i++) {

                        if (data[i].type == "M" && data[i].is_parallel === false) {
                            cage_type = "МАТОЧНАЯ 1"
                        } else if (data[i].type == "M" && data[i].is_parallel === true) {
                            cage_type = "МАТОЧНАЯ 2"
                        } else {
                            cage_type = "ОТКОРМОЧНАЯ"
                        }

                        if (data[i].status[0] === undefined) {
                            cage_status = "Убрано, Исправно"
                        } else if (Object.keys(data[i].status).length == 2) {
                            cage_status = "Треб. уборка, Треб. ремонт"
                        } else if (data[i].status[0] == "R") {
                            cage_status = "Треб. ремонт"
                        } else if (data[i].status[0] == "C") {
                            cage_status = "Треб. уборка"
                        }

                        $('.list-wrapper').append(
                            '<div class="list-item">' +
                            '<div class="left-item-body">' +
                            '<label class="farm-select">' +
                            '<input type="checkbox" id="selected-cage-id' + data[i].id + '" name="farm-checkbox">' +
                            '<span></span>' +
                            '</label>' +
                            '<div class="v-wrapper">' +
                            '<p>Ферма №' + data[i].farm_number + '</p>' +
                            '</div>' +
                            '</div>' +
                            '<div class="middle-item-body">' +
                            '<div class="v-wrapper">' +
                            '<p>' + data[i].number + data[i].letter + '</p>' +
                            '</div>' +
                            '<div class="v-wrapper">' +
                            '<div class="h-wrapper">' +
                            '<p>' + cage_type + '</p>' +
                            '</div>' +
                            '</div>' +
                            '<div class="v-wrapper">' +
                            '<div class="h-wrapper">' +
                            '<p class="kind">' + data[i].number_rabbits + '</p>' +
                            '</div>' +
                            '</div>' +
                            '</div>' +
                            '<div class="right-item-body cage-right-item-body">' +
                            '<p>' + cage_status + '</p>' +
                            '</div>' +
                            '</div>'
                        )
                    }
                    var items = $(".list-wrapper .list-item");
                    var numItems = items.length;
                    var perPage = 10;

                    items.slice(perPage).hide();

                    $('#pagination-container').pagination({
                        items: numItems,
                        itemsOnPage: perPage,
                        prevText: "Предыдущая",
                        nextText: "Следующая",
                        onPageClick: function(pageNumber) {
                            var showFrom = perPage * (pageNumber - 1);
                            var showTo = showFrom + perPage;
                            items.hide().slice(showFrom, showTo).show();
                        }
                    });

                    var count = 0;
                    $(function() {
                        updateCount();
                        $('input[name=farm-checkbox]').change(function() {
                            updateCount(this.checked ? 1 : -1);
                        });
                        $('#invert').click(function(e) {
                            e = $('input[name=farm-checkbox]');
                            e.each(function(i, el) {
                                el.checked = !el.checked;
                            });
                            updateCount(e.length - count - count);
                        });
                    });

                    function updateCount(a) {
                        count = a ? count + a : $('input[name=farm-checkbox]:checked').length;
                        $('#count').text(count);
                    }
                })
        })

        var items = $(".list-wrapper .list-item");
        var numItems = items.length;
        var perPage = 10;

        items.slice(perPage).hide();

        $('#pagination-container').pagination({
            items: numItems,
            itemsOnPage: perPage,
            prevText: "Предыдущая",
            nextText: "Следующая",
            onPageClick: function(pageNumber) {
                var showFrom = perPage * (pageNumber - 1);
                var showTo = showFrom + perPage;
                items.hide().slice(showFrom, showTo).show();
            }
        });

        var count = 0;
        $(function() {
            updateCount();
            $('input[name=farm-checkbox]').change(function() {
                updateCount(this.checked ? 1 : -1);
            });
            $('#invert').click(function(e) {
                e = $('input[name=farm-checkbox]');
                e.each(function(i, el) {
                    el.checked = !el.checked;
                });
                updateCount(e.length - count - count);
            });
        });

        function updateCount(a) {
            count = a ? count + a : $('input[name=farm-checkbox]:checked').length;
            $('#count').text(count);
        }
    })