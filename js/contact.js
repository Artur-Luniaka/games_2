// Contact Page Functionality
class ContactPage {
  constructor() {
    this.init();
  }

  init() {
    this.setupFormValidation();
    this.setupEventListeners();
  }

  setupFormValidation() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    // Email validation
    const emailInput = document.getElementById("contact-email");
    if (emailInput) {
      emailInput.addEventListener("blur", () => {
        this.validateEmail(emailInput);
      });
    }

    // Name validation
    const nameInput = document.getElementById("contact-name");
    if (nameInput) {
      nameInput.addEventListener("blur", () => {
        this.validateName(nameInput);
      });
    }
  }

  setupEventListeners() {
    const form = document.getElementById("contact-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFormSubmission();
      });
    }
  }

  validateEmail(input) {
    const email = input.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      this.showFieldError(input, "Please enter a valid email address");
      return false;
    } else {
      this.clearFieldError(input);
      return true;
    }
  }

  validateName(input) {
    const name = input.value.trim();

    if (name.length < 2) {
      this.showFieldError(input, "Name must be at least 2 characters long");
      return false;
    } else {
      this.clearFieldError(input);
      return true;
    }
  }

  validateForm() {
    const form = document.getElementById("contact-form");
    if (!form) return false;

    const requiredFields = form.querySelectorAll("[required]");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (field.type === "email") {
        if (!this.validateEmail(field)) {
          isValid = false;
        }
      } else if (field.type === "text") {
        if (field.id === "contact-name") {
          if (!this.validateName(field)) {
            isValid = false;
          }
        } else {
          if (!field.value.trim()) {
            this.showFieldError(field, "This field is required");
            isValid = false;
          } else {
            this.clearFieldError(field);
          }
        }
      } else {
        if (!field.value.trim()) {
          this.showFieldError(field, "This field is required");
          isValid = false;
        } else {
          this.clearFieldError(field);
        }
      }
    });

    return isValid;
  }

  showFieldError(field, message) {
    this.clearFieldError(field);
    field.classList.add("error");

    const errorDiv = document.createElement("div");
    errorDiv.className = "field-error";
    errorDiv.textContent = message;
    errorDiv.style.color = "#dc2626";
    errorDiv.style.fontSize = "0.875rem";
    errorDiv.style.marginTop = "0.25rem";

    field.parentNode.appendChild(errorDiv);
  }

  clearFieldError(field) {
    field.classList.remove("error");
    const errorDiv = field.parentNode.querySelector(".field-error");
    if (errorDiv) {
      errorDiv.remove();
    }
  }

  async handleFormSubmission() {
    if (!this.validateForm()) {
      this.showNotification("Please fix the errors in the form", "error");
      return;
    }

    const form = document.getElementById("contact-form");
    const submitBtn = form.querySelector('button[type="submit"]');

    // Show loading state
    if (submitBtn) {
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;
    }

    try {
      // Simulate form submission
      await this.submitForm();

      // Show success message
      this.showSuccessMessage();

      // Reset form
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      this.showNotification(
        "Error sending message. Please try again.",
        "error"
      );
    } finally {
      // Reset button
      if (submitBtn) {
        submitBtn.textContent = "Send Message";
        submitBtn.disabled = false;
      }
    }
  }

  async submitForm() {
    // Simulate API call delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  }

  showSuccessMessage() {
    const form = document.getElementById("contact-form");
    if (form) {
      form.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
                    <h2>Message Sent Successfully!</h2>
                    <p>Thank you for contacting us. We'll get back to you as soon as possible.</p>
                    <button onclick="location.reload()" class="btn btn-primary" style="margin-top: 1rem;">
                        Send Another Message
                    </button>
                </div>
            `;
    }
  }

  showNotification(message, type = "success") {
    const notification = document.getElementById("notification");
    if (notification) {
      notification.textContent = message;
      notification.className = `notification ${type}`;
      notification.classList.add("show");

      setTimeout(() => {
        notification.classList.remove("show");
      }, 3000);
    }
  }
}

// Initialize contact page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new ContactPage();
});

document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector(".contact-form");
  const submitButton = contactForm.querySelector(".submit-button");
  let isSubmitting = false;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    isSubmitting = true;

    // Изменяем текст кнопки и добавляем индикатор загрузки
    const originalButtonText = submitButton.textContent;
    submitButton.innerHTML = `
      <span class="spinner"></span>
      <span>Sending...</span>
    `;
    submitButton.disabled = true;

    // Собираем данные формы
    const formData = {
      fullName: contactForm.querySelector("#fullName").value,
      email: contactForm.querySelector("#email").value,
      subject: contactForm.querySelector("#subject").value,
      message: contactForm.querySelector("#message").value,
      newsletter: contactForm.querySelector("#newsletter").checked,
    };

    try {
      // Здесь будет реальный запрос к API
      // Имитируем задержку запроса
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Показываем уведомление об успехе
      showNotification({
        type: "success",
        title: "Message Sent Successfully!",
        message:
          "Thank you for contacting us. We will get back to you within 24 hours.",
        duration: 5000,
      });

      // Очищаем форму
      contactForm.reset();
    } catch (error) {
      // Показываем уведомление об ошибке
      showNotification({
        type: "error",
        title: "Error Sending Message",
        message: "Something went wrong. Please try again later.",
        duration: 5000,
      });
    } finally {
      // Возвращаем кнопку в исходное состояние
      submitButton.innerHTML = originalButtonText;
      submitButton.disabled = false;
      isSubmitting = false;
    }
  });
});

// Функция для показа уведомлений
function showNotification({ type, title, message, duration }) {
  // Создаем элемент уведомления
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;

  // Добавляем иконку в зависимости от типа уведомления
  const icon =
    type === "success"
      ? '<svg class="notification-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
      : '<svg class="notification-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>';

  notification.innerHTML = `
    ${icon}
    <div class="notification-content">
      <h3>${title}</h3>
      <p>${message}</p>
    </div>
    <button class="notification-close" aria-label="Close notification">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

  // Добавляем уведомление на страницу
  document.body.appendChild(notification);

  // Добавляем класс для анимации появления
  setTimeout(() => notification.classList.add("show"), 10);

  // Добавляем обработчик для кнопки закрытия
  const closeButton = notification.querySelector(".notification-close");
  closeButton.addEventListener("click", () => {
    notification.classList.remove("show");
    setTimeout(() => notification.remove(), 300);
  });

  // Автоматически скрываем уведомление через указанное время
  if (duration) {
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, duration);
  }
}
