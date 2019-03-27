[<JavaScript>]
module FSBOL.SequenceAnnotation
open FSBOL.Identifiers
open FSBOL.Location
open FSBOL.Component

type SequenceAnnotation = 
    inherit Identifiers

    new : uri:string * name:string option * displayId:string option * version:string option * persistantId:string option * componentObj:Component * locations:List<Location> * roles:string list-> SequenceAnnotation

    (* *)
    member locations:Location list

    (* *)
    member roles:string list
    
    (* *)
    member componentObj:Component