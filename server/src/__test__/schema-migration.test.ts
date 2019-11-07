import Schema from '../lib/model/db/schema';
import ServerHarness from './lib/server-harness';

let serverHarness: ServerHarness;
let schema: Schema;

// Jest issue, afterAll and beforeAll run anyway https://github.com/facebook/jest/issues/6166
// beforeAll(async () => {
//   serverHarness = new ServerHarness();
//   schema = new Schema(serverHarness.mysql);
//   await serverHarness.connectToDatabase();
// });

beforeEach(async () => {
  await serverHarness.resetDatabase();
});

// Jest issue, afterAll and beforeAll run anyway https://github.com/facebook/jest/issues/6166
// afterAll(() => {
//   if (serverHarness) {
//     serverHarness.done();
//   }
// });

test.skip('migrations run without errors', () => {
  return expect(schema.upgrade()).resolves.toBeUndefined();
});
