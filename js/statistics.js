const cagesURL = "https://rabbit-api--test.herokuapp.com/api/cage/?";
let rabbitsURL = "https://rabbit-api--test.herokuapp.com/api/rabbit/"
const cagesFILTER = "https://rabbit-api--test.herokuapp.com/api/cage/?";
let renewCageURL = "https://rabbit-api--test.herokuapp.com/api/cage/"
let babiesURL = "https://rabbit-api--test.herokuapp.com/api/rabbit/?status=MF"
let operationsURL = "https://rabbit-api--test.herokuapp.com/api/operation/?"
let feedsURL = "https://rabbit-api--test.herokuapp.com/api/feeds/"
let femaleURL = "https://rabbit-api--test.herokuapp.com/api/rabbit/?type=M&page_size=1"
let maleURL = "https://rabbit-api--test.herokuapp.com/api/rabbit/?type=P&page_size=1"
let slaughterURL = "https://rabbit-api--test.herokuapp.com/api/rabbit/?"

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

let getPlan = "https://rabbit-api--test.herokuapp.com/api/plan/?date="
let putPlan = "https://rabbit-api--test.herokuapp.com/api/plan/"

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

function updateTopChart() {
    $('.top-stats-filter-body').empty()
    $('.top-stats-filter-body').append(
        '<canvas id="top-stats" width="800" height="300"></canvas>'
    )
    let week = [];
    let dayAfter = [];
    let month = [];
    let year = [];
    let weekFetch = [];
    let monthFetch = [];
    let yearFetch = [];
    let showData = [];
    let labels;
    let p1;
    if ($('.right').val() == "week") {
        let day = 604800000;
        for (let i = 0; i < 7; i++) {
            let s = new Date
            let tomorrow = new Date(s.getTime() + (24 * 60 * 60 * 1000))
            let today = new Date(tomorrow.getTime() - day);
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();

            weekFetch[i] = yyyy + '.' + mm + '.' + dd
            week[i] = dd + '.' + mm + '.' + yyyy;
            day -= 86400000
        }
        let minDay = 518400000
        for (let i = 0; i < 7; i++) {
            if (i == 6) {
                let s = new Date
                let tomorrow = new Date(s.getTime() + (24 * 60 * 60 * 1000))
                let today = new Date(tomorrow.getTime() - 86400000);
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0');
                let yyyy = today.getFullYear();
                dayAfter[i] = yyyy + '.' + mm + '.' + dd
            } else {
                let s = new Date
                let tomorrow = new Date(s.getTime() + (24 * 60 * 60 * 1000))
                let today = new Date(tomorrow.getTime() - minDay);
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0');
                let yyyy = today.getFullYear();

                dayAfter[i] = yyyy + '.' + mm + '.' + dd
            }
            minDay -= 86400000
        }
        for (let i = 0; i < 7; i++) {
            p1 = getData(operationsURL + "time_from=" + weekFetch[i] + "&time_to=" + dayAfter[i] + $('.left').val())
                .then((value) => {
                    return value.json()
                })
                .then((data) => {
                    showData[i] = data.count
                })
        }
        labels = week

        Promise.all([p1]).then((value) => {
            setTimeout(() => {
                const data = {
                    labels: labels,
                    datasets: [{
                        backgroundColor: '#fff',
                        borderColor: '#39A852',
                        data: showData,
                    }]
                };

                const config = {
                    type: 'line',
                    data: data,
                    options: {}
                };

                let topStatistics = new Chart(
                    $("#top-stats"),
                    config
                );
            }, 500)
        })
    } else if ($('.right').val() == "month") {
        let day = 2592000000;
        for (let i = 0; i < 30; i++) {
            let s = new Date
            let tomorrow = new Date(s.getTime() + (24 * 60 * 60 * 1000))
            let today = new Date(tomorrow.getTime() - day);
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();

            monthFetch[i] = yyyy + '.' + mm + '.' + dd
            month[i] = dd + '.' + mm + '.' + yyyy;
            day -= 86400000
        }
        let minDay = 2505600000
        for (let i = 0; i < 30; i++) {
            if (i == 29) {
                let s = new Date
                let tomorrow = new Date(s.getTime() + (24 * 60 * 60 * 1000))
                let today = new Date(tomorrow.getTime() - 86400000);
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0');
                let yyyy = today.getFullYear();
                dayAfter[i] = yyyy + '.' + mm + '.' + dd
            } else {
                let s = new Date
                let tomorrow = new Date(s.getTime() + (24 * 60 * 60 * 1000))
                let today = new Date(tomorrow.getTime() - minDay);
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0');
                let yyyy = today.getFullYear();
                dayAfter[i] = yyyy + '.' + mm + '.' + dd
            }
            minDay -= 86400000
        }
        for (let i = 0; i < 30; i++) {
            p1 = getData(operationsURL + "time_from=" + monthFetch[i] + "&time_to=" + dayAfter[i] + $('.left').val())
                .then((value) => {
                    return value.json()
                })
                .then((data) => {
                    showData[i] = data.count
                })
        }
        labels = month

        Promise.all([p1]).then((value) => {
            setTimeout(() => {
                console.log(showData)
                const data = {
                    labels: labels,
                    datasets: [{
                        backgroundColor: '#fff',
                        borderColor: '#39A852',
                        data: showData,
                    }]
                };

                const config = {
                    type: 'line',
                    data: data,
                    options: {}
                };

                let topStatistics = new Chart(
                    $("#top-stats"),
                    config
                );
            }, 500)
        })
    } else {
        let day = 31536000000;
        for (let i = 0; i < 12; i++) {
            let s = new Date
            let tomorrow = new Date(s.getTime() + (24 * 60 * 60 * 1000))
            let today = new Date(tomorrow.getTime() - day);
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();

            yearFetch[i] = yyyy + '.' + mm + '.01'

            if (mm == '01') {
                mm = 'Январь'
            } else if (mm == '02') {
                mm = 'Февраль'
            } else if (mm == '03') {
                mm = 'Март'
            } else if (mm == '04') {
                mm = 'Апрель'
            } else if (mm == '05') {
                mm = 'Май'
            } else if (mm == '06') {
                mm = 'Июнь'
            } else if (mm == '07') {
                mm = 'Июль'
            } else if (mm == '08') {
                mm = 'Август'
            } else if (mm == '09') {
                mm = 'Сентябрь'
            } else if (mm == '10') {
                mm = 'Октябрь'
            } else if (mm == '11') {
                mm = 'Ноябрь'
            } else if (mm == '12') {
                mm = 'Декабрь'
            }

            year[i] = mm;
            day -= 2592000000
        }
        let minDay = 28944000000
        for (let i = 0; i < 12; i++) {
            let s = new Date
            let tomorrow = new Date(s.getTime() + (24 * 60 * 60 * 1000))
            let today = new Date(tomorrow.getTime() - minDay);
            let dd = String(today.getDate()).padStart(2, '0');
            let mm = String(today.getMonth() + 1).padStart(2, '0');
            let yyyy = today.getFullYear();

            if (i == 11) {
                dayAfter[i] = yyyy + '.' + mm + '.' + dd
            } else {
                dayAfter[i] = yyyy + '.' + mm + '.01'
            }
            minDay -= 2592000000
        }
        for (let i = 0; i < 12; i++) {
            p1 = getData(operationsURL + "time_from=" + yearFetch[i] + "&time_to=" + dayAfter[i] + $('.left').val())
                .then((value) => {
                    return value.json()
                })
                .then((data) => {
                    showData[i] = data.count
                })
        }
        labels = year

        Promise.all([p1]).then((value) => {
            setTimeout(() => {
                console.log(showData)
                const data = {
                    labels: labels,
                    datasets: [{
                        backgroundColor: '#fff',
                        borderColor: '#39A852',
                        data: showData,
                    }]
                };

                const config = {
                    type: 'line',
                    data: data,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'bottom',
                            },
                            title: {
                                display: false,
                            }
                        }
                    }
                };

                let topStatistics = new Chart(
                    $("#top-stats"),
                    config
                );
            }, 500)
        })
    }
}

function overallStat() {
    getData(rabbitsURL)
        .then((value) => {
            return value.json()
        })
        .then((data) => {
            $('#rabbitsOnFarm').html(data.count)
        })

    getData(cagesURL)
        .then((value) => {
            return value.json()
        })
        .then((data) => {
            $('#cagesOnFarm').html(data.count)
        })

    getData(babiesURL)
        .then((value) => {
            return value.json()
        })
        .then((data) => {
            $('#babiesOnFarm').html(data.count)
        })

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = yyyy + '.' + mm + '.' + dd;

    getData(operationsURL + "time_from=" + today + "&time_to=" + today)
        .then((value) => {
            return value.json()
        })
        .then((data) => {
            $('#operationsForDay').html(data.count)
        })
}

function bottomStat() {
    slaughterInit()
    femaleInit()
    maleInit()
}

function slaughterInit() {
    let instance = []
    getData(slaughterURL)
        .then((value) => {
            return value.json()
        })
        .then((data) => {
            let ready;
            let not_ready;
            let all;
            all = data.count
            getData(slaughterURL + "status=RS&page_size=1")
                .then((value) => {
                    return value.json()
                })
                .then((data) => {
                    not_ready = all - data.count
                    ready = data.count
                })
                .then(() => {
                    instance[0] = ready;
                    instance[1] = not_ready
                    const data = {
                        labels: ['Готовы', 'Не готовы'],
                        datasets: [{
                            label: 'Сколько готовы к убою',
                            data: instance,
                            backgroundColor: ['rgba(36, 159, 83, 1)', 'rgba(178, 59, 59, 1)'],
                        }]
                    };

                    const config = {
                        type: 'doughnut',
                        data: data,
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                                title: {
                                    display: true,
                                    text: 'Сколько готовы к убою'
                                }
                            }
                        },
                    };

                    let slaughterStat = new Chart(
                        $("#ready-for-slaughter"),
                        config
                    );
                })
        })
}

function femaleInit(){
    let instance = []
    getData(femaleURL)
        .then((value) => {
            return value.json()
        })
        .then((data) => {
            let ready;
            let not_ready;
            let all;
            all = data.count
            getData(femaleURL + "&status=RF")
                .then((value) => {
                    return value.json()
                })
                .then((data) => {
                    not_ready = all - data.count
                    ready = data.count
                })
                .then(() => {
                    instance[0] = ready;
                    instance[1] = not_ready
                    const data = {
                        labels: ['Готовы', 'Не готовы'],
                        datasets: [{
                            label: 'Самок готовы к размножению',
                            data: instance,
                            backgroundColor: ['rgba(155, 40, 123, 1)', 'rgba(69, 149, 194, 1)'],
                        }]
                    };

                    const config = {
                        type: 'doughnut',
                        data: data,
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                                title: {
                                    display: true,
                                    text: 'Самок готовы к размножению'
                                }
                            }
                        },
                    };

                    let femaleStat = new Chart(
                        $("#female-for-sex"),
                        config
                    );
                })
        })
}

function maleInit() {
    let instance = []
    getData(maleURL)
        .then((value) => {
            return value.json()
        })
        .then((data) => {
            let ready;
            let not_ready;
            let all;
            all = data.count
            getData(maleURL + "&status=RF")
                .then((value) => {
                    return value.json()
                })
                .then((data) => {
                    not_ready = all - data.count
                    ready = data.count
                })
                .then(() => {
                    instance[0] = ready;
                    instance[1] = not_ready
                    const data = {
                        labels: ['Готовы', 'Не готовы'],
                        datasets: [{
                            label: 'Самцов готовы к размножению',
                            data: instance,
                            backgroundColor: ['rgba(44, 136, 114, 1)', 'rgba(143, 143, 143, 1)'],
                        }]
                    };

                    const config = {
                        type: 'doughnut',
                        data: data,
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                                title: {
                                    display: true,
                                    text: 'Самцов готовы к размножению'
                                }
                            }
                        },
                    };

                    let maleStat = new Chart(
                        $("#male-for-sex"),
                        config
                    );
                })
        })
}

$(document).ready(function() {
    overallStat()

    bottomStat()

    updateTopChart()

    document.querySelector(".right").addEventListener('change', function(e) {
        updateTopChart()
    })

    document.querySelector(".left").addEventListener('change', function(e) {
        updateTopChart()
    })

    $(".food-management-btn").click(function() {
        getData(feedsURL)
            .then((value) => {
                return value.json()
            })
            .then((data) => {
                $("#all").html(data.all_stocks)
                $("#expected").html(data.expected_stock)
                $("#predict").html(data.predict_bags)
            })
    })

    $(".addFood").click(function() {
        let send = {
            'stocks': $('input[name=addFood]').val()
        }
        postData(feedsURL, send)
            .then((answer) => {
                window.location.href = "#close"
                location.reload()
            })
    })

    $(".deleteFood").click(function() {
        let send = {
            'stocks': +('-' + $('input[name=deleteFood]').val())
        }
        postData(feedsURL, send)
            .then((answer) => {
                window.location.href = "#close"
                location.reload()
            })
    })
})