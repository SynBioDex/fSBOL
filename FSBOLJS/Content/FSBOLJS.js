// $begin{copyright}
//
// This file is part of WebSharper
//
// Copyright (c) 2008-2016 IntelliFactory
//
// Licensed under the Apache License, Version 2.0 (the "License"); you
// may not use this file except in compliance with the License.  You may
// obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied.  See the License for the specific language governing
// permissions and limitations under the License.
//
// $end{copyright}

IntelliFactory = {
    Runtime: {
        Ctor: function (ctor, typeFunction) {
            ctor.prototype = typeFunction.prototype;
            return ctor;
        },

        Cctor: function (cctor) {
            var init = true;
            return function () {
                if (init) {
                    init = false;
                    cctor();
                }
            };
        },

        Class: function (members, base, statics) {
            var proto = members;
            if (base) {
                proto = new base();
                for (var m in members) { proto[m] = members[m] }
            }
            var typeFunction = function (copyFrom) {
                if (copyFrom) {
                    for (var f in copyFrom) { this[f] = copyFrom[f] }
                }
            }
            typeFunction.prototype = proto;
            if (statics) {
                for (var f in statics) { typeFunction[f] = statics[f] }
            }
            return typeFunction;
        },

        Clone: function (obj) {
            var res = {};
            for (var p in obj) { res[p] = obj[p] }
            return res;
        },

        NewObject:
            function (kv) {
                var o = {};
                for (var i = 0; i < kv.length; i++) {
                    o[kv[i][0]] = kv[i][1];
                }
                return o;
            },

        DeleteEmptyFields:
            function (obj, fields) {
                for (var i = 0; i < fields.length; i++) {
                    var f = fields[i];
                    if (obj[f] === void (0)) { delete obj[f]; }
                }
                return obj;
            },

        GetOptional:
            function (value) {
                return (value === void (0)) ? null : { $: 1, $0: value };
            },

        SetOptional:
            function (obj, field, value) {
                if (value) {
                    obj[field] = value.$0;
                } else {
                    delete obj[field];
                }
            },

        SetOrDelete:
            function (obj, field, value) {
                if (value === void (0)) {
                    delete obj[field];
                } else {
                    obj[field] = value;
                }
            },

        Apply: function (f, obj, args) {
            return f.apply(obj, args);
        },

        Bind: function (f, obj) {
            return function () { return f.apply(this, arguments) };
        },

        CreateFuncWithArgs: function (f) {
            return function () { return f(Array.prototype.slice.call(arguments)) };
        },

        CreateFuncWithOnlyThis: function (f) {
            return function () { return f(this) };
        },

        CreateFuncWithThis: function (f) {
            return function () { return f(this).apply(null, arguments) };
        },

        CreateFuncWithThisArgs: function (f) {
            return function () { return f(this)(Array.prototype.slice.call(arguments)) };
        },

        CreateFuncWithRest: function (length, f) {
            return function () { return f(Array.prototype.slice.call(arguments, 0, length).concat([Array.prototype.slice.call(arguments, length)])) };
        },

        CreateFuncWithArgsRest: function (length, f) {
            return function () { return f([Array.prototype.slice.call(arguments, 0, length), Array.prototype.slice.call(arguments, length)]) };
        },

        BindDelegate: function (func, obj) {
            var res = func.bind(obj);
            res.$Func = func;
            res.$Target = obj;
            return res;
        },

        CreateDelegate: function (invokes) {
            if (invokes.length == 0) return null;
            if (invokes.length == 1) return invokes[0];
            var del = function () {
                var res;
                for (var i = 0; i < invokes.length; i++) {
                    res = invokes[i].apply(null, arguments);
                }
                return res;
            };
            del.$Invokes = invokes;
            return del;
        },

        CombineDelegates: function (dels) {
            var invokes = [];
            for (var i = 0; i < dels.length; i++) {
                var del = dels[i];
                if (del) {
                    if ("$Invokes" in del)
                        invokes = invokes.concat(del.$Invokes);
                    else
                        invokes.push(del);
                }
            }
            return IntelliFactory.Runtime.CreateDelegate(invokes);
        },

        DelegateEqual: function (d1, d2) {
            if (d1 === d2) return true;
            if (d1 == null || d2 == null) return false;
            var i1 = d1.$Invokes || [d1];
            var i2 = d2.$Invokes || [d2];
            if (i1.length != i2.length) return false;
            for (var i = 0; i < i1.length; i++) {
                var e1 = i1[i];
                var e2 = i2[i];
                if (!(e1 === e2 || ("$Func" in e1 && "$Func" in e2 && e1.$Func === e2.$Func && e1.$Target == e2.$Target)))
                    return false;
            }
            return true;
        },

        ThisFunc: function (d) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);
                return d.apply(null, args);
            };
        },

        ThisFuncOut: function (f) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return f.apply(args.shift(), args);
            };
        },

        ParamsFunc: function (length, d) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return d.apply(null, args.slice(0, length).concat([args.slice(length)]));
            };
        },

        ParamsFuncOut: function (length, f) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return f.apply(null, args.slice(0, length).concat(args[length]));
            };
        },

        ThisParamsFunc: function (length, d) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);
                return d.apply(null, args.slice(0, length + 1).concat([args.slice(length + 1)]));
            };
        },

        ThisParamsFuncOut: function (length, f) {
            return function () {
                var args = Array.prototype.slice.call(arguments);
                return f.apply(args.shift(), args.slice(0, length).concat(args[length]));
            };
        },

        Curried: function (f, n, args) {
            args = args || [];
            return function (a) {
                var allArgs = args.concat([a === void (0) ? null : a]);
                if (n == 1)
                    return f.apply(null, allArgs);
                if (n == 2)
                    return function (a) { return f.apply(null, allArgs.concat([a === void (0) ? null : a])); }
                return IntelliFactory.Runtime.Curried(f, n - 1, allArgs);
            }
        },

        Curried2: function (f) {
            return function (a) { return function (b) { return f(a, b); } }
        },

        Curried3: function (f) {
            return function (a) { return function (b) { return function (c) { return f(a, b, c); } } }
        },

        UnionByType: function (types, value, optional) {
            var vt = typeof value;
            for (var i = 0; i < types.length; i++) {
                var t = types[i];
                if (typeof t == "number") {
                    if (Array.isArray(value) && (t == 0 || value.length == t)) {
                        return { $: i, $0: value };
                    }
                } else {
                    if (t == vt) {
                        return { $: i, $0: value };
                    }
                }
            }
            if (!optional) {
                throw new Error("Type not expected for creating Choice value.");
            }
        },

        OnLoad:
            function (f) {
                if (!("load" in this)) {
                    this.load = [];
                }
                this.load.push(f);
            },

        Start:
            function () {
                function run(c) {
                    for (var i = 0; i < c.length; i++) {
                        c[i]();
                    }
                }
                if ("load" in this) {
                    run(this.load);
                    this.load = [];
                }
            },
    }
}

IntelliFactory.Runtime.OnLoad(function () {
    if (window.WebSharper && WebSharper.Activator && WebSharper.Activator.Activate)
        WebSharper.Activator.Activate()
});

// Polyfill

if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}

if (!Math.trunc) {
    Math.trunc = function (x) {
        return x < 0 ? Math.ceil(x) : Math.floor(x);
    }
}

function ignore() { };
function id(x) { return x };
function fst(x) { return x[0] };
function snd(x) { return x[1] };
function trd(x) { return x[2] };

if (!console) {
    console = {
        count: ignore,
        dir: ignore,
        error: ignore,
        group: ignore,
        groupEnd: ignore,
        info: ignore,
        log: ignore,
        profile: ignore,
        profileEnd: ignore,
        time: ignore,
        timeEnd: ignore,
        trace: ignore,
        warn: ignore
    }
};
(function()
{
 "use strict";
 var Global,Microsoft,Research,FSBOL,Terms,SC$1,QualifiedName,SC$2,Identifiers,Identifiers$1,Sequence,Sequence$1,Component,Component$1,Range,Range$1,SequenceAnnotation,SequenceAnnotation$1,ComponentDefinition,ComponentDefinition$1,FunctionalComponent,FunctionalComponent$1,Participation,Participation$1,Interaction,Interaction$1,ModuleDefinition,ModuleDefinition$1,SBOLDocument,SBOLDocument$1,JsonSerializer,jAnnotation,jSequence,jComponent,jRange,jSequenceAnnotation,jComponentDefinition,jFunctionalComponent,jParticipation,jInteraction,jModuleDefinition,jSBOLDocument,SPAEntryPoint,Client,WebSharper,Collections,BalancedTree,Tree,Pair,MapUtil,FSharpMap,Map,FSharpSet,Set,ListEnumerator,List,ResizeArray,LinkedListEnumerator,LinkedList,Grouping,FsComparer,ProjectionComparer,CompoundComparer,ReverseComparer,OrderedEnumerable,Linq,Control,Observer,Message,HotStream,HotStream$1,Observable,FSharp,Control$1,ObservableModule,Event,Event$1,DelegateEvent,DelegateEvent$1,FSharpEvent,FSharpDelegateEvent,EventModule,MailboxProcessor,JavaScript,JSModule,EqualityComparer,MacroModule,EquatableEqualityComparer,BaseEqualityComparer,Comparer,ComparableComparer,BaseComparer,Pervasives,Json,Remoting,XhrProvider,AjaxRemotingProvider,SC$3,PrintfHelpers,Concurrency,Scheduler,SC$4,Enumerator,T,HtmlContentExtensions,SingleNode,Activator,Optional,Arrays,Seq,List$1,Arrays2D,CancellationTokenSource,Char,Util,DateUtil,DateTimeOffset,Delegate,DictionaryUtil,KeyCollection,ValueCollection,Dictionary,MatchFailureException,IndexOutOfRangeException,OperationCanceledException,ArgumentException,ArgumentOutOfRangeException,InvalidOperationException,AggregateException,TimeoutException,FormatException,OverflowException,Guid,HashSetUtil,HashSet,Lazy,T$1,Nullable,Operators,Slice,Option,Queue,Random,Ref,Result,Stack,Strings,Task,Task1,TaskCompletionSource,Unchecked,Numeric,Provider,Web,Control$2,FSharpInlineControl,InlineControl,IntelliFactory,Runtime,JSON,Date,console,String,Math;
 Global=window;
 Microsoft=Global.Microsoft=Global.Microsoft||{};
 Research=Microsoft.Research=Microsoft.Research||{};
 FSBOL=Research.FSBOL=Research.FSBOL||{};
 Terms=FSBOL.Terms=FSBOL.Terms||{};
 SC$1=Global.StartupCode$FSBOLJS$Terms=Global.StartupCode$FSBOLJS$Terms||{};
 QualifiedName=FSBOL.QualifiedName=FSBOL.QualifiedName||{};
 SC$2=Global.StartupCode$FSBOLJS$QualifiedName=Global.StartupCode$FSBOLJS$QualifiedName||{};
 Identifiers=FSBOL.Identifiers=FSBOL.Identifiers||{};
 Identifiers$1=Identifiers.Identifiers=Identifiers.Identifiers||{};
 Sequence=FSBOL.Sequence=FSBOL.Sequence||{};
 Sequence$1=Sequence.Sequence=Sequence.Sequence||{};
 Component=FSBOL.Component=FSBOL.Component||{};
 Component$1=Component.Component=Component.Component||{};
 Range=FSBOL.Range=FSBOL.Range||{};
 Range$1=Range.Range=Range.Range||{};
 SequenceAnnotation=FSBOL.SequenceAnnotation=FSBOL.SequenceAnnotation||{};
 SequenceAnnotation$1=SequenceAnnotation.SequenceAnnotation=SequenceAnnotation.SequenceAnnotation||{};
 ComponentDefinition=FSBOL.ComponentDefinition=FSBOL.ComponentDefinition||{};
 ComponentDefinition$1=ComponentDefinition.ComponentDefinition=ComponentDefinition.ComponentDefinition||{};
 FunctionalComponent=FSBOL.FunctionalComponent=FSBOL.FunctionalComponent||{};
 FunctionalComponent$1=FunctionalComponent.FunctionalComponent=FunctionalComponent.FunctionalComponent||{};
 Participation=FSBOL.Participation=FSBOL.Participation||{};
 Participation$1=Participation.Participation=Participation.Participation||{};
 Interaction=FSBOL.Interaction=FSBOL.Interaction||{};
 Interaction$1=Interaction.Interaction=Interaction.Interaction||{};
 ModuleDefinition=FSBOL.ModuleDefinition=FSBOL.ModuleDefinition||{};
 ModuleDefinition$1=ModuleDefinition.ModuleDefinition=ModuleDefinition.ModuleDefinition||{};
 SBOLDocument=FSBOL.SBOLDocument=FSBOL.SBOLDocument||{};
 SBOLDocument$1=SBOLDocument.SBOLDocument=SBOLDocument.SBOLDocument||{};
 JsonSerializer=FSBOL.JsonSerializer=FSBOL.JsonSerializer||{};
 jAnnotation=JsonSerializer.jAnnotation=JsonSerializer.jAnnotation||{};
 jSequence=JsonSerializer.jSequence=JsonSerializer.jSequence||{};
 jComponent=JsonSerializer.jComponent=JsonSerializer.jComponent||{};
 jRange=JsonSerializer.jRange=JsonSerializer.jRange||{};
 jSequenceAnnotation=JsonSerializer.jSequenceAnnotation=JsonSerializer.jSequenceAnnotation||{};
 jComponentDefinition=JsonSerializer.jComponentDefinition=JsonSerializer.jComponentDefinition||{};
 jFunctionalComponent=JsonSerializer.jFunctionalComponent=JsonSerializer.jFunctionalComponent||{};
 jParticipation=JsonSerializer.jParticipation=JsonSerializer.jParticipation||{};
 jInteraction=JsonSerializer.jInteraction=JsonSerializer.jInteraction||{};
 jModuleDefinition=JsonSerializer.jModuleDefinition=JsonSerializer.jModuleDefinition||{};
 jSBOLDocument=JsonSerializer.jSBOLDocument=JsonSerializer.jSBOLDocument||{};
 SPAEntryPoint=Global.SPAEntryPoint=Global.SPAEntryPoint||{};
 Client=SPAEntryPoint.Client=SPAEntryPoint.Client||{};
 WebSharper=Global.WebSharper=Global.WebSharper||{};
 Collections=WebSharper.Collections=WebSharper.Collections||{};
 BalancedTree=Collections.BalancedTree=Collections.BalancedTree||{};
 Tree=BalancedTree.Tree=BalancedTree.Tree||{};
 Pair=Collections.Pair=Collections.Pair||{};
 MapUtil=Collections.MapUtil=Collections.MapUtil||{};
 FSharpMap=Collections.FSharpMap=Collections.FSharpMap||{};
 Map=Collections.Map=Collections.Map||{};
 FSharpSet=Collections.FSharpSet=Collections.FSharpSet||{};
 Set=Collections.Set=Collections.Set||{};
 ListEnumerator=Collections.ListEnumerator=Collections.ListEnumerator||{};
 List=Collections.List=Collections.List||{};
 ResizeArray=Collections.ResizeArray=Collections.ResizeArray||{};
 LinkedListEnumerator=Collections.LinkedListEnumerator=Collections.LinkedListEnumerator||{};
 LinkedList=Collections.LinkedList=Collections.LinkedList||{};
 Grouping=WebSharper.Grouping=WebSharper.Grouping||{};
 FsComparer=WebSharper.FsComparer=WebSharper.FsComparer||{};
 ProjectionComparer=WebSharper.ProjectionComparer=WebSharper.ProjectionComparer||{};
 CompoundComparer=WebSharper.CompoundComparer=WebSharper.CompoundComparer||{};
 ReverseComparer=WebSharper.ReverseComparer=WebSharper.ReverseComparer||{};
 OrderedEnumerable=WebSharper.OrderedEnumerable=WebSharper.OrderedEnumerable||{};
 Linq=WebSharper.Linq=WebSharper.Linq||{};
 Control=WebSharper.Control=WebSharper.Control||{};
 Observer=Control.Observer=Control.Observer||{};
 Message=Observer.Message=Observer.Message||{};
 HotStream=Control.HotStream=Control.HotStream||{};
 HotStream$1=HotStream.HotStream=HotStream.HotStream||{};
 Observable=Control.Observable=Control.Observable||{};
 FSharp=Microsoft.FSharp=Microsoft.FSharp||{};
 Control$1=FSharp.Control=FSharp.Control||{};
 ObservableModule=Control$1.ObservableModule=Control$1.ObservableModule||{};
 Event=Control.Event=Control.Event||{};
 Event$1=Event.Event=Event.Event||{};
 DelegateEvent=Control.DelegateEvent=Control.DelegateEvent||{};
 DelegateEvent$1=DelegateEvent.DelegateEvent=DelegateEvent.DelegateEvent||{};
 FSharpEvent=Control.FSharpEvent=Control.FSharpEvent||{};
 FSharpDelegateEvent=Control.FSharpDelegateEvent=Control.FSharpDelegateEvent||{};
 EventModule=Control$1.EventModule=Control$1.EventModule||{};
 MailboxProcessor=Control.MailboxProcessor=Control.MailboxProcessor||{};
 JavaScript=WebSharper.JavaScript=WebSharper.JavaScript||{};
 JSModule=JavaScript.JSModule=JavaScript.JSModule||{};
 EqualityComparer=Collections.EqualityComparer=Collections.EqualityComparer||{};
 MacroModule=WebSharper.MacroModule=WebSharper.MacroModule||{};
 EquatableEqualityComparer=MacroModule.EquatableEqualityComparer=MacroModule.EquatableEqualityComparer||{};
 BaseEqualityComparer=MacroModule.BaseEqualityComparer=MacroModule.BaseEqualityComparer||{};
 Comparer=Collections.Comparer=Collections.Comparer||{};
 ComparableComparer=MacroModule.ComparableComparer=MacroModule.ComparableComparer||{};
 BaseComparer=MacroModule.BaseComparer=MacroModule.BaseComparer||{};
 Pervasives=JavaScript.Pervasives=JavaScript.Pervasives||{};
 Json=WebSharper.Json=WebSharper.Json||{};
 Remoting=WebSharper.Remoting=WebSharper.Remoting||{};
 XhrProvider=Remoting.XhrProvider=Remoting.XhrProvider||{};
 AjaxRemotingProvider=Remoting.AjaxRemotingProvider=Remoting.AjaxRemotingProvider||{};
 SC$3=Global.StartupCode$WebSharper_Main$Remoting=Global.StartupCode$WebSharper_Main$Remoting||{};
 PrintfHelpers=WebSharper.PrintfHelpers=WebSharper.PrintfHelpers||{};
 Concurrency=WebSharper.Concurrency=WebSharper.Concurrency||{};
 Scheduler=Concurrency.Scheduler=Concurrency.Scheduler||{};
 SC$4=Global.StartupCode$WebSharper_Main$Concurrency=Global.StartupCode$WebSharper_Main$Concurrency||{};
 Enumerator=WebSharper.Enumerator=WebSharper.Enumerator||{};
 T=Enumerator.T=Enumerator.T||{};
 HtmlContentExtensions=WebSharper.HtmlContentExtensions=WebSharper.HtmlContentExtensions||{};
 SingleNode=HtmlContentExtensions.SingleNode=HtmlContentExtensions.SingleNode||{};
 Activator=WebSharper.Activator=WebSharper.Activator||{};
 Optional=JavaScript.Optional=JavaScript.Optional||{};
 Arrays=WebSharper.Arrays=WebSharper.Arrays||{};
 Seq=WebSharper.Seq=WebSharper.Seq||{};
 List$1=WebSharper.List=WebSharper.List||{};
 Arrays2D=WebSharper.Arrays2D=WebSharper.Arrays2D||{};
 CancellationTokenSource=WebSharper.CancellationTokenSource=WebSharper.CancellationTokenSource||{};
 Char=WebSharper.Char=WebSharper.Char||{};
 Util=WebSharper.Util=WebSharper.Util||{};
 DateUtil=WebSharper.DateUtil=WebSharper.DateUtil||{};
 DateTimeOffset=WebSharper.DateTimeOffset=WebSharper.DateTimeOffset||{};
 Delegate=WebSharper.Delegate=WebSharper.Delegate||{};
 DictionaryUtil=Collections.DictionaryUtil=Collections.DictionaryUtil||{};
 KeyCollection=Collections.KeyCollection=Collections.KeyCollection||{};
 ValueCollection=Collections.ValueCollection=Collections.ValueCollection||{};
 Dictionary=Collections.Dictionary=Collections.Dictionary||{};
 MatchFailureException=WebSharper.MatchFailureException=WebSharper.MatchFailureException||{};
 IndexOutOfRangeException=WebSharper.IndexOutOfRangeException=WebSharper.IndexOutOfRangeException||{};
 OperationCanceledException=WebSharper.OperationCanceledException=WebSharper.OperationCanceledException||{};
 ArgumentException=WebSharper.ArgumentException=WebSharper.ArgumentException||{};
 ArgumentOutOfRangeException=WebSharper.ArgumentOutOfRangeException=WebSharper.ArgumentOutOfRangeException||{};
 InvalidOperationException=WebSharper.InvalidOperationException=WebSharper.InvalidOperationException||{};
 AggregateException=WebSharper.AggregateException=WebSharper.AggregateException||{};
 TimeoutException=WebSharper.TimeoutException=WebSharper.TimeoutException||{};
 FormatException=WebSharper.FormatException=WebSharper.FormatException||{};
 OverflowException=WebSharper.OverflowException=WebSharper.OverflowException||{};
 Guid=WebSharper.Guid=WebSharper.Guid||{};
 HashSetUtil=Collections.HashSetUtil=Collections.HashSetUtil||{};
 HashSet=Collections.HashSet=Collections.HashSet||{};
 Lazy=WebSharper.Lazy=WebSharper.Lazy||{};
 T$1=List$1.T=List$1.T||{};
 Nullable=WebSharper.Nullable=WebSharper.Nullable||{};
 Operators=WebSharper.Operators=WebSharper.Operators||{};
 Slice=WebSharper.Slice=WebSharper.Slice||{};
 Option=WebSharper.Option=WebSharper.Option||{};
 Queue=WebSharper.Queue=WebSharper.Queue||{};
 Random=WebSharper.Random=WebSharper.Random||{};
 Ref=WebSharper.Ref=WebSharper.Ref||{};
 Result=WebSharper.Result=WebSharper.Result||{};
 Stack=WebSharper.Stack=WebSharper.Stack||{};
 Strings=WebSharper.Strings=WebSharper.Strings||{};
 Task=WebSharper.Task=WebSharper.Task||{};
 Task1=WebSharper.Task1=WebSharper.Task1||{};
 TaskCompletionSource=WebSharper.TaskCompletionSource=WebSharper.TaskCompletionSource||{};
 Unchecked=WebSharper.Unchecked=WebSharper.Unchecked||{};
 Numeric=WebSharper.Numeric=WebSharper.Numeric||{};
 Provider=Json.Provider=Json.Provider||{};
 Web=WebSharper.Web=WebSharper.Web||{};
 Control$2=Web.Control=Web.Control||{};
 FSharpInlineControl=Web.FSharpInlineControl=Web.FSharpInlineControl||{};
 InlineControl=Web.InlineControl=Web.InlineControl||{};
 IntelliFactory=Global.IntelliFactory;
 Runtime=IntelliFactory&&IntelliFactory.Runtime;
 JSON=Global.JSON;
 Date=Global.Date;
 console=Global.console;
 String=Global.String;
 Math=Global.Math;
 Terms.inlineOrientation=function()
 {
  SC$1.$cctor();
  return SC$1.inlineOrientation;
 };
 Terms.product=function()
 {
  SC$1.$cctor();
  return SC$1.product;
 };
 Terms.template=function()
 {
  SC$1.$cctor();
  return SC$1.template;
 };
 Terms.stimulation=function()
 {
  SC$1.$cctor();
  return SC$1.stimulation;
 };
 Terms.stimulated=function()
 {
  SC$1.$cctor();
  return SC$1.stimulated;
 };
 Terms.stimulator=function()
 {
  SC$1.$cctor();
  return SC$1.stimulator;
 };
 Terms.inhibited=function()
 {
  SC$1.$cctor();
  return SC$1.inhibited;
 };
 Terms.inhibitor=function()
 {
  SC$1.$cctor();
  return SC$1.inhibitor;
 };
 Terms.inhibition=function()
 {
  SC$1.$cctor();
  return SC$1.inhibition;
 };
 Terms.production=function()
 {
  SC$1.$cctor();
  return SC$1.production;
 };
 Terms.fcNone=function()
 {
  SC$1.$cctor();
  return SC$1.fcNone;
 };
 Terms.fcInOut=function()
 {
  SC$1.$cctor();
  return SC$1.fcInOut;
 };
 Terms.fcOutput=function()
 {
  SC$1.$cctor();
  return SC$1.fcOutput;
 };
 Terms.fcInput=function()
 {
  SC$1.$cctor();
  return SC$1.fcInput;
 };
 Terms.publicAccess=function()
 {
  SC$1.$cctor();
  return SC$1.publicAccess;
 };
 Terms.privateAccess=function()
 {
  SC$1.$cctor();
  return SC$1.privateAccess;
 };
 Terms.engineeredRegion=function()
 {
  SC$1.$cctor();
  return SC$1.engineeredRegion;
 };
 Terms.terminator=function()
 {
  SC$1.$cctor();
  return SC$1.terminator;
 };
 Terms.rbs=function()
 {
  SC$1.$cctor();
  return SC$1.rbs;
 };
 Terms.promoter=function()
 {
  SC$1.$cctor();
  return SC$1.promoter;
 };
 Terms.pcr=function()
 {
  SC$1.$cctor();
  return SC$1.pcr;
 };
 Terms.cds=function()
 {
  SC$1.$cctor();
  return SC$1.cds;
 };
 Terms.scar=function()
 {
  SC$1.$cctor();
  return SC$1.scar;
 };
 Terms.ribozyme=function()
 {
  SC$1.$cctor();
  return SC$1.ribozyme;
 };
 Terms.protein=function()
 {
  SC$1.$cctor();
  return SC$1.protein;
 };
 Terms.dnaRegion=function()
 {
  SC$1.$cctor();
  return SC$1.dnaRegion;
 };
 Terms.dnasequence=function()
 {
  SC$1.$cctor();
  return SC$1.dnasequence;
 };
 Terms.xmlns=function()
 {
  SC$1.$cctor();
  return SC$1.xmlns;
 };
 Terms.provns=function()
 {
  SC$1.$cctor();
  return SC$1.provns;
 };
 Terms.rdfns=function()
 {
  SC$1.$cctor();
  return SC$1.rdfns;
 };
 Terms.dctermsns=function()
 {
  SC$1.$cctor();
  return SC$1.dctermsns;
 };
 Terms.sbolns=function()
 {
  SC$1.$cctor();
  return SC$1.sbolns;
 };
 Terms.sbo=function()
 {
  SC$1.$cctor();
  return SC$1.sbo;
 };
 Terms.so=function()
 {
  SC$1.$cctor();
  return SC$1.so;
 };
 SC$1.$cctor=Runtime.Cctor(function()
 {
  SC$1.so="http://identifiers.org/so/";
  SC$1.sbo="http://identifiers.org/biomodels.sbo/";
  SC$1.sbolns="http://sbols.org/v2#";
  SC$1.dctermsns="http://purl.org/dc/terms/";
  SC$1.rdfns="http://www.w3.org/1999/02/22-rdf-syntax-ns#";
  SC$1.provns="http://www.w3.org/ns/prov#";
  SC$1.xmlns="http://www.w3.org/2000/xmlns/";
  SC$1.dnasequence="http://www.chem.qmul.ac.uk/iubmb/misc/naseq.html";
  SC$1.dnaRegion="http://www.biopax.org/release/biopax-level3.owl#DnaRegion";
  SC$1.protein="http://www.biopax.org/release/biopax-level3.owl#Protein";
  SC$1.ribozyme=Terms.so()+"SO:0000374";
  SC$1.scar=Terms.so()+"SO:0001953";
  SC$1.cds=Terms.so()+"SO:0000316";
  SC$1.pcr=Terms.so()+"SO:0000316";
  SC$1.promoter=Terms.so()+"SO:0000167";
  SC$1.rbs=Terms.so()+"SO:0000139";
  SC$1.terminator=Terms.so()+"SO:0000141";
  SC$1.engineeredRegion="http://identifiers.org/so/SO:0000804";
  SC$1.privateAccess="http://sbols.org/v2#private";
  SC$1.publicAccess="http://sbols.org/v2#public";
  SC$1.fcInput=Terms.sbolns()+"in";
  SC$1.fcOutput=Terms.sbolns()+"out";
  SC$1.fcInOut=Terms.sbolns()+"inout";
  SC$1.fcNone=Terms.sbolns()+"none";
  SC$1.production=Terms.sbo()+"SBO:0000589";
  SC$1.inhibition=Terms.sbo()+"SBO:0000169";
  SC$1.inhibitor=Terms.sbo()+"SBO:0000020";
  SC$1.inhibited=Terms.sbo()+"SBO:0000642";
  SC$1.stimulator=Terms.sbo()+"SBO:0000459";
  SC$1.stimulated=Terms.sbo()+"SBO:0000643";
  SC$1.stimulation=Terms.sbo()+"SBO:0000170";
  SC$1.template=Terms.sbo()+"SBO:0000645";
  SC$1.product=Terms.sbo()+"SBO:0000011";
  SC$1.inlineOrientation="http://sbols.org/v2#inline";
  SC$1.$cctor=Global.ignore;
 });
 QualifiedName.ModuleDefinition=function()
 {
  SC$2.$cctor();
  return SC$2.ModuleDefinition;
 };
 QualifiedName.Interaction=function()
 {
  SC$2.$cctor();
  return SC$2.Interaction;
 };
 QualifiedName.Participation=function()
 {
  SC$2.$cctor();
  return SC$2.Participation;
 };
 QualifiedName.FunctionalComponent=function()
 {
  SC$2.$cctor();
  return SC$2.FunctionalComponent;
 };
 QualifiedName.ComponentDefinition=function()
 {
  SC$2.$cctor();
  return SC$2.ComponentDefinition;
 };
 QualifiedName.Sequence=function()
 {
  SC$2.$cctor();
  return SC$2.Sequence;
 };
 QualifiedName.Component=function()
 {
  SC$2.$cctor();
  return SC$2.Component;
 };
 QualifiedName.SequenceAnnotation=function()
 {
  SC$2.$cctor();
  return SC$2.SequenceAnnotation;
 };
 QualifiedName.Range=function()
 {
  SC$2.$cctor();
  return SC$2.Range;
 };
 QualifiedName.moduleDefinitionProperty=function()
 {
  SC$2.$cctor();
  return SC$2.moduleDefinitionProperty;
 };
 QualifiedName.interactionProperty=function()
 {
  SC$2.$cctor();
  return SC$2.interactionProperty;
 };
 QualifiedName.participationProperty=function()
 {
  SC$2.$cctor();
  return SC$2.participationProperty;
 };
 QualifiedName.functionalComponentProperty=function()
 {
  SC$2.$cctor();
  return SC$2.functionalComponentProperty;
 };
 QualifiedName.componentDefinitionProperty=function()
 {
  SC$2.$cctor();
  return SC$2.componentDefinitionProperty;
 };
 QualifiedName.sequenceProperty=function()
 {
  SC$2.$cctor();
  return SC$2.sequenceProperty;
 };
 QualifiedName.componentProperty=function()
 {
  SC$2.$cctor();
  return SC$2.componentProperty;
 };
 QualifiedName.sequenceAnnotationProperty=function()
 {
  SC$2.$cctor();
  return SC$2.sequenceAnnotationProperty;
 };
 QualifiedName.locationProperty=function()
 {
  SC$2.$cctor();
  return SC$2.locationProperty;
 };
 QualifiedName.participant=function()
 {
  SC$2.$cctor();
  return SC$2.participant;
 };
 QualifiedName.direction=function()
 {
  SC$2.$cctor();
  return SC$2.direction;
 };
 QualifiedName.access=function()
 {
  SC$2.$cctor();
  return SC$2.access;
 };
 QualifiedName.typeProperty=function()
 {
  SC$2.$cctor();
  return SC$2.typeProperty;
 };
 QualifiedName.role=function()
 {
  SC$2.$cctor();
  return SC$2.role;
 };
 QualifiedName.definition=function()
 {
  SC$2.$cctor();
  return SC$2.definition;
 };
 QualifiedName.encoding=function()
 {
  SC$2.$cctor();
  return SC$2.encoding;
 };
 QualifiedName.elements=function()
 {
  SC$2.$cctor();
  return SC$2.elements;
 };
 QualifiedName.orientation=function()
 {
  SC$2.$cctor();
  return SC$2.orientation;
 };
 QualifiedName.endIndex=function()
 {
  SC$2.$cctor();
  return SC$2.endIndex;
 };
 QualifiedName.startIndex=function()
 {
  SC$2.$cctor();
  return SC$2.startIndex;
 };
 QualifiedName.description=function()
 {
  SC$2.$cctor();
  return SC$2.description;
 };
 QualifiedName.name=function()
 {
  SC$2.$cctor();
  return SC$2.name;
 };
 QualifiedName.persistentIdentity=function()
 {
  SC$2.$cctor();
  return SC$2.persistentIdentity;
 };
 QualifiedName.version=function()
 {
  SC$2.$cctor();
  return SC$2.version;
 };
 QualifiedName.displayId=function()
 {
  SC$2.$cctor();
  return SC$2.displayId;
 };
 QualifiedName.id=function()
 {
  SC$2.$cctor();
  return SC$2.id;
 };
 QualifiedName.dctermsQN=function()
 {
  SC$2.$cctor();
  return SC$2.dctermsQN;
 };
 QualifiedName.provQN=function()
 {
  SC$2.$cctor();
  return SC$2.provQN;
 };
 QualifiedName.rdfQN=function()
 {
  SC$2.$cctor();
  return SC$2.rdfQN;
 };
 QualifiedName.sbolQN=function()
 {
  SC$2.$cctor();
  return SC$2.sbolQN;
 };
 SC$2.$cctor=Runtime.Cctor(function()
 {
  SC$2.sbolQN="xmlns:sbol";
  SC$2.rdfQN="rdf:RDF";
  SC$2.provQN="xmlns:prov";
  SC$2.dctermsQN="xmlns:dcterms";
  SC$2.id="rdf:about";
  SC$2.displayId="sbol:displayId";
  SC$2.version="sbol:version";
  SC$2.persistentIdentity="sbol:persistentIdentity";
  SC$2.name="dcterms:title";
  SC$2.description="dcterms:description";
  SC$2.startIndex="sbol:start";
  SC$2.endIndex="sbol:end";
  SC$2.orientation="sbol:orientation";
  SC$2.elements="sbol:elements";
  SC$2.encoding="sbol:encoding";
  SC$2.definition="sbol:definition";
  SC$2.role="sbol:role";
  SC$2.typeProperty="sbol:type";
  SC$2.access="sbol:access";
  SC$2.direction="sbol:direction";
  SC$2.participant="sbol:participant";
  SC$2.locationProperty="sbol:location";
  SC$2.sequenceAnnotationProperty="sbol:sequenceAnnotation";
  SC$2.componentProperty="sbol:component";
  SC$2.sequenceProperty="sbol:sequence";
  SC$2.componentDefinitionProperty="sbol:componentDefinition";
  SC$2.functionalComponentProperty="sbol:functionalComponent";
  SC$2.participationProperty="sbol:participation";
  SC$2.interactionProperty="sbol:interaction";
  SC$2.moduleDefinitionProperty="sbol:moduleDefinition";
  SC$2.Range="sbol:Range";
  SC$2.SequenceAnnotation="sbol:SequenceAnnotation";
  SC$2.Component="sbol:Component";
  SC$2.Sequence="sbol:Sequence";
  SC$2.ComponentDefinition="sbol:ComponentDefinition";
  SC$2.FunctionalComponent="sbol:FunctionalComponent";
  SC$2.Participation="sbol:Participation";
  SC$2.Interaction="sbol:Interaction";
  SC$2.ModuleDefinition="sbol:ModuleDefinition";
  SC$2.$cctor=Global.ignore;
 });
 Identifiers$1=Identifiers.Identifiers=Runtime.Class({
  getStringAnnotations:function()
  {
   return List$1.map(function(y)
   {
    return[y.K,y.V];
   },List$1.ofSeq(this.get_stringAnnotations()));
  },
  getUriAnnotations:function()
  {
   return List$1.map(function(y)
   {
    return[y.K,y.V];
   },List$1.ofSeq(this.get_uriAnnotations()));
  },
  getStringAnnotation:function(key)
  {
   return this.get_stringAnnotations().ContainsKey(key)?{
    $:1,
    $0:this.get_stringAnnotations().get_Item(key)
   }:null;
  },
  getUriAnnotation:function(key)
  {
   return this.get_uriAnnotations().ContainsKey(key)?{
    $:1,
    $0:this.get_uriAnnotations().get_Item(key)
   }:null;
  },
  addStringAnnotation:function(term,str)
  {
   this.get_stringAnnotations().Add(term,str);
  },
  addUriAnnotation:function(term,uri)
  {
   this.get_uriAnnotations().Add(term,uri);
  },
  get_stringAnnotations:function()
  {
   return new Dictionary.New$5();
  },
  get_uriAnnotations:function()
  {
   return new Dictionary.New$5();
  },
  set_description:function(v)
  {
   this.description=v;
  },
  get_description:function()
  {
   return this.description;
  },
  get_uri:function()
  {
   return this.uri;
  },
  get_persistentIdentity:function()
  {
   return this.persistentIdentity;
  },
  get_displayId:function()
  {
   return this.displayId;
  },
  get_name:function()
  {
   return this.name;
  },
  get_version:function()
  {
   return this.version;
  }
 },null,Identifiers$1);
 Identifiers$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version)
 {
  var _persistentIdentity;
  _persistentIdentity=urlPrefix+"/"+displayId;
  this.version=version;
  this.name=name;
  this.displayId=displayId;
  this.persistentIdentity=_persistentIdentity;
  this.uri=_persistentIdentity+"/"+version;
  this.description="";
 },Identifiers$1);
 Sequence$1=Sequence.Sequence=Runtime.Class({
  get_encoding:function()
  {
   return this.encoding;
  },
  get_elements:function()
  {
   return this.sequence;
  }
 },Identifiers$1,Sequence$1);
 Sequence$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,sequence,encoding)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.sequence=sequence;
  this.encoding=encoding;
 },Sequence$1);
 Component$1=Component.Component=Runtime.Class({
  get_definition:function()
  {
   return this.definition;
  },
  get_access:function()
  {
   return this.access;
  }
 },Identifiers$1,Component$1);
 Component$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,access,definition)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.access=access;
  this.definition=definition;
 },Component$1);
 Range$1=Range.Range=Runtime.Class({
  get_orientation:function()
  {
   return this.orientation;
  },
  get_endIndex:function()
  {
   return this.endIndex;
  },
  get_startIndex:function()
  {
   return this.startIndex;
  }
 },Identifiers$1,Range$1);
 Range$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,startIndex,endIndex,orientation)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.startIndex=startIndex;
  this.endIndex=endIndex;
  this.orientation=orientation;
 },Range$1);
 SequenceAnnotation$1=SequenceAnnotation.SequenceAnnotation=Runtime.Class({
  get_locations:function()
  {
   return this.locations;
  },
  get_componentObject:function()
  {
   return this.componentObject;
  }
 },Identifiers$1,SequenceAnnotation$1);
 SequenceAnnotation$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,componentObject,locations)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.componentObject=componentObject;
  this.locations=locations;
 },SequenceAnnotation$1);
 ComponentDefinition$1=ComponentDefinition.ComponentDefinition=Runtime.Class({
  get_components:function()
  {
   return this.components;
  },
  get_sequenceAnnotations:function()
  {
   return this.sequenceAnnotations;
  },
  get_sequences:function()
  {
   return this.sequences;
  },
  get_types:function()
  {
   return this.types;
  },
  get_roles:function()
  {
   return this.roles;
  }
 },Identifiers$1,ComponentDefinition$1);
 ComponentDefinition$1.getConcatenatedSequence=function(cdList)
 {
  return cdList.$==1?Seq.fold(function(acc,seq)
  {
   return acc+seq.get_elements();
  },"",cdList.$0.get_sequences())+ComponentDefinition$1.getConcatenatedSequence(cdList.$1):"";
 };
 ComponentDefinition$1.createRanges=function(urlPrefix,cdList)
 {
  var index,start,$1,ranges,e,cd,i,e$1,seq;
  index=1;
  start=1;
  ranges=new List.New$2();
  e=Enumerator.Get(cdList);
  try
  {
   while(e.MoveNext())
    {
     cd=e.Current();
     i=cd.get_sequences();
     e$1=Enumerator.Get(i);
     try
     {
      while(e$1.MoveNext())
       {
        seq=e$1.Current();
        ranges.Add(new Range$1.New("range",urlPrefix+"annotation"+Global.String(index)+"/range",cd.get_displayId()+"_range",cd.get_version(),start,start+seq.get_elements().length-1,Terms.inlineOrientation()));
        start=start+seq.get_elements().length;
        index=index+1;
       }
     }
     finally
     {
      if("Dispose"in e$1)
       e$1.Dispose();
     }
    }
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
  return List$1.ofArray(ranges.ToArray());
 };
 ComponentDefinition$1.createSequenceAnnotationFromSingleRange=function(urlPrefix)
 {
  function innerFn(index,comp,range)
  {
   return new SequenceAnnotation$1.New("annotation"+Global.String(index),urlPrefix,"annotation"+Global.String(index),range.get_version(),comp,List$1.ofArray([{
    $:0,
    $0:range
   }]));
  }
  return function($1)
  {
   return innerFn($1[0],$1[1],$1[2]);
  };
 };
 ComponentDefinition$1.createComponent=function(urlPrefix)
 {
  return function(cd)
  {
   return new Component$1.New(cd.get_name()+"_component",urlPrefix,cd.get_displayId()+"_component",cd.get_version(),Terms.privateAccess(),cd.get_uri());
  };
 };
 ComponentDefinition$1.createHigherFunction=function(name,urlPrefix,displayId,version,types,roles,components)
 {
  var componentList,rangeList,forSA,sequenceAnnotations;
  componentList=List$1.map(ComponentDefinition$1.createComponent(urlPrefix),components);
  rangeList=ComponentDefinition$1.createRanges(urlPrefix,components);
  forSA=List$1.zip3(List$1.ofSeq(Operators.range(1,components.get_Length())),componentList,rangeList);
  sequenceAnnotations=List$1.map(ComponentDefinition$1.createSequenceAnnotationFromSingleRange(urlPrefix),forSA);
  return new ComponentDefinition$1.New(name,urlPrefix,displayId,version,types,roles,List$1.ofArray([new Sequence$1.New(name+"_sequence",urlPrefix,displayId+"_sequence",version,ComponentDefinition$1.getConcatenatedSequence(components),Terms.dnasequence())]),componentList,sequenceAnnotations);
 };
 ComponentDefinition$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,types,roles,sequences,components,sequenceAnnotations)
 {
  ComponentDefinition$1.$cctor();
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.types=types;
  this.roles=roles;
  this.sequences=sequences;
  this.components=components;
  this.sequenceAnnotations=sequenceAnnotations;
 },ComponentDefinition$1);
 FunctionalComponent$1=FunctionalComponent.FunctionalComponent=Runtime.Class({
  get_direction:function()
  {
   return this.direction;
  },
  get_definition:function()
  {
   return this.definition;
  },
  get_access:function()
  {
   return this.access;
  }
 },Identifiers$1,FunctionalComponent$1);
 FunctionalComponent$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,access,direction,definition)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.access=access;
  this.direction=direction;
  this.definition=definition;
 },FunctionalComponent$1);
 Participation$1=Participation.Participation=Runtime.Class({
  get_participant:function()
  {
   return this.participant;
  },
  get_roles:function()
  {
   return this.roles;
  }
 },Identifiers$1,Participation$1);
 Participation$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,roles,participant)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.roles=roles;
  this.participant=participant;
 },Participation$1);
 Interaction$1=Interaction.Interaction=Runtime.Class({
  get_participations:function()
  {
   return this.participations;
  },
  get_types:function()
  {
   return this.types;
  }
 },Identifiers$1,Interaction$1);
 Interaction$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,types,participations)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.types=types;
  this.participations=participations;
 },Interaction$1);
 ModuleDefinition$1=ModuleDefinition.ModuleDefinition=Runtime.Class({
  get_interactions:function()
  {
   return this.interactions;
  },
  get_functionalComponents:function()
  {
   return this.functionalComponents;
  }
 },Identifiers$1,ModuleDefinition$1);
 ModuleDefinition$1.New=Runtime.Ctor(function(name,urlPrefix,displayId,version,functionalComponents,interactions)
 {
  Identifiers$1.New.call(this,name,urlPrefix,displayId,version);
  this.functionalComponents=functionalComponents;
  this.interactions=interactions;
 },ModuleDefinition$1);
 SBOLDocument$1=SBOLDocument.SBOLDocument=Runtime.Class({
  get_collection:function()
  {
   return List$1.append(List$1.map(function(x)
   {
    return{
     $:2,
     $0:x.V
    };
   },List$1.ofSeq(Map.Fold(function(acc,k,v)
   {
    return acc.Add(k,v);
   },Map.OfArray(Arrays.ofSeq(List$1.map(function(seq)
   {
    return[seq.get_uri(),seq];
   },List$1.map(function(a)
   {
    if(a.$==2)
     return a.$0;
    else
     throw new MatchFailureException.New("..\\FSBOL\\SBOLDocument.fs",18,46);
   },List$1.filter(function(coll)
   {
    return coll.$==2&&true;
   },this.collection))))),Map.OfArray(Arrays.ofSeq(List$1.map(function(seq)
   {
    return[seq.get_uri(),seq];
   },Seq.reduce(List$1.append,List$1.map(function(cdVal)
   {
    return cdVal.get_sequences();
   },List$1.map(function(a)
   {
    if(a.$==1)
     return a.$0;
    else
     throw new MatchFailureException.New("..\\FSBOL\\SBOLDocument.fs",25,47);
   },List$1.filter(function(coll)
   {
    return coll.$==1&&true;
   },this.collection)))))))))),List$1.filter(function(coll)
   {
    return coll.$==2?false:true;
   },this.collection));
  }
 },null,SBOLDocument$1);
 SBOLDocument$1.New=Runtime.Ctor(function(collection)
 {
  this.collection=collection;
 },SBOLDocument$1);
 jAnnotation.New=function(Type,name,value)
 {
  return{
   Type:Type,
   name:name,
   value:value
  };
 };
 jSequence.New=function(uri,name,persistentIdentity,displayId,version,description,annotations,elements,encoding)
 {
  return{
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   elements:elements,
   encoding:encoding
  };
 };
 jComponent.New=function(uri,name,persistentIdentity,displayId,version,description,annotations,access,definition)
 {
  return{
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   access:access,
   definition:definition
  };
 };
 jRange.New=function(gecDU,uri,name,persistentIdentity,displayId,version,description,annotations,startIndex,endIndex,orientation)
 {
  return{
   gecDU:gecDU,
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   startIndex:startIndex,
   endIndex:endIndex,
   orientation:orientation
  };
 };
 jSequenceAnnotation.New=function(uri,name,persistentIdentity,displayId,version,description,annotations,Component$2,locations)
 {
  return{
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   Component:Component$2,
   locations:locations
  };
 };
 jComponentDefinition.New=function(uri,name,persistentIdentity,displayId,version,description,annotations,components,sequenceAnnotations,sequences,types,roles)
 {
  return{
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   components:components,
   sequenceAnnotations:sequenceAnnotations,
   sequences:sequences,
   types:types,
   roles:roles
  };
 };
 jFunctionalComponent.New=function(uri,name,persistentIdentity,displayId,version,description,annotations,access,direction,definition)
 {
  return{
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   access:access,
   direction:direction,
   definition:definition
  };
 };
 jParticipation.New=function(uri,name,persistentIdentity,displayId,version,description,annotations,roles,participant)
 {
  return{
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   roles:roles,
   participant:participant
  };
 };
 jInteraction.New=function(uri,name,persistentIdentity,displayId,version,description,annotations,types,participations)
 {
  return{
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   types:types,
   participations:participations
  };
 };
 jModuleDefinition.New=function(uri,name,persistentIdentity,displayId,version,description,annotations,functionalComponents,interactions)
 {
  return{
   uri:uri,
   name:name,
   persistentIdentity:persistentIdentity,
   displayId:displayId,
   version:version,
   description:description,
   annotations:annotations,
   functionalComponents:functionalComponents,
   interactions:interactions
  };
 };
 jSBOLDocument.New=function(componentDefinitions,moduleDefinitions,sequences)
 {
  return{
   componentDefinitions:componentDefinitions,
   moduleDefinitions:moduleDefinitions,
   sequences:sequences
  };
 };
 JsonSerializer.serializeSBOLDocument=function(x)
 {
  return jSBOLDocument.New(Arrays.ofList(List$1.map(JsonSerializer.serializeComponentDefinition,List$1.map(function(a)
  {
   if(a.$==1)
    return a.$0;
   else
    throw new MatchFailureException.New("..\\FSBOL\\JsonSerializer.fs",299,31);
  },List$1.filter(function(y)
  {
   return y.$==1&&true;
  },x.get_collection())))),Arrays.ofList(List$1.map(JsonSerializer.serializeModuleDefinition,List$1.map(function(a)
  {
   if(a.$==0)
    return a.$0;
   else
    throw new MatchFailureException.New("..\\FSBOL\\JsonSerializer.fs",304,31);
  },List$1.filter(function(y)
  {
   return y.$==0&&true;
  },x.get_collection())))),Arrays.ofList(List$1.map(JsonSerializer.serializeSequence,List$1.map(function(a)
  {
   if(a.$==2)
    return a.$0;
   else
    throw new MatchFailureException.New("..\\FSBOL\\JsonSerializer.fs",309,32);
  },List$1.filter(function(y)
  {
   return y.$==2&&true;
  },x.get_collection())))));
 };
 JsonSerializer.serializeModuleDefinition=function(x)
 {
  var annotations,fc,interactions;
  annotations=Arrays.ofList(List$1.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  fc=Arrays.ofList(List$1.map(JsonSerializer.serializeFunctionalComponent,x.get_functionalComponents()));
  interactions=Arrays.ofList(List$1.map(JsonSerializer.serializeInteraction,x.get_interactions()));
  return jModuleDefinition.New(x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,fc,interactions);
 };
 JsonSerializer.serializeInteraction=function(x)
 {
  var annotations,types,participations;
  annotations=Arrays.ofList(List$1.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  types=Arrays.ofList(x.get_types());
  participations=Arrays.ofList(List$1.map(JsonSerializer.serializeParticipation,x.get_participations()));
  return jInteraction.New(x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,types,participations);
 };
 JsonSerializer.serializeParticipation=function(x)
 {
  var annotations,roles;
  annotations=Arrays.ofList(List$1.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  roles=Arrays.ofList(x.get_roles());
  return jParticipation.New(x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,roles,x.get_participant().get_uri());
 };
 JsonSerializer.serializeFunctionalComponent=function(x)
 {
  var annotations;
  annotations=Arrays.ofList(List$1.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  return jFunctionalComponent.New(x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,x.get_access(),x.get_direction(),x.get_definition());
 };
 JsonSerializer.serializeComponentDefinition=function(x)
 {
  var annotations,seqs,sas,comps,types,roles;
  annotations=Arrays.ofList(List$1.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  seqs=Arrays.ofList(List$1.map(function(seq)
  {
   return seq.get_uri();
  },x.get_sequences()));
  sas=Arrays.ofList(List$1.map(JsonSerializer.serializeSequenceAnnotation,x.get_sequenceAnnotations()));
  comps=Arrays.ofList(List$1.map(JsonSerializer.serializeComponent,x.get_components()));
  types=Arrays.ofList(x.get_types());
  roles=Arrays.ofList(x.get_roles());
  return jComponentDefinition.New(x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,comps,sas,seqs,types,roles);
 };
 JsonSerializer.serializeSequenceAnnotation=function(x)
 {
  var annotations,locs;
  annotations=Arrays.ofList(List$1.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  locs=Arrays.ofList(List$1.map(JsonSerializer.serializeLocation,x.get_locations()));
  return jSequenceAnnotation.New(x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,x.get_componentObject().get_uri(),locs);
 };
 JsonSerializer.serializeLocation=function(x)
 {
  return{
   $:0,
   $0:JsonSerializer.serializeRange(x.$0)
  };
 };
 JsonSerializer.serializeRange=function(x)
 {
  var annotations;
  annotations=Arrays.ofList(List$1.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  return jRange.New("range",x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,x.get_startIndex(),x.get_endIndex(),x.get_orientation());
 };
 JsonSerializer.serializeComponent=function(x)
 {
  var annotations;
  annotations=Arrays.ofList(List$1.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  return jComponent.New(x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,x.get_access(),x.get_definition());
 };
 JsonSerializer.serializeSequence=function(x)
 {
  var annotations;
  annotations=Arrays.ofList(List$1.append(JsonSerializer.serializeUriAnnotations(x.getUriAnnotations()),JsonSerializer.serializeStringAnnotations(x.getStringAnnotations())));
  return jSequence.New(x.get_uri(),x.get_name(),x.get_persistentIdentity(),x.get_displayId(),x.get_version(),x.get_description(),annotations,x.get_elements(),x.get_encoding());
 };
 JsonSerializer.serializeStringAnnotations=function(stringAnnotations)
 {
  function m(k,v)
  {
   return jAnnotation.New("string",k,v);
  }
  return List$1.map(function($1)
  {
   return m($1[0],$1[1]);
  },stringAnnotations);
 };
 JsonSerializer.serializeUriAnnotations=function(uriAnnotations)
 {
  function m(k,v)
  {
   return jAnnotation.New("uri",k,v);
  }
  return List$1.map(function($1)
  {
   return m($1[0],$1[1]);
  },uriAnnotations);
 };
 Client.Main=Global.ignore;
 Tree.New=function(Node,Left,Right,Height,Count)
 {
  return{
   Node:Node,
   Left:Left,
   Right:Right,
   Height:Height,
   Count:Count
  };
 };
 BalancedTree.TryFind=function(v,t)
 {
  var x;
  x=(BalancedTree.Lookup(v,t))[0];
  return x==null?null:{
   $:1,
   $0:x.Node
  };
 };
 BalancedTree.Contains=function(v,t)
 {
  return!((BalancedTree.Lookup(v,t))[0]==null);
 };
 BalancedTree.Add=function(x,t)
 {
  return BalancedTree.Put(function($1,$2)
  {
   return $2;
  },x,t);
 };
 BalancedTree.Remove=function(k,src)
 {
  var p,t,spine,d;
  p=BalancedTree.Lookup(k,src);
  t=p[0];
  spine=p[1];
  return t==null?src:t.Right==null?BalancedTree.Rebuild(spine,t.Left):t.Left==null?BalancedTree.Rebuild(spine,t.Right):BalancedTree.Rebuild(spine,(d=Arrays.ofSeq(Seq.append(BalancedTree.Enumerate(false,t.Left),BalancedTree.Enumerate(false,t.Right))),BalancedTree.Build(d,0,d.length-1)));
 };
 BalancedTree.Put=function(combine,k,t)
 {
  var p,t$1;
  p=BalancedTree.Lookup(k,t);
  t$1=p[0];
  return t$1==null?BalancedTree.Rebuild(p[1],BalancedTree.Branch(k,null,null)):BalancedTree.Rebuild(p[1],BalancedTree.Branch(combine(t$1.Node,k),t$1.Left,t$1.Right));
 };
 BalancedTree.Rebuild=function(spine,t)
 {
  var t$1,i,$1,m,x,l,m$1,x$1,r,m$2;
  function h(x$2)
  {
   return x$2==null?0:x$2.Height;
  }
  t$1=t;
  for(i=0,$1=Arrays.length(spine)-1;i<=$1;i++){
   t$1=(m=Arrays.get(spine,i),m[0]?(x=m[1],(l=m[2],h(t$1)>h(l)+1?h(t$1.Left)===h(t$1.Right)+1?(m$1=t$1.Left,BalancedTree.Branch(m$1.Node,BalancedTree.Branch(x,l,m$1.Left),BalancedTree.Branch(t$1.Node,m$1.Right,t$1.Right))):BalancedTree.Branch(t$1.Node,BalancedTree.Branch(x,l,t$1.Left),t$1.Right):BalancedTree.Branch(x,l,t$1))):(x$1=m[1],(r=m[2],h(t$1)>h(r)+1?h(t$1.Right)===h(t$1.Left)+1?(m$2=t$1.Right,BalancedTree.Branch(m$2.Node,BalancedTree.Branch(t$1.Node,t$1.Left,m$2.Left),BalancedTree.Branch(x$1,m$2.Right,r))):BalancedTree.Branch(t$1.Node,t$1.Left,BalancedTree.Branch(x$1,t$1.Right,r)):BalancedTree.Branch(x$1,t$1,r))));
  }
  return t$1;
 };
 BalancedTree.Lookup=function(k,t)
 {
  var spine,t$1,loop,m;
  spine=[];
  t$1=t;
  loop=true;
  while(loop)
   if(t$1==null)
    loop=false;
   else
    {
     m=Unchecked.Compare(k,t$1.Node);
     m===0?loop=false:m===1?(spine.unshift([true,t$1.Node,t$1.Left]),t$1=t$1.Right):(spine.unshift([false,t$1.Node,t$1.Right]),t$1=t$1.Left);
    }
  return[t$1,spine];
 };
 BalancedTree.OfSeq=function(data)
 {
  var a;
  a=Arrays.ofSeq(Seq.distinct(data));
  Arrays.sortInPlace(a);
  return BalancedTree.Build(a,0,a.length-1);
 };
 BalancedTree.Build=function(data,min,max)
 {
  var center,left,right;
  return max-min+1<=0?null:(center=(min+max)/2>>0,(left=BalancedTree.Build(data,min,center-1),(right=BalancedTree.Build(data,center+1,max),BalancedTree.Branch(Arrays.get(data,center),left,right))));
 };
 BalancedTree.Enumerate=function(flip,t)
 {
  function gen(t$1,spine)
  {
   var t$2;
   while(true)
    if(t$1==null)
     return spine.$==1?{
      $:1,
      $0:[spine.$0[0],[spine.$0[1],spine.$1]]
     }:null;
    else
     if(flip)
      {
       t$2=t$1;
       t$1=t$2.Right;
       spine=new T$1({
        $:1,
        $0:[t$2.Node,t$2.Left],
        $1:spine
       });
      }
     else
      {
       t$2=t$1;
       t$1=t$2.Left;
       spine=new T$1({
        $:1,
        $0:[t$2.Node,t$2.Right],
        $1:spine
       });
      }
  }
  return Seq.unfold(function($1)
  {
   return gen($1[0],$1[1]);
  },[t,T$1.Empty]);
 };
 BalancedTree.Branch=function(node,left,right)
 {
  var a,b;
  return Tree.New(node,left,right,1+(a=left==null?0:left.Height,(b=right==null?0:right.Height,Unchecked.Compare(a,b)===1?a:b)),1+(left==null?0:left.Count)+(right==null?0:right.Count));
 };
 Pair=Collections.Pair=Runtime.Class({
  Equals:function(other)
  {
   return Unchecked.Equals(this.Key,other.Key);
  },
  GetHashCode:function()
  {
   return Unchecked.Hash(this.Key);
  },
  CompareTo0:function(other)
  {
   return Unchecked.Compare(this.Key,other.Key);
  }
 },null,Pair);
 Pair.New=function(Key,Value)
 {
  return new Pair({
   Key:Key,
   Value:Value
  });
 };
 MapUtil.fromSeq=function(s)
 {
  var a;
  a=Arrays.ofSeq(Seq.delay(function()
  {
   return Seq.collect(function(m)
   {
    return[Pair.New(m[0],m[1])];
   },Seq.distinctBy(function(t)
   {
    return t[0];
   },s));
  }));
  Arrays.sortInPlace(a);
  return BalancedTree.Build(a,0,a.length-1);
 };
 FSharpMap=Collections.FSharpMap=Runtime.Class({
  Equals:function(other)
  {
   return this.get_Count()===other.get_Count()&&Seq.forall2(Unchecked.Equals,this,other);
  },
  GetHashCode:function()
  {
   return Unchecked.Hash(Arrays.ofSeq(this));
  },
  GetEnumerator$1:function()
  {
   return Enumerator.Get(Seq.map(function(kv)
   {
    return{
     K:kv.Key,
     V:kv.Value
    };
   },BalancedTree.Enumerate(false,this.tree)));
  },
  TryFind:function(k)
  {
   var o;
   o=BalancedTree.TryFind(Pair.New(k,void 0),this.tree);
   return o==null?null:{
    $:1,
    $0:o.$0.Value
   };
  },
  Remove:function(k)
  {
   return new FSharpMap.New$1(BalancedTree.Remove(Pair.New(k,void 0),this.tree));
  },
  get_Item:function(k)
  {
   var m;
   m=this.TryFind(k);
   return m==null?Operators.FailWith("The given key was not present in the dictionary."):m.$0;
  },
  get_IsEmpty:function()
  {
   return this.tree==null;
  },
  get_Count:function()
  {
   var tree;
   tree=this.tree;
   return tree==null?0:tree.Count;
  },
  ContainsKey:function(k)
  {
   return BalancedTree.Contains(Pair.New(k,void 0),this.tree);
  },
  Add:function(k,v)
  {
   return new FSharpMap.New$1(BalancedTree.Add(Pair.New(k,v),this.tree));
  },
  get_Tree:function()
  {
   return this.tree;
  },
  GetEnumerator:function()
  {
   return this.GetEnumerator$1();
  },
  GetEnumerator0:function()
  {
   return this.GetEnumerator$1();
  },
  CompareTo0:function(other)
  {
   return Seq.compareWith(Unchecked.Compare,this,other);
  }
 },null,FSharpMap);
 FSharpMap.New=Runtime.Ctor(function(s)
 {
  FSharpMap.New$1.call(this,MapUtil.fromSeq(s));
 },FSharpMap);
 FSharpMap.New$1=Runtime.Ctor(function(tree)
 {
  this.tree=tree;
 },FSharpMap);
 Map.Map=function(f,m)
 {
  return new FSharpMap.New$1(BalancedTree.OfSeq(Seq.map(function(kv)
  {
   return Pair.New(kv.Key,f(kv.Key,kv.Value));
  },BalancedTree.Enumerate(false,m.get_Tree()))));
 };
 Map.TryPick=function(f,m)
 {
  return Seq.tryPick(function(kv)
  {
   return f(kv.K,kv.V);
  },m);
 };
 Map.TryFindKey=function(f,m)
 {
  return Seq.tryPick(function(kv)
  {
   return f(kv.K,kv.V)?{
    $:1,
    $0:kv.K
   }:null;
  },m);
 };
 Map.TryFind=function(k,m)
 {
  return m.TryFind(k);
 };
 Map.ToSeq=function(m)
 {
  return Seq.map(function(kv)
  {
   return[kv.Key,kv.Value];
  },BalancedTree.Enumerate(false,m.get_Tree()));
 };
 Map.Pick=function(f,m)
 {
  return Seq.pick(function(kv)
  {
   return f(kv.K,kv.V);
  },m);
 };
 Map.Partition=function(f,m)
 {
  var p,data,data$1;
  p=Arrays.partition(function(kv)
  {
   return f(kv.Key,kv.Value);
  },Arrays.ofSeq(BalancedTree.Enumerate(false,m.get_Tree())));
  return[new FSharpMap.New$1((data=p[0],BalancedTree.Build(data,0,data.length-1))),new FSharpMap.New$1((data$1=p[1],BalancedTree.Build(data$1,0,data$1.length-1)))];
 };
 Map.OfArray=function(a)
 {
  return new FSharpMap.New$1(BalancedTree.OfSeq(Seq.map(function($1)
  {
   return Pair.New($1[0],$1[1]);
  },a)));
 };
 Map.Iterate=function(f,m)
 {
  Seq.iter(function(kv)
  {
   f(kv.K,kv.V);
  },m);
 };
 Map.ForAll=function(f,m)
 {
  return Seq.forall(function(kv)
  {
   return f(kv.K,kv.V);
  },m);
 };
 Map.FoldBack=function(f,m,s)
 {
  return Seq.fold(function(s$1,kv)
  {
   return f(kv.Key,kv.Value,s$1);
  },s,BalancedTree.Enumerate(true,m.get_Tree()));
 };
 Map.Fold=function(f,s,m)
 {
  return Seq.fold(function(s$1,kv)
  {
   return f(s$1,kv.Key,kv.Value);
  },s,BalancedTree.Enumerate(false,m.get_Tree()));
 };
 Map.FindKey=function(f,m)
 {
  return Seq.pick(function(kv)
  {
   return f(kv.K,kv.V)?{
    $:1,
    $0:kv.K
   }:null;
  },m);
 };
 Map.Filter=function(f,m)
 {
  var d;
  return new FSharpMap.New$1((d=Arrays.ofSeq(Seq.filter(function(kv)
  {
   return f(kv.Key,kv.Value);
  },BalancedTree.Enumerate(false,m.get_Tree()))),BalancedTree.Build(d,0,d.length-1)));
 };
 Map.Exists=function(f,m)
 {
  return Seq.exists(function(kv)
  {
   return f(kv.K,kv.V);
  },m);
 };
 FSharpSet=Collections.FSharpSet=Runtime.Class({
  Equals:function(other)
  {
   return this.get_Count()===other.get_Count()&&Seq.forall2(Unchecked.Equals,this,other);
  },
  GetHashCode:function()
  {
   return -1741749453+Unchecked.Hash(Arrays.ofSeq(this));
  },
  GetEnumerator$1:function()
  {
   return Enumerator.Get(BalancedTree.Enumerate(false,this.tree));
  },
  Remove:function(v)
  {
   return new FSharpSet.New$1(BalancedTree.Remove(v,this.tree));
  },
  get_MinimumElement:function()
  {
   return Seq.head(BalancedTree.Enumerate(false,this.tree));
  },
  get_MaximumElement:function()
  {
   return Seq.head(BalancedTree.Enumerate(true,this.tree));
  },
  IsSupersetOf:function(s)
  {
   var $this;
   $this=this;
   return Seq.forall(function(a)
   {
    return $this.Contains(a);
   },s);
  },
  IsSubsetOf:function(s)
  {
   return Seq.forall(function(a)
   {
    return s.Contains(a);
   },this);
  },
  IsProperSupersetOf:function(s)
  {
   return this.IsSupersetOf(s)&&this.get_Count()>s.get_Count();
  },
  IsProperSubsetOf:function(s)
  {
   return this.IsSubsetOf(s)&&this.get_Count()<s.get_Count();
  },
  get_Tree:function()
  {
   return this.tree;
  },
  get_IsEmpty:function()
  {
   return this.tree==null;
  },
  get_Count:function()
  {
   var tree;
   tree=this.tree;
   return tree==null?0:tree.Count;
  },
  Contains:function(v)
  {
   return BalancedTree.Contains(v,this.tree);
  },
  Add:function(x)
  {
   return new FSharpSet.New$1(BalancedTree.Add(x,this.tree));
  },
  sub:function(x)
  {
   return Set.Filter(function(x$1)
   {
    return!x.Contains(x$1);
   },this);
  },
  add:function(x)
  {
   return new FSharpSet.New$1(BalancedTree.OfSeq(Seq.append(this,x)));
  },
  CompareTo0:function(other)
  {
   return Seq.compareWith(Unchecked.Compare,this,other);
  },
  GetEnumerator:function()
  {
   return this.GetEnumerator$1();
  },
  GetEnumerator0:function()
  {
   return this.GetEnumerator$1();
  }
 },null,FSharpSet);
 FSharpSet.op_Subtraction=function(x,y)
 {
  return Set.Filter(function(x$1)
  {
   return!y.Contains(x$1);
  },x);
 };
 FSharpSet.op_Addition=function(x,y)
 {
  return new FSharpSet.New$1(BalancedTree.OfSeq(Seq.append(x,y)));
 };
 FSharpSet.New=Runtime.Ctor(function(s)
 {
  FSharpSet.New$1.call(this,BalancedTree.OfSeq(s));
 },FSharpSet);
 FSharpSet.New$1=Runtime.Ctor(function(tree)
 {
  this.tree=tree;
 },FSharpSet);
 Set.Partition=function(f,a)
 {
  var p;
  p=Arrays.partition(f,Arrays.ofSeq(a));
  return[new FSharpSet.New$1(BalancedTree.OfSeq(p[0])),new FSharpSet.New$1(BalancedTree.OfSeq(p[1]))];
 };
 Set.FoldBack=function(f,a,s)
 {
  return Seq.fold(function($1,$2)
  {
   return f($2,$1);
  },s,BalancedTree.Enumerate(true,a.get_Tree()));
 };
 Set.Filter=function(f,s)
 {
  var data;
  return new FSharpSet.New$1((data=Arrays.ofSeq(Seq.filter(f,s)),BalancedTree.Build(data,0,data.length-1)));
 };
 ListEnumerator=Collections.ListEnumerator=Runtime.Class({
  get_Current:function()
  {
   return Arrays.get(this.arr,this.i);
  },
  MoveNext$1:function()
  {
   this.i=this.i+1;
   return this.i<Arrays.length(this.arr);
  },
  Dispose:Global.ignore,
  Current:function()
  {
   return Arrays.get(this.arr,this.i);
  },
  Reset:function()
  {
   Operators.FailWith("IEnumerator.Reset not supported");
  },
  Current0:function()
  {
   return Arrays.get(this.arr,this.i);
  },
  MoveNext:function()
  {
   return this.MoveNext$1();
  }
 },null,ListEnumerator);
 ListEnumerator.New=Runtime.Ctor(function(arr)
 {
  this.arr=arr;
  this.i=-1;
 },ListEnumerator);
 List=Collections.List=Runtime.Class({
  ToArray:function()
  {
   return this.arr.slice();
  },
  Reverse:function(index,count)
  {
   Arrays.reverse(this.arr,index,count);
  },
  Reverse$1:function()
  {
   this.arr.reverse();
  },
  RemoveRange:function(index,count)
  {
   ResizeArray.splice(this.arr,index,count,[]);
  },
  RemoveAt:function(x)
  {
   ResizeArray.splice(this.arr,x,1,[]);
  },
  set_Item:function(x,v)
  {
   Arrays.set(this.arr,x,v);
  },
  get_Item:function(x)
  {
   return Arrays.get(this.arr,x);
  },
  InsertRange:function(index,items)
  {
   ResizeArray.splice(this.arr,index,0,Arrays.ofSeq(items));
  },
  Insert:function(index,items)
  {
   ResizeArray.splice(this.arr,index,0,[items]);
  },
  GetRange:function(index,count)
  {
   return new List.New$3(Arrays.sub(this.arr,index,count));
  },
  get_Count:function()
  {
   return Arrays.length(this.arr);
  },
  CopyTo:function(index,target,offset,count)
  {
   Arrays.blit(this.arr,index,target,offset,count);
  },
  CopyTo$1:function(arr,offset)
  {
   this.CopyTo(0,arr,offset,this.get_Count());
  },
  CopyTo$2:function(arr)
  {
   this.CopyTo$1(arr,0);
  },
  Clear:function()
  {
   ResizeArray.splice(this.arr,0,Arrays.length(this.arr),[]);
  },
  AddRange:function(x)
  {
   var $this;
   $this=this;
   Seq.iter(function(a)
   {
    $this.Add(a);
   },x);
  },
  Add:function(x)
  {
   this.arr.push(x);
  },
  GetEnumerator:function()
  {
   return Enumerator.Get(this.arr);
  },
  GetEnumerator0:function()
  {
   return Enumerator.Get0(this.arr);
  }
 },null,List);
 List.New=Runtime.Ctor(function(el)
 {
  List.New$3.call(this,Arrays.ofSeq(el));
 },List);
 List.New$1=Runtime.Ctor(function(size)
 {
  List.New$3.call(this,[]);
 },List);
 List.New$2=Runtime.Ctor(function()
 {
  List.New$3.call(this,[]);
 },List);
 List.New$3=Runtime.Ctor(function(arr)
 {
  this.arr=arr;
 },List);
 ResizeArray.splice=function(arr,index,howMany,items)
 {
  return Global.Array.prototype.splice.apply(arr,[index,howMany].concat(items));
 };
 LinkedListEnumerator=Collections.LinkedListEnumerator=Runtime.Class({
  Reset:Global.ignore,
  Dispose:Global.ignore,
  MoveNext:function()
  {
   this.c=this.c.n;
   return!Unchecked.Equals(this.c,null);
  },
  Current0:function()
  {
   return this.c.v;
  },
  Current:function()
  {
   return this.c.v;
  }
 },null,LinkedListEnumerator);
 LinkedListEnumerator.New=Runtime.Ctor(function(l)
 {
  this.c=l;
 },LinkedListEnumerator);
 LinkedList=Collections.LinkedList=Runtime.Class({
  RemoveLast:function()
  {
   this.Remove$1(this.p);
  },
  RemoveFirst:function()
  {
   this.Remove$1(this.n);
  },
  Remove:function(value)
  {
   var node;
   node=this.Find(value);
   return Unchecked.Equals(node,null)?false:(this.Remove$1(node),true);
  },
  Remove$1:function(node)
  {
   var before,after;
   before=node.p;
   after=node.n;
   Unchecked.Equals(before,null)?this.n=after:before.n=after;
   Unchecked.Equals(after,null)?this.p=before:after.p=before;
   this.c=this.c-1;
  },
  GetEnumerator$1:function()
  {
   return new LinkedListEnumerator.New(this);
  },
  FindLast:function(value)
  {
   var node,notFound;
   node=this.p;
   notFound=true;
   while(notFound&&!Unchecked.Equals(node,null))
    if(node.v==value)
     notFound=false;
    else
     node=node.p;
   return notFound?null:node;
  },
  Find:function(value)
  {
   var node,notFound;
   node=this.n;
   notFound=true;
   while(notFound&&!Unchecked.Equals(node,null))
    if(node.v==value)
     notFound=false;
    else
     node=node.n;
   return notFound?null:node;
  },
  Contains:function(value)
  {
   var found,node;
   found=false;
   node=this.n;
   while(!Unchecked.Equals(node,null)&&!found)
    if(node.v==value)
     found=true;
    else
     node=node.n;
   return found;
  },
  Clear:function()
  {
   this.c=0;
   this.n=null;
   this.p=null;
  },
  AddLast:function(value)
  {
   var node;
   return this.c===0?(node={
    p:null,
    n:null,
    v:value
   },(this.n=node,this.p=this.n,this.c=1,node)):this.AddAfter(this.p,value);
  },
  AddFirst:function(value)
  {
   var node;
   return this.c===0?(node={
    p:null,
    n:null,
    v:value
   },(this.n=node,this.p=this.n,this.c=1,node)):this.AddBefore(this.n,value);
  },
  AddBefore:function(before,value)
  {
   var after,node;
   after=before.p;
   node={
    p:after,
    n:before,
    v:value
   };
   Unchecked.Equals(before.p,null)?this.n=node:void 0;
   before.p=node;
   !Unchecked.Equals(after,null)?after.n=node:void 0;
   this.c=this.c+1;
   return node;
  },
  AddAfter:function(after,value)
  {
   var before,node;
   before=after.n;
   node={
    p:after,
    n:before,
    v:value
   };
   Unchecked.Equals(after.n,null)?this.p=node:void 0;
   after.n=node;
   !Unchecked.Equals(before,null)?before.p=node:void 0;
   this.c=this.c+1;
   return node;
  },
  GetEnumerator:function()
  {
   return this.GetEnumerator$1();
  },
  GetEnumerator0:function()
  {
   return this.GetEnumerator$1();
  }
 },null,LinkedList);
 LinkedList.New=Runtime.Ctor(function()
 {
  LinkedList.New$1.call(this,[]);
 },LinkedList);
 LinkedList.New$1=Runtime.Ctor(function(coll)
 {
  var ie,node;
  this.c=0;
  this.n=null;
  this.p=null;
  ie=Enumerator.Get(coll);
  ie.MoveNext()?(this.n={
   p:null,
   n:null,
   v:ie.Current()
  },this.p=this.n,this.c=1):void 0;
  while(ie.MoveNext())
   {
    node={
     p:this.p,
     n:null,
     v:ie.Current()
    };
    this.p.n=node;
    this.p=node;
    this.c=this.c+1;
   }
 },LinkedList);
 Grouping=WebSharper.Grouping=Runtime.Class({
  System_Linq_IGrouping_2$get_Key:function()
  {
   return this.k;
  },
  GetEnumerator0:function()
  {
   return Enumerator.Get0(this.v);
  },
  GetEnumerator:function()
  {
   return Enumerator.Get(this.v);
  }
 },null,Grouping);
 Grouping.New=Runtime.Ctor(function(k,v)
 {
  this.k=k;
  this.v=v;
 },Grouping);
 FsComparer=WebSharper.FsComparer=Runtime.Class({
  Compare:function(x,y)
  {
   return Unchecked.Compare(x,y);
  }
 },null,FsComparer);
 FsComparer.New=Runtime.Ctor(function()
 {
 },FsComparer);
 ProjectionComparer=WebSharper.ProjectionComparer=Runtime.Class({
  Compare:function(x,y)
  {
   return this.primary.Compare(this.projection(x),this.projection(y));
  }
 },null,ProjectionComparer);
 ProjectionComparer.New=Runtime.Ctor(function(primary,projection)
 {
  this.primary=primary;
  this.projection=projection;
 },ProjectionComparer);
 CompoundComparer=WebSharper.CompoundComparer=Runtime.Class({
  Compare:function(x,y)
  {
   var m;
   m=this.primary.Compare(x,y);
   return m===0?this.secondary.Compare(x,y):m;
  }
 },null,CompoundComparer);
 CompoundComparer.New=Runtime.Ctor(function(primary,secondary)
 {
  this.primary=primary;
  this.secondary=secondary;
 },CompoundComparer);
 ReverseComparer=WebSharper.ReverseComparer=Runtime.Class({
  Compare:function(x,y)
  {
   return this.primary.Compare(this.projection(y),this.projection(x));
  }
 },null,ReverseComparer);
 ReverseComparer.New=Runtime.Ctor(function(primary,projection)
 {
  this.primary=primary;
  this.projection=projection;
 },ReverseComparer);
 OrderedEnumerable=WebSharper.OrderedEnumerable=Runtime.Class({
  GetEnumerator0:function()
  {
   return Enumerator.Get(this);
  },
  GetEnumerator:function()
  {
   var $this,a;
   $this=this;
   a=Arrays.ofSeq(this.source);
   Arrays.sortInPlaceWith(function($1,$2)
   {
    return $this.primary.Compare($1,$2);
   },a);
   return Enumerator.Get(a);
  },
  System_Linq_IOrderedEnumerable_1$CreateOrderedEnumerable:function(keySelector,secondary,descending)
  {
   return new OrderedEnumerable.New(this.source,new CompoundComparer.New(this.primary,descending?new ReverseComparer.New(secondary,keySelector):new ProjectionComparer.New(secondary,keySelector)));
  }
 },null,OrderedEnumerable);
 OrderedEnumerable.New=Runtime.Ctor(function(source,primary)
 {
  this.source=source;
  this.primary=primary;
 },OrderedEnumerable);
 Linq.ElementAtOrDefault=function(_this,index,defaultValue)
 {
  try
  {
   return Seq.nth(index,_this);
  }
  catch(m)
  {
   return defaultValue;
  }
 };
 Linq.FirstOrDefault=function(_this,defaultValue)
 {
  var e;
  e=Enumerator.Get(_this);
  try
  {
   return e.MoveNext()?e.Current():defaultValue;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Linq.FirstOrDefault$1=function(_this,predicate,defaultValue)
 {
  var m;
  m=Seq.tryFind(predicate,_this);
  return m==null?defaultValue:m.$0;
 };
 Linq.LastOrDefault=function(_this,predicate,defaultValue)
 {
  var m;
  m=Linq.LastPred(_this,predicate);
  return m==null?defaultValue:m.$0;
 };
 Linq.SingleOrDefault=function(_this,predicate,defaultValue)
 {
  var e,found;
  e=Enumerator.Get(_this);
  try
  {
   found=null;
   while(e.MoveNext())
    if(predicate(e.Current()))
     if(found!=null&&found.$==1)
      Operators.InvalidOp("Sequence contains more than one element");
     else
      found={
       $:1,
       $0:e.Current()
      };
   return found==null?defaultValue:found.$0;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Linq.Where=function(_this,predicate)
 {
  return Seq.delay(function()
  {
   return Seq.enumUsing(Enumerator.Get(_this),function(e)
   {
    var i;
    i=0;
    return Seq.enumWhile(function()
    {
     return e.MoveNext();
    },Seq.delay(function()
    {
     return Seq.append(predicate(e.Current(),i)?[e.Current()]:[],Seq.delay(function()
     {
      i=i+1;
      return[];
     }));
    }));
   });
  });
 };
 Linq.Union=function(_this,second,comparer)
 {
  var tbl,e;
  tbl=new HashSet.New(_this,comparer);
  e=Enumerator.Get(second);
  try
  {
   while(e.MoveNext())
    tbl.Add(e.Current());
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
  return tbl;
 };
 Linq.ToDictionary=function(_this,keySelector,elementSelector,comparer)
 {
  var d;
  d=new Dictionary.New$3(comparer);
  Seq.iter(function(x)
  {
   d.Add(keySelector(x),elementSelector(x));
  },_this);
  return d;
 };
 Linq.ToDictionary$1=function(_this,keySelector,comparer)
 {
  var d;
  d=new Dictionary.New$3(comparer);
  Seq.iter(function(x)
  {
   d.Add(keySelector(x),x);
  },_this);
  return d;
 };
 Linq.TakeWhile=function(_this,predicate)
 {
  return Seq.delay(function()
  {
   return Seq.enumUsing(Enumerator.Get(_this),function(e)
   {
    return Seq.enumWhile(function()
    {
     return e.MoveNext()&&predicate(e.Current());
    },Seq.delay(function()
    {
     return[e.Current()];
    }));
   });
  });
 };
 Linq.TakeWhile$1=function(_this,predicate)
 {
  return Seq.delay(function()
  {
   return Seq.enumUsing(Enumerator.Get(_this),function(e)
   {
    var i;
    i=0;
    return Seq.enumWhile(function()
    {
     return e.MoveNext()&&predicate(e.Current(),i);
    },Seq.delay(function()
    {
     i=i+1;
     return[e.Current()];
    }));
   });
  });
 };
 Linq.Take=function(_this,count)
 {
  return Seq.delay(function()
  {
   return Seq.enumUsing(Enumerator.Get(_this),function(e)
   {
    var i;
    i=0;
    return Seq.enumWhile(function()
    {
     return i<count&&e.MoveNext();
    },Seq.delay(function()
    {
     i=i+1;
     return[e.Current()];
    }));
   });
  });
 };
 Linq.Sum=function(_this)
 {
  var s;
  s=Seq.choose(function(x)
  {
   return x!=null?{
    $:1,
    $0:Nullable.get(x)
   }:null;
  },_this);
  return Seq.isEmpty(s)?null:Seq.sum(s);
 };
 Linq.SkipWhile=function(_this,predicate)
 {
  return Seq.delay(function()
  {
   return Seq.enumUsing(Enumerator.Get(_this),function(e)
   {
    var predWasTrue;
    predWasTrue=true;
    return Seq.append(Seq.enumWhile(function()
    {
     return predWasTrue&&e.MoveNext();
    },Seq.delay(function()
    {
     return!predicate(e.Current())?(predWasTrue=false,[]):[];
    })),Seq.delay(function()
    {
     return!predWasTrue?Seq.append([e.Current()],Seq.delay(function()
     {
      return Seq.enumWhile(function()
      {
       return e.MoveNext();
      },Seq.delay(function()
      {
       return[e.Current()];
      }));
     })):[];
    }));
   });
  });
 };
 Linq.SkipWhile$1=function(_this,predicate)
 {
  return Seq.delay(function()
  {
   return Seq.enumUsing(Enumerator.Get(_this),function(e)
   {
    var i,predWasTrue;
    i=0;
    predWasTrue=true;
    return Seq.append(Seq.enumWhile(function()
    {
     return predWasTrue&&e.MoveNext();
    },Seq.delay(function()
    {
     return predicate(e.Current(),i)?(i=i+1,[]):(predWasTrue=false,[]);
    })),Seq.delay(function()
    {
     return!predWasTrue?Seq.append([e.Current()],Seq.delay(function()
     {
      return Seq.enumWhile(function()
      {
       return e.MoveNext();
      },Seq.delay(function()
      {
       return[e.Current()];
      }));
     })):[];
    }));
   });
  });
 };
 Linq.Skip=function(_this,count)
 {
  return Seq.delay(function()
  {
   return Seq.enumUsing(Enumerator.Get(_this),function(e)
   {
    var i;
    i=0;
    return Seq.append(Seq.enumWhile(function()
    {
     return i<count&&e.MoveNext();
    },Seq.delay(function()
    {
     i=i+1;
     return[];
    })),Seq.delay(function()
    {
     return Seq.enumWhile(function()
     {
      return e.MoveNext();
     },Seq.delay(function()
     {
      return[e.Current()];
     }));
    }));
   });
  });
 };
 Linq.Single=function(_this,predicate)
 {
  var x;
  function f(state,cur)
  {
   return predicate(cur)?state!=null?Operators.InvalidOp("Sequence contains more than one matching element"):{
    $:1,
    $0:cur
   }:state;
  }
  x=(((Runtime.Curried3(Seq.fold))(f))(null))(_this);
  return x!=null&&x.$==1?x.$0:Operators.InvalidOp("Sequence contains no elements");
 };
 Linq.SequenceEqual=function(_this,second,comparer)
 {
  var e1,$1,e2;
  e1=Enumerator.Get(_this);
  try
  {
   e2=Enumerator.Get(_this);
   try
   {
    $1=function()
    {
     while(true)
      if(e1.MoveNext())
      {
       if(!(e2.MoveNext()&&comparer.CEquals(e1.Current(),e2.Current())))
        return false;
      }
      else
       return!e2.MoveNext();
    }();
   }
   finally
   {
    if("Dispose"in e2)
     e2.Dispose();
   }
   return $1;
  }
  finally
  {
   if("Dispose"in e1)
    e1.Dispose();
  }
 };
 Linq.SelectMany=function(_this,selector,collectionSelector)
 {
  function m(t,cs)
  {
   return Seq.map(function(c)
   {
    return collectionSelector(t,c);
   },cs);
  }
  return Seq.collect(function($1)
  {
   return m($1[0],$1[1]);
  },Seq.mapi(function(i,t)
  {
   return[t,selector(t,i)];
  },_this));
 };
 Linq.SelectMany$1=function(_this,selector,collectionSelector)
 {
  function m(t,cs)
  {
   return Seq.map(function(c)
   {
    return collectionSelector(t,c);
   },cs);
  }
  return Seq.collect(function($1)
  {
   return m($1[0],$1[1]);
  },Seq.map(function(t)
  {
   return[t,selector(t)];
  },_this));
 };
 Linq.SelectMany$2=function(_this,selector)
 {
  return Seq.concat(Seq.mapi(function($1,$2)
  {
   return selector($2,$1);
  },_this));
 };
 Linq.Select=function(_this,selector)
 {
  return Seq.mapi(function($1,$2)
  {
   return selector($2,$1);
  },_this);
 };
 Linq.Reverse=function(_this)
 {
  return Arrays.ofSeq(_this).slice().reverse();
 };
 Linq.Repeat=function(element,count)
 {
  return Seq.init(count,function()
  {
   return element;
  });
 };
 Linq.Range=function(start,count)
 {
  return Seq.init(count,function(y)
  {
   return start+y;
  });
 };
 Linq.OrderByDescending=function(_this,keySelector,comparer)
 {
  return new OrderedEnumerable.New(_this,new ReverseComparer.New(comparer,keySelector));
 };
 Linq.OrderBy=function(_this,keySelector,comparer)
 {
  return new OrderedEnumerable.New(_this,new ProjectionComparer.New(comparer,keySelector));
 };
 Linq.Min=function(_this)
 {
  var s;
  s=Seq.choose(function(x)
  {
   return x!=null?{
    $:1,
    $0:Nullable.get(x)
   }:null;
  },_this);
  return Seq.isEmpty(s)?null:Seq.min(s);
 };
 Linq.Max=function(_this)
 {
  var s;
  s=Seq.choose(function(x)
  {
   return x!=null?{
    $:1,
    $0:Nullable.get(x)
   }:null;
  },_this);
  return Seq.isEmpty(s)?null:Seq.max(s);
 };
 Linq.Last=function(_this,predicate)
 {
  var m;
  m=Linq.LastPred(_this,predicate);
  return m==null?Operators.InvalidOp("Sequence contains no matching element"):m.$0;
 };
 Linq.LastPred=function(_this,predicate)
 {
  function f(acc,elt)
  {
   return predicate(elt)?{
    $:1,
    $0:elt
   }:acc;
  }
  return(((Runtime.Curried3(Seq.fold))(f))(null))(_this);
 };
 Linq.Join=function(outer,inner,outerKeySelector,innerKeySelector,resultSelector,comparer)
 {
  return Seq.delay(function()
  {
   var t,a,e;
   t=new Dictionary.New$3(comparer);
   a=Arrays.ofSeq(Seq.delay(function()
   {
    return Seq.collect(function(o)
    {
     var k,o$1,pair;
     k=outerKeySelector(o);
     return(o$1=null,[t.TryGetValue(k,{
      get:function()
      {
       return o$1;
      },
      set:function(v)
      {
       o$1=v;
      }
     }),o$1])[0]?[]:(pair=[o,new List.New$2()],(t.Add(k,pair),[pair]));
    },outer);
   }));
   e=Enumerator.Get(inner);
   try
   {
    while(e.MoveNext())
     (function()
     {
      var i,m,o;
      i=e.Current();
      m=(o=null,[t.TryGetValue(innerKeySelector(i),{
       get:function()
       {
        return o;
       },
       set:function(v)
       {
        o=v;
       }
      }),o]);
      return m[0]?m[1][1].Add(i):null;
     }());
   }
   finally
   {
    if("Dispose"in e)
     e.Dispose();
   }
   return Arrays.ofSeq(Seq.delay(function()
   {
    return Seq.collect(function(m)
    {
     var o;
     o=m[0];
     return Seq.map(function(i)
     {
      return resultSelector(o,i);
     },m[1]);
    },a);
   }));
  });
 };
 Linq.Intersect=function(_this,second,comparer)
 {
  var t1;
  t1=new HashSet.New(_this,comparer);
  return Seq.delay(function()
  {
   var t2;
   t2=new HashSet.New$1(comparer);
   return Seq.collect(function(x)
   {
    return t1.Contains(x)&&t2.Add(x)?[x]:[];
   },second);
  });
 };
 Linq.GroupJoin=function(outer,inner,outerKeySelector,innerKeySelector,resultSelector,comparer)
 {
  return Seq.delay(function()
  {
   var t,a,e;
   t=new Dictionary.New$3(comparer);
   a=Arrays.ofSeq(Seq.delay(function()
   {
    return Seq.collect(function(o)
    {
     var k,o$1,pair;
     k=outerKeySelector(o);
     return(o$1=null,[t.TryGetValue(k,{
      get:function()
      {
       return o$1;
      },
      set:function(v)
      {
       o$1=v;
      }
     }),o$1])[0]?[]:(pair=[o,new List.New$2()],(t.Add(k,pair),[pair]));
    },outer);
   }));
   e=Enumerator.Get(inner);
   try
   {
    while(e.MoveNext())
     (function()
     {
      var i,m,o;
      i=e.Current();
      m=(o=null,[t.TryGetValue(innerKeySelector(i),{
       get:function()
       {
        return o;
       },
       set:function(v)
       {
        o=v;
       }
      }),o]);
      return m[0]?m[1][1].Add(i):null;
     }());
   }
   finally
   {
    if("Dispose"in e)
     e.Dispose();
   }
   Arrays.iteri(function(i,t$1)
   {
    return Arrays.set(a,i,resultSelector(t$1[0],t$1[1]));
   },a);
   return a;
  });
 };
 Linq.GroupBy=function(_this,keySelector,elementSelector,resultSelector,comparer)
 {
  return Seq.map(function(g)
  {
   return resultSelector(g.System_Linq_IGrouping_2$get_Key(),g);
  },Linq.GroupBy$1(_this,keySelector,elementSelector,comparer));
 };
 Linq.GroupBy$1=function(_this,keySelector,elementSelector,comparer)
 {
  return Seq.delay(function()
  {
   return Arrays.ofSeq(Seq.delay(function()
   {
    var t;
    t=new Dictionary.New$3(comparer);
    return Seq.collect(function(x)
    {
     var k,e,m,o,a;
     k=keySelector(x);
     e=elementSelector(x);
     m=(o=null,[t.TryGetValue(k,{
      get:function()
      {
       return o;
      },
      set:function(v)
      {
       o=v;
      }
     }),o]);
     return m[0]?(m[1].Add(e),[]):(a=new List.New$2(),(a.Add(e),t.set_Item(k,a),[new Grouping.New(k,a)]));
    },_this);
   }));
  });
 };
 Linq.Except=function(_this,second,comparer)
 {
  var tbl,e;
  tbl=new HashSet.New(_this,comparer);
  e=Enumerator.Get(second);
  try
  {
   while(e.MoveNext())
    tbl.Remove(e.Current());
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
  return tbl;
 };
 Linq.Distinct=function(_this,comparer)
 {
  return Seq.delay(function()
  {
   return Seq.enumUsing(Enumerator.Get(_this),function(e)
   {
    var tbl;
    tbl=new HashSet.New$1(comparer);
    return Seq.enumWhile(function()
    {
     return e.MoveNext();
    },Seq.delay(function()
    {
     return tbl.Add(e.Current())?[e.Current()]:[];
    }));
   });
  });
 };
 Linq.DefaultIfEmpty=function(_this,defaultValue)
 {
  return Seq.isEmpty(_this)?[defaultValue]:_this;
 };
 Linq.Average=function(_this)
 {
  var x,e,c,c$1;
  x=[];
  e=Enumerator.Get(_this);
  try
  {
   while(e.MoveNext())
    {
     if(c=e.Current(),c!=null)
      {
       x.push((c$1=e.Current(),Nullable.get(c$1)));
      }
    }
   return Arrays.length(x)===0?null:Seq.sum(x)/Global.Number(Arrays.length(x));
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Message.Completed={
  $:2
 };
 Observer.New=function(f,e,c)
 {
  return{
   OnNext:f,
   OnError:e,
   OnCompleted:function()
   {
    return c();
   }
  };
 };
 Observer.Of=function(f)
 {
  return{
   OnNext:f,
   OnError:function(x)
   {
    throw x;
   },
   OnCompleted:function()
   {
    return null;
   }
  };
 };
 HotStream$1=HotStream.HotStream=Runtime.Class({
  Trigger:function(v)
  {
   this.Latest[0]={
    $:1,
    $0:v
   };
   this.Event.event.Trigger(v);
  },
  Subscribe:function(o)
  {
   this.Latest[0]!=null?o.OnNext(this.Latest[0].$0):void 0;
   return this.Event.event.Subscribe(Util.observer(function(v)
   {
    o.OnNext(v);
   }));
  }
 },null,HotStream$1);
 HotStream$1.New$1=function()
 {
  return HotStream$1.New([null],new FSharpEvent.New());
 };
 HotStream$1.New=function(Latest,Event$2)
 {
  return new HotStream$1({
   Latest:Latest,
   Event:Event$2
  });
 };
 Observable.Sequence=function(ios)
 {
  function sequence(ios$1)
  {
   return ios$1.$==1?Observable.CombineLatest(ios$1.$0,sequence(ios$1.$1),function($1,$2)
   {
    return new T$1({
     $:1,
     $0:$1,
     $1:$2
    });
   }):Observable.Return(T$1.Empty);
  }
  return sequence(List$1.ofSeq(ios));
 };
 Observable.Aggregate=function(io,seed,fold)
 {
  return{
   Subscribe:function(o1)
   {
    var state;
    state=[seed];
    return io.Subscribe(Observer.New(function(v)
    {
     Observable.Protect(function()
     {
      return fold(state[0],v);
     },function(s)
     {
      state[0]=s;
      o1.OnNext(s);
     },function(a)
     {
      o1.OnError(a);
     });
    },function(a)
    {
     o1.OnError(a);
    },function()
    {
     o1.OnCompleted();
    }));
   }
  };
 };
 Observable.SelectMany=function(io)
 {
  return{
   Subscribe:function(o)
   {
    var disp,d;
    function dispose()
    {
     disp[0]();
     d.Dispose();
    }
    disp=[Global.ignore];
    d=io.Subscribe(Util.observer(function(o1)
    {
     var d$1;
     d$1=o1.Subscribe(Util.observer(function(v)
     {
      o.OnNext(v);
     }));
     disp[0]=function()
     {
      disp[0]();
      d$1.Dispose();
     };
    }));
    return{
     Dispose:function()
     {
      return dispose();
     }
    };
   }
  };
 };
 Observable.Switch=function(io)
 {
  return{
   Subscribe:function(o)
   {
    var index,disp;
    index=[0];
    disp=[null];
    return io.Subscribe(Util.observer(function(o1)
    {
     var currentIndex;
     index[0]++;
     disp[0]!=null?disp[0].$0.Dispose():void 0;
     currentIndex=index[0];
     disp[0]={
      $:1,
      $0:o1.Subscribe(Util.observer(function(v)
      {
       if(currentIndex===index[0])
        o.OnNext(v);
      }))
     };
    }));
   }
  };
 };
 Observable.CombineLatest=function(io1,io2,f)
 {
  return{
   Subscribe:function(o)
   {
    var lv1,lv2,d1,d2;
    function update()
    {
     var $1,$2,v1,v2;
     $1=lv1[0];
     $2=lv2[0];
     $1!=null&&$1.$==1?$2!=null&&$2.$==1?(v1=$1.$0,v2=$2.$0,Observable.Protect(function()
     {
      return f(v1,v2);
     },function(a)
     {
      o.OnNext(a);
     },function(a)
     {
      o.OnError(a);
     })):void 0:void 0;
    }
    function dispose()
    {
     d1.Dispose();
     d2.Dispose();
    }
    lv1=[null];
    lv2=[null];
    d1=io1.Subscribe(Observer.New(function(x)
    {
     lv1[0]={
      $:1,
      $0:x
     };
     update();
    },Global.ignore,Global.ignore));
    d2=io2.Subscribe(Observer.New(function(y)
    {
     lv2[0]={
      $:1,
      $0:y
     };
     update();
    },Global.ignore,Global.ignore));
    return{
     Dispose:function()
     {
      return dispose();
     }
    };
   }
  };
 };
 Observable.Range=function(start,count)
 {
  return{
   Subscribe:function(o)
   {
    var i,$1;
    function dispose()
    {
    }
    for(i=start,$1=start+count;i<=$1;i++)o.OnNext(i);
    return{
     Dispose:function()
     {
      return dispose();
     }
    };
   }
  };
 };
 Observable.Concat=function(io1,io2)
 {
  return{
   Subscribe:function(o)
   {
    var innerDisp,outerDisp;
    function d()
    {
     innerDisp[0]!=null?innerDisp[0].$0.Dispose():void 0;
     outerDisp.Dispose();
    }
    innerDisp=[null];
    outerDisp=io1.Subscribe(Observer.New(function(a)
    {
     o.OnNext(a);
    },Global.ignore,function()
    {
     innerDisp[0]={
      $:1,
      $0:io2.Subscribe(o)
     };
    }));
    return{
     Dispose:function()
     {
      return d();
     }
    };
   }
  };
 };
 Observable.Merge=function(io1,io2)
 {
  return{
   Subscribe:function(o)
   {
    var completed1,completed2,disp1,disp2;
    function dispose()
    {
     disp1.Dispose();
     disp2.Dispose();
    }
    completed1=[false];
    completed2=[false];
    disp1=io1.Subscribe(Observer.New(function(a)
    {
     o.OnNext(a);
    },Global.ignore,function()
    {
     completed1[0]=true;
     completed1[0]&&completed2[0]?o.OnCompleted():void 0;
    }));
    disp2=io2.Subscribe(Observer.New(function(a)
    {
     o.OnNext(a);
    },Global.ignore,function()
    {
     completed2[0]=true;
     completed1[0]&&completed2[0]?o.OnCompleted():void 0;
    }));
    return{
     Dispose:function()
     {
      return dispose();
     }
    };
   }
  };
 };
 Observable.Drop=function(count,io)
 {
  return{
   Subscribe:function(o1)
   {
    var index;
    index=[0];
    return io.Subscribe(Observer.New(function(v)
    {
     index[0]++;
     index[0]>count?o1.OnNext(v):void 0;
    },function(a)
    {
     o1.OnError(a);
    },function()
    {
     o1.OnCompleted();
    }));
   }
  };
 };
 Observable.Choose=function(f,io)
 {
  return{
   Subscribe:function(o1)
   {
    return io.Subscribe(Observer.New(function(v)
    {
     function a(a$1)
     {
      o1.OnNext(a$1);
     }
     Observable.Protect(function()
     {
      return f(v);
     },function(o)
     {
      if(o==null)
       ;
      else
       a(o.$0);
     },function(a$1)
     {
      o1.OnError(a$1);
     });
    },function(a)
    {
     o1.OnError(a);
    },function()
    {
     o1.OnCompleted();
    }));
   }
  };
 };
 Observable.Filter=function(f,io)
 {
  return{
   Subscribe:function(o1)
   {
    return io.Subscribe(Observer.New(function(v)
    {
     function a(a$1)
     {
      o1.OnNext(a$1);
     }
     Observable.Protect(function()
     {
      return f(v)?{
       $:1,
       $0:v
      }:null;
     },function(o)
     {
      if(o==null)
       ;
      else
       a(o.$0);
     },function(a$1)
     {
      o1.OnError(a$1);
     });
    },function(a)
    {
     o1.OnError(a);
    },function()
    {
     o1.OnCompleted();
    }));
   }
  };
 };
 Observable.Map=function(f,io)
 {
  return{
   Subscribe:function(o1)
   {
    return io.Subscribe(Observer.New(function(v)
    {
     Observable.Protect(function()
     {
      return f(v);
     },function(a)
     {
      o1.OnNext(a);
     },function(a)
     {
      o1.OnError(a);
     });
    },function(a)
    {
     o1.OnError(a);
    },function()
    {
     o1.OnCompleted();
    }));
   }
  };
 };
 Observable.Protect=function(f,succeed,fail)
 {
  var m;
  try
  {
   m={
    $:0,
    $0:f()
   };
  }
  catch(e)
  {
   m={
    $:1,
    $0:e
   };
  }
  return m.$==1?fail(m.$0):succeed(m.$0);
 };
 Observable.Never=function()
 {
  return{
   Subscribe:function()
   {
    function dispose()
    {
    }
    return{
     Dispose:function()
     {
      return dispose();
     }
    };
   }
  };
 };
 Observable.Return=function(x)
 {
  return{
   Subscribe:function(o)
   {
    function dispose()
    {
    }
    o.OnNext(x);
    o.OnCompleted();
    return{
     Dispose:function()
     {
      return dispose();
     }
    };
   }
  };
 };
 Observable.Of=function(f)
 {
  return{
   Subscribe:function(o)
   {
    var dispose;
    dispose=f(function(x)
    {
     o.OnNext(x);
    });
    return{
     Dispose:function()
     {
      return dispose();
     }
    };
   }
  };
 };
 ObservableModule.Split=function(f,e)
 {
  return[Observable.Choose(function(x)
  {
   var m;
   m=f(x);
   return m.$==0?{
    $:1,
    $0:m.$0
   }:null;
  },e),Observable.Choose(function(x)
  {
   var m;
   m=f(x);
   return m.$==1?{
    $:1,
    $0:m.$0
   }:null;
  },e)];
 };
 ObservableModule.Scan=function(fold,seed,e)
 {
  return{
   Subscribe:function(o1)
   {
    var state;
    state=[seed];
    return e.Subscribe(Observer.New(function(v)
    {
     Observable.Protect(function()
     {
      return fold(state[0],v);
     },function(s)
     {
      state[0]=s;
      o1.OnNext(s);
     },function(a)
     {
      o1.OnError(a);
     });
    },function(a)
    {
     o1.OnError(a);
    },function()
    {
     o1.OnCompleted();
    }));
   }
  };
 };
 ObservableModule.Partition=function(f,e)
 {
  function g(v)
  {
   return!v;
  }
  return[Observable.Filter(f,e),Observable.Filter(function(x)
  {
   return g(f(x));
  },e)];
 };
 ObservableModule.Pairwise=function(e)
 {
  return{
   Subscribe:function(o1)
   {
    var last;
    last=[null];
    return e.Subscribe(Observer.New(function(v)
    {
     var m;
     m=last[0];
     m!=null&&m.$==1?o1.OnNext([m.$0,v]):void 0;
     last[0]={
      $:1,
      $0:v
     };
    },function(a)
    {
     o1.OnError(a);
    },function()
    {
     o1.OnCompleted();
    }));
   }
  };
 };
 Event$1=Event.Event=Runtime.Class({
  Subscribe$1:function(observer)
  {
   var $this;
   function h(a,x)
   {
    return observer.OnNext(x);
   }
   function dispose()
   {
    $this.RemoveHandler$1(h);
   }
   $this=this;
   this.AddHandler$1(h);
   return{
    Dispose:function()
    {
     return dispose();
    }
   };
  },
  RemoveHandler$1:function(h)
  {
   var o;
   o=Seq.tryFindIndex(function(y)
   {
    return Unchecked.Equals(h,y);
   },this.Handlers);
   o==null?void 0:this.Handlers.RemoveAt(o.$0);
  },
  AddHandler$1:function(h)
  {
   this.Handlers.Add(h);
  },
  Trigger:function(x)
  {
   var a,i,$1;
   a=this.Handlers.ToArray();
   for(i=0,$1=a.length-1;i<=$1;i++)(Arrays.get(a,i))(null,x);
  },
  RemoveHandler:function(x)
  {
   this.RemoveHandler$1(x);
  },
  AddHandler:function(x)
  {
   this.AddHandler$1(x);
  },
  Subscribe:function(observer)
  {
   return this.Subscribe$1(observer);
  },
  Dispose:Global.ignore
 },null,Event$1);
 Event$1.New=function(Handlers)
 {
  return new Event$1({
   Handlers:Handlers
  });
 };
 DelegateEvent$1=DelegateEvent.DelegateEvent=Runtime.Class({
  RemoveHandler$1:function(h)
  {
   var o;
   o=Seq.tryFindIndex(function(y)
   {
    return Unchecked.Equals(h,y);
   },this.Handlers);
   o==null?void 0:this.Handlers.RemoveAt(o.$0);
  },
  AddHandler$1:function(h)
  {
   this.Handlers.Add(h);
  },
  Trigger:function(x)
  {
   var a,i,$1;
   a=this.Handlers.ToArray();
   for(i=0,$1=a.length-1;i<=$1;i++)Arrays.get(a,i).apply(null,x);
  },
  RemoveHandler:function(x)
  {
   this.RemoveHandler$1(x);
  },
  AddHandler:function(x)
  {
   this.AddHandler$1(x);
  },
  Dispose:Global.ignore
 },null,DelegateEvent$1);
 DelegateEvent$1.New=function(Handlers)
 {
  return new DelegateEvent$1({
   Handlers:Handlers
  });
 };
 FSharpEvent=Control.FSharpEvent=Runtime.Class({},null,FSharpEvent);
 FSharpEvent.New=Runtime.Ctor(function()
 {
  this.event=Event$1.New(new List.New$2());
 },FSharpEvent);
 FSharpDelegateEvent=Control.FSharpDelegateEvent=Runtime.Class({},null,FSharpDelegateEvent);
 FSharpDelegateEvent.New=Runtime.Ctor(function()
 {
  this.event=DelegateEvent$1.New(new List.New$2());
 },FSharpDelegateEvent);
 EventModule.Split=function(f,e)
 {
  return[EventModule.Choose(function(x)
  {
   var m;
   m=f(x);
   return m.$==0?{
    $:1,
    $0:m.$0
   }:null;
  },e),EventModule.Choose(function(x)
  {
   var m;
   m=f(x);
   return m.$==1?{
    $:1,
    $0:m.$0
   }:null;
  },e)];
 };
 EventModule.Scan=function(fold,seed,e)
 {
  var state;
  state=[seed];
  return EventModule.Map(function(value)
  {
   state[0]=fold(state[0],value);
   return state[0];
  },e);
 };
 EventModule.Partition=function(f,e)
 {
  function g(v)
  {
   return!v;
  }
  return[EventModule.Filter(f,e),EventModule.Filter(function(x)
  {
   return g(f(x));
  },e)];
 };
 EventModule.Pairwise=function(e)
 {
  var buf,ev;
  buf=[null];
  ev=Event$1.New(new List.New$2());
  e.Subscribe(Util.observer(function(x)
  {
   var m;
   m=buf[0];
   m!=null&&m.$==1?(buf[0]={
    $:1,
    $0:x
   },ev.Trigger([m.$0,x])):buf[0]={
    $:1,
    $0:x
   };
  }));
  return ev;
 };
 EventModule.Merge=function(e1,e2)
 {
  var r;
  r=Event$1.New(new List.New$2());
  e1.Subscribe(Util.observer(function(a)
  {
   r.Trigger(a);
  }));
  e2.Subscribe(Util.observer(function(a)
  {
   r.Trigger(a);
  }));
  return r;
 };
 EventModule.Map=function(f,e)
 {
  var r;
  r=Event$1.New(new List.New$2());
  e.Subscribe(Util.observer(function(x)
  {
   r.Trigger(f(x));
  }));
  return r;
 };
 EventModule.Filter=function(ok,e)
 {
  var r;
  r=Event$1.New(new List.New$2());
  e.Subscribe(Util.observer(function(x)
  {
   if(ok(x))
    r.Trigger(x);
  }));
  return r;
 };
 EventModule.Choose=function(c,e)
 {
  var r;
  r=new FSharpEvent.New();
  e.Subscribe(Util.observer(function(x)
  {
   var m;
   m=c(x);
   m==null?void 0:r.event.Trigger(m.$0);
  }));
  return r.event;
 };
 MailboxProcessor=Control.MailboxProcessor=Runtime.Class({
  dequeue:function()
  {
   var f;
   f=this.mailbox.n.v;
   this.mailbox.RemoveFirst();
   return f;
  },
  resume:function()
  {
   var m;
   m=this.savedCont;
   m!=null&&m.$==1?(this.savedCont=null,this.startAsync(m.$0)):void 0;
  },
  startAsync:function(a)
  {
   Concurrency.Start(a,this.token);
  },
  Scan:function(scanner,timeout)
  {
   var $this,b;
   $this=this;
   b=null;
   return Concurrency.Delay(function()
   {
    return Concurrency.Bind($this.TryScan(scanner,timeout),function(a)
    {
     var $1,$2;
     if(a!=null&&a.$==1)
      $2=a.$0;
     else
      throw new TimeoutException.New();
     return Concurrency.Return($2);
    });
   });
  },
  TryScan:function(scanner,timeout)
  {
   var $this,timeout$1,d,b;
   $this=this;
   timeout$1=(d=this.get_DefaultTimeout(),timeout==null?d:timeout.$0);
   b=null;
   return Concurrency.Delay(function()
   {
    var m,m$1,found,m$2;
    function a(ok)
    {
     var waiting,pending;
     if(timeout$1<0)
      {
       function scanNext()
       {
        var b$1;
        $this.savedCont={
         $:1,
         $0:(b$1=null,Concurrency.Delay(function()
         {
          var m$3;
          m$3=scanner($this.mailbox.n.v);
          return m$3!=null&&m$3.$==1?($this.mailbox.RemoveFirst(),Concurrency.Bind(m$3.$0,function(a$1)
          {
           ok({
            $:1,
            $0:a$1
           });
           return Concurrency.Zero();
          })):(scanNext(),Concurrency.Zero());
         }))
        };
       }
       scanNext();
      }
     else
      {
       function scanNext$1()
       {
        var b$1;
        $this.savedCont={
         $:1,
         $0:(b$1=null,Concurrency.Delay(function()
         {
          var m$3;
          m$3=scanner($this.mailbox.n.v);
          return m$3!=null&&m$3.$==1?($this.mailbox.RemoveFirst(),Concurrency.Bind(m$3.$0,function(a$1)
          {
           return waiting[0]?(waiting[0]=false,Global.clearTimeout(pending),ok({
            $:1,
            $0:a$1
           }),Concurrency.Zero()):Concurrency.Zero();
          })):(scanNext$1(),Concurrency.Zero());
         }))
        };
       }
       waiting=[true];
       pending=Global.setTimeout(function()
       {
        if(waiting[0])
         {
          waiting[0]=false;
          $this.savedCont=null;
          ok(null);
         }
       },timeout$1);
       scanNext$1();
      }
    }
    m$1=$this.mailbox.n;
    found=null;
    while(!Unchecked.Equals(m$1,null))
     {
      m$2=scanner(m$1.v);
      m$2==null?m$1=m$1.n:($this.mailbox.Remove$1(m$1),m$1=null,found=m$2);
     }
    m=found;
    return m!=null&&m.$==1?Concurrency.Bind(m.$0,function(a$1)
    {
     return Concurrency.Return({
      $:1,
      $0:a$1
     });
    }):Concurrency.FromContinuations(function($1,$2,$3)
    {
     return a.apply(null,[$1,$2,$3]);
    });
   });
  },
  PostAndAsyncReply:function(msgf,timeout)
  {
   var $this,b;
   $this=this;
   b=null;
   return Concurrency.Delay(function()
   {
    return Concurrency.Bind($this.PostAndTryAsyncReply(msgf,timeout),function(a)
    {
     var $1,$2;
     if(a!=null&&a.$==1)
      $2=a.$0;
     else
      throw new TimeoutException.New();
     return Concurrency.Return($2);
    });
   });
  },
  PostAndTryAsyncReply:function(msgf,timeout)
  {
   var $this,timeout$1,d;
   function a(ok)
   {
    var waiting;
    if(timeout$1<0)
     {
      function f(a$1)
      {
       return{
        $:1,
        $0:a$1
       };
      }
      $this.mailbox.AddLast(msgf(function(x)
      {
       return ok(f(x));
      }));
      $this.resume();
     }
    else
     {
      waiting=[true];
      $this.mailbox.AddLast(msgf(function(res)
      {
       if(waiting[0])
        {
         waiting[0]=false;
         ok({
          $:1,
          $0:res
         });
        }
      }));
      $this.resume();
      Global.setTimeout(function()
      {
       if(waiting[0])
        {
         waiting[0]=false;
         ok(null);
        }
      },timeout$1);
     }
   }
   $this=this;
   timeout$1=(d=this.get_DefaultTimeout(),timeout==null?d:timeout.$0);
   return Concurrency.FromContinuations(function($1,$2,$3)
   {
    return a.apply(null,[$1,$2,$3]);
   });
  },
  get_CurrentQueueLength:function()
  {
   return this.mailbox.c;
  },
  Receive:function(timeout)
  {
   var $this,b;
   $this=this;
   b=null;
   return Concurrency.Delay(function()
   {
    return Concurrency.Bind($this.TryReceive(timeout),function(a)
    {
     var $1,$2;
     if(a!=null&&a.$==1)
      $2=a.$0;
     else
      throw new TimeoutException.New();
     return Concurrency.Return($2);
    });
   });
  },
  TryReceive:function(timeout)
  {
   var $this,timeout$1,d;
   function a(ok)
   {
    var b,waiting,pending,b$1;
    if(Unchecked.Equals($this.mailbox.n,null))
    {
     if(timeout$1<0)
      {
       $this.savedCont={
        $:1,
        $0:(b=null,Concurrency.Delay(function()
        {
         ok({
          $:1,
          $0:$this.dequeue()
         });
         return Concurrency.Zero();
        }))
       };
      }
     else
      {
       waiting=[true];
       pending=Global.setTimeout(function()
       {
        if(waiting[0])
         {
          waiting[0]=false;
          $this.savedCont=null;
          ok(null);
         }
       },timeout$1);
       $this.savedCont={
        $:1,
        $0:(b$1=null,Concurrency.Delay(function()
        {
         return waiting[0]?(waiting[0]=false,Global.clearTimeout(pending),ok({
          $:1,
          $0:$this.dequeue()
         }),Concurrency.Zero()):Concurrency.Zero();
        }))
       };
      }
    }
    else
     ok({
      $:1,
      $0:$this.dequeue()
     });
   }
   $this=this;
   timeout$1=(d=this.get_DefaultTimeout(),timeout==null?d:timeout.$0);
   return Concurrency.FromContinuations(function($1,$2,$3)
   {
    return a.apply(null,[$1,$2,$3]);
   });
  },
  Start:function()
  {
   var $this,b;
   $this=this;
   this.started?Operators.FailWith("The MailboxProcessor has already been started."):(this.started=true,$this.startAsync((b=null,Concurrency.Delay(function()
   {
    return Concurrency.TryWith(Concurrency.Delay(function()
    {
     return Concurrency.Bind($this.initial($this),function()
     {
      return Concurrency.Return(null);
     });
    }),function(a)
    {
     $this.errorEvent.event.Trigger(a);
     return Concurrency.Zero();
    });
   }))));
  },
  set_DefaultTimeout:function(v)
  {
   this.DefaultTimeout=v;
  },
  get_DefaultTimeout:function()
  {
   return this.DefaultTimeout;
  },
  remove_Error:function(handler)
  {
   this.errorEvent.event.RemoveHandler(handler);
  },
  add_Error:function(handler)
  {
   this.errorEvent.event.AddHandler(handler);
  },
  get_Error:function()
  {
   return this.errorEvent.event;
  }
 },null,MailboxProcessor);
 MailboxProcessor.Start=function(initial,token)
 {
  var mb;
  mb=new MailboxProcessor.New(initial,token);
  mb.Start();
  return mb;
 };
 MailboxProcessor.New=Runtime.Ctor(function(initial,token)
 {
  var $this,m;
  function callback(u)
  {
   return $this.resume();
  }
  $this=this;
  this.initial=initial;
  this.token=token;
  this.started=false;
  this.errorEvent=new FSharpEvent.New();
  this.mailbox=new LinkedList.New();
  this.savedCont=null;
  m=this.token;
  m==null?void 0:Concurrency.Register(m.$0,function()
  {
   callback();
  });
  this.DefaultTimeout=-1;
 },MailboxProcessor);
 JSModule.GetFieldValues=function(o)
 {
  var r,k;
  r=[];
  for(var k$1 in o)r.push(o[k$1]);
  return r;
 };
 JSModule.GetFieldNames=function(o)
 {
  var r,k;
  r=[];
  for(var k$1 in o)r.push(k$1);
  return r;
 };
 JSModule.GetFields=function(o)
 {
  var r,k;
  r=[];
  for(var k$1 in o)r.push([k$1,o[k$1]]);
  return r;
 };
 EqualityComparer=Collections.EqualityComparer=Runtime.Class({
  CGetHashCode0:function(x)
  {
   return this.GetHashCode(x);
  },
  CEquals0:function(x,y)
  {
   return this.Equals(x,y);
  },
  CGetHashCode:function(x)
  {
   return this.GetHashCode(x);
  },
  CEquals:function(x,y)
  {
   return this.Equals(x,y);
  }
 },null,EqualityComparer);
 EqualityComparer.New=Runtime.Ctor(function()
 {
 },EqualityComparer);
 EquatableEqualityComparer=MacroModule.EquatableEqualityComparer=Runtime.Class({
  GetHashCode:function(x)
  {
   return Unchecked.Hash(x);
  },
  Equals:function(x,y)
  {
   return x.EEquals(y);
  }
 },EqualityComparer,EquatableEqualityComparer);
 EquatableEqualityComparer.New=Runtime.Ctor(function()
 {
  EqualityComparer.New.call(this);
 },EquatableEqualityComparer);
 BaseEqualityComparer=MacroModule.BaseEqualityComparer=Runtime.Class({
  GetHashCode:function(x)
  {
   return Unchecked.Hash(x);
  },
  Equals:function(x,y)
  {
   return Unchecked.Equals(x,y);
  }
 },EqualityComparer,BaseEqualityComparer);
 BaseEqualityComparer.New=Runtime.Ctor(function()
 {
  EqualityComparer.New.call(this);
 },BaseEqualityComparer);
 Comparer=Collections.Comparer=Runtime.Class({
  Compare0:function(x,y)
  {
   return this.Compare$1(x,y);
  },
  Compare:function(x,y)
  {
   return this.Compare$1(x,y);
  }
 },null,Comparer);
 Comparer.New=Runtime.Ctor(function()
 {
 },Comparer);
 ComparableComparer=MacroModule.ComparableComparer=Runtime.Class({
  Compare$1:function(x,y)
  {
   return x.CompareTo(y);
  }
 },Comparer,ComparableComparer);
 ComparableComparer.New=Runtime.Ctor(function()
 {
  Comparer.New.call(this);
 },ComparableComparer);
 BaseComparer=MacroModule.BaseComparer=Runtime.Class({
  Compare$1:function(x,y)
  {
   return Unchecked.Compare(x,y);
  }
 },Comparer,BaseComparer);
 BaseComparer.New=Runtime.Ctor(function()
 {
  Comparer.New.call(this);
 },BaseComparer);
 Pervasives.GetJS=function(x,items)
 {
  var x$1,e;
  x$1=x;
  e=Enumerator.Get(items);
  try
  {
   while(e.MoveNext())
    x$1=x$1[e.Current()];
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
  return x$1;
 };
 Pervasives.NewFromSeq=function(fields)
 {
  var r,e,f;
  r={};
  e=Enumerator.Get(fields);
  try
  {
   while(e.MoveNext())
    {
     f=e.Current();
     r[f[0]]=f[1];
    }
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
  return r;
 };
 Json.Activate=function(json)
 {
  var types,i,$1;
  function decode(x)
  {
   var o,ti,t,r,k;
   if(Unchecked.Equals(x,null))
    return x;
   else
    if(typeof x=="object")
    {
     if(x instanceof Global.Array)
      return Json.shallowMap(decode,x);
     else
      {
       o=Json.shallowMap(decode,x.$V);
       ti=x.$T;
       if(Unchecked.Equals(typeof ti,"undefined"))
        return o;
       else
        {
         t=Arrays.get(types,ti);
         if(t===window.WebSharper.List.T)
          return List$1.ofArray(o);
         else
          {
           r=new(Arrays.get(types,ti))();
           for(var k$1 in o)if(function(k$2)
           {
            r[k$2]=o[k$2];
            return false;
           }(k$1))
            break;
           return r;
          }
        }
      }
    }
    else
     return x;
  }
  types=json.$TYPES;
  for(i=0,$1=Arrays.length(types)-1;i<=$1;i++)Arrays.set(types,i,Json.lookup(Arrays.get(types,i)));
  return decode(json.$DATA);
 };
 Json.shallowMap=function(f,x)
 {
  var r,k;
  if(x instanceof Global.Array)
   return Arrays.map(f,x);
  else
   if(typeof x=="object")
    {
     r={};
     for(var k$1 in x)if(function(y)
     {
      r[y]=f(x[y]);
      return false;
     }(k$1))
      break;
     return r;
    }
   else
    return x;
 };
 Json.lookup=function(x)
 {
  var r,i,k,n,rn;
  k=Arrays.length(x);
  r=window;
  i=0;
  while(i<k)
   {
    n=Arrays.get(x,i);
    rn=r[n];
    !Unchecked.Equals(typeof rn,void 0)?(r=rn,i=i+1):Operators.FailWith("Invalid server reply. Failed to find type: "+n);
   }
  return r;
 };
 XhrProvider=Remoting.XhrProvider=Runtime.Class({
  Sync:function(url,headers,data)
  {
   var res;
   res=[null];
   Remoting.ajax(false,url,headers,data,function(x)
   {
    res[0]=x;
   },function(e)
   {
    throw e;
   },function()
   {
    Remoting.ajax(false,url,headers,data,function(x)
    {
     res[0]=x;
    },function(e)
    {
     throw e;
    },void 0);
   });
   return res[0];
  },
  Async:function(url,headers,data,ok,err)
  {
   Remoting.ajax(true,url,headers,data,ok,err,function()
   {
    Remoting.ajax(true,url,headers,data,ok,err,void 0);
   });
  }
 },null,XhrProvider);
 XhrProvider.New=Runtime.Ctor(function()
 {
 },XhrProvider);
 AjaxRemotingProvider=Remoting.AjaxRemotingProvider=Runtime.Class({
  get_EndPoint:function()
  {
   return Remoting.EndPoint();
  },
  AsyncBase:function(m,data)
  {
   var $this,b;
   $this=this;
   b=null;
   return Concurrency.Delay(function()
   {
    var headers,payload;
    headers=Remoting.makeHeaders(m);
    payload=Remoting.makePayload(data);
    return Concurrency.Bind(Concurrency.GetCT(),function(a)
    {
     return Concurrency.FromContinuations(function(ok,err,cc)
     {
      var waiting,reg,a$1;
      function callback(u)
      {
       return waiting[0]?(waiting[0]=false,cc(new OperationCanceledException.New(a))):null;
      }
      waiting=[true];
      reg=Concurrency.Register(a,function()
      {
       callback();
      });
      a$1=$this.get_EndPoint();
      return Remoting.AjaxProvider().Async(a$1,headers,payload,function(x)
      {
       if(waiting[0])
        {
         waiting[0]=false;
         reg.Dispose();
         ok(Json.Activate(JSON.parse(x)));
        }
      },function(e)
      {
       if(waiting[0])
        {
         waiting[0]=false;
         reg.Dispose();
         err(e);
        }
      });
     });
    });
   });
  },
  Send:function(m,data)
  {
   Concurrency.Start(this.AsyncBase(m,data),null);
  },
  Task:function(m,data)
  {
   return Concurrency.StartAsTask(this.AsyncBase(m,data),null);
  },
  Async:function(m,data)
  {
   return this.AsyncBase(m,data);
  },
  Sync:function(m,data)
  {
   var a,a$1,a$2;
   return Json.Activate(JSON.parse((a=this.get_EndPoint(),(a$1=Remoting.makeHeaders(m),(a$2=Remoting.makePayload(data),Remoting.AjaxProvider().Sync(a,a$1,a$2))))));
  }
 },null,AjaxRemotingProvider);
 AjaxRemotingProvider.New=Runtime.Ctor(function()
 {
 },AjaxRemotingProvider);
 Remoting.ajax=function(async,url,headers,data,ok,err,csrf)
 {
  var xhr,csrf$1,h;
  xhr=new Global.XMLHttpRequest();
  csrf$1=Global.document.cookie.replace(new Global.RegExp("(?:(?:^|.*;)\\s*csrftoken\\s*\\=\\s*([^;]*).*$)|^.*$"),"$1");
  xhr.open("POST",url,async);
  if(async==true)
   xhr.withCredentials=true;
  for(var h$1 in headers)xhr.setRequestHeader(h$1,headers[h$1]);
  if(csrf$1)
   xhr.setRequestHeader("x-csrftoken",csrf$1);
  function k()
  {
   var msg;
   if(xhr.status==200)
    ok(xhr.responseText);
   else
    if(csrf&&xhr.status==403&&xhr.responseText=="CSRF")
     csrf();
    else
     {
      msg="Response status is not 200: ";
      err(new Global.Error(msg+xhr.status));
     }
  }
  if("onload"in xhr)
   xhr.onload=xhr.onerror=xhr.onabort=k;
  else
   xhr.onreadystatechange=function()
   {
    if(xhr.readyState==4)
     k();
   };
  xhr.send(data);
 };
 Remoting.makePayload=function(data)
 {
  return JSON.stringify(data);
 };
 Remoting.makeHeaders=function(m)
 {
  return{
   "content-type":"application/json",
   "x-websharper-rpc":m
  };
 };
 Remoting.AjaxProvider=function()
 {
  SC$3.$cctor();
  return SC$3.AjaxProvider;
 };
 Remoting.set_AjaxProvider=function($1)
 {
  SC$3.$cctor();
  SC$3.AjaxProvider=$1;
 };
 Remoting.UseHttps=function()
 {
  try
  {
   return!Strings.StartsWith(Global.location.href,"https://")&&(Remoting.set_EndPoint(Strings.Replace(Global.location.href,"http://","https://")),true);
  }
  catch(m)
  {
   return false;
  }
 };
 Remoting.EndPoint=function()
 {
  SC$3.$cctor();
  return SC$3.EndPoint;
 };
 Remoting.set_EndPoint=function($1)
 {
  SC$3.$cctor();
  SC$3.EndPoint=$1;
 };
 SC$3.$cctor=Runtime.Cctor(function()
 {
  SC$3.EndPoint="?";
  SC$3.AjaxProvider=new XhrProvider.New();
  SC$3.$cctor=Global.ignore;
 });
 PrintfHelpers.prettyPrint=function(o)
 {
  var t,s;
  function m(k,v)
  {
   return k+" = "+PrintfHelpers.prettyPrint(v);
  }
  return o===null?"null":(t=typeof o,t=="string"?"\""+o+"\"":t=="object"?o instanceof Global.Array?"[|"+Strings.concat("; ",Arrays.map(PrintfHelpers.prettyPrint,o))+"|]":(s=Global.String(o),s==="[object Object]"?"{"+Strings.concat("; ",Arrays.map(function($1)
  {
   return m($1[0],$1[1]);
  },JSModule.GetFields(o)))+"}":s):Global.String(o));
 };
 PrintfHelpers.printArray2D=function(p,o)
 {
  return o===null?"null":"[["+Strings.concat("][",Seq.delay(function()
  {
   var l2;
   l2=o.length?o[0].length:0;
   return Seq.map(function(i)
   {
    return Strings.concat("; ",Seq.delay(function()
    {
     return Seq.map(function(j)
     {
      return p(Arrays.get2D(o,i,j));
     },Operators.range(0,l2-1));
    }));
   },Operators.range(0,o.length-1));
  }))+"]]";
 };
 PrintfHelpers.printArray=function(p,o)
 {
  return o===null?"null":"[|"+Strings.concat("; ",Arrays.map(p,o))+"|]";
 };
 PrintfHelpers.printList=function(p,o)
 {
  return"["+Strings.concat("; ",Seq.map(p,o))+"]";
 };
 PrintfHelpers.padNumLeft=function(s,l)
 {
  var f;
  f=Arrays.get(s,0);
  return f===" "||f==="+"||f==="-"?f+Strings.PadLeftWith(s.substr(1),l-1,48):Strings.PadLeftWith(s,l,48);
 };
 PrintfHelpers.spaceForPos=function(n,s)
 {
  return 0<=n?" "+s:s;
 };
 PrintfHelpers.plusForPos=function(n,s)
 {
  return 0<=n?"+"+s:s;
 };
 PrintfHelpers.toSafe=function(s)
 {
  return s==null?"":s;
 };
 Scheduler=Concurrency.Scheduler=Runtime.Class({
  tick:function()
  {
   var loop,$this,t;
   $this=this;
   t=Date.now();
   loop=true;
   while(loop)
    if(this.robin.length===0)
     {
      this.idle=true;
      loop=false;
     }
    else
     {
      (this.robin.shift())();
      Date.now()-t>40?(Global.setTimeout(function()
      {
       $this.tick();
      },0),loop=false):void 0;
     }
  },
  Fork:function(action)
  {
   var $this;
   $this=this;
   this.robin.push(action);
   this.idle?(this.idle=false,Global.setTimeout(function()
   {
    $this.tick();
   },0)):void 0;
  }
 },null,Scheduler);
 Scheduler.New=Runtime.Ctor(function()
 {
  this.idle=true;
  this.robin=[];
 },Scheduler);
 Concurrency.For=function(s,b)
 {
  return Concurrency.Using(Enumerator.Get(s),function(ie)
  {
   return Concurrency.While(function()
   {
    return ie.MoveNext();
   },Concurrency.Delay(function()
   {
    return b(ie.Current());
   }));
  });
 };
 Concurrency.While=function(g,c)
 {
  return g()?Concurrency.Bind(c,function()
  {
   return Concurrency.While(g,c);
  }):Concurrency.Return();
 };
 Concurrency.Using=function(x,f)
 {
  return Concurrency.TryFinally(f(x),function()
  {
   x.Dispose();
  });
 };
 Concurrency.TryCancelled=function(run,comp)
 {
  return function(c)
  {
   run({
    k:function(a)
    {
     if(a.$==2)
      {
       comp(a.$0);
       c.k(a);
      }
     else
      c.k(a);
    },
    ct:c.ct
   });
  };
 };
 Concurrency.OnCancel=function(action)
 {
  return function(c)
  {
   c.k({
    $:0,
    $0:Concurrency.Register(c.ct,action)
   });
  };
 };
 Concurrency.StartChild=function(r,t)
 {
  return function(c)
  {
   var inTime,cached,queue,tReg;
   inTime=[true];
   cached=[null];
   queue=[];
   tReg=t!=null&&t.$==1?{
    $:1,
    $0:Global.setTimeout(function()
    {
     var err;
     inTime[0]=false;
     err={
      $:1,
      $0:new TimeoutException.New()
     };
     while(queue.length>0)
      (queue.shift())(err);
    },t.$0)
   }:null;
   Concurrency.scheduler().Fork(function()
   {
    if(!c.ct.c)
     r({
      k:function(res)
      {
       if(inTime[0])
        {
         cached[0]={
          $:1,
          $0:res
         };
         tReg!=null&&tReg.$==1?Global.clearTimeout(tReg.$0):void 0;
         while(queue.length>0)
          (queue.shift())(res);
        }
      },
      ct:c.ct
     });
   });
   c.k({
    $:0,
    $0:function(c2)
    {
     var m;
     if(inTime[0])
      {
       m=cached[0];
       m==null?queue.push(c2.k):c2.k(m.$0);
      }
     else
      c2.k({
       $:1,
       $0:new TimeoutException.New()
      });
    }
   });
  };
 };
 Concurrency.Parallel=function(cs)
 {
  var cs$1;
  cs$1=Arrays.ofSeq(cs);
  return Arrays.length(cs$1)===0?Concurrency.Return([]):function(c)
  {
   var n,o,a;
   function accept(i,x)
   {
    var $1,$2;
    $2=o[0];
    switch($2===0?0:$2===1?x.$==0?1:($1=[$2,x],3):x.$==0?2:($1=[$2,x],3))
    {
     case 0:
      return null;
      break;
     case 1:
      Arrays.set(a,i,x.$0);
      o[0]=0;
      return c.k({
       $:0,
       $0:a
      });
      break;
     case 2:
      Arrays.set(a,i,x.$0);
      {
       o[0]=$2-1;
       return;
      }
      break;
     case 3:
      o[0]=0;
      return c.k($1[1]);
      break;
    }
   }
   n=cs$1.length;
   o=[n];
   a=new Global.Array(n);
   Arrays.iteri(function($1,$2)
   {
    return Concurrency.scheduler().Fork(function()
    {
     $2({
      k:function($3)
      {
       return accept($1,$3);
      },
      ct:c.ct
     });
    });
   },cs$1);
  };
 };
 Concurrency.Sleep=function(ms)
 {
  return function(c)
  {
   var pending,creg;
   pending=void 0;
   creg=void 0;
   pending=Global.setTimeout(function()
   {
    creg.Dispose();
    Concurrency.scheduler().Fork(function()
    {
     c.k({
      $:0,
      $0:null
     });
    });
   },ms);
   creg=Concurrency.Register(c.ct,function()
   {
    Global.clearTimeout(pending);
    Concurrency.scheduler().Fork(function()
    {
     Concurrency.cancel(c);
    });
   });
  };
 };
 Concurrency.StartAsTask=function(c,ctOpt)
 {
  var tcs;
  tcs=new TaskCompletionSource.New();
  Concurrency.StartWithContinuations(c,function(a)
  {
   tcs.SetResult(a);
  },function(a)
  {
   tcs.SetException$1(a);
  },function()
  {
   tcs.SetCanceled();
  },ctOpt);
  return tcs.get_Task();
 };
 Concurrency.AwaitTask1=function(t)
 {
  return Concurrency.FromContinuations(function(ok,err,cc)
  {
   Unchecked.Equals(t.get_Status(),0)?t.Start():void 0;
   {
    t.ContinueWith$2(function(t$1)
    {
     return t$1.get_IsCanceled()?cc(new OperationCanceledException.New(Concurrency.noneCT())):t$1.get_IsFaulted()?err(t$1.get_Exception()):ok(t$1.get_Result());
    });
    return;
   }
  });
 };
 Concurrency.AwaitTask=function(t)
 {
  return Concurrency.FromContinuations(function(ok,err,cc)
  {
   Unchecked.Equals(t.get_Status(),0)?t.Start():void 0;
   {
    t.ContinueWith$2(function(t$1)
    {
     return t$1.get_IsCanceled()?cc(new OperationCanceledException.New(Concurrency.noneCT())):t$1.get_IsFaulted()?err(t$1.get_Exception()):ok();
    });
    return;
   }
  });
 };
 Concurrency.AwaitEvent=function(e,ca)
 {
  return function(c)
  {
   var sub,creg;
   sub=void 0;
   creg=void 0;
   sub=e.Subscribe(Util.observer(function(x)
   {
    sub.Dispose();
    creg.Dispose();
    Concurrency.scheduler().Fork(function()
    {
     c.k({
      $:0,
      $0:x
     });
    });
   }));
   creg=Concurrency.Register(c.ct,function()
   {
    if(ca!=null&&ca.$==1)
     ca.$0();
    else
     {
      sub.Dispose();
      Concurrency.scheduler().Fork(function()
      {
       Concurrency.cancel(c);
      });
     }
   });
  };
 };
 Concurrency.StartImmediate=function(c,ctOpt)
 {
  var ct,d;
  ct=(d=(Concurrency.defCTS())[0],ctOpt==null?d:ctOpt.$0);
  !ct.c?c({
   k:function(a)
   {
    if(a.$==1)
     Concurrency.UncaughtAsyncError(a.$0);
   },
   ct:ct
  }):void 0;
 };
 Concurrency.Start=function(c,ctOpt)
 {
  var ct,d;
  ct=(d=(Concurrency.defCTS())[0],ctOpt==null?d:ctOpt.$0);
  Concurrency.scheduler().Fork(function()
  {
   if(!ct.c)
    c({
     k:function(a)
     {
      if(a.$==1)
       Concurrency.UncaughtAsyncError(a.$0);
     },
     ct:ct
    });
  });
 };
 Concurrency.UncaughtAsyncError=function(e)
 {
  console.log("WebSharper: Uncaught asynchronous exception",e);
 };
 Concurrency.StartWithContinuations=function(c,s,f,cc,ctOpt)
 {
  var ct,d;
  ct=(d=(Concurrency.defCTS())[0],ctOpt==null?d:ctOpt.$0);
  !ct.c?c({
   k:function(a)
   {
    if(a.$==1)
     f(a.$0);
    else
     if(a.$==2)
      cc(a.$0);
     else
      s(a.$0);
   },
   ct:ct
  }):void 0;
 };
 Concurrency.FromContinuations=function(subscribe)
 {
  return function(c)
  {
   var continued;
   function once(cont)
   {
    if(continued[0])
     Operators.FailWith("A continuation provided by Async.FromContinuations was invoked multiple times");
    else
     {
      continued[0]=true;
      Concurrency.scheduler().Fork(cont);
     }
   }
   continued=[false];
   subscribe(function(a)
   {
    once(function()
    {
     c.k({
      $:0,
      $0:a
     });
    });
   },function(e)
   {
    once(function()
    {
     c.k({
      $:1,
      $0:e
     });
    });
   },function(e)
   {
    once(function()
    {
     c.k({
      $:2,
      $0:e
     });
    });
   });
  };
 };
 Concurrency.GetCT=function()
 {
  SC$4.$cctor();
  return SC$4.GetCT;
 };
 Concurrency.Catch=function(r)
 {
  return function(c)
  {
   try
   {
    r({
     k:function(a)
     {
      if(a.$==0)
       c.k({
        $:0,
        $0:{
         $:0,
         $0:a.$0
        }
       });
      else
       if(a.$==1)
        c.k({
         $:0,
         $0:{
          $:1,
          $0:a.$0
         }
        });
       else
        c.k(a);
     },
     ct:c.ct
    });
   }
   catch(e)
   {
    c.k({
     $:0,
     $0:{
      $:1,
      $0:e
     }
    });
   }
  };
 };
 Concurrency.TryWith=function(r,f)
 {
  return function(c)
  {
   r({
    k:function(a)
    {
     if(a.$==0)
      c.k({
       $:0,
       $0:a.$0
      });
     else
      if(a.$==1)
       try
       {
        (f(a.$0))(c);
       }
       catch(e)
       {
        c.k(a);
       }
      else
       c.k(a);
    },
    ct:c.ct
   });
  };
 };
 Concurrency.TryFinally=function(run,f)
 {
  return function(c)
  {
   run({
    k:function(r)
    {
     try
     {
      f();
      c.k(r);
     }
     catch(e)
     {
      c.k({
       $:1,
       $0:e
      });
     }
    },
    ct:c.ct
   });
  };
 };
 Concurrency.Delay=function(mk)
 {
  return function(c)
  {
   try
   {
    (mk(null))(c);
   }
   catch(e)
   {
    c.k({
     $:1,
     $0:e
    });
   }
  };
 };
 Concurrency.Combine=function(a,b)
 {
  return Concurrency.Bind(a,function()
  {
   return b;
  });
 };
 Concurrency.Bind=function(r,f)
 {
  return Concurrency.checkCancel(function(c)
  {
   r({
    k:function(a)
    {
     var x;
     if(a.$==0)
      {
       x=a.$0;
       Concurrency.scheduler().Fork(function()
       {
        try
        {
         (f(x))(c);
        }
        catch(e)
        {
         c.k({
          $:1,
          $0:e
         });
        }
       });
      }
     else
      Concurrency.scheduler().Fork(function()
      {
       c.k(a);
      });
    },
    ct:c.ct
   });
  });
 };
 Concurrency.Zero=function()
 {
  SC$4.$cctor();
  return SC$4.Zero;
 };
 Concurrency.Return=function(x)
 {
  return function(c)
  {
   c.k({
    $:0,
    $0:x
   });
  };
 };
 Concurrency.checkCancel=function(r)
 {
  return function(c)
  {
   if(c.ct.c)
    Concurrency.cancel(c);
   else
    r(c);
  };
 };
 Concurrency.cancel=function(c)
 {
  c.k({
   $:2,
   $0:new OperationCanceledException.New(c.ct)
  });
 };
 Concurrency.defCTS=function()
 {
  SC$4.$cctor();
  return SC$4.defCTS;
 };
 Concurrency.scheduler=function()
 {
  SC$4.$cctor();
  return SC$4.scheduler;
 };
 Concurrency.Register=function(ct,callback)
 {
  var i;
  return ct===Concurrency.noneCT()?{
   Dispose:function()
   {
    return null;
   }
  }:(i=ct.r.push(callback)-1,{
   Dispose:function()
   {
    return Arrays.set(ct.r,i,Global.ignore);
   }
  });
 };
 Concurrency.noneCT=function()
 {
  SC$4.$cctor();
  return SC$4.noneCT;
 };
 SC$4.$cctor=Runtime.Cctor(function()
 {
  SC$4.noneCT={
   c:false,
   r:[]
  };
  SC$4.scheduler=new Scheduler.New();
  SC$4.defCTS=[new CancellationTokenSource.New()];
  SC$4.Zero=Concurrency.Return();
  SC$4.GetCT=function(c)
  {
   c.k({
    $:0,
    $0:c.ct
   });
  };
  SC$4.$cctor=Global.ignore;
 });
 T=Enumerator.T=Runtime.Class({
  Dispose:function()
  {
   if(this.d)
    this.d(this);
  },
  Current:function()
  {
   return this.c;
  },
  Current0:function()
  {
   return this.c;
  },
  MoveNext:function()
  {
   return this.n(this);
  }
 },null,T);
 T.New=Runtime.Ctor(function(s,c,n,d)
 {
  this.s=s;
  this.c=c;
  this.n=n;
  this.d=d;
 },T);
 Enumerator.Get0=function(x)
 {
  return x instanceof Global.Array?Enumerator.ArrayEnumerator(x):Unchecked.Equals(typeof x,"string")?Enumerator.StringEnumerator(x):"GetEnumerator0"in x?x.GetEnumerator0():x.GetEnumerator();
 };
 Enumerator.Get=function(x)
 {
  return x instanceof Global.Array?Enumerator.ArrayEnumerator(x):Unchecked.Equals(typeof x,"string")?Enumerator.StringEnumerator(x):x.GetEnumerator();
 };
 Enumerator.StringEnumerator=function(s)
 {
  return new T.New(0,null,function(e)
  {
   var i;
   i=e.s;
   return i<s.length&&(e.c=s.charCodeAt(i),e.s=i+1,true);
  },void 0);
 };
 Enumerator.ArrayEnumerator=function(s)
 {
  return new T.New(0,null,function(e)
  {
   var i;
   i=e.s;
   return i<Arrays.length(s)&&(e.c=Arrays.get(s,i),e.s=i+1,true);
  },void 0);
 };
 SingleNode=HtmlContentExtensions.SingleNode=Runtime.Class({
  ReplaceInDom:function(old)
  {
   this.node.parentNode.replaceChild(this.node,old);
  }
 },null,SingleNode);
 SingleNode.New=Runtime.Ctor(function(node)
 {
  this.node=node;
 },SingleNode);
 Activator.hasDocument=function()
 {
  return typeof Global.document!=="undefined";
 };
 Activator.Activate=function()
 {
  var meta;
  if(Activator.hasDocument())
   {
    meta=Global.document.getElementById("websharper-data");
    meta?Global.jQuery(Global.document).ready(function()
    {
     function a(k,v)
     {
      v.Body().ReplaceInDom(Global.document.getElementById(k));
     }
     return Arrays.iter(function($1)
     {
      return a($1[0],$1[1]);
     },JSModule.GetFields(Json.Activate(JSON.parse(meta.getAttribute("content")))));
    }):void 0;
   }
 };
 Optional.Undefined={
  $:0
 };
 Arrays.splitInto=function(count,arr)
 {
  var startIndex,len,count$1,res,minChunkSize,i,$1,i$1,$2;
  if(count<=0)
   Operators.FailWith("Count must be positive");
  len=Arrays.length(arr);
  if(len===0)
   return[];
  else
   {
    count$1=Unchecked.Compare(count,len)===-1?count:len;
    res=Arrays.create(count$1,null);
    minChunkSize=len/count$1>>0;
    startIndex=0;
    for(i=0,$1=len%count$1-1;i<=$1;i++){
     res[i]=Arrays.sub(arr,startIndex,minChunkSize+1);
     startIndex=startIndex+minChunkSize+1;
    }
    for(i$1=len%count$1,$2=count$1-1;i$1<=$2;i$1++){
     res[i$1]=Arrays.sub(arr,startIndex,minChunkSize);
     startIndex=startIndex+minChunkSize;
    }
    return res;
   }
 };
 Arrays.contains=function(item,arr)
 {
  var c,i,$1,l;
  c=true;
  i=0;
  l=Arrays.length(arr);
  while(c&&i<l)
   if(Unchecked.Equals(arr[i],item))
    c=false;
   else
    i=i+1;
  return!c;
 };
 Arrays.tryFindBack=function(f,arr)
 {
  var res,i,r;
  res=null;
  i=arr.length-1;
  while(i>=0&&res==null)
   {
    r=arr[i];
    f(r)?res={
     $:1,
     $0:r
    }:void 0;
    i=i-1;
   }
  return res;
 };
 Arrays.tryFindIndexBack=function(f,arr)
 {
  var res,i;
  res=null;
  i=arr.length-1;
  while(i>=0&&res==null)
   {
    f(Arrays.get(arr,i))?res={
     $:1,
     $0:i
    }:void 0;
    i=i-1;
   }
  return res;
 };
 Arrays.mapFold=function(f,zero,arr)
 {
  var acc,r,i,$1,p;
  r=new Global.Array(arr.length);
  acc=zero;
  for(i=0,$1=arr.length-1;i<=$1;i++){
   p=f(acc,arr[i]);
   r[i]=p[0];
   acc=p[1];
  }
  return[r,acc];
 };
 Arrays.mapFoldBack=function(f,arr,zero)
 {
  var acc,$1,r,len,j,$2,i,p;
  r=new Global.Array(arr.length);
  acc=zero;
  len=arr.length;
  for(j=1,$2=len;j<=$2;j++){
   i=len-j;
   p=f(arr[i],acc);
   r[i]=p[0];
   acc=p[1];
  }
  return[r,acc];
 };
 Arrays.mapInPlace=function(f,arr)
 {
  var i,$1;
  for(i=0,$1=arr.length-1;i<=$1;i++)arr[i]=f(arr[i]);
 };
 Arrays.mapiInPlace=function(f,arr)
 {
  var i,$1;
  for(i=0,$1=arr.length-1;i<=$1;i++)arr[i]=f(i,arr[i]);
  return arr;
 };
 Arrays.sortInPlaceByDescending=function(f,arr)
 {
  Arrays.mapInPlace(function(t)
  {
   return t[0];
  },Arrays.mapiInPlace(function($1,$2)
  {
   return[$2,[f($2),$1]];
  },arr).sort(function($1,$2)
  {
   return-Unchecked.Compare($1[1],$2[1]);
  }));
 };
 Seq.tryHead=function(s)
 {
  var e;
  e=Enumerator.Get(s);
  try
  {
   return e.MoveNext()?{
    $:1,
    $0:e.Current()
   }:null;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.tryItem=function(i,s)
 {
  var j,e,go;
  if(i<0)
   return null;
  else
   {
    j=0;
    e=Enumerator.Get(s);
    try
    {
     go=true;
     while(go&&j<=i)
      if(e.MoveNext())
       j=j+1;
      else
       go=false;
     return go?{
      $:1,
      $0:e.Current()
     }:null;
    }
    finally
    {
     if("Dispose"in e)
      e.Dispose();
    }
   }
 };
 Seq.tryLast=function(s)
 {
  var e,$1;
  e=Enumerator.Get(s);
  try
  {
   if(e.MoveNext())
    {
     while(e.MoveNext())
      ;
     $1={
      $:1,
      $0:e.Current()
     };
    }
   else
    $1=null;
   return $1;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.chunkBySize=function(size,s)
 {
  size<=0?Operators.FailWith("Chunk size must be positive"):void 0;
  return{
   GetEnumerator:function()
   {
    var o;
    o=Enumerator.Get(s);
    return new T.New(null,null,function(e)
    {
     var res;
     if(o.MoveNext())
      {
       res=[o.Current()];
       while(Arrays.length(res)<size&&o.MoveNext())
        res.push(o.Current());
       e.c=res;
       return true;
      }
     else
      return false;
    },function()
    {
     o.Dispose();
    });
   }
  };
 };
 Arrays.countBy=function(f,a)
 {
  var d,keys,i,$1,k;
  d=new Dictionary.New$5();
  keys=[];
  for(i=0,$1=Arrays.length(a)-1;i<=$1;i++){
   k=f(a[i]);
   d.ContainsKey(k)?d.set_Item(k,d.get_Item(k)+1):(keys.push(k),d.Add(k,1));
  }
  Arrays.mapInPlace(function(k$1)
  {
   return[k$1,d.get_Item(k$1)];
  },keys);
  return keys;
 };
 Seq.except=function(itemsToExclude,s)
 {
  return{
   GetEnumerator:function()
   {
    var o,seen;
    o=Enumerator.Get(s);
    seen=new HashSet.New$2(itemsToExclude);
    return new T.New(null,null,function(e)
    {
     var cur,has;
     if(o.MoveNext())
      {
       cur=o.Current();
       has=seen.Add(cur);
       while(!has&&o.MoveNext())
        {
         cur=o.Current();
         has=seen.Add(cur);
        }
       return has&&(e.c=cur,true);
      }
     else
      return false;
    },function()
    {
     o.Dispose();
    });
   }
  };
 };
 List$1.skip=function(i,l)
 {
  var res,j,$1;
  res=l;
  for(j=1,$1=i;j<=$1;j++)if(res.$==0)
   Operators.FailWith("Input list too short.");
  else
   res=res.$1;
  return res;
 };
 Arrays.groupBy=function(f,a)
 {
  var d,keys,i,$1,c,k;
  d=new Dictionary.New$5();
  keys=[];
  for(i=0,$1=Arrays.length(a)-1;i<=$1;i++){
   c=a[i];
   k=f(c);
   d.ContainsKey(k)?d.get_Item(k).push(c):(keys.push(k),d.Add(k,[c]));
  }
  Arrays.mapInPlace(function(k$1)
  {
   return[k$1,d.get_Item(k$1)];
  },keys);
  return keys;
 };
 Seq.insufficient=function()
 {
  return Operators.FailWith("The input sequence has an insufficient number of elements.");
 };
 Seq.last=function(s)
 {
  var e,$1;
  e=Enumerator.Get(s);
  try
  {
   if(!e.MoveNext())
    $1=Seq.insufficient();
   else
    {
     while(e.MoveNext())
      ;
     $1=e.Current();
    }
   return $1;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.contains=function(el,s)
 {
  var e,r;
  e=Enumerator.Get(s);
  try
  {
   r=false;
   while(!r&&e.MoveNext())
    r=Unchecked.Equals(e.Current(),el);
   return r;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 List$1.skipWhile=function(predicate,list)
 {
  var rest;
  rest=list;
  while(!(rest.$==0)&&predicate(List$1.head(rest)))
   rest=List$1.tail(rest);
  return rest;
 };
 Seq.nonNegative=function()
 {
  return Operators.FailWith("The input must be non-negative.");
 };
 Arrays.checkBounds=function(arr,n)
 {
  if(n<0||n>=arr.length)
   Operators.FailWith("Index was outside the bounds of the array.");
 };
 Arrays.checkBounds2D=function(arr,n1,n2)
 {
  if(n1<0||n2<0||n1>=arr.length||n2>=(arr.length?arr[0].length:0))
   throw new IndexOutOfRangeException.New();
 };
 Arrays.checkRange=function(arr,start,size)
 {
  if(size<0||start<0||arr.length<start+size)
   Operators.FailWith("Index was outside the bounds of the array.");
 };
 Arrays.set=function(arr,n,x)
 {
  Arrays.checkBounds(arr,n);
  arr[n]=x;
 };
 Arrays.get=function(arr,n)
 {
  Arrays.checkBounds(arr,n);
  return arr[n];
 };
 Arrays.sub=function(arr,start,length)
 {
  Arrays.checkRange(arr,start,length);
  return arr.slice(start,start+length);
 };
 Arrays.setSub=function(arr,start,len,src)
 {
  var i,$1;
  for(i=0,$1=len-1;i<=$1;i++)Arrays.set(arr,start+i,Arrays.get(src,i));
 };
 Arrays.get2D=function(arr,n1,n2)
 {
  Arrays.checkBounds2D(arr,n1,n2);
  return arr[n1][n2];
 };
 Arrays.set2D=function(arr,n1,n2,x)
 {
  Arrays.checkBounds2D(arr,n1,n2);
  arr[n1][n2]=x;
 };
 Arrays.zeroCreate2D=function(n,m)
 {
  var arr;
  arr=Arrays.init(n,function()
  {
   return Arrays.create(m,null);
  });
  arr.dims=2;
  return arr;
 };
 Arrays.sub2D=function(src,src1,src2,len1,len2)
 {
  var len1$1,len2$1,dst,i,$1,j,$2;
  len1$1=len1<0?0:len1;
  len2$1=len2<0?0:len2;
  dst=Arrays.zeroCreate2D(len1$1,len2$1);
  for(i=0,$1=len1$1-1;i<=$1;i++){
   for(j=0,$2=len2$1-1;j<=$2;j++)Arrays.set2D(dst,i,j,Arrays.get2D(src,src1+i,src2+j));
  }
  return dst;
 };
 Arrays.setSub2D=function(dst,src1,src2,len1,len2,src)
 {
  var i,$1,j,$2;
  for(i=0,$1=len1-1;i<=$1;i++){
   for(j=0,$2=len2-1;j<=$2;j++)Arrays.set2D(dst,src1+i,src2+j,Arrays.get2D(src,i,j));
  }
 };
 Arrays.length=function(arr)
 {
  return arr.dims===2?arr.length*arr.length:arr.length;
 };
 WebSharper.checkThis=function(_this)
 {
  return Unchecked.Equals(_this,null)?Operators.InvalidOp("The initialization of an object or value resulted in an object or value being accessed recursively before it was fully initialized."):_this;
 };
 Arrays.reverse=function(array,offset,length)
 {
  var a;
  a=Arrays.sub(array,offset,length).slice().reverse();
  Arrays.blit(a,0,array,offset,Arrays.length(a));
 };
 Arrays.sum=function(arr)
 {
  var sum,i;
  sum=0;
  i=0;
  for(;i<arr.length;i++)sum+=arr[i];
  return sum;
 };
 Arrays.sumBy=function(f,arr)
 {
  var sum,i;
  sum=0;
  i=0;
  for(;i<arr.length;i++)sum+=f(arr[i]);
  return sum;
 };
 Arrays.allPairs=function(array1,array2)
 {
  var len1,len2,res,i,$1,j,$2;
  len1=array1.length;
  len2=array2.length;
  res=new Global.Array(len1*len2);
  for(i=0,$1=len1-1;i<=$1;i++){
   for(j=0,$2=len2-1;j<=$2;j++)res[i*len2+j]=[array1[i],array2[j]];
  }
  return res;
 };
 Arrays.average=function(arr)
 {
  return Global.Number(Arrays.sum(arr))/Global.Number(arr.length);
 };
 Arrays.averageBy=function(f,arr)
 {
  return Global.Number(Arrays.sumBy(f,arr))/Global.Number(arr.length);
 };
 Arrays.blit=function(arr1,start1,arr2,start2,length)
 {
  var i,$1;
  Arrays.checkRange(arr1,start1,length);
  Arrays.checkRange(arr2,start2,length);
  for(i=0,$1=length-1;i<=$1;i++)arr2[start2+i]=arr1[start1+i];
 };
 Arrays.choose=function(f,arr)
 {
  var q,i,$1,m;
  q=[];
  for(i=0,$1=arr.length-1;i<=$1;i++){
   m=f(arr[i]);
   m==null?void 0:q.push(m.$0);
  }
  return q;
 };
 Arrays.collect=function(f,x)
 {
  return Global.Array.prototype.concat.apply([],Arrays.map(f,x));
 };
 Arrays.concat=function(xs)
 {
  return Global.Array.prototype.concat.apply([],Arrays.ofSeq(xs));
 };
 Arrays.create=function(size,value)
 {
  var r,i,$1;
  r=new Global.Array(size);
  for(i=0,$1=size-1;i<=$1;i++)r[i]=value;
  return r;
 };
 Arrays.exists=function(f,x)
 {
  var e,i,$1,l;
  e=false;
  i=0;
  l=Arrays.length(x);
  while(!e&&i<l)
   if(f(x[i]))
    e=true;
   else
    i=i+1;
  return e;
 };
 Arrays.exists2=function(f,x1,x2)
 {
  var e,i,$1,l;
  Arrays.checkLength(x1,x2);
  e=false;
  i=0;
  l=Arrays.length(x1);
  while(!e&&i<l)
   if(f(x1[i],x2[i]))
    e=true;
   else
    i=i+1;
  return e;
 };
 Arrays.fill=function(arr,start,length,value)
 {
  var i,$1;
  Arrays.checkRange(arr,start,length);
  for(i=start,$1=start+length-1;i<=$1;i++)arr[i]=value;
 };
 Arrays.filter=function(f,arr)
 {
  var r,i,$1;
  r=[];
  for(i=0,$1=arr.length-1;i<=$1;i++)if(f(arr[i]))
   r.push(arr[i]);
  return r;
 };
 Arrays.find=function(f,arr)
 {
  var m;
  m=Arrays.tryFind(f,arr);
  return m==null?Operators.FailWith("KeyNotFoundException"):m.$0;
 };
 Arrays.findIndex=function(f,arr)
 {
  var m;
  m=Arrays.tryFindIndex(f,arr);
  return m==null?Operators.FailWith("KeyNotFoundException"):m.$0;
 };
 Arrays.fold=function(f,zero,arr)
 {
  var acc,i,$1;
  acc=zero;
  for(i=0,$1=arr.length-1;i<=$1;i++)acc=f(acc,arr[i]);
  return acc;
 };
 Arrays.fold2=function(f,zero,arr1,arr2)
 {
  var accum,i,$1;
  Arrays.checkLength(arr1,arr2);
  accum=zero;
  for(i=0,$1=arr1.length-1;i<=$1;i++)accum=f(accum,arr1[i],arr2[i]);
  return accum;
 };
 Arrays.foldBack=function(f,arr,zero)
 {
  var acc,$1,len,i,$2;
  acc=zero;
  len=arr.length;
  for(i=1,$2=len;i<=$2;i++)acc=f(arr[len-i],acc);
  return acc;
 };
 Arrays.foldBack2=function(f,arr1,arr2,zero)
 {
  var $1,accum,len,i,$2;
  Arrays.checkLength(arr1,arr2);
  len=arr1.length;
  accum=zero;
  for(i=1,$2=len;i<=$2;i++)accum=f(arr1[len-i],arr2[len-i],accum);
  return accum;
 };
 Arrays.forall=function(f,x)
 {
  var a,i,$1,l;
  a=true;
  i=0;
  l=Arrays.length(x);
  while(a&&i<l)
   if(f(x[i]))
    i=i+1;
   else
    a=false;
  return a;
 };
 Arrays.forall2=function(f,x1,x2)
 {
  var a,i,$1,l;
  Arrays.checkLength(x1,x2);
  a=true;
  i=0;
  l=Arrays.length(x1);
  while(a&&i<l)
   if(f(x1[i],x2[i]))
    i=i+1;
   else
    a=false;
  return a;
 };
 Arrays.init=function(size,f)
 {
  var r,i,$1;
  size<0?Operators.FailWith("Negative size given."):null;
  r=new Global.Array(size);
  for(i=0,$1=size-1;i<=$1;i++)r[i]=f(i);
  return r;
 };
 Arrays.iter=function(f,arr)
 {
  var i,$1;
  for(i=0,$1=arr.length-1;i<=$1;i++)f(arr[i]);
 };
 Arrays.iter2=function(f,arr1,arr2)
 {
  var i,$1;
  Arrays.checkLength(arr1,arr2);
  for(i=0,$1=arr1.length-1;i<=$1;i++)f(arr1[i],arr2[i]);
 };
 Arrays.iteri=function(f,arr)
 {
  var i,$1;
  for(i=0,$1=arr.length-1;i<=$1;i++)f(i,arr[i]);
 };
 Arrays.iteri2=function(f,arr1,arr2)
 {
  var i,$1;
  Arrays.checkLength(arr1,arr2);
  for(i=0,$1=arr1.length-1;i<=$1;i++)f(i,arr1[i],arr2[i]);
 };
 Arrays.map=function(f,arr)
 {
  var r,i,$1;
  r=new Global.Array(arr.length);
  for(i=0,$1=arr.length-1;i<=$1;i++)r[i]=f(arr[i]);
  return r;
 };
 Arrays.map2=function(f,arr1,arr2)
 {
  var r,i,$1;
  Arrays.checkLength(arr1,arr2);
  r=new Global.Array(arr2.length);
  for(i=0,$1=arr2.length-1;i<=$1;i++)r[i]=f(arr1[i],arr2[i]);
  return r;
 };
 Arrays.mapi=function(f,arr)
 {
  var y,i,$1;
  y=new Global.Array(arr.length);
  for(i=0,$1=arr.length-1;i<=$1;i++)y[i]=f(i,arr[i]);
  return y;
 };
 Arrays.mapi2=function(f,arr1,arr2)
 {
  var res,i,$1;
  Arrays.checkLength(arr1,arr2);
  res=new Global.Array(arr1.length);
  for(i=0,$1=arr1.length-1;i<=$1;i++)res[i]=f(i,arr1[i],arr2[i]);
  return res;
 };
 Arrays.max=function(x)
 {
  return Arrays.reduce(function($1,$2)
  {
   return Unchecked.Compare($1,$2)===1?$1:$2;
  },x);
 };
 Arrays.maxBy=function(f,arr)
 {
  return Arrays.reduce(function($1,$2)
  {
   return Unchecked.Compare(f($1),f($2))===1?$1:$2;
  },arr);
 };
 Arrays.min=function(x)
 {
  return Arrays.reduce(function($1,$2)
  {
   return Unchecked.Compare($1,$2)===-1?$1:$2;
  },x);
 };
 Arrays.minBy=function(f,arr)
 {
  return Arrays.reduce(function($1,$2)
  {
   return Unchecked.Compare(f($1),f($2))===-1?$1:$2;
  },arr);
 };
 Arrays.ofList=function(xs)
 {
  var l,q;
  q=[];
  l=xs;
  while(!(l.$==0))
   {
    q.push(List$1.head(l));
    l=List$1.tail(l);
   }
  return q;
 };
 Arrays.ofSeq=function(xs)
 {
  var q,o;
  if(xs instanceof Global.Array)
   return xs.slice();
  else
   if(xs instanceof T$1)
    return Arrays.ofList(xs);
   else
    {
     q=[];
     o=Enumerator.Get(xs);
     try
     {
      while(o.MoveNext())
       q.push(o.Current());
      return q;
     }
     finally
     {
      if("Dispose"in o)
       o.Dispose();
     }
    }
 };
 Arrays.partition=function(f,arr)
 {
  var ret1,ret2,i,$1;
  ret1=[];
  ret2=[];
  for(i=0,$1=arr.length-1;i<=$1;i++)if(f(arr[i]))
   ret1.push(arr[i]);
  else
   ret2.push(arr[i]);
  return[ret1,ret2];
 };
 Arrays.permute=function(f,arr)
 {
  var ret,i,$1;
  ret=new Global.Array(arr.length);
  for(i=0,$1=arr.length-1;i<=$1;i++)ret[f(i)]=arr[i];
  return ret;
 };
 Arrays.pick=function(f,arr)
 {
  var m;
  m=Arrays.tryPick(f,arr);
  return m==null?Operators.FailWith("KeyNotFoundException"):m.$0;
 };
 Arrays.reduce=function(f,arr)
 {
  var acc,i,$1;
  Arrays.nonEmpty(arr);
  acc=arr[0];
  for(i=1,$1=arr.length-1;i<=$1;i++)acc=f(acc,arr[i]);
  return acc;
 };
 Arrays.reduceBack=function(f,arr)
 {
  var $1,acc,len,i,$2;
  Arrays.nonEmpty(arr);
  len=arr.length;
  acc=arr[len-1];
  for(i=2,$2=len;i<=$2;i++)acc=f(arr[len-i],acc);
  return acc;
 };
 Arrays.scan=function(f,zero,arr)
 {
  var ret,i,$1;
  ret=new Global.Array(1+arr.length);
  ret[0]=zero;
  for(i=0,$1=arr.length-1;i<=$1;i++)ret[i+1]=f(ret[i],arr[i]);
  return ret;
 };
 Arrays.scanBack=function(f,arr,zero)
 {
  var len,ret,i,$1;
  len=arr.length;
  ret=new Global.Array(1+len);
  ret[len]=zero;
  for(i=0,$1=len-1;i<=$1;i++)ret[len-i-1]=f(arr[len-i-1],ret[len-i]);
  return ret;
 };
 Arrays.sort=function(arr)
 {
  return Arrays.map(function(t)
  {
   return t[0];
  },Arrays.mapi(function($1,$2)
  {
   return[$2,$1];
  },arr).sort(Unchecked.Compare));
 };
 Arrays.sortBy=function(f,arr)
 {
  return Arrays.map(function(t)
  {
   return t[0];
  },Arrays.mapi(function($1,$2)
  {
   return[$2,[f($2),$1]];
  },arr).sort(function($1,$2)
  {
   return Unchecked.Compare($1[1],$2[1]);
  }));
 };
 Arrays.sortInPlace=function(arr)
 {
  Arrays.mapInPlace(function(t)
  {
   return t[0];
  },Arrays.mapiInPlace(function($1,$2)
  {
   return[$2,$1];
  },arr).sort(Unchecked.Compare));
 };
 Arrays.sortInPlaceBy=function(f,arr)
 {
  Arrays.mapInPlace(function(t)
  {
   return t[0];
  },Arrays.mapiInPlace(function($1,$2)
  {
   return[$2,[f($2),$1]];
  },arr).sort(function($1,$2)
  {
   return Unchecked.Compare($1[1],$2[1]);
  }));
 };
 Arrays.sortInPlaceWith=function(comparer,arr)
 {
  arr.sort(comparer);
 };
 Arrays.sortWith=function(comparer,arr)
 {
  return arr.slice().sort(comparer);
 };
 Arrays.sortByDescending=function(f,arr)
 {
  return Arrays.map(function(t)
  {
   return t[0];
  },Arrays.mapi(function($1,$2)
  {
   return[$2,[f($2),$1]];
  },arr).sort(function($1,$2)
  {
   return-Unchecked.Compare($1[1],$2[1]);
  }));
 };
 Arrays.sortDescending=function(arr)
 {
  return Arrays.map(function(t)
  {
   return t[0];
  },Arrays.mapi(function($1,$2)
  {
   return[$2,$1];
  },arr).sort(function($1,$2)
  {
   return-Unchecked.Compare($1,$2);
  }));
 };
 Arrays.tryFind=function(f,arr)
 {
  var res,i;
  res=null;
  i=0;
  while(i<arr.length&&res==null)
   {
    f(arr[i])?res={
     $:1,
     $0:arr[i]
    }:void 0;
    i=i+1;
   }
  return res;
 };
 Arrays.tryFindIndex=function(f,arr)
 {
  var res,i;
  res=null;
  i=0;
  while(i<arr.length&&res==null)
   {
    f(arr[i])?res={
     $:1,
     $0:i
    }:void 0;
    i=i+1;
   }
  return res;
 };
 Arrays.tryHead=function(arr)
 {
  return arr.length===0?null:{
   $:1,
   $0:arr[0]
  };
 };
 Arrays.tryItem=function(i,arr)
 {
  return arr.length<=i||i<0?null:{
   $:1,
   $0:arr[i]
  };
 };
 Arrays.tryLast=function(arr)
 {
  var len;
  len=arr.length;
  return len===0?null:{
   $:1,
   $0:arr[len-1]
  };
 };
 Arrays.tryPick=function(f,arr)
 {
  var res,i,m;
  res=null;
  i=0;
  while(i<arr.length&&res==null)
   {
    m=f(arr[i]);
    m!=null&&m.$==1?res=m:void 0;
    i=i+1;
   }
  return res;
 };
 Arrays.unzip=function(arr)
 {
  var x,y,i,$1,p;
  x=[];
  y=[];
  for(i=0,$1=arr.length-1;i<=$1;i++){
   p=arr[i];
   x.push(p[0]);
   y.push(p[1]);
  }
  return[x,y];
 };
 Arrays.unzip3=function(arr)
 {
  var x,y,z,i,$1,m;
  x=[];
  y=[];
  z=[];
  for(i=0,$1=arr.length-1;i<=$1;i++){
   m=arr[i];
   x.push(m[0]);
   y.push(m[1]);
   z.push(m[2]);
  }
  return[x,y,z];
 };
 Arrays.zip=function(arr1,arr2)
 {
  var res,i,$1;
  Arrays.checkLength(arr1,arr2);
  res=Arrays.create(arr1.length,null);
  for(i=0,$1=arr1.length-1;i<=$1;i++)res[i]=[arr1[i],arr2[i]];
  return res;
 };
 Arrays.zip3=function(arr1,arr2,arr3)
 {
  var res,i,$1;
  Arrays.checkLength(arr1,arr2);
  Arrays.checkLength(arr2,arr3);
  res=Arrays.create(arr1.length,null);
  for(i=0,$1=arr1.length-1;i<=$1;i++)res[i]=[arr1[i],arr2[i],arr3[i]];
  return res;
 };
 Arrays.chunkBySize=function(size,array)
 {
  return Arrays.ofSeq(Seq.chunkBySize(size,array));
 };
 Arrays.compareWith=function(f,a1,a2)
 {
  return Seq.compareWith(f,a1,a2);
 };
 Arrays.distinct=function(l)
 {
  return Arrays.ofSeq(Seq.distinct(l));
 };
 Arrays.distinctBy=function(f,a)
 {
  return Arrays.ofSeq(Seq.distinctBy(f,a));
 };
 Arrays.except=function(itemsToExclude,a)
 {
  return Arrays.ofSeq(Seq.except(itemsToExclude,a));
 };
 Arrays.findBack=function(p,s)
 {
  var m;
  m=Arrays.tryFindBack(p,s);
  return m==null?Operators.FailWith("KeyNotFoundException"):m.$0;
 };
 Arrays.findIndexBack=function(p,s)
 {
  var m;
  m=Arrays.tryFindIndexBack(p,s);
  return m==null?Operators.FailWith("KeyNotFoundException"):m.$0;
 };
 Arrays.head=function(arr)
 {
  Arrays.nonEmpty(arr);
  return arr[0];
 };
 Arrays.last=function(arr)
 {
  Arrays.nonEmpty(arr);
  return arr[arr.length-1];
 };
 Arrays.map3=function(f,arr1,arr2,arr3)
 {
  var r,i,$1;
  Arrays.checkLength(arr1,arr2);
  Arrays.checkLength(arr1,arr3);
  r=new Global.Array(arr3.length);
  for(i=0,$1=arr3.length-1;i<=$1;i++)r[i]=f(arr1[i],arr2[i],arr3[i]);
  return r;
 };
 Arrays.pairwise=function(a)
 {
  return Arrays.ofSeq(Seq.pairwise(a));
 };
 Arrays.replicate=function(size,value)
 {
  return Arrays.create(size,value);
 };
 Arrays.indexed=function(ar)
 {
  return Arrays.mapi(function($1,$2)
  {
   return[$1,$2];
  },ar);
 };
 Arrays.skip=function(i,ar)
 {
  return i<0?Seq.nonNegative():i>ar.length?Seq.insufficient():ar.slice(i);
 };
 Arrays.skipWhile=function(predicate,ar)
 {
  var i,len;
  len=ar.length;
  i=0;
  while(i<len&&predicate(ar[i]))
   i=i+1;
  return ar.slice(i);
 };
 Arrays.tail=function(ar)
 {
  return Arrays.skip(1,ar);
 };
 Arrays.take=function(n,ar)
 {
  return n<0?Seq.nonNegative():n>ar.length?Seq.insufficient():ar.slice(0,n);
 };
 Arrays.takeWhile=function(predicate,ar)
 {
  var i,len;
  len=ar.length;
  i=0;
  while(i<len&&predicate(ar[i]))
   i=i+1;
  return ar.slice(0,i);
 };
 Arrays.exactlyOne=function(ar)
 {
  return ar.length===1?ar[0]:Operators.FailWith("The input does not have precisely one element.");
 };
 Arrays.unfold=function(f,s)
 {
  return Arrays.ofSeq(Seq.unfold(f,s));
 };
 Arrays.windowed=function(windowSize,s)
 {
  return Arrays.ofSeq(Seq.windowed(windowSize,s));
 };
 Arrays.splitAt=function(n,ar)
 {
  return[Arrays.take(n,ar),Arrays.skip(n,ar)];
 };
 Arrays.nonEmpty=function(arr)
 {
  if(arr.length===0)
   Operators.FailWith("The input array was empty.");
 };
 Arrays.checkLength=function(arr1,arr2)
 {
  if(arr1.length!==arr2.length)
   Operators.FailWith("The arrays have different lengths.");
 };
 Arrays2D.init=function(n,m,f)
 {
  var array,i,$1,j,$2;
  array=Arrays.zeroCreate2D(n,m);
  for(i=0,$1=n-1;i<=$1;i++){
   for(j=0,$2=m-1;j<=$2;j++)Arrays.set2D(array,i,j,f(i,j));
  }
  return array;
 };
 Arrays2D.iter=function(f,array)
 {
  var count1,count2,i,$1,j,$2;
  count1=array.length;
  count2=array.length?array[0].length:0;
  for(i=0,$1=count1-1;i<=$1;i++){
   for(j=0,$2=count2-1;j<=$2;j++)f(Arrays.get2D(array,i,j));
  }
 };
 Arrays2D.iteri=function(f,array)
 {
  var count1,count2,i,$1,j,$2;
  count1=array.length;
  count2=array.length?array[0].length:0;
  for(i=0,$1=count1-1;i<=$1;i++){
   for(j=0,$2=count2-1;j<=$2;j++)f(i,j,Arrays.get2D(array,i,j));
  }
 };
 Arrays2D.map=function(f,array)
 {
  return Arrays2D.init(array.length,array.length?array[0].length:0,function($1,$2)
  {
   return f(Arrays.get2D(array,$1,$2));
  });
 };
 Arrays2D.mapi=function(f,array)
 {
  return Arrays2D.init(array.length,array.length?array[0].length:0,function($1,$2)
  {
   return f($1,$2,Arrays.get2D(array,$1,$2));
  });
 };
 Arrays2D.copy=function(array)
 {
  return Arrays2D.init(array.length,array.length?array[0].length:0,function($1,$2)
  {
   return Arrays.get2D(array,$1,$2);
  });
 };
 CancellationTokenSource=WebSharper.CancellationTokenSource=Runtime.Class({
  CancelAfter:function(delay)
  {
   var $this,o;
   $this=this;
   !this.c?(o=this.pending,o==null?void 0:Global.clearTimeout(o.$0),this.pending={
    $:1,
    $0:Global.setTimeout(function()
    {
     $this.Cancel$1();
    },delay)
   }):void 0;
  },
  Cancel:function(throwOnFirstException)
  {
   if(!throwOnFirstException)
    this.Cancel$1();
   else
    if(!this.c)
     {
      this.c=true;
      Arrays.iter(function(a)
      {
       a();
      },this.r);
     }
  },
  Cancel$1:function()
  {
   var errors;
   if(!this.c)
    {
     this.c=true;
     errors=Arrays.choose(function(a)
     {
      try
      {
       a();
       return null;
      }
      catch(e)
      {
       return{
        $:1,
        $0:e
       };
      }
     },this.r);
     if(Arrays.length(errors)>0)
      throw new AggregateException.New$3(errors);
     else
      void 0;
    }
  }
 },null,CancellationTokenSource);
 CancellationTokenSource.CreateLinkedTokenSource=function(t1,t2)
 {
  return CancellationTokenSource.CreateLinkedTokenSource$1([t1,t2]);
 };
 CancellationTokenSource.CreateLinkedTokenSource$1=function(tokens)
 {
  var cts;
  cts=new CancellationTokenSource.New();
  Arrays.iter(function(t)
  {
   function callback(u)
   {
    return cts.Cancel$1();
   }
   Concurrency.Register(t,function()
   {
    callback();
   });
  },tokens);
  return cts;
 };
 CancellationTokenSource.New=Runtime.Ctor(function()
 {
  this.c=false;
  this.pending=null;
  this.r=[];
  this.init=1;
 },CancellationTokenSource);
 Char.IsWhiteSpace=function(c)
 {
  return String.fromCharCode(c).match(new Global.RegExp("\\s"))!==null;
 };
 Char.Parse=function(s)
 {
  return s.length===1?s.charCodeAt(0):Operators.FailWith("String must be exactly one character long.");
 };
 Char.IsUpper=function(c)
 {
  return c>=65&&c<=90;
 };
 Char.IsLower=function(c)
 {
  return c>=97&&c<=122;
 };
 Char.IsLetterOrDigit=function(c)
 {
  return Char.IsLetter(c)||Char.IsDigit(c);
 };
 Char.IsLetter=function(c)
 {
  return c>=65&&c<=90||c>=97&&c<=122;
 };
 Char.IsDigit=function(c)
 {
  return c>=48&&c<=57;
 };
 Char.IsControl=function(c)
 {
  return c>=0&&c<=31||c>=128&&c<=159;
 };
 Char.GetNumericValue=function(c)
 {
  return c>=48&&c<=57?Global.Number(c)-Global.Number(48):-1;
 };
 Util.observer=function(h)
 {
  return{
   OnCompleted:function()
   {
    return null;
   },
   OnError:function()
   {
    return null;
   },
   OnNext:h
  };
 };
 DateUtil.LongTime=function(d)
 {
  return(new Date(d)).toLocaleTimeString({},{
   hour:"2-digit",
   minute:"2-digit",
   second:"2-digit",
   hour12:false
  });
 };
 DateUtil.ShortTime=function(d)
 {
  return(new Date(d)).toLocaleTimeString({},{
   hour:"2-digit",
   minute:"2-digit",
   hour12:false
  });
 };
 DateUtil.LongDate=function(d)
 {
  return(new Date(d)).toLocaleDateString({},{
   year:"numeric",
   month:"long",
   day:"numeric",
   weekday:"long"
  });
 };
 DateUtil.Parse=function(s)
 {
  var m;
  m=DateUtil.TryParse(s);
  return m!=null&&m.$==1?m.$0:Operators.FailWith("Failed to parse date string.");
 };
 DateUtil.TryParse=function(s)
 {
  var d;
  d=Date.parse(s);
  return Global.isNaN(d)?null:{
   $:1,
   $0:d
  };
 };
 DateUtil.AddMonths=function(d,months)
 {
  var e;
  e=new Date(d);
  return(new Date(e.getFullYear(),e.getMonth()+months,e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())).getTime();
 };
 DateUtil.AddYears=function(d,years)
 {
  var e;
  e=new Date(d);
  return(new Date(e.getFullYear()+years,e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds())).getTime();
 };
 DateUtil.TimePortion=function(d)
 {
  var e;
  e=new Date(d);
  return(((24*0+e.getHours())*60+e.getMinutes())*60+e.getSeconds())*1000+e.getMilliseconds();
 };
 DateUtil.DatePortion=function(d)
 {
  var e;
  e=new Date(d);
  return(new Date(e.getFullYear(),e.getMonth(),e.getDate())).getTime();
 };
 DateTimeOffset=WebSharper.DateTimeOffset=Runtime.Class({
  ToUniversalTime:function()
  {
   return new DateTimeOffset.New(this.d,0);
  },
  ToLocalTime:function()
  {
   return new DateTimeOffset.New(this.d,(new Date()).getTimezoneOffset());
  }
 },null,DateTimeOffset);
 DateTimeOffset.New=Runtime.Ctor(function(d,o)
 {
  this.d=d;
 },DateTimeOffset);
 Delegate.InvocationList=function(del)
 {
  return del.$Invokes||[del];
 };
 Delegate.RemoveAll=function(source,value)
 {
  var sourceInv;
  sourceInv=Delegate.InvocationList(source);
  Arrays.length(Delegate.InvocationList(value))>1?Operators.FailWith("TODO: Remove multicast delegates"):void 0;
  return Runtime.CreateDelegate(Arrays.filter(function(i)
  {
   return!Unchecked.Equals(i,value);
  },sourceInv));
 };
 Delegate.Remove=function(source,value)
 {
  var $1,found,sourceInv,resInv,i,$2,it;
  sourceInv=Delegate.InvocationList(source);
  if(Arrays.length(Delegate.InvocationList(value))>1)
   Operators.FailWith("TODO: Remove multicast delegates");
  resInv=[];
  found=false;
  for(i=Arrays.length(sourceInv)-1,$2=0;i>=$2;i--){
   it=Arrays.get(sourceInv,i);
   !found&&Runtime.DelegateEqual(it,value)?found=true:resInv.unshift(it);
  }
  return Runtime.CreateDelegate(resInv);
 };
 Delegate.DelegateTarget=function(del)
 {
  var inv;
  return!del?null:"$Target"in del?del.$Target:"$Invokes"in del?(inv=del.$Invokes,(Arrays.get(inv,Arrays.length(inv)-1))[1]):null;
 };
 DictionaryUtil.getHashCode=function(c,x)
 {
  return c.CGetHashCode(x);
 };
 DictionaryUtil.equals=function(c)
 {
  return function($1,$2)
  {
   return c.CEquals($1,$2);
  };
 };
 DictionaryUtil.alreadyAdded=function()
 {
  return Operators.FailWith("An item with the same key has already been added.");
 };
 DictionaryUtil.notPresent=function()
 {
  return Operators.FailWith("The given key was not present in the dictionary.");
 };
 KeyCollection=Collections.KeyCollection=Runtime.Class({
  GetEnumerator$1:function()
  {
   return Enumerator.Get(Seq.map(function(kvp)
   {
    return kvp.K;
   },this.d));
  },
  get_Count:function()
  {
   return this.d.count;
  },
  GetEnumerator0:function()
  {
   return this.GetEnumerator$1();
  },
  GetEnumerator:function()
  {
   return this.GetEnumerator$1();
  }
 },null,KeyCollection);
 KeyCollection.New=Runtime.Ctor(function(d)
 {
  this.d=d;
 },KeyCollection);
 ValueCollection=Collections.ValueCollection=Runtime.Class({
  GetEnumerator$1:function()
  {
   return Enumerator.Get(Seq.map(function(kvp)
   {
    return kvp.V;
   },this.d));
  },
  get_Count:function()
  {
   return this.d.count;
  },
  GetEnumerator0:function()
  {
   return this.GetEnumerator$1();
  },
  GetEnumerator:function()
  {
   return this.GetEnumerator$1();
  }
 },null,ValueCollection);
 ValueCollection.New=Runtime.Ctor(function(d)
 {
  this.d=d;
 },ValueCollection);
 Dictionary=Collections.Dictionary=Runtime.Class({
  remove:function(k)
  {
   var $this,h,d,r;
   $this=this;
   h=this.hash(k);
   d=this.data[h];
   return d&&(r=Arrays.filter(function(a)
   {
    return!$this.equals.apply(null,[(Operators.KeyValue(a))[0],k]);
   },d),Arrays.length(r)<d.length&&(this.count=this.count-1,this.data[h]=r,true));
  },
  add:function(k,v)
  {
   var $this,h,d;
   $this=this;
   h=this.hash(k);
   d=this.data[h];
   d?(Arrays.exists(function(a)
   {
    return $this.equals.apply(null,[(Operators.KeyValue(a))[0],k]);
   },d)?DictionaryUtil.alreadyAdded():void 0,this.count=this.count+1,d.push({
    K:k,
    V:v
   })):(this.count=this.count+1,this.data[h]=new Global.Array({
    K:k,
    V:v
   }));
  },
  set:function(k,v)
  {
   var $this,h,d,m;
   $this=this;
   h=this.hash(k);
   d=this.data[h];
   d?(m=Arrays.tryFindIndex(function(a)
   {
    return $this.equals.apply(null,[(Operators.KeyValue(a))[0],k]);
   },d),m==null?(this.count=this.count+1,d.push({
    K:k,
    V:v
   })):d[m.$0]={
    K:k,
    V:v
   }):(this.count=this.count+1,this.data[h]=new Global.Array({
    K:k,
    V:v
   }));
  },
  get:function(k)
  {
   var $this,d;
   $this=this;
   d=this.data[this.hash(k)];
   return d?Arrays.pick(function(a)
   {
    var a$1;
    a$1=Operators.KeyValue(a);
    return $this.equals.apply(null,[a$1[0],k])?{
     $:1,
     $0:a$1[1]
    }:null;
   },d):DictionaryUtil.notPresent();
  },
  get_Keys:function()
  {
   return new KeyCollection.New(this);
  },
  get_Values:function()
  {
   return new ValueCollection.New(this);
  },
  TryGetValue:function(k,res)
  {
   var $this,d,v;
   $this=this;
   d=this.data[this.hash(k)];
   return d&&(v=Arrays.tryPick(function(a)
   {
    var a$1;
    a$1=Operators.KeyValue(a);
    return $this.equals.apply(null,[a$1[0],k])?{
     $:1,
     $0:a$1[1]
    }:null;
   },d),v!=null&&v.$==1&&(res.set(v.$0),true));
  },
  Remove:function(k)
  {
   return this.remove(k);
  },
  GetEnumerator$1:function()
  {
   return Enumerator.Get0(this);
  },
  set_Item:function(k,v)
  {
   this.set(k,v);
  },
  get_Item:function(k)
  {
   return this.get(k);
  },
  ContainsKey:function(k)
  {
   var $this,d;
   $this=this;
   d=this.data[this.hash(k)];
   return d&&Arrays.exists(function(a)
   {
    return $this.equals.apply(null,[(Operators.KeyValue(a))[0],k]);
   },d);
  },
  Clear:function()
  {
   this.data=[];
   this.count=0;
  },
  Add:function(k,v)
  {
   this.add(k,v);
  },
  GetEnumerator:function()
  {
   return Enumerator.Get0(this);
  },
  GetEnumerator0:function()
  {
   return Enumerator.Get0(Arrays.concat(JSModule.GetFieldValues(this.data)));
  }
 },null,Dictionary);
 Dictionary.New=Runtime.Ctor(function(dictionary,comparer)
 {
  Dictionary.New$6.call(this,dictionary,DictionaryUtil.equals(comparer),function(x)
  {
   return DictionaryUtil.getHashCode(comparer,x);
  });
 },Dictionary);
 Dictionary.New$1=Runtime.Ctor(function(dictionary)
 {
  Dictionary.New$6.call(this,dictionary,Unchecked.Equals,Unchecked.Hash);
 },Dictionary);
 Dictionary.New$2=Runtime.Ctor(function(capacity,comparer)
 {
  Dictionary.New$3.call(this,comparer);
 },Dictionary);
 Dictionary.New$3=Runtime.Ctor(function(comparer)
 {
  Dictionary.New$6.call(this,[],DictionaryUtil.equals(comparer),function(x)
  {
   return DictionaryUtil.getHashCode(comparer,x);
  });
 },Dictionary);
 Dictionary.New$4=Runtime.Ctor(function(capacity)
 {
  Dictionary.New$5.call(this);
 },Dictionary);
 Dictionary.New$5=Runtime.Ctor(function()
 {
  Dictionary.New$6.call(this,[],Unchecked.Equals,Unchecked.Hash);
 },Dictionary);
 Dictionary.New$6=Runtime.Ctor(function(init,equals,hash)
 {
  var e,x;
  this.equals=equals;
  this.hash=hash;
  this.count=0;
  this.data=[];
  e=Enumerator.Get(init);
  try
  {
   while(e.MoveNext())
    {
     x=e.Current();
     this.set(x.K,x.V);
    }
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 },Dictionary);
 MatchFailureException=WebSharper.MatchFailureException=Runtime.Class({},null,MatchFailureException);
 MatchFailureException.New=Runtime.Ctor(function(message,line,column)
 {
  this.message=message+" at "+String(line)+":"+String(column);
 },MatchFailureException);
 IndexOutOfRangeException=WebSharper.IndexOutOfRangeException=Runtime.Class({},null,IndexOutOfRangeException);
 IndexOutOfRangeException.New=Runtime.Ctor(function()
 {
  IndexOutOfRangeException.New$1.call(this,"Index was outside the bounds of the array.");
 },IndexOutOfRangeException);
 IndexOutOfRangeException.New$1=Runtime.Ctor(function(message)
 {
  this.message=message;
 },IndexOutOfRangeException);
 OperationCanceledException=WebSharper.OperationCanceledException=Runtime.Class({},null,OperationCanceledException);
 OperationCanceledException.New=Runtime.Ctor(function(ct)
 {
  OperationCanceledException.New$1.call(this,"The operation was canceled.",null,ct);
 },OperationCanceledException);
 OperationCanceledException.New$1=Runtime.Ctor(function(message,inner,ct)
 {
  this.message=message;
  this.inner=inner;
  this.ct=ct;
 },OperationCanceledException);
 ArgumentException=WebSharper.ArgumentException=Runtime.Class({},null,ArgumentException);
 ArgumentException.New=Runtime.Ctor(function(argumentName,message)
 {
  ArgumentException.New$2.call(this,message+"\nParameter name: "+argumentName);
 },ArgumentException);
 ArgumentException.New$1=Runtime.Ctor(function()
 {
  ArgumentException.New$2.call(this,"Value does not fall within the expected range.");
 },ArgumentException);
 ArgumentException.New$2=Runtime.Ctor(function(message)
 {
  this.message=message;
 },ArgumentException);
 ArgumentOutOfRangeException=WebSharper.ArgumentOutOfRangeException=Runtime.Class({},null,ArgumentOutOfRangeException);
 ArgumentOutOfRangeException.New=Runtime.Ctor(function()
 {
  ArgumentOutOfRangeException.New$1.call(this,"Specified argument was out of the range of valid values.");
 },ArgumentOutOfRangeException);
 ArgumentOutOfRangeException.New$1=Runtime.Ctor(function(message)
 {
  this.message=message;
 },ArgumentOutOfRangeException);
 InvalidOperationException=WebSharper.InvalidOperationException=Runtime.Class({},null,InvalidOperationException);
 InvalidOperationException.New=Runtime.Ctor(function()
 {
  InvalidOperationException.New$1.call(this,"Operation is not valid due to the current state of the object.");
 },InvalidOperationException);
 InvalidOperationException.New$1=Runtime.Ctor(function(message)
 {
  this.message=message;
 },InvalidOperationException);
 AggregateException=WebSharper.AggregateException=Runtime.Class({},null,AggregateException);
 AggregateException.New=Runtime.Ctor(function(message,innerException)
 {
  AggregateException.New$4.call(this,message,[innerException]);
 },AggregateException);
 AggregateException.New$1=Runtime.Ctor(function(message,innerExceptions)
 {
  AggregateException.New$4.call(this,message,Arrays.ofSeq(innerExceptions));
 },AggregateException);
 AggregateException.New$2=Runtime.Ctor(function(innerExceptions)
 {
  AggregateException.New$4.call(this,"One or more errors occurred.",Arrays.ofSeq(innerExceptions));
 },AggregateException);
 AggregateException.New$3=Runtime.Ctor(function(innerExceptions)
 {
  AggregateException.New$4.call(this,"One or more errors occurred.",innerExceptions);
 },AggregateException);
 AggregateException.New$4=Runtime.Ctor(function(message,innerExceptions)
 {
  this.message=message;
  this.innerExceptions=innerExceptions;
 },AggregateException);
 TimeoutException=WebSharper.TimeoutException=Runtime.Class({},null,TimeoutException);
 TimeoutException.New=Runtime.Ctor(function()
 {
  TimeoutException.New$1.call(this,"The operation has timed out.");
 },TimeoutException);
 TimeoutException.New$1=Runtime.Ctor(function(message)
 {
  this.message=message;
 },TimeoutException);
 FormatException=WebSharper.FormatException=Runtime.Class({},null,FormatException);
 FormatException.New=Runtime.Ctor(function()
 {
  FormatException.New$1.call(this,"One of the identified items was in an invalid format.");
 },FormatException);
 FormatException.New$1=Runtime.Ctor(function(message)
 {
  this.message=message;
 },FormatException);
 OverflowException=WebSharper.OverflowException=Runtime.Class({},null,OverflowException);
 OverflowException.New=Runtime.Ctor(function()
 {
  OverflowException.New$1.call(this,"Arithmetic operation resulted in an overflow.");
 },OverflowException);
 OverflowException.New$1=Runtime.Ctor(function(message)
 {
  this.message=message;
 },OverflowException);
 Arrays.create2D=function(rows)
 {
  var arr;
  arr=Arrays.ofSeq(Seq.map(Arrays.ofSeq,rows));
  arr.dims=2;
  return arr;
 };
 Guid.NewGuid=function()
 {
  return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(new Global.RegExp("[xy]","g"),function(c)
  {
   var r,v;
   r=Math.random()*16|0;
   v=c=="x"?r:r&3|8;
   return v.toString(16);
  });
 };
 HashSetUtil.concat=function(o)
 {
  var r,k;
  r=[];
  for(var k$1 in o)r.push.apply(r,o[k$1]);
  return r;
 };
 HashSet=Collections.HashSet=Runtime.Class({
  add:function(item)
  {
   var h,arr;
   h=this.hash(item);
   arr=this.data[h];
   return arr==null?(this.data[h]=[item],this.count=this.count+1,true):this.arrContains(item,arr)?false:(arr.push(item),this.count=this.count+1,true);
  },
  arrRemove:function(item,arr)
  {
   var c,i,$1,l;
   c=true;
   i=0;
   l=arr.length;
   while(c&&i<l)
    if(this.equals.apply(null,[arr[i],item]))
     {
      arr.splice.apply(arr,[i,1]);
      c=false;
     }
    else
     i=i+1;
   return!c;
  },
  arrContains:function(item,arr)
  {
   var c,i,$1,l;
   c=true;
   i=0;
   l=arr.length;
   while(c&&i<l)
    if(this.equals.apply(null,[arr[i],item]))
     c=false;
    else
     i=i+1;
   return!c;
  },
  UnionWith:function(xs)
  {
   var e;
   e=Enumerator.Get(xs);
   try
   {
    while(e.MoveNext())
     this.Add(e.Current());
   }
   finally
   {
    if("Dispose"in e)
     e.Dispose();
   }
  },
  SymmetricExceptWith:function(xs)
  {
   var e,item;
   e=Enumerator.Get(xs);
   try
   {
    while(e.MoveNext())
     {
      item=e.Current();
      this.Contains(item)?this.Remove(item):this.Add(item);
     }
   }
   finally
   {
    if("Dispose"in e)
     e.Dispose();
   }
  },
  SetEquals:function(xs)
  {
   var other;
   other=new HashSet.New$4(xs,this.equals,this.hash);
   return this.get_Count()===other.get_Count()&&this.IsSupersetOf(other);
  },
  RemoveWhere:function(cond)
  {
   var res,all,i,$1,item;
   all=HashSetUtil.concat(this.data);
   res=0;
   for(i=0,$1=all.length-1;i<=$1;i++){
    item=all[i];
    cond(item)?this.Remove(item)?res=res+1:void 0:void 0;
   }
   return res;
  },
  Remove:function(item)
  {
   var arr;
   arr=this.data[this.hash(item)];
   return arr==null?false:this.arrRemove(item,arr)&&(this.count=this.count-1,true);
  },
  Overlaps:function(xs)
  {
   var $this;
   $this=this;
   return Seq.exists(function(a)
   {
    return $this.Contains(a);
   },xs);
  },
  IsSupersetOf:function(xs)
  {
   var $this;
   $this=this;
   return Seq.forall(function(a)
   {
    return $this.Contains(a);
   },xs);
  },
  IsSubsetOf:function(xs)
  {
   var other;
   other=new HashSet.New$4(xs,this.equals,this.hash);
   return Arrays.forall(function(a)
   {
    return other.Contains(a);
   },HashSetUtil.concat(this.data));
  },
  IsProperSupersetOf:function(xs)
  {
   var other;
   other=Arrays.ofSeq(xs);
   return this.count>Arrays.length(other)&&this.IsSupersetOf(other);
  },
  IsProperSubsetOf:function(xs)
  {
   var other;
   other=Arrays.ofSeq(xs);
   return this.count<Arrays.length(other)&&this.IsSubsetOf(other);
  },
  IntersectWith:function(xs)
  {
   var other,all,i,$1,item;
   other=new HashSet.New$4(xs,this.equals,this.hash);
   all=HashSetUtil.concat(this.data);
   for(i=0,$1=all.length-1;i<=$1;i++){
    item=all[i];
    !other.Contains(item)?this.Remove(item):void 0;
   }
  },
  ExceptWith:function(xs)
  {
   var e;
   e=Enumerator.Get(xs);
   try
   {
    while(e.MoveNext())
     this.Remove(e.Current());
   }
   finally
   {
    if("Dispose"in e)
     e.Dispose();
   }
  },
  get_Count:function()
  {
   return this.count;
  },
  CopyTo:function(arr)
  {
   var i,all,i$1,$1;
   i=0;
   all=HashSetUtil.concat(this.data);
   for(i$1=0,$1=all.length-1;i$1<=$1;i$1++)Arrays.set(arr,i$1,all[i$1]);
  },
  Contains:function(item)
  {
   var arr;
   arr=this.data[this.hash(item)];
   return arr==null?false:this.arrContains(item,arr);
  },
  Clear:function()
  {
   this.data=[];
   this.count=0;
  },
  Add:function(item)
  {
   return this.add(item);
  },
  GetEnumerator:function()
  {
   return Enumerator.Get(HashSetUtil.concat(this.data));
  },
  GetEnumerator0:function()
  {
   return Enumerator.Get(HashSetUtil.concat(this.data));
  }
 },null,HashSet);
 HashSet.New=Runtime.Ctor(function(init,comparer)
 {
  HashSet.New$4.call(this,init,DictionaryUtil.equals(comparer),function(x)
  {
   return DictionaryUtil.getHashCode(comparer,x);
  });
 },HashSet);
 HashSet.New$1=Runtime.Ctor(function(comparer)
 {
  HashSet.New$4.call(this,[],DictionaryUtil.equals(comparer),function(x)
  {
   return DictionaryUtil.getHashCode(comparer,x);
  });
 },HashSet);
 HashSet.New$2=Runtime.Ctor(function(init)
 {
  HashSet.New$4.call(this,init,Unchecked.Equals,Unchecked.Hash);
 },HashSet);
 HashSet.New$3=Runtime.Ctor(function()
 {
  HashSet.New$4.call(this,[],Unchecked.Equals,Unchecked.Hash);
 },HashSet);
 HashSet.New$4=Runtime.Ctor(function(init,equals,hash)
 {
  var e;
  this.equals=equals;
  this.hash=hash;
  this.data=[];
  this.count=0;
  e=Enumerator.Get(init);
  try
  {
   while(e.MoveNext())
    this.add(e.Current());
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 },HashSet);
 Lazy.Force=function(x)
 {
  return x.f();
 };
 Lazy.CreateFromValue=function(v)
 {
  return{
   c:true,
   v:v,
   f:Lazy.cachedLazy
  };
 };
 Lazy.Create=function(f)
 {
  return{
   c:false,
   v:f,
   f:Lazy.forceLazy
  };
 };
 Lazy.forceLazy=function()
 {
  var v;
  v=this.v();
  this.c=true;
  this.v=v;
  this.f=Lazy.cachedLazy;
  return v;
 };
 Lazy.cachedLazy=function()
 {
  return this.v;
 };
 T$1=List$1.T=Runtime.Class({
  GetSlice:function(start,finish)
  {
   var i;
   return start!=null&&start.$==1?finish!=null&&finish.$==1?(i=start.$0,List$1.ofSeq(Seq.take(finish.$0-i+1,List$1.skip(i,this)))):List$1.skip(start.$0,this):finish!=null&&finish.$==1?List$1.ofSeq(Seq.take(finish.$0+1,this)):this;
  },
  get_Item:function(x)
  {
   return Seq.nth(x,this);
  },
  get_Length:function()
  {
   return List$1.length(this);
  },
  GetEnumerator:function()
  {
   return new T.New(this,null,function(e)
   {
    var m;
    m=e.s;
    return m.$==0?false:(e.c=m.$0,e.s=m.$1,true);
   },void 0);
  },
  GetEnumerator0:function()
  {
   return Enumerator.Get(this);
  }
 },null,T$1);
 T$1.Empty=new T$1({
  $:0
 });
 List$1.allPairs=function(l1,l2)
 {
  return List$1.ofArray(Arrays.allPairs(Arrays.ofList(l1),Arrays.ofList(l2)));
 };
 List$1.append=function(x,y)
 {
  var r,l,go,res,t;
  if(x.$==0)
   return y;
  else
   if(y.$==0)
    return x;
   else
    {
     res=new T$1({
      $:1
     });
     r=res;
     l=x;
     go=true;
     while(go)
      {
       r.$0=l.$0;
       l=l.$1;
       l.$==0?go=false:r=(t=new T$1({
        $:1
       }),r.$1=t,t);
      }
     r.$1=y;
     return res;
    }
 };
 List$1.choose=function(f,l)
 {
  return List$1.ofSeq(Seq.choose(f,l));
 };
 List$1.collect=function(f,l)
 {
  return List$1.ofSeq(Seq.collect(f,l));
 };
 List$1.concat=function(s)
 {
  return List$1.ofSeq(Seq.concat(s));
 };
 List$1.exists=function(p,x)
 {
  var e,l;
  e=false;
  l=x;
  while(!e&&l.$==1)
   {
    e=p(l.$0);
    l=l.$1;
   }
  return e;
 };
 List$1.exists2=function(p,x1,x2)
 {
  var e,l1,l2;
  e=false;
  l1=x1;
  l2=x2;
  while(!e&&l1.$==1&&l2.$==1)
   {
    e=p(l1.$0,l2.$0);
    l1=l1.$1;
    l2=l2.$1;
   }
  !e&&(l1.$==1||l2.$==1)?List$1.badLengths():void 0;
  return e;
 };
 List$1.filter=function(p,l)
 {
  return List$1.ofSeq(Seq.filter(p,l));
 };
 List$1.fold2=function(f,s,l1,l2)
 {
  return Arrays.fold2(f,s,Arrays.ofList(l1),Arrays.ofList(l2));
 };
 List$1.foldBack=function(f,l,s)
 {
  return Arrays.foldBack(f,Arrays.ofList(l),s);
 };
 List$1.foldBack2=function(f,l1,l2,s)
 {
  return Arrays.foldBack2(f,Arrays.ofList(l1),Arrays.ofList(l2),s);
 };
 List$1.forAll=function(p,x)
 {
  var a,l;
  a=true;
  l=x;
  while(a&&l.$==1)
   {
    a=p(l.$0);
    l=l.$1;
   }
  return a;
 };
 List$1.forall2=function(p,x1,x2)
 {
  var a,l1,l2;
  a=true;
  l1=x1;
  l2=x2;
  while(a&&l1.$==1&&l2.$==1)
   {
    a=p(l1.$0,l2.$0);
    l1=l1.$1;
    l2=l2.$1;
   }
  a&&(l1.$==1||l2.$==1)?List$1.badLengths():void 0;
  return a;
 };
 List$1.head=function(l)
 {
  return l.$==1?l.$0:List$1.listEmpty();
 };
 List$1.init=function(s,f)
 {
  return List$1.ofArray(Arrays.init(s,f));
 };
 List$1.iter=function(f,l)
 {
  var r;
  r=l;
  while(r.$==1)
   {
    f(List$1.head(r));
    r=List$1.tail(r);
   }
 };
 List$1.iter2=function(f,l1,l2)
 {
  var r1,r2;
  r1=l1;
  r2=l2;
  while(r1.$==1)
   {
    r2.$==0?List$1.badLengths():void 0;
    f(List$1.head(r1),List$1.head(r2));
    r1=List$1.tail(r1);
    r2=List$1.tail(r2);
   }
  r2.$==1?List$1.badLengths():void 0;
 };
 List$1.iteri=function(f,l)
 {
  var r,i;
  r=l;
  i=0;
  while(r.$==1)
   {
    f(i,List$1.head(r));
    r=List$1.tail(r);
    i=i+1;
   }
 };
 List$1.iteri2=function(f,l1,l2)
 {
  var r1,r2,i;
  r1=l1;
  r2=l2;
  i=0;
  while(r1.$==1)
   {
    r2.$==0?List$1.badLengths():void 0;
    f(i,List$1.head(r1),List$1.head(r2));
    r1=List$1.tail(r1);
    r2=List$1.tail(r2);
    i=i+1;
   }
  r2.$==1?List$1.badLengths():void 0;
 };
 List$1.length=function(l)
 {
  var r,i;
  r=l;
  i=0;
  while(r.$==1)
   {
    r=List$1.tail(r);
    i=i+1;
   }
  return i;
 };
 List$1.map=function(f,x)
 {
  var r,l,go,res,t;
  if(x.$==0)
   return x;
  else
   {
    res=new T$1({
     $:1
    });
    r=res;
    l=x;
    go=true;
    while(go)
     {
      r.$0=f(l.$0);
      l=l.$1;
      l.$==0?go=false:r=(t=new T$1({
       $:1
      }),r.$1=t,t);
     }
    r.$1=T$1.Empty;
    return res;
   }
 };
 List$1.map2=function(f,x1,x2)
 {
  var go,r,l1,l2,res,t;
  go=x1.$==1&&x2.$==1;
  if(!go)
   return x1.$==1||x2.$==1?List$1.badLengths():x1;
  else
   {
    res=new T$1({
     $:1
    });
    r=res;
    l1=x1;
    l2=x2;
    while(go)
     {
      r.$0=f(l1.$0,l2.$0);
      l1=l1.$1;
      l2=l2.$1;
      l1.$==1&&l2.$==1?r=(t=new T$1({
       $:1
      }),r.$1=t,t):go=false;
     }
    if(l1.$==1||l2.$==1)
     List$1.badLengths();
    r.$1=T$1.Empty;
    return res;
   }
 };
 List$1.map3=function(f,x1,x2,x3)
 {
  var go,r,l1,l2,l3,res,t;
  go=x1.$==1&&x2.$==1&&x3.$==1;
  if(!go)
   return x1.$==1||x2.$==1||x3.$==1?List$1.badLengths():x1;
  else
   {
    res=new T$1({
     $:1
    });
    r=res;
    l1=x1;
    l2=x2;
    l3=x3;
    while(go)
     {
      r.$0=f(l1.$0,l2.$0,l3.$0);
      l1=l1.$1;
      l2=l2.$1;
      l3=l3.$1;
      l1.$==1&&l2.$==1&&l3.$==1?r=(t=new T$1({
       $:1
      }),r.$1=t,t):go=false;
     }
    if(l1.$==1||l2.$==1||l3.$==1)
     List$1.badLengths();
    r.$1=T$1.Empty;
    return res;
   }
 };
 List$1.mapi=function(f,x)
 {
  var r,l,i,go,res,t;
  if(x.$==0)
   return x;
  else
   {
    res=new T$1({
     $:1
    });
    r=res;
    l=x;
    i=0;
    go=true;
    while(go)
     {
      r.$0=f(i,l.$0);
      l=l.$1;
      l.$==0?go=false:(r=(t=new T$1({
       $:1
      }),r.$1=t,t),i=i+1);
     }
    r.$1=T$1.Empty;
    return res;
   }
 };
 List$1.mapi2=function(f,x1,x2)
 {
  var go,r,l1,l2,i,res,t;
  go=x1.$==1&&x2.$==1;
  if(!go)
   return x1.$==1||x2.$==1?List$1.badLengths():x1;
  else
   {
    res=new T$1({
     $:1
    });
    r=res;
    l1=x1;
    l2=x2;
    i=0;
    while(go)
     {
      r.$0=f(i,l1.$0,l2.$0);
      l1=l1.$1;
      l2=l2.$1;
      l1.$==1&&l2.$==1?(r=(t=new T$1({
       $:1
      }),r.$1=t,t),i=i+1):go=false;
     }
    if(l1.$==1||l2.$==1)
     List$1.badLengths();
    r.$1=T$1.Empty;
    return res;
   }
 };
 List$1.max=function(l)
 {
  return Seq.reduce(function($1,$2)
  {
   return Unchecked.Compare($1,$2)===1?$1:$2;
  },l);
 };
 List$1.maxBy=function(f,l)
 {
  return Seq.reduce(function($1,$2)
  {
   return Unchecked.Compare(f($1),f($2))===1?$1:$2;
  },l);
 };
 List$1.min=function(l)
 {
  return Seq.reduce(function($1,$2)
  {
   return Unchecked.Compare($1,$2)===-1?$1:$2;
  },l);
 };
 List$1.minBy=function(f,l)
 {
  return Seq.reduce(function($1,$2)
  {
   return Unchecked.Compare(f($1),f($2))===-1?$1:$2;
  },l);
 };
 List$1.ofArray=function(arr)
 {
  var r,i,$1;
  r=T$1.Empty;
  for(i=Arrays.length(arr)-1,$1=0;i>=$1;i--)r=new T$1({
   $:1,
   $0:Arrays.get(arr,i),
   $1:r
  });
  return r;
 };
 List$1.ofSeq=function(s)
 {
  var e,$1,go,r,res,t;
  if(s instanceof T$1)
   return s;
  else
   if(s instanceof Global.Array)
    return List$1.ofArray(s);
   else
    {
     e=Enumerator.Get(s);
     try
     {
      go=e.MoveNext();
      if(!go)
       $1=T$1.Empty;
      else
       {
        res=new T$1({
         $:1
        });
        r=res;
        while(go)
         {
          r.$0=e.Current();
          e.MoveNext()?r=(t=new T$1({
           $:1
          }),r.$1=t,t):go=false;
         }
        r.$1=T$1.Empty;
        $1=res;
       }
      return $1;
     }
     finally
     {
      if("Dispose"in e)
       e.Dispose();
     }
    }
 };
 List$1.partition=function(p,l)
 {
  var p$1;
  p$1=Arrays.partition(p,Arrays.ofList(l));
  return[List$1.ofArray(p$1[0]),List$1.ofArray(p$1[1])];
 };
 List$1.permute=function(f,l)
 {
  return List$1.ofArray(Arrays.permute(f,Arrays.ofList(l)));
 };
 List$1.reduceBack=function(f,l)
 {
  return Arrays.reduceBack(f,Arrays.ofList(l));
 };
 List$1.replicate=function(size,value)
 {
  return List$1.ofArray(Arrays.create(size,value));
 };
 List$1.rev=function(l)
 {
  var res,r;
  res=T$1.Empty;
  r=l;
  while(r.$==1)
   {
    res=new T$1({
     $:1,
     $0:r.$0,
     $1:res
    });
    r=r.$1;
   }
  return res;
 };
 List$1.scan=function(f,s,l)
 {
  return List$1.ofSeq(Seq.scan(f,s,l));
 };
 List$1.scanBack=function(f,l,s)
 {
  return List$1.ofArray(Arrays.scanBack(f,Arrays.ofList(l),s));
 };
 List$1.sort=function(l)
 {
  var a;
  a=Arrays.ofList(l);
  Arrays.sortInPlace(a);
  return List$1.ofArray(a);
 };
 List$1.sortBy=function(f,l)
 {
  return List$1.sortWith(function($1,$2)
  {
   return Unchecked.Compare(f($1),f($2));
  },l);
 };
 List$1.sortByDescending=function(f,l)
 {
  return List$1.sortWith(function($1,$2)
  {
   return-Unchecked.Compare(f($1),f($2));
  },l);
 };
 List$1.sortDescending=function(l)
 {
  var a;
  a=Arrays.ofList(l);
  Arrays.sortInPlaceByDescending(Global.id,a);
  return List$1.ofArray(a);
 };
 List$1.sortWith=function(f,l)
 {
  var a;
  a=Arrays.ofList(l);
  Arrays.sortInPlaceWith(f,a);
  return List$1.ofArray(a);
 };
 List$1.tail=function(l)
 {
  return l.$==1?l.$1:List$1.listEmpty();
 };
 List$1.unzip=function(l)
 {
  var x,y,e,f;
  x=[];
  y=[];
  e=Enumerator.Get(l);
  try
  {
   while(e.MoveNext())
    {
     f=e.Current();
     x.push(f[0]);
     y.push(f[1]);
    }
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
  return[List$1.ofArray(x.slice(0)),List$1.ofArray(y.slice(0))];
 };
 List$1.unzip3=function(l)
 {
  var x,y,z,e,f;
  x=[];
  y=[];
  z=[];
  e=Enumerator.Get(l);
  try
  {
   while(e.MoveNext())
    {
     f=e.Current();
     x.push(f[0]);
     y.push(f[1]);
     z.push(f[2]);
    }
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
  return[List$1.ofArray(x.slice(0)),List$1.ofArray(y.slice(0)),List$1.ofArray(z.slice(0))];
 };
 List$1.zip=function(l1,l2)
 {
  return List$1.map2(function($1,$2)
  {
   return[$1,$2];
  },l1,l2);
 };
 List$1.zip3=function(l1,l2,l3)
 {
  return List$1.map3(function($1,$2,$3)
  {
   return[$1,$2,$3];
  },l1,l2,l3);
 };
 List$1.chunkBySize=function(size,list)
 {
  return List$1.map(List$1.ofArray,List$1.ofSeq(Seq.chunkBySize(size,list)));
 };
 List$1.compareWith=function(f,l1,l2)
 {
  return Seq.compareWith(f,l1,l2);
 };
 List$1.countBy=function(f,l)
 {
  return List$1.ofArray(Arrays.countBy(f,Arrays.ofList(l)));
 };
 List$1.distinct=function(l)
 {
  return List$1.ofSeq(Seq.distinct(l));
 };
 List$1.distinctBy=function(f,l)
 {
  return List$1.ofSeq(Seq.distinctBy(f,l));
 };
 List$1.splitInto=function(count,list)
 {
  return List$1.map(List$1.ofArray,List$1.ofArray(Arrays.splitInto(count,Arrays.ofList(list))));
 };
 List$1.except=function(itemsToExclude,l)
 {
  return List$1.ofSeq(Seq.except(itemsToExclude,l));
 };
 List$1.tryFindBack=function(ok,l)
 {
  return Arrays.tryFindBack(ok,Arrays.ofList(l));
 };
 List$1.findBack=function(p,s)
 {
  var m;
  m=List$1.tryFindBack(p,s);
  return m==null?Operators.FailWith("KeyNotFoundException"):m.$0;
 };
 List$1.findIndexBack=function(p,s)
 {
  var m;
  m=Arrays.tryFindIndexBack(p,Arrays.ofList(s));
  return m==null?Operators.FailWith("KeyNotFoundException"):m.$0;
 };
 List$1.groupBy=function(f,l)
 {
  var arr;
  function f$1(k,s)
  {
   return[k,List$1.ofArray(s)];
  }
  arr=Arrays.groupBy(f,Arrays.ofList(l));
  Arrays.mapInPlace(function($1)
  {
   return f$1($1[0],$1[1]);
  },arr);
  return List$1.ofArray(arr);
 };
 List$1.last=function(list)
 {
  var r,t;
  list.$==0?List$1.listEmpty():null;
  r=list;
  t=r.$1;
  while(t.$==1)
   {
    r=t;
    t=r.$1;
   }
  return r.$0;
 };
 List$1.contains=function(el,x)
 {
  var c,l;
  c=false;
  l=x;
  while(!c&&l.$==1)
   {
    c=Unchecked.Equals(el,l.$0);
    l=l.$1;
   }
  return c;
 };
 List$1.mapFold=function(f,zero,list)
 {
  var t;
  t=Arrays.mapFold(f,zero,Arrays.ofList(list));
  return[List$1.ofArray(t[0]),t[1]];
 };
 List$1.mapFoldBack=function(f,list,zero)
 {
  var t;
  t=Arrays.mapFoldBack(f,Arrays.ofList(list),zero);
  return[List$1.ofArray(t[0]),t[1]];
 };
 List$1.pairwise=function(l)
 {
  return List$1.ofSeq(Seq.pairwise(l));
 };
 List$1.indexed=function(list)
 {
  return List$1.mapi(function($1,$2)
  {
   return[$1,$2];
  },list);
 };
 List$1.tryHead=function(list)
 {
  return list.$==0?null:{
   $:1,
   $0:list.$0
  };
 };
 List$1.exactlyOne=function(list)
 {
  var $1;
  return list.$==1&&(list.$1.$==0&&($1=list.$0,true))?$1:Operators.FailWith("The input does not have precisely one element.");
 };
 List$1.unfold=function(f,s)
 {
  return List$1.ofSeq(Seq.unfold(f,s));
 };
 List$1.windowed=function(windowSize,s)
 {
  return List$1.ofSeq(Seq.map(List$1.ofArray,Seq.windowed(windowSize,s)));
 };
 List$1.splitAt=function(n,list)
 {
  return[List$1.ofSeq(Seq.take(n,list)),List$1.skip(n,list)];
 };
 List$1.listEmpty=function()
 {
  return Operators.FailWith("The input list was empty.");
 };
 List$1.badLengths=function()
 {
  return Operators.FailWith("The lists have different lengths.");
 };
 Nullable.getOrValue=function(x,v)
 {
  return x==null?v:x;
 };
 Nullable.get=function(x)
 {
  return x==null?Operators.FailWith("Nullable object must have a value."):x;
 };
 Operators.range=function(min,max)
 {
  var count;
  count=1+max-min;
  return count<=0?[]:Seq.init(count,function(x)
  {
   return x+min;
  });
 };
 Operators.step=function(min,step,max)
 {
  var s;
  s=Operators.Sign(step);
  return Seq.takeWhile(function(k)
  {
   return s*(max-k)>=0;
  },Seq.initInfinite(function(k)
  {
   return min+k*step;
  }));
 };
 Operators.KeyValue=function(kvp)
 {
  return[kvp.K,kvp.V];
 };
 Operators.Truncate=function(x)
 {
  return x<0?Math.ceil(x):Math.floor(x);
 };
 Operators.Sign=function(x)
 {
  return x===0?0:x<0?-1:1;
 };
 Operators.Pown=function(a,n)
 {
  function p(n$1)
  {
   var b;
   return n$1===1?a:n$1%2===0?(b=p(n$1/2>>0),b*b):a*p(n$1-1);
  }
  return p(n);
 };
 Operators.InvalidArg=function(arg,msg)
 {
  throw new ArgumentException.New(arg,msg);
 };
 Operators.InvalidOp=function(msg)
 {
  throw new InvalidOperationException.New$1(msg);
 };
 Operators.FailWith=function(msg)
 {
  throw Global.Error(msg);
 };
 Slice.string=function(source,start,finish)
 {
  return start==null?finish!=null&&finish.$==1?source.slice(0,finish.$0+1):"":finish==null?source.slice(start.$0):source.slice(start.$0,finish.$0+1);
 };
 Slice.array=function(source,start,finish)
 {
  return start==null?finish!=null&&finish.$==1?source.slice(0,finish.$0+1):[]:finish==null?source.slice(start.$0):source.slice(start.$0,finish.$0+1);
 };
 Slice.setArray=function(dst,start,finish,src)
 {
  var start$1;
  start$1=start!=null&&start.$==1?start.$0:0;
  Arrays.setSub(dst,start$1,(finish!=null&&finish.$==1?finish.$0:dst.length-1)-start$1+1,src);
 };
 Slice.array2D=function(arr,start1,finish1,start2,finish2)
 {
  var start1$1,start2$1;
  start1$1=start1!=null&&start1.$==1?start1.$0:0;
  start2$1=start2!=null&&start2.$==1?start2.$0:0;
  return Arrays.sub2D(arr,start1$1,start2$1,(finish1!=null&&finish1.$==1?finish1.$0:arr.length-1)-start1$1+1,(finish2!=null&&finish2.$==1?finish2.$0:(arr.length?arr[0].length:0)-1)-start2$1+1);
 };
 Slice.array2Dfix1=function(arr,fixed1,start2,finish2)
 {
  var start2$1,finish2$1,len2,dst,j,$1;
  start2$1=start2!=null&&start2.$==1?start2.$0:0;
  finish2$1=finish2!=null&&finish2.$==1?finish2.$0:(arr.length?arr[0].length:0)-1;
  len2=finish2$1-start2$1+1;
  dst=new Global.Array(len2);
  for(j=0,$1=len2-1;j<=$1;j++)Arrays.set(dst,j,Arrays.get2D(arr,fixed1,start2$1+j));
  return dst;
 };
 Slice.array2Dfix2=function(arr,start1,finish1,fixed2)
 {
  var start1$1,finish1$1,len1,dst,i,$1;
  start1$1=start1!=null&&start1.$==1?start1.$0:0;
  finish1$1=finish1!=null&&finish1.$==1?finish1.$0:arr.length-1;
  len1=finish1$1-start1$1+1;
  dst=new Global.Array(len1);
  for(i=0,$1=len1-1;i<=$1;i++)Arrays.set(dst,i,Arrays.get2D(arr,start1$1+i,fixed2));
  return dst;
 };
 Slice.setArray2Dfix1=function(dst,fixed1,start2,finish2,src)
 {
  var start2$1,finish2$1,j,$1;
  start2$1=start2!=null&&start2.$==1?start2.$0:0;
  finish2$1=finish2!=null&&finish2.$==1?finish2.$0:(dst.length?dst[0].length:0)-1;
  for(j=0,$1=finish2$1-start2$1+1-1;j<=$1;j++)Arrays.set2D(dst,fixed1,start2$1+j,Arrays.get(src,j));
 };
 Slice.setArray2Dfix2=function(dst,start1,finish1,fixed2,src)
 {
  var start1$1,finish1$1,i,$1;
  start1$1=start1!=null&&start1.$==1?start1.$0:0;
  finish1$1=finish1!=null&&finish1.$==1?finish1.$0:dst.length-1;
  for(i=0,$1=finish1$1-start1$1+1-1;i<=$1;i++)Arrays.set2D(dst,start1$1+i,fixed2,Arrays.get(src,i));
 };
 Slice.setArray2D=function(dst,start1,finish1,start2,finish2,src)
 {
  var start1$1,start2$1;
  start1$1=start1!=null&&start1.$==1?start1.$0:0;
  start2$1=start2!=null&&start2.$==1?start2.$0:0;
  Arrays.setSub2D(dst,start1$1,start2$1,(finish1!=null&&finish1.$==1?finish1.$0:dst.length-1)-start1$1+1,(finish2!=null&&finish2.$==1?finish2.$0:(dst.length?dst[0].length:0)-1)-start2$1+1,src);
 };
 Option.filter=function(f,o)
 {
  var $1;
  return o!=null&&o.$==1&&(f(o.$0)&&($1=o.$0,true))?o:null;
 };
 Option.fold=function(f,s,x)
 {
  return x==null?s:f(s,x.$0);
 };
 Option.foldBack=function(f,x,s)
 {
  return x==null?s:f(x.$0,s);
 };
 Option.ofNullable=function(o)
 {
  return o==null?null:{
   $:1,
   $0:Nullable.get(o)
  };
 };
 Option.ofObj=function(o)
 {
  return o==null?null:{
   $:1,
   $0:o
  };
 };
 Option.toArray=function(x)
 {
  return x==null?[]:[x.$0];
 };
 Option.toList=function(x)
 {
  return x==null?T$1.Empty:List$1.ofArray([x.$0]);
 };
 Option.toNullable=function(o)
 {
  return o!=null&&o.$==1?o.$0:null;
 };
 Option.toObj=function(o)
 {
  return o==null?null:o.$0;
 };
 Queue.CopyTo=function(a,array,index)
 {
  Arrays.blit(a,0,array,index,Arrays.length(a));
 };
 Queue.Contains=function(a,el)
 {
  return Seq.exists(function(y)
  {
   return Unchecked.Equals(el,y);
  },a);
 };
 Queue.Clear=function(a)
 {
  a.splice(0,Arrays.length(a));
 };
 Random=WebSharper.Random=Runtime.Class({
  NextBytes:function(buffer)
  {
   var i,$1;
   for(i=0,$1=Arrays.length(buffer)-1;i<=$1;i++)Arrays.set(buffer,i,Math.floor(Math.random()*256));
  },
  Next:function(minValue,maxValue)
  {
   return minValue>maxValue?Operators.FailWith("'minValue' cannot be greater than maxValue."):minValue+Math.floor(Math.random()*(maxValue-minValue));
  },
  Next$1:function(maxValue)
  {
   return maxValue<0?Operators.FailWith("'maxValue' must be greater than zero."):Math.floor(Math.random()*maxValue);
  },
  Next$2:function()
  {
   return Math.floor(Math.random()*2147483648);
  }
 },null,Random);
 Random.New=Runtime.Ctor(function()
 {
 },Random);
 Ref.New=function(contents)
 {
  return[contents];
 };
 Result.MapError=function(f,r)
 {
  return r.$==1?{
   $:1,
   $0:f(r.$0)
  }:{
   $:0,
   $0:r.$0
  };
 };
 Result.Map=function(f,r)
 {
  return r.$==1?{
   $:1,
   $0:r.$0
  }:{
   $:0,
   $0:f(r.$0)
  };
 };
 Result.Bind=function(f,r)
 {
  return r.$==1?{
   $:1,
   $0:r.$0
  }:f(r.$0);
 };
 Seq.enumFinally=function(s,f)
 {
  return{
   GetEnumerator:function()
   {
    var _enum;
    try
    {
     _enum=Enumerator.Get(s);
    }
    catch(e)
    {
     f();
     throw e;
    }
    return new T.New(null,null,function(e$1)
    {
     return _enum.MoveNext()&&(e$1.c=_enum.Current(),true);
    },function()
    {
     _enum.Dispose();
     f();
    });
   }
  };
 };
 Seq.enumUsing=function(x,f)
 {
  return{
   GetEnumerator:function()
   {
    var _enum;
    try
    {
     _enum=Enumerator.Get(f(x));
    }
    catch(e)
    {
     x.Dispose();
     throw e;
    }
    return new T.New(null,null,function(e$1)
    {
     return _enum.MoveNext()&&(e$1.c=_enum.Current(),true);
    },function()
    {
     _enum.Dispose();
     x.Dispose();
    });
   }
  };
 };
 Seq.enumWhile=function(f,s)
 {
  return{
   GetEnumerator:function()
   {
    return new T.New(null,null,function(en)
    {
     var m;
     while(true)
      {
       m=en.s;
       if(Unchecked.Equals(m,null))
       {
        if(f())
         {
          en.s=Enumerator.Get(s);
          en=en;
         }
        else
         return false;
       }
       else
        if(m.MoveNext())
         {
          en.c=m.Current();
          return true;
         }
        else
         {
          m.Dispose();
          en.s=null;
          en=en;
         }
      }
    },function(en)
    {
     var x;
     x=en.s;
     !Unchecked.Equals(x,null)?x.Dispose():void 0;
    });
   }
  };
 };
 Control.createEvent=function(add,remove,create)
 {
  return{
   AddHandler:add,
   RemoveHandler:remove,
   Subscribe:function(r)
   {
    var h;
    h=create(function()
    {
     return function(args)
     {
      return r.OnNext(args);
     };
    });
    add(h);
    return{
     Dispose:function()
     {
      return remove(h);
     }
    };
   }
  };
 };
 Seq.allPairs=function(source1,source2)
 {
  var cached;
  cached=Seq.cache(source2);
  return Seq.collect(function(x)
  {
   return Seq.map(function(y)
   {
    return[x,y];
   },cached);
  },source1);
 };
 Seq.append=function(s1,s2)
 {
  return{
   GetEnumerator:function()
   {
    var first;
    first=[true];
    return new T.New(Enumerator.Get(s1),null,function(x)
    {
     var x$1;
     return x.s.MoveNext()?(x.c=x.s.Current(),true):(x$1=x.s,!Unchecked.Equals(x$1,null)?x$1.Dispose():void 0,x.s=null,first[0]&&(first[0]=false,x.s=Enumerator.Get(s2),x.s.MoveNext()?(x.c=x.s.Current(),true):(x.s.Dispose(),x.s=null,false)));
    },function(x)
    {
     var x$1;
     x$1=x.s;
     !Unchecked.Equals(x$1,null)?x$1.Dispose():void 0;
    });
   }
  };
 };
 Seq.average=function(s)
 {
  var p,count;
  p=Seq.fold(function($1,$2)
  {
   return(function(t)
   {
    var n,s$1;
    n=t[0];
    s$1=t[1];
    return function(x)
    {
     return[n+1,s$1+x];
    };
   }($1))($2);
  },[0,0],s);
  count=p[0];
  return count===0?Operators.InvalidArg("source","The input sequence was empty."):p[1]/count;
 };
 Seq.averageBy=function(f,s)
 {
  var p,count;
  p=Seq.fold(function($1,$2)
  {
   return(function(t)
   {
    var n,s$1;
    n=t[0];
    s$1=t[1];
    return function(x)
    {
     return[n+1,s$1+f(x)];
    };
   }($1))($2);
  },[0,0],s);
  count=p[0];
  return count===0?Operators.InvalidArg("source","The input sequence was empty."):p[1]/count;
 };
 Seq.cache=function(s)
 {
  var cache,o;
  cache=[];
  o=[Enumerator.Get(s)];
  return{
   GetEnumerator:function()
   {
    return new T.New(0,null,function(e)
    {
     var en;
     return e.s<cache.length?(e.c=cache[e.s],e.s=e.s+1,true):(en=o[0],Unchecked.Equals(en,null)?false:en.MoveNext()?(e.s=e.s+1,e.c=en.Current(),cache.push(e.c),true):(en.Dispose(),o[0]=null,false));
    },void 0);
   }
  };
 };
 Seq.choose=function(f,s)
 {
  return Seq.collect(function(x)
  {
   var m;
   m=f(x);
   return m==null?T$1.Empty:List$1.ofArray([m.$0]);
  },s);
 };
 Seq.collect=function(f,s)
 {
  return Seq.concat(Seq.map(f,s));
 };
 Seq.compareWith=function(f,s1,s2)
 {
  var e1,$1,e2,r,loop;
  e1=Enumerator.Get(s1);
  try
  {
   e2=Enumerator.Get(s2);
   try
   {
    r=0;
    loop=true;
    while(loop&&r===0)
     if(e1.MoveNext())
      r=e2.MoveNext()?f(e1.Current(),e2.Current()):1;
     else
      if(e2.MoveNext())
       r=-1;
      else
       loop=false;
    $1=r;
   }
   finally
   {
    if("Dispose"in e2)
     e2.Dispose();
   }
   return $1;
  }
  finally
  {
   if("Dispose"in e1)
    e1.Dispose();
  }
 };
 Seq.concat=function(ss)
 {
  return{
   GetEnumerator:function()
   {
    var outerE;
    outerE=Enumerator.Get(ss);
    return new T.New(null,null,function(st)
    {
     var m;
     while(true)
      {
       m=st.s;
       if(Unchecked.Equals(m,null))
       {
        if(outerE.MoveNext())
         {
          st.s=Enumerator.Get(outerE.Current());
          st=st;
         }
        else
         {
          outerE.Dispose();
          return false;
         }
       }
       else
        if(m.MoveNext())
         {
          st.c=m.Current();
          return true;
         }
        else
         {
          st.Dispose();
          st.s=null;
          st=st;
         }
      }
    },function(st)
    {
     var x;
     x=st.s;
     !Unchecked.Equals(x,null)?x.Dispose():void 0;
     !Unchecked.Equals(outerE,null)?outerE.Dispose():void 0;
    });
   }
  };
 };
 Seq.countBy=function(f,s)
 {
  return Seq.delay(function()
  {
   return Arrays.countBy(f,Arrays.ofSeq(s));
  });
 };
 Seq.delay=function(f)
 {
  return{
   GetEnumerator:function()
   {
    return Enumerator.Get(f());
   }
  };
 };
 Seq.distinct=function(s)
 {
  return Seq.distinctBy(Global.id,s);
 };
 Seq.distinctBy=function(f,s)
 {
  return{
   GetEnumerator:function()
   {
    var o,seen;
    o=Enumerator.Get(s);
    seen=new HashSet.New$3();
    return new T.New(null,null,function(e)
    {
     var cur,has;
     if(o.MoveNext())
      {
       cur=o.Current();
       has=seen.Add(f(cur));
       while(!has&&o.MoveNext())
        {
         cur=o.Current();
         has=seen.Add(f(cur));
        }
       return has&&(e.c=cur,true);
      }
     else
      return false;
    },function()
    {
     o.Dispose();
    });
   }
  };
 };
 Seq.splitInto=function(count,s)
 {
  count<=0?Operators.FailWith("Count must be positive"):void 0;
  return Seq.delay(function()
  {
   return Arrays.splitInto(count,Arrays.ofSeq(s));
  });
 };
 Seq.exactlyOne=function(s)
 {
  var e,x;
  e=Enumerator.Get(s);
  try
  {
   return e.MoveNext()?(x=e.Current(),e.MoveNext()?Operators.InvalidOp("Sequence contains more than one element"):x):Operators.InvalidOp("Sequence contains no elements");
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.exists=function(p,s)
 {
  var e,r;
  e=Enumerator.Get(s);
  try
  {
   r=false;
   while(!r&&e.MoveNext())
    r=p(e.Current());
   return r;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.exists2=function(p,s1,s2)
 {
  var e1,$1,e2,r;
  e1=Enumerator.Get(s1);
  try
  {
   e2=Enumerator.Get(s2);
   try
   {
    r=false;
    while(!r&&e1.MoveNext()&&e2.MoveNext())
     r=p(e1.Current(),e2.Current());
    $1=r;
   }
   finally
   {
    if("Dispose"in e2)
     e2.Dispose();
   }
   return $1;
  }
  finally
  {
   if("Dispose"in e1)
    e1.Dispose();
  }
 };
 Seq.filter=function(f,s)
 {
  return{
   GetEnumerator:function()
   {
    var o;
    o=Enumerator.Get(s);
    return new T.New(null,null,function(e)
    {
     var loop,c,res;
     loop=o.MoveNext();
     c=o.Current();
     res=false;
     while(loop)
      if(f(c))
       {
        e.c=c;
        res=true;
        loop=false;
       }
      else
       if(o.MoveNext())
        c=o.Current();
       else
        loop=false;
     return res;
    },function()
    {
     o.Dispose();
    });
   }
  };
 };
 Seq.find=function(p,s)
 {
  var m;
  m=Seq.tryFind(p,s);
  return m==null?Operators.FailWith("KeyNotFoundException"):m.$0;
 };
 Seq.findIndex=function(p,s)
 {
  var m;
  m=Seq.tryFindIndex(p,s);
  return m==null?Operators.FailWith("KeyNotFoundException"):m.$0;
 };
 Seq.fold=function(f,x,s)
 {
  var r,e;
  r=x;
  e=Enumerator.Get(s);
  try
  {
   while(e.MoveNext())
    r=f(r,e.Current());
   return r;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.forall=function(p,s)
 {
  return!Seq.exists(function(x)
  {
   return!p(x);
  },s);
 };
 Seq.forall2=function(p,s1,s2)
 {
  return!Seq.exists2(function($1,$2)
  {
   return!p($1,$2);
  },s1,s2);
 };
 Seq.groupBy=function(f,s)
 {
  return Seq.delay(function()
  {
   return Arrays.groupBy(f,Arrays.ofSeq(s));
  });
 };
 Seq.head=function(s)
 {
  var e;
  e=Enumerator.Get(s);
  try
  {
   return e.MoveNext()?e.Current():Seq.insufficient();
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.init=function(n,f)
 {
  return Seq.take(n,Seq.initInfinite(f));
 };
 Seq.initInfinite=function(f)
 {
  return{
   GetEnumerator:function()
   {
    return new T.New(0,null,function(e)
    {
     e.c=f(e.s);
     e.s=e.s+1;
     return true;
    },void 0);
   }
  };
 };
 Seq.isEmpty=function(s)
 {
  var e;
  e=Enumerator.Get(s);
  try
  {
   return!e.MoveNext();
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.iter=function(p,s)
 {
  var e;
  e=Enumerator.Get(s);
  try
  {
   while(e.MoveNext())
    p(e.Current());
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.iter2=function(p,s1,s2)
 {
  var e1,$1,e2;
  e1=Enumerator.Get(s1);
  try
  {
   e2=Enumerator.Get(s2);
   try
   {
    while(e1.MoveNext()&&e2.MoveNext())
     p(e1.Current(),e2.Current());
    $1=void 0;
   }
   finally
   {
    if("Dispose"in e2)
     e2.Dispose();
   }
   $1;
  }
  finally
  {
   if("Dispose"in e1)
    e1.Dispose();
  }
 };
 Seq.iteri=function(p,s)
 {
  var i,e;
  i=0;
  e=Enumerator.Get(s);
  try
  {
   while(e.MoveNext())
    {
     p(i,e.Current());
     i=i+1;
    }
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.length=function(s)
 {
  var i,e;
  i=0;
  e=Enumerator.Get(s);
  try
  {
   while(e.MoveNext())
    i=i+1;
   return i;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.map=function(f,s)
 {
  return{
   GetEnumerator:function()
   {
    var en;
    en=Enumerator.Get(s);
    return new T.New(null,null,function(e)
    {
     return en.MoveNext()&&(e.c=f(en.Current()),true);
    },function()
    {
     en.Dispose();
    });
   }
  };
 };
 Seq.mapi=function(f,s)
 {
  return Seq.map2(f,Seq.initInfinite(Global.id),s);
 };
 Seq.map2=function(f,s1,s2)
 {
  return{
   GetEnumerator:function()
   {
    var e1,e2;
    e1=Enumerator.Get(s1);
    e2=Enumerator.Get(s2);
    return new T.New(null,null,function(e)
    {
     return e1.MoveNext()&&e2.MoveNext()&&(e.c=f(e1.Current(),e2.Current()),true);
    },function()
    {
     e1.Dispose();
     e2.Dispose();
    });
   }
  };
 };
 Seq.maxBy=function(f,s)
 {
  return Seq.reduce(function($1,$2)
  {
   return Unchecked.Compare(f($1),f($2))>=0?$1:$2;
  },s);
 };
 Seq.minBy=function(f,s)
 {
  return Seq.reduce(function($1,$2)
  {
   return Unchecked.Compare(f($1),f($2))<=0?$1:$2;
  },s);
 };
 Seq.max=function(s)
 {
  return Seq.reduce(function($1,$2)
  {
   return Unchecked.Compare($1,$2)>=0?$1:$2;
  },s);
 };
 Seq.min=function(s)
 {
  return Seq.reduce(function($1,$2)
  {
   return Unchecked.Compare($1,$2)<=0?$1:$2;
  },s);
 };
 Seq.nth=function(index,s)
 {
  var pos,e;
  if(index<0)
   Operators.FailWith("negative index requested");
  pos=-1;
  e=Enumerator.Get(s);
  try
  {
   while(pos<index)
    {
     !e.MoveNext()?Seq.insufficient():void 0;
     pos=pos+1;
    }
   return e.Current();
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.pairwise=function(s)
 {
  return Seq.map(function(x)
  {
   return[Arrays.get(x,0),Arrays.get(x,1)];
  },Seq.windowed(2,s));
 };
 Seq.pick=function(p,s)
 {
  var m;
  m=Seq.tryPick(p,s);
  return m==null?Operators.FailWith("KeyNotFoundException"):m.$0;
 };
 Seq.readOnly=function(s)
 {
  return{
   GetEnumerator:function()
   {
    return Enumerator.Get(s);
   }
  };
 };
 Seq.reduce=function(f,source)
 {
  var e,r;
  e=Enumerator.Get(source);
  try
  {
   if(!e.MoveNext())
    Operators.FailWith("The input sequence was empty");
   r=e.Current();
   while(e.MoveNext())
    r=f(r,e.Current());
   return r;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.scan=function(f,x,s)
 {
  return{
   GetEnumerator:function()
   {
    var en;
    en=Enumerator.Get(s);
    return new T.New(false,null,function(e)
    {
     return e.s?en.MoveNext()&&(e.c=f(e.c,en.Current()),true):(e.c=x,e.s=true,true);
    },function()
    {
     en.Dispose();
    });
   }
  };
 };
 Seq.skip=function(n,s)
 {
  return{
   GetEnumerator:function()
   {
    var o;
    o=Enumerator.Get(s);
    return new T.New(true,null,function(e)
    {
     var i,$1;
     if(e.s)
      {
       for(i=1,$1=n;i<=$1;i++)if(!o.MoveNext())
        Seq.insufficient();
       e.s=false;
      }
     else
      null;
     return o.MoveNext()&&(e.c=o.Current(),true);
    },function()
    {
     o.Dispose();
    });
   }
  };
 };
 Seq.skipWhile=function(f,s)
 {
  return{
   GetEnumerator:function()
   {
    var o;
    o=Enumerator.Get(s);
    return new T.New(true,null,function(e)
    {
     var go,empty;
     if(e.s)
      {
       go=true;
       empty=false;
       while(go)
        if(o.MoveNext())
        {
         if(!f(o.Current()))
          go=false;
        }
        else
         {
          go=false;
          empty=true;
         }
       e.s=false;
       return empty?false:(e.c=o.Current(),true);
      }
     else
      return o.MoveNext()&&(e.c=o.Current(),true);
    },function()
    {
     o.Dispose();
    });
   }
  };
 };
 Seq.sort=function(s)
 {
  return Seq.sortBy(Global.id,s);
 };
 Seq.sortBy=function(f,s)
 {
  return Seq.delay(function()
  {
   var array;
   array=Arrays.ofSeq(s);
   Arrays.sortInPlaceBy(f,array);
   return array;
  });
 };
 Seq.sortByDescending=function(f,s)
 {
  return Seq.delay(function()
  {
   var array;
   array=Arrays.ofSeq(s);
   Arrays.sortInPlaceByDescending(f,array);
   return array;
  });
 };
 Seq.sortDescending=function(s)
 {
  return Seq.sortByDescending(Global.id,s);
 };
 Seq.sum=function(s)
 {
  return Seq.fold(function($1,$2)
  {
   return $1+$2;
  },0,s);
 };
 Seq.sumBy=function(f,s)
 {
  return Seq.fold(function($1,$2)
  {
   return $1+f($2);
  },0,s);
 };
 Seq.take=function(n,s)
 {
  n<0?Seq.nonNegative():void 0;
  return{
   GetEnumerator:function()
   {
    var e;
    e=[Enumerator.Get(s)];
    return new T.New(0,null,function(o)
    {
     var en;
     o.s=o.s+1;
     return o.s>n?false:(en=e[0],Unchecked.Equals(en,null)?Seq.insufficient():en.MoveNext()?(o.c=en.Current(),o.s===n?(en.Dispose(),e[0]=null):void 0,true):(en.Dispose(),e[0]=null,Seq.insufficient()));
    },function()
    {
     var x;
     x=e[0];
     !Unchecked.Equals(x,null)?x.Dispose():void 0;
    });
   }
  };
 };
 Seq.takeWhile=function(f,s)
 {
  return Seq.delay(function()
  {
   return Seq.enumUsing(Enumerator.Get(s),function(e)
   {
    return Seq.enumWhile(function()
    {
     return e.MoveNext()&&f(e.Current());
    },Seq.delay(function()
    {
     return[e.Current()];
    }));
   });
  });
 };
 Seq.truncate=function(n,s)
 {
  return Seq.delay(function()
  {
   return Seq.enumUsing(Enumerator.Get(s),function(e)
   {
    var i;
    i=[0];
    return Seq.enumWhile(function()
    {
     return e.MoveNext()&&i[0]<n;
    },Seq.delay(function()
    {
     i[0]++;
     return[e.Current()];
    }));
   });
  });
 };
 Seq.tryFind=function(ok,s)
 {
  var e,r,x;
  e=Enumerator.Get(s);
  try
  {
   r=null;
   while(r==null&&e.MoveNext())
    {
     x=e.Current();
     ok(x)?r={
      $:1,
      $0:x
     }:void 0;
    }
   return r;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.findBack=function(p,s)
 {
  var m;
  m=Arrays.tryFindBack(p,Arrays.ofSeq(s));
  return m==null?Operators.FailWith("KeyNotFoundException"):m.$0;
 };
 Seq.tryFindIndex=function(ok,s)
 {
  var e,loop,i;
  e=Enumerator.Get(s);
  try
  {
   loop=true;
   i=0;
   while(loop&&e.MoveNext())
    if(ok(e.Current()))
     loop=false;
    else
     i=i+1;
   return loop?null:{
    $:1,
    $0:i
   };
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.findIndexBack=function(p,s)
 {
  var m;
  m=Arrays.tryFindIndexBack(p,Arrays.ofSeq(s));
  return m==null?Operators.FailWith("KeyNotFoundException"):m.$0;
 };
 Seq.tryPick=function(f,s)
 {
  var e,r;
  e=Enumerator.Get(s);
  try
  {
   r=null;
   while(Unchecked.Equals(r,null)&&e.MoveNext())
    r=f(e.Current());
   return r;
  }
  finally
  {
   if("Dispose"in e)
    e.Dispose();
  }
 };
 Seq.unfold=function(f,s)
 {
  return{
   GetEnumerator:function()
   {
    return new T.New(s,null,function(e)
    {
     var m;
     m=f(e.s);
     return m==null?false:(e.c=m.$0[0],e.s=m.$0[1],true);
    },void 0);
   }
  };
 };
 Seq.windowed=function(windowSize,s)
 {
  windowSize<=0?Operators.FailWith("The input must be positive."):void 0;
  return Seq.delay(function()
  {
   return Seq.enumUsing(Enumerator.Get(s),function(e)
   {
    var q;
    q=[];
    return Seq.append(Seq.enumWhile(function()
    {
     return q.length<windowSize&&e.MoveNext();
    },Seq.delay(function()
    {
     q.push(e.Current());
     return[];
    })),Seq.delay(function()
    {
     return q.length===windowSize?Seq.append([q.slice(0)],Seq.delay(function()
     {
      return Seq.enumWhile(function()
      {
       return e.MoveNext();
      },Seq.delay(function()
      {
       q.shift();
       q.push(e.Current());
       return[q.slice(0)];
      }));
     })):[];
    }));
   });
  });
 };
 Seq.zip=function(s1,s2)
 {
  return Seq.map2(function($1,$2)
  {
   return[$1,$2];
  },s1,s2);
 };
 Seq.map3=function(f,s1,s2,s3)
 {
  return{
   GetEnumerator:function()
   {
    var e1,e2,e3;
    e1=Enumerator.Get(s1);
    e2=Enumerator.Get(s2);
    e3=Enumerator.Get(s3);
    return new T.New(null,null,function(e)
    {
     return e1.MoveNext()&&e2.MoveNext()&&e3.MoveNext()&&(e.c=f(e1.Current(),e2.Current(),e3.Current()),true);
    },function()
    {
     e1.Dispose();
     e2.Dispose();
     e3.Dispose();
    });
   }
  };
 };
 Seq.zip3=function(s1,s2,s3)
 {
  return Seq.map3(function($1,$2,$3)
  {
   return[$1,$2,$3];
  },s1,s2,s3);
 };
 Seq.fold2=function(f,s,s1,s2)
 {
  return Arrays.fold2(f,s,Arrays.ofSeq(s1),Arrays.ofSeq(s2));
 };
 Seq.foldBack=function(f,s,state)
 {
  return Arrays.foldBack(f,Arrays.ofSeq(s),state);
 };
 Seq.foldBack2=function(f,s1,s2,s)
 {
  return Arrays.foldBack2(f,Arrays.ofSeq(s1),Arrays.ofSeq(s2),s);
 };
 Seq.iteri2=function(f,s1,s2)
 {
  var i,e1,$1,e2;
  i=0;
  e1=Enumerator.Get(s1);
  try
  {
   e2=Enumerator.Get(s2);
   try
   {
    while(e1.MoveNext()&&e2.MoveNext())
     {
      f(i,e1.Current(),e2.Current());
      i=i+1;
     }
    $1=void 0;
   }
   finally
   {
    if("Dispose"in e2)
     e2.Dispose();
   }
   $1;
  }
  finally
  {
   if("Dispose"in e1)
    e1.Dispose();
  }
 };
 Seq.mapi2=function(f,s1,s2)
 {
  return Seq.map3(function($1,$2,$3)
  {
   return((f($1))($2))($3);
  },Seq.initInfinite(Global.id),s1,s2);
 };
 Seq.mapFold=function(f,zero,s)
 {
  return Arrays.mapFold(f,zero,Arrays.ofSeq(s));
 };
 Seq.mapFoldBack=function(f,s,zero)
 {
  return Arrays.mapFoldBack(f,Arrays.ofSeq(s),zero);
 };
 Seq.permute=function(f,s)
 {
  return Seq.delay(function()
  {
   return Arrays.permute(f,Arrays.ofSeq(s));
  });
 };
 Seq.reduceBack=function(f,s)
 {
  return Arrays.reduceBack(f,Arrays.ofSeq(s));
 };
 Seq.replicate=function(size,value)
 {
  size<0?Seq.nonNegative():void 0;
  return Seq.delay(function()
  {
   return Seq.map(function()
   {
    return value;
   },Operators.range(0,size-1));
  });
 };
 Seq.rev=function(s)
 {
  return Seq.delay(function()
  {
   return Arrays.ofSeq(s).slice().reverse();
  });
 };
 Seq.scanBack=function(f,l,s)
 {
  return Seq.delay(function()
  {
   return Arrays.scanBack(f,Arrays.ofSeq(l),s);
  });
 };
 Seq.indexed=function(s)
 {
  return Seq.mapi(function($1,$2)
  {
   return[$1,$2];
  },s);
 };
 Seq.sortWith=function(f,s)
 {
  return Seq.delay(function()
  {
   var a;
   a=Arrays.ofSeq(s);
   Arrays.sortInPlaceWith(f,a);
   return a;
  });
 };
 Seq.tail=function(s)
 {
  return Seq.skip(1,s);
 };
 Stack.CopyTo=function(stack,array,index)
 {
  Arrays.blit(array,0,array,index,Arrays.length(stack));
 };
 Stack.Contains=function(stack,el)
 {
  return Seq.exists(function(y)
  {
   return Unchecked.Equals(el,y);
  },stack);
 };
 Stack.Clear=function(stack)
 {
  stack.splice(0,Arrays.length(stack));
 };
 Strings.RegexEscape=function(s)
 {
  return s.replace(new Global.RegExp("[-\\/\\\\^$*+?.()|[\\]{}]","g"),"\\$&");
 };
 Strings.SplitWith=function(str,pat)
 {
  return str.split(pat);
 };
 Strings.Join=function(sep,values)
 {
  return values.join(sep);
 };
 Strings.TrimEndWS=function(s)
 {
  return s.replace(new Global.RegExp("\\s+$"),"");
 };
 Strings.TrimStartWS=function(s)
 {
  return s.replace(new Global.RegExp("^\\s+"),"");
 };
 Strings.Trim=function(s)
 {
  return s.replace(new Global.RegExp("^\\s+"),"").replace(new Global.RegExp("\\s+$"),"");
 };
 Strings.StartsWith=function(t,s)
 {
  return t.substring(0,s.length)==s;
 };
 Strings.Substring=function(s,ix,ct)
 {
  return s.substr(ix,ct);
 };
 Strings.ReplaceOnce=function(string,search,replace)
 {
  return string.replace(search,replace);
 };
 Strings.Remove=function(x,ix,ct)
 {
  return x.substring(0,ix)+x.substring(ix+ct);
 };
 Strings.PadRightWith=function(s,n,c)
 {
  return n>s.length?s+Global.Array(n-s.length+1).join(String.fromCharCode(c)):s;
 };
 Strings.PadLeftWith=function(s,n,c)
 {
  return n>s.length?Global.Array(n-s.length+1).join(String.fromCharCode(c))+s:s;
 };
 Strings.LastIndexOf=function(s,c,i)
 {
  return s.lastIndexOf(String.fromCharCode(c),i);
 };
 Strings.IsNullOrWhiteSpace=function(x)
 {
  return x==null||(new Global.RegExp("^\\s*$")).test(x);
 };
 Strings.IsNullOrEmpty=function(x)
 {
  return x==null||x=="";
 };
 Strings.Insert=function(x,index,s)
 {
  return x.substring(0,index-1)+s+x.substring(index);
 };
 Strings.IndexOf=function(s,c,i)
 {
  return s.indexOf(String.fromCharCode(c),i);
 };
 Strings.EndsWith=function(x,s)
 {
  return x.substring(x.length-s.length)==s;
 };
 Strings.collect=function(f,s)
 {
  return Arrays.init(s.length,function(i)
  {
   return f(s.charCodeAt(i));
  }).join("");
 };
 Strings.concat=function(separator,strings)
 {
  return Arrays.ofSeq(strings).join(separator);
 };
 Strings.exists=function(f,s)
 {
  return Seq.exists(f,Strings.protect(s));
 };
 Strings.forall=function(f,s)
 {
  return Seq.forall(f,Strings.protect(s));
 };
 Strings.init=function(count,f)
 {
  return Arrays.init(count,f).join("");
 };
 Strings.iter=function(f,s)
 {
  Seq.iter(f,Strings.protect(s));
 };
 Strings.iteri=function(f,s)
 {
  Seq.iteri(f,Strings.protect(s));
 };
 Strings.length=function(s)
 {
  return Strings.protect(s).length;
 };
 Strings.map=function(f,s)
 {
  return Strings.collect(function(x)
  {
   return String.fromCharCode(f(x));
  },Strings.protect(s));
 };
 Strings.mapi=function(f,s)
 {
  return Arrays.ofSeq(Seq.mapi(function($1,$2)
  {
   return String.fromCharCode(f($1,$2));
  },s)).join("");
 };
 Strings.replicate=function(count,s)
 {
  return Strings.init(count,function()
  {
   return s;
  });
 };
 Strings.protect=function(s)
 {
  return s===null?"":s;
 };
 Strings.SFormat=function(format,args)
 {
  return format.replace(new Global.RegExp("{(0|[1-9]\\d*)(?:,(-?[1-9]\\d*|0))?(?::(.*?))?}","g"),function($1,$2,w)
  {
   var r,w1,w2;
   r=String(Arrays.get(args,+$2));
   return!Unchecked.Equals(w,void 0)?(w1=+w,(w2=Math.abs(w1),w2>r.length?w1>0?Strings.PadLeft(r,w2):Strings.PadRight(r,w2):r)):r;
  });
 };
 Strings.Filter=function(f,s)
 {
  return Arrays.ofSeq(Seq.choose(function(c)
  {
   return f(c)?{
    $:1,
    $0:String.fromCharCode(c)
   }:null;
  },s)).join("");
 };
 Strings.SplitStrings=function(s,sep,opts)
 {
  return Strings.Split(s,new Global.RegExp(Strings.concat("|",Arrays.map(Strings.RegexEscape,sep))),opts);
 };
 Strings.SplitChars=function(s,sep,opts)
 {
  return Strings.Split(s,new Global.RegExp("["+Strings.RegexEscape(String.fromCharCode.apply(void 0,sep))+"]"),opts);
 };
 Strings.Split=function(s,pat,opts)
 {
  return opts===1?Arrays.filter(function(x)
  {
   return x!=="";
  },Strings.SplitWith(s,pat)):Strings.SplitWith(s,pat);
 };
 Strings.TrimEnd=function(s,t)
 {
  var i,go;
  if(Unchecked.Equals(t,null)||t.length==0)
   return Strings.TrimEndWS(s);
  else
   {
    i=s.length-1;
    go=true;
    while(i>=0&&go)
     (function()
     {
      var c;
      c=s.charCodeAt(i);
      return Arrays.exists(function(y)
      {
       return c===y;
      },t)?void(i=i-1):void(go=false);
     }());
    return Strings.Substring(s,0,i+1);
   }
 };
 Strings.TrimStart=function(s,t)
 {
  var i,go;
  if(Unchecked.Equals(t,null)||t.length==0)
   return Strings.TrimStartWS(s);
  else
   {
    i=0;
    go=true;
    while(i<s.length&&go)
     (function()
     {
      var c;
      c=s.charCodeAt(i);
      return Arrays.exists(function(y)
      {
       return c===y;
      },t)?void(i=i+1):void(go=false);
     }());
    return s.substring(i);
   }
 };
 Strings.ToCharArrayRange=function(s,startIndex,length)
 {
  return Arrays.init(length,function(i)
  {
   return s.charCodeAt(startIndex+i);
  });
 };
 Strings.ToCharArray=function(s)
 {
  return Arrays.init(s.length,function(x)
  {
   return s.charCodeAt(x);
  });
 };
 Strings.ReplaceChar=function(s,oldC,newC)
 {
  return Strings.Replace(s,String.fromCharCode(oldC),String.fromCharCode(newC));
 };
 Strings.Replace=function(subject,search,replace)
 {
  function replaceLoop(subj)
  {
   var index,replaced,nextStartIndex;
   index=subj.indexOf(search);
   return index!==-1?(replaced=Strings.ReplaceOnce(subj,search,replace),(nextStartIndex=index+replace.length,Strings.Substring(replaced,0,index+replace.length)+replaceLoop(replaced.substring(nextStartIndex)))):subj;
  }
  return replaceLoop(subject);
 };
 Strings.PadRight=function(s,n)
 {
  return Strings.PadRightWith(s,n,32);
 };
 Strings.PadLeft=function(s,n)
 {
  return Strings.PadLeftWith(s,n,32);
 };
 Strings.CopyTo=function(s,o,d,off,ct)
 {
  Arrays.blit(Strings.ToCharArray(s),o,d,off,ct);
 };
 Strings.Compare=function(x,y)
 {
  return Unchecked.Compare(x,y);
 };
 Task=WebSharper.Task=Runtime.Class({
  Execute:function()
  {
   this.action();
  },
  Start:function()
  {
   var $this;
   $this=this;
   Unchecked.Equals(this.status,0)?(this.status=2,Concurrency.scheduler().Fork(function()
   {
    var $1;
    $this.status=3;
    try
    {
     $this.Execute();
     $this.status=5;
    }
    catch(m)
    {
     m instanceof OperationCanceledException&&(Unchecked.Equals(m.ct,$this.token)&&($1=m,true))?(console.log("Task cancellation caught:",$1),$this.exc=new AggregateException.New$3([$1]),$this.status=6):(console.log("Task error caught:",m),$this.exc=new AggregateException.New$3([m]),$this.status=7);
    }
    $this.RunContinuations();
   })):Operators.InvalidOp("Task not in initial state");
  },
  StartContinuation:function()
  {
   var $this;
   $this=this;
   Unchecked.Equals(this.status,1)?(this.status=2,Concurrency.scheduler().Fork(function()
   {
    if(Unchecked.Equals($this.status,2))
     {
      $this.status=3;
      try
      {
       $this.Execute();
       $this.status=5;
      }
      catch(e)
      {
       $this.exc=new AggregateException.New$3([e]);
       $this.status=7;
      }
      $this.RunContinuations();
     }
   })):void 0;
  },
  ContinueWith:function(func,ct)
  {
   var $this,res;
   $this=this;
   res=new Task1.New(function()
   {
    return func($this);
   },ct,1,null,void 0);
   this.get_IsCompleted()?res.StartContinuation():this.continuations.push(res);
   return res;
  },
  ContinueWith$1:function(action,ct)
  {
   var $this,res;
   $this=this;
   res=new Task.New$2(function()
   {
    return action($this);
   },ct,1,null);
   this.get_IsCompleted()?res.StartContinuation():this.continuations.push(res);
   return res;
  },
  ContinueWith$2:function(action)
  {
   return this.ContinueWith$1(action,Concurrency.noneCT());
  },
  RunContinuations:function()
  {
   var a,i,$1;
   a=this.continuations;
   for(i=0,$1=a.length-1;i<=$1;i++)Arrays.get(a,i).StartContinuation();
  },
  OnCompleted:function(cont)
  {
   if(this.get_IsCompleted())
    cont();
   else
    {
     Unchecked.Equals(this.get_Status(),0)?this.Start():void 0;
     this.ContinueWith$2(function()
     {
      return cont();
     });
    }
  },
  get_Status:function()
  {
   return this.status;
  },
  get_IsFaulted:function()
  {
   return Unchecked.Equals(this.status,7);
  },
  get_IsCompleted:function()
  {
   return Unchecked.Equals(this.status,5)||Unchecked.Equals(this.status,7)||Unchecked.Equals(this.status,6);
  },
  get_IsCanceled:function()
  {
   return Unchecked.Equals(this.status,6);
  },
  get_Exception:function()
  {
   return this.exc;
  }
 },null,Task);
 Task.WhenAll=function(tasks)
 {
  var target,completed,results,tcs,i,$1;
  target=Arrays.length(tasks);
  completed=[0];
  results=new Global.Array(target);
  tcs=new TaskCompletionSource.New();
  for(i=0,$1=target-1;i<=$1;i++)(function(i$1)
  {
   Arrays.get(tasks,i).ContinueWith$2(function(t)
   {
    return t.get_IsFaulted()?void tcs.TrySetException$1(t.get_Exception()):t.get_IsCanceled()?void tcs.TrySetCanceled$1():(completed[0]++,results[i$1]=t.get_Result(),completed[0]===target?tcs.SetResult(results):null);
   });
  }(i));
  return tcs.get_Task();
 };
 Task.WhenAll$1=function(tasks)
 {
  var target,completed,tcs,i,$1;
  target=Arrays.length(tasks);
  completed=[0];
  tcs=new TaskCompletionSource.New();
  for(i=0,$1=target-1;i<=$1;i++)Arrays.get(tasks,i).ContinueWith$2(function(t)
  {
   return t.get_IsFaulted()?void tcs.TrySetException$1(t.get_Exception()):t.get_IsCanceled()?void tcs.TrySetCanceled$1():(completed[0]++,completed[0]===target?void tcs.TrySetResult():null);
  });
  return tcs.get_Task();
 };
 Task.WhenAny=function(tasks)
 {
  var tcs,i,$1;
  tcs=new TaskCompletionSource.New();
  for(i=0,$1=tasks.length-1;i<=$1;i++)Arrays.get(tasks,i).ContinueWith(function(t)
  {
   tcs.TrySetResult(t);
  },Concurrency.noneCT());
  return tcs.get_Task();
 };
 Task.WhenAny$1=function(tasks)
 {
  var tcs,i,$1;
  tcs=new TaskCompletionSource.New();
  for(i=0,$1=tasks.length-1;i<=$1;i++)Arrays.get(tasks,i).ContinueWith$2(function(t)
  {
   tcs.TrySetResult(t);
  });
  return tcs.get_Task();
 };
 Task.Delay=function(time,ct)
 {
  return Concurrency.StartAsTask(Concurrency.Sleep(time),{
   $:1,
   $0:ct
  });
 };
 Task.Delay$1=function(time)
 {
  return Concurrency.StartAsTask(Concurrency.Sleep(time),null);
 };
 Task.Run=function(func,ct)
 {
  var task;
  task=func();
  return ct.c?Task.FromCanceled(ct):(Unchecked.Equals(task.get_Status(),0)?task.Start():void 0,task);
 };
 Task.Run$1=function(func,ct)
 {
  var res;
  res=new Task1.New(func,ct,0,null,void 0);
  res.Start();
  return res;
 };
 Task.Run$2=function(func,ct)
 {
  var task;
  task=func();
  return ct.c?Task.FromCanceled$1(ct):(Unchecked.Equals(task.get_Status(),0)?task.Start():void 0,task);
 };
 Task.Run$3=function(action,ct)
 {
  var res;
  res=new Task.New$2(action,ct,0,null);
  res.Start();
  return res;
 };
 Task.FromResult=function(res)
 {
  return new Task1.New(null,Concurrency.noneCT(),5,null,res);
 };
 Task.FromException=function(exc)
 {
  return new Task1.New(null,Concurrency.noneCT(),7,new AggregateException.New$3([exc]),null);
 };
 Task.FromException$1=function(exc)
 {
  return new Task.New$2(null,Concurrency.noneCT(),7,new AggregateException.New$3([exc]));
 };
 Task.FromCanceled=function(ct)
 {
  return new Task1.New(null,ct,6,null,null);
 };
 Task.FromCanceled$1=function(ct)
 {
  return new Task.New$2(null,ct,6,null);
 };
 Task.New=Runtime.Ctor(function(action,ct)
 {
  Task.New$2.call(this,action,ct,0,null);
 },Task);
 Task.New$1=Runtime.Ctor(function(action)
 {
  Task.New$2.call(this,action,Concurrency.noneCT(),0,null);
 },Task);
 Task.New$2=Runtime.Ctor(function(action,token,status,exc)
 {
  this.action=action;
  this.token=token;
  this.status=status;
  this.continuations=[];
  this.exc=exc;
 },Task);
 Task1=WebSharper.Task1=Runtime.Class({
  get_Result:function()
  {
   return this.result;
  },
  Execute:function()
  {
   this.result=this.func();
  }
 },Task,Task1);
 Task1.New=Runtime.Ctor(function(func,token,status,exc,result)
 {
  Task.New$2.call(this,null,token,status,exc);
  this.func=func;
  this.result=result;
 },Task1);
 TaskCompletionSource=WebSharper.TaskCompletionSource=Runtime.Class({
  TrySetResult:function(res)
  {
   return!this.task.get_IsCompleted()&&(this.task.status=5,this.task.result=res,this.task.RunContinuations(),true);
  },
  TrySetException:function(exs)
  {
   return this.TrySetException$1(new AggregateException.New$2(exs));
  },
  TrySetException$1:function(exc)
  {
   return!this.task.get_IsCompleted()&&(this.task.status=7,this.task.exc=new AggregateException.New$3([exc]),this.task.RunContinuations(),true);
  },
  TrySetCanceled:function(ct)
  {
   return!this.task.get_IsCompleted()&&(this.task.status=6,this.task.RunContinuations(),true);
  },
  TrySetCanceled$1:function()
  {
   return!this.task.get_IsCompleted()&&(this.task.status=6,this.task.RunContinuations(),true);
  },
  SetResult:function(res)
  {
   this.task.get_IsCompleted()?Operators.FailWith("Task already completed."):void 0;
   this.task.status=5;
   this.task.result=res;
   this.task.RunContinuations();
  },
  SetException:function(exs)
  {
   this.SetException$1(new AggregateException.New$2(exs));
  },
  SetException$1:function(exc)
  {
   this.task.get_IsCompleted()?Operators.FailWith("Task already completed."):void 0;
   this.task.status=7;
   this.task.exc=new AggregateException.New$3([exc]);
   this.task.RunContinuations();
  },
  SetCanceled:function()
  {
   this.task.get_IsCompleted()?Operators.FailWith("Task already completed."):void 0;
   this.task.status=6;
   this.task.RunContinuations();
  },
  get_Task:function()
  {
   return this.task;
  }
 },null,TaskCompletionSource);
 TaskCompletionSource.New=Runtime.Ctor(function()
 {
  this.task=new Task1.New(null,Concurrency.noneCT(),1,null,void 0);
 },TaskCompletionSource);
 Unchecked.Hash=function(o)
 {
  var m;
  m=typeof o;
  return m=="function"?0:m=="boolean"?o?1:0:m=="number"?o:m=="string"?Unchecked.hashString(o):m=="object"?o==null?0:o instanceof Global.Array?Unchecked.hashArray(o):Unchecked.hashObject(o):0;
 };
 Unchecked.hashObject=function(o)
 {
  var h,k;
  if("GetHashCode"in o)
   return o.GetHashCode();
  else
   {
    h=[0];
    for(var k$1 in o)if(function(key)
    {
     h[0]=Unchecked.hashMix(Unchecked.hashMix(h[0],Unchecked.hashString(key)),Unchecked.Hash(o[key]));
     return false;
    }(k$1))
     break;
    return h[0];
   }
 };
 Unchecked.hashString=function(s)
 {
  var hash,i,$1;
  if(s===null)
   return 0;
  else
   {
    hash=5381;
    for(i=0,$1=s.length-1;i<=$1;i++)hash=Unchecked.hashMix(hash,s.charCodeAt(i)<<0);
    return hash;
   }
 };
 Unchecked.hashArray=function(o)
 {
  var h,i,$1;
  h=-34948909;
  for(i=0,$1=Arrays.length(o)-1;i<=$1;i++)h=Unchecked.hashMix(h,Unchecked.Hash(Arrays.get(o,i)));
  return h;
 };
 Unchecked.hashMix=function(x,y)
 {
  return(x<<5)+x+y;
 };
 Unchecked.Equals=function(a,b)
 {
  var m,eqR,k,k$1;
  if(a===b)
   return true;
  else
   {
    m=typeof a;
    if(m=="object")
    {
     if(a===null||a===void 0||b===null||b===void 0)
      return false;
     else
      if("Equals"in a)
       return a.Equals(b);
      else
       if(a instanceof Global.Array&&b instanceof Global.Array)
        return Unchecked.arrayEquals(a,b);
       else
        if(a instanceof Date&&b instanceof Date)
         return Unchecked.dateEquals(a,b);
        else
         {
          eqR=[true];
          for(var k$2 in a)if(function(k$3)
          {
           eqR[0]=!a.hasOwnProperty(k$3)||b.hasOwnProperty(k$3)&&Unchecked.Equals(a[k$3],b[k$3]);
           return!eqR[0];
          }(k$2))
           break;
          if(eqR[0])
           {
            for(var k$3 in b)if(function(k$4)
            {
             eqR[0]=!b.hasOwnProperty(k$4)||a.hasOwnProperty(k$4);
             return!eqR[0];
            }(k$3))
             break;
           }
          return eqR[0];
         }
    }
    else
     return m=="function"&&("$Func"in a?a.$Func===b.$Func&&a.$Target===b.$Target:"$Invokes"in a&&"$Invokes"in b&&Unchecked.arrayEquals(a.$Invokes,b.$Invokes));
   }
 };
 Unchecked.dateEquals=function(a,b)
 {
  return a.getTime()===b.getTime();
 };
 Unchecked.arrayEquals=function(a,b)
 {
  var eq,i;
  if(Arrays.length(a)===Arrays.length(b))
   {
    eq=true;
    i=0;
    while(eq&&i<Arrays.length(a))
     {
      !Unchecked.Equals(Arrays.get(a,i),Arrays.get(b,i))?eq=false:void 0;
      i=i+1;
     }
    return eq;
   }
  else
   return false;
 };
 Unchecked.Compare=function(a,b)
 {
  var $1,m,$2,cmp,k,k$1;
  if(a===b)
   return 0;
  else
   {
    m=typeof a;
    switch(m=="function"?1:m=="boolean"?2:m=="number"?2:m=="string"?2:m=="object"?3:0)
    {
     case 0:
      return typeof b=="undefined"?0:-1;
      break;
     case 1:
      return Operators.FailWith("Cannot compare function values.");
      break;
     case 2:
      return a<b?-1:1;
      break;
     case 3:
      if(a===null)
       $2=-1;
      else
       if(b===null)
        $2=1;
       else
        if("CompareTo"in a)
         $2=a.CompareTo(b);
        else
         if("CompareTo0"in a)
          $2=a.CompareTo0(b);
         else
          if(a instanceof Global.Array&&b instanceof Global.Array)
           $2=Unchecked.compareArrays(a,b);
          else
           if(a instanceof Date&&b instanceof Date)
            $2=Unchecked.compareDates(a,b);
           else
            {
             cmp=[0];
             for(var k$2 in a)if(function(k$3)
             {
              return!a.hasOwnProperty(k$3)?false:!b.hasOwnProperty(k$3)?(cmp[0]=1,true):(cmp[0]=Unchecked.Compare(a[k$3],b[k$3]),cmp[0]!==0);
             }(k$2))
              break;
             if(cmp[0]===0)
              {
               for(var k$3 in b)if(function(k$4)
               {
                return!b.hasOwnProperty(k$4)?false:!a.hasOwnProperty(k$4)&&(cmp[0]=-1,true);
               }(k$3))
                break;
              }
             $2=cmp[0];
            }
      return $2;
      break;
    }
   }
 };
 Unchecked.compareDates=function(a,b)
 {
  return Unchecked.Compare(a.getTime(),b.getTime());
 };
 Unchecked.compareArrays=function(a,b)
 {
  var cmp,i;
  if(Arrays.length(a)<Arrays.length(b))
   return -1;
  else
   if(Arrays.length(a)>Arrays.length(b))
    return 1;
   else
    {
     cmp=0;
     i=0;
     while(cmp===0&&i<Arrays.length(a))
      {
       cmp=Unchecked.Compare(Arrays.get(a,i),Arrays.get(b,i));
       i=i+1;
      }
     return cmp;
    }
 };
 Numeric.TryParse=function(s,min,max,r)
 {
  var x,ok;
  x=+s;
  ok=x===x-x%1&&x>=min&&x<=max;
  ok?r.set(x):void 0;
  return ok;
 };
 Numeric.Parse=function(s,min,max,overflowMsg)
 {
  var x;
  x=+s;
  if(x!==x-x%1)
   throw new FormatException.New$1("Input string was not in a correct format.");
  else
   if(x<min||x>max)
    throw new OverflowException.New$1(overflowMsg);
   else
    return x;
 };
 Numeric.ParseByte=function(s)
 {
  return Numeric.Parse(s,0,255,"Value was either too large or too small for an unsigned byte.");
 };
 Numeric.TryParseByte=function(s,r)
 {
  return Numeric.TryParse(s,0,255,r);
 };
 Numeric.ParseSByte=function(s)
 {
  return Numeric.Parse(s,-128,127,"Value was either too large or too small for a signed byte.");
 };
 Numeric.TryParseSByte=function(s,r)
 {
  return Numeric.TryParse(s,-128,127,r);
 };
 Numeric.ParseInt16=function(s)
 {
  return Numeric.Parse(s,-32768,32767,"Value was either too large or too small for an Int16.");
 };
 Numeric.TryParseInt16=function(s,r)
 {
  return Numeric.TryParse(s,-32768,32767,r);
 };
 Numeric.ParseInt32=function(s)
 {
  return Numeric.Parse(s,-2147483648,2147483647,"Value was either too large or too small for an Int32.");
 };
 Numeric.TryParseInt32=function(s,r)
 {
  return Numeric.TryParse(s,-2147483648,2147483647,r);
 };
 Numeric.ParseUInt16=function(s)
 {
  return Numeric.Parse(s,0,65535,"Value was either too large or too small for an UInt16.");
 };
 Numeric.TryParseUInt16=function(s,r)
 {
  return Numeric.TryParse(s,0,65535,r);
 };
 Numeric.ParseUInt32=function(s)
 {
  return Numeric.Parse(s,0,4294967295,"Value was either too large or too small for an UInt32.");
 };
 Numeric.TryParseUInt32=function(s,r)
 {
  return Numeric.TryParse(s,0,4294967295,r);
 };
 Numeric.ParseInt64=function(s)
 {
  return Numeric.Parse(s,-9223372036854775808,9223372036854775807,"Value was either too large or too small for an Int64.");
 };
 Numeric.TryParseInt64=function(s,r)
 {
  return Numeric.TryParse(s,-9223372036854775808,9223372036854775807,r);
 };
 Numeric.ParseUInt64=function(s)
 {
  return Numeric.Parse(s,0,18446744073709551615,"Value was either too large or too small for an UInt64.");
 };
 Numeric.TryParseUInt64=function(s,r)
 {
  return Numeric.TryParse(s,0,18446744073709551615,r);
 };
 Provider.DecodeStringDictionary=Runtime.Curried3(function(decEl,$1,o)
 {
  var d,decEl$1,k;
  d=new Dictionary.New$5();
  decEl$1=decEl();
  for(var k$1 in o)if(function(k$2)
  {
   d.Add(k$2,decEl$1(o[k$2]));
   return false;
  }(k$1))
   break;
  return d;
 });
 Provider.DecodeStringMap=Runtime.Curried3(function(decEl,$1,o)
 {
  var m,decEl$1,k;
  m=[new FSharpMap.New([])];
  decEl$1=decEl();
  for(var k$1 in o)if(function(k$2)
  {
   var v;
   m[0]=(v=decEl$1(o[k$2]),m[0].Add(k$2,v));
   return false;
  }(k$1))
   break;
  return m[0];
 });
 Provider.DecodeArray=function(decEl)
 {
  return Provider.EncodeArray(decEl);
 };
 Provider.DecodeUnion=function(t,discr,cases)
 {
  return function()
  {
   return function(x)
   {
    var tag,tagName,o,r,k;
    function p(name,a$1)
    {
     return name===tagName;
    }
    function a(from,to,dec,kind)
    {
     var r$1;
     if(from===null)
      {
       r$1=(dec(null))(x);
       to?delete r$1[discr]:void 0;
       o.$0=r$1;
      }
     else
      if(Unchecked.Equals(kind,0))
       o[from]=(dec(null))(x[to]);
      else
       if(Unchecked.Equals(kind,1))
        o[from]=x.hasOwnProperty(to)?{
         $:1,
         $0:(dec(null))(x[to])
        }:null;
       else
        Operators.FailWith("Invalid field option kind");
    }
    if(typeof x==="object"&&x!=null)
     {
      o=t===void 0?{}:new t();
      if(Unchecked.Equals(typeof discr,"string"))
       tag=(tagName=x[discr],Arrays.findIndex(function($1)
       {
        return p($1[0],$1[1]);
       },cases));
      else
       {
        r=[void 0];
        for(var k$1 in discr)if(function(k$2)
        {
         return x.hasOwnProperty(k$2)&&(r[0]=discr[k$2],true);
        }(k$1))
         break;
        tag=r[0];
       }
      o.$=tag;
      Arrays.iter(function($1)
      {
       return a($1[0],$1[1],$1[2],$1[3]);
      },(Arrays.get(cases,tag))[1]);
      return o;
     }
    else
     return x;
   };
  };
 };
 Provider.DecodeRecord=function(t,fields)
 {
  return function()
  {
   return function(x)
   {
    var o;
    function a(name,dec,kind)
    {
     if(Unchecked.Equals(kind,0))
     {
      if(x.hasOwnProperty(name))
       o[name]=(dec(null))(x[name]);
      else
       Operators.FailWith("Missing mandatory field: "+name);
     }
     else
      if(Unchecked.Equals(kind,1))
       o[name]=x.hasOwnProperty(name)?{
        $:1,
        $0:(dec(null))(x[name])
       }:null;
      else
       if(Unchecked.Equals(kind,2))
       {
        if(x.hasOwnProperty(name))
         o[name]=(dec(null))(x[name]);
       }
       else
        Operators.FailWith("Invalid field option kind");
    }
    o=t===void 0?{}:new t();
    Arrays.iter(function($1)
    {
     return a($1[0],$1[1],$1[2]);
    },fields);
    return o;
   };
  };
 };
 Provider.DecodeSet=Runtime.Curried3(function(decEl,$1,a)
 {
  return new FSharpSet.New$1(BalancedTree.OfSeq(Arrays.map(decEl(),a)));
 });
 Provider.DecodeList=Runtime.Curried3(function(decEl,$1,a)
 {
  var e;
  e=decEl();
  return List$1.init(Arrays.length(a),function(i)
  {
   return e(Arrays.get(a,i));
  });
 });
 Provider.DecodeDateTime=Runtime.Curried3(function($1,$2,x)
 {
  return(new Date(x)).getTime();
 });
 Provider.DecodeTuple=function(decs)
 {
  return Provider.EncodeTuple(decs);
 };
 Provider.EncodeStringDictionary=Runtime.Curried3(function(encEl,$1,d)
 {
  var o,e,e$1,a;
  o={};
  e=encEl();
  e$1=Enumerator.Get(d);
  try
  {
   while(e$1.MoveNext())
    {
     a=Operators.KeyValue(e$1.Current());
     o[a[0]]=e(a[1]);
    }
  }
  finally
  {
   if("Dispose"in e$1)
    e$1.Dispose();
  }
  return o;
 });
 Provider.EncodeStringMap=Runtime.Curried3(function(encEl,$1,m)
 {
  var o,e;
  o={};
  e=encEl();
  Map.Iterate(function(k,v)
  {
   o[k]=e(v);
  },m);
  return o;
 });
 Provider.EncodeSet=Runtime.Curried3(function(encEl,$1,s)
 {
  var a,e;
  a=[];
  e=encEl();
  Seq.iter(function(x)
  {
   a.push(e(x));
  },s);
  return a;
 });
 Provider.EncodeArray=Runtime.Curried3(function(encEl,$1,a)
 {
  return Arrays.map(encEl(),a);
 });
 Provider.EncodeUnion=function(a,discr,cases)
 {
  return function()
  {
   return function(x)
   {
    var o,p;
    function a$1(from,to,enc,kind)
    {
     var record,k,m;
     if(from===null)
      {
       record=(enc(null))(x.$0);
       for(var k$1 in record)if(function(f)
       {
        o[f]=record[f];
        return false;
       }(k$1))
        break;
      }
     else
      if(Unchecked.Equals(kind,0))
       o[to]=(enc(null))(x[from]);
      else
       if(Unchecked.Equals(kind,1))
        {
         m=x[from];
         m==null?void 0:o[to]=(enc(null))(m.$0);
        }
       else
        Operators.FailWith("Invalid field option kind");
    }
    return typeof x==="object"&&x!=null?(o={},(p=Arrays.get(cases,x.$),(Unchecked.Equals(typeof discr,"string")?o[discr]=p[0]:void 0,Arrays.iter(function($1)
    {
     return a$1($1[0],$1[1],$1[2],$1[3]);
    },p[1]),o))):x;
   };
  };
 };
 Provider.EncodeRecord=function(a,fields)
 {
  return function()
  {
   return function(x)
   {
    var o;
    function a$1(name,enc,kind)
    {
     var m;
     if(Unchecked.Equals(kind,0))
      o[name]=(enc(null))(x[name]);
     else
      if(Unchecked.Equals(kind,1))
       {
        m=x[name];
        m==null?void 0:o[name]=(enc(null))(m.$0);
       }
      else
       if(Unchecked.Equals(kind,2))
       {
        if(x.hasOwnProperty(name))
         o[name]=(enc(null))(x[name]);
       }
       else
        Operators.FailWith("Invalid field option kind");
    }
    o={};
    Arrays.iter(function($1)
    {
     return a$1($1[0],$1[1],$1[2]);
    },fields);
    return o;
   };
  };
 };
 Provider.EncodeList=Runtime.Curried3(function(encEl,$1,l)
 {
  var a,e;
  a=[];
  e=encEl();
  List$1.iter(function(x)
  {
   a.push(e(x));
  },l);
  return a;
 });
 Provider.EncodeDateTime=Runtime.Curried3(function($1,$2,x)
 {
  return(new Date(x)).toISOString();
 });
 Provider.EncodeTuple=Runtime.Curried3(function(encs,$1,args)
 {
  return Arrays.map2(function($2,$3)
  {
   return($2(null))($3);
  },encs,args);
 });
 Provider.Id=Runtime.Curried3(function($1,$2,x)
 {
  return x;
 });
 Control$2=Web.Control=Runtime.Class({
  Body:function()
  {
   return this.get_Body();
  }
 },null,Control$2);
 FSharpInlineControl=Web.FSharpInlineControl=Runtime.Class({
  get_Body:function()
  {
   return Arrays.fold(function($1,$2)
   {
    return $1[$2];
   },Global,this.funcName).apply(null,this.args);
  }
 },Control$2,FSharpInlineControl);
 InlineControl=Web.InlineControl=Runtime.Class({
  get_Body:function()
  {
   return Arrays.fold(function($1,$2)
   {
    return $1[$2];
   },Global,this.funcName).apply(null,this.args);
  }
 },Control$2,InlineControl);
 Runtime.OnLoad(function()
 {
  Client.Main();
 });
}());


if (typeof IntelliFactory !=='undefined')
  IntelliFactory.Runtime.Start();
