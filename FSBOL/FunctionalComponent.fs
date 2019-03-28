[<JavaScript>]
module FSBOL.FunctionalComponent
open FSBOL.ComponentInstance
open FSBOL.MapsTo

type FunctionalComponent(uri:string, name:string option, displayId:string option, version:string option, persistantId:string option, definition:string, access:string, mapsTos:MapsTo list,direction:string) = 
    inherit ComponentInstance(uri, name, displayId, version, persistantId,definition,access,mapsTos)

    member x.direction = direction


