using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr
{


    /// <summary>
    /// 数组
    /// </summary>
    public
#if !JS
        unsafe
#endif
        partial class Clr
    {


        /// <summary>
        /// 将从零开始的、一维数组的元素的数目推送到计算堆栈上。
        /// </summary>
        public void Ldlen()
        {
            var vs = EvaluationStack_Pop();
#if JS
            var array = vs.Value as Array;
#else
            var array = vs->Value as Array;
#endif
            EvaluationStack_Push(array.Length);
        }



        /// <summary>
        /// 将对新的从零开始的一维数组（其元素属于特定类型）的对象引用推送到计算堆栈上。
        /// </summary>
        public void Newarr<T>(Type type)
        {
            var vs = EvaluationStack_Pop();
#if JS
            var array = new T[vs.IntValue];
#else
            var array = new T[vs->IntValue];
#endif
            EvaluationStack_Push(array);
        }

        /// <summary>
        /// 将位于指定数组索引的数组元素的地址作为 & 类型（托管指针）加载到计算堆栈的顶部。
        /// </summary>
        /// <param name="type"></param>
        public void Ldelema<T>(Type type)
        {
            var vs = EvaluationStack_Pop(2);
#if JS
            var ptr = (vs).Ptr;
            var index = (vs + 1).IntValue;
            var sptr = new StackItem()
            {
                Ptr = ptr,
                Index = index,
                ValueType = StackValueType.Array
            };

            EvaluationStack_Push(sptr);
#else
            var ptr = (vs)->Ptr;
            var index = (vs + 1)->IntValue;
            var stack = new StackItem()
            {
                Ptr = ptr,
                Index = index,
                ValueType = StackValueType.Array
            };

            StackItem* sptr = &stack;
            EvaluationStack_Push(sptr);
#endif
        }

        /// <summary>
        /// 将位于指定数组索引处的 int8 类型的元素作为 int32 加载到计算堆栈的顶部。
        /// </summary>
        /// <param name="type"></param>
        public void Ldelem(StackValueType type)
        {
            var vs = EvaluationStack_Pop(2);
#if JS
            var array = (vs).Ptr.Object as Array;
            var index = (vs + 1).IntValue;


#else
            var array = ((StackObject) (vs)->Ptr.Target).Object as Array;
            var index = (vs + 1)->IntValue;

#endif
            EvaluationStack_Push(type, array.GetValue(index));
        }

        /// <summary>
        /// 用计算堆栈上的 native int 值替换给定索引处的数组元素。
        /// </summary>
        public void Stelem(StackValueType type)
        {
            var vs = EvaluationStack_Pop(3);
#if JS
            var array = vs.Ptr.Object as Array;
            var index = (vs + 1).IntValue;
            var optr = (vs + 1 + 1);
            switch (optr.ValueType)
            {
                case StackValueType.Ref:
                    {
                        var obj = optr.Ptr.Object;
                        array.SetValue(obj, index);
                        break;
                    }
                default:
                    {
                        var obj = optr.Value;
                        array.SetValue(obj, index);
                        break;
                    }

            }
#else
            var array = ((StackObject) (vs)->Ptr.Target).Object as Array;
            var index = (vs + 1)->IntValue;


            var optr = (vs + 1 + 1);
            switch (optr->ValueType)
            {
                case StackValueType.Ref:
                {
                    var obj = ((StackObject) optr->Ptr.Target).Object;
                    array.SetValue(obj, index);
                    break;
                }
                default:
                {
                    var obj = optr->Value;
                    array.SetValue(obj, index);
                    break;
                }

            }
#endif
        }
    }
}
