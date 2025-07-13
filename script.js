// Эмуляция запроса на сервер — замени на свой URL
const API_URL = 'https://your-ktor-server/api/users';

// Получить пользователей с сервера
async function fetchUsers() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Ошибка при загрузке данных');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
    return [];
  }
}

// Создать карточку пользователя
function createCard(user) {
  const card = document.createElement('div');
  card.classList.add('card');

  // Аватар — например, иконка по полу
  const avatar = document.createElement('div');
  avatar.classList.add('avatar');
  if (user.gender === 'male') {
    avatar.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/512/147/147144.png)';
  } else if (user.gender === 'female') {
    avatar.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/512/147/147140.png)';
  } else {
    avatar.style.backgroundColor = '#666';
  }

  const name = document.createElement('h3');
  name.textContent = user.name;

  const info = document.createElement('p');
  info.textContent = `${user.role} — ${user.age} лет`;

  card.appendChild(avatar);
  card.appendChild(name);
  card.appendChild(info);

  return card;
}

// Отобразить все карточки
function renderCards(users) {
  const grid = document.getElementById('cardGrid');
  grid.innerHTML = '';

  if (users.length === 0) {
    grid.innerHTML = '<p style="color:#ccc; text-align:center; grid-column: 1 / -1;">Пользователи не найдены.</p>';
    return;
  }

  users.forEach(user => {
    grid.appendChild(createCard(user));
  });
}

// Статистика
function renderStats(users) {
  const stats = document.getElementById('stats');
  const total = users.length;
  const maleCount = users.filter(u => u.gender === 'male').length;
  const femaleCount = users.filter(u => u.gender === 'female').length;
  const averageAge = total ? Math.round(users.reduce((sum, u) => sum + u.age, 0) / total) : 0;

  stats.innerHTML = `
    <div>Всего пользователей: <strong>${total}</strong></div>
    <div>Мужчин: <strong>${maleCount}</strong></div>
    <div>Женщин: <strong>${femaleCount}</strong></div>
    <div>Средний возраст: <strong>${averageAge}</strong></div>
  `;
}

// Фильтрация по поиску
function handleSearch(users) {
  const searchInput = document.getElementById('search');

  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
    renderCards(filtered);
  });
}

// Добавление пользователя (только локально, чтобы увидеть работу формы)
function handleAddUser(users) {
  const form = document.getElementById('addUserForm');
  form.addEventListener('submit', e => {
    e.preventDefault();

    const formData = new FormData(form);
    const newUser = {
      name: formData.get('name').trim(),
      age: Number(formData.get('age')),
      role: formData.get('role').trim(),
      gender: formData.get('gender'),
    };

    if (!newUser.name || !newUser.age || !newUser.role || !newUser.gender) return;

    // Добавляем пользователя в список и обновляем отображение
    users.push(newUser);
    renderCards(users);
    renderStats(users);
    form.reset();
  });
}

// Инициализация
async function init() {
  const loader = document.getElementById('loader');
  const content = document.getElementById('content');

  // Показать loader, скрыть контент
  loader.style.display = 'flex';
  content.style.display = 'none';

  // Загрузка данных
  let users = await fetchUsers();

  // Скрыть loader, показать контент
  loader.style.display = 'none';
  content.style.display = 'block';

  renderCards(users);
  renderStats(users);
  handleSearch(users);
  handleAddUser(users);
}

init();
