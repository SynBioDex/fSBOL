[<JavaScript>]
module FSBOL.Interaction

open FSBOL.Identifiers
open FSBOL.Participation
open FSBOL.FunctionalComponent

type Interaction = 
    inherit Identifiers

    new : name:string * urlPrefix:string * displayId:string * version:string * types:List<string> * participations:List<Participation> -> Interaction

    member types:List<string> 

    member participations:List<Participation>
