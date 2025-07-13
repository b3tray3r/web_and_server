const cardGrid = document.getElementById('cardGrid');
const statsSection = document.getElementById('stats');
const addUserForm = document.getElementById('addUserForm');
const searchInput = document.getElementById('search');

import { auth } from './firebase-config.js';
  import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js';

  onAuthStateChanged(auth, user => {
    if (!user) {
      window.location.href = 'login.html'; // перенаправление на вход
    }
  });

let users = []; // сюда загрузим данные

// Показываем лоадер — добавляем класс loading к body
function showLoader() {
  document.body.classList.add('loading');
}

// Скрываем лоадер — убираем класс loading с body
function hideLoader() {
  document.body.classList.remove('loading');
}

// Получить пользователей с сервера
async function loadUsers() {
  showLoader();
  try {
    // Имитация API-запроса
    // Например, замените URL на ваш реальный API
    const response = await fetch('https://ktor-server-u2py.onrender.com');
    if (!response.ok) throw new Error('Ошибка загрузки данных');
    const data = await response.json();
    users = data;
    renderAll(users);
  } catch (error) {
    alert('Ошибка загрузки: ' + error.message);
  } finally {
    hideLoader();
  }
}

// Рендер статистики
function renderStats(users) {
  if (users.length === 0) {
    statsSection.innerHTML = '<p>Пользователи не найдены</p>';
    return;
  }

  const total = users.length;
  const males = users.filter(u => u.gender === 'male').length;
  const females = users.filter(u => u.gender === 'female').length;
  const avgAge = (users.reduce((sum, u) => sum + u.age, 0) / total).toFixed(1);

  statsSection.innerHTML = `
    <div>Всего пользователей: <b>${total}</b></div>
    <div>Мужчин: <b>${males}</b></div>
    <div>Женщин: <b>${females}</b></div>
    <div>Средний возраст: <b>${avgAge}</b></div>
  `;
}

// Создаёт DOM-элемент карточки пользователя
function createUserCard(user) {
  const div = document.createElement('div');
  div.classList.add('card');

  // Иконка в зависимости от пола
  const icon = user.gender === 'male' ? '👨' : '👩';

  div.innerHTML = `
    <div class="icon">${icon}</div>
    <div class="name">${user.name}</div>
    <div class="age">Возраст: ${user.age}</div>
    <div class="role">Роль: ${user.role}</div>
  `;

  return div;
}

// Отрисовка карточек и статистики
function renderAll(data) {
  renderStats(data);
  cardGrid.innerHTML = '';
  data.forEach(user => {
    const card = createUserCard(user);
    cardGrid.appendChild(card);
  });
}

// Обработка формы добавления пользователя
addUserForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(addUserForm);
  const newUser = {
    name: formData.get('name').trim(),
    age: Number(formData.get('age')),
    role: formData.get('role').trim(),
    gender: formData.get('gender'),
  };

  if (!newUser.name || !newUser.age || !newUser.role || !newUser.gender) {
    alert('Заполните все поля');
    return;
  }

  users.push(newUser);
  renderAll(users);
  addUserForm.reset();
});

// Поиск по имени и роли
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    renderAll(users);
    return;
  }
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query) || u.role.toLowerCase().includes(query)
  );
  renderAll(filtered);
});

// Запуск загрузки при загрузке страницы
window.addEventListener('load', () => {
  // Для демонстрации можно подменить loadUsers на локальные данные, например:
  // users = [
  //   { name: 'Иван', age: 32, role: 'Разработчик', gender: 'male' },
  //   { name: 'Мария', age: 28, role: 'Аналитик', gender: 'female' },
  // ];
  // renderAll(users);
  // hideLoader();

  loadUsers();
});
