[<JavaScript>]
module FSBOL.SBOLDocument

open FSBOL.ComponentDefinition
open FSBOL.ModuleDefinition
open FSBOL.Sequence
open FSBOL.TopLevel


type SBOLDocument (collection:List<TopLevel>) = 


    member x.collection =
        let seqs = collection |> List.filter (fun coll -> 
            match coll with 
            | Sequence(seq:Sequence) -> true
            | _ -> false)
        let seqMap = ((seqs |> List.map (fun (Sequence(seq:Sequence)) -> seq)) 
                     |> List.map (fun seq -> (seq.uri,seq))) 
                     |> Map.ofList
        let cds = collection |> List.filter (fun coll -> 
            match coll with 
            | ComponentDefinition(cd:ComponentDefinition) -> true
            | _ -> false)
        let seqsInCDs = (cds |> List.map (fun (ComponentDefinition(cd:ComponentDefinition)) -> cd)) 
                     |> List.map (fun cdVal -> cdVal.sequences)
                     |> List.reduce (fun a b -> a@b)
                     |> List.map (fun seq -> (seq.uri,seq))
                     |> Map.ofList
        
        let topLevelSeqs = (seqsInCDs 
                            |> Map.fold (fun (acc:Map<string,Sequence>) (k:string) (v:Sequence) -> acc.Add(k,v)) seqMap 
                            |> List.ofSeq 
                            |> List.map (fun x -> Sequence(x.Value)))
                            

        let allOtherCollections = collection |> List.filter (fun coll -> 
            match coll with 
            | Sequence(seq:Sequence) -> false
            | _ -> true)
        topLevelSeqs@allOtherCollections


