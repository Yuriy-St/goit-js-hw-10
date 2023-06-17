'use strict';

import CatAPI from './cat-api';
import SlimSelect from 'slim-select';
import 'slim-select/dist/slimselect.css';
import '../css/index.css';

import { Report } from 'notiflix';

const catAPI = new CatAPI();

const loaderEl = document.querySelector('.loader-backdrop');
const breedSelectEl = document.querySelector('.breed-select');
const catInfoEl = document.querySelector('.cat-info');

touggleIsHidden(breedSelectEl);
touggleIsHidden(catInfoEl);

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
    touggleLoader();
  });

// Functions to process querries
function touggleLoader() {
  loaderEl.classList.toggle('is-hidden');
}

function touggleIsHidden(el, isError = false) {
  const classList = el.classList;
  const isHidden = 'is-hidden';

  if (isError) {
    classList.add(isHidden);
    return;
  } else if (classList.contains(isHidden)) {
    classList.remove(isHidden);
    return;
  }

  classList.add(isHidden);
}

function fillSelectWithBreeds(breeds) {
  const data = breeds.map(breed => {
    return { value: breed.id, text: breed.name };
  });
  data.unshift({ value: 'pholder', text: '', placeholder: true });
  select.setData(data);
  touggleIsHidden(breedSelectEl);
}

function fetchBreed(selections) {
  const { value } = selections[0];

  if (value === 'pholder') {
    return Promise.resolve(true);
  }

  syncBreedContainerVisibility();
  touggleIsHidden(breedSelectEl);
  touggleIsHidden(catInfoEl);
  touggleLoader();
  catAPI
    .fetchByBreed(value)
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

  touggleIsHidden(breedSelectEl);
  touggleIsHidden(catInfoEl);
}

function syncBreedContainerVisibility() {
  if (!breedSelectEl.classList.contains('is-hidden') & catInfoEl.classList.contains('is-hidden')) {
    catInfoEl.classList.remove('is-hidden');
  }
}

function processError(err) {
  touggleIsHidden(breedSelectEl, true);
  touggleIsHidden(catInfoEl, true);
  Report.failure('Error', 'Something went wrong 🙄 Try reloading the page!', 'Okay');
  console.error(err);
}
