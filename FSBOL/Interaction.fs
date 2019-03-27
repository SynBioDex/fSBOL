[<JavaScript>]
module FSBOL.Interaction

open FSBOL.Identifiers
open FSBOL.Participation
open FSBOL.FunctionalComponent

type Interaction(uri:string, name:string option, displayId:string option, version:string option, persistantId:string option, types:List<string>, participations:List<Participation>) =
    inherit Identifiers(uri, name, displayId, version, persistantId)

    member x.types = types

    member x.participations = participations
