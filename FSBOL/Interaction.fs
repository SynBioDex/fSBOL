[<JavaScript>]
module FSBOL.Interaction

open FSBOL.Identifiers
open FSBOL.Participation
open FSBOL.FunctionalComponent

type Interaction(name:string, urlPrefix:string, displayId:string, version:string, types:List<string>, participations:List<Participation>) =
    inherit Identifiers(name,urlPrefix,displayId,version)

    member x.types = types

    member x.participations = participations
