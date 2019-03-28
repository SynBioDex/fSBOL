[<JavaScript>]
module FSBOL.Sequence

open FSBOL.Identifiers
open FSBOL.Terms
open FSBOL.QualifiedName

type Encoding = 
   | IUPACDNA
   | IUPACPROTEIN
   | SMILES
   | OtherEncoding of string
   static member fromURI (s:string) =
     match s with 
     | "http://www.chem.qmul.ac.uk/iubmb/misc/naseq.html" -> IUPACDNA
     | "http://www.chem.qmul.ac.uk/iupac/AminoAcid/" -> IUPACPROTEIN
     | "http://www.opensmiles.org/opensmiles.html" -> SMILES
     | _ -> OtherEncoding(s)
   static member toURI (e:Encoding) = 
     match e with 
     | IUPACDNA -> "http://www.chem.qmul.ac.uk/iubmb/misc/naseq.html"
     | IUPACPROTEIN -> "http://www.chem.qmul.ac.uk/iupac/AminoAcid/"
     | SMILES -> "http://www.opensmiles.org/opensmiles.html" 
     | OtherEncoding(s) -> s 

type Sequence(uri:string,name:string option, displayId:string option, version:string option, persistantId:string option, sequence:string, encoding:Encoding) = 
    
    inherit Identifiers(uri, name, displayId, version, persistantId)

    member x.elements = sequence

    member x.encoding = 
      match encoding with 
      | IUPACDNA -> "http://www.chem.qmul.ac.uk/iubmb/misc/naseq.html"
      | IUPACPROTEIN -> "http://www.chem.qmul.ac.uk/iupac/AminoAcid/"
      | SMILES -> "http://www.opensmiles.org/opensmiles.html"
      | OtherEncoding(uri) -> uri



