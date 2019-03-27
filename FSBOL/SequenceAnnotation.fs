﻿[<JavaScript>]
module FSBOL.SequenceAnnotation

open FSBOL.Identifiers
open FSBOL.Location
open FSBOL.Range
open FSBOL.Component


type SequenceAnnotation(uri:string, name:string option, displayId:string option, version:string option, persistantId:string option, componentObj:Component, locations:List<Location>, roles:string list) = 
    
    inherit Identifiers(uri, name, displayId, version, persistantId)

    member x.componentObj = componentObj

    member x.locations = locations

    member x.roles = roles

