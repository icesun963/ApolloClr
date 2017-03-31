using System;

namespace ApolloClr
{
#if JS
    public class BaseClrStack
    {
        internal StackItem[] EvaluationStack;

        int Esp = 0;

        public void Reset()
        {
            Esp = 0;
            Current = this;
        }

        /// <summary>
        /// µ±Ç°¶ÑÕ»
        /// </summary>
        public static BaseClrStack Current;

        public void SetCurrent()
        {
            Current = this;
        }

        public StackItem this[int index]
        {
            get { return EvaluationStack[index]; }
        }

        public BaseClrStack(int x = 10)
        {
            x++;
            EvaluationStack = new StackItem[x];
            for (int i = 0; i < x; i++)
            {
                EvaluationStack[i] = new StackItem(i,this);
            }
            SetCurrent();
        }

        public void Push(int obj)
        {
            EvaluationStack[Esp++].IntValue = obj;
        }

        public void Push(StackValueType vtype, object value)
        {
            var p = EvaluationStack[Esp++];
            if (vtype == StackValueType.Ref || vtype== StackValueType.i4)
            {
                throw new NotSupportedException();
            }
            else
            {
                p.ValueType = vtype;
                p.VPoint = value;
            }
          
        }

        public void Push(StackValueType vtype, int value)
        {
            var p = EvaluationStack[Esp++];
            p.ValueType = vtype;
            p.IntValue = value;
        }


        public virtual void Push(StackItem obj)
        {
            EvaluationStack[Esp++].CopyFrom(obj);
        }

        public virtual StackItem Pop()
        {
            var result= EvaluationStack[--Esp];
            return result;
        }

        public virtual StackItem Pop(int count)
        {
            Esp -= count;
            return EvaluationStack[Esp];
        }

        public StackItem Top()
        {
            return EvaluationStack[Esp];
        }
    }
#endif
}