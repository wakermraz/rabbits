const rabbitsURL = "https://rabbit-api--test.herokuapp.com/api/rabbit/?format=json";

const xhr = new XMLHttpRequest()

xhr.open('POST', rabbitsURL)
xhr.responseType = 'json'

xhr.onload = () => {
	var data = response
	console.log(response[0].id)
}

xhr.onerror = () => {
	console.log("Что-то пошло не так")
}

xhr.send()