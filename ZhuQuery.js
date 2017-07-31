//只支持通过className，ID和标签选择
var ZhuQuery = (function () {
  let $ = function (selector) {
    return $.init(selector);
  };

  $.init = function (selector) {
    let identifier = selector.charAt(0);
    switch (identifier) {
      case '.':
        return new Elements(document.getElementsByClassName(selector.slice(1)));
      case '#':
        return new Elements(document.getElementById(selector.slice(1)));
      default:
        return new Elements(document.getElementsByTagName(selector));
    };
  };

  $.ajax = function () {

  };

  let Elements = function (elements) {
    if (elements) {
      if (elements.length) {
        for (let i = 0; i < elements.length; i++) {
          this[i] = elements[i];
        }
        this.length = elements.length;
      } else {
        this[0] = elements;
        this.length = 1;
      }
    } else {
      this[0] = null;
      this.length = 0;
    }
  };

  Elements.prototype.show = function () {
    this.css('display', 'block');
    return this;
  };

  Elements.prototype.hide = function () {
    this.css('display', 'none');
    return this;
  };

  Elements.prototype.html = function (innerHTML) {
    if (innerHTML) {
      for (let i = 0; i < this.length; i++) {
        this[i].innerHTML = innerHTML;
      }
      return this;
    } else {
      return this.length === 0 ? null : this[0].innerHTML;
    }
  };

  //传一个参数时，为获取元素样式；传两个参数时，为设置元素样式
  Elements.prototype.css = function (style, value) {
    for (let i = 0; i < this.length; i++) {
      let computedStyle = getComputedStyle(this[i], '').getPropertyValue(style);
      if (value) {
        this[i].style[style] = value;
      } else {
        return computedStyle;
      }
    }
  };

  Elements.prototype.append = function (nodeString) {
    return this.adjacencyOperate('beforeend', nodeString);
  };

  Elements.prototype.prepend = function (nodeString) {
    return this.adjacencyOperate('afterbegin', nodeString);
  };

  Elements.prototype.adjacencyOperate = function (operation, nodeString) {
    for (let i = 0; i < this.length; i++) {
      this[i].insertAdjacentHTML(operation, nodeString);
    }
    return this;
  };

  let Events = function () { };

  Events.prototype.on = function (eventName, handler) {
    for (let i = 0; i < this.length; i++) {
      this[i].addEventListener(eventName, handler);
    }
    return this;
  };

  Events.prototype.off = function (eventName, handler) {
    for (let i = 0; i < this.length; i++) {
      this[i].removeEventListener(eventName, handler);
    }
    return this;
  };

  Elements.prototype = new Events();

  return $;
})();

window.ZhuQuery = ZhuQuery;
window.$ = ZhuQuery;