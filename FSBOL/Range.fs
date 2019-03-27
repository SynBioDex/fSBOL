[<JavaScript>]
module FSBOL.Range
open FSBOL.Identifiers
open FSBOL.QualifiedName
open FSBOL.Terms

type Range(uri:string, name:string option, displayId:string option, version:string option, persistantId:string option, startIndex:int, endIndex:int, orientation:string) = 
    
    inherit Identifiers(uri, name, displayId, version, persistantId)

    member x.startIndex = startIndex

    member x.endIndex = endIndex

    member x.orientation = orientation


