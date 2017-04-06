using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr.TypeDefine
{
    public class TypeParse
    {
        //	IL_0001: newobj instance void [System]System.Diagnostics.Stopwatch::.ctor()
        //  call int32 TestLib.TestClass::get_Value1()
        //  call void [mscorlib]System.Console::WriteLine(int64)
        public static ILMethodDefine Parse(ILCode line)
        {
            Console.WriteLine(line.Arg0 + " " + line.Arg1 + " " + line.Arg2 + "  " + line.Line);
            var callName = line.Arg0 + " " + line.Arg1;
            if (line.Arg0 == "instance")
            {
                callName = line.Arg1 + " " + line.Arg2;
            }
            var values = callName.Split(new string[] { "::", ",", "(", ")", " " },
               StringSplitOptions.RemoveEmptyEntries);
            var returnType = values[0];
            var typeName = values[1];
            var methodName = values[2];
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
        public string CallName;

    }

    public class ILArgDefine
    {
        public string TypeDefine;
    }
}
