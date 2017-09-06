[<JavaScript>]
module FSBOL.Sequence
open FSBOL.Identifiers

type Sequence = 
    class
    inherit Identifiers

    new : name:string * urlPrefix:string * displayId:string * version:string * sequence:string * encoding:string -> Sequence

    (**)
    member elements:string

    (**) 
    member encoding:string

    end