import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { imagesListMarkup } from './js/markup.js';
import { fetchImages } from './js/fetchImages.js';

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchInput: document.querySelector('[name="searchQuery"]'),
  galleryList: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
};
const { searchForm, searchInput, galleryList, loadMoreBtn } = refs;

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', loadMoreImages);

const galleryItems = [];
let currentPage = null;
let previousSearchQuery = '';

async function onSearch(e) {
  e.preventDefault();

  const searchValue = searchInput.value.trim();

  if (searchValue === '') {
    clearGallery();
    Notify.failure('Please enter a search term!');
    return;
  } else if (previousSearchQuery === searchValue) {
    return;
  }
  currentPage = 1;

  try {
    const images = await fetchImages(searchValue, currentPage);

    if (images.total === 0) {
      clearGallery();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    previousSearchQuery = searchValue;
    galleryItems.length = 0;

    images.hits.forEach(image => {
      galleryItems.push(imagesListMarkup(image));
    });
    galleryList.innerHTML = galleryItems.join('');
    loadMoreBtn.classList.remove('visually-hidden');

    var lightbox = new SimpleLightbox('.gallery a');

    Notify.success(`"Hooray! We found ${images.totalHits} images.`);

    if (images.totalHits <= currentPage * 40) {
      loadMoreBtn.classList.add('visually-hidden');
    }
  } catch {
    return Notify.failure('Oops, there is no image with that name');
  }
}

async function loadMoreImages() {
  const searchValue = searchInput.value.trim();
  currentPage += 1;

  try {
    const images = await fetchImages(searchValue, currentPage);
    images.hits.forEach(image => {
      galleryItems.push(imagesListMarkup(image));
    });
    galleryList.innerHTML = galleryItems.join('');
    loadMoreBtn.classList.remove('visually-hidden');

    var lightbox = new SimpleLightbox('.gallery a');

    if (images.totalHits <= currentPage * 40) {
      loadMoreBtn.classList.add('visually-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch {
    return Notify.failure('Oops, there is no image with that name');
  }
}

function clearGallery() {
  galleryList.innerHTML = '';
  galleryItems.length = 0;
  loadMoreBtn.classList.add('visually-hidden');
}
