const BASE_URL = "http://localhost:3000";

export const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(`${BASE_URL}/file/upload`, {
    method: "POST",
    body: formData,
  });
  return response.json();
};

export const getAudio = async (page: number) => {
  const response = await fetch(`${BASE_URL}/page/audio/${page}`);
  return response.json();
};

export const getContent = async (page: number) => {
  const response = await fetch(`${BASE_URL}/page/${page}`);  
  return response.json();
};

export const getContentList = async () => {
  const response = await fetch(`${BASE_URL}/pages`);
  return response.json();
};

export const get_all_books = async () => {
  const response = await fetch(`${BASE_URL}/books`);
  return response.json();
};

export const get_book_by_id = async (id: string) => {
  const response = await fetch(`${BASE_URL}/books/${id}`);
  return response.json();
};

export const get_book_page = async (id: string, page: number) => {
  const response = await fetch(`${BASE_URL}/books/${id}/pages/${page}`);
  return response.json();
};

export const getBookAudioUrl = (id: string, page: number) =>
  `${BASE_URL}/books/${id}/audio/${page}`;