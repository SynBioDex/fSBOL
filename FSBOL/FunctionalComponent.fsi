[<JavaScript>]
module FSBOL.FunctionalComponent
open FSBOL.ComponentInstance
open FSBOL.MapsTo

type Direction = 
    | In
    | Out
    | InOut
    | None
    static member toURI:Direction -> string 
    static member fromURI:string -> Direction 

type FunctionalComponent =
    inherit ComponentInstance
    
    new : uri:string * name:string option * displayId:string option * version:string option * persistantId:string option * definition:string * access:string * mapsTos:MapsTo list * direction:Direction  -> FunctionalComponent

    member direction:Direction