export const baseUrl = 'http://localhost:9090/';

export const fetchData = (endpoint) => fetch(endpoint).then(res => res.json())
