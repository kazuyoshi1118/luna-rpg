// ===================================================
//  黒猫ルナ RPG  -  game.js  v0.2 (with assets)
//  Engine: Phaser 3.60
//  Author: NEKOMUSICA / たきよし
// ===================================================

const W = 480;
const H = 640;

// ─────────────────────────────────────────
//  SCENE: Boot / Preload
// ─────────────────────────────────────────
class BootScene extends Phaser.Scene {
  constructor() { super('Boot'); }

  preload() {
    const bar = this.add.rectangle(W/2 - 140, H/2, 0, 8, 0x9030a0).setOrigin(0, 0.5);
    this.add.rectangle(W/2, H/2, 280, 8, 0x1a0a2e);
    this.add.text(W/2, H/2 - 28, '黒猫ルナ  読み込み中...', {
      fontSize: '13px', color: '#6040a0', fontFamily: 'serif', letterSpacing: 3
    }).setOrigin(0.5);
    this.load.on('progress', v => { bar.width = 280 * v; });
    this.load.image('luna',    'assets/luna.jpg');
    this.load.image('kai',     'assets/kai.jpg');
    this.load.image('bg_ruin', 'assets/bg_ruin.jpg');
    this.load.image('enemy',   'assets/enemy.jpg');
  }

  create() { this.scene.start('Title'); }
}

// ─────────────────────────────────────────
//  SCENE: Title
// ─────────────────────────────────────────
class TitleScene extends Phaser.Scene {
  constructor() { super('Title'); }

  create() {
    const bgImg = this.add.image(W/2, H/2, 'bg_ruin');
    bgImg.setScale(Math.max(W/bgImg.width, H/bgImg.height)).setAlpha(0.35);
    this.add.rectangle(W/2, H/2, W, H, 0x000000, 0.55);

    for (let i = 0; i < 60; i++) {
      const s = this.add.circle(
        Phaser.Math.Between(0, W), Phaser.Math.Between(0, H),
        Phaser.Math.FloatBetween(0.3, 1.5), 0xffffff
      ).setAlpha(Phaser.Math.FloatBetween(0.1, 0.8));
      this.tweens.add({ targets: s, alpha: { from: 0.05, to: Phaser.Math.FloatBetween(0.5, 1) },
        duration: Phaser.Math.Between(1500, 4000), ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
        delay: Phaser.Math.Between(0, 3000) });
    }

    const lunaImg = this.add.image(W * 0.72, H * 0.62, 'luna').setAlpha(0);
    lunaImg.setScale(Math.min((H*0.7)/lunaImg.height, (W*0.5)/lunaImg.width));
    this.tweens.add({ targets: lunaImg, alpha: 0.5, duration: 2000, ease: 'Power2' });

    this.add.text(W/2, 70, '✦  N E K O M U S I C A  presents  ✦', {
      fontSize: '10px', color: '#5a3a7a', fontFamily: 'serif', letterSpacing: 2 }).setOrigin(0.5);

    const title = this.add.text(W/2, 180, '黒猫ルナ', {
      fontSize: '54px', color: '#c090f0', fontFamily: 'serif', fontStyle: 'bold', letterSpacing: 12,
      shadow: { offsetX: 0, offsetY: 0, color: '#8030c0', blur: 28, fill: true }
    }).setOrigin(0.5).setAlpha(0);
    this.tweens.add({ targets: title, alpha: 1, duration: 1500, ease: 'Power2' });

    this.add.text(W/2, 252, 'LUNA  THE  BLACK  CAT', {
      fontSize: '13px', color: '#c0a000', fontFamily: 'serif', letterSpacing: 6 }).setOrigin(0.5);
    this.add.text(W/2, 278, '魔王討伐の旅', {
      fontSize: '11px', color: '#6a4a7a', fontFamily: 'serif', letterSpacing: 4 }).setOrigin(0.5);

    const startTxt = this.add.text(W/2, 430, '▶  タ ッ プ し て 始 め る  ◀', {
      fontSize: '12px', color: '#9060b0', fontFamily: 'serif', letterSpacing: 4 }).setOrigin(0.5);
    this.tweens.add({ targets: startTxt, alpha: 0.2, duration: 900, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 });

    this.add.text(W-12, H-12, 'v0.2.0', { fontSize: '10px', color: '#3a2a5a', fontFamily: 'serif' }).setOrigin(1,1);

    this.input.once('pointerdown', () => {
      this.cameras.main.fadeOut(600, 3, 3, 8);
      this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('VN'));
    });
    this.cameras.main.fadeIn(800, 3, 3, 8);
  }
}

// ─────────────────────────────────────────
//  SCENE: Visual Novel
// ─────────────────────────────────────────
const VN_SCRIPT = [
  { speaker: null,   portrait: null,   bg: 'dark', text: '――かつて、この世界に\n偉大な魔法使いがいた。\nその名を、シオン。' },
  { speaker: null,   portrait: null,   bg: 'dark', text: '彼女は数百年を生き、\n無数の悪を討ち滅ぼした。\nそして、ルナの師であり\n――唯一の家族だった。' },
  { speaker: null,   portrait: null,   bg: 'red',  text: '……三ヶ月前。\nシオンは死んだ。\n魔王「ヴェイン」の手によって。' },
  { speaker: 'ルナ', portrait: 'luna', bg: 'ruin', text: '「絶対に、仇を討つ。」\n\n廃墟の前に立つルナの目は、\n炎のように赤く燃えていた。' },
  { speaker: 'カイ',  portrait: 'kai',  bg: 'ruin', text: '「ルナ、待てよ。\n一人で突っ込む気か？」' },
  { speaker: 'ルナ', portrait: 'luna', bg: 'ruin', text: '「……ついてきたの。\n余計なお世話よ。」' },
  { speaker: 'カイ',  portrait: 'kai',  bg: 'ruin', text: '「幼馴染が死にに行くのを、\n黙って見てられるか。\n――行くぞ、ルナ。」', battle: true },
];

class VNScene extends Phaser.Scene {
  constructor() { super('VN'); }

  create() {
    this._idx = 0; this._typing = false; this._tyTimer = null;

    this._bgRect = this.add.rectangle(W/2, H/2, W, H, 0x030308);
    this._bgImg  = this.add.image(W/2, (H-210)/2, 'bg_ruin').setAlpha(0).setVisible(false);
    this._bgImg.setScale(Math.max(W/this._bgImg.width, (H-210)/this._bgImg.height));

    this._portrait = null;

    const BOX_Y = H - 210;
    this.add.rectangle(W/2, H - 105, W, 210, 0x06030e, 0.92);
    this.add.rectangle(W/2, BOX_Y, W, 1, 0x3d2d6c);

    this._speakerTxt = this.add.text(28, BOX_Y + 14, '', {
      fontSize: '13px', color: '#c0a000', fontFamily: 'serif', fontStyle: 'bold', letterSpacing: 3 });
    this._mainTxt = this.add.text(28, BOX_Y + 38, '', {
      fontSize: '15px', color: '#e8e0f0', fontFamily: 'serif', lineSpacing: 10, wordWrap: { width: W-56 } });
    this._nextArrow = this.add.text(W-24, H-18, '▼', {
      fontSize: '16px', color: '#7050a0', fontFamily: 'serif' }).setOrigin(1,1).setAlpha(0);
    this.tweens.add({ targets: this._nextArrow, alpha: 0.25, duration: 700, ease: 'Sine.easeInOut', yoyo: true, repeat: -1 });
    this._progressTxt = this.add.text(28, BOX_Y - 16, '', { fontSize: '10px', color: '#4a3a6a', fontFamily: 'serif' });

    const skipBtn = this.add.text(W-16, BOX_Y - 16, 'SKIP ▶▶', {
      fontSize: '10px', color: '#5a4a7a', fontFamily: 'serif', letterSpacing: 2
    }).setOrigin(1,0).setInteractive({ useHandCursor: true });
    skipBtn.on('pointerover', () => skipBtn.setColor('#9070c0'));
    skipBtn.on('pointerout',  () => skipBtn.setColor('#5a4a7a'));
    skipBtn.on('pointerdown', () => this._skipToLast());

    this.input.on('pointerdown', (ptr) => { if (ptr.y >= H - 210) this._handleClick(); });
    this.cameras.main.fadeIn(600, 3, 3, 8);
    this._loadScene(0);
  }

  _loadScene(i) {
    const sc = VN_SCRIPT[i];
    if (sc.bg === 'ruin') {
      this._bgRect.setFillStyle(0x030308);
      this._bgImg.setVisible(true);
      this.tweens.add({ targets: this._bgImg, alpha: 0.7, duration: 600, ease: 'Power2' });
    } else if (sc.bg === 'red') {
      this._bgImg.setVisible(false).setAlpha(0);
      this._bgRect.setFillStyle(0x0e0005);
    } else {
      this._bgImg.setVisible(false).setAlpha(0);
      this._bgRect.setFillStyle(0x030308);
    }

    if (this._portrait) { this._portrait.destroy(); this._portrait = null; }
    if (sc.portrait) {
      const img = this.add.image(0, 0, sc.portrait);
      const scale = Math.min((H-230)/img.height, (W*0.55)/img.width);
      img.setScale(scale);
      const px = sc.portrait === 'luna' ? W * 0.68 : W * 0.32;
      img.setPosition(px, (H-210) - img.displayHeight/2 + 10).setAlpha(0);
      this._portrait = img;
      this.tweens.add({ targets: img, alpha: 1, duration: 400, ease: 'Power2' });
    }

    this._speakerTxt.setText(sc.speaker || '');
    this._speakerTxt.setColor(sc.speaker === 'カイ' ? '#6090d0' : '#c0a000');
    this._mainTxt.setText('');
    this._nextArrow.setAlpha(0);
    this._progressTxt.setText(`${i+1} / ${VN_SCRIPT.length}`);

    this._typing = true;
    let idx = 0;
    const full = sc.text;
    if (this._tyTimer) this._tyTimer.remove();
    this._tyTimer = this.time.addEvent({
      delay: 38, repeat: full.length - 1,
      callback: () => {
        idx++;
        this._mainTxt.setText(full.slice(0, idx));
        if (idx >= full.length) { this._typing = false; this._nextArrow.setAlpha(1); }
      }
    });
  }

  _handleClick() {
    if (this._typing) {
      if (this._tyTimer) this._tyTimer.remove();
      this._typing = false;
      this._mainTxt.setText(VN_SCRIPT[this._idx].text);
      this._nextArrow.setAlpha(1);
      return;
    }
    const sc = VN_SCRIPT[this._idx];
    if (sc.battle) { this._goToBattle(); return; }
    if (this._idx < VN_SCRIPT.length - 1) { this._idx++; this._loadScene(this._idx); }
  }

  _skipToLast() {
    if (this._tyTimer) this._tyTimer.remove();
    this._typing = false;
    this._idx = VN_SCRIPT.length - 2;
    this._loadScene(this._idx);
  }

  _goToBattle() {
    this.cameras.main.fadeOut(600, 3, 3, 8);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('Battle'));
  }
}

// ─────────────────────────────────────────
//  SCENE: Battle
// ─────────────────────────────────────────
const SKILLS_DATA = [
  { name: '通常攻撃', type: 'atk',  cost: 0,  power: 1.0, desc: '剣で斬りかかる' },
  { name: '黒　焔',   type: 'mag',  cost: 10, power: 1.5, desc: '黒炎を放つ  MP10' },
  { name: '月の刃',   type: 'mag',  cost: 20, power: 2.5, desc: '月光の刃  MP20' },
  { name: '回　復',   type: 'heal', cost: 15, heal: 30,   desc: 'HPを30回復  MP15' },
];

class BattleScene extends Phaser.Scene {
  constructor() { super('Battle'); }

  create() {
    this._luna  = { hp: 80, maxHp: 80, mp: 60, maxMp: 60, atk: 18, mag: 28 };
    this._enemy = { hp: 65, maxHp: 65, atk: 14 };
    this._acting = false;

    const bg = this.add.image(W/2, H/2, 'bg_ruin');
    bg.setScale(Math.max(W/bg.width, H/bg.height)).setAlpha(0.25);
    this.add.rectangle(W/2, H/2, W, H, 0x000000, 0.6);

    for (let i = 0; i < 25; i++) {
      const s = this.add.circle(
        Phaser.Math.Between(0,W), Phaser.Math.Between(0, H*0.4),
        Phaser.Math.FloatBetween(0.3,1.2), 0xffffff
      ).setAlpha(0.2);
      this.tweens.add({ targets: s, alpha: { from: 0.05, to: 0.4 },
        duration: Phaser.Math.Between(1500,3500), ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
        delay: Phaser.Math.Between(0,2000) });
    }

    // 敵画像
    this._enemyImg = this.add.image(W/2, 295, 'enemy');
    this._enemyImg.setScale(Math.min(200/this._enemyImg.height, 170/this._enemyImg.width));

    const eBarY = this._enemyImg.y + this._enemyImg.displayHeight/2 + 12;
    this.add.rectangle(W/2, eBarY, 160, 8, 0x0a0818).setStrokeStyle(0.5, 0x3a1010);
    this._enemyHpBarFill = this.add.rectangle(W/2-80, eBarY, 160, 8, 0xc0392b).setOrigin(0, 0.5);

    const eTagY = this._enemyImg.y - this._enemyImg.displayHeight/2 - 14;
    this.add.rectangle(W/2, eTagY, 120, 22, 0x100000, 0.85).setStrokeStyle(0.5, 0x4a1010);
    this.add.text(W/2, eTagY, '影 の 番 人', {
      fontSize: '11px', color: '#c03030', fontFamily: 'serif', letterSpacing: 4 }).setOrigin(0.5);

    this._buildStatUI();
    this._buildLog();
    this._buildSkillButtons();
    this._addLog('影の番人が現れた！');
    this._updateBars();
    this.cameras.main.fadeIn(600, 2, 2, 12);
  }

  _buildStatUI() {
    const Y = 8;
    this.add.rectangle(112, Y+44, 216, 78, 0x10062a, 0.92).setStrokeStyle(0.5, 0x3d2d5c);
    this.add.text(14, Y+10, '✦ LUNA', { fontSize: '11px', color: '#8060a0', fontFamily: 'serif', letterSpacing: 3 });
    this._lunaHpTxt = this.add.text(218, Y+10, '80 / 80', { fontSize: '12px', color: '#e8e0f0', fontFamily: 'serif' }).setOrigin(1,0);
    this.add.text(14, Y+30, 'HP', { fontSize: '10px', color: '#9060b0', fontFamily: 'serif' });
    this.add.rectangle(112, Y+42, 196, 7, 0x0a0818).setStrokeStyle(0.5, 0x2d1d4c);
    this._lunaHpBar = this.add.rectangle(16, Y+42, 196, 7, 0x9030a0).setOrigin(0, 0.5);
    this.add.text(14, Y+56, 'MP', { fontSize: '10px', color: '#406090', fontFamily: 'serif' });
    this._lunaMpTxt = this.add.text(218, Y+56, '60 / 60', { fontSize: '10px', color: '#4080c0', fontFamily: 'serif' }).setOrigin(1,0);
    this.add.rectangle(112, Y+68, 196, 5, 0x0a0818).setStrokeStyle(0.5, 0x1d1040);
    this._lunaMpBar = this.add.rectangle(16, Y+68, 196, 5, 0x2060c0).setOrigin(0, 0.5);

    this.add.rectangle(366, Y+44, 216, 78, 0x10062a, 0.92).setStrokeStyle(0.5, 0x3d1c1c);
    this.add.text(258, Y+10, '影の番人', { fontSize: '11px', color: '#8a2020', fontFamily: 'serif', letterSpacing: 3 });
    this._enemyHpTxt = this.add.text(470, Y+10, '65 / 65', { fontSize: '12px', color: '#e8e0f0', fontFamily: 'serif' }).setOrigin(1,0);
    this.add.text(258, Y+30, 'HP', { fontSize: '10px', color: '#902020', fontFamily: 'serif' });
    this.add.rectangle(366, Y+42, 196, 7, 0x0a0818).setStrokeStyle(0.5, 0x3a1010);
    this._enemyHpBar = this.add.rectangle(268, Y+42, 196, 7, 0xc0392b).setOrigin(0, 0.5);
  }

  _buildLog() {
    const LOG_Y = H - 248;
    this.add.rectangle(W/2, LOG_Y+38, W-28, 78, 0x000000, 0.65).setStrokeStyle(0.5, 0x2d1d4c);
    this._logTexts = [];
    for (let i = 0; i < 3; i++) {
      this._logTexts.push(this.add.text(20, LOG_Y+8+i*22, '', { fontSize: '12px', color: '#a090b8', fontFamily: 'serif' }));
    }
    this._logLines = [];
  }

  _buildSkillButtons() {
    const BTN_Y = H - 158;
    const positions = [
      { x: 6,       y: BTN_Y },
      { x: W/2+4,   y: BTN_Y },
      { x: 6,       y: BTN_Y+70 },
      { x: W/2+4,   y: BTN_Y+70 },
    ];
    this._skillBtns = [];
    positions.forEach((pos, i) => {
      const bw = W/2-10, bh = 62;
      const bg = this.add.rectangle(pos.x+bw/2, pos.y+bh/2, bw, bh, 0x10062a)
        .setStrokeStyle(0.5, 0x3d2d5c).setInteractive({ useHandCursor: true });
      const sk = SKILLS_DATA[i];
      const nameT = this.add.text(pos.x+12, pos.y+10, sk.name, { fontSize: '14px', color: '#d8c0f8', fontFamily: 'serif', fontStyle: 'bold', letterSpacing: 2 });
      const descT = this.add.text(pos.x+12, pos.y+38, sk.desc, { fontSize: '10px', color: '#7060a0', fontFamily: 'serif' });
      bg.on('pointerover', () => { if (!this._acting) bg.setFillStyle(0x3c1e5a); });
      bg.on('pointerout',  () => bg.setFillStyle(0x10062a));
      bg.on('pointerdown', () => this._useSkill(i));
      this._skillBtns.push({ bg, nameT, descT });
    });
  }

  _addLog(msg) {
    this._logLines.push(msg);
    if (this._logLines.length > 3) this._logLines.shift();
    this._logTexts.forEach((t, i) => {
      const line = this._logLines[i] || '';
      t.setText(line ? '▸ '+line : '');
      t.setColor(i === this._logLines.length-1 ? '#e8e0f0' : '#8070a0');
    });
  }

  _updateBars() {
    const lhpR = this._luna.hp/this._luna.maxHp;
    const lmpR = this._luna.mp/this._luna.maxMp;
    const ehpR = this._enemy.hp/this._enemy.maxHp;
    this._lunaHpBar.width = 196*lhpR;
    this._lunaHpBar.setFillStyle(lhpR>0.5?0x9030a0:lhpR>0.25?0xc07000:0xc03000);
    this._lunaMpBar.width = 196*lmpR;
    this._enemyHpBar.width = 196*ehpR;
    this._enemyHpBarFill.width = 160*ehpR;
    this._lunaHpTxt.setText(`${this._luna.hp} / ${this._luna.maxHp}`);
    this._lunaMpTxt.setText(`${this._luna.mp} / ${this._luna.maxMp}`);
    this._enemyHpTxt.setText(`${this._enemy.hp} / ${this._enemy.maxHp}`);
  }

  _setButtonsEnabled(on) {
    this._skillBtns.forEach((btn, i) => {
      const sk = SKILLS_DATA[i];
      const ok = on && (sk.type==='atk' || sk.cost<=this._luna.mp);
      btn.bg.setAlpha(ok?1:0.4).disableInteractive();
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
      this._luna.hp = Math.min(this._luna.maxHp, this._luna.hp+sk.heal);
      this._addLog(`${sk.name}！ HPが${sk.heal}回復した！`);
      this._updateBars();
      this.cameras.main.flash(300, 0, 180, 60);
    } else {
      const base = sk.type==='mag' ? this._luna.mag : this._luna.atk;
      const dmg = Math.floor(base*sk.power*(0.85+Math.random()*0.3));
      this._enemy.hp = Math.max(0, this._enemy.hp-dmg);
      this._addLog(`${sk.name}！ ${dmg} ダメージ！`);
      this.tweens.add({ targets: this._enemyImg, alpha: {from:1,to:0.1}, duration:100, yoyo:true, repeat:2 });
      this.cameras.main.shake(180, 0.005);
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
      this.time.delayedCall(400, () => {
        const edm = Math.floor(this._enemy.atk*(0.8+Math.random()*0.4));
        this._luna.hp = Math.max(0, this._luna.hp-edm);
        this._addLog(`影の番人の攻撃！ ${edm} ダメージ！`);
        this.cameras.main.shake(240, 0.008);
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
    const bg = this.add.image(W/2, H/2, 'bg_ruin');
    bg.setScale(Math.max(W/bg.width, H/bg.height)).setAlpha(0.2);
    this.add.rectangle(W/2, H/2, W, H, 0x080400, 0.75);
    _makeStars(this, 80);
    const luna = this.add.image(W*0.72, H*0.55, 'luna').setAlpha(0.7);
    luna.setScale(Math.min((H*0.65)/luna.height, (W*0.5)/luna.width));
    this.add.text(W/2, 110, '✦  V I C T O R Y  ✦', { fontSize:'11px',color:'#8a6a10',fontFamily:'serif',letterSpacing:6 }).setOrigin(0.5);
    this.add.text(W/2, 175, '勝　利', { fontSize:'48px',color:'#ffe080',fontFamily:'serif',fontStyle:'bold',letterSpacing:10,
      shadow:{color:'#c0a000',blur:20,fill:true} }).setOrigin(0.5);
    this.add.rectangle(W/2, 256, 230, 36, 0x1a1000, 0.88).setStrokeStyle(0.5, 0x5a4010);
    this.add.text(W/2, 256, '🔮 闇の結晶 を手に入れた', { fontSize:'13px',color:'#c0a870',fontFamily:'serif',letterSpacing:2 }).setOrigin(0.5);
    this.add.text(W/2-40, 330, '「……まだ、始まりに過ぎない。\nヴェイン、待ってなさい。」',
      { fontSize:'13px',color:'#c0b070',fontFamily:'serif',lineSpacing:8,align:'center' }).setOrigin(0.5);
    const tap = this.add.text(W/2, 440, '▶　タ ッ プ で タ イ ト ル へ',
      { fontSize:'11px',color:'#7a6030',fontFamily:'serif',letterSpacing:4 }).setOrigin(0.5);
    this.tweens.add({ targets:tap, alpha:0.2, duration:1000, yoyo:true, repeat:-1, ease:'Sine' });
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
    _makeStars(this, 30);
    this.add.text(W/2, 160, '― GAME OVER ―', { fontSize:'11px',color:'#8a2020',fontFamily:'serif',letterSpacing:6 }).setOrigin(0.5);
    this.add.text(W/2, 230, '敗　北', { fontSize:'48px',color:'#ff6060',fontFamily:'serif',fontStyle:'bold',letterSpacing:10,
      shadow:{color:'#800000',blur:20,fill:true} }).setOrigin(0.5);
    this.add.text(W/2, 310, 'ルナは倒れた……', { fontSize:'14px',color:'#a07070',fontFamily:'serif',letterSpacing:3 }).setOrigin(0.5);
    this.add.text(W/2, 352, '「シオン……ごめんなさい」', { fontSize:'13px',color:'#806060',fontFamily:'serif' }).setOrigin(0.5);
    const tap = this.add.text(W/2, 450, '▶　タ ッ プ で タ イ ト ル へ',
      { fontSize:'11px',color:'#6a3030',fontFamily:'serif',letterSpacing:4 }).setOrigin(0.5);
    this.tweens.add({ targets:tap, alpha:0.2, duration:1000, yoyo:true, repeat:-1, ease:'Sine' });
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
      Phaser.Math.Between(0,W), Phaser.Math.Between(0,H),
      Phaser.Math.FloatBetween(0.3,1.5), 0xffffff
    ).setAlpha(0.3);
    scene.tweens.add({ targets:s, alpha:{from:0.05,to:0.5},
      duration:Phaser.Math.Between(1500,4000), ease:'Sine.easeInOut', yoyo:true, repeat:-1,
      delay:Phaser.Math.Between(0,3000) });
  }
}

// ─────────────────────────────────────────
//  Launch
// ─────────────────────────────────────────
new Phaser.Game({
  type: Phaser.AUTO,
  width: W, height: H,
  backgroundColor: '#030308',
  parent: 'game-container',
  scene: [BootScene, TitleScene, VNScene, BattleScene, VictoryScene, GameOverScene],
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
});
