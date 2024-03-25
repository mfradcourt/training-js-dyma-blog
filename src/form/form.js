import '../assets/styles/styles.scss';
import './form.scss';

const form = document.querySelector('form');
const errorElement = document.querySelector('#errors');
const btnCancel = document.querySelector('.btn-secondary');

let errors = [];
let articleId;
const fillForm = (article) => {
  const author = document.querySelector('input[name="author"]');
  const img = document.querySelector('input[name="img"]');
  const category = document.querySelector('input[name="category"]');
  const title = document.querySelector('input[name="title"]');
  const content = document.querySelector('textarea[name="content"]');

  author.value = article.author || '';
  img.value = article.img || '';
  category.value = article.category || '';
  title.value = article.title || '';
  content.value = article.content || '';
}

const initForm = async () => {
  articleId = (new URL(location.href)).searchParams.get('articleId');

  if (articleId) {
    const response = await fetch(`https://restapi.fr/api/fgh45_articles/${articleId}`);
    if (response.status < 300) {
      const article = await response.json();
      fillForm(article);
    }
  }
}

initForm();
btnCancel.addEventListener('click', () => {});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const article  = Object.fromEntries(formData.entries());

  if (formIsValid(article)) {
    try {
      const json = JSON.stringify(article);
      let response;
      if (articleId) {
        response = await fetch(`https://restapi.fr/api/fgh45_articles/${articleId}`, {
          method: 'PATCH',
          body: json,
          headers: {
            'Content-Type' : 'application/json'
          }
        });
      } else {
        response = await fetch('https://restapi.fr/api/fgh45_articles', {
          method: 'POST',
          body: json,
          headers: {
            'Content-Type' : 'application/json'
          }
        });
      }


      if (response.status < 300) {
        location.assign('/index.html');
      }
    } catch (e) {
      console.error('e : ', e);
    }
  }
});

const formIsValid = (article) => {
  errors = [];
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