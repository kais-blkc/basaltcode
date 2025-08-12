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
let btnOpenModal = document.querySelectorAll('*[data-modal-open]');
const btnCloseModal = document.querySelectorAll('*[data-modal-close]');
const btnBlockModal = document.querySelectorAll('*[data-modal-block]');
const modals = document.querySelectorAll('.modal-wrapper');

btnOpenModal.forEach((btn) => {
  btn.addEventListener('click', toggleModalClass);
});
btnCloseModal.forEach((btn) => {
  btn.addEventListener('click', toggleModalClass);
});

modals.forEach((modal) => {
  modal.addEventListener('click', (e) => {
    console.log(e.target.className);
    if (e.target.className.includes('modal-wrapper')) {
      modal.classList.remove('active');
    }
  });
});

function toggleModalClass() {
  btnBlockModal.forEach((block) => {
    if (
      this.dataset.modalOpen === block.dataset.modalBlock ||
      this.dataset.modalClose === block.dataset.modalBlock
    ) {
      block.classList.toggle('active');
      this.classList.toggle('active');
    }
  });
}
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
        tabsItems?.forEach((item) => {
          item.classList.remove('active');
        });

        tabsContent?.forEach((content) => {
          content.classList.remove('active');
        });

        e.target.classList.add('active');

        tab
          .querySelector(`[data-tabs-content="${e.target.dataset.tabsTitle}"]`)
          ?.classList.add('active');
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
