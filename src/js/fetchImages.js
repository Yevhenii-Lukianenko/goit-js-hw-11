import axios from 'axios';

export async function fetchImages(name, currentPage) {
  const response = await axios.get(`https://pixabay.com/api/`, {
    params: {
      key: '34675961-3292246094f20b380874b474f',
      q: `${name}`,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true,',
      page: `${currentPage}`,
      per_page: '40',
    },
  });
  return response.data;
}
