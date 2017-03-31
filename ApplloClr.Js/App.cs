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