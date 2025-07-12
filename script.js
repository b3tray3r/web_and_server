const apiUrl = 'https://your-tunnel-subdomain.loca.lt/data'; // замени на свой

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

function renderCards(users) {
  const grid = document.getElementById('cardGrid');
  grid.innerHTML = '';
  users.forEach(user => grid.appendChild(createUserCard(user)));
}

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

fetchUsers().then(users => {
  renderCards(users);
  handleSearch(users);
});
