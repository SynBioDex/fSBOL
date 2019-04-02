[<JavaScript>]
module FSBOL.JsonSerializer

open FSBOL.Identifiers
open FSBOL.Sequence
open FSBOL.Attachment
open FSBOL.Collection
open FSBOL.MapsTo
open FSBOL.ComponentInstance
open FSBOL.Component
open FSBOL.Role
open FSBOL.Location
open FSBOL.Range
open FSBOL.Cut
open FSBOL.GenericLocation
open FSBOL.SequenceAnnotation
open FSBOL.SequenceConstraint
open FSBOL.ComponentDefinition
open FSBOL.VariableComponent
open FSBOL.CombinatorialDerivation
open FSBOL.Model
open FSBOL.Module
open FSBOL.FunctionalComponent
open FSBOL.Participation
open FSBOL.Interaction
open FSBOL.ModuleDefinition
open FSBOL.Implementation
open FSBOL.TopLevel
open FSBOL.SBOLDocument

open System.Xml

/// Identifiers in Record structure
type rIdentifiers = {
    uri:string;
    version:string option;
    name:string option;
    displayId:string option;
    persistentIdentity:string option;
    description:string option;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list
}



let serializeSBOLDocument (x:SBOLDocument) = 
    failwith "Not Implemented Yet"
