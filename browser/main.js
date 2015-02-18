var React = require('react/addons');
var multiline = require('multiline');
var chance = require('chance')();
var Grid = require('./Grid');

var canvas = document.createElement('canvas');
canvas.height = screen.height;
canvas.width = screen.width;
document.body.appendChild(canvas);
var context = canvas.getContext('2d');


function generateRow () {
  return {
    firstName : chance.first(),
    lastName  : chance.last()
  };
}

function generateRows () {
  var rows = [];

  for (var i = 0; i < 100; i++) {
    rows.push(generateRow());
  }

  return rows;
}

function getBootstrapCssText () {
  var bootstrapRules = document.styleSheets[0].rules;
  var cssText = '';
  for (var i = 0; i < bootstrapRules.length; i++) {
    cssText += bootstrapRules[i].cssText;
  }
  return cssText;
}

var bootstrapCssText = getBootstrapCssText();

function renderHtmlForRows (rows) {
  var preamble = multiline(function () {/*
  <svg xmlns="http://www.w3.org/2000/svg">
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-size: 14px; font-family: Helvetica">
  */});

  var prologue = multiline(function () {/*
      </div>
    </foreignObject>
  </svg>
  */});

  var css = '<style type="text/css">' + bootstrapCssText + '</style>';

  var grid = React.renderToStaticMarkup(<Grid rows={rows} />);

  return preamble + css + grid + prologue;
}

function createObjectUrlForHtml (html) {
  var svg = new Blob([html], {type: 'image/svg+xml;charset=utf-8'});
  return URL.createObjectURL(svg);
}

function step () {
  var rows = generateRows();
  var html = renderHtmlForRows(rows);
  var url  = createObjectUrlForHtml(html);

  var image = new Image();

  image.onload = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0);
    URL.revokeObjectURL(url);
    requestAnimationFrame(step);
  }

  image.src = url;
}

requestAnimationFrame(step);
