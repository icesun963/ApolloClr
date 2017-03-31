using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr.MethodDefine
{
    public class OpCodeTaskT<TV1, TV2, TV3> : BaseOpTask, IOpTask
    {

        public Action<TV1, TV2, TV3> Func;
        public Delegate BindFunc
        {
            get { return Func; }
        }

        public TV1 V1;

        public TV2 V2;

        public TV3 V3;

        public void Run()
        {
            Func(V1, V2, V3);
        }
    }

    public class OpCodeTaskT<TV1, TV2> : BaseOpTask, IOpTask
    {

        public Action<TV1, TV2> Func;

        public Delegate BindFunc
        {
            get { return Func; }
        }
        public TV1 V1;

        public TV2 V2;


        public void Run()
        {
            Func(V1, V2);
        }
    }

    public class OpCodeTaskT<TV1> : BaseOpTask, IOpTask
    {

        public Action<TV1> Func;
        public Delegate BindFunc
        {
            get { return Func; }
        }
        public TV1 V1;

        public void Run()
        {
            Func(V1);
        }
    }
}
