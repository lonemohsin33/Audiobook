// store.ts
let global_content_list = [];

export const setContentList = (list) => {
  global_content_list = [...list];
};

export const getContentList = () => global_content_list;

export const pushToContentList = (item) => {
  global_content_list.push(item);
};