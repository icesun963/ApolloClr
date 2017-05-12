using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text;
using ApolloClr.Method;
using ApolloClr.MethodDefine;
using ApolloClr.TypeDefine;

namespace ApolloClr
{
    public unsafe class MethodTasks
    {
        public Clr Clr ;
        public List<IOpTask> TaskList = new List<IOpTask>();

        public IOpTask[] Lines;

        private List<ILCode> ILLines;

        private Dictionary<string, string> Localvars = null;
        private Dictionary<string, string> Pargrams = null;

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
        /// 丢出一个异常
        /// </summary>
        /// <param name="ex"></param>
        public void ThrowAction(object ex,int pc)
        {
            if (pc > 0)
            {
                //查找下一行是否是Finally
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
                            //跳转
                            //错误判断 如果匹配
                        
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
                            //不匹配继续寻找
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



        public virtual IEnumerator<object> RunStep()
        {
            PC = 0;
            IsEnd = false;
            while (PC < End)
            {
                yield return null;
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
                //如果发现跳出之后依然有异常抛出
                throw TrowException;
            }

            yield return null;
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
                //如果发现跳出之后依然有异常抛出
                throw TrowException;
            }
        }

        public  virtual void InitMember(ClrObject clrObj)
        {
           
        }

        public static MethodTasks Build(string codes )
        {
            var list = ILCodeParse.ReadILCodes(codes);
            var ret= Build<MethodTasks>(list);
            ret.CompileIL();

            return ret;
        }

        public void CompileIL()
        {
            var clr = this.Clr;

            //如果是对象则进行初始化
            if (Localvars != null)
            {
                var localvars = this.Localvars;
                for (int i = 0; i < localvars.Count; i++)
                {
                    var typeDefine = Extensions.GetTypeDefineByName(localvars["V_" + i]);
                    if (typeDefine == null)
                    {
                        var type = Extensions.GetTypeByName(localvars["V_" + i]);
                        //if (type.IsClass)
                        //{
                        //    (clr.Csp + i)->ValueType = StackValueType.Ref;
                        //}
                        //非基础类型
                        if (!type.IsBaseType())
                        {
                            (clr.Csp + i)->ValueType = StackValueType.Ref;
                        }
                    }
                    else
                    {
                        var clrobj = new ClrObject(typeDefine.ClrType);

                        (clr.Csp + i)->SetValue(StackValueType.Ref, clrobj);
                        (clr.Csp + i)->ValueType = StackValueType.Ref;
                    }
                }
            }
            var list = ILLines;
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
                //全

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
                    methodArg = ArgsFix(new string[] {"", line.Arg0, line.Arg1, line.Arg2}, method, list);
                }
                else
                {
                    var subvalue = new List<string>(opcodeValue);
                    if (method.GetParameters().Length == 3) //固定跳转
                    {
                        while (subvalue.Count < 3)
                        {
                            subvalue.Add(null);
                        }
                    }
                    subvalue.Add(line.Arg0);
                    subvalue.Add(line.Arg1);
                    subvalue.Add(line.Arg2);
                    methodArg = ArgsFix(subvalue.ToArray(), method, list);
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
                if (gtype.Length == 0)
                {
                    var @delage = Delegate.CreateDelegate(funtask, clr, method);

                    tasktype.GetField("Func").SetValue(task, @delage);
                }
                else
                {
                    if (methodArg.Length <= 0 ||
                        (
                            methodArg[0].GetType() != typeof(Type).GetType()
                            &&
                            methodArg[0].GetType() != typeof(ClrType)
                            ) 

                        )
                    {
                        throw new Exception("GenericMethod，First Pargram Type Mast Be System.Type!");
                    }
#if BRIDGE
                    throw new NotSupportedException("GenericMethod, In BRIDGE Was Not Supported!");
#else
                    if (methodArg[0].GetType() == typeof(ClrType))
                    {
                        var genmethod = method.MakeGenericMethod(typeof(ClrType));

                        var @delage = Delegate.CreateDelegate(funtask, clr, genmethod);

                        tasktype.GetField("Func").SetValue(task, @delage);
                    }
                    else
                    {
                        var genmethod = method.MakeGenericMethod(methodArg[0] as Type);

                        var @delage = Delegate.CreateDelegate(funtask, clr, genmethod);

                        tasktype.GetField("Func").SetValue(task, @delage);
                    }
                 
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

                this.TaskList.Add(task);

            }
        }

        public static T Build<T>(List<ILCode> list,
            Dictionary<string, string> localvars = null,
            Dictionary<string, string> pargrams = null,
            bool haseResult = true,
            int maxstack = 5,
            bool isstatic =true
            )
            where T : MethodTasks, new()
        {
            var pcount = pargrams == null ? 5 : pargrams.Count;
            if (!isstatic)
            {
                pcount++;
            }

            var methodDefine = new T()
            {
                Clr =
                   new Clr(localvars == null ? 5 : localvars.Count, pcount, haseResult,
                       maxstack)

               
            };
            
            methodDefine.ILLines = list;
            methodDefine.Localvars = localvars;
            methodDefine.Pargrams = pargrams;
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
                    args[i] = Extensions.Convert(type, values[i + 1],list);
                }
            }

            return args;
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