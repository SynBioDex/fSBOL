[<JavaScript>]
module FSBOL.Component

open FSBOL.ComponentInstance
open FSBOL.MapsTo

type RoleIntegration = 
    | OverrideRoles
    | MergeRoles 
    | OtherRoleIntegration of string
    static member toURI(ri:RoleIntegration)= 
      match ri with 
      | OverrideRoles -> "http://sbols.org/v2#overrideRoles"
      | MergeRoles -> "http://sbols.org/v2#mergeRoles"
      | OtherRoleIntegration(s) -> s
    static member fromURI(str:string) = 
      match str with 
      | "http://sbols.org/v2#overrideRoles" -> OverrideRoles
      | "http://sbols.org/v2#mergeRoles" -> MergeRoles
      | _ -> OtherRoleIntegration(str)

type Component(uri:string, name:string option, displayId:string option, version:string option, persistantId:string option, definition:string, access:string, mapsTos:MapsTo list, roles:string list, roleIntegrations: RoleIntegration list) = 
    
    inherit ComponentInstance(uri, name, displayId, version, persistantId,definition,access,mapsTos)

    member x.roles = roles
   
    member x.roleIntegrations = roleIntegrations