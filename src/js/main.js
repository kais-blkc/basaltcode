/* ========== AOS ========== */
if (!AOS) {
  console.warn('AOS not found');
} else {
  AOS.init({
    delay: 100,
    duration: 600,
  });
}
/* ========== END AOS ========== */

/* ========== MODAL LOGIC ========== */
function initModals() {
  const btnOpenModal = document.querySelectorAll('*[data-modal-open]');
  const btnCloseModal = document.querySelectorAll('*[data-modal-close]');
  const btnBlockModal = document.querySelectorAll('*[data-modal-block]');
  const modals = document.querySelectorAll('.modal-wrapper');

  btnOpenModal.forEach((btn) => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      if (this.dataset.modalClose) {
        const currentModal = document.querySelector(`[data-modal-block="${this.dataset.modalClose}"]`);
        if (currentModal) {
          currentModal.classList.remove('active');
          if (currentModal.dataset.modalBlock === 'express-landing' || currentModal.dataset.modalBlock === 'express-landing-terms') {
            document.body.style.overflow = '';
          }
        }
      }
      toggleModalClass.call(this, e);
    });
  });
  
  const termsLinks = document.querySelectorAll('.terms-link');
  termsLinks.forEach((link) => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      if (this.dataset.modalClose) {
        const currentModal = document.querySelector(`[data-modal-block="${this.dataset.modalClose}"]`);
        if (currentModal) {
          setTimeout(() => {
            currentModal.classList.remove('active');
            if (currentModal.dataset.modalBlock === 'express-landing' || currentModal.dataset.modalBlock === 'express-landing-terms') {
              document.body.style.overflow = '';
            }
          }, 100);
        }
      }
      if (this.dataset.modalOpen) {
        const targetModal = document.querySelector(`[data-modal-block="${this.dataset.modalOpen}"]`);
        if (targetModal) {
          setTimeout(() => {
            targetModal.classList.add('active');
            if (targetModal.dataset.modalBlock === 'express-landing' || targetModal.dataset.modalBlock === 'express-landing-terms') {
              document.body.style.overflow = 'hidden';
            }
          }, 150);
        }
      }
    });
  });
  
  btnCloseModal.forEach((btn) => {
    btn.addEventListener('click', function() {
      const modalBlock = this.dataset.modalClose;
      toggleModalClass.call(this);
      
      if (modalBlock === 'express-landing-terms') {
        setTimeout(() => {
          const expressLandingModal = document.querySelector('[data-modal-block="express-landing"]');
          if (expressLandingModal) {
            expressLandingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
          }
        }, 200);
      }
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target.className.includes('modal-wrapper')) {
        const modalBlock = modal.dataset.modalBlock;
        modal.classList.remove('active');
        if (modal.dataset.modalBlock === 'express-landing' || modal.dataset.modalBlock === 'express-landing-terms') {
          document.body.style.overflow = '';
        }
        
        if (modalBlock === 'express-landing-terms') {
          setTimeout(() => {
            const expressLandingModal = document.querySelector('[data-modal-block="express-landing"]');
            if (expressLandingModal) {
              expressLandingModal.classList.add('active');
              document.body.style.overflow = 'hidden';
            }
          }, 200);
        }
      }
    });
  });

  function toggleModalClass() {
    btnBlockModal.forEach((block) => {
      if (
        this.dataset.modalOpen === block.dataset.modalBlock ||
        this.dataset.modalClose === block.dataset.modalBlock
      ) {
        const wasActive = block.classList.contains('active');
        const modalBlock = block.dataset.modalBlock;
        block.classList.toggle('active');
        const isNowActive = block.classList.contains('active');
        
        if (block.dataset.modalBlock === 'express-landing' || block.dataset.modalBlock === 'express-landing-terms') {
          if (isNowActive && !wasActive) {
            document.body.style.overflow = 'hidden';
          } else if (!isNowActive && wasActive) {
            document.body.style.overflow = '';
          }
        }
        
        if (!isNowActive && wasActive && modalBlock === 'express-landing-terms') {
          setTimeout(() => {
            const expressLandingModal = document.querySelector('[data-modal-block="express-landing"]');
            if (expressLandingModal) {
              expressLandingModal.classList.add('active');
              document.body.style.overflow = 'hidden';
            }
          }, 200);
        }
        
        if (this.classList) {
          this.classList.toggle('active');
        }
      }
    });
  }
}
initModals();
/* ========== END MODAL LOGIC ========== */

/* ========== SCROLL HEADER ========== */
function scrollHeader() {
  const header = document.querySelector('header');

  document.addEventListener('scroll', () => {
    if (document.documentElement.scrollTop > 10) {
      header.classList.add('scroll');
    } else {
      header.classList.remove('scroll');
    }
  });
}
scrollHeader();
/* ========== SCROLL HEADER END ========== */

/* ========== TABS ========== */
function tabs() {
  const tabs = document.querySelectorAll('[data-tabs]');

  tabs.forEach((tab) => {
    const tabsItems = tab.querySelectorAll('[data-tabs-title]');
    const tabsContent = tab.querySelectorAll('[data-tabs-content]');

    tab.addEventListener('click', (e) => {
      if (!tabsItems || !tabsContent) {
        console.warn('Tabs items or content not found');
      }

      if (e.target.dataset.tabsTitle) {
        // Убираем активный класс с кнопок
        tabsItems?.forEach((item) => {
          item.classList.remove('active');
        });

        // Находим активный контент и добавляем класс leaving
        const activeContent = tab.querySelector('[data-tabs-content].active');
        if (activeContent) {
          activeContent.classList.add('leaving');
          activeContent.classList.remove('active');
        }

        // Добавляем активный класс к кнопке
        e.target.classList.add('active');

        // Показываем новый контент сразу
        const newContent = tab.querySelector(`[data-tabs-content="${e.target.dataset.tabsTitle}"]`);
        if (newContent) {
          newContent.classList.add('active');
        }

        // Убираем класс leaving через небольшую задержку для анимации
        setTimeout(() => {
          tabsContent?.forEach((content) => {
            content.classList.remove('leaving');
          });
        }, 250); // Время для завершения анимации исчезновения (0.25s)
      }
    });
  });
}
tabs();
/* ========== END TABS ========== */

/* ========== SEND REQUEST FORM ========== */
function sendRequestForm() {
  const requestForm = document.querySelector('#request-form');

  requestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(requestForm);

    let res = await fetch('php/send.php', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();

    const resultForm = document.querySelector('#request-form-result');
    resultForm.innerText = data?.message;
    resultForm.classList.add('active');
    console.log(data);

    if (data.ok) {
      requestForm.reset(); // Очищаем форму
    }
  });
}
sendRequestForm();

/* ========== END SEND REQUEST FORM ========== */

/* ========== EXPRESS LANDING CALCULATOR ========== */
function expressLandingCalculator() {
  const expressLandingModal = document.querySelector('[data-modal-block="express-landing"]');
  if (!expressLandingModal) return;
  
  expressLandingModal.addEventListener('click', function(e) {
    if (e.target.classList.contains('mexpress-landing__edit-icon')) {
      e.stopPropagation();
      e.preventDefault();
      
      const blockRow = e.target.closest('.mexpress-landing__block-row');
      const item = e.target.closest('.mexpress-landing__item');
      
      let input, checkbox;
      
      if (blockRow) {
        checkbox = blockRow.querySelector('.block-checkbox');
        input = blockRow.querySelector('.block-input');
      } else if (item) {
        checkbox = item.querySelector('input[type="checkbox"]');
        input = item.querySelector('.mexpress-landing__item-input');
      } else {
        return;
      }
      
      if (!checkbox || !checkbox.checked) return;
      if (!input) return;
      
      const wasActive = input.classList.contains('active');
      input.classList.toggle('active');
      
      if (input.classList.contains('active')) {
        setTimeout(() => input.focus(), 100);
      } else {
        if (wasActive) {
          input.value = '';
        }
      }
    }
  });

  expressLandingModal.addEventListener('change', function(e) {
    if (e.target.classList.contains('block-checkbox')) {
      const blockRow = e.target.closest('.mexpress-landing__block-row');
      if (!blockRow) return;
      
      const input = blockRow.querySelector('.block-input');
      if (!input) return;
      
      if (!e.target.checked) {
        input.classList.remove('active');
        input.value = '';
      }
    } else if (e.target.name === 'header' || e.target.name === 'footer') {
      const item = e.target.closest('.mexpress-landing__item');
      if (!item) return;
      
      const input = item.querySelector('.mexpress-landing__item-input');
      if (!input) return;
      
      if (!e.target.checked) {
        input.classList.remove('active');
        input.value = '';
      }
    }
  });

  expressLandingModal.addEventListener('blur', function(e) {
    if (e.target.classList.contains('block-input') || e.target.classList.contains('mexpress-landing__item-input')) {
      const blockRow = e.target.closest('.mexpress-landing__block-row');
      const item = e.target.closest('.mexpress-landing__item');
      
      let checkbox;
      if (blockRow) {
        checkbox = blockRow.querySelector('.block-checkbox');
      } else if (item) {
        checkbox = item.querySelector('input[type="checkbox"]');
      } else {
        return;
      }
      
      if (!checkbox || !checkbox.checked) {
        if (!e.target.value.trim()) {
          e.target.classList.remove('active');
        }
      }
    }
  }, true);

  function updateSelectPrice(select, priceElement) {
    if (!select || !priceElement) return;
    
    const selectedOption = select.options[select.selectedIndex];
    if (!selectedOption) return;
    
    const value = parseInt(selectedOption.value);
    
    if (isNaN(value) || value === 0 || selectedOption.value === '') {
      priceElement.style.display = 'none';
      return;
    }
    
    // Форматируем цену: если больше 1000, показываем в формате "к", иначе в рублях
    if (value >= 1000) {
      priceElement.textContent = '+' + (value / 1000) + 'к';
    } else {
      priceElement.textContent = '+' + value.toLocaleString('ru-RU') + ' ₽';
    }
    priceElement.style.display = 'inline-block';
  }

function updateTotal() {
    const additionalBlocks = expressLandingModal.querySelectorAll('.mexpress-landing__blocks .mexpress-landing__block-row[data-block-type="additional"]');
    const additionalCount = additionalBlocks.length;
    let basePrice = 10000;
    
    const versionInput = expressLandingModal.querySelector('input[name="version"]:checked');
    if (versionInput && versionInput.value === 'both') {
      basePrice += 5000;
    }
    
    const additionalPrice = additionalCount * 1000;
    let servicesPrice = 0;
    
    const serviceCheckboxes = expressLandingModal.querySelectorAll('.mexpress-landing__service-checkbox input[type="checkbox"]');
    serviceCheckboxes.forEach((checkbox) => {
      // Пропускаем "Особые пожелания" - они оплачиваются отдельно
      if (checkbox.name === 'service-special') {
        return;
      }
      
      if (checkbox.checked) {
        const baseValue = parseInt(checkbox.value) || 0;
        servicesPrice += baseValue;
        
        if (checkbox.name === 'service-support') {
          const select = expressLandingModal.querySelector('select[name="support-period"]');
          if (select && select.value) {
            servicesPrice += parseInt(select.value);
          }
        }
        
        if (checkbox.name === 'service-multilang') {
          const select = expressLandingModal.querySelector('select[name="multilang-count"]');
          if (select && select.value) {
            servicesPrice += parseInt(select.value);
          }
        }
      }
    });
    
    const totalPrice = basePrice + additionalPrice + servicesPrice;
    
    // Проверяем наличие особых пожеланий
    const specialCheckbox = expressLandingModal.querySelector('input[name="service-special"]');
    const hasSpecial = specialCheckbox && specialCheckbox.checked;
    
    const totalPriceElements = expressLandingModal.querySelectorAll('.mexpress-landing__total-price');
    const totalTooltipWrappers = expressLandingModal.querySelectorAll('.mexpress-landing__total-tooltip-wrapper');
    
    totalPriceElements.forEach((element) => {
      if (hasSpecial) {
        element.textContent = 'от ' + totalPrice.toLocaleString('ru-RU') + ' ₽';
      } else {
        element.textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';
      }
    });
    
    // Показываем/скрываем тултип для особых пожеланий
    totalTooltipWrappers.forEach((wrapper) => {
      if (hasSpecial) {
        wrapper.style.display = 'inline-flex';
      } else {
        wrapper.style.display = 'none';
      }
    });
  }

  expressLandingModal.addEventListener('click', function(e) {
    if (e.target.classList.contains('mexpress-landing__next-link') || e.target.closest('.mexpress-landing__next-link')) {
      e.preventDefault();
      e.stopPropagation();
      
      const nextButton = expressLandingModal.querySelector('.mexpress-landing__button--next');
      if (nextButton) {
        nextButton.click();
      }
    }

    // Проверяем клик на элемент "Добавить блок" (кроме тултипа)
    const addBlockItem = e.target.closest('.mexpress-landing__add-block-item');
    if (addBlockItem && !e.target.closest('.mexpress-landing__tooltip-wrapper')) {
      e.preventDefault();
      e.stopPropagation();
      
      const blocksContainer = expressLandingModal.querySelector('.mexpress-landing__blocks');
      if (!blocksContainer) return;
      
      const existingAdditionalBlocks = blocksContainer.querySelectorAll('.mexpress-landing__block-row[data-block-type="additional"]');
      const blockNumber = existingAdditionalBlocks.length + 6;
      
      const newBlock = document.createElement('div');
      newBlock.className = 'mexpress-landing__block-row';
      newBlock.setAttribute('data-block-type', 'additional');
      newBlock.innerHTML = `
        <label class="mexpress-landing__checkbox-label">
          <input type="checkbox" name="block-${blockNumber}" class="block-checkbox" checked>
          <span class="mexpress-landing__block-title">Доп. блок ${blockNumber - 5}</span>
        </label>
        <div class="mexpress-landing__block-type-wrapper">
          <button type="button" class="mexpress-landing__block-type-icon">⚙</button>
          <div class="mexpress-landing__tooltip-wrapper">
            <div class="mexpress-landing__tooltip-icon">?</div>
            <div class="mexpress-landing__tooltip-text">Выберите тип блока из списка (О нас, Преимущества, Отзывы и др.) или оставьте стандартное название. Мы сами подберем подходящий тип блока или.</div>
          </div>
          <div class="mexpress-landing__block-type-dropdown">
            <button type="button" class="mexpress-landing__block-type-option" data-type="">Доп. блок ${blockNumber - 5}</button>
            <button type="button" class="mexpress-landing__block-type-option" data-type="about">О нас</button>
            <button type="button" class="mexpress-landing__block-type-option" data-type="advantages">Преимущества</button>
            <button type="button" class="mexpress-landing__block-type-option" data-type="reviews">Отзывы</button>
            <button type="button" class="mexpress-landing__block-type-option" data-type="services">Услуги</button>
            <button type="button" class="mexpress-landing__block-type-option" data-type="portfolio">Портфолио/Кейсы</button>
            <button type="button" class="mexpress-landing__block-type-option" data-type="pricing">Цены/Тарифы</button>
            <button type="button" class="mexpress-landing__block-type-option" data-type="contacts">Контакты</button>
            <button type="button" class="mexpress-landing__block-type-option" data-type="form">Форма обратной связи</button>
            <button type="button" class="mexpress-landing__block-type-option" data-type="faq">FAQ/Вопросы и ответы</button>
            <button type="button" class="mexpress-landing__block-type-option" data-type="gallery">Галерея</button>
            <button type="button" class="mexpress-landing__block-type-option" data-type="team">Команда</button>
            <button type="button" class="mexpress-landing__block-type-option" data-type="blog">Блог/Новости</button>
            <button type="button" class="mexpress-landing__block-type-option" data-type="stats">Статистика/Цифры</button>
            <button type="button" class="mexpress-landing__block-type-option" data-type="modal">Модальное окно</button>
            <button type="button" class="mexpress-landing__block-type-option" data-type="other">Другое</button>
          </div>
          <input type="hidden" name="block-${blockNumber}-type" class="block-type-input" value="">
        </div>
        <input type="text" name="block-${blockNumber}-name" placeholder="Опишите блок или оставьте пустым" class="block-input">
        <div class="mexpress-landing__icons-wrapper">
          <div class="mexpress-landing__edit-icon">✎</div>
          <div class="mexpress-landing__tooltip-wrapper">
            <div class="mexpress-landing__tooltip-icon">?</div>
            <div class="mexpress-landing__tooltip-text">Опишите блок в инпуте или оставьте пустым - мы сами сделаем.</div>
          </div>
        </div>
        <button type="button" class="mexpress-landing__remove-block">×</button>
      `;
      
      blocksContainer.appendChild(newBlock);
      updateTotal();
    }
    
    if (e.target.classList.contains('mexpress-landing__remove-block') || e.target.closest('.mexpress-landing__remove-block')) {
      e.preventDefault();
      e.stopPropagation();
      
      const removeBtn = e.target.classList.contains('mexpress-landing__remove-block') ? e.target : e.target.closest('.mexpress-landing__remove-block');
      const blockRow = removeBtn.closest('.mexpress-landing__block-row');
      
      if (blockRow && blockRow.getAttribute('data-block-type') === 'additional') {
        blockRow.remove();
        updateTotal();
      }
    }

    if (e.target.classList.contains('mexpress-landing__block-type-icon')) {
      e.stopPropagation();
      e.preventDefault();
      const wrapper = e.target.closest('.mexpress-landing__block-type-wrapper');
      if (!wrapper) return;
      
      const dropdown = wrapper.querySelector('.mexpress-landing__block-type-dropdown');
      if (!dropdown) return;
      
      const allDropdowns = expressLandingModal.querySelectorAll('.mexpress-landing__block-type-dropdown');
      
      allDropdowns.forEach(d => {
        if (d !== dropdown) {
          d.classList.remove('active');
        }
      });
      
      dropdown.classList.toggle('active');
    }

    if (e.target.classList.contains('mexpress-landing__block-type-option')) {
      e.stopPropagation();
      const option = e.target;
      const dropdown = option.closest('.mexpress-landing__block-type-dropdown');
      const wrapper = dropdown.closest('.mexpress-landing__block-type-wrapper');
      const blockRow = wrapper.closest('.mexpress-landing__block-row');
      const blockTitle = blockRow.querySelector('.mexpress-landing__block-title');
      const typeInput = wrapper.querySelector('.block-type-input');
      
      const type = option.getAttribute('data-type');
      const typeText = option.textContent.trim();
      
      typeInput.value = type;
      
      if (type) {
        blockTitle.textContent = typeText;
      } else {
        const blockNumber = blockRow.querySelector('.block-checkbox').name.match(/\d+/)[0];
        const isAdditional = blockRow.getAttribute('data-block-type') === 'additional';
        blockTitle.textContent = isAdditional ? `Доп. блок ${blockNumber - 5}` : `Блок ${blockNumber}`;
      }
      
      dropdown.classList.remove('active');
    }

    if (e.target.closest('.mexpress-landing__total')) {
      e.preventDefault();
      e.stopPropagation();
      const mexpressLanding = expressLandingModal.querySelector('.mexpress-landing');
      if (mexpressLanding) {
        mexpressLanding.scrollTo({
          top: mexpressLanding.scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.mexpress-landing__block-type-wrapper')) {
      const allDropdowns = expressLandingModal.querySelectorAll('.mexpress-landing__block-type-dropdown');
      allDropdowns.forEach(d => d.classList.remove('active'));
    }
  });

  expressLandingModal.addEventListener('change', function(e) {
    if (e.target.classList.contains('block-checkbox')) {
      const blockRow = e.target.closest('.mexpress-landing__block-row');
      if (!blockRow) return;
      
      const input = blockRow.querySelector('.block-input');
      if (!input) return;
      
      if (!e.target.checked) {
        input.classList.remove('active');
        input.value = '';
      }
      
      if (blockRow.getAttribute('data-block-type') === 'additional') {
        updateTotal();
      }
    } else if (e.target.name === 'header' || e.target.name === 'footer') {
      const item = e.target.closest('.mexpress-landing__item');
      if (!item) return;
      
      const input = item.querySelector('.mexpress-landing__item-input');
      if (!input) return;
      
      if (!e.target.checked) {
        input.classList.remove('active');
        input.value = '';
      }
    } else if (e.target.name === 'version') {
      updateTotal();
    } else if (e.target.closest('.mexpress-landing__service-checkbox')) {
      const checkbox = e.target;
      const serviceItem = checkbox.closest('.mexpress-landing__service-item');
      
        if (checkbox.name === 'service-support') {
          const select = serviceItem.querySelector('select[name="support-period"]');
          const priceElement = serviceItem.querySelector('.mexpress-landing__service-price--select');
          if (select) {
            select.disabled = !checkbox.checked;
            if (!checkbox.checked) {
              select.value = '';
              if (priceElement) {
                priceElement.style.display = 'none';
              }
            } else {
              if (!select.value || select.value === '') {
                select.value = '1500';
              }
              updateSelectPrice(select, priceElement);
            }
          }
        }
        
        if (checkbox.name === 'service-multilang') {
          const select = serviceItem.querySelector('select[name="multilang-count"]');
          const priceElement = serviceItem.querySelector('.mexpress-landing__service-price--select');
          if (select) {
            select.disabled = !checkbox.checked;
            if (!checkbox.checked) {
              select.value = '';
              if (priceElement) {
                priceElement.style.display = 'none';
              }
            } else {
              if (!select.value || select.value === '') {
                select.value = '2000';
              }
              updateSelectPrice(select, priceElement);
            }
          }
        }
      
      if (checkbox.name === 'service-special') {
        const textarea = serviceItem.querySelector('textarea[name="special-requests"]');
        if (textarea) {
          if (checkbox.checked) {
            textarea.style.display = 'block';
          } else {
            textarea.style.display = 'none';
            textarea.value = '';
          }
        }
      }
      
      updateTotal();
    } else if (e.target.name === 'support-period' || e.target.name === 'multilang-count') {
      const select = e.target;
      const serviceItem = select.closest('.mexpress-landing__service-item');
      const priceElement = serviceItem ? serviceItem.querySelector('.mexpress-landing__service-price--select') : null;
      updateSelectPrice(select, priceElement);
      updateTotal();
    }
  });
  
  
  updateTotal();
}
expressLandingCalculator();

const expressLandingModal = document.querySelector('[data-modal-block="express-landing"]');
if (expressLandingModal) {
  expressLandingModal.addEventListener('click', function(e) {
    if (e.target.closest('.mexpress-landing__included-toggle')) {
      const toggle = e.target.closest('.mexpress-landing__included-toggle');
      const includedServices = toggle.closest('.mexpress-landing__included-services');
      if (includedServices) {
        includedServices.classList.toggle('active');
      }
    }
  });
}

function expressLandingForm() {
  const expressLandingForm = document.querySelector('#express-landing-form');
  const expressLandingModal = document.querySelector('[data-modal-block="express-landing"]');
  
  if (!expressLandingForm) return;

  const step1 = expressLandingForm.querySelector('.mexpress-landing__step--1');
  const step2 = expressLandingForm.querySelector('.mexpress-landing__step--2');
  const step3 = expressLandingForm.querySelector('.mexpress-landing__step--3');
  const nextButtons = expressLandingForm.querySelectorAll('.mexpress-landing__button--next');
  const backButtons = expressLandingForm.querySelectorAll('.mexpress-landing__button--back');

  nextButtons.forEach((btn) => {
    btn.addEventListener('click', function() {
      const mexpressLanding = expressLandingModal ? expressLandingModal.querySelector('.mexpress-landing') : null;
      
      if (step1.classList.contains('active')) {
        step1.classList.remove('active');
        step2.classList.add('active');
        // Прокрутка вверх при переходе с первого этапа
        if (mexpressLanding) {
          mexpressLanding.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      } else if (step2.classList.contains('active')) {
        step2.classList.remove('active');
        step3.classList.add('active');
        // Прокрутка вверх при переходе со второго этапа
        if (mexpressLanding) {
          mexpressLanding.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  backButtons.forEach((btn) => {
    btn.addEventListener('click', function() {
      if (step3.classList.contains('active')) {
        step3.classList.remove('active');
        step2.classList.add('active');
      } else if (step2.classList.contains('active')) {
        step2.classList.remove('active');
        step1.classList.add('active');
      }
    });
  });

  expressLandingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(expressLandingForm);

    const expressLandingModal = document.querySelector('[data-modal-block="express-landing"]');
    
    const totalPriceElement = expressLandingModal.querySelector('.mexpress-landing__total-price');
    const totalPrice = totalPriceElement ? totalPriceElement.textContent.trim() : '0 ₽';
    
    const blocks = [];
    const blockRows = expressLandingModal.querySelectorAll('.mexpress-landing__block-row');
    blockRows.forEach((blockRow) => {
      const checkbox = blockRow.querySelector('.block-checkbox');
      if (checkbox && checkbox.checked) {
        const blockNumber = checkbox.name.match(/\d+/)[0];
        const typeInput = blockRow.querySelector('.block-type-input');
        const blockInput = blockRow.querySelector('.block-input');
        const blockType = typeInput ? typeInput.value : '';
        const blockName = blockInput ? blockInput.value.trim() : '';
        const isAdditional = blockRow.getAttribute('data-block-type') === 'additional';
        
        blocks.push({
          number: blockNumber,
          type: blockType,
          description: blockName,
          isAdditional: isAdditional
        });
      }
    });

    const headerCheckbox = expressLandingModal.querySelector('input[name="header"]');
    const headerName = expressLandingModal.querySelector('input[name="header-name"]');
    const footerCheckbox = expressLandingModal.querySelector('input[name="footer"]');
    const footerName = expressLandingModal.querySelector('input[name="footer-name"]');

    const versionInput = expressLandingModal.querySelector('input[name="version"]:checked');
    
    const additionalServices = [];
    const serviceCheckboxes = expressLandingModal.querySelectorAll('.mexpress-landing__service-checkbox input[type="checkbox"]');
    serviceCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const serviceItem = checkbox.closest('.mexpress-landing__service-item');
        const serviceCheckboxLabel = checkbox.closest('.mexpress-landing__service-checkbox');
        const serviceNameSpan = serviceCheckboxLabel ? serviceCheckboxLabel.querySelector('span:not(.mexpress-landing__service-price)') : null;
        const serviceName = serviceNameSpan ? serviceNameSpan.textContent.trim() : '';
        let serviceValue = checkbox.value;
        
        if (checkbox.name === 'service-support') {
          const select = expressLandingModal.querySelector('select[name="support-period"]');
          if (select && select.value) {
            serviceValue = select.value;
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption) {
              const dataWeeks = selectedOption.getAttribute('data-weeks');
              const dataMonths = selectedOption.getAttribute('data-months');
              if (dataWeeks) {
                serviceValue += ` (${dataWeeks} неделя)`;
              } else if (dataMonths) {
                serviceValue += ` (${dataMonths} месяц)`;
              }
            }
          }
        }
        
        if (checkbox.name === 'service-multilang') {
          const select = expressLandingModal.querySelector('select[name="multilang-count"]');
          if (select && select.value) {
            serviceValue = select.value;
            const selectedOption = select.options[select.selectedIndex];
            if (selectedOption) {
              const dataCount = selectedOption.getAttribute('data-count');
              if (dataCount) {
                serviceValue += ` (${dataCount} язык)`;
              }
            }
          }
        }
        
        if (checkbox.name === 'service-special') {
          const textarea = expressLandingModal.querySelector('textarea[name="special-requests"]');
          if (textarea && textarea.value.trim()) {
            serviceValue = textarea.value.trim();
          }
        }
        
        additionalServices.push({
          name: serviceName,
          value: serviceValue
        });
      }
    });

    formData.append('form_type', 'express-landing');
    formData.append('total_price', totalPrice);
    formData.append('header', headerCheckbox && headerCheckbox.checked ? '1' : '0');
    formData.append('header_name', headerName ? headerName.value.trim() : '');
    formData.append('footer', footerCheckbox && footerCheckbox.checked ? '1' : '0');
    formData.append('footer_name', footerName ? footerName.value.trim() : '');
    formData.append('blocks', JSON.stringify(blocks));
    formData.append('version', versionInput ? versionInput.value : '');
    formData.append('additional_services', JSON.stringify(additionalServices));

    let res = await fetch('php/send.php', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    console.log(data);

    if (data.ok) {
      alert('Заявка отправлена! Мы свяжемся с вами в ближайшее время.');
      expressLandingForm.reset();
      if (step3) step3.classList.remove('active');
      if (step2) step2.classList.remove('active');
      if (step1) step1.classList.add('active');
      const modal = document.querySelector('[data-modal-block="express-landing"]');
      if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    } else {
      alert('Произошла ошибка. Попробуйте позже.');
    }
  });
}
expressLandingForm();

/* ========== END EXPRESS LANDING CALCULATOR ========== */

/* ========== ANCHOR LINK HANDLER ========== */
function handleExpressLandingAnchor() {
  const hash = window.location.hash;
  
  if (hash === '#express-landing') {
    const expressLandingSection = document.querySelector('#express-landing');
    const expressLandingModal = document.querySelector('[data-modal-block="express-landing"]');
    
    if (expressLandingSection) {
      setTimeout(() => {
        expressLandingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        if (expressLandingModal) {
          setTimeout(() => {
            expressLandingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
          }, 500);
        }
      }, 100);
    }
  }
}

window.addEventListener('load', handleExpressLandingAnchor);
window.addEventListener('hashchange', handleExpressLandingAnchor);

document.addEventListener('click', function(e) {
  if (e.target.closest('a[href="#express-landing"]')) {
    e.preventDefault();
    const expressLandingSection = document.querySelector('#express-landing');
    const expressLandingModal = document.querySelector('[data-modal-block="express-landing"]');
    
    if (expressLandingSection) {
      expressLandingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      if (expressLandingModal) {
        setTimeout(() => {
          expressLandingModal.classList.add('active');
          document.body.style.overflow = 'hidden';
        }, 500);
      }
    }
    
    window.history.pushState(null, null, '#express-landing');
  }
});
/* ========== END ANCHOR LINK HANDLER ========== */
