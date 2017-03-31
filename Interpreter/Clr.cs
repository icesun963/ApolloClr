using System;
using System.Collections.Generic;

namespace ApolloClr
{
    public
#if !JS
        unsafe
#endif

        partial class Clr
    {

#if JS
        private BaseClrStack Stack;
#else
        private ClrStack Stack;
#endif

        /// <summary>
        /// ����ƨ���� ����λ��Ϊ ����
        /// ����=��ǰ�ֲ�����+����ֵ+��������
        /// </summary>
        public readonly StackItem[] CallStack;


#if JS

    /// <summary>
    /// ͷָ��
    /// </summary>
        public readonly int Csp;

        /// <summary>
        /// ����ָ��
        /// </summary>
        public readonly int Argp;

        /// <summary>
        /// ��ǰ�ķ���ֵ
        /// </summary>
        public StackItem ResultPoint;
#else
        /// <summary>
        /// ͷָ��
        /// </summary>
        public readonly StackItem* Csp;

        /// <summary>
        /// ����ָ��
        /// </summary>
        public readonly StackItem* Argp;

        /// <summary>
        /// ��ǰ�ķ���ֵ
        /// </summary>
        public StackItem* ResultPoint;
#endif
        public Action<int> DumpAction;
        public Action<Object,int> ThrowAction;
        public readonly int LocalVarCount = 0;
        public readonly int ArgsVarCount = 0;
        public bool RetResult = false;

        #region Stack


#if JS
        public void EvaluationStack_Push(StackItem obj)
        {
            Stack.Push(obj);
        }

        public void EvaluationStack_Push(int obj)
        {
            Stack.Push(obj);
        }

        public void EvaluationStack_Push(int[] args)
        {
            for (int i = 0; i < args.Length; i++)
            {
                Stack.Push(Csp + args[i]);
            }

        }

        public StackItem EvaluationStack_Pop()
        {
            return Stack.Pop();
        }

        public StackItem[] EvaluationStack_Pop(int count)
        {
            return Stack.Pop(count);
        }
#else
        public void EvaluationStack_Push( StackValueType vtype, object value)
        {
            switch (vtype)
            {
                case StackValueType.Ref:
                    EvaluationStack_Push(value);
                    break;
                case StackValueType.i8:
                    EvaluationStack_Push((long) value);
                    break;
                case StackValueType.r8:
                    EvaluationStack_Push((double) value);
                    break;
                case StackValueType.i4:
                    EvaluationStack_Push((int) value);
                    break;
                case StackValueType.r4:
                    EvaluationStack_Push((float) value);
                    break;
            }
        }

        public void EvaluationStack_Push(object obj)
        {
            var iptr = StackObject.NewObject(obj);
            Stack.Push(iptr);
        }
        public void EvaluationStack_Push(StackItem* obj)
        {
            Stack.Push(obj);
        }


        public void EvaluationStack_Push(uint obj)
        {
         
            Stack.Push(StackValueType.i4,(int*)&obj);
        }

        public void EvaluationStack_Push(ushort obj)
        {

            Stack.Push(StackValueType.i4, (int*)&obj);
        }

        public void EvaluationStack_Push(short obj)
        {
            Stack.Push(StackValueType.i4, (int*)&obj);
        }

        public void EvaluationStack_Push(int obj)
        {
            Stack.Push(StackValueType.i4, &obj);
        }


        public void EvaluationStack_Push(float obj)
        {
            Stack.Push(StackValueType.r4,(int*)&obj);
        }
        public void EvaluationStack_Push(long obj)
        {
            Stack.Push(StackValueType.i8 ,(long*)&obj);
        }
        public void EvaluationStack_Push(double obj)
        {
            Stack.Push(StackValueType.r8 ,(long*)&obj);
        }

      


        public void EvaluationStack_Push(int[] args)
        {
            for (int i = 0; i < args.Length; i++)
            {
                Stack.Push(Csp + args[i]);
            }

        }

        public StackItem* EvaluationStack_Pop()
        {
            return Stack.Pop();
        }

        public StackItem* EvaluationStack_Pop(int count)
        {
            return Stack.Pop(count);
        }
#endif

        #endregion

        public Clr(int localCount = 5, int argCount = 5, bool haseResult = true, int maxStack = 5)
        {
#if JS
            Stack = new BaseClrStack(maxStack);

#else
            Stack = new ClrStack(maxStack);
#endif
            RetResult = haseResult;
            LocalVarCount = localCount;
            ArgsVarCount = argCount;
            CallStack = new StackItem[localCount + argCount];
            if (CallStack.Length <= 0)
            {
                return;
            }

#if JS
             Csp = 0;
            Argp = Csp + localCount;
#else
            fixed (StackItem* csp = &CallStack[0])
            {
                Csp = csp;
                Argp = csp + localCount;
            }


            for (int i = 0; i < CallStack.Length; i++)
            {
                CallStack[i].Index = i;
                fixed (int* x = &CallStack[i].IntValue)
                {
                    CallStack[i].VPoint = x;
                }
            }
#endif
        }

        /// <summary>
        /// �Ƴ���ǰλ�ڼ����ջ������ֵ
        /// </summary>
        public virtual void Pop()
        {
            EvaluationStack_Pop();
        }

        /// <summary>
        /// ���Ƽ����ջ�ϵ�ǰ��˵�ֵ
        /// </summary>
        public void Dup()
        {
            var vs = Stack.Top();
            EvaluationStack_Push(vs);
        }

        /// <summary>
        /// �˳���ǰ����������ָ������
        /// </summary>
        public void Jmp()
        {
            //TODO
        }


        /// <summary>
        /// ����������ָ������ֵ���ã����ص���ջ�ϡ�
        /// </summary>
        /// <param name="i"></param>
        public virtual void Ldarg(int i)
        {
#if JS
            EvaluationStack_Push(CallStack[Argp + i]);
#else
            EvaluationStack_Push(Argp + i);
#endif
        }


        public virtual void Ldstr(string str)
        {
            EvaluationStack_Push(str);
        }

        public virtual void Ldnull()
        {
            EvaluationStack_Push(StackItem.SPtrEmpty);
        }

        /// <summary>
        /// ѹ������ ѹ��Evaluation Stack��
        /// </summary>
        /// <param name="v">ֵ</param>
        public virtual void Ldc_i4(int v)
        {
            EvaluationStack_Push(v);
        }

        /// <summary>
        /// ��λ�ڼ����ջ������ֵ�洢�ڲ������е�ָ�����������̸�ʽ����
        /// </summary>
        /// <param name="i"></param>
        public void Starg(int i)
        {
            var v = EvaluationStack_Pop();
            *(Argp + i) = *v;
            (Argp + i)->VPoint = &(Argp + i)->IntValue;
        }

        /// <summary>
        /// ѹ������ ѹ��Evaluation Stack��
        /// </summary>
        /// <param name="vtype"></param>
        /// <param name="value"></param>
        public virtual void Ldc(ref StackValueType vtype,ref object value)
        {
            if (value is string)
            {
                value = Extensions.GetValueFromStr(value as string, vtype);
            }

            {
                EvaluationStack_Push(vtype, value);
            }

        }

        /// <summary>
        /// ��һ���������� ��ѹ��Evaluation Stack�У�
        /// </summary>
        /// <param name="i"></param>
        /// <returns></returns>
        public virtual void Ldloc(int i)
        {
#if JS
            EvaluationStack_Push(CallStack[Csp + i]);
#else
            EvaluationStack_Push(Csp + i);
#endif
        }

        /// <summary>
        /// ��һ���������� ��ѹ��Evaluation Stack�У�
        /// </summary>
        /// <param name="i"></param>
        /// <returns></returns>
        public virtual void Ldloca(int i)
        {
            Ldloc(i);
        }


        /// <summary>
        /// ��һ���������� ��ѹ��Evaluation Stack�У�
        /// </summary>
        /// <param name="i"></param>
        /// <returns></returns>
        public virtual void Ldloc(params int[] args)
        {

            EvaluationStack_Push(args);

        }




        /// <summary>
        ///  �Ӽ����ջ�Ķ���������ǰֵ������洢�ھֲ������б��е� index �����̸�ʽ����
        /// Stloc_S
        /// </summary>
        /// <param name="i">λ��</param>
        /// <returns></returns>
        public virtual void Stloc(int i)
        {
            var result = EvaluationStack_Pop();
#if JS
            CallStack[(Csp + i)] = result;
#else
            *(Csp + i) = *result;
            (Csp + i)->VPoint = &((Csp + i)->IntValue);
#endif
        }

    



        /// <summary>
        /// ���ô�
        /// </summary>
        /// <returns></returns>
        public virtual void Nop()
        {

        }

        public virtual void Reset()
        {
            Stack.Reset();
            ResultPoint = null;
        }

   

     
    }
}