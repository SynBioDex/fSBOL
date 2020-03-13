module FSBOLTests.RoundTripTest

open Expecto
open FSharp.Data
open FSharp.Data.HttpRequestHeaders
open FSharp.Data.HttpMethod

open FSBOL.XmlSerializer
open System.Xml

[<Tests>]
let tests =
  testList "RoundTrip" [
    testCase "Test 1" <| fun _ ->
        
        let sbolfp = System.IO.Path.Combine(__SOURCE_DIRECTORY__,"SBOLTestSuite","SBOL2","singleSequence.xml")
        
        
        let sboltext ="\"" +  System.IO.File.ReadAllText(sbolfp).Replace("\"","\\\"").Replace(System.Environment.NewLine,"") + "\""
        
        let xmldoc = new XmlDocument()
        xmldoc.LoadXml(System.IO.File.ReadAllText(sbolfp))
        let sbol = FSBOL.XmlSerializer.sbolFromXML(xmldoc)

        let sboltxt = (FSBOL.XmlSerializer.sbol_to_XmlString (FSBOL.XmlSerializer.sbolToXml sbol)).Replace("\"","\\\"").Replace(System.Environment.NewLine,"")
        let compareText = "\"" + sboltxt + "\""
        
        let request = """{"options":{"language" : "SBOL2","test_equality": true, "check_uri_compliance": false, "check_completeness": false, "check_best_practices": false, "continue_after_first_error": false, "provide_detailed_stack_trace": false, "insert_type": false, "main_file_name": "main file", "diff_file_name": "comparison file"},"return_file":false,"main_file":""" + sboltext + ""","diff_file":""" + compareText + """}"""
        let a = 1
        // Download web site asynchronously
        
        let testResult = 
            async { let! html = Http.AsyncRequestString( "https://validator.sbolstandard.org/validate/", 
                                                headers = [ ContentType HttpContentTypes.Json ],
                                                body = TextRequest request,
                                                httpMethod = Post)
                    return html }
            |> Async.RunSynchronously
        
        let resultjson = JsonValue.Parse(testResult)
               
        let errors = resultjson.["errors"].AsArray()

        Expecto.Expect.equal (resultjson.["equal"].AsBoolean()) true "They should be equal"
        Expecto.Expect.hasLength errors 1 "Error length can only be 1"
        Expecto.Expect.equal (errors.[0].AsString()) "" "Error must be empty"
        
      




  ]