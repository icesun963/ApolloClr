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

        public bool IsSub = false;


        public void TestRun(string code)
        {

            srcCode = code;
          
            //textEditorControl1.SetHighlighting("CSharp-Mode");
            File.WriteAllText("il.il",code);
            this.textEditorControl1.LoadFile("il.il");
        
            var func = MethodTasks.Build(code).Compile();
            LoadClr(func);

            
        }

        public MethodTasks BindMethodTasks { get; set; }

        public IEnumerator<object> Steps { get; set; }

        public  void LoadClr(MethodTasks method, IEnumerator<object> inputSteps=null)
        {
            BindMethodTasks = method;
            this.clirStackViewUI1.LoadStack(method.Clr.Stack);

            if (inputSteps == null)
            {
                Steps = BindMethodTasks.RunStep(null);
                Steps.MoveNext();
            }
            else
            {
                Steps = inputSteps;
            }
            Log("加载:" + method.Name);

            if (string.IsNullOrEmpty(srcCode))
            {
                StringBuilder sb = new StringBuilder();
                int line = 0;
                foreach (var opTask in method.Lines)
                {
                  
                 
                    while (line != opTask.OpCode.LineNum)
                    {
                        sb.AppendLine();
                       line++;
                    }
                    line++;
                    sb.AppendLine(opTask.OpCode.Line);
                }

                srcCode = sb.ToString();

                //textEditorControl1.SetHighlighting("CSharp-Mode");
                File.WriteAllText("il.il", srcCode);
                this.textEditorControl1.LoadFile("il.il");
            }
            LoadView();

            MoveCodeLine();

            this.Text += " " + method;
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

                    TextMarker marker = new TextMarker(offset, length, TextMarkerType.SolidBlock, Color.CadetBlue);

                    textEditorControl1.Document.MarkerStrategy.AddMarker(marker);
                    textEditorControl1.ActiveTextAreaControl.ScrollTo(line.LineNum);
                    textEditorControl1.Refresh();
                }
            }
            catch
            {
                
             
            }
        }

        public unsafe void LoadView()
        {
            this.stackObjectViewUi1.LoadBind(BindMethodTasks.Clr.CallStack.Take(BindMethodTasks.Clr.LocalVarCount).ToArray());
            this.stackObjectViewUi2.LoadBind(BindMethodTasks.Clr.CallStack.Skip(BindMethodTasks.Clr.LocalVarCount).ToArray());

            MoveCodeLine();

            this.label1.Text = "Esp:" + Convert.ToString((int) BindMethodTasks.Clr.Stack.Esp, 16) + " EspI:" +
                               BindMethodTasks.Clr.Stack.EspI
                               + " EspMax:" + BindMethodTasks.Clr.Stack.EvaluationStack.Length;
                
        }

        private void DebuggerMain_Load(object sender, EventArgs e)
        {
            string dir = @".\\highlighting\\"; // Insert the path to your xshd-files.
            FileSyntaxModeProvider fsmProvider; // Provider
            if (Directory.Exists(dir))
            {
                fsmProvider = new FileSyntaxModeProvider(dir); // Create new provider with the highlighting directory.
                HighlightingManager.Manager.AddSyntaxModeFileProvider(fsmProvider); // Attach to the text editor.
                textEditorControl1.SetHighlighting("IL"); // Activate the highlighting, use the name from the SyntaxDefinition node.
            }

            if (BindMethodTasks == null)
            {
                //加载DLL
                TypeDefine.AssemblyDefine.ReadAndRun(AppDomain.CurrentDomain.BaseDirectory + "TestLib.dll", "Test", null);


                var method =
                    Extensions.GetTypeDefineByName("TestLib.Test").Methods.Find(r => r.Name.IndexOf("EventTest") >= 0);

                LoadClr(method);
            }
            
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


                while (true)
                {
                    Steps.MoveNext();
                    if (Steps.Current == BindMethodTasks || Steps.Current == null)
                    {
                        break;
                    }
                }


                LoadView();
            }
            else

            if (IsSub)
            {
                Close();
            }
        }

        private void button2_Click(object sender, EventArgs e)
        {
            if (!BindMethodTasks.IsEnd)
            {
                Steps.MoveNext();
                if (Steps.Current != BindMethodTasks && Steps.Current != null)
                {
                    var step = new DebuggerMain();
                    step.LoadClr(Steps.Current as MethodTasks, (Steps.Current as MethodTasks).DebugerStep);
                    step.IsSub = true;
                    step.ShowDialog();
                }
                LoadView();
            }
            else
            if (IsSub)
            {
                Close();
            }
        }

        private void DebuggerMain_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (IsSub)
            {
                if (!BindMethodTasks.IsEnd)
                {
                    while (Steps.MoveNext())
                    {

                    }
                }
             
            }
        }
    }
}
