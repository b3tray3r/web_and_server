const apiUrl = 'https://serverktor.loca.lt/';

// Получить всех пользователей
async function fetchUsers() {
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("Ошибка загрузки данных");
    return await res.json();
  } catch (e) {
    console.error(e);
    alert("Не удалось загрузить данные.");
    return [];
  }
}

// Создать карточку пользователя
function createUserCard(user) {
  const card = document.createElement('div');
  card.className = 'card';

  const icon = document.createElement('div');
  icon.className = 'profile-icon';
  icon.textContent = user.gender === 'male' ? '👨' : '👩';

  const name = document.createElement('h3');
  name.textContent = user.name;

  const role = document.createElement('p');
  role.textContent = `Роль: ${user.role}`;

  const age = document.createElement('p');
  age.textContent = `Возраст: ${user.age}`;

  card.appendChild(icon);
  card.appendChild(name);
  card.appendChild(role);
  card.appendChild(age);

  return card;
}

// Отрисовать всех пользователей
function renderCards(users) {
  const grid = document.getElementById('cardGrid');
  grid.innerHTML = '';
  users.forEach(user => {
    const card = createUserCard(user);
    grid.appendChild(card);
  });
}

// Отрисовать статистику
function renderStats(users) {
  const statsDiv = document.getElementById('stats');
  if (!users.length) {
    statsDiv.textContent = 'Пользователей нет';
    return;
  }

  const totalUsers = users.length;
  const avgAge = Math.round(users.reduce((sum, u) => sum + u.age, 0) / totalUsers);

  // Распределение по ролям
  const rolesCount = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});

  let rolesHTML = '';
  for (const [role, count] of Object.entries(rolesCount)) {
    rolesHTML += `<div><strong>${role}:</strong> ${count}</div>`;
  }

  statsDiv.innerHTML = `
    <div><strong>Всего пользователей:</strong> ${totalUsers}</div>
    <div><strong>Средний возраст:</strong> ${avgAge}</div>
    ${rolesHTML}
  `;
}

// Поиск по имени и роли
function handleSearch(users) {
  const input = document.getElementById('search');
  input.addEventListener('input', () => {
    const searchTerm = input.value.toLowerCase();
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm) ||
      user.role.toLowerCase().includes(searchTerm)
    );
    renderCards(filtered);
  });
}

// Отправка нового пользователя на сервер
async function addUser(data) {
  try {
    const res = await fetch(`${apiUrl}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Ошибка при добавлении пользователя');
    return await res.json();
  } catch (e) {
    console.error(e);
    alert('Не удалось добавить пользователя');
  }
}

// Инициализация
async function init() {
  let users = await fetchUsers();
  renderCards(users);
  renderStats(users);
  handleSearch(users);

  // Обработка формы добавления пользователя
  const form = document.getElementById('addUserForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const newUser = {
      name: formData.get('name').trim(),
      age: Number(formData.get('age')),
      role: formData.get('role').trim(),
      gender: formData.get('gender'),
    };

    if (!newUser.name || !newUser.role || !newUser.gender || !newUser.age) {
      alert('Пожалуйста, заполните все поля корректно');
      return;
    }

    const addedUser = await addUser(newUser);
    if (addedUser) {
      users.push(addedUser);
      renderCards(users);
      renderStats(users);
      form.reset();
    }
  });
}

init();
