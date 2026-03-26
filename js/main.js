(() => {
  // Danh sách các tab (Tabs list)
  const tabs = Array.from(document.querySelectorAll('[data-tab]'));
  // Form tìm kiếm (Search form)
  const searchForm = document.querySelector('[data-search-form]');
  // Ô nhập liệu tìm kiếm (Search input)
  const searchInput = document.querySelector('[data-search-input]');

  // Hàm thiết lập tab hoạt động (Set active tab function)
  function setActiveTab(tabEl) {
    // Loại bỏ lớp hoạt động khỏi tất cả các tab (Remove active class from all tabs)
    tabs.forEach((t) => t.classList.remove('tab--active'));
    // Thêm lớp hoạt động vào tab được chọn (Add active class to selected tab)
    tabEl.classList.add('tab--active');
  }

  // Xử lý sự kiện nhấp vào tab (Handle tab click events)
  tabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      // Lấy href của tab (Get tab href)
      const href = tab.getAttribute('href');
      // Nếu href là link thực sự (pages/...), cho phép navigate (Allow navigation if real link)
      if (href && !href.startsWith('#')) {
        return;  // Không prevent, cho browser navigate bình thường
      }
      // Nếu là hash link (#), prevent và update active tab (Prevent for hash links)
      e.preventDefault();
      setActiveTab(tab);
    });
  });

  // Xử lý form tìm kiếm (Handle search form)
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Lấy giá trị tìm kiếm và loại bỏ khoảng trắng (Get search value and trim spaces)
      const q = (searchInput.value || '').trim();
      if (!q) return;
      // Hành động tạm thời: giữ UX tối thiểu, không có modal bổ sung (Placeholder behavior)
      console.log('search:', q);
      searchInput.blur();
    });

    // Cho phép nhấp vào vùng form để tập trung vào ô nhập liệu (Allow clicking form to focus input)
    searchForm.addEventListener('click', (e) => {
      const target = e.target;
      if (target && target.closest && target.closest('button')) return;
      // Tập trung vào ô tìm kiếm (Focus on search input)
      searchInput.focus();
    });
  }
})();
