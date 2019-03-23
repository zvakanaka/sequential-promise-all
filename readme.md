Modify inputs of next call to promise based on output of previous
## Example
### Progress bar
```js
const sequentialPromiseAll = require('sequential-promise-all');
const barChart = require('bar-charts');
const timeout = ms => new Promise(res => setTimeout(() => res(ms), ms));

(async () => {
  const n = 100; // number of times to call promise
  await sequentialPromiseAll(
    timeout, // function that returns a promise (will be called n times after previous one resolves)
    [1000], // arguments array provided to promise (timeout)
    n, // number of times to call promise
    ( // callback - invoked after each promise resolution
    argsHandle, // modify this in the callback to change the arguments at the next invocation
    previousResponse, // what is resolved from promise (timeout)
    i) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    const count = (i + 1) / n * 100;
    const outputStr = barChart([{label: `${i + 1}/${n}`, count}], {percentages: true});
    process.stdout.write(outputStr); // print the bar
    argsHandle[0] = Math.max(previousResponse - 40, 10); // speed up over time
  });
})();
```
