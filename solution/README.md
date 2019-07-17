# Solution explanation

You can see the full solution in [`solution.js`](./solution.js).

## Step-by-step

We are going to use recursion. It may not feel intuitive, but it's the best way for us to run each function after the last finishes.

It helps to think of recursive functions as a single slice in time—you're doing the same thing over an over (like in a loop).

### Step 1

We want to get the first task in the tasks array, since we need to run it to transform `arg`.

```js
function waterfall(arg, tasks, cb) {
  const currentTask = tasks[0];
  currentTask(arg, cb)
}
```

This will run just the first task and call the `cb` function with the result.

### Step 2

We need a way to get `currentTask` to queue up the next task, so it runs once `currentTask` is done. We'll do this with recursion.

```js
function waterfall(arg, tasks, cb) {
  const currentTask = tasks[0];
  const restOfTasks = tasks.slice(1);

  const nextAction = newArg => waterfall(nextArg, restOfTasks, cb);
  currentTask(arg, nextAction)
}
```

We define a `nextAction` function that is passed to the current task function as the callback. The current task run this function when it is finished, and it will pass in the transformed version of `arg` (e.g. `asyncAddOne` will call `nextAction` with `3 + 1` or `4`).

If we called `waterfall` with the same `tasks` array then `currentTask` would never change. Instead we slice off the first item (which we're using) and pass in the rest. That way each time we call `waterfall` the `currentTask` will be the next one in the array.

### Step 3

Don't run the code above, because it will loop forever. We haven't provided a way for our recursion to stop. Also when we do stop we need to call `cb` with the final result of all the tasks.

```js
function waterfall(arg, tasks, cb) {
  if (tasks.length === 0) {
    cb(arg)
    return;
  }

  const currentTask = tasks[0];
  const restOfTasks = tasks.slice(1);

  const nextAction = newArg => waterfall(nextArg, restOfTasks, cb);
  currentTask(arg, nextAction)
}
```

If the `tasks` array is empty that means we've run out of task functions to run. Once we hit this point we want to call `cb` with `arg` (which will be the final result) and return so we don't carry on to the rest of the function and keep recursing.

## Example walkthrough

Recursion can be confusing. Following the flow of function calls with a real example can be helpful. Let's take the test from the [readme](../README.md) and see how our solution works.

```js
waterfall(3, [asyncAddOne, asyncDouble, asyncTimesTen], result => {
  console.log(result);
})
```

### First loop

When `waterfall` is first called the `currentTask` is `asyncAddOne` and the `restOfTasks` is `[asyncDouble, asyncTimesTen]`. We don't hit the break condition since there are still tasks in our array, so we call the current task (`asyncAddOne`) and pass in our `arg` (3) and `nextAction` as the callback.

`asyncAddOne` waits 200ms then calls the callback with 4 (`arg + 1`). The callback is `nextAction`, which takes this `nextArg` (4) and calls `waterfall` again.

## Second loop

`waterfall` runs for a second time, but with slightly different arguments. This time `arg` is 4 (as `asyncAddOne` has already transformed it) and `tasks` is `[asyncDouble, asyncTimesTen]` as we sliced off the first task.

So in this iteration `currentTask` is `asyncDouble` and `restOfTasks` is `[asyncTimesTen]`. We still don't hit the break condition as we have one more task in the array.

We call `currentTask` (`asyncDouble` this time round) with 4 and our `nextAction` as the callback.

`asyncDouble` waits 200ms, then calls `nextAction` with 8 (`4 * 2`). `nextAction` calls `waterfall` _again_, like so: `waterfall(4, [asyncTimesTen], cb)`.

### Third loop

`waterfall` runs again exactly like the second loop. We still have a single task in the `tasks` array so we don't hit the break condition.

This time `currentTask` is `asyncTimesTen` and `restOfTasks` is `[]`. We call `asyncTimesTen` with `8` and `nextAction`.

`asyncTimesTen` waits 200ms then calls `nextAction` with 80 (`8 * 10`). `nextAction calls `waterfall` again, like so: `waterfall(80, [], cb)`.

### Fourth and final loop

`waterfall` runs again. This time our `tasks` array is empty, so we hit the break condition. We call `cb` (which has been passed along every loop without being used until now) with `arg` (which has the final value of 80). Then we return to stop the rest of the function executing.

### All function calls

Here's a visualisation of every function call and what each argument is at that point in time:

```js
waterfall(3, [asyncAddOne, asyncDouble, asyncTimesTen], cb)
  asyncAddOne(3)
  waterfall(4, [asyncDouble, asyncTimesTen], cb)
      asyncDouble(4)
      waterfall(8, [asyncTimesTen], cb)
          asyncDouble(8)
          waterfall(80, [], cb)
              cb(80)
                console.log(80)
```