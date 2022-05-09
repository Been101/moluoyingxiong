### Promise

Promise 是一个构造函数，参数是一个可执行函数，默认会同步执行 可执行函数有两个参数 resolve, reject。promise 有三个状态 pending, fulfill, rejected.

promise 实例有个 then 方法， then 有两个函数参数， 如果成功则执行成功的函数并传入成功的 value, 如果失败则执行失败的函数并将失败的 reason 传入。

```js
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";

class Promise {
  constructor(executor) {
    this.status = PENDING;
    // 用户调用 resolve 和 reject 可以将对应的结果暴露在当前的 promise 实例上
    this.value = undefined; // 实例上需要使用
    this.reason = undefined;

    const resolve = (value) => {
      this.value = value;
      this.status = FULFILLED;
    };

    const reject = (reason) => {
      this.reason = reason;
      this.status = REJECTED;
    };

    executor(resolve, reject); // 默认 new Promise 中的函数会立即执行
  }

  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    }

    if (this.status === REJECTED) {
      onRejected(this.reason);
    }
  }
}
```

executor 执行的过程可能会报错，需要 try catch 一下，报错后会走 reject 函数

```js
try {
  executor(resolve, reject); // 默认 new Promise 中的函数会立即执行
} catch (error) {
  reject(error);
}
```

如果用户调了 resolve, promise 的 status 会变成 fulfilled, 并且会把成功的 value 保存起来

如果用户调了 reject, promise 的 status 会变成 rejected, 并且会把失败的 reason 保存起来

promise 的状态只能从 pending 变成 fulfilled 或 rejected, 不能从 fulfilled 变成 rejected 或 从 rejected 变成 fulfilled

```js
const resolve = (value) => {
  if (this.status === PENDING) {
    // // 不能 从失败变成成功，只能从 pending 变成成功
    this.value = value;
    this.status = FULFILLED;
  }
};

const reject = (reason) => {
  console.log(this.status === PENDING);
  if (this.status === PENDING) {
    // 不能从成功变成失败，只能从 pending 变成失败
    this.reason = reason;
    this.status = REJECTED;
  }
};
```

如果 resolve 或 reject 是在异步中执行的， 执行 then 方法的时候 promise status 是 pending 就不会执行成功或失败的回调了。需要在执行 then 的时候先存起来，等执行 resolve 或 reject 的时候再执行。(发布订阅模式)

```js
const PENDING = "PENDING";
const FULFILLED = "FULFILLED";
const REJECTED = "REJECTED";
class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined; // 实例上需要使用
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.status === PENDING) {
        // // 不能 从失败变成成功，只能从 pending 变成成功
        this.value = value;
        this.status = FULFILLED;
        this.onResolvedCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (reason) => {
      console.log(this.status === PENDING);
      if (this.status === PENDING) {
        // 不能从成功变成失败，只能从 pending 变成失败
        this.reason = reason;
        this.status = REJECTED;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject); // 默认 new Promise 中的函数会立即执行
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value);
    }

    if (this.status === REJECTED) {
      onRejected(this.reason);
    }

    if (this.status === PENDING) {
      // 先把 then的回调存起来， 发布订阅模式
      console.log("PENDING");
      this.onResolvedCallbacks.push(() => {
        onFulfilled(this.value);
      });
      this.onRejectedCallbacks.push(() => {
        onRejected(this.reason);
      });
    }
  }
}
```

可以在 then 方法(成功和失败)中返回一个 promise, promise 会采用返回的 promise 的成功的值或失败的原因， 传递到外层下一层 then 中.

1. then 方法中成功的回调或者失败的回调`返回的是一个 promise` , 那么会采用返回的 promise 的状态， 走外层下一次 then 中的成功或失败， 同时将 promise 处理后的结果向下传递
2. then 方法中成功的回调或者失败的回调`返回的是一个普通值(不是 promise)` , 那么会将返回的结果传递到下一次 then 的成功回调中去
3. then 方法中成功的回调或者失败的回调 `执行时出错` 会走到外层下一个 then 中的失败中去

```js
readFile("./a.txt", "utf8")
  .then(
    (data) => {
      return readFile(data, "utf8");
    },
    (err) => {
      console.log("fail", err);
    }
  )
  .then(
    () => {
      console.log(data);
    },
    (err) => {
      console.log("fail2", err);
    }
  );
```
