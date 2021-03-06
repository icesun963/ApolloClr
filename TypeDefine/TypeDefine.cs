using System;
using System.Collections.Generic;
using System.Linq;
using ApolloClr.Method;


namespace ApolloClr.TypeDefine
{
    public class TypeDefine
    {
        public List<MethodDefine> Methods { get; set; } = new List<MethodDefine>();

        /// <summary>
        /// 静态对象
        /// </summary>
        public ClrObject StaticClrObject { get; set; } = new ClrObject();

        public SilAPI.DisassembledIlClass TypeDefinition { get; set; }

        public ClrType ClrType { get; set; }

        public TypeDefine(SilAPI.DisassembledIlClass inputType)
        {
            TypeDefinition = inputType;

            foreach (var methodDefinition in TypeDefinition.Methods)
            {

                methodDefinition.ReadBody();
                List<string> lines = methodDefinition.BodyLines;
                var codes = ILCodeParse.ReadILCodes(lines.ToArray(), methodDefinition.LocalList,
                    methodDefinition.ParametersList);
                bool haseResult = methodDefinition.ReturnType.IsVoid();
                if (methodDefinition.IsCtor)
                {
                    haseResult = true;
                }
                var method = MethodDefine.Build<MethodDefine>(codes,
                    methodDefinition.Locals,
                    methodDefinition.Parameters,
                    haseResult,
                    methodDefinition.MaxStack,
                    methodDefinition.Static,
                    methodDefinition.IsCtor
                    );
                method.MethodDefinition = methodDefinition;
                method.TypeDefine = this;

                Methods.Add(method);
            }
            ClrType = new ClrType();
            ClrType.typeDefine = TypeDefinition;
        }




        public TypeDefine Compile()
        {
            Extensions.BuildClrObject(StaticClrObject,ClrType,true);
          

            foreach (var methodTaskse in Methods)
            {
                if (methodTaskse.MethodDefinition.IsGenerics)
                {
                    continue;
                }

                methodTaskse.CompileIL();
                methodTaskse.Compile(MethodCompile,NewCompile);
                if (methodTaskse.MethodDefinition.ShortName == Extensions.STR_CCTOR)
                {
                    methodTaskse.Run(null);
                }
            }

          
            return this;
        }

     

        public void MethodCompile(IOpTask r)
        {
            var parse = TypeParse.Parse(r.OpCode);
       
            var find = Methods.Find(rx => rx.MethodDefinition.CallName == parse.CallName);
            //本地查找
            if(find==null && parse.TypeDefine!=null)
            {
                find = parse.TypeDefine.Methods.Find(rx => rx.MethodDefinition.CallName == parse.CallName);

                if (find == null)
                {
                    var t = Extensions.GetTypeDefineByName(parse.TypeDefine.TypeDefinition.FullName);
                    if (t != null)
                    {
                        find = t.Methods.Find(rx => rx.MethodDefinition.CallName == parse.CallName);
                    }
                    throw new NotSupportedException();
                }
                else
                {
                    if (find.MethodDefinition.IsGenerics)
                    {
                        CallNameDefine callName = parse.CallName;
                        var args = callName.GetGenericsArgs();
                        find.GenericsArgs = args;
                        find = find.ReBuild();
                    }
                }
            }
            if (find != null)
            {
                r.Method = find;
                r.V3(find);
                //r.GetType().GetField("V3").SetValue(r, find);
            }
            else
            {
                //try clr cross
                var method = Cross.CrossDomain.Build(parse.CallName);
                r.Method = method;
                //r.GetType().GetField("V3").SetValue(r, method);
                r.V3(method);
            }
        }

        public void NewCompile(IOpTask r)
        {
            var parse = TypeParse.Parse( r.OpCode);
         
            var find = Methods.Find(rx => rx.MethodDefinition.CallName == parse.CallName);
            //本地查找
            if (find == null && parse.TypeDefine != null)
            {
                find = parse.TypeDefine.Methods.Find(rx => rx.MethodDefinition.CallName == parse.CallName);
                if (find == null)
                {
                    throw new NotSupportedException();
                }
            }
            if (find != null)
            {
                r.Method = find;
                r.V3(find);
                //r.GetType().GetField("V3").SetValue(r, find);
            }
            else
            {
                //try clr cross
                var method = Cross.CrossDomain.Build(r.OpCode.Arg1 + " " + r.OpCode.Arg2);
                r.Method = method;
                //r.GetType().GetField("V3").SetValue(r, method);
                r.V3(method);
            }


        }

        public Type GetClrType()
        {
            return ClrType;
        }
    }
}