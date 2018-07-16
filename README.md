# Morning challenge: implement a waterfall function

This workshop has been inspired by [Eoin McCarthy](https://github.com/des-des) and his legendary waterfall function workshop given to FAC9 by [Besart Hoxhaj](https://github.com/besarthoxhaj).

You may have seen the compose function before, it allows you to take some functions and compose them into a single function!
What do you do if the functions are asynchronous? You implement the waterfall function.

Like the compose function, the waterfall function runs an array of functions in series, each passing their result to the next function in the array. Crucially, the waterfall function will not invoke the next function in the array until the current function being run has been returned.

### Waterfall function:

The waterfall function takes three arguments:

1. An initial argument, this is passed into the first async function in the waterfall.

2. The second argument is an array of functions, each function takes two arguments. The first argument it uses to find a result and the second is a callback function.

3. A final callback is given as the third argument. This is called after the waterfall has invoked all of the functions in the array.

### Workshop:

1. Copy the code below and paste it into [Repl](https://repl.it/languages/javascript).

2. Create the waterfall function, pass the tests.

3. For bonus points, create some additional tests for the waterfall function.

```js
function asyncAddOne(x, callBack) {
  setTimeout(function() {
    return callBack(x + 1);
  }, 200);
}

function asyncDouble(x, callBack) {
  setTimeout(function() {
    return callBack(x * 2);
  }, 200);
}

function asyncTimesTen(x, callBack) {
  setTimeout(function() {
    return callBack(x * 10);
  }, 200);
}

// Create this function!
function waterfall(arg, tasks, cb) {
  cb(null);
}

waterfall(3, [asyncAddOne, asyncDouble, asyncTimesTen], function(result) {
  console.log('Test 1');
  if (result !== 80) {
    console.log('test failed, expected 80 but got', result);
  } else {
    console.log('Test 1 passed!');
  }
});
```

Waterfall will apply the previous function's result to the next, for example:

`waterfall(argument, [fn1, fn2, fn3,...], cb)` will return :

`cb(fn_n(fn_n-1(...fn3(fn2(fn1(argument))))))`

Since the input functions are async what waterfall is trying to abstract is the
following:

```js
function callback(result) {
  console.log(result);
}

asyncAddOne(3, function(res) {
  asyncDouble(res, function(res2) {
    asyncTimesTen(res2, callback);
  });
});
```

The waterfall function, abstracts all these function calls and hides the cb hell that you see above.

### Glossary:

* [Compose function](http://blakeembrey.com/articles/2014/01/compose-functions-javascript/)
* [Synchronous vs. Asynchronous](http://rowanmanning.com/posts/javascript-for-beginners-async/)
* [setTimeout()](https://www.w3schools.com/jsref/met_win_settimeout.asp)
