[<JavaScript>]
module FSBOL.Sequence
open FSBOL.Identifiers

type Encoding = 
   | IUPACDNA
   | IUPACPROTEIN
   | SMALLMOLECULE
   | OtherEncoding of string
   static member fromString: string -> Encoding

type Sequence = 
    inherit Identifiers

    new : uri:string * name:string option * displayId:string option * version:string option * persistantId:string option * sequence:string * encoding:Encoding -> Sequence

    (**)
    member elements:string

    (**) 
    member encoding:string