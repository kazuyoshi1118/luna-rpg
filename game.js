// ===================================================
//  黒猫ルナ RPG  -  game.js
//  Engine: Phaser 3.60
//  Author: NEKOMUSICA / たきよし
// ===================================================

const W = 480;
const H = 640;

// ─────────────────────────────────────────
//  SCENE: Boot
// ─────────────────────────────────────────
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    // ロード画面
    const bar = this.add.rectangle(W/2, H/2, 0, 6, 0x9030a0);
    const bg  = this.add.rectangle(W/2, H/2, 280, 6, 0x1a0a2e).setDepth(-1);
    this.load.on('progress', v => bar.width = 280 * v);

    this.add.text(W/2, H/2 - 30, 'Loading...', {
      fontSize: '14px', color: '#7050a0', fontFamily: 'serif',
      letterSpacing: 4
    }).setOrigin(0.5);
  }

  create() {
    this.scene.start('Title');
  }
}

// ─────────────────────────────────────────
//  SCENE: Title
// ─────────────────────────────────────────
class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    // 背景グラデーション（矩形で擬似）
    this.add.rectangle(W/2, H/2, W, H, 0x030308);
    this.add.rectangle(W/2, H*0.4, W, H*0.6, 0x0d061a).setAlpha(0.7);

    // 星
    this._stars = [];
    for (let i = 0; i < 80; i++) {
      const s = this.add.circle(
        Phaser.Math.Between(0, W),
        Phaser.Math.Between(0, H),
        Phaser.Math.FloatBetween(0.3, 1.5),
        0xffffff
      ).setAlpha(Phaser.Math.FloatBetween(0.1, 0.9));
      this._stars.push(s);
      this.tweens.add({
        targets: s,
        alpha: { from: Phaser.Math.FloatBetween(0.1, 0.4), to: Phaser.Math.FloatBetween(0.6, 1) },
        duration: Phaser.Math.Between(1500, 4000),
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 3000)
      });
    }

    // ロゴ
    this.add.text(W/2, 80, '✦  N E K O M U S I C A  presents  ✦', {
      fontSize: '10px', color: '#5a3a7a', fontFamily: 'serif', letterSpacing: 2
    }).setOrigin(0.5);

    const title = this.add.text(W/2, 190, '黒猫ルナ', {
      fontSize: '56px', color: '#c090f0', fontFamily: 'serif', fontStyle: 'bold',
      letterSpacing: 12,
      shadow: { offsetX: 0, offsetY: 0, color: '#9040d0', blur: 24, fill: true }
    }).setOrigin(0.5).setAlpha(0);

    this.add.text(W/2, 260, 'LUNA  THE  BLACK  CAT', {
      fontSize: '13px', color: '#c0a000', fontFamily: 'serif', letterSpacing: 6
    }).setOrigin(0.5);

    this.add.text(W/2, 288, '魔王討伐の旅', {
      fontSize: '11px', color: '#6a4a7a', fontFamily: 'serif', letterSpacing: 4
    }).setOrigin(0.5);

    // タイトルフェードイン
    this.tweens.add({ targets: title, alpha: 1, duration: 1500, ease: 'Power2' });

    // START テキスト（点滅）
    const startTxt = this.add.text(W/2, 420, '▶  タ ッ プ し て 始 め る  ◀', {
      fontSize: '12px', color: '#9060b0', fontFamily: 'serif', letterSpacing: 4
    }).setOrigin(0.5);

    this.tweens.add({
      targets: startTxt, alpha: 0.2,
      duration: 900, ease: 'Sine.easeInOut', yoyo: true, repeat: -1
    });

    // バージョン
    this.add.text(W - 12, H - 12, 'v0.1.0  prototype', {
      fontSize: '10px', color: '#3a2a5a', fontFamily: 'serif'
    }).setOrigin(1, 1);

    // クリック/タップで開始
    this.input.once('pointerdown', () => {
      this.cameras.main.fadeOut(600, 3, 3, 8);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('VN');
      });
    });

    this.cameras.main.fadeIn(800, 3, 3, 8);
  }
}

// ─────────────────────────────────────────
//  SCENE: Visual Novel
// ─────────────────────────────────────────
const VN_SCRIPT = [
  { speaker: null,   text: '――かつて、この世界に\n偉大な魔法使いがいた。\nその名を、シオン。',          bg: 0x030308 },
  { speaker: null,   text: '彼女は数百年を生き、\n無数の悪を討ち滅ぼした。\nそして、ルナの師であり\n――唯一の家族だった。',  bg: 0x030308 },
  { speaker: null,   text: '……三ヶ月前。\nシオンは死んだ。\n魔王「ヴェイン」の手によって。',             bg: 0x100005, red: true },
  { speaker: 'ルナ', text: '「絶対に、仇を討つ。」\n\n廃墟の前に立つルナの目は、\n炎のように赤く燃えていた。', bg: 0x05040f },
  { speaker: 'カイ',  text: '「ルナ、待てよ。\n一人で突っ込む気か？」',                               bg: 0x05040f },
  { speaker: 'ルナ', text: '「……ついてきたの。\n余計なお世話よ。」',                                  bg: 0x05040f },
  { speaker: 'カイ',  text: '「幼馴染が死にに行くのを、\n黙って見てられるか。\n――行くぞ、ルナ。」',       bg: 0x05040f, battle: true },
];

class VNScene extends Phaser.Scene {
  constructor() { super('VN'); }

  create() {
    this._idx = 0;
    this._typing = false;
    this._tyTimer = null;

    // BG
    this._bg = this.add.rectangle(W/2, H/2, W, H, 0x030308);

    // テキストボックス背景
    const boxH = 200;
    this._boxBg = this.add.rectangle(W/2, H - boxH/2, W, boxH, 0x08040f, 0.92);
    this._boxBorder = this.add.rectangle(W/2, H - boxH, W, 1, 0x3d2d6c);

    // 話者名
    this._speakerTxt = this.add.text(28, H - boxH + 14, '', {
      fontSize: '13px', color: '#c0a000', fontFamily: 'serif',
      fontStyle: 'bold', letterSpacing: 3
    });

    // 本文
    this._mainTxt = this.add.text(28, H - boxH + 36, '', {
      fontSize: '15px', color: '#e8e0f0', fontFamily: 'serif',
      lineSpacing: 10, wordWrap: { width: W - 56 }
    });

    // ▼ 次へインジケータ
    this._nextArrow = this.add.text(W - 24, H - 20, '▼', {
      fontSize: '16px', color: '#7050a0', fontFamily: 'serif'
    }).setOrigin(1, 1).setAlpha(0);

    this.tweens.add({
      targets: this._nextArrow, alpha: 0.3,
      duration: 700, ease: 'Sine.easeInOut', yoyo: true, repeat: -1
    });

    // 進捗
    this._progressTxt = this.add.text(28, H - 186, '', {
      fontSize: '10px', color: '#4a3a6a', fontFamily: 'serif'
    });

    // スキップ
    const skipBtn = this.add.text(W - 16, H - 186, 'SKIP ▶▶', {
      fontSize: '10px', color: '#5a4a7a', fontFamily: 'serif', letterSpacing: 2
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true });
    skipBtn.on('pointerover', () => skipBtn.setColor('#9070c0'));
    skipBtn.on('pointerout',  () => skipBtn.setColor('#5a4a7a'));
    skipBtn.on('pointerdown', () => this._skipToLast());

    // クリックで進行
    this.input.on('pointerdown', (ptr) => {
      if (ptr.y < H - 200) return; // ボックス外は無視
      this._handleClick();
    });

    this.cameras.main.fadeIn(600, 3, 3, 8);
    this._loadScene(0);
  }

  _loadScene(i) {
    const sc = VN_SCRIPT[i];
    this._bg.setFillStyle(sc.bg);
    this._speakerTxt.setText(sc.speaker || '');
    this._speakerTxt.setColor(sc.speaker === 'カイ' ? '#6090d0' : '#c0a000');
    this._mainTxt.setText('');
    this._nextArrow.setAlpha(0);
    this._progressTxt.setText(`${i + 1} / ${VN_SCRIPT.length}`);

    this._typing = true;
    let charIdx = 0;
    const full = sc.text;
    if (this._tyTimer) this._tyTimer.remove();
    this._tyTimer = this.time.addEvent({
      delay: 38,
      repeat: full.length - 1,
      callback: () => {
        charIdx++;
        this._mainTxt.setText(full.slice(0, charIdx));
        if (charIdx >= full.length) {
          this._typing = false;
          this._nextArrow.setAlpha(1);
        }
      }
    });
  }

  _handleClick() {
    if (this._typing) {
      // 即時全表示
      if (this._tyTimer) this._tyTimer.remove();
      this._typing = false;
      this._mainTxt.setText(VN_SCRIPT[this._idx].text);
      this._nextArrow.setAlpha(1);
      return;
    }
    const sc = VN_SCRIPT[this._idx];
    if (sc.battle) {
      this._goToBattle(); return;
    }
    if (this._idx < VN_SCRIPT.length - 1) {
      this._idx++;
      this._loadScene(this._idx);
    }
  }

  _skipToLast() {
    if (this._tyTimer) this._tyTimer.remove();
    this._typing = false;
    this._idx = VN_SCRIPT.length - 2;
    this._loadScene(this._idx);
  }

  _goToBattle() {
    this.cameras.main.fadeOut(600, 3, 3, 8);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('Battle');
    });
  }
}

// ─────────────────────────────────────────
//  SCENE: Battle
// ─────────────────────────────────────────
const SKILLS_DATA = [
  { name: '通常攻撃', type: 'atk',  cost: 0,  power: 1.0,  desc: '剣で斬りかかる' },
  { name: '黒　焔',   type: 'mag',  cost: 10, power: 1.5,  desc: '黒炎を放つ  MP10' },
  { name: '月の刃',   type: 'mag',  cost: 20, power: 2.5,  desc: '月光の刃  MP20' },
  { name: '回　復',   type: 'heal', cost: 15, heal: 30,    desc: 'HPを30回復  MP15' },
];

class BattleScene extends Phaser.Scene {
  constructor() { super('Battle'); }

  create() {
    this._luna  = { hp: 80, maxHp: 80, mp: 60, maxMp: 60, atk: 18, mag: 28 };
    this._enemy = { hp: 65, maxHp: 65, atk: 14 };
    this._acting = false;

    // BG
    this.add.rectangle(W/2, H/2, W, H, 0x02020c);

    // 星（少なめ）
    for (let i = 0; i < 30; i++) {
      const s = this.add.circle(
        Phaser.Math.Between(0, W), Phaser.Math.Between(0, H*0.5),
        Phaser.Math.FloatBetween(0.3, 1.2), 0xffffff
      ).setAlpha(Phaser.Math.FloatBetween(0.1, 0.6));
      this.tweens.add({
        targets: s, alpha: { from: 0.05, to: 0.5 },
        duration: Phaser.Math.Between(1500, 3500),
        ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
        delay: Phaser.Math.Between(0, 2000)
      });
    }

    this._buildUI();
    this._addLog('影の番人が現れた！');
    this._updateBars();

    this.cameras.main.fadeIn(600, 2, 2, 12);
  }

  _buildUI() {
    const Y_TOP = 8;

    // ── Luna stat box ──
    this.add.rectangle(118, Y_TOP + 44, 220, 80, 0x14082a, 0.95)
      .setStrokeStyle(0.5, 0x3d2d5c);
    this.add.text(14, Y_TOP + 10, '✦ LUNA', {
      fontSize: '11px', color: '#8060a0', fontFamily: 'serif', letterSpacing: 3
    });
    this._lunaHpTxt = this.add.text(220, Y_TOP + 10, '80 / 80', {
      fontSize: '12px', color: '#e8e0f0', fontFamily: 'serif'
    }).setOrigin(1, 0);
    this.add.text(14, Y_TOP + 30, 'HP', { fontSize: '10px', color: '#9060b0', fontFamily: 'serif' });
    this._lunaHpBarBg = this.add.rectangle(118, Y_TOP + 44, 200, 8, 0x0a0818).setStrokeStyle(0.5, 0x2d1d4c);
    this._lunaHpBar   = this.add.rectangle(18, Y_TOP + 44, 200, 8, 0x9030a0).setOrigin(0, 0.5);
    this.add.text(14, Y_TOP + 58, 'MP', { fontSize: '10px', color: '#406090', fontFamily: 'serif' });
    this._lunaMpTxt = this.add.text(220, Y_TOP + 58, '60 / 60', {
      fontSize: '10px', color: '#4080c0', fontFamily: 'serif'
    }).setOrigin(1, 0);
    this._lunaMpBarBg = this.add.rectangle(118, Y_TOP + 70, 200, 5, 0x0a0818).setStrokeStyle(0.5, 0x1d1040);
    this._lunaMpBar   = this.add.rectangle(18, Y_TOP + 70, 200, 5, 0x2060c0).setOrigin(0, 0.5);

    // ── Enemy stat box ──
    this.add.rectangle(362, Y_TOP + 44, 220, 80, 0x14082a, 0.95)
      .setStrokeStyle(0.5, 0x3d1c1c);
    this._enemyNameTxt = this.add.text(252, Y_TOP + 10, '影の番人', {
      fontSize: '11px', color: '#8a2020', fontFamily: 'serif', letterSpacing: 3
    });
    this._enemyHpTxt = this.add.text(468, Y_TOP + 10, '65 / 65', {
      fontSize: '12px', color: '#e8e0f0', fontFamily: 'serif'
    }).setOrigin(1, 0);
    this.add.text(252, Y_TOP + 30, 'HP', { fontSize: '10px', color: '#902020', fontFamily: 'serif' });
    this._enemyHpBarBg = this.add.rectangle(362, Y_TOP + 44, 200, 8, 0x0a0818).setStrokeStyle(0.5, 0x3a1010);
    this._enemyHpBar   = this.add.rectangle(262, Y_TOP + 44, 200, 8, 0xc0392b).setOrigin(0, 0.5);

    // ── Enemy sprite (graphics) ──
    this._enemyGfx = this.add.graphics();
    this._drawEnemy(false);

    // ── Battle log ──
    const LOG_Y = H - 240;
    this.add.rectangle(W/2, LOG_Y + 36, W - 32, 76, 0x000000, 0.6)
      .setStrokeStyle(0.5, 0x2d1d4c);
    this._logTexts = [];
    for (let i = 0; i < 3; i++) {
      this._logTexts.push(
        this.add.text(20, LOG_Y + 6 + i * 22, '', {
          fontSize: '12px', color: '#a090b8', fontFamily: 'serif'
        })
      );
    }
    this._logLines = [];

    // ── Skill buttons ──
    const BTN_Y = H - 152;
    const btns = [
      { x: 8,     y: BTN_Y },
      { x: W/2+4, y: BTN_Y },
      { x: 8,     y: BTN_Y + 68 },
      { x: W/2+4, y: BTN_Y + 68 },
    ];
    this._skillBtns = [];
    btns.forEach((pos, i) => {
      const bw = W/2 - 12;
      const bh = 60;
      const bx = pos.x + bw/2;
      const by = pos.y + bh/2;
      const bg = this.add.rectangle(bx, by, bw, bh, 0x14082a)
        .setStrokeStyle(0.5, 0x3d2d5c)
        .setInteractive({ useHandCursor: true });
      const sk = SKILLS_DATA[i];
      const nameT = this.add.text(pos.x + 12, pos.y + 10, sk.name, {
        fontSize: '14px', color: '#d8c0f8', fontFamily: 'serif', fontStyle: 'bold', letterSpacing: 2
      });
      const descT = this.add.text(pos.x + 12, pos.y + 36, sk.desc, {
        fontSize: '10px', color: '#7060a0', fontFamily: 'serif'
      });
      bg.on('pointerover', () => { if (!this._acting) bg.setFillStyle(0x3c1e5a); });
      bg.on('pointerout',  () => bg.setFillStyle(0x14082a));
      bg.on('pointerdown', () => this._useSkill(i));
      this._skillBtns.push({ bg, nameT, descT });
    });
  }

  _drawEnemy(flash) {
    const g = this._enemyGfx;
    g.clear();
    const EX = W/2, EY = 300;
    if (flash) {
      g.fillStyle(0xffffff, 0.8);
    } else {
      g.fillStyle(0x141420, 1);
    }
    // 体
    g.fillEllipse(EX, EY + 20, 110, 120);
    // 頭
    g.fillStyle(flash ? 0xffffff : 0x1e1e30, 1);
    g.fillEllipse(EX, EY - 45, 80, 84);
    // 目（赤）
    if (!flash) {
      g.fillStyle(0xff1010, 0.9);
      g.fillEllipse(EX - 18, EY - 50, 20, 16);
      g.fillEllipse(EX + 18, EY - 50, 20, 16);
      g.fillStyle(0xff4040, 1);
      g.fillEllipse(EX - 18, EY - 50, 8, 7);
      g.fillEllipse(EX + 18, EY - 50, 8, 7);
    }
    // 腕
    g.fillStyle(flash ? 0xffffff : 0x1e1e30, 1);
    g.fillEllipse(EX - 65, EY + 10, 48, 36);
    g.fillEllipse(EX + 65, EY + 10, 48, 36);
    // 剣
    g.fillStyle(flash ? 0xffffff : 0x404050, 1);
    g.fillRect(EX + 56, EY - 30, 10, 90);
    g.fillStyle(flash ? 0xffffff : 0x606070, 1);
    g.fillRect(EX + 42, EY + 38, 38, 8);
    // 足
    g.fillStyle(flash ? 0xffffff : 0x1e1e30, 1);
    g.fillRect(EX - 28, EY + 75, 22, 52);
    g.fillRect(EX + 6,  EY + 75, 22, 52);
    // HP bar 下
    g.fillStyle(0x0a0818, 1);
    g.fillRoundedRect(EX - 80, EY + 136, 160, 8, 3);
    g.fillStyle(0xc0392b, 1);
    const ratio = this._enemy.hp / this._enemy.maxHp;
    g.fillRoundedRect(EX - 80, EY + 136, 160 * ratio, 8, 3);
    // 名前タグ
    g.fillStyle(0x100000, 0.8);
    g.fillRoundedRect(EX - 60, EY - 108, 120, 22, 10);
    g.lineStyle(0.5, 0x4a1010);
    g.strokeRoundedRect(EX - 60, EY - 108, 120, 22, 10);
  }

  _addLog(msg) {
    this._logLines.push(msg);
    if (this._logLines.length > 3) this._logLines.shift();
    this._logTexts.forEach((t, i) => {
      const line = this._logLines[i] || '';
      t.setText(line ? '▸ ' + line : '');
      t.setColor(i === this._logLines.length - 1 ? '#e8e0f0' : '#8070a0');
    });
  }

  _updateBars() {
    const lhpR = this._luna.hp / this._luna.maxHp;
    const lmpR = this._luna.mp / this._luna.maxMp;
    const ehpR = this._enemy.hp / this._enemy.maxHp;

    this._lunaHpBar.width = 200 * lhpR;
    this._lunaHpBar.setFillStyle(lhpR > 0.5 ? 0x9030a0 : lhpR > 0.25 ? 0xc07000 : 0xc03000);
    this._lunaMpBar.width = 200 * lmpR;
    this._enemyHpBar.width = 200 * ehpR;

    this._lunaHpTxt.setText(`${this._luna.hp} / ${this._luna.maxHp}`);
    this._lunaMpTxt.setText(`${this._luna.mp} / ${this._luna.maxMp}`);
    this._enemyHpTxt.setText(`${this._enemy.hp} / ${this._enemy.maxHp}`);

    this._drawEnemy(false);
  }

  _setButtonsEnabled(on) {
    this._skillBtns.forEach((btn, i) => {
      const sk = SKILLS_DATA[i];
      const ok = on && (sk.type === 'atk' || sk.cost <= this._luna.mp);
      btn.bg.setAlpha(ok ? 1 : 0.4);
      btn.bg.disableInteractive();
      if (ok) btn.bg.setInteractive({ useHandCursor: true });
    });
  }

  _useSkill(i) {
    if (this._acting) return;
    const sk = SKILLS_DATA[i];
    if (sk.cost > this._luna.mp) { this._addLog('MPが足りない！'); return; }

    this._acting = true;
    this._setButtonsEnabled(false);
    this._luna.mp -= sk.cost;

    if (sk.type === 'heal') {
      this._luna.hp = Math.min(this._luna.maxHp, this._luna.hp + sk.heal);
      this._addLog(`${sk.name}！ HPが${sk.heal}回復した！`);
      this._updateBars();
      this.cameras.main.flash(300, 0, 200, 60);
    } else {
      const base = sk.type === 'mag' ? this._luna.mag : this._luna.atk;
      const dmg  = Math.floor(base * sk.power * (0.85 + Math.random() * 0.3));
      this._enemy.hp = Math.max(0, this._enemy.hp - dmg);
      this._addLog(`${sk.name}！ ${dmg} ダメージ！`);
      // フラッシュ＆シェイク
      this._drawEnemy(true);
      this.time.delayedCall(200, () => this._drawEnemy(false));
      this.cameras.main.shake(200, 0.005);
      this._updateBars();
    }

    this.time.delayedCall(600, () => {
      if (this._enemy.hp <= 0) {
        this._addLog('影の番人を倒した！');
        this._addLog('✦ 闇の結晶 を手に入れた！');
        this.time.delayedCall(1200, () => {
          this.cameras.main.fadeOut(600, 3, 3, 8);
          this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Victory'));
        });
        return;
      }
      // 敵のターン
      this.time.delayedCall(400, () => {
        const edm = Math.floor(this._enemy.atk * (0.8 + Math.random() * 0.4));
        this._luna.hp = Math.max(0, this._luna.hp - edm);
        this._addLog(`影の番人の攻撃！ ${edm} ダメージ！`);
        this.cameras.main.shake(250, 0.008);
        this._updateBars();
        this.time.delayedCall(600, () => {
          if (this._luna.hp <= 0) {
            this._addLog('ルナは倒れた……');
            this.time.delayedCall(1200, () => {
              this.cameras.main.fadeOut(600, 0, 0, 0);
              this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('GameOver'));
            });
            return;
          }
          this._acting = false;
          this._setButtonsEnabled(true);
        });
      });
    });
  }
}

// ─────────────────────────────────────────
//  SCENE: Victory
// ─────────────────────────────────────────
class VictoryScene extends Phaser.Scene {
  constructor() { super('Victory'); }
  create() {
    this.add.rectangle(W/2, H/2, W, H, 0x0a0600);
    _makeStars(this, 100);
    this.add.text(W/2, 160, '✦  V I C T O R Y  ✦', {
      fontSize: '11px', color: '#8a6a10', fontFamily: 'serif', letterSpacing: 6
    }).setOrigin(0.5);
    this.add.text(W/2, 220, '勝　利', {
      fontSize: '48px', color: '#ffe080', fontFamily: 'serif', fontStyle: 'bold', letterSpacing: 10,
      shadow: { color: '#c0a000', blur: 20, fill: true }
    }).setOrigin(0.5);
    this.add.rectangle(W/2, 300, 220, 38, 0x201800, 0.8).setStrokeStyle(0.5, 0x5a4010);
    this.add.text(W/2, 300, '🔮 闇の結晶 を手に入れた', {
      fontSize: '13px', color: '#c0a870', fontFamily: 'serif', letterSpacing: 2
    }).setOrigin(0.5);
    this.add.text(W/2, 370, '「……まだ、始まりに過ぎない。\nヴェイン、待ってなさい。」', {
      fontSize: '13px', color: '#c0b070', fontFamily: 'serif',
      lineSpacing: 8, align: 'center'
    }).setOrigin(0.5);
    const tap = this.add.text(W/2, 460, '▶　タ ッ プ で タ イ ト ル へ', {
      fontSize: '11px', color: '#7a6030', fontFamily: 'serif', letterSpacing: 4
    }).setOrigin(0.5);
    this.tweens.add({ targets: tap, alpha: 0.2, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine' });
    this.cameras.main.fadeIn(800, 3, 3, 8);
    this.input.once('pointerdown', () => {
      this.cameras.main.fadeOut(500, 3, 3, 8);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Title'));
    });
  }
}

// ─────────────────────────────────────────
//  SCENE: GameOver
// ─────────────────────────────────────────
class GameOverScene extends Phaser.Scene {
  constructor() { super('GameOver'); }
  create() {
    this.add.rectangle(W/2, H/2, W, H, 0x060000);
    _makeStars(this, 40);
    this.add.text(W/2, 160, '― GAME OVER ―', {
      fontSize: '11px', color: '#8a2020', fontFamily: 'serif', letterSpacing: 6
    }).setOrigin(0.5);
    this.add.text(W/2, 230, '敗　北', {
      fontSize: '48px', color: '#ff6060', fontFamily: 'serif', fontStyle: 'bold', letterSpacing: 10,
      shadow: { color: '#800000', blur: 20, fill: true }
    }).setOrigin(0.5);
    this.add.text(W/2, 320, 'ルナは倒れた……', {
      fontSize: '14px', color: '#a07070', fontFamily: 'serif', letterSpacing: 3
    }).setOrigin(0.5);
    this.add.text(W/2, 360, '「シオン……ごめんなさい」', {
      fontSize: '13px', color: '#806060', fontFamily: 'serif'
    }).setOrigin(0.5);
    const tap = this.add.text(W/2, 460, '▶　タ ッ プ で タ イ ト ル へ', {
      fontSize: '11px', color: '#6a3030', fontFamily: 'serif', letterSpacing: 4
    }).setOrigin(0.5);
    this.tweens.add({ targets: tap, alpha: 0.2, duration: 1000, yoyo: true, repeat: -1, ease: 'Sine' });
    this.cameras.main.fadeIn(800, 0, 0, 0);
    this.input.once('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Title'));
    });
  }
}

// ─────────────────────────────────────────
//  Helper
// ─────────────────────────────────────────
function _makeStars(scene, n) {
  for (let i = 0; i < n; i++) {
    const s = scene.add.circle(
      Phaser.Math.Between(0, W),
      Phaser.Math.Between(0, H),
      Phaser.Math.FloatBetween(0.3, 1.5),
      0xffffff
    ).setAlpha(Phaser.Math.FloatBetween(0.1, 0.8));
    scene.tweens.add({
      targets: s, alpha: { from: 0.05, to: 0.6 },
      duration: Phaser.Math.Between(1500, 4000),
      ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
      delay: Phaser.Math.Between(0, 3000)
    });
  }
}

// ─────────────────────────────────────────
//  Phaser config & Launch
// ─────────────────────────────────────────
const config = {
  type: Phaser.AUTO,
  width: W,
  height: H,
  backgroundColor: '#030308',
  parent: 'game-container',
  scene: [BootScene, TitleScene, VNScene, BattleScene, VictoryScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
