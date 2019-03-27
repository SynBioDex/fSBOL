[<JavaScript>]
module FSBOL.ModuleDefinition

open FSBOL.Identifiers
open FSBOL.FunctionalComponent
open FSBOL.Interaction

type ModuleDefinition(uri:string, name:string option, displayId:string option, version:string option, persistantId:string option, functionalComponents:List<FunctionalComponent>, interactions:List<Interaction>) =
    inherit Identifiers(uri, name, displayId, version, persistantId)

    member x.functionalComponents = functionalComponents

    member x.interactions = interactions



