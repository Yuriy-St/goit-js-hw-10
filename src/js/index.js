'use strict';

import CatAPI from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';

import { Report } from 'notiflix';

const catAPI = new CatAPI();

const loaderEl = document.querySelector('.loader-backdrop');
const catInfoEl = document.querySelector('.cat-info');

const select = new SlimSelect({
  select: '.breed-select',
  events: {
    afterChange: fetchBreed,
  },
});

// loaderEl.classList.add('is-hidden');
touggleCatInfo();

catAPI
  .fetchBreeds()
  .then(fillSelectWithBreeds)
  .catch(processError)
  .finally(() => {
    touggleLoader();
  });
// catAPI.fetchBreedInfo('asho').then(console.log).catch(console.error);

function touggleLoader() {
  loaderEl.classList.toggle('is-hidden');
}

function touggleCatInfo(isError = false) {
  if (isError) {
    catInfoEl.classList.add('is-hidden');
    return;
  }
  catInfoEl.classList.toggle('is-hidden');
}

function fillSelectWithBreeds(breeds) {
  const data = breeds.map(breed => {
    return { value: breed.id, text: breed.name };
  });
  select.setData(data);
  touggleCatInfo();
}

function fetchBreed(selections) {
  touggleCatInfo();
  touggleLoader();
  catAPI
    .fetchByBreed(selections[0].value)
    .then(renderBreed)
    .catch(processError)
    .finally(() => {
      touggleLoader();
    });
}

function renderBreed(breed) {
  const { url, name, description, temperament } = breed;
  const catInfoEl = document.querySelector('.cat-info');
  catInfoEl.innerHTML = `
  <div class="img-breed">
    <img src="${url}" alt="Representative of the ${name} breed" />
  </div>
  <div class="breed">
    <h2 class="breed-title">${name}</h2>
    <p class="description">${description}</p>
    <p class="temperament"><span>Temperament: </span>${temperament}</p>
  </div>
  `;
  touggleCatInfo();
}

function processError(err) {
  touggleCatInfo(true);
  Report.failure('Error', `${err.message || 'Something went wrong 🙄 Try reloading the page!'}`, 'Okay');
  console.error(err);
}
