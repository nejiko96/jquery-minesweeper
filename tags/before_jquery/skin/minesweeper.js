/* =========================================================

	$Id$

========================================================= */

/***********************************************************
 *
 * クラスライブラリの定義
 *
 ***********************************************************/

if (typeof IKARUGA == "undefined") {
	IKARUGA = {};
}

/***********************************************************
 *
 * マインスイーパクラス
 *
 ***********************************************************/

//コンストラクタ
IKARUGA.MineSweeper = function (sName) {

	//ゲーム名
	this.sName = sName;

	/*
	 * GUI関連フィールド
	 */
	
	//盤面
	this.oBoard = null;

	//タイマー表示フィールド
	this.oTimer = null;
	
	/*
	 * ゲームパラメータ関連フィールド
	 */
	
	//幅
	this.nWidth = 0;
	
	//高さ
	this.nHeight = 0;
	
	//マス数
	this.nCells = 0;
	
	//地雷数
	this.nBoms = 0;
	
	/*
	 * ゲーム状態関連フィールド
	 */
	
	//隠れている空きマス数
	this.nHiddenCells = 0;
	
	//地雷位置
	this.oMinePosition = null;
	
	//爆発位置
	this.nArrExplosion = null;
	
};

/***********************************************************
 *
 * （インナークラス）２次元ベクトル
 *
 ***********************************************************/

//コンストラクタ
IKARUGA.MineSweeper.Vector2D = function (nX, nY) {

	//X方向
	this.nX = nX;

	//Y方向
	this.nY = nY;

};

/***********************************************************
 *
 * マインスイーパクラス
 *
 ***********************************************************/

/***********************************************************
 * 定数
 ***********************************************************/

//幅の下限
IKARUGA.MineSweeper.WIDTH_MIN = 9;
//幅の上限
IKARUGA.MineSweeper.WIDTH_MAX = 30;
//高さの下限
IKARUGA.MineSweeper.HEIGHT_MIN = 9;
//高さの上限
IKARUGA.MineSweeper.HEIGHT_MAX = 24;
//地雷数の下限
IKARUGA.MineSweeper.BOMS_MIN = 10;

//隣接するマスの方向
IKARUGA.MineSweeper.NEIGHBOR_DIRECTIONS = new Array(
	new IKARUGA.MineSweeper.Vector2D(-1, -1),
	new IKARUGA.MineSweeper.Vector2D(0, -1),
	new IKARUGA.MineSweeper.Vector2D(1, -1),
	new IKARUGA.MineSweeper.Vector2D(1, 0),
	new IKARUGA.MineSweeper.Vector2D(1, 1),
	new IKARUGA.MineSweeper.Vector2D(0, 1),
	new IKARUGA.MineSweeper.Vector2D(-1, 1),
	new IKARUGA.MineSweeper.Vector2D(-1, 0)
);

/***********************************************************
 * クラスメソッド
 ***********************************************************/

//画像ファイルパスの設定
IKARUGA.MineSweeper.setImagePath = function (sPath) {
	IKARUGA.MineSweeper.Board.setImagePath(sPath);
};

/***********************************************************
 * インスタンスメソッド
 ***********************************************************/

//画面を初期化する
IKARUGA.MineSweeper.prototype.init = function (nW, nH, nB) {

	window.status = "しばらくお待ちください．．．";

	//グローバル変数を初期化する
	this.initGlobals(nW, nH, nB);

	//盤面を描画する
	this.oBoard = new IKARUGA.MineSweeper.Board(this);
	this.oBoard.paint();
	
	//盤面にリスナを登録
	this.registListeners();

	//タイマー表示フィールドを作成
	this.oTimer = new IKARUGA.MineSweeper.TimerBox(this.oBoard.getTxtTimer());
	
	//ゲームを初期化する
	this.resetGame();
	
	window.status = "";
};

//リスナ登録処理
IKARUGA.MineSweeper.prototype.registListeners = function () {

	var oGame = this;
	var oBoard = this.oBoard;
	var oListener = new IKARUGA.MineSweeper.Listener(this);

	oBoard.getBtnRestart().onclick = function () {
		oGame.restart();
	};
	oBoard.registListeners();
	//イベントリスナを盤面に紐付け
	oBoard.imgCell_firemousedown = function (ev, nIndex) {
		oListener.imgCell_onmousedown(ev, nIndex);
	};
	oBoard.imgCell_firemouseup = function (ev, nIndex) {
		oListener.imgCell_onmouseup(ev, nIndex);
	};

	//コンテキストメニューを抑止する
	oBoard.getForm().oncontextmenu = function () { return false };

};

//グローバル変数を初期化する
IKARUGA.MineSweeper.prototype.initGlobals = function (nW, nH, nB) {

	//地雷数上限値
	var nMaxBoms;

	//幅を初期化する
	this.nWidth = nW;
	if (this.nWidth < IKARUGA.MineSweeper.WIDTH_MIN) {
		this.nWidth = IKARUGA.MineSweeper.WIDTH_MIN;
	}
	if (this.nWidth > IKARUGA.MineSweeper.WIDTH_MAX) {
		this.nWidth = IKARUGA.MineSweeper.WIDTH_MAX;
	}
	
	//高さを初期化する
	this.nHeight = nH;
	if (this.nHeight < IKARUGA.MineSweeper.HEIGHT_MIN) {
		this.nHeight = IKARUGA.MineSweeper.HEIGHT_MIN;
	}
	if (this.nHeight > IKARUGA.MineSweeper.HEIGHT_MAX) {
		this.nHeight = IKARUGA.MineSweeper.HEIGHT_MAX;
	}

	//地雷数を初期化する
	nMaxBoms = (this.nWidth - 1) * (this.nHeight - 1);
	this.nBoms = nB;
	if (this.nBoms < IKARUGA.MineSweeper.BOMS_MIN) {
		this.nBoms = IKARUGA.MineSweeper.BOMS_MIN;
	}
	if (this.nBoms > nMaxBoms) {
		this.nBoms = nMaxBoms;
	}

	//マス数を初期化する
	this.nCells = this.nWidth * this.nHeight;
	
};

//ゲームをやり直す
IKARUGA.MineSweeper.prototype.restart = function () {

	window.status = "しばらくお待ちください．．．";

	//ゲーム画面を再描画する
	this.oBoard.repaint();
	
	//ゲームを初期化する
	this.resetGame();

	window.status = "";
};

//ゲームのリセット
IKARUGA.MineSweeper.prototype.resetGame = function () {

	//タイマーをリセット
	this.oTimer.reset();

	//隠されたマスの数を初期化
	this.nHiddenCells = this.nCells - this.nBoms;

	//残り地雷数を初期化
	this.oBoard.getTxtRemainder().value = this.nBoms;

	//地雷位置をクリア
	this.oMinePosition = null;

	//爆発位置をクリア
	this.nArrExplosion = new Array();
	
	//イベントハンドラを再設定
	this.oBoard.activateListeners();
};

//ゲームの開始
IKARUGA.MineSweeper.prototype.startGame = function (nStartIndex) {

	//地雷位置を初期化
	this.oMinePosition = new IKARUGA.MineSweeper.MinePosition();
	this.oMinePosition.init(this.nCells, this.nBoms, nStartIndex);

	//タイマーを開始
	this.oTimer.start();
	
};

//ゲームの停止
IKARUGA.MineSweeper.prototype.stopGame = function () {

	//タイマーを停止
	this.oTimer.stop();
	
	//イベントハンドラを解除
	this.oBoard.inactivateListeners();

};

//画像上マウス左クリック時の処理
IKARUGA.MineSweeper.prototype.imgCell_onMouseLeftClick = function (nIndex) {

	//ゲームが始まっていない場合、開始する。
	if (this.oMinePosition == null) {
		this.startGame(nIndex);
	}

	//すでに開いていたら何もしない
	if (this.oBoard.isOpened(nIndex)) {
		return;
	}
	
	//旗が立っている場合何もしない
	if (this.oBoard.isFlagged(nIndex)) {
		return;
	}
		
	//地雷を選んだ場合
	if (this.oMinePosition.hasBomAt(nIndex)) {
		//ゲームオーバー
		this.nArrExplosion.push(nIndex);
		this.gameOver();
		return;
	}
	
	//マスを開く
	this.openSafe(nIndex);
	
};

//画像上マウス右クリック時の処理
IKARUGA.MineSweeper.prototype.imgCell_onMouseRightClick = function (nIndex) {

	//開いているマスでは何もしない
	if (this.oBoard.isOpened(nIndex)) {
		return;
	}
	
	//現在の状態に応じて状態遷移させる
	if (this.oBoard.isNotMarked(nIndex)) {
		//無印→旗
		this.oBoard.setFlagged(nIndex);
		this.oBoard.getTxtRemainder().value--;
	} else if (this.oBoard.isFlagged(nIndex)) {
		//旗→不明
		this.oBoard.setUncertain(nIndex);
		this.oBoard.getTxtRemainder().value++;
	} else if (this.oBoard.isUncertain(nIndex)) {
		//不明→無印
		this.oBoard.setNotMarked(nIndex);
	}
};

//画像上マウス両クリック時の処理
IKARUGA.MineSweeper.prototype.imgCell_onMouseBothClick = function (nIndex) {

	var n;
	var nNeighbor;

	var nFlagCount;
	var nBomCount;

	var nArrSafe;
	var nArrExplosion;

	//まだ開いていないマスだったら何もしない
	if (this.oBoard.isHidden(nIndex)) {
		return;
	}

	nFlagCount = 0;
	nBomCount = this.oBoard.getBomCount(nIndex);
	
	nArrSafe = new Array();
	nArrExplosion = new Array();

	//隣接するマスを全て調べる
	for (n = 0; n < IKARUGA.MineSweeper.NEIGHBOR_DIRECTIONS.length; n++) {

		//隣接するマスの位置を求める
		nNeighbor = this.calcNeighborPos(nIndex, IKARUGA.MineSweeper.NEIGHBOR_DIRECTIONS[n]);
		//盤面の外側の場合何もしない
		if (nNeighbor < 0) {
			continue;
		}
		
		//開いているマスは対象外
		if (this.oBoard.isOpened(nNeighbor)) {
			continue;
		}
		
		if (this.oBoard.isFlagged(nNeighbor)) {
			//旗をカウントする
			nFlagCount++;
			continue;
		}
		
		//地雷がある場合
		if (this.oMinePosition.hasBomAt(nNeighbor)) {
			//爆発マスのリストに加える
			nArrExplosion.push(nNeighbor);
			continue;
		}
		
		//安全なマスのリストに加える
		nArrSafe.push(nNeighbor);
	}
	
	//隣接する地雷の数と旗の数が一致しなければ、何もしない
	if (nFlagCount != nBomCount) {
		return;
	}

	//安全なマスは開いておく
	for (n = 0; n < nArrSafe.length; n++) {
		this.openSafe(nArrSafe[n]);
	}

	//地雷を選んでしまった場合
	if (nArrExplosion.length > 0) {
		//ゲームオーバー
		this.nArrExplosion = nArrExplosion;
		this.gameOver();
	}
};

//安全なマスを開く
IKARUGA.MineSweeper.prototype.openSafe = function (nIndex) {

	var n;
	var nNeighbor;
	
	var nBomCount;
	var nArrNeighbors;

	//すでに開いていたら何もしない
	if (this.oBoard.isOpened(nIndex)) {
		return;
	}

	//周囲の地雷数と開けるマスを求める
	nBomCount = 0;
	nArrNeighbors = new Array();
	
	for (n = 0; n < IKARUGA.MineSweeper.NEIGHBOR_DIRECTIONS.length; n++) {
	
		//隣接するマスの位置を求める
		nNeighbor = this.calcNeighborPos(nIndex, IKARUGA.MineSweeper.NEIGHBOR_DIRECTIONS[n]);
		//盤面の外側の場合何もしない
		if (nNeighbor < 0) {
			continue;
		}
		
		//開いているマスは対象外
		if (this.oBoard.isOpened(nNeighbor)) {
			continue;
		}
		
		//地雷がある場合はカウントアップする
		if (this.oMinePosition.hasBomAt(nNeighbor)) {
			nBomCount++;
			continue;
		}

		//旗がたっている場合は何もしない
		if (this.oBoard.isFlagged(nNeighbor)) {
			continue;
		}
		
		//空けるマスに追加
		nArrNeighbors.push(nNeighbor);
	}
	
	//周囲の地雷の数を表示する
	this.oBoard.setBomCount(nIndex, nBomCount);
	
	//隠しマスのカウントを減らす
	this.nHiddenCells--;
	//クリア判定をする
	if (this.nHiddenCells <= 0) {
		this.gameClear();
		return;
	}

	//周囲に１つも地雷がない場合
	if (nBomCount == 0) {
		//周囲のマスも同じように開く
		for (n = 0; n < nArrNeighbors.length; n++) {
			this.openSafe(nArrNeighbors[n]);
		}
	}

};

//隣接するマスの位置を計算する
IKARUGA.MineSweeper.prototype.calcNeighborPos = function (nIndex, oDir) {

	var nX;
	
	nX = nIndex % this.nWidth;

	if (oDir.nX < 0 && nX == 0) {
		return -1;
	}
	if (oDir.nX > 0 && nX + 1 == this.nWidth) {
		return -1;
	}
	if (oDir.nY < 0 && nIndex < this.nWidth) {
		return -1;
	}
	if (oDir.nY > 0 && nIndex + this.nWidth >= this.nCells) {
		return -1;
	}
	return nIndex + oDir.nY * this.nWidth + oDir.nX;
};

//ゲームクリア
IKARUGA.MineSweeper.prototype.gameClear = function () {

	var n;
	var nIndex;

	//地雷の位置に全て旗を立てる
	for (n = 0; n < this.nBoms; n++) {
		nIndex = this.oMinePosition.getPosition(n);
		this.oBoard.setFlagged(nIndex);
	}
	this.oBoard.getTxtRemainder().value = "0";
	
	this.stopGame();
	alert("クリア！");
	
	//ランキング機能がある場合はランキングに登録
	if (document.frmRanking) {
		updateRanking(this.oTimer.getValue());
	}
};


//ゲームオーバー
IKARUGA.MineSweeper.prototype.gameOver = function () {

	var n;
	var nIndex;

	//地雷の位置と旗を間違えて立てた箇所を表示
	for (nIndex = 0; nIndex < this.nCells; nIndex++) {
		if (this.oMinePosition.hasBomAt(nIndex)) {
			if (this.oBoard.isFlagged(nIndex)) {
			} else {
				this.oBoard.setBom(nIndex);
			}
		} else if (this.oBoard.isFlagged(nIndex)) {
			this.oBoard.setMistake(nIndex);
		}
	}

	//爆発位置を表示
	for (n = 0; n < this.nArrExplosion.length; n++) {
		this.oBoard.setExplosion(this.nArrExplosion[n]);
	}
	
	this.stopGame();
};

/***********************************************************
 *
 * （インナークラス）マインスイーパイベントハンドラ
 *
 ***********************************************************/

//コンストラクタ
IKARUGA.MineSweeper.Listener = function (oGame) {

	//ゲーム情報
	this.oGame = oGame;

	//ボタン押下位置
	this.nButtonIndex = -1;
	
	//ダウンボタンキー
	this.nButtonKey = 0;

};

/***********************************************************
 * 定数
 ***********************************************************/

//左ボタン
IKARUGA.MineSweeper.Listener.EVENT_BUTTON_LEFT = 1;
//右ボタン
IKARUGA.MineSweeper.Listener.EVENT_BUTTON_RIGHT = 2;
//両ボタン
IKARUGA.MineSweeper.Listener.EVENT_BUTTON_BOTH = 3;

//左ボタン
IKARUGA.MineSweeper.Listener.EVENT_WHICH_LEFT = 1;
//右ボタン
IKARUGA.MineSweeper.Listener.EVENT_WHICH_RIGHT = 3;

/***********************************************************
 * インスタンスメソッド
 ***********************************************************/

//画像上マウスダウン時の処理
IKARUGA.MineSweeper.Listener.prototype.imgCell_onmousedown = function (ev, nIndex) {

	var nButton;

	//whichを先に見る（Firefox対応）
	if (ev.which) {
		if (ev.which == IKARUGA.MineSweeper.Listener.EVENT_WHICH_LEFT) {
			nButton = IKARUGA.MineSweeper.Listener.EVENT_BUTTON_LEFT;
		} else if (ev.which == IKARUGA.MineSweeper.Listener.EVENT_WHICH_RIGHT) {
			nButton = IKARUGA.MineSweeper.Listener.EVENT_BUTTON_RIGHT;
		} else {
			nButton = 0;
		}
		if (nIndex != this.nButtonIndex) {
			this.nButtonIndex = nIndex;
			this.nButtonKey = nButton;
		} else {
			this.nButtonKey = this.nButtonKey | nButton;
		}
	} else if (ev.button) {
		//押されたボタンとダウン位置を記憶
		this.nButtonIndex = nIndex;
		this.nButtonKey = ev.button & IKARUGA.MineSweeper.Listener.EVENT_BUTTON_BOTH;
	}

};

//画像上マウスアップ時の処理
IKARUGA.MineSweeper.Listener.prototype.imgCell_onmouseup = function (ev, nIndex) {

	//位置がダウン時と異なる場合は処理しない
	if (nIndex != this.nButtonIndex) {
		this.nButtonIndex = -1;
		return;
	}
	this.nButtonIndex = -1;

	//押されたボタン判定
	if (this.nButtonKey == IKARUGA.MineSweeper.Listener.EVENT_BUTTON_LEFT) {
		this.oGame.imgCell_onMouseLeftClick(nIndex);
	} else if (this.nButtonKey == IKARUGA.MineSweeper.Listener.EVENT_BUTTON_RIGHT) {
		this.oGame.imgCell_onMouseRightClick(nIndex);
	} else if (this.nButtonKey == IKARUGA.MineSweeper.Listener.EVENT_BUTTON_BOTH) {
		this.oGame.imgCell_onMouseBothClick(nIndex);
	} else {
		this.oGame.imgCell_onMouseLeftClick(nIndex);
	}
};

/***********************************************************
 *
 * （インナークラス）マインスイーパ盤面クラス
 *
 ***********************************************************/

//コンストラクタ
IKARUGA.MineSweeper.Board = function (oGame) {

	//フォーム名
	this.sFrmName = "frmMineSweeper_" + oGame.sName;
	
	//画像名
	this.sImgName = this.sFrmName + ".imgCell_";
	
	//画像名の正規表現パターン
	this.regImgPattern = new RegExp('^' + this.sFrmName + '\\.imgCell_(\\d+)$');
	
	//盤面の幅
	this.nWidth = oGame.nWidth;

	//盤面の高さ
	this.nHeight = oGame.nHeight;
	
	//マスの数
	this.nCells = oGame.nCells;
	
	//マスの状態
	this.sArrState = new Array(this.nCells);
	
};

/***********************************************************
 * 定数
 ***********************************************************/

//画像ファイルのパス
IKARUGA.MineSweeper.Board.DEFAULT_IMAGE_PATH = "./";

//マスの状態－隠
IKARUGA.MineSweeper.Board.STATE_HIDDEN = "0";
//マスの状態－隠（無印）
IKARUGA.MineSweeper.Board.STATE_NOT_MARKED = "01";
//マスの状態－隠（旗）
IKARUGA.MineSweeper.Board.STATE_FLAGGED = "0f";
//マスの状態－隠（？）
IKARUGA.MineSweeper.Board.STATE_UNCERTAIN = "0h";

//マスの状態－開
IKARUGA.MineSweeper.Board.STATE_OPENED = "1";
//マスの状態－開（空）
IKARUGA.MineSweeper.Board.STATE_VACANT = "10";
//マスの状態－開（地雷）
IKARUGA.MineSweeper.Board.STATE_BOM = "19";
//マスの状態－開（爆発）
IKARUGA.MineSweeper.Board.STATE_EXPLOSION = "1a";
//マスの状態－開（ミス）
IKARUGA.MineSweeper.Board.STATE_MISTAKE = "1b";

/***********************************************************
 * クラス変数
 ***********************************************************/

//画像ファイルのパス（変更可能）
IKARUGA.MineSweeper.Board.sImagePath = IKARUGA.MineSweeper.Board.DEFAULT_IMAGE_PATH;

//画像キャッシュ
IKARUGA.MineSweeper.Board.oArrImage = null;

/***********************************************************
 * クラスメソッド
 ***********************************************************/

//画像ファイルパスの設定
IKARUGA.MineSweeper.Board.setImagePath = function (sPath) {
	IKARUGA.MineSweeper.Board.sImagePath = sPath;
};

//画像キャッシュの初期化
IKARUGA.MineSweeper.Board.initImageCache = function () {
	
	var n;
	
	if (IKARUGA.MineSweeper.Board.oArrImage != null) {
		return;
	}
	
	IKARUGA.MineSweeper.Board.oArrImage = new Array();

	IKARUGA.MineSweeper.Board.loadImage(IKARUGA.MineSweeper.Board.STATE_NOT_MARKED);
	IKARUGA.MineSweeper.Board.loadImage(IKARUGA.MineSweeper.Board.STATE_FLAGGED);
	IKARUGA.MineSweeper.Board.loadImage(IKARUGA.MineSweeper.Board.STATE_UNCERTAIN);

	for (n = 0; n <= 8; n++) {
		IKARUGA.MineSweeper.Board.loadImage(IKARUGA.MineSweeper.Board.STATE_OPENED + n);
	}
	IKARUGA.MineSweeper.Board.loadImage(IKARUGA.MineSweeper.Board.STATE_BOM);
	IKARUGA.MineSweeper.Board.loadImage(IKARUGA.MineSweeper.Board.STATE_EXPLOSION);
	IKARUGA.MineSweeper.Board.loadImage(IKARUGA.MineSweeper.Board.STATE_MISTAKE);
};

//画像をロードする
IKARUGA.MineSweeper.Board.loadImage = function (sSrc) {

	var oImage = new Image();
	
	oImage.src = IKARUGA.MineSweeper.Board.sImagePath + sSrc + ".PNG";
	IKARUGA.MineSweeper.Board.oArrImage.push(oImage);

};

//空の関数
IKARUGA.MineSweeper.Board.doNothing = function () {
};

/***********************************************************
 * インスタンスメソッド
 ***********************************************************/

//ゲーム画面を描画する
IKARUGA.MineSweeper.Board.prototype.paint = function () {

	var nIndex;
	var sHtml;

	//画像を初期化する
	IKARUGA.MineSweeper.Board.initImageCache();
	
	sHtml = '';
	sHtml += '<div class="divMineSweeper" >\n';
	sHtml += '  <form name="' + this.sFrmName + '">\n';
	sHtml += '    <nobr>\n';
	sHtml += '    あと<input name="txtRemainder" type="text" size="3" value="0" readonly />個\n';
	sHtml += '    　　　　　\n';
	sHtml += '    <input name="txtTimer" type="text" size="3" value="0" readonly />秒経過\n';
	for (nIndex = 0; nIndex < this.nCells; nIndex++) {
		this.sArrState[nIndex] = IKARUGA.MineSweeper.Board.STATE_NOT_MARKED;
		if (nIndex % this.nWidth == 0) {
			sHtml += '<br />';
		}
		sHtml += '<img\n';
		sHtml += ' name="' + this.sImgName + nIndex + '"\n';
		sHtml += ' width="32"\n';
		sHtml += ' height="32"\n';
		sHtml += ' src="' + IKARUGA.MineSweeper.Board.sImagePath + IKARUGA.MineSweeper.Board.STATE_NOT_MARKED + '.PNG"\n';
		sHtml += ' onmousedown="this.firemousedown(event)"\n';
		sHtml += ' onmouseup="this.firemouseup(event)"\n';
		sHtml += '/>';
	}
	sHtml += '<br />';
	sHtml += '    <input type="button" name="btnRestart" value="もう１回？" />\n';
	sHtml += '    </nobr>\n';
	sHtml += '  </form>\n';
	sHtml += '</div>\n';

	document.write(sHtml);
};

//ゲーム画面を再描画する
IKARUGA.MineSweeper.Board.prototype.repaint = function () {

	var nIndex;

	//マスの状態を初期化
	for (nIndex = 0; nIndex < this.nCells; nIndex++) {
		this.setNotMarked(nIndex);
	}

};

//リスナを登録する
IKARUGA.MineSweeper.Board.prototype.registListeners = function () {

	var oBoard = this;
	var nIndex;
	var imgCell;
	
	for (nIndex = 0; nIndex < this.nCells; nIndex++) {
		imgCell = this.getImgCell(nIndex);
		imgCell.nIndex = nIndex;
		imgCell.firemousedown = function (ev) {
			oBoard.imgCell_onmousedown(ev, this.nIndex);
		};
		imgCell.firemouseup = function (ev) {
			oBoard.imgCell_onmouseup(ev, this.nIndex);
		};
	}
	//NN用の右クリック抑止処理でキャプチャしたイベントの処理
	document.addFiremousedown(
		function (ev) {
			var sTarget;
			var sArrMatches;
			var nIndex;
			
			if (!ev.target) {
				return;
			}
			if (!ev.target.name) {
				return;
			}
			
			sTarget = ev.target.name;
			sArrMatches = sTarget.match(oBoard.regImgPattern);
			
			if (!sArrMatches) {
				return;
			}
			
			nIndex = parseInt(sArrMatches[1], 10);
			oBoard.imgCell_onmousedown(ev, nIndex);
		}
	);
	
};

//リスナ活性化処理
IKARUGA.MineSweeper.Board.prototype.activateListeners = function () {
	this.imgCell_onmousedown = this.imgCell_firemousedown;
	this.imgCell_onmouseup = this.imgCell_firemouseup;
};

//リスナ非活性化処理
IKARUGA.MineSweeper.Board.prototype.inactivateListeners = function () {
	this.imgCell_onmousedown = IKARUGA.MineSweeper.Board.doNothing;
	this.imgCell_onmouseup = IKARUGA.MineSweeper.Board.doNothing;
};

//フォームの取得
IKARUGA.MineSweeper.Board.prototype.getForm = function () {
	return document.forms[this.sFrmName];
};

//残り地雷数フィールドの取得
IKARUGA.MineSweeper.Board.prototype.getTxtRemainder = function () {
	return this.getForm().txtRemainder;
};

//タイマーフィールドの取得
IKARUGA.MineSweeper.Board.prototype.getTxtTimer = function () {
	return this.getForm().txtTimer;
};

//再開ボタンの取得
IKARUGA.MineSweeper.Board.prototype.getBtnRestart = function () {
	return this.getForm().btnRestart;
};

//マス目画像の取得
IKARUGA.MineSweeper.Board.prototype.getImgCell = function (nIndex) {
	return document.images[this.sImgName + nIndex];
};

//マスが開いているかどうか判定する
IKARUGA.MineSweeper.Board.prototype.isHidden = function (nIndex) {
	return this.sArrState[nIndex].charAt(0) == IKARUGA.MineSweeper.Board.STATE_HIDDEN;
};

//マスに印がついていないどうか判定する
IKARUGA.MineSweeper.Board.prototype.isNotMarked = function (nIndex) {
	return this.sArrState[nIndex] == IKARUGA.MineSweeper.Board.STATE_NOT_MARKED;
};

//旗が立っているかどうか判定する
IKARUGA.MineSweeper.Board.prototype.isFlagged = function (nIndex) {
	return this.sArrState[nIndex] == IKARUGA.MineSweeper.Board.STATE_FLAGGED;
};

//不明状態どうか判定する
IKARUGA.MineSweeper.Board.prototype.isUncertain = function (nIndex) {
	return this.sArrState[nIndex] == IKARUGA.MineSweeper.Board.STATE_UNCERTAIN;
};

//マスが開いているかどうか判定する
IKARUGA.MineSweeper.Board.prototype.isOpened = function (nIndex) {
	return this.sArrState[nIndex].charAt(0) == IKARUGA.MineSweeper.Board.STATE_OPENED;
};

//周囲の地雷数を取得する
IKARUGA.MineSweeper.Board.prototype.getBomCount = function (nIndex) {
	return parseInt(this.sArrState[nIndex], 10) - 10;
};

//マスの状態を設定する
IKARUGA.MineSweeper.Board.prototype.setState = function (nIndex, sNewState) {

	if (this.sArrState[nIndex] == sNewState) {
		return;
	}

	this.sArrState[nIndex] = sNewState;
	this.getImgCell(nIndex).src = IKARUGA.MineSweeper.Board.sImagePath + sNewState + ".PNG";
};

//マスを無印に設定する
IKARUGA.MineSweeper.Board.prototype.setNotMarked = function (nIndex) {
	this.setState(nIndex, IKARUGA.MineSweeper.Board.STATE_NOT_MARKED);
};

//マスを旗印に設定する
IKARUGA.MineSweeper.Board.prototype.setFlagged = function (nIndex) {
	this.setState(nIndex, IKARUGA.MineSweeper.Board.STATE_FLAGGED);
};

//マスを？印に設定する
IKARUGA.MineSweeper.Board.prototype.setUncertain = function (nIndex) {
	this.setState(nIndex, IKARUGA.MineSweeper.Board.STATE_UNCERTAIN);
};

//周囲の地雷数を設定する
IKARUGA.MineSweeper.Board.prototype.setBomCount = function (nIndex, nCount) {
	this.setState(nIndex, IKARUGA.MineSweeper.Board.STATE_OPENED + nCount);
};

//地雷がある状態に設定する
IKARUGA.MineSweeper.Board.prototype.setBom = function (nIndex) {
	this.setState(nIndex, IKARUGA.MineSweeper.Board.STATE_BOM);
};

//地雷爆発状態に設定する
IKARUGA.MineSweeper.Board.prototype.setExplosion = function (nIndex) {
	this.setState(nIndex, IKARUGA.MineSweeper.Board.STATE_EXPLOSION);
};

//間違ってる状態に設定する
IKARUGA.MineSweeper.Board.prototype.setMistake = function (nIndex) {
	this.setState(nIndex, IKARUGA.MineSweeper.Board.STATE_MISTAKE);
};

/***********************************************************
 *
 * （インナークラス）地雷位置格納クラス
 *
 ***********************************************************/
 
//コンストラクタ
IKARUGA.MineSweeper.MinePosition = function () {
	
	//地雷位置
	this.nArrBoms = null;
	
	//空きマス数
	this.nEmptyCells = 0;
};
 
/***********************************************************
 * インスタンスメソッド
 ***********************************************************/

//ゲームの開始
IKARUGA.MineSweeper.MinePosition.prototype.init = function (nCells, nBoms, nStartIndex) {

	var n;
	var nIndex;

	//地雷位置を初期化
	this.nArrBoms = new Array();
	this.nEmptyCells = nCells;

	//最初に選んだマスに地雷が置かれないようにする
	this.insertBomAt(nStartIndex);

	//空いているマスの中からランダムに地雷を配置する
	for (n = 0; n < nBoms; n++) {
		nIndex = Math.floor(Math.random() * this.nEmptyCells);
		this.insertBomAt(nIndex);
	}
	
	//最初に選んだマスから地雷を取り除く
	this.removeBomAt(nStartIndex);
	
};

//地雷を追加する
IKARUGA.MineSweeper.MinePosition.prototype.insertBomAt = function (nIndex) {

	var nInsert;
	var nBoms;

	//配列中の挿入位置を決定しつつ、微調整を入れる
	nBoms = this.nArrBoms.length;
	for (nInsert = 0; nInsert < nBoms; nInsert++) {
		if (this.nArrBoms[nInsert] > nIndex) {
			break;
		}
		nIndex++;
	}
	
	//挿入
	this[nIndex] = true;
	this.nArrBoms.splice(nInsert, 0, nIndex);
	this.nEmptyCells--;
};

//地雷を取り除く
IKARUGA.MineSweeper.MinePosition.prototype.removeBomAt = function (nIndex) {

	var nRemove;
	var nBoms;

	//削除位置を決定
	nBoms = this.nArrBoms.length;
	for (nRemove = 0; nRemove < nBoms; nRemove++) {
		if (this.nArrBoms[nRemove] == nIndex) {
			break;
		}
	}
	
	//削除
	this[nIndex] = false;
	this.nArrBoms.splice(nRemove, 1);
	this.nEmptyCells++;
};

//地雷有無を判定する
IKARUGA.MineSweeper.MinePosition.prototype.hasBomAt = function (nIndex) {

	return (this[nIndex] == true);

};

//地雷位置を取得する
IKARUGA.MineSweeper.MinePosition.prototype.getPosition = function (n) {

	return this.nArrBoms[n];
};

/***********************************************************
 *
 * （インナークラス）タイマー表示
 *
 ***********************************************************/

//コンストラクタ
IKARUGA.MineSweeper.TimerBox = function (txt) {
	
	//表示用テキストボックス
	this.txtTimer = txt;
	
	//タイマーID
	this.nTimerId = 0;
	
};

/***********************************************************
 * 定数
 ***********************************************************/

//更新インターバル
IKARUGA.MineSweeper.TimerBox.UPDATE_INTERVAL = 1000;

//表示最大カウント
IKARUGA.MineSweeper.TimerBox.MAX_CONT = "999";

/***********************************************************
 * インスタンスメソッド
 ***********************************************************/

//タイマーのリセット
IKARUGA.MineSweeper.TimerBox.prototype.reset = function () {
	clearInterval(this.nTimerId);
	this.nTimerId = 0;
	this.txtTimer.value = "0";
};

//タイマーの開始
IKARUGA.MineSweeper.TimerBox.prototype.start = function () {
	var oTimer = this;
	
	this.txtTimer.value = "1";
	this.nTimerId = setInterval(function () { oTimer.update() }, IKARUGA.MineSweeper.TimerBox.UPDATE_INTERVAL);
};

//タイマーの終了
IKARUGA.MineSweeper.TimerBox.prototype.stop = function () {
	clearInterval(this.nTimerId);
};

//タイマーの更新
IKARUGA.MineSweeper.TimerBox.prototype.update = function () {
	this.txtTimer.value++;
	if (this.txtTimer.value >= IKARUGA.MineSweeper.TimerBox.MAX_CONT) {
		clearInterval(this.nTimerId);
	}
};

//タイマーの値を取得
IKARUGA.MineSweeper.TimerBox.prototype.getValue = function () {
	return this.txtTimer.value;
};

