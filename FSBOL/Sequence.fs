[<JavaScript>]
module FSBOL.Sequence

open FSBOL.Identifiers
open FSBOL.Terms
open FSBOL.QualifiedName


type Sequence(name:string, urlPrefix:string, displayId:string, version:string, sequence:string, encoding:string) = 
    
    inherit Identifiers(name, urlPrefix, displayId, version)

    member x.elements = sequence

    member x.encoding = encoding



