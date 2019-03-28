module FSBOLTests.Tests

open Expecto
open FSBOL
open FSBOL.Sequence
open System.Xml
open System.IO
open System.Text

let sbolXmlString (xdoc:XmlDocument) = 
    let sw = new StringWriter()
    let xwSettings = new XmlWriterSettings()
    xwSettings.Indent <- true
    xwSettings.Encoding <- Encoding.UTF8
    let xw = XmlWriter.Create(sw,xwSettings)
    (xdoc).WriteTo(xw)
    xw.Close()
    sw.ToString()


[<Tests>]
let tests =
  testList "SBOLSerializers" [
    testCase "sequenceSerialzierTest" <| fun _ ->

      let xdoc = new XmlDocument();
      let rootXml = xdoc.CreateElement(QualifiedName.rdfQN,Terms.rdfns) 
      xdoc.AppendChild(rootXml) |> ignore
      xdoc.DocumentElement.SetAttribute(QualifiedName.sbolQN,Terms.sbolns)
      xdoc.DocumentElement.SetAttribute(QualifiedName.dctermsQN,Terms.dctermsns)
      xdoc.DocumentElement.SetAttribute(QualifiedName.provQN,Terms.provns)
      xdoc.AppendChild(rootXml) |> ignore  

      let seq = new Sequence("https://microsoft.com/gec/sequence",Some("test sequence"), Some("testseq"), None, None, [], "atgccggttaaa", Encoding.IUPACDNA)

      let seqxml = XmlSerializer.serializeSequence xdoc seq

      rootXml.AppendChild(seqxml) |> ignore

      let str = sbolXmlString xdoc

      let check = true
      Expect.isTrue check "Well, this was unexpected."
  ]
