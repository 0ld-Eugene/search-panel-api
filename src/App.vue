<script setup>
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  const tags = ref (['Landscape', 'Flowers', 'Musical']);
  const searchQuery = ref('');
  const activeTag = ref('Landscape');
  const photos = ref([]);
  const isLoading = ref(false);

const search = async (query) => {
  if(!query) return;

  isLoading.value = true;
  activeTag.value = query;

  const apiKey = import.meta.env.VITE_ACCESS_KEY;
  const url = `https://api.unsplash.com/search/photos?query=${query}&per_page=20&client_id=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    photos.value = data.results;
    console.log("Успех! В массиве photos теперь столько элементов:", photos.value.length);
  } catch(error) {
    console.log("Произошла ошибка при запросе:", error);
  } finally {
    isLoading.value = false;
  }
}
onMounted(() => {
  search(activeTag.value)
})
</script>

<template>
  <div class="wrapper">
    <main class="main">
      <div class="container">
        <section class="search-panel">
          <div class="search-panel__input-group">
            <input 
            v-model="searchQuery"
            @keydown.enter="search(searchQuery)"
            type="text" id="search-input" 
            class="search-panel__input" 
            placeholder="Search images, art, nature">
            <button 
            @click="search(searchQuery)"
            type="button" 
            id="search-btn" 
            class="search-panel__button">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                fill="currentColor">
                <path
                  d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
              </svg>
            </button>
          </div>
          <div class="search-panel__tags-list">
            <button 
            v-for="tag in tags" 
            :key="tag"
            class="search-panel__tag-btn tag-btn"
            :class="{'is-active': activeTag === tag }"
            @click="activeTag = tag; search(tag)"
            type="button">
              {{tag}}
            </button>
          </div>
        </section>
        <div id="gallery-container">
          <div v-for="photo in photos" :key="photo.id" class="gallery-card">
            <div class="gallery-card__image-box">
              <img 
              :src="photo.urls.regular"
              :alt="photo.alt_description"
              class="gallery-card__img"
              loading="lazy"
              @load="(event) => event.target.classList.add('is-loaded')">
            </div>
            <div class="gallery-card__name">
              {{ photo.user.name }}
            </div>
          </div>
        </div>
      </div>
    </main>


  </div>
</template>

<style>
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  ul,
  li {
    list-style: none;
  }

  body {
    font-family: "Inter";
    font-weight: 400;
    font-size: 20px;
    -webkit-font-smoothing: antialiased;
    /* Делает шрифт более гладким на Mac/iOS */
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  .wrapper {
    display: flex;

  }

  .wrapper::before {
    content: "";
    position: fixed;
    /* Фиксируем его */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    /* Уводим на самый задний план */

    background: linear-gradient(-45deg, #1a0b16, #4a148c, #8e24aa, #d81b60);
    background-size: 200% 200%;
    animation: gradientBG 15s ease infinite;
  }

  @keyframes gradientBG {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

  .main {
    flex-grow: 1;

  }

  .container {
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 15px;
    position: relative;
  }

  img,
  picture {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  /* Убираем стандартный белый фон при автозаполнении */
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
    -webkit-text-fill-color: #ffffff !important;
    transition: background-color 5000s ease-in-out 0s;
  }

  /* ------------------ */

  .search-panel {
    position: fixed;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 1200px;
    z-index: 1000;
    opacity: 1;
    transition: transform 0.4s ease, opacity 0.4s ease;

    display: flex;
    flex-direction: column;
    gap: 20px;

    background-color: #0a0a0bde;
    /* Глубокий антрацит */
    border: 1px solid rgba(255, 255, 255, 0.05);
    /* Едва заметная рамка */
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    /* Если под панелью будет проплывать фон, это даст глубину */
    padding: 20px;
    border-radius: 15px;
  }

  .search-panel--hidden {
    transform: translateX(-50%) translateY(-200%);
    opacity: 0;
    pointer-events: none;
  }

  .search-panel__input-group {
    width: 100%;
    display: flex;
    gap: 10px;
    position: relative;
  }

  .search-panel__input {
    width: 100%;

    background-color: transparent;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 12px 20px;
    font-size: 14px;
    transition: all 0.3s ease;
    outline: none;
    letter-spacing: 0.5px;
  }

  .search-panel__input:hover {
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.02);
  }

  .search-panel__input:focus {
    border-color: #8e24aa;
    /* Твой аметистовый цвет из фона */
    background: rgba(139, 36, 170, 0.05);
    /* Очень слабый фиолетовый оттенок внутри */
    box-shadow: 0 0 15px rgba(142, 36, 170, 0.2);
    /* Мягкое неоновое свечение */
  }

  .search-panel__button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background-color: transparent;
    border: none;
  }

  .search-panel__button svg {
    transform: scaleX(-1);
    cursor: pointer;
    color: rgba(255, 255, 255, 0.2);
    transition: color 0.3s ease;
  }

  .search-panel__button svg:hover {
    color: rgba(255, 255, 255, 0.5);
  }

  .search-panel__tags-list {
    display: flex;
    gap: 20px;
  }

  .search-panel__tag-btn {
    padding: 10px;
    background-color: transparent;
    color: #fff;
    border: none;
    border-radius: 18px;
    font-size: 14px;

    border: 1px solid rgba(255, 255, 255, 0.1);

    color: rgba(255, 255, 255, 0.671);
    padding: 12px 16px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    font-weight: 500;
  }

  .search-panel__tag-btn:hover {
    background-color: #1a1a1c;
    /* Чуть светлее твоей карбоновой панели */
    color: #fff;
    /* Текст становится чисто белым */
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-1px);
    /* Легкий подъем вверх на 1 пиксель */
  }

  .search-panel__tag-btn:active {
    background-color: #050506;
    /* Становится темнее основного фона (эффект ямки) */
    transform: translateY(1px) scale(0.96);
    /* Кнопка уходит вниз и чуть уменьшается */
    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.5);
    /* Внутренняя тень для глубины */
  }

  .search-panel__tag-btn.is-active {
    /* background-color: #8e24aa; */
    background: linear-gradient(-45deg, #4a148c, #8e24aa);
    /* Твой фирменный фиолетовый */
    border-color: #b346c1;
    color: #fff;
    box-shadow: 0 0 15px rgba(142, 36, 170, 0.4);
  }

  #gallery-container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    padding: 230px 0;
  }

  .gallery-card {
    aspect-ratio: 3 / 4.5;
    position: relative;
    border-radius: 20px;
    overflow: hidden;
  }

  .gallery-card:nth-child(1) {
    aspect-ratio: 3 / 4;
  }

  .gallery-card:nth-child(4n) {
    aspect-ratio: 4 / 5;
  }

  .gallery-card:nth-child(3n) {
    aspect-ratio: 3 / 4;
  }

  .gallery-card__name {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
    width: 90%;
    border-radius: 10px;
    padding: 10px;
    font-weight: 300;
    font-size: 16px;
    letter-spacing: 1.1px;
    text-transform: capitalize;

    background-color: #201d1d8e;
    color: #fff;
    z-index: 20;
  }

  .gallery-card:hover .gallery-card__name {
    opacity: 1;
    transform: translateX(-50%);
  }

  .gallery-card__image-box {
    height: 100%;
  }

  .gallery-card__img {
    opacity: 0;
    transition: transform 0.3s ease, opacity 0.5s ease-in-out;
  }
  .gallery-card__img.is-loaded {
    opacity: 1;
  }

  .gallery-card:hover .gallery-card__img {
    transform: scale(1.1);
  }

  @media (max-width: 860px) {
    #gallery-container {
      grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
      gap: 30px;
      padding: 200px 0;
    }

    .search-panel {
      top: 20px;
    }

    .gallery-card__name {
      font-size: 14px;
    }
  }

  @media (max-width: 660px) {
    #gallery-container {
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 20px;
    }
  }

  @media (max-width: 620px) {
    .search-panel__tags-list {
      gap: 10px;
    }

    .search-panel__tag-btn {
      padding: 8px 10px;
      border-radius: 14px;
      font-size: 12px;
    }

    .search-panel__input {
      padding: 10px 15px;
      font-size: 12px;
    }

    .search-panel__button svg {
      height: 20px;
    }

    .search-panel__tag-btn {
      letter-spacing: 1.1px;
      border-radius: 12px;
    }
  }
</style>