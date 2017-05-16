using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Reflection.Emit;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr
{
    unsafe class Program
    {





        static unsafe void Main(string[] args)
        {
 
            int count = 10000*1000;

            var sw = new Stopwatch();


            long p1 = 0;
            long p2 = 0;
            var code = @"
	
    // [99 9 - 99 10]
    IL_0000: nop          

    // [100 13 - 100 23]
    IL_0001: ldc.i4.1     
    IL_0002: stloc.0      // i

    // [101 13 - 101 23]
    IL_0003: ldc.i4.2     
    IL_0004: stloc.1      // j

    // [102 13 - 102 23]
    IL_0005: ldc.i4.3     
    IL_0006: stloc.2      // k

    // [103 13 - 103 36]
    IL_0007: ldloc.0      // i
    IL_0008: ldloc.1      // j
    IL_0009: add          
    IL_000a: ldloc.2      // k
    IL_000b: add          
    IL_000c: stloc.3      // answer

    // [104 13 - 104 27]
    IL_000d: ldloc.3      // answer
    IL_000e: stloc.s      V_4
    IL_0010: br.s         IL_0012

    // [105 9 - 105 10]
    IL_0012: ldloc.s      V_4
    IL_0014: ret          
	IL_0017: ret
";
            {

#if JS
               
                TypeDefine.AssemblyDefine.ReadAndRun(AppDomain.CurrentDomain.BaseDirectory + "TestLib.dll", "Test", "ClassRun");
#endif
             
                //Test.RunArray();
                TypeDefine.AssemblyDefine.ReadAndRun(AppDomain.CurrentDomain.BaseDirectory + "TestLib.dll", "Test",
                    "ClassRun");

                Console.ReadLine();
                var func = MethodTasks.Build(code).Compile();


                sw.Restart();
                sw.Start();
                for (int i = 0; i < count; i++)
                {
                    func.Run();
                }
                sw.Stop();

                p1 = sw.ElapsedMilliseconds;
                Console.WriteLine(sw.ElapsedMilliseconds);
            }

            {
                sw.Restart();
                sw.Start();
                for (int i = 0; i < count; i++)
                {
                    Run1();
                }

                sw.Stop();
                Console.WriteLine(sw.ElapsedMilliseconds);
                p2 = sw.ElapsedMilliseconds;

            }

            Console.WriteLine("P1/P2:" + p1*1.0f/p2);
            Console.ReadLine();

        }



        static int Run1()
        {
            int i = 1;
            int j = 2;
            int k = 3;
            int answer = i + j + k;
            return answer;
        }
    }


}
