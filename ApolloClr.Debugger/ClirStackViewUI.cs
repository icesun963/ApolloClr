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
    public partial class ClirStackViewUI : UserControl
    {
        public ClirStackViewUI()
        {
            InitializeComponent();
        }


        public ClrStack BindView { get; set; }



        private void BindView_PropertyChanged(object sender, PropertyChangedEventArgs e)
        {
            LoadView();
            
        }

        public void LoadView()
        {
            this.listView1.Items.Clear();
            foreach (var stackItem in BindView.EvaluationStack)
            {
                if (this.listView1.Items.Count >= BindView.EspI)
                {
                    break;
                }
                this.listView1.Items.Add(Build(stackItem));
            }

         
        }

        public ListViewItem Build(StackItem stackitem)
        {
            var item =new ListViewItem();
            item.Text = stackitem.ValueType + "";
            //item.SubItems.Add(stackitem.ValueType + "");
            item.SubItems.Add(stackitem.Value + "");
            item.SubItems.Add(stackitem.Index + "");
            return item;
        }

        public void LoadStack(ClrStack stack)
        {
            BindView = stack;
            BindView.PropertyChanged += BindView_PropertyChanged;
            LoadView();
        }
    }


}
