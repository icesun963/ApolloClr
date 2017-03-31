using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr.Cross
{
  


    public class CrossMethodDelegate<T1, T2,T3>
    {

    }

    public class CrossMethodDelegate<T1,T2>
    {

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
