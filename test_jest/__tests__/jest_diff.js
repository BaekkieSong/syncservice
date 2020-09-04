const diff = require("jest-diff").default;

const a = { a: { b: { c: 5 } } };
const b = { a: { b: { c: 6 } } };

const result = diff(a, b);

// print diff
test("jest-diff test", () => {
  //console.log(result.match(/no visual difference/) == null);
  // diff가 있으면 match결과는 null
  expect(result.match(/no visual difference/)).toBeNull();
  expect(a.a.b.c).not.toBe(b.a.b.c);
});

// const { parseWithComments } = require("jest-docblock");
// const code = `
// /**
//  * This is a sample
//  *
//  * @flow
//  */
//  console.log('Hello World!');
// `;
// const parsed = parseWithComments(code);
// // prints an object with two attributes: comments and pragmas.
// console.log(parsed);

// const { getChangedFilesForRoots } = require("jest-changed-files");

// // print the set of modified files since last commit in the current repo
// getChangedFilesForRoots(["./"], {
//   lastCommit: true,
// }).then((result) => console.log(result.changedFiles));
