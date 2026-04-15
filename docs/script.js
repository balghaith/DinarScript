const abstractSection = document.getElementById("abstract");
const abstractLogo = document.getElementById("abstractLogo");

if (abstractSection && abstractLogo) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          abstractLogo.classList.add("animate");
        }
      });
    },
    { threshold: 0.45 }
  );

  observer.observe(abstractSection);
}

const exampleBalls = document.querySelectorAll(".example-ball");
const exampleModal = document.getElementById("exampleModal");
const flipCard = document.getElementById("flipCard");
const cardTitle = document.getElementById("cardTitle");
const cardTitleBack = document.getElementById("cardTitleBack");
const cardCode = document.getElementById("cardCode");
const cardOutput = document.getElementById("cardOutput");
const flipButton = document.getElementById("flipButton");
const flipBackButton = document.getElementById("flipBackButton");
const modalBackdrop = document.querySelector(".example-modal-backdrop");
const modalClose = document.getElementById("modalClose");

exampleBalls.forEach((ball) => {
  ball.addEventListener("click", () => {
    if (!exampleModal || !flipCard || !cardTitle || !cardTitleBack || !cardCode || !cardOutput) {
      return;
    }

    cardTitle.textContent = ball.dataset.title;
    cardCode.textContent = ball.dataset.code;
    cardOutput.textContent = ball.dataset.output;

    flipCard.classList.remove("flipped");
    exampleModal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

function closeExampleModal() {
  if (exampleModal) {
    exampleModal.classList.remove("active");
  }
  if (flipCard) {
    flipCard.classList.remove("flipped");
  }
  document.body.style.overflow = "";
}

if (flipButton && flipCard) {
  flipButton.addEventListener("click", () => {
    flipCard.classList.add("flipped");
  });
}

if (flipBackButton && flipCard) {
  flipBackButton.addEventListener("click", () => {
    flipCard.classList.remove("flipped");
  });
}

if (modalBackdrop) {
  modalBackdrop.addEventListener("click", closeExampleModal);
}

if (modalClose) {
    modalClose.addEventListener("click", closeExampleModal);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeExampleModal();
  }
});