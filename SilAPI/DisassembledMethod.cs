using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace SilAPI
{
    public class DisassembledMethod : DisassembledEntity
    {
        public override string ToString()
        {
            return "Disassembled Method: " + ShortName ?? "Unknown";
        }

       

        public override void InitialiseFromIL()
        {
            string line;
            using (var reader = new StringReader(RawIL))
            {
                while ((line = reader.ReadLine()) != null)
                {
                    var methodName = ILParseHelper.GetMethodNameFromDeclarationLine(line);
                    if (methodName != null)
                    {
                        ShortName = methodName;
                        FullName = methodName;
                        break;
                    }
                }
            }
        }

        public int MaxStack = 0;

        public bool Static = false;

        public string ReturnType;

        public string CallName
        {
            get
            {
                StringBuilder sb = new StringBuilder();
                sb.Append(ReturnType);
                sb.Append(" ");
                sb.Append(FullName.Replace("." + ShortName, "::" + ShortName));
                sb.Append("(");
                foreach (var parameter in Parameters)
                {
                    sb.Append(parameter.Value + ",");
                }
                if (Parameters.Count > 0)
                {
                    sb.Remove(sb.Length - 1, 1);
                }
                sb.Append(")");
                return sb.ToString();
            }
        }

        public Dictionary<string,string> Locals= new Dictionary<string, string>();

        public Dictionary<string, string> Parameters = new Dictionary<string, string>();

        public Dictionary<string, int> LocalsIndex = new Dictionary<string, int>();

        public Dictionary<string, int> ParametersIndex = new Dictionary<string, int>();

        public List<string> LocalList= new List<string>();

        public List<string> ParametersList = new List<string>();

        public List<string> BodyLines = new List<string>();
        public void ReadBody()
        {
            string line;
            Locals.Clear();
            BodyLines.Clear();
            LocalList.Clear();
            ParametersList.Clear();
            using (var reader = new StringReader(RawIL))
            {
                bool localsStart = false;
                bool bodyStart = false;
                bool methodStart = false;
                StringBuilder sb = new StringBuilder();
                while ((line = reader.ReadLine()) != null)
                {
                    line = line.Trim();
                    if (line.StartsWith("//"))
                    {
                        continue;
                    }
                    if (string.IsNullOrEmpty(line))
                    {
                        continue;
                    }
                    var values = line.Split(' ');
                    if (line.StartsWith(".method"))
                    {
                        methodStart = true;
                        sb = new StringBuilder();
                    }
                    if ( methodStart)
                    {
                        if (line.StartsWith("{"))
                        {
                            methodStart = false;
                            line = sb.ToString();
                            values = line.Split(' ');
                            Static = line.IndexOf("static") >= 0;
                            if (Static)
                            {
                                ReturnType = values[4];
                            }
                            else
                            {
                                ReturnType = values[3];
                            }
                            var locals = line;
                            locals = strForm2S(locals, "(", ")");
                            var localvalues = locals.Split(',');
                            foreach (var localvalue in localvalues)
                            {
                                if (string.IsNullOrEmpty(localvalue))
                                    continue;
                                var lvs = localvalue.Split(' ');
                                Parameters[lvs[1]] = lvs[0];
                                ParametersIndex[lvs[1]] = Parameters.Count;
                                ParametersList.Add(lvs[0]);
                               
                            }

                         
                            continue;
                        }
                        if (sb.Length > 0)
                        {
                            sb.Append(" " + line);
                        }
                        else
                        {
                            sb.Append(line);
                        }
                       
                        continue;
                    }

                    if (line.StartsWith(".maxstack"))
                    {
                        MaxStack = int.Parse(values[2]);
                    }
                    
                    if (line.StartsWith(".locals"))
                    {
                        localsStart = true;
                        sb = new StringBuilder();
                    }
                    if (localsStart)
                    {
                        sb.AppendLine(line);

                        if (line.EndsWith(")"))
                        {
                            localsStart = false;
                            var locals = sb.ToString();
                            locals = strForm2S(locals, "(", ")");
                            var localvalues = locals.Split(',');
                            foreach (var localvalue in localvalues)
                            {
                                var lvs = localvalue.Split(' ');
                                
                                Locals[lvs[lvs.Length-1]] = lvs[lvs.Length-2];
                                LocalsIndex[lvs[lvs.Length - 1]] = LocalsIndex.Count;
                                LocalList.Add(lvs[lvs.Length - 2]);
                            }

                            bodyStart = true;
                            continue;
                        }
                    }
                    if (bodyStart)
                    {
                        if (line.StartsWith("+"))
                        {
                            BodyLines[BodyLines.Count - 1] += line;
                            continue;
                        }
                      
                        if (BodyLines.Count > 1)
                        {
                            BodyLines[BodyLines.Count - 1] = BodyLines[BodyLines.Count - 1].Replace("\"+ \"", "");
                        }

                        if (line.StartsWith("} // end of method"))
                        {
                            break;
                        }
                        line =
                            line.Replace("  ", " ")
                                .Replace("  ", " ")
                                .Replace("  ", " ")
                                .Replace("  ", " ")
                                .Replace("  ", " ");

                        if (Locals.ContainsKey(values.Last()))
                        {
                            line = line.Remove(line.Length- values.Last().Length) + LocalsIndex[values.Last()];
                        }
                        if (Parameters.ContainsKey(values.Last()))
                        {
                            line = line.Remove(line.Length - values.Last().Length) + ParametersIndex[values.Last()];
                        }
                        BodyLines.Add(line);
                    }
                }
            }

            for (int i = 0; i < ParametersList.Count; i++)
            {
                ParametersList[i] = OpTConvert(ParametersList[i]);
            }
            for (int i = 0; i < LocalList.Count; i++)
            {
                LocalList[i] = OpTConvert(LocalList[i]);
            }
        }

        public static string OpTConvert(string name)
        {
            var listA = new List<string>(new string[] {"int32", "float32", "int64", "float64"});
            var listB = new List<string>(new string[] { "i4", "r4" ,"i8","r8" });
            var index = listA.IndexOf(name);
            if (index >= 0)
            {
                return listB[index];
            }
            return name;
        }


        public static string strForm2S(string sstr, string s, string e)
        {
            string str = "";
            int num = sstr.IndexOf(s, 0, StringComparison.InvariantCultureIgnoreCase);
            if (num >= 0)
            {
                int num2 = sstr.IndexOf(e, num + s.Length);
                if (num2 >= 0)
                {
                    str = sstr.Substring(num + s.Length, (num2 - num) - s.Length);
                }
            }
            return str;
        }

        public static string[] strForm2SA(string sstr, string s, string e)
        {
            List<string> list = new List<string>();
            int startIndex = 0;
            int num2 = 0;
            do
            {
                startIndex = sstr.IndexOf(s, startIndex);
                if ((startIndex < 0) || (num2 < 0))
                {
                    break;
                }
                num2 = sstr.IndexOf(e, startIndex + s.Length);
                if ((startIndex >= 0) && (num2 >= 0))
                {
                    string item = sstr.Substring(startIndex + s.Length, (num2 - startIndex) - s.Length);
                    list.Add(item);
                    startIndex = num2;
                }
            }
            while (startIndex >= 0);
            string[] strArray = new string[list.Count];
            for (int i = 0; i < strArray.Length; i++)
            {
                strArray[i] = list[i];
            }
            return strArray;
        }

        public static string strLeft(string sstr, int lenght)
        {
            if (sstr.Length > lenght)
            {
                return sstr.Substring(0, lenght);
            }
            return sstr;
        }

        public static int strLenght(string sstr)
        {
#if JS
            return sstr.Length;
#else
            return Encoding.Default.GetBytes(sstr).Length;
#endif
        }

        public static string strRight(string sstr, int lenght)
        {
            if (sstr.Length > lenght)
            {
                return sstr.Substring(sstr.Length - lenght, lenght);
            }
            return sstr;
        }

        public static string[] strSplit(string baseString, string splitString, StringSplitOptions sso)
        {
            baseString = baseString.Trim() + splitString;
            int startIndex = 0;
            int num2 = 0;
            List<string> list = new List<string>();
            do
            {
                startIndex = baseString.IndexOf(splitString, startIndex, StringComparison.InvariantCultureIgnoreCase);
                if (startIndex >= 0)
                {
                    string item = baseString.Substring(num2, startIndex - num2).Replace(splitString, "");
                    if (sso == StringSplitOptions.None)
                    {
                        list.Add(item);
                    }
                    if ((sso == StringSplitOptions.RemoveEmptyEntries) && (item != ""))
                    {
                        list.Add(item);
                    }
                    num2 = startIndex;
                    if ((startIndex + 1) > baseString.Length)
                    {
                        startIndex = -1;
                    }
                    else
                    {
                        startIndex++;
                    }
                }
            }
            while (startIndex >= 0);
            string[] strArray = new string[list.Count];
            for (int i = 0; i < strArray.Length; i++)
            {
                strArray[i] = list[i];
            }
            return strArray;
        }
    }
}
