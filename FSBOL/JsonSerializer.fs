[<JavaScript>]
module FSBOL.JsonSerializer

open FSBOL.Sequence
open FSBOL.Component
open FSBOL.Range
open FSBOL.Location
open FSBOL.SequenceAnnotation
open FSBOL.ComponentDefinition
open FSBOL.FunctionalComponent
open FSBOL.Participation
open FSBOL.Interaction
open FSBOL.ModuleDefinition
open FSBOL.TopLevel
open FSBOL.SBOLDocument





type jAnnotation = {
    Type:string
    name:string
    value:string
}

type jSequence = {
    uri:string
    name:string
    persistentIdentity:string
    displayId:string
    version:string
    description:string
    annotations: jAnnotation array
    elements:string
    encoding:string
}

type jComponent = {
    uri:string
    name:string
    persistentIdentity:string
    displayId:string
    version:string
    description:string
    annotations: jAnnotation array
    access:string
    definition:string
}

type jRange = {
    gecDU:string
    uri:string
    name:string
    persistentIdentity:string
    displayId:string
    version:string
    description:string
    annotations: jAnnotation array
    startIndex:int
    endIndex:int
    orientation:string
}

type jLocation = Range of jRange

type jSequenceAnnotation = {
    uri:string
    name:string
    persistentIdentity:string
    displayId:string
    version:string
    description:string
    annotations: jAnnotation array
    Component:string
    locations: jLocation array
}

type jComponentDefinition = {
    uri:string
    name:string
    persistentIdentity:string
    displayId:string
    version:string
    description:string
    annotations: jAnnotation array
    components: jComponent array
    sequenceAnnotations: jSequenceAnnotation array
    sequences: string array
    types: string array
    roles: string array
}

type jFunctionalComponent = {
    uri:string
    name:string
    persistentIdentity:string
    displayId:string
    version:string
    description:string
    annotations: jAnnotation array
    access:string
    direction:string
    definition:string
}

type jParticipation = {
    uri:string
    name:string
    persistentIdentity:string
    displayId:string
    version:string
    description:string
    annotations: jAnnotation array
    roles: string array
    participant:string
}

type jInteraction = {
    uri:string
    name:string
    persistentIdentity:string
    displayId:string
    version:string
    description:string
    annotations: jAnnotation array
    types: string array
    participations: jParticipation array
}

type jModuleDefinition = {
    uri:string
    name:string
    persistentIdentity:string
    displayId:string
    version:string
    description:string
    annotations: jAnnotation array
    functionalComponents: jFunctionalComponent array
    interactions: jInteraction array
}


type jSBOLDocument = {
    componentDefinitions: jComponentDefinition array
    moduleDefinitions: jModuleDefinition array
    sequences: jSequence array
}

let serializeUriAnnotations (uriAnnotations:(string*string)list) = 
    uriAnnotations 
    |> List.map(fun (k,v) -> ({Type = "uri";name = k; value= v}))
    
let serializeStringAnnotations (stringAnnotations:(string*string) list) = 
    stringAnnotations
    |> List.map(fun (k,v) -> ({Type = "string";name = k;value = v}))

let serializeSequence (x:Sequence) = 
    let annotations = (serializeUriAnnotations (x.getUriAnnotations)@ serializeStringAnnotations (x.getStringAnnotations)) |> Array.ofList
    {uri= x.uri;
    name=x.name;
    persistentIdentity=x.persistentIdentity;
    displayId=x.displayId;
    version=x.version;
    description=x.description;
    annotations=annotations;
    elements=x.elements;
    encoding=x.encoding}

let serializeComponent (x:Component) = 
    let annotations = (serializeUriAnnotations (x.getUriAnnotations)@ serializeStringAnnotations (x.getStringAnnotations)) |> Array.ofList
    let comp:jComponent = {uri= x.uri;
                          name=x.name;
                          persistentIdentity=x.persistentIdentity;
                          displayId=x.displayId;
                          version=x.version;
                          description=x.description;
                          annotations=annotations;
                          access=x.access;
                          definition=x.definition}
    comp

let serializeRange (x:Range) = 
    let annotations = (serializeUriAnnotations (x.getUriAnnotations)@ serializeStringAnnotations (x.getStringAnnotations)) |> Array.ofList
    let range:jRange = {uri= x.uri;
                        name=x.name;
                        gecDU = "range";
                        persistentIdentity=x.persistentIdentity;
                        displayId=x.displayId;
                        version=x.version;
                        description=x.description;
                        annotations=annotations;
                        startIndex=x.startIndex;
                        endIndex = x.endIndex;
                        orientation=x.orientation}
    range

let serializeLocation (x:Location) = 
    match x with 
    | Location.Range(r) -> Range(serializeRange r)

let serializeSequenceAnnotation (x:SequenceAnnotation) = 
    let annotations = (serializeUriAnnotations (x.getUriAnnotations)@ serializeStringAnnotations (x.getStringAnnotations)) |> Array.ofList
    let locs = x.locations |> List.map (fun y -> serializeLocation y) |> Array.ofList
    let sa:jSequenceAnnotation = {uri= x.uri;
                                  name=x.name;
                                  persistentIdentity=x.persistentIdentity;
                                  displayId=x.displayId;
                                  version=x.version;
                                  description=x.description;
                                  annotations=annotations;
                                  Component=x.componentObject.uri;
                                  locations=locs}
    sa

let serializeComponentDefinition (x:ComponentDefinition) = 
    let annotations = (serializeUriAnnotations (x.getUriAnnotations)@ serializeStringAnnotations (x.getStringAnnotations)) |> Array.ofList
    let seqs = x.sequences |> List.map (fun seq -> seq.uri) |> Array.ofList
    let sas = x.sequenceAnnotations |> List.map (fun y -> serializeSequenceAnnotation y) |> Array.ofList
    let comps = x.components |> List.map (fun y -> serializeComponent y) |> Array.ofList
    let types = x.types |> Array.ofList
    let roles = x.roles |> Array.ofList
    let cd:jComponentDefinition = {uri= x.uri;
                                  name=x.name;
                                  persistentIdentity=x.persistentIdentity;
                                  displayId=x.displayId;
                                  version=x.version;
                                  description=x.description;
                                  annotations=annotations;
                                  components=comps;
                                  sequenceAnnotations=sas;
                                  sequences= seqs;
                                  types = types;
                                  roles = roles
                                  }
    cd

let serializeFunctionalComponent (x:FunctionalComponent) = 
    let annotations = (serializeUriAnnotations (x.getUriAnnotations)@ serializeStringAnnotations (x.getStringAnnotations)) |> Array.ofList
    let fc:jFunctionalComponent = {uri= x.uri;
                                   name=x.name;
                                   persistentIdentity=x.persistentIdentity;
                                   displayId=x.displayId;
                                   version=x.version;
                                   description=x.description;
                                   annotations=annotations;
                                   access=x.access;
                                   direction= x.direction;
                                   definition=x.definition}
    fc

let serializeParticipation (x:Participation)=
    let annotations = (serializeUriAnnotations (x.getUriAnnotations)@ serializeStringAnnotations (x.getStringAnnotations)) |> Array.ofList
    let roles = x.roles |> Array.ofList
    let participation:jParticipation = {uri= x.uri;
                                        name=x.name;
                                        persistentIdentity=x.persistentIdentity;
                                        displayId=x.displayId;
                                        version=x.version;
                                        description=x.description;
                                        annotations=annotations;
                                        roles=roles;
                                        participant=x.participant.uri}
    participation

let serializeInteraction (x:Interaction) = 
    let annotations = (serializeUriAnnotations (x.getUriAnnotations)@ serializeStringAnnotations (x.getStringAnnotations)) |> Array.ofList
    let types = x.types |> Array.ofList
    let participations = x.participations |> List.map (fun y -> serializeParticipation y) |> Array.ofList
    let interaction:jInteraction = {uri= x.uri;
                                    name=x.name;
                                    persistentIdentity=x.persistentIdentity;
                                    displayId=x.displayId;
                                    version=x.version;
                                    description=x.description;
                                    annotations=annotations;
                                    types=types;
                                    participations=participations}
    interaction

let serializeModuleDefinition (x:ModuleDefinition) = 
    let annotations = (serializeUriAnnotations (x.getUriAnnotations)@ serializeStringAnnotations (x.getStringAnnotations)) |> Array.ofList
    let fc = x.functionalComponents |> List.map (fun y -> serializeFunctionalComponent y) |> Array.ofList
    let interactions = x.interactions |> List.map (fun y -> serializeInteraction y) |> Array.ofList
    let md:jModuleDefinition = {uri= x.uri;
                                name=x.name;
                                persistentIdentity=x.persistentIdentity;
                                displayId=x.displayId;
                                version=x.version;
                                description=x.description;
                                annotations=annotations;
                                functionalComponents=fc;
                                interactions=interactions}
    md

let serializeSBOLDocument (x:SBOLDocument) = 
    let cds = x.collection 
              |> List.filter ( fun y -> (match y with | TopLevel.ComponentDefinition(_) -> true | _ -> false) ) 
              |> List.map(fun (TopLevel.ComponentDefinition(cd)) -> cd) 
              |> List.map (fun y -> serializeComponentDefinition y)
              |> Array.ofList
    let mds = x.collection 
              |> List.filter ( fun y -> (match y with | TopLevel.ModuleDefinition(_) -> true | _ -> false) ) 
              |> List.map(fun (TopLevel.ModuleDefinition(md)) -> md)
              |> List.map (fun y -> serializeModuleDefinition y)
              |> Array.ofList
    let seqs = x.collection 
               |> List.filter ( fun y -> (match y with | TopLevel.Sequence(_) -> true | _ -> false) ) 
               |> List.map(fun (TopLevel.Sequence(seq)) -> seq)
               |> List.map (fun y -> serializeSequence y)
               |> Array.ofList

    let sbol:jSBOLDocument = {componentDefinitions = cds;
                              moduleDefinitions = mds;
                              sequences = seqs
                             }
    
    sbol
