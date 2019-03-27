[<JavaScript>]
module FSBOL.Component
open FSBOL.ComponentInstance
open FSBOL.MapsTo

type RoleIntegration = 
    | OverrideRoles
    | MergeRoles 
    | OtherRoleIntegration of string
    static member toURI:RoleIntegration -> string
    static member fromURI:string -> RoleIntegration

type Component = 
    inherit ComponentInstance
    
    new : uri:string * name:string option * displayId:string option * version:string option * persistantId:string option * definition:string * access:string * mapsTos:MapsTo list *  roles:string list * roleIntegrations: RoleIntegration list -> Component

    member roles:List<string>

    member roleIntegrations:List<RoleIntegration>
    