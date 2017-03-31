using System;

namespace ApolloClr
{
    public interface IOpTask
    {
        void Run();

        Delegate BindFunc { get; }

        int Dump { get; set; }
        ILCode OpCode { get; set; }

        object Method { get; set; }

    }
}