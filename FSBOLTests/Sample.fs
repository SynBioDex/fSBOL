module FSBOLTests.Tests

open Expecto

[<Tests>]
let tests =
  testList "samples" [
    testCase "firstTest" <| fun _ ->
      let check = true
      Expect.isTrue check "Well, this was unexpected."
  ]
