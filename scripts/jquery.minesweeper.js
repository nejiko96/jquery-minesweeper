/**
 * jQuery minesweeper plugin
 * Version: 1.4.6
 * Date: 2015/05/23
 * @requires jQuery v1.4.4 or later
 * @requires jQuery.timers (optional)
 *
 * Copyright (c) 2010 H.Nakatani
 * licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 */

(function($) {

  /**
   * リスナクラス－盤面のマウスイベントをクリックイベントに変換する
   * @constructor
   */
  var Listener = function(settings) {
    this._init(settings);
  };

  // リスナクラス－定数
  $.extend(
    Listener,
    {
      // 左ボタン
      _EVENT_BUTTON_LEFT: 1,
      // 右ボタン
      _EVENT_BUTTON_RIGHT: 2,
      // 左右ボタン
      _EVENT_BUTTON_BOTH: 3,
      //左ボタン
      _EVENT_WHICH_LEFT: 1,
      //右ボタン
      _EVENT_WHICH_RIGHT: 3,
      // 初期設定
      _DEFAULT_SETTINGS: {
        // 左マウスダウン時処理
        onCellLeftMouseDown: $.noop,
        // 右マウスダウン時処理
        onCellRightMouseDown: $.noop,
        // 左右マウスダウン時処理
        onCellBothMouseDown: $.noop,
        // 左マウスオーバー時処理
        onCellLeftMouseOver: $.noop,
        // 右マウスオーバー時処理
        onCellRightMouseOver: $.noop,
        // 左右マウスオーバー時処理
        onCellBothMouseOver: $.noop,
        // 左マウスアウト時処理
        onCellLeftMouseOut: $.noop,
        // 右マウスアウト時処理
        onCellRightMouseOut: $.noop,
        // 左右マウスアウト時処理
        onCellBothMouseOut: $.noop,
        // 左マウスアップ時処理
        onCellLeftMouseUp: $.noop,
        // 右マウスアップ時処理
        onCellRightMouseUp: $.noop,
        // 左右マウスアップ時処理
        onCellBothMouseUp: $.noop
      }
    }
  );

  // リスナクラス－メソッド
  $.extend(
    Listener.prototype,
    {
      // 初期化処理
      _init: function(settings) {
        // 初期設定を引数の設定値で拡張する
        this._settings = $.extend({}, Listener._DEFAULT_SETTINGS, settings || {});
        // ダウンボタンキー
        this._buttonKey = 0;
        var listener = this;
        // マウスアップでクリアされるようにする
        $(document).mouseup(function() {
          listener._buttonKey = 0;
        });
      },
      // リセット処理
      _reset: function() {
        this._triggers = this._settings;
      },
      // 停止処理
      _stop: function() {
        this._triggers = Listener._DEFAULT_SETTINGS;
      },
      // マスのマウスダウン時処理
      _onCellMouseDown: function(ev, idx) {

        var buttonKey = 0;

        // IEもFirefoxもbuttonプロパティで判定したほうがよいが、
        // 設定値に違いがあるので注意
        if (ev.button !== undefined) {
          if (ev.button === 0) {
            // Firefoxは左クリックが０になっている
            buttonKey = Listener._EVENT_BUTTON_LEFT;
          } else {
            // IEは複数ボタンが押された場合、論理和になっている
            buttonKey = ev.button & Listener._EVENT_BUTTON_BOTH;
          }
        } else if (ev.which !== undefined) {
          // whichプロパティはIEで左右クリックが検出できない
          if (ev.which === Listener._EVENT_WHICH_LEFT) {
            buttonKey = Listener._EVENT_BUTTON_LEFT;
          } else if (ev.which === Listener._EVENT_WHICH_RIGHT) {
            buttonKey = Listener._EVENT_BUTTON_RIGHT;
          } else {
            buttonKey = 0;
          }
        }

        // 押下中のボタンを記憶
        this._buttonKey |= buttonKey;

        // マウスダウンイベントをトリガーする
        if (this._buttonKey === Listener._EVENT_BUTTON_LEFT) {
          this._triggers.onCellLeftMouseDown(idx);
        } else if (this._buttonKey === Listener._EVENT_BUTTON_RIGHT) {
          this._triggers.onCellRightMouseDown(idx);
        } else if (this._buttonKey === Listener._EVENT_BUTTON_BOTH) {
          this._triggers.onCellBothMouseDown(idx);
        }
      },
      // マスのマウスオーバー時処理
      _onCellMouseOver: function(ev, idx) {

        // ボタンを押していない場合は処理なし
        if (this._buttonKey === 0) {
          return;
        }

        // 押下中のボタンに応じた処理を呼出す
        if (this._buttonKey === Listener._EVENT_BUTTON_LEFT) {
          this._triggers.onCellLeftMouseOver(idx);
        } else if (this._buttonKey === Listener._EVENT_BUTTON_RIGHT) {
          this._triggers.onCellRightMouseOver(idx);
        } else if (this._buttonKey === Listener._EVENT_BUTTON_BOTH) {
          this._triggers.onCellBothMouseOver(idx);
        }
      },
      // マスのマウスアウト時処理
      _onCellMouseOut: function(ev, idx) {

        // ボタンを押していない場合は処理なし
        if (this._buttonKey === 0) {
          return;
        }

        // 押下中のボタンに応じた処理を呼出す
        if (this._buttonKey === Listener._EVENT_BUTTON_LEFT) {
          this._triggers.onCellLeftMouseOut(idx);
        } else if (this._buttonKey === Listener._EVENT_BUTTON_RIGHT) {
          this._triggers.onCellRightMouseOut(idx);
        } else if (this._buttonKey === Listener._EVENT_BUTTON_BOTH) {
          this._triggers.onCellBothMouseOut(idx);
        }
      },
      // マスのマウスアップ時処理
      _onCellMouseUp: function(ev, idx) {

        // ボタンを押していない場合は処理なし
        if (this._buttonKey === 0) {
          return;
        }

        // 押下中のボタンを取得
        var buttonKey = this._buttonKey;

        // 押下中のボタンをリセット
        this._buttonKey = 0;

        // 押下中のボタンに応じた処理を呼出す
        if (buttonKey === Listener._EVENT_BUTTON_LEFT) {
          this._triggers.onCellLeftMouseUp(idx);
        } else if (buttonKey === Listener._EVENT_BUTTON_RIGHT) {
          this._triggers.onCellRightMouseUp(idx);
        } else if (buttonKey === Listener._EVENT_BUTTON_BOTH) {
          this._triggers.onCellBothMouseUp(idx);
        }
      }
    }
  );

  /**
   * 地雷生成クラス
   * @constructor
   */
  var MineGenerator = function(cells, setMine) {
    this._init(cells, setMine);
  };


  // 地雷生成クラス－メソッド
  $.extend(
    MineGenerator.prototype,
    {
      // 初期化処理
      _init: function(cells, setMine) {
        this._cells = cells;
        this._setMine = setMine;
      },
      // 地雷生成処理
      _generate: function(mines, excludes) {

        // 自分自身を待避
        var generator = this;

        // 予約済の位置の配列をで初期化
        this._reserved = $.extend([], excludes);
        // 末尾に"."を追加
        this._reserved.push(".");
        // 空きマス数を初期化
        this._emptyCells = this._cells - excludes.length;

        // 指定された数の地雷を配置する
        for (; mines > 0; --mines) {
          generator._insert();
        }

      },
      // 地雷追加処理
      _insert: function() {

        // 自分自身をローカル変数に退避
        var generator = this;

        // 空いているマスの中からランダム選ぶ
        var idx = Math.floor(Math.random() * this._emptyCells);

        // 地雷がインデックスの昇順に並ぶよう、配列に挿入する。
        $.each(this._reserved, function(i, val) {
          if (val === "." || val > idx) {
            // 終端に達するか、より後方の地雷が出現したら、配列に挿入
            generator._reserved.splice(i, 0, idx);
            generator._emptyCells--;
            // 盤面に地雷をセット
            generator._setMine(idx);
            return false;
          } else {
            // マスのインデックスをずらす
            //（前方の地雷の分だけ番号がずれる）
            ++idx;
          }
        });
      }
    }
  );

  /**
   * マインスイーパ盤面クラス
   * @constructor
   */
  var Board = function(target,settings) {
    this._init(target, settings);
  };

  // マインスイーパ盤面クラス－定数
  $.extend(
    Board,
    {
      // マスの状態のCSSクラス名
      _STATE_CLASS: 'minesweeper-state',
      // マスの状態－隠
      _STATE_HIDDEN: '0',
      // マスの状態－隠（無印）
      _STATE_NOT_MARKED: '01',
      // マスの状態－隠（旗）
      _STATE_FLAGGED: '0f',
      // マスの状態－隠（？）
      _STATE_UNCERTAIN: '0h',

      // マスの状態－開
      _STATE_OPENED: '1',
      // マスの状態－開（空）
      _STATE_VACANT: '10',
      // マスの状態－開（地雷）
      _STATE_MINE: '19',
      // マスの状態－開（爆発）
      _STATE_EXPLOSION: '1a',
      // マスの状態－開（ミス）
      _STATE_MISTAKE: '1b',

      // 地雷あり
      _HAS_MINE: 1,
      // 旗あり
      _HAS_FLAG: 2
    }
  );

  // マインスイーパ盤面クラス－メソッド
  $.extend(
    Board.prototype,
    {
      // 初期化処理
      _init: function(target, settings) {

        // マスのDOMオブジェクトを初期化
        this._$cells = target;

        // マスの状態の初期化文字列を生成
        var str = new Array(this._$cells.length + 1).join('"' + Board._STATE_NOT_MARKED + '",');
        this._initStates = "[" + str.slice(0, -1) + "]";

        // リスナを初期化
        var listener = new Listener(settings);
        // イベントを登録する
        this._$cells.each(function(idx) {
          $(this)
          .mousedown(function(ev) {
            listener._onCellMouseDown(ev, idx);
          })
          .mouseover(function(ev) {
            listener._onCellMouseOver(ev, idx);
          })
          .mouseout(function(ev) {
            listener._onCellMouseOut(ev, idx);
          })
          .mouseup(function(ev) {
            listener._onCellMouseUp(ev, idx);
          });
        });
        this._listener = listener;
      },
      // リセット処理
      _reset: function() {
        // 全てのマスを隠（無印）状態に戻す
        this._states = $.parseJSON(this._initStates);
        this._$cells
          .removeClass()
          .addClass(Board._STATE_CLASS + Board._STATE_NOT_MARKED);
        // 地雷と旗のマップを初期化
        this._mineFlags = {};
        // イベントを活性化する
        this._listener._reset();
        // 開始フラグオフ
        this._started = false;
      },
      // 開始処理
      _start: function(mines, excludes) {
        var board = this;
        // 地雷を生成する
        new MineGenerator(this._$cells.length, function(idx) {
          board._setMineFlag(idx, Board._HAS_MINE);
        })
        ._generate(mines, excludes);
        // 開始フラグオン
        this._started = true;
      },
      // 停止処理
      _stop: function() {
        // イベントを非活性化する
        this._listener._stop();
      },
      // 状態取得処理
      _getState: function(idx) {
        return this._states[idx];
      },
      // 状態設定処理
      _setState: function(idx, state) {
        this._states[idx] = state;
        this._$cells
          .eq(idx)
          .removeClass()
          .addClass(Board._STATE_CLASS + state);
      },
      // マスが隠れているかどうか判定する
      _isHidden: function(idx) {
        return this._getState(idx).charAt(0) === Board._STATE_HIDDEN;
      },
      // マスに印がついていないどうか判定する
      _isNotMarked: function(idx) {
        return this._getState(idx) === Board._STATE_NOT_MARKED;
      },
      // 旗が立っているかどうか判定する
      _isFlagged: function(idx) {
        return this._getState(idx) === Board._STATE_FLAGGED;
      },
      // 不明状態どうか判定する
      _isUncertain: function(idx) {
        return this._getState(idx) === Board._STATE_UNCERTAIN;
      },
      // マスが開いているかどうか判定する
      _isOpened: function(idx) {
        return this._getState(idx).charAt(0) === Board._STATE_OPENED;
      },
      // 周囲の地雷数を取得する
      _getMineCount: function(idx) {
        return parseInt(this._getState(idx), 10) - 10;
      },
      // マスを無印に設定する
      _setNotMarked: function(idx) {
        this._setState(idx, Board._STATE_NOT_MARKED);
      },
      // マスを旗印に設定する
      _setFlagged: function(idx) {
        this._setState(idx, Board._STATE_FLAGGED);
        this._setMineFlag(idx, Board._HAS_FLAG);
      },
      // マスを？印に設定する
      _setUncertain: function(idx) {
        this._setState(idx, Board._STATE_UNCERTAIN);
        this._unsetMineFlag(idx, Board._HAS_FLAG);
      },
      // 周囲の地雷数を設定する
      _setMineCount: function(idx, count) {
        this._setState(idx, Board._STATE_OPENED + count);
      },
      // 地雷あり状態に設定する
      _setMine: function(idx) {
        this._setState(idx, Board._STATE_MINE);
      },
      // 地雷爆発状態に設定する
      _setExplosion: function(idx) {
        this._setState(idx, Board._STATE_EXPLOSION);
      },
      // 地雷選択間違い状態に設定する
      _setMistake: function(idx) {
        this._setState(idx, Board._STATE_MISTAKE);
      },
      // マスがロックされているかどうか判定する
      _isFixed: function(idx) {
        var state = this._getState(idx);
        if (state === Board._STATE_NOT_MARKED) {
          return false;
        }
        if (state === Board._STATE_UNCERTAIN) {
          return false;
        }
        return true;
      },
      // マスでボタンを押下した状態にする
      _press: function(idx) {
        if (this._isFixed(idx)) {
          return;
        }
        this._$cells
          .eq(idx)
          .removeClass()
          .addClass(Board._STATE_CLASS + Board._STATE_VACANT);
      },
      // マスでボタンを離した状態にする
      _release: function(idx) {
        if (this._isFixed(idx)) {
          return;
        }
        var state = this._getState(idx);
        this._$cells
          .eq(idx)
          .removeClass()
          .addClass(Board._STATE_CLASS + state);
      },
      // 地雷と旗の状態を取得する
      _getMineFlag: function(idx) {
        var mineFlag = this._mineFlags[idx];
        return mineFlag === undefined ? 0 : mineFlag;
      },
      // 地雷の有無を返却する
      _hasMine: function(idx) {
        return this._getMineFlag(idx) & Board._HAS_MINE;
      },
      // 地雷と旗の状態を設定する
      _setMineFlag: function(idx, val) {
        if (this._mineFlags[idx] === undefined) {
          this._mineFlags[idx] = val;
        } else {
          this._mineFlags[idx] |= val;
        }
      },
      // 地雷と旗の状態を解除する
      _unsetMineFlag: function(idx, val) {
        if (this._mineFlags[idx] !== undefined) {
          this._mineFlags[idx] &= ~val;
          if (!this._mineFlags[idx]) {
            delete this._mineFlags[idx];
          }
        }
      },
      // 全ての地雷／旗に対してコールバック処理を呼出す
      _eachMineFlag: function(callback) {
        $.each(this._mineFlags, callback);
      }
    }
  );


  /**
   * マインスイーパクラス
   * @constructor
   */
  var MineSweeper = function(target, settings) {
    this._init(target, settings);
  };

  // マインスイーパクラス－定数
  $.extend(
    MineSweeper,
    {
      // レベル毎の設定
      _DEFAULT_LEVELS: {
        // 初級の設定
        easy: {
          width:   9,
          height:  9,
          mines:  10
        },
        // 中級の設定
        medium: {
          width:  16,
          height: 16,
          mines:  40
        },
        // 上級の設定
        hard: {
          width:  30,
          height: 16,
          mines:  99
        },
        // カスタム設定
        custom: {
          //幅、高さ、地雷数を直接指定する
        }
      },
      // 幅の下限
      _WIDTH_MIN: 9,
      // 高さの下限
      _HEIGHT_MIN: 9,
      // 幅の上限
      _WIDTH_MAX: 30,
      // 高さの上限
      _HEIGHT_MAX: 24,
      // 地雷数の下限
      _MINES_MIN: 10,
      // タイマーの更新インターバル（1秒）
      _TIMER_UPDATE_INTERVAL: '1s',
      // タイマーの表示最大カウント
      _TIMER_MAX_COUNT: 999
    }
  );

  // マインスイーパクラス－メソッド
  $.extend(
    MineSweeper.prototype,
    {
      // 初期化処理
      _init: function(target, settings) {

        // 表示対象DOMエレメントの取得
        this._$target = $(target);
        // 設定の取得
        this._settings = settings;

        // 盤面サイズの初期化
        this._initSize();

      },
      // 盤面サイズ初期化処理
      _initSize: function() {

        // 設定をレベル毎の設定値で上書きする
        $.extend(this._settings, MineSweeper._DEFAULT_LEVELS[this._settings.level] || {});

        // 幅を初期化する
        this._width = parseInt(this._settings.width, 10);
        if (isFinite(this._width)) {
          if (this._width < MineSweeper._WIDTH_MIN) {
            this._width = MineSweeper._WIDTH_MIN;
          }
          if (this._width > MineSweeper._WIDTH_MAX) {
            this._width = MineSweeper._WIDTH_MAX;
          }
        } else {
          this._width = MineSweeper._WIDTH_MIN;
        }

        // 高さを初期化する
        this._height = parseInt(this._settings.height, 10);
        if (isFinite(this._height)) {
          if (this._height < MineSweeper._HEIGHT_MIN) {
            this._height = MineSweeper._HEIGHT_MIN;
          }
          if (this._height > MineSweeper._HEIGHT_MAX) {
            this._height = MineSweeper._HEIGHT_MAX;
          }
        } else {
          this._height = MineSweeper._HEIGHT_MIN;
        }

        // マス数を初期化する
        this._cells = this._width * this._height;

        // 地雷数を初期化する
        this._mines = parseInt(this._settings.mines, 10);
        if (isFinite(this._mines)) {
          if (this._mines < MineSweeper._MINES_MIN) {
            this._mines = MineSweeper._MINES_MIN;
          }
          // 最大地雷数を盤面のサイズから計算する
          // 従来は（幅－１）×（高さ－１）だったが、
          // Windows7は幅×高さ×0.94-8.45（小数点以下切捨て）
          // var maxMines = (this._width - 1) * (this._height -1);
          var maxMines = Math.floor(this._width * this._height * 0.94 - 8.45);
          if (this._mines > maxMines) {
            this._mines = maxMines;
          }
        } else {
          // 未設定の場合、盤面のサイズに応じて設定する
          var percent = 10 + Math.floor(this._cells / 45);
          this._mines = Math.round(this._cells * percent / 1000) * 10;
        }
      },
      // 盤面表示処理
      _show: function() {

        // 自分自身をローカル変数に退避
        var game = this;

        // 盤面を描画
        this._$target.html(this._generateHtml());

        // 盤面オブジェクトを作成し、イベントハンドラを登録
        this._board = new Board(
          this._$target.find(".minesweeper-cells > span"),
          {
            onCellLeftMouseDown: function(idx) {
              game._onCellLeftMouseDown(idx);
            },
            onCellLeftMouseOver: function(idx) {
              game._onCellLeftMouseOver(idx);
            },
            onCellLeftMouseOut: function(idx) {
              game._onCellLeftMouseOut(idx);
            },
            onCellLeftMouseUp: function(idx) {
              game._onCellLeftMouseUp(idx);
            },
            onCellRightMouseDown: function(idx) {
              game._onCellRightMouseDown(idx);
            },
            onCellBothMouseDown: function(idx) {
              game._onCellBothMouseDown(idx);
            },
            onCellBothMouseOver: function(idx) {
              game._onCellBothMouseOver(idx);
            },
            onCellBothMouseOut: function(idx) {
              game._onCellBothMouseOut(idx);
            },
            onCellBothMouseUp: function(idx) {
              game._onCellBothMouseUp(idx);
            }
          }
        );
        // 残り地雷数表示欄を取得
        this._$txtMines = this._$target.find(".minesweeper-mines");
        // タイマーオブジェクトを作成
        this._$txtTimer = this._$target.find(".minesweeper-timer");
        // 再開ボタンを取得
        this._$btnRestart = this._$target.find(".minesweeper-restart");

        // ロケール依存のテキストを設定
        this._$txtMines.before(this._settings.minesTextBefore);
        this._$txtMines.after(this._settings.minesTextAfter);
        this._$txtTimer.before(this._settings.timerTextBefore);
        this._$txtTimer.after(this._settings.timerTextAfter);
        this._$btnRestart.text(this._settings.restartText);

        // 各種リスナ登録
        // 再開ボタンのイベントに自身のメソッドを登録
        this._$btnRestart
          .click(function() {
            game._resetGame();
          });


        // ゲームの初期化
        this._resetGame();

      },
      // HTML生成処理
      _generateHtml: function() {

        var idx;
        var html = '';

        html += '<form>';
        html += '<nobr>';
        html += '<span class="minesweeper-mines" ></span>';
        html += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
        html += '<span class="minesweeper-timer" ></span>';
        html += '<div class="minesweeper-cells" >';
        for (idx = 0; idx < this._cells; idx++) {
          if (idx > 0 && idx % this._width === 0) {
            html += '<br />';
          }
          html += '<span></span>';
        }
        html += '</div>';
        html += '<button type="button" class="minesweeper-restart" ></button>';
        html += '</nobr>';
        html += '</form>';

        return html;
      },
      // マスの左マウスダウン時処理
      _onCellLeftMouseDown: function(idx) {
        // マスを押下
        this._board._press(idx);
      },
      // マスの左マウスオーバー時処理
      _onCellLeftMouseOver: function(idx) {
        // 移動先のマスを押下
        this._board._press(idx);
      },
      // マスの左マウスアウト時処理
      _onCellLeftMouseOut: function(idx) {
        // 移動元のマスを離す
        this._board._release(idx);
      },
      // マスの左マウスアップ時処理
      _onCellLeftMouseUp: function(idx) {

        // ゲームが始まっていない場合、開始する。
        if (!this._board._started) {
          this._startGame(idx);
        }

        // 開いてるか旗が立っていたら何もしない
        if (this._board._isFixed(idx)) {
          return;
        }

        // 地雷を選んだ場合
        if (this._board._hasMine(idx)) {
          //ゲームオーバー
          this._explosion.push(idx);
          this._gameOver();
          return;
        }

        // マスを開く
        this._openSafe(idx);
      },
      // マスの右マウスダウン時処理
      _onCellRightMouseDown: function(idx) {

        var mines;

        // すでに開いていたら何もしない
        if (this._board._isOpened(idx)) {
          return;
        }

        // 現在の状態に応じて状態遷移させる
        if (this._board._isNotMarked(idx)) {
          //無印→旗
          this._board._setFlagged(idx);
          mines = parseInt(this._$txtMines.text(), 10);
          this._$txtMines.text(mines - 1);
        } else if (this._board._isFlagged(idx)) {
          //旗→不明
          this._board._setUncertain(idx);
          mines = parseInt(this._$txtMines.text(), 10);
          this._$txtMines.text(mines + 1);
        } else if (this._board._isUncertain(idx)) {
          //不明→無印
          this._board._setNotMarked(idx);
        }
      },
      // マスの左右マウスダウン時処理
      _onCellBothMouseDown: function(idx) {

        // 自分自身をローカル変数に待避する
        var game = this;

        //隣接するマスを全て調べる
        $.each(this._neighbors(idx), function(i, neighbor) {
          // マスを押下
          game._board._press(neighbor);
        });
      },
      // マスの左右マウスムーブ時処理
      _onCellBothMouseOver: function(idx) {

        // 自分自身をローカル変数に待避する
        var game = this;

        // 自分自身を含めて隣接するマスを全て調べる
        $.each(this._neighbors(idx), function(i, neighbor) {
          // マスを押下
          game._board._press(neighbor);
        });
      },
      // マスの左右マウスアウト時処理
      _onCellBothMouseOut: function(idx) {

        // 自分自身をローカル変数に待避する
        var game = this;

        // 自分自身を含めて隣接するマスを全て調べる
        $.each(this._neighbors(idx), function(i, neighbor) {
          // マスを離す
          game._board._release(neighbor);
        });
      },
      // マスの左右マウスアップ時処理
      _onCellBothMouseUp: function(idx) {

        // 自分自身をローカル変数に待避する
        var game = this;

        // 自分自身を含めて隣接するマスを全て調べる
        $.each(this._neighbors(idx), function(i, neighbor) {
          // マスを離す
          game._board._release(neighbor);
        });

        // まだ開いていないマスだったら何もしない
        if (this._board._isHidden(idx)) {
          return;
        }

        // 周囲の地雷数を取得する
        var mineCount = this._board._getMineCount(idx);
        // 周囲の旗の数を初期化する
        var flagCount = 0;
        // 安全なマスのリストを初期化する
        var safe = [];
        // 爆発するマスのリストを初期化する
        var explosion = [];

        //隣接するマスを全て調べる
        $.each(this._surroundings(idx), function(i, neighbor) {

          // 開いているマスは対象外
          if (game._board._isOpened(neighbor)) {
            return;
          }

          // 地雷と旗の状態を取得する
          var mineFlag = game._board._getMineFlag(neighbor);

          // 旗が立っている場合
          if (mineFlag & Board._HAS_FLAG) {
            // 旗をカウントする
            flagCount++;
            return;
          }

          //地雷がある場合
          if (mineFlag & Board._HAS_MINE) {
            // 爆発マスのリストに加える
            explosion.push(neighbor);
            return;
          }

          //安全なマスのリストに加える
          safe.push(neighbor);
        });

        //隣接する地雷の数と旗の数が一致しなければ、何もしないで抜ける
        if (flagCount !== mineCount) {
          return;
        }

        // 安全なマスは開いておく
        $.each(safe, function(i, idx) {
          game._openSafe(idx);
        });

        // 地雷を選んでしまった場合
        if (explosion.length > 0) {
          //ゲームオーバー
          this._explosion = explosion;
          this._gameOver();
        }
      },
      // ゲームリセット処理
      _resetGame: function() {

        // タイマーをリセット
        if ($.timer) {
          this._$txtTimer.stopTime();
        }
        this._$txtTimer.text("0");

        // ゲーム状態をクリア
        this._unopened = this._cells - this._mines;
        this._explosion = [];

        // 盤面のリセット・イベント活性化
        this._board._reset();
        // 残り地雷数の初期表示
        this._$txtMines.text(this._mines);

      },
      // ゲーム開始処理
      _startGame: function(idx) {

        // 地雷位置を初期化
        this._board._start(this._mines, this._neighbors(idx));

        // タイマーを開始
        if ($.timer) {
          this._$txtTimer.text("1");
          this._$txtTimer.everyTime(
            MineSweeper._TIMER_UPDATE_INTERVAL,
            function() {
              $(this).text($(this).text() - 0 + 1);
            },
            MineSweeper._TIMER_MAX_COUNT - 1
          );
        }
      },
      // ゲーム停止処理
      _stopGame: function() {

        if ($.timer) {
          // タイマーを停止
          this._$txtTimer.stopTime();
        }

        // 盤面のイベント非活性化
        this._board._stop();
      },
      // ゲームクリア処理
      _gameClear: function() {

        var game = this;

        // ゲームを停止
        this._stopGame();

        // 地雷の位置に旗がない場合全て旗を立てる
        this._board._eachMineFlag(function(idx, mf) {
          if (mf === Board._HAS_MINE) {
            game._board._setFlagged(idx);
          }
        });

        // 残り地雷数の表示をリセット
        this._$txtMines.text("0");

        // メッセージ表示
        alert(this._settings.clearedText);

      },
      // ゲームオーバー処理
      _gameOver: function() {

        var game = this;

        // ゲームを停止
        this._stopGame();

        // 旗のない地雷の位置と旗を間違えて立てた箇所を表示
        this._board._eachMineFlag(function(idx, mf) {
          if (mf === Board._HAS_MINE) {
            game._board._setMine(idx);
          } else if (mf === Board._HAS_FLAG) {
            game._board._setMistake(idx);
          }
        });

        // 爆発位置を表示
        $.each(this._explosion, function(i, idx) {
          game._board._setExplosion(idx);
        });

      },
      // 安全なマスを開く
      _openSafe: function(idx) {

        // すでに開けられていたら何もしない
        if (this._board._isOpened(idx)) {
          return;
        }

        // 自分自身をローカル変数に待避する
        var game = this;
        // 隣接する地雷数を初期化する
        var mineCount = 0;
        // 連鎖して開けるマスの配列を初期化する
        var nextOpen = [];

        // 隣接するマスを調べ、地雷の数と連鎖してあけるマスを取得する
        $.each(this._surroundings(idx), function(i, neighbor) {

          // 開いているマスは対象外
          if (game._board._isOpened(neighbor)) {
            return;
          }

          // 地雷と旗の状態を取得する
          var mineFlag = game._board._getMineFlag(neighbor);

          // 地雷がある場合はカウントアップする
          if (mineFlag & Board._HAS_MINE) {
            mineCount++;
            return;
          }

          // 旗がたっている場合は開けない
          if (mineFlag & Board._HAS_FLAG) {
            return;
          }

          // 開けるマスに追加
          nextOpen.push(neighbor);
        });

        // マスを開け、周囲の地雷の数を表示する
        this._board._setMineCount(idx, mineCount);

        // 隠しマスのカウントを減らす
        this._unopened--;

        //クリア判定をする
        if (this._unopened <= 0) {
          this._gameClear();
          return;
        }

        // 周囲に１つも地雷がない場合
        if (mineCount === 0) {
          // 周囲のマスを連鎖で開く
          $.each(nextOpen, function(i, neighbor) {
            game._openSafe(neighbor);
          });
        }
      },
      // 周囲のマスの配列を求める
      _surroundings: function(idx) {
        return this._neighbors(idx, true);
      },
      // 近傍のマスの配列を求める
      _neighbors: function(idx, notme) {

        var game = this;
        var neighbors = [];

        var x1 = idx % this._width;
        var y1 = idx - x1;

        $.each([y1 - game._width, y1, y1 + game._width], function(i, y2) {
          if (y2 < 0 || y2 >= game._cells) {
            return;
          }
          $.each([x1 - 1,  x1, x1 + 1], function(i, x2) {
            if (notme && y2 === y1 && x2 === x1) {
              return;
            }
            if (x2 < 0 || x2 >= game._width) {
              return;
            }
            neighbors.push(y2 + x2);
          });
        });

        return neighbors;
      }
    }
  );

  // バージョン情報・初期設定
  $.minesweeper = {};
  $.minesweeper.version = "1.4.6";
  $.minesweeper.defaults =
  {
    level: 'easy'
  };

  // 言語固有の設定
  $.minesweeper.regional = {};
  $.minesweeper.regional[''] = {
    minesTextBefore: '',
    minesTextAfter: 'mines',
    timerTextBefore: 'time : ',
    timerTextAfter: '',
    restartText: 'Retry',
    clearedText: 'Cleared!'
  };
  $.extend($.minesweeper.defaults, $.minesweeper.regional['']);

  // プラグインメソッド
  $.fn.minesweeper = function(options) {

    // 初期設定をコピーし、パラメータの設定を上書きする
    var settings = $.extend(
      {},
      $.minesweeper.defaults,
      options || {}
    );

    // 上記の設定でマインスイーパの盤面を作成する
    return $(this).each(function() {
      // コンテキストメニュー・範囲選択抑止
      $(this).bind("contextmenu selectstart", function() {
        return false;
      });
      // マインスイーパクラスを作成する
      new MineSweeper(this, settings)._show();
    });
  };

})(jQuery);
