using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr
{
    public class ClrObject
    {
        /// <summary>
        /// 静态字段
        /// </summary>
        public Dictionary<string, StackItemPtr> Fields { get; set; } = new Dictionary<string, StackItemPtr>();

        public StackItem GetItem(string field)
        {
            var value = field.Split(':').Last();
            return Fields[value].Body;
        }

        public void SetItem(string field, StackItem obj)
        {
            var value = field.Split(':').Last();
            Fields[value].Body = obj;
        }
    }
}
