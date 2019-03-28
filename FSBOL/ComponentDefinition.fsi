[<JavaScript>]
module FSBOL.ComponentDefinition
open FSBOL.Identifiers
open FSBOL.Component
open FSBOL.SequenceAnnotation
open FSBOL.SequenceConstraint
open FSBOL.Sequence
open FSBOL.Role
open FSBOL.Type

type ComponentDefinition = 
    inherit Identifiers

    new : uri:string * name:string option * displayId:string option * version:string option * persistantId:string option * types:Type list * roles:Role list * sequences:List<Sequence> * components:List<Component> *  sequenceAnnotations:SequenceAnnotation list *  sequenceConstraints:SequenceConstraint list  -> ComponentDefinition

    static member createHigherFunction: name:string * urlPrefix:string * displayId:string * version:string  * types:List<string> * roles:List<string> * components:List<ComponentDefinition> -> ComponentDefinition

    member components:Component list

    member sequenceAnnotations:SequenceAnnotation list 

    member sequenceConstraints:SequenceConstraint list

    member sequences:Sequence list 

    member types:Type list

    member roles:Role list