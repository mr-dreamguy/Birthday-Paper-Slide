let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  currentPaperX = 0;
  currentPaperY = 0;

  init(paper) {
    const moveHandler = (x, y) => {
      this.mouseX = x;
      this.mouseY = y;

      this.velX = this.mouseX - this.prevMouseX;
      this.velY = this.mouseY - this.prevMouseY;

      if (this.holdingPaper) {
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;

        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px)`;
      }
    };

    // Mouse move
    document.addEventListener("mousemove", (e) =>
      moveHandler(e.clientX, e.clientY)
    );

    // Touch move
    document.addEventListener(
      "touchmove",
      (e) => {
        if (this.holdingPaper) {
          e.preventDefault(); // Prevent page scroll
          const touch = e.touches[0];
          moveHandler(touch.clientX, touch.clientY);
        }
      },
      { passive: false }
    );

    const startDrag = (x, y) => {
      if (this.holdingPaper) return;

      this.holdingPaper = true;

      paper.style.zIndex = highestZ++;
      this.mouseTouchX = x;
      this.mouseTouchY = y;
      this.prevMouseX = x;
      this.prevMouseY = y;
      this.mouseX = x;
      this.mouseY = y;
    };

    // Mouse down
    paper.addEventListener("mousedown", (e) => {
      if (e.button === 0) {
        // Left-click only
        startDrag(e.clientX, e.clientY);
      }
    });

    // Touch start
    paper.addEventListener("touchstart", (e) => {
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    });

    // End drag on mouse or touch release
    window.addEventListener("mouseup", () => {
      this.holdingPaper = false;
    });
    window.addEventListener("touchend", () => {
      this.holdingPaper = false;
    });
  }
}

const tags = ["row", "row-rev", "col", "col-rev"];
const createSlide = (caption, src) => {
  const slide = document.createElement("div");
  slide.setAttribute(
    "class",
    `paper image ${tags[Math.floor(Math.random() * 4)]}`
  );
  slide.innerHTML = `<p>${caption}</p><img src=${src} draggable="false"/>`;
  return slide;
};

const run = (data) => {
  const body = document.querySelector("body");
  const start = document.querySelector(".begin");
  const slides = [];
  for (let i = 18; i >= 0; i--) {
    slides.push(createSlide(data.captions[i + 1], data.images[i]));
  }
  slides.forEach((slide) => {
    body.insertBefore(slide, start);
  });

  const papers = Array.from(document.querySelectorAll(".paper"));

  papers.forEach((paper) => {
    const p = new Paper();
    p.init(paper);
  });
};

fetch("assets/data.json")
  .then((res) => res.json())
  .then((data) => run(data));
