'use strict';

import CatAPI from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import '../css/index.css';

import { Report } from 'notiflix';

const catAPI = new CatAPI();

const breedSelectRef = document.querySelector('.breed-select');
const catInfoRef = document.querySelector('.cat-info');

const select = new SlimSelect({
  select: '.breed-select',
  settings: {
    placeholderText: 'Select a cat breed',
    hideSelected: true,
  },
  events: {
    afterChange: fetchBreed,
  },
});

// Fill select with fetched breed values
catAPI
  .fetchBreeds()
  .then(fillSelectWithBreeds)
  .catch(processError)
  .finally(() => {
    switchLoader();
  });

// Functions to process querries
function switchLoader(value) {
  const loaderRef = document.querySelector('.loader-backdrop');
  touggleElement(loaderRef, value);
}

function touggleElement(el, value) {
  switch (value) {
    case 'on':
      el.classList.remove('is-hidden');
      break;
    case 'off':
      el.classList.add('is-hidden');
      break;
    default:
      el.classList.toggle('is-hidden');
  }
}

function fillSelectWithBreeds(breeds) {
  const data = breeds.map(breed => {
    return { value: breed.id, text: breed.name };
  });
  data.unshift({ value: 'pholder', text: '', placeholder: true });
  select.setData(data);
  touggleElement(document.getElementById('breed-container'), 'on');
}

function fetchBreed(selections) {
  const { value } = selections[0];

  if (value === 'pholder') {
    return Promise.resolve(true);
  }

  touggleElement(breedSelectRef, 'off');
  touggleElement(catInfoRef, 'off');
  switchLoader('on');

  catAPI
    .fetchByBreed(value)
    .then(renderBreed)
    .catch(processError)
    .finally(() => {
      switchLoader('off');
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

  touggleElement(breedSelectRef, 'on');
  touggleElement(catInfoEl, 'on');
}

function processError(err) {
  if (!document.getElementById('breed-container').classList.contains('is-hidden')) {
    touggleElement(breedSelectRef, 'on');
  }
  touggleElement(catInfoRef, 'off');
  Report.failure('Error', 'Something went wrong 🙄 Try reloading the page!', 'Okay');
  console.error(err);
}
