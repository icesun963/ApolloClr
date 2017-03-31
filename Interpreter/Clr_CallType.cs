using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr
{

    /// <summary>
    /// 函数调用
    /// </summary>
    public
#if !JS
        unsafe
#endif
        partial class Clr
    {


        /// <summary>
        /// 拷贝当前参数到目标堆栈
        /// </summary>
        /// <param name="clr"></param>
        public void CopyToArgs(Clr clr)
        {
            int count = clr.ArgsVarCount;
            var vs = EvaluationStack_Pop(count);
            for (int i = 0; i < count; i++)
            {
#if JS
                (clr.Argp + i).CopyFrom(vs+ i);
#else
                *(clr.Argp + i) = *(vs + i);
                (clr.Argp + i)->VPoint = &(clr.Argp + i)->IntValue;
#endif
            }

        }



        /// <summary>
        /// 从当前方法返回，并将返回值（如果存在）从调用方的计算堆栈推送到被调用方的计算堆栈上。
        /// </summary>
        public virtual void Ret()
        {
            if (RetResult)
            {
                ResultPoint = EvaluationStack_Pop();
            }

            DumpAction(9999);
        }


        /// <summary>
        /// "IL_0009" : "call" "int32" "ApolloClr.Program::fib(int32)" null
        /// 调用由传递的方法说明符指示的方法
        /// </summary>
        public void Call(string retType, string method, MethodTasks task)
        {
            //如果有新的层级进来
            if (!task.IsEnd)
            {

                var newtask = task.Clone();

                //获取空余方法
                //从堆栈拷贝参数
                if (newtask.Clr.ArgsVarCount > 0)
                {
                    CopyToArgs(newtask.Clr);
                }

                newtask.Run();

                //如果有返回
                if (newtask.Clr.RetResult)
                {
                    //压入返回值
                    EvaluationStack_Push(newtask.Clr.ResultPoint);
                }
            }
            else
            {
                if (task.Clr.ArgsVarCount > 0)
                {
                    CopyToArgs(task.Clr);
                }
                //克隆 对战 并 运行
                task.Run();

                //如果有返回
                if (task.Clr.RetResult)
                {
                    //压入返回值
                    EvaluationStack_Push(task.Clr.ResultPoint);
                }
            }



        }


        /// <summary>
        /// 向公共语言结构 (CLI) 发出信号以通知调试器已撞上了一个断点。
        /// </summary>
        public virtual void Break()
        {

        }

        /// <summary>
        /// 实现跳转表
        /// </summary>
        public void Switch(int[] pcs)
        {
            var vs = EvaluationStack_Pop();
#if JS
            DumpAction(pcs[vs.IntValue]);
#else
            DumpAction(pcs[vs->IntValue]);
#endif
        }

        /// <summary>
        /// 通过调用约定描述的参数调用在计算堆栈上指示的方法（作为指向入口点的指针）。
        /// </summary>
        public void Calli()
        {

        }

        /// <summary>
        /// 对对象调用后期绑定方法，并且将返回值推送到计算堆栈上。
        /// </summary>
        public void Callvirt(string instance,string @return,MethodTasks task)
        {

            Call(null, null, task);
        }


 

        /// <summary>
        /// 创建一个值类型的新对象或新实例，并将对象引用（O 类型）推送到计算堆栈上。
        /// </summary>
        /// <param name="type"></param>
        public void Newobj(string instance,string @return, MethodTasks task)
        {
            task.Run();

            EvaluationStack_Push(task.Clr.ResultPoint);
        }




        /// <summary>
        /// 将位于对象（&、* 或 native int 类型）地址的值类型复制到目标对象（&、* 或 native int 类型）的地址。
        /// </summary>
        public void Cpobj()
        {

        }

        /// <summary>
        /// 将地址指向的值类型对象复制到计算堆栈的顶部。
        /// </summary>

        public void Ldobj()
        {

        }





        /// <summary>
        /// 尝试将引用传递的对象转换为指定的类。
        /// </summary>
        public void Castclass()
        {

        }

        /// <summary>
        /// 测试对象引用（O 类型）是否为特定类的实例。
        /// </summary>
        public void Isinst()
        {

        }


        /// <summary>
        /// 将值类型的已装箱的表示形式转换为其未装箱的形式
        /// </summary>
        public void UnBox<T>(Type type)
        {
            //var vs = EvaluationStack_Pop();
            //EvaluationStack_Push(vs->Value);
        }

        /// <summary>
        /// 将值类型的已装箱的表示形式转换为其未装箱的形式
        /// </summary>
        public void UnBox_Any<T>(Type type)
        {
            //UnBox<T>(type);
        }

        /// <summary>
        /// 将值类转换为对象引用（O 类型）。
        /// </summary>

        public void Box<T>(Type type)
        {
            //var vs = EvaluationStack_Pop();
            //EvaluationStack_Push(vs->Value);
        }




        /// <summary>
        /// 查找对象中其引用当前位于计算堆栈的字段的值。
        /// </summary>
        public void Ldfld()
        {

        }

        /// <summary>
        /// 查找对象中其引用当前位于计算堆栈的字段的地址。
        /// </summary>
        public void Ldflda()
        {

        }

        /// <summary>
        /// 用新值替换在对象引用或指针的字段中存储的值。
        /// </summary>
        public void Stfld()
        {

        }

        /// <summary>
        /// 将静态字段的值推送到计算堆栈上。
        /// </summary>
        public void Ldsfld()
        {

        }

        /// <summary>
        /// 将静态字段的地址推送到计算堆栈上。
        /// </summary>
        public void Ldsflda()
        {

        }

        /// <summary>
        /// 用来自计算堆栈的值替换静态字段的值。
        /// </summary>
        public void Stsfld()
        {

        }

        /// <summary>
        /// 将指定类型的值从计算堆栈复制到所提供的内存地址中。
        /// </summary>
        public void Stobj()
        {

        }



        /// <summary>
        /// 检索嵌入在类型化引用内的地址（& 类型）。
        /// </summary>
        public void Refanyval()
        {

        }

        /// <summary>
        /// 如果值不是有限数，则引发 ArithmeticException。
        /// </summary>
        public void Ckfinite()
        {

        }

        /// <summary>
        /// 将对特定类型实例的类型化引用推送到计算堆栈上。
        /// </summary>
        public void Mkrefany()
        {

        }

        /// <summary>
        /// 将元数据标记转换为其运行时表示形式，并将其推送到计算堆栈上。
        /// </summary>
        public void Ldtoken()
        {

        }



     


        /// <summary>
        /// 返回指向当前方法的参数列表的非托管指针。
        /// </summary>
        public void Arglist()
        {

        }

        /// <summary>
        /// 将指向实现特定方法的本机代码的非托管指针（native int 类型）推送到计算堆栈上。
        /// </summary>
        public void Ldftn()
        {

        }

        /// <summary>
        /// 将指向实现与指定对象关联的特定虚方法的本机代码的非托管指针（native int 类型）推送到计算堆栈上。
        /// </summary>
        public void Ldvirtftn()
        {

        }

    

        /// <summary>
        /// 从本地动态内存池分配特定数目的字节并将第一个分配的字节的地址（瞬态指针，* 类型）推送到计算堆栈上。
        /// </summary>
        public void Localloc()
        {

        }

        /// <summary>
        /// 将控制从异常的 filter 子句转移回公共语言结构 (CLI) 异常处理程序。
        /// </summary>
        public void Endfilter()
        {

        }

        /// <summary>
        /// 指示当前位于计算堆栈上的地址可能没有与紧接的 ldind、stind、ldfld、stfld、ldobj、stobj、initblk 或 cpblk 指令的自然大小对齐。
        /// </summary>
        public void Unaligned()
        {

        }

        /// <summary>
        /// 指定当前位于计算堆栈顶部的地址可以是易失的，并且读取该位置的结果不能被缓存，或者对该地址的多个存储区不能被取消。
        /// </summary>
        public void Volatile()
        {

        }

        /// <summary>
        /// 执行后缀的方法调用指令，以便在执行实际调用指令前移除当前方法的堆栈帧。
        /// </summary>
        public void Tail()
        {

        }

        /// <summary>
        /// 将位于指定地址的值类型的每个字段初始化为空引用或适当的基元类型的 0。
        /// </summary>
        public void Initobj()
        {

        }

        /// <summary>
        /// 约束要对其进行虚方法调用的类型。
        /// </summary>
        public void Constrained()
        {

        }

        /// <summary>
        /// 将指定数目的字节从源地址复制到目标地址。
        /// </summary>
        public void Cpblk()
        {

        }

        /// <summary>
        /// 将位于特定地址的内存的指定块初始化为给定大小和初始值。
        /// </summary>
        public void Initblk()
        {

        }

        public void No()
        {

        }


        /// <summary>
        /// 将提供的值类型的大小（以字节为单位）推送到计算堆栈上。
        /// </summary>
        public void Sizeof()
        {

        }

        /// <summary>
        /// 检索嵌入在类型化引用内的类型标记。
        /// </summary>
        public void Refanytype()
        {

        }

        /// <summary>
        /// 指定后面的数组地址操作在运行时不执行类型检查，并且返回可变性受限的托管指针。
        /// </summary>
        public void Readonly()
        {

        }
    }

}