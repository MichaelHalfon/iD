/**
 * Api is the main tool used by our application to interact with the Node Api
 */
// import URLSearchParams from 'url-search-params';

// const url = 'https://serene-crag-11618.herokuapp.com/api/';

var Api = {
    token: "",
    url: 'https://api.routs.fr/api',
    ctor: function(serverToken) {
        this.token = serverToken;
    },

    query: function (string) {
        var body = JSON.stringify({ query: '{' + string + '}' , token: this.token });
        return fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.token,
            },
            body: body,
        })
            .then(function (response) {
                if (!response.ok) {
                    return Promise.resolve({ errors: ['Invalid response'] });
                }
                return response.json();
            })
            .then(function(data) {
                return Promise.resolve(data.data);
            });
    },

    mutateConnected: function (string) {
        var body = JSON.stringify({ query: 'mutation {' + string + '}' });
        return fetch(this.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.token
            },
            body: body,
        }).then(function (response) { return response.json(); })
            .then(function (data) {
                // console.log(body);
                // console.log(data.data);
                if (data.errors) {
                    console.error(data.errors);
                }
                return Promise.resolve(data.data);
            });
    },

    mutate: function (string) {
        var body = JSON.stringify({ query: 'mutation {' + string + '}' });
        return fetch(this.url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'
            },
            body: body,
        }).then(function (response) { return response.json(); })
            .then(function (data) {
                // console.log(body);
                // console.log(data.data);
                if (data.errors) {
                    console.error(data.errors);
                }
                return Promise.resolve(data.data);
            });
    },
}

export default Api;
