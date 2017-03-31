using System;
using System.Collections.Generic;
using System.Reflection;
using static ApolloClr.PtrFix;
namespace ApolloClr.Cross
{
    public
#if !JS
        unsafe 
#endif
        class CrossMethod : MethodTasks
    {
        public string CallName { get; set; }

        public ICrossMethodDelegate CrossMethodDelegate { get; set; }

        int ArgCount = 0;

        private bool HaseResult = false;

        private bool IsStatic = false;

        public override void Run()
        {
            var vs = Clr.Argp;
#if JS
            StackObject ptr = vs;
#else
            var ptr =vs->Ptr;
#endif
            //对值对象 赋值
            if (IsStatic)
            {
                object[] args = new object[ArgCount];
                for (int i = 0; i < ArgCount; i++)
                {
                    args[i] = StackObject.ToObject(vs + i);
                }
                CrossMethodDelegate.SetArgs(args);
            }
            else
            {
                object[] args = new object[ArgCount];
                for (int i = 0; i < ArgCount; i++)
                {
                    if (i == 0 )
                    {
                        if (ptr != CrossMethodDelegate.Ptr)
                        {
                            args[ArgCount - 1] = StackObject.ToObject(vs + i);
                        }
                        else
                        {
                            //跳过对象创建
                            //如果在一个对象中重复使用，跳过
                        }
                      
                    }
                    else
                    {
                        args[i-1] = StackObject.ToObject(vs + i);
                    }
                    
                }
                CrossMethodDelegate.SetArgs(args);
                if (!IsStatic && CrossMethodDelegate.Delegate != null)
                {
                    if (ptr != CrossMethodDelegate.Ptr)
                    {
                        CrossMethodDelegate.Ptr = ptr;
                        CrossMethodDelegate.Delegate.SetTarget(args[ArgCount - 1]);
                    }
                    
                }
            }
           
          
            CrossMethodDelegate.Run();
            if (HaseResult)
            {
                Clr.ResultPoint = Clr.Csp;
#if JS
                Clr.ResultPoint.ValueType = StackValueType.Ref;
                Clr.ResultPoint.Ptr = StackObject.NewObject(CrossMethodDelegate.Result);
#else
                Clr.ResultPoint->ValueType = StackValueType.Ref;
                Clr.ResultPoint->Ptr = StackObject.NewObject(CrossMethodDelegate.Result);
#endif
            }
        }

        public CrossMethod()
        {

        }


        public CrossMethod(string callname)
        {
            CallName = callname;

            var values = callname.Split(new string[] {"::", "[", "]", ",", "(", ")"},
                StringSplitOptions.RemoveEmptyEntries);
            var returnType = values[0];
            var assemblyname = values[1];
            var typeName = values[2];
            var methodName = values[3];
            var type = Extensions.GetTypeByName(typeName);
            List<Type> args = new List<Type>();
            for (int i = 4; i < values.Length; i++)
            {
                args.Add(Extensions.GetTypeByName(values[i]));
            }
            var methodInfo = type.GetMethod(methodName, args.ToArray());
            if (methodInfo == null)
            {
                var coninfo = type.GetConstructor(args.ToArray());
                if (coninfo != null)
                {
                    ArgCount = coninfo.GetParameters().Length;
                    HaseResult = true;
                    Clr = new Clr(1, ArgCount, HaseResult, 1);
                    CreatDelegate(coninfo);
                }
                else
                {
                  
                }
            }
            else
            {
                ArgCount = methodInfo.GetParameters().Length;
                HaseResult = methodInfo.ReturnType != typeof(void);
                if (!methodInfo.IsStatic)
                {
                    ArgCount++;
                }
                Clr = new Clr(1, ArgCount, HaseResult, 1);
                CreatDelegate(methodInfo);
            }
            //构建CLR
        
          
        }

        public void CreatDelegate(ConstructorInfo methodInfo)
        {
            var parms = methodInfo.GetParameters();
            var tasktype = typeof(ObjectBuild<>);
            if (parms.Length == 0)
            {
                tasktype = typeof(ObjectBuild<>).MakeGenericType(methodInfo.DeclaringType);

            }
            else
            {
                
            }

            CrossMethodDelegate = Activator.CreateInstance(tasktype) as ICrossMethodDelegate;

        }

        public void CreatDelegate(MethodInfo methodInfo)
        {
            var parms = methodInfo.GetParameters();
            var tasktype = typeof(CrossMethodDelegate);
            var retType = methodInfo.ReturnType;
            if (methodInfo.ReturnType == typeof(void))
            {
                if (parms.Length == 1)
                {
                    tasktype = typeof(CrossMethodDelegate<>).MakeGenericType(parms[0].ParameterType);

                }
                else if (parms.Length == 2)
                {
                    tasktype = typeof(CrossMethodDelegate<,>).MakeGenericType(parms[0].ParameterType,
                        parms[1].ParameterType);

                }
                else if (parms.Length == 3)
                {
                    tasktype = typeof(CrossMethodDelegate<,,>).MakeGenericType(parms[0].ParameterType,
                        parms[1].ParameterType, parms[2].ParameterType);
                }
                else if (parms.Length >= 4)
                {

                }
            }
            else
            {
                if (parms.Length == 0)
                {
                    tasktype = typeof(CrossMethodDelegateRet<>).MakeGenericType(retType);

                }
                else
                {
                    
                }
            }
          

            CrossMethodDelegate = Activator.CreateInstance(tasktype) as ICrossMethodDelegate;
            var funtask = tasktype.GetField("Func").FieldType;
            // 静态
            if (methodInfo.IsStatic)
            {
                var @delage = Delegate.CreateDelegate(funtask,null, methodInfo);
                tasktype.GetField("Func").SetValue(CrossMethodDelegate, @delage);
                IsStatic = true;
            }
            else
            {
                //var obj = Activator.CreateInstance(methodInfo.DeclaringType);
                var @delage = Delegate.CreateDelegate(funtask, null, methodInfo);
                tasktype.GetField("Func").SetValue(CrossMethodDelegate, @delage);
                IsStatic = false;
            }
          


        }

       
    }
}