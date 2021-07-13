// 实现一个简单的promise
const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;

function getThen(result) {
  const type = typeof result;
  if(type && (type === 'function' || type === 'object')) {
    const then = result.then;
    if(typeof then === 'function') {
      return then;
    }
  }
  return null;
}

function doResolve(fn, resolve, reject) {
  let done = false;
  try {
    fn(function(value) {
      if(done) return;
      done = true;
      resolve(value);
    }, function(err){
      if(done) return;
      done = true;
      reject(err);
    });
  } catch(err) {  
    if(done) return;
    done = true;
    reject(err);
  }
}
function APromise(fn) {

  let state = PENDING;
  let value = null;
  let handlers = [];
  

  function fulfill(result) {
    state = FULFILLED;
    value = result;
    handlers.forEach(handle);
  }
  function reject(err) {
    state = REJECTED;
    value = err;
    handlers.forEach(handle);
  }

  function handle(handler) {
    if(state === PENDING) {
      handlers.push(handler);
    } else {
      if(state === FULFILLED && typeof handler.onFulfilled === 'function') {
        handler.onFulfilled(value);
      }
      if(state === REJECTED && typeof handler.onRejected === 'function') {
        handler.onRejected(value);
      }
    }
  }

  function resolve(result) {
    try {
      const then = getThen(result);
      if(then) {
        doResolve(then.bind(result), resolve, reject);
        return;
      }
      fulfill(result);
    } catch(e) {
      reject(e);
    }
  }

  this.done = function(onFulfilled, onRejected) {
    setTimeout(() => {
      handle({ onFulfilled, onRejected });
    }, 0)
  }



  this.then = function(onFulfilled, onRejected) {
    const self = this;
    return new APromise(function(resolve, reject){
      self.done(function(result){
        if(typeof onFulfilled === 'function') {
          try {
            return resolve(onFulfilled(result));
          } catch(e) {
            return reject(e);
          }
          
        } else {
          return resolve(result);
        }
      }, function(error) {
        if(typeof onRejected === 'function') {
          try {
            return reject(onRejected(error));
          } catch(e) {  
            return reject(e);
          }
        }
      });
    });
  }

  doResolve(fn, resolve, reject);

}


APromise.all = function(arr) {
  // 判断是否是数组
  let remaining = arr.length;
  return new APromise(function(resolve, reject) {

    function res(i, val) {
      try {
        const then = getThen(val);
        if(then) {
          then.call(val, function(value) { res(i, value), reject });
          return;
        }
        arr[i] = val;
        if(--remaining == 0) {
          resolve(arr);
        }
      } catch(e) {
        reject(e)
      }
    }

    for(let i = 0; i < arr.length;i++) {
      res(i, arr[i])
    }
  });
}

APromise.race = function(arr) {
  for(let i = 0;i < arr.length;i++) {
    arr[i].then(resolve, reject);
  }
}


APromise.all([new APromise((resolve, reject) => {
  setTimeout(() => {  resolve(100) }, 100)
}), new APromise((resolve, reject) => {
  setTimeout(()=> { resolve(200) }, 100)
})]).then(value => {
  console.log(value);
},(value) => {
  console.log(value);
})


