import '../assets/styles/styles.scss';
import './form.scss';

const form = document.querySelector('form');
const errorElement = document.querySelector('#errors');
let errors = [];

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const article  = Object.fromEntries(formData.entries());

  if (formIsValid(article)) {
    try {
      const json = JSON.stringify(article);
      const response = await fetch('https://restapi.fr/api/fgh45_articles', {
        method: 'POST',
        body: json,
        headers: {
          'Content-Type' : 'application/json'
        }
      });
    } catch (e) {
      console.error('e : ', e);
    }
  }
});

const formIsValid = (article) => {
  if (!article.author || !article.category || !article.content || !article.img || !article.title) {
    errors.push('Vous devez renseigner tous les champs');
  } else {
    errors = [];
  }

  if (errors.length) {
    errorElement.innerHTML = errors.reduce((acc, value) => {
      return acc + `<li>${ value }</li>`
    }, '');

    return false;
  } else {
    errorElement.innerHTML = '';

    return true;
  }
}