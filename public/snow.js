/* global window document */

(function Snow() {
  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  class Snowflake {
    constructor() {
      this.x = randomBetween(0, window.innerWidth);
      this.y = randomBetween(0, -window.innerHeight);
      this.alpha = randomBetween(0.2, 0.9);
      this.radius = randomBetween(1, 5);
      this.vX = randomBetween(-2, 2) * (this.radius / 4);
      this.vY = randomBetween(1, 7) * (this.radius / 4);
    }
  }

  let width = 0;
  let height = 0;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  document.body.appendChild(canvas);

  function update() {
    ctx.clearRect(0, 0, width, height);

    // eslint-disable-next-line @typescript-eslint/no-use-before-define,no-restricted-syntax
    for (const snowflake of snowflakes) {
      ctx.save();
      ctx.globalAlpha = snowflake.alpha;
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      snowflake.x += snowflake.vX;
      snowflake.y += snowflake.vY;

      const outOfBounds = snowflake.x < 0 || snowflake.x > width || snowflake.y > height;

      if (outOfBounds) {
        snowflake.x = randomBetween(0, window.innerWidth);
        snowflake.y = randomBetween(0, -window.innerHeight);
      }
    }

    window.requestAnimationFrame(update);
  }

  function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'absolute';
    canvas.style.left = '0';
    canvas.style.top = '0';
    canvas.style.pointerEvents = 'none';
  }

  function createSnowflakes(amount) {
    const snowflakes = [];

    for (let i = 0; i < amount; i += 1) {
      snowflakes.push(new Snowflake());
    }

    return snowflakes;
  }

  const snowflakes = createSnowflakes(
    Math.floor((window.innerWidth * window.innerHeight) / 3000),
  );

  onResize();
  update();

  window.addEventListener('resize', onResize);
}());
