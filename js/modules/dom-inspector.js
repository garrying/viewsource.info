/*
 * DomInspector v1.2.4-beta.0
 * (c) 2020 luoye <luoyefe@gmail.com>
 */
(function (global, factory) {
  global.DomInspector = factory()
}(this, function () {
  'use strict'

  function mixin (target, source) {
    const targetCopy = target
    Object.keys(source).forEach(function (item) {
      if ({}.hasOwnProperty.call(source, item)) {
        targetCopy[item] = source[item]
      }
    })
    return targetCopy
  }

  function throttle (func, delay) {
    let lastCalled = 0

    return function (...args) {
      const now = Date.now()

      if (now - lastCalled >= delay) {
        func.apply(this, args)
        lastCalled = now
      }
    }
  }

  function isNull (obj) {
    return Object.prototype.toString.call(obj).replace(/\[object[\s]/, '').replace(']', '').toLowerCase() === 'null'
  }

  const _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol'
    ? function (obj) {
      return typeof obj
    }
    : function (obj) {
      return obj && typeof Symbol === 'function' && obj.constructor === Symbol && obj !== Symbol.prototype ? 'symbol' : typeof obj
    }

  const createClass = (function () {
    function defineProperties (target, props) {
      for (let i = 0; i < props.length; i++) {
        const descriptor = props[i]
        descriptor.enumerable = descriptor.enumerable || false
        descriptor.configurable = true
        if ('value' in descriptor) descriptor.writable = true
        Object.defineProperty(target, descriptor.key, descriptor)
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps)
      if (staticProps) defineProperties(Constructor, staticProps)
      return Constructor
    }
  }())

  const toConsumableArray = function (arr) {
    if (Array.isArray(arr)) {
      const arr2 = [...arr]
      return arr2
    } else {
      return Array.from(arr)
    }
  }

  function isDOM () {
    const obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

    return (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && obj.nodeType === 1 && _typeof(obj.style) === 'object' && _typeof(obj.ownerDocument) === 'object'
  }

  function $ (selector, parent) {
    if (!parent) return document.querySelector(selector)
    if (isDOM(parent)) return parent.querySelector(selector)
    return document.querySelector(selector)
  }

  function addRule (selector, cssObj) {
    Object.keys(cssObj).forEach(function (item) {
      selector.style[item] = cssObj[item]
    })
  }

  function findPos (ele) {
    let computedStyle = window.getComputedStyle(ele)
    let _x = ele.getBoundingClientRect().left - parseFloat(computedStyle['margin-left'])
    let _y = ele.getBoundingClientRect().top - parseFloat(computedStyle['margin-top'])
    let el = ele.parent
    while (el) {
      computedStyle = window.getComputedStyle(el)
      _x += el.frameElement.getBoundingClientRect().left - parseFloat(computedStyle['margin-left'])
      _y += el.frameElement.getBoundingClientRect().top - parseFloat(computedStyle['margin-top'])
      el = el.parent
    }
    return {
      top: _y,
      left: _x
    }
  }

  /**
 * @param  { Dom Element }
 * @return { Object }
 */
  function getElementInfo$1 (ele) {
    const result = {}
    const requiredValue = ['border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'z-index']

    const computedStyle = window.getComputedStyle(ele)
    requiredValue.forEach(function (item) {
      result[item] = parseFloat(computedStyle[item]) || 0
    })

    mixin(result, {
      width: ele.offsetWidth - result['border-left-width'] - result['border-right-width'] - result['padding-left'] - result['padding-right'],
      height: ele.offsetHeight - result['border-top-width'] - result['border-bottom-width'] - result['padding-top'] - result['padding-bottom']
    })
    mixin(result, findPos(ele))
    return result
  }

  function getMaxZIndex () {
    return [].concat(toConsumableArray(document.querySelectorAll('*'))).reduce(function (r, e) {
      return Math.max(r, +window.getComputedStyle(e).zIndex || 0)
    }, 0)
  }

  function isParent (obj, parentObj) {
    while (obj !== undefined && obj !== null && obj.tagName.toUpperCase() !== 'BODY') {
      if (obj === parentObj) return true
      obj = obj.parentNode
    }
    return false
  }

  const sep = 'DomInspector: '

  const proxy = ['log', 'warn', 'error']

  const exportObj = {}

  proxy.forEach(function (item) {
    exportObj[item] = function funcName () {
      return console[item].call(this, sep + (arguments.length <= 0 ? undefined : arguments[0]), (arguments.length <= 1 ? undefined : arguments[1]) || '')
    }
  })

  const DomInspector = (function () {
    function DomInspector () {
      const options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {}

      this._doc = window.document

      this.root = options.root ? isDOM(options.root) ? options.root : $(options.root) : $('body')

      if (isNull(this.root)) {
        exportObj.warn('Root element is null. Auto select body as root')
        this.root = $('body')
      }

      this.theme = options.theme || 'dom-inspector-theme-default'
      this.exclude = this._formatExcludeOption(options.exclude || [])

      this.overlay = {}
      this.overlayId = ''
      this.target = ''
      this.destroyed = false
      this.maxZIndex = options.maxZIndex || getMaxZIndex() + 1

      this._cachedTarget = ''
      this._throttleOnMove = throttle(this._onMove.bind(this), 130)

      this._init()
    }

    createClass(DomInspector, [{
      key: 'enable',
      value: function enable () {
        if (this.destroyed) return exportObj.warn('Inspector instance has been destroyed! Please redeclare it.')
        this.overlay.parent.style.display = 'block'
        this.overlay.parent.style.opacity = '0'
        this.root.addEventListener('mousemove', this._throttleOnMove, { passive: true })
      }
    }, {
      key: 'pause',
      value: function pause () {
        this.root.removeEventListener('mousemove', this._throttleOnMove, { passive: true })
      }
    }, {
      key: 'disable',
      value: function disable () {
        this.overlay.parent.style.display = 'none'
        this.overlay.parent.style.width = 0
        this.overlay.parent.style.height = 0
        this.target = null
        this.root.removeEventListener('mousemove', this._throttleOnMove, { passive: true })
      }
    }, {
      key: 'destroy',
      value: function destroy () {
        this.destroyed = true
        this.disable()
        this.overlay = {}
      }
    }, {
      key: 'getElementInfo',
      value: function getElementInfo (ele) {
        if (!isDOM(ele) && !this.target) return exportObj.warn('Target element is not found')
        return getElementInfo$1(ele || this.target)
      }
    }, {
      key: '_init',
      value: function _init () {
        this.overlayId = 'dom-inspector-' + Date.now()

        const parent = this._createElement('div', {
          id: this.overlayId,
          class: 'dom-inspector ' + this.theme,
          style: 'z-index: ' + this.maxZIndex
        })

        parent.appendChild(Object.assign(document.createElement('div'), { className: 'inspect-ornament inspect-top' }))
        parent.appendChild(Object.assign(document.createElement('div'), { className: 'inspect-ornament inspect-bottom' }))

        this.overlay = {
          parent,
          content: this._createSurroundEle(parent, 'content'),
          paddingTop: this._createSurroundEle(parent, 'padding padding-top'),
          paddingRight: this._createSurroundEle(parent, 'padding padding-right'),
          paddingBottom: this._createSurroundEle(parent, 'padding padding-bottom'),
          paddingLeft: this._createSurroundEle(parent, 'padding padding-left'),
          borderTop: this._createSurroundEle(parent, 'border border-top'),
          borderRight: this._createSurroundEle(parent, 'border border-right'),
          borderBottom: this._createSurroundEle(parent, 'border border-bottom'),
          borderLeft: this._createSurroundEle(parent, 'border border-left'),
          marginTop: this._createSurroundEle(parent, 'margin margin-top'),
          marginRight: this._createSurroundEle(parent, 'margin margin-right'),
          marginBottom: this._createSurroundEle(parent, 'margin margin-bottom'),
          marginLeft: this._createSurroundEle(parent, 'margin margin-left'),
          tips: this._createSurroundEle(parent, 'tips', '&lt;<div class="tag"></div><div class="id"></div><div class="class"></div><div class="href"></div><div>&gt;</div><div class="size"></div>')
        }

        this.root.appendChild(parent)
      }
    }, {
      key: '_createElement',
      value: function _createElement (tag, attr, content) {
        const ele = this._doc.createElement(tag)
        Object.keys(attr).forEach(function (item) {
          ele.setAttribute(item, attr[item])
        })
        if (content) ele.innerHTML = content
        return ele
      }
    }, {
      key: '_createSurroundEle',
      value: function _createSurroundEle (parent, className, content) {
        const ele = this._createElement('div', {
          class: className
        }, content)
        parent.appendChild(ele)
        return ele
      }
    }, {
      key: '_onMove',
      value: function _onMove (e) {
        for (let i = 0; i < this.exclude.length; i += 1) {
          const cur = this.exclude[i]
          if (cur.isEqualNode(e.target) || isParent(e.target, cur)) return
        }

        this.target = e.target

        if (this.target === this._cachedTarget) return null

        this._cachedTarget = this.target
        const elementInfo = getElementInfo$1(e.target)
        const contentLevel = {
          width: elementInfo.width,
          height: elementInfo.height
        }
        const paddingLevel = {
          width: elementInfo['padding-left'] + contentLevel.width + elementInfo['padding-right'],
          height: elementInfo['padding-top'] + contentLevel.height + elementInfo['padding-bottom']
        }
        const borderLevel = {
          width: elementInfo['border-left-width'] + paddingLevel.width + elementInfo['border-right-width'],
          height: elementInfo['border-top-width'] + paddingLevel.height + elementInfo['border-bottom-width']
        }
        const marginLevel = {
          width: elementInfo['margin-left'] + borderLevel.width + elementInfo['margin-right'],
          height: elementInfo['margin-top'] + borderLevel.height + elementInfo['margin-bottom']
        }

        this.overlay.parent.style.opacity = '1'

        addRule(this.overlay.parent, { width: marginLevel.width + 'px', height: marginLevel.height + 'px', top: elementInfo.top + 'px', left: elementInfo.left + 'px' })
        addRule(this.overlay.content, { width: contentLevel.width + 'px', height: contentLevel.height + 'px', top: elementInfo['margin-top'] + elementInfo['border-top-width'] + elementInfo['padding-top'] + 'px', left: elementInfo['margin-left'] + elementInfo['border-left-width'] + elementInfo['padding-left'] + 'px' })
        addRule(this.overlay.paddingTop, { width: paddingLevel.width + 'px', height: elementInfo['padding-top'] + 'px', top: elementInfo['margin-top'] + elementInfo['border-top-width'] + 'px', left: elementInfo['margin-left'] + elementInfo['border-left-width'] + 'px' })
        addRule(this.overlay.paddingRight, { width: elementInfo['padding-right'] + 'px', height: paddingLevel.height - elementInfo['padding-top'] + 'px', top: elementInfo['padding-top'] + elementInfo['margin-top'] + elementInfo['border-top-width'] + 'px', right: elementInfo['margin-right'] + elementInfo['border-right-width'] + 'px' })
        addRule(this.overlay.paddingBottom, { width: paddingLevel.width - elementInfo['padding-right'] + 'px', height: elementInfo['padding-bottom'] + 'px', bottom: elementInfo['margin-bottom'] + elementInfo['border-bottom-width'] + 'px', right: elementInfo['padding-right'] + elementInfo['margin-right'] + elementInfo['border-right-width'] + 'px' })
        addRule(this.overlay.paddingLeft, { width: elementInfo['padding-left'] + 'px', height: paddingLevel.height - elementInfo['padding-top'] - elementInfo['padding-bottom'] + 'px', top: elementInfo['padding-top'] + elementInfo['margin-top'] + elementInfo['border-top-width'] + 'px', left: elementInfo['margin-left'] + elementInfo['border-left-width'] + 'px' })
        addRule(this.overlay.borderTop, { width: borderLevel.width + 'px', height: elementInfo['border-top-width'] + 'px', top: elementInfo['margin-top'] + 'px', left: elementInfo['margin-left'] + 'px' })
        addRule(this.overlay.borderRight, { width: elementInfo['border-right-width'] + 'px', height: borderLevel.height - elementInfo['border-top-width'] + 'px', top: elementInfo['margin-top'] + elementInfo['border-top-width'] + 'px', right: elementInfo['margin-right'] + 'px' })
        addRule(this.overlay.borderBottom, { width: borderLevel.width - elementInfo['border-right-width'] + 'px', height: elementInfo['border-bottom-width'] + 'px', bottom: elementInfo['margin-bottom'] + 'px', right: elementInfo['margin-right'] + elementInfo['border-right-width'] + 'px' })
        addRule(this.overlay.borderLeft, { width: elementInfo['border-left-width'] + 'px', height: borderLevel.height - elementInfo['border-top-width'] - elementInfo['border-bottom-width'] + 'px', top: elementInfo['margin-top'] + elementInfo['border-top-width'] + 'px', left: elementInfo['margin-left'] + 'px' })
        addRule(this.overlay.marginTop, { width: marginLevel.width + 'px', height: elementInfo['margin-top'] + 'px', top: 0, left: 0 })
        addRule(this.overlay.marginRight, { width: elementInfo['margin-right'] + 'px', height: marginLevel.height - elementInfo['margin-top'] + 'px', top: elementInfo['margin-top'] + 'px', right: 0 })
        addRule(this.overlay.marginBottom, { width: marginLevel.width - elementInfo['margin-right'] + 'px', height: elementInfo['margin-bottom'] + 'px', bottom: 0, right: elementInfo['margin-right'] + 'px' })
        addRule(this.overlay.marginLeft, { width: elementInfo['margin-left'] + 'px', height: marginLevel.height - elementInfo['margin-top'] - elementInfo['margin-bottom'] + 'px', top: elementInfo['margin-top'] + 'px', left: 0 })

        const classes = [].concat(toConsumableArray(this.target.classList)).map(String).join(' ')

        $('.tag', this.overlay.tips).innerHTML = this.target.tagName.toLowerCase()
        $('.id', this.overlay.tips).innerHTML = this.target.id ? `&nbsp;id="<span class="token-name">${this.target.id}</span>"` : ''
        $('.href', this.overlay.tips).innerHTML = this.target.href ? `&nbsp;href="<span class="token-name">${this.target.href}</span>"` : ''
        $('.class', this.overlay.tips).innerHTML = classes ? `&nbsp;class="<span class="token-name">${[].concat(toConsumableArray(this.target.classList)).map(String).join(' ')}</span>"` : ''
        $('.size', this.overlay.tips).innerHTML = Math.round(marginLevel.width) + '&times;' + Math.round(marginLevel.height)

        let tipsTop = 0
        if (elementInfo.top >= 42 + 8) {
          tipsTop = elementInfo.top - 42 - 8
        } else {
          tipsTop = marginLevel.height + elementInfo.top + 8
        }
        addRule(this.overlay.tips, { top: tipsTop + 'px', left: elementInfo.left + 'px', display: 'block' })

        const newDiv = document.createElement('div')
        newDiv.innerHTML = `<pre class="ma0"><code class="monospace">&lt;${this.target.tagName.toLowerCase()}&gt;</code></pre>`
        newDiv.className = 'py1 ph2 mt1 element-token'

        document.querySelector('#taglist').appendChild(newDiv)
      }
    }, {
      key: '_formatExcludeOption',
      value: function _formatExcludeOption () {
        const excludeArray = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : []

        const result = []

        excludeArray.forEach(function (item) {
          if (typeof item === 'string') return result.push($(item))

          if (isDOM(item)) return result.push(item)
        })

        return result
      }
    }])
    return DomInspector
  }())

  return DomInspector
}))
