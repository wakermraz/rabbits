const rabbitsURL = "https://rabbit-api--test.herokuapp.com/api/rabbit/?";
const rabbit_operations = "https://rabbit-api--test.herokuapp.com/api/operation/?rabbit_id=";
const rabbits_breed = "https://rabbit-api--test.herokuapp.com/api/breed/"
const rabbits_filter = "https://rabbit-api--test.herokuapp.com/api/rabbit/"
const addRabbitCages = "https://rabbit-api--test.herokuapp.com/api/cage/?number_rabbits_to=0&status="

let filter = "https://rabbit-api--test.herokuapp.com/api/rabbit/?"

var sidebar_filter = false;
var sidebar_filter_order;
var showWeight;
let f_farm_number;
let f_male;
let f_female;
let f_rabbit_type;
let f_rabbit_breed;
let f_age_from;
let f_age_to;
let f_rabbit_status;
let f_weight_from;
let f_weight_to;
let counter = 0

let _f_farm_number = "";
let _f_male = "";
let _f_rabbit_type = "";
let _f_rabbit_breed = "";
let _f_age_from = "";
let _f_age_to = "";
let _f_rabbit_status = "";
let _f_weight_from = "";
let _f_weight_to = "";

let filter_object = {
    "_f_farm_number": "&",
    "_f_male": "&",
    "_f_rabbit_type": "&",
    "_f_rabbit_breed": "&",
    "_f_age_from": "&",
    "_f_age_to": "&",
    "_f_rabbit_status": "&",
    "_f_weight_from": "&",
    "_f_weight_to": "&"
}

let ar_filter_object = {
    "_f_cage_type": "&type=F",
    "_f_cage_farm": "&farm_number=2"
}

let rabbitsObj = []

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

function countResponse(obj_key, filter) {
    $('#count-results').remove()
    let obj_to_link = "https://rabbit-api--test.herokuapp.com/api/rabbit/?"
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

function converFromCalendar(date) {
    date = date.replace(" ", "T")
    var res = "";
    date = date.replace(".", "-")
    date = date.replace(".", "-")
    res = date[6] + date[7] + date[8] + date[9] + date[5] + date[3] + date[4] + date[2] + date[0] + date[1] + date[10] + date[11] + date[12] + date[13] + date[14] + date[15]
    return res;
}

function getAvailCages(obj_key, filter) {
    $('.cageSelect-item').remove()
    let obj_to_link = "https://rabbit-api--test.herokuapp.com/api/cage/?number_rabbits_to=0"
    console.log(filter)
    for (let key in ar_filter_object) {
        if (key == obj_key && filter != ar_filter_object[key]) {
            ar_filter_object[key] = filter;
        }
        obj_to_link += ar_filter_object[key]
    }
    getData(obj_to_link)
        .then((value) => {
            return value.json();
        })
        .then((data) => {
            if (data.count != 0) {
                for (let i = 0; i < data.count; i++) {
                    $('.cageSelect').append(
                        '<option class="cageSelect-item" id="' + data.results[i].farm_number + data.results[i].number + data.results[i].letter + '" value="' + data.results[i].id + '">' + data.results[i].farm_number + data.results[i].number + data.results[i].letter + '</option>'
                    )
                }
            } else {
                $('.cageSelect').append(
                    '<option class="cageSelect-item">Нет подходящих клеток</option>'
                )
            }
        })
}

function addRabbit(birthday, breed_id, breed_name, is_male, farm_number, cage_number, cage_id, b_day_send) {
    let farm_num;
    let sex;

    if (is_male == true) {
        sex = "male"
    } else if (is_male == false) {
        sex = "female"
    }

    if (farm_number == "&farm_number=2") {
        farm_num = "2"
    } else if (farm_number == "&farm_number=3") {
        farm_num = "3"
    } else if (farm_number == "&farm_number=4") {
        farm_num = "4"
    }

    let assign = {
        "show": {
            "birthday": birthday,
            "breed": breed_name,
            "sex": sex,
            "farm_number": farm_num,
            "cage_number": cage_number
        },
        "send": {
            "birthday": b_day_send,
            "breed": breed_id,
            "cage": cage_id,
            "is_male": is_male
        }
    }
    rabbitsObj[counter] = assign;
    $('.addRabbitModal-right-items').append(
        '<div class="addRabbitModal-right-item addRabbit-item' + counter + '" id="' + counter + '">' +
        '<div class="v-wrapper">' +
        '<p>' + rabbitsObj[counter].show.birthday + '</p>' +
        '</div>' +
        '<div class="v-wrapper addRabbit-wrapper">' +
        '<p>' + rabbitsObj[counter].show.breed + '</p>' +
        '</div>' +
        '<div class="v-wrapper addRabbit-wrapper">' +
        '<img src="/img/' + rabbitsObj[counter].show.sex + '-main.svg">' +
        '</div>' +
        '<div class="v-wrapper">' +
        '<p>№' + rabbitsObj[counter].show.farm_number + '</p>' +
        '</div>' +
        '<div class="v-wrapper">' +
        '<p>' + rabbitsObj[counter].show.cage_number + '</p>' +
        '</div>' +
        '<div class="v-wrapper">' +
        '<img id="' + counter + '" class="delete-rabbit" src="/img/planCreate-delete-item.svg">' +
        '</div>' +
        '</div>'
    )
    counter++;
    console.log(rabbitsObj)
    $('.delete-rabbit').click(function() {
        delete rabbitsObj[this.id]
        let this_item = $('.addRabbit-item' + this.id).remove()
        console.log(rabbitsObj)

    })
}

getData(rabbitsURL)
    .then((value) => {
        return value.json();
    })
    .then((data) => {

        var totalItems = Object.keys(data.results).length;
        var type = "НЕ УКАЗ";

        $('#list-wrapper-loading').remove();

        for (var i = 0; i < totalItems; i++) {

            var birthday = new Date(data.results[i].birthday);
            var today = new Date;

            var diff = today - birthday;
            var milliseconds = diff;
            var seconds = milliseconds / 1000;
            var minutes = seconds / 60;
            var hours = minutes / 60;
            var days = hours / 24;

            var rabbitSize;
            var sex;

            if (data.results[i].weight === null) {
                data.results[i].weight = "?";
            } else {
                data.results[i].weight += " кг."
            }

            if (data.results[i].is_male === null) {
                sex = "unknown";
            } else if (data.results[i].is_male === true) {
                sex = "male-main";
            } else if (data.results[i].is_male === false) {
                sex = "female-main";
            }

            if (data.results[i].current_type == "B") {
                rabbitSize = "small-rabbit";
                type = "МАЛЕНЬК";
            } else if (data.results[i].current_type == "F") {
                rabbitSize = "rabbit";
                type = "ОТКОРМ";
            } else if (data.results[i].current_type == "M") {
                rabbitSize = "rabbit";
                type = "РАЗМНОЖ";
            } else if (data.results[i].current_type == "P") {
                rabbitSize = "rabbit";
                type = "РАЗМНОЖ";
            } else {
                rabbitSize = "rabbit";
            }

            if (Object.keys(data.results[i].status).length > 1) {
                if (data.results[i].status[0] == "RF") {
                    var rabbit_status = "Готов к размнож."
                } else if (data.results[i].status[0] == "R") {
                    rabbit_status = "Отдыхает"
                } else if (data.results[i].status[0] == "UP") {
                    rabbit_status = "Неподтвержденная берем."
                } else if (data.results[i].status[0] == "NI") {
                    rabbit_status = "Нужен осмотр на берем."
                } else if (data.results[i].status[0] == "CP") {
                    rabbit_status = "Беременная"
                } else if (data.results[i].status[0] == "FB") {
                    rabbit_status = "Кормит крольчат"
                } else if (data.results[i].status[0] == "NV") {
                    rabbit_status = "Треб. вак."
                } else if (data.results[i].status[0] == "NI") {
                    rabbit_status = "Треб. осмотр"
                } else if (data.results[i].status[0] == "WC") {
                    rabbit_status = "Кормится без кокцидиост."
                } else if (data.results[i].status[0] == "RS") {
                    rabbit_status = "Готов к убою"
                } else if (data.results[i].status[0] == "NJ") {
                    rabbit_status = "Треб. отсадка"
                } else if (data.results[i].status[0] == "MF") {
                    rabbit_status = "Кормится у матери"
                }
                for (let key in data.results[i].status) {
                    if (data.results[i].status[key] == "RF") {
                        rabbit_status += ", Готов к размнож."
                    } else if (data.results[i].status[key] == "R") {
                        rabbit_status += ", Отдыхает"
                    } else if (data.results[i].status[key] == "UP") {
                        rabbit_status += ", Неподтвержденная берем."
                    } else if (data.results[i].status[key] == "NI") {
                        rabbit_status += ", Нужен осмотр на берем."
                    } else if (data.results[i].status[key] == "CP") {
                        rabbit_status += ", Беременная"
                    } else if (data.results[i].status[key] == "FB") {
                        rabbit_status += ", Кормит крольчат"
                    } else if (data.results[i].status[key] == "NV") {
                        rabbit_status += ", Треб. вак."
                    } else if (data.results[i].status[key] == "NI") {
                        rabbit_status += ", Треб. осмотр"
                    } else if (data.results[i].status[key] == "WC") {
                        rabbit_status += ", Кормится без кокцидиост."
                    } else if (data.results[i].status[key] == "RS") {
                        rabbit_status += ", Готов к убою"
                    } else if (data.results[i].status[key] == "NJ") {
                        rabbit_status += ", Треб. отсадка"
                    } else if (data.results[i].status[key] == "MF") {
                        rabbit_status += ", Кормится у матери"
                    }
                }
            } else {
                if (data.results[i].status[0] == "RF") {
                    var rabbit_status = "Готов к размнож."
                } else if (data.results[i].status[0] == "R") {
                    rabbit_status = "Отдыхает"
                } else if (data.results[i].status[0] == "UP") {
                    rabbit_status = "Неподтвержденная берем."
                } else if (data.results[i].status[0] == "NI") {
                    rabbit_status = "Нужен осмотр на берем."
                } else if (data.results[i].status[0] == "CP") {
                    rabbit_status = "Беременная"
                } else if (data.results[i].status[0] == "FB") {
                    rabbit_status = "Кормит крольчат"
                } else if (data.results[i].status[0] == "NV") {
                    rabbit_status = "Треб. вак."
                } else if (data.results[i].status[0] == "NI") {
                    rabbit_status = "Треб. осмотр"
                } else if (data.results[i].status[0] == "WC") {
                    rabbit_status = "Кормится без кокцидиост."
                } else if (data.results[i].status[0] == "RS") {
                    rabbit_status = "Готов к убою"
                } else if (data.results[i].status[0] == "NJ") {
                    rabbit_status = "Треб. отсадка"
                } else if (data.results[i].status[0] == "MF") {
                    rabbit_status = "Кормится у матери"
                }
            }


            $('#list-wrapper').append(
                '<a href="#rabbitModal" class="rabbitModal" id="' + data.results[i].id + '">' +
                '<div class="list-item">' +
                '<div class="left-item-body">' +
                '<label class="' + rabbitSize + '-select">' +
                '<input type="checkbox" id="selected-rabiit-id' + data.results[i].id + '" name="' + rabbitSize + '-checkbox">' +
                '<span class="rabbitCheckbox"></span>' +
                '</label>' +
                '<div class="v-wrapper">' +
                '<p>' + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + '</p>' +
                '</div>' +
                '</div>' +
                '<div class="middle-item-body">' +
                '<div class="v-wrapper">' +
                '<p>#' + data.results[i].id + '</p>' +
                '</div>' +
                '<div class="v-wrapper">' +
                '<div class="h-wrapper">' +
                '<img src="/img/' + sex + '.svg">' +
                '</div>' +
                '</div>' +
                '<div class="v-wrapper">' +
                '<p>' + type + '</p>' +
                '</div>' +
                '<div class="v-wrapper">' +
                '<div class="h-wrapper">' +
                '<p class="kind">' + data.results[i].breed + '</p>' +
                '</div>' +
                '</div>' +
                '<div class="v-wrapper">' +
                '<p>' + Math.round(days) + '&nbspдней</p>' +
                '</div>' +
                '<div class="v-wrapper">' +
                '<p>' + data.results[i].weight + '</p>' +
                '</div>' +
                '</div>' +
                '<div class="right-item-body">' +
                '<p>' + rabbit_status + '</p>' +
                '</div>' +
                '</div>' +
                '</a>'
            );
        }

        document.querySelector(".rightside-filter").addEventListener('change', function(e) {
            if (sidebar_filter) {
                $('#pagination-container>ul').remove();
                $('.rabbitModal-filtered').remove()
                $('#list-wrapper').append(
                    '<div id="list-wrapper-loading" class="loading">' +
                    '<img src="/img/loading.gif">' +
                    '</div>'
                )
                let newValue;
                if (e.target.value == "?__order_by__=age") {
                    newValue = "&__order_by__=age"
                } else if (e.target.value == "?__order_by__=-age") {
                    newValue = "&__order_by__=-age"
                } else if (e.target.value == "?__order_by__=sex") {
                    newValue = "&__order_by__=sex"
                } else if (e.target.value == "?__order_by__=farm_number") {
                    newValue = "&__order_by__=farm_number"
                } else if (e.target.value == "?__order_by__=cage_number") {
                    newValue = "&__order_by__=cage_number"
                } else if (e.target.value == "?__order_by__=type") {
                    newValue = "&__order_by__=type"
                } else if (e.target.value == "?__order_by__=breed") {
                    newValue = "&__order_by__=breed"
                } else if (e.target.value == "?__order_by__=status") {
                    newValue = "&__order_by__=status"
                } else if (e.target.value == "?__order_by__=weight") {
                    newValue = "&__order_by__=weight"
                } else if (e.target.value == "?__order_by__=-weight") {
                    newValue = "&__order_by__=-weight"
                }

                getData((sidebar_filter_order += newValue))
                    .then((value) => {
                        return value.json();
                    })
                    .then((data) => {
                        var totalItems = Object.keys(data.results).length;
                        var type = "НЕ УКАЗ";

                        $('#list-wrapper-loading').remove();

                        for (var i = 0; i < totalItems; i++) {

                            var birthday = new Date(data.results[i].birthday);
                            var today = new Date;

                            var diff = today - birthday;
                            var milliseconds = diff;
                            var seconds = milliseconds / 1000;
                            var minutes = seconds / 60;
                            var hours = minutes / 60;
                            var days = hours / 24;

                            var rabbitSize;
                            var sex;

                            if (data.results[i].weight === null) {
                                data.results[i].weight = "?";
                            } else {
                                data.results[i].weight += " кг."
                            }

                            if (data.results[i].is_male === null) {
                                sex = "unknown";
                            } else if (data.results[i].is_male === true) {
                                sex = "male-main";
                            } else if (data.results[i].is_male === false) {
                                sex = "female-main";
                            }

                            if (data.results[i].current_type == "B") {
                                rabbitSize = "small-rabbit";
                                type = "МАЛЕНЬК";
                            } else if (data.results[i].current_type == "F") {
                                rabbitSize = "rabbit";
                                type = "ОТКОРМ";
                            } else if (data.results[i].current_type == "M") {
                                rabbitSize = "rabbit";
                                type = "РАЗМНОЖ";
                            } else if (data.results[i].current_type == "P") {
                                rabbitSize = "rabbit";
                                type = "РАЗМНОЖ";
                            } else {
                                rabbitSize = "rabbit";
                            }

                            if (Object.keys(data.results[i].status).length > 1) {
                                if (data.results[i].status[0] == "RF") {
                                    var rabbit_status = "Готов к размнож."
                                } else if (data.results[i].status[0] == "R") {
                                    rabbit_status = "Отдыхает"
                                } else if (data.results[i].status[0] == "UP") {
                                    rabbit_status = "Неподтвержденная берем."
                                } else if (data.results[i].status[0] == "NI") {
                                    rabbit_status = "Нужен осмотр на берем."
                                } else if (data.results[i].status[0] == "CP") {
                                    rabbit_status = "Беременная"
                                } else if (data.results[i].status[0] == "FB") {
                                    rabbit_status = "Кормит крольчат"
                                } else if (data.results[i].status[0] == "NV") {
                                    rabbit_status = "Треб. вак."
                                } else if (data.results[i].status[0] == "NI") {
                                    rabbit_status = "Треб. осмотр"
                                } else if (data.results[i].status[0] == "WC") {
                                    rabbit_status = "Кормится без кокцидиост."
                                } else if (data.results[i].status[0] == "RS") {
                                    rabbit_status = "Готов к убою"
                                } else if (data.results[i].status[0] == "NJ") {
                                    rabbit_status = "Треб. отсадка"
                                } else if (data.results[i].status[0] == "MF") {
                                    rabbit_status = "Кормится у матери"
                                }
                                for (let key in data.results[i].status) {
                                    if (data.results[i].status[key] == "RF") {
                                        rabbit_status += ", Готов к размнож."
                                    } else if (data.results[i].status[key] == "R") {
                                        rabbit_status += ", Отдыхает"
                                    } else if (data.results[i].status[key] == "UP") {
                                        rabbit_status += ", Неподтвержденная берем."
                                    } else if (data.results[i].status[key] == "NI") {
                                        rabbit_status += ", Нужен осмотр на берем."
                                    } else if (data.results[i].status[key] == "CP") {
                                        rabbit_status += ", Беременная"
                                    } else if (data.results[i].status[key] == "FB") {
                                        rabbit_status += ", Кормит крольчат"
                                    } else if (data.results[i].status[key] == "NV") {
                                        rabbit_status += ", Треб. вак."
                                    } else if (data.results[i].status[key] == "NI") {
                                        rabbit_status += ", Треб. осмотр"
                                    } else if (data.results[i].status[key] == "WC") {
                                        rabbit_status += ", Кормится без кокцидиост."
                                    } else if (data.results[i].status[key] == "RS") {
                                        rabbit_status += ", Готов к убою"
                                    } else if (data.results[i].status[key] == "NJ") {
                                        rabbit_status += ", Треб. отсадка"
                                    } else if (data.results[i].status[key] == "MF") {
                                        rabbit_status += ", Кормится у матери"
                                    }
                                }
                            } else {
                                if (data.results[i].status[0] == "RF") {
                                    var rabbit_status = "Готов к размнож."
                                } else if (data.results[i].status[0] == "R") {
                                    rabbit_status = "Отдыхает"
                                } else if (data.results[i].status[0] == "UP") {
                                    rabbit_status = "Неподтвержденная берем."
                                } else if (data.results[i].status[0] == "NI") {
                                    rabbit_status = "Нужен осмотр на берем."
                                } else if (data.results[i].status[0] == "CP") {
                                    rabbit_status = "Беременная"
                                } else if (data.results[i].status[0] == "FB") {
                                    rabbit_status = "Кормит крольчат"
                                } else if (data.results[i].status[0] == "NV") {
                                    rabbit_status = "Треб. вак."
                                } else if (data.results[i].status[0] == "NI") {
                                    rabbit_status = "Треб. осмотр"
                                } else if (data.results[i].status[0] == "WC") {
                                    rabbit_status = "Кормится без кокцидиост."
                                } else if (data.results[i].status[0] == "RS") {
                                    rabbit_status = "Готов к убою"
                                } else if (data.results[i].status[0] == "NJ") {
                                    rabbit_status = "Треб. отсадка"
                                } else if (data.results[i].status[0] == "MF") {
                                    rabbit_status = "Кормится у матери"
                                }
                            }


                            $('#list-wrapper').append(
                                '<a href="#rabbitModal-filtered" class="rabbitModal-filtered" name="' + i + '" id="' + data.results[i].id + '">' +
                                '<div class="list-item">' +
                                '<div class="left-item-body">' +
                                '<label class="' + rabbitSize + '-select">' +
                                '<input type="checkbox" id="selected-rabiit-id' + data.results[i].id + '" name="' + rabbitSize + '-checkbox">' +
                                '<span class="rabbitCheckbox"></span>' +
                                '</label>' +
                                '<div class="v-wrapper">' +
                                '<p>' + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="middle-item-body">' +
                                '<div class="v-wrapper">' +
                                '<p>#' + data.results[i].id + '</p>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<div class="h-wrapper">' +
                                '<img src="/img/' + sex + '.svg">' +
                                '</div>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<p>' + type + '</p>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<div class="h-wrapper">' +
                                '<p class="kind">' + data.results[i].breed + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<p>' + Math.round(days) + '&nbspдней</p>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<p>' + data.results[i].weight + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="right-item-body">' +
                                '<p>' + rabbit_status + '</p>' +
                                '</div>' +
                                '</div>' +
                                '</a>'
                            );
                        }
                        $(".rabbitModal-filtered").click(function() {
                            $(".added").remove();

                            let modal_id = +this.name; //номер кролика
                            let this_id = +this.id; //номер записи о кролике
                            let modal_ico;
                            let weight_rabbit_id_filtered = this_id;
                            let modalSex;
                            let rabbit_type;
                            let curr_rabbit_operations = rabbit_operations;
                            curr_rabbit_operations += this_id;

                            var birthday = new Date(data.results[modal_id].birthday);
                            var today = new Date;
                            var diff = today - birthday;
                            var milliseconds = diff;
                            var seconds = milliseconds / 1000;
                            var minutes = seconds / 60;
                            var hours = minutes / 60;
                            var days = hours / 24;

                            if (data.results[modal_id].current_type == "B") {
                                modal_ico = "-small";
                                rabbit_type = "МАЛЕНЬК"
                            } else if (data.results[modal_id].current_type == "F") {
                                modal_ico = "-big";
                                rabbit_type = "ОТКРОМ"
                            } else if (data.results[modal_id].current_type == "M") {
                                modal_ico = "-big";
                                rabbit_type = "РАЗМНОЖ"
                            } else if (data.results[modal_id].current_type == "P") {
                                modal_ico = "-big";
                                rabbit_type = "РАЗМНОЖ"
                            }

                            if (Object.keys(data.results[modal_id].status) > 1) {
                                if (data.results[modal_id].status[0] == "RF") {
                                    var rabbit_status = "Готов к размнож."
                                } else if (data.results[modal_id].status[0] == "R") {
                                    rabbit_status = "Отдыхает"
                                } else if (data.results[modal_id].status[0] == "UP") {
                                    rabbit_status = "Неподтвержденная берем."
                                } else if (data.results[modal_id].status[0] == "NI") {
                                    rabbit_status = "Нужен осмотр на берем."
                                } else if (data.results[modal_id].status[0] == "CP") {
                                    rabbit_status = "Беременная"
                                } else if (data.results[modal_id].status[0] == "FB") {
                                    rabbit_status = "Кормит крольчат"
                                } else if (data.results[modal_id].status[0] == "NV") {
                                    rabbit_status = "Треб. вак."
                                } else if (data.results[modal_id].status[0] == "NI") {
                                    rabbit_status = "Треб. осмотр"
                                } else if (data.results[modal_id].status[0] == "WC") {
                                    rabbit_status = "Кормится без кокцидиост."
                                } else if (data.results[modal_id].status[0] == "RS") {
                                    rabbit_status = "Готов к убою"
                                } else if (data.results[modal_id].status[0] == "NJ") {
                                    rabbit_status = "Треб. отсадка"
                                } else if (data.results[modal_id].status[0] == "MF") {
                                    rabbit_status = "Кормится у матери"
                                }
                                for (let key in data.results[modal_id].status) {
                                    if (data.results[modal_id].status[key] == "RF") {
                                        rabbit_status += ", Готов к размнож."
                                    } else if (data.results[modal_id].status[key] == "R") {
                                        rabbit_status += ", Отдыхает"
                                    } else if (data.results[modal_id].status[key] == "UP") {
                                        rabbit_status += ", Неподтвержденная берем."
                                    } else if (data.results[modal_id].status[key] == "NI") {
                                        rabbit_status += ", Нужен осмотр на берем."
                                    } else if (data.results[modal_id].status[key] == "CP") {
                                        rabbit_status += ", Беременная"
                                    } else if (data.results[modal_id].status[key] == "FB") {
                                        rabbit_status += ", Кормит крольчат"
                                    } else if (data.results[modal_id].status[key] == "NV") {
                                        rabbit_status += ", Треб. вак."
                                    } else if (data.results[modal_id].status[key] == "NI") {
                                        rabbit_status += ", Треб. осмотр"
                                    } else if (data.results[modal_id].status[key] == "WC") {
                                        rabbit_status += ", Кормится без кокцидиост."
                                    } else if (data.results[modal_id].status[key] == "RS") {
                                        rabbit_status += ", Готов к убою"
                                    } else if (data.results[modal_id].status[key] == "NJ") {
                                        rabbit_status += ", Треб. отсадка"
                                    } else if (data.results[modal_id].status[key] == "MF") {
                                        rabbit_status += ", Кормится у матери"
                                    }
                                }
                            } else {
                                if (data.results[modal_id].status[0] == "RF") {
                                    var rabbit_status = "Готов к размнож."
                                } else if (data.results[modal_id].status[0] == "R") {
                                    rabbit_status = "Отдыхает"
                                } else if (data.results[modal_id].status[0] == "UP") {
                                    rabbit_status = "Неподтвержденная берем."
                                } else if (data.results[modal_id].status[0] == "NI") {
                                    rabbit_status = "Нужен осмотр на берем."
                                } else if (data.results[modal_id].status[0] == "CP") {
                                    rabbit_status = "Беременная"
                                } else if (data.results[modal_id].status[0] == "FB") {
                                    rabbit_status = "Кормит крольчат"
                                } else if (data.results[modal_id].status[0] == "NV") {
                                    rabbit_status = "Треб. вак."
                                } else if (data.results[modal_id].status[0] == "NI") {
                                    rabbit_status = "Треб. осмотр"
                                } else if (data.results[modal_id].status[0] == "WC") {
                                    rabbit_status = "Кормится без кокцидиост."
                                } else if (data.results[modal_id].status[0] == "RS") {
                                    rabbit_status = "Готов к убою"
                                } else if (data.results[modal_id].status[0] == "NJ") {
                                    rabbit_status = "Треб. отсадка"
                                } else if (data.results[modal_id].status[0] == "MF") {
                                    rabbit_status = "Кормится у матери"
                                }
                            }

                            if (data.results[modal_id].is_male === null) {
                                modalSex = "unknown";
                            } else if (data.results[modal_id].is_male === true) {
                                modalSex = "male-main";
                            } else if (data.results[modal_id].is_male === false) {
                                modalSex = "female-main";
                            }

                            $('.rabbitModal-header').prepend(
                                '<img class="added" src="/img/rabbit-ico' + modal_ico + '.svg">'
                            );

                            $('.rabbit-header-info').append(
                                '<a class="changeWeightLink added" href="#changeWeight" id="' + modal_id + '">' +
                                '<div class="changeWeight">' +
                                '<img src="/img/change-weight.svg">' +
                                '<p>Взвесить</p>' +
                                '</div>' +
                                '</a>'
                            )

                            $('.rabbit-header-sex').append(
                                '<img class="added" src="/img/' + modalSex + '.svg">'
                            )

                            $('.rabbit-header-info-bot').append(
                                '<p class="added">#' + this_id + '</p>' +
                                '<p class="added">' + data.results[modal_id].weight + '</p>'
                            )

                            var birth = new Date(data.results[modal_id].birthday);
                            var now = new Date;
                            now = (now - birth) / 1000 / 60 / 60 / 24;
                            birth = birth.format("dd.mm.yyyy");
                            $('.rabbit-header-right').append(
                                '<p class="added">Дата рождения:&nbsp<font class="added" style="font-weight:700;width:9.4ch;display:inline-flex;overflow:hidden;">' + birth + '</font></p>' +
                                '<p class="added">Возраст:&nbsp<font class="added" style="font-weight:700;">' + Math.round(now) + '&nbspдней</font></p>'
                            )

                            $('.rabbitModal-type').append(
                                '<span class="subheader-details added">&nbsp' + rabbit_type + '</span>'
                            )

                            $('.rabbitModal-breed').append(
                                '<span class="subheader-details added">&nbsp' + data.results[modal_id].breed + '</span>'
                            )

                            $('.rabbitModal-cageNum').append(
                                '<span class="subheader-details added"> &nbsp' + data.results[modal_id].cage.farm_number + data.results[modal_id].cage.number + data.results[modal_id].cage.letter + '</span>'
                            )

                            $('.rabbitModal-status').append(
                                '<span class="subheader-details added"> &nbsp' + rabbit_status + '</span>'
                            )


                            getData(curr_rabbit_operations)
                                .then((value) => {
                                    return value.json();
                                })
                                .then((data) => {

                                    if (data[0] === undefined) {
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
                                            $('.operations-history-body').append(
                                                '<div class="operations-history-item added">' +
                                                '<p>' + date + '</p>' +
                                                '</div>'
                                            )
                                            $('#rabbit-modal-loading').remove();
                                        }
                                    }
                                    $('#rabbit-modal-loading').remove();
                                });

                            $(".changeWeightLink").click(function() {
                                $('#loader-rabbit-modal').append(
                                    '<div id="rabbit-modal-loading" class="loading">' +
                                    '<img src="/img/loading.gif">' +
                                    '</div>'
                                );
                                let weight_rabbit_id_in_array = this.id;
                                let weight_rabbit_id = +this.id + 1;
                                let newWeight = {
                                    "weight": null
                                }
                                showWeight = data.results[weight_rabbit_id_in_array].weight;

                                $('.curr-rabbit-weight').append(
                                    '<span class="added added-secondary" style="white-space: nowrap;">&nbsp' + data.results[weight_rabbit_id_in_array].weight + '</span>'
                                )

                                $('#changeWeight-modal-loading').remove()

                                $(".submit-changeWeight").click(function() {
                                    $('.added-secondary').remove();
                                    newWeight.weight = +$("#newWeight").val();
                                    putData(makeLink(rabbitsURL, weight_rabbit_id_filtered, data.results[weight_rabbit_id_in_array].current_type), newWeight)
                                        .then((value) => {
                                            $('.rightside-filter').empty();
                                            $('#newWeight').empty();
                                        })
                                })
                            })

                        });

                        $("#changeWeight-close").click(function() {
                            $('.added-secondary').remove();
                            $('#rabbit-modal-loading').remove();
                        })

                        $("#rabbitModal-close-filtered").click(function() {
                            $('#loader-rabbit-modal').append(
                                '<div id="rabbit-modal-loading" class="loading">' +
                                '<img src="/img/loading.gif">' +
                                '</div>'
                            );
                            $('.added').remove();
                        });

                        var items = $(".list-item");
                        var numItems = data.count;
                        var perPage = 10;

                        $('#pagination-container').pagination({
                            items: numItems,
                            itemsOnPage: perPage,
                            prevText: "Предыдущая",
                            nextText: "Следующая",
                            onPageClick: function(pageNumber) {
                                $('.rabbitModal, .rabbitModal-filtered').remove()
                                getData(sidebar_filter_order += newValue + "&page=" + pageNumber)
                                    .then((value) => {
                                        return value.json()
                                    })
                                    .then((data) => {
                                        var totalItems = Object.keys(data.results).length;
                                        var type = "НЕ УКАЗ";

                                        $('#list-wrapper-loading').remove();

                                        for (var i = 0; i < totalItems; i++) {

                                            var birthday = new Date(data.results[i].birthday);
                                            var today = new Date;

                                            var diff = today - birthday;
                                            var milliseconds = diff;
                                            var seconds = milliseconds / 1000;
                                            var minutes = seconds / 60;
                                            var hours = minutes / 60;
                                            var days = hours / 24;

                                            var rabbitSize;
                                            var sex;

                                            if (data.results[i].weight === null) {
                                                data.results[i].weight = "?";
                                            } else {
                                                data.results[i].weight += " кг."
                                            }

                                            if (data.results[i].is_male === null) {
                                                sex = "unknown";
                                            } else if (data.results[i].is_male === true) {
                                                sex = "male-main";
                                            } else if (data.results[i].is_male === false) {
                                                sex = "female-main";
                                            }

                                            if (data.results[i].current_type == "B") {
                                                rabbitSize = "small-rabbit";
                                                type = "МАЛЕНЬК";
                                            } else if (data.results[i].current_type == "F") {
                                                rabbitSize = "rabbit";
                                                type = "ОТКОРМ";
                                            } else if (data.results[i].current_type == "M") {
                                                rabbitSize = "rabbit";
                                                type = "РАЗМНОЖ";
                                            } else if (data.results[i].current_type == "P") {
                                                rabbitSize = "rabbit";
                                                type = "РАЗМНОЖ";
                                            } else {
                                                rabbitSize = "rabbit";
                                            }

                                            if (Object.keys(data.results[i].status).length > 1) {
                                                if (data.results[i].status[0] == "RF") {
                                                    var rabbit_status = "Готов к размнож."
                                                } else if (data.results[i].status[0] == "R") {
                                                    rabbit_status = "Отдыхает"
                                                } else if (data.results[i].status[0] == "UP") {
                                                    rabbit_status = "Неподтвержденная берем."
                                                } else if (data.results[i].status[0] == "NI") {
                                                    rabbit_status = "Нужен осмотр на берем."
                                                } else if (data.results[i].status[0] == "CP") {
                                                    rabbit_status = "Беременная"
                                                } else if (data.results[i].status[0] == "FB") {
                                                    rabbit_status = "Кормит крольчат"
                                                } else if (data.results[i].status[0] == "NV") {
                                                    rabbit_status = "Треб. вак."
                                                } else if (data.results[i].status[0] == "NI") {
                                                    rabbit_status = "Треб. осмотр"
                                                } else if (data.results[i].status[0] == "WC") {
                                                    rabbit_status = "Кормится без кокцидиост."
                                                } else if (data.results[i].status[0] == "RS") {
                                                    rabbit_status = "Готов к убою"
                                                } else if (data.results[i].status[0] == "NJ") {
                                                    rabbit_status = "Треб. отсадка"
                                                } else if (data.results[i].status[0] == "MF") {
                                                    rabbit_status = "Кормится у матери"
                                                }
                                                for (let key in data.results[i].status) {
                                                    if (data.results[i].status[key] == "RF") {
                                                        rabbit_status += ", Готов к размнож."
                                                    } else if (data.results[i].status[key] == "R") {
                                                        rabbit_status += ", Отдыхает"
                                                    } else if (data.results[i].status[key] == "UP") {
                                                        rabbit_status += ", Неподтвержденная берем."
                                                    } else if (data.results[i].status[key] == "NI") {
                                                        rabbit_status += ", Нужен осмотр на берем."
                                                    } else if (data.results[i].status[key] == "CP") {
                                                        rabbit_status += ", Беременная"
                                                    } else if (data.results[i].status[key] == "FB") {
                                                        rabbit_status += ", Кормит крольчат"
                                                    } else if (data.results[i].status[key] == "NV") {
                                                        rabbit_status += ", Треб. вак."
                                                    } else if (data.results[i].status[key] == "NI") {
                                                        rabbit_status += ", Треб. осмотр"
                                                    } else if (data.results[i].status[key] == "WC") {
                                                        rabbit_status += ", Кормится без кокцидиост."
                                                    } else if (data.results[i].status[key] == "RS") {
                                                        rabbit_status += ", Готов к убою"
                                                    } else if (data.results[i].status[key] == "NJ") {
                                                        rabbit_status += ", Треб. отсадка"
                                                    } else if (data.results[i].status[key] == "MF") {
                                                        rabbit_status += ", Кормится у матери"
                                                    }
                                                }
                                            } else {
                                                if (data.results[i].status[0] == "RF") {
                                                    var rabbit_status = "Готов к размнож."
                                                } else if (data.results[i].status[0] == "R") {
                                                    rabbit_status = "Отдыхает"
                                                } else if (data.results[i].status[0] == "UP") {
                                                    rabbit_status = "Неподтвержденная берем."
                                                } else if (data.results[i].status[0] == "NI") {
                                                    rabbit_status = "Нужен осмотр на берем."
                                                } else if (data.results[i].status[0] == "CP") {
                                                    rabbit_status = "Беременная"
                                                } else if (data.results[i].status[0] == "FB") {
                                                    rabbit_status = "Кормит крольчат"
                                                } else if (data.results[i].status[0] == "NV") {
                                                    rabbit_status = "Треб. вак."
                                                } else if (data.results[i].status[0] == "NI") {
                                                    rabbit_status = "Треб. осмотр"
                                                } else if (data.results[i].status[0] == "WC") {
                                                    rabbit_status = "Кормится без кокцидиост."
                                                } else if (data.results[i].status[0] == "RS") {
                                                    rabbit_status = "Готов к убою"
                                                } else if (data.results[i].status[0] == "NJ") {
                                                    rabbit_status = "Треб. отсадка"
                                                } else if (data.results[i].status[0] == "MF") {
                                                    rabbit_status = "Кормится у матери"
                                                }
                                            }


                                            $('#list-wrapper').append(
                                                '<a href="#rabbitModal-filtered" class="rabbitModal-filtered" name="' + i + '" id="' + data.results[i].id + '">' +
                                                '<div class="list-item">' +
                                                '<div class="left-item-body">' +
                                                '<label class="' + rabbitSize + '-select">' +
                                                '<input type="checkbox" id="selected-rabiit-id' + data.results[i].id + '" name="' + rabbitSize + '-checkbox">' +
                                                '<span class="rabbitCheckbox"></span>' +
                                                '</label>' +
                                                '<div class="v-wrapper">' +
                                                '<p>' + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + '</p>' +
                                                '</div>' +
                                                '</div>' +
                                                '<div class="middle-item-body">' +
                                                '<div class="v-wrapper">' +
                                                '<p>#' + data.results[i].id + '</p>' +
                                                '</div>' +
                                                '<div class="v-wrapper">' +
                                                '<div class="h-wrapper">' +
                                                '<img src="/img/' + sex + '.svg">' +
                                                '</div>' +
                                                '</div>' +
                                                '<div class="v-wrapper">' +
                                                '<p>' + type + '</p>' +
                                                '</div>' +
                                                '<div class="v-wrapper">' +
                                                '<div class="h-wrapper">' +
                                                '<p class="kind">' + data.results[i].breed + '</p>' +
                                                '</div>' +
                                                '</div>' +
                                                '<div class="v-wrapper">' +
                                                '<p>' + Math.round(days) + '&nbspдней</p>' +
                                                '</div>' +
                                                '<div class="v-wrapper">' +
                                                '<p>' + data.results[i].weight + '</p>' +
                                                '</div>' +
                                                '</div>' +
                                                '<div class="right-item-body">' +
                                                '<p>' + rabbit_status + '</p>' +
                                                '</div>' +
                                                '</div>' +
                                                '</a>'
                                            );
                                        }
                                    })
                            }
                        });


                        var count = 0;
                        $(function() {
                            updateCount();
                            $('input[name=rabbit-checkbox], input[name=small-rabbit-checkbox]').change(function() {
                                updateCount(this.checked ? 1 : -1);
                            });
                            $('#invert').click(function(e) {
                                e = $('input[name=rabbit-checkbox], input[name=small-rabbit-checkbox]');
                                e.each(function(i, el) {
                                    el.checked = !el.checked;
                                });
                                updateCount(e.length - count - count);
                            });
                        });

                        function updateCount(a) {
                            count = a ? count + a : $('input[name=rabbit-checkbox]:checked').length;
                            $('#count').text(count);
                        }
                    })

            } else if (!sidebar_filter) {
                let link = rabbitsURL;
                $('#pagination-container>ul').remove();
                $('.list-wrapper').append(
                    '<div id="list-wrapper-loading" class="loading">' +
                    '<img src="/img/loading.gif">' +
                    '</div>'
                );
                $('.rabbitModal, .rabbitModal-filtered').remove()
                getData((link += e.target.value))
                    .then((value) => {
                        return value.json();
                    })
                    .then((data) => {
                        $('list-wrapper-loading').remove()

                        var totalItems = Object.keys(data.results).length;
                        var type = "НЕ УКАЗ";

                        $('#list-wrapper-loading').remove();

                        for (var i = 0; i < totalItems; i++) {

                            var birthday = new Date(data.results[i].birthday);
                            var today = new Date;

                            var diff = today - birthday;
                            var milliseconds = diff;
                            var seconds = milliseconds / 1000;
                            var minutes = seconds / 60;
                            var hours = minutes / 60;
                            var days = hours / 24;

                            var rabbitSize;
                            var sex;

                            if (data.results[i].weight === null) {
                                data.results[i].weight = "?";
                            } else {
                                data.results[i].weight += " кг."
                            }

                            if (data.results[i].is_male === null) {
                                sex = "unknown";
                            } else if (data.results[i].is_male === true) {
                                sex = "male-main";
                            } else if (data.results[i].is_male === false) {
                                sex = "female-main";
                            }

                            if (data.results[i].current_type == "B") {
                                rabbitSize = "small-rabbit";
                                type = "МАЛЕНЬК";
                            } else if (data.results[i].current_type == "F") {
                                rabbitSize = "rabbit";
                                type = "ОТКОРМ";
                            } else if (data.results[i].current_type == "M") {
                                rabbitSize = "rabbit";
                                type = "РАЗМНОЖ";
                            } else if (data.results[i].current_type == "P") {
                                rabbitSize = "rabbit";
                                type = "РАЗМНОЖ";
                            } else {
                                rabbitSize = "rabbit";
                            }

                            if (Object.keys(data.results[i].status).length > 1) {
                                if (data.results[i].status[0] == "RF") {
                                    var rabbit_status = "Готов к размнож."
                                } else if (data.results[i].status[0] == "R") {
                                    rabbit_status = "Отдыхает"
                                } else if (data.results[i].status[0] == "UP") {
                                    rabbit_status = "Неподтвержденная берем."
                                } else if (data.results[i].status[0] == "NI") {
                                    rabbit_status = "Нужен осмотр на берем."
                                } else if (data.results[i].status[0] == "CP") {
                                    rabbit_status = "Беременная"
                                } else if (data.results[i].status[0] == "FB") {
                                    rabbit_status = "Кормит крольчат"
                                } else if (data.results[i].status[0] == "NV") {
                                    rabbit_status = "Треб. вак."
                                } else if (data.results[i].status[0] == "NI") {
                                    rabbit_status = "Треб. осмотр"
                                } else if (data.results[i].status[0] == "WC") {
                                    rabbit_status = "Кормится без кокцидиост."
                                } else if (data.results[i].status[0] == "RS") {
                                    rabbit_status = "Готов к убою"
                                } else if (data.results[i].status[0] == "NJ") {
                                    rabbit_status = "Треб. отсадка"
                                } else if (data.results[i].status[0] == "MF") {
                                    rabbit_status = "Кормится у матери"
                                }
                                for (let key in data.results[i].status) {
                                    if (data.results[i].status[key] == "RF") {
                                        rabbit_status += ", Готов к размнож."
                                    } else if (data.results[i].status[key] == "R") {
                                        rabbit_status += ", Отдыхает"
                                    } else if (data.results[i].status[key] == "UP") {
                                        rabbit_status += ", Неподтвержденная берем."
                                    } else if (data.results[i].status[key] == "NI") {
                                        rabbit_status += ", Нужен осмотр на берем."
                                    } else if (data.results[i].status[key] == "CP") {
                                        rabbit_status += ", Беременная"
                                    } else if (data.results[i].status[key] == "FB") {
                                        rabbit_status += ", Кормит крольчат"
                                    } else if (data.results[i].status[key] == "NV") {
                                        rabbit_status += ", Треб. вак."
                                    } else if (data.results[i].status[key] == "NI") {
                                        rabbit_status += ", Треб. осмотр"
                                    } else if (data.results[i].status[key] == "WC") {
                                        rabbit_status += ", Кормится без кокцидиост."
                                    } else if (data.results[i].status[key] == "RS") {
                                        rabbit_status += ", Готов к убою"
                                    } else if (data.results[i].status[key] == "NJ") {
                                        rabbit_status += ", Треб. отсадка"
                                    } else if (data.results[i].status[key] == "MF") {
                                        rabbit_status += ", Кормится у матери"
                                    }
                                }
                            } else {
                                if (data.results[i].status[0] == "RF") {
                                    var rabbit_status = "Готов к размнож."
                                } else if (data.results[i].status[0] == "R") {
                                    rabbit_status = "Отдыхает"
                                } else if (data.results[i].status[0] == "UP") {
                                    rabbit_status = "Неподтвержденная берем."
                                } else if (data.results[i].status[0] == "NI") {
                                    rabbit_status = "Нужен осмотр на берем."
                                } else if (data.results[i].status[0] == "CP") {
                                    rabbit_status = "Беременная"
                                } else if (data.results[i].status[0] == "FB") {
                                    rabbit_status = "Кормит крольчат"
                                } else if (data.results[i].status[0] == "NV") {
                                    rabbit_status = "Треб. вак."
                                } else if (data.results[i].status[0] == "NI") {
                                    rabbit_status = "Треб. осмотр"
                                } else if (data.results[i].status[0] == "WC") {
                                    rabbit_status = "Кормится без кокцидиост."
                                } else if (data.results[i].status[0] == "RS") {
                                    rabbit_status = "Готов к убою"
                                } else if (data.results[i].status[0] == "NJ") {
                                    rabbit_status = "Треб. отсадка"
                                } else if (data.results[i].status[0] == "MF") {
                                    rabbit_status = "Кормится у матери"
                                }
                            }


                            $('#list-wrapper').append(
                                '<a href="#rabbitModal-filtered" class="rabbitModal-filtered" name="' + i + '" id="' + data.results[i].id + '">' +
                                '<div class="list-item">' +
                                '<div class="left-item-body">' +
                                '<label class="' + rabbitSize + '-select">' +
                                '<input type="checkbox" id="selected-rabiit-id' + data.results[i].id + '" name="' + rabbitSize + '-checkbox">' +
                                '<span class="rabbitCheckbox"></span>' +
                                '</label>' +
                                '<div class="v-wrapper">' +
                                '<p>' + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="middle-item-body">' +
                                '<div class="v-wrapper">' +
                                '<p>#' + data.results[i].id + '</p>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<div class="h-wrapper">' +
                                '<img src="/img/' + sex + '.svg">' +
                                '</div>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<p>' + type + '</p>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<div class="h-wrapper">' +
                                '<p class="kind">' + data.results[i].breed + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<p>' + Math.round(days) + '&nbspдней</p>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<p>' + data.results[i].weight + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="right-item-body">' +
                                '<p>' + rabbit_status + '</p>' +
                                '</div>' +
                                '</div>' +
                                '</a>'
                            );
                        }
                        $(".rabbitModal-filtered").click(function() {
                            $(".added").remove();

                            let modal_id = +this.name; //номер кролика
                            let this_id = +this.id; //номер записи о кролике
                            let modal_ico;
                            let weight_rabbit_id_filtered = this_id;
                            let modalSex;
                            let rabbit_type;
                            let curr_rabbit_operations = rabbit_operations;
                            curr_rabbit_operations += this_id;

                            var birthday = new Date(data.results[modal_id].birthday);
                            var today = new Date;
                            var diff = today - birthday;
                            var milliseconds = diff;
                            var seconds = milliseconds / 1000;
                            var minutes = seconds / 60;
                            var hours = minutes / 60;
                            var days = hours / 24;

                            if (data.results[modal_id].current_type == "B") {
                                modal_ico = "-small";
                                rabbit_type = "МАЛЕНЬК"
                            } else if (data.results[modal_id].current_type == "F") {
                                modal_ico = "-big";
                                rabbit_type = "ОТКРОМ"
                            } else if (data.results[modal_id].current_type == "M") {
                                modal_ico = "-big";
                                rabbit_type = "РАЗМНОЖ"
                            } else if (data.results[modal_id].current_type == "P") {
                                modal_ico = "-big";
                                rabbit_type = "РАЗМНОЖ"
                            }

                            if (Object.keys(data.results[modal_id].status) > 1) {
                                if (data.results[modal_id].status[0] == "RF") {
                                    var rabbit_status = "Готов к размнож."
                                } else if (data.results[modal_id].status[0] == "R") {
                                    rabbit_status = "Отдыхает"
                                } else if (data.results[modal_id].status[0] == "UP") {
                                    rabbit_status = "Неподтвержденная берем."
                                } else if (data.results[modal_id].status[0] == "NI") {
                                    rabbit_status = "Нужен осмотр на берем."
                                } else if (data.results[modal_id].status[0] == "CP") {
                                    rabbit_status = "Беременная"
                                } else if (data.results[modal_id].status[0] == "FB") {
                                    rabbit_status = "Кормит крольчат"
                                } else if (data.results[modal_id].status[0] == "NV") {
                                    rabbit_status = "Треб. вак."
                                } else if (data.results[modal_id].status[0] == "NI") {
                                    rabbit_status = "Треб. осмотр"
                                } else if (data.results[modal_id].status[0] == "WC") {
                                    rabbit_status = "Кормится без кокцидиост."
                                } else if (data.results[modal_id].status[0] == "RS") {
                                    rabbit_status = "Готов к убою"
                                } else if (data.results[modal_id].status[0] == "NJ") {
                                    rabbit_status = "Треб. отсадка"
                                } else if (data.results[modal_id].status[0] == "MF") {
                                    rabbit_status = "Кормится у матери"
                                }
                                for (let key in data.results[modal_id].status) {
                                    if (data.results[modal_id].status[key] == "RF") {
                                        rabbit_status += ", Готов к размнож."
                                    } else if (data.results[modal_id].status[key] == "R") {
                                        rabbit_status += ", Отдыхает"
                                    } else if (data.results[modal_id].status[key] == "UP") {
                                        rabbit_status += ", Неподтвержденная берем."
                                    } else if (data.results[modal_id].status[key] == "NI") {
                                        rabbit_status += ", Нужен осмотр на берем."
                                    } else if (data.results[modal_id].status[key] == "CP") {
                                        rabbit_status += ", Беременная"
                                    } else if (data.results[modal_id].status[key] == "FB") {
                                        rabbit_status += ", Кормит крольчат"
                                    } else if (data.results[modal_id].status[key] == "NV") {
                                        rabbit_status += ", Треб. вак."
                                    } else if (data.results[modal_id].status[key] == "NI") {
                                        rabbit_status += ", Треб. осмотр"
                                    } else if (data.results[modal_id].status[key] == "WC") {
                                        rabbit_status += ", Кормится без кокцидиост."
                                    } else if (data.results[modal_id].status[key] == "RS") {
                                        rabbit_status += ", Готов к убою"
                                    } else if (data.results[modal_id].status[key] == "NJ") {
                                        rabbit_status += ", Треб. отсадка"
                                    } else if (data.results[modal_id].status[key] == "MF") {
                                        rabbit_status += ", Кормится у матери"
                                    }
                                }
                            } else {
                                if (data.results[modal_id].status[0] == "RF") {
                                    var rabbit_status = "Готов к размнож."
                                } else if (data.results[modal_id].status[0] == "R") {
                                    rabbit_status = "Отдыхает"
                                } else if (data.results[modal_id].status[0] == "UP") {
                                    rabbit_status = "Неподтвержденная берем."
                                } else if (data.results[modal_id].status[0] == "NI") {
                                    rabbit_status = "Нужен осмотр на берем."
                                } else if (data.results[modal_id].status[0] == "CP") {
                                    rabbit_status = "Беременная"
                                } else if (data.results[modal_id].status[0] == "FB") {
                                    rabbit_status = "Кормит крольчат"
                                } else if (data.results[modal_id].status[0] == "NV") {
                                    rabbit_status = "Треб. вак."
                                } else if (data.results[modal_id].status[0] == "NI") {
                                    rabbit_status = "Треб. осмотр"
                                } else if (data.results[modal_id].status[0] == "WC") {
                                    rabbit_status = "Кормится без кокцидиост."
                                } else if (data.results[modal_id].status[0] == "RS") {
                                    rabbit_status = "Готов к убою"
                                } else if (data.results[modal_id].status[0] == "NJ") {
                                    rabbit_status = "Треб. отсадка"
                                } else if (data.results[modal_id].status[0] == "MF") {
                                    rabbit_status = "Кормится у матери"
                                }
                            }

                            if (data.results[modal_id].is_male === null) {
                                modalSex = "unknown";
                            } else if (data.results[modal_id].is_male === true) {
                                modalSex = "male-main";
                            } else if (data.results[modal_id].is_male === false) {
                                modalSex = "female-main";
                            }

                            $('.rabbitModal-header').prepend(
                                '<img class="added" src="/img/rabbit-ico' + modal_ico + '.svg">'
                            );

                            $('.rabbit-header-info').append(
                                '<a class="changeWeightLink added" href="#changeWeight" id="' + modal_id + '">' +
                                '<div class="changeWeight">' +
                                '<img src="/img/change-weight.svg">' +
                                '<p>Взвесить</p>' +
                                '</div>' +
                                '</a>'
                            )

                            $('.rabbit-header-sex').append(
                                '<img class="added" src="/img/' + modalSex + '.svg">'
                            )

                            $('.rabbit-header-info-bot').append(
                                '<p class="added">#' + this_id + '</p>' +
                                '<p class="added">' + data.results[modal_id].weight + '</p>'
                            )

                            var birth = new Date(data.results[modal_id].birthday);
                            var now = new Date;
                            now = (now - birth) / 1000 / 60 / 60 / 24;
                            birth = birth.format("dd.mm.yyyy");
                            $('.rabbit-header-right').append(
                                '<p class="added">Дата рождения:&nbsp<font class="added" style="font-weight:700;width:9.4ch;display:inline-flex;overflow:hidden;">' + birth + '</font></p>' +
                                '<p class="added">Возраст:&nbsp<font class="added" style="font-weight:700;">' + Math.round(now) + '&nbspдней</font></p>'
                            )

                            $('.rabbitModal-type').append(
                                '<span class="subheader-details added">&nbsp' + rabbit_type + '</span>'
                            )

                            $('.rabbitModal-breed').append(
                                '<span class="subheader-details added">&nbsp' + data.results[modal_id].breed + '</span>'
                            )

                            $('.rabbitModal-cageNum').append(
                                '<span class="subheader-details added"> &nbsp' + data.results[modal_id].cage.farm_number + data.results[modal_id].cage.number + data.results[modal_id].cage.letter + '</span>'
                            )

                            $('.rabbitModal-status').append(
                                '<span class="subheader-details added"> &nbsp' + rabbit_status + '</span>'
                            )


                            getData(curr_rabbit_operations)
                                .then((value) => {
                                    return value.json();
                                })
                                .then((data) => {

                                    if (data[0] === undefined) {
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
                                            $('.operations-history-body').append(
                                                '<div class="operations-history-item added">' +
                                                '<p>' + date + '</p>' +
                                                '</div>'
                                            )
                                            $('#rabbit-modal-loading').remove();
                                        }
                                    }
                                    $('#rabbit-modal-loading').remove();
                                });

                            $(".changeWeightLink").click(function() {
                                $('#loader-rabbit-modal').append(
                                    '<div id="rabbit-modal-loading" class="loading">' +
                                    '<img src="/img/loading.gif">' +
                                    '</div>'
                                );
                                let weight_rabbit_id_in_array = this.id;
                                let weight_rabbit_id = +this.id + 1;
                                let newWeight = {
                                    "weight": null
                                }
                                showWeight = data.results[weight_rabbit_id_in_array].weight;

                                $('.curr-rabbit-weight').append(
                                    '<span class="added added-secondary" style="white-space: nowrap;">&nbsp' + data.results[weight_rabbit_id_in_array].weight + '</span>'
                                )

                                $('#changeWeight-modal-loading').remove()

                                $(".submit-changeWeight").click(function() {
                                    $('.added-secondary').remove();
                                    newWeight.weight = +$("#newWeight").val();
                                    putData(makeLink(rabbitsURL, weight_rabbit_id_filtered, data.results[weight_rabbit_id_in_array].current_type), newWeight)
                                        .then((value) => {
                                            $('.rightside-filter').empty();
                                            $('#newWeight').empty();
                                        })
                                })
                            })

                        });

                        $("#changeWeight-close").click(function() {
                            $('.added-secondary').remove();
                            $('#rabbit-modal-loading').remove();
                        })

                        $("#rabbitModal-close-filtered").click(function() {
                            $('#loader-rabbit-modal').append(
                                '<div id="rabbit-modal-loading" class="loading">' +
                                '<img src="/img/loading.gif">' +
                                '</div>'
                            );
                            $('.added').remove();
                        });

                        var items = $(".list-item");
                        var numItems = data.count;
                        var perPage = 10;

                        $('#pagination-container').pagination({
                            items: numItems,
                            itemsOnPage: perPage,
                            prevText: "Предыдущая",
                            nextText: "Следующая",
                            onPageClick: function(pageNumber) {
                                $('.rabbitModal, .rabbitModal-filtered').remove()
                                getData((link += e.target.value + "&page=" + pageNumber))
                                    .then((value) => {
                                        return value.json()
                                    })
                                    .then((data) => {
                                        var totalItems = Object.keys(data.results).length;
                                        var type = "НЕ УКАЗ";

                                        $('#list-wrapper-loading').remove();

                                        for (var i = 0; i < totalItems; i++) {

                                            var birthday = new Date(data.results[i].birthday);
                                            var today = new Date;

                                            var diff = today - birthday;
                                            var milliseconds = diff;
                                            var seconds = milliseconds / 1000;
                                            var minutes = seconds / 60;
                                            var hours = minutes / 60;
                                            var days = hours / 24;

                                            var rabbitSize;
                                            var sex;

                                            if (data.results[i].weight === null) {
                                                data.results[i].weight = "?";
                                            } else {
                                                data.results[i].weight += " кг."
                                            }

                                            if (data.results[i].is_male === null) {
                                                sex = "unknown";
                                            } else if (data.results[i].is_male === true) {
                                                sex = "male-main";
                                            } else if (data.results[i].is_male === false) {
                                                sex = "female-main";
                                            }

                                            if (data.results[i].current_type == "B") {
                                                rabbitSize = "small-rabbit";
                                                type = "МАЛЕНЬК";
                                            } else if (data.results[i].current_type == "F") {
                                                rabbitSize = "rabbit";
                                                type = "ОТКОРМ";
                                            } else if (data.results[i].current_type == "M") {
                                                rabbitSize = "rabbit";
                                                type = "РАЗМНОЖ";
                                            } else if (data.results[i].current_type == "P") {
                                                rabbitSize = "rabbit";
                                                type = "РАЗМНОЖ";
                                            } else {
                                                rabbitSize = "rabbit";
                                            }

                                            if (Object.keys(data.results[i].status).length > 1) {
                                                if (data.results[i].status[0] == "RF") {
                                                    var rabbit_status = "Готов к размнож."
                                                } else if (data.results[i].status[0] == "R") {
                                                    rabbit_status = "Отдыхает"
                                                } else if (data.results[i].status[0] == "UP") {
                                                    rabbit_status = "Неподтвержденная берем."
                                                } else if (data.results[i].status[0] == "NI") {
                                                    rabbit_status = "Нужен осмотр на берем."
                                                } else if (data.results[i].status[0] == "CP") {
                                                    rabbit_status = "Беременная"
                                                } else if (data.results[i].status[0] == "FB") {
                                                    rabbit_status = "Кормит крольчат"
                                                } else if (data.results[i].status[0] == "NV") {
                                                    rabbit_status = "Треб. вак."
                                                } else if (data.results[i].status[0] == "NI") {
                                                    rabbit_status = "Треб. осмотр"
                                                } else if (data.results[i].status[0] == "WC") {
                                                    rabbit_status = "Кормится без кокцидиост."
                                                } else if (data.results[i].status[0] == "RS") {
                                                    rabbit_status = "Готов к убою"
                                                } else if (data.results[i].status[0] == "NJ") {
                                                    rabbit_status = "Треб. отсадка"
                                                } else if (data.results[i].status[0] == "MF") {
                                                    rabbit_status = "Кормится у матери"
                                                }
                                                for (let key in data.results[i].status) {
                                                    if (data.results[i].status[key] == "RF") {
                                                        rabbit_status += ", Готов к размнож."
                                                    } else if (data.results[i].status[key] == "R") {
                                                        rabbit_status += ", Отдыхает"
                                                    } else if (data.results[i].status[key] == "UP") {
                                                        rabbit_status += ", Неподтвержденная берем."
                                                    } else if (data.results[i].status[key] == "NI") {
                                                        rabbit_status += ", Нужен осмотр на берем."
                                                    } else if (data.results[i].status[key] == "CP") {
                                                        rabbit_status += ", Беременная"
                                                    } else if (data.results[i].status[key] == "FB") {
                                                        rabbit_status += ", Кормит крольчат"
                                                    } else if (data.results[i].status[key] == "NV") {
                                                        rabbit_status += ", Треб. вак."
                                                    } else if (data.results[i].status[key] == "NI") {
                                                        rabbit_status += ", Треб. осмотр"
                                                    } else if (data.results[i].status[key] == "WC") {
                                                        rabbit_status += ", Кормится без кокцидиост."
                                                    } else if (data.results[i].status[key] == "RS") {
                                                        rabbit_status += ", Готов к убою"
                                                    } else if (data.results[i].status[key] == "NJ") {
                                                        rabbit_status += ", Треб. отсадка"
                                                    } else if (data.results[i].status[key] == "MF") {
                                                        rabbit_status += ", Кормится у матери"
                                                    }
                                                }
                                            } else {
                                                if (data.results[i].status[0] == "RF") {
                                                    var rabbit_status = "Готов к размнож."
                                                } else if (data.results[i].status[0] == "R") {
                                                    rabbit_status = "Отдыхает"
                                                } else if (data.results[i].status[0] == "UP") {
                                                    rabbit_status = "Неподтвержденная берем."
                                                } else if (data.results[i].status[0] == "NI") {
                                                    rabbit_status = "Нужен осмотр на берем."
                                                } else if (data.results[i].status[0] == "CP") {
                                                    rabbit_status = "Беременная"
                                                } else if (data.results[i].status[0] == "FB") {
                                                    rabbit_status = "Кормит крольчат"
                                                } else if (data.results[i].status[0] == "NV") {
                                                    rabbit_status = "Треб. вак."
                                                } else if (data.results[i].status[0] == "NI") {
                                                    rabbit_status = "Треб. осмотр"
                                                } else if (data.results[i].status[0] == "WC") {
                                                    rabbit_status = "Кормится без кокцидиост."
                                                } else if (data.results[i].status[0] == "RS") {
                                                    rabbit_status = "Готов к убою"
                                                } else if (data.results[i].status[0] == "NJ") {
                                                    rabbit_status = "Треб. отсадка"
                                                } else if (data.results[i].status[0] == "MF") {
                                                    rabbit_status = "Кормится у матери"
                                                }
                                            }


                                            $('#list-wrapper').append(
                                                '<a href="#rabbitModal-filtered" class="rabbitModal-filtered" name="' + i + '" id="' + data.results[i].id + '">' +
                                                '<div class="list-item">' +
                                                '<div class="left-item-body">' +
                                                '<label class="' + rabbitSize + '-select">' +
                                                '<input type="checkbox" id="selected-rabiit-id' + data.results[i].id + '" name="' + rabbitSize + '-checkbox">' +
                                                '<span class="rabbitCheckbox"></span>' +
                                                '</label>' +
                                                '<div class="v-wrapper">' +
                                                '<p>' + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + '</p>' +
                                                '</div>' +
                                                '</div>' +
                                                '<div class="middle-item-body">' +
                                                '<div class="v-wrapper">' +
                                                '<p>#' + data.results[i].id + '</p>' +
                                                '</div>' +
                                                '<div class="v-wrapper">' +
                                                '<div class="h-wrapper">' +
                                                '<img src="/img/' + sex + '.svg">' +
                                                '</div>' +
                                                '</div>' +
                                                '<div class="v-wrapper">' +
                                                '<p>' + type + '</p>' +
                                                '</div>' +
                                                '<div class="v-wrapper">' +
                                                '<div class="h-wrapper">' +
                                                '<p class="kind">' + data.results[i].breed + '</p>' +
                                                '</div>' +
                                                '</div>' +
                                                '<div class="v-wrapper">' +
                                                '<p>' + Math.round(days) + '&nbspдней</p>' +
                                                '</div>' +
                                                '<div class="v-wrapper">' +
                                                '<p>' + data.results[i].weight + '</p>' +
                                                '</div>' +
                                                '</div>' +
                                                '<div class="right-item-body">' +
                                                '<p>' + rabbit_status + '</p>' +
                                                '</div>' +
                                                '</div>' +
                                                '</a>'
                                            );
                                        }
                                    })
                            }
                        });


                        var count = 0;
                        $(function() {
                            updateCount();
                            $('input[name=rabbit-checkbox], input[name=small-rabbit-checkbox]').change(function() {
                                updateCount(this.checked ? 1 : -1);
                            });
                            $('#invert').click(function(e) {
                                e = $('input[name=rabbit-checkbox], input[name=small-rabbit-checkbox]');
                                e.each(function(i, el) {
                                    el.checked = !el.checked;
                                });
                                updateCount(e.length - count - count);
                            });
                        });

                        function updateCount(a) {
                            count = a ? count + a : $('input[name=rabbit-checkbox]:checked').length;
                            $('#count').text(count);
                        }
                    })
            }
        })

        getData(rabbits_breed)
            .then((value) => {
                return value.json()
            })
            .then((data) => {
                let total_breeds = data.count;

                for (let i = 0; i < total_breeds; i++) {
                    $('.breeds-container').append(
                        '<option value="' + data.results[i].id + '">' + data.results[i].title + '</option>'
                    );
                }
                f_farm_number = $('.rightside-farm-filter').val();
                if ($('.rightside-male-filter').prop('checked')) {
                    f_male = $('.rightside-male-filter').val();
                }
                if ($('.rightside-female-filter').prop('checked')) {
                    f_female = $('.rightside-female-filter').val();
                }
                f_rabbit_type = $('.rightside-rtype-filter').val();
                f_rabbit_breed = $('.breeds-container').val();
                f_age_from = $('.age-from').val();
                f_age_to = $('.age-to').val();
                f_rabbit_status = $('.rabbit-status').val();
                f_weight_from = $('.weight-from').val();
                f_weight_to = $('.weight-to').val();

                document.querySelector(".count-filtered1").addEventListener('change', function(e) {
                    _f_farm_number = e.target.value;
                    let o_key = "_f_farm_number"

                    if (_f_farm_number == "all_farms") {
                        _f_farm_number = "";
                    } else {
                        _f_farm_number = "farm_number=" + _f_farm_number;
                    }

                    countResponse(o_key, _f_farm_number)
                });

                document.querySelector(".count-filtered2").addEventListener('change', function(e) {
                    _f_male = e.target.value;

                    let o_key = "_f_male"

                    if ($('.count-filtered2').prop('checked')) {
                        _f_male = "&is_male=1"
                        if ($('.count-filtered2').prop('checked') && $('.count-filtered3').prop('checked')) {
                            _f_male = "&"
                        }
                    } else if ($('.count-filtered3').prop('checked') && !$('.count-filtered2').prop('checked')) {
                        _f_male = "&is_male=0"
                    } else {
                        _f_male = "&"
                    }
                    countResponse(o_key, _f_male)
                });

                document.querySelector(".count-filtered3").addEventListener('change', function(e) {
                    _f_male = e.target.value;
                    let o_key = "_f_male"

                    if ($('.count-filtered3').prop('checked')) {
                        _f_male = "&is_male=0"
                        if ($('.count-filtered2').prop('checked') && $('.count-filtered3').prop('checked')) {
                            _f_male = "&"
                        }
                    } else if ($('.count-filtered2').prop('checked') && !$('.count-filtered3').prop('checked')) {
                        _f_male = "&is_male=1"
                    } else {
                        _f_male = "&"
                    }

                    countResponse(o_key, _f_male)
                });

                document.querySelector(".count-filtered4").addEventListener('change', function(e) {
                    _f_rabbit_type = e.target.value;
                    let o_key = "_f_rabbit_type"

                    if (_f_rabbit_type == "alltypes") {
                        _f_rabbit_type = "&"
                    } else {
                        _f_rabbit_type = "&type=" + _f_rabbit_type;
                    }

                    countResponse(o_key, _f_rabbit_type)
                });

                document.querySelector(".count-filtered5").addEventListener('change', function(e) {
                    _f_rabbit_breed = e.target.value;
                    let o_key = "_f_rabbit_breed";

                    if (_f_rabbit_breed == "all_breeds") {
                        _f_rabbit_breed = "&";
                    } else {
                        _f_rabbit_breed = "&breed=" + _f_rabbit_breed;
                    }

                    countResponse(o_key, _f_rabbit_breed)
                });

                document.querySelector(".count-filtered6").addEventListener('change', function(e) {
                    _f_age_from = e.target.value;
                    let o_key = "_f_age_from"

                    if (_f_age_from === "") {
                        _f_age_from = "&"
                    } else {
                        _f_age_from = "&age_from=" + _f_age_from
                    }

                    if (_f_age_from != "" && _f_age_to != "" && _f_age_from > _f_age_to) {
                        console.log("Дебил, считать не умеешь что-ли? Выставь правильно диапазон возраста.")
                    }

                    countResponse(o_key, _f_age_from)
                });

                document.querySelector(".count-filtered7").addEventListener('change', function(e) {
                    _f_age_to = e.target.value;
                    let o_key = "_f_age_to"

                    if (_f_age_from != "" && _f_age_to != "" && f_age_from > _f_age_to) {
                        console.log("Дебил, считать не умеешь что-ли? Выставь правильно диапазон возраста.")
                    } else if (_f_age_to === "") {
                        _f_age_to = "&"
                    } else {
                        _f_age_to = "&age_to=" + _f_age_to
                    }

                    countResponse(o_key, _f_age_to)
                });

                document.querySelector(".count-filtered8").addEventListener('change', function(e) {
                    _f_rabbit_status = e.target.value;
                    let o_key = "_f_rabbit_status"

                    if (_f_rabbit_status == "all_stats") {
                        _f_rabbit_status = "&"
                    } else {
                        _f_rabbit_status = "&status=" + _f_rabbit_status
                    }

                    countResponse(o_key, _f_rabbit_status)
                });

                document.querySelector(".count-filtered9").addEventListener('change', function(e) {
                    _f_weight_from = e.target.value;
                    let o_key = "_f_weight_from"

                    if (_f_weight_from === "") {
                        _f_weight_from = "&"
                    } else {
                        _f_weight_from = "&weight_from=" + _f_weight_from
                    }
                    if (_f_weight_from != "" && _f_weight_to != "" && _f_weight_from > _f_weight_to) {
                        console.log("Дебил, считать не умеешь что-ли? Выставь правильно диапазон возраста.")
                    }

                    countResponse(o_key, _f_weight_from)
                });

                document.querySelector(".count-filtered10").addEventListener('change', function(e) {
                    _f_weight_to = e.target.value;
                    let o_key = "_f_weight_to"

                    if (_f_weight_from != "" && _f_weight_to != "" && _f_weight_from > _f_weight_to) {
                        console.log("Дебил, считать не умеешь что-ли? Выставь правильно диапазон возраста.")
                    } else if (_f_weight_to === "") {
                        _f_weight_to = "&"
                    } else {
                        _f_weight_to = "&weight_to=" + _f_weight_to
                    }
                    countResponse(o_key, _f_weight_to)
                });




                $('.submit-btn-filter-side').click(function() {
                    sidebar_filter = true

                    $('#pagination-container>ul').remove();
                    $('.list-wrapper').append(
                        '<div id="list-wrapper-loading" class="loading">' +
                        '<img src="/img/loading.gif">' +
                        '</div>'
                    );

                    filter += _f_farm_number + _f_male + _f_rabbit_type + _f_rabbit_breed + _f_age_from + _f_age_to + _f_rabbit_status + _f_weight_from + _f_weight_to;
                    sidebar_filter_order = filter

                    $('.rabbitModal, .rabbitModal-filtered').remove()
                    getData(filter)
                        .then((value) => {
                            return value.json();
                        })
                        .then((data) => {
                            filter = "https://rabbit-api--test.herokuapp.com/api/rabbit/?";
                            $('#list-wrapper-loading').remove()

                            var totalItems = Object.keys(data.results).length;
                            var type = "НЕ УКАЗ";

                            for (var i = 0; i < totalItems; i++) {

                                var birthday = new Date(data.results[i].birthday);
                                var today = new Date;

                                var diff = today - birthday;
                                var milliseconds = diff;
                                var seconds = milliseconds / 1000;
                                var minutes = seconds / 60;
                                var hours = minutes / 60;
                                var days = hours / 24;

                                var rabbitSize;
                                var sex;

                                if (data.results[i].weight === null) {
                                    data.results[i].weight = "?";
                                } else {
                                    data.results[i].weight += " кг."
                                }

                                if (data.results[i].is_male === null) {
                                    sex = "unknown";
                                } else if (data.results[i].is_male === true) {
                                    sex = "male-main";
                                } else if (data.results[i].is_male === false) {
                                    sex = "female-main";
                                }

                                if (data.results[i].current_type == "B") {
                                    rabbitSize = "small-rabbit";
                                    type = "МАЛЕНЬК";
                                } else if (data.results[i].current_type == "F") {
                                    rabbitSize = "rabbit";
                                    type = "ОТКОРМ";
                                } else if (data.results[i].current_type == "M") {
                                    rabbitSize = "rabbit";
                                    type = "РАЗМНОЖ";
                                } else if (data.results[i].current_type == "P") {
                                    rabbitSize = "rabbit";
                                    type = "РАЗМНОЖ";
                                } else {
                                    rabbitSize = "rabbit";
                                }

                                if (Object.keys(data.results[i].status).length > 1) {
                                    if (data.results[i].status[0] == "RF") {
                                        var rabbit_status = "Готов к размнож."
                                    } else if (data.results[i].status[0] == "R") {
                                        rabbit_status = "Отдыхает"
                                    } else if (data.results[i].status[0] == "UP") {
                                        rabbit_status = "Неподтвержденная берем."
                                    } else if (data.results[i].status[0] == "NI") {
                                        rabbit_status = "Нужен осмотр на берем."
                                    } else if (data.results[i].status[0] == "CP") {
                                        rabbit_status = "Беременная"
                                    } else if (data.results[i].status[0] == "FB") {
                                        rabbit_status = "Кормит крольчат"
                                    } else if (data.results[i].status[0] == "NV") {
                                        rabbit_status = "Треб. вак."
                                    } else if (data.results[i].status[0] == "NI") {
                                        rabbit_status = "Треб. осмотр"
                                    } else if (data.results[i].status[0] == "WC") {
                                        rabbit_status = "Кормится без кокцидиост."
                                    } else if (data.results[i].status[0] == "RS") {
                                        rabbit_status = "Готов к убою"
                                    } else if (data.results[i].status[0] == "NJ") {
                                        rabbit_status = "Треб. отсадка"
                                    } else if (data.results[i].status[0] == "MF") {
                                        rabbit_status = "Кормится у матери"
                                    }
                                    for (let key in data.results[i].status) {
                                        if (data.results[i].status[key] == "RF") {
                                            rabbit_status += ", Готов к размнож."
                                        } else if (data.results[i].status[key] == "R") {
                                            rabbit_status += ", Отдыхает"
                                        } else if (data.results[i].status[key] == "UP") {
                                            rabbit_status += ", Неподтвержденная берем."
                                        } else if (data.results[i].status[key] == "NI") {
                                            rabbit_status += ", Нужен осмотр на берем."
                                        } else if (data.results[i].status[key] == "CP") {
                                            rabbit_status += ", Беременная"
                                        } else if (data.results[i].status[key] == "FB") {
                                            rabbit_status += ", Кормит крольчат"
                                        } else if (data.results[i].status[key] == "NV") {
                                            rabbit_status += ", Треб. вак."
                                        } else if (data.results[i].status[key] == "NI") {
                                            rabbit_status += ", Треб. осмотр"
                                        } else if (data.results[i].status[key] == "WC") {
                                            rabbit_status += ", Кормится без кокцидиост."
                                        } else if (data.results[i].status[key] == "RS") {
                                            rabbit_status += ", Готов к убою"
                                        } else if (data.results[i].status[key] == "NJ") {
                                            rabbit_status += ", Треб. отсадка"
                                        } else if (data.results[i].status[key] == "MF") {
                                            rabbit_status += ", Кормится у матери"
                                        }
                                    }
                                } else {
                                    if (data.results[i].status[0] == "RF") {
                                        var rabbit_status = "Готов к размнож."
                                    } else if (data.results[i].status[0] == "R") {
                                        rabbit_status = "Отдыхает"
                                    } else if (data.results[i].status[0] == "UP") {
                                        rabbit_status = "Неподтвержденная берем."
                                    } else if (data.results[i].status[0] == "NI") {
                                        rabbit_status = "Нужен осмотр на берем."
                                    } else if (data.results[i].status[0] == "CP") {
                                        rabbit_status = "Беременная"
                                    } else if (data.results[i].status[0] == "FB") {
                                        rabbit_status = "Кормит крольчат"
                                    } else if (data.results[i].status[0] == "NV") {
                                        rabbit_status = "Треб. вак."
                                    } else if (data.results[i].status[0] == "NI") {
                                        rabbit_status = "Треб. осмотр"
                                    } else if (data.results[i].status[0] == "WC") {
                                        rabbit_status = "Кормится без кокцидиост."
                                    } else if (data.results[i].status[0] == "RS") {
                                        rabbit_status = "Готов к убою"
                                    } else if (data.results[i].status[0] == "NJ") {
                                        rabbit_status = "Треб. отсадка"
                                    } else if (data.results[i].status[0] == "MF") {
                                        rabbit_status = "Кормится у матери"
                                    }
                                }


                                $('#list-wrapper').append(
                                    '<a href="#rabbitModal-filtered" class="rabbitModal-filtered" name="' + i + '" id="' + data.results[i].id + '">' +
                                    '<div class="list-item">' +
                                    '<div class="left-item-body">' +
                                    '<label class="' + rabbitSize + '-select">' +
                                    '<input type="checkbox" id="selected-rabiit-id' + data.results[i].id + '" name="' + rabbitSize + '-checkbox">' +
                                    '<span class="rabbitCheckbox"></span>' +
                                    '</label>' +
                                    '<div class="v-wrapper">' +
                                    '<p>' + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + '</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="middle-item-body">' +
                                    '<div class="v-wrapper">' +
                                    '<p>#' + data.results[i].id + '</p>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<div class="h-wrapper">' +
                                    '<img src="/img/' + sex + '.svg">' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<p>' + type + '</p>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<div class="h-wrapper">' +
                                    '<p class="kind">' + data.results[i].breed + '</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<p>' + Math.round(days) + '&nbspдней</p>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<p>' + data.results[i].weight + '</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="right-item-body">' +
                                    '<p>' + rabbit_status + '</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '</a>'
                                );
                            }
                            $(".rabbitModal-filtered").click(function() {
                                $(".added").remove();

                                let modal_id = +this.name; //номер кролика
                                let this_id = +this.id; //номер записи о кролике
                                let modal_ico;
                                let weight_rabbit_id_filtered = this_id;
                                let modalSex;
                                let rabbit_type;
                                let curr_rabbit_operations = rabbit_operations + this_id;

                                var birthday = new Date(data.results[modal_id].birthday);
                                var today = new Date;
                                var diff = today - birthday;
                                var milliseconds = diff;
                                var seconds = milliseconds / 1000;
                                var minutes = seconds / 60;
                                var hours = minutes / 60;
                                var days = hours / 24;

                                if (data.results[modal_id].current_type == "B") {
                                    modal_ico = "-small";
                                    rabbit_type = "МАЛЕНЬК"
                                } else if (data.results[modal_id].current_type == "F") {
                                    modal_ico = "-big";
                                    rabbit_type = "ОТКРОМ"
                                } else if (data.results[modal_id].current_type == "M") {
                                    modal_ico = "-big";
                                    rabbit_type = "РАЗМНОЖ"
                                } else if (data.results[modal_id].current_type == "P") {
                                    modal_ico = "-big";
                                    rabbit_type = "РАЗМНОЖ"
                                }

                                if (Object.keys(data.results[modal_id].status) > 1) {
                                    if (data.results[modal_id].status[0] == "RF") {
                                        var rabbit_status = "Готов к размнож."
                                    } else if (data.results[modal_id].status[0] == "R") {
                                        rabbit_status = "Отдыхает"
                                    } else if (data.results[modal_id].status[0] == "UP") {
                                        rabbit_status = "Неподтвержденная берем."
                                    } else if (data.results[modal_id].status[0] == "NI") {
                                        rabbit_status = "Нужен осмотр на берем."
                                    } else if (data.results[modal_id].status[0] == "CP") {
                                        rabbit_status = "Беременная"
                                    } else if (data.results[modal_id].status[0] == "FB") {
                                        rabbit_status = "Кормит крольчат"
                                    } else if (data.results[modal_id].status[0] == "NV") {
                                        rabbit_status = "Треб. вак."
                                    } else if (data.results[modal_id].status[0] == "NI") {
                                        rabbit_status = "Треб. осмотр"
                                    } else if (data.results[modal_id].status[0] == "WC") {
                                        rabbit_status = "Кормится без кокцидиост."
                                    } else if (data.results[modal_id].status[0] == "RS") {
                                        rabbit_status = "Готов к убою"
                                    } else if (data.results[modal_id].status[0] == "NJ") {
                                        rabbit_status = "Треб. отсадка"
                                    } else if (data.results[modal_id].status[0] == "MF") {
                                        rabbit_status = "Кормится у матери"
                                    }
                                    for (let key in data.results[modal_id].status) {
                                        if (data.results[modal_id].status[key] == "RF") {
                                            rabbit_status += ", Готов к размнож."
                                        } else if (data.results[modal_id].status[key] == "R") {
                                            rabbit_status += ", Отдыхает"
                                        } else if (data.results[modal_id].status[key] == "UP") {
                                            rabbit_status += ", Неподтвержденная берем."
                                        } else if (data.results[modal_id].status[key] == "NI") {
                                            rabbit_status += ", Нужен осмотр на берем."
                                        } else if (data.results[modal_id].status[key] == "CP") {
                                            rabbit_status += ", Беременная"
                                        } else if (data.results[modal_id].status[key] == "FB") {
                                            rabbit_status += ", Кормит крольчат"
                                        } else if (data.results[modal_id].status[key] == "NV") {
                                            rabbit_status += ", Треб. вак."
                                        } else if (data.results[modal_id].status[key] == "NI") {
                                            rabbit_status += ", Треб. осмотр"
                                        } else if (data.results[modal_id].status[key] == "WC") {
                                            rabbit_status += ", Кормится без кокцидиост."
                                        } else if (data.results[modal_id].status[key] == "RS") {
                                            rabbit_status += ", Готов к убою"
                                        } else if (data.results[modal_id].status[key] == "NJ") {
                                            rabbit_status += ", Треб. отсадка"
                                        } else if (data.results[modal_id].status[key] == "MF") {
                                            rabbit_status += ", Кормится у матери"
                                        }
                                    }
                                } else {
                                    if (data.results[modal_id].status[0] == "RF") {
                                        var rabbit_status = "Готов к размнож."
                                    } else if (data.results[modal_id].status[0] == "R") {
                                        rabbit_status = "Отдыхает"
                                    } else if (data.results[modal_id].status[0] == "UP") {
                                        rabbit_status = "Неподтвержденная берем."
                                    } else if (data.results[modal_id].status[0] == "NI") {
                                        rabbit_status = "Нужен осмотр на берем."
                                    } else if (data.results[modal_id].status[0] == "CP") {
                                        rabbit_status = "Беременная"
                                    } else if (data.results[modal_id].status[0] == "FB") {
                                        rabbit_status = "Кормит крольчат"
                                    } else if (data.results[modal_id].status[0] == "NV") {
                                        rabbit_status = "Треб. вак."
                                    } else if (data.results[modal_id].status[0] == "NI") {
                                        rabbit_status = "Треб. осмотр"
                                    } else if (data.results[modal_id].status[0] == "WC") {
                                        rabbit_status = "Кормится без кокцидиост."
                                    } else if (data.results[modal_id].status[0] == "RS") {
                                        rabbit_status = "Готов к убою"
                                    } else if (data.results[modal_id].status[0] == "NJ") {
                                        rabbit_status = "Треб. отсадка"
                                    } else if (data.results[modal_id].status[0] == "MF") {
                                        rabbit_status = "Кормится у матери"
                                    }
                                }

                                if (data.results[modal_id].is_male === null) {
                                    modalSex = "unknown";
                                } else if (data.results[modal_id].is_male === true) {
                                    modalSex = "male-main";
                                } else if (data.results[modal_id].is_male === false) {
                                    modalSex = "female-main";
                                }

                                $('.rabbitModal-header').prepend(
                                    '<img class="added" src="/img/rabbit-ico' + modal_ico + '.svg">'
                                );

                                $('.rabbit-header-info').append(
                                    '<a class="changeWeightLink added" href="#changeWeight" id="' + modal_id + '">' +
                                    '<div class="changeWeight">' +
                                    '<img src="/img/change-weight.svg">' +
                                    '<p>Взвесить</p>' +
                                    '</div>' +
                                    '</a>'
                                )

                                $('.rabbit-header-sex').append(
                                    '<img class="added" src="/img/' + modalSex + '.svg">'
                                )

                                $('.rabbit-header-info-bot').append(
                                    '<p class="added">#' + this_id + '</p>' +
                                    '<p class="added">' + data.results[modal_id].weight + '</p>'
                                )

                                var birth = new Date(data.results[modal_id].birthday);
                                var now = new Date;
                                now = (now - birth) / 1000 / 60 / 60 / 24;
                                birth = birth.format("dd.mm.yyyy");
                                $('.rabbit-header-right').append(
                                    '<p class="added">Дата рождения:&nbsp<font class="added" style="font-weight:700;width:9.4ch;display:inline-flex;overflow:hidden;">' + birth + '</font></p>' +
                                    '<p class="added">Возраст:&nbsp<font class="added" style="font-weight:700;">' + Math.round(now) + '&nbspдней</font></p>'
                                )

                                $('.rabbitModal-type').append(
                                    '<span class="subheader-details added">&nbsp' + rabbit_type + '</span>'
                                )

                                $('.rabbitModal-breed').append(
                                    '<span class="subheader-details added">&nbsp' + data.results[modal_id].breed + '</span>'
                                )

                                $('.rabbitModal-cageNum').append(
                                    '<span class="subheader-details added"> &nbsp' + data.results[modal_id].cage.farm_number + data.results[modal_id].cage.number + data.results[modal_id].cage.letter + '</span>'
                                )

                                $('.rabbitModal-status').append(
                                    '<span class="subheader-details added"> &nbsp' + rabbit_status + '</span>'
                                )


                                getData(curr_rabbit_operations)
                                    .then((value) => {
                                        return value.json();
                                    })
                                    .then((data) => {

                                        if (data[0] === undefined) {
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
                                                $('.operations-history-body').append(
                                                    '<div class="operations-history-item added">' +
                                                    '<p>' + date + '</p>' +
                                                    '</div>'
                                                )
                                                $('#rabbit-modal-loading').remove();
                                            }
                                        }
                                        $('#rabbit-modal-loading').remove();
                                    });

                                $(".changeWeightLink").click(function() {
                                    $('#loader-rabbit-modal').append(
                                        '<div id="rabbit-modal-loading" class="loading">' +
                                        '<img src="/img/loading.gif">' +
                                        '</div>'
                                    );
                                    let weight_rabbit_id_in_array = this.id;
                                    let weight_rabbit_id = +this.id + 1;
                                    let newWeight = {
                                        "weight": null
                                    }
                                    showWeight = data.results[weight_rabbit_id_in_array].weight;

                                    $('.curr-rabbit-weight').append(
                                        '<span class="added added-secondary" style="white-space: nowrap;">&nbsp' + data.results[weight_rabbit_id_in_array].weight + '</span>'
                                    )

                                    $('#changeWeight-modal-loading').remove()

                                    $(".submit-changeWeight").click(function() {
                                        $('.added-secondary').remove();
                                        newWeight.weight = +$("#newWeight").val();
                                        putData(makeLink(rabbitsURL, weight_rabbit_id_filtered, data.results[weight_rabbit_id_in_array].current_type), newWeight)
                                            .then((value) => {
                                                $('.rightside-filter').empty();
                                                $('#newWeight').empty();
                                            })
                                    })
                                })

                            });

                            $("#changeWeight-close").click(function() {
                                $('.added-secondary').remove();
                                $('#rabbit-modal-loading').remove();
                            })

                            $("#rabbitModal-close-filtered").click(function() {
                                $('#loader-rabbit-modal').append(
                                    '<div id="rabbit-modal-loading" class="loading">' +
                                    '<img src="/img/loading.gif">' +
                                    '</div>'
                                );
                                $('.added').remove();
                            });

                            var items = $(".list-item");
                            var numItems = data.count;
                            var perPage = 10;

                            $('#pagination-container').pagination({
                                items: numItems,
                                itemsOnPage: perPage,
                                prevText: "Предыдущая",
                                nextText: "Следующая",
                                onPageClick: function(pageNumber) {
                                    $('.rabbitModal, .rabbitModal-filtered').remove()
                                    getData(filter + "&page=" + pageNumber)
                                        .then((value) => {
                                            return value.json()
                                        })
                                        .then((data) => {
                                            var totalItems = Object.keys(data.results).length;
                                            var type = "НЕ УКАЗ";

                                            for (var i = 0; i < totalItems; i++) {

                                                var birthday = new Date(data.results[i].birthday);
                                                var today = new Date;

                                                var diff = today - birthday;
                                                var milliseconds = diff;
                                                var seconds = milliseconds / 1000;
                                                var minutes = seconds / 60;
                                                var hours = minutes / 60;
                                                var days = hours / 24;

                                                var rabbitSize;
                                                var sex;

                                                if (data.results[i].weight === null) {
                                                    data.results[i].weight = "?";
                                                } else {
                                                    data.results[i].weight += " кг."
                                                }

                                                if (data.results[i].is_male === null) {
                                                    sex = "unknown";
                                                } else if (data.results[i].is_male === true) {
                                                    sex = "male-main";
                                                } else if (data.results[i].is_male === false) {
                                                    sex = "female-main";
                                                }

                                                if (data.results[i].current_type == "B") {
                                                    rabbitSize = "small-rabbit";
                                                    type = "МАЛЕНЬК";
                                                } else if (data.results[i].current_type == "F") {
                                                    rabbitSize = "rabbit";
                                                    type = "ОТКОРМ";
                                                } else if (data.results[i].current_type == "M") {
                                                    rabbitSize = "rabbit";
                                                    type = "РАЗМНОЖ";
                                                } else if (data.results[i].current_type == "P") {
                                                    rabbitSize = "rabbit";
                                                    type = "РАЗМНОЖ";
                                                } else {
                                                    rabbitSize = "rabbit";
                                                }

                                                if (Object.keys(data.results[i].status).length > 1) {
                                                    if (data.results[i].status[0] == "RF") {
                                                        var rabbit_status = "Готов к размнож."
                                                    } else if (data.results[i].status[0] == "R") {
                                                        rabbit_status = "Отдыхает"
                                                    } else if (data.results[i].status[0] == "UP") {
                                                        rabbit_status = "Неподтвержденная берем."
                                                    } else if (data.results[i].status[0] == "NI") {
                                                        rabbit_status = "Нужен осмотр на берем."
                                                    } else if (data.results[i].status[0] == "CP") {
                                                        rabbit_status = "Беременная"
                                                    } else if (data.results[i].status[0] == "FB") {
                                                        rabbit_status = "Кормит крольчат"
                                                    } else if (data.results[i].status[0] == "NV") {
                                                        rabbit_status = "Треб. вак."
                                                    } else if (data.results[i].status[0] == "NI") {
                                                        rabbit_status = "Треб. осмотр"
                                                    } else if (data.results[i].status[0] == "WC") {
                                                        rabbit_status = "Кормится без кокцидиост."
                                                    } else if (data.results[i].status[0] == "RS") {
                                                        rabbit_status = "Готов к убою"
                                                    } else if (data.results[i].status[0] == "NJ") {
                                                        rabbit_status = "Треб. отсадка"
                                                    } else if (data.results[i].status[0] == "MF") {
                                                        rabbit_status = "Кормится у матери"
                                                    }
                                                    for (let key in data.results[i].status) {
                                                        if (data.results[i].status[key] == "RF") {
                                                            rabbit_status += ", Готов к размнож."
                                                        } else if (data.results[i].status[key] == "R") {
                                                            rabbit_status += ", Отдыхает"
                                                        } else if (data.results[i].status[key] == "UP") {
                                                            rabbit_status += ", Неподтвержденная берем."
                                                        } else if (data.results[i].status[key] == "NI") {
                                                            rabbit_status += ", Нужен осмотр на берем."
                                                        } else if (data.results[i].status[key] == "CP") {
                                                            rabbit_status += ", Беременная"
                                                        } else if (data.results[i].status[key] == "FB") {
                                                            rabbit_status += ", Кормит крольчат"
                                                        } else if (data.results[i].status[key] == "NV") {
                                                            rabbit_status += ", Треб. вак."
                                                        } else if (data.results[i].status[key] == "NI") {
                                                            rabbit_status += ", Треб. осмотр"
                                                        } else if (data.results[i].status[key] == "WC") {
                                                            rabbit_status += ", Кормится без кокцидиост."
                                                        } else if (data.results[i].status[key] == "RS") {
                                                            rabbit_status += ", Готов к убою"
                                                        } else if (data.results[i].status[key] == "NJ") {
                                                            rabbit_status += ", Треб. отсадка"
                                                        } else if (data.results[i].status[key] == "MF") {
                                                            rabbit_status += ", Кормится у матери"
                                                        }
                                                    }
                                                } else {
                                                    if (data.results[i].status[0] == "RF") {
                                                        var rabbit_status = "Готов к размнож."
                                                    } else if (data.results[i].status[0] == "R") {
                                                        rabbit_status = "Отдыхает"
                                                    } else if (data.results[i].status[0] == "UP") {
                                                        rabbit_status = "Неподтвержденная берем."
                                                    } else if (data.results[i].status[0] == "NI") {
                                                        rabbit_status = "Нужен осмотр на берем."
                                                    } else if (data.results[i].status[0] == "CP") {
                                                        rabbit_status = "Беременная"
                                                    } else if (data.results[i].status[0] == "FB") {
                                                        rabbit_status = "Кормит крольчат"
                                                    } else if (data.results[i].status[0] == "NV") {
                                                        rabbit_status = "Треб. вак."
                                                    } else if (data.results[i].status[0] == "NI") {
                                                        rabbit_status = "Треб. осмотр"
                                                    } else if (data.results[i].status[0] == "WC") {
                                                        rabbit_status = "Кормится без кокцидиост."
                                                    } else if (data.results[i].status[0] == "RS") {
                                                        rabbit_status = "Готов к убою"
                                                    } else if (data.results[i].status[0] == "NJ") {
                                                        rabbit_status = "Треб. отсадка"
                                                    } else if (data.results[i].status[0] == "MF") {
                                                        rabbit_status = "Кормится у матери"
                                                    }
                                                }


                                                $('#list-wrapper').append(
                                                    '<a href="#rabbitModal-filtered" class="rabbitModal-filtered" name="' + i + '" id="' + data.results[i].id + '">' +
                                                    '<div class="list-item">' +
                                                    '<div class="left-item-body">' +
                                                    '<label class="' + rabbitSize + '-select">' +
                                                    '<input type="checkbox" id="selected-rabiit-id' + data.results[i].id + '" name="' + rabbitSize + '-checkbox">' +
                                                    '<span class="rabbitCheckbox"></span>' +
                                                    '</label>' +
                                                    '<div class="v-wrapper">' +
                                                    '<p>' + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + '</p>' +
                                                    '</div>' +
                                                    '</div>' +
                                                    '<div class="middle-item-body">' +
                                                    '<div class="v-wrapper">' +
                                                    '<p>#' + data.results[i].id + '</p>' +
                                                    '</div>' +
                                                    '<div class="v-wrapper">' +
                                                    '<div class="h-wrapper">' +
                                                    '<img src="/img/' + sex + '.svg">' +
                                                    '</div>' +
                                                    '</div>' +
                                                    '<div class="v-wrapper">' +
                                                    '<p>' + type + '</p>' +
                                                    '</div>' +
                                                    '<div class="v-wrapper">' +
                                                    '<div class="h-wrapper">' +
                                                    '<p class="kind">' + data.results[i].breed + '</p>' +
                                                    '</div>' +
                                                    '</div>' +
                                                    '<div class="v-wrapper">' +
                                                    '<p>' + Math.round(days) + '&nbspдней</p>' +
                                                    '</div>' +
                                                    '<div class="v-wrapper">' +
                                                    '<p>' + data.results[i].weight + '</p>' +
                                                    '</div>' +
                                                    '</div>' +
                                                    '<div class="right-item-body">' +
                                                    '<p>' + rabbit_status + '</p>' +
                                                    '</div>' +
                                                    '</div>' +
                                                    '</a>'
                                                );
                                            }
                                        })
                                }
                            });


                            var count = 0;
                            $(function() {
                                updateCount();
                                $('input[name=rabbit-checkbox], input[name=small-rabbit-checkbox]').change(function() {
                                    updateCount(this.checked ? 1 : -1);
                                });
                                $('#invert').click(function(e) {
                                    e = $('input[name=rabbit-checkbox], input[name=small-rabbit-checkbox]');
                                    e.each(function(i, el) {
                                        el.checked = !el.checked;
                                    });
                                    updateCount(e.length - count - count);
                                });
                            });

                            function updateCount(a) {
                                count = a ? count + a : $('input[name=rabbit-checkbox]:checked').length;
                                $('#count').text(count);
                            }
                        })
                });
            })

        $(".rabbitModal").click(function() {
            $(".added").remove();

            let modal_id = this.id - 1;
            let this_id = this.id;
            let modal_ico;
            let modalSex;
            let rabbit_type;
            let curr_rabbit_operations = rabbit_operations;
            curr_rabbit_operations += this_id;

            var birthday = new Date(data.results[modal_id].birthday);
            var today = new Date;
            var diff = today - birthday;
            var milliseconds = diff;
            var seconds = milliseconds / 1000;
            var minutes = seconds / 60;
            var hours = minutes / 60;
            var days = hours / 24;

            if (data.results[modal_id].current_type == "B") {
                modal_ico = "-small";
                rabbit_type = "МАЛЕНЬК"
            } else if (data.results[modal_id].current_type == "F") {
                modal_ico = "-big";
                rabbit_type = "ОТКРОМ"
            } else if (data.results[modal_id].current_type == "M") {
                modal_ico = "-big";
                rabbit_type = "РАЗМНОЖ"
            } else if (data.results[modal_id].current_type == "P") {
                modal_ico = "-big";
                rabbit_type = "РАЗМНОЖ"
            }

            if (Object.keys(data.results[modal_id].status) > 1) {
                if (data.results[modal_id].status[0] == "RF") {
                    var rabbit_status = "Готов к размнож."
                } else if (data.results[modal_id].status[0] == "R") {
                    rabbit_status = "Отдыхает"
                } else if (data.results[modal_id].status[0] == "UP") {
                    rabbit_status = "Неподтвержденная берем."
                } else if (data.results[modal_id].status[0] == "NI") {
                    rabbit_status = "Нужен осмотр на берем."
                } else if (data.results[modal_id].status[0] == "CP") {
                    rabbit_status = "Беременная"
                } else if (data.results[modal_id].status[0] == "FB") {
                    rabbit_status = "Кормит крольчат"
                } else if (data.results[modal_id].status[0] == "NV") {
                    rabbit_status = "Треб. вак."
                } else if (data.results[modal_id].status[0] == "NI") {
                    rabbit_status = "Треб. осмотр"
                } else if (data.results[modal_id].status[0] == "WC") {
                    rabbit_status = "Кормится без кокцидиост."
                } else if (data.results[modal_id].status[0] == "RS") {
                    rabbit_status = "Готов к убою"
                } else if (data.results[modal_id].status[0] == "NJ") {
                    rabbit_status = "Треб. отсадка"
                } else if (data.results[modal_id].status[0] == "MF") {
                    rabbit_status = "Кормится у матери"
                }
                for (let key in data.results[modal_id].status) {
                    if (data.results[modal_id].status[key] == "RF") {
                        rabbit_status += ", Готов к размнож."
                    } else if (data.results[modal_id].status[key] == "R") {
                        rabbit_status += ", Отдыхает"
                    } else if (data.results[modal_id].status[key] == "UP") {
                        rabbit_status += ", Неподтвержденная берем."
                    } else if (data.results[modal_id].status[key] == "NI") {
                        rabbit_status += ", Нужен осмотр на берем."
                    } else if (data.results[modal_id].status[key] == "CP") {
                        rabbit_status += ", Беременная"
                    } else if (data.results[modal_id].status[key] == "FB") {
                        rabbit_status += ", Кормит крольчат"
                    } else if (data.results[modal_id].status[key] == "NV") {
                        rabbit_status += ", Треб. вак."
                    } else if (data.results[modal_id].status[key] == "NI") {
                        rabbit_status += ", Треб. осмотр"
                    } else if (data.results[modal_id].status[key] == "WC") {
                        rabbit_status += ", Кормится без кокцидиост."
                    } else if (data.results[modal_id].status[key] == "RS") {
                        rabbit_status += ", Готов к убою"
                    } else if (data.results[modal_id].status[key] == "NJ") {
                        rabbit_status += ", Треб. отсадка"
                    } else if (data.results[modal_id].status[key] == "MF") {
                        rabbit_status += ", Кормится у матери"
                    }
                }
            } else {
                if (data.results[modal_id].status[0] == "RF") {
                    var rabbit_status = "Готов к размнож."
                } else if (data.results[modal_id].status[0] == "R") {
                    rabbit_status = "Отдыхает"
                } else if (data.results[modal_id].status[0] == "UP") {
                    rabbit_status = "Неподтвержденная берем."
                } else if (data.results[modal_id].status[0] == "NI") {
                    rabbit_status = "Нужен осмотр на берем."
                } else if (data.results[modal_id].status[0] == "CP") {
                    rabbit_status = "Беременная"
                } else if (data.results[modal_id].status[0] == "FB") {
                    rabbit_status = "Кормит крольчат"
                } else if (data.results[modal_id].status[0] == "NV") {
                    rabbit_status = "Треб. вак."
                } else if (data.results[modal_id].status[0] == "NI") {
                    rabbit_status = "Треб. осмотр"
                } else if (data.results[modal_id].status[0] == "WC") {
                    rabbit_status = "Кормится без кокцидиост."
                } else if (data.results[modal_id].status[0] == "RS") {
                    rabbit_status = "Готов к убою"
                } else if (data.results[modal_id].status[0] == "NJ") {
                    rabbit_status = "Треб. отсадка"
                } else if (data.results[modal_id].status[0] == "MF") {
                    rabbit_status = "Кормится у матери"
                }
            }

            if (data.results[modal_id].is_male === null) {
                modalSex = "unknown";
            } else if (data.results[modal_id].is_male === true) {
                modalSex = "male-main";
            } else if (data.results[modal_id].is_male === false) {
                modalSex = "female-main";
            }

            $('.rabbitModal-header').prepend(
                '<img class="added" src="/img/rabbit-ico' + modal_ico + '.svg">'
            );

            $('.rabbit-header-info').append(
                '<a class="changeWeightLink added" href="#changeWeight" id="' + modal_id + '">' +
                '<div class="changeWeight">' +
                '<img src="/img/change-weight.svg">' +
                '<p>Взвесить</p>' +
                '</div>' +
                '</a>'
            )

            $('.rabbit-header-sex').append(
                '<img class="added" src="/img/' + modalSex + '.svg">'
            )

            $('.rabbit-header-info-bot').append(
                '<p class="added">#' + this.id + '</p>' +
                '<p class="added">' + data.results[modal_id].weight + '</p>'
            )


            var birthday = new Date(data.results[modal_id].birthday);
            birthday = birthday.format("dd.mm.yyyy");
            $('.rabbit-header-right').append(
                '<p class="added">Дата рождения:&nbsp<font class="added" style="font-weight:700;width:9.4ch;display:inline-flex;overflow:hidden;">' + birthday + '</font></p>' +
                '<p class="added">Возраст:&nbsp<font class="added" style="font-weight:700;">' + Math.round(days) + '&nbspдней</font></p>'
            )

            $('.rabbitModal-type').append(
                '<span class="subheader-details added">&nbsp' + rabbit_type + '</span>'
            )

            $('.rabbitModal-breed').append(
                '<span class="subheader-details added">&nbsp' + data.results[modal_id].breed + '</span>'
            )

            $('.rabbitModal-cageNum').append(
                '<span class="subheader-details added"> &nbsp' + data.results[modal_id].cage.farm_number + data.results[modal_id].cage.number + data.results[modal_id].cage.letter + '</span>'
            )

            $('.rabbitModal-status').append(
                '<span class="subheader-details added"> &nbsp' + rabbit_status + '</span>'
            )


            getData(curr_rabbit_operations)
                .then((value) => {
                    return value.json();
                })
                .then((data) => {

                    if (data[0] === undefined) {
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
                            $('.operations-history-body').append(
                                '<div class="operations-history-item added">' +
                                '<p>' + date + '</p>' +
                                '</div>'
                            )
                        }
                        $('#rabbit-modal-loading').remove();
                    }

                });

            $(".changeWeightLink").click(function() {
                $('#loader-rabbit-modal').append(
                    '<div id="rabbit-modal-loading" class="loading">' +
                    '<img src="/img/loading.gif">' +
                    '</div>'
                );
                let weight_rabbit_id_in_array = this.id;
                let weight_rabbit_id = +this.id + 1;
                let newWeight = {
                    "weight": null
                }
                showWeight = data.results[weight_rabbit_id_in_array].weight;


                $('.curr-rabbit-weight').append(
                    '<span class="added added-secondary" style="white-space: nowrap;">&nbsp' + data.results[weight_rabbit_id_in_array].weight + '</span>'
                )

                $('#changeWeight-modal-loading').remove()

                $(".submit-changeWeight").click(function() {
                    $('.added-secondary').remove();
                    newWeight.weight = +$("#newWeight").val();
                    putData(makeLink(rabbitsURL, weight_rabbit_id, data.results[weight_rabbit_id_in_array].current_type), newWeight)
                        .then((value) => {
                            $('#newWeight').empty();
                        })
                })
            })

        });

        $("#changeWeight-close").click(function() {
            $('.added-secondary').remove();
            $('#rabbit-modal-loading').remove();
        })

        $("#rabbitModal-close").click(function() {
            $('#loader-rabbit-modal').append(
                '<div id="rabbit-modal-loading" class="loading">' +
                '<img src="/img/loading.gif">' +
                '</div>'
            );
            $('.added').remove();
        });

        var items = $(".list-item");
        var numItems = data.count;
        var perPage = 10;

        $('#pagination-container').pagination({
            items: numItems,
            itemsOnPage: perPage,
            prevText: "Предыдущая",
            nextText: "Следующая",
            onPageClick: function(pageNumber) {
                $('.rabbitModal, .rabbitModal-filtered').remove()
                let rabbitsURL2 = rabbitsURL
                getData(rabbitsURL2 + "&page=" + pageNumber)
                    .then((value) => {
                        return value.json()
                    })
                    .then((data) => {
                        var totalItems = Object.keys(data.results).length;
                        var type = "НЕ УКАЗ";

                        for (var i = 0; i < totalItems; i++) {

                            var birthday = new Date(data.results[i].birthday);
                            var today = new Date;

                            var diff = today - birthday;
                            var milliseconds = diff;
                            var seconds = milliseconds / 1000;
                            var minutes = seconds / 60;
                            var hours = minutes / 60;
                            var days = hours / 24;

                            var rabbitSize;
                            var sex;

                            if (data.results[i].weight === null) {
                                data.results[i].weight = "?";
                            } else {
                                data.results[i].weight += " кг."
                            }

                            if (data.results[i].is_male === null) {
                                sex = "unknown";
                            } else if (data.results[i].is_male === true) {
                                sex = "male-main";
                            } else if (data.results[i].is_male === false) {
                                sex = "female-main";
                            }

                            if (data.results[i].current_type == "B") {
                                rabbitSize = "small-rabbit";
                                type = "МАЛЕНЬК";
                            } else if (data.results[i].current_type == "F") {
                                rabbitSize = "rabbit";
                                type = "ОТКОРМ";
                            } else if (data.results[i].current_type == "M") {
                                rabbitSize = "rabbit";
                                type = "РАЗМНОЖ";
                            } else if (data.results[i].current_type == "P") {
                                rabbitSize = "rabbit";
                                type = "РАЗМНОЖ";
                            } else {
                                rabbitSize = "rabbit";
                            }

                            if (Object.keys(data.results[i].status).length > 1) {
                                if (data.results[i].status[0] == "RF") {
                                    var rabbit_status = "Готов к размнож."
                                } else if (data.results[i].status[0] == "R") {
                                    rabbit_status = "Отдыхает"
                                } else if (data.results[i].status[0] == "UP") {
                                    rabbit_status = "Неподтвержденная берем."
                                } else if (data.results[i].status[0] == "NI") {
                                    rabbit_status = "Нужен осмотр на берем."
                                } else if (data.results[i].status[0] == "CP") {
                                    rabbit_status = "Беременная"
                                } else if (data.results[i].status[0] == "FB") {
                                    rabbit_status = "Кормит крольчат"
                                } else if (data.results[i].status[0] == "NV") {
                                    rabbit_status = "Треб. вак."
                                } else if (data.results[i].status[0] == "NI") {
                                    rabbit_status = "Треб. осмотр"
                                } else if (data.results[i].status[0] == "WC") {
                                    rabbit_status = "Кормится без кокцидиост."
                                } else if (data.results[i].status[0] == "RS") {
                                    rabbit_status = "Готов к убою"
                                } else if (data.results[i].status[0] == "NJ") {
                                    rabbit_status = "Треб. отсадка"
                                } else if (data.results[i].status[0] == "MF") {
                                    rabbit_status = "Кормится у матери"
                                }
                                for (let key in data.results[i].status) {
                                    if (data.results[i].status[key] == "RF") {
                                        rabbit_status += ", Готов к размнож."
                                    } else if (data.results[i].status[key] == "R") {
                                        rabbit_status += ", Отдыхает"
                                    } else if (data.results[i].status[key] == "UP") {
                                        rabbit_status += ", Неподтвержденная берем."
                                    } else if (data.results[i].status[key] == "NI") {
                                        rabbit_status += ", Нужен осмотр на берем."
                                    } else if (data.results[i].status[key] == "CP") {
                                        rabbit_status += ", Беременная"
                                    } else if (data.results[i].status[key] == "FB") {
                                        rabbit_status += ", Кормит крольчат"
                                    } else if (data.results[i].status[key] == "NV") {
                                        rabbit_status += ", Треб. вак."
                                    } else if (data.results[i].status[key] == "NI") {
                                        rabbit_status += ", Треб. осмотр"
                                    } else if (data.results[i].status[key] == "WC") {
                                        rabbit_status += ", Кормится без кокцидиост."
                                    } else if (data.results[i].status[key] == "RS") {
                                        rabbit_status += ", Готов к убою"
                                    } else if (data.results[i].status[key] == "NJ") {
                                        rabbit_status += ", Треб. отсадка"
                                    } else if (data.results[i].status[key] == "MF") {
                                        rabbit_status += ", Кормится у матери"
                                    }
                                }
                            } else {
                                if (data.results[i].status[0] == "RF") {
                                    var rabbit_status = "Готов к размнож."
                                } else if (data.results[i].status[0] == "R") {
                                    rabbit_status = "Отдыхает"
                                } else if (data.results[i].status[0] == "UP") {
                                    rabbit_status = "Неподтвержденная берем."
                                } else if (data.results[i].status[0] == "NI") {
                                    rabbit_status = "Нужен осмотр на берем."
                                } else if (data.results[i].status[0] == "CP") {
                                    rabbit_status = "Беременная"
                                } else if (data.results[i].status[0] == "FB") {
                                    rabbit_status = "Кормит крольчат"
                                } else if (data.results[i].status[0] == "NV") {
                                    rabbit_status = "Треб. вак."
                                } else if (data.results[i].status[0] == "NI") {
                                    rabbit_status = "Треб. осмотр"
                                } else if (data.results[i].status[0] == "WC") {
                                    rabbit_status = "Кормится без кокцидиост."
                                } else if (data.results[i].status[0] == "RS") {
                                    rabbit_status = "Готов к убою"
                                } else if (data.results[i].status[0] == "NJ") {
                                    rabbit_status = "Треб. отсадка"
                                } else if (data.results[i].status[0] == "MF") {
                                    rabbit_status = "Кормится у матери"
                                }
                            }


                            $('#list-wrapper').append(
                                '<a href="#rabbitModal-filtered" class="rabbitModal-filtered" name="' + i + '" id="' + data.results[i].id + '">' +
                                '<div class="list-item">' +
                                '<div class="left-item-body">' +
                                '<label class="' + rabbitSize + '-select">' +
                                '<input type="checkbox" id="selected-rabiit-id' + data.results[i].id + '" name="' + rabbitSize + '-checkbox">' +
                                '<span class="rabbitCheckbox"></span>' +
                                '</label>' +
                                '<div class="v-wrapper">' +
                                '<p>' + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="middle-item-body">' +
                                '<div class="v-wrapper">' +
                                '<p>#' + data.results[i].id + '</p>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<div class="h-wrapper">' +
                                '<img src="/img/' + sex + '.svg">' +
                                '</div>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<p>' + type + '</p>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<div class="h-wrapper">' +
                                '<p class="kind">' + data.results[i].breed + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<p>' + Math.round(days) + '&nbspдней</p>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<p>' + data.results[i].weight + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="right-item-body">' +
                                '<p>' + rabbit_status + '</p>' +
                                '</div>' +
                                '</div>' +
                                '</a>'
                            );
                        }
                    })
            }
        });


        var count = 0;
        $(function() {
            updateCount();
            $('input[name=rabbit-checkbox], input[name=small-rabbit-checkbox]').change(function() {
                updateCount(this.checked ? 1 : -1);
            });
            $('#invert').click(function(e) {
                e = $('input[name=rabbit-checkbox], input[name=small-rabbit-checkbox]');
                e.each(function(i, el) {
                    el.checked = !el.checked;
                });
                updateCount(e.length - count - count);
            });
        });

        function updateCount(a) {
            count = a ? count + a : $('input[name=rabbit-checkbox]:checked').length;
            $('#count').text(count);
        }

        $('.add-btn').click(function() {
            let cageFilter = addRabbitCages;
            let farm = "";
            let _is_male;
            let _is_male_f = "";
            getData(rabbits_breed)
                .then((value) => {
                    return value.json()
                })
                .then((data) => {
                    let total_breeds = data.count;

                    for (let i = 0; i < total_breeds; i++) {
                        $('.addRabbitsBreed').append(
                            '<option id="' + data.results[i].title + '" value="' + data.results[i].id + '">' + data.results[i].title + '</option>'
                        );
                    }
                })

            document.querySelector(".is_male").addEventListener('change', function(e) {
                let key = "_f_cage_type"
                if ($('.is_male').prop('checked')) {
                    _is_male_f = "&type=F"
                } else {
                    _is_male_f = "&type=M"
                }

                getAvailCages(key, _is_male_f)
            });

            document.querySelector(".is_female").addEventListener('change', function(e) {
                let key = "_f_cage_type"
                if ($('.is_female').prop('checked')) {
                    _is_male_f = "&type=M"
                } else {
                    _is_male_f = "&type=F"
                }

                getAvailCages(key, _is_male_f)
            });

            document.querySelector(".addRabbit-farm").addEventListener('change', function(e) {
                let key = "_f_cage_farm"
                farm = e.target.value;

                getAvailCages(key, farm)
            });
        })



        $("#addRabbit").click(function() {
            let getBreed = rabbits_breed;
            var __birth = $("#rabbitBirth-calendar").val();
            var __birth_send = converFromCalendar(__birth);
            var __breed_id = $('.addRabbitsBreed').val();
            var __breed_name_ = getData(getBreed)
                .then((value) => {
                    return value.json()
                })
                .then((data) => {
                    __breed_name = data[__breed_id - 1].title;

                    if ($('.is_male').prop('checked')) {
                        _is_male = true;
                    } else {
                        _is_male = false
                    }
                    var __farm_number = $('.addRabbit-farm').val();
                    var __cage_id = $('.cageSelect').val();
                    var __cage_number_ = getData("https://rabbit-api--test.herokuapp.com/api/cage/")
                        .then((value) => {
                            return value.json()
                        })
                        .then((data) => {
                            let __cage_number = String(data[__cage_id - 1].farm_number) + data[__cage_id - 1].number + data[__cage_id - 1].letter
                            console.log(data[__cage_id - 1].farm_number, data[__cage_id - 1].number, data[__cage_id - 1].letter)
                            addRabbit(__birth, __breed_id, __breed_name, _is_male, __farm_number, __cage_number, __cage_id, __birth_send)
                            $('.removable-label').remove()
                            $('#rabbitBirth-calendar').empty()
                            $('.is_male').prop('checked', false)
                            $('.is_female').prop('checked', false)
                            $('.cageSelect').empty()
                        })

                })

        })

        $('.addRabbitModal-submit').click(function() {
            let records = document.querySelectorAll('.addRabbitModal-right-item')
            for (let i = 0; i < records.length; i++) {
                postData("https://rabbit-api--test.herokuapp.com/api/rabbit/reproduction/", rabbitsObj[records[i].id].send)
                    .then((value) => {
                        $('#rabbitBirth-calendar').empty()
                        $('.is_male').prop('checked', false)
                        $('.is_female').prop('checked', false)
                        $('.cageSelect').empty()
                        // location.reload()
                        console.log(value.json())
                    })
            }
        })

    })