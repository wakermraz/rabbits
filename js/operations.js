const operationsURL = "https://rabbit-api--app.herokuapp.com/api/operation/?";
let rabbitsURL = "https://rabbit-api--app.herokuapp.com/api/rabbit/"
let getRABBIT = "https://rabbit-api--app.herokuapp.com/api/rabbit/";
const rabbit_operations = "https://rabbit-api--app.herokuapp.com/api/operation/?rabbit_id=";

var showWeight;

let DATA

var sidebar_filter = false;
var sidebar_filter_order;
var filter_order;

let _f_rabbit_number,
    _f_type,
    _f_time_from,
    _f_time_to

let FILTER = ""

let filter_object = {
    "_f_rabbit_number": "&",
    "_f_type": "&",
    "_f_time_from": "&",
    "_f_time_to": "&"
}

let getPlan = "https://rabbit-api--app.herokuapp.com/api/plan/?date="
let putPlan = "https://rabbit-api--app.herokuapp.com/api/plan/"

let counterForPlan = 0;
let planObj = {};
let current_plan

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

function makeLink(url, id, r_type) {
    let link;
    if (r_type == "P") {
        link = url + "father/" + id + "/";
    } else if (r_type == "B") {
        link = url + "bunny/" + id + "/";
    } else if (r_type == "M") {
        link = url + "mother/" + id + "/";
    }
    return link;
}

function countResponse(obj_key, filter) {
    $('#count-results').remove()
    let obj_to_link = operationsURL;
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

function showNewRabbit(id) {
    $('.added1').remove()
    getData("https://rabbit-api--app.herokuapp.com/api/rabbit/" + id)
        .then((value) => {
            return value.json()
        })
        .then((data) => {
            let weight_rabbit_id_filtered = id;
            let modalSex;
            let rabbit_type;
            let curr_rabbit_operations = rabbit_operations;
            curr_rabbit_operations += id + "&page_size=50";

            var birthday = new Date(data.birthday);
            var today = new Date;
            var diff = today - birthday;
            var milliseconds = diff;
            var seconds = milliseconds / 1000;
            var minutes = seconds / 60;
            var hours = minutes / 60;
            var days = hours / 24;

            if (data.current_type == "B") {
                modal_ico = "-small";
                rabbit_type = "МАЛЕНЬК"
            } else if (data.current_type == "F") {
                modal_ico = "-big";
                rabbit_type = "ОТКРОМ"
            } else if (data.current_type == "M") {
                modal_ico = "-big";
                rabbit_type = "РАЗМНОЖ"
            } else if (data.current_type == "P") {
                modal_ico = "-big";
                rabbit_type = "РАЗМНОЖ"
            }

            if (Object.keys(data.status) > 1) {
                if (data.status[0] == "RF") {
                    var rabbit_status = "Готов к размнож."
                } else if (data.status[0] == "R") {
                    rabbit_status = "Отдыхает"
                } else if (data.status[0] == "UP") {
                    rabbit_status = "Неподтвержденная берем."
                } else if (data.status[0] == "NI") {
                    rabbit_status = "Нужен осмотр на берем."
                } else if (data.status[0] == "CP") {
                    rabbit_status = "Беременная"
                } else if (data.status[0] == "FB") {
                    rabbit_status = "Кормит крольчат"
                } else if (data.status[0] == "NV") {
                    rabbit_status = "Треб. вак."
                } else if (data.status[0] == "NI") {
                    rabbit_status = "Треб. осмотр"
                } else if (data.status[0] == "WC") {
                    rabbit_status = "Кормится без кокцидиост."
                } else if (data.status[0] == "RS") {
                    rabbit_status = "Готов к убою"
                } else if (data.status[0] == "NJ") {
                    rabbit_status = "Треб. отсадка"
                } else if (data.status[0] == "MF") {
                    rabbit_status = "Кормится у матери"
                }
                for (let key in data.status) {
                    if (data.status[key] == "RF") {
                        rabbit_status += ", Готов к размнож."
                    } else if (data.status[key] == "R") {
                        rabbit_status += ", Отдыхает"
                    } else if (data.status[key] == "UP") {
                        rabbit_status += ", Неподтвержденная берем."
                    } else if (data.status[key] == "NI") {
                        rabbit_status += ", Нужен осмотр на берем."
                    } else if (data.status[key] == "CP") {
                        rabbit_status += ", Беременная"
                    } else if (data.status[key] == "FB") {
                        rabbit_status += ", Кормит крольчат"
                    } else if (data.status[key] == "NV") {
                        rabbit_status += ", Треб. вак."
                    } else if (data.status[key] == "NI") {
                        rabbit_status += ", Треб. осмотр"
                    } else if (data.status[key] == "WC") {
                        rabbit_status += ", Кормится без кокцидиост."
                    } else if (data.status[key] == "RS") {
                        rabbit_status += ", Готов к убою"
                    } else if (data.status[key] == "NJ") {
                        rabbit_status += ", Треб. отсадка"
                    } else if (data.status[key] == "MF") {
                        rabbit_status += ", Кормится у матери"
                    }
                }
            } else {
                if (data.status[0] == "RF") {
                    var rabbit_status = "Готов к размнож."
                } else if (data.status[0] == "R") {
                    rabbit_status = "Отдыхает"
                } else if (data.status[0] == "UP") {
                    rabbit_status = "Неподтвержденная берем."
                } else if (data.status[0] == "NI") {
                    rabbit_status = "Нужен осмотр на берем."
                } else if (data.status[0] == "CP") {
                    rabbit_status = "Беременная"
                } else if (data.status[0] == "FB") {
                    rabbit_status = "Кормит крольчат"
                } else if (data.status[0] == "NV") {
                    rabbit_status = "Треб. вак."
                } else if (data.status[0] == "NI") {
                    rabbit_status = "Треб. осмотр"
                } else if (data.status[0] == "WC") {
                    rabbit_status = "Кормится без кокцидиост."
                } else if (data.status[0] == "RS") {
                    rabbit_status = "Готов к убою"
                } else if (data.status[0] == "NJ") {
                    rabbit_status = "Треб. отсадка"
                } else if (data.status[0] == "MF") {
                    rabbit_status = "Кормится у матери"
                }
            }

            if (data.is_male === null) {
                modalSex = "unknown";
            } else if (data.is_male === true) {
                modalSex = "male-main";
            } else if (data.is_male === false) {
                modalSex = "female-main";
            }

            $('.rabbitModal-header1').prepend(
                '<img class="added1" src="/img/rabbit-ico' + modal_ico + '.svg">'
            );

            $('.rabbit-header-info1').append(
                '<a class="changeWeightLink-filtered added1" href="#changeWeight-filtered" id="' + id + '">' +
                '<div class="changeWeight">' +
                '<img src="/img/change-weight.svg">' +
                '<p>Взвесить</p>' +
                '</div>' +
                '</a>'
            )

            $('.rabbit-header-sex1').append(
                '<img class="added1" src="/img/' + modalSex + '.svg">'
            )

            $('.rabbit-header-info-bot1').append(
                '<p class="added1">#' + id + '</p>' +
                '<p class="added1">' + data.weight + '&nbspкг.</p>'
            )

            var birth = new Date(data.birthday);
            var now = new Date;
            now = (now - birth) / 1000 / 60 / 60 / 24;
            birth = birth.format("dd.mm.yyyy");
            $('.rabbit-header-right1').append(
                '<p class="added1">Дата рождения:&nbsp<font class="added" style="font-weight:700;width:9.4ch;display:inline-flex;overflow:hidden;">' + birth + '</font></p>' +
                '<p class="added1">Возраст:&nbsp<font class="added" style="font-weight:700;">' + Math.round(now) + '&nbspдней</font></p>'
            )

            $('.rabbitModal-type1').append(
                '<span class="subheader-details added1">&nbsp' + rabbit_type + '</span>'
            )

            $('.rabbitModal-breed1').append(
                '<span class="subheader-details added1">&nbsp' + data.breed + '</span>'
            )

            $('.rabbitModal-cageNum1').append(
                '<span class="subheader-details added1"> &nbsp' + data.cage.farm_number + data.cage.number + data.cage.letter + '</span>'
            )

            $('.rabbitModal-status1').append(
                '<span class="subheader-details added1"> &nbsp' + rabbit_status + '</span>'
            )

            getData(curr_rabbit_operations)
                .then((value) => {
                    return value.json()
                })
                .then((data) => {
                    if (data.results[0] === undefined) {
                        $('.operations-history-body').append(
                            '<div class="operations-history-item added">' +
                            '<p>Операций с кроликом еще нет...</p>' +
                            '</div>'
                        )
                        $('#rabbit-modal-loading').remove();
                    } else {
                        let counter = data.count

                        for (let i = 0; i < counter; i++) {
                            var date = new Date(data.results[i].time);
                            date = date.format("dd.mm.yyyy HH:MM");
                            let context
                            let bold_context = ""
                            if (data.results[i].type == "B") {
                                context = "Рождение кролика"
                            }
                            if (data.results[i].type == "J") {
                                context = "Отсадка кролика&nbsp"
                                bold_context = "<font style='font-weight:700'>(" + String(data.results[i].old_cage.farm_number) + data.results[i].old_cage.number + data.results[i].old_cage.letter + " → " + data.results[i].new_cage.farm_number + data.results[i].new_cage.number + data.results[i].new_cage.letter + ")</font>"
                            }
                            if (data.results[i].type == "V") {
                                context = "Вакцинирование"
                            }
                            if (data.results[i].type == "S") {
                                context = "Рождение кролика"
                            }
                            if (data.results[i].type == "M") {
                                if (id == data.results[i].father_rabbit_id) {
                                    context = "Спаривание&nbsp"
                                    bold_context = "<a href='#rabbitModal' style='font-weight: 700; font-size: 18px; color: #fff;' id='" + data.results[i].mother_rabbit_id + "'>(#" + data.results[i].mother_rabbit_id + ")</a>"
                                } else if (id == data.results[i].mother_rabbit_id) {
                                    context = "Спаривание&nbsp"
                                    bold_context = "<a href='#rabbitModal' style='font-weight: 700; font-size: 18px; color: #fff;' id='" + data.results[i].father_rabbit_id + "'>(#" + data.results[i].father_rabbit_id + ")</a>"
                                }
                            }
                            $('.operations-history-body1').append(
                                '<div class="operations-history-item added1">' +
                                '<p>' + date + '</p>' +
                                '<p>' + context + bold_context + '</p>' +
                                '</div>'
                            )
                        }
                    }
                    $(".changeWeightLink-filtered").click(function() {
                        $('#loader-rabbit-modal').append(
                            '<div id="rabbit-modal-loading" class="loading">' +
                            '<img src="/img/loading.gif">' +
                            '</div>'
                        );
                        let weight_rabbit_id_in_array = id;
                        let weight_rabbit_id = +id + 1;
                        let newWeight = {
                            "weight": null
                        }
                        showWeight = data.results[weight_rabbit_id_in_array].weight;

                        $('.curr-rabbit-weight').append(
                            '<span class="added added-secondary" style="white-space: nowrap;">&nbsp' + data.weight + '</span>'
                        )

                        $('#changeWeight-modal-loading').remove()

                        $(".submit-changeWeight").click(function() {
                            $('.added-secondary').remove();
                            newWeight.weight = +$("#newWeight").val();
                            putData(makeLink(rabbitsURL_, weight_rabbit_id_filtered, data.current_type), newWeight)
                                .then((value) => {
                                    $('.rightside-filter').empty();
                                    $('#newWeight').empty();
                                    location.reload()
                                })
                        })
                    })
                })
        })
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
                var operation_type;

                for (var i = 0; i < totalItems; i++) {

                    var time = new Date(data.results[i].time);
                    time = time.format("dd.mm.yyyy HH:MM");

                    var rabbit_id = data.results[i].rabbit_id;

                    if (data.results[i].type == "J") {
                        operation_type = "Отсадка кролика ";
                        operation_type += "(" + data.results[i].old_cage.farm_number + data.results[i].old_cage.number + data.results[i].old_cage.letter + "→" + data.results[i].new_cage.farm_number + data.results[i].new_cage.number + data.results[i].new_cage.letter + ")";
                    } else if (data.results[i].type == "B") {
                        operation_type = "Рождение кролика";
                    } else if (data.results[i].type == "V") {
                        operation_type = "Вакцинация";
                    } else if (data.results[i].type == "S") {
                        operation_type = "Убой";
                    } else if (data.results[i].type == "M") {
                        operation_type = "Спаривание ";
                        operation_type += '<a class="rabbitModal" href="#rabbitModal" onclick="showRabbit(' + data.results[i].mother_rabbit_id + ')" id="' + data.results[i].mother_rabbit_id + '">(#' + data.results[i].mother_rabbit_id + ')';
                        rabbit_id = data.results[i].father_rabbit_id;
                    }

                    $('.list-wrapper').append(
                        '<div class="list-item">' +
                        '<div class="left-item-body">' +
                        '<div class="v-wrapper">' +
                        '<p>' + time + '</p>' +
                        '</div>' +
                        '</div>' +
                        '<div class="middle-item-body">' +
                        '<div class="h-wrapper">' +
                        '<div class="v-wrapper">' +
                        '<p><a href="#rabbitModal" class="rabbitModal" onclick="showRabbit(' + rabbit_id + ')" id="' + rabbit_id + '">#' + rabbit_id + '</a></p>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="right-item-body">' +
                        '<p>' + operation_type + '</p>' +
                        '</div>' +
                        '</div>'
                    )
                }
                DATA = data;
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
                var operation_type;

                for (var i = 0; i < totalItems; i++) {

                    var time = new Date(data.results[i].time);
                    time = time.format("dd.mm.yyyy HH:MM");

                    var rabbit_id = data.results[i].rabbit_id;

                    if (data.results[i].type == "J") {
                        operation_type = "Отсадка кролика ";
                        operation_type += "(" + data.results[i].old_cage.farm_number + data.results[i].old_cage.number + data.results[i].old_cage.letter + "→" + data.results[i].new_cage.farm_number + data.results[i].new_cage.number + data.results[i].new_cage.letter + ")";
                    } else if (data.results[i].type == "B") {
                        operation_type = "Рождение кролика";
                    } else if (data.results[i].type == "V") {
                        operation_type = "Вакцинация";
                    } else if (data.results[i].type == "S") {
                        operation_type = "Убой";
                    } else if (data.results[i].type == "M") {
                        operation_type = "Спаривание ";
                        operation_type += '<a class="rabbitModal" href="#rabbitModal" onclick="showRabbit(' + rabbit_id + ')" id="' + data.results[i].mother_rabbit_id + '">(#' + data.results[i].mother_rabbit_id + ')';
                        rabbit_id = data.results[i].father_rabbit_id;
                    }

                    $('.list-wrapper').append(
                        '<div class="list-item">' +
                        '<div class="left-item-body">' +
                        '<div class="v-wrapper">' +
                        '<p>' + time + '</p>' +
                        '</div>' +
                        '</div>' +
                        '<div class="middle-item-body">' +
                        '<div class="h-wrapper">' +
                        '<div class="v-wrapper">' +
                        '<p><a href="#rabbitModal" class="rabbitModal" onclick="showRabbit(' + rabbit_id + ')" id="' + rabbit_id + '">#' + rabbit_id + '</a></p>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="right-item-body">' +
                        '<p>' + operation_type + '</p>' +
                        '</div>' +
                        '</div>'
                    )
                }
                DATA = data
                makePaginate(data)
            })
    }
}

function showRabbit(id) {
    getData(getRABBIT + id)
        .then((value) => {
            return value.json()
        })
        .then((data) => {
            let modal_ico;
            let modalSex;
            let rabbit_type;
            let curr_rabbit_operations = rabbit_operations + id;

            var birthday = new Date(data.birthday);
            var today = new Date;
            var diff = today - birthday;
            var milliseconds = diff;
            var seconds = milliseconds / 1000;
            var minutes = seconds / 60;
            var hours = minutes / 60;
            var days = hours / 24;

            if (data.current_type == "B") {
                modal_ico = "-small";
                rabbit_type = "МАЛЕНЬК"
            } else if (data.current_type == "F") {
                modal_ico = "-big";
                rabbit_type = "ОТКРОМ"
            } else if (data.current_type == "M") {
                modal_ico = "-big";
                rabbit_type = "РАЗМНОЖ"
            } else if (data.current_type == "P") {
                modal_ico = "-big";
                rabbit_type = "РАЗМНОЖ"
            }

            if (Object.keys(data.status) > 1) {
                if (data.status[0] == "RF") {
                    var rabbit_status = "Готов к размнож."
                } else if (data.status[0] == "R") {
                    rabbit_status = "Отдыхает"
                } else if (data.status[0] == "UP") {
                    rabbit_status = "Неподтвержденная берем."
                } else if (data.status[0] == "NI") {
                    rabbit_status = "Нужен осмотр на берем."
                } else if (data.status[0] == "CP") {
                    rabbit_status = "Беременная"
                } else if (data.status[0] == "FB") {
                    rabbit_status = "Кормит крольчат"
                } else if (data.status[0] == "NV") {
                    rabbit_status = "Треб. вак."
                } else if (data.status[0] == "NI") {
                    rabbit_status = "Треб. осмотр"
                } else if (data.status[0] == "WC") {
                    rabbit_status = "Кормится без кокцидиост."
                } else if (data.status[0] == "RS") {
                    rabbit_status = "Готов к убою"
                } else if (data.status[0] == "NJ") {
                    rabbit_status = "Треб. отсадка"
                } else if (data.status[0] == "MF") {
                    rabbit_status = "Кормится у матери"
                }
                for (let key in data.status) {
                    if (data.status[key] == "RF") {
                        rabbit_status += ", Готов к размнож."
                    } else if (data.status[key] == "R") {
                        rabbit_status += ", Отдыхает"
                    } else if (data.status[key] == "UP") {
                        rabbit_status += ", Неподтвержденная берем."
                    } else if (data.status[key] == "NI") {
                        rabbit_status += ", Нужен осмотр на берем."
                    } else if (data.status[key] == "CP") {
                        rabbit_status += ", Беременная"
                    } else if (data.status[key] == "FB") {
                        rabbit_status += ", Кормит крольчат"
                    } else if (data.status[key] == "NV") {
                        rabbit_status += ", Треб. вак."
                    } else if (data.status[key] == "NI") {
                        rabbit_status += ", Треб. осмотр"
                    } else if (data.status[key] == "WC") {
                        rabbit_status += ", Кормится без кокцидиост."
                    } else if (data.status[key] == "RS") {
                        rabbit_status += ", Готов к убою"
                    } else if (data.status[key] == "NJ") {
                        rabbit_status += ", Треб. отсадка"
                    } else if (data.status[key] == "MF") {
                        rabbit_status += ", Кормится у матери"
                    }
                }
            } else {
                if (data.status[0] == "RF") {
                    var rabbit_status = "Готов к размнож."
                } else if (data.status[0] == "R") {
                    rabbit_status = "Отдыхает"
                } else if (data.status[0] == "UP") {
                    rabbit_status = "Неподтвержденная берем."
                } else if (data.status[0] == "NI") {
                    rabbit_status = "Нужен осмотр на берем."
                } else if (data.status[0] == "CP") {
                    rabbit_status = "Беременная"
                } else if (data.status[0] == "FB") {
                    rabbit_status = "Кормит крольчат"
                } else if (data.status[0] == "NV") {
                    rabbit_status = "Треб. вак."
                } else if (data.status[0] == "NI") {
                    rabbit_status = "Треб. осмотр"
                } else if (data.status[0] == "WC") {
                    rabbit_status = "Кормится без кокцидиост."
                } else if (data.status[0] == "RS") {
                    rabbit_status = "Готов к убою"
                } else if (data.status[0] == "NJ") {
                    rabbit_status = "Треб. отсадка"
                } else if (data.status[0] == "MF") {
                    rabbit_status = "Кормится у матери"
                }
            }

            if (data.is_male === null) {
                modalSex = "unknown";
            } else if (data.is_male === true) {
                modalSex = "male-main";
            } else if (data.is_male === false) {
                modalSex = "female-main";
            }


            $('.rabbitModal-header').prepend(
                '<img class="added" src="/img/rabbit-ico' + modal_ico + '.svg">'
            );

            $('.rabbit-header-info').append(
                '<a class="changeWeightLink added" onclick="showChangeWeight(' + data.id + ')" href="#changeWeight" id="' + data.id + '">' +
                '<div class="changeWeight">' +
                '<img src="/img/change-weight.svg">' +
                '<p>Взвесить</p>' +
                '</div>' +
                '</a>'
            )

            $('.rabbit-header-sex').append(
                '<img class="added" src="/img/' + modalSex + '.svg">'
            )

            if (data.weight === null) {
                data.weight = "?"
            }
            $('.rabbit-header-info-bot').append(
                '<p class="added">#' + data.id + '</p>' +
                '<p class="removable-weight added">' + data.weight + '&nbspкг.</p>'
            )

            var birthday = new Date(data.birthday);
            birthday = birthday.format("dd.mm.yyyy");
            $('.rabbit-header-right').append(
                '<p class="added">Дата рождения:&nbsp<font class="added" style="font-weight:700;width:9.4ch;display:inline-flex;overflow:hidden;">' + birthday + '</font></p>' +
                '<p class="added">Возраст:&nbsp<font class="added" style="font-weight:700;">' + Math.round(days) + '&nbspдней</font></p>'
            )

            $('.rabbitModal-type').append(
                '<span class="subheader-details added">&nbsp' + rabbit_type + '</span>'
            )

            $('.rabbitModal-breed').append(
                '<span class="subheader-details added">&nbsp' + data.breed + '</span>'
            )

            $('.rabbitModal-cageNum').append(
                '<span class="subheader-details added"> &nbsp' + data.cage.farm_number + data.cage.number + data.cage.letter + '</span>'
            )

            $('.rabbitModal-status').append(
                '<span class="subheader-details added"> &nbsp' + rabbit_status + '</span>'
            )


            getData(curr_rabbit_operations)
                .then((value) => {
                    return value.json();
                })
                .then((data) => {
                    let this_id = id
                    if (data.results[0] === undefined) {
                        $('.operations-history-body').append(
                            '<div class="operations-history-item added">' +
                            '<p>Операций с кроликом еще нет...</p>' +
                            '</div>'
                        )
                        $('#rabbit-modal-loading').remove();
                    } else {
                        let counter = data.count
                        for (let i = 0; i < counter; i++) {
                            var date = new Date(data.results[i].time);
                            date = date.format("dd.mm.yyyy HH:MM");
                            let context
                            let bold_context = ""
                            if (data.results[i].type == "B") {
                                context = "Рождение кролика"
                            }
                            if (data.results[i].type == "J") {
                                context = "Отсадка кролика&nbsp"
                                bold_context = "<font style='font-weight:700'>(" + String(data.results[i].old_cage.farm_number) + data.results[i].old_cage.number + data.results[i].old_cage.letter + " → " + data.results[i].new_cage.farm_number + data.results[i].new_cage.number + data.results[i].new_cage.letter + ")</font>"
                            }
                            if (data.results[i].type == "V") {
                                context = "Вакцинирование"
                            }
                            if (data.results[i].type == "S") {
                                context = "Рождение кролика"
                            }
                            if (data.results[i].type == "M") {
                                if (this_id == data.results[i].father_rabbit_id) {
                                    context = "Спаривание&nbsp"
                                    bold_context = "<a href='#rabbitModal-filtered' onclick='showNewRabbit(" + data.results[i].mother_rabbit_id + ")' style='font-weight: 700; font-size: 18px; color: #fff;' id='" + data.results[i].mother_rabbit_id + "'>(#" + data.results[i].mother_rabbit_id + ")</a>"
                                } else if (this_id == data.results[i].mother_rabbit_id) {
                                    context = "Спаривание&nbsp"
                                    bold_context = "<a href='#rabbitModal-filtered' onclick='showNewRabbit(" + data.results[i].father_rabbit_id + ")' style='font-weight: 700; font-size: 18px; color: #fff;' id='" + data.results[i].father_rabbit_id + "'>(#" + data.results[i].father_rabbit_id + ")</a>"
                                }
                            }
                            $('.operations-history-body').append(
                                '<div class="operations-history-item added">' +
                                '<p>' + date + '</p>' +
                                '<p>' + context + bold_context + '</p>' +
                                '</div>'
                            )
                            $('#rabbit-modal-loading').remove();
                        }
                    }

                });

        });
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
                showList(operationsURL + "&page=" + pageNumber, false)
            } else {
                showList(operationsURL + "&page=" + pageNumber, false, FILTER)
            }
        }
    });
}

function showChangeWeight(id) {
    getData(getRABBIT + id)
        .then((value) => {
            return value.json()
        })
        .then((data) => {
            $('#loader-rabbit-modal').append(
                '<div id="rabbit-modal-loading" class="loading">' +
                '<img src="/img/loading.gif">' +
                '</div>'
            );
            let weight_rabbit_id_in_array = id;
            let weight_rabbit_id = id;
            let newWeight = {
                "weight": null
            }
            showWeight = data.weight;

            $('.removable-weight').remove();
            if (data.weight === null) {
                data.weight = "?"
            }
            $('.curr-rabbit-weight').append(
                '<span class="added added-secondary" style="white-space: nowrap;">&nbsp' + data.weight + '&nbspкг.</span>'
            )

            $('#changeWeight-modal-loading').remove()

            $(".submit-changeWeight").click(function() {

                $('.added-secondary').remove();
                newWeight.weight = +$("#newWeight").val();
                console.log(newWeight.weight)
                putData(makeLink(rabbitsURL, weight_rabbit_id, data.current_type), newWeight)
                    .then((value) => {})
            })
        })
}

function convertData(date) {
    date = date[6] + date[7] + date[8] + date[9] + date[5] + date[3] + date[4] + date[2] + date[0] + date[1]
    return date
}

$(document).ready(function() {
    showList(operationsURL)

    $("#rabbitModal-close").click(function() {
        $('#loader-rabbit-modal').append(
            '<div id="rabbit-modal-loading" class="loading">' +
            '<img src="/img/loading.gif">' +
            '</div>'
        );
        $('.added').remove();
    });

    $("#changeWeight-close").click(function() {
        $('#loader-changeWeight-modal').append(
            '<div id="changeWeight-modal-loading" class="loading">' +
            '<img src="/img/loading.gif">' +
            '</div>'
        );
        $('.added-secondary').remove();
        $('.rabbit-header-info-bot').append(
            '<p class="removable-weight added">' + showWeight + '&nbspкг.</p>'
        )
        $('#rabbit-modal-loading').remove();
    })

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

            showList(operationsURL)
        } else if (!sidebar_filter) {
            $('#pagination-container>ul').remove();
            $('.list-item').remove()
            $('#list-wrapper').append(
                '<div id="list-wrapper-loading" class="loading">' +
                '<img src="/img/loading.gif">' +
                '</div>'
            )

            FILTER += e.target.value

            showList(operationsURL)
        }
    })

    document.querySelector(".count-filtered1").addEventListener('change', function(e) {
        let _f_rabbit_number = "rabbit_id=" + e.target.value

        let o_key = "_f_rabbit_number"

        FILTER += _f_rabbit_number

        countResponse(o_key, _f_rabbit_number)
    });

    document.querySelector(".count-filtered2").addEventListener('change', function(e) {
        let _f_type = e.target.value

        let o_key = "_f_type"

        FILTER += _f_type

        countResponse(o_key, _f_type)
    });

    document.querySelector(".count-filtered3").addEventListener('change', function(e) {
        let _f_time_from = "time_from=" + e.target.value

        let o_key = "_f_time_from"

        FILTER += _f_time_from

        countResponse(o_key, _f_time_from)
    });

    document.querySelector(".count-filtered4").addEventListener('change', function(e) {
        let _f_time_to = "time_to=" + e.target.value

        let o_key = "_f_time_to"

        FILTER += _f_time_to

        countResponse(o_key, _f_time_to)
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
            sidebar_filter_order = operationsURL;
        } else {
            filter_order = sidebar_filter_order;
        }

        sidebar_filter = true;

        _f_rabbit_number = "rabbit_id=" + $(".count-filtered1").val()

        _f_type = $(".count-filtered2").val()

        if ($(".count-filtered3").val() == "") {
            _f_time_from = "&"
        } else {
            _f_time_from = "time_from=" + convertData($(".count-filtered3").val())
        }

        if ($(".count-filtered4").val() == "") {
            _f_time_to = "&"
        } else {
            _f_time_to = "time_to=" + convertData($(".count-filtered4").val())
        }


        FILTER = String(_f_rabbit_number) + _f_type + _f_time_from + _f_time_to

        showList(operationsURL)
    })

})