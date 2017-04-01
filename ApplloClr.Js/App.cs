using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using Bridge;
using Bridge.Html5;
using Bridge.jQuery2;
using Bridge.Linq;
using SilAPI;

namespace ApolloClr.Js
{
    public class App
    {
        public static void Main()
        {
           

            var code = @"
	IL_0000: nop
	IL_0001: ldc.i4.1
	IL_0002: stloc.0
	IL_0003: ldc.i4.2
	IL_0004: stloc.1
	IL_0005: ldc.i4.3
	IL_0006: stloc.2
	IL_0007: ldloc.0
	IL_0008: ldloc.1
	IL_0009: add
	IL_000a: ldloc.2
	IL_000b: add
	IL_000c: stloc.3
	IL_000d: ldloc.3
	IL_000e: stloc.s 4
	IL_0010: br.s IL_0012

	IL_0012: ldloc.s 4
	IL_0014: ret
";
            if (true)
            {
                int count = 10000 * 10;
                var sw = new Stopwatch();
                var func = MethodTasks.Build(code).Compile();


                sw.Restart();
                sw.Start();
                for (int i = 0; i < count; i++)
                {
                    func.Run();
                }
                sw.Stop();
                Console.WriteLine(sw.ElapsedMilliseconds);
                sw.Restart();
                sw.Start();
                for (int i = 0; i < count; i++)
                {
                    Run1();
                }
                sw.Stop();
                Console.WriteLine(sw.ElapsedMilliseconds);
            }

            jQuery.Ajax(new AjaxOptions
            {
                Url = "out.il",
                Data = "",
                ContentType = "application/json; charset=utf-8",
                Success = delegate (object data, string str, jqXHR jqxhr)
                {
                    //Console.WriteLine(str);

                    var json = data + "";
                    Console.WriteLine("Result:" + json);
                    var result = TypeDefine.AssemblyDefine.ReadAndRun(json, "Test", "RunF1");
                    Console.WriteLine("End:" + Bridge.Html5.JSON.Stringify(result));
                }
            });
        }

        public static int Run1()
        {
            int i = 1;
            int j = 2;
            int k = 3;
            int answer = i + j + k;
            return answer;
        }
    }


}

namespace System
{
    public static class Exction
    {
        public static T Find<T>(this IList<T> list, Func<T, bool> func)
        {
            return list.FirstOrDefault(func);
        }

        public static int FindIndex<T>(this IList<T> list, Func<T, bool> func)
        {
            var find = list.Find(func);
            return list.IndexOf(find);
        }


        public static Type MakeGenericType(this Type type, params Type[] types)
        {
            return type.MakeGenericType(types);
        }

        public static void ForEach<T>(this List<T> list, Action<T> loopFunc)
        {
            foreach (var item in list)
            {
                loopFunc(item);
            }
        }
    }

    public class Lazy<T>
    {
        private Func<T> Func;
        bool IsInit = false;
        public Lazy(Func<T> func)
        {
            Func = func;
        }

        private T _Value;

        public T Value
        {
            get
            {
                if (!IsInit)
                {
                    _Value = Func();
                }

                return _Value;
            }
        }


    }

    namespace IO
    {
        public class StringReader :IDisposable
        {
            private string rawIL;

            public int Postion = 0;

            public string[] Lines = null;

            public StringReader(string rawIL)
            {
                this.rawIL = rawIL;
                Lines = this.rawIL.Split('\r');
            }

            public void Dispose()
            {
               
            }

            internal string ReadLine()
            {
                if (Postion >= Lines.Length)
                {
                    return null;
                }
                return Lines[Postion++];
            }

            internal string ReadToEnd()
            {
                return rawIL;
            }
        }

    
    }

}