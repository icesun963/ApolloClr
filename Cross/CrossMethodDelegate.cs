using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr.Cross
{
  


    public class CrossMethodDelegate<T1, T2,T3> : BaseCrossMethodDelegate
    {
        public Action<T1, T2,T3> Func;

        public override Delegate Delegate
        {
            get { return Func; }
        }

        public T1 V1;
        public T2 V2;
        public T3 V3;
 
        public override void Run()
        {
            Func(V1, V2,V3);
        }

        public override void SetArgs(object[] values)
        {
            V1 = (T1)values[0];
            V2 = (T2)values[1];
            V3 = (T3) values[2];
        }
    }

    public class CrossMethodDelegate<T1, T2> : BaseCrossMethodDelegate
    {

        public Action<T1, T2> Func;

        public override Delegate Delegate
        {
            get { return Func; }
        }

        public T1 V1;
        public T2 V2;

        public override void Run()
        {
            Func(V1, V2);
        }

        public override void SetArgs(object[] values)
        {
            V1 = (T1) values[0];
            V2 = (T2) values[1];
        }
    }

    public class CrossMethodDelegate<T> : BaseCrossMethodDelegate
    {
        public Action<T> Func;

        public override Delegate Delegate
        {
            get
            {
                return Func;
            }
        }

        public T V1;

        public override void Run()
        {
            Func(V1);
        }

        public override void SetArgs(object[] values)
        {
            V1 = (T) values[0];
        }

    }


    public class CrossMethodDelegate : BaseCrossMethodDelegate
    {
        public Action Func;

        public override Delegate Delegate
        {
            get
            {
                return Func;
            }
        }

        public override void SetArgs(object[] values)
        {
         
        }

        public override void Run()
        {
            Func();

        }
    }
}
