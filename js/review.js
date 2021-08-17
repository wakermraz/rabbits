let tasksURL = "https://rabbit-api--test.herokuapp.com/api/task/in_progress/?";
let users = "https://rabbit-api--test.herokuapp.com/api/user/?"
let confirmURL = "https://rabbit-api--test.herokuapp.com/api/task/in_progress/confirm/"
let completeURL = "https://rabbit-api--test.herokuapp.com/api/task/in_progress/complete/"
let deleteURL = "https://rabbit-api--test.herokuapp.com/api/task/mating/"
let jiggingURL = "https://rabbit-api--test.herokuapp.com/api/task/in_progress/complete/bunny_jigging/"
let inspectURL = "https://rabbit-api--test.herokuapp.com/api/task/in_progress/complete/slaughter_inspection/"
let printFileURL = "https://rabbit-api--test.herokuapp.com/api/user/"

let isAppended = false
let FILTER = ""
let user_list = ""
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

function getImage(url) {
    const response = fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Sec-Fetch-Dest': 'document'
        }
    });
    return response;
}

function deleteData(url) {
    const response = fetch(url, {
        method: 'DELETE',
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
                if (isAppended == false) {
                    let totalItems = Object.keys(data.results).length

                    for (let i = 0; i < totalItems; i++) {
                        $(".executor-list").append('<option value="user=' + data.results[i].id + '">' + data.results[i].first_name + " " + data.results[i].last_name + '</option>')
                        let assign = {
                            "name": data.results[i].first_name + " " + data.results[i].last_name,
                            "id": data.results[i].id
                        }
                        EXECUTORS[i] = assign
                    }
                    isAppended = true
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
                        let task_executor
                        let task_status

                        for (var i = 0; i < totalItems; i++) {

                            let isDeletable = '<img style="opacity:40%; cursor: default" class="delete-task" src="/img/delete-task.svg">'
                            let modalOnAccept = '<img class="task-nav confirm" onclick="confirmTask(' + data.results[i].id + ')" src="/img/confirm-task.svg">'

                            if (data.results[i].type == "R") {
                                task_name = "<p style='font-size:15px;' class='task-name-wrapper'>Отс. (смена типа: ОТК. → РАЗМН.) → <font style='font-weight:700'>" + data.results[i].cage_from.farm_number + data.results[i].cage_from.number + data.results[i].cage_from.letter + " → " + data.results[i].cage_to.farm_number + data.results[i].cage_to.number + data.results[i].cage_to.letter + "</font></p>"
                            } else if (data.results[i].type == "F") {
                                task_name = "<p style='font-size:15px' class='task-name-wrapper'>Отс. (смена типа: РАЗМН. → ОТК.) → <font style='font-weight:700'>" + data.results[i].cage_from.farm_number + data.results[i].cage_from.number + data.results[i].cage_from.letter + " → " + data.results[i].cage_to.farm_number + data.results[i].cage_to.number + data.results[i].cage_to.letter + "</font></p>"
                            } else if (data.results[i].type == "M") {
                                isDeletable = '<img onclick="deleteTask(' + data.results[i].id + ')" class="delete-task" src="/img/delete-task.svg">'
                                task_name = "<p style='font-size:16px' class='task-name-wrapper'>Размн. → <font style='font-weight:700'>" + data.results[i].cage_from.farm_number + data.results[i].cage_from.number + data.results[i].cage_from.letter + " → " + data.results[i].cage_to.farm_number + data.results[i].cage_to.number + data.results[i].cage_to.letter + "</font></p>"
                            } else if (data.results[i].type == "B") {
                                modalOnAccept = '<img class="task-nav confirm" onclick="executeJigging(' + data.results[i].id + ')" src="/img/confirm-task.svg">'
                                task_name = "<p style='font-size:15px' class='task-name-wrapper'>Отс. от матери (" + data.results[i].number_bunnies + " кр.) → <font style='font-weight:700'>" + data.results[i].cage_from.farm_number + data.results[i].cage_from.number + data.results[i].cage_from.letter + " → " + data.results[i].male_cage_to.farm_number + data.results[i].male_cage_to.number + data.results[i].male_cage_to.letter + "(M)" + " → " + data.results[i].female_cage_to.farm_number + data.results[i].female_cage_to.number + data.results[i].female_cage_to.letter + "(Ж)</font></p>"
                            } else if (data.results[i].type == "V") {
                                task_name = "<p style='font-size:16px' class='task-name-wrapper'>Вакц. → <font style='font-weight:700'>" + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + "</font></p>"
                            } else if (data.results[i].type == "I") {
                                modalOnAccept = '<img class="task-nav confirm" onclick="executeInspect(' + data.results[i].id + ')" src="/img/confirm-task.svg">'
                                task_name = "<p style='font-size:16px' class='task-name-wrapper'>Осмотр перед убоем (" + data.results[i].number_rabbits + " кр.) → <font style='font-weight:700'>" + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + "</font></p>"
                            } else if (data.results[i].type == "S") {
                                task_name = "<p style='font-size:16px' class='task-name-wrapper'>Убой → <font style='font-weight:700'>" + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + "</font></p>"
                            }

                            if (data.results[i].is_completed == true) {
                                task_status = "<p class='confirmed' style='font-weight: 700 !important;'>ВЫПОЛНЕНО</p>"
                            } else {
                                task_status = "<p class='declined' style='font-weight: 700 !important;'>НЕ ВЫПОЛНЕНО</p>"
                            }

                            for (let j = 0; j < Object.keys(EXECUTORS).length; j++) {
                                if (data.results[i].user == EXECUTORS[j].id) {
                                    task_executor = EXECUTORS[j].name
                                    break
                                }
                            }

                            $('.list-wrapper').append(
                                '<div class="list-item">' +
                                '<div class="left-item-body">' +
                                isDeletable +
                                '<div class="v-wrapper">' +
                                '<p class="review-task-date">' + convertToCalendar(data.results[i].created_at) + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="middle-item-body">' +
                                '<div class="v-wrapper">' +
                                '<p>' + task_name + '</p>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<p class="task-executor">' + task_executor + '</p>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<div class="h-wrapper">' +
                                task_status +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="right-item-body">' +
                                '<div class="task-nav-container">' +
                                modalOnAccept +
                                '<img class="task-nav decline" onclick="declineTask(' + data.results[i].id + ')" src="/img/decline-task.svg">' +
                                '</div>' +
                                '</div>' +
                                '</div>'
                            )

                        }
                        DATA = data

                    })
            })
    } else {
        getData(users)
            .then((value) => {
                return value.json()
            })
            .then((data) => {
                if (isAppended == false) {
                    let totalItems = Object.keys(data.results).length

                    for (let i = 0; i < totalItems; i++) {
                        $(".executor-list").append('<option value="user=' + data.results[i].id + '">' + data.results[i].first_name + " " + data.results[i].last_name + '</option>')
                        let assign = {
                            "name": data.results[i].first_name + " " + data.results[i].last_name,
                            "id": data.results[i].id
                        }
                        EXECUTORS[i] = assign
                    }
                    isAppended = true
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
                        let task_executor
                        let task_status


                        for (var i = 0; i < totalItems; i++) {

                            let isDeletable = '<img style="opacity:40%; cursor: default" class="delete-task" src="/img/delete-task.svg">'
                            let modalOnAccept = '<img class="task-nav confirm" onclick="confirmTask(' + data.results[i].id + ')" src="/img/confirm-task.svg">'

                            if (data.results[i].type == "R") {
                                task_name = "<p style='font-size:15px;' class='task-name-wrapper'>Отс. (смена типа: ОТК. → РАЗМН.) → <font style='font-weight:700'>" + data.results[i].cage_from.farm_number + data.results[i].cage_from.number + data.results[i].cage_from.letter + " → " + data.results[i].cage_to.farm_number + data.results[i].cage_to.number + data.results[i].cage_to.letter + "</font></p>"
                            } else if (data.results[i].type == "F") {
                                task_name = "<p style='font-size:15px' class='task-name-wrapper'>Отс. (смена типа: РАЗМН. → ОТК.) → <font style='font-weight:700'>" + data.results[i].cage_from.farm_number + data.results[i].cage_from.number + data.results[i].cage_from.letter + " → " + data.results[i].cage_to.farm_number + data.results[i].cage_to.number + data.results[i].cage_to.letter + "</font></p>"
                            } else if (data.results[i].type == "M") {
                                isDeletable = '<img onclick="deleteTask(' + data.results[i].id + ')" class="delete-task" src="/img/delete-task.svg">'
                                task_name = "<p style='font-size:16px' class='task-name-wrapper'>Размн. → <font style='font-weight:700'>" + data.results[i].cage_from.farm_number + data.results[i].cage_from.number + data.results[i].cage_from.letter + " → " + data.results[i].cage_to.farm_number + data.results[i].cage_to.number + data.results[i].cage_to.letter + "</font></p>"
                            } else if (data.results[i].type == "B") {
                                if (!data.results[i].is_completed) {
                                    modalOnAccept = '<img class="task-nav confirm" onclick="executeJigging(' + data.results[i].id + ', ' + '\'' + convertToCalendar(data.results[i].created_at) + '\'' + ')" src="/img/confirm-task.svg">'
                                }
                                task_name = "<p style='font-size:15px' class='task-name-wrapper'>Отс. от матери (" + data.results[i].number_bunnies + " кр.) → <font style='font-weight:700'>" + data.results[i].cage_from.farm_number + data.results[i].cage_from.number + data.results[i].cage_from.letter + " → " + data.results[i].male_cage_to.farm_number + data.results[i].male_cage_to.number + data.results[i].male_cage_to.letter + "(M)" + " → " + data.results[i].female_cage_to.farm_number + data.results[i].female_cage_to.number + data.results[i].female_cage_to.letter + "(Ж)</font></p>"
                            } else if (data.results[i].type == "V") {
                                task_name = "<p style='font-size:16px' class='task-name-wrapper'>Вакц. → <font style='font-weight:700'>" + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + "</font></p>"
                            } else if (data.results[i].type == "I") {
                                if (!data.results[i].is_completed) {
                                    modalOnAccept = '<img class="task-nav confirm" onclick="executeInspect(' + data.results[i].id + ', ' + '\'' + convertToCalendar(data.results[i].created_at) + '\'' + ', ' + data.results[i].number_rabbits + ')" src="/img/confirm-task.svg">'
                                }
                                task_name = "<p style='font-size:16px' class='task-name-wrapper'>Осмотр перед убоем (" + data.results[i].number_rabbits + " кр.) → <font style='font-weight:700'>" + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + "</font></p>"
                            } else if (data.results[i].type == "S") {
                                task_name = "<p style='font-size:16px' class='task-name-wrapper'>Убой → <font style='font-weight:700'>" + data.results[i].cage.farm_number + data.results[i].cage.number + data.results[i].cage.letter + "</font></p>"
                            }

                            if (data.results[i].is_completed == true) {
                                task_status = "<p class='confirmed' style='font-weight: 700 !important;'>ВЫПОЛНЕНО</p>"
                            } else {
                                task_status = "<p class='declined' style='font-weight: 700 !important;'>НЕ ВЫПОЛНЕНО</p>"
                            }

                            for (let j = 0; j < Object.keys(EXECUTORS).length; j++) {
                                if (data.results[i].user == EXECUTORS[j].id) {
                                    task_executor = EXECUTORS[j].name
                                    break
                                }
                            }

                            $('.list-wrapper').append(
                                '<div class="list-item">' +
                                '<div class="left-item-body">' +
                                isDeletable +
                                '<div class="v-wrapper">' +
                                '<p class="review-task-date">' + convertToCalendar(data.results[i].created_at) + '</p>' +
                                '</div>' +
                                '</div>' +
                                '<div class="middle-item-body">' +
                                '<div class="v-wrapper">' +
                                '<p>' + task_name + '</p>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<p class="task-executor">' + task_executor + '</p>' +
                                '</div>' +
                                '<div class="v-wrapper">' +
                                '<div class="h-wrapper">' +
                                task_status +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="right-item-body">' +
                                '<div class="task-nav-container">' +
                                modalOnAccept +
                                '<img class="task-nav decline" onclick="declineTask(' + data.results[i].id + ')" src="/img/decline-task.svg">' +
                                '</div>' +
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

function deleteTask(id) {
    deleteData(deleteURL + id + "/")
        .then((after) => {
            location.reload()
        })
}

function confirmTask(id) {
    let confirm = {
        "is_confirmed": true
    }
    putData((confirmURL + id + "/"), confirm)
        .then((answer) => {
            location.reload()
        })
}

function declineTask(id) {
    deleteData(completeURL + id + "/")
    location.reload()
}

function executeInspect(id, date, rabbits) {
    $('.inspectDate').append(date)
    $('.executeInspect-bot').append(
        '<p class="p-wrapper" onclick="submitInspect(' + id + ', ' + rabbits + ')">Выполнено</p>'
    )

    for (let i = 0; i < rabbits; i++) {
        let counter = i + 1
        $('.rabbits-weights').append(
            '<div class="weights-wrapper">' +
            '<p class="p-wrapper">Вес кролика №' + counter + '(кг):</p>' +
            '<input class="executeInspect-input input-sm" type="text" placeholder="" id="rabbitWeight' + i + '">' +
            '</div>'
        )
    }

    window.location.href = "#executeInspect"
}

function executeJigging(id, date) {
    $('.jiggingDate').append(date)
    $('.executeJigging-bot').append(
        '<p class="p-wrapper" onclick="submitJigging(' + id + ')">Выполнено</p>'
    )

    window.location.href = "#executeJigging"
}

function submitJigging(id) {
    let send = {
        "males": $("#maleNumber").val()
    }
    putData(jiggingURL + id + "/", send)
        .then((answer) => {
            let send = {
                "is_confirmed": true
            }
            putData(confirmURL + id + "/", send)
                .then((answer) => {
                    window.location.href = "#close"
                    location.reload()
                })
        })
}

function submitInspect(id, rabbits) {
    let send = {}
    let assign = []
    for (let i = 0; i < rabbits; i++) {
        assign[i] = +$("#rabbitWeight" + i).val()
    }
    send = {
        "weights": assign
    }
    putData(inspectURL + id + "/", send)
        .then((answer) => {
            let send = {
                "is_confirmed": true
            }
            putData(confirmURL + id + "/", send)
                .then((answer) => {
                    window.location.href = "#close"
                    location.reload()
                })
        })
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
                showList(tasksURL + "&page=" + pageNumber, false)
            } else {
                showList(tasksURL + "&page=" + pageNumber, false, FILTER)
            }
        }
    });
}

function listenState() {
    $(".save-changes-btn").click(function() {
        for (let i = 0; i < Object.keys(EXECUTORS).length; i++) {
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

function applyExecutorFilter(e) {
    FILTER = ""
    FILTER = e.value
    showList(tasksURL)
}

function unlockPrint(e) {
    if (e.value == "?") {
        $(".print-btn").removeClass("disabled")
        $(".print-btn").addClass("disabled")
    } else {
        $(".print-btn").removeClass("disabled")
    }
}

function printTasks() {
    let user = $(".forPrint").val()
    user = user.replace("user=", "")
    window.open(printFileURL + user + "/docx/")
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