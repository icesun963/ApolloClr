using System;
using System.Runtime.InteropServices;

namespace ApolloClr
{
    /// <summary>
    /// ����ָ��
    /// </summary>
    public class StackObject
    {
        /// <summary>
        /// ָ���Լ���ָ��
        /// </summary>
        public GCHandle Ptr;

        /// <summary>
        /// ָ��Ķ���
        /// </summary>
        public object Object;



        public StackObject()
        {
            GCHandle handle = GCHandle.Alloc(this);
            IntPtr ptr = GCHandle.ToIntPtr(handle);
            Ptr = handle;
        }

        //TODO ������� ��ֹ�ͷ�

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