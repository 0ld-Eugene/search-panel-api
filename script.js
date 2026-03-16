const galleryContainer = document.querySelector('#gallery-container');
window.onload = () => {
   const savedSearch = localStorage.getItem('lastSearch');
   if (savedSearch) {
      searchInput.value = savedSearch; // Подставляем в инпут
      getPhotos(savedSearch); // Сразу загружаем фото
   }
};

async function getPhotos(query = 'pop') {

   try {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&per_page=20&client_id=cHZwfh4KxU4_CRnsDDftgzrmXJg-yQwXnF_ALdtC0_I`)
      const data = await response.json();

      if (data.results.length === 0) {
         galleryContainer.innerHTML = 'По вашему запросу ничего не найдено';
         return; // Выходим из функции, чтобы не запускать отрисовку пустых данных
      }

      if (!response.ok) throw new Error("Сервер недоступен");

      let cardContent = '';
      data.results.forEach(item => {
         const userName = item.user.name.toLowerCase();
         cardContent += `
      <div class="gallery-card">
         <div class="gallery-card__name">${userName}</div>
         <div class="gallery-card__image-box">
            <img class="gallery-card__img" src="${item.urls.regular}" alt="${item.description}">
         </div>
      </div>
      `;
      });
      galleryContainer.innerHTML = cardContent;
      gsap.from(".gallery-card", {
         duration: 1,      // Длительность анимации каждой карточки
         opacity: 0,
         y: 100,           // Вылетают снизу (смещаем на 100px вниз)
         stagger: 0.2,     // Задержка между появлением каждой следующей карточки
         ease: "power4.out" // Плавное замедление в конце
      });
      localStorage.setItem('lastSearch', query);

   } catch (error) {
      console.log("Ошибка загрузки сервера: ", error);
   }
}

const searchInput = document.querySelector('#search-input');
const searchBtn = document.querySelector('#search-btn');

searchBtn.addEventListener('click', () => {
   const userQuery = searchInput.value;
   if (userQuery !== "") {
      getPhotos(userQuery);
   }
});

searchInput.addEventListener('keydown', (e) => {
   const userQuery = searchInput.value;
   if (e.key === "Enter") {
      if (userQuery !== "") {
         getPhotos(userQuery)
      }
   }
});

let lastScroll = 0;
const searchPanel = document.querySelector('.search-panel');
window.addEventListener('scroll', () => {
   const currentScroll = window.pageYOffset;

   if (currentScroll > lastScroll && currentScroll > 250) {
      searchPanel.classList.add('search-panel--hidden');
   } else {
      searchPanel.classList.remove('search-panel--hidden');
   }
   lastScroll = currentScroll;
});

const buttons = document.querySelectorAll('.search-panel__tag-btn');
const tagsList = document.querySelector('.search-panel__tags-list');
tagsList.addEventListener('click', (e) => {
   const currentBtn = e.target.closest('.search-panel__tag-btn');

   if (!currentBtn) return;
   buttons.forEach(btn => btn.classList.remove('is-active'));
   currentBtn.classList.add('is-active');

   // 2. Логика поиска
   const userQuery = currentBtn.dataset.query;
   if (userQuery) {
      searchInput.value = ''; // Очищаем инпут для порядка
      getPhotos(userQuery);
   }
});

getPhotos();