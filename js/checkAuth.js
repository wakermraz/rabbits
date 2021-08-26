let checkAUTH = "https://rabbit-api--app.herokuapp.com/api/echo/"

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

getData(checkAUTH)
.then((answer) => {
    return answer.json()
})
.then((data) => {
    if(data.user == "AnonymousUser"){
        window.location.href = "/home.html"
    } else {
        window.location.href = "/rabbits.html"
    }
})