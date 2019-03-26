[<JavaScript>]
module FSBOL.ComponentDefinition
open FSBOL.Identifiers
open FSBOL.Component
open FSBOL.SequenceAnnotation
open FSBOL.Sequence

open System.Xml

type ComponentDefinition = 
    inherit Identifiers

    new : name:string * urlPrefix:string * displayId:string * version:string * types:List<string> * roles:List<string> * sequences:List<Sequence> * components:List<Component> *  sequenceAnnotations:List<SequenceAnnotation>  -> ComponentDefinition

    static member createHigherFunction: name:string * urlPrefix:string * displayId:string * version:string  * types:List<string> * roles:List<string> * components:List<ComponentDefinition> -> ComponentDefinition

    member components:List<Component>

    member sequenceAnnotations:List<SequenceAnnotation> 

    member sequences:List<Sequence> 

    member types:List<string>

    member roles:List<string>