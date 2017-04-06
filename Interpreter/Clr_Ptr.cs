using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr.Interpreter
{
    /// <summary>
    /// 指针地址相关，不支持
    /// </summary>
    public
#if !JS
        unsafe
#endif
        partial class Clr
    {
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
        /// 将位于指定地址的值类型的每个字段初始化为空引用或适当的基元类型的 0。
        /// </summary>
        public void Initobj()
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
        /// 将提供的值类型的大小（以字节为单位）推送到计算堆栈上。
        /// </summary>
        public void Sizeof()
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
    }
}
