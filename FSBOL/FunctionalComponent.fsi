[<JavaScript>]
module FSBOL.FunctionalComponent
open FSBOL.Identifiers

type FunctionalComponent =
    inherit Identifiers
    
    new : uri:string * name:string option * displayId:string option * version:string option * persistantId:string option * access:string * direction:string * definition:string -> FunctionalComponent

    member access:string

    member direction:string

    member definition:string
 