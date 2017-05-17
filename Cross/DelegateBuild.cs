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

        public Action OnEndAction;

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
                if (Target != null)
                {
                    Method.Clr.Argp->SetValue(StackValueType.Ref, Target, true);
                }
                Method.Run(() =>
                {
                    if (OnEndAction != null)
                    {
                        OnEndAction();
                    }
                });

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
            Target = values[1];
            //TODO 其他参数
        }
    }



    public unsafe class DelegateBuild<T> : DelegateBuild
    {
        public override unsafe void Run()
        {
            Action = r =>
            {
                Method.Clr.Argp->SetValue(StackValueType.i4, r, true);

                Method.Run(null);
            };
            Result = Action;
        }

        private Action<T> Action;
    }
}