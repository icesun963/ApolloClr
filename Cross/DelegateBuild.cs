using System;

namespace ApolloClr.Cross
{
    public unsafe class DelegateBuild : BaseCrossMethodDelegate
    {
        public override Delegate Delegate
        {
            get { return Action; }
        }


        private Action Action;

        /// <summary>
        /// 对象引用
        /// </summary>
        public object Target;

        /// <summary>
        /// 方法指针
        /// </summary>
        public MethodTasks Method;



  
        public override void Run()
        {
            Action = () =>
            {
                //IntPtr转换成 MethodTask
                //传入参数
                //执行
                Method.InDebug = false;
                //TODO 暂不支持委托DEBUG
                Method.Run(null);
            };

            Result = Action;
        }

        public override void SetArgs(object[] values)
        {
            for (int i = 0; i < values.Length; i++)
            {
                if (values[i] is MethodTasks)
                {
                    Method = values[i] as MethodTasks;
                }
            }
            //TODO 其他参数
        }
    }



    public unsafe class DelegateBuild<T> : DelegateBuild
    {
        public override unsafe void Run()
        {
            Action = r =>
            {
                Method.Clr.Argp->SetValue(StackValueType.i4, r);
                //IntPtr转换成 MethodTask
                //传入参数
                //执行
                Method.InDebug = false;
                //TODO 暂不支持委托DEBUG
                Method.Run(null);
            };
            Result = Action;
        }

        private Action<T> Action;
    }
}