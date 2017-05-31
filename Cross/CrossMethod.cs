using System;
using System.Collections.Generic;
using System.Reflection;

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

#if DEBUG
        private MethodTasks DebugerMethod { get; set; }

        public override unsafe MethodTasks GetDebuggerMethod()
        {
            if (DebugerMethod != null)
                return DebugerMethod;
            return base.GetDebuggerMethod();
        }
#endif

        public override void Run(Action onRunEnd)
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
                        if (!ptr.IsAllocated || ptr != CrossMethodDelegate.Ptr)
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
#if BRIDGE
                        CrossMethodDelegate["func"] = CrossMethodDelegate.Delegate.SetTarget(args[ArgCount - 1]);
#else
                        CrossMethodDelegate.Delegate.SetTarget(args[ArgCount - 1]);
#endif
                    }
                    
                }
            }
           
          
            CrossMethodDelegate.Run();


            Action endAction = () =>
            {
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

                if (onRunEnd != null)
                {
                    onRunEnd();
                }
            };
#if DEBUG
            if (InDebug)
            {
                if (CrossMethodDelegate.Delegate!=null && CrossMethodDelegate.Delegate.Target is Delegate)
                {
                    var db = ((CrossMethodDelegate.Delegate.Target as Delegate).Target as DelegateBuild);
                    if (db.Method.InDebug && db.Method.DebugerStep != null)
                    {
                        DebugerStep = db.Method.DebugerStep;

                        this.DebugerMethod = db.Method;
                    }

                 
                }
            }


            if (DebugerStep == null)

#endif
            {
                endAction();
            }
           
          
        }

        public CrossMethod()
        {

        }


        public CrossMethod(string callname)
        {
            CallName = callname;

            var values = callname.Split(new string[] {"::",  ",", "(", ")"," "},
                StringSplitOptions.RemoveEmptyEntries);
            var returnType = values[0];
            var typeName = values[1];
            var methodName = values[2];
            int argstart = 3;
            if (typeName == "class")
            {
                typeName = values[2];
                methodName = values[3];
                argstart++;
            }
            var type = Extensions.GetTypeByName(typeName);
            List<Type> args = new List<Type>();
            for (int i = argstart; i < values.Length; i++)
            {
                args.Add(Extensions.GetTypeByName(values[i]));
            }
            var methodInfo = type.GetMethod(methodName, args.ToArray());
           
#if BRIDGE
            if (methodInfo == null)
            {
                methodInfo = type.GetMethodInfo(methodName, args.ToArray());
            }
#endif
            if (methodInfo == null && methodName ==Extensions.STR_CTOR)
            {
                ConstructorInfo coninfo = null;
                

#if !BRIDGE
                coninfo = type.GetConstructor(args.ToArray());
                if (coninfo == null)
                {
                    if (type.GetConstructors().Length == 1)
                    {
                        coninfo = type.GetConstructors()[0];
                    }
                }
#endif
                if (coninfo != null)
                {
                    ArgCount = coninfo.GetParameters().Length;
                    HaseResult = true;
                    Clr = new Clr(1, ArgCount, HaseResult, 1);
                   
                    CreatDelegate(coninfo, type.GenericTypeArguments);
                    return;
                }
                else
                {

#if BRIDGE

                    if (methodName ==    Extensions.STR_CTOR)
                    {
                        //这个无法找到构造函数，只能直接构造了
                        ArgCount = 0;
                        HaseResult = true;
                        Clr = new Clr(1, ArgCount, HaseResult, 1);

                        var tasktype = typeof(ObjectBuild<>).MakeGenericType(type);
                        CrossMethodDelegate = Activator.CreateInstance(tasktype) as ICrossMethodDelegate;
                        return;
                    }

#endif
                    throw new NotSupportedException(callname + " methodInfo or coninfo Mast Be Not Null!");
                }
            }
            if (methodInfo == null)
            {
                methodInfo = type.GetMethod(methodName);
            }
            if (methodInfo != null)
            {
                ArgCount = methodInfo.GetParameters().Length;
                HaseResult = methodInfo.ReturnType != typeof(void);
#if BRIDGE
                if (methodName == "ctor" || methodName ==    Extensions.STR_CTOR)
                {
                    HaseResult = true;
                }
#endif
                if (!methodInfo.IsStatic)
                {
                    ArgCount++;
                }
                Clr = new Clr(1, ArgCount, HaseResult, 1);
                CreatDelegate(methodInfo);
            }
            //构建CLR
            else
            {
                //如果是委托
               

                throw new NotSupportedException(callname + " methodInfo or coninfo Mast Be Not Null!");
            }

        }


        public void CreatDelegate(ConstructorInfo methodInfo, Type[] genTypes)
        {
            var parms = methodInfo.GetParameters();
            var tasktype = typeof(ObjectBuild<>);
            if (parms.Length == 0)
            {
                tasktype = typeof(ObjectBuild<>).MakeGenericType(methodInfo.DeclaringType);

            }
            else if (parms.Length == 2 && parms[1].ParameterType == typeof(IntPtr))
            {
                if (genTypes.Length == 0)
                    tasktype = typeof(DelegateBuild);
                if (genTypes.Length == 1)
                    tasktype = typeof(DelegateBuild<>).MakeGenericType(genTypes);

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
                    throw new NotSupportedException();
                }
            }
            else
            {
                if (parms.Length == 0)
                {
                    tasktype = typeof(CrossMethodDelegateRet<>).MakeGenericType(retType);

                }
                if (parms.Length == 1)
                {
                    tasktype = typeof(CrossMethodDelegateRet<,>).MakeGenericType(retType, parms[0].ParameterType);

                }
                else if (parms.Length == 2)
                {
                    tasktype = typeof(CrossMethodDelegateRet<,,>).MakeGenericType(retType,
                        parms[0].ParameterType,
                        parms[1].ParameterType);

                }
                else if (parms.Length == 3)
                {
                    tasktype = typeof(CrossMethodDelegateRet<,,,>).MakeGenericType(retType,
                        parms[0].ParameterType,
                        parms[1].ParameterType, parms[2].ParameterType);
                }
                else if (parms.Length >= 4)
                {
                    throw new NotSupportedException();
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