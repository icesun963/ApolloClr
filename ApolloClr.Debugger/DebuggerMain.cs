using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using ICSharpCode.TextEditor.Document;

namespace ApolloClr.Debugger
{
    public partial class DebuggerMain : Form
    {
        public DebuggerMain()
        {
            InitializeComponent();
        }

        public string srcCode = "";


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

            srcCode = code;
            string dir = @".\\highlighting\\"; // Insert the path to your xshd-files.
            FileSyntaxModeProvider fsmProvider; // Provider
            if (Directory.Exists(dir))
            {
                fsmProvider = new FileSyntaxModeProvider(dir); // Create new provider with the highlighting directory.
                HighlightingManager.Manager.AddSyntaxModeFileProvider(fsmProvider); // Attach to the text editor.
                textEditorControl1.SetHighlighting("IL"); // Activate the highlighting, use the name from the SyntaxDefinition node.
            }
            //textEditorControl1.SetHighlighting("CSharp-Mode");
            File.WriteAllText("il.il",code);
            this.textEditorControl1.LoadFile("il.il");
        
            var func = MethodTasks.Build(code).Compile();
            LoadClr(func);

            MoveCodeLine();
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


        public void MoveCodeLine()
        {
        
            try
            {
                var line = BindMethodTasks.Lines[BindMethodTasks.PC].OpCode;
                Log("执行:" + BindMethodTasks.Lines[BindMethodTasks.PC]);
                if (line.Lable != null)
                {
                    int offset = srcCode.IndexOf(line.Lable + ":");
                    int length = line.Line.Length;

                    textEditorControl1.Document.MarkerStrategy.RemoveAll((r) =>
                    {
                        return true;
                    });

                    TextMarker marker = new TextMarker(offset, length, TextMarkerType.SolidBlock, Color.Red);

                    textEditorControl1.Document.MarkerStrategy.AddMarker(marker);
                    textEditorControl1.ActiveTextAreaControl.ScrollTo(line.LineNum);
                    textEditorControl1.Refresh();
                }
            }
            catch
            {
                
             
            }
        }

        public void LoadView()
        {
            this.stackObjectViewUi1.LoadBind(BindMethodTasks.Clr.CallStack.Take(BindMethodTasks.Clr.LocalVarCount).ToArray());
            this.stackObjectViewUi2.LoadBind(BindMethodTasks.Clr.CallStack.Skip(BindMethodTasks.Clr.LocalVarCount).ToArray());

            MoveCodeLine();
        }

        private void DebuggerMain_Load(object sender, EventArgs e)
        {
            TestRun();
        }

        public void Log(string msg)
        {
            this.richTextBox2.AppendText(msg + "\r\n");
            this.richTextBox2.Select(richTextBox2.TextLength, 0);
            this.richTextBox2.ScrollToCaret();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            if (!BindMethodTasks.IsEnd)
            {
                
                Steps.MoveNext();
                
                LoadView();
            }
        }
    }
}
