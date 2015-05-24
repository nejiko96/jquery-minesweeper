# jquery-minesweeper

> jQuery minesweeper plugin

## Demo
http://nejiko96.github.io/jquery-minesweeper/index.html

## Quick Start

Download the [latest version](https://github.com/nejiko96/jquery-minesweeper/archive/1.4.zip).

In your web page:

```html
<link rel="stylesheet" href="styles/jquery.minesweeper.css" />
<script src="http://code.jquery.com/jquery.min.js"></script>
<script src="lib/jquery.timers.js" ></script>
<script src="scripts/jquery.minesweeper.min.js" ></script>
<script>
  jQuery(function ($) {
    $("#minesweeper1").minesweeper();
  });
</script>
...
<div id="minesweeper1"></div>
```

## Install via Bower

```
bower install jquery-minesweeper --save
```

```html
<link rel="stylesheet" href="bower_components/jquery-minesweeper/styles/jquery.minesweeper.css">
<script src="bower_components/jquery-minesweeper/scripts/jquery.minesweeper.min.js"></script>
<script>
  jQuery(function ($) {
    $("#minesweeper1").minesweeper();
  });
</script>
...
<div id="minesweeper1"></div>
```


## localization

```html
<script src="scripts/i18n/jquery.minesweeper-ja.js" ></script>
```



## Dependency
It uses jQuery(>=1.4.4) and [jquery.timers](https://github.com/patryk/jquery.timers)(>=1.2)(optional)

## License

Released under the MIT license.
