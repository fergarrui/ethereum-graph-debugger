export const baseUrl = 'http://localhost:9090/';

export const fetchData = (endpoint) => fetch(endpoint).then(res => res.json())

export const postData = (endpoint, headers) => fetch(endpoint, headers).then(response => {
  if (response.ok) {
    return response;
  } else {
    var error = new Error('Error ' + response.status + ': ' + response.statusText);

    error.response = response;
    throw error;
  }
},
error => {
  var errmess = new Error(error.message);
  throw errmess; 
})
.then(response => response.json())