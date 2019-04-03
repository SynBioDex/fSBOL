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




[<Tests>]
let tests =
  testList "SBOLSerializers" [
    testCase "sequenceSerialzierTest" <| fun _ ->

      let uri =  "https://microsoft.com/gec/sequence"
      let encoding = Encoding.IUPACDNA
      let seq = new Sequence(uri,Some("test sequence"), Some("testseq"), None, None, [], "atgccggttaaa", encoding)

      let sbol = new SBOLDocument([seq])

      let xml = XmlSerializer.sbolToXml sbol
      //let str = XmlSerializer.sbol_to_XmlString xml

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
