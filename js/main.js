(() => {
  // Danh sÃ¡ch cÃ¡c tab (Tabs list)
  const tabs = Array.from(document.querySelectorAll('[data-tab]'));
  // Form tÃ¬m kiáº¿m (Search form)
  const searchForm = document.querySelector('[data-search-form]');
  // Ã” nháº­p liá»‡u tÃ¬m kiáº¿m (Search input)
  const searchInput = document.querySelector('[data-search-input]');

  // HÃ m thiáº¿t láº­p tab hoáº¡t Ä‘á»™ng (Set active tab function)
  function setActiveTab(tabEl) {
    // Loáº¡i bá» lá»›p hoáº¡t Ä‘á»™ng khá»i táº¥t cáº£ cÃ¡c tab (Remove active class from all tabs)
    tabs.forEach((t) => t.classList.remove('tab--active'));
    // ThÃªm lá»›p hoáº¡t Ä‘á»™ng vÃ o tab Ä‘Æ°á»£c chá»n (Add active class to selected tab)
    tabEl.classList.add('tab--active');
  }

  // Tá»± Ä‘á»™ng thiáº¿t láº­p active tab dá»±a trÃªn Ä‘Æ°á»ng dáº«n hiá»‡n táº¡i
  // (Auto set active tab based on current path)
  function initializeActiveTab() {
    const currentPath = window.location.pathname;
    let activeTabFound = false;

    tabs.forEach((tab) => {
      const href = tab.getAttribute('href');
      
      // Kiá»ƒm tra match vá»›i path hiá»‡n táº¡i
      if (href && currentPath.includes(href.replace('../', '').replace('/', ''))) {
        setActiveTab(tab);
        activeTabFound = true;
      }
    });

    // Náº¿u chÆ°a tÃ¬m tháº¥y, kiá»ƒm tra Ä‘Æ¡n giáº£n hÆ¡n
    if (!activeTabFound) {
      tabs.forEach((tab) => {
        const href = tab.getAttribute('href');
        // Náº¿u trong index.html (root), set Trang chá»§ active
        if (currentPath.endsWith('index.html') && href.includes('index.html')) {
          setActiveTab(tab);
        }
        // Kiá»ƒm tra tÃªn file
        else if (href && currentPath.includes(href.split('/').pop())) {
          setActiveTab(tab);
        }
      });
    }
  }

  // Khá»Ÿi táº¡o active tab lÃºc táº£i trang (Initialize on page load)
  initializeActiveTab();

  // Xá»­ lÃ½ sá»± kiá»‡n nháº¥p vÃ o tab (Handle tab click events)
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      // Láº¥y href cá»§a tab (Get tab href)
      const href = tab.getAttribute('href');
      // Náº¿u href lÃ  link thá»±c sá»± (pages/...), cho phÃ©p navigate (Allow navigation if real link)
      if (href && !href.startsWith('#')) {
        return;  // KhÃ´ng prevent, cho browser navigate bÃ¬nh thÆ°á»ng
      }
      // Náº¿u lÃ  hash link (#), prevent vÃ  update active tab (Prevent for hash links)
      e.preventDefault();
      setActiveTab(tab);
    });
  });

  // Xá»­ lÃ½ form tÃ¬m kiáº¿m (Handle search form)
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Láº¥y giÃ¡ trá»‹ tÃ¬m kiáº¿m vÃ  loáº¡i bá» khoáº£ng tráº¯ng (Get search value and trim spaces)
      const q = (searchInput.value || '').trim();
      if (!q) return;
      // HÃ nh Ä‘á»™ng táº¡m thá»i: giá»¯ UX tá»‘i thiá»ƒu, khÃ´ng cÃ³ modal bá»• sung (Placeholder behavior)
      console.log('search:', q);
      searchInput.blur();
    });

    // Cho phÃ©p nháº¥p vÃ o vÃ¹ng form Ä‘á»ƒ táº­p trung vÃ o Ã´ nháº­p liá»‡u (Allow clicking form to focus input)
    searchForm.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.closest && target.closest('button')) return;
      // Táº­p trung vÃ o Ã´ tÃ¬m kiáº¿m (Focus on search input)
      searchInput.focus();
    });
  }

  // Xử lý menu hamburger trên mobile (Handle mobile hamburger menu)
  const toggleBtns = document.querySelectorAll('.navbar__toggle');
  const navTabsLists = document.querySelectorAll('.navbar__tabs');
  
  if (toggleBtns.length > 0 && navTabsLists.length > 0) {
    toggleBtns.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        // Lấy danh sách tabs tương ứng hoặc kế tiếp (Get corresponding tabs)
        const tabsList = btn.nextElementSibling || navTabsLists[index] || navTabsLists[0];
        if (tabsList) {
          tabsList.classList.toggle('is-active');
        }
      });
    });
  }

  // Điều hướng carousel thiết bị mượn gần đây (index)
  const recentCarousel = document.getElementById('recentCarousel');
  const recentPrev = document.getElementById('recentPrev');
  const recentNext = document.getElementById('recentNext');

  if (recentCarousel && recentPrev && recentNext) {
    const getScrollAmount = () => {
      const firstCard = recentCarousel.querySelector('.recent-card');
      if (!firstCard) return 26 * 16;

      const cardWidth = firstCard.getBoundingClientRect().width;
      const style = window.getComputedStyle(recentCarousel);
      const gap = parseFloat(style.columnGap || style.gap || '0') || 0;
      return cardWidth + gap;
    };

    recentPrev.addEventListener('click', () => {
      recentCarousel.scrollBy({
        left: -getScrollAmount(),
        behavior: 'smooth',
      });
    });

    recentNext.addEventListener('click', () => {
      recentCarousel.scrollBy({
        left: getScrollAmount(),
        behavior: 'smooth',
      });
    });
  }

  // Modal chi tiết thiết bị cho recent-card (index.html)
  (function() {
    // Tạo modal nếu chưa có
    let modal = document.getElementById('deviceModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'deviceModal';
      modal.style.display = 'none';
      modal.style.position = 'fixed';
      modal.style.top = '0';
      modal.style.left = '0';
      modal.style.width = '100vw';
      modal.style.height = '100vh';
      modal.style.background = 'rgba(0,0,0,0.4)';
      modal.style.zIndex = '9999';
      modal.innerHTML = `
        <div style="background:#fff;max-width:400px;margin:8vh auto 0;padding:2rem 1.5rem;border-radius:1rem;position:relative;box-shadow:0 2px 16px #0002;">
          <button id="closeDeviceModal" style="position:absolute;top:0.5rem;right:0.5rem;font-size:1.5rem;background:none;border:none;cursor:pointer;">&times;</button>
          <div id="deviceModalContent"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    // Đóng modal
    document.getElementById('closeDeviceModal')?.addEventListener('click', function() {
      modal.style.display = 'none';
    });
    // Xử lý click recent-card
    document.querySelectorAll('.recent-card').forEach(card => {
      card.addEventListener('click', function() {
        const img = card.querySelector('img');
        const title = card.querySelector('.recent-card__title')?.textContent || '';
        const time = card.querySelector('.recent-card__time')?.textContent || '';
        document.getElementById('deviceModalContent').innerHTML = `
          <img src="${img?.src || ''}" alt="${img?.alt || ''}" style="width:100%;border-radius:0.5rem;margin-bottom:1rem;">
          <h2 style="margin:0 0 0.5rem 0;">${title}</h2>
          <div style="color:#888;font-size:0.95rem;margin-bottom:1rem;">${time}</div>
          <div style="color:#333;">Thông tin chi tiết thiết bị sẽ được cập nhật sau.</div>
        `;
        modal.style.display = 'block';
      });
    });
    // Đóng modal khi click nền tối
    modal.addEventListener('click', function(e) {
      if (e.target === modal) modal.style.display = 'none';
    });
  })();
})();
