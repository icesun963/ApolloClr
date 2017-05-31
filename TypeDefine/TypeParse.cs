using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr.TypeDefine
{
    public class TypeParse
    {
        //	IL_0001: newobj instance void [System]System.Diagnostics.Stopwatch::.ctor()
        //  call int32 TestLib.TestClass::get_Value1()
        //  call void [mscorlib]System.Console::WriteLine(int64)
        //  IL_0008: newobj instance void class [mscorlib]System.Action`1<int32>::.ctor(object,native_int)
        public static ILMethodDefine Parse(ILCode line)
        {
            Console.WriteLine(line.Arg0 + " " + line.Arg1 + " " + line.Arg2 + "  " + line.Line);
            var callName = line.Arg0 + " " + line.Arg1;
            if (line.Arg0 == "instance")
            {
                callName = line.Arg1 + " " + line.Arg2 ;
            }
            var values = callName.Split(new string[] { "::", ",", "(", ")", " " },
               StringSplitOptions.RemoveEmptyEntries);
            var returnType = values[0];
            var typeName = values[1];
            var methodName = values[2];
            if (typeName == "class")
            {
                typeName = values[2];
                methodName = values[3];
            }
            var type = Extensions.GetTypeDefineByName(typeName);

            var result = new ILMethodDefine();
            result.CallName = callName;
            result.TypeDefine = type;
            result.MethodName = methodName;
            result.Return = returnType;
            if (result.TypeDefine == null)
            {
                result.Type = Extensions.GetTypeByName(typeName);
            }

            return result;
        }
    }


    public class ILMethodDefine
    {
        public TypeDefine TypeDefine;
        public Type Type;
        public string MethodName;
        public string Return;
        public ILArgDefine[] Args;
        public CallNameDefine CallName;

    }

    public class CallNameDefine
    {
        public string CallName;

        public CallNameDefine()
        {
            
        }

        public string[] GetGenericsArgs()
        {
            var p1 = this.CallName.IndexOf(">");

            var q1 = this.CallName.IndexOf("<");
            var qlist1 = this.CallName.Substring(q1 + 1, p1 - q1 - 1).Split(',');

            return qlist1;
        }

        public CallNameDefine(string callname)
        {
            CallName = callname;
        }

        public static implicit operator CallNameDefine(string p)
        {

            var result = new CallNameDefine()
            {
                CallName = p
            };

            return result;
        }

        public static implicit operator string(CallNameDefine p)
        {
            return p.CallName;
        }

        public override bool Equals(object obj)
        {
            if (obj is CallNameDefine)
            {
                var srcall = (obj as CallNameDefine).CallName;

                if (srcall == this.CallName)
                {
                    return true;
                }

                var q2 = srcall.IndexOf("<");

                if (q2 > 0)
                {
                    var q1 = this.CallName.IndexOf("<");
                    if (q1 == q2)
                    {
                        //void TestLib.TestClass::Run<int32>(!!0)
                        var p2 = srcall.IndexOf(">");
                        //TODO 嵌套<int,item<int>> 这种回头再说= =
                        var qlist2 = srcall.Substring(q2 + 1, p2 - q2 - 1).Split(',');
                        var p1 = this.CallName.IndexOf(">");
                        var qlist1 = srcall.Substring(q1 + 1, p1 - q1 - 1).Split(',');
                        if (qlist1.Length == qlist2.Length)
                        {
                            return srcall.Substring(0, q1) == this.CallName.Substring(0, q2);
                        }
                    }
                }

            }
            return false;
        }

        public override string ToString()
        {
            return CallName;
        }

        public static bool operator ==(CallNameDefine p1, string p2)
        {
            return p1.Equals(new CallNameDefine(p2));
        }

        public static bool operator !=(CallNameDefine p1, string p2)
        {
            return !(p1 == p2);
        }

        public static bool operator ==(string p1, CallNameDefine p2)
        {
            return p2.Equals(new CallNameDefine(p1));
        }

        public static bool operator !=(string p1, CallNameDefine p2)
        {
            return !(p1 == p2);
        }
    }

    public class ILArgDefine
    {
        public string TypeDefine;
    }
}
