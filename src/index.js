import './css/styles.css';
import { fetchCountries } from './fetchCountries'
import Notiflix from 'notiflix';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
const searchInput = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
searchInput.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(event) {
    event.preventDefault();
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
    const inputClearOfSpace = searchInput.value.trim();

    fetchCountries(inputClearOfSpace).then(country => {
        if (country.length > 10) {
            Notiflix.Notify.info(`Too many matches found. Please enter a more specific name.`)
        } else if (country.status === 404) {
            Notiflix.Notify.failure(`<h2 class="errorname">Oops, there is no country with that name</h2>`)
        } else if (country.length <= 10 && country.length > 1 && searchInput.value !== undefined) {
            buildListMarkup(country);
        } else if (country.length === 1 && searchInput.value !== undefined) {
            countryInfo.innerHTML = buildCountryCard(country);
        }
    }).catch(error => {
        countryList.innerHTML = '';
        countryInfo.innerHTML = '';
        return Notiflix.Notify.failure(`<h2 class="errorname">Oops, there is another one problem</h2>`)
    })
}

function buildListMarkup(countries) {
    countryInfo.innerHTML = '';
    const markup = countries.map((element) => {
        return `
        <li class="profile-small">
        <img
        src="${element.flags.svg}"
        width="80"
        height="40"
        alt="Country flag"
        class="flag"/>
        <h2 class="name-small">${element.name.official}</h2>
        </li>`})
        .join();
    countryList.insertAdjacentHTML('afterbegin', markup);

    const extraElement = countryList.childNodes;
    for (let i = 0; i < extraElement.length; i += 1) {
        if (extraElement[i].value % 2 !== 0) {
        extraElement[i].remove();
        };
    };
}

function buildCountryCard(country) {
    countryList.innerHTML = '';
    for (let i = 0; i < country.length; i += 1) {
        return `<div class="profile">
    <img
    src="${country[i].flags.svg}"
    width="160"
    height="160"
    alt="Country flag"
    class="flag"
    />
    <div class="meta">
    <h2 class="name">${country[i].name.official}</h2>
    <ul class="info">
    <li>
        Capital: ${country[i].capital}
      </li>
      <li>
        Population: ${country[i].population}
      </li>
      <li>
        Languages: ${Object.keys(country[i].languages)}
      </li>
    </ul>
  </div>
</div>`
    };
};

// -------------------------------- Alternate code (another model) -----------------------------

// import './css/styles.css';
// import { buildCountryCard } from './cards'
// import { errorCard } from './cards'
// import { fetchCountries } from './fetchCountries'
// import Notiflix from 'notiflix';

// const debounce = require('lodash.debounce');
// const DEBOUNCE_DELAY = 300;
// const searchForm = document.querySelector('.search-form');
// const countryCard = document.querySelector('.country-info');

// searchForm.addEventListener('submit', event => {
//     event.preventDefault();

//     fetchCountries(searchForm.elements.countryname.value).then(country => {
//         for (let i = 0; i < country.length; i += 1) {
//             return country[i];
//         };
//     }).then(country => {
//         countryCard.innerHTML = buildCountryCard(country);
//     }).catch(error => {
//         errorCard(error);
//     })

//     searchForm.reset();
// });