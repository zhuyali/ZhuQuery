//只支持通过className，ID和标签选择
var ZhuQuery = (function () {
  let $ = function (selector) {
    return $.init(selector);
  };

  //初始化
  $.init = function (selector) {
    let identifier = selector.charAt(0);
    switch (identifier) {
      case '.':
        return new Elements(document.getElementsByClassName(selector.slice(1)));
      case '#':
        return new Elements(document.getElementById(selector.slice(1)));
      default:
        return new Elements(document.querySelectorAll(selector));
    };
  };

  //封装遍历方法，针对Elements类，定制遍历方式
  $.each = function (items, callback) {
    if (Array.isArray(items)) {
      items.forEach((item, index) => {
        if (callback.call(item, index, item) === false)
          return items;
      });
    } else {
      for (key in items) {
        if (items instanceof Elements) {
          if (Number.isInteger(parseInt(key))) {
            if (callback.call(items[key], key, items[key]) === false)
              return items;
          }
        } else {
          if (callback.call(items[key], key, items[key]) === false)
            return items;
        }
      }
    }
  };

  $.isArray = function (array) {
    return Array.isArray(array);
  };

  //事件类
  let Events = function () {
    this.on = function (eventName, handler) {
      $.each(this, function (key, item) {
        item.addEventListener(eventName, handler);
      });
      return this;
    };
    this.off = function (eventName, handler) {
      $.each(this, function (key, item) {
        tem.removeEventListener(eventName, handler);
      });
      return this;
    };
  };

  //元素类
  let Elements = function (elements) {
    Events.call(this);
    if (elements) {
      if (elements.length >= 0) {
        for (let i = 0; i < elements.length; i++) {
          this[i] = elements[i];
        }
        this.length = elements.length;
      } else {
        this[0] = elements;
        this.length = 1;
      }
    } else {
      this.length = 0;
    }
  };

  //获取当前元素集的兄弟元素
  Elements.prototype.siblings = function () {
    let result = [];
    for (let i = 0; i < this.length; i++) {
      let sib = [...this[i].parentNode.children].filter(child => child !== this[i]);
      result = result.concat(sib);
    }
    return Array.from(new Set(result));
  };

  //获取当前元素集的上一个元素(集)
  Elements.prototype.prev = function () {
    let result = [];
    for (let i = 0; i < this.length; i++) {
      let preSib = this[i].previousElementSibling;
      result = result.concat(preSib);
    }
    return result;
  };

  //获取当前元素集的下一个元素(集)
  Elements.prototype.next = function () {
    let result = [];
    for (let i = 0; i < this.length; i++) {
      let preSib = this[i].nextElementSibling;
      result = result.concat(preSib);
    }
    return result;
  };

  //控制元素不可见
  Elements.prototype.show = function () {
    this.css('display', 'block');
    return this;
  };

  //控制元素可见
  Elements.prototype.hide = function () {
    this.css('display', 'none');
    return this;
  };

  //传参时，设置元素的value；不传参时，获取第一个元素的value
  Elements.prototype.val = function (value) {
    if (value) {
      $.each(this, function (key, item) {
        item.value = value;
      });
      return this;
    } else {
      return this.length === 0 ? null : this[0].value;
    }
  };

  //传参时，设置元素的innerHTML；不传参时，获取第一个元素的innerHTML
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

  //传一个参数时，获取第一个元素属性值；传两个参数时，设置元素集的对应属性值
  Elements.prototype.attr = function (name, value) {
    if (value !== undefined) {
      $.each(this, function (key, item) {
        value === null ? item.removeAttribute(name) : item.setAttribute(name, value);
      });
      return this;
    } else {
      return this.length === 0 ? null : this[0].getAttribute(name);
    }
  };

  //获取或设置 'data-' 属性
  Elements.prototype.data = function (suffix, value) {
    this.attr('data-' + suffix, value);
  }

  //为元素添加class，多个class用空格分隔
  Elements.prototype.addClass = function (classNames) {
    if (classNames) {
      console.log(classNames.split(' '))
      $.each(this, function (key, item) {
        $.each(classNames.split(' '), function (index, className) {
          item.classList.add(className);
        });
      });
    }
    return this;
  };

  //移除元素的指定class，若不传参，则移除所有的class；多个class用空格分隔
  Elements.prototype.removeClass = function (classNames) {
    if (classNames) {
      $.each(this, function (key, item) {
        item.classList.remove(className);
      });
    } else {

    }
    return this;
  };

  Elements.prototype.hasClass = function (className) {
    let has = false;
    if (className) {
      $.each(this, function (key, item) {
        if (item.classList.contains(className)) {
          has = true;
          return false;
        }
      });
    }
    return has;
  };

  //在元素后添加元素
  Elements.prototype.append = function (nodeString) {
    return this.adjacencyOperate('beforeend', nodeString);
  };

  //在元素前添加元素
  Elements.prototype.prepend = function (nodeString) {
    return this.adjacencyOperate('afterbegin', nodeString);
  };

  Elements.prototype.adjacencyOperate = function (operation, nodeString) {
    for (let i = 0; i < this.length; i++) {
      this[i].insertAdjacentHTML(operation, nodeString);
    }
    return this;
  };

  return $;
})();

window.ZhuQuery = ZhuQuery;
window.$ = ZhuQuery;