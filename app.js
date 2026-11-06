const messageEl = document.getElementById('message');
const loadBtn = document.getElementById('load-btn');
const postsList = document.getElementById('posts-list');
const postForm = document.getElementById('post-form');
const titleInput = document.getElementById('title');
const bodyInput = document.getElementById('body');
const submitBtn = document.getElementById('submit-btn');

// Функция для отображения сообщений, пока запрос выполняется
function showMessage(text, type) {
  messageEl.textContent = text;
  messageEl.className = 'message ' + type; // 'loading', 'success', 'error'
}

function clearMessage() {
  messageEl.textContent = '';
  messageEl.className = 'message';
}

// Загрузка публикаций (GET)
async function loadPosts() {
  loadBtn.disabled = true; // Блокируем кнопку на время запроса
  showMessage('Загрузка публикаций...', 'loading');
  postsList.innerHTML = ''; // Очищаем список перед новой загрузкой

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/postz');
    
    // Проверка на успешный HTTP-ответ (response.ok)
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    const posts = await response.json();
    
    // Вывод публикаций через DOM
    posts.forEach(post => {
      const card = document.createElement('div');
      card.className = 'post-card';

      const title = document.createElement('h3');
      title.textContent = post.title;

      const body = document.createElement('p');
      body.textContent = post.body;

      card.append(title, body);
      postsList.appendChild(card);
    });

    clearMessage(); // Убираем сообщение о загрузке при успехе
  } catch (error) {
    showMessage(`Ошибка при загрузке. ${error.message}. Попробуйте еще раз.`, 'error');
  } finally {
    loadBtn.disabled = false; // Снова активируем кнопку в любом случае
  }
}

// Создание публикации (POST)
async function createPost(event) {
  event.preventDefault(); // Предотвращаем перезагрузку страницы

  // Проверка, что заголовок и текст не пустые после удаления пробелов по краям
  const title = titleInput.value.trim();
  const body = bodyInput.value.trim();

  if (!title || !body) {
    showMessage('Заголовок и текст не могут быть пустыми или состоять из пробелов.', 'error');
    return;
  }

  submitBtn.disabled = true; // Блокируем кнопку отправки
  showMessage('Отправка публикации...', 'loading');

  const postData = {
    title: title,
    body: body,
    userId: 1
  };

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    const result = await response.json();
    
    // Вывод заголовка и ID из ответа + сообщение об успехе
    showMessage(`Успех! Публикация создана. ID: ${result.id}, заголовок: "${result.title}"`, 'success');
    
    // Очистка формы
    postForm.reset();
    
    // Опционально: сразу добавляем новую публикацию в начало списка
    const card = document.createElement('div');
    card.className = 'post-card';
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = result.title;
    
    const bodyEl = document.createElement('p');
    bodyEl.textContent = result.body;
    
    card.append(titleEl, bodyEl);
    postsList.prepend(card);

  } catch (error) {
    showMessage(`Ошибка при отправке: ${error.message}. Попробуйте еще раз.`, 'error');
  } finally {
    submitBtn.disabled = false; // Снова активируем кнопку
  }
}

// Привязка обработчиков событий
loadBtn.addEventListener('click', loadPosts);
postForm.addEventListener('submit', createPost);
