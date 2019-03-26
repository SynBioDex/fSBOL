[<JavaScript>]
module FSBOL.Sequence
open FSBOL.Identifiers

type Encoding = 
   | DNA
   | RNA
   | PROTEIN
   | SMALLMOLECULE
   | Other of string
   static member fromString: string -> Encoding

type Sequence = 
    class
    inherit Identifiers

    new : name:string * urlPrefix:string * displayId:string * version:string * sequence:string * encoding:Encoding -> Sequence

    (**)
    member elements:string

    (**) 
    member encoding:string

    end