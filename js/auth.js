(() => {
  const AUTH_KEY = "seb_auth_user";

  function isInPagesDir() {
    return window.location.pathname.toLowerCase().includes("/pages/");
  }

  function normalizePagePath(path) {
    if (!path) return "";
    if (/^(https?:)?\/\//i.test(path) || path.startsWith("#")) return path;

    const clean = path.replace(/^\.?\//, "").replace(/^pages\//, "");
    return isInPagesDir() ? clean : `pages/${clean}`;
  }

  function getHomePath() {
    return isInPagesDir() ? "../index.html" : "index.html";
  }

  function getProfilePath() {
    return isInPagesDir() ? "kho-ca-nhan.html" : "pages/kho-ca-nhan.html";
  }

  function getLoginPath() {
    return isInPagesDir() ? "login.html" : "pages/login.html";
  }

  function getUser() {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function isLoggedIn() {
    return !!getUser();
  }

  function login(userInfo) {
    localStorage.setItem(
      AUTH_KEY,
      JSON.stringify({
        email: userInfo.email,
        name: userInfo.name || "Người dùng SEB",
        loggedAt: new Date().toISOString(),
      })
    );
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY);
    window.location.href = getHomePath();
  }

  function applyGuard() {
    const requireAuth = document.body?.dataset?.requireAuth === "true";
    if (!requireAuth || isLoggedIn()) return;

    const redirectTarget = document.body?.dataset?.authRedirect || "login-request.html";
    window.location.href = normalizePagePath(redirectTarget);
  }

  function syncHeaderActions() {
    const loginLinks = document.querySelectorAll('a[href$="login.html"]');
    if (isLoggedIn()) {
      loginLinks.forEach((link) => {
        link.setAttribute("href", getProfilePath());
        link.setAttribute("aria-label", "Kho cá nhân");
        link.setAttribute("title", "Kho cá nhân");
      });
    } else {
      loginLinks.forEach((link) => {
        link.setAttribute("href", getLoginPath());
        link.setAttribute("aria-label", "Đăng nhập");
        link.setAttribute("title", "Đăng nhập");
      });
    }
  }

  function mountLogoutButton() {
    if (!isLoggedIn()) return;

    const actions = document.querySelector(".banner__actions");
    if (!actions || actions.querySelector('[data-auth="logout"]')) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "banner__action";
    btn.setAttribute("data-auth", "logout");
    btn.setAttribute("aria-label", "Đăng xuất");
    btn.setAttribute("title", "Đăng xuất");
    btn.textContent = "⎋";
    btn.addEventListener("click", logout);
    actions.appendChild(btn);
  }

  window.SEBAuth = {
    getUser,
    isLoggedIn,
    login,
    logout,
  };

  document.addEventListener("DOMContentLoaded", () => {
    applyGuard();
    syncHeaderActions();
    mountLogoutButton();
  });
})();