[<JavaScript>]
module FSBOL.Range

open FSBOL.Location


type Range(uri:string, name:string option, displayId:string option, version:string option, persistantId:string option, orientation:Orientation, startIndex:int, endIndex:int) = 
    
    inherit Location(uri, name, displayId, version, persistantId,orientation)

    member x.startIndex = startIndex

    member x.endIndex = endIndex


