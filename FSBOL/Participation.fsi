[<JavaScript>]
module FSBOL.Participation
open FSBOL.Identifiers
open FSBOL.FunctionalComponent


type Participation = 
    inherit Identifiers

    new : uri:string * name:string option * displayId:string option * version:string option * persistantId:string option * roles:List<string> * participant:FunctionalComponent -> Participation

    member roles:List<string>

    member participant:FunctionalComponent
