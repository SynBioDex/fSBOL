[<JavaScript>]
module FSBOL.JsonSerializer

open FSBOL.Sequence
open FSBOL.Component
open FSBOL.Range
open FSBOL.Location
open FSBOL.SequenceAnnotation
open FSBOL.ComponentDefinition
open FSBOL.FunctionalComponent
open FSBOL.Participation
open FSBOL.Interaction
open FSBOL.ModuleDefinition
open FSBOL.TopLevel
open FSBOL.SBOLDocument




let serializeSBOLDocument (x:SBOLDocument) = 
    (*let cds = x.collection 
              |> List.filter ( fun y -> (match y with | TopLevel.ComponentDefinition(_) -> true | _ -> false) ) 
              |> List.map(fun (TopLevel.ComponentDefinition(cd)) -> cd) 
              |> List.map (fun y -> serializeComponentDefinition y)
              |> Array.ofList
    let mds = x.collection 
              |> List.filter ( fun y -> (match y with | TopLevel.ModuleDefinition(_) -> true | _ -> false) ) 
              |> List.map(fun (TopLevel.ModuleDefinition(md)) -> md)
              |> List.map (fun y -> serializeModuleDefinition y)
              |> Array.ofList
    let seqs = x.collection 
               |> List.filter ( fun y -> (match y with | TopLevel.Sequence(_) -> true | _ -> false) ) 
               |> List.map(fun (TopLevel.Sequence(seq)) -> seq)
               |> List.map (fun y -> serializeSequence y)
               |> Array.ofList

    let sbol:jSBOLDocument = {componentDefinitions = cds;
                              moduleDefinitions = mds;
                              sequences = seqs
                             }
    
    sbol*)
    ()
