[<JavaScript>]
module FSBOL.TopLevel

open ModuleDefinition
open ComponentDefinition
open FSBOL.Sequence

type TopLevel = 
    | ModuleDefinition of ModuleDefinition
    | ComponentDefinition of ComponentDefinition
    | Sequence of Sequence
