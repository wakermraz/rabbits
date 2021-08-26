let authURL = "https://rabbit-api--app.herokuapp.com/api/auth/session/"

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

$(document).ready(function() {

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
			if(data.client_error.message.non_field_errors[0].code == "authorization"){
				location.reload()
			} else {
				window.location.href = "/rabbits.html"
			}
		})
	})

})