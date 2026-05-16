const onEscClosePopEx = (evt) => {
  if (evt.key === "Escape") {
    const activePopup = document.querySelector(".popup_is-opened");
    closePopModalEx(activePopup);
  }
};

export const openPopModalEx = (modalWindow) => {
  modalWindow.classList.add("popup_is-opened");
  document.addEventListener("keyup", onEscClosePopEx);
};

export const closePopModalEx = (modalWindow) => {
  modalWindow.classList.remove("popup_is-opened");
  document.removeEventListener("keyup", onEscClosePopEx);
};

export const bindPopCloseHandlersEx = (modalWindow) => {
  const closeButtonElement = modalWindow.querySelector(".popup__close")
  closeButtonElement.addEventListener("click", () => {
    closePopModalEx(modalWindow);
  });

  modalWindow.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("popup")) {
      closePopModalEx(modalWindow);
    }
  });
}
