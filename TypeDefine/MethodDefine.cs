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
                methodDefinition.ReturnType.ToLower() != typeof(void).Name.ToLower() && MethodDefinition.ShortName!= ".ctor",
                methodDefinition.MaxStack);
            method.MethodDefinition = methodDefinition;
            method.TypeDefine = TypeDefine;
            method.Compile(TypeDefine.MethodCompile,TypeDefine.NewCompile);

            return method;
        }
    }
}