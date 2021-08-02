const cagesURL = "https://rabbit-api--test.herokuapp.com/api/cage/?";
const cagesFILTER = "https://rabbit-api--test.herokuapp.com/api/cage/?";

var sidebar_filter = false;
var sidebar_filter_order;
var filter_order;

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
            'Content-Type': 'application/json'
        }
    });
    return response;
}

function putData(url, body) {
    const response_put = fetch(url, {
        method: 'PUT',
        mode: 'cors',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
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
            'Content-type': 'application/json; charset=UTF-8'
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

                    $('.list-wrapper').append(
                        '<div class="list-item">' +
                        '<div class="left-item-body">' +
                        '<label class="farm-select">' +
                        '<input type="checkbox" id="selected-cage-id' + data.results[i].id + '" name="farm-checkbox">' +
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

                    $('.list-wrapper').append(
                        '<div class="list-item">' +
                        '<div class="left-item-body">' +
                        '<label class="farm-select">' +
                        '<input type="checkbox" id="selected-cage-id' + data.results[i].id + '" name="farm-checkbox">' +
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
                }
                DATA = data

                makePaginate(data)
            })
    }
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

            if(sidebar_filter_order === undefined){
                sidebar_filter_order = cagesFILTER;
            } else {
                filter_order = sidebar_filter_order;
            }

            sidebar_filter = true;

            showList(cagesURL)
        })
})