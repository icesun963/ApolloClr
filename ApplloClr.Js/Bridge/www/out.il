
//  Microsoft (R) .NET Framework IL Disassembler.  Version 4.6.1055.0
//  Copyright (c) Microsoft Corporation.  All rights reserved.



// Metadata version: v4.0.30319
.assembly extern mscorlib
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
// MVID: {38EDB6C0-F4AE-4CE0-ADB2-B116139BB08F}
.custom instance void [mscorlib]System.Security.UnverifiableCodeAttribute::.ctor() = ( 01 00 00 00 ) 
.imagebase 0x10000000
.file alignment 0x00000200
.stackreserve 0x00100000
.subsystem 0x0003       // WINDOWS_CUI
.corflags 0x00000001    //  ILONLY
// Image base: 0x008E0000


// =============== CLASS MEMBERS DECLARATION ===================

.class public auto ansi beforefieldinit TestLib.Test
       extends [mscorlib]System.Object
{
  .method private hidebysig static void  Main() cil managed
  {
    // 
    .maxstack  8
    IL_0000:  nop
    IL_0001:  call       string [mscorlib]System.Console::ReadLine()
    IL_0006:  pop
    IL_0007:  ret
  } // end of method Test::Main

  .method public hidebysig static void  EventTest() cil managed
  {
    // 
    .maxstack  2
    .locals init ([0] class [mscorlib]System.Action`1<int32> runtets,
             [1] class [mscorlib]System.Action runtest1)
    IL_0000:  nop
    IL_0001:  ldnull
    IL_0002:  ldftn      void TestLib.Test::ActionTest(int32)
    IL_0008:  newobj     instance void class [mscorlib]System.Action`1<int32>::.ctor(object,
                                                                                     native int)
    IL_000d:  stloc.0
    IL_000e:  ldstr      "EventTest"
    IL_0013:  call       void [mscorlib]System.Console::WriteLine(string)
    IL_0018:  nop
    IL_0019:  ldloc.0
    IL_001a:  ldc.i4.1
    IL_001b:  callvirt   instance void class [mscorlib]System.Action`1<int32>::Invoke(!0)
    IL_0020:  nop
    IL_0021:  ldnull
    IL_0022:  ldftn      void TestLib.Test::ActionTest()
    IL_0028:  newobj     instance void [mscorlib]System.Action::.ctor(object,
                                                                      native int)
    IL_002d:  stloc.1
    IL_002e:  ldloc.1
    IL_002f:  callvirt   instance void [mscorlib]System.Action::Invoke()
    IL_0034:  nop
    IL_0035:  ret
  } // end of method Test::EventTest

  .method public hidebysig static void  ActionTest() cil managed
  {
    // 
    .maxstack  8
    IL_0000:  nop
    IL_0001:  ldstr      "Action1"
    IL_0006:  call       void [mscorlib]System.Console::WriteLine(string)
    IL_000b:  nop
    IL_000c:  ret
  } // end of method Test::ActionTest

  .method public hidebysig static void  ActionTest(int32 'value') cil managed
  {
    // 
    .maxstack  8
    IL_0000:  nop
    IL_0001:  ldarg.0
    IL_0002:  call       void [mscorlib]System.Console::WriteLine(int32)
    IL_0007:  nop
    IL_0008:  ldstr      "Action"
    IL_000d:  call       void [mscorlib]System.Console::WriteLine(string)
    IL_0012:  nop
    IL_0013:  ret
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

.class public auto ansi beforefieldinit TestLib.TestNewClass
       extends [mscorlib]System.Object
{
  .field public int32 'value'
  .field private int32 '<pvalue>k__BackingField'
  .custom instance void [mscorlib]System.Runtime.CompilerServices.CompilerGeneratedAttribute::.ctor() = ( 01 00 00 00 ) 
  .custom instance void [mscorlib]System.Diagnostics.DebuggerBrowsableAttribute::.ctor(valuetype [mscorlib]System.Diagnostics.DebuggerBrowsableState) = ( 01 00 00 00 00 00 00 00 ) 
  .method public hidebysig specialname instance int32 
          get_pvalue() cil managed
  {
    .custom instance void [mscorlib]System.Runtime.CompilerServices.CompilerGeneratedAttribute::.ctor() = ( 01 00 00 00 ) 
    // 
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  ldfld      int32 TestLib.TestNewClass::'<pvalue>k__BackingField'
    IL_0006:  ret
  } // end of method TestNewClass::get_pvalue

  .method public hidebysig specialname instance void 
          set_pvalue(int32 'value') cil managed
  {
    .custom instance void [mscorlib]System.Runtime.CompilerServices.CompilerGeneratedAttribute::.ctor() = ( 01 00 00 00 ) 
    // 
    .maxstack  8
    IL_0000:  ldarg.0
    IL_0001:  ldarg.1
    IL_0002:  stfld      int32 TestLib.TestNewClass::'<pvalue>k__BackingField'
    IL_0007:  ret
  } // end of method TestNewClass::set_pvalue

  .method public hidebysig specialname rtspecialname 
          instance void  .ctor(int32 x) cil managed
  {
    // 
    .maxstack  3
    IL_0000:  ldarg.0
    IL_0001:  ldc.i4.1
    IL_0002:  stfld      int32 TestLib.TestNewClass::'value'
    IL_0007:  ldarg.0
    IL_0008:  ldc.i4.s   10
    IL_000a:  stfld      int32 TestLib.TestNewClass::'<pvalue>k__BackingField'
    IL_000f:  ldarg.0
    IL_0010:  call       instance void [mscorlib]System.Object::.ctor()
    IL_0015:  nop
    IL_0016:  nop
    IL_0017:  ldarg.0
    IL_0018:  ldarg.0
    IL_0019:  ldfld      int32 TestLib.TestNewClass::'value'
    IL_001e:  ldarg.1
    IL_001f:  add
    IL_0020:  stfld      int32 TestLib.TestNewClass::'value'
    IL_0025:  ldarg.0
    IL_0026:  ldarg.0
    IL_0027:  call       instance int32 TestLib.TestNewClass::get_pvalue()
    IL_002c:  ldarg.1
    IL_002d:  add
    IL_002e:  call       instance void TestLib.TestNewClass::set_pvalue(int32)
    IL_0033:  nop
    IL_0034:  ldarg.0
    IL_0035:  ldfld      int32 TestLib.TestNewClass::'value'
    IL_003a:  call       void [mscorlib]System.Console::WriteLine(int32)
    IL_003f:  nop
    IL_0040:  ldarg.0
    IL_0041:  call       instance int32 TestLib.TestNewClass::get_pvalue()
    IL_0046:  call       void [mscorlib]System.Console::WriteLine(int32)
    IL_004b:  nop
    IL_004c:  ret
  } // end of method TestNewClass::.ctor

  .property instance int32 pvalue()
  {
    .get instance int32 TestLib.TestNewClass::get_pvalue()
    .set instance void TestLib.TestNewClass::set_pvalue(int32)
  } // end of property TestNewClass::pvalue
} // end of class TestLib.TestNewClass


// =============================================================

// 
// 
