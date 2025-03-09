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
    if (e.target.className.includes('modal-wrapper')) {
      modal.classList.remove('active');
      document.body.classList.remove('scroll-off');
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

      // If state active hide body scroll
      if (
        block.className.includes('active') &&
        block.className.includes('modal')
      ) {
        document.body.classList.add('scroll-off');
      } else {
        document.body.classList.remove('scroll-off');
      }
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
  // const tabsItems = document.querySelectorAll('.tabs__item');
  // const tabsContent = document.querySelectorAll('.tabs__content');

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
