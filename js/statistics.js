const cagesURL = "https://rabbit-api--app.herokuapp.com/api/cage/?";
let rabbitsURL = "https://rabbit-api--app.herokuapp.com/api/rabbit/"
const cagesFILTER = "https://rabbit-api--app.herokuapp.com/api/cage/?";
let renewCageURL = "https://rabbit-api--app.herokuapp.com/api/cage/"
let babiesURL = "https://rabbit-api--app.herokuapp.com/api/rabbit/?status=MF"
let operationsURL = "https://rabbit-api--app.herokuapp.com/api/operation/?"
let feedsURL = "https://rabbit-api--app.herokuapp.com/api/feeds/"

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
    res = date[8] + data[9] + date[7] + date[5] + date[6] + date[4] + date[0] + date[1] + date[2] + date[3]
    return res;
}

function updateTopChart() {
    let week = [];
    if ($('.right').val() == "week") {
        let day = 604800000;
        for (let i = 0; i < 7; i++) {
            var s = new Date
            var today = new Date(s.getTime() - day);
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();

            week[i] = dd + '.' + mm + '.' + yyyy;
            day -= 86400000
        }
    }
    const labels = week;

    const data = {
        labels: labels,
        datasets: [{
            backgroundColor: '#fff',
            borderColor: '#39A852',
            data: [20, 20, 20, 20, 40, 10, 13],
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {}
    };

    var topStatistics = new Chart(
        $("#top-stats"),
        config
    );
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

$(document).ready(function() {
    overallStat()

    updateTopChart()

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