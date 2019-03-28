[<JavaScript>]
module FSBOL.TopLevel

open FSBOL.ModuleDefinition
open FSBOL.ComponentDefinition
open FSBOL.Sequence
open FSBOL.Model

type TopLevel = 
    | ModuleDefinition of ModuleDefinition
    | ComponentDefinition of ComponentDefinition
    | Sequence of Sequence
    | Model of Model
