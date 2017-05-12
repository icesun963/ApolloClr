using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace ApolloClr.Debugger
{
    public partial class DebuggerMain : Form
    {
        public DebuggerMain()
        {
            InitializeComponent();
        }


        public void TestRun()
        {
            var code = @"

    // [99 9 - 99 10]
    IL_0000: nop          

    // [100 13 - 100 23]
    IL_0001: ldc.i4.1     
    IL_0002: stloc.0      // i

    // [101 13 - 101 23]
    IL_0003: ldc.i4.2     
    IL_0004: stloc.1      // j

    // [102 13 - 102 23]
    IL_0005: ldc.i4.3     
    IL_0006: stloc.2      // k

    // [103 13 - 103 36]
    IL_0007: ldloc.0      // i
    IL_0008: ldloc.1      // j
    IL_0009: add          
    IL_000a: ldloc.2      // k
    IL_000b: add          
    IL_000c: stloc.3      // answer

    // [104 13 - 104 27]
    IL_000d: ldloc.3      // answer
    IL_000e: stloc.s      V_4
    IL_0010: br.s         IL_0012

    // [105 9 - 105 10]
    IL_0012: ldloc.s      V_4
    IL_0014: ret          
	IL_0017: ret
";
            this.richTextBox1.Text = code;
            var func = MethodTasks.Build(code).Compile();
            LoadClr(func);

        }

        public MethodTasks BindMethodTasks { get; set; }

        public IEnumerator<object> Steps { get; set; }

        public void LoadClr(MethodTasks method)
        {
            BindMethodTasks = method;
            this.clirStackViewUI1.LoadStack(method.Clr.Stack);
            Steps = BindMethodTasks.RunStep();
            Steps.MoveNext();
            Log("加载:" + method.Name);
            LoadView();
        }

        public void LoadView()
        {
            this.stackObjectViewUi1.LoadBind(BindMethodTasks.Clr.CallStack.Take(BindMethodTasks.Clr.LocalVarCount).ToArray());
            this.stackObjectViewUi2.LoadBind(BindMethodTasks.Clr.CallStack.Skip(BindMethodTasks.Clr.LocalVarCount).ToArray());
        }

        private void DebuggerMain_Load(object sender, EventArgs e)
        {
            TestRun();
        }

        public void Log(string msg)
        {
            this.richTextBox2.AppendText(msg + "\r\n");
            this.richTextBox2.Select(richTextBox1.TextLength, 0);
            this.richTextBox2.ScrollToCaret();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (!BindMethodTasks.IsEnd)
            {
                Log("执行:" + BindMethodTasks.Lines[BindMethodTasks.PC]);
                Steps.MoveNext();
                
                LoadView();
            }
        }
    }
}
