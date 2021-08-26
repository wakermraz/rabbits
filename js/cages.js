const cagesURL = "https://rabbit-api--app.herokuapp.com/api/cage/?";
const cagesFILTER = "https://rabbit-api--app.herokuapp.com/api/cage/?";
let renewCageURL = "https://rabbit-api--app.herokuapp.com/api/cage/"
let getPlan = "https://rabbit-api--app.herokuapp.com/api/plan/?date="
let putPlan = "https://rabbit-api--app.herokuapp.com/api/plan/"

let counterForPlan = 0;
let planObj = {};
let current_plan

var sidebar_filter = false;
var sidebar_filter_order;
var filter_order;
let counter = 0;

let SELECTED = {}

let _f_farm_number,
    _f_type,
    _f_number_rabbits_from,
    _f_status

let FILTER = ""

let filter_object = {
    "_f_farm_number": "&",
    "_f_status": "&",
    "_f_type": "&",
    "_f_number_rabbits_from": "&"
}

function unlockCalendar() {
    if ($(".plan-checkbox").prop("checked") == false) {
        $(".planCreate-calendar").prop("disabled", false)
        $(".planCreate-calendar").prop("value", "")
    } else {
        $(".planCreate-calendar").prop("disabled", true)
        var today = new Date();
        var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
        var dayTomorrow = tomorrow.getDate();
        var monthTomorrow = tomorrow.getMonth() + 1; //в js месяц отсчитывается с нуля
        if (monthTomorrow < 10) {
            monthTomorrow = "0" + monthTomorrow
        }
        var yearTomorrow = tomorrow.getFullYear();
        let date = String(dayTomorrow) + "." + monthTomorrow + "." + yearTomorrow
        $(".planCreate-calendar").prop("value", date)
    }
}

function addPlan() {
    let date = $(".planCreate-calendar").val()
    let rabbitsNum = $(".planCreate-input").val()

    $(".planCreate-calendar").prop("value", "")
    $(".planCreate-input").prop("value", "")
    $(".plan-checkbox").prop("checked", false)
    $(".planCreate-calendar").prop("disabled", false)
    let dateForSend = date.replace(".", "-")
    dateForSend = dateForSend.replace(".", "-")

    dateForSend = dateForSend[6] + dateForSend[7] + dateForSend[8] + dateForSend[9] + dateForSend[5] + dateForSend[3] + dateForSend[4] + dateForSend[2] + dateForSend[0] + dateForSend[1]

    planObj[counterForPlan] = {
        "date": dateForSend,
        "quantity": rabbitsNum
    }

    $(".planModal-right-items").append(
        '<div class="planModal-right-item removable-plan' + counterForPlan + '">' +
        '<div class="v-wrapper">' +
        '<p>' + date + '</p>' +
        '</div>' +
        '<div class="v-wrapper">' +
        '<p>Убой</p>' +
        '</div>' +
        '<div class="v-wrapper">' +
        '<p>' + rabbitsNum + '</p>' +
        '</div>' +
        '<div class="v-wrapper">' +
        '<img onclick="deletePlanItem(' + counterForPlan + ')" src="/img/planCreate-delete-item.svg">' +
        '</div>' +
        '</div>'
    )

    counterForPlan++
}

function submitPlans(){
    for(key in planObj){
        postData(putPlan, planObj[key])
    }
    window.location.href = "#close"
    location.reload()
}

function deletePlanItem(id){
    $(".removable-plan" + id).remove()
    delete planObj[id]

}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

let tokenToQuery = getCookie('token')

var dateFormat = function() {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function(val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function(date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function(mask, utc) {
    return dateFormat(this, mask, utc);
};

function getData(url) {
    const response = fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': tokenToQuery
        }
    });
    return response;
}

function putData(url, body) {
    const response_put = fetch(url, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': tokenToQuery
        },
        body: JSON.stringify(body)
    });
    return response_put;
}

function postData(url, body) {
    const response_put = fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': tokenToQuery
        },
        body: JSON.stringify(body)
    });
    return response_put;
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
                '<span id="count-results">(' + data.count + ')</span>'
            );
        })
    sidebar_filter_order = obj_to_link;
}

function converFromCalendar(date) {
    date = date.replace(" ", "T")
    var res = "";
    date = date.replace(".", "-")
    date = date.replace(".", "-")
    res = date[6] + date[7] + date[8] + date[9] + date[5] + date[3] + date[4] + date[2] + date[0] + date[1] + date[10] + date[11] + date[12] + date[13] + date[14] + date[15]
    return res;
}

function convertToCalendar(date) {
    var res = "";
    date = date.replace("-", ".")
    date = date.replace("-", ".")
    res = date[8] + data[9] + date[7] + date[5] + date[6] + date[4] + date[0] + date[1] + date[2] + date[3]
    return res;
}

function showList(url, first = true) {
    if (!first) {
        getData(url + FILTER)
            .then((value) => {
                return value.json();
            })
            .then((data) => {
                $('#list-wrapper-loading').remove();
                $('.list-item').remove()
                var totalItems = Object.keys(data.results).length;
                var cage_type;
                var cage_status;

                for (var i = 0; i < totalItems; i++) {

                    if (data.results[i].type == "M" && data.results[i].is_parallel === false) {
                        cage_type = "МАТОЧНАЯ 1"
                    } else if (data.results[i].type == "M" && data.results[i].is_parallel === true) {
                        cage_type = "МАТОЧНАЯ 2"
                    } else {
                        cage_type = "ОТКОРМОЧНАЯ"
                    }

                    if (data.results[i].status[0] === undefined) {
                        cage_status = "Убрано, Исправно"
                    } else if (Object.keys(data.results[i].status).length == 2) {
                        cage_status = "Треб. уборка, Треб. ремонт"
                    } else if (data.results[i].status[0] == "R") {
                        cage_status = "Треб. ремонт"
                    } else if (data.results[i].status[0] == "C") {
                        cage_status = "Треб. уборка"
                    }

                    let send_status = data.results[i].status

                    $('.list-wrapper').append(
                        '<div class="list-item">' +
                        '<div class="left-item-body">' +
                        '<label class="farm-select">' +
                        '<input type="checkbox" onclick="saveCageState(this, ' + '\'' + send_status + '\'' + ')" value="' + data.results[i].id + '" id="selected-cage-id' + data.results[i].id + '" name="farm-checkbox">' +
                        '<span></span>' +
                        '</label>' +
                        '<div class="v-wrapper">' +
                        '<p>Ферма №' + data.results[i].farm_number + '</p>' +
                        '</div>' +
                        '</div>' +
                        '<div class="middle-item-body">' +
                        '<div class="v-wrapper">' +
                        '<p>' + data.results[i].number + data.results[i].letter + '</p>' +
                        '</div>' +
                        '<div class="v-wrapper">' +
                        '<div class="h-wrapper">' +
                        '<p>' + cage_type + '</p>' +
                        '</div>' +
                        '</div>' +
                        '<div class="v-wrapper">' +
                        '<div class="h-wrapper">' +
                        '<p class="kind">' + data.results[i].number_rabbits + '</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="right-item-body cage-right-item-body">' +
                        '<p>' + cage_status + '</p>' +
                        '</div>' +
                        '</div>'
                    )
                    for (let j = 0; j < Object.keys(SELECTED).length; j++) {
                        if (data.results[i].id == SELECTED[j].cage_id) {
                            $("#" + SELECTED[j].id).prop("checked", true)
                        }
                    }
                }
                DATA = data
            })
    } else {
        getData(url + FILTER)
            .then((value) => {
                return value.json();
            })
            .then((data) => {
                $('#list-wrapper-loading').remove();
                $('.list-item').remove()
                var totalItems = Object.keys(data.results).length;
                var cage_type;
                var cage_status;

                for (var i = 0; i < totalItems; i++) {

                    if (data.results[i].type == "M" && data.results[i].is_parallel === false) {
                        cage_type = "МАТОЧНАЯ 1"
                    } else if (data.results[i].type == "M" && data.results[i].is_parallel === true) {
                        cage_type = "МАТОЧНАЯ 2"
                    } else {
                        cage_type = "ОТКОРМОЧНАЯ"
                    }

                    if (data.results[i].status[0] === undefined) {
                        cage_status = "Убрано, Исправно"
                    } else if (Object.keys(data.results[i].status).length == 2) {
                        cage_status = "Треб. уборка, Треб. ремонт"
                    } else if (data.results[i].status[0] == "R") {
                        cage_status = "Треб. ремонт"
                    } else if (data.results[i].status[0] == "C") {
                        cage_status = "Треб. уборка"
                    }

                    let send_status = data.results[i].status

                    $('.list-wrapper').append(
                        '<div class="list-item">' +
                        '<div class="left-item-body">' +
                        '<label class="farm-select">' +
                        '<input type="checkbox" onclick="saveCageState(this, ' + '\'' + send_status + '\'' + ')" value="' + data.results[i].id + '" id="selected-cage-id' + data.results[i].id + '" name="farm-checkbox">' +
                        '<span></span>' +
                        '</label>' +
                        '<div class="v-wrapper">' +
                        '<p>Ферма №' + data.results[i].farm_number + '</p>' +
                        '</div>' +
                        '</div>' +
                        '<div class="middle-item-body">' +
                        '<div class="v-wrapper">' +
                        '<p>' + data.results[i].number + data.results[i].letter + '</p>' +
                        '</div>' +
                        '<div class="v-wrapper">' +
                        '<div class="h-wrapper">' +
                        '<p>' + cage_type + '</p>' +
                        '</div>' +
                        '</div>' +
                        '<div class="v-wrapper">' +
                        '<div class="h-wrapper">' +
                        '<p class="kind">' + data.results[i].number_rabbits + '</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="right-item-body cage-right-item-body">' +
                        '<p>' + cage_status + '</p>' +
                        '</div>' +
                        '</div>'
                    )
                    for (let j = 0; j < Object.keys(SELECTED).length; j++) {
                        if (data.results[i].id == SELECTED[j].cage_id) {
                            $("#" + SELECTED[j].id).prop("checked", true)
                        }
                    }
                }
                DATA = data

                makePaginate(data)
            })
    }
}

function saveCageState(e, status) {
    $("#count").empty()
    if ($("#" + e.id).prop("checked") == true) {
        SELECTED[counter] = {
            "id": e.id,
            "cage_id": e.value,
            "status": status
        }
        counter++
    } else {
        for (let i = 0; i < Object.keys(SELECTED).length; i++) {
            if (SELECTED[i].cage_id == e.value) {
                delete SELECTED[i]
                counter--
                break
            }
        }
    }
    $("#count").append(Object.keys(SELECTED).length)
}

function cageRepaired() {
    let status = {}
    for (let i = 0; i < Object.keys(SELECTED).length; i++) {
        if (SELECTED[i].status === "R,C" || SELECTED[i].status == "C,R") {
            status = {
                "status": ["C"]
            }
            SELECTED[i].status = "C"
        } else if (SELECTED[i].status === "R") {
            status = {
                "status": []
            }
            SELECTED[i].status = ""
        } else if (SELECTED[i].status === "C") {
            status = {
                "status": ["C"]
            }
            SELECTED[i].status = "C"
        } else if (SELECTED[i].status === ""){
            status = {
                "status": []
            }
            SELECTED[i].status = ""
        }
        putData((renewCageURL + SELECTED[i].cage_id + "/"), status)
    }
    $(".list-item").remove()
        $("#pagination-container").empty()
        $(".list-wrapper").append(
            '<div id="list-wrapper-loading" class="loading">' +
            '<img src="/img/loading.gif">' +
            '</div>'
        )
    showList(cagesURL)
}

function cageCleaned() {
    let status = {}
    for (let i = 0; i < Object.keys(SELECTED).length; i++) {
        if (SELECTED[i].status === "R,C" || SELECTED[i].status === "C,R") {
            status = {
                "status": ["R"]
            }
            SELECTED[i].status = "R"
        } else if (SELECTED[i].status === "R") {
            status = {
                "status": ["R"]
            }
            SELECTED[i].status = "R"
        } else if (SELECTED[i].status === "C") {
            status = {
                "status": []
            }
            SELECTED[i].status = ""
        } else if (SELECTED[i].status === ""){
            status = {
                "status": []
            }
            SELECTED[i].status = ""
        }
        putData((renewCageURL + SELECTED[i].cage_id + "/"), status)
    }
    $(".list-item").remove()
        $("#pagination-container").empty()
        $(".list-wrapper").append(
            '<div id="list-wrapper-loading" class="loading">' +
            '<img src="/img/loading.gif">' +
            '</div>'
        )
    showList(cagesURL)
}

function needRepair() {
    let status = {}
    for (let i = 0; i < Object.keys(SELECTED).length; i++) {
        if (SELECTED[i].status === "R,C" || SELECTED[i].status == "C,R") {
            status = {
                "status": ["R", "C"]
            }
            SELECTED[i].status = "R,C"
        } else if (SELECTED[i].status === "R") {
            status = {
                "status": ["R"]
            }
            SELECTED[i].status = "R"
        } else if (SELECTED[i].status === "C") {
            status = {
                "status": ["R", "C"]
            }
            SELECTED[i].status = "R,C"
        } else if (SELECTED[i].status === ""){
            status = {
                "status": ["R"]
            }
            SELECTED[i].status = "R"
        }   
        putData((renewCageURL + SELECTED[i].cage_id + "/"), status)
    }
    $(".list-item").remove()
        $("#pagination-container").empty()
        $(".list-wrapper").append(
            '<div id="list-wrapper-loading" class="loading">' +
            '<img src="/img/loading.gif">' +
            '</div>'
        )
    showList(cagesURL)
}

function needClean() {
    let status = {}
    for (let i = 0; i < Object.keys(SELECTED).length; i++) {
        if (SELECTED[i].status === "R,C" || SELECTED[i].status == "C,R") {
            status = {
                "status": ["R", "C"]
            }
            SELECTED[i].status = "R,C"
        } else if (SELECTED[i].status === "R") {
            status = {
                "status": ["R", "C"]
            }
            SELECTED[i].status = "R,C"
        } else if (SELECTED[i].status === "C") {
            status = {
                "status": ["C"]
            }
            SELECTED[i].status = "C"
        } else if (SELECTED[i].status === ""){
            status = {
                "status": ["C"]
            }
            SELECTED[i].status = "C"
        }
        putData((renewCageURL + SELECTED[i].cage_id + "/"), status)
    }
    $(".list-item").remove()
        $("#pagination-container").empty()
        $(".list-wrapper").append(
            '<div id="list-wrapper-loading" class="loading">' +
            '<img src="/img/loading.gif">' +
            '</div>'
        )
    showList(cagesURL)
}

function makePaginate(data) {
    let numItems = data.count
    let perPage = 10
    $('#pagination-container').pagination({
        items: numItems,
        itemsOnPage: perPage,
        prevText: "Предыдущая",
        nextText: "Следующая",
        onPageClick: function(pageNumber) {
            if (!FILTER) {
                showList(cagesURL + "&page=" + pageNumber, false)
            } else {
                showList(cagesURL + "&page=" + pageNumber, false, FILTER)
            }
        }
    });
}

$(document).ready(function() {
    showList(cagesURL)

    document.querySelector(".rightside-filter").addEventListener('change', function(e) {
        if (sidebar_filter) {
            $('#pagination-container>ul').remove();
            $('.list-item').remove()
            $('#list-wrapper').append(
                '<div id="list-wrapper-loading" class="loading">' +
                '<img src="/img/loading.gif">' +
                '</div>'
            )

            FILTER += e.target.value

            showList(cagesURL)
        } else if (!sidebar_filter) {
            $('#pagination-container>ul').remove();
            $('.list-item').remove()
            $('#list-wrapper').append(
                '<div id="list-wrapper-loading" class="loading">' +
                '<img src="/img/loading.gif">' +
                '</div>'
            )

            FILTER += e.target.value

            showList(cagesURL)
        }
    })

    document.querySelector(".count-filtered1").addEventListener('change', function(e) {
        let _f_farm_number = "&" + e.target.value;
        let o_key = "_f_farm_number"

        FILTER += _f_farm_number

        countResponse(o_key, _f_farm_number)
    });

    document.querySelector(".count-filtered2").addEventListener('change', function(e) {
        let _f_type = "&" + e.target.value;
        let o_key = "_f_type"

        FILTER += _f_type

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

        FILTER += _f_number_rabbits_from

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

        FILTER += _f_status

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

        FILTER += _f_status

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

        if (sidebar_filter_order === undefined) {
            sidebar_filter_order = cagesFILTER;
        } else {
            filter_order = sidebar_filter_order;
        }

        sidebar_filter = true;

        _f_farm_number = "&" + $(".count-filtered1").val()
        _f_type = "&" + $(".count-filtered2").val()
        if ($(".count-filtered3").val() == "") {
            _f_number_rabbits_from = "&"
        } else {
            _f_number_rabbits_from = "&number_rabbits_from=" + $(".count-filtered3").val()
        }

        if ($(".count-filtered4").prop("checked")) {
            _f_status = $(".count-filtered4").val()
        } else if ($(".count-filtered5").prop("checked")) {
            _f_status += $(".count-filtered5").val()
        } else {
            _f_status = "&"
        }


        FILTER = String(_f_farm_number) + _f_type + _f_number_rabbits_from + _f_status

        showList(cagesURL)
    })
})