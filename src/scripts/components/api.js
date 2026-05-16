const apiRestCfgEx = {
  baseUrl: "https://mesto.nomoreparties.co/v1/apf-cohort-203",
  headers: {
    authorization: "89d81260-9a78-43b4-b12f-9d21cec1be1d",
    "Content-Type": "application/json",
  },
};

/* Проверяем, успешно ли выполнен запрос, и отклоняем промис в случае ошибки. */
const unwrapFetchJsonEx = (res) => {
  return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
};

export const getUserInfoEx = () => {
  return fetch(`${apiRestCfgEx.baseUrl}/users/me`, { // Запрос к API-серверу
    headers: apiRestCfgEx.headers, // Подставляем заголовки
  }).then(unwrapFetchJsonEx);  // Проверяем успешность выполнения запроса
};

export const getCardListEx = () => {
    return fetch(`${apiRestCfgEx.baseUrl}/cards`, { // Запрос к API-серверу
    headers: apiRestCfgEx.headers, // Подставляем заголовки
  }).then(unwrapFetchJsonEx);  // Проверяем успешность выполнения запроса
};

export const setUserInfoEx = ({ name, about }) => {
  return fetch(`${apiRestCfgEx.baseUrl}/users/me`, {
    method: "PATCH",
    headers: apiRestCfgEx.headers,
    body: JSON.stringify({
      name,
      about,
    }),
  }).then(unwrapFetchJsonEx);
};

export const setUserAvatarEx = ({ avatar }) => {
  return fetch(`${apiRestCfgEx.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: apiRestCfgEx.headers,
    body: JSON.stringify({
      avatar,
    }),
  }).then(unwrapFetchJsonEx);
};

export const addNewCardEx = ({ name, link }) => {
  return fetch(`${apiRestCfgEx.baseUrl}/cards`, {
    method: "POST",
    headers: apiRestCfgEx.headers,
    body: JSON.stringify({
        name,
        link
    }),
  }).then(unwrapFetchJsonEx);
};

export const deleteCardApiEx = ({cardId}) => {
    return fetch(
      `${apiRestCfgEx.baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: apiRestCfgEx.headers,
    })
    .then(unwrapFetchJsonEx)
};

export const changeLikeCardStatusEx = (cardID, isLiked) => {
  return fetch(`${apiRestCfgEx.baseUrl}/cards/likes/${cardID}`, {
    method: isLiked ?  "DELETE" : "PUT",
    headers: apiRestCfgEx.headers,
  }).then((res) => unwrapFetchJsonEx(res));
};
