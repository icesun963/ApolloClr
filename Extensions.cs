using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
#if !JS
using System.Reflection.Emit;
#endif
using System.Text;
using System.Threading.Tasks;
using ApolloClr.TypeDefine;
using SilAPI;

namespace ApolloClr
{
    public unsafe static class Extensions
    {
        private static Action<object, object> DeleageSetFun = null;

        public static Delegate SetTarget(this Delegate @delegate, object target)
        {

#if !BRIDGE
            if (DeleageSetFun == null)
            {
                 BindingFlags flag = BindingFlags.Instance | BindingFlags.NonPublic;

                 var xfield = @delegate.GetType().GetField("_target", flag);


                if (xfield == null)
                {
                    throw new NotSupportedException("_target field was not found!");
                }
                DeleageSetFun = GetFSet(xfield);
             }
            DeleageSetFun(@delegate, target);

#else
            var _old = @delegate;
            Func<object> action = () =>
            {
                target["$scope"] = target;
                return Apply(_old, target);
            };
            @delegate = action;
#endif

            return @delegate;

        }

        public static void BuildClrObject(ClrObject clrObject, DisassembledClass typeDefinition, bool isstatic = false)
        {

            foreach (var disassembledField in typeDefinition.Fields)
            {
                if (isstatic && disassembledField.Modifiers.Contains("static"))
                {

                    if (!clrObject.Fields.ContainsKey(disassembledField.ShortName))
                    {

                        clrObject.Fields[disassembledField.ShortName] = new StackItemPtr();
                    }
                }
                if (!isstatic && !disassembledField.Modifiers.Contains("static"))
                {
                    if (!clrObject.Fields.ContainsKey(disassembledField.ShortName))
                    {

                        clrObject.Fields[disassembledField.ShortName] = new StackItemPtr();
                    }
                }
            }
            if (typeDefinition.BaseType != null && typeDefinition.BaseType != "[mscorlib]System.Object")
            {
                BuildClrObject(clrObject, GetTypeDefineByName(typeDefinition.BaseType).TypeDefinition, isstatic);
            }
        }

#if BRIDGE
        [Bridge.Template("{input}.apply({target}, arguments)")]
        public static object Apply(object input,object target)
        {
            return null;
        }
#endif
        //TODO UNITY 如果支持的话 回头再修改
        public static Action<object, object> GetFSet(FieldInfo field)
        {
#if JS
            Action<object, object> action = (send, v) =>
            {
                field.SetValue(send, v);
            };

            return action;

#else
            DynamicMethod dm = new DynamicMethod(String.Concat("_Set", field.Name, "_"), typeof(void),
                new Type[] {typeof(object), typeof(object)},
                field.DeclaringType, true);
            ILGenerator generator = dm.GetILGenerator();

            generator.Emit(OpCodes.Ldarg_0);
            generator.Emit(OpCodes.Ldarg_1);
            if (field.FieldType.IsValueType)
                generator.Emit(OpCodes.Unbox_Any, field.FieldType);
            generator.Emit(OpCodes.Stfld, field);
            generator.Emit(OpCodes.Ret);

            return (Action<object, object>) dm.CreateDelegate(typeof(Action<object, object>));
#endif
        }

        static Extensions()
        {
            RegConvert<StackItemPtr>((s,l) =>
            {
                var values = s.Split(':');
                var type = GetTypeDefineByName(values[0]);
                if (type != null)
                {
                    var key = values.Last();
                    if (type.StaticClrObject.Fields.ContainsKey(key))
                    {
                        return type.StaticClrObject.Fields[key];
                    }
           
                    type.StaticClrObject.Fields[key] = new StackItemPtr();
                    return type.StaticClrObject.Fields[key];
                }
                else
                {
                    throw new NotSupportedException();
                }
                return null;
            });

            //RegConvert<Type>((s,l) =>
            //{
                
            //});
        }

        static Dictionary<Type, Func<string, List<ILCode>,object>> ConverFuncs =new Dictionary<Type, Func<string, List<ILCode>, object>>();

        public static void RegConvert<T>(Func<string, List<ILCode>, object> convert)
        {
            ConverFuncs[typeof(T)] = convert;
        }

        public static object Convert(Type type, string input, List<ILCode> list,bool userConvertFun=true)
        {
            if (type == typeof(string) || type == typeof(object))
            {
                return input;
            }
            
            if (userConvertFun && ConverFuncs.ContainsKey(type))
            {
               return ConverFuncs[type](input,list);
            }
            if (type == typeof(int[]))
            {
                var lines = input.Substring(1, input.Length - 2).Split(',');
                var resule = new int[lines.Length];
                for (int i = 0; i < lines.Length; i++)
                {
                    resule[i] = (int)Convert(typeof(int), lines[i], list);
                }
                return resule;
            }
            if (type == typeof(Type))
            {
                var typedefine = Extensions.GetTypeDefineByName(input);
                if (typedefine != null)
                {
                    return typedefine.GetClrType();
                }
                return Extensions.GetTypeByName(input);
            }
            if (type.IsEnum)
            {
                var value = Enum.Parse(type, input, true);
                return value;
            }
            else if (type == typeof(float))
            {
                return float.Parse(input);
            }
            else if (type == typeof(double))
            {
                return double.Parse(input);
            }
            else if (type == typeof(int))
            {
                if (input.StartsWith("IL_"))//跳转命令
                {
                    var find = list.FindIndex(r => r.Lable == input);
                    if (find >= 0)
                    {
                        return find - 1; //PC Move之后会++ 所以提前减一
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
        public static object GetValueFromStr(string str, StackValueType vtype)
        {
            object value = null;
            switch (vtype)
            {
                case StackValueType.i8:
                    value = long.Parse(str);
                    break;
                case StackValueType.r8:
                    value = double.Parse(str);
                    break;
                case StackValueType.i4:
                    if (str.StartsWith("0x"))
                    {
                        value = System.Convert.ToInt32(str, 16);
                    }
                    else if (str.StartsWith("M") || str.StartsWith("m"))
                    {
                        value = (-int.Parse(str));
                    }
                    else
                    {
                        value = int.Parse(str);

                    }

                    break;
                case StackValueType.r4:
                    value = float.Parse(str);
                    break;
            }

            return value;
        }

        public static MethodInfo GetMethodInfo(this Type type, string name,Type [] types)
        {
           var mi = type.GetMethod(name, types);
            if (mi != null)
            {
                return mi;
            }
            mi = type.GetMethod(name.ToLower(), types);

            if (mi == null)
            {
                foreach (var methodInfo in type.GetMethods())
                {
                    if (methodInfo.Name.ToLower() == name.ToLower())
                    {
                        return methodInfo;
                    }
                }
            }
            return mi;
        }

        public static void RegAssembly( TypeDefine.AssemblyDefine  assembly)
        {
            Assembly.Add(assembly);
        }

      

        private static List<TypeDefine.AssemblyDefine> Assembly  = new List<AssemblyDefine>();

        public static TypeDefine.TypeDefine GetTypeDefineByName(string name)
        {
            var values = name.Split(new string[] { "::", ",", "(", ")", "[", "]" },
        StringSplitOptions.RemoveEmptyEntries);
            name = values.Last();
            foreach (var assemblyDefine in Assembly)
            {
                var q = assemblyDefine.TypeDefines.Find(r => r.TypeDefinition.FullName == name);
                if (q != null)
                {
                    return q;
                  
                }
            }

            return null;
        }

        public static Type GetTypeByName(string name)
        {
            var values = name.Split(new string[] { "::", ",", "(", ")", "[","]" },
           StringSplitOptions.RemoveEmptyEntries);
            name = values.Last();
            Type type = Type.GetType(name);

            if (type != null)
            {
                return type;
            }
            if (name.StartsWith("System"))
            {
                type = typeof(int).Assembly.GetType(name);

            }
            if (type == null && name.StartsWith("System"))
            {
                type = typeof(System.Diagnostics.Stopwatch).Assembly.GetType(name);
#if BRIDGE

                if (type == null)
                {

                    if ("System.Console" == name)
                    {
                        return typeof(System.Console);
                    }
                    type = typeof(System.Diagnostics.Stopwatch).Assembly.GetType(name.Replace("System.", "Bridge.")); 
                }
#endif
            }
            if (type != null)
            {
                return type;
            }
            switch (name)
            {
                case "string":
                    return typeof(string);
                case "int32":
                    return typeof(int);
                case "int64":
                    return typeof(long);
                case "float64":
                    return typeof(double);
                case "float32":
                    return typeof(float);
                case "object":
                    return typeof(object);
            }
           
       
            if (type == null)
            {
                throw new NotSupportedException("Type  Was  Not Fount :" + name);
            }
            return type;
        }
    }

}