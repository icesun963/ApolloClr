using System;
using System.Runtime.InteropServices;

namespace ApolloClr.Cross
{
    public interface ICrossMethodDelegate
    {
        GCHandle Ptr { get; set; }
        Delegate Delegate { get; }
        void Run();
        object Result { get; }

        void SetArgs(object[] values);
    }
}