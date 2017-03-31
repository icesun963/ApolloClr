using System.Diagnostics;

namespace ApolloClr.MethodDefine
{

    public class BaseOpTask
    {
        public int Dump { get; set; }

        public ILCode OpCode { get; set; }

        public object Method { get; set; }

        public override string ToString()
        {
            return "" + OpCode;
        }
    }
}