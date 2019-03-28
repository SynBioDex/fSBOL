[<JavaScript>]
module FSBOL.ComponentInstance
open FSBOL.Identifiers
open FSBOL.MapsTo

[<AbstractClass>]
type ComponentInstance(uri:string, name:string option, displayId:string option, version:string option, persistantId:string option,definition:string, access:string, mapsTos:MapsTo list) =
    inherit Identifiers(uri,name,displayId,version,persistantId)

    member ci.definition = definition

    member ci.access = access

    member ci.mapsTos = mapsTos

