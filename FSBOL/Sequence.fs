[<JavaScript>]
module FSBOL.Sequence

open FSBOL.Identifiers
open FSBOL.Terms
open FSBOL.QualifiedName

type Encoding = 
   | DNA
   | RNA
   | PROTEIN
   | SMALLMOLECULE
   | Other of string
   static member fromString (s:string) =
     match s with 
     | "http://www.chem.qmul.ac.uk/iubmb/misc/naseq.html" -> DNA
     | "http://www.chem.qmul.ac.uk/iupac/AminoAcid/" -> PROTEIN
     | "http://www.opensmiles.org/opensmiles.html" -> SMALLMOLECULE
     | _ -> Other(s)
     

type Sequence(name:string, urlPrefix:string, displayId:string, version:string, sequence:string, encoding:Encoding) = 
    
    inherit Identifiers(name, urlPrefix, displayId, version)

    member x.elements = sequence

    member x.encoding = 
      match encoding with 
      | DNA -> "http://www.chem.qmul.ac.uk/iubmb/misc/naseq.html"
      | RNA -> "http://www.chem.qmul.ac.uk/iubmb/misc/naseq.html"
      | PROTEIN -> "http://www.chem.qmul.ac.uk/iupac/AminoAcid/"
      | SMALLMOLECULE -> "http://www.opensmiles.org/opensmiles.html"
      | Other(uri) -> uri



