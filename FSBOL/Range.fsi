[<JavaScript>]
module FSBOL.Range
open FSBOL.Identifiers

type Range =
    inherit Identifiers

    new : uri:string * name:string option * displayId:string option * version:string option * persistantId:string option * startIndex:int * endIndex:int * orientation:string -> Range

    member startIndex:int

    member endIndex:int

    member orientation:string

    