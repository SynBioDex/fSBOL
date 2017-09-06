[<JavaScript>]
module FSBOL.Range
open FSBOL.Identifiers
open FSBOL.QualifiedName
open FSBOL.Terms

type Range(name:string, urlPrefix:string, displayId:string, version:string, startIndex:int, endIndex:int, orientation:string) = 
    
    inherit Identifiers(name,urlPrefix,displayId,version)

    member x.startIndex = startIndex

    member x.endIndex = endIndex

    member x.orientation = orientation


