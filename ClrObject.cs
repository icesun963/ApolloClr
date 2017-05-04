using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ApolloClr.TypeDefine;

namespace ApolloClr
{

    public unsafe class ClrObject
    {
        /// <summary>
        /// 静态字段
        /// </summary>
        public Dictionary<string, StackItemPtr> Fields { get; set; } = new Dictionary<string, StackItemPtr>();



        public ClrType DefineType { get; set; }

        public ClrObject(ClrType type)
        {
            Extensions.BuildClrObject(this, type, false);
        }
        public ClrObject()
        {

        }

 
        public IntPtr GetItemPtr(string field)
        {
            var value = field.Split(':').Last();
            //获得指针
            fixed (StackItem* ptr = &Fields[value].Body)
            {
                return (IntPtr) (void*) ptr;
            }
        }

        public StackItem GetItemValue(string field)
        {
            var value = field.Split(':').Last();
            //获得指针
            return Fields[value].Body;
        }

        public void SetItemValue(string field, StackItem obj)
        {
            var value = field.Split(':').Last();
            //替换值
            obj.Fix();
            Fields[value].Body = obj;
        }
    }
}
