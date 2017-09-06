[<JavaScript>]
module FSBOL.ModuleDefinition
open FSBOL.Identifiers
open FSBOL.FunctionalComponent
open FSBOL.Interaction

type ModuleDefinition = 
    class 
    inherit Identifiers
    new: name:string * urlPrefix:string * displayId:string * version:string * functionalComponents:List<FunctionalComponent> * interactions:List<Interaction> -> ModuleDefinition 

    member functionalComponents:List<FunctionalComponent>

    member interactions:List<Interaction>


    end