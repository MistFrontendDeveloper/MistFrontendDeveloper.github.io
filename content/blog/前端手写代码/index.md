---
title: 前端手写代码
date: 2023-08-12 23:34:14
---

## JS

### ES API

#### instanceof

```js
function _instanceof(left, right) {
  let prototype = right.prototype
  left = left.__proto__

  while (true) {
    if (left === null) {
      return false
    }

    if (prototype === left) {
      return true
    }

    left = left.__proto__
  }
}
```

#### new

```js
function _new(constructor, ...args) {
  const obj = Object.create(constructor.prototype)
  const result = constructor.apply(obj, args)
  return result instanceof Object ? result : obj
}
```

#### Function.prototype.call

```js
Function.prototype.call = function (context = window, ...args) {
  if (this === Function.prototype) {
    return new TypeError()
  }

  context = context || window

  const fn = Symbol()

  context[fn] = func

  const result = context[fn](...args)

  delete context[fn]

  return result
}
```

#### Function.prototype.apply

```js
Function.prototype.apply = function (context, args) {
  if (this === Function.prototype) {
    return new TypeError()
  }

  context = context || window

  const fn = Symbol()

  context[fn] = func

  const result = context[fn](...args)

  delete context[fn]

  return result
}
```

#### Function.prototype.bind

```js
Function.prototype.bind = function (context, ...args) {
  const _this = this

  return function F(...moreArgs) {
    if (this instanceof F) {
      return new _this(...args1, ...args2)
    }

    return _this.apply(context, [...args, ...moreArgs])
  }
}
```

#### Array.prototype.reduce

```js
Array.prototype.reduce = function (callback, initialValue) {
  let accumulator = initialValue !== undefined ? initialValue : this[0]

  for (let i = initialValue !== undefined ? 0 : 1; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this)
  }

  return accumulator
}
```

#### Array.prototype.flat

```js
Array.prototype.flat = function (depth) {
  const flattenedArray = []

  function flatten(array, currentDepth) {
    for (let i = 0; i < array.length; i++) {
      if (Array.isArray(array[i]) && currentDepth < depth) {
        flatten(array[i], currentDepth + 1)
      } else {
        flattenedArray.push(array[i])
      }
    }
  }

  flatten(this, 1)
  return flattenedArray
}
```

#### Array.prototype.sort

```js
Array.prototype.sort = function (compareFunction) {
  if (!compareFunction) {
    compareFunction = function (a, b) {
      if (String(a) < String(b)) return -1
      if (String(a) > String(b)) return 1
      return 0
    }
  }

  for (let i = 0; i < this.length - 1; i++) {
    for (let j = 0; j < this.length - i - 1; j++) {
      if (compareFunction(this[j], this[j + 1]) > 0) {
        ;[this[j], this[j + 1]] = [this[j + 1], this[j]]
      }
    }
  }

  return this
}
```

#### String.prototype.trim

```js
String.prototype.trim = function () {
  return this.replace(/^\s+|\s+$/g, "")
}
```

#### Promise

**Promise 核心代码：**

```js
class _Promise {
  constructor(executor) {
    this.state = "pending"
    this.value = undefined
    this.callbacks = []

    const resolve = value => {
      if (this.state === "pending") {
        this.state = "fulfilled"
        this.value = value
        this.callbacks.forEach(callback => this.#handleCallback(callback))
      }
    }

    const reject = reason => {
      if (this.state === "pending") {
        this.state = "rejected"
        this.value = reason
        this.callbacks.forEach(callback => this.#handleCallback(callback))
      }
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  #handleCallback = callback => {
    try {
      if (this.state === "fulfilled" && callback.onFulfilled) {
        const result = callback.onFulfilled(this.value)
        callback.resolve(result)
      } else if (this.state === "rejected" && callback.onRejected) {
        const result = callback.onRejected(this.value)
        callback.resolve(result)
      } else if (this.state === "pending") {
        this.callbacks.push(callback)
      }
    } catch (error) {
      callback.reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    return new _Promise((resolve, reject) => {
      this.#handleCallback({
        onFulfilled: typeof onFulfilled === "function" ? onFulfilled : null,
        onRejected: typeof onRejected === "function" ? onRejected : null,
        resolve,
        reject,
      })
    })
  }

  catch(onRejected) {
    return this.then(null, onRejected)
  }
}

_Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    const results = []
    let completedCount = 0

    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        value => {
          results[i] = value
          completedCount++
          if (completedCount === promises.length) {
            resolve(results)
          }
        },
        reason => {
          reject(reason)
        }
      )
    }
  })
}
```

#### import()

```js
function _import(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script")

    script.type = "module"

    const eventName =
      "importModuleOnLoad_" + Math.random().toString(32).substring(2)

    script.textContent = `
        import * as module from "${url}";
        document.dispatchEvent(new CustomEvent('${eventName}', { detail: module }));
        `

    const handleEvent = event => {
      if (event.type === eventName) {
        resolve(event.detail)
        script.remove()
        document.removeEventListener(eventName, handleEvent)
      }
    }

    document.addEventListener(eventName, handleEvent)

    document.documentElement.appendChild(script)
  })
}
```

### Custom API

#### debounce

```js
function debounce(func, ms) {
  let timer

  return function (...args) {
    clearTimeout(timer)

    timer = setTimeout(() => {
      func.apply(this, args)
    }, ms)
  }
}
```

#### throttle

```js
function throttle(func, ms) {
  let lastTime = 0

  return function (...args) {
    const currentTime = Date.now()

    if (currentTime - lastTime >= ms) {
      func.apply(this, args)
      lastTime = currentTime
    }
  }
}
```

#### get

```js
function get(object, path, defaultValue) {
  const paths = path
    .replace(/\[(\w+)\]/g, ".$1")
    .replace(/\["(\w+)"\]/g, ".$1")
    .replace(/\['(\w+)'\]/g, ".$1")
    .split(".")

  let result = source

  for (const p of paths) {
    result = result?.[p]
  }

  return result === undefined ? defaultValue : result
}
```

#### compose

```js
function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => {
    return (...args) => a(b(...args))
  })
}
```

#### composeRight

```js
function composeRight(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduceRight((a, b) => {
    return (...args) => a(b(...args))
  })
}
```

#### clone

```js
function clone(value) {
  if (value instanceof Map) {
    return new Map(value)
  }

  if (value instanceof Set) {
    return new Set(value)
  }

  if (Array.isArray(value)) {
    return [...value]
  }

  if (typeof value === "object" && value !== null) {
    if (value instanceof Date) {
      return new Date(value)
    }

    if (value instanceof RegExp) {
      return new RegExp(value)
    }

    if (value instanceof Error) {
      return new Error(value.message)
    }

    if (value instanceof Function) {
      return value
    }

    return { ...value }
  }

  return value
}
```

#### cloneDeep

```js
const mapTag = "[object Map]"
const setTag = "[object Set]"
const arrayTag = "[object Array]"
const objectTag = "[object Object]"
const argsTag = "[object Arguments]"
const boolTag = "[object Boolean]"
const dateTag = "[object Date]"
const numberTag = "[object Number]"
const stringTag = "[object String]"
const symbolTag = "[object Symbol]"
const errorTag = "[object Error]"
const regexpTag = "[object RegExp]"
const funcTag = "[object Function]"

const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag]

function forEach(array, iteratee) {
  let index = -1
  const length = array.length
  while (++index < length) {
    iteratee(array[index], index)
  }
  return array
}

function isObject(target) {
  const type = typeof target
  return target !== null && (type === "object" || type === "function")
}

function getType(target) {
  return Object.prototype.toString.call(target)
}

function getInit(target) {
  const Ctor = target.constructor
  return new Ctor()
}

function cloneSymbol(targe) {
  return Object(Symbol.prototype.valueOf.call(targe))
}

function cloneReg(targe) {
  const reFlags = /\w*$/
  const result = new targe.constructor(targe.source, reFlags.exec(targe))
  result.lastIndex = targe.lastIndex
  return result
}

function cloneFunction(func) {
  const bodyReg = /(?<={)(.|\n)+(?=})/m
  const paramReg = /(?<=\().+(?=\)\s+{)/
  const funcString = func.toString()
  if (func.prototype) {
    const param = paramReg.exec(funcString)
    const body = bodyReg.exec(funcString)
    if (body) {
      if (param) {
        const paramArr = param[0].split(",")
        return new Function(...paramArr, body[0])
      } else {
        return new Function(body[0])
      }
    } else {
      return null
    }
  } else {
    return eval(funcString)
  }
}

function cloneOtherType(targe, type) {
  const Ctor = targe.constructor
  switch (type) {
    case boolTag:
    case numberTag:
    case stringTag:
    case errorTag:
    case dateTag:
      return new Ctor(targe)
    case regexpTag:
      return cloneReg(targe)
    case symbolTag:
      return cloneSymbol(targe)
    case funcTag:
      return cloneFunction(targe)
    default:
      return null
  }
}

function cloneDeep(target, map = new WeakMap()) {
  if (!isObject(target)) {
    return target
  }

  const type = getType(target)
  let cloneTarget
  if (deepTag.includes(type)) {
    cloneTarget = getInit(target, type)
  } else {
    return cloneOtherType(target, type)
  }

  if (map.get(target)) {
    return target
  }
  map.set(target, cloneTarget)

  if (type === setTag) {
    target.forEach(value => {
      cloneTarget.add(cloneDeep(value))
    })
    return cloneTarget
  }

  if (type === mapTag) {
    target.forEach((value, key) => {
      cloneTarget.set(key, cloneDeep(value))
    })
    return cloneTarget
  }

  const keys = type === arrayTag ? undefined : Object.keys(target)
  forEach(keys || target, (value, key) => {
    if (keys) {
      key = value
    }
    cloneTarget[key] = cloneDeep(target[key], map)
  })

  return cloneTarget
}
```

#### uniq

```js
function uniq(array) {
  const newArray = []
  const obj = {}

  for (const item of array) {
    if (!obj[item]) {
      obj[item] = true
      newArray.push(item)
    }
  }

  return newArray
}
```

#### curry

```js
function curry(fn, ...args) {
  if (args.length >= fn.length) {
    return fn(...args)
  } else {
    return (...args2) => curry(fn, ...args, ...args2)
  }
}
```

#### memoize

```js
function memoize(fn) {
  const cache = new Map()

  return function (...args) {
    const key = JSON.stringify(args)

    if (cache.has(key)) {
      return cache.get(key)
    }

    const result = fn.call(this, key)

    cache.set(key, result)

    return result
  }
}
```

#### defer

```js
function defer(fn, ...args) {
  setTimeout(fn, 0, ...args)
}
```

#### delay

```js
function delay(fn, ms, ...args) {
  setTimeout(fn, ms, ...args)
}
```

#### sleep

```js
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

#### once

```js
function once(fn) {
  let called = false

  return function (...args) {
    if (called) {
      return
    }

    called = true

    return fn.apply(this, args)
  }
}
```

#### promisify

```js
function promisify(func) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      func(...args, (error, result) => {
        return error ? reject(error) : resolve(result)
      })
    })
  }
}
```

#### sum

```js
function sum(...args) {
  return args.reduce((a, b) => a + b, 0)
}
```

#### isEqual

```js
function isEqual(a, b) {
  if (a === b) {
    return true
  }

  if (
    typeof a !== "object" ||
    typeof b !== "object" ||
    a === null ||
    b === null
  ) {
    return false
  }

  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (const key of keysA) {
    if (!keysB.includes(key) || !isEqual(a[key], b[key])) {
      return false
    }
  }

  return true
}
```

#### chunk

```js
function chunk(array, size) {
  if (!Array.isArray(array) || size <= 0) {
    return []
  }

  const result = []

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }

  return result
}
```

### JS 编码题目

#### 继承

```js
function inherits(ctor, superCtor) {
  ctor.super_ = superCtor
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true,
    },
  })
}
```

使用方法：

```js
function Man() {
  People.call(this)
}
inherits(Man, People)
```

#### EventEmitter

```js
class EventEmitter {
  constructor() {
    this.events = new Map()
  }

  on(eventName, callback) {
    const eventCallbacks = this.events.get(eventName) || []
    eventCallbacks.push(callback)
    this.events.set(eventName, eventCallbacks)
  }

  once(eventName, callback) {
    const onceCallback = (...args) => {
      callback(...args)
      this.off(eventName, onceCallback)
    }
    this.on(eventName, onceCallback)
  }

  emit(eventName, ...args) {
    const eventCallbacks = this.events.get(eventName)
    if (eventCallbacks) {
      eventCallbacks.forEach(callback => {
        callback(...args)
      })
    }
  }

  off(eventName, callback) {
    if (callback) {
      const eventCallbacks = this.events.get(eventName)
      if (eventCallbacks) {
        const filteredCallbacks = eventCallbacks.filter(cb => cb !== callback)
        this.events.set(eventName, filteredCallbacks)
      }
    } else {
      this.events.delete(eventName)
    }
  }
}
```

#### Ajax

```js
function ajax(url, method, params) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(xhr.responseText)
        } else {
          reject(xhr.status)
        }
      }
    }

    if (method === "get" || method === "GET") {
      if (typeof params === "object") {
        params = Object.keys(params)
          .map(function (key) {
            return (
              encodeURIComponent(key) + "=" + encodeURIComponent(params[key])
            )
          })
          .join("&")
      }
      url = params ? url + "?" + params : url
      xhr.open(method, url, true)
      xhr.send()
    }

    if (method === "post" || method === "POST") {
      xhr.open(method, url, true)
      xhr.setRequestHeader("Content-type", "application/json; charset=utf-8")
      xhr.send(JSON.stringify(params))
    }
  })
}
```

#### 图片懒加载

```html
<img class="lazy" data-src="path/to/your/image.jpg" />
```

```css
.lazy {
  width: 100px;
  height: 100px;
}
```

```js
document.addEventListener("DOMContentLoaded", function () {
  const lazyImages = document.querySelectorAll(".lazy")

  function lazyLoad() {
    lazyImages.forEach(image => {
      if (isElementInViewport(image)) {
        image.setAttribute("src", image.getAttribute("data-src"))
        image.classList.remove("lazy")
      }
    })
  }

  function isElementInViewport(element) {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  lazyLoad()

  window.addEventListener("scroll", lazyLoad)

  window.addEventListener("resize", lazyLoad)
})
```

#### URL 参数解析

```js
function parseURLParams(url) {
  const paramsString = url.split("?")[1]

  if (!paramsString) {
    return {}
  }

  const paramsArray = paramsString.split("&")
  const decodedData: any = {}

  paramsArray.forEach(param => {
    const [key, value] = param.split("=")
    const decodedKey = decodeURIComponent(key)
    const decodedValue = decodeURIComponent(value)

    if (decodedKey.endsWith("[]")) {
      const realKey = decodedKey.slice(0, -2)
      if (!decodedData[realKey]) {
        decodedData[realKey] = []
      }
      decodedData[realKey].push(decodedValue)
    } else {
      decodedData[decodedKey] = decodedValue
    }
  })

  return decodedData
}
```

#### 并发控制

```js
class RequestLimiter {
  constructor(maxConcurrentRequests) {
    this.maxConcurrentRequests = maxConcurrentRequests
    this.queue = []
    this.runningRequests = 0
  }

  async enqueueRequest(requestFunction) {
    return new Promise(async (resolve, reject) => {
      const requestTask = async () => {
        this.runningRequests++
        try {
          const result = await requestFunction()
          resolve(result)
        } catch (error) {
          reject(error)
        } finally {
          this.runningRequests--
          this.dequeueNextRequest()
        }
      }

      this.queue.push(requestTask)

      if (this.runningRequests < this.maxConcurrentRequests) {
        this.dequeueNextRequest()
      }
    })
  }

  dequeueNextRequest() {
    if (
      this.queue.length > 0 &&
      this.runningRequests < this.maxConcurrentRequests
    ) {
      const nextRequest = this.queue.shift()
      nextRequest()
    }
  }
}
```

#### JSONP

```ts
function jsonp(url, data, callback) {
  let dataString = url.indexOf("?") == -1 ? "?" : "&"

  for (let key in data) {
    dataString += key + "=" + data[key] + "&"
  }

  const callbackFunctionName =
    "jsonp_" + Math.random().toString().replace(".", "")

  dataString += "callback=" + callbackFunctionName

  const script = document.createElement("script")

  script.src = url + dataString

  window[callbackFunctionName] = function (data) {
    callback(data)
    document.body.removeChild(script)
  }

  document.body.appendChild(script)
}
```

#### 随机字符串

```js
function generateRandomString(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }

  return result
}
```

## TS

### TS API

#### Partial

```ts
type MyPartial<T> = {
  [P in keyof T]?: T[P]
}
```

#### Required

```ts
type MyRequired<T> = {
  [P in keyof T]-?: T[P]
}
```

#### Pick

```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

#### Omit

```ts
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

#### Record

```ts
type MyRecord<K extends keyof any, T> = {
  [P in K]: T
}
```

#### Exclude

```ts
type MyExclude<T, U> = T extends U ? never : T
```

#### Extract

```ts
type MyExtract<T, U> = T extends U ? T : never
```

#### ReturnType

```ts
type MyReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any
```

#### Parameters

```ts
type MyParameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never
```

#### ConstructorParameters

```ts
type MyConstructorParameters<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never
```

#### NonNullable

```ts
type MyNonNullable<T> = T & {}
```

#### Awaited

```ts
type MyAwaited<T> = T extends null | undefined
  ? T
  : T extends object & { then(onfulfilled: infer F, ...args: infer _): any }
  ? F extends (value: infer V, ...args: infer _) => any
    ? MyAwaited<V>
    : never
  : T
```
