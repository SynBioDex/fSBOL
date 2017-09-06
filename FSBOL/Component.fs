[<JavaScript>]
module FSBOL.Component

open FSBOL.Identifiers

type Component(name:string, urlPrefix:string, displayId:string, version:string, access:string, definition:string) = 
    
    inherit Identifiers(name,urlPrefix,displayId,version)

    member x.access = access

    member x.definition = definition

