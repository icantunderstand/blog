function onionMiddleware(...middlewares) {
    return (next) => {
      let index = -1;
  
      async function dispatch(i) {
        if (i <= index) throw new Error('next() called multiple times');
        index = i;
        let fn = middlewares[i];
        if (i === middlewares.length) fn = next;
        if (!fn) return;
        return fn(() => dispatch(i + 1));
      }
  
      return dispatch(0);
    };
  }

  const middleware1 = (next) => {
    console.log('Middleware 1: Before');
     next();
    console.log('Middleware 1: After');
  };
  
  const middleware2 = (next) => {
    console.log('Middleware 2: Before');
     next();
    console.log('Middleware 2: After');
  };
  
  const middleware3 = (next) => {
    console.log('Middleware 3: Before');
    next();
    console.log('Middleware 3: After');
  };
  
  const composedMiddleware = onionMiddleware(middleware1, middleware2, middleware3);
  
  composedMiddleware();



  
