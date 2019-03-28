[<JavaScript>]
module FSBOL.ComponentDefinition
open FSBOL.TopLevel
open FSBOL.Component
open FSBOL.SequenceAnnotation
open FSBOL.SequenceConstraint
open FSBOL.Sequence
open FSBOL.Role
open FSBOL.ComponentDefinitionType

type ComponentDefinition = 
    inherit TopLevel

    new : uri:string * name:string option * displayId:string option * version:string option * persistantId:string option * attachments:string list* types:ComponentDefinitionType list * roles:Role list * sequences:List<Sequence> * components:List<Component> *  sequenceAnnotations:SequenceAnnotation list *  sequenceConstraints:SequenceConstraint list  -> ComponentDefinition

    static member createHigherFunction: name:string * urlPrefix:string * displayId:string * version:string  * types:List<string> * roles:List<string> * components:List<ComponentDefinition> -> ComponentDefinition

    member components:Component list

    member sequenceAnnotations:SequenceAnnotation list 

    member sequenceConstraints:SequenceConstraint list

    member sequences:Sequence list 

    member types:ComponentDefinitionType list

    member roles:Role list