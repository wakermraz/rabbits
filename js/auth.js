let authURL = "https://rabbit-api--test.herokuapp.com/api/auth/token/"

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

function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

$(document).ready(function() {
    let findToken = getCookie('token')
    if(findToken != undefined){
        window.location.href = "/rabbits.html"
    }
    $(".log-in").click(function() {
        let send = {
            'username': $('input[name=login]').val(),
            'password': $('input[name=password]').val()
        }
        postData(authURL, send)
            .then((answer) => {
                return answer.json()
            })
            .then((data) => {
                let date = new Date(Date.now() + 86400e3);
                date = date.toUTCString();
                setCookie('token', data.token, { 'max-age': date});
                window.location.href="/rabbits.html"
            })
    })

})