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

## On Ruby on Rails

* In your Gemfile, add the 'rails-assets-jquery-minesweeper' gem:

```ruby
source 'https://rails-assets.org' do
  gem 'rails-assets-jquery-minesweeper'
end
```

* run 'bundle install' command

* In 'app/assets/stylesheets/application.css':

```css
*= require jquery-minesweeper
```

* In 'app/assets/javascripts/application.js':

```js
//= require jquery-minesweeper
```

## localization

```html
<script src="scripts/i18n/jquery.minesweeper-ja.js" ></script>
```

## Dependency
It uses jQuery(>=1.4.4) and [jquery.timers](https://github.com/patryk/jquery.timers)(>=1.2)(optional)

## License

Released under the MIT license.
