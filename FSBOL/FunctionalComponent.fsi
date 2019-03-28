[<JavaScript>]
module FSBOL.FunctionalComponent
open FSBOL.ComponentInstance
open FSBOL.MapsTo

type FunctionalComponent =
    inherit ComponentInstance
    
    new : uri:string * name:string option * displayId:string option * version:string option * persistantId:string option * definition:string * access:string * mapsTos:MapsTo list * direction:string  -> FunctionalComponent

    member direction:string