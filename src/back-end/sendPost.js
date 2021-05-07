const fetch = require("node-fetch");

const postRequest = function (route, json, func) {
    const url = 'https://farmsignal.net:8080' + route;

    let formBody = [];
    for (let property in json) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(json[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        credentials: 'include',
        body: formBody,
    };

    //fetch(url, options).then((res) => res.text()).then((data) => console.log(data));

    fetch(url, options).then((res) => func(res)).then((data) => console.log(data)).catch((err) => {
        console.log(err);
    });
}

module.exports = {
    postRequest
};