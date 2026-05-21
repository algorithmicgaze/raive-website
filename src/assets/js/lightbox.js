// Minimal image lightbox for project pages.
// Picks up every <img> inside .project-hero and .project-gallery on the
// current page. No deps. Esc / backdrop / × to close. Arrow keys + buttons to navigate.

(function () {
  const imgs = Array.from(document.querySelectorAll(".project-hero img, .project-gallery img"));
  if (!imgs.length) return;

  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <button type="button" class="lightbox__close" aria-label="Close">×</button>
    <button type="button" class="lightbox__nav lightbox__nav--prev" aria-label="Previous image">‹</button>
    <button type="button" class="lightbox__nav lightbox__nav--next" aria-label="Next image">›</button>
    <figure class="lightbox__stage">
      <img alt="" />
      <figcaption></figcaption>
    </figure>
  `;
  document.body.appendChild(overlay);

  const stageImg = overlay.querySelector("img");
  const caption = overlay.querySelector("figcaption");
  const btnPrev = overlay.querySelector(".lightbox__nav--prev");
  const btnNext = overlay.querySelector(".lightbox__nav--next");
  const btnClose = overlay.querySelector(".lightbox__close");

  let index = 0;

  function show(i) {
    index = (i + imgs.length) % imgs.length;
    const src = imgs[index].currentSrc || imgs[index].src;
    stageImg.src = src;
    stageImg.alt = imgs[index].alt || "";
    caption.textContent = imgs[index].alt || "";
    caption.hidden = !caption.textContent;
  }

  function open(i) {
    show(i);
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function close() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    stageImg.src = "";
  }

  imgs.forEach((img, i) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => open(i));
  });

  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", () => show(index - 1));
  btnNext.addEventListener("click", () => show(index + 1));

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay || e.target.classList.contains("lightbox__stage")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("is-open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(index - 1);
    else if (e.key === "ArrowRight") show(index + 1);
  });
})();
