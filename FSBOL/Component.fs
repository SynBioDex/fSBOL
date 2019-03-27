[<JavaScript>]
module FSBOL.Component

open FSBOL.Identifiers

type Component(uri:string, name:string option, displayId:string option, version:string option, persistantId:string option, access:string, definition:string) = 
    
    inherit Identifiers(uri, name, displayId, version, persistantId)

    member x.access = access

    member x.definition = definition

