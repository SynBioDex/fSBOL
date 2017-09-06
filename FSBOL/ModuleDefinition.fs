[<JavaScript>]
module FSBOL.ModuleDefinition

open FSBOL.Identifiers
open FSBOL.FunctionalComponent
open FSBOL.Interaction

type ModuleDefinition(name:string, urlPrefix:string, displayId:string, version:string, functionalComponents:List<FunctionalComponent>, interactions:List<Interaction>) =
    inherit Identifiers(name,urlPrefix,displayId,version)

    member x.functionalComponents = functionalComponents

    member x.interactions = interactions



