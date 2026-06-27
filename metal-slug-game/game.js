const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const W = canvas.width;
const H = canvas.height;
const FLOOR = 442;
const keys = new Set();
const rand = (min, max) => Math.random() * (max - min) + min;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const sprites = {};

for (const name of ["player", "enemy", "tank", "prisoner"]) {
  const image = new Image();
  image.src = `assets/sprites/${name}.png`;
  sprites[name] = image;
}

const game = {
  time: 0,
  camera: 0,
  distance: 0,
  score: 0,
  wave: 1,
  shake: 0,
  over: false,
  won: false,
  started: false,
  spawnTimer: 0,
  prisonerTimer: 0,
  bossSpawned: false,
  boss: null,
  bullets: [],
  grenades: [],
  enemies: [],
  explosions: [],
  pickups: [],
  prisoners: [],
  particles: [],
};

const player = {
  x: 120,
  y: FLOOR - 74,
  w: 42,
  h: 74,
  vx: 0,
  vy: 0,
  facing: 1,
  hp: 6,
  ammo: 120,
  grenades: 8,
  fireCd: 0,
  grenadeCd: 0,
  invuln: 0,
  rescued: 0,
  onGround: true,
};

const rectsHit = (a, b) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

function reset() {
  Object.assign(game, {
    time: 0, camera: 0, distance: 0, score: 0, wave: 1, shake: 0,
    over: false, won: false, started: true, spawnTimer: 0.5, prisonerTimer: 2.5,
    bossSpawned: false, boss: null, bullets: [], grenades: [], enemies: [],
    explosions: [], pickups: [], prisoners: [], particles: [],
  });
  Object.assign(player, {
    x: 120, y: FLOOR - 74, w: 42, h: 74, vx: 0, vy: 0, facing: 1,
    hp: 6, ammo: 120, grenades: 8, fireCd: 0, grenadeCd: 0, invuln: 0,
    rescued: 0, onGround: true,
  });
}

function addParticles(x, y, color, count = 14, power = 150) {
  for (let i = 0; i < count; i++) {
    game.particles.push({
      x, y, vx: rand(-power, power), vy: rand(-power, power),
      life: rand(0.25, 0.7), color, size: rand(2, 6),
    });
  }
}

function shoot() {
  if (player.fireCd > 0 || player.ammo <= 0 || game.over || game.won) return;
  player.fireCd = 0.105;
  player.ammo--;
  const muzzleX = player.x + (player.facing > 0 ? player.w + 5 : -10);
  game.bullets.push({
    x: muzzleX,
    y: player.y + 31,
    w: 16,
    h: 6,
    vx: 650 * player.facing,
    life: 1.3,
    fromPlayer: true,
  });
  addParticles(muzzleX, player.y + 33, "#ffd15a", 4, 80);
}

function throwGrenade() {
  if (player.grenadeCd > 0 || player.grenades <= 0 || game.over || game.won) return;
  player.grenadeCd = 0.65;
  player.grenades--;
  game.grenades.push({
    x: player.x + player.w / 2,
    y: player.y + 20,
    w: 14,
    h: 14,
    vx: 330 * player.facing,
    vy: -360,
    timer: 1.05,
  });
}

function spawnEnemy(kind = "soldier") {
  const x = game.camera + W + rand(80, 260);
  const enemy = {
    kind,
    x,
    y: FLOOR - (kind === "heavy" ? 76 : 64),
    w: kind === "heavy" ? 50 : 36,
    h: kind === "heavy" ? 76 : 64,
    hp: kind === "heavy" ? 5 : 2,
    speed: kind === "heavy" ? 44 : 72,
    shootCd: rand(0.8, 2),
    facing: -1,
    hit: 0,
  };
  game.enemies.push(enemy);
}

function spawnPrisoner() {
  game.prisoners.push({
    x: game.camera + W + rand(120, 450),
    y: FLOOR - 58,
    w: 30,
    h: 58,
    bob: rand(0, 10),
    saved: false,
  });
}

function spawnBoss() {
  game.bossSpawned = true;
  game.boss = {
    x: game.camera + W + 250,
    y: FLOOR - 92,
    w: 152,
    h: 92,
    hp: 46,
    maxHp: 46,
    shootCd: 1.1,
    mortarCd: 2.6,
    hit: 0,
  };
}

function enemyShoot(enemy) {
  const left = enemy.x < player.x ? 1 : -1;
  game.bullets.push({
    x: enemy.x + enemy.w / 2,
    y: enemy.y + 28,
    w: 12,
    h: 5,
    vx: left * 330,
    life: 2,
    fromPlayer: false,
  });
}

function hurtPlayer(amount) {
  if (player.invuln > 0) return;
  player.hp -= amount;
  player.invuln = 1.1;
  game.shake = 0.22;
  addParticles(player.x + player.w / 2, player.y + 34, "#f04d3f", 18, 180);
  if (player.hp <= 0) game.over = true;
}

function explode(x, y, radius, damage) {
  game.explosions.push({ x, y, radius: 8, max: radius, life: 0.38 });
  game.shake = Math.max(game.shake, 0.25);
  addParticles(x, y, "#f08b32", 34, 250);

  for (const enemy of game.enemies) {
    const dx = enemy.x + enemy.w / 2 - x;
    const dy = enemy.y + enemy.h / 2 - y;
    if (Math.hypot(dx, dy) < radius) {
      enemy.hp -= damage;
      enemy.hit = 0.14;
    }
  }
  if (game.boss) {
    const dx = game.boss.x + game.boss.w / 2 - x;
    const dy = game.boss.y + game.boss.h / 2 - y;
    if (Math.hypot(dx, dy) < radius + 45) {
      game.boss.hp -= damage * 1.6;
      game.boss.hit = 0.14;
    }
  }
  if (Math.hypot(player.x + player.w / 2 - x, player.y + player.h / 2 - y) < radius * 0.65) {
    hurtPlayer(1);
  }
}

function update(dt) {
  game.time += dt;
  if (!game.started) return;
  if (keys.has("Enter") && (game.over || game.won)) reset();
  if (game.over || game.won) return;

  player.fireCd -= dt;
  player.grenadeCd -= dt;
  player.invuln -= dt;
  game.shake = Math.max(0, game.shake - dt);

  const left = keys.has("ArrowLeft") || keys.has("KeyA");
  const right = keys.has("ArrowRight") || keys.has("KeyD");
  const jump = keys.has("KeyZ") || keys.has("Space");

  player.vx = (right ? 1 : 0) * 220 - (left ? 1 : 0) * 220;
  if (player.vx !== 0) player.facing = Math.sign(player.vx);
  if (jump && player.onGround) {
    player.vy = -540;
    player.onGround = false;
  }
  if (keys.has("KeyX") || keys.has("KeyJ")) shoot();
  if (keys.has("KeyC") || keys.has("KeyK")) throwGrenade();

  player.vy += 1500 * dt;
  player.x += player.vx * dt;
  player.y += player.vy * dt;
  if (player.y + player.h >= FLOOR) {
    player.y = FLOOR - player.h;
    player.vy = 0;
    player.onGround = true;
  }
  player.x = Math.max(40, player.x);

  game.camera = Math.max(0, player.x - 280);
  game.distance = Math.max(game.distance, player.x);
  game.wave = Math.min(4, 1 + Math.floor(game.distance / 850));

  game.spawnTimer -= dt;
  if (!game.bossSpawned && game.distance < 3000 && game.spawnTimer <= 0) {
    spawnEnemy(Math.random() < 0.2 + game.wave * 0.08 ? "heavy" : "soldier");
    game.spawnTimer = Math.max(0.48, 1.45 - game.wave * 0.18);
  }

  game.prisonerTimer -= dt;
  if (!game.bossSpawned && game.prisonerTimer <= 0) {
    spawnPrisoner();
    game.prisonerTimer = rand(5.5, 8.5);
  }

  if (!game.bossSpawned && game.distance > 3100) spawnBoss();

  for (const bullet of game.bullets) {
    bullet.x += bullet.vx * dt;
    bullet.life -= dt;
  }

  for (const grenade of game.grenades) {
    grenade.vy += 980 * dt;
    grenade.x += grenade.vx * dt;
    grenade.y += grenade.vy * dt;
    grenade.timer -= dt;
    if (grenade.y + grenade.h >= FLOOR) {
      grenade.y = FLOOR - grenade.h;
      grenade.vy *= -0.42;
      grenade.vx *= 0.78;
    }
    if (grenade.timer <= 0) {
      grenade.dead = true;
      explode(grenade.x, grenade.y, 96, 5);
    }
  }

  for (const enemy of game.enemies) {
    enemy.hit -= dt;
    enemy.facing = enemy.x < player.x ? 1 : -1;
    const targetGap = enemy.kind === "heavy" ? 230 : 180;
    if (Math.abs(enemy.x - player.x) > targetGap) {
      enemy.x += enemy.speed * enemy.facing * dt;
    }
    enemy.shootCd -= dt;
    if (enemy.shootCd <= 0 && Math.abs(enemy.x - player.x) < 760) {
      enemyShoot(enemy);
      enemy.shootCd = enemy.kind === "heavy" ? rand(1.0, 1.6) : rand(1.2, 2.4);
    }
    if (rectsHit(enemy, player)) hurtPlayer(enemy.kind === "heavy" ? 2 : 1);
  }

  if (game.boss) {
    const boss = game.boss;
    boss.hit -= dt;
    boss.x = Math.max(game.camera + W - 320, boss.x - 58 * dt);
    boss.shootCd -= dt;
    boss.mortarCd -= dt;
    if (boss.shootCd <= 0) {
      for (let i = 0; i < 3; i++) {
        game.bullets.push({
          x: boss.x + 24,
          y: boss.y + 28 + i * 13,
          w: 16,
          h: 7,
          vx: -420,
          life: 3,
          fromPlayer: false,
        });
      }
      boss.shootCd = 1.0;
    }
    if (boss.mortarCd <= 0) {
      game.grenades.push({
        x: boss.x + 40,
        y: boss.y - 10,
        w: 18,
        h: 18,
        vx: -210,
        vy: -470,
        timer: 1.35,
        hostile: true,
      });
      boss.mortarCd = 2.7;
    }
    if (boss.hp <= 0) {
      explode(boss.x + boss.w / 2, boss.y + boss.h / 2, 160, 0);
      game.score += 5000;
      game.won = true;
    }
  }

  for (const bullet of game.bullets) {
    if (bullet.fromPlayer) {
      for (const enemy of game.enemies) {
        if (!bullet.dead && rectsHit(bullet, enemy)) {
          bullet.dead = true;
          enemy.hp--;
          enemy.hit = 0.1;
          addParticles(bullet.x, bullet.y, "#ffe08a", 6, 90);
        }
      }
      if (game.boss && !bullet.dead && rectsHit(bullet, game.boss)) {
        bullet.dead = true;
        game.boss.hp--;
        game.boss.hit = 0.08;
        addParticles(bullet.x, bullet.y, "#ffe08a", 8, 110);
      }
    } else if (!bullet.dead && rectsHit(bullet, player)) {
      bullet.dead = true;
      hurtPlayer(1);
    }
  }

  for (const enemy of game.enemies) {
    if (enemy.hp <= 0) {
      enemy.dead = true;
      game.score += enemy.kind === "heavy" ? 450 : 160;
      addParticles(enemy.x + enemy.w / 2, enemy.y + enemy.h / 2, "#d84a37", 22, 190);
      if (Math.random() < 0.25) {
        game.pickups.push({
          x: enemy.x,
          y: FLOOR - 28,
          w: 28,
          h: 28,
          type: Math.random() < 0.65 ? "ammo" : "grenade",
        });
      }
    }
  }

  for (const prisoner of game.prisoners) {
    prisoner.bob += dt * 7;
    if (!prisoner.saved && rectsHit(prisoner, player)) {
      prisoner.saved = true;
      player.rescued++;
      player.ammo += 25;
      player.grenades += 1;
      game.score += 1000;
      addParticles(prisoner.x + 14, prisoner.y + 20, "#8ee66f", 18, 140);
    }
  }

  for (const pickup of game.pickups) {
    if (rectsHit(pickup, player)) {
      pickup.dead = true;
      if (pickup.type === "ammo") player.ammo += 40;
      else player.grenades += 2;
      game.score += 120;
      addParticles(pickup.x + 12, pickup.y + 12, "#8ee6ff", 12, 100);
    }
  }

  for (const exp of game.explosions) {
    exp.life -= dt;
    exp.radius = exp.max * (1 - exp.life / 0.38);
  }

  for (const p of game.particles) {
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.vy += 620 * dt;
  }

  game.bullets = game.bullets.filter((b) => b.life > 0 && !b.dead && b.x > game.camera - 120 && b.x < game.camera + W + 160);
  game.grenades = game.grenades.filter((g) => !g.dead);
  game.enemies = game.enemies.filter((e) => !e.dead && e.x > game.camera - 240);
  game.prisoners = game.prisoners.filter((p) => !p.saved && p.x > game.camera - 200);
  game.pickups = game.pickups.filter((p) => !p.dead && p.x > game.camera - 120);
  game.explosions = game.explosions.filter((e) => e.life > 0);
  game.particles = game.particles.filter((p) => p.life > 0);
}

function drawPixelMan(x, y, facing, palette, firing = false) {
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  if (facing < 0) {
    ctx.translate(42, 0);
    ctx.scale(-1, 1);
  }
  ctx.fillStyle = palette.boot;
  ctx.fillRect(8, 58, 10, 14);
  ctx.fillRect(25, 58, 10, 14);
  ctx.fillStyle = palette.pants;
  ctx.fillRect(8, 38, 12, 24);
  ctx.fillRect(24, 38, 12, 24);
  ctx.fillStyle = palette.shirt;
  ctx.fillRect(7, 20, 30, 26);
  ctx.fillStyle = palette.skin;
  ctx.fillRect(13, 8, 20, 16);
  ctx.fillStyle = palette.hair;
  ctx.fillRect(10, 5, 24, 8);
  ctx.fillStyle = "#111";
  ctx.fillRect(26, 14, 4, 4);
  ctx.fillStyle = palette.band;
  ctx.fillRect(9, 10, 28, 5);
  ctx.fillStyle = "#2b2f2b";
  ctx.fillRect(28, 28, firing ? 34 : 28, 8);
  ctx.fillRect(55, 30, 8, 4);
  ctx.restore();
}

function drawSprite(image, x, y, w, h, facing = 1, sourceFacing = 1) {
  if (!image || !image.complete || image.naturalWidth === 0) return false;
  ctx.save();
  ctx.translate(Math.round(x), Math.round(y));
  if (facing !== sourceFacing) {
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(image, 0, 0, w, h);
  ctx.restore();
  return true;
}

function drawBackground() {
  const cam = game.camera;
  const sx = game.shake ? rand(-6, 6) * game.shake * 5 : 0;
  const sy = game.shake ? rand(-4, 4) * game.shake * 5 : 0;
  ctx.save();
  ctx.translate(sx, sy);
  ctx.fillStyle = "#6da7bf";
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#e2c27a";
  ctx.beginPath();
  ctx.arc(820, 78, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#456965";
  for (let i = -1; i < 7; i++) {
    const x = i * 260 - (cam * 0.18) % 260;
    ctx.beginPath();
    ctx.moveTo(x, 315);
    ctx.lineTo(x + 140, 145);
    ctx.lineTo(x + 310, 315);
    ctx.fill();
  }

  ctx.fillStyle = "#243433";
  for (let i = -1; i < 8; i++) {
    const x = i * 180 - (cam * 0.36) % 180;
    ctx.fillRect(x, 285, 84, 160);
    ctx.fillRect(x + 16, 250, 52, 44);
    ctx.fillStyle = "#f3ce70";
    for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) ctx.fillRect(x + 18 + c * 28, 304 + r * 24, 10, 10);
    ctx.fillStyle = "#243433";
  }

  ctx.fillStyle = "#3d503e";
  for (let i = -2; i < 12; i++) {
    const x = i * 110 - (cam * 0.62) % 110;
    ctx.fillRect(x, 386, 84, 64);
    ctx.fillStyle = "#27352c";
    ctx.fillRect(x + 10, 365, 46, 30);
    ctx.fillStyle = "#3d503e";
  }

  ctx.fillStyle = "#6b5533";
  ctx.fillRect(0, FLOOR, W, H - FLOOR);
  ctx.fillStyle = "#99804c";
  ctx.fillRect(0, FLOOR, W, 10);
  ctx.fillStyle = "#473522";
  for (let i = -1; i < 18; i++) {
    const x = i * 72 - (cam % 72);
    ctx.fillRect(x, FLOOR + 28, 48, 10);
  }
  ctx.restore();
}

function drawTank(tank) {
  if (drawSprite(sprites.tank, tank.x - game.camera - 10, tank.y - 22, 186, 108, -1, -1)) {
    if (tank.hit > 0) {
      ctx.fillStyle = "rgba(255, 240, 168, 0.26)";
      ctx.fillRect(tank.x - game.camera - 10, tank.y - 22, 186, 108);
    }
    return;
  }
  ctx.save();
  ctx.translate(Math.round(tank.x - game.camera), Math.round(tank.y));
  ctx.fillStyle = tank.hit > 0 ? "#fff0a8" : "#55645d";
  ctx.fillRect(18, 25, 100, 46);
  ctx.fillStyle = "#3c4742";
  ctx.fillRect(42, 5, 64, 34);
  ctx.fillStyle = "#242b28";
  ctx.fillRect(-20, 22, 68, 13);
  ctx.fillStyle = "#222825";
  ctx.fillRect(10, 67, 128, 22);
  ctx.fillStyle = "#151917";
  for (let i = 0; i < 5; i++) ctx.fillRect(18 + i * 24, 72, 16, 12);
  ctx.fillStyle = "#e2b044";
  ctx.fillRect(56, 14, 18, 12);
  ctx.restore();
}

function drawWorld() {
  for (const prisoner of game.prisoners) {
    const x = prisoner.x - game.camera;
    const y = prisoner.y + Math.sin(prisoner.bob) * 3;
    if (drawSprite(sprites.prisoner, x - 10, y - 8, 50, 74, 1, 1)) continue;
    ctx.fillStyle = "#f1d19d";
    ctx.fillRect(x + 7, y + 4, 16, 17);
    ctx.fillStyle = "#ece8d8";
    ctx.fillRect(x + 4, y + 22, 22, 28);
    ctx.fillStyle = "#202020";
    ctx.fillRect(x + 4, y + 49, 8, 9);
    ctx.fillRect(x + 18, y + 49, 8, 9);
    ctx.fillStyle = "#ffdb4d";
    ctx.fillRect(x - 4, y - 12, 38, 8);
  }

  for (const pickup of game.pickups) {
    ctx.fillStyle = pickup.type === "ammo" ? "#7fd7ff" : "#91e55f";
    ctx.fillRect(pickup.x - game.camera, pickup.y, pickup.w, pickup.h);
    ctx.fillStyle = "#15201c";
    ctx.fillRect(pickup.x - game.camera + 7, pickup.y + 9, 14, 5);
  }

  for (const enemy of game.enemies) {
    const spriteW = enemy.kind === "heavy" ? 58 : 47;
    const spriteH = enemy.kind === "heavy" ? 82 : 70;
    const drew = drawSprite(sprites.enemy, enemy.x - game.camera - 7, enemy.y - 7, spriteW, spriteH, enemy.facing, 1);
    if (drew && enemy.hit > 0) {
      ctx.fillStyle = "rgba(255, 240, 168, 0.28)";
      ctx.fillRect(enemy.x - game.camera - 7, enemy.y - 7, spriteW, spriteH);
    }
    if (drew) continue;
    drawPixelMan(enemy.x - game.camera, enemy.y, enemy.facing, {
      skin: "#dfb27a",
      hair: "#1b1712",
      band: enemy.hit > 0 ? "#fff2a8" : "#b92f26",
      shirt: enemy.kind === "heavy" ? "#5e4f3d" : "#78643e",
      pants: "#4b5639",
      boot: "#181918",
    });
  }

  if (game.boss) drawTank(game.boss);

  for (const grenade of game.grenades) {
    ctx.fillStyle = grenade.hostile ? "#d83b32" : "#24342d";
    ctx.fillRect(grenade.x - game.camera, grenade.y, grenade.w, grenade.h);
    ctx.fillStyle = "#e0c15e";
    ctx.fillRect(grenade.x - game.camera + 4, grenade.y - 4, 6, 5);
  }

  for (const bullet of game.bullets) {
    ctx.fillStyle = bullet.fromPlayer ? "#ffe86f" : "#ff684e";
    ctx.fillRect(bullet.x - game.camera, bullet.y, bullet.w, bullet.h);
  }

  const flicker = player.invuln > 0 && Math.floor(game.time * 18) % 2 === 0;
  if (!flicker) {
    const drew = drawSprite(sprites.player, player.x - game.camera - 10, player.y - 12, 64, 86, player.facing, 1);
    if (!drew) drawPixelMan(player.x - game.camera, player.y, player.facing, {
      skin: "#f0bd83",
      hair: "#2a1a10",
      band: "#e0382f",
      shirt: "#2f8a58",
      pants: "#294c6e",
      boot: "#171717",
    }, player.fireCd > 0.07);
  }

  for (const exp of game.explosions) {
    ctx.fillStyle = "#fff0a5";
    ctx.beginPath();
    ctx.arc(exp.x - game.camera, exp.y, exp.radius * 0.46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#e45624";
    ctx.beginPath();
    ctx.arc(exp.x - game.camera, exp.y, exp.radius * 0.72, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const p of game.particles) {
    ctx.globalAlpha = clamp(p.life * 2, 0, 1);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - game.camera, p.y, p.size, p.size);
    ctx.globalAlpha = 1;
  }
}

function drawHud() {
  ctx.fillStyle = "rgba(16, 18, 16, 0.72)";
  ctx.fillRect(18, 14, 360, 82);
  ctx.strokeStyle = "#e8aa39";
  ctx.lineWidth = 3;
  ctx.strokeRect(18, 14, 360, 82);
  ctx.fillStyle = "#fff0c4";
  ctx.font = "24px Impact, sans-serif";
  ctx.fillText(`IRON RESCUE`, 32, 43);
  ctx.font = "18px Arial, sans-serif";
  ctx.fillText(`HP ${"■".repeat(Math.max(0, player.hp))}`, 32, 70);
  ctx.fillText(`AMMO ${player.ammo}   BOMB ${player.grenades}   POW ${player.rescued}`, 150, 70);

  ctx.fillStyle = "#fff0c4";
  ctx.font = "22px Impact, sans-serif";
  ctx.fillText(`SCORE ${String(game.score).padStart(6, "0")}`, 760, 42);

  if (game.boss) {
    ctx.fillStyle = "#171717";
    ctx.fillRect(260, 505, 440, 16);
    ctx.fillStyle = "#cf382e";
    ctx.fillRect(264, 509, 432 * clamp(game.boss.hp / game.boss.maxHp, 0, 1), 8);
    ctx.fillStyle = "#fff0c4";
    ctx.font = "16px Arial, sans-serif";
    ctx.fillText("ARMORED CARRIER", 392, 499);
  }
}

function drawTitle() {
  ctx.fillStyle = "rgba(7, 8, 7, 0.58)";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#f6eed7";
  ctx.textAlign = "center";
  ctx.font = "72px Impact, sans-serif";
  ctx.fillText("IRON RESCUE", W / 2, 188);
  ctx.fillStyle = "#e8aa39";
  ctx.font = "28px Arial, sans-serif";
  ctx.fillText("횡스크롤 런앤건 미션", W / 2, 232);
  ctx.fillStyle = "#f6eed7";
  ctx.font = "22px Arial, sans-serif";
  ctx.fillText("이동: A/D 또는 ←/→   점프: Z/Space   사격: X/J   수류탄: C/K", W / 2, 304);
  ctx.fillText("Enter 키를 누르면 시작합니다", W / 2, 352);
  ctx.textAlign = "left";
}

function drawEnd() {
  ctx.fillStyle = "rgba(7, 8, 7, 0.68)";
  ctx.fillRect(0, 0, W, H);
  ctx.textAlign = "center";
  ctx.fillStyle = game.won ? "#ffe38a" : "#ff6d57";
  ctx.font = "62px Impact, sans-serif";
  ctx.fillText(game.won ? "MISSION CLEAR" : "MISSION FAILED", W / 2, 210);
  ctx.fillStyle = "#f6eed7";
  ctx.font = "24px Arial, sans-serif";
  ctx.fillText(`SCORE ${game.score}   RESCUED ${player.rescued}`, W / 2, 272);
  ctx.fillText("Enter 키로 다시 시작", W / 2, 330);
  ctx.textAlign = "left";
}

function draw() {
  drawBackground();
  drawWorld();
  drawHud();
  if (!game.started) drawTitle();
  if (game.over || game.won) drawEnd();
}

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(frame);
}

addEventListener("keydown", (event) => {
  keys.add(event.code);
  if (event.code === "Enter" && !game.started) reset();
  if (["ArrowLeft", "ArrowRight", "Space"].includes(event.code)) event.preventDefault();
});

addEventListener("keyup", (event) => keys.delete(event.code));

document.querySelectorAll("[data-key]").forEach((button) => {
  const code = button.dataset.key;
  const press = (event) => {
    event.preventDefault();
    keys.add(code);
    if (!game.started) reset();
  };
  const release = (event) => {
    event.preventDefault();
    keys.delete(code);
  };
  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
});

requestAnimationFrame(frame);
