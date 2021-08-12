let tasksURL = "https://rabbit-api--test.herokuapp.com/api/task/anonymous/";
let users = "https://rabbit-api--test.herokuapp.com/api/user/?"

let FILTER = ""
let EXECUTORS = {}
let counter = 0

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
    res = date[8] + date[9] + date[7] + date[5] + date[6] + date[4] + date[0] + date[1] + date[2] + date[3]
    return res;
}

function showList(url, first = true) {
    if (!first) {
        getData(users)
            .then((value) => {
                return value.json()
            })
            .then((data) => {

                let user_list = ""
                let totalItems = Object.keys(data.results).length

                for (let i = 0; i < totalItems; i++) {
                    user_list += '<option value="' + data.results[i].id + '">' + data.results[i].username + '</option>'
                }

                getData(url + FILTER)
                    .then((value) => {
                        return value.json();
                    })
                    .then((data) => {
                        $('#list-wrapper-loading').remove();
                        $('.list-item').remove()
                        var totalItems = Object.keys(data.results).length;
                        let task_name;

                        for (var i = 0; i < totalItems; i++) {

                            if (data.results[i].type == "R") {
                                task_name = "<p>Отсадка (смена типа: ОТКОРМОЧНЫЙ → РАЗМНОЖЕНИЕ) → <font style='font-weight:700'>" + data.results[i].cage_from.farm_number + data.results[i].cage_from.number + data.results[i].cage_from.letter + " → " + data.results[i].cage_to.farm_number + data.results[i].cage_to.number + data.results[i].cage_to.letter + "</font></p>"
                            } else if (data.results[i].type == "F") {
                                task_name = "<p>Отсадка (смена типа: РАЗМНОЖЕНИЕ → ОТКОРМОЧНЫЙ) → <font style='font-weight:700'>" + data.results[i].cage_from.farm_number + data.results[i].cage_from.number + data.results[i].cage_from.letter + " → " + data.results[i].cage_to.farm_number + data.results[i].cage_to.number + data.results[i].cage_to.letter + "</font></p>"
                            } else if (data.results[i].type == "M") {
                                task_name = "<p>Размножение → <font style='font-weight:700'>" + data.results[i].father_cage.farm_number + data.results[i].father_cage.number + data.results[i].father_cage.letter + " → " + data.results[i].mother_cage.farm_number + data.results[i].mother_cage.number + data.results[i].mother_cage.letter + "</font></p>"
                            } else if (data.results[i].type == "B") {
                                task_name = "<p>Отсадка от матери → <font style='font-weight:700'>" + data.results[i].cage_from.farm_number + data.results[i].cage_from.number + data.results[i].cage_from.letter + " (" + data.results[i].number_bunnies + " кр.)" + " → " + data.results[i].male_cage_to.farm_number + data.results[i].male_cage_to.number + data.results[i].male_cage_to.letter + "(M) → " + data.results[i].female_cage_to.farm_number + data.results[i].female_cage_to.number + data.results[i].female_cage_to.letter + " (Ж)</font></p>"
                            } else if (data.results[i].type == "V") {
                                task_name = "<p>Вакцинация → <font style='font-weight:700'>" + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + "</font></p>"
                            } else if (data.results[i].type == "I") {
                                task_name = "<p>Осмотр перед убоем → <font style='font-weight:700'>" + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + "</font></p>"
                            } else if (data.results[i].type == "S") {
                                task_name = "<p>Убой → <font style='font-weight:700'>" + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + "</font></p>"
                            }

                            $('.list-wrapper').append(
                                '<div class="list-item">' +
                                '<div class="left-item-body">' +
                                '<p class="task-date">' + convertToCalendar(data.results[i].created_at) + '</p>' +
                                '</div>' +
                                '<div class="middle-item-body">' +
                                '<div class="v-wrapper">' +
                                '<p>' + task_name + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="right-item-body cage-right-item-body">' +
                                '<select id="' + data.results[i].id + '" class="rightside-filter choose-executor" onchange="saveExecutor(this)">' +
                                '<option value="0">Не выбрано</option>' +
                                user_list +
                                '</select>' +
                                '</div>' +
                                '</div>'
                            )
                        }
                        DATA = data

                        makePaginate(data)
                    })
            })
    } else {
        getData(users)
            .then((value) => {
                return value.json()
            })
            .then((data) => {

                let user_list = ""
                let totalItems = Object.keys(data.results).length

                for (let i = 0; i < totalItems; i++) {
                    user_list += '<option value="' + data.results[i].id + '">' + data.results[i].username + '</option>'
                }

                getData(url + FILTER)
                    .then((value) => {
                        return value.json();
                    })
                    .then((data) => {
                        $('#list-wrapper-loading').remove();
                        $('.list-item').remove()
                        var totalItems = Object.keys(data.results).length;
                        let task_name;

                        for (var i = 0; i < totalItems; i++) {

                            if (data.results[i].type == "R") {
                                task_name = "<p>Отсадка (смена типа: ОТКОРМОЧНЫЙ → РАЗМНОЖЕНИЕ) → <font style='font-weight:700'>" + data.results[i].cage_from.farm_number + data.results[i].cage_from.number + data.results[i].cage_from.letter + " → " + data.results[i].cage_to.farm_number + data.results[i].cage_to.number + data.results[i].cage_to.letter + "</font></p>"
                            } else if (data.results[i].type == "F") {
                                task_name = "<p>Отсадка (смена типа: РАЗМНОЖЕНИЕ → ОТКОРМОЧНЫЙ) → <font style='font-weight:700'>" + data.results[i].cage_from.farm_number + data.results[i].cage_from.number + data.results[i].cage_from.letter + " → " + data.results[i].cage_to.farm_number + data.results[i].cage_to.number + data.results[i].cage_to.letter + "</font></p>"
                            } else if (data.results[i].type == "M") {
                                task_name = "<p>Размножение → <font style='font-weight:700'>" + data.results[i].father_cage.farm_number + data.results[i].father_cage.number + data.results[i].father_cage.letter + " → " + data.results[i].mother_cage.farm_number + data.results[i].mother_cage.number + data.results[i].mother_cage.letter + "</font></p>"
                            } else if (data.results[i].type == "B") {
                                task_name = "<p>Отсадка от матери → <font style='font-weight:700'>" + data.results[i].cage_from.farm_number + data.results[i].cage_from.number + data.results[i].cage_from.letter + " (" + data.results[i].number_bunnies + " кр.)" + " → " + data.results[i].male_cage_to.farm_number + data.results[i].male_cage_to.number + data.results[i].male_cage_to.letter + "(M) → " + data.results[i].female_cage_to.farm_number + data.results[i].female_cage_to.number + data.results[i].female_cage_to.letter + " (Ж)</font></p>"
                            } else if (data.results[i].type == "V") {
                                task_name = "<p>Вакцинация → <font style='font-weight:700'>" + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + "</font></p>"
                            } else if (data.results[i].type == "I") {
                                task_name = "<p>Осмотр перед убоем → <font style='font-weight:700'>" + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + "</font></p>"
                            } else if (data.results[i].type == "S") {
                                task_name = "<p>Убой → <font style='font-weight:700'>" + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + "</font></p>"
                            }

                            $('.list-wrapper').append(
                                '<div class="list-item">' +
                                '<div class="left-item-body">' +
                                '<p class="task-date">' + convertToCalendar(data.results[i].created_at) + '</p>' +
                                '</div>' +
                                '<div class="middle-item-body">' +
                                '<div class="v-wrapper">' +
                                '<p>' + task_name + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="right-item-body cage-right-item-body">' +
                                '<select id="' + data.results[i].id + '" class="rightside-filter choose-executor" onchange="saveExecutor(this)">' +
                                '<option value="0">Не выбрано</option>' +
                                user_list +
                                '</select>' +
                                '</div>' +
                                '</div>'
                            )
                        }
                        DATA = data

                        makePaginate(data)
                    })
            })
    }
}

function saveExecutor(e) {
    let assign = {
        "id": e.value,
        "task_id": e.id
    }
    let assigned = false

    for (let i = 0; i < Object.keys(EXECUTORS).length; i++) {
        if (EXECUTORS[i].task_id == e.id) {
            EXECUTORS[i] = assign
            assigned = true
            break
        }
    }

    if (assigned == false) {
        EXECUTORS[counter] = assign
        counter++
    }

    if (e.value != 0) {
        $(".save-changes-btn, .discard-changes-btn").removeClass("disabled")
        listenState()
    }

    if (e.value == 0) {
        let disabled = false
        for (let i = 0; i < Object.keys(EXECUTORS).length; i++) {
            if (EXECUTORS[i].id == 0) {
                disabled = true
            } else {
                disabled = false
                break
            }
        }
        if (disabled == true) {
            $(".save-changes-btn, .discard-changes-btn").addClass("disabled")
            $(".save-changes-btn, .discard-changes-btn").off()
        }
    }

    console.log(EXECUTORS)
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

function listenState() {
    $(".save-changes-btn").click(function() {
        for(let i = 0; i < Object.keys(EXECUTORS).length; i++) {
            let link = tasksURL + EXECUTORS[i].task_id + "/"
            let executor = {
                "user": EXECUTORS[i].id
            }
        }
    })

    $(".discard-changes-btn").click(function() {
        location.reload()
    })
}

$(document).ready(function() {
    showList(tasksURL)

    document.querySelector(".rightside-filter").addEventListener('change', function(e) {
        $('#pagination-container>ul').remove();
        $('.list-item').remove()
        $('#list-wrapper').append(
            '<div id="list-wrapper-loading" class="loading">' +
            '<img src="/img/loading.gif">' +
            '</div>'
        )

        FILTER = e.target.value

        showList(tasksURL)

    })

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

        showList(cagesURL)
    })
})