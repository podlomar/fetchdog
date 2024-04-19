import nock from 'nock';
import { expect } from 'chai';
import { describe, it, before } from 'mocha';
import { fetchdog, r } from '../dist/index.js';

describe('fetchdog', () => {
  before(() => {
    nock('http://etchdog.test')
      .get('/')
      .reply(200, 'payload');
  });

  it('should fetch a response without payload', async () => {
    const response = await fetchdog('http://fetchdog.test')
      .receive(r.none)
      .fetch();
    expect(response.result).to.equal('payload');
    if (response.result === 'payload') {
      expect(response.response.status).to.equal(200);
      expect(response.payload).to.equal(undefined);
    }
  });
});



