[<JavaScript>]
module FSBOL.FunctionalComponent

open FSBOL.Identifiers

type FunctionalComponent(uri:string, name:string option, displayId:string option, version:string option, persistantId:string option, access:string,direction:string, definition:string) = 
    inherit Identifiers(uri, name, displayId, version, persistantId)

    member x.access = access

    member x.definition = definition

    member x.direction = direction


