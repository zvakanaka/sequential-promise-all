/**
 * Call a promise n times, waiting for each promise to resolve before calling it again.
 * THANK YOU for idea: Jason Suttles https://stackoverflow.com/a/43377621/4151489
 * @param  {function} promise        function that returns a Promise (will be called n times after previous one finishes)
 * @param  {Array}    args           arguments to pass to promise
 * @param  {Number}   n              number of times to call promise
 * @param  {function} [updateCb]     callback that is called after every resolution (modify args here before next call if desired)
 * @return {Promise[]}               array of responses from all promises
 */
function sequentialPromiseAll(promise, args, n, updateCb) {
  return new Promise((resolve, reject) => {
    const responses = [];
    const arr = Array.from(Array(n), (d, i) => i); // create array filled with 0..n
    arr.reduce((p, item, i) => {
      return p.then((previousResponse) => {
        if (previousResponse) {
          responses.push(previousResponse);
          if (updateCb) updateCb(args, previousResponse, i);
        }
        return promise(...args);
      });
    }, Promise.resolve()).then((previousResponse) => {
      responses.push(previousResponse);
      resolve(responses);
    }).catch((err) => {
      console.warn(err, responses);
      reject(responses);
    });
  });
}

module.exports = sequentialPromiseAll;
