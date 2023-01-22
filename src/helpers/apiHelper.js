import { apiPath } from 'constants/defaultValues';

const { getUserToken } = require('./Utils');

const getApiHeader = () => {
  const auth = getUserToken();
  return {
    Authorization: `Bearer ${auth}`,
    'Content-Type': 'application/json',
  };
};

const parseJson = async (response) => {
  const text = await response.text();
  try {
    if (response.status === 401) {
      localStorage.clear();
      // eslint-disable-next-line no-restricted-globals
      // location.href = '/';
    }
    const json = JSON.parse(text);
    return [response, json];
  } catch (err) {
    console.log(`Did not receive JSON, instead received: ${text}`);
    return [response, {}];
  }
};
export const apiGetWithAuthToken = (url) => {
  return new Promise((resolve, reject) => {
    fetch(apiPath + url, {
      method: 'GET',
      headers: getApiHeader(),
    })
      .then(parseJson)
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

export const apiWithAuthToken = (method, url, body = null) => {
  return new Promise((resolve, reject) => {
    fetch(apiPath + url, {
      method,
      body: body ? JSON.stringify(body) : undefined,
      headers: getApiHeader(),
    })
      .then(parseJson)
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

export const apiDeleteWithAuthToken = (url) => {
  return apiWithAuthToken('DELETE', url);
};

export const apiPutWithAuthToken = (url, body) => {
  return apiWithAuthToken('PUT', url, body);
};

export const apiPatchWithAuthToken = (url, body) => {
  return apiWithAuthToken('PATCH', url, body);
};
