(() => {
  const tabs = Array.from(document.querySelectorAll('[data-tab]'));
  const searchForm = document.querySelector('[data-search-form]');
  const searchInput = document.querySelector('[data-search-input]');

  function setActiveTab(tabEl) {
    tabs.forEach((t) => t.classList.remove('tab--active'));
    tabEl.classList.add('tab--active');
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      setActiveTab(tab);
    });
  });

  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = (searchInput.value || '').trim();
      if (!q) return;
      // Placeholder behavior: keep UX minimal, no extra modal.
      console.log('search:', q);
      searchInput.blur();
    });

    // Allow clicking the pill area to focus input.
    searchForm.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.closest && target.closest('button')) return;
      searchInput.focus();
    });
  }
})();
