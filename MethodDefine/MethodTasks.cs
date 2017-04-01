using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using ApolloClr.Method;
using ApolloClr.MethodDefine;

namespace ApolloClr
{
    public class MethodTasks
    {
        public Clr Clr ;
        public List<IOpTask> TaskList = new List<IOpTask>();

        public IOpTask[] Lines;

        public int PC = 0;

        public int End = 0;

        public bool IsEnd = true;

        public Exception TrowException;

        public bool IsCatched = false;

        public virtual string Name { get; set; }
  
        public MethodTasks Compile(Action<IOpTask> OnCallAction = null, Action<IOpTask> OnNewAction=null)
        {
            Lines = TaskList.ToArray();
            foreach (var opTask in Lines)
            {
                if (opTask.OpCode.Op == "call" || opTask.OpCode.Op == "callvirt")
                {
                    OnCallAction?.Invoke(opTask);
                }
                if (opTask.OpCode.Op == "newobj")
                {
                    OnNewAction?.Invoke(opTask);
                }
            }
            End = Lines.Length;
            Clr.DumpAction = (r => PC = r);
            Clr.ThrowAction = ThrowAction;
            
            return this;
        }

     

        /// <summary>
        /// ����һ���쳣
        /// </summary>
        /// <param name="ex"></param>
        public void ThrowAction(object ex,int pc)
        {
            if (pc > 0)
            {
                //������һ���Ƿ���Finally
                if (Lines[PC + 1].OpCode.OpCode == "finally")
                {
                    
                }
                else
                {
                    PC = pc;
                }
            }
            else
            {
                if (ex != null)
                    TrowException = ex as Exception;
                IsCatched = false;
                int nowPc = PC - 1;

                for (int i = PC; i > 0; i--)
                {
                    if (Lines[i].OpCode.Lable == ".try")
                    {
                        var value = Lines[i] as OpCodeTask<int, int, int>;
                        if (nowPc >= value.V1 && nowPc <= value.V2)
                        {
                            //��ת
                            //�����ж� ���ƥ��
                        
                            if (Lines[value.V3].OpCode.OpCode == "catch")
                            {
                                PC = value.V3;
                                IsCatched = true;
                            }
                            else
                            {
                                PC = value.V3;
                            }
                           
                            break;
                            //��ƥ�����Ѱ��
                        }
                    }
                }

            }
           
            
        }

        List<MethodTasks> SubTask= new List<MethodTasks>();
        public virtual MethodTasks Clone()
        {
            var any = SubTask.Find(r => r.IsEnd);
            if (any == null)
            {
                SubTask.Add(CloneOne());
                return SubTask.Last();
            }
            return any;
        }


        protected virtual MethodTasks CloneOne()
        {
            throw new NotSupportedException();
        }

        public virtual void Run()
        {
            //Console.WriteLine("==========Run===========:" + Name);
            PC = 0;
            IsEnd = false;
            while (PC < End)
            {

                //try
                //{
                Lines[PC].Run();

                //}
                //catch (Exception ex)
                //{
                //    Clr.EvaluationStack_Push(0);
                //    ThrowAction(ex, -1);
                //}

                PC++;
            }

            IsEnd = true;
            //Console.WriteLine("==========Run End===========:" + Name);
            if (TrowException != null && !IsCatched)
            {
                //�����������֮����Ȼ���쳣�׳�
                throw TrowException;
            }
        }


      



        public static MethodTasks Build(string codes )
        {
            var list = ILCodeParse.ReadILCodes(codes);
            return Build< MethodTasks>(list);
        }

        public static T Build<T>(List<ILCode> list,
            Dictionary<string,string> localvars=null,
            Dictionary<string, string> pargrams =null,
            bool haseResult = true,
            int maxstack =5)
            where T : MethodTasks ,new()
        {
            var methodDefine = new T()
            {
                Clr =
                    new Clr(localvars == null ? 5 : localvars.Count, pargrams == null ? 5 : pargrams.Count, haseResult,
                        maxstack)
            };

            var clr = methodDefine.Clr;

            foreach (var line in list)
            {
                if (string.IsNullOrEmpty(line.OpCode))
                {
                    continue;
                }
                if (line.OpCode == ".try")
                {

                }
                var opcode = line.OpCode.Replace(".s", "");
                var opcodeValue = opcode.Split('.');
                var baseOp = opcodeValue[0];
                bool longOp = true;

            
                var method = FindMethod1(opcode.Replace(".", "_"));
                //ȫ
              
                if (method == null && baseOp + "_" + line.OpArg0 != opcode.Replace(".", "_"))
                {
                    method = FindMethod1(baseOp + "_" + line.OpArg0);
                    longOp = false;
                    if (method != null)
                        opcodeValue = new string[] {opcodeValue[0] + "_" + opcodeValue[1], opcodeValue[2]};
                }
                
              
                if (method == null)
                {
                    method = FindMethod(baseOp);
                    longOp = false;
                }
                if (method == null)
                {
                    throw new NotImplementedException(line.Line);
                }
                if (opcode.IndexOf(".") == -1 && longOp)
                {
                    longOp = false;
                }
                object[] methodArg = null;
                if (longOp)
                {
                    methodArg = ArgsFix(new string[] { "", line.Arg0, line.Arg1,line.Arg2 }, method,list);
                }
                else
                {
                    var subvalue = new List<string>(opcodeValue);
                    if (method.GetParameters().Length == 3)//�̶���ת
                    {
                        while (subvalue.Count < 3)
                        {
                            subvalue.Add(null);
                        }
                    }
                    subvalue.Add(line.Arg0);
                    subvalue.Add(line.Arg1);
                    subvalue.Add(line.Arg2);
                    methodArg = ArgsFix(subvalue.ToArray(), method,list);
                }
              
                var tasktype = typeof(OpCodeTask);
                var parms = method.GetParameters();
                if (parms.Length > 0)
                {

                    if (
#if BRIDGE
                        false
#else
                        parms.Last().ParameterType.IsByRef
#endif
                        )
                    {
                        if (parms.Length == 1)
                        {
                            tasktype = typeof(OpCodeTaskRef<>).MakeGenericType(
                                parms[0].ParameterType.GetElementType()
                                );

                        }
                        else if (parms.Length == 2)
                        {
                            tasktype = typeof(OpCodeTaskRef<,>).MakeGenericType(
                                parms[0].ParameterType.GetElementType(),
                                parms[1].ParameterType.GetElementType()
                                );

                        }
                        else if (parms.Length == 3)
                        {
                            tasktype = typeof(OpCodeTaskRef<,,>).MakeGenericType(
                                parms[0].ParameterType.GetElementType(),
                                parms[1].ParameterType.GetElementType(),
                                parms[2].ParameterType.GetElementType());
                        }
                        else if (parms.Length == 4)
                        {

                        }
                    }
                    else
                    {
                      
                       
                        {
                            if (parms.Length == 1)
                            {
                                tasktype = typeof(OpCodeTask<>).MakeGenericType(parms[0].ParameterType);

                            }
                            else if (parms.Length == 2)
                            {
                                tasktype = typeof(OpCodeTask<,>).MakeGenericType(parms[0].ParameterType,
                                    parms[1].ParameterType);

                            }
                            else if (parms.Length == 3)
                            {
                                tasktype = typeof(OpCodeTask<,,>).MakeGenericType(parms[0].ParameterType,
                                    parms[1].ParameterType, parms[2].ParameterType);
                            }
                            else if (parms.Length == 4)
                            {

                            }
                        }
                    }
                }
                
              
                var task = Activator.CreateInstance(tasktype) as IOpTask;
             
                task.OpCode = line;

                var funtask = tasktype.GetField("Func").FieldType;
                var gtype = method.GetGenericArguments();
                if(gtype.Length==0)
                {
                    var @delage = Delegate.CreateDelegate(funtask, clr, method);

                    tasktype.GetField("Func").SetValue(task, @delage);
                }
                else
                {
                    if (methodArg.Length<=0 || methodArg[0].GetType() != typeof(Type).GetType())
                    {
                        throw  new Exception("GenericMethod��First Pargram Type Mast Be System.Type!");
                    }
#if BRIDGE
                    throw new NotSupportedException("GenericMethod, In BRIDGE Was Not Supported!");
#else
                    var genmethod = method.MakeGenericMethod(methodArg[0] as Type);

                    var @delage = Delegate.CreateDelegate(funtask, clr, genmethod);
                  
                    tasktype.GetField("Func").SetValue(task, @delage);
#endif
                }
                for (int i = 1; i < 4; i++)
                {
                    var v = tasktype.GetField("V" + i);
                    if (v != null)
                    {
                        v.SetValue(task, methodArg[i - 1]);
                    }
                    else
                    {
                        break;
                    }
                }

                methodDefine.TaskList.Add(task);

            }


            return methodDefine;
        }



        public static object[] ArgsFix(string[] values, MethodInfo methodInfo, List<ILCode> list)
        {
            var parms = methodInfo.GetParameters();
            var args = new object[parms.Length];

            for (int i = 0; i < args.Length; i++)
            {
                if (values.Length > i)
                {
                    var type = parms[i].ParameterType;
#if !BRIDGE
                    if (type.IsByRef)
                    {
                        type = type.GetElementType();
                    }
#endif
                    args[i] = Convert(type, values[i + 1],list);
                }
            }

            return args;
        }

        public static object Convert(Type type, string input, List<ILCode> list)
        {
            if (type == typeof(string) || type ==  typeof(object))
            {
                return input;
            }
            if (type == typeof(int[]))
            {
                var lines = input.Substring(1, input.Length - 2).Split(',');
                var resule = new int[lines.Length];
                for (int i = 0; i < lines.Length; i++)
                {
                    resule[i] = (int) Convert(typeof(int), lines[i], list);
                }
                return resule;
            }
            if (type == typeof(Type))
            {
                return Extensions.GetTypeByName(input);
            }
            if (type.IsEnum)
            {
               var value= Enum.Parse(type, input,true);
                return value;
            }
            else if(type==typeof(float))
            {
                return float.Parse(input);
            }
            else if (type == typeof(double))
            {
                return double.Parse(input);
            }
            else if (type == typeof(int))
            {
                if ( input.StartsWith("IL_"))//��ת����
                {
                    var find = list.FindIndex(r => r.Lable == input);
                    if (find >= 0)
                    {
                        return find - 1; //PC Move֮���++ ������ǰ��һ
                    }
                    else
                    {
                        throw new NotImplementedException();
                    }
                   
                }
                if (input != null)
                {
                    if (input.StartsWith("m") || input.StartsWith("M"))
                    {
                        return -int.Parse(input.Substring(1).Replace("i", "").Replace("V_", ""));
                    }
                    if (input.StartsWith("0x"))
                    {
                        return System.Convert.ToInt32(input, 16);
                    }
                    else
                    {
                         return int.Parse(input.Replace("i", "").Replace("V_", ""));
                    }
                  
                }
                return 0;
            }
            return null;
        }

        public static MethodInfo FindMethod1(string name)
        {
            foreach (var methodInfo in typeof(Clr).GetMethods())
            {
                if (methodInfo.Name.ToLower() == name.ToLower())
                {
                    return methodInfo;
                }
            }

            return null;
        }

        public static MethodInfo FindMethod(string name)
        {
            foreach (var methodInfo in typeof(Clr).GetMethods())
            {
                if (methodInfo.Name.ToLower() == name.ToLower())
                {
                    return methodInfo;
                }
            }

            return null;
        }

    }
}