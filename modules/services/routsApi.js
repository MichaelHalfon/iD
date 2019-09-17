/**
 * Api is the main tool used by our application to interact with the Node Api
 */
// import URLSearchParams from 'url-search-params';

// const url = 'https://serene-crag-11618.herokuapp.com/api/';

class Api {
  constructor(serverToken) {
    this.token = serverToken;
    this.url = 'https://api.routs.fr/api';
    // console.log(`Routs api ready with server token ${serverToken}`);
  }

  query(string) {
    const body = JSON.stringify({ query: '{' + string + '}' });
    return fetch(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token,
      },
      body,
    })
      .then(response => {
        if (!response.ok) {
          return Promise.resolve({ errors: ['Invalid response'] });
        }
        return response.json();
      })
      .then(function(data) {
        return Promise.resolve(data.data);
      });
  }

  mutateConnected(string) {
      const body = JSON.stringify({ query: 'mutation {'+ string + '}' });
      return fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.token
    },
        body,
      }).then(response => response.json())
        .then((data) => {
          // console.log(body);
          // console.log(data.data);
          if (data.errors) {
            console.error(data.errors);
          }
          return Promise.resolve(data.data);
        });
    }

  mutate(string) {
      const body = JSON.stringify({ query: 'mutation {' + string + '}' });
      return fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'
    },
        body,
      }).then(response => response.json())
        .then((data) => {
          // console.log(body);
          // console.log(data.data);
          if (data.errors) {
            console.error(data.errors);
          }
          return Promise.resolve(data.data);
        });
    }
}

export default Api;
