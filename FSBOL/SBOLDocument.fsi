[<JavaScript>]
module FSBOL.SBOLDocument


open FSBOL.ComponentDefinition
open FSBOL.ModuleDefinition
open FSBOL.TopLevel

type SBOLDocument = 
    new: collection:List<TopLevel> -> SBOLDocument

    member collection:List<TopLevel> 


