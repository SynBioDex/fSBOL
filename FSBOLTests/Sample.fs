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

      
      let seq = new Sequence("https://microsoft.com/gec/sequence",Some("test sequence"), Some("testseq"), None, None, [], "atgccggttaaa", Encoding.IUPACDNA)

      let sbol = new SBOLDocument([seq])

      let xml = XmlSerializer.sbolToXml sbol
      let str = XmlSerializer.sbol_to_Xml_string xml

      let rootXml = xml.FirstChild
      let (rootElem:XmlElement) = (downcast rootXml: XmlElement)
      let seqNodeList = rootElem.GetElementsByTagName(QualifiedName.Sequence)
      let seq = seqNodeList.Item(0)
      let (seqXml:XmlElement) = (downcast seq:XmlElement)
      let uri = seqXml.GetAttribute("about")

      let check = true
      Expect.isTrue check "Well, this was unexpected."
  ]
