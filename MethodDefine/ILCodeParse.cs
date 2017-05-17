using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr.Method
{
    public class ILCodeParse
    {
        public static List<ILCode> ReadILCodes(string ilcodes, List<string> locals = null, List<string> args = null)
        {
            var lines = ilcodes.Split('\r');
            return ReadILCodes(lines);
        }

        public static List<ILCode> ReadILCodes(string[] lines, List<string> locals = null, List<string> args = null)
        {


            var list = new List<ILCode>();
            //重置堆栈
            list.Add(new ILCode()
            {
                OpCode = "Reset",
                Line = "Reset",
            });

    
            bool switchStart = false;
            StringBuilder sline = new StringBuilder();

            int linenum = 0;
            foreach (var xline in lines)
            {
                linenum++;
                var line = xline.Trim();

                if (line.Length > 0)
                {
                    while (true)
                    {
                        var oldlenght = line.Length;
                        line = line.Replace("  ", " ")
                                   .Replace("native ", "native_")
                                   .Replace("!0","")
                            ;
                        if (oldlenght == line.Length)
                        {
                            break;
                        }
                    }
                }



                if (string.IsNullOrEmpty(line) || line.StartsWith("//"))
                {
                    continue;
                }
                if (line.IndexOf("//") > 0)
                {
                    line = line.Substring(0, line.IndexOf("//"));
                }
                var values = line.Trim().Split(' ');

                if (values.Length >= 2 && values[1] == "switch")
                {
                    switchStart = true;
                    sline = new StringBuilder();

                }
                if (switchStart)
                {
                    sline.Append(line);
                    if (line.EndsWith(")"))
                    {
                        switchStart = false;
                        line = sline.ToString();
                        values = line.Trim().Split(' ');
                    }
                    else
                    {
                        continue;
                    }
                }




             
                {
                    //如果是字符串
                    int index = line.IndexOf("\"");
                    int indexe = line.LastIndexOf("\"");
                    if (indexe != -1 && index != -1)
                    {
                        var str = line.Substring(index + 1, indexe - index - 1);
                        var subline = line.Substring(0, index + 1) + "str" + line.Substring(indexe);
                        values = subline.Trim().Split(' ');
                        var indexx = new List<string>(values).IndexOf("\"str\"");
                        values[indexx] = str;
                    }
                }


                if (line.EndsWith(","))
                {
                    sline= new StringBuilder();
                    sline.Append(line);
                    continue;
                }
                if (sline.Length > 0)
                {
                    sline.Append(line);
                    if (line.EndsWith(")"))
                    {
                        line = sline.ToString();
                        sline = new StringBuilder();
                         values = line.Trim().Split(' ');
                    }
                }
                if (values.Length > 4)
                {
                    for (int i = 5; i < values.Length; i++)
                    {
                        values[4] += " " + values[i];
                    }
                }
                var illine = new ILCode();
                illine.LineNum = linenum;
                illine.Line = line;
                if (list.Count > 0 &&
                    (list.Last().OpCode == "try" || list.Last().OpCode == "catch" || list.Last().OpCode == "finally"))
                {
                    list.Last().Arg1 = line;
                }

                list.Add(illine);

                for (int i = 0; i < values.Length; i++)
                {
                    if (i == 0)
                    {
                        illine.Lable = values[0].Replace(":", "");

                    }
                    if (i == 1)
                    {
                        illine.OpCode = values[1];
                        var opcodeValue = illine.OpCode.Split('.');
                        illine.Op = opcodeValue[0];
                        if (opcodeValue.Length >= 2)
                        {
                            illine.OpArg0 = opcodeValue[1];
                        }
                        if (opcodeValue.Length >= 3)
                        {
                            illine.OpArg1 = opcodeValue[2];

                        }
                    }
                    if (i == 2)
                    {
                        illine.Arg0 = values[2];
                    }
                    if (i == 3)
                    {
                        illine.Arg1 = values[3];
                    }
                    if (i == 4)
                    {
                        illine.Arg2 = values[4];
                    }
                  
                }


            }
            list = FixTryCatchFinally(list);
            //解析 生成
            //list = MergeCodes(list, locals, args);
            return list;
        }


        public static List<ILCode> FixTryCatchFinally(List<ILCode> input)
        {
            Stack<ILCode> stack = new Stack<ILCode>();
            ILCode lastTry = null;
            for (int i = 0; i < input.Count; i++)
            {
                if (input[i].Line == null)
                {
                    continue;
                }
                if (input[i].Line == ".try" || input[i].Line.StartsWith("catch") || input[i].Line.StartsWith("finally"))
                {
                    input[i].Arg0 = input.Skip(i).First(r => r.Lable != null && r.Lable.StartsWith("IL")).Lable;
                    stack.Push(input[i]);
                    input[i].OpCode = input[i].Lable;
                    if (input[i].Line == ".try")
                    {

                    }
                    else
                    {
                        lastTry.Arg2 = input[i].Arg0;
                    }
                }
                if (input[i].Line.StartsWith("}"))
                {
                    var item = stack.Pop();
                    item.Arg1 = input.Take(i).Last(r => r.Lable != null && r.Lable.StartsWith("IL")).Lable;
                    if (item.Line == ".try")
                    {
                        lastTry = item;
                    }
                    else
                    {

                    }
                }
            }
            foreach (var ilCode in input.ToArray())
            {
                if(ilCode.Line.EndsWith("call instance void [mscorlib]System.Object::.ctor()"))
                {
                    ilCode.Op = ilCode.OpCode = "Pop";
                    ilCode.Arg0 = "0";
                    //ilCode.Op = ilCode.OpCode = "nop";
                    //把自己压入栈
                    //ilCode.Op = ilCode.OpCode = "ldarg";
                    //ilCode.Arg0 = "0";
                }
                if (ilCode.Line.StartsWith("{")
                    || ilCode.Line.StartsWith("}")
                    || string.IsNullOrEmpty(ilCode.Line)
                    )
                {
                    input.Remove(ilCode);
                }
            }

            return input;
        }




        /// <summary>
        /// 指令优化，合并指令
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public static List<ILCode> MergeCodes(List<ILCode> input, List<string> locals = null, List<string> args = null)
        {
            List<ILCode> outPut = new List<ILCode>();
            var opSpeed = new List<string>(new string[] {"add", "sub", "mul", "div"});
            for (int i = 0; i < input.Count; i++)
            {
                var now = input[i];
                //if (now.OpCode == "nop")
                //{
                //    continue;
                //}
                if (i > 2 && i < input.Count - 2)
                {
                    var before2 = input[i - 1 - 1];
                    var before = input[i - 1];
                    var next = input[i + 1];
                    var newx2 = input[i + 1 + 1];
                    if (opSpeed.Contains(now.Op) && locals != null)
                    {
                        if (before2.Op == "ldc")
                        {
                            now.OpCode += "." + before2.OpArg0;
                        }
                        else if (before.Op == "ldc")
                        {
                            now.OpCode += "." + before.OpArg0;
                        }
                        else if (before2.Op == "ldloc")
                        {
                            now.OpCode += "." + locals[int.Parse(before2.OpArg0)];
                        }
                        else if (before.Op == "ldloc")
                        {
                            now.OpCode += "." + locals[int.Parse(before.OpArg0)];
                        }
                        else if (before2.Op == "ldarg")
                        {
                            now.OpCode += "." + args[int.Parse(before2.OpArg0)];
                        }
                        else if (before.Op == "ldarg")
                        {
                            now.OpCode += "." + args[int.Parse(before.OpArg0)];
                        }
                    }
                }
                if (i < input.Count - 2)
                {

                    var next = input[i + 1];
                    var newx2 = input[i + 1 + 1];
#if SPEED
                    if (now.Op == "ldc" && next.Op == "stloc")
                    {
                        var opcode = new ILCode()
                        {
                            OpCode = "LdcStloc",
                            Arg0 = now.OpArg0,
                            Arg1 = now.OpArg1 == null ? now.Arg0 : now.OpArg1,
                            Arg2 = next.OpArg0,
                            Lable = now.Lable,
                            Line =  now.Line + " " + next.Line
                        };
                        opcode.Op = opcode.OpCode;
                        i++;
                        outPut.Add(opcode);
                        continue;
                    }
                    if (now.Op == "ldloc" && next.Op == "ldloc")
                    {
                        var opcode = new ILCode()
                        {
                            OpCode = "ldlocldloc",
                            Arg0 = now.OpArg0,
                            Arg1 = next.OpArg0,
                            Lable = now.Lable,
                            Line = now.Line + " " + next.Line
                        };
                        i++;
                        outPut.Add(opcode);
                        continue;
                    }

#endif
                }

                outPut.Add(now);
            }

            return outPut;
        }
    }


  
}
