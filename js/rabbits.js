let rabbitsURL = "https://rabbit-api--test.herokuapp.com/api/rabbit/?"
let rabbitsURL_ = "https://rabbit-api--test.herokuapp.com/api/rabbit/"
let rabbit_operations = "https://rabbit-api--test.herokuapp.com/api/operation/?rabbit_id=";
let rabbits_breed = "https://rabbit-api--test.herokuapp.com/api/breed/"
let addRabbitCages = "https://rabbit-api--test.herokuapp.com/api/cage/?number_rabbits_to=0&status="
let getPlan = "https://rabbit-api--test.herokuapp.com/api/plan/?date="
let putPlan = "https://rabbit-api--test.herokuapp.com/api/plan/"
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
let counter = 0;
let counterForPlan = 0;
let counter_partners = 0;
let current_partner = 0;
let openedModalId;
let DATA;
let FILTER = "";
let rabbitsObj = []
let planObj = {};
let idsForRemove = ["Заглушка"]
let SELECTED = {}
let PARTNERS = {}
let current_plan

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

function deleteData(url) {
    const response_put = fetch(url, {
        method: 'DELETE',
        mode: 'cors',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
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

function showNewRabbit(id) {
    $('.added1').remove()
    openedModalId = id;
    getData("https://rabbit-api--test.herokuapp.com/api/rabbit/" + id)
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

            defineStatus(data)

            let current_type = data.current_type

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
                '<a class="changeWeightLink-filtered added1" href="#changeWeight" id="' + id + '">' +
                '<div class="changeWeight">' +
                '<img src="/img/change-weight.svg">' +
                '<p>Взвесить</p>' +
                '</div>' +
                '</a>'
            )

            $('.rabbit-header-sex1').append(
                '<img class="added1" src="/img/' + modalSex + '.svg">'
            )

            if (data.weight == null) {
                data.weight = "?"
            }

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
                        $('.operations-history-body1').append(
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
                                    bold_context = "<a href='#rabbitModal' onclick='showNewRabbit(" + data.results[i].father_rabbit_id + ")' style='font-weight: 700; font-size: 18px; color: #fff;' id='" + data.results[i].mother_rabbit_id + "'>(#" + data.results[i].mother_rabbit_id + ")</a>"
                                } else if (id == data.results[i].mother_rabbit_id) {
                                    context = "Спаривание&nbsp"
                                    bold_context = "<a href='#rabbitModal' onclick='showNewRabbit(" + data.results[i].mother_rabbit_id + ")' style='font-weight: 700; font-size: 18px; color: #fff;' id='" + data.results[i].father_rabbit_id + "'>(#" + data.results[i].father_rabbit_id + ")</a>"
                                }
                            }
                            $('.operations-history-body1').append(
                                '<div class="operations-history-item added1">' +
                                '<p>' + date + '</p>' +
                                '<p>' + context + bold_context + '</p>' +
                                '</div>'
                            )
                            $("#rabbit-modal-loading").remove()
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

                        if (data.weight == null) {
                            showWeight = "?"
                        } else {
                            showWeight = data.weight;
                        }

                        console.log(showWeight)

                        $('.curr-rabbit-weight').append(
                            '<span class="added added-secondary" style="white-space: nowrap;">&nbsp' + showWeight + '</span>'
                        )

                        $('#changeWeight-modal-loading').remove()

                        $(".submit-changeWeight").click(function() {
                            $('.added-secondary').remove();
                            newWeight.weight = +$("#newWeight").val();
                            console.log(data)
                            putData(makeLink(rabbitsURL_, id, current_type), newWeight)
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

function defineStatus(data) {
    rabbit_status = ""
    let rabbit_statuses = {}
    if (data.current_type == "B") {
        if (Object.keys(data.status).length > 1) {
            for (let i = 0; i < Object.keys(data.status).length; i++) {
                if (data.status[i] == "NJ") {
                    rabbit_statuses[i] += {
                        "status": "Нужна отсадка"
                    }
                } else if (data.status[i] == "MF") {
                    rabbit_statuses[i] += {
                        "status": "Кормится у матери"
                    }
                }
            }
            rabbit_status = rabbit_statuses[0].status + ", " + rabbit_statuses[1].status
        } else {
            if (data.status == "NJ") {
                rabbit_status = "Нужна отсадка"
            } else if (data.status == "MF") {
                rabbit_status = "Кормится у матери"
            }
        }
    } else if (data.current_type == "F") {
        if (Object.keys(data.status).length > 1) {
            for (let i = 0; i < Object.keys(data.status).length; i++) {
                if (data.status[i] == "NV") {
                    rabbit_statuses[i] += {
                        "status": "Нужна вакцинация"
                    }
                } else if (data.status[i] == "NI") {
                    rabbit_statuses[i] += {
                        "status": "Нужен осмотр перед убоем"
                    }
                } else if (data.status[i] == "WC") {
                    rabbit_statuses[i] += {
                        "status": "Кормится без кокцидиост."
                    }
                } else if (data.status[i] == "RS") {
                    rabbit_statuses[i] += {
                        "status": "Готов к убою"
                    }
                }
                if (Object.keys(rabbit_statuses).length - i == 1) {
                    rabbit_status += rabbit_statuses[i].status
                } else {
                    rabbit_status += rabbit_statuses[i].status + ", "
                }
            }
        } else {
            if (data.status == "NV") {
                rabbit_status = "Нужна вакцинация"
            } else if (data.status == "NI") {
                rabbit_status = "Нужен осмотр перед убоем"
            } else if (data.status == "WC") {
                rabbit_status = "Кормится без кокцидиост."
            } else if (data.status == "RS") {
                rabbit_status = "Готов к убою"
            }
        }
    } else if (data.current_type == "M") {
        if (Object.keys(data.status).length > 1) {
            for (let i = 0; i < Object.keys(data.status).length; i++) {
                if (data.status[i] == "RF") {
                    rabbit_status += "Готова к размнож., "
                } else if (data.status[i] == "UP") {
                    rabbit_status += "Неподтвержденная берем., "
                } else if (data.status[i] == "NI") {
                    rabbit_status += "Нужен осмотр на берем., "
                } else if (data.status[i] == "CP") {
                    rabbit_status += "Подтвержденная берем., "
                } else if (data.status[i] == "FB") {
                    rabbit_status += "Кормит крольчат"
                }
            }
        } else if (Object.keys(data.status).length == 1) {
            if (data.status == "RF") {
                rabbit_status = "Готова к размнож."
            } else if (data.status == "UP") {
                rabbit_status = "Неподтвержденная берем."
            } else if (data.status == "NI") {
                rabbit_status = "Нужен осмотр на берем."
            } else if (data.status == "CP") {
                rabbit_status = "Подтвержденная берем."
            } else if (data.status == "FB") {
                rabbit_status = "Кормит крольчат"
            }
        }
    } else if (data.current_type == "P") {
        if (Object.keys(data.status).length > 1) {
            for (let i = 0; i < Object.keys(data.status).length; i++) {
                if (data.status[i] == "RF") {
                    rabbit_statuses[i] += {
                        "status": "Готов к размнож."
                    }
                } else if (data.status[i] == "R") {
                    rabbit_statuses[i] += {
                        "status": "Отдыхает"
                    }
                }
            }
            rabbit_status = rabbit_statuses[0].status + ", " + rabbit_statuses[1].status
        } else {
            if (data.status == "RF") {
                rabbit_status = "Готов к размнож."
            } else if (data.status == "R") {
                rabbit_status = "Отдыхает"
            }
        }
    }
    return rabbit_status;
}

function getAvailCages(obj_key, filter) {
    $('.cageSelect-item').remove()
    let obj_to_link = "https://rabbit-api--test.herokuapp.com/api/cage/?number_rabbits_to=0&status=&page_size=10000"
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
                for (let i = 0; i < Object.keys(data.results).length; i++) {
                    if (idsForRemove.includes(String(data.results[i].id))) {
                        continue
                    } else {
                        $('.cageSelect').append(
                            '<option class="cageSelect-item" value="' + data.results[i].farm_number + data.results[i].number + data.results[i].letter + '" id="' + data.results[i].id + '">' + data.results[i].farm_number + data.results[i].number + data.results[i].letter + '</option>'
                        )
                    }
                }
            } else {
                $('.cageSelect').append(
                    '<option class="cageSelect-item">Нет подходящих клеток</option>'
                )
            }
        })
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
        '<div class="addRabbitModal-right-item addRabbit-item' + counter + '" value="' + cage_id + '" id="' + counter + '">' +
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
    idsForRemove.push(cage_id)
    $('.delete-rabbit').click(function() {
        delete rabbitsObj[this.id]
        delete idsForRemove[idsForRemove.indexOf($(".addRabbit-item" + this.id).attr('value'))]
        console.log(idsForRemove)
        let this_item = $('.addRabbit-item' + this.id).remove()
    })
}

function showList(url, first = true) {
    if (!first) {
        getData(url + FILTER)
            .then((value) => {
                return value.json();
            })
            .then((data) => {

                $('.rabbitModal, .rabbitModal-filtered').remove()

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

                    defineStatus(data.results[i])


                    $('#list-wrapper').append(
                        '<a href="#rabbitModal" onclick="showNewRabbit(' + data.results[i].id + ')" class="rabbitModal" name="' + i + '" id="' + data.results[i].id + '">' +
                        '<div class="list-item">' +
                        '<div class="left-item-body">' +
                        '<label class="' + rabbitSize + '-select">' +
                        '<input type="checkbox" onclick="saveRabbitState(this, \'' + sex + '\')" value="' + data.results[i].id + '" id="selected-rabiit-id' + data.results[i].id + '" name="' + rabbitSize + '-checkbox">' +
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
                    for (let j = 0; j < Object.keys(SELECTED).length; j++) {
                        if (data.results[i].id == SELECTED[j].rabbit_id) {
                            $("#" + SELECTED[j].id).prop("checked", true)
                        }
                    }
                }
                DATA = data
                $(".rabbitModal").click(function() {
                    $(".added").remove();

                    let modal_id = +this.name; //номер кролика
                    let this_id = +this.id; //номер записи о кролике
                    let modal_ico;
                    let weight_rabbit_id_filtered = this_id;
                    let modalSex;
                    let saveSex;
                    let rabbit_type;
                    let curr_rabbit_operations = rabbit_operations;
                    curr_rabbit_operations += this_id + "&page_size=50";


                    if (data.results[modal_id].is_male === null) {
                        saveSex = "unknown";
                    } else if (data.results[modal_id].is_male === true && data.results[modal_id].current_type != "F") {
                        saveSex = "father";
                    } else if (data.results[modal_id].is_male === false) {
                        saveSex = "mother";
                    } else if (data.results[modal_id].is_male === true && data.results[modal_id].current_type == "F") {
                        saveSex = "fattening"
                    }
                    $(".auto-select-btn[value=details]").prop("name", saveSex)
                    $(".auto-select-btn[value=details]").prop("id", this_id)

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

                    defineStatus(data.results[modal_id])

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
                            putData(makeLink(rabbitsURL_, weight_rabbit_id_filtered, data.results[weight_rabbit_id_in_array].current_type), newWeight)
                                .then((value) => {
                                    $('.rightside-filter').empty();
                                    $('#newWeight').empty();
                                    location.reload()
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
            })
    } else {
        getData(url + FILTER)
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

                    defineStatus(data.results[i])


                    $('#list-wrapper').append(
                        '<a href="#rabbitModal" onclick="showNewRabbit(' + data.results[i].id + ')" class="rabbitModal" name="' + i + '" id="' + data.results[i].id + '">' +
                        '<div class="list-item">' +
                        '<div class="left-item-body">' +
                        '<label class="' + rabbitSize + '-select">' +
                        '<input type="checkbox" onclick="saveRabbitState(this, \'' + sex + '\')" value="' + data.results[i].id + '" id="selected-rabiit-id' + data.results[i].id + '" name="' + rabbitSize + '-checkbox">' +
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
                    for (let j = 0; j < Object.keys(SELECTED).length; j++) {
                        if (data.results[i].id == SELECTED[j].rabbit_id) {
                            $("#" + SELECTED[j].id).prop("checked", true)
                        }
                    }
                }
                makePaginate(data)
                $(".rabbitModal").click(function() {
                    $(".added").remove();

                    let modal_id = +this.name;
                    let this_id = +this.id;
                    let modal_ico;
                    let weight_rabbit_id_filtered = this_id;
                    let modalSex;
                    let rabbit_type;
                    let curr_rabbit_operations = rabbit_operations;
                    curr_rabbit_operations += this_id + "&page_size=50";

                    var birthday = new Date(data.results[modal_id].birthday);
                    var today = new Date;
                    var diff = today - birthday;
                    var milliseconds = diff;
                    var seconds = milliseconds / 1000;
                    var minutes = seconds / 60;
                    var hours = minutes / 60;
                    var days = hours / 24;

                    if (data.results[modal_id].is_male === null) {
                        saveSex = "unknown";
                    } else if (data.results[modal_id].is_male === true) {
                        saveSex = "father";
                    } else if (data.results[modal_id].is_male === false) {
                        saveSex = "mother";
                    } else if (data.results[modal_id].is_male === true && data.results[modal_id].current_type == "F") {
                        saveSex = "fattening"
                    }
                    $(".auto-select-btn[value=details]").prop("name", saveSex)
                    $(".auto-select-btn[value=details]").prop("id", this_id)

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

                    defineStatus(data.results[modal_id])

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
                            putData(makeLink(rabbitsURL_, weight_rabbit_id_filtered, data.results[weight_rabbit_id_in_array].current_type), newWeight)
                                .then((value) => {
                                    $('.rightside-filter').empty();
                                    $('#newWeight').empty();
                                    location.reload()
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
            })
    }

}

function saveRabbitState(e, sex) {
    $("#count").empty()
    if ($("#" + e.id).prop("checked") == true) {
        if (sex == "female-main") {
            sex = "mother"
        } else if (sex == "male-main") {
            sex = "father"
        }
        getData(rabbitsURL_ + e.value)
            .then((value) => {
                return value.json()
            })
            .then((data) => {
                if (data.current_type == "F") {
                    SELECTED[counter] = {
                        "id": e.id,
                        "rabbit_id": e.value,
                        "sex": "fattening"
                    }
                    counter++
                } else {
                    SELECTED[counter] = {
                        "id": e.id,
                        "rabbit_id": e.value,
                        "sex": sex
                    }
                    counter++
                }
            })

    } else {
        console.log(SELECTED)
        for (let key in SELECTED) {
            if (SELECTED[key].id == e.id) {
                delete SELECTED[key]
                counter--
            }
        }
    }
    $("#count").append(Object.keys(SELECTED).length)
}

function makePartnersLink(sex, id, isPartners) {
    if (isPartners) {
        return rabbitsURL_ + sex + "/" + id + "/partners/"
    } else {
        return rabbitsURL_ + sex + "/" + id + "/"
    }
}

function autoSelectPartners(e) {
    $('.autoSelectModal-body-container').empty()
    if (e == undefined) {
        e = ""
    }
    if (e.value == "details") {
        let link = makePartnersLink(e.name, e.id, true)
        getData(makePartnersLink(e.name, e.id, false))
            .then((value) => {
                return value.json()
            })
            .then((data) => {
                if (data.is_male == true) {
                    data.is_male = "male-main"
                    var opposite = "mother",
                        opposite_ava = "female-main"
                } else {
                    data.is_male = "female-main"
                    var opposite = "father",
                        opposite_ava = "male-main"
                }

                var birthday = new Date(data.birthday);
                var today = new Date;

                var diff = today - birthday;
                var milliseconds = diff;
                var seconds = milliseconds / 1000;
                var minutes = seconds / 60;
                var hours = minutes / 60;
                var days = hours / 24;
                if (e.name != "fattening") {
                    getData(link)
                        .then((value) => {
                            return value.json()
                        })
                        .then((partners) => {
                            if (partners.warning) {
                                let errMsg = String(partners.warning.message)
                                errMsg = errMsg.substring(2, errMsg.length - 2);
                                $(".autoSelectModal-body-container").append(
                                    '<div class="autoSelectModal-body-item">' +
                                    '<div class="selected-rabbit">' +
                                    '<div class="selected-rabbit-label">' +
                                    '<p>Выбранный кролик:</p>' +
                                    '</div>' +
                                    '<div style="width:100%">' +
                                    '<a onclick="showNewRabbit(' + data.id + ')" href="#rabbitModal">' +
                                    '<div class="list-item">' +
                                    '<div class="middle-item-body">' +
                                    '<label class="rabbit-select">' +
                                    '<input name="rabbit-checkbox" value="">' +
                                    '<span></span>' +
                                    '</label>' +
                                    '<div class="v-wrapper">' +
                                    '<p>' + data.cage.farm_number + data.cage.number + data.cage.letter + '</p>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<p>#' + data.id + '</p>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<img src="/img/' + data.is_male + '.svg">' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<div class="h-wrapper">' +
                                    '<p class="kind">' + data.breed + '</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<p>' + Math.round(days) + ' дней</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</a>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="selected-rabbit-pair ' + "selected-rabbit-pair" + e.id + '">' +
                                    '<div class="list-item">' +
                                    '<div class="middle-item-body">' +
                                    '<div class="v-wrapper">' +
                                    '<p style="font-weight:700; color:red">' + errMsg + '</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>'
                                )
                                $("#auto-select-loading").remove()
                            } else {
                                $(".autoSelectModal-body-container").append(
                                    '<div class="autoSelectModal-body-item">' +
                                    '<div class="selected-rabbit">' +
                                    '<div class="selected-rabbit-label">' +
                                    '<p>Выбранный кролик:</p>' +
                                    '</div>' +
                                    '<div style="width:100%">' +
                                    '<a onclick="showNewRabbit(' + data.id + ')" href="#rabbitModal">' +
                                    '<div class="list-item">' +
                                    '<div class="middle-item-body">' +
                                    '<label class="rabbit-select">' +
                                    '<input name="rabbit-checkbox" value="">' +
                                    '<span></span>' +
                                    '</label>' +
                                    '<div class="v-wrapper">' +
                                    '<p>' + data.cage.farm_number + data.cage.number + data.cage.letter + '</p>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<p>#' + data.id + '</p>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<img src="/img/' + data.is_male + '.svg">' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<div class="h-wrapper">' +
                                    '<p class="kind">' + data.breed + '</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<p>' + Math.round(days) + ' дней</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</a>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="selected-rabbit-pair ' + "selected-rabbit-pair" + e.id + '">'
                                )

                                if (Object.values(partners)[0] == null) {
                                    var connection = "Нет связей"
                                } else {
                                    var connection = "Связь в " + Object.values(partners)[current_partner] + "поколении"
                                }

                                PARTNERS[counter_partners] = {
                                    "id": data.id,
                                    "partner_id": Object.keys(partners)[current_partner],
                                    "sex": data.is_male
                                }

                                counter_partners++
                                current_partner++

                                getData(makePartnersLink(opposite, Object.keys(partners)[current_partner], false))
                                    .then((value) => {
                                        return value.json()
                                    })
                                    .then((partner_details) => {
                                        var birthday = new Date(partner_details.birthday);
                                        var today = new Date;
                                        var diff = today - birthday;
                                        var milliseconds = diff;
                                        var seconds = milliseconds / 1000;
                                        var minutes = seconds / 60;
                                        var hours = minutes / 60;
                                        var days = hours / 24;
                                        $('.selected-rabbit-pair' + e.id).append(
                                            '<a onclick="showNewRabbit(' + Object.keys(partners)[current_partner] + ')" id="' + Object.keys(partners)[current_partner] + '" href="#rabbitModal-filtered">' +
                                            '<div class="list-item">' +
                                            '<div class="middle-item-body">' +
                                            '<label class="rabbit-select">' +
                                            '<input name="rabbit-checkbox-for' + Object.keys(partners)[current_partner] + '" value="">' +
                                            '<span></span>' +
                                            '</label>' +
                                            '<div class="v-wrapper">' +
                                            '<p>' + partner_details.cage.farm_number + partner_details.cage.number + partner_details.cage.letter + '</p>' +
                                            '</div>' +
                                            '<div class="v-wrapper">' +
                                            '<p>' + connection + '</p>' +
                                            '</div>' +
                                            '<div class="v-wrapper">' +
                                            '<p>#' + partner_details.id + '</p>' +
                                            '</div>' +
                                            '<div class="v-wrapper">' +
                                            '<img src="/img/' + opposite_ava + '.svg">' +
                                            '</div>' +
                                            '<div class="v-wrapper">' +
                                            '<div class="h-wrapper">' +
                                            '<p class="kind">' + partner_details.breed + '</p>' +
                                            '</div>' +
                                            '</div>' +
                                            '<div class="v-wrapper">' +
                                            '<p>' + Math.round(days) + ' дней</p>' +
                                            '</div>' +
                                            '</div>' +
                                            '</div>' +
                                            '</a>' +
                                            '</div>' +
                                            '</div>'
                                        )
                                        $("#auto-select-loading").remove()
                                    })
                            }
                        })
                } else {
                    $(".autoSelectModal-body-container").append(
                        '<div class="autoSelectModal-body-item">' +
                        '<div class="selected-rabbit">' +
                        '<div class="selected-rabbit-label">' +
                        '<p>Выбранный кролик:</p>' +
                        '</div>' +
                        '<div style="width:100%">' +
                        '<a onclick="showNewRabbit(' + data.id + ')" href="#rabbitModal">' +
                        '<div class="list-item">' +
                        '<div class="middle-item-body">' +
                        '<label class="rabbit-select">' +
                        '<input name="rabbit-checkbox" value="">' +
                        '<span></span>' +
                        '</label>' +
                        '<div class="v-wrapper">' +
                        '<p>' + data.cage.farm_number + data.cage.number + data.cage.letter + '</p>' +
                        '</div>' +
                        '<div class="v-wrapper">' +
                        '<p>#' + data.id + '</p>' +
                        '</div>' +
                        '<div class="v-wrapper">' +
                        '<img src="/img/' + data.is_male + '.svg">' +
                        '</div>' +
                        '<div class="v-wrapper">' +
                        '<div class="h-wrapper">' +
                        '<p class="kind">' + data.breed + '</p>' +
                        '</div>' +
                        '</div>' +
                        '<div class="v-wrapper">' +
                        '<p>' + Math.round(days) + ' дней</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</a>' +
                        '</div>' +
                        '</div>' +
                        '<div class="selected-rabbit-pair ' + "selected-rabbit-pair" + e.id + '">' +
                        '<div class="list-item">' +
                        '<div class="middle-item-body">' +
                        '<div class="v-wrapper">' +
                        '<p style="font-weight:700; color:red">Кролик не готов для размножения</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    )
                    $("#auto-select-loading").remove()
                }
            })
    }
    for (let key in SELECTED) {
        let link = makePartnersLink(SELECTED[key].sex, SELECTED[key].rabbit_id, true)
        getData(makePartnersLink(SELECTED[key].sex, SELECTED[key].rabbit_id, false))
            .then((value) => {
                return value.json()
            })
            .then((data) => {
                if (data.is_male == true) {
                    data.is_male = "male-main"
                    var opposite = "mother",
                        opposite_ava = "female-main"
                } else {
                    data.is_male = "female-main"
                    var opposite = "father",
                        opposite_ava = "male-main"
                }

                var birthday = new Date(data.birthday);
                var today = new Date;

                var diff = today - birthday;
                var milliseconds = diff;
                var seconds = milliseconds / 1000;
                var minutes = seconds / 60;
                var hours = minutes / 60;
                var days = hours / 24;
                if (SELECTED[key].sex != "fattening") {
                    getData(link)
                        .then((value) => {
                            return value.json()
                        })
                        .then((partners) => {
                            if (partners.warning) {
                                let errMsg = String(partners.warning.message)
                                errMsg = errMsg.substring(2, errMsg.length - 2);
                                $(".autoSelectModal-body-container").append(
                                    '<div class="autoSelectModal-body-item">' +
                                    '<div class="selected-rabbit">' +
                                    '<div class="selected-rabbit-label">' +
                                    '<p>Выбранный кролик:</p>' +
                                    '</div>' +
                                    '<div style="width:100%">' +
                                    '<a onclick="showNewRabbit(' + data.id + ')" href="#rabbitModal">' +
                                    '<div class="list-item">' +
                                    '<div class="middle-item-body">' +
                                    '<label class="rabbit-select">' +
                                    '<input name="rabbit-checkbox" value="">' +
                                    '<span></span>' +
                                    '</label>' +
                                    '<div class="v-wrapper">' +
                                    '<p>' + data.cage.farm_number + data.cage.number + data.cage.letter + '</p>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<p>#' + data.id + '</p>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<img src="/img/' + data.is_male + '.svg">' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<div class="h-wrapper">' +
                                    '<p class="kind">' + data.breed + '</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<p>' + Math.round(days) + ' дней</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</a>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="selected-rabbit-pair ' + "selected-rabbit-pair" + key + '">' +
                                    '<div class="list-item">' +
                                    '<div class="middle-item-body">' +
                                    '<div class="v-wrapper">' +
                                    '<p style="font-weight:700; color:red">' + errMsg + '</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>'
                                )
                                $("#auto-select-loading").remove()
                            } else {
                                $(".autoSelectModal-body-container").append(
                                    '<div class="autoSelectModal-body-item">' +
                                    '<div class="selected-rabbit">' +
                                    '<div class="selected-rabbit-label">' +
                                    '<p>Выбранный кролик:</p>' +
                                    '</div>' +
                                    '<div style="width:100%">' +
                                    '<a onclick="showNewRabbit(' + data.id + ')" href="#rabbitModal">' +
                                    '<div class="list-item">' +
                                    '<div class="middle-item-body">' +
                                    '<label class="rabbit-select">' +
                                    '<input name="rabbit-checkbox" value="">' +
                                    '<span></span>' +
                                    '</label>' +
                                    '<div class="v-wrapper">' +
                                    '<p>' + data.cage.farm_number + data.cage.number + data.cage.letter + '</p>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<p>#' + data.id + '</p>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<img src="/img/' + data.is_male + '.svg">' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<div class="h-wrapper">' +
                                    '<p class="kind">' + data.breed + '</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="v-wrapper">' +
                                    '<p>' + Math.round(days) + ' дней</p>' +
                                    '</div>' +
                                    '</div>' +
                                    '</div>' +
                                    '</a>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="selected-rabbit-pair ' + "selected-rabbit-pair" + key + '">'
                                )

                                if (Object.values(partners)[0] == null) {
                                    var connection = "Нет связей"
                                } else {
                                    var connection = "Связь в " + Object.values(partners)[current_partner] + "поколении"
                                }

                                PARTNERS[counter_partners] = {
                                    "id": data.id,
                                    "partner_id": Object.keys(partners)[current_partner],
                                    "sex": data.is_male
                                }

                                counter_partners++
                                current_partner++

                                getData(makePartnersLink(opposite, Object.keys(partners)[current_partner], false))
                                    .then((value) => {
                                        return value.json()
                                    })
                                    .then((partner_details) => {
                                        var birthday = new Date(partner_details.birthday);
                                        var today = new Date;

                                        var diff = today - birthday;
                                        var milliseconds = diff;
                                        var seconds = milliseconds / 1000;
                                        var minutes = seconds / 60;
                                        var hours = minutes / 60;
                                        var days = hours / 24;
                                        $('.selected-rabbit-pair' + key).append(
                                            '<a onclick="showNewRabbit(' + Object.keys(partners)[current_partner] + ')" id="' + Object.keys(partners)[current_partner] + '" href="#rabbitModal-filtered">' +
                                            '<div class="list-item">' +
                                            '<div class="middle-item-body">' +
                                            '<label class="rabbit-select">' +
                                            '<input name="rabbit-checkbox-for' + Object.keys(partners)[current_partner] + '" value="">' +
                                            '<span></span>' +
                                            '</label>' +
                                            '<div class="v-wrapper">' +
                                            '<p>' + partner_details.cage.farm_number + partner_details.cage.number + partner_details.cage.letter + '</p>' +
                                            '</div>' +
                                            '<div class="v-wrapper">' +
                                            '<p>' + connection + '</p>' +
                                            '</div>' +
                                            '<div class="v-wrapper">' +
                                            '<p>#' + partner_details.id + '</p>' +
                                            '</div>' +
                                            '<div class="v-wrapper">' +
                                            '<img src="/img/' + opposite_ava + '.svg">' +
                                            '</div>' +
                                            '<div class="v-wrapper">' +
                                            '<div class="h-wrapper">' +
                                            '<p class="kind">' + partner_details.breed + '</p>' +
                                            '</div>' +
                                            '</div>' +
                                            '<div class="v-wrapper">' +
                                            '<p>' + Math.round(days) + ' дней</p>' +
                                            '</div>' +
                                            '</div>' +
                                            '</div>' +
                                            '</a>' +
                                            '</div>' +
                                            '</div>'
                                        )
                                        $("#auto-select-loading").remove()
                                    })
                            }
                        })
                } else {
                    $(".autoSelectModal-body-container").append(
                        '<div class="autoSelectModal-body-item">' +
                        '<div class="selected-rabbit">' +
                        '<div class="selected-rabbit-label">' +
                        '<p>Выбранный кролик:</p>' +
                        '</div>' +
                        '<div style="width:100%">' +
                        '<a onclick="showNewRabbit(' + data.id + ')" href="#rabbitModal">' +
                        '<div class="list-item">' +
                        '<div class="middle-item-body">' +
                        '<label class="rabbit-select">' +
                        '<input name="rabbit-checkbox" value="">' +
                        '<span></span>' +
                        '</label>' +
                        '<div class="v-wrapper">' +
                        '<p>' + data.cage.farm_number + data.cage.number + data.cage.letter + '</p>' +
                        '</div>' +
                        '<div class="v-wrapper">' +
                        '<p>#' + data.id + '</p>' +
                        '</div>' +
                        '<div class="v-wrapper">' +
                        '<img src="/img/' + data.is_male + '.svg">' +
                        '</div>' +
                        '<div class="v-wrapper">' +
                        '<div class="h-wrapper">' +
                        '<p class="kind">' + data.breed + '</p>' +
                        '</div>' +
                        '</div>' +
                        '<div class="v-wrapper">' +
                        '<p>' + Math.round(days) + ' дней</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</a>' +
                        '</div>' +
                        '</div>' +
                        '<div class="selected-rabbit-pair ' + "selected-rabbit-pair" + e.id + '">' +
                        '<div class="list-item">' +
                        '<div class="middle-item-body">' +
                        '<div class="v-wrapper">' +
                        '<p style="font-weight:700; color:red">Кролик не готов для размножения</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    )
                    $("#auto-select-loading").remove()
                }
            })
    }
}

function closeAutoSelect() {
    $(".autoSelectModal-body-container").empty()
    $(".autoSelectModal-body-container").append(
        '<div id="auto-select-loading" class="loading">' +
        '<img src="/img/loading.gif">' +
        '</div>'
    )
    current_partner = 0
    for (let i = 0; i < Object.keys(PARTNERS).length; i++) {
        delete PARTNERS[i]
    }
}

function saveRabbitsPartners() {
    for (let i = 0; i < Object.keys(PARTNERS).length; i++) {
        let sendData = {
            "partner": PARTNERS[i].partner_id
        }
        if (PARTNERS[i].sex == "male-main") {
            PARTNERS[i].sex = "father"
        } else {
            PARTNERS[i].sex = "mother"
        }
        postData(makePartnersLink(PARTNERS[i].sex, PARTNERS[i].id, true), sendData)
    }
}

function kill() {
    let send = {}
    let assign = []
    for (let i = 0; i < Object.keys(SELECTED).length; i++) {
        assign[i] = +SELECTED[i].rabbit_id
    }
    send = {
        "rabbits": assign
    }
    putData(putPlan + current_plan + "/", send)
    .then((answer) => {
        location.reload()
    })
}

function filterRabForPlan(e, id){
    if($(".filter-for-plan" + e.id).prop("checked")){
        current_plan = id
        $(".rabbitModal").remove()
        FILTER = "&plan=&type=F&status=RS"
        showList(rabbitsURL)
        $(".submit-kill-btn").removeClass("disabled")
    } else {
        $(".rabbitModal").remove()
        current_plan = ""
        FILTER = ""
        showList(rabbitsURL)
        $(".submit-kill-btn").addClass("disabled")
    }
}

function killFromModal() {
    let assign = []
    assign[0] = openedModalId
    let send = {
        "rabbits": assign
    }
    putData(putPlan + current_plan + "/", send)
    .then((answer) => {
        window.location.href = "#close"
        location.reload()
    })
}

function manualSelectPartners() {
    
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
                showList(rabbitsURL + "&page=" + pageNumber, false)
            } else {
                showList(rabbitsURL + "&page=" + pageNumber, false, FILTER)
            }
        }
    });
}

$(document).ready(function() {
    showList(rabbitsURL)

    document.querySelector(".rightside-filter").addEventListener('change', function(e) {
        if (sidebar_filter) {
            $('#pagination-container>ul').remove();
            $('.rabbitModal').remove()
            $('#list-wrapper').append(
                '<div id="list-wrapper-loading" class="loading">' +
                '<img src="/img/loading.gif">' +
                '</div>'
            )
            let newValue;
            if (e.target.value == "__order_by__=age") {
                newValue = "&__order_by__=age"
            } else if (e.target.value == "__order_by__=-age") {
                newValue = "&__order_by__=-age"
            } else if (e.target.value == "__order_by__=sex") {
                newValue = "&__order_by__=sex"
            } else if (e.target.value == "__order_by__=farm_number") {
                newValue = "&__order_by__=farm_number"
            } else if (e.target.value == "__order_by__=cage_number") {
                newValue = "&__order_by__=cage_number"
            } else if (e.target.value == "__order_by__=type") {
                newValue = "&__order_by__=type"
            } else if (e.target.value == "__order_by__=breed") {
                newValue = "&__order_by__=breed"
            } else if (e.target.value == "__order_by__=status") {
                newValue = "&__order_by__=status"
            } else if (e.target.value == "__order_by__=weight") {
                newValue = "&__order_by__=weight"
            } else if (e.target.value == "__order_by__=-weight") {
                newValue = "&__order_by__=-weight"
            }
            FILTER += newValue
            showList(rabbitsURL)
        } else if (!sidebar_filter) {
            $('.list-wrapper').append(
                '<div id="list-wrapper-loading" class="loading">' +
                '<img src="/img/loading.gif">' +
                '</div>'
            );
            if (e.target.value == "__order_by__=age") {
                newValue = "&__order_by__=age"
            } else if (e.target.value == "__order_by__=-age") {
                newValue = "&__order_by__=-age"
            } else if (e.target.value == "__order_by__=sex") {
                newValue = "&__order_by__=sex"
            } else if (e.target.value == "__order_by__=farm_number") {
                newValue = "&__order_by__=farm_number"
            } else if (e.target.value == "__order_by__=cage_number") {
                newValue = "&__order_by__=cage_number"
            } else if (e.target.value == "__order_by__=type") {
                newValue = "&__order_by__=type"
            } else if (e.target.value == "__order_by__=breed") {
                newValue = "&__order_by__=breed"
            } else if (e.target.value == "__order_by__=status") {
                newValue = "&__order_by__=status"
            } else if (e.target.value == "__order_by__=weight") {
                newValue = "&__order_by__=weight"
            } else if (e.target.value == "__order_by__=-weight") {
                newValue = "&__order_by__=-weight"
            } else if (e.target.value == "") {
                newValue = ""
            }
            $('.rabbitModal').remove()
            FILTER += newValue
            showList(rabbitsURL)
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
                    _f_farm_number = "&farm_number=" + _f_farm_number;
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
                    console.log("Выставь правильно диапазон возраста.")
                }

                countResponse(o_key, _f_age_from)
            });

            document.querySelector(".count-filtered7").addEventListener('change', function(e) {
                _f_age_to = e.target.value;
                let o_key = "_f_age_to"

                if (_f_age_from != "" && _f_age_to != "" && f_age_from > _f_age_to) {
                    console.log("Выставь правильно диапазон возраста.")
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
                    console.log("Выставь правильно диапазон возраста.")
                }

                countResponse(o_key, _f_weight_from)
            });

            document.querySelector(".count-filtered10").addEventListener('change', function(e) {
                _f_weight_to = e.target.value;
                let o_key = "_f_weight_to"

                if (_f_weight_from != "" && _f_weight_to != "" && _f_weight_from > _f_weight_to) {
                    console.log("Выставь правильно диапазон возраста.")
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

                FILTER = _f_farm_number + _f_male + _f_rabbit_type + _f_rabbit_breed + _f_age_from + _f_age_to + _f_rabbit_status + _f_weight_from + _f_weight_to;
                sidebar_filter_order = FILTER

                $('.rabbitModal, .rabbitModal-filtered').remove()
                showList(rabbitsURL)
            });
        })

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
                __breed_name = data.results[__breed_id - 1].title;

                if ($('.is_male').prop('checked')) {
                    _is_male = true;
                } else {
                    _is_male = false
                }
                var __cage_id
                var __farm_number = $('.addRabbit-farm').val();
                var __cage_number = $('.cageSelect').val()
                var cage_number_ = $('.cageSelect-item').length
                var cage_number__ = $('.cageSelect-item')
                for (let i = 0; i < cage_number_; i++) {
                    let curr = cage_number__[i]
                    if (String(curr.value) == __cage_number) {
                        __cage_id = curr.id
                    }
                }
                addRabbit(__birth, __breed_id, __breed_name, _is_male, __farm_number, __cage_number, __cage_id, __birth_send)
                $('.removable-label').remove()
                $('#rabbitBirth-calendar').empty()
                $('.is_male').prop('checked', false)
                $('.is_female').prop('checked', false)
                $('.cageSelect').empty()

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
                    window.location.replace("/#close")
                    location.reload();
                })
        }
    })

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = yyyy + '-' + mm + '-' + dd;

    getData(getPlan + today)
        .then((value) => {
            return value.json()
        })
        .then((data) => {
            if (data.count >= 1) {
                for (let i = 0; i < Object.keys(data.results).length; i++) {
                    let progress = Object.keys(data.results[i].rabbits).length
                    let total = data.results[i].quantity
                    $('.todo-list').append(
                        '<div class="todo-list-item">' +
                        '<div class="todo-item-left">' +
                        '<div class="v-wrapper">' +
                        '<label class="plan-select">' +
                        '<input type="checkbox" id="' + data.results[i].id + '" class="filter-for-plan' + data.results[i].id + '" onclick="filterRabForPlan(this, ' + data.results[i].id + ')" name="plan-checkbox" value="">' +
                        '<span></span>' +
                        '</label>' +
                        '</div>' +
                        '<div class="v-wrapper">' +
                        '<p class="todo-list-text">' + convertToCalendar(data.results[i].date) + '</p>' +
                        '</div>' +
                        '</div>' +
                        '<div class="todo-item-middle">' +
                        '<div class="v-wrapper">' +
                        '<p class="todo-list-text">Убой</p>' +
                        '</div>' +
                        '</div>' +
                        '<div class="todo-item-right">' +
                        '<div class="v-wrapper">' +
                        '<p class="todo-list-text">' + progress + ' из ' + total + '</p>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    )
                }
            } else {
                $('.todo-list').append(
                    '<div class="todo-list-item">' +
                    '<div class="todo-item-middle">' +
                    '<div class="v-wrapper">' +
                    '<p class="todo-list-text">На сегодня плана ещё нет...</p>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                )
            }
            $('#todo-list-loading').remove()
        })

})