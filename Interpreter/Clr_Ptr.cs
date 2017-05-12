using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ApolloClr.TypeDefine;

namespace ApolloClr
{
    /// <summary>
    /// 指针地址相关
    /// </summary>
    public
#if !JS
        unsafe
#endif
        partial class Clr
    {

        /// <summary>
        /// 将位于指定地址的值类型的每个字段初始化为空引用或适当的基元类型的 0。
        /// </summary>
        public void Initobj<T>(Type type)
            where T : new ()
        {
            var vs = EvaluationStack_Pop();
            var ptr = (IntPtr) vs->Value;
            var sp = (StackItem*) ptr.ToPointer();
            if (type is ClrType)
            {
                var value = sp->Value as ClrObject;
           
                Extensions.BuildClrObject(value, value.DefineType);
            }
            else
            {
                var value = new T();
                sp->SetValue(StackValueType.Ref, value);
            }
        }

        /// <summary>
        /// 查找对象中其引用当前位于计算堆栈的字段的地址。
        /// 1.对象引用 （或指针） 推送到堆栈上。
        /// 2.从堆栈中弹出的对象引用 （或指针）找到的对象中指定的字段的地址。
        /// 3.指定字段的地址推送到堆栈上。
        /// </summary>
        public void Ldflda<T>(Type type,string field)
        {
            var vs = EvaluationStack_Pop();
            var ptr = (IntPtr)vs->Value;
            var sp = (StackItem*)ptr.ToPointer();
            var obj = sp->Value;
            if (obj is ClrObject)
            {
                var value= (obj as ClrObject).GetItemPtr(field);
                EvaluationStack_Push(value);
            }
            else
            {
              
            }
           
        }

        /// <summary>
        /// 将位于特定索引处的局部变量的地址加载到计算堆栈上
        /// </summary>
        /// <param name="i"></param>
        /// <returns></returns>
        public virtual void Ldloca(int i)
        {
          
            IntPtr ptr = (IntPtr)(void*)(Csp + i);
            EvaluationStack_Push(StackValueType.Ptr, ptr);
        }

        /// <summary>
        /// 将提供的值类型的大小（以字节为单位）推送到计算堆栈上。
        /// </summary>
        public void Sizeof<T>(Type type)
        {
            throw new NotImplementedException();
        }

        #region 指针相关 不支持



        /// <summary>
        /// 将位于对象（&、* 或 native int 类型）地址的值类型复制到目标对象（&、* 或 native int 类型）的地址。
        /// </summary>
        public void Cpobj()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 将地址指向的值类型对象复制到计算堆栈的顶部。
        /// </summary>

        public void Ldobj()
        {
            throw new NotImplementedException();
        }


        /// <summary>
        /// 将指定类型的值从计算堆栈复制到所提供的内存地址中。
        /// </summary>
        public void Stobj()
        {
            throw new NotImplementedException();
        }



        /// <summary>
        /// 检索嵌入在类型化引用内的地址（& 类型）。
        /// </summary>
        public void Refanyval()
        {
            throw new NotImplementedException();
        }



        /// <summary>
        /// 指定后面的数组地址操作在运行时不执行类型检查，并且返回可变性受限的托管指针。
        /// </summary>
        public void Readonly()
        {
            throw new NotImplementedException();
        }



        /// <summary>
        /// 将指定数目的字节从源地址复制到目标地址。
        /// </summary>
        public void Cpblk()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 将位于特定地址的内存的指定块初始化为给定大小和初始值。
        /// </summary>
        public void Initblk()
        {
            throw new NotImplementedException();
        }

        #endregion




        /// <summary>
        /// 如果值不是有限数，则引发 ArithmeticException。
        /// </summary>
        public void Ckfinite()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 将对特定类型实例的类型化引用推送到计算堆栈上。
        /// </summary>
        public void Mkrefany()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 将元数据标记转换为其运行时表示形式，并将其推送到计算堆栈上。
        /// </summary>
        public void Ldtoken()
        {
            throw new NotImplementedException();
        }






        /// <summary>
        /// 返回指向当前方法的参数列表的非托管指针。
        /// </summary>
        public void Arglist()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 将指向实现特定方法的本机代码的非托管指针（native int 类型）推送到计算堆栈上。
        /// </summary>
        public void Ldftn()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 将指向实现与指定对象关联的特定虚方法的本机代码的非托管指针（native int 类型）推送到计算堆栈上。
        /// </summary>
        public void Ldvirtftn()
        {
            throw new NotImplementedException();
        }



        /// <summary>
        /// 从本地动态内存池分配特定数目的字节并将第一个分配的字节的地址（瞬态指针，* 类型）推送到计算堆栈上。
        /// </summary>
        public void Localloc()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 将控制从异常的 filter 子句转移回公共语言结构 (CLI) 异常处理程序。
        /// </summary>
        public void Endfilter()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 指示当前位于计算堆栈上的地址可能没有与紧接的 ldind、stind、ldfld、stfld、ldobj、stobj、initblk 或 cpblk 指令的自然大小对齐。
        /// </summary>
        public void Unaligned()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 指定当前位于计算堆栈顶部的地址可以是易失的，并且读取该位置的结果不能被缓存，或者对该地址的多个存储区不能被取消。
        /// </summary>
        public void Volatile()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// 执行后缀的方法调用指令，以便在执行实际调用指令前移除当前方法的堆栈帧。
        /// </summary>
        public void Tail()
        {
            throw new NotImplementedException();
        }


        /// <summary>
        /// 约束要对其进行虚方法调用的类型。
        /// </summary>
        public void Constrained()
        {
            throw new NotImplementedException();
        }


        public void No()
        {
            throw new NotImplementedException();
        }


        /// <summary>
        /// 检索嵌入在类型化引用内的类型标记。
        /// </summary>
        public void Refanytype()
        {
            throw new NotImplementedException();
        }

    }
}
