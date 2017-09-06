[<JavaScript>]
module FSBOL.Participation

open FSBOL.Identifiers
open FSBOL.FunctionalComponent

type Participation(name:string, urlPrefix:string, displayId:string, version:string, roles:List<string>, participant:FunctionalComponent ) =
    inherit Identifiers(name,urlPrefix,displayId,version)

    member x.roles = roles

    member x.participant = participant

