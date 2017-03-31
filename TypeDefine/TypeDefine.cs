using System;
using System.Collections.Generic;
using ApolloClr.Method;


namespace ApolloClr.TypeDefine
{
    public class TypeDefine
    {
        public List<MethodDefine> Methods { get; set; } = new List<MethodDefine>();

        public SilAPI.DisassembledClass TypeDefinition { get; set; }

        public  TypeDefine(SilAPI.DisassembledClass inputType)
        {
            TypeDefinition = inputType;
            foreach (var methodDefinition in inputType.Methods)
            {

                methodDefinition.ReadBody();
                List<string> lines = methodDefinition.BodyLines;
                var codes = ILCodeParse.ReadILCodes(lines.ToArray(), methodDefinition.LocalList, methodDefinition.ParametersList);
                var method = MethodDefine.Build<MethodDefine>(codes,
                    methodDefinition.Locals,
                    methodDefinition.Parameters,
                    methodDefinition.ReturnType.ToLower() != typeof(void).Name.ToLower(),
                     methodDefinition.MaxStack
                    );
                method.MethodDefinition = methodDefinition;
                method.TypeDefine = this;
                Methods.Add(method);
            }
        }




        public TypeDefine Compile()
        {
            foreach (var methodTaskse in Methods)
            {
                methodTaskse.Compile(MethodCompile,NewCompile);
            }
            return this;
        }

        public void MethodCompile(IOpTask r)
        {
            var find = Methods.Find(rx => rx.MethodDefinition.CallName == r.OpCode.Arg0 + " " + r.OpCode.Arg1);
            if (r.OpCode.Arg0 == "instance")
            {
                find = Methods.Find(rx => rx.MethodDefinition.CallName == r.OpCode.Arg1 + " " + r.OpCode.Arg2);
            }
            if (find != null)
            {
                r.Method = find;
                r.GetType().GetField("V3").SetValue(r, find);
            }
            else
            {
                //try clr cross
                var method = Cross.CrossDomain.Build(r.OpCode.Arg0 == "instance" ? r.OpCode.Arg1 + " " + r.OpCode.Arg2 : r.OpCode.Arg0 + " " + r.OpCode.Arg1);
                r.Method = method;
                r.GetType().GetField("V3").SetValue(r, method);

            }
        }

        public void NewCompile(IOpTask r)
        {

            //try clr cross
            var method = Cross.CrossDomain.Build(r.OpCode.Arg1 + " " + r.OpCode.Arg2);
            r.Method = method;
            r.GetType().GetField("V3").SetValue(r, method);

        }
    }
}