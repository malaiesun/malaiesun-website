document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("myForm");
  const nameInput = form.querySelector('input[name="name"]');
  const emailInput = form.querySelector('input[name="email"]');
  const messageInput = form.querySelector('textarea[name="message"]');
  const submitButton = form.querySelector(".contact-form-btn");
  const contactTitle = form.querySelector(".contact-form-title");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (validateInputs()) {
      submitButton.disabled = true;
      submitForm();
      form.reset();
    }
  });

  function validateInputs() {
    let isValid = true;

    if (nameInput.value.trim() === "") {
      displayError(nameInput, "*Name is required");
      isValid = false;
    } else {
      clearError(nameInput);
    }

    if (!isValidEmail(emailInput.value.trim())) {
      displayError(emailInput, "*Valid email is required: name@abc.xyz");
      isValid = false;
    } else {
      clearError(emailInput);
    }

    if (messageInput.value.trim() === "") {
      displayError(messageInput, "*Message is required");
      isValid = false;
    } else {
      clearError(messageInput);
    }

    return isValid;
  }

  function isValidEmail(email) {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  }

  function displayError(input, errorMessage) {
    const inputContainer = input.parentElement;
    inputContainer.classList.add("error");

    let errorSpan = inputContainer.querySelector(".error-message");
    if (!errorSpan) {
      errorSpan = document.createElement("span");
      errorSpan.classList.add("error-message");
      inputContainer.appendChild(errorSpan);
    }

    errorSpan.innerText = errorMessage;
  }

  function clearError(input) {
    const inputContainer = input.parentElement;
    inputContainer.classList.remove("error");

    const errorSpan = inputContainer.querySelector(".error-message");
    if (errorSpan) {
      inputContainer.removeChild(errorSpan);
    }
  }

  function showSuccess() {
    submitButton.innerHTML = `<span><i class="fas fa-check"></i></span>`;
    contactTitle.innerHTML = `<span>Submitted Sucessfully</span>`;
    form.classList.add("submitted-form");
    submitButton.classList.add("success");
    submitButton.disabled = true;
    clearError(nameInput);
    clearError(emailInput);
    clearError(messageInput);

  }

  function submitForm() {
    const formData = new FormData(form);
    fetch("https://api.apispreadsheets.com/data/HBguEWfaA3zyaNxw/", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.status === 201) {
          showSuccess();
        } else {
          alert("There was an error");
        }
      })
      .catch((error) => {
        console.error(error);
        alert("There was an error");
      });
  }
});
