/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { getCardList, getUserInfo, setUserAvatar, setUserInfo, addNewCard, deleteCardApi, changeLikeCardStatus } from "./components/api.js";
import { createCardElement} from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

const cardInfoModalWindow = document.querySelector(".popup_type_info");
const cardInfoModalTitle = cardInfoModalWindow.querySelector(".popup__title");
const cardInfoModalInfoList = cardInfoModalWindow.querySelector(".popup__info");
const cardInfoModalText = cardInfoModalWindow.querySelector(".popup__text");
const cardInfoModalList = cardInfoModalWindow.querySelector(".popup__list");

const headerLogo = document.querySelector(".header__logo")

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = profileForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';


  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
};

const handleAvatarFromSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = avatarForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';


  setUserAvatar({
    avatar: avatarInput.value
  })
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();

  const submitButton = cardForm.querySelector('.popup__button');
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Создание...';

  addNewCard(
    {
      name: cardNameInput.value,
      link: cardLinkInput.value 
  })
  .then((cardData) => {
      placesWrap.prepend(
        createCardElement(
          cardData,
          {
            onPreviewPicture: handlePreviewPicture,
            onLikeIcon: handleLikeClick,
            onDeleteCard: handleDeleteCard,
            onInfoIcon: handleInfoClick
          }, userData._id
        )
      );
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = originalText;
    });
};

const validationSettings = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(validationSettings);

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarFromSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(validationSettings, profileFormModalWindow);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(validationSettings, avatarFormModalWindow);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(validationSettings, cardFormModalWindow);
  openModalWindow(cardFormModalWindow);
});

//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
      cards.forEach((data) => {
        placesWrap.append(
          createCardElement(data, {
            onPreviewPicture: handlePreviewPicture,
            onLikeIcon: handleLikeClick,
            onDeleteCard: handleDeleteCard,
            onInfoIcon: handleInfoClick
          }, userData._id) 
        );
      }); 
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      profileAvatar.src = userData.avatar; 
    })
  .catch((err) => {
    console.log(err); // В случае возникновения ошибки выводим её в консоль
  });

const handleDeleteCard = (cardID, cardElement) => {
  console.log(cardID);
  deleteCardApi({cardId: cardID})
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleLikeClick = (cardID, cardElement, likeButton) => {
  const isLiked = likeButton.classList.contains("card__like-button_is-active");
  
  changeLikeCardStatus(cardID, isLiked)
    .then((cardData) => {
      likeButton.classList.toggle("card__like-button_is-active");
      cardElement.querySelector(".card__like-count").textContent = cardData.likes.length;
    })
    .catch((err) => {
      console.log(err);
    });
};

const formatDate = (date) =>
  date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
});

const createInfoString = (term, description) => {
  const template = document.getElementById("popup-info-definition-template");
  const infoItem = template.content.cloneNode(true);
  infoItem.querySelector(".popup__info-term").textContent = term;
  infoItem.querySelector(".popup__info-description").textContent = description;
  return infoItem;
};
  
const handleInfoClick = (cardId) => {
  /* Для вывода корректной информации необходимо получить актуальные данные с сервера. */
  getCardList()
    .then((cards) => {
      const cardData = cards.find(card => card._id === cardId);
      if (!cardData) return;
      
      cardInfoModalTitle.textContent = "";
      cardInfoModalInfoList.innerHTML = "";
      cardInfoModalText.textContent = "";
      cardInfoModalList.innerHTML = "";
      
      cardInfoModalTitle.textContent = "Информация о карточке";
      
      cardInfoModalInfoList.append(
        createInfoString("Описание:", cardData.name)
      );

      cardInfoModalInfoList.append(
        createInfoString(
          "Дата создания:",
          formatDate(new Date(cardData.createdAt))
        )
      );

      cardInfoModalInfoList.append(
        createInfoString("Владелец:", cardData.owner.name)
      );
      
      cardInfoModalInfoList.append(
        createInfoString("Количество лайков:", cardData.likes.length.toString())
      );
      
      cardInfoModalText.textContent = "Лайкнули:";
      
      if (cardData.likes.length > 0) {
        cardData.likes.forEach(user => {
          const template = document.getElementById("popup-info-user-preview-template");
          const listItem = template.content.cloneNode(true);
          const badge = listItem.querySelector(".popup__list-item_type_badge");
          
          badge.textContent = user.name || 'Аноним';
          
          cardInfoModalList.appendChild(listItem);
        });
      }
      
      openModalWindow(cardInfoModalWindow);
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleStatClick = () => {
  /* Для вывода корректной информации получаем актуальные данные с сервера */
  getCardList()
    .then((cards) => {

      cardInfoModalTitle.textContent = "Статистика карточек";
      cardInfoModalInfoList.innerHTML = "";
      cardInfoModalText.textContent = "Все пользователи:";
      cardInfoModalList.innerHTML = "";

      
      
      const totalCards = cards.length;

      // Считаем карточки для каждого пользователя и собираем уникальные имена
      const userStats = cards.reduce((acc, card) => {
        const name = card.owner.name;
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});

      const uniqueUserNames = Object.keys(userStats);
      const totalUsers = uniqueUserNames.length;
      
      // Максимум карточек от одного пользователя
      const maxCardsFromOne = Math.max(...Object.values(userStats));

      // Даты создания 
      const lastCreatedDate = cards[0]?.createdAt;
      const firstCreatedDate = cards[cards.length - 1]?.createdAt;

      // Залив

      cardInfoModalInfoList.append(
        createInfoString("Всего карточек:", totalCards)
      );

      if (firstCreatedDate) {
        cardInfoModalInfoList.append(
          createInfoString("Первая создана:", formatDate(new Date(firstCreatedDate)))
        );
      }

      if (lastCreatedDate) {
        cardInfoModalInfoList.append(
          createInfoString("Последняя создана:", formatDate(new Date(lastCreatedDate)))
        );
      }

      cardInfoModalInfoList.append(
        createInfoString("Всего пользователей:", totalUsers)
      );

      cardInfoModalInfoList.append(
        createInfoString("Максимум карточек от одного:", maxCardsFromOne)
      );

      // Визуализация списка пользователей

      uniqueUserNames.forEach((name) => {
        const template = document.getElementById("popup-info-user-preview-template");
        const listItem = template.content.cloneNode(true);
        const badge = listItem.querySelector(".popup__list-item_type_badge");
        
        badge.textContent = name;
        
        cardInfoModalList.appendChild(listItem);
      });

      // Открываем модальное окно
      openModalWindow(cardInfoModalWindow);
    })
    .catch((err) => {
      console.log("Ошибка при загрузке статистики:", err);
    });
};


headerLogo.addEventListener('click', handleStatClick);