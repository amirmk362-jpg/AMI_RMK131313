/* ===== BOTTOM NAV ===== */
(function () {
  var el = document.getElementById("bnav");
  if (!el) return;
  var logoImg = svgImg(120, 120, "e74c3c", "ffffff", "AMI");
  el.innerHTML = `
    <nav class="bottom-nav">
        <div class="bn-item" onclick="toggleCart()" style="position:relative">
            <span class="bn-svg" style="position:relative;display:inline-block">
                <svg viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                    <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                <span class="cart-badge" id="cart-badge">0</span>
            </span>
            <span class="bn-label">سبد</span>
        </div>
        <div class="bn-item" onclick="location.href='index.html#about-section'">
            <span class="bn-svg">
                <svg viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
            </span>
            <span class="bn-label">درباره</span>
        </div>
        <div class="bn-search-center" onclick="openSearch()">
            <div class="bn-search-circle">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
            </div>
        </div>
        <div class="bn-item" onclick="location.href='index.html'">
            <span class="bn-svg">
                <img src="1000007568.jpg" style="width:28px;height:28px;border-radius:50%;display:block;margin:0 auto;" alt="لوگو">
            </span>
            <span class="bn-label">خانه</span>
        </div>
        <div class="bn-item" onclick="location.href='index.html#contact-section'">
            <span class="bn-svg">
                <svg viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/>
                </svg>
            </span>
            <span class="bn-label">تماس</span>
        </div>
    </nav>

    <div class="search-overlay" id="search-overlay">
        <div class="search-box-inner">
            <input id="search-input-big" type="text" class="search-input-big" placeholder="🔍 جستجو در همه محصولات...">
            <div id="search-results" style="margin-top:12px;max-height:280px;overflow-y:auto;"></div>
            <button onclick="closeSearch()" class="search-close-btn">بستن</button>
        </div>
    </div>

    <div class="lightbox" id="lightbox">
        <button class="lightbox-close" onclick="closeLightbox()">✕</button>
        <button class="lightbox-arrow prev" onclick="lbPrev()">›</button>
        <img id="lb-img" src="" alt="">
        <button class="lightbox-arrow next" onclick="lbNext()">‹</button>
        <span class="lightbox-counter" id="lb-counter"></span>
    </div>`;
})();

function openSearch() {
  document.getElementById("search-overlay").classList.add("open");
  setTimeout(function () {
    document.getElementById("search-input-big").focus();
  }, 100);
  document.getElementById("search-input-big").oninput = function () {
    doGlobalSearch(this.value);
  };
}
function closeSearch() {
  document.getElementById("search-overlay").classList.remove("open");
}

function doGlobalSearch(val) {
  var res = document.getElementById("search-results");
  val = val.trim();
  if (!val) {
    res.innerHTML = "";
    return;
  }
  var found = Object.keys(PRODUCTS_DB).filter(function (id) {
    return PRODUCTS_DB[id].name.includes(val);
  });
  if (!found.length) {
    res.innerHTML =
      '<p style="text-align:center;color:#aaa;font-size:13px;padding:14px">نتیجه‌ای یافت نشد</p>';
    return;
  }
  res.innerHTML = found
    .slice(0, 15)
    .map(function (id) {
      var p = PRODUCTS_DB[id];
      var c = Object.keys(p.colors)[0];
      var img = p.colors[c][0];
      return `<div onclick="location.href='detail.html?id=${id}'" style="display:flex;align-items:center;gap:10px;padding:8px;border-radius:8px;cursor:pointer;border-bottom:1px solid #f0f0f0;">
            <img src="${img}" style="width:42px;height:42px;border-radius:6px;object-fit:contain;background:#f6f6f6;" onerror="imgFallback(this,'${c}')">
            <div style="font-size:13px;color:#333;">${p.name}<br><span style="color:#e74c3c;font-size:11px;font-weight:700">${p.price} ت</span></div>
        </div>`;
    })
    .join("");
}

/* ===== Lightbox ===== */
var LB_IMAGES = [],
  LB_INDEX = 0,
  LB_COLOR = "";
function setLbImg(src) {
  var el = document.getElementById("lb-img");
  el.dataset.fb = "";
  el.onerror = function () {
    imgFallback(this, LB_COLOR);
  };
  el.src = src;
}
function openLightbox(images, startIndex, color) {
  LB_IMAGES = images;
  LB_INDEX = startIndex || 0;
  LB_COLOR = color || "";
  setLbImg(LB_IMAGES[LB_INDEX]);
  updateLbCounter();
  document.getElementById("lightbox").classList.add("open");
}
function closeLightbox() {
  document.getElementById("lightbox").classList.remove("open");
}
function lbNext() {
  LB_INDEX = (LB_INDEX + 1) % LB_IMAGES.length;
  setLbImg(LB_IMAGES[LB_INDEX]);
  updateLbCounter();
}
function lbPrev() {
  LB_INDEX = (LB_INDEX - 1 + LB_IMAGES.length) % LB_IMAGES.length;
  setLbImg(LB_IMAGES[LB_INDEX]);
  updateLbCounter();
}
function updateLbCounter() {
  document.getElementById("lb-counter").textContent =
    LB_INDEX + 1 + " / " + LB_IMAGES.length;
}

/* ===== کشیدن افقی با ماوس ===== */
function enableDragScroll(el) {
  if (!el) return;
  var isDown = false,
    startX,
    scrollLeft;
  el.addEventListener("mousedown", function (e) {
    isDown = true;
    el.classList.add("dragging");
    startX = e.pageX;
    scrollLeft = el.scrollLeft;
  });
  ["mouseleave", "mouseup"].forEach(function (ev) {
    el.addEventListener(ev, function () {
      isDown = false;
      el.classList.remove("dragging");
    });
  });
  el.addEventListener("mousemove", function (e) {
    if (!isDown) return;
    e.preventDefault();
    el.scrollLeft = scrollLeft - (e.pageX - startX);
  });
}

document.addEventListener("keydown", function (e) {
  var lb = document.getElementById("lightbox");
  if (lb && lb.classList.contains("open")) {
    if (e.key === "ArrowLeft") lbNext();
    if (e.key === "ArrowRight") lbPrev();
    if (e.key === "Escape") closeLightbox();
  }
});

/* ===== رندر کارت محصول (بدون چرخش خودکار) ===== */
function renderProductCard(p, id, cls) {
  var firstColor = Object.keys(p.colors)[0];
  var img = p.colors[firstColor][0];
  var nameCls = cls === "g-card" ? "g-name" : "p-name";
  var oldCls = cls === "g-card" ? "g-old" : "p-old";
  var priceCls = cls === "g-card" ? "g-price" : "p-price";
  var badgeCls = cls === "g-card" ? "g-badge" : "p-badge";
  var infoCls = cls === "g-card" ? "g-info" : "p-info";
  return `<div class="${cls}" onclick="location.href='detail.html?id=${id}'">
        <div class="img-frame">
            <img src="${img}" alt="${p.name}" loading="lazy" onerror="imgFallback(this,'${firstColor}')">
        </div>
        <div class="${infoCls}">
            <span class="${nameCls}">${p.name}</span><br>
            <span class="${oldCls}">${p.old}</span>
            <span class="${priceCls}">${p.price} ت</span>
            <span class="${badgeCls}">-${p.disc}%</span>
        </div>
    </div>`;
}

/* ===== ست‌آپ صفحه دسته‌بندی (سرچ+فیلتر+گرید) ===== */
function setupCategoryPage(cat) {
  var af = "همه",
    st = "";
  var products = Object.keys(PRODUCTS_DB)
    .filter(function (id) {
      return PRODUCTS_DB[id].cat === cat;
    })
    .map(function (id) {
      return Object.assign({ id: id }, PRODUCTS_DB[id]);
    });

  function render() {
    var f = products.filter(function (p) {
      return (af === "همه" || p.subcat === af) && p.name.includes(st);
    });
    var g = document.getElementById("grid"),
      n = document.getElementById("no-res");
    if (!f.length) {
      g.innerHTML = "";
      n.style.display = "block";
      return;
    }
    n.style.display = "none";
    g.innerHTML = f
      .map(function (p) {
        return renderProductCard(p, p.id, "g-card");
      })
      .join("");
  }
  window.setF = function (el, f) {
    af = f;
    document.querySelectorAll(".f-btn").forEach(function (b) {
      b.classList.remove("active");
    });
    el.classList.add("active");
    render();
  };
  window.doSearch = function (v) {
    st = v;
    render();
  };
  render();
}

/* ===== CART ===== */
var cart = JSON.parse(localStorage.getItem("ami_cart4") || "[]");
function saveCart() {
  localStorage.setItem("ami_cart4", JSON.stringify(cart));
  renderCart();
  updateBadge();
}
function updateBadge() {
  var total = cart.reduce(function (s, i) {
    return s + i.qty;
  }, 0);
  document.querySelectorAll(".cart-badge,.hc-badge").forEach(function (el) {
    if (total > 0) {
      el.style.display = "flex";
      el.textContent = total;
    } else {
      el.style.display = "none";
    }
  });
}
function renderCart() {
  var c = document.getElementById("cs-items"),
    t = document.getElementById("cs-total");
  if (!c) return;
  if (!cart.length) {
    c.innerHTML = '<div class="cs-empty">🛒<br><br>سبد خرید خالی است</div>';
    if (t) t.textContent = "۰ تومان";
    return;
  }
  var total = 0,
    html = "";
  cart.forEach(function (item, idx) {
    var n = parseInt((item.price || "0").replace(/,/g, ""));
    total += n * item.qty;
    html += `<div class="cs-item">
            <img class="cs-item-img" src="${item.img || ""}" alt="" onerror="imgFallback(this,'${item.colorName || ""}')">
            <div class="cs-item-info">
                <div class="cs-item-name">${item.name}</div>
                <div class="cs-item-sub">${item.colorName ? "رنگ: " + item.colorName + " | " : ""}سایز: ${item.size}</div>
                <div class="cs-item-price">${item.price} تومان</div>
                <div class="cs-qty">
                    <button class="cs-qty-btn" onclick="changeQty(${idx},-1)">−</button>
                    <span class="cs-qty-num">${item.qty}</span>
                    <button class="cs-qty-btn" onclick="changeQty(${idx},1)">+</button>
                </div>
            </div>
            <button class="cs-item-del" onclick="removeItem(${idx})">✕</button>
        </div>`;
  });
  c.innerHTML = html;
  if (t) t.textContent = total.toLocaleString("fa-IR") + " تومان";
}
function changeQty(idx, d) {
  cart[idx].qty += d;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart();
}
function removeItem(idx) {
  cart.splice(idx, 1);
  saveCart();
}
function toggleCart() {
  document.getElementById("cart-sidebar").classList.toggle("open");
  document.getElementById("cart-overlay").classList.toggle("show");
  renderCart();
}
function addItemToCart(name, price, img, colorName, size) {
  var ex = cart.find(function (i) {
    return i.name === name && i.colorName === colorName && i.size === size;
  });
  if (ex) {
    ex.qty++;
  } else {
    cart.push({
      name: name,
      price: price,
      img: img,
      colorName: colorName,
      size: size,
      qty: 1,
    });
  }
  saveCart();
}
updateBadge();
renderCart();
