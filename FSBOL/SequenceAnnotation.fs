[<JavaScript>]
module FSBOL.SequenceAnnotation

open FSBOL.Identifiers
open FSBOL.Location
open FSBOL.Range
open FSBOL.Component


type SequenceAnnotation(name:string, urlPrefix:string, displayId:string, version:string, componentObject:Component, locations:List<Location>) = 
    
    inherit Identifiers(name,urlPrefix,displayId,version)

    member x.componentObject = componentObject

    member x.locations = locations

