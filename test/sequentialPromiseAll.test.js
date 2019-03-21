const {expect, it, describe} = require('./expect');
const sequentialPromiseAll = require('../index');

describe('the sequentialPromiseAll function', async () => {
  const WAIT_MS = 250;

  const stats = [];
  function getPage(whatever, send) {
    return new Promise((resolve, reject) => {
      console.log(Date.now())
      stats.push(Date.now());
      setTimeout(() => {
        if (send.throwErr === send.nextPageToken) reject('this is thrown on purpose');
        const thing = {...send, nextPageToken: send.nextPageToken + 1};
        resolve(thing);
      }, WAIT_MS);
    });
  }
  const responses = await sequentialPromiseAll(
    getPage,                  // func
    [{}, {nextPageToken: 0}], // args
    5,                        // num
    (args, lastResponse) => { // updateCb
      if (args[1]) args[1].nextPageToken = lastResponse.nextPageToken;
    }
  );
  it('should wait for the prior to finish before calling the next function', () => {
    responses.forEach((response, i) => {
      if (i > 0) expect(stats[i]).to.be.at.least(stats[i - 1] + WAIT_MS);
    });
  });
  it('should call the provided function 5 times', () => {
    expect(responses.length).to.equal(5);
  });

  it('should fail properly', async () => {
    const responsesWithFourthFailing = await sequentialPromiseAll(
      getPage,                  // func
      [{}, {nextPageToken: 0, throwErr: 3}], // args
      5,                        // num
      (args, lastResponse) => { // updateCb
        if (args[1]) args[1].nextPageToken = lastResponse.nextPageToken;
      }
    ).catch(e => {
      expect(e.length).to.equal(3);
      e.forEach((response, i) => {
        if (i > responses.length - 1) expect(stats[i + responses.length - 1]).to.be.at.least(stats[responses.length - 1 + i - 1] + WAIT_MS);
      });
    });
    console.log(responsesWithFourthFailing);
  });
});
