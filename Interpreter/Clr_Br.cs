using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr
{
    public
#if !JS
        unsafe 
#endif
        partial class Clr
    {


        /// <summary>
        /// 无条件地将控制转移到目标指令（短格式）。
        /// </summary>
        /// <param name="lable"></param>
        public virtual void Br(string n1, string n2, int pc)
        {
            DumpAction(pc);
        }


        /// <summary>
        /// 如果 value 为 false、空引用或零，则将控制转移到目标指令。
        /// </summary>

        public virtual void Brfalse(string n1, string n2, int pc)
        {
            var vs = EvaluationStack_Pop();
#if JS
            if (vs.IntValue != 1)
#else
            if (vs->IntValue != 1)
#endif
            {
                DumpAction(pc);
            }
        }

        /// <summary>
        /// 如果 value 为 true、非空或非零，则将控制转移到目标指令（短格式）。
        /// </summary>
        public virtual void Brtrue(string n1, string n2, int pc)
        {
            var vs = EvaluationStack_Pop();
#if JS
            if (vs.IntValue == 1)
#else
            if (vs->IntValue == 1)
#endif
            {
                DumpAction(pc);
            }
        }



        /// <summary>
        /// 如果两个值相等，则将控制转移到目标指令（短格式）。
        /// </summary>
        public virtual void Beq(string n1, string n2, int pc)
        {
            var vs = EvaluationStack_Pop(2);
#if JS
            if (vs==vs+1)
#else
            if (*vs == *(vs + 1))
#endif
            {
                DumpAction(pc);
            }
        }

        /// <summary>
        /// 如果第一个值大于或等于第二个值，则将控制转移到目标指令（短格式）。
        /// </summary>
        public virtual void Bge(string n1, string n2, int pc)
        {
            var vs = EvaluationStack_Pop(2);
#if JS
            if (vs >= vs+1)
#else
            if (*(vs) >= *(vs + 1))
#endif
            {
                DumpAction(pc);
            }
        }

        /// <summary>
        /// 如果第一个值大于第二个值，则将控制转移到目标指令（短格式）。
        /// </summary>
        public virtual void Bgt(string n1, string n2, int pc)
        {
            var vs = EvaluationStack_Pop(2);
#if JS
            if (vs > vs+1)
#else
            if (*(vs) > *(vs + 1))
#endif
            {
                DumpAction(pc);
            }
        }

        /// <summary>
        /// 如果第一个值小于或等于第二个值，则将控制转移到目标指令（短格式）。
        /// </summary>
        public virtual void Ble(string n1, string n2, int pc)
        {
            var vs = EvaluationStack_Pop(2);
#if JS
            if (vs <= vs+1)
#else
            if (*(vs) <= *(vs + 1))
#endif
            {
                DumpAction(pc);
            }
        }

        /// <summary>
        /// 如果第一个值小于第二个值，则将控制转移到目标指令（短格式）。
        /// </summary>
        public virtual void Blt(string n1, string n2, int pc)
        {
            var vs = EvaluationStack_Pop(2);
#if JS
            if (vs < vs+1)
#else
            if (*(vs) < *(vs + 1))
#endif
            {
                DumpAction(pc);
            }
        }

        /// <summary>
        /// 引发当前位于计算堆栈上的异常对象。
        /// </summary>
        public void Throw()
        {
            var vs = EvaluationStack_Pop();
            EvaluationStack_Push(vs);
#if JS
            ThrowAction(vs.Value, -1);
#else
            ThrowAction(vs->Value,-1);
#endif
        }

        /// <summary>
        /// 再次引发当前异常。
        /// </summary>
        public void Rethrow()
        {
            EvaluationStack_Push(0);
            ThrowAction(null, -1);
        }

        /// <summary>
        /// 退出受保护的代码区域，无条件将控制转移到特定目标指令。
        /// </summary>
        public void Leave(int i)
        {
            ThrowAction(null, i);
        }

        public virtual void _Try(int spc,int epc,int pcs)
        {
            
        }

        public virtual void Catch(int spc, int epc)
        {
            DumpAction(epc);
        }

        public virtual void Finally(int spc, int epc)
        {

        }

        /// <summary>
        /// 将控制从异常块的 fault 或 finally 子句转移回公共语言结构 (CLI) 异常处理程序。
        /// </summary>
        public void Endfinally()
        {

        }

    }
}
