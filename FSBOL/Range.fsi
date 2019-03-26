[<JavaScript>]
module FSBOL.Range
open FSBOL.Identifiers

type Range =
    inherit Identifiers

    new : name:string * urlPrefix:string * displayId:string * version:string * startIndex:int * endIndex:int * orientation:string -> Range

    member startIndex:int

    member endIndex:int

    member orientation:string

    