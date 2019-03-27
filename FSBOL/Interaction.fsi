[<JavaScript>]
module FSBOL.Interaction

open FSBOL.Identifiers
open FSBOL.Participation
open FSBOL.FunctionalComponent

type Interaction = 
    inherit Identifiers

    new : uri:string * name:string option * displayId:string option * version:string option * persistantId:string option * types:List<string> * participations:List<Participation> -> Interaction

    member types:List<string> 

    member participations:List<Participation>
