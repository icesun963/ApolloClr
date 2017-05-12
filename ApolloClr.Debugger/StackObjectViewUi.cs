using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Drawing;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ApolloClr.Debugger
{
    public partial class StackObjectViewUi : UserControl
    {
        public StackObjectViewUi()
        {
            InitializeComponent();
        }


        public StackItem[] BindItems { get; set; }

        public void LoadBind(StackItem[] bindValItems)
        {
            BindItems = bindValItems;

            LoadView();
        }

        public void LoadView()
        {
            this.listView1.Items.Clear();
            foreach (var stackItem in BindItems)
            {
                this.listView1.Items.Add(Build(stackItem));
            }
        }

        public ListViewItem Build(StackItem stackitem)
        {
            var item = new ListViewItem();
            item.Text = stackitem.ValueType + "";
            //item.SubItems.Add(stackitem.ValueType + "");
            item.SubItems.Add(stackitem.Value + "");
            item.SubItems.Add(stackitem.Index + "");
            return item;
        }
    }
}
