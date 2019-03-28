[<JavaScript>]
module FSBOL.ComponentInstance
open FSBOL.Identifiers
open FSBOL.MapsTo

[<AbstractClass>]
type ComponentInstance = 
    inherit Identifiers

    new: uri:string * name:string option * displayId:string option * version:string option * persistantId:string option * definition:string * access:string * mapsTos:MapsTo list -> ComponentInstance
    
    member definition:string
    
    member access:string

    member mapsTos:MapsTo list
