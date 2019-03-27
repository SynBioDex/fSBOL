[<JavaScript>]
module FSBOL.Participation

open FSBOL.Identifiers
open FSBOL.FunctionalComponent

type Participation(uri:string, name:string option, displayId:string option, version:string option, persistantId:string option, roles:List<string>, participant:FunctionalComponent ) =
    inherit Identifiers(uri, name, displayId, version, persistantId)

    member x.roles = roles

    member x.participant = participant

