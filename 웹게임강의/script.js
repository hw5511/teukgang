const slides = [...document.querySelectorAll(".slide")];
const prev = document.querySelector("#prev");
const next = document.querySelector("#next");
const count = document.querySelector("#count");
const bar = document.querySelector("#bar");
let current = 0;

function show(index) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, i) => slide.classList.toggle("active", i === current));
  count.textContent = `${current + 1} / ${slides.length}`;
  bar.style.width = `${((current + 1) / slides.length) * 100}%`;
  document.body.classList.toggle("on-dark", slides[current].classList.contains("dark") || slides[current].classList.contains("title-slide"));
}

prev.addEventListener("click", () => show(current - 1));
next.addEventListener("click", () => show(current + 1));

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === "PageDown" || event.key === " ") {
    event.preventDefault();
    show(current + 1);
  }
  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    show(current - 1);
  }
  if (event.key === "Home") show(0);
  if (event.key === "End") show(slides.length - 1);
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const code = button.parentElement.querySelector("code")?.innerText || "";
    await navigator.clipboard.writeText(code);
    button.textContent = "복사됨";
    button.classList.add("copied");
    setTimeout(() => {
      button.textContent = "복사";
      button.classList.remove("copied");
    }, 1400);
  });
});

show(0);
