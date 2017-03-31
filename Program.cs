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
                var file = File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + "ApolloClr.il");
                TypeDefine.AssemblyDefine.ReadAndRun(file, "Program", "RunF");
#endif
                //Test.RunArray();
                TypeDefine.AssemblyDefine.ReadAndRun(AppDomain.CurrentDomain.BaseDirectory + "ApolloClr.exe", "Test", "RunOut");

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


    public class Test
    {
        //public static float RunF1()
        //{
        //    var sw = new Stopwatch();
        //    sw.Start();
        //    Double xxx = -22;
        //    for (int i = 0; i < 10000 * 100; i++)
        //    {
        //        Run1();
        //    }
        //    Console.WriteLine(xxx);
        //    sw.Stop();
        //    sw.Stop();
        //    Console.WriteLine(sw.ElapsedMilliseconds);
        //    return (float)xxx;
        //}

        //static int Run1()
        //{
        //    int i = 1;
        //    int j = 2;
        //    int k = 3;
        //    int answer = i + j + k;
        //    return answer;
        //}
        public static void RunOut()
        {
            var x = 1;
            try
            {
                x = RunArray();
            }
            catch (Exception)
            {
                
               
            }
           
        }
        public static int RunArray()
        {
            Console.WriteLine("==============");
            int x = 0;

            x++;
            try
            {
                throw new Exception();
            }
            catch (Exception)
            {
                Console.WriteLine("Line1");
                try
                {
                    try
                    {
                        x++;
                        Console.WriteLine("x++");
                        throw;
                    }
                    catch (Exception)
                    {
                        throw;

                    }
                 
                }
              
                catch (Exception)
                {
                    
                    throw;
                }
                
            }
            finally
            {
                try
                {
                    Console.WriteLine("x--");
                    x--;
                }
                catch (Exception)
                {
                    
                    throw;
                }
                x++;
                Console.WriteLine("finally");
            }

            x++;

            Console.WriteLine("==============" );
            return 0;

        }
    }
}
