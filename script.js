// --- НАСТРОЙКИ ---
const API_URL = 'https://ktor-server-u2py.onrender.com'; // Поменяй на реальный API

// Получаем элементы
const loader = document.getElementById('loader');
const content = document.getElementById('content');
const cardGrid = document.getElementById('cardGrid');
const stats = document.getElementById('stats');
const searchInput = document.getElementById('search');
const addUserForm = document.getElementById('addUserForm');

let users = [];

// Функция показа лоадера
function showLoader() {
  document.body.classList.add('loading');
}

// Функция скрытия лоадера
function hideLoader() {
  document.body.classList.remove('loading');
}

// Функция загрузки данных с сервера
async function fetchUsers() {
  showLoader();
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Ошибка загрузки данных');
    users = await res.json();
    renderUsers(users);
    renderStats(users);
  } catch (e) {
    alert('Ошибка при загрузке пользователей: ' + e.message);
  } finally {
    hideLoader();
  }
}

// Функция отрисовки пользователей
function renderUsers(usersToRender) {
  cardGrid.innerHTML = '';
  if (usersToRender.length === 0) {
    cardGrid.innerHTML = '<p style="text-align:center; width: 100%;">Пользователи не найдены</p>';
    return;
  }
  usersToRender.forEach(user => {
    const card = document.createElement('div');
    card.className = 'card';

    const icon = document.createElement('div');
    icon.className = 'icon';
    icon.textContent = user.gender === 'female' ? '♀' : '♂';

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = user.name;

    const age = document.createElement('div');
    age.className = 'age';
    age.textContent = `Возраст: ${user.age}`;

    const role = document.createElement('div');
    role.className = 'role';
    role.textContent = `Роль: ${user.role}`;

    card.append(icon, name, age, role);
    cardGrid.appendChild(card);
  });
}

// Функция отрисовки статистики
function renderStats(usersList) {
  const total = usersList.length;
  const males = usersList.filter(u => u.gender === 'male').length;
  const females = usersList.filter(u => u.gender === 'female').length;
  const avgAge = (usersList.reduce((sum, u) => sum + u.age, 0) / total).toFixed(1);

  stats.innerHTML = `
    <div>Всего пользователей: <strong>${total}</strong></div>
    <div>Мужчин: <strong>${males}</strong></div>
    <div>Женщин: <strong>${females}</strong></div>
    <div>Средний возраст: <strong>${avgAge}</strong></div>
  `;
}

// Функция фильтрации пользователей по поиску
function filterUsers() {
  const query = searchInput.value.toLowerCase();
  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query) ||
    u.role.toLowerCase().includes(query)
  );
  renderUsers(filtered);
  renderStats(filtered);
}

// Обработка формы добавления пользователя
addUserForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(addUserForm);
  const newUser = {
    name: formData.get('name').trim(),
    age: Number(formData.get('age')),
    role: formData.get('role').trim(),
    gender: formData.get('gender')
  };

  if (!newUser.name || !newUser.role || !newUser.gender || !newUser.age) {
    alert('Заполните все поля правильно!');
    return;
  }

  try {
    // Отправляем на сервер
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });

    if (!res.ok) throw new Error('Ошибка добавления пользователя');

    // Получаем обновленный список или добавляем локально
    const addedUser = await res.json();
    users.push(addedUser);

    // Обновляем отображение
    filterUsers();

    // Очищаем форму
    addUserForm.reset();
  } catch (e) {
    alert('Ошибка при добавлении пользователя: ' + e.message);
  }
});

// Поиск
searchInput.addEventListener('input', filterUsers);

// При загрузке страницы
window.addEventListener('load', () => {
  fetchUsers();
});
