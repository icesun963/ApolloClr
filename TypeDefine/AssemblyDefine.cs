using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace ApolloClr.TypeDefine
{
    public class AssemblyDefine
    {
        /// <summary>
        /// 定义的类型
        /// </summary>
        public List<TypeDefine> TypeDefines { get; set; } = new List<TypeDefine>();

        public AssemblyDefine Load(string fileName)
        {
            var api = SilAPI.Disassembler.DisassembleAssembly(fileName);
            foreach (var typeDefinition in api.AllClasses)
            {
                var typedefine = new TypeDefine(typeDefinition);
                TypeDefines.Add(typedefine);
            }
            foreach (var typeDefinition in api.AllStructures)
            {
                var typedefine = new TypeDefine(typeDefinition);
                TypeDefines.Add(typedefine);
            }
            Extensions.RegAssembly(this);
            foreach (var typeDefine in TypeDefines)
            {
                typeDefine.Compile();
            }
            return this;
        }

        public static object ReadAndRun(string fileName, string type, string method)
        {
            var assbmbly = new AssemblyDefine().Load(fileName);


            foreach (var typeDefinition in assbmbly.TypeDefines)
            {

                if (typeDefinition.TypeDefinition.ShortName == type)
                {
                    var methodefine = typeDefinition.Methods.Find(r => r.MethodDefinition.ShortName == method);
                    if (methodefine != null)
                    {
                        methodefine.Run();

#if JS
                     return methodefine.Clr.ResultPoint;
#else

#endif
                    }
                    break;
                }
            }

            return null;

        }
    }
}
