[<JavaScript>]
module FSBOL.Participation
open FSBOL.Identifiers
open FSBOL.FunctionalComponent


type Participation = 
    class 
    inherit Identifiers

    new : name:string * urlPrefix:string * displayId:string * version:string * roles:List<string> * participant:FunctionalComponent -> Participation

    member roles:List<string>

    member participant:FunctionalComponent

    end