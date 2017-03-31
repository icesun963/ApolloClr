using System;
using System.Runtime.InteropServices;

namespace ApolloClr.Cross
{
    public interface ICrossMethodDelegate
    {
#if JS
        StackObject Ptr { get; set; }
#else
        GCHandle Ptr { get; set; }
#endif
        Delegate Delegate { get; }
        void Run();
        object Result { get; }

        void SetArgs(object[] values);
    }
}