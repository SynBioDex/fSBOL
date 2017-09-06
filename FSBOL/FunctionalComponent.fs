[<JavaScript>]
module FSBOL.FunctionalComponent

open FSBOL.Identifiers

type FunctionalComponent(name:string, urlPrefix:string, displayId:string, version:string, access:string,direction:string, definition:string) = 
    inherit Identifiers(name,urlPrefix,displayId,version)

    member x.access = access

    member x.definition = definition

    member x.direction = direction


