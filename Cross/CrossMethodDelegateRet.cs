using System;

namespace ApolloClr.Cross
{
    public class CrossMethodDelegateRet<T> : BaseCrossMethodDelegate
    {
        public Func<T> Func;

        public override Delegate Delegate
        {
            get { return Func; }
        }


        public override void Run()
        {
            Result = Func();
        }

        public override void SetArgs(object[] values)
        {

        }

    }

    public class CrossMethodDelegateRet<RT, T1> : BaseCrossMethodDelegate
    {
        public Func<T1, RT> Func;

        public override Delegate Delegate
        {
            get { return Func; }
        }

        public T1 V1;

        public override void Run()
        {
            Result = Func(V1);
        }

        public override void SetArgs(object[] values)
        {
            V1 = (T1) values[0];
        }

    }

    public class CrossMethodDelegateRet<RT, T1, T2> : BaseCrossMethodDelegate
    {
        public Func<T1, T2, RT> Func;

        public override Delegate Delegate
        {
            get { return Func; }
        }

        public T1 V1;
        public T2 V2;

        public override void Run()
        {
            Result = Func(V1, V2);
        }

        public override void SetArgs(object[] values)
        {
            V1 = (T1) values[0];
            V2 = (T2) values[1];
        }

    }

    public class CrossMethodDelegateRet<RT, T1, T2, T3> : BaseCrossMethodDelegate
    {
        public Func<T1, T2, T3, RT> Func;

        public override Delegate Delegate
        {
            get { return Func; }
        }

        public T1 V1;
        public T2 V2;
        public T3 V3;

        public override void Run()
        {
            Result = Func(V1, V2, V3);
        }

        public override void SetArgs(object[] values)
        {
            V1 = (T1) values[0];
            V2 = (T2) values[1];
            V3 = (T3) values[2];
        }

    }
}