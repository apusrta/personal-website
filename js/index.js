// js/main.js

// caching
const sections = document.querySelectorAll("section");
const header = document.querySelector("header");

let currentIndex = 0;
let isScrolling = false;

function clamp(i) {
  return Math.max(0, Math.min(i, sections.length - 1));
}

function scrollToSection(index) {
  index = clamp(index);
  if (index === currentIndex || isScrolling) return;
  isScrolling = true;
  currentIndex = index;

  window.scrollTo({
    top: sections[currentIndex].offsetTop,
    behavior: "smooth"
  });

  setTimeout(() => {
    isScrolling = false;
  }, 800); // sesuaikan durasi animasi
}


// wheel (non-passive agar bisa preventDefault)
function onWheel(e) {
  e.preventDefault();
  if (isScrolling) return;

  if (e.deltaY > 0) {
    scrollToSection(currentIndex + 1);
  } else if (e.deltaY < 0) {
    scrollToSection(currentIndex - 1);
  }
}
window.addEventListener("wheel", onWheel, { passive: false });

window.addEventListener("keydown", (e) => {
  if (isScrolling) return;

  if (["ArrowDown","PageDown"].includes(e.key)) {
    e.preventDefault();
    scrollToSection(currentIndex + 1);
  }
  if (["ArrowUp","PageUp"].includes(e.key)) {
    e.preventDefault();
    scrollToSection(currentIndex - 1);
  }
});


// nav links
document.querySelectorAll("nav a").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const id = link.getAttribute("href").replace("#", "");
    const idx = Array.from(sections).findIndex(s => s.id === id);
    if (idx >= 0) scrollToSection(idx);
  });
});

// IntersectionObserver untuk update header dan garis hover
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;

    switch (id) {
      case "beranda":
        header.style.background = "transparent";
        document.documentElement.style.setProperty('--nav-underline', '#f4abb3ff'); // pink
        break;
      case "tentang":
        header.style.background = "transparent";
        document.documentElement.style.setProperty('--nav-underline', '#66bbdfff'); // hijau tua
        break;
      case "penjualan":
        header.style.background = "transparent";
        document.documentElement.style.setProperty('--nav-underline', 'rgb(250, 265, 80)'); // hijau gelap
        break;
      default:
        header.style.background = "transparent";
        document.documentElement.style.setProperty('--nav-underline', '#73cd76ff');
    }

    // update currentIndex agar sinkron bila user scroll manual
    currentIndex = Array.from(sections).indexOf(entry.target);
  });
}, { threshold: 0.6 });

sections.forEach(s => io.observe(s));

// ===================== ENTANG =====================

//-----images-----

const stack = document.querySelector(".image-stack");

function rotateStack() {
  const imgs = stack.querySelectorAll("img"); // ambil urutan terbaru
  const front = imgs[0]; // gambar paling depan

  // animasi geser ke kanan
  front.style.transform = "translateX(300px) rotate(0deg)";
  front.style.opacity = 0;

  setTimeout(() => {
    // pindahkan ke belakang stack
    front.style.transition = "none";
    front.style.transform = "rotate(10deg) translateX(0)"; // belakang miring kanan
    front.style.opacity = 1;
    stack.appendChild(front);

    // reset transition dan atur tumpukan baru
    setTimeout(() => {
      const newImgs = stack.querySelectorAll("img");
      newImgs.forEach((img, i) => {
        img.style.transition = "transform 0.8s ease, opacity 0.8s ease";
        if(i === 0) img.style.transform = "rotate(0deg)";   // paling depan
        if(i === 1) img.style.transform = "rotate(-10deg)";  // tengah
        if(i === 2) img.style.transform = "rotate(10deg)";   // belakang
      });
    }, 50);

  }, 800); // durasi animasi
}

function updateStackStyle() {
  const imgs = stack.querySelectorAll("img");
  
  imgs.forEach((img, i) => {
    img.style.transition = "transform 0.8s ease, opacity 0.8s ease";

    // Set rotasi
    if(i === 0) img.style.transform = "rotate(0deg)";
    if(i === 1) img.style.transform = "rotate(-10deg)";
    if(i === 2) img.style.transform = "rotate(10deg)";

    // Set border & shadow sesuai gambar (bisa disesuaikan tiap index)
    if(i === 0) {
      img.style.border = "8px solid #deef72ff";
    } else if(i === 1) {
      img.style.border = "8px solid #90c692ff";
    } else if(i === 2) {
      img.style.border = "8px solid #efbdc2ff";
    }
  });
}

// panggil setelah swap/rotate
setTimeout(() => {
  updateStackStyle();
}, 50);


// jalankan setiap 3 detik
setInterval(rotateStack, 4500);

// ------------------ TEKS ------------------


// =====================BERANDA=====================
// const helloText = document.getElementById("hello-text");
// const welcomeText = document.getElementById("welcome-text");

// const greetings = ["Hai", "Hello", "Hola", "Bonjour", "مرحبا", "Kamusta", "Ciao", "こんにちは", "Xin chào", "你好", "안녕하세요", "Salut", "Привет", "Hej", "Olá", "नमस्ते", "สวัสดี"];
// const welcomes = ["Selamat Datang", "Welcome", "Bienvenido", "Bienvenue", "أهلا وسهلا", "Maligayang Pagdating", "Benvenuto", "ようこそ", "Chào mừng", "欢迎", "환영합니다", "Bienvenue", "Добро пожаловать", "Välkommen", "Bem-vindo", "स्वागत है", "ยินดีต้อนรับ"];

// let indexhello = -1;

// function changeText() {
//   helloText.style.opacity = 0;
//   welcomeText.style.opacity = 0;

//   setTimeout(() => {
//     indexhello = (indexhello + 1) % greetings.length;
//     helloText.textContent = greetings[indexhello];
//     welcomeText.textContent = welcomes[indexhello];

//     helloText.style.opacity = 1;
//     welcomeText.style.opacity = 1;

//     setTimeout(changeText, 2000);
//   }, 500);
// }

// changeText();
// ========== GRID KOTAK ==========
const canvas = document.getElementById("bubbleCanvas");
const ctx = canvas.getContext("2d");

let mouse = { x: null, y: null, active: false };
let prevMouse = { x: null, y: null };

window.addEventListener("mousemove", (e) => {
  prevMouse.x = mouse.x;
  prevMouse.y = mouse.y;

  mouse.x = e.clientX;
  mouse.y = e.clientY;
  mouse.active = true;
});

window.addEventListener("mouseleave", () => {
  mouse.active = false;
});

// ===== CONFIG =====
const size = 50;
const fadeInSpeed = 0.25;
const fadeOutSpeed = 0.02;
const fadeDelay = 1000;

let squares = [];

// fungsi inisialisasi ulang grid
function initSquares() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const cols = Math.ceil(canvas.width / size);
  const rows = Math.ceil(canvas.height / size);

  squares = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      squares.push({
        x: x * size,
        y: y * size,
        alpha: 0,
        lastActive: 0,
      });
    }
  }
}
initSquares(); // pertama kali jalan

function intersects(sq, x1, y1, x2, y2) {
  let left = sq.x,
    right = sq.x + size,
    top = sq.y,
    bottom = sq.y + size;

  let minX = Math.min(x1, x2),
    maxX = Math.max(x1, x2),
    minY = Math.min(y1, y2),
    maxY = Math.max(y1, y2);

  if (maxX < left || minX > right || maxY < top || minY > bottom) return false;
  return true;
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const now = Date.now();

  squares.forEach((sq) => {
    let inside = false;

    if (mouse.active) {
      if (
        mouse.x >= sq.x &&
        mouse.x < sq.x + size &&
        mouse.y >= sq.y &&
        mouse.y < sq.y + size
      ) {
        inside = true;
      }

      if (prevMouse.x !== null && prevMouse.y !== null) {
        if (intersects(sq, prevMouse.x, prevMouse.y, mouse.x, mouse.y)) {
          inside = true;
        }
      }
    }

    if (inside) {
      sq.alpha += fadeInSpeed;
      if (sq.alpha > 1) sq.alpha = 1;
      sq.lastActive = now;
    } else {
      if (now - sq.lastActive > fadeDelay) {
        sq.alpha -= fadeOutSpeed;
        if (sq.alpha < 0) sq.alpha = 0;
      }
    }

    const normalColor = { r: 255, g: 220, b: 217 };
    const hoverColor = { r: 244, g: 171, b: 179 };

    const r = normalColor.r * (1 - sq.alpha) + hoverColor.r * sq.alpha;
    const g = normalColor.g * (1 - sq.alpha) + hoverColor.g * sq.alpha;
    const b = normalColor.b * (1 - sq.alpha) + hoverColor.b * sq.alpha;

    ctx.strokeStyle = `rgb(${r},${g},${b})`;
    ctx.lineWidth = 1;
    ctx.strokeRect(sq.x, sq.y, size, size);
  });

  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", initSquares);

//=====================CANVAS TENTANG=====================
// ========== GRID UNTUK SECTION TENTANG ==========
const canvasTentang = document.getElementById("bubbleCanvasTentang");
const ctxTentang = canvasTentang.getContext("2d");

canvasTentang.width = window.innerWidth;
canvasTentang.height = window.innerHeight;

let mouseTentang = { x: null, y: null, active: false };
let prevMouseTentang = { x: null, y: null };

// event mouse (pakai window, bukan canvas)
window.addEventListener("mousemove", (e) => {
  prevMouseTentang.x = mouseTentang.x;
  prevMouseTentang.y = mouseTentang.y;

  const rect = canvasTentang.getBoundingClientRect();

  // cek apakah mouse ada di area section #tentang
  if (
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  ) {
    mouseTentang.x = e.clientX - rect.left;
    mouseTentang.y = e.clientY - rect.top;
    mouseTentang.active = true;
  } else {
    mouseTentang.active = false;
  }
});

window.addEventListener("mouseleave", () => {
  mouseTentang.active = false;
});

// config
const sizeTentang = 50;
const colsTentang = Math.ceil(canvasTentang.width / sizeTentang);
const rowsTentang = Math.ceil(canvasTentang.height / sizeTentang);

let squaresTentang = [];
for (let y = 0; y < rowsTentang; y++) {
  for (let x = 0; x < colsTentang; x++) {
    squaresTentang.push({
      x: x * sizeTentang,
      y: y * sizeTentang,
      alpha: 0,
      lastActive: 0,
    });
  }
}

function initSquaresTentang() {
  canvasTentang.width = window.innerWidth;
  canvasTentang.height = window.innerHeight;

  const colsTentang = Math.ceil(canvasTentang.width / sizeTentang);
  const rowsTentang = Math.ceil(canvasTentang.height / sizeTentang);

  squaresTentang = [];
  for (let y = 0; y < rowsTentang; y++) {
    for (let x = 0; x < colsTentang; x++) {
      squaresTentang.push({
        x: x * sizeTentang,
        y: y * sizeTentang,
        alpha: 0,
        lastActive: 0,
      });
    }
  }
}
initSquaresTentang();
window.addEventListener("resize", initSquaresTentang);

function intersectsTentang(sq, x1, y1, x2, y2) {
  let left = sq.x,
    right = sq.x + sizeTentang,
    top = sq.y,
    bottom = sq.y + sizeTentang;

  let minX = Math.min(x1, x2),
    maxX = Math.max(x1, x2),
    minY = Math.min(y1, y2),
    maxY = Math.max(y1, y2);

  if (maxX < left || minX > right || maxY < top || minY > bottom) return false;
  return true;
}

function animateTentang() {
  ctxTentang.clearRect(0, 0, canvasTentang.width, canvasTentang.height);
  const now = Date.now();

  squaresTentang.forEach((sq) => {
    let inside = false;

    if (mouseTentang.active) {
      if (
        mouseTentang.x >= sq.x &&
        mouseTentang.x < sq.x + sizeTentang &&
        mouseTentang.y >= sq.y &&
        mouseTentang.y < sq.y + sizeTentang
      ) {
        inside = true;
      }

      if (prevMouseTentang.x !== null && prevMouseTentang.y !== null) {
        if (
          intersectsTentang(
            sq,
            prevMouseTentang.x,
            prevMouseTentang.y,
            mouseTentang.x,
            mouseTentang.y
          )
        ) {
          inside = true;
        }
      }
    }

    if (inside) {
      sq.alpha += 0.25;
      if (sq.alpha > 1) sq.alpha = 1;
      sq.lastActive = now;
    } else {
      if (now - sq.lastActive > 1000) {
        sq.alpha -= 0.02;
        if (sq.alpha < 0) sq.alpha = 0;
      }
    }

    // WARNA BERBEDA DARI BERANDA
    const normalColor = { r: 220, g: 253, b: 255 }; // biru muda
    const hoverColor = { r: 144, g: 202, b: 249 };  // biru cerah

    const r = normalColor.r * (1 - sq.alpha) + hoverColor.r * sq.alpha;
    const g = normalColor.g * (1 - sq.alpha) + hoverColor.g * sq.alpha;
    const b = normalColor.b * (1 - sq.alpha) + hoverColor.b * sq.alpha;

    ctxTentang.strokeStyle = `rgb(${r},${g},${b})`;
    ctxTentang.lineWidth = 1;
    ctxTentang.strokeRect(sq.x, sq.y, sizeTentang, sizeTentang);
  });

  requestAnimationFrame(animateTentang);
}
animateTentang();

window.addEventListener("resize", () => {
  canvasTentang.width = window.innerWidth;
  canvasTentang.height = window.innerHeight;
});

//====================================CANVAS CALL CENTER====================================
// ========== GRID UNTUK SECTION CALL CENTER ==========
const canvasCallCenter = document.getElementById("bubbleCanvasCallCenter");
const ctxCallCenter = canvasCallCenter.getContext("2d");

canvasCallCenter.width = window.innerWidth;
canvasCallCenter.height = window.innerHeight;

let mouseCallCenter = { x: null, y: null, active: false };
let prevMouseCallCenter = { x: null, y: null };

window.addEventListener("mousemove", (e) => {
  prevMouseCallCenter.x = mouseCallCenter.x;
  prevMouseCallCenter.y = mouseCallCenter.y;

  const rect = canvasCallCenter.getBoundingClientRect();

  if (
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  ) {
    mouseCallCenter.x = e.clientX - rect.left;
    mouseCallCenter.y = e.clientY - rect.top;
    mouseCallCenter.active = true;
  } else {
    mouseCallCenter.active = false;
  }
});

window.addEventListener("mouseleave", () => {
  mouseCallCenter.active = false;
});

// config
const sizeCallCenter = 50;
const colsCallCenter = Math.ceil(canvasCallCenter.width / sizeCallCenter);
const rowsCallCenter = Math.ceil(canvasCallCenter.height / sizeCallCenter);

let squaresCallCenter = [];
for (let y = 0; y < rowsCallCenter; y++) {
  for (let x = 0; x < colsCallCenter; x++) {
    squaresCallCenter.push({
      x: x * sizeCallCenter,
      y: y * sizeCallCenter,
      alpha: 0,
      lastActive: 0,
    });
  }
}

function initSquaresCallCenter() {
  canvasCallCenter.width = window.innerWidth;
  canvasCallCenter.height = window.innerHeight;

  const colsCallCenter = Math.ceil(canvasCallCenter.width / sizeCallCenter);
  const rowsCallCenter = Math.ceil(canvasCallCenter.height / sizeCallCenter);

  squaresCallCenter = [];
  for (let y = 0; y < rowsCallCenter; y++) {
    for (let x = 0; x < colsCallCenter; x++) {
      squaresCallCenter.push({
        x: x * sizeCallCenter,
        y: y * sizeCallCenter,
        alpha: 0,
        lastActive: 0,
      });
    }
  }
}
initSquaresCallCenter();

window.addEventListener("resize", initSquaresCallCenter);


function intersectsCallCenter(sq, x1, y1, x2, y2) {
  let left = sq.x,
    right = sq.x + sizeCallCenter,
    top = sq.y,
    bottom = sq.y + sizeCallCenter;

  let minX = Math.min(x1, x2),
    maxX = Math.max(x1, x2),
    minY = Math.min(y1, y2),
    maxY = Math.max(y1, y2);

  if (maxX < left || minX > right || maxY < top || minY > bottom) return false;
  return true;
}

function animateCallCenter() {
  ctxCallCenter.clearRect(0, 0, canvasCallCenter.width, canvasCallCenter.height);
  const now = Date.now();

  squaresCallCenter.forEach((sq) => {
    let inside = false;

    if (mouseCallCenter.active) {
      if (
        mouseCallCenter.x >= sq.x &&
        mouseCallCenter.x < sq.x + sizeCallCenter &&
        mouseCallCenter.y >= sq.y &&
        mouseCallCenter.y < sq.y + sizeCallCenter
      ) {
        inside = true;
      }

      if (prevMouseCallCenter.x !== null && prevMouseCallCenter.y !== null) {
        if (
          intersectsCallCenter(
            sq,
            prevMouseCallCenter.x,
            prevMouseCallCenter.y,
            mouseCallCenter.x,
            mouseCallCenter.y
          )
        ) {
          inside = true;
        }
      }
    }

    if (inside) {
      sq.alpha += 0.25;
      if (sq.alpha > 1) sq.alpha = 1;
      sq.lastActive = now;
    } else {
      if (now - sq.lastActive > 1000) {
        sq.alpha -= 0.02;
        if (sq.alpha < 0) sq.alpha = 0;
      }
    }

    // WARNA HIJAU
    const normalColor = { r: 220, g: 255, b: 220 }; // hijau muda
    const hoverColor = { r: 115, g: 205, b: 118 };    // hijau cerah

    const r = normalColor.r * (1 - sq.alpha) + hoverColor.r * sq.alpha;
    const g = normalColor.g * (1 - sq.alpha) + hoverColor.g * sq.alpha;
    const b = normalColor.b * (1 - sq.alpha) + hoverColor.b * sq.alpha;

    ctxCallCenter.strokeStyle = `rgb(${r},${g},${b})`;
    ctxCallCenter.lineWidth = 1;
    ctxCallCenter.strokeRect(sq.x, sq.y, sizeCallCenter, sizeCallCenter);
  });

  requestAnimationFrame(animateCallCenter);
}
animateCallCenter();

window.addEventListener("resize", () => {
  canvasCallCenter.width = window.innerWidth;
  canvasCallCenter.height = window.innerHeight;
});

//====================================CANVAS PENJUALAN====================================
// ========== GRID UNTUK SECTION PENJUALAN ==========
const canvasPenjualan = document.getElementById("bubbleCanvasPenjualan");
const ctxPenjualan = canvasPenjualan.getContext("2d");

canvasPenjualan.width = window.innerWidth;
canvasPenjualan.height = window.innerHeight;

let mousePenjualan = { x: null, y: null, active: false };
let prevMousePenjualan = { x: null, y: null };

window.addEventListener("mousemove", (e) => {
  prevMousePenjualan.x = mousePenjualan.x;
  prevMousePenjualan.y = mousePenjualan.y;

  const rect = canvasPenjualan.getBoundingClientRect();

  if (
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  ) {
    mousePenjualan.x = e.clientX - rect.left;
    mousePenjualan.y = e.clientY - rect.top;
    mousePenjualan.active = true;
  } else {
    mousePenjualan.active = false;
  }
});

window.addEventListener("mouseleave", () => {
  mousePenjualan.active = false;
});

// config
const sizePenjualan = 50;
const colsPenjualan = Math.ceil(canvasPenjualan.width / sizePenjualan);
const rowsPenjualan = Math.ceil(canvasPenjualan.height / sizePenjualan);

let squaresPenjualan = [];
for (let y = 0; y < rowsPenjualan; y++) {
  for (let x = 0; x < colsPenjualan; x++) {
    squaresPenjualan.push({
      x: x * sizePenjualan,
      y: y * sizePenjualan,
      alpha: 0,
      lastActive: 0,
    });
  }
}

function initSquaresPenjualan() {
  canvasPenjualan.width = window.innerWidth;
  canvasPenjualan.height = window.innerHeight;

  const colsPenjualan = Math.ceil(canvasPenjualan.width / sizePenjualan);
  const rowsPenjualan = Math.ceil(canvasPenjualan.height / sizePenjualan);

  squaresPenjualan = [];
  for (let y = 0; y < rowsPenjualan; y++) {
    for (let x = 0; x < colsPenjualan; x++) {
      squaresPenjualan.push({
        x: x * sizePenjualan,
        y: y * sizePenjualan,
        alpha: 0,
        lastActive: 0,
      });
    }
  }
}
initSquaresPenjualan();

window.addEventListener("resize", initSquaresPenjualan);

function intersectsPenjualan(sq, x1, y1, x2, y2) {
  let left = sq.x,
    right = sq.x + sizePenjualan,
    top = sq.y,
    bottom = sq.y + sizePenjualan;

  let minX = Math.min(x1, x2),
    maxX = Math.max(x1, x2),
    minY = Math.min(y1, y2),
    maxY = Math.max(y1, y2);

  if (maxX < left || minX > right || maxY < top || minY > bottom) return false;
  return true;
}

function animatePenjualan() {
  ctxPenjualan.clearRect(0, 0, canvasPenjualan.width, canvasPenjualan.height);
  const now = Date.now();

  squaresPenjualan.forEach((sq) => {
    let inside = false;

    if (mousePenjualan.active) {
      if (
        mousePenjualan.x >= sq.x &&
        mousePenjualan.x < sq.x + sizePenjualan &&
        mousePenjualan.y >= sq.y &&
        mousePenjualan.y < sq.y + sizePenjualan
      ) {
        inside = true;
      }

      if (prevMousePenjualan.x !== null && prevMousePenjualan.y !== null) {
        if (
          intersectsPenjualan(
            sq,
            prevMousePenjualan.x,
            prevMousePenjualan.y,
            mousePenjualan.x,
            mousePenjualan.y
          )
        ) {
          inside = true;
        }
      }
    }

    if (inside) {
      sq.alpha += 0.25;
      if (sq.alpha > 1) sq.alpha = 1;
      sq.lastActive = now;
    } else {
      if (now - sq.lastActive > 1000) {
        sq.alpha -= 0.02;
        if (sq.alpha < 0) sq.alpha = 0;
      }
    }

    // WARNA KUNING
    const normalColor = { r: 255, g: 255, b: 220 }; // kuning muda
    const hoverColor = { r: 250, g: 265, b: 80 };   // kuning cerah

    const r = normalColor.r * (1 - sq.alpha) + hoverColor.r * sq.alpha;
    const g = normalColor.g * (1 - sq.alpha) + hoverColor.g * sq.alpha;
    const b = normalColor.b * (1 - sq.alpha) + hoverColor.b * sq.alpha;

    ctxPenjualan.strokeStyle = `rgb(${r},${g},${b})`;
    ctxPenjualan.lineWidth = 1;
    ctxPenjualan.strokeRect(sq.x, sq.y, sizePenjualan, sizePenjualan);
  });

  requestAnimationFrame(animatePenjualan);
}
animatePenjualan();

window.addEventListener("resize", () => {
  canvasPenjualan.width = window.innerWidth;
  canvasPenjualan.height = window.innerHeight;
});


// ========== HEADLINE ==========
const headline = document.getElementById("headline");

const texts = ["Hello! ", "Welcome to \n My Webpage. "];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
  const currentText = texts[textIndex];
  headline.innerText = currentText.substring(0, charIndex);

  if (!isDeleting && charIndex < currentText.length) {
    charIndex++;
    setTimeout(typeEffect, 120);
  } 
  else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeEffect, 80);
  } 
  else {
    if (!isDeleting && charIndex === currentText.length) {
      isDeleting = true;
      setTimeout(typeEffect, 1000);
    } 
    else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
      setTimeout(typeEffect, 500);
    }
  }
}

typeEffect();

// ===================== CALL CENTER =====================
function showNotification(message, type = "success") {
  const container = document.getElementById("notification");
  const toast = document.createElement("div");
  toast.className = "toast " + type;
  toast.innerText = message;

  container.appendChild(toast);

  // Hapus otomatis setelah 3 detik
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-20px)";
    setTimeout(() => toast.remove(), 400); // tunggu animasi selesai
  }, 3000);
}


function showCard(id) {
  document.querySelectorAll(".card").forEach(card => {
    card.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

// Form login
document.getElementById("loginForm").onsubmit = (e) => {
  e.preventDefault();
  showCard("callCenterCard");
};

// Form register
document.getElementById("registerForm").onsubmit = (e) => {
  e.preventDefault();
  showNotification("Registrasi berhasil! Silakan login.");
  showCard("loginCard");
};

// Form reset password
document.getElementById("resetForm").onsubmit = (e) => {
  e.preventDefault();
  showNotification("Link reset password sudah dikirim ke email Anda!");
  showCard("loginCard");
};

// Form contact / call center
document.getElementById("contactForm").onsubmit = (e) => {
  e.preventDefault();
  showNotification("Pesan berhasil dikirim!");
};

document.getElementById("backToLogin").addEventListener("click", function (e) {
  e.preventDefault(); // biar ga reload
  document.getElementById("callCenterCard").classList.remove("active");
  document.getElementById("loginCard").classList.add("active");
});
