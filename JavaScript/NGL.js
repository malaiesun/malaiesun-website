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
      submitButton.classList.remove("animate-button");
      form.reset();
      setTimeout(function () {
        window.location.href = "/";
      }, 5000);
    }
  });

  function validateInputs() {
    let isValid = true;

    if (messageInput.value.trim() === "") {
      displayError(messageInput, "*Message is required");
      isValid = false;
    } else {
      clearError(messageInput);
    }

    return isValid;
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
    form.classList.add("submitted-form");
    submitButton.classList.add("success");
    submitButton.disabled = true;
    clearError(nameInput);
    clearError(emailInput);
    clearError(messageInput);
  }

  function submitForm() {
    const formData = new FormData(form);
    fetch("https://api.apispreadsheets.com/data/XlIywN69SHiJoaLI/", {
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
      .catch((error) => {});
  }
});

//Animate Button
document.addEventListener("DOMContentLoaded", function () {
  const messageInput = document.getElementById("message");
  const submitButton = document.querySelector(".contact-form-btn");

  messageInput.addEventListener("input", function () {
    const message = messageInput.value.trim();
    if (message.length > 2) {
      submitButton.classList.add("animate-button");
    } else {
      submitButton.classList.remove("animate-button");
    }
  });
});
