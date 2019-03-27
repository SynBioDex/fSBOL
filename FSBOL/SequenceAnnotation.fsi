[<JavaScript>]
module FSBOL.SequenceAnnotation
open FSBOL.Identifiers
open FSBOL.Location
open FSBOL.Component

type SequenceAnnotation = 
    inherit Identifiers

    new : uri:string * name:string option * displayId:string option * version:string option * persistantId:string option * componentObject:Component * locations:List<Location> -> SequenceAnnotation

    member locations:List<Location>

    member componentObject:Component