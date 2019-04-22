module FSBOLTests.Tests

open Expecto
open FSBOL
open FSBOL.Sequence
open FSBOL.Location
open FSBOL.Range
open FSBOL.Cut
open FSBOL.SBOLDocument
open System.Xml
open System.IO
open System.Text
open FSBOL.Annotation



[<Tests>]
let tests =
  testList "SBOLSerializers" [
    testCase "sequenceSerialzierTest" <| fun _ ->

      let uri =  "https://microsoft.com/gec/sequence"
      let encoding = Encoding.IUPACDNA
      let seq = new Sequence(uri,Some("test sequence"), Some("testseq"), None, None, [], "atgccggttaaa", encoding)
        
      let ann1 = new Annotation(Name("experience"),Uri("http://parts.igem.org/cgi/partsdb/part_info.cgi?part_name=BBa_J23119"))
      let ann2 = new Annotation(QualifiedName("pr:value","http://prexample.com"),Literal(Double(0.4)))
      let nestedAnn1 = new NestedAnnotation(QualifiedName("pr:information","http://partsregistry.org/cd/BBa_J23119/information"),"http://partsregistry.org/cd/BBa_J23119/information",[])
      let ann3 = new Annotation(FullQName("pr","info","http://prexample.com"),AnnotationValue.NestedAnnotation(nestedAnn1))
      seq.annotations <- [ann1;ann2;ann3]

      let sbol = new SBOLDocument([seq])

      let xml = XmlSerializer.sbolToXml sbol
      let str = XmlSerializer.sbol_to_XmlString xml

      let rootXml = xml.FirstChild
      let (rootElem:XmlElement) = (downcast rootXml: XmlElement)
      let childXmlElems = XmlSerializer.getChildXmlElements rootElem
      let seqNodeList = childXmlElems |> List.filter(fun xmlElem -> (xmlElem.Name = QualifiedName.Sequence))
      //let seqNodeList = rootElem.GetElementsByTagName(QualifiedName.Sequence)
      let (seq:XmlElement) = seqNodeList.Item(0)
      let s = (XmlSerializer.sbolFromXML xml).sequences.Item(0)
      
      
      Expect.equal uri s.uri "Sequence URI doesn't match"
      Expect.equal (encoding) s.encoding "Sequence Encoding doesn't match"




  ]
