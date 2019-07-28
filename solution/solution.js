function waterfall(arg, tasks, cb) {
  // waterfall will call itself (recursion)
  // we need a condition so we don't keep recursing forever
  // will stop once we run out of tasks
  if (tasks.length === 0) {
    return cb(arg);
  }

  // the function we're going to call in this iteration of the recursion
  const currentTask = tasks[0];

  // array with all the tasks except the current one
  const restOfTasks = tasks.slice(1);

  // the function we want to run after the current task completes
  // it takes the updated version of the arg (after currentTask has been run)
  // it calls waterfall again (recursively)
  // each time it recurses the tasks array gets 1 shorter
  // eventually it'll run out of tasks and call the cb with the result (see line 6)
  const nextAction = nextArg => waterfall(nextArg, restOfTasks, cb);

  // call the current task, which will transform the arg, then run nextAction
  currentTask(arg, nextAction);
}
