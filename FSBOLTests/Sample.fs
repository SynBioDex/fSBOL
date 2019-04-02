module FSBOLTests.Tests

open Expecto
open FSBOL
open FSBOL.Sequence
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
      //let str = XmlSerializer.sbol_to_Xml_string xml

      let rootXml = xml.FirstChild
      let (rootElem:XmlElement) = (downcast rootXml: XmlElement)
      let seqNodeList = rootElem.GetElementsByTagName(QualifiedName.Sequence)
      let (seq:XmlElement) = (downcast seqNodeList.Item(0):XmlElement)
      let s = XmlSerializer.sequenceFromXml(seq)

      Expect.equal uri s.uri "Sequence URI doesn't match"
      Expect.equal (Encoding.toURI encoding) s.encoding "Sequence Encoding doesn't match"


  ]
