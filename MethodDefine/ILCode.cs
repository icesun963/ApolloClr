using System.Diagnostics;

namespace ApolloClr
{
#if !JS
    [DebuggerDisplay("{Line}")]
#endif
    public class ILCode
    {
        public string Lable;
        public string OpCode;
        public string Op;
        public string OpArg0;
        public string OpArg1;
        public string Arg0;
        public string Arg1;
        public string Arg2;
    
        public string Line;
        public int LineNum;

        public override string ToString()
        {
            return Line;
        }
    }
}