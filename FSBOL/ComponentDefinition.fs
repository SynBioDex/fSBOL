[<JavaScript>]
module FSBOL.ComponentDefinition

open FSBOL.Identifiers
open FSBOL.Component
open FSBOL.SequenceAnnotation
open FSBOL.SequenceConstraint
open FSBOL.Sequence
open FSBOL.Role
open FSBOL.Type

type ComponentDefinition (uri:string, name:string option, displayId:string option, version:string option, persistantId:string option, types:Type list, roles:Role list, sequences:Sequence list, components:Component list, sequenceAnnotations:SequenceAnnotation list, sequenceConstraints:SequenceConstraint list) = 
    inherit Identifiers(uri, name, displayId, version, persistantId)

    
   
    static member getConcatenatedSequence (cdList:ComponentDefinition list) = 
        let rec concatSeq (cdListL:ComponentDefinition list) = 
            match cdListL with
            | [] -> ""
            | cd :: remaining -> 
                let concaternatedSequence = cd.sequences |> List.fold (fun acc (seq:Sequence) -> (acc + seq.elements) ) ""
                concaternatedSequence + concatSeq(remaining)
        
        concatSeq cdList

    member x.roles = roles

    member x.types = types

    member x.sequences = sequences

    member x.sequenceAnnotations = sequenceAnnotations
    
    member x.sequenceConstraints = sequenceConstraints

    member x.components = components


    static member createHigherFunction(name:string,  urlPrefix:string, displayId:string,version:string, (types:string list), (roles: string list), components:ComponentDefinition list) =
        new ComponentDefinition("",None,None,None,None,[],[],[],[],[],[])
        (*let createComponentForUrlPrefix = ComponentDefinition.createComponent urlPrefix
        let componentList = components |> List.map createComponentForUrlPrefix
        let rangeList = ComponentDefinition.createRanges urlPrefix components
        let indexList = [1 .. components.Length]
        
        if rangeList.IsEmpty then
            ComponentDefinition(name,urlPrefix,displayId,version,types,roles,[],componentList,[])
        else
            let forSA = List.zip3 indexList componentList rangeList 
            let sequenceAnnotationForUrlPrefix = ComponentDefinition.createSequenceAnnotationFromSingleRange urlPrefix
            let sequenceAnnotations = forSA |> List.map sequenceAnnotationForUrlPrefix
            let seq = Sequence(name+"_sequence",urlPrefix,displayId+"_sequence",version,ComponentDefinition.getConcatenatedSequence(components),Encoding.DNA)
            ComponentDefinition(name,urlPrefix,displayId,version,types,roles,[seq],componentList,sequenceAnnotations)*)