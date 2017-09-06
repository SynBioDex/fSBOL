module FSBOL.XmlSerializer


open FSBOL.Identifiers
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

open System.Xml
open System.IO
open System.Text

let idFromXml (xElem:XmlElement) = 
        let idval = xElem.GetAttribute("about")
        //let displayIdXmlList = xElem.ChildNodes..GetElementsByTagName(QualifiedName.displayId)
        
        let childXmlElements = ([0..(xElem.ChildNodes.Count-1)]
                               |> List.map(fun index -> xElem.ChildNodes.Item(index)))
                               |> List.filter(fun item -> 
                                    match item with 
                                    | :? XmlElement -> true
                                    | _ -> false)
                                |> List.map (fun item -> 
                                    (downcast item:XmlElement))

        let displayIdXmlList = childXmlElements 
                               |> List.filter(fun xmlElem -> 
                                    (xmlElem.Name = QualifiedName.displayId))

        if displayIdXmlList.Length <> 1 then
            failwith "Malformed SBOL XML. Too many or too few Display Id properties"
        let displayId = displayIdXmlList.Item(0).InnerText

        let nameXmlList = childXmlElements 
                               |> List.filter(fun xmlElem -> 
                                    (xmlElem.Name = QualifiedName.name))
        let name = match nameXmlList.Length with 
                   | 1 -> nameXmlList.Item(0).InnerText
                   | _ -> displayId


        let versionXmlList = childXmlElements 
                               |> List.filter(fun xmlElem -> 
                                    (xmlElem.Name = QualifiedName.version))

        if versionXmlList.Length <> 1 then
            failwith "Malformed SBOL XML. Too many or too few Version properties"
        let version = versionXmlList.Item(0).InnerText
        (name,displayId,version)


let serializeSequence (xdoc:XmlDocument) (x:Sequence)= 
        
        let xmlElement = xdoc.CreateElement(QualifiedName.Sequence,Terms.sbolns)
        xmlElement.SetAttribute("about",Terms.rdfns,x.uri) |> ignore

        (* Persistent Identity*)
        let perIdXml = xdoc.CreateElement(QualifiedName.persistentIdentity,Terms.sbolns)
        perIdXml.SetAttribute("resource",Terms.rdfns,x.persistentIdentity) |> ignore
        xmlElement.AppendChild(perIdXml) |> ignore

        (* Display Id*)
        let disIdXml = xdoc.CreateElement(QualifiedName.displayId,Terms.sbolns)
        disIdXml.AppendChild(xdoc.CreateTextNode(x.displayId)) |> ignore
        xmlElement.AppendChild(disIdXml) |> ignore

        (* Version *)
        let verXml = xdoc.CreateElement(QualifiedName.version,Terms.sbolns)
        verXml.AppendChild(xdoc.CreateTextNode(x.version)) |> ignore
        xmlElement.AppendChild(verXml) |> ignore

        (* Name *)
        let nameXml = xdoc.CreateElement(QualifiedName.name,Terms.dctermsns)
        nameXml.AppendChild(xdoc.CreateTextNode(x.name)) |> ignore
        xmlElement.AppendChild(nameXml) |> ignore

        (* Description *)
        if x.description <> "" then
            let descriptionXml = xdoc.CreateElement(QualifiedName.description,Terms.dctermsns)
            descriptionXml.AppendChild(xdoc.CreateTextNode(x.description)) |> ignore
            xmlElement.AppendChild(descriptionXml) |> ignore


        (* Sequence *)
        let elementsXml = xdoc.CreateElement(QualifiedName.elements,Terms.sbolns)
        elementsXml.AppendChild(xdoc.CreateTextNode(x.elements)) |> ignore
        xmlElement.AppendChild(elementsXml) |> ignore

        (* Sequence Encoding *)
        let encodingXml = xdoc.CreateElement(QualifiedName.encoding,Terms.sbolns)
        encodingXml.SetAttribute("resource",Terms.rdfns,x.encoding) |> ignore
        //encodingXml.SetAttribute("rdf:resource",x.encoding) 
        xmlElement.AppendChild(encodingXml) |> ignore

        xmlElement

let sequenceFromXml (xElem:XmlElement) = 
        let id = xElem.GetAttribute("about")
        let (name,displayId,version) = idFromXml(xElem)
        let urlPrefix = id.Substring(0,id.IndexOf("/" + displayId + "/" + version))
        
        let childXmlElements = ([0..(xElem.ChildNodes.Count-1)]
                               |> List.map(fun index -> xElem.ChildNodes.Item(index)))
                               |> List.filter(fun item -> 
                                    match item with 
                                    | :? XmlElement -> true
                                    | _ -> false)
                                |> List.map (fun item -> 
                                    (downcast item:XmlElement))
        let encodingList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.encoding)
        let elementsList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.elements)

        if encodingList.Length <> 1 then
            failwith "Malformed SBOL XML. Too many or too few Encoding properties"
        if elementsList.Length <> 1 then 
            failwith "Malformed SBOL XML. Too many or too few Elements properties"

        if elementsList.Length <> 1 then 
            failwith "Malformed SBOL XML. Too many or too few Elements properties"

        let encodingElem = encodingList.Item(0)
        let encoding = encodingElem.GetAttribute("resource")
        
        let elementsElem = elementsList.Item(0)
        let elements = elementsElem.InnerText

        new Sequence(name,urlPrefix,displayId,version,elements,encoding)

let serializeComponent (xdoc:XmlDocument) (x:Component) =
        let xmlElement = xdoc.CreateElement(QualifiedName.Component,Terms.sbolns)
        xmlElement.SetAttribute("about",Terms.rdfns,x.uri) |> ignore

        (* Persistent Identity*)
        let perIdXml = xdoc.CreateElement(QualifiedName.persistentIdentity,Terms.sbolns)
        perIdXml.SetAttribute("resource",Terms.rdfns,x.persistentIdentity) |> ignore
        xmlElement.AppendChild(perIdXml) |> ignore

        (* Display Id*)
        let disIdXml = xdoc.CreateElement(QualifiedName.displayId,Terms.sbolns)
        disIdXml.AppendChild(xdoc.CreateTextNode(x.displayId)) |> ignore
        xmlElement.AppendChild(disIdXml) |> ignore

        (* Version *)
        let verXml = xdoc.CreateElement(QualifiedName.version,Terms.sbolns)
        verXml.AppendChild(xdoc.CreateTextNode(x.version)) |> ignore
        xmlElement.AppendChild(verXml) |> ignore

        (* Name *)
        let nameXml = xdoc.CreateElement(QualifiedName.name,Terms.dctermsns)
        nameXml.AppendChild(xdoc.CreateTextNode(x.name)) |> ignore
        xmlElement.AppendChild(nameXml) |> ignore

        (* Description *)
        if x.description <> "" then
            let descriptionXml = xdoc.CreateElement(QualifiedName.description,Terms.dctermsns)
            descriptionXml.AppendChild(xdoc.CreateTextNode(x.description)) |> ignore
            xmlElement.AppendChild(descriptionXml) |> ignore

        (* Access *)
        let accessXml = xdoc.CreateElement(QualifiedName.access,Terms.sbolns)
        accessXml.SetAttribute("resource",Terms.rdfns,x.access) |> ignore
        xmlElement.AppendChild(accessXml) |> ignore

        (* Definition -> Basically a pointer to the Component Definition*)
        let defnXml = xdoc.CreateElement(QualifiedName.definition, Terms.sbolns)
        defnXml.SetAttribute("resource",Terms.rdfns,x.definition) |> ignore
        xmlElement.AppendChild(defnXml) |> ignore

        xmlElement

let componentFromXml (xElem:XmlElement) = 
        let id = xElem.GetAttribute("about")
        let (name,displayId,version) = idFromXml(xElem)
        let urlPrefix = id.Substring(0,id.IndexOf("/" + displayId + "/" + version))
        
        let childXmlElements = ([0..(xElem.ChildNodes.Count-1)]
                               |> List.map(fun index -> xElem.ChildNodes.Item(index)))
                               |> List.filter(fun item -> 
                                    match item with 
                                    | :? XmlElement -> true
                                    | _ -> false)
                                |> List.map (fun item -> 
                                    (downcast item:XmlElement))
        let accessList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.access)
        let definitionList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.definition)

        if accessList.Length <> 1 then
            failwith "Malformed SBOL XML. Too many or too few access properties"
        if definitionList.Length <> 1 then 
            failwith "Malformed SBOL XML. Too many or too few definition properties"

        if definitionList.Length <> 1 then 
            failwith "Malformed SBOL XML. Too many or too few definition properties"

        let accessElem = accessList.Item(0)
        let access = accessElem.GetAttribute("resource")
        
        let definitionElem = definitionList.Item(0)
        let definition = definitionElem.GetAttribute("resource")

        new Component(name,urlPrefix,displayId,version,access,definition)

let serializeRange (xdoc:XmlDocument) (x:Range)=
        
        let xmlElement = xdoc.CreateElement(QualifiedName.Range,Terms.sbolns)
        xmlElement.SetAttribute("about",Terms.rdfns,x.uri) |> ignore

        (* Persistent Identity*)
        let perIdXml = xdoc.CreateElement(QualifiedName.persistentIdentity,Terms.sbolns)
        perIdXml.SetAttribute("resource",Terms.rdfns,x.persistentIdentity) |> ignore
        xmlElement.AppendChild(perIdXml) |> ignore

        (* Display Id*)
        let disIdXml = xdoc.CreateElement(QualifiedName.displayId,Terms.sbolns)
        disIdXml.AppendChild(xdoc.CreateTextNode(x.displayId)) |> ignore
        xmlElement.AppendChild(disIdXml) |> ignore

        (* Version *)
        let verXml = xdoc.CreateElement(QualifiedName.version,Terms.sbolns)
        verXml.AppendChild(xdoc.CreateTextNode(x.version)) |> ignore
        xmlElement.AppendChild(verXml) |> ignore

        (* Name *)
        (*let nameXml = xdoc.CreateElement(QualifiedName.name,Terms.dctermsns)
        nameXml.AppendChild(xdoc.CreateTextNode(x.name)) |> ignore
        xmlElement.AppendChild(nameXml) |> ignore*)

        (* Description *)
        if x.description <> "" then
            let descriptionXml = xdoc.CreateElement(QualifiedName.description,Terms.dctermsns)
            descriptionXml.AppendChild(xdoc.CreateTextNode(x.description)) |> ignore
            xmlElement.AppendChild(descriptionXml) |> ignore

        let startXml = xdoc.CreateElement(QualifiedName.startIndex,Terms.sbolns)
        startXml.AppendChild(xdoc.CreateTextNode(x.startIndex.ToString())) |> ignore
        xmlElement.AppendChild(startXml) |> ignore
        
        let endXml = xdoc.CreateElement(QualifiedName.endIndex, Terms.sbolns)
        endXml.AppendChild(xdoc.CreateTextNode(x.endIndex.ToString())) |> ignore
        xmlElement.AppendChild(endXml) |> ignore
        
        let orientationXml = xdoc.CreateElement(QualifiedName.orientation,Terms.sbolns)
        orientationXml.SetAttribute("resource",Terms.rdfns,x.orientation)|> ignore
        xmlElement.AppendChild(orientationXml) |> ignore 

        xmlElement

let rangeFromXml (xElem:XmlElement) = 
        let id = xElem.GetAttribute("about")
        let (name,displayId,version) = idFromXml(xElem)
        let urlPrefix = id.Substring(0,id.IndexOf("/" + displayId + "/" + version))
        
        let childXmlElements = ([0..(xElem.ChildNodes.Count-1)]
                               |> List.map(fun index -> xElem.ChildNodes.Item(index)))
                               |> List.filter(fun item -> 
                                    match item with 
                                    | :? XmlElement -> true
                                    | _ -> false)
                                |> List.map (fun item -> 
                                    (downcast item:XmlElement))

        let orientationList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.orientation)
        if orientationList.Length <> 1 then
            failwith "Malformed SBOL XML. Too many or too few Access properties"
        let orientationElem = orientationList.Item(0)
        let orientation = orientationElem.GetAttribute("resource")
        
        let startIndexList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.startIndex)
        if startIndexList.Length <> 1 then 
            failwith "Malformed SBOL XML. Too many or too few Definition properties"
        let startIndexElem = startIndexList.Item(0)
        let startIndex = startIndexElem.InnerText
        let endIndexList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.endIndex)
        if endIndexList.Length <> 1 then 
            failwith "Malformed SBOL XML. Too many or too few Definition properties"
        let endIndexElem = endIndexList.Item(0)
        let endIndex = endIndexElem.InnerText
        new Range(name,urlPrefix,displayId,version,(startIndex |> int),(endIndex |> int),orientation)


let serializeLocation (xdoc:XmlDocument) (l:Location)  = 
    match l with 
    | Range(r) -> serializeRange xdoc r


let rec addLocations location (xdoc:XmlDocument,xElement:XmlElement) = 
            match location with 
            | [] -> (xdoc,xElement)
            | l:Location :: rlist -> 
                let xmlLocation = xdoc.CreateElement(QualifiedName.locationProperty,Terms.sbolns)
                xmlLocation.AppendChild(l |> serializeLocation xdoc) |> ignore
                xElement.AppendChild(xmlLocation) |> ignore
                addLocations rlist (xdoc,xElement)




let serializeSequenceAnnotation (xdoc:XmlDocument) (x:SequenceAnnotation)=
        let xmlElement = xdoc.CreateElement(QualifiedName.SequenceAnnotation,Terms.sbolns)
        xmlElement.SetAttribute("about",Terms.rdfns,x.uri) |> ignore

        (* Persistent Identity*)
        let perIdXml = xdoc.CreateElement(QualifiedName.persistentIdentity,Terms.sbolns)
        perIdXml.SetAttribute("resource",Terms.rdfns,x.persistentIdentity) |> ignore
        xmlElement.AppendChild(perIdXml) |> ignore

        (* Display Id*)
        let disIdXml = xdoc.CreateElement(QualifiedName.displayId,Terms.sbolns)
        disIdXml.AppendChild(xdoc.CreateTextNode(x.displayId)) |> ignore
        xmlElement.AppendChild(disIdXml) |> ignore

        (* Version *)
        let verXml = xdoc.CreateElement(QualifiedName.version,Terms.sbolns)
        verXml.AppendChild(xdoc.CreateTextNode(x.version)) |> ignore
        xmlElement.AppendChild(verXml) |> ignore

        (* Name *)
        let nameXml = xdoc.CreateElement(QualifiedName.name,Terms.dctermsns)
        nameXml.AppendChild(xdoc.CreateTextNode(x.name)) |> ignore
        xmlElement.AppendChild(nameXml) |> ignore

        (* Description *)
        if x.description <> "" then
            let descriptionXml = xdoc.CreateElement(QualifiedName.description,Terms.dctermsns)
            descriptionXml.AppendChild(xdoc.CreateTextNode(x.description)) |> ignore
            xmlElement.AppendChild(descriptionXml) |> ignore

        (* Component *)
        let compXml = xdoc.CreateElement(QualifiedName.componentProperty,Terms.sbolns)
        compXml.SetAttribute("resource",Terms.rdfns,x.componentObject.uri) |> ignore
        xmlElement.AppendChild(compXml) |> ignore

        (xdoc,xmlElement) = addLocations x.locations (xdoc,xmlElement) |> ignore


        xmlElement

let sequenceAnnotationFromXml (xElem:XmlElement) (components: ((string*Component) list)) = 
        let id = xElem.GetAttribute("about")
        let (name,displayId,version) = idFromXml(xElem)
        let urlPrefix = id.Substring(0,id.IndexOf("/" + displayId + "/" + version))
        
        let childXmlElements = ([0..(xElem.ChildNodes.Count-1)]
                               |> List.map(fun index -> xElem.ChildNodes.Item(index)))
                               |> List.filter(fun item -> 
                                    match item with 
                                    | :? XmlElement -> true
                                    | _ -> false)
                                |> List.map (fun item -> 
                                    (downcast item:XmlElement))

        let rangeList = childXmlElements |> List.filter(fun elem -> elem.Name = QualifiedName.locationProperty)
        let ranges = rangeList |> List.map(fun locationElem -> 
                        let rangeXml = locationElem.FirstChild
                        match rangeXml with 
                        | :? XmlElement -> 
                            let rangeElem = (downcast rangeXml:XmlElement)
                            Location.Range(rangeFromXml rangeElem)
                        | _ -> failwith "Unexpected Xml Node encountered"
                     )
        let componentList = childXmlElements |> List.filter(fun elem -> elem.Name = QualifiedName.componentProperty)
        if componentList.Length <> 1 then
            failwith "Malformed SBOL XML. Too many or too few Component Property List properties"
        let componentXml = componentList.Item(0)
        let componentUrl = componentXml.GetAttribute("resource")
        let (url,ComponentValue) = match (components |> List.tryFind (fun (url,comp) -> url = componentUrl)) with 
                                    | Some (url,componentValue) -> (url,componentValue)
                                    | None -> failwith "Component not found in SBOL Document. "
        SequenceAnnotation(name,urlPrefix,displayId,version,ComponentValue,ranges)

let rec AddTypesAndRoles list tr (xdoc:XmlDocument, xElement:XmlElement) = 
    match list with 
    | [] -> (xdoc,xElement)
    | elem :: remaining -> 
        match tr with
        | "roles" ->
            let roleXml = xdoc.CreateElement(QualifiedName.role,Terms.sbolns)
            roleXml.SetAttribute("resource",Terms.rdfns,elem) |> ignore
            xElement.AppendChild(roleXml) |> ignore
        | "types" ->
            let typeXml = xdoc.CreateElement(QualifiedName.typeProperty,Terms.sbolns)
            typeXml.SetAttribute("resource",Terms.rdfns,elem) |> ignore
            xElement.AppendChild(typeXml) |> ignore
        | _ -> failwith "unexpected property found"
        AddTypesAndRoles remaining tr (xdoc,xElement)    

let rec AddComponents list (xdoc:XmlDocument,xElement:XmlElement) = 
    match list with 
        | [] -> (xdoc,xElement)
        | (comp:Component) :: remaining ->
            let compXml = xdoc.CreateElement(QualifiedName.componentProperty,Terms.sbolns)
            compXml.AppendChild(serializeComponent xdoc comp) |> ignore
            xElement.AppendChild(compXml) |> ignore
            AddComponents remaining (xdoc,xElement)

let rec AddSequenceAnnotations list (xdoc:XmlDocument,xElement:XmlElement) = 
    match list with 
        | [] -> (xdoc,xElement)
        | (sa:SequenceAnnotation) :: remaining ->
            let saXml = xdoc.CreateElement(QualifiedName.sequenceAnnotationProperty,Terms.sbolns)
            saXml.AppendChild(serializeSequenceAnnotation xdoc sa) |> ignore
            xElement.AppendChild(saXml) |> ignore
            AddSequenceAnnotations remaining (xdoc,xElement)

let serializeComponentDefinition (xdoc:XmlDocument) (x:ComponentDefinition)=
    let xmlElement = xdoc.CreateElement(QualifiedName.ComponentDefinition,Terms.sbolns)
    xmlElement.SetAttribute("about",Terms.rdfns,x.uri) |> ignore

    (* Persistent Identity*)
    let perIdXml = xdoc.CreateElement(QualifiedName.persistentIdentity,Terms.sbolns)
    perIdXml.SetAttribute("resource",Terms.rdfns,x.persistentIdentity) |> ignore
    xmlElement.AppendChild(perIdXml) |> ignore

    (* Display Id*)
    let disIdXml = xdoc.CreateElement(QualifiedName.displayId,Terms.sbolns)
    disIdXml.AppendChild(xdoc.CreateTextNode(x.displayId)) |> ignore
    xmlElement.AppendChild(disIdXml) |> ignore

    (* Version *)
    let verXml = xdoc.CreateElement(QualifiedName.version,Terms.sbolns)
    verXml.AppendChild(xdoc.CreateTextNode(x.version)) |> ignore
    xmlElement.AppendChild(verXml) |> ignore

    (* Name *)
    let nameXml = xdoc.CreateElement(QualifiedName.name,Terms.dctermsns)
    nameXml.AppendChild(xdoc.CreateTextNode(x.name)) |> ignore
    xmlElement.AppendChild(nameXml) |> ignore

    (* Description *)
    if x.description <> "" then
        let descriptionXml = xdoc.CreateElement(QualifiedName.description,Terms.dctermsns)
        descriptionXml.AppendChild(xdoc.CreateTextNode(x.description)) |> ignore
        xmlElement.AppendChild(descriptionXml) |> ignore

    (* Sequence *)
    
    x.sequences 
    |> List.iter (fun seq -> 
        let seqXml = xdoc.CreateElement(QualifiedName.sequenceProperty,Terms.sbolns)
        seqXml.SetAttribute("resource",Terms.rdfns,seq.uri) |> ignore
        xmlElement.AppendChild(seqXml) |> ignore
        )

    (xdoc,xmlElement) = AddTypesAndRoles x.roles "roles" (xdoc,xmlElement) |> ignore
    (xdoc,xmlElement) = AddTypesAndRoles x.types "types" (xdoc,xmlElement) |> ignore

    (xdoc,xmlElement) = AddComponents x.components (xdoc,xmlElement) |> ignore
    (xdoc,xmlElement) = AddSequenceAnnotations x.sequenceAnnotations (xdoc,xmlElement) |> ignore

    xmlElement

let componentDefinitionFromXml (xElem:XmlElement) (seqList: (string*Sequence) list) = 
    let id = xElem.GetAttribute("about")
    let (name,displayId,version) = idFromXml(xElem)
    let urlPrefix = id.Substring(0,id.IndexOf("/" + displayId + "/" + version))

    let childXmlElements = ([0..(xElem.ChildNodes.Count-1)]
                           |> List.map(fun index -> xElem.ChildNodes.Item(index)))
                           |> List.filter(fun item -> 
                                match item with 
                                | :? XmlElement -> true
                                | _ -> false)
                            |> List.map (fun item -> 
                                (downcast item:XmlElement))

    let roleNodeList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.role)
    let typeNodeList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.typeProperty)
    let roleList = roleNodeList |> List.map (fun elem -> elem.GetAttribute("resource"))
    let typeList = typeNodeList |> List.map (fun elem -> elem.GetAttribute("resource"))
    
    let seqNodeList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.sequenceProperty)

    let sequences = match seqNodeList.Length with 
                    | 0 -> []
                    | _ ->  seqNodeList |> List.map(fun seqElem -> 
                            let seqUri = seqElem.GetAttribute("resource")
                            match (seqList |> List.tryFind (fun (uri,seq) -> uri = seqUri)) with 
                            | None -> []
                            | Some(uri,seqValue) -> [seqValue]
                            ) |> List.reduce (fun a b -> a@b)

    let componentNodeList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.componentProperty)

    let components = componentNodeList |> List.map (fun componentElem -> 
                        let componentPropertyNode = componentElem.FirstChild
                        match componentPropertyNode with 
                        | :? XmlElement -> 
                            let (componentPropertyElem:XmlElement) = (downcast componentPropertyNode:XmlElement)
                            componentFromXml componentPropertyElem
                        | _ -> failwith "Unexpected XML Node encountered")
                        
    
    let componentMap = components |> List.map (fun x -> (x.uri,x))

    let saNodeList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.sequenceAnnotationProperty)
    let saList = saNodeList |> List.map ( fun saElem ->
                        let saPropertyNode = saElem.FirstChild
                        match saPropertyNode with 
                        | :? XmlElement -> 
                            let (saPropertyElem:XmlElement) = (downcast saPropertyNode:XmlElement)
                            sequenceAnnotationFromXml saPropertyElem componentMap
                        | _ -> failwith "Unexpected XML Node encountered")
                 
    new ComponentDefinition(name,urlPrefix,displayId,version,typeList,roleList,sequences,components,saList)

let serializeFunctionalComponent (xdoc:XmlDocument) (x:FunctionalComponent)=
    let xmlElement = xdoc.CreateElement(QualifiedName.FunctionalComponent,Terms.sbolns)
    xmlElement.SetAttribute("about",Terms.rdfns,x.uri) |> ignore
    
    (* Persistent Identity*)
    let perIdXml = xdoc.CreateElement(QualifiedName.persistentIdentity,Terms.sbolns)
    perIdXml.SetAttribute("resource",Terms.rdfns,x.persistentIdentity) |> ignore
    xmlElement.AppendChild(perIdXml) |> ignore
    
    (* Display Id*)
    let disIdXml = xdoc.CreateElement(QualifiedName.displayId,Terms.sbolns)
    disIdXml.AppendChild(xdoc.CreateTextNode(x.displayId)) |> ignore
    xmlElement.AppendChild(disIdXml) |> ignore
    
    (* Version *)
    let verXml = xdoc.CreateElement(QualifiedName.version,Terms.sbolns)
    verXml.AppendChild(xdoc.CreateTextNode(x.version)) |> ignore
    xmlElement.AppendChild(verXml) |> ignore
    
    (* Name *)
    let nameXml = xdoc.CreateElement(QualifiedName.name,Terms.dctermsns)
    nameXml.AppendChild(xdoc.CreateTextNode(x.name)) |> ignore
    xmlElement.AppendChild(nameXml) |> ignore
    
    (* Description *)
    if x.description <> "" then
        let descriptionXml = xdoc.CreateElement(QualifiedName.description,Terms.dctermsns)
        descriptionXml.AppendChild(xdoc.CreateTextNode(x.description)) |> ignore
        xmlElement.AppendChild(descriptionXml) |> ignore
    
    (* Access *)
    let accessXml = xdoc.CreateElement(QualifiedName.access,Terms.sbolns)
    accessXml.SetAttribute("resource",Terms.rdfns,x.access) |> ignore
    xmlElement.AppendChild(accessXml) |> ignore
    
    (* Definition -> Basically a pointer to the Component Definition*)
    let defnXml = xdoc.CreateElement(QualifiedName.definition, Terms.sbolns)
    defnXml.SetAttribute("resource",Terms.rdfns,x.definition) |> ignore
    xmlElement.AppendChild(defnXml) |> ignore
    
    (* Direction -> Specifies if it is Input, Output, InOut or None*)
    let dirXml = xdoc.CreateElement(QualifiedName.direction, Terms.sbolns)
    dirXml.SetAttribute("resource",Terms.rdfns,x.direction) |> ignore
    xmlElement.AppendChild(dirXml) |> ignore
    
    xmlElement


let functionalComponentFromXml (xElem:XmlElement) = 
        let id = xElem.GetAttribute("about")
        let (name,displayId,version) = idFromXml(xElem)
        let urlPrefix = id.Substring(0,id.IndexOf("/" + displayId + "/" + version))
        let childXmlElements = ([0..(xElem.ChildNodes.Count-1)]
                               |> List.map(fun index -> xElem.ChildNodes.Item(index)))
                               |> List.filter(fun item -> 
                                    match item with 
                                    | :? XmlElement -> true
                                    | _ -> false)
                                |> List.map (fun item -> 
                                    (downcast item:XmlElement))

        let accessNodeList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.access)
        if accessNodeList.Length <> 1 then
            failwith "Wrong number of access Nodes"
        let accessElem = accessNodeList.Item(0)
        let access = accessElem.GetAttribute("resource")

        let definitionNodeList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.definition)
        if definitionNodeList.Length <> 1 then
            failwith "Wrong number of definition Nodes"
        let definitionElem = definitionNodeList.Item(0)
        let definition = definitionElem.GetAttribute("resource")
        
        let directionNodeList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.direction)
        if directionNodeList.Length <> 1 then
            failwith "Wrong number of direction Nodes"
        
        let directionElem = directionNodeList.Item(0)
        let direction = directionElem.GetAttribute("resource")
        new FunctionalComponent(name,urlPrefix,displayId,version,access,direction,definition)

let rec addRoles rolesList (xdoc:XmlDocument,xElement:XmlElement) = 
        match rolesList with
        | [] -> (xdoc,xElement)
        | role :: remaining -> 
            let roleXml = xdoc.CreateElement(QualifiedName.role,Terms.sbolns)
            roleXml.SetAttribute("resource",Terms.rdfns,role) |> ignore
            xElement.AppendChild(roleXml) |> ignore
            addRoles remaining (xdoc,xElement)

let serializeParticipation (xdoc:XmlDocument) (x:Participation)=
        let xmlElement = xdoc.CreateElement(QualifiedName.Participation,Terms.sbolns)
        xmlElement.SetAttribute("about",Terms.rdfns,x.uri) |> ignore

        (* Persistent Identity*)
        let perIdXml = xdoc.CreateElement(QualifiedName.persistentIdentity,Terms.sbolns)
        perIdXml.SetAttribute("resource",Terms.rdfns,x.persistentIdentity) |> ignore
        xmlElement.AppendChild(perIdXml) |> ignore

        (* Display Id*)
        let disIdXml = xdoc.CreateElement(QualifiedName.displayId,Terms.sbolns)
        disIdXml.AppendChild(xdoc.CreateTextNode(x.displayId)) |> ignore
        xmlElement.AppendChild(disIdXml) |> ignore

        (* Version *)
        let verXml = xdoc.CreateElement(QualifiedName.version,Terms.sbolns)
        verXml.AppendChild(xdoc.CreateTextNode(x.version)) |> ignore
        xmlElement.AppendChild(verXml) |> ignore

        (* Name *)
        let nameXml = xdoc.CreateElement(QualifiedName.name,Terms.dctermsns)
        nameXml.AppendChild(xdoc.CreateTextNode(x.name)) |> ignore
        xmlElement.AppendChild(nameXml) |> ignore

        (* Description *)
        if x.description <> "" then
            let descriptionXml = xdoc.CreateElement(QualifiedName.description,Terms.dctermsns)
            descriptionXml.AppendChild(xdoc.CreateTextNode(x.description)) |> ignore
            xmlElement.AppendChild(descriptionXml) |> ignore
        
        (* Add all roles *)
        (xdoc,xmlElement) = addRoles x.roles (xdoc,xmlElement) |> ignore

        (* Participant -> Pointer to FunctionalComponent*)
        let participantXml = xdoc.CreateElement(QualifiedName.participant,Terms.sbolns)
        participantXml.SetAttribute("resource",Terms.rdfns,x.participant.uri) |> ignore
        xmlElement.AppendChild(participantXml) |> ignore

        xmlElement

let participationFromXml (xElem:XmlElement) (fcomponentMap:((string*FunctionalComponent)list)) = 
    let id = xElem.GetAttribute("about")
    let (name,displayId,version) = idFromXml(xElem)
    let urlPrefix = id.Substring(0,id.IndexOf("/" + displayId + "/" + version))
    
    let childXmlElements = ([0..(xElem.ChildNodes.Count-1)]
                           |> List.map(fun index -> xElem.ChildNodes.Item(index)))
                           |> List.filter(fun item -> 
                                match item with 
                                | :? XmlElement -> true
                                | _ -> false)
                            |> List.map (fun item -> 
                                (downcast item:XmlElement))

    let roleNodeList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.role)
    let roleList = [0..(roleNodeList.Length-1)] 
                   |> List.map(fun index -> 
                     let roleElem = roleNodeList.Item(index)
                     roleElem.GetAttribute("resource"))
    let participantNodeList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.participant)
    if participantNodeList.Length <> 1 then 
        failwith "Wrong number of participant nodes found"
    
    let fcomponents = 
        let participantElem = participantNodeList.Item(0)
        match fcomponentMap |> List.tryFind (fun (url,fcomponent) -> url = participantElem.GetAttribute("resource")) with 
        | Some(_,fcomp) -> fcomp
        | None -> failwith "Functional Component not found in SBOL Document"
    new Participation(name,urlPrefix,displayId,version,roleList,fcomponents)


let rec addTypes typesList (xdoc:XmlDocument,xElement:XmlElement) = 
    match typesList with
    | [] -> (xdoc,xElement)
    | typeProperty :: remaining -> 
        let typeXml = xdoc.CreateElement(QualifiedName.typeProperty,Terms.sbolns)
        typeXml.SetAttribute("resource",Terms.rdfns,typeProperty) |> ignore
        xElement.AppendChild(typeXml) |> ignore
        addTypes remaining (xdoc,xElement)

let rec addParticipations participations (xdoc:XmlDocument, xElement:XmlElement) =
    match participations with 
    | [] -> (xdoc,xElement)
    | (participation:Participation) :: remaining ->
        let participationXml = xdoc.CreateElement(QualifiedName.participationProperty,Terms.sbolns)
        participationXml.AppendChild(serializeParticipation xdoc participation) |> ignore
        xElement.AppendChild(participationXml) |> ignore
        addParticipations remaining (xdoc,xElement) 

let serializeInteraction (xdoc:XmlDocument) (x:Interaction)=
    let xmlElement = xdoc.CreateElement(QualifiedName.Interaction,Terms.sbolns)
    xmlElement.SetAttribute("about",Terms.rdfns,x.uri) |> ignore

    (* Persistent Identity*)
    let perIdXml = xdoc.CreateElement(QualifiedName.persistentIdentity,Terms.sbolns)
    perIdXml.SetAttribute("resource",Terms.rdfns,x.persistentIdentity) |> ignore
    xmlElement.AppendChild(perIdXml) |> ignore

    (* Display Id*)
    let disIdXml = xdoc.CreateElement(QualifiedName.displayId,Terms.sbolns)
    disIdXml.AppendChild(xdoc.CreateTextNode(x.displayId)) |> ignore
    xmlElement.AppendChild(disIdXml) |> ignore

    (* Version *)
    let verXml = xdoc.CreateElement(QualifiedName.version,Terms.sbolns)
    verXml.AppendChild(xdoc.CreateTextNode(x.version)) |> ignore
    xmlElement.AppendChild(verXml) |> ignore

    (* Name *)
    let nameXml = xdoc.CreateElement(QualifiedName.name,Terms.dctermsns)
    nameXml.AppendChild(xdoc.CreateTextNode(x.name)) |> ignore
    xmlElement.AppendChild(nameXml) |> ignore

    (* Description *)
    if x.description <> "" then
        let descriptionXml = xdoc.CreateElement(QualifiedName.description,Terms.dctermsns)
        descriptionXml.AppendChild(xdoc.CreateTextNode(x.description)) |> ignore
        xmlElement.AppendChild(descriptionXml) |> ignore

    (* Add types *)
    (xdoc,xmlElement) = addTypes x.types (xdoc,xmlElement) |> ignore

    (* Add participations *)
    (xdoc, xmlElement) = addParticipations x.participations (xdoc,xmlElement) |> ignore

    xmlElement


let interactionFromXml (xElem:XmlElement) (fcomponentMap:(string*FunctionalComponent)list) =
    let id = xElem.GetAttribute("about")
    let (name,displayId,version) = idFromXml(xElem)
    let urlPrefix = id.Substring(0,id.IndexOf("/" + displayId + "/" + version))
    let childXmlElements = ([0..(xElem.ChildNodes.Count-1)]
                           |> List.map(fun index -> xElem.ChildNodes.Item(index)))
                           |> List.filter(fun item -> 
                                match item with 
                                | :? XmlElement -> true
                                | _ -> false)
                            |> List.map (fun item -> 
                                (downcast item:XmlElement))
    let typeNodeList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.typeProperty)
    let typeList = [0..(typeNodeList.Length-1)] 
                   |> List.map(fun index -> 
                     let typeElem = typeNodeList.Item(index)
                     typeElem.GetAttribute("resource"))

    let participationNodeList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.participationProperty)
    let participationList = [0..(participationNodeList.Length-1)] 
                            |> List.map (fun index -> 
                                let participationProperty = participationNodeList.Item(index)
                                let participationValNode = participationProperty.FirstChild
                                match participationValNode with 
                                | :? XmlElement -> 
                                    let (participationVal:XmlElement) = (downcast participationValNode:XmlElement)
                                    participationFromXml participationVal fcomponentMap
                                | _ -> failwith "Unexpected XML Node encountered")
    new Interaction(name,urlPrefix,displayId,version,typeList,participationList)

let rec addFunctionalComponents fclist (xdoc:XmlDocument,xElement:XmlElement) =
    match fclist with
    | [] -> (xdoc,xElement)
    | (fc:FunctionalComponent) :: remaining -> 
        let fcXml = xdoc.CreateElement(QualifiedName.functionalComponentProperty,Terms.sbolns)
        fcXml.AppendChild(serializeFunctionalComponent xdoc fc) |> ignore
        xElement.AppendChild(fcXml) |> ignore
        addFunctionalComponents remaining (xdoc,xElement)

let rec addInteractions intList (xdoc:XmlDocument, xElement:XmlElement) = 
    match intList with 
    | [] -> (xdoc,xElement)
    | (interaction:Interaction) :: remaining -> 
        let intXml = xdoc.CreateElement(QualifiedName.interactionProperty, Terms.sbolns)
        intXml.AppendChild(serializeInteraction xdoc interaction) |> ignore
        xElement.AppendChild(intXml) |> ignore
        addInteractions remaining (xdoc,xElement)

let serializeModuleDefinition (xdoc:XmlDocument) (x:ModuleDefinition)=
    let xmlElement = xdoc.CreateElement(QualifiedName.ModuleDefinition,Terms.sbolns)
    xmlElement.SetAttribute("about",Terms.rdfns,x.uri) |> ignore

    (* Persistent Identity*)
    let perIdXml = xdoc.CreateElement(QualifiedName.persistentIdentity,Terms.sbolns)
    perIdXml.SetAttribute("resource",Terms.rdfns,x.persistentIdentity) |> ignore
    xmlElement.AppendChild(perIdXml) |> ignore

    (* Display Id*)
    let disIdXml = xdoc.CreateElement(QualifiedName.displayId,Terms.sbolns)
    disIdXml.AppendChild(xdoc.CreateTextNode(x.displayId)) |> ignore
    xmlElement.AppendChild(disIdXml) |> ignore

    (* Version *)
    let verXml = xdoc.CreateElement(QualifiedName.version,Terms.sbolns)
    verXml.AppendChild(xdoc.CreateTextNode(x.version)) |> ignore
    xmlElement.AppendChild(verXml) |> ignore

    (* Name *)
    let nameXml = xdoc.CreateElement(QualifiedName.name,Terms.dctermsns)
    nameXml.AppendChild(xdoc.CreateTextNode(x.name)) |> ignore
    xmlElement.AppendChild(nameXml) |> ignore

    (* Description *)
    if x.description <> "" then
        let descriptionXml = xdoc.CreateElement(QualifiedName.description,Terms.dctermsns)
        descriptionXml.AppendChild(xdoc.CreateTextNode(x.description)) |> ignore
        xmlElement.AppendChild(descriptionXml) |> ignore

    (* Interactions *)
    (xdoc,xmlElement) = addInteractions x.interactions (xdoc,xmlElement) |> ignore

    (* Functional Components *)
    (xdoc,xmlElement) = addFunctionalComponents x.functionalComponents (xdoc,xmlElement) |> ignore

    xmlElement

let moduleDefinitionFromXml (xElem:XmlElement) =
    let id = xElem.GetAttribute("about")
    let (name,displayId,version) = idFromXml(xElem)
    let urlPrefix = id.Substring(0,id.IndexOf("/" + displayId + "/" + version))
    let childXmlElements = ([0..(xElem.ChildNodes.Count-1)]
                           |> List.map(fun index -> xElem.ChildNodes.Item(index)))
                           |> List.filter(fun item -> 
                                match item with 
                                | :? XmlElement -> true
                                | _ -> false)
                            |> List.map (fun item -> 
                                (downcast item:XmlElement))

    let fcList =  childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.functionalComponentProperty)
    let fcs = [0..(fcList.Length-1)] |> List.map( fun index -> 
                let prop = fcList.Item(index)
                let valueNode = prop.FirstChild
                match valueNode with 
                | :? XmlElement -> 
                    let (value:XmlElement) = (downcast valueNode:XmlElement)
                    functionalComponentFromXml value
                | _ -> failwith "Unexpected XML Node encountered"
              )
    
    let interactionList = childXmlElements |> List.filter (fun elem -> elem.Name = QualifiedName.interactionProperty)
    let interactions = [0..(interactionList.Length-1)] |> List.map( fun index -> 
                         let prop = interactionList.Item(index)
                         let valueNode = prop.FirstChild
                         match valueNode with 
                         | :? XmlElement -> 
                             let (value:XmlElement) = (downcast valueNode:XmlElement)
                             interactionFromXml value (fcs |> List.map (fun x -> (x.uri,x)))
                         | _ -> failwith "Unexpected XML Node encountered"
                       )

    new ModuleDefinition(name,urlPrefix,displayId,version,fcs,interactions)






let serializeSBOLDocument (x:SBOLDocument) = 
    let xdoc = new XmlDocument();
    let rootXml = xdoc.CreateElement(QualifiedName.rdfQN,Terms.rdfns) 
    xdoc.AppendChild(rootXml) |> ignore
    xdoc.DocumentElement.SetAttribute(QualifiedName.sbolQN,Terms.sbolns)
    xdoc.DocumentElement.SetAttribute(QualifiedName.dctermsQN,Terms.dctermsns)
    xdoc.DocumentElement.SetAttribute(QualifiedName.provQN,Terms.provns)
    xdoc.AppendChild(rootXml) |> ignore
    x.collection |> List.iter(fun coll -> 
        match coll with
        | ModuleDefinition(md:ModuleDefinition) -> rootXml.AppendChild(serializeModuleDefinition xdoc md) |> ignore
        | ComponentDefinition(cd:ComponentDefinition) -> rootXml.AppendChild(serializeComponentDefinition xdoc cd) |> ignore
        | Sequence(seq:Sequence) -> rootXml.AppendChild(serializeSequence xdoc seq) |> ignore
        
    ) 
    xdoc

let SBOLDocumentFromXML (xdoc:XmlDocument) =
    let rootXml = xdoc.FirstChild 
    match rootXml with 
    | :? XmlElement -> 
        let (rootElem:XmlElement) = (downcast rootXml: XmlElement)
        let cdNodeList = rootElem.GetElementsByTagName(QualifiedName.ComponentDefinition)
        let mdNodeList = rootElem.GetElementsByTagName(QualifiedName.ModuleDefinition)
        let seqNodeList = rootElem.GetElementsByTagName(QualifiedName.Sequence)

        let seqs = 
            [0..(seqNodeList.Count-1)] |> List.map(fun index ->
            let item = seqNodeList.Item(index) 
            match item with 
            | :? XmlElement ->
                let (seqXmlElem:XmlElement) = (downcast item:XmlElement)
                sequenceFromXml seqXmlElem
            | _ -> failwith "Unexpected XML Node encountered")
        let seqTopLevel = seqs |> List.map (fun seq -> Sequence(seq))
        
        let cds = 
            [0..(cdNodeList.Count-1)] |> List.map(fun index -> 
            let item = cdNodeList.Item(index)
            match item with 
            | :? XmlElement -> 
                let (cdXmlElem:XmlElement) = (downcast item:XmlElement)
                componentDefinitionFromXml cdXmlElem (seqs |> List.map (fun x -> (x.uri,x)))
            | _ -> failwith "Unexpected XML Node encountered"
            )
        let cdTopLevel = cds |> List.map(fun cd -> ComponentDefinition(cd))
        
        let mds = 
            [0..(mdNodeList.Count-1)] |> List.map(fun index -> 
            let item = mdNodeList.Item(index)
            match item with 
            | :? XmlElement -> 
                let (mdXmlElem:XmlElement) = (downcast item:XmlElement)
                moduleDefinitionFromXml mdXmlElem 
            | _ -> failwith "Unexpected XML Node encountered"
            )
        let mdTopLevel = mds |> List.map(fun md -> ModuleDefinition(md))

        SBOLDocument(seqTopLevel@cdTopLevel@mdTopLevel)
    | _ -> failwith "Unexpected XML Node encountered"

let sbolXmlString (x:SBOLDocument) = 
    let sw = new StringWriter()
    let xwSettings = new XmlWriterSettings()
    xwSettings.Indent <- true
    xwSettings.Encoding <- Encoding.UTF8
    let xw = XmlWriter.Create(sw,xwSettings)
    let xd = serializeSBOLDocument x
    (serializeSBOLDocument x).WriteTo(xw)
    xw.Close()
    sw.ToString()
