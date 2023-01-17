import { apiPath } from 'constants/defaultValues';

const { getUserToken } = require('./Utils');

const getApiHeader = () => {
  const auth = getUserToken();
  return {
    Authorization: `Bearer ${auth}`,
    'Content-Type': 'application/json',
  };
};
export const apiGetWithAuthToken = (url) => {
  return new Promise((resolve, reject) => {
    fetch(apiPath + url, {
      method: 'GET',
      headers: getApiHeader(),
    })
      .then((response) => Promise.all([response, response.json()]))
      .then(([response, responseObj]) => {
        return resolve({
          statusCode: response.status,
          message: response.statusText,
          data: responseObj,
        });
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

export const apiWithAuthToken = (method, url, body) => {
  return new Promise((resolve, reject) => {
    fetch(apiPath + url, {
      method,
      body: JSON.stringify(body),
      headers: getApiHeader(),
    })
      .then((response) => {
        if (response.status === 201) {
          return Promise.all([response, {}]);
        }
        return Promise.all([response, response.json()]);
      })
      .then(([response, responseObj]) => {
        return resolve({
          statusCode: response.status,
          message: response.statusText,
          data: responseObj,
        });
      })
      .catch((err) => {
        return reject(err);
      });
  });
};

export const apiPostWithAuthToken = (url, body) => {
  return apiWithAuthToken('POST', url, body);
};

export const apiPutWithAuthToken = (url, body) => {
  return apiWithAuthToken('PUT', url, body);
};

export const apiPatchWithAuthToken = (url, body) => {
  return apiWithAuthToken('PATCH', url, body);
};
