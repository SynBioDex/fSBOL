[<JavaScript>]
module FSBOL.Identifiers


open System.Collections.Generic

[<AbstractClass>]
type Identifiers(name:string, urlPrefix:string, displayId:string, version:string) = 

    (* Version of the object*)
    member i.version = version
    
    (* Name *)
    member i.name = name

    (* Human readable id of the object*)
    member i.displayId = displayId

    (* Indentity shared by multiple versions of the same object *)
    member i.persistentIdentity = urlPrefix + "/" + displayId

    (* Unique URI that identifies the object*)
    member i.uri = i.persistentIdentity + "/" + version

    member  val description = "" with get,set
      
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

    member x.getUriAnnotations = 
        x.uriAnnotations |> List.ofSeq |> List.map(fun y -> (y.Key,y.Value))
    
    member x.getStringAnnotations = 
        x.stringAnnotations |> List.ofSeq |> List.map(fun y -> (y.Key,y.Value))

