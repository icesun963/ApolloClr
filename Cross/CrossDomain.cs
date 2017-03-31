using System.Collections.Generic;

namespace ApolloClr.Cross
{
    public class CrossDomain
    {
        static Dictionary<string, CrossMethod> Methods = new Dictionary<string, CrossMethod>();


        public static CrossMethod Build(string callname)
        {
            //TODO »º´æ
            if (Methods.ContainsKey(callname))
            {
                return Methods[callname];
            }
            var method = new CrossMethod(callname);
            Methods[callname] = method;
            return method;
        }
    }
}