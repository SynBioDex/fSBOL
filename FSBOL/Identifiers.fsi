[<JavaScript>]

module FSBOL.Identifiers
(* Basic Indentifiers in SBOL*)
open System.Collections.Generic

[<AbstractClass>]
type Identifiers = 
         
        new: name:string * urlPrefix:string * displayId:string * version:string   -> Identifiers

        (* Version of the object*)
        member version:string 
        
        (* Name *)
        member name:string 

        (* Human readable id of the obejct *)
        member displayId:string 

        (* Unique URI that identifies the object*)
        member uri:string

        (* Indentity shared by multiple versions of the same object *)
        member persistentIdentity:string 

        (* Description *)
        member description:string with get,set

        member private uriAnnotations:Dictionary<string,string>

        member private stringAnnotations:Dictionary<string,string>

        member addUriAnnotation: string * string -> unit

        member addStringAnnotation: string * string  -> unit

        member getUriAnnotation: string -> string option

        member getStringAnnotation: string -> string option

        member getUriAnnotations:(string*string) list

        member getStringAnnotations:(string*string) list
