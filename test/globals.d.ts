import type {
  Config,
  EmptyObject,
  ShavenArray,
  ShavenInput,
  ShavenObject,
} from '../source/library/types.ts'

declare global {
  // The shared tests run against both the server and the browser build
  // and inspect the results dynamically, therefore the results are untyped.
  // The inputs are typed to check the public input types.
  interface TestShaven {
    (arrayOrObject: []): EmptyObject
    // oxlint-disable-next-line typescript/no-explicit-any
    (arrayOrObject: ShavenInput<Element, any>): ShavenObject<any, any>
    setDefaults (object: Partial<Config>): TestShaven
  }

  // oxlint-disable-next-line typescript/no-explicit-any
  type TestArray = ShavenArray<Element, any>

  // Set by `test/node.ts` or `test/jsdom.ts` before the shared tests run
  var shaven: TestShaven
}
