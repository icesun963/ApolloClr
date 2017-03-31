using System;

namespace ApolloClr.Cross
{
    public class CrossMethodDelegateRet<T> : BaseCrossMethodDelegate
    {
        public Func<T> Func;

        public override Delegate Delegate
        {
            get
            {
                return Func;
            }
        }


        public override void Run()
        {
            Result = Func();
        }

        public override void SetArgs(object[] values)
        {
           
        }

    }
}