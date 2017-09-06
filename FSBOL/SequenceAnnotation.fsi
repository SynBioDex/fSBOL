[<JavaScript>]
module FSBOL.SequenceAnnotation
open FSBOL.Identifiers
open FSBOL.Location
open FSBOL.Component

type SequenceAnnotation = 
    class
    inherit Identifiers

    new :  name:string * urlPrefix:string * displayId:string * version:string * componentObject:Component * locations:List<Location> -> SequenceAnnotation

    member locations:List<Location>

    member componentObject:Component

    end