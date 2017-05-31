using System;
using System.Collections.Generic;
using System.Diagnostics;
using ApolloClr.Method;

namespace ApolloClr.TypeDefine
{
    [DebuggerDisplay("Name = {Name}")]
    public class MethodDefine : MethodTasks
    {
        public SilAPI.DisassembledMethod MethodDefinition { get; set; }

        public TypeDefine TypeDefine { get; set; }

        public string [] GenericsArgs { get; set; }

        public override string Name
        {
            get { return MethodDefinition.CallName; }
            set {  }
        }

        private List<ILCode> Codes = null;

        public override void InitMember(ClrObject input)
        {
            base.InitMember(input);
            Extensions.BuildClrObject(input, TypeDefine.ClrType);
        }

        protected override MethodTasks CloneOne()
        {
            var methodDefinition = MethodDefinition;

            var codes = Codes;

            if (Codes == null)
            {
                List<string> lines = MethodDefinition.BodyLines;
                Codes = codes = ILCodeParse.ReadILCodes(lines.ToArray(), methodDefinition.LocalList, methodDefinition.ParametersList);
            }
           
            var method = MethodDefine.Build<MethodDefine>(codes,
                methodDefinition.Locals,
                methodDefinition.Parameters,
                methodDefinition.ReturnType.IsVoid() && !MethodDefinition.IsCtor,
                methodDefinition.MaxStack,
                MethodDefinition.Static,
                MethodDefinition.IsCtor
                );
            method.MethodDefinition = methodDefinition;
            method.TypeDefine = TypeDefine;
            method.CompileIL();
            method.Compile(TypeDefine.MethodCompile,TypeDefine.NewCompile);
         
            return method;
        }

        public MethodDefine ReBuild()
        {
            var methodDefinition = MethodDefinition;

            var codes = this.Codes;

            if (Codes == null)
            {
                List<string> lines = MethodDefinition.BodyLines;
                if (GenericsArgs != null && GenericsArgs.Length > 0)
                {
                    for (int i = 0; i < lines.Count; i++)
                    {
                        var line = lines[i];
                        if (line.IndexOf("!!") >= 0)
                        {
                            int pcount = 0;
                            for (int j = 0; j < methodDefinition.ParametersList.Count; j++)
                            {
                                if (methodDefinition.ParametersList[j].StartsWith("!!"))
                                {
                                    line = line.Replace( methodDefinition.ParametersList[j], GenericsArgs[pcount]);
                                    pcount++;
                                }
                            }
                         
                            lines[i] = line;
                        }

                    }
                   
                }
                Codes = codes = ILCodeParse.ReadILCodes(lines.ToArray(), methodDefinition.LocalList, methodDefinition.ParametersList);
            }
            var method = MethodDefine.Build<MethodDefine>(codes,
                methodDefinition.Locals,
                methodDefinition.Parameters,
                methodDefinition.ReturnType.IsVoid() && !MethodDefinition.IsCtor,
                methodDefinition.MaxStack,
                MethodDefinition.Static,
                MethodDefinition.IsCtor
                );
            method.MethodDefinition = methodDefinition;
            method.TypeDefine = TypeDefine;
            method.CompileIL();
            method.Compile(TypeDefine.MethodCompile, TypeDefine.NewCompile);
          
            return method;
        }
    }
}