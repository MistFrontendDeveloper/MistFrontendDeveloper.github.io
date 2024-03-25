---
title: 前端面试题之代码篇
---

## async/await

<details>
<summary>查看代码</summary>

```javascript
function promisifyGenerator(generatorFunc) {
  return function (...args) {
    const generator = generatorFunc(...args)

    return new Promise((resolve, reject) => {
      function handleNext(result) {
        const { value, done } = result

        if (done) {
          resolve(value)
          return
        }

        Promise.resolve(value).then(
          res => handleNext(generator.next(res)),
          err => handleThrow(generator.throw(err))
        )
      }

      function handleThrow(error) {
        const { value, done } = error

        if (done) {
          reject(value)
          return
        }

        Promise.resolve(value).then(
          res => handleNext(generator.next(res)),
          err => handleThrow(generator.throw(err))
        )
      }

      handleNext(generator.next())
    })
  }
}

function* getSiteName() {
  const writer = yield new Promise(resolve =>
    setTimeout(() => resolve("Mist"), 1000)
  )
  const site = yield new Promise(resolve =>
    setTimeout(() => resolve("Blog"), 1000)
  )
  return writer + " " + site
}

const getSiteNameWithPromisify = promisifyGenerator(getSiteName)

getSiteNameWithPromisify()
  .then(result => {
    console.log(result) // 输出: "Mist Blog"
  })
  .catch(error => {
    console.error(error)
  })
```

</details>
