let wheel;
let isAnimating = false;

function createWheel(names) {
  wheel = new Winwheel({
    canvasId: "wheelCanvas",
    numSegments: names.length,
    textFontSize: 16,
    textMargin: 10,
    segments: names.map((name, index) => ({
      text: name,
      fillStyle: getColorForName(name),
    })),
    animation: {
      type: "spinToStop",
      duration: 5,
      spins: 8,
      callbackFinished: (indicatedSegment) => {
        const resultDiv = document.getElementById("result");
        resultDiv.textContent = `Winner! - ${indicatedSegment.text}`;
        isAnimating = false;
      },
    },
  });
}

function getColorForName(name) {
  const hue = hashString(name) % 360;
  const saturation = 80;
  const lightness = 60;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function spinWheel() {
  if (isAnimating) {
    return;
  }
  const resultDiv = document.getElementById("result");
  resultDiv.textContent = "";
  if (wheel) {
    const spinButton = document.getElementById("spin");
    spinButton.disabled = true;
    isAnimating = true;
    wheel.startAnimation();
    setTimeout(() => {
      spinButton.disabled = false;
    }, wheel.animation.duration * 1000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const namesTextarea = document.getElementById("names");
  const predefinedNames = namesTextarea.getAttribute("data-names");
  namesTextarea.value = predefinedNames;

  const names = predefinedNames.split(",").map((name) => name.trim());
  createWheel(names);
});

document.getElementById("spin").addEventListener("click", () => {
  const namesInput = document.getElementById("names").value;
  const names = namesInput.split(",").map((name) => name.trim());

  if (names.length === 0 || names[0] === "") {
    const resultDiv = document.getElementById("result");
    resultDiv.textContent = "Please enter names.";
    return;
  }

  createWheel(names);
  spinWheel();
});