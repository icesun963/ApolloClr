using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;

namespace ApolloClr
{
    public static class Extensions
    {
        private static Action<object, object> DeleageSetFun = null;

        public static void SetTarget(this Delegate @delegate,object target)
        {
            if (DeleageSetFun == null)
            {
                
                BindingFlags flag = BindingFlags.Instance | BindingFlags.NonPublic;

                var xfield = @delegate.GetType().GetField("_target", flag);
                DeleageSetFun = GetFSet(xfield);
            }
            DeleageSetFun(@delegate, target);
        }

        //TODO UNITY 如果支持的话 回头再修改
        public static Action<object, object> GetFSet(FieldInfo field)
        {
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

        public static Type GetTypeByName(string name)
        {
            name = name.Replace("[mscorlib]", "");
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
            }
            if (type == null)
            {
                throw  new NotSupportedException("Type  Was  Not Fount :" + name);
            }
            return type;
        }
    }
}
