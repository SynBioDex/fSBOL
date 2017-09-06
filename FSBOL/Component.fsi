[<JavaScript>]
module FSBOL.Component
open FSBOL.Identifiers

type Component = 
    class
    inherit Identifiers
    
    new : name:string * urlPrefix:string * displayId:string * version:string * access:string * definition:string -> Component

    member access:string

    member definition:string

    end
