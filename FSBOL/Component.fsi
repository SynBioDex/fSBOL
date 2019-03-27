[<JavaScript>]
module FSBOL.Component
open FSBOL.Identifiers

type Component = 
    inherit Identifiers
    
    new : uri:string * name:string option * displayId:string option * version:string option * persistantId:string option * access:string * definition:string -> Component

    member access:string

    member definition:string

    