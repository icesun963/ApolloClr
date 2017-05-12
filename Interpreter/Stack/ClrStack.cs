using System;
using System.ComponentModel;
using System.Runtime.InteropServices;
using System.Security;

namespace ApolloClr
{
#if !JS
    public unsafe class ClrStack  : System.ComponentModel.INotifyPropertyChanged
    {
        public readonly StackItem[] EvaluationStack;
        private readonly StackItem* EspZero;
        private StackItem* Esp;
#if DEBUG
        private int _espI = 0;

        public event PropertyChangedEventHandler PropertyChanged;

        public int EspI
        {
            get { return _espI; }
            set
            {
           
                if (value < 0 || value>EvaluationStack.Length)
                {
                    throw  new NotSupportedException("Ptr 溢出!");
                }
                _espI = value;
                if (PropertyChanged != null)
                {
                    PropertyChanged(this, new PropertyChangedEventArgs("EspI"));
                }

            }
        }
#endif

        public void Reset()
        {
            Esp = EspZero;
            EspI = 0;
        }


        public void Push(GCHandle ptr)
        {
            Esp->Ptr = ptr;
            Esp->ValueType = StackValueType.Ref;
            Esp++;
            EspI++;
        }



        public void PushType(StackValueType vtype)
        {
            Esp->ValueType = vtype;
        }
        public void Push(StackValueType vtype, int* obj)
        {
            Esp->ValueType = vtype;
            *Esp->VPoint = *obj;
            Esp++;
            EspI++;
        }

        public void Push(StackValueType vtype, long* obj)
        {
            *(long*)Esp->VPoint = *obj;
            Esp->ValueType = vtype;
            Esp++;
            EspI++;
        }

        public void Push(int* obj)
        {
            *Esp->VPoint = *obj;
            Esp++;
            EspI++;
        }

        public void Push(long* obj)
        {
            *(long*)Esp->VPoint = *obj;
            Esp++;
            EspI++;
        }

        public void Push(StackItem* obj)
        {
            *Esp = *obj;
            Esp->VPoint = &Esp->IntValue;
            Esp++;
            EspI++;
        }

        public void Push(StackItem obj)
        {
            *Esp = obj;
            Esp->VPoint = &Esp->IntValue;
            Esp++;
            EspI++;
        }
        public StackItem* Pop()
        {
            Esp--;
            EspI--;
            return Esp;
        }

        public StackItem* Top()
        {
            return Esp - 1;
        }

        public StackItem* Pop(int count)
        {
            Esp -= count;
            EspI -= count;
            return Esp;
        }

        public ClrStack(int maxStack = 5)
        {
            //maxStack++;
            EvaluationStack = new StackItem[maxStack];

            fixed (StackItem* esp = &EvaluationStack[0])
            {
                Esp = esp;
                EspZero = esp;
            }

            for (int i = 0; i < EvaluationStack.Length; i++)
            {
                EvaluationStack[i].Index = i;
                fixed (int* x = &EvaluationStack[i].IntValue)
                {
                    EvaluationStack[i].VPoint = x;
                }
            }
        }
    }
#endif
}