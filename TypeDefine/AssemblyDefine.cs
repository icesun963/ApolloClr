using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace ApolloClr.TypeDefine
{
    public class AssemblyDefine
    {
        public static object ReadAndRun(string fileName, string type, string method)
        {


            var api = SilAPI.Disassembler.DisassembleAssembly(fileName);


            foreach (var typeDefinition in api.AllClasses )
            {
                if (typeDefinition == null || typeDefinition.ShortName == type)
                {
                    foreach (var methodDefinition in typeDefinition.Methods)
                    {
                        var typedefine = new TypeDefine(typeDefinition).Compile();

                        var methodefine = typedefine.Methods.Find(r => r.MethodDefinition.ShortName == method);
                        methodefine.Run();

#if JS
                        return methodefine.Clr.ResultPoint;
#else

#endif

                        break;
                    }
                }
            }

            return null;

        }
    }
}
