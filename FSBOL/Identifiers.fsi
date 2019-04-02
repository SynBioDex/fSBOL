[<JavaScript>]

/// Basic Indentifiers in SBOL
module FSBOL.Identifiers

open System.Collections.Generic

[<AbstractClass>]
type Identifiers = 
         
    new: uri:string * name:string option * displayId:string option * version:string option * persistentId:string option -> Identifiers
    
    /// Unique URI that identifies the object
    member uri:string
    
    /// Version of the object
    member version:string option
    
    /// Name
    member name:string option
    
    /// Human readable id of the obejct
    member displayId:string option
    
    /// Indentity shared by multiple versions of the same object
    member persistentIdentity:string option 
    
    /// Description
    member description:string option with get,set
    
    member private uriAnnotations:Dictionary<string,string>
    
    member private stringAnnotations:Dictionary<string,string>
    
    member addUriAnnotation: string * string -> unit
    
    member addStringAnnotation: string * string  -> unit
    
    member getUriAnnotation: string -> string option
    
    member getStringAnnotation: string -> string option
    
    member getUriAnnotations:(string*string) list
    
    member getStringAnnotations:(string*string) list
