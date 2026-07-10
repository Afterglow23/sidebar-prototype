// Прототип бокового меню: активный пункт, сворачивание, меню профиля.

const sidebar = document.querySelector('.sidebar');
const collapseBtn = document.getElementById('collapseBtn');
const navItems = document.querySelectorAll('.sidebar__nav .nav-item');
const contentTitle = document.querySelector('.content h1');

// ---- Выделение активного пункта ----
navItems.forEach((item) => {
  item.addEventListener('click', (event) => {
    event.preventDefault();
    navItems.forEach((el) => el.classList.remove('is-active'));
    item.classList.add('is-active');
    contentTitle.textContent = item.querySelector('.nav-item__label').textContent;
  });
});

// ==========================================================
// Режимы отображения сайдбара
// ==========================================================
const MODE_LABEL = {
  expanded: 'Полное',
  compact: 'Компактное',
  collapsed: 'Только иконки',
};

const menuModeLabel = document.getElementById('menuModeLabel');
const options = document.querySelectorAll('.pm-option');

// Порядок состояний от развёрнутого к свёрнутому
const STATE_ORDER = ['expanded', 'compact', 'collapsed'];
let collapseDir = 1; // 1 = сворачиваем (L->M->S), -1 = разворачиваем (S->M->L)

// Шеврон: смотрит вправо, когда следующий шаг — разворот
function updateCollapseChevron(mode) {
  let dir = collapseDir;
  if (mode === 'collapsed') dir = -1;      // дальше сворачивать некуда — только разворот
  else if (mode === 'expanded') dir = 1;   // дальше разворачивать некуда — только сворачивание
  collapseBtn.classList.toggle('is-expand', dir === -1);
}

function setSidebarState(mode) {
  sidebar.setAttribute('data-state', mode);
  // Подпись в строке «Меню: …»
  if (menuModeLabel) menuModeLabel.textContent = MODE_LABEL[mode];
  // Галочка у выбранного режима в подменю
  options.forEach((opt) => {
    opt.classList.toggle('is-selected', opt.dataset.mode === mode);
  });
  updateCollapseChevron(mode);
}

// Кнопка «Свернуть»: шаг по состояниям с учётом промежуточного M (пинг-понг)
collapseBtn.addEventListener('click', () => {
  const current = sidebar.getAttribute('data-state');
  let i = STATE_ORDER.indexOf(current);
  if (i === -1) i = 0;

  // На границах задаём направление принудительно
  if (current === 'collapsed') collapseDir = -1;
  else if (current === 'expanded') collapseDir = 1;

  let next = i + collapseDir;
  if (next < 0 || next >= STATE_ORDER.length) {
    collapseDir = -collapseDir;   // развернуть направление
    next = i + collapseDir;
  }
  setSidebarState(STATE_ORDER[next]);
});

// ==========================================================
// Контекстное меню профиля
// ==========================================================
const profileBtn = document.getElementById('profileBtn');
const profileMenu = document.getElementById('profileMenu');
const pageMain = profileMenu.querySelector('[data-page="main"]');
const pageDisplay = profileMenu.querySelector('[data-page="display"]');
const pageTheme = profileMenu.querySelector('[data-page="theme"]');
const menuSettingRow = document.getElementById('menuSettingRow');
const displayBack = document.getElementById('displayBack');
const themeSettingRow = document.getElementById('themeSettingRow');
const themeBack = document.getElementById('themeBack');

function showPage(name) {
  pageMain.hidden = name !== 'main';
  pageDisplay.hidden = name !== 'display';
  pageTheme.hidden = name !== 'theme';
}

function openMenu() {
  showPage('main');
  profileMenu.hidden = false;
  profileBtn.setAttribute('aria-expanded', 'true');
}

function closeMenu() {
  profileMenu.hidden = true;
  profileBtn.setAttribute('aria-expanded', 'false');
}

profileBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  if (profileMenu.hidden) openMenu();
  else closeMenu();
});

// Переход в подменю настроек отображения
menuSettingRow.addEventListener('click', () => showPage('display'));
// Назад к основной странице
displayBack.addEventListener('click', () => showPage('main'));

// Выбор режима отображения
options.forEach((opt) => {
  opt.addEventListener('click', () => setSidebarState(opt.dataset.mode));
});

// ---- Подменю «Тема» ----
const THEME_LABEL = { light: 'Светлая', dark: 'Тёмная' };
const themeModeLabel = document.getElementById('themeModeLabel');
const themeOptions = document.querySelectorAll('.pm-theme-option');

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (themeModeLabel) themeModeLabel.textContent = THEME_LABEL[theme];
  themeOptions.forEach((opt) => {
    opt.classList.toggle('is-selected', opt.dataset.theme === theme);
  });
}

themeSettingRow.addEventListener('click', () => showPage('theme'));
themeBack.addEventListener('click', () => showPage('main'));
themeOptions.forEach((opt) => {
  opt.addEventListener('click', () => setTheme(opt.dataset.theme));
});

// Тема по умолчанию — светлая
setTheme('light');

// Клик вне меню — закрыть
document.addEventListener('click', (event) => {
  if (!profileMenu.hidden && !profileMenu.contains(event.target)) closeMenu();
});
// Esc — закрыть
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

// Инициализация: синхронизируем подпись и галочку с текущим состоянием
setSidebarState(sidebar.getAttribute('data-state') || 'expanded');
