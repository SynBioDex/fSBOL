[<JavaScript>]
module FSBOL.ComponentDefinition

open FSBOL.Identifiers
open FSBOL.Component
open FSBOL.SequenceAnnotation
open FSBOL.Sequence
open FSBOL.Range

open System.IO
open System.Text
open System.Xml

type ComponentDefinition (name:string, urlPrefix:string, displayId:string, version:string, types:List<string>, roles:List<string>, sequences:List<Sequence>, components:List<Component>, sequenceAnnotations:List<SequenceAnnotation>) = 
    inherit Identifiers(name,urlPrefix,displayId,version)

    
            
    static member createComponent (urlPrefix:string) =
        let innerFn (cd:ComponentDefinition)=
            Component(cd.name+"_component",urlPrefix,cd.displayId+"_component",cd.version,Terms.privateAccess,cd.uri)
        innerFn
    
    static member createSequenceAnnotationFromSingleRange (urlPrefix:string) = 
        let innerFn ((index:int),(comp:Component),(range:Range)) = 
            SequenceAnnotation("annotation" + index.ToString(),urlPrefix,"annotation" + index.ToString(),range.version,comp,[Location.Range(range)])
        innerFn

    static member createRanges (urlPrefix:string) (cdList:ComponentDefinition list)= 
        let mutable index = 1;
        let mutable start:int = 1;
        let ranges:System.Collections.Generic.List<Range> = new System.Collections.Generic.List<Range>() 
        for (cd:ComponentDefinition) in cdList do
            for (seq:Sequence) in cd.sequences do
                ranges.Add(Range("range",urlPrefix + "annotation" + index.ToString() + "/range",cd.displayId+"_range",cd.version,start,start + seq.elements.Length-1,Terms.inlineOrientation))
                start <- start + seq.elements.Length
                index <- index+1

        let rangeList = ranges.ToArray() |> Array.toList
        rangeList

    
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

    member x.components = components


    static member createHigherFunction(name:string,  urlPrefix:string, displayId:string,version:string, (types:string list), (roles: string list), components:ComponentDefinition list) =
        let createComponentForUrlPrefix = ComponentDefinition.createComponent urlPrefix
        let componentList = components |> List.map createComponentForUrlPrefix
        let rangeList = ComponentDefinition.createRanges urlPrefix components
        let indexList = [1 .. components.Length]

        let forSA = List.zip3 indexList componentList rangeList 
        let sequenceAnnotationForUrlPrefix = ComponentDefinition.createSequenceAnnotationFromSingleRange urlPrefix
        let sequenceAnnotations = forSA |> List.map sequenceAnnotationForUrlPrefix
        let seq = Sequence(name+"_sequence",urlPrefix,displayId+"_sequence",version,ComponentDefinition.getConcatenatedSequence(components),Terms.dnasequence)
        ComponentDefinition(name,urlPrefix,displayId,version,types,roles,[seq],componentList,sequenceAnnotations)