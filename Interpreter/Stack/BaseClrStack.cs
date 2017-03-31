namespace ApolloClr
{
#if JS
    public class BaseClrStack
    {
        private StackItem[] EvaluationStack;

        int Esp = 0;

        public void Reset()
        {
            Esp = 0;
        }

        public BaseClrStack(int x = 10)
        {
            x++;
            EvaluationStack = new StackItem[x];
            for (int i = 0; i < x; i++)
            {
                EvaluationStack[i] = new StackItem();
            }
        }

        public void Push(int obj)
        {
            EvaluationStack[Esp++].IntValue = obj;
        }

        public virtual void Push(StackItem obj)
        {
            EvaluationStack[Esp++] = obj;
        }

        public virtual StackItem Pop()
        {
            var result= EvaluationStack[--Esp];
            EvaluationStack[Esp] = new StackItem();

            return result;
        }

        public virtual StackItem[] Pop(int count)
        {
            StackItem [] result = new StackItem[count];
            for (int i = 0; i < count; i++)
            {
                result[count-i-1] = EvaluationStack[--Esp];
            }
            return result;
        }

    }
#endif
}