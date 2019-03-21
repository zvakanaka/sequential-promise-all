Modify inputs of next call to promise based on output of previous
## Example
### Progress bar
```js
const sequentialPromiseAll = require('sequential-promise-all');
const barChart = require('bar-chart');
const timeout = (ms) => new Promise((res) => setTimeout(res, ms));

(async () => {
  const arr = Array.from(Array(100), (d, i) => i); // fill array with n values 0..100
  await sequentialPromiseAll(timeout, [10], arr.length, (_args, _previousResponse, i) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    const count = (i + 1) / arr.length * 100;
    const output = barChart([{label: `${i + 1}/${arr.length}`, count}], {percentages: true});
    process.stdout.write(output); // end the line
  });
})();
```
