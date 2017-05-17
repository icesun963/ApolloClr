using System;
using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices;

namespace ApolloClr
{
    /// <summary>
    /// 对象指针
    /// </summary>
    [DebuggerDisplay("Ptr = {PtrNum}")]
    public class StackObject
    {

#if !JS
        /// <summary>
        /// 指向自己的指针
        /// </summary>
        public GCHandle Ptr;

        public object PtrNum
        {
            get
            {
               return GCHandle.ToIntPtr(Ptr).ToInt32();
            }
        }
#endif
        /// <summary>
        /// 指向的对象
        /// </summary>
        public object Object;





        public StackObject()
        {
#if !JS
            GCHandle handle = GCHandle.Alloc(this);
            IntPtr ptr = GCHandle.ToIntPtr(handle);
            Ptr = handle;
#endif
        }

        //TODO 对象管理 防止释放
#if !JS
        public static GCHandle NewObject(object obj)
        {
            var so = new StackObject()
            {
                Object = obj
            };
            return so.Ptr;
        }

        public static StackObject GetStackObject(GCHandle prt)
        {
            return prt.Target as StackObject;
            //var handle = GCHandle.FromIntPtr(prt);
            //return handle.Target as StackObject;
        }

        public static unsafe object ToObject(StackItem* stackItem)
        {
            switch (stackItem->ValueType)
            {
                case StackValueType.i4:
                    return stackItem->IntValue;
                case StackValueType.r4:
                    return stackItem->ValueFloat;
                case StackValueType.i8:
                    return stackItem->ValueLong;
                case StackValueType.r8:
                    return stackItem->ValueDouble;
                case StackValueType.Ref:
                    if (stackItem->Ptr.IsAllocated)
                        return GetStackObject(stackItem->Ptr).Object;
                    return null;
            }

            return null;
        }
#else
        public static implicit operator StackObject(StackItem ptr)
        {
            StackItem sitem = ptr;
            return sitem.Ptr;
        }

        public static implicit operator StackObject(int ptr)
        {
            StackItem sitem = ptr;
            return sitem.Ptr;
        }

        public static StackObject NewObject(object obj)
        {
            var so = new StackObject()
            {
                Object = obj
            };
            return so;
        }

        public static StackObject GetStackObject(object prt)
        {
            return prt as StackObject;
        }

        public static  object ToObject(StackItem stackItem)
        {
            switch (stackItem.ValueType)
            {
                case StackValueType.i4:
                    return stackItem.IntValue;
                case StackValueType.r4:
                    return stackItem.ValueFloat;
                case StackValueType.i8:
                    return stackItem.ValueLong;
                case StackValueType.r8:
                    return stackItem.ValueDouble;
                case StackValueType.Ref:
                    return GetStackObject(stackItem.Ptr).Object;
            }

            return null;
        }

#endif


    }
}