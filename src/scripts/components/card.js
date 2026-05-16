export const toggleLikeUiEx = (likeButton) => {
  likeButton.classList.toggle("card__like-button_is-active");
};

export const removeCardDomEx = (cardElement) => {
  cardElement.remove();
};

const cloneCardTplEx = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const buildCardDomEx = (
  data,
  { onPreviewPicEx, onLikeBtnEx, onCardRemoveEx, onCardInfoEx },
  currentUserID
) => {
  const cardElement = cloneCardTplEx();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");

  const likeCountElement = cardElement.querySelector(".card__like-count");
  likeCountElement.textContent = data.likes.length;

  const infoButton = cardElement.querySelector(".card__control-button_type_info");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;

  if (data.owner._id !== currentUserID) {
    deleteButton.remove();
  }

  if (onLikeBtnEx) {
    likeButton.addEventListener("click", () => onLikeBtnEx(data._id, cardElement, likeButton));
  }

  if (onCardRemoveEx && data.owner._id === currentUserID) {
    deleteButton.addEventListener("click", () => onCardRemoveEx(data._id, cardElement));
  }

  if (onPreviewPicEx) {
    cardImage.addEventListener("click", () => onPreviewPicEx({name: data.name, link: data.link}));
  }

  if (onCardInfoEx) {
    infoButton.addEventListener("click", () => onCardInfoEx(data._id));
  }

  return cardElement;
};
