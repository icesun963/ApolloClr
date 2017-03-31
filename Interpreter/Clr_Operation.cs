using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr
{
    /// <summary>
    /// 数学计算
    /// </summary>
    public
#if !JS
        unsafe 
#endif
        partial class Clr
    {


        /// <summary>
        /// 将两个值相加并将结果推送到计算堆栈上。
        /// </summary>
        /// <returns></returns>
        public virtual void Add()
        {
            var vs = EvaluationStack_Pop(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
#if JS
            var x = vs.IntValue + (vs + 1).IntValue;
#else
            switch (vs->ValueType)
            {
                case StackValueType.r4:
                {
                    var x = *(float*)vs->VPoint + *(float*)(vs + 1)->VPoint;
                    EvaluationStack_Push(x);
                    break;
                }
                case StackValueType.r8:
                    {
                        var x = *(double*)vs->VPoint + *(double*)(vs + 1)->VPoint;
                        EvaluationStack_Push(x);
                        break;
                    }
                case StackValueType.i8:
                    {
                        var x = *(long*)vs->VPoint + *(long*)(vs + 1)->VPoint;
                        EvaluationStack_Push(x);
                        break;
                    }
                default:
                {
                    var x = vs->IntValue + (vs + 1)->IntValue;
                    EvaluationStack_Push(x);
                    break;
                }
            }

#endif

        }



        /// <summary>
        /// 从其他值中减去一个值并将结果推送到计算堆栈上。
        /// </summary>

        public virtual void Sub()
        {
            var vs = EvaluationStack_Pop(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
#if JS
            var x = vs.IntValue - (vs + 1).IntValue;
#else
            switch (vs->ValueType)
            {
                case StackValueType.r4:
                    {
                        var x = *(float*)vs->VPoint - *(float*)(vs + 1)->VPoint;
                        EvaluationStack_Push(x);
                        break;
                    }
                case StackValueType.r8:
                    {
                        var x = *(double*)vs->VPoint - *(double*)(vs + 1)->VPoint;
                        EvaluationStack_Push(x);
                        break;
                    }
                case StackValueType.i8:
                    {
                        var x = *(long*)vs->VPoint - *(long*)(vs + 1)->VPoint;
                        EvaluationStack_Push(x);
                        break;
                    }
                default:
                    {
                        var x = vs->IntValue - (vs + 1)->IntValue;
                        EvaluationStack_Push(x);
                        break;
                    }
            }
#endif
          

        }

        /// <summary>
        /// 将两个值相乘并将结果推送到计算堆栈上。
        /// </summary>
        public virtual void Mul()
        {
            var vs = EvaluationStack_Pop(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
#if JS
            var x = vs.IntValue * (vs + 1).IntValue;
#else
            switch (vs->ValueType)
            {
                case StackValueType.r4:
                    {
                        var x = *(float*)vs->VPoint * *(float*)(vs + 1)->VPoint;
                        EvaluationStack_Push(x);
                        break;
                    }
                case StackValueType.r8:
                    {
                        var x = *(double*)vs->VPoint * *(double*)(vs + 1)->VPoint;
                        EvaluationStack_Push(x);
                        break;
                    }
                case StackValueType.i8:
                    {
                        var x = *(long*)vs->VPoint * *(long*)(vs + 1)->VPoint;
                        EvaluationStack_Push(x);
                        break;
                    }
                default:
                    {
                        var x = vs->IntValue * (vs + 1)->IntValue;
                        EvaluationStack_Push(x);
                        break;
                    }
            }
#endif


        }

        /// <summary>
        /// 将两个值相除并将结果作为浮点（F 类型）或商（int32 类型）推送到计算堆栈上。
        /// </summary>
        public virtual void Div()
        {
            var vs = EvaluationStack_Pop(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
#if JS
            var x = vs.IntValue / (vs + 1).IntValue;
#else
            switch (vs->ValueType)
            {
                case StackValueType.r4:
                    {
                        var x = *(float*)vs->VPoint / *(float*)(vs + 1)->VPoint;
                        EvaluationStack_Push(x);
                        break;
                    }
                case StackValueType.r8:
                    {
                        var x = *(double*)vs->VPoint / *(double*)(vs + 1)->VPoint;
                        EvaluationStack_Push(x);
                        break;
                    }
                case StackValueType.i8:
                    {
                        var x = *(long*)vs->VPoint / *(long*)(vs + 1)->VPoint;
                        EvaluationStack_Push(x);
                        break;
                    }
                default:
                    {
                        var x = vs->IntValue / (vs + 1)->IntValue;
                        EvaluationStack_Push(x);
                        break;
                    }
            }
#endif
          

        }

        /// <summary>
        /// 将两个值相除并将余数推送到计算堆栈上。
        /// </summary>

        public virtual void Rem()
        {
            var vs = EvaluationStack_Pop(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
#if JS
            var x = vs.IntValue % (vs + 1).IntValue;
#else
            switch (vs->ValueType)
            {
                case StackValueType.r4:
                    {
                        var x = *(float*)vs->VPoint % *(float*)(vs + 1)->VPoint;
                        EvaluationStack_Push(x);
                        break;
                    }
                case StackValueType.r8:
                    {
                        var x = *(double*)vs->VPoint % *(double*)(vs + 1)->VPoint;
                        EvaluationStack_Push(x);
                        break;
                    }
                case StackValueType.i8:
                    {
                        var x = *(long*)vs->VPoint % *(long*)(vs + 1)->VPoint;
                        EvaluationStack_Push(x);
                        break;
                    }
                default:
                    {
                        var x = vs->IntValue % (vs + 1)->IntValue;
                        EvaluationStack_Push(x);
                        break;
                    }
            }
#endif
         

        }


        /// <summary>
        /// 计算两个值的按位“与”并将结果推送到计算堆栈上。
        /// </summary>


        public virtual void And()
        {
            var vs = EvaluationStack_Pop(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
#if JS
            var x = vs.IntValue & (vs + 1).IntValue;
#else
            var x = (vs)->IntValue & (vs + 1)->IntValue;
#endif
            
            EvaluationStack_Push(x);

        }

        /// <summary>
        /// 计算位于堆栈顶部的两个整数值的按位求补并将结果推送到计算堆栈上。
        /// </summary>

        public virtual void Or()
        {
            var vs = EvaluationStack_Pop(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
#if JS
            var x = vs.IntValue | (vs + 1).IntValue;
#else
            var x = (vs)->IntValue | (vs + 1)->IntValue;
#endif
            EvaluationStack_Push(x);

        }

        /// <summary>
        /// 计算位于计算堆栈顶部的两个值的按位异或，并且将结果推送到计算堆栈上。
        /// </summary>
        public virtual void Xor()
        {
            var vs = EvaluationStack_Pop(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;

#if JS
            var x = vs.IntValue ^ (vs + 1).IntValue;
#else
            var x = (vs)->IntValue ^ (vs + 1)->IntValue;
#endif
            EvaluationStack_Push(x);

        }

        /// <summary>
        /// 将整数值左移（用零填充）指定的位数，并将结果推送到计算堆栈上。
        /// </summary>

        public virtual void Shl()
        {
            var vs = EvaluationStack_Pop(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
#if JS
            var x = vs.IntValue << (vs + 1).IntValue;
#else
            var x = (vs)->IntValue << (vs + 1)->IntValue;
#endif
            EvaluationStack_Push(x);

        }

        /// <summary>
        /// 将整数值右移（保留符号）指定的位数，并将结果推送到计算堆栈上。
        /// </summary>

        public virtual void Shr()
        {
            var vs = EvaluationStack_Pop(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
#if JS
            var x = vs.IntValue >> (vs + 1).IntValue;
#else
            var x = (vs )->IntValue >> (vs + 1)->IntValue;
#endif
            EvaluationStack_Push(x);

        }

        /// <summary>
        /// 对一个值执行求反并将结果推送到计算堆栈上。
        /// </summary>
        public virtual void Neg()
        {
            var vs = EvaluationStack_Pop();
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
#if JS
            var x = ~vs.IntValue;
#else
            var x = ~vs->IntValue;
#endif
            EvaluationStack_Push(x);

        }

        /// <summary>
        /// 计算堆栈顶部整数值的按位求补并将结果作为相同的类型推送到计算堆栈上。
        /// </summary>

        public virtual void Not()
        {
            var vs = EvaluationStack_Pop();
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
#if JS
            var x = ~vs.IntValue;
#else
            var x = ~(vs)->IntValue;
#endif
            EvaluationStack_Push(x);

        }


        /// <summary>
        /// 比较两个值。如果这两个值相等，则将整数值 1 (int32) 推送到计算堆栈上；否则，将 0 (int32) 推送到计算堆栈上。
        /// </summary>
        public virtual void Ceq()
        {
            var vs = EvaluationStack_Pop(2);
#if JS
            if (vs.IntValue == (vs + 1).IntValue)
#else
            if ((vs )->IntValue == (vs + 1)->IntValue)
#endif
            {
                EvaluationStack_Push(1);
            }
            else
            {
                EvaluationStack_Push(0);
            }
        }

        /// <summary>
        /// 比较两个值。如果第一个值大于第二个值，则将整数值 1 (int32) 推送到计算堆栈上；反之，将 0 (int32) 推送到计算堆栈上。
        /// </summary>
        public virtual void Cgt()
        {
            var vs = EvaluationStack_Pop(2);
#if JS
            if ((vs).IntValue > (vs + 1).IntValue)
#else
            if ((vs)->IntValue > (vs + 1)->IntValue)
#endif
            {
                EvaluationStack_Push(1);
            }
            else
            {
                EvaluationStack_Push(0);
            }
        }

        /// <summary>
        /// 比较两个值。如果第一个值小于第二个值，则将整数值 1 (int32) 推送到计算堆栈上；反之，将 0 (int32) 推送到计算堆栈上。
        /// </summary>
        public virtual void Clt()
        {
            var vs = EvaluationStack_Pop(2);
#if JS
            if ((vs).IntValue < (vs + 1).IntValue)
#else
            if ((vs)->IntValue < (vs + 1)->IntValue)
#endif
            {
                EvaluationStack_Push(1);
            }
            else
            {
                EvaluationStack_Push(0);
            }
        }
    }
}
