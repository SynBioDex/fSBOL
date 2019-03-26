[<JavaScript>]
module FSBOL.FunctionalComponent
open FSBOL.Identifiers

type FunctionalComponent =
    inherit Identifiers
    
    new : name:string * urlPrefix:string * displayId:string * version:string * access:string * direction:string * definition:string -> FunctionalComponent

    member access:string

    member direction:string

    member definition:string
 