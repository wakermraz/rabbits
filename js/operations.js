const operationsURL = "https://rabbit-api--test.herokuapp.com/api/operation/";
const rabbitsURL = "https://rabbit-api--test.herokuapp.com/api/rabbit/";
const rabbit_operations = "https://rabbit-api--test.herokuapp.com/api/operation/?rabbit_id=";

var showWeight;

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

getData(operationsURL)
    .then((value) => {
        return value.json();
    })
    .then((data) => {
        $('#list-wrapper-loading').remove();
        var totalItems = Object.keys(data).length;
        var operation_type;

        for (var i = 0; i < totalItems; i++) {

            var time = new Date(data[i].time);
            time = time.format("dd.mm.yyyy HH:MM");

            var rabbit_id = data[i].rabbit_id;

            if (data[i].type == "J") {
                operation_type = "Отсадка кролика ";
                operation_type += "(" + data[i].old_cage.farm_number + data[i].old_cage.number + data[i].old_cage.letter + "→" + data[i].new_cage.farm_number + data[i].new_cage.number + data[i].new_cage.letter + ")";
            } else if (data[i].type == "B") {
                operation_type = "Рождение кролика";
            } else if (data[i].type == "V") {
                operation_type = "Вакцинация";
            } else if (data[i].type == "S") {
                operation_type = "Убой";
            } else if (data[i].type == "M") {
                operation_type = "Спаривание ";
                operation_type += '<a class="rabbitModal" href="#rabbitModal" id="' + data[i].mother_rabbit_id + '">(#' + data[i].mother_rabbit_id + ')';
                rabbit_id = data[i].father_rabbit_id;
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
                '<p><a href="#rabbitModal" class="rabbitModal" id="' + rabbit_id + '">#' + rabbit_id + '</a></p>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="right-item-body">' +
                '<p>' + operation_type + '</p>' +
                '</div>' +
                '</div>'
            )
        }
        getData(rabbitsURL)
            .then((value) => {
                return value.json();
            })
            .then((data) => {
                $(".rabbitModal").click(function() {
                    let modal_id = this.id - 1;
                    let this_id = this.id;
                    let modal_ico;
                    let modalSex;
                    let rabbit_type;
                    let curr_rabbit_operations = rabbit_operations + this_id;

                    var birthday = new Date(data[modal_id].birthday);
                    var today = new Date;
                    var diff = today - birthday;
                    var milliseconds = diff;
                    var seconds = milliseconds / 1000;
                    var minutes = seconds / 60;
                    var hours = minutes / 60;
                    var days = hours / 24;

                    if (data[modal_id].current_type == "B") {
                        modal_ico = "-small";
                        rabbit_type = "МАЛЕНЬК"
                    } else if (data[modal_id].current_type == "F") {
                        modal_ico = "-big";
                        rabbit_type = "ОТКРОМ"
                    } else if (data[modal_id].current_type == "M") {
                        modal_ico = "-big";
                        rabbit_type = "РАЗМНОЖ"
                    } else if (data[modal_id].current_type == "P") {
                        modal_ico = "-big";
                        rabbit_type = "РАЗМНОЖ"
                    }

                    if (Object.keys(data[modal_id].status) > 1) {
                        if (data[modal_id].status[0] == "RF") {
                            var rabbit_status = "Готов к размнож."
                        } else if (data[modal_id].status[0] == "R") {
                            rabbit_status = "Отдыхает"
                        } else if (data[modal_id].status[0] == "UP") {
                            rabbit_status = "Неподтвержденная берем."
                        } else if (data[modal_id].status[0] == "NI") {
                            rabbit_status = "Нужен осмотр на берем."
                        } else if (data[modal_id].status[0] == "CP") {
                            rabbit_status = "Беременная"
                        } else if (data[modal_id].status[0] == "FB") {
                            rabbit_status = "Кормит крольчат"
                        } else if (data[modal_id].status[0] == "NV") {
                            rabbit_status = "Треб. вак."
                        } else if (data[modal_id].status[0] == "NI") {
                            rabbit_status = "Треб. осмотр"
                        } else if (data[modal_id].status[0] == "WC") {
                            rabbit_status = "Кормится без кокцидиост."
                        } else if (data[modal_id].status[0] == "RS") {
                            rabbit_status = "Готов к убою"
                        } else if (data[modal_id].status[0] == "NJ") {
                            rabbit_status = "Треб. отсадка"
                        } else if (data[modal_id].status[0] == "MF") {
                            rabbit_status = "Кормится у матери"
                        }
                        for (let key in data[modal_id].status) {
                            if (data[modal_id].status[key] == "RF") {
                                rabbit_status += ", Готов к размнож."
                            } else if (data[modal_id].status[key] == "R") {
                                rabbit_status += ", Отдыхает"
                            } else if (data[modal_id].status[key] == "UP") {
                                rabbit_status += ", Неподтвержденная берем."
                            } else if (data[modal_id].status[key] == "NI") {
                                rabbit_status += ", Нужен осмотр на берем."
                            } else if (data[modal_id].status[key] == "CP") {
                                rabbit_status += ", Беременная"
                            } else if (data[modal_id].status[key] == "FB") {
                                rabbit_status += ", Кормит крольчат"
                            } else if (data[modal_id].status[key] == "NV") {
                                rabbit_status += ", Треб. вак."
                            } else if (data[modal_id].status[key] == "NI") {
                                rabbit_status += ", Треб. осмотр"
                            } else if (data[modal_id].status[key] == "WC") {
                                rabbit_status += ", Кормится без кокцидиост."
                            } else if (data[modal_id].status[key] == "RS") {
                                rabbit_status += ", Готов к убою"
                            } else if (data[modal_id].status[key] == "NJ") {
                                rabbit_status += ", Треб. отсадка"
                            } else if (data[modal_id].status[key] == "MF") {
                                rabbit_status += ", Кормится у матери"
                            }
                        }
                    } else {
                        if (data[modal_id].status[0] == "RF") {
                            var rabbit_status = "Готов к размнож."
                        } else if (data[modal_id].status[0] == "R") {
                            rabbit_status = "Отдыхает"
                        } else if (data[modal_id].status[0] == "UP") {
                            rabbit_status = "Неподтвержденная берем."
                        } else if (data[modal_id].status[0] == "NI") {
                            rabbit_status = "Нужен осмотр на берем."
                        } else if (data[modal_id].status[0] == "CP") {
                            rabbit_status = "Беременная"
                        } else if (data[modal_id].status[0] == "FB") {
                            rabbit_status = "Кормит крольчат"
                        } else if (data[modal_id].status[0] == "NV") {
                            rabbit_status = "Треб. вак."
                        } else if (data[modal_id].status[0] == "NI") {
                            rabbit_status = "Треб. осмотр"
                        } else if (data[modal_id].status[0] == "WC") {
                            rabbit_status = "Кормится без кокцидиост."
                        } else if (data[modal_id].status[0] == "RS") {
                            rabbit_status = "Готов к убою"
                        } else if (data[modal_id].status[0] == "NJ") {
                            rabbit_status = "Треб. отсадка"
                        } else if (data[modal_id].status[0] == "MF") {
                            rabbit_status = "Кормится у матери"
                        }
                    }

                    if (data[modal_id].is_male === null) {
                        modalSex = "unknown";
                    } else if (data[modal_id].is_male === true) {
                        modalSex = "male-main";
                    } else if (data[modal_id].is_male === false) {
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

                    if (data[modal_id].weight === null) {
                        data[modal_id].weight = "?"
                    }
                    $('.rabbit-header-info-bot').append(
                        '<p class="added">#' + this.id + '</p>' +
                        '<p class="removable-weight added">' + data[modal_id].weight + '&nbspкг.</p>'
                    )

                    var birthday = new Date(data[modal_id].birthday);
                    birthday = birthday.format("dd.mm.yyyy");
                    $('.rabbit-header-right').append(
                        '<p class="added">Дата рождения:&nbsp<font class="added" style="font-weight:700;width:9.4ch;display:inline-flex;overflow:hidden;">' + birthday + '</font></p>' +
                        '<p class="added">Возраст:&nbsp<font class="added" style="font-weight:700;">' + Math.round(days) + '&nbspдней</font></p>'
                    )

                    $('.rabbitModal-type').append(
                        '<span class="subheader-details added">&nbsp' + rabbit_type + '</span>'
                    )

                    $('.rabbitModal-breed').append(
                        '<span class="subheader-details added">&nbsp' + data[modal_id].breed + '</span>'
                    )

                    $('.rabbitModal-cageNum').append(
                        '<span class="subheader-details added"> &nbsp' + data[modal_id].cage.farm_number + data[modal_id].cage.number + data[modal_id].cage.letter + '</span>'
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
                                let counter = Object.keys(data).length
                                for (let i = 0; i < counter; i++) {
                                    var date = new Date(data[i].time);
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
                        showWeight = data[weight_rabbit_id_in_array].weight;

                        $('.removable-weight').remove();
                        if (data[weight_rabbit_id_in_array].weight === null) {
                            data[weight_rabbit_id_in_array].weight = "?"
                        }
                        $('.curr-rabbit-weight').append(
                            '<span class="added added-secondary" style="white-space: nowrap;">&nbsp' + data[weight_rabbit_id_in_array].weight + '&nbspкг.</span>'
                        )

                        $('#changeWeight-modal-loading').remove()

                        $(".submit-changeWeight").click(function() {

                            $('.added-secondary').remove();
                            newWeight.weight = +$("#newWeight").val();
                            putData(makeLink(rabbitsURL, weight_rabbit_id, data[weight_rabbit_id_in_array].current_type), newWeight)
                                .then((value) => {
                                    location.reload()
                                })
                        })
                    })

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

                $("#rabbitModal-close").click(function() {
                    $('#loader-rabbit-modal').append(
                        '<div id="rabbit-modal-loading" class="loading">' +
                        '<img src="/img/loading.gif">' +
                        '</div>'
                    );
                    $('.added').remove();
                });
            });


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
