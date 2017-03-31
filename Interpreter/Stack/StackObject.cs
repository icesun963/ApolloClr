using System;
using System.Runtime.InteropServices;

namespace ApolloClr
{
    /// <summary>
    /// 对象指针
    /// </summary>
    public class StackObject
    {
        /// <summary>
        /// 指向自己的指针
        /// </summary>
        public GCHandle Ptr;

        /// <summary>
        /// 指向的对象
        /// </summary>
        public object Object;



        public StackObject()
        {
            GCHandle handle = GCHandle.Alloc(this);
            IntPtr ptr = GCHandle.ToIntPtr(handle);
            Ptr = handle;
        }

        //TODO 对象管理 防止释放

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
                    return GetStackObject(stackItem->Ptr).Object;
            }

            return null;
        }
    }
}