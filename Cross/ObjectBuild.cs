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

    public class DelegateBuild<T> : BaseCrossMethodDelegate
    {
        public override Delegate Delegate
        {
            get { return null; }
        }

  
        public override void Run()
        {
       
        }

        public override void SetArgs(object[] values)
        {

        }
    }

    
}