/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { getCardListEx, getUserInfoEx, setUserAvatarEx, setUserInfoEx, addNewCardEx, deleteCardApiEx, changeLikeCardStatusEx } from "./components/api.js";
import { buildCardDomEx } from "./components/card.js";
import { openPopModalEx, closePopModalEx, bindPopCloseHandlersEx } from "./components/modal.js";
import { enableValidFormsEx, clearValidStateEx } from "./components/validation.js";

// DOM узлы
let savedUserIdEx;

const listPlacesEx = document.querySelector(".places__list");
const popProfileEditEx = document.querySelector(".popup_type_edit");
const formProfileEx = popProfileEditEx.querySelector(".popup__form");
const inputProfileNameEx = formProfileEx.querySelector(".popup__input_type_name");
const inputProfileAboutEx = formProfileEx.querySelector(".popup__input_type_description");

const popNewCardEx = document.querySelector(".popup_type_new-card");
const formNewCardEx = popNewCardEx.querySelector(".popup__form");
const inputCardNameEx = formNewCardEx.querySelector(".popup__input_type_card-name");
const inputCardLinkEx = formNewCardEx.querySelector(".popup__input_type_url");

const popImageEx = document.querySelector(".popup_type_image");
const elImagePreviewEx = popImageEx.querySelector(".popup__image");
const capImagePreviewEx = popImageEx.querySelector(".popup__caption");

const btnOpenProfileEx = document.querySelector(".profile__edit-button");
const btnOpenCardEx = document.querySelector(".profile__add-button");

const elProfileTitleEx = document.querySelector(".profile__title");
const elProfileAboutEx = document.querySelector(".profile__description");
const elProfileAvatarEx = document.querySelector(".profile__image");

const popAvatarEx = document.querySelector(".popup_type_edit-avatar");
const formAvatarEx = popAvatarEx.querySelector(".popup__form");
const inputAvatarEx = formAvatarEx.querySelector(".popup__input");

const popCardInfoEx = document.querySelector(".popup_type_info");
const titleCardInfoEx = popCardInfoEx.querySelector(".popup__title");
const listCardInfoDlEx = popCardInfoEx.querySelector(".popup__info");
const textCardInfoEx = popCardInfoEx.querySelector(".popup__text");
const listCardInfoUlEx = popCardInfoEx.querySelector(".popup__list");

const elHeaderLogoEx = document.querySelector(".header__logo")

const onPreviewPicEx = ({ name, link }) => {
  elImagePreviewEx.src = link;
  elImagePreviewEx.alt = name;
  capImagePreviewEx.textContent = name;
  openPopModalEx(popImageEx);
};

const onSubmitProfileEx = (evt) => {
  evt.preventDefault();

  const submitButton = formProfileEx.querySelector('.popup__button');
  const btnLabelOrigEx = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';


  setUserInfoEx({
    name: inputProfileNameEx.value,
    about: inputProfileAboutEx.value,
  })
    .then((userPayloadEx) => {
      elProfileTitleEx.textContent = userPayloadEx.name;
      elProfileAboutEx.textContent = userPayloadEx.about;
      closePopModalEx(popProfileEditEx);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = btnLabelOrigEx;
    });
};

const onSubmitAvatarEx = (evt) => {
  evt.preventDefault();

  const submitButton = formAvatarEx.querySelector('.popup__button');
  const btnLabelOrigEx = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';


  setUserAvatarEx({
    avatar: inputAvatarEx.value
  })
    .then((userPayloadEx) => {
      elProfileAvatarEx.style.backgroundImage = `url(${userPayloadEx.avatar})`;
      closePopModalEx(popAvatarEx);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = btnLabelOrigEx;
    });
};

const onSubmitNewCardEx = (evt) => {
  evt.preventDefault();

  const submitButton = formNewCardEx.querySelector('.popup__button');
  const btnLabelOrigEx = submitButton.textContent;
  submitButton.textContent = 'Создание...';

  addNewCardEx(
    {
      name: inputCardNameEx.value,
      link: inputCardLinkEx.value 
  })
  .then((cardData) => {
      listPlacesEx.prepend(
        buildCardDomEx(
          cardData,
          {
            onPreviewPicEx: onPreviewPicEx,
            onLikeBtnEx: onLikeToggleEx,
            onCardRemoveEx: onDeleteCardEx,
            onCardInfoEx: onCardInfoOpenEx
          }, savedUserIdEx
        )
      );
      closePopModalEx(popNewCardEx);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = btnLabelOrigEx;
    });
};

const validRulesEx = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidFormsEx(validRulesEx);

// EventListeners
formProfileEx.addEventListener("submit", onSubmitProfileEx);
formNewCardEx.addEventListener("submit", onSubmitNewCardEx);
formAvatarEx.addEventListener("submit", onSubmitAvatarEx);

btnOpenProfileEx.addEventListener("click", () => {
  inputProfileNameEx.value = elProfileTitleEx.textContent;
  inputProfileAboutEx.value = elProfileAboutEx.textContent;
  clearValidStateEx(validRulesEx, popProfileEditEx);
  openPopModalEx(popProfileEditEx);
});

elProfileAvatarEx.addEventListener("click", () => {
  formAvatarEx.reset();
  clearValidStateEx(validRulesEx, popAvatarEx);
  openPopModalEx(popAvatarEx);
});

btnOpenCardEx.addEventListener("click", () => {
  formNewCardEx.reset();
  clearValidStateEx(validRulesEx, popNewCardEx);
  openPopModalEx(popNewCardEx);
});

//настраиваем обработчики закрытия попапов
const nodeListPopusEx = document.querySelectorAll(".popup");
nodeListPopusEx.forEach((popup) => {
  bindPopCloseHandlersEx(popup);
});

Promise.all([getCardListEx(), getUserInfoEx()])
  .then(([cards, userPayloadEx]) => {
      savedUserIdEx = userPayloadEx._id;
      cards.forEach((data) => {
        listPlacesEx.append(
          buildCardDomEx(data, {
            onPreviewPicEx: onPreviewPicEx,
            onLikeBtnEx: onLikeToggleEx,
            onCardRemoveEx: onDeleteCardEx,
            onCardInfoEx: onCardInfoOpenEx
          }, userPayloadEx._id) 
        );
      }); 
      elProfileTitleEx.textContent = userPayloadEx.name;
      elProfileAboutEx.textContent = userPayloadEx.about;
      elProfileAvatarEx.style.backgroundImage = `url(${userPayloadEx.avatar})`; 
    })
  .catch((err) => {
    console.log(err); // В случае возникновения ошибки выводим её в консоль
  });

const onDeleteCardEx = (cardID, cardElement) => {
  console.log(cardID);
  deleteCardApiEx({cardId: cardID})
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};

const onLikeToggleEx = (cardID, cardElement, likeButton) => {
  const isLikedEx = likeButton.classList.contains("card__like-button_is-active");
  
  changeLikeCardStatusEx(cardID, isLikedEx)
    .then((cardData) => {
      likeButton.classList.toggle("card__like-button_is-active");
      cardElement.querySelector(".card__like-count").textContent = cardData.likes.length;
    })
    .catch((err) => {
      console.log(err);
    });
};

const formatDateRuEx = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
});

const mkInfoRowEx = (term, description) => {
  const tplDefEx = document.getElementById("popup-info-definition-template");
  const infoItem = tplDefEx.content.cloneNode(true);
  infoItem.querySelector(".popup__info-term").textContent = term;
  infoItem.querySelector(".popup__info-description").textContent = description;
  return infoItem;
};
  
const onCardInfoOpenEx = (cardId) => {
  /* Для вывода корректной информации необходимо получить актуальные данные с сервера. */
  getCardListEx()
    .then((cards) => {
      const cardData = cards.find(card => card._id === cardId);
      if (!cardData) return;
      
      titleCardInfoEx.textContent = "";
      listCardInfoDlEx.innerHTML = "";
      textCardInfoEx.textContent = "";
      listCardInfoUlEx.innerHTML = "";
      
      titleCardInfoEx.textContent = "Информация о карточке";
      
      listCardInfoDlEx.append(
        mkInfoRowEx("Описание:", cardData.name)
      );

      listCardInfoDlEx.append(
        mkInfoRowEx(
          "Дата создания:",
          formatDateRuEx(new Date(cardData.createdAt))
        )
      );

      listCardInfoDlEx.append(
        mkInfoRowEx("Владелец:", cardData.owner.name)
      );
      
      listCardInfoDlEx.append(
        mkInfoRowEx("Количество лайков:", cardData.likes.length.toString())
      );
      
      textCardInfoEx.textContent = "Лайкнули:";
      
      if (cardData.likes.length > 0) {
        cardData.likes.forEach(user => {
          const tplUserEx = document.getElementById("popup-info-user-preview-template");
          const listItem = tplUserEx.content.cloneNode(true);
          const badge = listItem.querySelector(".popup__list-item_type_badge");
          
          badge.textContent = user.name || 'Аноним';
          
          listCardInfoUlEx.appendChild(listItem);
        });
      }
      
      openPopModalEx(popCardInfoEx);
    })
    .catch((err) => {
      console.log(err);
    });
};

const onHeaderStatsEx = () => {
  /* Для вывода корректной информации получаем актуальные данные с сервера */
  getCardListEx()
    .then((cards) => {

      titleCardInfoEx.textContent = "Статистика карточек";
      listCardInfoDlEx.innerHTML = "";
      textCardInfoEx.textContent = "Все пользователи:";
      listCardInfoUlEx.innerHTML = "";

      
      
      const totalCardsEx = cards.length;

      // Считаем карточки для каждого пользователя и собираем уникальные имена
      const userStatsEx = cards.reduce((acc, card) => {
        const name = card.owner.name;
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});

      const uniqueUserNamesEx = Object.keys(userStatsEx);
      const totalUsersEx = uniqueUserNamesEx.length;
      
      // Максимум карточек от одного пользователя
      const maxCardsFromOneEx = Math.max(...Object.values(userStatsEx));

      // Даты создания 
      const lastCreatedDateEx = cards[0]?.createdAt;
      const firstCreatedDateEx = cards[cards.length - 1]?.createdAt;

      // Залив

      listCardInfoDlEx.append(
        mkInfoRowEx("Всего карточек:", totalCardsEx)
      );

      if (firstCreatedDateEx) {
        listCardInfoDlEx.append(
          mkInfoRowEx("Первая создана:", formatDateRuEx(new Date(firstCreatedDateEx)))
        );
      }

      if (lastCreatedDateEx) {
        listCardInfoDlEx.append(
          mkInfoRowEx("Последняя создана:", formatDateRuEx(new Date(lastCreatedDateEx)))
        );
      }

      listCardInfoDlEx.append(
        mkInfoRowEx("Всего пользователей:", totalUsersEx)
      );

      listCardInfoDlEx.append(
        mkInfoRowEx("Максимум карточек от одного:", maxCardsFromOneEx)
      );

      // Визуализация списка пользователей

      uniqueUserNamesEx.forEach((name) => {
        const tplUserEx = document.getElementById("popup-info-user-preview-template");
        const listItem = tplUserEx.content.cloneNode(true);
        const badge = listItem.querySelector(".popup__list-item_type_badge");
        
        badge.textContent = name;
        
        listCardInfoUlEx.appendChild(listItem);
      });

      // Открываем модальное окно
      openPopModalEx(popCardInfoEx);
    })
    .catch((err) => {
      console.log("Ошибка при загрузке статистики:", err);
    });
};


elHeaderLogoEx.addEventListener('click', onHeaderStatsEx);
