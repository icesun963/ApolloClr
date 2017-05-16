
//  Microsoft (R) .NET Framework IL Disassembler.  Version 4.6.1055.0
//  Copyright (c) Microsoft Corporation.  All rights reserved.



// Metadata version: v4.0.30319
.assembly extern mscorlib
{
  .publickeytoken = (B7 7A 5C 56 19 34 E0 89 )                         // .z\V.4..
  .ver 4:0:0:0
}
.assembly extern System
{
  .publickeytoken = (B7 7A 5C 56 19 34 E0 89 )                         // .z\V.4..
  .ver 4:0:0:0
}
.assembly TestLib
{
  .custom instance void [mscorlib]System.Runtime.CompilerServices.CompilationRelaxationsAttribute::.ctor(int32) = ( 01 00 08 00 00 00 00 00 ) 
  .custom instance void [mscorlib]System.Runtime.CompilerServices.RuntimeCompatibilityAttribute::.ctor() = ( 01 00 01 00 54 02 16 57 72 61 70 4E 6F 6E 45 78   // ....T..WrapNonEx
                                                                                                             63 65 70 74 69 6F 6E 54 68 72 6F 77 73 01 )       // ceptionThrows.

  // 
  //  .custom instance void [mscorlib]System.Diagnostics.DebuggableAttribute::.ctor(valuetype [mscorlib]System.Diagnostics.DebuggableAttribute/DebuggingModes) = ( 01 00 07 01 00 00 00 00 ) 

  .custom instance void [mscorlib]System.Reflection.AssemblyTitleAttribute::.ctor(string) = ( 01 00 07 54 65 73 74 4C 69 62 00 00 )             // ...TestLib..
  .custom instance void [mscorlib]System.Reflection.AssemblyDescriptionAttribute::.ctor(string) = ( 01 00 00 00 00 ) 
  .custom instance void [mscorlib]System.Reflection.AssemblyConfigurationAttribute::.ctor(string) = ( 01 00 00 00 00 ) 
  .custom instance void [mscorlib]System.Reflection.AssemblyCompanyAttribute::.ctor(string) = ( 01 00 00 00 00 ) 
  .custom instance void [mscorlib]System.Reflection.AssemblyProductAttribute::.ctor(string) = ( 01 00 07 54 65 73 74 4C 69 62 00 00 )             // ...TestLib..
  .custom instance void [mscorlib]System.Reflection.AssemblyCopyrightAttribute::.ctor(string) = ( 01 00 12 43 6F 70 79 72 69 67 68 74 20 C2 A9 20   // ...Copyright .. 
                                                                                                  20 32 30 31 37 00 00 )                            //  2017..
  .custom instance void [mscorlib]System.Reflection.AssemblyTrademarkAttribute::.ctor(string) = ( 01 00 00 00 00 ) 
  .custom instance void [mscorlib]System.Runtime.InteropServices.ComVisibleAttribute::.ctor(bool) = ( 01 00 00 00 00 ) 
  .custom instance void [mscorlib]System.Runtime.InteropServices.GuidAttribute::.ctor(string) = ( 01 00 24 63 39 66 64 36 36 63 38 2D 38 61 63 33   // ..$c9fd66c8-8ac3
                                                                                                  2D 34 63 39 64 2D 38 34 37 65 2D 30 30 36 36 33   // -4c9d-847e-00663
                                                                                                  64 38 63 62 39 37 30 00 00 )                      // d8cb970..
  .custom instance void [mscorlib]System.Reflection.AssemblyFileVersionAttribute::.ctor(string) = ( 01 00 07 31 2E 30 2E 30 2E 30 00 00 )             // ...1.0.0.0..
  .custom instance void [mscorlib]System.Runtime.Versioning.TargetFrameworkAttribute::.ctor(string) = ( 01 00 1A 2E 4E 45 54 46 72 61 6D 65 77 6F 72 6B   // ....NETFramework
                                                                                                        2C 56 65 72 73 69 6F 6E 3D 76 34 2E 35 01 00 54   // ,Version=v4.5..T
                                                                                                        0E 14 46 72 61 6D 65 77 6F 72 6B 44 69 73 70 6C   // ..FrameworkDispl
                                                                                                        61 79 4E 61 6D 65 12 2E 4E 45 54 20 46 72 61 6D   // ayName..NET Fram
                                                                                                        65 77 6F 72 6B 20 34 2E 35 )                      // ework 4.5
  .permissionset reqmin
             = {[mscorlib]System.Security.Permissions.SecurityPermissionAttribute = {property bool 'SkipVerification' = bool(true)}}
  .hash algorithm 0x00008004
  .ver 1:0:0:0
}
.module TestLib.dll
// MVID: {FF5863BF-5F12-495B-92AA-F37D036A5DB4}
.custom instance void [mscorlib]System.Security.UnverifiableCodeAttribute::.ctor() = ( 01 00 00 00 ) 
.imagebase 0x10000000
.file alignment 0x00000200
.stackreserve 0x00100000
.subsystem 0x0003       // WINDOWS_CUI
.corflags 0x00000001    //  ILONLY
// Image base: 0x00840000


// =============== CLASS MEMBERS DECLARATION ===================

.class public auto ansi beforefieldinit TestLib.Test
       extends [mscorlib]System.Object
{
  .method public hidebysig static float32 
          RunF1() cil managed
  {
    // 
    .maxstack  2
    .locals init ([0] class [System]System.Diagnostics.Stopwatch sw,
             [1] float64 xxx,
             [2] int32 i,
             [3] bool V_3,
             [4] float32 V_4)
    IL_0000:  nop
    IL_0001:  newobj     instance void [System]System.Diagnostics.Stopwatch::.ctor()
    IL_0006:  stloc.0
    IL_0007:  ldloc.0
    IL_0008:  callvirt   instance void [System]System.Diagnostics.Stopwatch::Start()
    IL_000d:  nop
    IL_000e:  ldc.r8     -22.
    IL_0017:  stloc.1
    IL_0018:  ldc.i4.0
    IL_0019:  stloc.2
    IL_001a:  br.s       IL_0028

    IL_001c:  nop
    IL_001d:  call       int32 TestLib.Test::Run1()
    IL_0022:  pop
    IL_0023:  nop
    IL_0024:  ldloc.2
    IL_0025:  ldc.i4.1
    IL_0026:  add
    IL_0027:  stloc.2
    IL_0028:  ldloc.2
    IL_0029:  ldc.i4     0x186a0
    IL_002e:  clt
    IL_0030:  stloc.3
    IL_0031:  ldloc.3
    IL_0032:  brtrue.s   IL_001c

    IL_0034:  ldloc.1
    IL_0035:  call       void [mscorlib]System.Console::WriteLine(float64)
    IL_003a:  nop
    IL_003b:  ldloc.0
    IL_003c:  callvirt   instance void [System]System.Diagnostics.Stopwatch::Stop()
    IL_0041:  nop
    IL_0042:  ldloc.0
    IL_0043:  callvirt   instance void [System]System.Diagnostics.Stopwatch::Stop()
    IL_0048:  nop
    IL_0049:  ldloc.0
    IL_004a:  callvirt   instance int64 [System]System.Diagnostics.Stopwatch::get_ElapsedMilliseconds()
    IL_004f:  call       void [mscorlib]System.Console::WriteLine(int64)
    IL_0054:  nop
    IL_0055:  ldloc.1
    IL_0056:  conv.r4
    IL_0057:  stloc.s    V_4
    IL_0059:  br.s       IL_005b

    IL_005b:  ldloc.s    V_4
    IL_005d:  ret
  } // end of method Test::RunF1

  .method public hidebysig static int32  Run1() cil managed
  {
    // 
    .maxstack  2
    .locals init ([0] int32 i,
             [1] int32 j,
             [2] int32 k,
             [3] int32 answer,
             [4] int32 V_4)
    IL_0000:  nop
    IL_0001:  ldc.i4.1
    IL_0002:  stloc.0
    IL_0003:  ldc.i4.2
    IL_0004:  stloc.1
    IL_0005:  ldc.i4.3
    IL_0006:  stloc.2
    IL_0007:  ldloc.0
    IL_0008:  ldloc.1
    IL_0009:  add
    IL_000a:  ldloc.2
    IL_000b:  add
    IL_000c:  stloc.3
    IL_000d:  ldloc.3
    IL_000e:  stloc.s    V_4
    IL_0010:  br.s       IL_0012

    IL_0012:  ldloc.s    V_4
    IL_0014:  ret
  } // end of method Test::Run1

  .method private hidebysig static void  Main() cil managed
  {
    // 
    .maxstack  8
    IL_0000:  nop
    IL_0001:  call       void TestLib.Test::ClassRun()
    IL_0006:  nop
    IL_0007:  call       string [mscorlib]System.Console::ReadLine()
    IL_000c:  pop
    IL_000d:  ret
  } // end of method Test::Main

  .method public hidebysig static void  ClassRun() cil managed
  {
    // 
    .maxstack  2
    .locals init ([0] object obj,
             [1] class TestLib.TestClas2 q)
    IL_0000:  nop
    IL_0001:  newobj     instance void [mscorlib]System.Object::.ctor()
    IL_0006:  stloc.0
    IL_0007:  newobj     instance void TestLib.TestClas2::.ctor()
    IL_000c:  stloc.1
    IL_000d:  ldloc.1
    IL_000e:  ldloc.1
    IL_000f:  callvirt   instance void TestLib.TestClas2::RunFunction(class TestLib.TestClas2)
    IL_0014:  nop
    IL_0015:  ldloc.1
    IL_0016:  callvirt   instance int32 TestLib.TestClas2::get_Value()
    IL_001b:  call       void [mscorlib]System.Console::WriteLine(int32)
    IL_0020:  nop
    IL_0021:  ret
  } // end of method Test::ClassRun

  .method public hidebysig static void  EventTest() cil managed
  {
    // 
    .maxstack  2
    .locals init ([0] class [mscorlib]System.Action runtets)
    IL_0000:  nop
    IL_0001:  ldnull
    IL_0002:  ldftn      void TestLib.Test::ActionTest()
    IL_0008:  newobj     instance void [mscorlib]System.Action::.ctor(object,
                                                                      native int)
    IL_000d:  stloc.0
    IL_000e:  ldstr      "EventTest"
    IL_0013:  call       void [mscorlib]System.Console::WriteLine(string)
    IL_0018:  nop
    IL_0019:  ldloc.0
    IL_001a:  callvirt   instance void [mscorlib]System.Action::Invoke()
    IL_001f:  nop
    IL_0020:  ret
  } // end of method Test::EventTest

  .method public hidebysig static void  ActionTest() cil managed
  {
    // 
    .maxstack  8
    IL_0000:  nop
    IL_0001:  ldstr      "Action"
    IL_0006:  call       void [mscorlib]System.Console::WriteLine(string)
    IL_000b:  nop
    IL_000c:  ret
  } // end of method Test::ActionTest

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // 
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void [mscorlib]System.Object::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method Test::.ctor

} // end of class TestLib.Test

.class public sequential ansi sealed beforefieldinit TestLib.TestStruct
       extends [mscorlib]System.ValueType
{
  .field public int32 Value
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor(int32 v1) cil managed
  {
    // 
    .maxstack  8
    IL_0000:  nop
    IL_0001:  ldarg.0
    IL_0002:  ldarg.1
    IL_0003:  stfld      int32 TestLib.TestStruct::Value
    IL_0008:  ret
  } // end of method TestStruct::.ctor

} // end of class TestLib.TestStruct

.class public auto ansi beforefieldinit TestLib.TestClas2
       extends [mscorlib]System.Object
{
  .field private int32 '<Value>k__BackingField'
  .custom instance void [mscorlib]System.Runtime.CompilerServices.CompilerGeneratedAttribute::.ctor() = ( 01 00 00 00 ) 
  .custom instance void [mscorlib]System.Diagnostics.DebuggerBrowsableAttribute::.ctor(valuetype [mscorlib]System.Diagnostics.DebuggerBrowsableState) = ( 01 00 00 00 00 00 00 00 ) 
  .method public hidebysig specialname instance int32 
          get_Value() cil managed
  {
    .custom instance void [mscorlib]System.Runtime.CompilerServices.CompilerGeneratedAttribute::.ctor() = ( 01 00 00 00 ) 
    // 
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  ldfld      int32 TestLib.TestClas2::'<Value>k__BackingField'
    IL_0006:  ret
  } // end of method TestClas2::get_Value

  .method public hidebysig specialname instance void 
          set_Value(int32 'value') cil managed
  {
    .custom instance void [mscorlib]System.Runtime.CompilerServices.CompilerGeneratedAttribute::.ctor() = ( 01 00 00 00 ) 
    // 
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  ldarg.1
    IL_0002:  stfld      int32 TestLib.TestClas2::'<Value>k__BackingField'
    IL_0007:  ret
  } // end of method TestClas2::set_Value

  .method public hidebysig instance void 
          RunFunction(class TestLib.TestClas2 input) cil managed
  {
    // 
    .maxstack  3
    .locals init ([0] int32 V_0)
    IL_0000:  nop
    IL_0001:  ldarg.1
    IL_0002:  dup
    IL_0003:  callvirt   instance int32 TestLib.TestClas2::get_Value()
    IL_0008:  stloc.0
    IL_0009:  ldloc.0
    IL_000a:  ldc.i4.1
    IL_000b:  add
    IL_000c:  callvirt   instance void TestLib.TestClas2::set_Value(int32)
    IL_0011:  nop
    IL_0012:  ldarg.0
    IL_0013:  call       instance int32 TestLib.TestClas2::get_Value()
    IL_0018:  call       void [mscorlib]System.Console::WriteLine(int32)
    IL_001d:  nop
    IL_001e:  ldarg.1
    IL_001f:  callvirt   instance int32 TestLib.TestClas2::get_Value()
    IL_0024:  call       void [mscorlib]System.Console::WriteLine(int32)
    IL_0029:  nop
    IL_002a:  ret
  } // end of method TestClas2::RunFunction

  .method public hidebysig instance void 
          RunFunction(class TestLib.TestClas2& input) cil managed
  {
    // 
    .maxstack  8
    IL_0000:  nop
    IL_0001:  ldarg.1
    IL_0002:  newobj     instance void TestLib.TestClas2::.ctor()
    IL_0007:  stind.ref
    IL_0008:  ldarg.1
    IL_0009:  ldind.ref
    IL_000a:  ldc.i4.3
    IL_000b:  callvirt   instance void TestLib.TestClas2::set_Value(int32)
    IL_0010:  nop
    IL_0011:  ret
  } // end of method TestClas2::RunFunction

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // 
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  ldc.i4.1
    IL_0002:  stfld      int32 TestLib.TestClas2::'<Value>k__BackingField'
    IL_0007:  ldarg.0
    IL_0008:  call       instance void [mscorlib]System.Object::.ctor()
    IL_000d:  nop
    IL_000e:  ret
  } // end of method TestClas2::.ctor

  .property instance int32 Value()
  {
    .get instance int32 TestLib.TestClas2::get_Value()
    .set instance void TestLib.TestClas2::set_Value(int32)
  } // end of property TestClas2::Value
} // end of class TestLib.TestClas2

.class public auto ansi beforefieldinit TestLib.TestClass
       extends TestLib.TestBaseClass
{
  .field public static int32 Value
  .field private static int32 '<Value1>k__BackingField'
  .custom instance void [mscorlib]System.Runtime.CompilerServices.CompilerGeneratedAttribute::.ctor() = ( 01 00 00 00 ) 
  .custom instance void [mscorlib]System.Diagnostics.DebuggerBrowsableAttribute::.ctor(valuetype [mscorlib]System.Diagnostics.DebuggerBrowsableState) = ( 01 00 00 00 00 00 00 00 ) 
  .field public static object MyObj
  .method public hidebysig specialname static 
          int32  get_Value1() cil managed
  {
    .custom instance void [mscorlib]System.Runtime.CompilerServices.CompilerGeneratedAttribute::.ctor() = ( 01 00 00 00 ) 
    // 
    .maxstack  8
    IL_0000:  ldsfld     int32 TestLib.TestClass::'<Value1>k__BackingField'
    IL_0005:  ret
  } // end of method TestClass::get_Value1

  .method public hidebysig specialname static 
          void  set_Value1(int32 'value') cil managed
  {
    .custom instance void [mscorlib]System.Runtime.CompilerServices.CompilerGeneratedAttribute::.ctor() = ( 01 00 00 00 ) 
    // 
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  stsfld     int32 TestLib.TestClass::'<Value1>k__BackingField'
    IL_0006:  ret
  } // end of method TestClass::set_Value1

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // 
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  call       instance void TestLib.TestBaseClass::.ctor()
    IL_0006:  nop
    IL_0007:  ret
  } // end of method TestClass::.ctor

  .method private hidebysig specialname rtspecialname static 
          void  .cctor() cil managed
  {
    // 
    .maxstack  8
    IL_0000:  ldc.i4.s   12
    IL_0002:  stsfld     int32 TestLib.TestClass::Value
    IL_0007:  ret
  } // end of method TestClass::.cctor

  .property int32 Value1()
  {
    .get int32 TestLib.TestClass::get_Value1()
    .set void TestLib.TestClass::set_Value1(int32)
  } // end of property TestClass::Value1
} // end of class TestLib.TestClass

.class public auto ansi beforefieldinit TestLib.TestBaseClass
       extends [mscorlib]System.Object
{
  .field public int32 IValue
  .method public hidebysig specialname rtspecialname 
          instance void  .ctor() cil managed
  {
    // 
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  ldc.i4.s   11
    IL_0003:  stfld      int32 TestLib.TestBaseClass::IValue
    IL_0008:  ldarg.0
    IL_0009:  call       instance void [mscorlib]System.Object::.ctor()
    IL_000e:  nop
    IL_000f:  ret
  } // end of method TestBaseClass::.ctor

} // end of class TestLib.TestBaseClass


// =============================================================

// 
// 
