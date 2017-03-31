using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr.MethodDefine
{

    public delegate void RefAction<T>(ref T arg1);

    public delegate void RefAction<T1, T2>(ref T1 arg1, ref T2 arg2);

    public delegate void RefAction<T1, T2, T3>(ref T1 arg1, ref T2 arg2, ref T3 arg3);

    public class OpCodeTaskRef<TV1, TV2, TV3> : BaseOpTask, IOpTask
    {

        public RefAction<TV1, TV2, TV3> Func;

        public Delegate BindFunc
        {
            get { return Func; }
        }

        public TV1 V1;

        public TV2 V2;

        public TV3 V3;

        public void Run()
        {
            Func(ref V1, ref V2, ref V3);
        }
    }

    public class OpCodeTaskRef<TV1, TV2> : BaseOpTask, IOpTask
    {

        public RefAction<TV1, TV2> Func;

        public Delegate BindFunc
        {
            get { return Func; }
        }
        public TV1 V1;

        public TV2 V2;


        public void Run()
        {
            Func(ref V1, ref V2);
        }
    }

    public class OpCodeTaskRef<TV1> : BaseOpTask, IOpTask
    {

        public RefAction<TV1> Func;

        public Delegate BindFunc
        {
            get { return Func; }
        }

        public TV1 V1;

        public void Run()
        {
            Func(ref V1);
        }
    }

   

}
