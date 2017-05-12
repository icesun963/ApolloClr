using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using ApolloClr.TypeDefine;

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
                //如果是非静态
                //把先吧对象压入栈

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
            //TODO 
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
            if (task.Clr.ArgsVarCount > 0)
            {
                //初始化
                task.Clr.Argp->ValueType = StackValueType.Ref;
                var clrObj = new ClrObject();
                task.InitMember(clrObj);
              
                task.Clr.Argp->SetValue(StackValueType.Ref, clrObj);
            }
        
            task.Run();
            EvaluationStack_Push(task.Clr.ResultPoint);
        }








        /// <summary>
        /// 尝试将引用传递的对象转换为指定的类。
        /// </summary>
        public void Castclass()
        {
            //TODO 
        }



        /// <summary>
        /// 测试对象引用（O 类型）是否为特定类的实例。
        /// 推送空或引用到堆栈上
        /// </summary>
        public void Isinst<T>(Type type)
        {
            var vs = EvaluationStack_Pop();
            var result = false;
            if (type is ClrType)
            {
                result = (type as ClrType).Is(vs->Value);
            }
            else
            {
                result = (vs->Value is T);
            }
            if (!result)
            {
                Ldnull();
            }
            else
            {
                //丢回去
                EvaluationStack_Push(vs);
            }
          
        }


        /// <summary>
        /// 将值类型的已装箱的表示形式转换为其未装箱的形式
        /// 不理他
        /// </summary>
        public void UnBox<T>(Type type)
        {
            //var vs = EvaluationStack_Pop();
            //EvaluationStack_Push(vs->Value);
        }

        /// <summary>
        /// 将值类型的已装箱的表示形式转换为其未装箱的形式
        /// 不理他
        /// </summary>
        public void UnBox_Any<T>(Type type)
        {
            //UnBox<T>(type);
        }

        /// <summary>
        /// 将值类转换为对象引用（O 类型）。
        /// 不理他
        /// </summary>

        public void Box<T>(Type type)
        {
            //var vs = EvaluationStack_Pop();
            //EvaluationStack_Push(vs->Value);
        }




        /// <summary>
        /// 查找对象中其引用当前位于计算堆栈的字段的值。
        /// </summary>
        public void Ldfld(Type type, string name)
        {
            var vs = EvaluationStack_Pop();
            var v1 = (vs)->Value;
            if (v1 is ClrObject)
            {
                var s = (v1 as ClrObject).GetItemValue(name);
                EvaluationStack_Push(s);
            }
            else
            {

            }
        }


        /// <summary>
        /// 用新值替换在对象引用或指针的字段中存储的值。
        /// </summary>
        public void Stfld(Type type, string name)
        {
            var vs = EvaluationStack_Pop(2);
            var v1 = (vs)->Value;

            if (v1 is IntPtr)
            {
                var ptr = (IntPtr)v1;
                var sp = (StackItem*)ptr.ToPointer();
                var value = sp->Value;
                if (value is ClrObject)
                {
                    (value as ClrObject).SetItemValue(name, *(vs + 1));
                }
                else
                {
                    
                }
            }

            else if (v1 is ClrObject)
            {
                (v1 as ClrObject).SetItemValue(name, *(vs+1));
            }
            else
            {

            }

        }

        /// <summary>
        /// 将静态字段的值推送到计算堆栈上。
        /// </summary>
        public void Ldsfld( Type type, StackItemPtr stackObject)
        {
            EvaluationStack_Push(stackObject.Body);
        }

        /// <summary>
        /// 将静态字段的地址推送到计算堆栈上。
        /// </summary>
        public void Ldsflda(Type type, StackItemPtr stackObject)
        {
            EvaluationStack_Push(stackObject.Body);
        }

        /// <summary>
        /// 用来自计算堆栈的值替换静态字段的值。
        /// </summary>
        public void Stsfld( Type type, StackItemPtr stackObject)
        {
            var vs = EvaluationStack_Pop();
            stackObject.Body = *vs;
            stackObject.Body.Fix();
        }



    }

}