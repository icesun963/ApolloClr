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
	IL_0000: ldarg.0
	IL_0001: ldc.i4.2
	IL_0002: bge.s IL_0006

	IL_0004: ldarg.0
	IL_0005: ret

	IL_0006: ldarg.0
	IL_0007: ldc.i4.1
	IL_0008: sub
	IL_0009: call int32 ApolloClr.Program::fib(int32)
	IL_000e: ldarg.0
	IL_000f: ldc.i4.2
	IL_0010: sub
	IL_0011: call int32 ApolloClr.Program::fib(int32)
	IL_0016: add
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
