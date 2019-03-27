[<JavaScript>]
module FSBOL.ModuleDefinition
open FSBOL.Identifiers
open FSBOL.FunctionalComponent
open FSBOL.Interaction

type ModuleDefinition = 
    inherit Identifiers
    new: uri:string * name:string option * displayId:string option * version:string option * persistantId:string option * functionalComponents:List<FunctionalComponent> * interactions:List<Interaction> -> ModuleDefinition 

    member functionalComponents:List<FunctionalComponent>

    member interactions:List<Interaction>
