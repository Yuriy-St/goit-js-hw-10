'use strict';

import { Notify } from 'notiflix';

export default class CatAPI {
  #API_KEY = 'live_c0GCEzlfd7OKx7cVWYiWP5Sig6z9udML8g0l0RIoVyVVGU5EU009R5fupYUQiQzI';
  #BASE_URL = 'https://api.thecatapi.com/v1/';

  fetchImages(options = {}) {
    const url = `${this.#BASE_URL}images/search`;
    const objParams = {
      api_key: this.#API_KEY,
      limit: 1,
      has_breeds: 1,
      ...options,
    };

    const resource = this.#getResource(url, objParams);
    return this.#makeQuery(resource);
  }

  fetchBreeds(options = {}) {
    const url = `${this.#BASE_URL}breeds`;
    const resource = this.#getResource(url, options);
    return this.#makeQuery(resource);
  }

  fetchByBreed(breedId) {
    return this.fetchImages({ breed_ids: breedId }).then(this.#processBreed);
  }

  #getResource(url, objParams = {}) {
    const params = this.#stringifyParams(objParams);
    return `${url}?${params}`;
  }

  #stringifyParams(obj) {
    return Object.keys(obj).reduce((acc, key) => {
      // console.log(key);
      const param = `${key}=${obj[key]}`;
      return acc ? (acc += `&${param}`) : param;
    }, '');
  }

  #processBreed(result) {
    const { url, breeds } = result[0];
    const { name, description, temperament } = breeds[0];
    return Promise.resolve({ url, name, description, temperament });
  }

  #makeQuery(resource) {
    return fetch(resource)
      .then(response => {
        if (!response.ok) throw Error(`${response.status} ${response.statusText}`.trim());
        // console.log(response);
        return response.json();
      })
      .catch(console.error);
  }
}
