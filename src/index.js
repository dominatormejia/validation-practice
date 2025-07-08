import "./styles.css";
import { COUNTRY_ADDRESS_POSTALS } from "./postalRegEx";

(function validation() {
  const identification = document.querySelector("form");
  const postalInput = document.querySelector("#postal-code");

  identification.addEventListener("input", (event) => {
    const input = event.target;
    if (["email", "postal-code", "confirm-password"].includes(input.id)) {
      input.validity.valid ? removeError(input) : displayError(input);
    }
    if (["country-input"].includes(input.id)) {
      const country = COUNTRY_ADDRESS_POSTALS.find((c) => {
        return c.name.toLocaleLowerCase() === input.value.toLocaleLowerCase();
      });
      if (country && country.postal) {
        let regexString = country.postal;
        console.log("Actual string being set:", regexString);
        postalInput.setAttribute("pattern", regexString);
        postalInput.removeAttribute("disabled");
      }

      const options = getList();
      options.includes(format(input.value))
        ? removeError(input)
        : displayError(input);
    }
    if (["password", "confirm-password"].includes(input.id)) {
      const password = document.querySelector("#password");
      const confirmPassword = document.querySelector("#confirm-password");
      if (
        password.value &&
        confirmPassword.value &&
        confirmPassword.value !== password.value
      ) {
        displayError(input);
      } else if (
        password.value &&
        confirmPassword.value &&
        confirmPassword.value === password.value
      ) {
        removeError(input);
      } else {
        input.validity.valid ? removeError(input) : displayError(input);
      }
    }
  });

  identification.addEventListener("submit", (event) => {
    const div = document.querySelector(".success");
    event.preventDefault();

    const inputs = [
      document.querySelector("#email"),
      document.querySelector("#country-input"),
      document.querySelector("#postal-code"),
      document.querySelector("#password"),
      document.querySelector("#confirm-password"),
    ];

    inputs.forEach((element) => {
      if (element.validity.valid) {
        removeError(element);
        element.value = "";
        element.setCustomValidity("");
        div.classList.remove("disappear");
      } else {
        displayError(element);
        div.classList.add("disappear");
      }
    });
  });
})();

function getList() {
  const list = document.querySelector("#country");
  const options = Array.from(list.options).map((options) => options.value);

  return options;
}

function format(input) {
  const splitString = input.split(" ");

  const capString = splitString.map((word) => {
    const excludes = ["and", "of"];

    if (!excludes.includes(word.toLowerCase())) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    } else {
      return word;
    }
  });

  return capString.join(" ");
}

function removeError(input) {
  console.log("no error");
  const errorDiv = input.closest(".choice-wrapper").nextElementSibling;

  if (
    ["email", "password", "confirm-password", "postal-code"].includes(input.id)
  ) {
    errorDiv.classList.add("hidden");
  } else {
    input.setCustomValidity("");
    errorDiv.classList.add("hidden");
  }
}

function displayError(input) {
  console.log("error");
  const errorDiv = input.closest(".choice-wrapper").nextElementSibling;
  const password = document.querySelector("#password");
  const confirmPassword = document.querySelector("#confirm-password");
  const confirmPasswordError =
    confirmPassword.closest(".choice-wrapper").nextElementSibling;

  if (input.id === "email") {
    errorDiv.classList.remove("hidden");
    if (input.validity.valueMissing) {
      errorDiv.textContent = "Please Enter an email";
    } else if (input.validity.tooShort) {
      errorDiv.textContent = "Too Short";
    } else if (input.validity.patternMismatch) {
      errorDiv.textContent = "Please enter a valid email";
    }
  }
  if (input.id === "country-input") {
    errorDiv.classList.remove("hidden");
    if (input.validity.valueMissing) {
      errorDiv.textContent = "Please Enter a Country";
    } else if (!getList().includes(input.value)) {
      input.setCustomValidity("Please Enter a Valid Country");
      errorDiv.textContent = "Please Enter a Valid Country";
    }
  }
  if (input.id === "password") {
    errorDiv.classList.remove("hidden");
    if (input.validity.valueMissing) {
      errorDiv.textContent = "Please Enter a Password";
    } else if (input.validity.tooShort) {
      errorDiv.textContent = "Too Short";
    } else if (input.validity.patternMismatch) {
      errorDiv.textContent = "Please enter a strong password";
    } else if (
      password.value &&
      confirmPassword.value &&
      confirmPassword.value !== password.value
    ) {
      errorDiv.classList.add("hidden");
      confirmPasswordError.classList.remove("hidden");
      confirmPasswordError.textContent = "Passwords do not match";
      confirmPassword.setCustomValidity("Passwords do not match");
    }
  }
  if (input.id === "confirm-password") {
    errorDiv.classList.remove("hidden");
    if (input.validity.valueMissing) {
      errorDiv.textContent = "Please Enter a Password";
    } else if (input.validity.tooShort) {
      errorDiv.textContent = "Too Short";
    } else if (input.validity.patternMismatch) {
      errorDiv.textContent = "Please enter a strong password";
    } else if (
      password.value &&
      confirmPassword.value &&
      confirmPassword.value !== password.value
    ) {
      errorDiv.textContent = "Passwords do not match";
      confirmPassword.setCustomValidity("Passwords do not match");
    }
  }
  if (input.id === "postal-code") {
    errorDiv.classList.remove("hidden");
    if (input.validity.valueMissing) {
      errorDiv.textContent = "Please Enter a Postal Code";
    } else if (input.validity.patternMismatch) {
      errorDiv.textContent = "Invalid postal code for selected country";
    }
  }
}
