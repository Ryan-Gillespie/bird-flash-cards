const puppeteer = require("puppeteer");
const inputReader = require("wait-console-input");
const { birdNames } = require("./birds.json");

const playNoise = async (page, bird) => {
  await page.goto("http://ebird.org/explore");

  await page.type("input.Suggest-input", bird, { delay: 1 });
  await sleep(1100);
  await page.keyboard.press("Enter");

  await page.waitForNavigation();

  await page.screenshot({
    path: "bird.png",
    clip: { x: 275, y: 150, width: 525, height: 315 },
  });
  await page.evaluate(() => {
    document.querySelector("a.Button--huge").click();
  });
};

const main = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    ignoreDefaultArgs: ["--mute-audio"],
    args: ["--autoplay-policy=no-user-gesture-required"],
  });
  const page = await browser.newPage();

  let prevBirds = [];
  let bird = Math.floor(Math.random() * birdNames.length);

  while (true) {
    while (prevBirds.includes(bird)) {
      bird = Math.floor(Math.random() * birdNames.length);
    }

    try {
      await playNoise(page, birdNames[bird]);
    } catch (e) {
      console.log(birdNames[bird], "was not found");
      continue;
    }

    const guess = inputReader.readLine("What Bird is This? ");
    const response =
      guess.toLowerCase() === birdNames[bird].toLowerCase()
        ? `Correct! it was a ${birdNames[bird]}`
        : `Wrong! it was a ${birdNames[bird]}`;
    console.log(response, "\n");

    prevBirds.push(bird);
    if (prevBirds.length > 6) {
      prevBirds.splice(0, 1);
    }
  }
};

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

main();
