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
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    document.addEventListener("mousemove", (e) => {
      if (!this.rotating) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = e.clientX - this.mouseTouchX;
      const dirY = e.clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;
      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    });

    paper.addEventListener("mousedown", (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.button === 0) {
        this.mouseTouchX = this.mouseX;
        this.mouseTouchY = this.mouseY;
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    });
    window.addEventListener("mouseup", () => {
      this.holdingPaper = false;
      this.rotating = false;
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
