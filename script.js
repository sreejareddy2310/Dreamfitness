// ======================================================
//  WAIT FOR DOM BEFORE ACCESSING ELEMENTS
// ======================================================
document.addEventListener("DOMContentLoaded", function () {

  // ----- AUTH ELEMENTS -----
  const loginBtn = document.querySelector(".login-btn");
  const signupBtn = document.querySelector(".signup-btn");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const loginFormElement = document.getElementById("loginFormElement");
  const signupFormElement = document.getElementById("signupFormElement");
  const authButtons = document.querySelector(".auth-buttons");
  const privateLinks = document.querySelector(".private-links");
  const menuToggle = document.getElementById("menu-toggle");
  const menuItems = document.getElementById("primary-nav");
  const body = document.body;


  // ======================================================
  //  MODALS OPEN / CLOSE
  // ======================================================
  loginBtn?.addEventListener("click", () => {
    body.classList.add("glassy-active");
    loginForm.hidden = false;
    signupForm.hidden = true;
  });

  signupBtn?.addEventListener("click", () => {
    body.classList.add("glassy-active");
    signupForm.hidden = false;
    loginForm.hidden = true;
  });

  window.addEventListener("click", (e) => {
    if (e.target === loginForm || e.target === signupForm) closeGlassy();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeGlassy();
  });

  function closeGlassy() {
    body.classList.remove("glassy-active");
    loginForm.hidden = true;
    signupForm.hidden = true;
  }
document.querySelectorAll(".menu-items a").forEach(a => {
  a.addEventListener("click", () => {
    document.body.classList.remove("glassy-active");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");
    if (loginForm) loginForm.hidden = true;
    if (signupForm) signupForm.hidden = true;
  });
});


  // ======================================================
  //  LOGIN FORM SUBMIT
  // ======================================================
  loginFormElement?.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
      alert("Please enter both username and password.");
      return;
    }

    sessionStorage.setItem("loggedInUser", username);
    updateUI(username);
    closeGlassy();
    loginFormElement.reset();
  });


  // ======================================================
  //  SIGNUP FORM SUBMIT
  // ======================================================
  signupFormElement?.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const p1 = document.getElementById("newPassword").value;
    const p2 = document.getElementById("confirmPassword").value;

    if (!email || !p1 || !p2) return alert("All fields required.");
    if (p1 !== p2) return alert("Passwords do not match.");

    alert("Account created for " + email);
    closeGlassy();
    signupFormElement.reset();
  });


  // ======================================================
  //  RESTORE LOGIN SESSION
  // ======================================================
  const existing = sessionStorage.getItem("loggedInUser");
  if (existing) updateUI(existing);

  function updateUI(username) {
    authButtons.innerHTML = `
      <span style="color:white;font-weight:700;">👤 ${username}</span>
      <button class="logout-btn"
        style="margin-left:10px;padding:6px 12px;background:#ff2b2b;border:none;border-radius:8px;color:white;">
        Logout
      </button>
    `;

    document.querySelector(".logout-btn").addEventListener("click", () => {
      sessionStorage.removeItem("loggedInUser");
      location.reload();
    });

    if (privateLinks) privateLinks.style.display = "inline-flex";
  }


  // ======================================================
  //  NAVIGATION SMOOTH SCROLL
  // ======================================================
  document.querySelectorAll("a[href^='#']").forEach(link => {
    link.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;

      e.preventDefault();

      menuItems.classList.remove("active");
      body.classList.remove("menu-open");

      const header = document.querySelector(".menu-bar");
      const offset = header ? header.offsetHeight : 0;

      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: "smooth" });
    });
  });


  // ======================================================
  // ⭐ FIXED: VIEW PRICING BUTTON
  // ======================================================
  const viewBtn = document.querySelector(".view-price-btn");

  if (viewBtn) {
    viewBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const pricing = document.getElementById("pricing");
      if (!pricing) return;

      const header = document.querySelector(".menu-bar");
      const offset = header ? header.offsetHeight : 0;

      const top = pricing.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: "smooth" });
    });
  }


  // ======================================================
  //  MOBILE MENU
  // ======================================================
  menuToggle?.addEventListener("click", () => {
    const open = menuItems.classList.toggle("active");
    body.classList.toggle("menu-open", open);
  });

  menuItems?.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menuItems.classList.remove("active");
      body.classList.remove("menu-open");
    });
  });


  // ======================================================
  //  PROGRAM CAROUSEL — HORIZONTAL SCROLL
  // ======================================================
  const carousel = document.querySelector(".program-carousel");
  if (carousel) {
    carousel.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) > 1) {
        e.preventDefault();
        carousel.scrollLeft += e.deltaY * 1.2;
      }
    }, { passive: false });
  }


  // ======================================================
  //  SETTINGS PANELS
  // ======================================================
  document.querySelectorAll(".toggle-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const el = document.getElementById(btn.dataset.target);
      if (el) el.hidden = !el.hidden;
    });
  });


  // ======================================================
  //  INIT 3D ROTATING WHEEL
  // ======================================================
  init3DWheel();

}); // DOMContentLoaded END



// ======================================================
//  DELETE ACCOUNT
// ======================================================
function confirmDelete() {
  if (confirm("Are you sure? This cannot be undone.")) {
    sessionStorage.clear();
    location.reload();
  }
}



// ======================================================
//  3D POSTER WHEEL ENGINE
// ======================================================
function init3DWheel() {
  const wheel = document.getElementById("wheel");
  if (!wheel) return;

  const items = [...wheel.querySelectorAll(".wheel-item")];
  const N = items.length;
  const step = 360 / N;

  let rotation = 0;
  let last = performance.now();
  let running = true;

  function getRadius() {
    const item = items[0];
    const w = item ? item.getBoundingClientRect().width : 180;
    return Math.max(200, (w / 2) / Math.tan(Math.PI / N));  // FIXED (prevents touching)
  }

  let R = getRadius();

  function layout() {
    R = getRadius();

    items.forEach((item, i) => {
      const angle = i * step;
      item.style.transform =
        `translate(-50%,-50%) rotateY(${angle}deg) translateZ(${R}px)`;

      const inner = item.querySelector(".wheel-item-inner");
      inner.style.transform = `rotateY(${-angle}deg)`;
    });
  }

  layout();

  function getFrontIndex(rot) {
    const norm = ((rot % 360) + 360) % 360;

    let best = 0, minDiff = 999;
    for (let i = 0; i < N; i++) {
      let d = (i * step + norm) % 360;
      if (d > 180) d -= 360;
      if (Math.abs(d) < minDiff) {
        minDiff = Math.abs(d);
        best = i;
      }
    }
    return best;
  }

  function animate(now) {
    const dt = (now - last) / 1000;
    last = now;

    if (running) {
      rotation += 12 * dt;
      wheel.style.transform =
        `translate(-50%,-50%) rotateY(${-rotation}deg)`;

      const front = getFrontIndex(rotation);
      items.forEach((el, idx) =>
        el.classList.toggle("front", idx === front)
      );
    }

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);


  const viewport = wheel.closest(".wheel-viewport");

  viewport.addEventListener("mouseenter", () => { running = false; });
  viewport.addEventListener("mouseleave", () => {
    running = true;
    last = performance.now();
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 200);
  });
}
