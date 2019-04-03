[<JavaScript>]
module FSBOL.JsonSerializer

open FSBOL.Identifiers
open FSBOL.Sequence
open FSBOL.Attachment
open FSBOL.Collection
open FSBOL.MapsTo
open FSBOL.ComponentInstance
open FSBOL.Component
open FSBOL.Role
open FSBOL.Location
open FSBOL.Range
open FSBOL.Cut
open FSBOL.GenericLocation
open FSBOL.SequenceAnnotation
open FSBOL.SequenceConstraint
open FSBOL.ComponentDefinition
open FSBOL.VariableComponent
open FSBOL.CombinatorialDerivation
open FSBOL.Model
open FSBOL.Module
open FSBOL.FunctionalComponent
open FSBOL.Participation
open FSBOL.Interaction
open FSBOL.ModuleDefinition
open FSBOL.Implementation
open FSBOL.TopLevel
open FSBOL.SBOLDocument

open System
open System.Xml

/// Attachment in Record structure
type rAttachment = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    attachments:string list;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    source:string;
    format:string;
    size:int64;
    hash:string
}

/// Collection in Record structure
type rCollection = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    attachments:string list;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    members:string list
}

/// Sequence in Record structure
type rSequence = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    attachments:string list;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    elements:string;
    encoding:string
}

/// MapsTo in Record structure
type rMapsTo = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    local:string;
    remote:string;
    refinment:string
}

/// Component in Record structure
type rComponent = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    definition:string;
    access:string;
    mapsTos:rMapsTo list;
    roles:string list;
    roleIntegrations:string list
}

/// Range in Record structure
type rRange = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    orientation:string;
    startIndex:int
    endIndex:int
}

/// Cut in Record structure
type rCut = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    orientation:string;
    at:int
}

/// GenericLocation in Record structure
type rGenericLocation = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    orientation:string
}

/// SequenceAnnotation in Record structure
type rSequenceAnnotation = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    ranges:rRange list;
    cuts:rCut list;
    genericLocations:rGenericLocation list;
    roles:string list;
    componentObj:string
}

/// SequenceConstraint in Record structure
type rSequenceConstraint = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    subject:string;
    object:string;
    restriction:string
}

/// ComponentDefinition in Record structure
type rComponentDefinition = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    attachments:string list;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    components:rComponent list;
    sequenceAnnotations:rSequenceAnnotation list;
    sequenceConstraints:rSequenceConstraint list;
    sequences:string list;
    types:string list;
    roles:string list
}

/// VariableComponent in Record structure
type rVariableComponent = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    operator:string;
    variants:string list;
    variantCollections:string list;
    variantDerivations:string list;
    variable: string
}

/// CombinatorialDerivation in Record structure
type rCombinatorialDerivation = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    attachments:string list;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    strategy:string;
    template:string;
    variableComponents:rVariableComponent list
}

/// Model in Record structure
type rModel = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    attachments:string list;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    source:string;
    language:string;
    framework:string
}

/// Module in Record structure
type rModule = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    definition:string;
    mapsTos:rMapsTo list;
}


/// FunctionalComponent in Record structure
type rFunctionalComponent = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    definition:string;
    access:string;
    mapsTos:rMapsTo list;
    direction:string
}

/// Participation in Record structure
type rParticipation = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    roles:string list;
    participant:string
}

/// Interaction in Record structure
type rInteraction = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    types:string list;
    participations:rParticipation list
}

/// ModuleDefinition in Record structure
type rModuleDefinition = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    attachments:string list;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    roles:string list;
    functionalComponents:rFunctionalComponent list;
    interactions:rInteraction list;
    modules:rModule list;
    models:string list
}

/// Implementation in Record structure
type rImplementation = {
    uri:string;
    version:string;
    name:string;
    displayId:string;
    persistentIdentity:string;
    attachments:string list;
    description:string;
    uriAnnotations:(string*string) list;
    stringAnnotations:(string*string) list;
    built:string
}

/// SBOLDocument in Record structure
type rSBOLDocument = {
    attachments:rAttachment list;
    sequences:rSequence list;
    componentDefinitions:rComponentDefinition list;
    moduleDefinitions:rModuleDefinition list;
    models:rModel list;
    implementations:rImplementation list;
    collections:rCollection list;
    CombinatorialDerivation:rCombinatorialDerivation list
}

let stringOptionToString (str:string option) = 
    match str with 
    | Some(x) -> x
    | None -> null

/// Attachment in Record structure
let attachmentToJson (x:Attachment) :rAttachment = 
    {
        uri=x.uri; 
        version= stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        attachments=x.attachments;
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        source=x.source;
        format=stringOptionToString x.format;
        size=
            match x.size with 
            | Some(i) -> i
            | None -> Int64.MinValue ;
        hash=stringOptionToString x.hash
    }

let collectionToJson (x:Collection) :rCollection = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        attachments=x.attachments;
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        members=x.members
    }


let sequenceToJson (x:Sequence) :rSequence = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        attachments=x.attachments;
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        elements= x.elements;
        encoding = Encoding.toURI x.encoding
    }    

let mapsToToJson (x:MapsTo) :rMapsTo = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        local = x.local;
        remote = x.remote;
        refinment = Refinement.toURI x.refinement
    }

let componentToJson (x:Component) :rComponent = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        definition = x.definition;
        access = Access.toURI x.access;
        mapsTos = x.mapsTos |> List.map (fun x -> mapsToToJson x);
        roles = x.roles |> List.map (fun x -> Role.toURI x);
        roleIntegrations = x.roleIntegrations |> List.map (fun x -> RoleIntegration.toURI x)
    }

let rangeToJson (x:Range) :rRange = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        orientation = Orientation.toURI x.orientation;
        startIndex = x.startIndex
        endIndex = x.endIndex
    }

let cutToJson (x:Cut) :rCut = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        orientation = Orientation.toURI x.orientation;
        at = x.at
    }

let genericLocationToJson (x:GenericLocation) :rGenericLocation = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        orientation = Orientation.toURI x.orientation;
    }

let sequenceAnnotationToJson (x:SequenceAnnotation) :rSequenceAnnotation = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        ranges = x.locations 
                 |> List.choose (fun elem ->
                    match elem with 
                    | :? Range as r -> Some(r)
                    | _ -> None)
                  |> List.map (fun x -> rangeToJson x);
        cuts = x.locations 
                 |> List.choose (fun elem ->
                    match elem with 
                    | :? Cut as c -> Some(c)
                    | _ -> None)
                  |> List.map (fun x -> cutToJson x);
        genericLocations = x.locations 
                 |> List.choose (fun elem ->
                    match elem with 
                    | :? GenericLocation as gl -> Some(gl)
                    | _ -> None)
                  |> List.map (fun x -> genericLocationToJson x);
        roles = x.roles |> List.map (fun x -> Role.toURI x)
        componentObj = 
            match x.componentObj with 
            | Some(c) -> c.uri
            | None -> null
    }

let sequenceConstraintToJson (x:SequenceConstraint):rSequenceConstraint = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        subject = x.subject.uri;
        object = x.object.uri;
        restriction = Restriction.toURI x.restriction
    }

let componentDefinitionToJson (x:ComponentDefinition):rComponentDefinition = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        attachments = x.attachments
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        components = x.components |> List.map (fun x -> componentToJson x);
        sequenceAnnotations = x.sequenceAnnotations |> List.map (fun x -> sequenceAnnotationToJson x);
        sequenceConstraints = x.sequenceConstraints |> List.map (fun x -> sequenceConstraintToJson x);
        sequences = x.sequences |> List.map (fun x -> x.uri);
        types = x.types |> List.map (fun x -> ComponentDefinitionType.toURI x);
        roles = x.roles |> List.map (fun x -> Role.toURI x)
    }


let variableComponentToJson (x:VariableComponent):rVariableComponent = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        operator = Operator.toURI x.operator;
        variants = x.variants;
        variantCollections = x.variantCollections;
        variantDerivations = x.variantDerivations;
        variable = x.variable
    }

let combinatorialDerivationToJson (x:CombinatorialDerivation) :rCombinatorialDerivation = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        attachments = x.attachments
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        strategy = 
            match x.strategy with 
            | Some(y) -> Strategy.toURI y
            | None -> null
        template = x.template;
        variableComponents = x.variableComponents |> List.map (fun x -> variableComponentToJson x)
    }

/// Model in Record structure
let modelToJson (x:Model) :rModel = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        attachments = x.attachments
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        source = x.source;
        language = Language.toURI x.language;
        framework = Framework.toURI x.framework
    }

/// Module in Record structure
let moduleToJson (x:Module) :rModule = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        definition = x.definition;
        mapsTos = x.mapsTos |> List.map (fun x -> mapsToToJson x);
    }


/// FunctionalComponent in Record structure
let  functionalComponentToJson (x:FunctionalComponent):rFunctionalComponent = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        definition = x.definition;
        access = Access.toURI x.access;
        mapsTos = x.mapsTos |> List.map (fun x -> mapsToToJson x);
        direction = Direction.toURI x.direction
    }

/// Participation in Record structure
let participationToJson (x:Participation) :rParticipation = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        roles = x.roles |> List.map (fun y -> ParticipationRole.toURI y) ;
        participant = x.participant.uri
    }

/// Interaction in Record structure
let interactionToJson (x:Interaction) :rInteraction = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        types = x.types |> List.map (fun y -> InteractionType.toURI y)
        participations = x.participations |> List.map (fun y -> participationToJson y)
    }

/// ModuleDefinition in Record structure
let moduleDefinitionToJson (x:ModuleDefinition):rModuleDefinition = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        attachments = x.attachments
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        roles = x.roles |> List.map (fun y -> Role.toURI y);
        functionalComponents = x.functionalComponents |> List.map (fun y -> functionalComponentToJson y);
        interactions = x.interactions |> List.map (fun y -> interactionToJson y);
        modules = x.modules |> List.map (fun y -> moduleToJson y);
        models = x.models |> List.map (fun y -> y.uri)
    }

/// Implementation in Record structure
let implementationToJson (x:Implementation) :rImplementation = 
    {
        uri=x.uri; 
        version=stringOptionToString x.version; 
        name=stringOptionToString x.name; 
        displayId=stringOptionToString x.displayId; 
        persistentIdentity=stringOptionToString x.persistentIdentity; 
        attachments = x.attachments
        description=stringOptionToString x.description;
        uriAnnotations= x.getUriAnnotations;
        stringAnnotations=x.getStringAnnotations;
        built = 
            match x.built with 
            | Some(CD(y)) -> y.uri
            | Some(MD(y)) -> y.uri
            | None -> null
    }

/// SBOLDocument in Record structure
let sbolToJson (x:SBOLDocument):rSBOLDocument = 
    {
        attachments = x.attachments |> List.map (fun y -> attachmentToJson y);
        sequences = x.sequences |> List.map (fun y -> sequenceToJson y);
        componentDefinitions = x.componentDefinitions |> List.map (fun y -> componentDefinitionToJson y);
        moduleDefinitions = x.moduleDefinitions |> List.map (fun y -> moduleDefinitionToJson y);
        models = x.models |> List.map (fun y -> modelToJson y);
        implementations = x.implementations |> List.map (fun y -> implementationToJson y);
        collections= x.collections |> List.map (fun y -> collectionToJson y);
        CombinatorialDerivation = x.combinatorialDerivations |> List.map (fun y -> combinatorialDerivationToJson y);
    }


