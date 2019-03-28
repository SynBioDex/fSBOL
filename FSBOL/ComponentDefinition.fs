[<JavaScript>]
module FSBOL.ComponentDefinition
open FSBOL.TopLevel
open FSBOL.Component
open FSBOL.SequenceAnnotation
open FSBOL.SequenceConstraint
open FSBOL.Sequence
open FSBOL.Role
open FSBOL.ComponentDefinitionType

type ComponentDefinition (uri:string, name:string option, displayId:string option, version:string option, persistantId:string option, attachments:string list,types:ComponentDefinitionType list, roles:Role list, sequences:Sequence list, components:Component list, sequenceAnnotations:SequenceAnnotation list, sequenceConstraints:SequenceConstraint list) = 
    inherit TopLevel(uri, name, displayId, version, persistantId,attachments)

    member x.roles = roles

    member x.types = types

    member x.sequences = sequences

    member x.sequenceAnnotations = sequenceAnnotations
    
    member x.sequenceConstraints = sequenceConstraints

    member x.components = components

    

    