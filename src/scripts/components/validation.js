export const showFieldErrEx = (settings, formInput, formElement, errorMessage) => {
  const formError = formElement.querySelector(`#${formInput.id}-error`);
  formInput.classList.add(settings.inputErrorClass);
  formError.classList.add(settings.errorClass);
  if (errorMessage && formInput.validity.patternMismatch){
    formError.textContent = errorMessage;
  } else {
    formError.textContent = formInput.validationMessage;
  }
};

const hideFieldErrEx = (settings, formInput, formElement) => {
  const formError = formElement.querySelector(`#${formInput.id}-error`);
  formInput.classList.remove(settings.inputErrorClass);
  formError.classList.remove(settings.errorClass);
  formError.textContent = "";
};

const checkFieldValidEx = (settings, formInput, formElement) => {
  if (formInput.validity.patternMismatch) {
    formInput.setCustomValidity(formInput.dataset.errorMessage);
  } else {
    formInput.setCustomValidity("");
  }

  if (!formInput.validity.valid) {
    showFieldErrEx(settings, formInput, formElement, formInput.validationMessage);
  } else {
    hideFieldErrEx(settings, formInput, formElement);
  }
};

const hasInvalidInputEx = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  })
};

const disableSubmitBtnEx = (settings, buttonElement) => {
  buttonElement.classList.add(settings.inactiveButtonClass);
  buttonElement.disabled = true; 
}

const enableSubmitBtnEx = (settings, buttonElement) => {
  buttonElement.classList.remove(settings.inactiveButtonClass);
  buttonElement.disabled = false; 
}

const toggleSubmitStateEx = (settings, inputList, buttonElement) => {
  if (hasInvalidInputEx(inputList)) {
    disableSubmitBtnEx(settings, buttonElement)
  } else {
    enableSubmitBtnEx(settings, buttonElement);
  }
};

const bindFormInputHandlersEx = (settings, formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener('input', () => {
      checkFieldValidEx(settings, inputElement, formElement);
      toggleSubmitStateEx(settings, inputList, buttonElement);
    });
  });
};

export const clearValidStateEx = (settings, formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(settings.inputSelector));
  const buttonElement = formElement.querySelector(settings.submitButtonSelector);
  disableSubmitBtnEx(settings, buttonElement);
  inputList.forEach((inputElement) => {
    hideFieldErrEx(settings, inputElement, formElement);
  });
};

export const enableValidFormsEx = (settings) => {
  const formList = Array.from(document.querySelectorAll(settings.formSelector));
  formList.forEach((formElement) => {
    bindFormInputHandlersEx(settings, formElement);
  });
};
