using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr
{
    /// <summary>
    /// 类型转换
    /// </summary>
    public
#if !JS
        unsafe
#endif
        partial class Clr
    {



        /// <summary>
        /// 将位于计算堆栈顶部的值转换为Type
        /// </summary>
        /// <param name="type"></param>
        public void Conv(StackValueType type)
        {
            var v = EvaluationStack_Pop();
            var rv = new StackItem();
            rv.VPoint = &rv.IntValue;
            switch (type)
            {
                case StackValueType.u1:
                    switch (v->ValueType)
                    {
                        case StackValueType.i4:
                            rv.IntValue = (byte) v->IntValue;
                            break;
                        case StackValueType.i8:
                            rv.IntValue = (byte) v->ValueLong;
                            break;
                        case StackValueType.r4:
                            rv.IntValue = (byte) v->ValueFloat;
                            break;
                        case StackValueType.r8:
                            rv.IntValue = (byte) v->ValueDouble;
                            break;

                    }
                    break;
                case StackValueType.i1:
                    switch (v->ValueType)
                    {
                        case StackValueType.i4:
                            rv.IntValue = (sbyte) v->IntValue;
                            break;
                        case StackValueType.i8:
                            rv.IntValue = (sbyte) v->ValueLong;
                            break;
                        case StackValueType.r4:
                            rv.IntValue = (sbyte) v->ValueFloat;
                            break;
                        case StackValueType.r8:
                            rv.IntValue = (sbyte) v->ValueDouble;
                            break;

                    }
                    break;
                case StackValueType.u2:
                    switch (v->ValueType)
                    {
                        case StackValueType.i4:
                            rv.IntValue = (ushort) v->IntValue;
                            break;
                        case StackValueType.i8:
                            rv.IntValue = (ushort) v->ValueLong;
                            break;
                        case StackValueType.r4:
                            rv.IntValue = (ushort) v->ValueFloat;
                            break;
                        case StackValueType.r8:
                            rv.IntValue = (ushort) v->ValueDouble;
                            break;

                    }
                    break;
                case StackValueType.i2:
                    switch (v->ValueType)
                    {
                        case StackValueType.i4:
                            rv.IntValue = (short) v->IntValue;
                            break;
                        case StackValueType.i8:
                            rv.IntValue = (short) v->ValueLong;
                            break;
                        case StackValueType.r4:
                            rv.IntValue = (short) v->ValueFloat;
                            break;
                        case StackValueType.r8:
                            rv.IntValue = (short) v->ValueDouble;
                            break;

                    }
                    break;
                case StackValueType.u4:
                    switch (v->ValueType)
                    {
                        case StackValueType.i4:
                            rv.IntValue = (int) (uint) v->IntValue;
                            break;
                        case StackValueType.i8:
                            rv.IntValue = (int) (uint) v->ValueLong;
                            break;
                        case StackValueType.r4:
                            rv.IntValue = (int) (uint) v->ValueFloat;
                            break;
                        case StackValueType.r8:
                            rv.IntValue = (int) (uint) v->ValueDouble;
                            break;

                    }
                    break;
                case StackValueType.i4:
                    switch (v->ValueType)
                    {
                        case StackValueType.i4:
                            rv.IntValue = (int) v->IntValue;
                            break;
                        case StackValueType.i8:
                            rv.IntValue = (int) v->ValueLong;
                            break;
                        case StackValueType.r4:
                            rv.IntValue = (int) v->ValueFloat;
                            break;
                        case StackValueType.r8:
                            rv.IntValue = (int) v->ValueDouble;
                            break;

                    }
                    break;

                case StackValueType.r4:
                    switch (v->ValueType)
                    {
                        case StackValueType.i4:
                        {
                            var f = (float) v->IntValue;
                            rv.VPoint = (int*) &f;
                            break;
                        }
                        case StackValueType.i8:
                        {
                            var f = (float) v->ValueLong;
                            rv.VPoint = (int*) &f;
                            break;
                        }
                        case StackValueType.r4:
                        {
                            var f = (float) v->ValueFloat;
                            rv.VPoint = (int*) &f;
                            break;
                        }
                        case StackValueType.r8:
                        {
                            var f = (float) v->ValueDouble;
                            rv.VPoint = (int*) &f;
                            break;
                        }

                    }
                    break;

                case StackValueType.u8:
                    switch (v->ValueType)
                    {
                        case StackValueType.i4:
                            {
                                var f = (ulong)v->IntValue;
                                rv.VPoint = (int*)&f;
                                break;
                            }
                        case StackValueType.i8:
                            {
                                var f = (ulong)v->ValueLong;
                                rv.VPoint = (int*)&f;
                                break;
                            }
                        case StackValueType.r4:
                            {
                                var f = (ulong)v->ValueFloat;
                                rv.VPoint = (int*)&f;
                                break;
                            }
                        case StackValueType.r8:
                            {
                                var f = (ulong)v->ValueDouble;
                                rv.VPoint = (int*)&f;
                                break;
                            }

                    }
                    break;
                case StackValueType.i8:
                    switch (v->ValueType)
                    {
                        case StackValueType.i4:
                            {
                                var f = (long)v->IntValue;
                                rv.VPoint = (int*)&f;
                                break;
                            }
                        case StackValueType.i8:
                            {
                                var f = (long)v->ValueLong;
                                rv.VPoint = (int*)&f;
                                break;
                            }
                        case StackValueType.r4:
                            {
                                var f = (long)v->ValueFloat;
                                rv.VPoint = (int*)&f;
                                break;
                            }
                        case StackValueType.r8:
                            {
                                var f = (long)v->ValueDouble;
                                rv.VPoint = (int*)&f;
                                break;
                            }

                    }
                    break;
                case StackValueType.r8:
                    switch (v->ValueType)
                    {
                        case StackValueType.i4:
                            {
                                var f = (double)v->IntValue;
                                rv.VPoint = (int*)&f;
                                break;
                            }
                        case StackValueType.i8:
                            {
                                var f = (double)v->ValueLong;
                                rv.VPoint = (int*)&f;
                                break;
                            }
                        case StackValueType.r4:
                            {
                                var f = (double)v->ValueFloat;
                                rv.VPoint = (int*)&f;
                                break;
                            }
                        case StackValueType.r8:
                            {
                                var f = (double)v->ValueDouble;
                                rv.VPoint = (int*)&f;
                                break;
                            }

                    }
                    break;
            }


            EvaluationStack_Push(&rv);
        }

        /// <summary>
        /// 将 int8 类型的值作为 int32 间接加载到计算堆栈上。
        /// </summary>
        /// <param name="type"></param>
        public void Ldind(StackValueType type)
        {
            var vs = Stack.Top();
            switch (vs->ValueType)
            {
                case StackValueType.Array:
                {
                    var array = ((StackObject)vs->Ptr.Target).Object as Array;
                    vs->SetValue(type, array.GetValue(vs->Index));
                    break;
                }
                case StackValueType.i4:
                case StackValueType.r4:
                case StackValueType.i8:
                case StackValueType.r8:
                case StackValueType.Ref:
                {
                    break;
                }
                default:
                    throw new NotSupportedException();
            }
        }

        /// <summary>
        /// 存储所提供地址处的对象引用值
        /// </summary>
        /// <param name="type"></param>
        public void Stind(StackValueType type)
        {
            var vs = Stack.Pop(2);
            var vsv = vs + 1;
            switch (vs->ValueType)
            {
                case StackValueType.Array:
                    {
                        var array = ((StackObject)vs->Ptr.Target).Object as Array;
                        array.SetValue(vsv->Value,vs->Index);
                        break;
                    }
                case StackValueType.i4:
                case StackValueType.r4:
                case StackValueType.i8:
                case StackValueType.r8:
                case StackValueType.Ref:
                    {
                        break;
                    }
                default:
                    throw new NotSupportedException();
            }
        }


    }


}
