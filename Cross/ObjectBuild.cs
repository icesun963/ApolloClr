using System;

namespace ApolloClr.Cross
{
    public class ObjectBuild<T> : BaseCrossMethodDelegate
        where T : new()
    {
        public override Delegate Delegate
        {
            get { return null; }
        }

        public T Make()
        {
            //TODO 有参数支持
            return new T();
        }

        public override void Run()
        {
            Result = Make();
        }

        public override void SetArgs(object[] values)
        {
          
        }
    }
}