(function()
{
 "use strict";
 var Global,FSBOL,Terms,SC$1,QualifiedName,SC$2,Identifiers,Identifiers$1,Sequence,Sequence$1,Component,Component$1,Range,Range$1,SequenceAnnotation,SequenceAnnotation$1,ComponentDefinition,ComponentDefinition$1,FunctionalComponent,FunctionalComponent$1,Participation,Participation$1,Interaction,Interaction$1,ModuleDefinition,ModuleDefinition$1,SBOLDocument,SBOLDocument$1,JsonSerializer,jAnnotation,jSequence,jComponent,jRange,jSequenceAnnotation,jComponentDefinition,jFunctionalComponent,jParticipation,jInteraction,jModuleDefinition,jSBOLDocument,IntelliFactory,Runtime,WebSharper,List,Collections,Dictionary,Operators,Seq,List$1,Enumerator,Map,Arrays,MatchFailureException;
 Global=window;
 FSBOL=Global.FSBOL=Global.FSBOL||{};
 Terms=FSBOL.Terms=FSBOL.Terms||{};
 SC$1=Global.StartupCode$FSBOLJS$Terms=Global.StartupCode$FSBOLJS$Terms||{};
 QualifiedName=FSBOL.QualifiedName=FSBOL.QualifiedName||{};
 SC$2=Global.StartupCode$FSBOLJS$QualifiedName=Global.StartupCode$FSBOLJS$QualifiedName||{};
 Identifiers=FSBOL.Identifiers=FSBOL.Identifiers||{};
 Identifiers$1=Identifiers.Identifiers=Identifiers.Identifiers||{};
 Sequence=FSBOL.Sequence=FSBOL.Sequence||{};
 Sequence$1=Sequence.Sequence=Sequence.Sequence||{};
 Component=FSBOL.Component=FSBOL.Component||{};
 Component$1=Component.Component=Component.Component||{};
 Range=FSBOL.Range=FSBOL.Range||{};
 Range$1=Range.Range=Range.Range||{};
 SequenceAnnotation=FSBOL.SequenceAnnotation=FSBOL.SequenceAnnotation||{};
 SequenceAnnotation$1=SequenceAnnotation.SequenceAnnotation=SequenceAnnotation.SequenceAnnotation||{};
 ComponentDefinition=FSBOL.ComponentDefinition=FSBOL.ComponentDefinition||{};
 ComponentDefinition$1=ComponentDefinition.ComponentDefinition=ComponentDefinition.ComponentDefinition||{};
 FunctionalComponent=FSBOL.FunctionalComponent=FSBOL.FunctionalComponent||{};
 FunctionalComponent$1=FunctionalComponent.FunctionalComponent=FunctionalComponent.FunctionalComponent||{};
 Participation=FSBOL.Participation=FSBOL.Participation||{};
 Participation$1=Participation.Participation=Participation.Participation||{};
 Interaction=FSBOL.Interaction=FSBOL.Interaction||{};
 Interaction$1=Interaction.Interaction=Interaction.Interaction||{};
 ModuleDefinition=FSBOL.ModuleDefinition=FSBOL.ModuleDefinition||{};
 ModuleDefinition$1=ModuleDefinition.ModuleDefinition=ModuleDefinition.ModuleDefinition||{};
 SBOLDocument=FSBOL.SBOLDocument=FSBOL.SBOLDocument||{};
 SBOLDocument$1=SBOLDocument.SBOLDocument=SBOLDocument.SBOLDocument||{};
 JsonSerializer=FSBOL.JsonSerializer=FSBOL.JsonSerializer||{};
 jAnnotation=JsonSerializer.jAnnotation=JsonSerializer.jAnnotation||{};
 jSequence=JsonSerializer.jSequence=JsonSerializer.jSequence||{};
 jComponent=JsonSerializer.jComponent=JsonSerializer.jComponent||{};
 jRange=JsonSerializer.jRange=JsonSerializer.jRange||{};
 jSequenceAnnotation=JsonSerializer.jSequenceAnnotation=JsonSerializer.jSequenceAnnotation||{};
 jComponentDefinition=JsonSerializer.jComponentDefinition=JsonSerializer.jComponentDefinition||{};
 jFunctionalComponent=JsonSerializer.jFunctionalComponent=JsonSerializer.jFunctionalComponent||{};
 jParticipation=JsonSerializer.jParticipation=JsonSerializer.jParticipation||{};
 jInteraction=JsonSerializer.jInteraction=JsonSerializer.jInteraction||{};
 jModuleDefinition=JsonSerializer.jModuleDefinition=JsonSerializer.jModuleDefinition||{};
 jSBOLDocument=JsonSerializer.jSBOLDocument=JsonSerializer.jSBOLDocument||{};
 IntelliFactory=Global.IntelliFactory;
 Runtime=IntelliFactory&&IntelliFactory.Runtime;
 WebSharper=Global.WebSharper;
 List=WebSharper&&WebSharper.List;
 Collections=WebSharper&&WebSharper.Collections;
 Dictionary=Collections&&Collections.Dictionary;
 Operators=WebSharper&&WebSharper.Operators;
 Seq=WebSharper&&WebSharper.Seq;
 List$1=Collections&&Collections.List;
 Enumerator=WebSharper&&WebSharper.Enumerator;
 Map=Collections&&Collections.Map;
 Arrays=WebSharper&&WebSharper.Arrays;
 MatchFailureException=WebSharper&&WebSharper.MatchFailureException;
 Terms.inlineOrientation=function()
 {
  SC$1.$cctor();
  return SC$1.inlineOrientation;
 };
 Terms.product=function()
 {
  SC$1.$cctor();
  return SC$1.product;
 };
 Terms.template=function()
 {
  SC$1.$cctor();
  return SC$1.template;
 };
 Terms.stimulation=function()
 {
  SC$1.$cctor();
  return SC$1.stimulation;
 };
 Terms.stimulated=function()
 {
  SC$1.$cctor();
  return SC$1.stimulated;
 };
 Terms.stimulator=function()
 {
  SC$1.$cctor();
  return SC$1.stimulator;
 };
 Terms.inhibited=function()
 {
  SC$1.$cctor();
  return SC$1.inhibited;
 };
 Terms.inhibitor=function()
 {
  SC$1.$cctor();
  return SC$1.inhibitor;
 };
 Terms.inhibition=function()
 {
  SC$1.$cctor();
  return SC$1.inhibition;
 };
 Terms.production=function()
 {
  SC$1.$cctor();
  return SC$1.production;
 };
 Terms.fcNone=function()
 {
  SC$1.$cctor();
  return SC$1.fcNone;
 };
 Terms.fcInOut=function()
 {
  SC$1.$cctor();
  return SC$1.fcInOut;
 };
 Terms.fcOutput=function()
 {
  SC$1.$cctor();
  return SC$1.fcOutput;
 };
 Terms.fcInput=function()
 {
  SC$1.$cctor();
  return SC$1.fcInput;
 };
 Terms.publicAccess=function()
 {
  SC$1.$cctor();
  return SC$1.publicAccess;
 };
 Terms.privateAccess=function()
 {
  SC$1.$cctor();
  return SC$1.privateAccess;
 };
 Terms.engineeredRegion=function()
 {
  SC$1.$cctor();
  return SC$1.engineeredRegion;
 };
 Terms.terminator=function()
 {
  SC$1.$cctor();
  return SC$1.terminator;
 };
 Terms.rbs=function()
 {
  SC$1.$cctor();
  return SC$1.rbs;
 };
 Terms.promoter=function()
 {
  SC$1.$cctor();
  return SC$1.promoter;
 };
 Terms.pcr=function()
 {
  SC$1.$cctor();
  return SC$1.pcr;
 };
 Terms.cds=function()
 {
  SC$1.$cctor();
  return SC$1.cds;
 };
 Terms.scar=function()
 {
  SC$1.$cctor();
  return SC$1.scar;
 };
 Terms.ribozyme=function()
 {
  SC$1.$cctor();
  return SC$1.ribozyme;
 };
 Terms.protein=function()
 {
  SC$1.$cctor();
  return SC$1.protein;
 };
 Terms.dnaRegion=function()
 {
  SC$1.$cctor();
  return SC$1.dnaRegion;
 };
 Terms.dnasequence=function()
 {
  SC$1.$cctor();
  return SC$1.dnasequence;
 };
 Terms.xmlns=function()
 {
  SC$1.$cctor();
  return SC$1.xmlns;
 };
 Terms.provns=function()
 {
  SC$1.$cctor();
  return SC$1.provns;
 };
 Terms.rdfns=function()
 {
  SC$1.$cctor();
  return SC$1.rdfns;
 };
 Terms.dctermsns=function()
 {
  SC$1.$cctor();
  return SC$1.dctermsns;
 };
 Terms.sbolns=function()
 {
  SC$1.$cctor();
  return SC$1.sbolns;
 };
 Terms.sbo=function()
 {
  SC$1.$cctor();
  return SC$1.sbo;
 };
 Terms.so=function()
 {
  SC$1.$cctor();
  return SC$1.so;
 };
 SC$1.$cctor=function()
 {
  SC$1.$cctor=Global.ignore;
  SC$1.so="http://identifiers.org/so/";
  SC$1.sbo="http://identifiers.org/biomodels.sbo/";
  SC$1.sbolns="http://sbols.org/v2#";
  SC$1.dctermsns="http://purl.org/dc/terms/";
  SC$1.rdfns="http://www.w3.org/1999/02/22-rdf-syntax-ns#";
  SC$1.provns="http://www.w3.org/ns/prov#";
  SC$1.xmlns="http://www.w3.org/2000/xmlns/";
  SC$1.dnasequence="http://www.chem.qmul.ac.uk/iubmb/misc/naseq.html";
  SC$1.dnaRegion="http://www.biopax.org/release/biopax-level3.owl#DnaRegion";
  SC$1.protein="http://www.biopax.org/release/biopax-level3.owl#Protein";
  SC$1.ribozyme=Terms.so()+"SO:0000374";
  SC$1.scar=Terms.so()+"SO:0001953";
  SC$1.cds=Terms.so()+"SO:0000316";
  SC$1.pcr=Terms.so()+"SO:0000316";
  SC$1.promoter=Terms.so()+"SO:0000167";
  SC$1.rbs=Terms.so()+"SO:0000139";
  SC$1.terminator=Terms.so()+"SO:0000141";
  SC$1.engineeredRegion="http://identifiers.org/so/SO:0000804";
  SC$1.privateAccess="http://sbols.org/v2#private";
  SC$1.publicAccess="http://sbols.org/v2#public";
  SC$1.fcInput=Terms.sbolns()+"in";
  SC$1.fcOutput=Terms.sbolns()+"out";
  SC$1.fcInOut=Terms.sbolns()+"inout";
  SC$1.fcNone=Terms.sbolns()+"none";
  SC$1.production=Terms.sbo()+"SBO:0000589";
  SC$1.inhibition=Terms.sbo()+"SBO:0000169";
  SC$1.inhibitor=Terms.sbo()+"SBO:0000020";
  SC$1.inhibited=Terms.sbo()+"SBO:0000642";
  SC$1.stimulator=Terms.sbo()+"SBO:0000459";
  SC$1.stimulated=Terms.sbo()+"SBO:0000643";
  SC$1.stimulation=Terms.sbo()+"SBO:0000170";
  SC$1.template=Terms.sbo()+"SBO:0000645";
  SC$1.product=Terms.sbo()+"SBO:0000011";
  SC$1.inlineOrientation="http://sbols.org/v2#inline";
 };
 QualifiedName.ModuleDefinition=function()
 {
  SC$2.$cctor();
  return SC$2.ModuleDefinition;
 };
 QualifiedName.Interaction=function()
 {
  SC$2.$cctor();
  return SC$2.Interaction;
 };
 QualifiedName.Participation=function()
 {
  SC$2.$cctor();
  return SC$2.Participation;
 };
 QualifiedName.FunctionalComponent=function()
 {
  SC$2.$cctor();
  return SC$2.FunctionalComponent;
 };
 QualifiedName.ComponentDefinition=function()
 {
  SC$2.$cctor();
  return SC$2.ComponentDefinition;
 };
 QualifiedName.Sequence=function()
 {
  SC$2.$cctor();
  return SC$2.Sequence;
 };
 QualifiedName.Component=function()
 {
  SC$2.$cctor();
  return SC$2.Component;
 };
 QualifiedName.SequenceAnnotation=function()
 {
  SC$2.$cctor();
  return SC$2.SequenceAnnotation;
 };
 QualifiedName.Range=function()
 {
  SC$2.$cctor();
  return SC$2.Range;
 };
 QualifiedName.moduleDefinitionProperty=function()
 {
  SC$2.$cctor();
  return SC$2.moduleDefinitionProperty;
 };
 QualifiedName.interactionProperty=function()
 {
  SC$2.$cctor();
  return SC$2.interactionProperty;
 };
 QualifiedName.participationProperty=function()
 {
  SC$2.$cctor();
  return SC$2.participationProperty;
 };
 QualifiedName.functionalComponentProperty=function()
 {
  SC$2.$cctor();
  return SC$2.functionalComponentProperty;
 };
 QualifiedName.componentDefinitionProperty=function()
 {
  SC$2.$cctor();
  return SC$2.componentDefinitionProperty;
 };
 QualifiedName.sequenceProperty=function()
 {
  SC$2.$cctor();
  return SC$2.sequenceProperty;
 };
 QualifiedName.componentProperty=function()
 {
  SC$2.$cctor();
  return SC$2.componentProperty;
 };
 QualifiedName.sequenceAnnotationProperty=function()
 {
  SC$2.$cctor();
  return SC$2.sequenceAnnotationProperty;
 };
 QualifiedName.locationProperty=function()
 {
  SC$2.$cctor();
  return SC$2.locationProperty;
 };
 QualifiedName.participant=function()
 {
  SC$2.$cctor();
  return SC$2.participant;
 };
 QualifiedName.direction=function()
 {
  SC$2.$cctor();
  return SC$2.direction;
 };
 QualifiedName.access=function()
 {
  SC$2.$cctor();
  return SC$2.access;
 };
 QualifiedName.typeProperty=function()
 {
  SC$2.$cctor();
  return SC$2.typeProperty;
 };
 QualifiedName.role=function()
 {
  SC$2.$cctor();
  return SC$2.role;
 };
 QualifiedName.definition=function()
 {
  SC$2.$cctor();
  return SC$2.definition;
 };
 QualifiedName.encoding=function()
 {
  SC$2.$cctor();
  return SC$2.encoding;
 };
 QualifiedName.elements=function()
 {
  SC$2.$cctor();
  return SC$2.elements;
 };
 QualifiedName.orientation=function()
 {
  SC$2.$cctor();
  return SC$2.orientation;
 };
 QualifiedName.endIndex=function()
 {
  SC$2.$cctor();
  return SC$2.endIndex;
 };
 QualifiedName.startIndex=function()
 {
  SC$2.$cctor();
  return SC$2.startIndex;
 };
 QualifiedName.description=function()
 {
  SC$2.$cctor();
  return SC$2.description;
 };
 QualifiedName.name=function()
 {
  SC$2.$cctor();
  return SC$2.name;
 };
 QualifiedName.persistentIdentity=function()
 {
  SC$2.$cctor();
  return SC$2.persistentIdentity;
 };
 QualifiedName.version=function()
 {
  SC$2.$cctor();
  return SC$2.version;
 };
 QualifiedName.displayId=function()
 {
  SC$2.$cctor();
  return SC$2.displayId;
 };
 QualifiedName.id=function()
 {
  SC$2.$cctor();
  return SC$2.id;
 };
 QualifiedName.dctermsQN=function()
 {
  SC$2.$cctor();
  return SC$2.dctermsQN;
 };
 QualifiedName.provQN=function()
 {
  SC$2.$cctor();
  return SC$2.provQN;
 };
 QualifiedName.rdfQN=function()
 {
  SC$2.$cctor();
  return SC$2.rdfQN;
 };
 QualifiedName.sbolQN=function()
 {
  SC$2.$cctor();
  return SC$2.sbolQN;
 };
 SC$2.$cctor=function()
 {
  SC$2.$cctor=Global.ignore;
  SC$2.sbolQN="xmlns:sbol";
  SC$2.rdfQN="rdf:RDF";
  SC$2.provQN="xmlns:prov";
  SC$2.dctermsQN="xmlns:dcterms";
  SC$2.id="rdf:about";
  SC$2.displayId="sbol:displayId";
  SC$2.version="sbol:version";
  SC$2.persistentIdentity="sbol:persistentIdentity";
  SC$2.name="dcterms:title";
  SC$2.description="dcterms:description";
  SC$2.startIndex="sbol:start";
  SC$2.endIndex="sbol:end";
  SC$2.orientation="sbol:orientation";
  SC$2.elements="sbol:elements";
  SC$2.encoding="sbol:encoding";
  SC$2.definition="sbol:definition";
  SC$2.role="sbol:role";
  SC$2.typeProperty="sbol:type";
  SC$2.access="sbol:access";
  SC$2.direction="sbol:direction";
  SC$2.participant="sbol:participant";
  SC$2.locationProperty="sbol:location";
  SC$2.sequenceAnnotationProperty="sbol:sequenceAnnotation";
  SC$2.componentProperty="sbol:component";
  SC$2.sequenceProperty="sbol:sequence";
  SC$2.componentDefinitionProperty="sbol:componentDefinition";
  SC$2.functionalComponentProperty="sbol:functionalComponent";
  SC$2.participationProperty="sbol:participation";
  SC$2.interactionProperty="sbol:interaction";
  SC$2.moduleDefinitionProperty="sbol:moduleDefinition";
  SC$2.Range="sbol:Range";
  SC$2.SequenceAnnotation="sbol:SequenceAnnotation";
  SC$2.Component="sbol:Component";
  SC$2.Sequence="sbol:Sequence";
  SC$2.ComponentDefinition="sbol:ComponentDefinition";
  SC$2.FunctionalComponent="sbol:FunctionalComponent";
  SC$2.Participation="sbol:Participation";
  SC$2.Interaction="sbol:Interaction";
  SC$2.ModuleDefinition="sbol:ModuleDefinition";
 };
 Identifiers$1=Identifiers.Identifiers=Runtime.Class({
  getStringAnnotations:function()
  {
   return List.map(function(y)
   {
    return[y.K,y.V];
   },List.ofSeq(this.get_stringAnnotations()));
  },
  getUriAnnotations:function()
  {
   return List.map(function(y)
   {
    return[y.K,y.V];
   },List.ofSeq(this.get_uriAnnotations()));
  },
  getStringAnnotation:function(key)
  {
   return this.get_stringAnnotations().ContainsKey(key)?{
    $:1,
    $0:this.get_stringAnnotations().get_Item(key)
   }:null;
  },
  getUriAnnotation:function(key)
  {
   return this.get_uriAnnotations().ContainsKey(key)?{
    $:1,
    $0:this.get_uriAnnotations().get_Item(key)
   }:null;
  },
  addStringAnnotation:function(term,str)
  {
   this.get_stringAnnotations().Add(term,str);
  },
  addUriAnnotation:function(term,uri)
  {
   this.get_uriAnnotations().Add(term,uri);
  },
  get_stringAnnotations:function()
  {
   return new Dictionary.New$5();
  },
  get_uriAnnotations:function()
  {
   return new Dictionary.New$5();
  },
  set_description:function(v)
  {
   this.description=v;
  },
  get_description:function()
  {
   return this.description;
  },
  get_uri:function()
  {
   return this.uri;
  },
  get_persistentIdentity:function()
  {
   return this.persistentIdentity;
  },
  get_displayId:function()
  {
   return this.displayId;
  },
  get_name:function()
  {
   return this.name;
  },
  get_version:function()
  {
   return this.version;
  }
 },WebSharper.Obj,Identifiers$1);
 Identifiers$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version)
 {
  var _persistentIdentity;
  _persistentIdentity=urlPrefix+"/"+displayId;
  this.version=version;
  this.name=name;
  this.displayId=displayId;
  this.persistentIdentity=_persistentIdentity;
  this.uri=_persistentIdentity+"/"+version;
  this.description="";
 },Identifiers$1);
 Sequence$1=Sequence.Sequence=Runtime.Class({
  get_encoding:function()
  {
   return this.encoding;
  },
  get_elements:function()
  {
   return this.sequence;
  }
 },Identifiers$1,Sequence$1);
 Sequence$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,sequence,encoding)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.sequence=sequence;
  this.encoding=encoding;
 },Sequence$1);
 Component$1=Component.Component=Runtime.Class({
  get_definition:function()
  {
   return this.definition;
  },
  get_access:function()
  {
   return this.access;
  }
 },Identifiers$1,Component$1);
 Component$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,access,definition)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.access=access;
  this.definition=definition;
 },Component$1);
 Range$1=Range.Range=Runtime.Class({
  get_orientation:function()
  {
   return this.orientation;
  },
  get_endIndex:function()
  {
   return this.endIndex;
  },
  get_startIndex:function()
  {
   return this.startIndex;
  }
 },Identifiers$1,Range$1);
 Range$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,startIndex,endIndex,orientation)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.startIndex=startIndex;
  this.endIndex=endIndex;
  this.orientation=orientation;
 },Range$1);
 SequenceAnnotation$1=SequenceAnnotation.SequenceAnnotation=Runtime.Class({
  get_locations:function()
  {
   return this.locations;
  },
  get_componentObject:function()
  {
   return this.componentObject;
  }
 },Identifiers$1,SequenceAnnotation$1);
 SequenceAnnotation$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,componentObject,locations)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.componentObject=componentObject;
  this.locations=locations;
 },SequenceAnnotation$1);
 ComponentDefinition$1=ComponentDefinition.ComponentDefinition=Runtime.Class({
  get_components:function()
  {
   return this.components;
  },
  get_sequenceAnnotations:function()
  {
   return this.sequenceAnnotations;
  },
  get_sequences:function()
  {
   return this.sequences;
  },
  get_types:function()
  {
   return this.types;
  },
  get_roles:function()
  {
   return this.roles;
  }
 },Identifiers$1,ComponentDefinition$1);
 ComponentDefinition$1.createHigherFunction=function(name,urlPrefix,displayId,version,types,roles,components)
 {
  var componentList,rangeList,sequenceAnnotations,x;
  componentList=List.map(ComponentDefinition$1.createComponent(urlPrefix),components);
  rangeList=ComponentDefinition$1.createRanges(urlPrefix,components);
  sequenceAnnotations=(x=List.zip3(List.ofSeq(Operators.range(1,components.get_Length())),componentList,rangeList),List.map(ComponentDefinition$1.createSequenceAnnotationFromSingleRange(urlPrefix),x));
  return new ComponentDefinition$1.New(name,urlPrefix,displayId,version,types,roles,List.ofArray([new Sequence$1.New(name+"_sequence",urlPrefix,displayId+"_sequence",version,ComponentDefinition$1.getConcatenatedSequence(components),Terms.dnasequence())]),componentList,sequenceAnnotations);
 };
 ComponentDefinition$1.getConcatenatedSequence=function(cdList)
 {
  function concatSeq(cdListL)
  {
   return cdListL.$==1?Seq.fold(function(acc,seq)
   {
    return acc+seq.get_elements();
   },"",cdListL.$0.get_sequences())+concatSeq(cdListL.$1):"";
  }
  return concatSeq(cdList);
 };
 ComponentDefinition$1.createRanges=function(urlPrefix,cdList)
 {
  var index,start,$1,ranges,e,cd,i,e$1,seq;
  index=1;
  start=1;
  ranges=new List$1.New$2();
  e=Enumerator.Get(cdList);
  try
  {
   while(e.MoveNext())
    {
     cd=e.Current();
     i=cd.get_sequences();
     e$1=Enumerator.Get(i);
     try
     {
      while(e$1.MoveNext())
       {
        seq=e$1.Current();
        ranges.Add(new Range$1.New("range",urlPrefix+"annotation"+Global.String(index)+"/range",cd.get_displayId()+"_range",cd.get_version(),start,start+seq.get_elements().length-1,Terms.inlineOrientation()));
        start=start+seq.get_elements().length;
        index=index+1;
       }
     }
     finally
     {
      if("Dispose"in e$1)
       e$1.Dispose();
     }
    }
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
  return List.ofArray(ranges.ToArray());
 };
 ComponentDefinition$1.createSequenceAnnotationFromSingleRange=function(urlPrefix)
 {
  function innerFn(index,comp,range)
  {
   return new SequenceAnnotation$1.New("annotation"+Global.String(index),urlPrefix,"annotation"+Global.String(index),range.get_version(),comp,List.ofArray([{
    $:0,
    $0:range
   }]));
  }
  return function($1)
  {
   return innerFn($1[0],$1[1],$1[2]);
  };
 };
 ComponentDefinition$1.createComponent=function(urlPrefix)
 {
  return function(cd)
  {
   return new Component$1.New(cd.get_name()+"_component",urlPrefix,cd.get_displayId()+"_component",cd.get_version(),Terms.privateAccess(),cd.get_uri());
  };
 };
 ComponentDefinition$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,types,roles,sequences,components,sequenceAnnotations)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.types=types;
  this.roles=roles;
  this.sequences=sequences;
  this.components=components;
  this.sequenceAnnotations=sequenceAnnotations;
 },ComponentDefinition$1);
 FunctionalComponent$1=FunctionalComponent.FunctionalComponent=Runtime.Class({
  get_direction:function()
  {
   return this.direction;
  },
  get_definition:function()
  {
   return this.definition;
  },
  get_access:function()
  {
   return this.access;
  }
 },Identifiers$1,FunctionalComponent$1);
 FunctionalComponent$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,access,direction,definition)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.access=access;
  this.direction=direction;
  this.definition=definition;
 },FunctionalComponent$1);
 Participation$1=Participation.Participation=Runtime.Class({
  get_participant:function()
  {
   return this.participant;
  },
  get_roles:function()
  {
   return this.roles;
  }
 },Identifiers$1,Participation$1);
 Participation$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,roles,participant)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.roles=roles;
  this.participant=participant;
 },Participation$1);
 Interaction$1=Interaction.Interaction=Runtime.Class({
  get_participations:function()
  {
   return this.participations;
  },
  get_types:function()
  {
   return this.types;
  }
 },Identifiers$1,Interaction$1);
 Interaction$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,types,participations)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.types=types;
  this.participations=participations;
 },Interaction$1);
 ModuleDefinition$1=ModuleDefinition.ModuleDefinition=Runtime.Class({
  get_interactions:function()
  {
   return this.interactions;
  },
  get_functionalComponents:function()
  {
   return this.functionalComponents;
  }
 },Identifiers$1,ModuleDefinition$1);
 ModuleDefinition$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,functionalComponents,interactions)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.functionalComponents=functionalComponents;
  this.interactions=interactions;
 },ModuleDefinition$1);
 SBOLDocument$1=SBOLDocument.SBOLDocument=Runtime.Class({
  get_collection:function()
  {
   return List.append(List.map(function(x)
   {
    return{
     $:2,
     $0:x.V
    };
   },List.ofSeq(Map.Fold(function(acc,k,v)
   {
    return acc.Add(k,v);
   },Map.OfArray(Arrays.ofSeq(List.map(function(seq)
   {
    return[seq.get_uri(),seq];
   },List.map(function(a)
   {
    if(a.$==2)
     return a.$0;
    else
     throw new MatchFailureException.New("..\\FSBOL\\SBOLDocument.fs",18,46);
   },List.filter(function(coll)
   {
    return coll.$==2&&true;
   },this.collection))))),Map.OfArray(Arrays.ofSeq(List.map(function(seq)
   {
    return[seq.get_uri(),seq];
   },Seq.reduce(List.append,List.map(function(cdVal)
   {
    return cdVal.get_sequences();
   },List.map(function(a)
   {
    if(a.$==1)
     return a.$0;
    else
     throw new MatchFailureException.New("..\\FSBOL\\SBOLDocument.fs",25,47);
   },List.filter(function(coll)
   {
    return coll.$==1&&true;
   },this.collection)))))))))),List.filter(function(coll)
   {
    return coll.$==2?false:true;
   },this.collection));
  }
 },WebSharper.Obj,SBOLDocument$1);
 SBOLDocument$1.New=Runtime.Ctor(function(collection)
 {
  this.collection=collection;
 },SBOLDocument$1);
 jAnnotation.New=function(Type,name,value)
 {
  return{
   Type:Type,
   name:name,
   value:value
  };
 };
 jSequence.New=function(uri,name,persistentIdentity,displayId,version,description,annotations,elements,encoding)
 {
  return{
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   elements:elements,
   encoding:encoding
  };
 };
 jComponent.New=function(uri,name,persistentIdentity,displayId,version,description,annotations,access,definition)
 {
  return{
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   access:access,
   definition:definition
  };
 };
 jRange.New=function(gecDU,uri,name,persistentIdentity,displayId,version,description,annotations,startIndex,endIndex,orientation)
 {
  return{
   gecDU:gecDU,
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   startIndex:startIndex,
   endIndex:endIndex,
   orientation:orientation
  };
 };
 jSequenceAnnotation.New=function(uri,name,persistentIdentity,displayId,version,description,annotations,Component$2,locations)
 {
  return{
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   Component:Component$2,
   locations:locations
  };
 };
 jComponentDefinition.New=function(uri,name,persistentIdentity,displayId,version,description,annotations,components,sequenceAnnotations,sequences,types,roles)
 {
  return{
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   components:components,
   sequenceAnnotations:sequenceAnnotations,
   sequences:sequences,
   types:types,
   roles:roles
  };
 };
 jFunctionalComponent.New=function(uri,name,persistentIdentity,displayId,version,description,annotations,access,direction,definition)
 {
  return{
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   access:access,
   direction:direction,
   definition:definition
  };
 };
 jParticipation.New=function(uri,name,persistentIdentity,displayId,version,description,annotations,roles,participant)
 {
  return{
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   roles:roles,
   participant:participant
  };
 };
 jInteraction.New=function(uri,name,persistentIdentity,displayId,version,description,annotations,types,participations)
 {
  return{
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   types:types,
   participations:participations
  };
 };
 jModuleDefinition.New=function(uri,name,persistentIdentity,displayId,version,description,annotations,functionalComponents,interactions)
 {
  return{
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   functionalComponents:functionalComponents,
   interactions:interactions
  };
 };
 jSBOLDocument.New=function(componentDefinitions,moduleDefinitions,sequences)
 {
  return{
   componentDefinitions:componentDefinitions,
   moduleDefinitions:moduleDefinitions,
   sequences:sequences
  };
 };
 JsonSerializer.serializeSBOLDocument=function(x)
 {
  return jSBOLDocument.New(Arrays.ofList(List.map(JsonSerializer.serializeComponentDefinition,List.map(function(a)
  {
   if(a.$==1)
    return a.$0;
   else
    throw new MatchFailureException.New("..\\FSBOL\\JsonSerializer.fs",299,31);
  },List.filter(function(y)
  {
   return y.$==1&&true;
  },x.get_collection())))),Arrays.ofList(List.map(JsonSerializer.serializeModuleDefinition,List.map(function(a)
  {
   if(a.$==0)
    return a.$0;
   else
    throw new MatchFailureException.New("..\\FSBOL\\JsonSerializer.fs",304,31);
  },List.filter(function(y)
  {
   return y.$==0&&true;
  },x.get_collection())))),Arrays.ofList(List.map(JsonSerializer.serializeSequence,List.map(function(a)
  {
   if(a.$==2)
    return a.$0;
   else
    throw new MatchFailureException.New("..\\FSBOL\\JsonSerializer.fs",309,32);
  },List.filter(function(y)
  {
   return y.$==2&&true;
  },x.get_collection())))));
 };
 JsonSerializer.serializeModuleDefinition=function(x)
 {
  var annotations,fc,interactions;
  annotations=Arrays.ofList(List.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  fc=Arrays.ofList(List.map(JsonSerializer.serializeFunctionalComponent,x.get_functionalComponents()));
  interactions=Arrays.ofList(List.map(JsonSerializer.serializeInteraction,x.get_interactions()));
  return jModuleDefinition.New(x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,fc,interactions);
 };
 JsonSerializer.serializeInteraction=function(x)
 {
  var annotations,types,participations;
  annotations=Arrays.ofList(List.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  types=Arrays.ofList(x.get_types());
  participations=Arrays.ofList(List.map(JsonSerializer.serializeParticipation,x.get_participations()));
  return jInteraction.New(x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,types,participations);
 };
 JsonSerializer.serializeParticipation=function(x)
 {
  var annotations,roles;
  annotations=Arrays.ofList(List.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  roles=Arrays.ofList(x.get_roles());
  return jParticipation.New(x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,roles,x.get_participant().get_uri());
 };
 JsonSerializer.serializeFunctionalComponent=function(x)
 {
  var annotations;
  annotations=Arrays.ofList(List.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  return jFunctionalComponent.New(x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,x.get_access(),x.get_direction(),x.get_definition());
 };
 JsonSerializer.serializeComponentDefinition=function(x)
 {
  var annotations,seqs,sas,comps,types,roles;
  annotations=Arrays.ofList(List.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  seqs=Arrays.ofList(List.map(function(seq)
  {
   return seq.get_uri();
  },x.get_sequences()));
  sas=Arrays.ofList(List.map(JsonSerializer.serializeSequenceAnnotation,x.get_sequenceAnnotations()));
  comps=Arrays.ofList(List.map(JsonSerializer.serializeComponent,x.get_components()));
  types=Arrays.ofList(x.get_types());
  roles=Arrays.ofList(x.get_roles());
  return jComponentDefinition.New(x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,comps,sas,seqs,types,roles);
 };
 JsonSerializer.serializeSequenceAnnotation=function(x)
 {
  var annotations,locs;
  annotations=Arrays.ofList(List.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  locs=Arrays.ofList(List.map(JsonSerializer.serializeLocation,x.get_locations()));
  return jSequenceAnnotation.New(x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,x.get_componentObject().get_uri(),locs);
 };
 JsonSerializer.serializeLocation=function(x)
 {
  return{
   $:0,
   $0:JsonSerializer.serializeRange(x.$0)
  };
 };
 JsonSerializer.serializeRange=function(x)
 {
  var annotations;
  annotations=Arrays.ofList(List.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  return jRange.New("range",x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,x.get_startIndex(),x.get_endIndex(),x.get_orientation());
 };
 JsonSerializer.serializeComponent=function(x)
 {
  var annotations;
  annotations=Arrays.ofList(List.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  return jComponent.New(x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,x.get_access(),x.get_definition());
 };
 JsonSerializer.serializeSequence=function(x)
 {
  var annotations;
  annotations=Arrays.ofList(List.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  return jSequence.New(x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,x.get_elements(),x.get_encoding());
 };
 JsonSerializer.serializeStringAnnotations=function(stringAnnotations)
 {
  function m(k,v)
  {
   return jAnnotation.New("string",k,v);
  }
  return List.map(function($1)
  {
   return m($1[0],$1[1]);
  },stringAnnotations);
 };
 JsonSerializer.serializeUriAnnotations=function(uriAnnotations)
 {
  function m(k,v)
  {
   return jAnnotation.New("uri",k,v);
  }
  return List.map(function($1)
  {
   return m($1[0],$1[1]);
  },uriAnnotations);
 };
}());
