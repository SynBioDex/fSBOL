[<JavaScript>]
module FSBOL.SequenceAnnotation

open FSBOL.Identifiers
open FSBOL.Location
open FSBOL.Range
open FSBOL.Component


type SequenceAnnotation(uri:string, name:string option, displayId:string option, version:string option, persistantId:string option, componentObject:Component, locations:List<Location>) = 
    
    inherit Identifiers(uri, name, displayId, version, persistantId)

    member x.componentObject = componentObject

    member x.locations = locations

