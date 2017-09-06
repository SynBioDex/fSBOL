[<JavaScript>]
module FSBOL.Identifiers


open System.Collections.Generic

[<AbstractClass>]
type Identifiers(name:string, urlPrefix:string, displayId:string, version:string) = 

    let _persistentIdentity = urlPrefix + "/" + displayId 
    let _uri = _persistentIdentity + "/" + version
    
    (* Version of the object*)
    member val version = version
    

    (* Name *)
    member val name = name

    (* Human readable id of the obejct *)
    member val displayId = displayId

    (* Indentity shared by multiple versions of the same object *)
    member val persistentIdentity =_persistentIdentity

    (* Unique URI that identifies the object*)
    member val uri = _uri

    member val description = "" with get,set

    member private x.uriAnnotations = new Dictionary<string,string>()

    member private x.stringAnnotations = new Dictionary<string,string>()

    member x.addUriAnnotation(term:string, uri:string) = 
        x.uriAnnotations.Add(term,uri)
    
    member x.addStringAnnotation(term:string, str:string) =
        x.stringAnnotations.Add(term, str)

    member x.getUriAnnotation (key:string) = 
        if x.uriAnnotations.ContainsKey(key) then
            Some(x.uriAnnotations.Item(key))
        else 
            None

    member x.getStringAnnotation (key:string) = 
        if x.stringAnnotations.ContainsKey(key) then
            Some(x.stringAnnotations.Item(key))
        else 
            None

    member x.getUriAnnotations() = 
        x.uriAnnotations |> List.ofSeq |> List.map(fun y -> (y.Key,y.Value))
    
    member x.getStringAnnotations() = 
        x.stringAnnotations |> List.ofSeq |> List.map(fun y -> (y.Key,y.Value))

