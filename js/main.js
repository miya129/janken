const CONFIG = {
  NORMAL_MONSTERS: [
    { name: "スライム", img: "5297d486-c4e1-40d3-86f2-63204b173c5a.jpg", hp: 150, atk: 20, exp: 15 },
    { name: "ゴブリン", img: "6bab8ac4-ae9b-4803-a04f-9d61c1262831.jpg", hp: 300, atk: 40, exp: 25 },
    { name: "ゴーレム", img: "964300fa-5231-4d31-8952-043d05f0655a.jpg", hp: 500, atk: 60, exp: 40 },
    { name: "ドラゴン", img: "c1ca23a0-c113-43c1-aa22-981e53a7e0a8.jpg", hp: 800, atk: 90, exp: 80 }
  ],
  BOSS: { name: "魔王", img: "82e385af-e8bf-4773-a130-08ce19e3213c.jpg", hp: 2500, atk: 150, exp: 500 },
  JANKEN_TEXTS: ["グー", "チョキ", "パー"]
};

const player = {
  lv: 1,
  maxHp: 150,
  hp: 150,
  atk: 100,
  exp: 0,
  scroll: 3
};

const gameStatus = {
  currentMonster: null,
  monsterHp: 0,
  streak: 0,
  count: 0
};

window.onload = () => {
  updatePlayerUI();
  spawnMonster();
};

const spawnMonster = () => {
  gameStatus.count++;
  if (gameStatus.count % 10 === 0) {
    gameStatus.currentMonster = CONFIG.BOSS;
    document.getElementById("pc-hand").innerText = gameStatus.count + "戦目！魔王だ！！";
  } else {
    const rand = Math.floor(Math.random() * 100);
    if (rand < 50) gameStatus.currentMonster = CONFIG.NORMAL_MONSTERS[0];
    else if (rand < 80) gameStatus.currentMonster = CONFIG.NORMAL_MONSTERS[1];
    else if (rand < 95) gameStatus.currentMonster = CONFIG.NORMAL_MONSTERS[2];
    else gameStatus.currentMonster = CONFIG.NORMAL_MONSTERS[3];
    document.getElementById("pc-hand").innerText = gameStatus.count + "戦目：敵が現れた";
  }
  gameStatus.monsterHp = gameStatus.currentMonster.hp;
  document.getElementById("monster-name").innerText = gameStatus.currentMonster.name;
  document.getElementById("monster-image").src = gameStatus.currentMonster.img;
  document.getElementById("monster-image").classList.remove("defeat-effect");
  document.getElementById("janken-buttons").style.display = "flex";
  updateEnemyUI();
};

const updatePlayerUI = () => {
  const needExp = player.lv * 30;
  const playerImage = document.getElementById("player-image");
  if (player.lv >= 7) playerImage.src = "66c6060d-916a-42b7-a3c9-f8f6817013d1.jpg";
  else if (player.lv >= 3) playerImage.src = "d7b70b38-3b7d-437e-9a3c-09d583a26a71.jpg";
  else playerImage.src = "71476f75-890a-420f-b43b-7a753cf26dcd.jpg";

  document.getElementById("player-name").innerText = "勇者 (Lv." + player.lv + ")";
  document.getElementById("player-exp").innerText = "EXP: " + player.exp + " / " + needExp;
  document.getElementById("player-hp-text").innerText = "HP: " + player.hp + " / " + player.maxHp;
  
  const percent = (player.hp / player.maxHp) * 100;
  const bar = document.getElementById("player-hp-bar");
  bar.style.width = percent + "%";
  bar.style.backgroundColor = percent > 50 ? "blue" : (percent > 20 ? "orange" : "red");
};

const updateEnemyUI = () => {
  document.getElementById("enemy-hp-text").innerText = "HP: " + gameStatus.monsterHp + " / " + gameStatus.currentMonster.hp;
  const percent = (gameStatus.monsterHp / gameStatus.currentMonster.hp) * 100;
  const bar = document.getElementById("enemy-hp-bar");
  bar.style.width = percent + "%";
  bar.style.backgroundColor = percent > 50 ? "green" : (percent > 20 ? "orange" : "red");
};

const playJanken = (me) => {
  const cpu = Math.floor(Math.random() * 3);
  document.getElementById("pc-hand").innerText = "相手の手: " + CONFIG.JANKEN_TEXTS[cpu];

  const partyList = document.getElementById("party-list");
  const hasMaou = partyList.innerHTML.includes("150.png");

  if (me === cpu) {
    gameStatus.streak = 0;
    const tieDmg = Math.floor(player.atk * 0.5);
    gameStatus.monsterHp -= tieDmg;
    if (gameStatus.monsterHp < 0) gameStatus.monsterHp = 0;
    document.getElementById("judgment").innerText = "あいこ！" + tieDmg + "ダメージ";
  } else if ((me === 0 && cpu === 1) || (me === 1 && cpu === 2) || (me === 2 && cpu === 0)) {
    gameStatus.streak++;
    const multiplier = Math.pow(1.5, gameStatus.streak - 1);
    let dmg = Math.floor(player.atk * multiplier);
    const partyCount = partyList.children.length;
    dmg += (partyCount * 30);
    if (hasMaou) dmg += 2000;

    const isCrit = Math.floor(Math.random() * 100) < 10;
    if (isCrit) {
      dmg *= 2;
      document.getElementById("judgment").innerText = "会心の一撃！ " + dmg;
    } else {
      document.getElementById("judgment").innerText = "勝ち！ " + dmg + "ダメージ";
    }

    gameStatus.monsterHp -= dmg;
    if (gameStatus.monsterHp < 0) gameStatus.monsterHp = 0;
  } else {
    gameStatus.streak = 0;
    let enemyDmg = gameStatus.currentMonster.atk;
    if (hasMaou) enemyDmg = 0;
    player.hp -= enemyDmg;
    if (player.hp < 0) player.hp = 0;
    document.getElementById("judgment").innerText = hasMaou ? "魔王の絶対防御でダメージ0！" : "負け… " + enemyDmg + "ダメージ";
  }

  document.getElementById("streak-center").innerText = gameStatus.streak + "連勝中!";
  updateEnemyUI();
  updatePlayerUI();
  checkBattleEnd();
};

const useItem = () => {
  if (player.scroll > 0) {
    player.scroll--;
    document.getElementById("item-btn").innerText = "巻物(" + player.scroll + ")";
    gameStatus.monsterHp -= 1000;
    if (gameStatus.monsterHp < 0) gameStatus.monsterHp = 0;
    document.getElementById("judgment").innerText = "巻物で1000ダメージ！";
    updateEnemyUI();
    checkBattleEnd();
  } else {
    document.getElementById("judgment").innerText = "巻物がない！";
  }
};

const healAction = () => {
  if (player.exp >= 10) {
    player.exp -= 10;
    gameStatus.streak = 0;
    const healVal = Math.floor(player.maxHp * 0.4);
    player.hp += healVal;
    if (player.hp > player.maxHp) player.hp = player.maxHp;
    document.getElementById("judgment").innerText = healVal + "回復した";
    updatePlayerUI();
    
    setTimeout(() => {
      const partyList = document.getElementById("party-list");
      const hasMaou = partyList.innerHTML.includes("150.png");
      let enemyDmg = gameStatus.currentMonster.atk;
      if (hasMaou) enemyDmg = 0;
      player.hp -= enemyDmg;
      if (player.hp < 0) player.hp = 0;
      updatePlayerUI();
      checkBattleEnd();
    }, 500);
  } else {
    document.getElementById("judgment").innerText = "EXP不足(10必要)";
  }
};

const checkBattleEnd = () => {
  if (gameStatus.monsterHp === 0) {
    document.getElementById("janken-buttons").style.display = "none";
    document.getElementById("monster-image").classList.add("defeat-effect");
    player.exp += CONFIG.NORMAL_MONSTERS[0].exp; // 便宜上の加算
    
    const needExp = player.lv * 30;
    if (player.exp >= needExp && player.lv < 10) {
      player.lv++;
      player.exp = 0;
      player.maxHp += 50;
      player.hp = player.maxHp;
      player.atk += 30;
      document.getElementById("levelup-msg").innerText = "レベル " + player.lv + " になった！";
      document.getElementById("game-view").style.display = "none";
      document.getElementById("levelup-screen").style.display = "block";
      updatePlayerUI();
      return;
    }

    if (gameStatus.currentMonster.name === "魔王") {
      setTimeout(() => {
        document.getElementById("game-view").style.display = "none";
        document.getElementById("clear-screen").style.display = "block";
      }, 500);
    } else {
      setTimeout(() => {
        document.getElementById("catch-stage").style.display = "block";
      }, 500);
    }
  }

  if (player.hp === 0) {
    const partyList = document.getElementById("party-list");
    if (partyList.children.length > 0) {
      partyList.removeChild(partyList.lastChild);
      player.hp = player.maxHp;
      updatePlayerUI();
      document.getElementById("game-view").style.display = "none";
      document.getElementById("sacrifice-screen").style.display = "block";
      return;
    }

    if (player.lv === 1) {
      document.getElementById("game-view").style.display = "none";
      document.getElementById("gameover-screen").style.display = "block";
    } else {
      gameStatus.streak = 0;
      player.lv--;
      player.exp = 0;
      player.maxHp = 100 + (player.lv * 50);
      player.hp = player.maxHp;
      player.atk = 70 + (player.lv * 30);
      updatePlayerUI();
      document.getElementById("game-view").style.display = "none";
      document.getElementById("penalty-screen").style.display = "block";
    }
  }
};

const tryCatch = () => {
  if (Math.floor(Math.random() * 100) < 30) {
    document.getElementById("catch-msg").innerText = "仲間になった！";
    const imgUrl = document.getElementById("monster-image").src;
    document.getElementById("party-list").innerHTML += '<img class="party-img" src="' + imgUrl + '">';
  } else {
    document.getElementById("catch-msg").innerText = "逃げられた…";
  }
  setTimeout(() => {
    document.getElementById("catch-stage").style.display = "none";
    document.getElementById("catch-msg").innerText = "ゲットチャンス！";
    spawnMonster();
  }, 1000);
};

const closeLevelUp = () => {
  document.getElementById("levelup-screen").style.display = "none";
  document.getElementById("game-view").style.display = "block";
  if (gameStatus.currentMonster.name === "魔王") {
    document.getElementById("game-view").style.display = "none";
    document.getElementById("clear-screen").style.display = "block";
  } else {
    document.getElementById("catch-stage").style.display = "block";
  }
};

const closePenalty = () => {
  document.getElementById("penalty-screen").style.display = "none";
  document.getElementById("game-view").style.display = "block";
};

const closeSacrifice = () => {
  document.getElementById("sacrifice-screen").style.display = "none";
  document.getElementById("game-view").style.display = "block";
};

const continueAfterClear = () => {
  document.getElementById("clear-screen").style.display = "none";
  document.getElementById("game-view").style.display = "block";
  document.getElementById("catch-stage").style.display = "block";
};

const restartAfterGameOver = () => {
  player.lv = 1;
  player.maxHp = 150;
  player.hp = 150;
  player.atk = 100;
  player.exp = 0;
  player.scroll = 3;
  gameStatus.count = 0;
  gameStatus.streak = 0;
  
  document.getElementById("item-btn").innerText = "巻物(3)";
  document.getElementById("streak-center").innerText = "0連勝中!";
  document.getElementById("party-list").innerHTML = "";
  document.getElementById("gameover-screen").style.display = "none";
  document.getElementById("game-view").style.display = "block";
  updatePlayerUI();
  spawnMonster();
};