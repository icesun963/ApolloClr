using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr
{
    /// <summary>
    /// 合并指令
    /// </summary>
    public
#if !JS
        unsafe
#endif
        partial class Clr
    {

#if SPEED
        /// <summary>
        /// 合并指令 把一个值压入局部变量
        /// </summary>
        /// <param name="type">压入类型</param>
        /// <param name="lv">值</param>
        /// <param name="si">局部变量索引</param>
        public virtual void LdcStloc(ref StackValueType vtype,ref object value,ref int si)
        {
            long ptr = 0;
            long* pvalue = &ptr;

            if (value is string)
            {
                var str = value as string;
                switch (vtype)
                {
                    case StackValueType.i8:
                        value = long.Parse(str);
                        *pvalue = (long) value;

                        break;
                    case StackValueType.r8:

                        value = double.Parse(str);

                        break;
                    case StackValueType.i4:

                        if (str.StartsWith("0x"))
                        {
                            value = System.Convert.ToInt32(str, 16);
                        }
                        else if (str.StartsWith("M") || str.StartsWith("m"))
                        {
                            value = (-int.Parse(str));
                        }
                        else
                        {
                            value = int.Parse(str);
                        }

                        break;
                    case StackValueType.r4:

                        value = float.Parse(str);

                        break;
                }
            }

            {
                switch (vtype)
                {
                    case StackValueType.i8:
                       
                        *pvalue = (long)value;
                        break;
                    case StackValueType.r8:
                        {
                            var dv = (double)value;
                            pvalue = (long*)&dv;
                        }
                        break;
                    case StackValueType.i4:
                        {
                            var dv = (int)value;
                            pvalue = (long*)&dv;
                        }
                        break;
                    case StackValueType.r4:
                        {
                            var dv = (float)value;
                            pvalue = (long*)&dv;
                        }
                        break;
                }
            }
            
#if JS
            CallStack[(Csp + si)].IntValue = lv;
#else
            *(long*)(Csp + si)->VPoint = *pvalue;
            (Csp + si)->ValueType = vtype;
#endif

        }


        /// <summary>
        /// 把两个变量 放入 （压入Evaluation Stack中）
        /// </summary>
        /// <param name="i"></param>
        /// <param name="i2"></param>
        public virtual void LdlocLdloc(int i, int i2)
        {

#if JS
            EvaluationStack_Push(CallStack[Csp + i]);
            EvaluationStack_Push(CallStack[Csp + i2]);
#else
            EvaluationStack_Push(Csp + i);
            EvaluationStack_Push(Csp + i2);
#endif
        }

#endif
    }
}