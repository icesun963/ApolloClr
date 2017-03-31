using System;
using System.Runtime.InteropServices;

namespace ApolloClr.Cross
{
    public abstract class BaseCrossMethodDelegate : ICrossMethodDelegate
    {
        public GCHandle Ptr { get; set; }
        public abstract Delegate Delegate { get; }
        public object Instance { get; set; }
        public object Result { get; set; }

        public abstract void Run();

        public abstract void SetArgs(object[] values);
    }
}