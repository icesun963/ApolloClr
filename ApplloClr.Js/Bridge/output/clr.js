/**
 * @version 1.0.0.0
 * @copyright Copyright ©  2017
 * @compiler Bridge.NET 15.7.0
 */
Bridge.assembly("ApplloClr.Js", function ($asm, globals) {
    "use strict";

    Bridge.define("ApolloClr.BaseClrStack", {
        statics: {
            /**
             * ��ǰ��ջ
             *
             * @instance
             */
            current: null
        },
        evaluationStack: null,
        esp: 0,
        ctor: function (x) {
            if (x === void 0) { x = 10; }

            this.$initialize();
            x = (x + 1) | 0;
            this.evaluationStack = System.Array.init(x, null, ApolloClr.StackItem);
            for (var i = 0; i < x; i = (i + 1) | 0) {
                this.evaluationStack[i] = new ApolloClr.StackItem.$ctor1(i, this);
            }
            this.setCurrent();
        },
        getItem: function (index) {
            return this.evaluationStack[index];
        },
        reset: function () {
            this.esp = 0;
            ApolloClr.BaseClrStack.current = this;
        },
        setCurrent: function () {
            ApolloClr.BaseClrStack.current = this;
        },
        push$3: function (obj) {
            this.evaluationStack[Bridge.identity(this.esp, (this.esp = (this.esp + 1) | 0))].intValue = obj;
        },
        push$2: function (vtype, value) {
            var p = this.evaluationStack[Bridge.identity(this.esp, (this.esp = (this.esp + 1) | 0))];
            if (vtype === ApolloClr.StackValueType.Ref || vtype === ApolloClr.StackValueType.i4) {
                throw new System.NotSupportedException();
            } else {
                p.valueType = vtype;
                p.vPoint = value;
            }

        },
        push$1: function (vtype, value) {
            var p = this.evaluationStack[Bridge.identity(this.esp, (this.esp = (this.esp + 1) | 0))];
            p.valueType = vtype;
            p.intValue = value;
        },
        push: function (obj) {
            this.evaluationStack[Bridge.identity(this.esp, (this.esp = (this.esp + 1) | 0))].copyFrom(obj);
        },
        pop: function () {
            var result = this.evaluationStack[((this.esp = (this.esp - 1) | 0))];
            return result;
        },
        pop$1: function (count) {
            this.esp = (this.esp - count) | 0;
            return this.evaluationStack[this.esp];
        },
        top: function () {
            return this.evaluationStack[this.esp];
        }
    });

    Bridge.define("ApolloClr.Clr", {
        _Stack: null,
        /**
         * ����ƨ���� ����λ��Ϊ ����
         ����=��ǰ�ֲ�����+����ֵ+��������
         *
         * @instance
         */
        callStack: null,
        callStackClr: null,
        _Csp: null,
        _Argp: null,
        /**
         * ��ǰ�ķ���ֵ
         *
         * @instance
         */
        resultPoint: null,
        dumpAction: null,
        throwAction: null,
        localVarCount: 0,
        argsVarCount: 0,
        retResult: false,
        conveTypes: null,
        config: {
            init: function () {
                this.conveTypes = System.Array.init([System.Int32, System.Int64, System.Single, System.Double, System.SByte, System.Int16, System.Byte, System.UInt16, System.UInt32, System.UInt64], Function);
            }
        },
        ctor: function (localCount, argCount, haseResult, maxStack) {
            if (localCount === void 0) { localCount = 5; }
            if (argCount === void 0) { argCount = 5; }
            if (haseResult === void 0) { haseResult = true; }
            if (maxStack === void 0) { maxStack = 5; }

            this.$initialize();
            this._Stack = new ApolloClr.BaseClrStack(maxStack);

            this.retResult = haseResult;
            this.localVarCount = localCount;
            this.argsVarCount = argCount;
            this.callStackClr = new ApolloClr.BaseClrStack(((localCount + argCount) | 0));
            this.callStack = this.callStackClr.evaluationStack;
            if (this.callStack.length <= 0) {
                return;
            }


            this._Csp = ApolloClr.StackItem.op_Implicit(0);
            this._Argp = ApolloClr.StackItem.op_Addition(this.getCsp(), localCount);
        },
        getStack: function () {
            this._Stack.setCurrent();
            return this._Stack;
        },
        /**
         * ͷָ��
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @function getCsp
         * @return  {ApolloClr.StackItem}
         */
        /**
         * ͷָ��
         *
         * @instance
         * @function setCsp
         */
        getCsp: function () {
            this.callStackClr.setCurrent();
            return this._Csp;
        },
        /**
         * ����ָ��
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @function getArgp
         * @return  {ApolloClr.StackItem}
         */
        /**
         * ����ָ��
         *
         * @instance
         * @function setArgp
         */
        getArgp: function () {
            this.callStackClr.setCurrent();
            return this._Argp;
        },
        evaluationStack_Push: function (obj) {
            this.getStack().push(obj);
        },
        evaluationStack_Push$2: function (obj) {
            this.getStack().push$3(obj);
        },
        evaluationStack_Push$3: function (args) {
            for (var i = 0; i < args.length; i = (i + 1) | 0) {
                this.getStack().push(ApolloClr.StackItem.op_Addition(this.getCsp(), args[i]));
            }

        },
        evaluationStack_Push$1: function (vtype, value) {
            if (vtype === ApolloClr.StackValueType.i4) {
                this.getStack().push$1(vtype, System.Nullable.getValue(Bridge.cast(value, System.Int32)));
            } else {
                this.getStack().push$2(vtype, value);
            }

        },
        evaluationStack_Push$4: function (obj) {
            var iptr = ApolloClr.StackObject.newObject(obj);
            this.getStack().push$2(ApolloClr.StackValueType.Ref, iptr);
        },
        evaluationStack_Pop: function () {
            return this.getStack().pop();
        },
        evaluationStack_Pop$1: function (count) {
            return this.getStack().pop$1(count);
        },
        /**
         * �Ƴ���ǰλ�ڼ����ջ������ֵ
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        pop: function () {
            this.evaluationStack_Pop();
        },
        /**
         * ���Ƽ����ջ�ϵ�ǰ��˵�ֵ
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        dup: function () {
            var vs = this.getStack().top();
            this.evaluationStack_Push(vs);
        },
        /**
         * �˳���ǰ����������ָ������
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        jmp: function () {
            //TODO
        },
        /**
         * ����������ָ������ֵ���ã����ص���ջ�ϡ�
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {number}    i
         * @return  {void}
         */
        ldarg: function (i) {
            this.evaluationStack_Push(ApolloClr.StackItem.op_Addition(this.getArgp(), i));
        },
        ldstr: function (str) {
            this.evaluationStack_Push$4(str);
        },
        ldnull: function () {
            this.evaluationStack_Push(ApolloClr.StackItem.sPtrEmpty);
        },
        /**
         * ѹ������ ѹ��Evaluation Stack��
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {number}    v    ֵ
         * @return  {void}
         */
        ldc_i4: function (v) {
            this.evaluationStack_Push$2(v);
        },
        /**
         * ѹ������ ѹ��Evaluation Stack��
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {ApolloClr.StackValueType}    vtype    
         * @param   {Object}                      value
         * @return  {void}
         */
        ldc: function (vtype, value) {
            if (Bridge.is(value, String)) {
                value = ApolloClr.Extensions.getValueFromStr(Bridge.as(value, String), vtype);
            }

            {
                this.evaluationStack_Push$1(vtype, value);
            }

        },
        /**
         * ��λ�ڼ����ջ������ֵ�洢�ڲ������е�ָ�����������̸�ʽ����
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {number}    i
         * @return  {void}
         */
        starg: function (i) {
            var v = this.evaluationStack_Pop();
            (ApolloClr.StackItem.op_Addition(this.getArgp(), 1)).copyFrom(v);
        },
        /**
         * ��һ���������� ��ѹ��Evaluation Stack�У�
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {number}    i
         * @return  {void}
         */
        ldloc: function (i) {
            this.evaluationStack_Push(ApolloClr.StackItem.op_Addition(this.getCsp(), i));
        },
        /**
         * ��һ���������� ��ѹ��Evaluation Stack�У�
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {Array.<number>}    args
         * @return  {void}
         */
        ldloc$1: function (args) {
            if (args === void 0) { args = []; }

            this.evaluationStack_Push$3(args);

        },
        /**
         * ��һ���������� ��ѹ��Evaluation Stack�У�
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {number}    i
         * @return  {void}
         */
        ldloca: function (i) {
            this.ldloc(i);
        },
        /**
         * �Ӽ����ջ�Ķ���������ǰֵ������洢�ھֲ������б��е� index �����̸�ʽ����
         Stloc_S
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {number}    i    λ��
         * @return  {void}
         */
        stloc: function (i) {
            var result = this.evaluationStack_Pop();
            (ApolloClr.StackItem.op_Addition(this.getCsp(), i)).copyFrom(result);
        },
        /**
         * ���ô�
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        nop: function () {

        },
        reset: function () {
            this.getStack().reset();
            this.resultPoint = null;
        },
        /**
         * 将从零开始的、一维数组的元素的数目推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldlen: function () {
            var vs = this.evaluationStack_Pop();
            var array = Bridge.as(vs.getValue(), Array);
            this.evaluationStack_Push$2(array.length);
        },
        newarr: function (type) {
            var vs = this.evaluationStack_Pop();
            var array = System.Array.init(vs.intValue, Bridge.getDefaultValue(type), type);
            this.evaluationStack_Push$4(array);
        },
        
        ldelema: function (type) {
            var vs = this.evaluationStack_Pop$1(2);
            var ptr = (vs).ptr;
            var index = (ApolloClr.StackItem.op_Addition(vs, 1)).intValue;
            var sptr = Bridge.merge(new ApolloClr.StackItem.ctor(), {
                ptr: ptr,
                index: index,
                valueType: ApolloClr.StackValueType.Array
            } );

            this.evaluationStack_Push(sptr);
        },
        /**
         * 将位于指定数组索引处的 int8 类型的元素作为 int32 加载到计算堆栈的顶部。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {ApolloClr.StackValueType}    type
         * @return  {void}
         */
        ldelem: function (type) {
            var vs = this.evaluationStack_Pop$1(2);
            var array = Bridge.as((vs).ptr.object, Array);
            var index = (ApolloClr.StackItem.op_Addition(vs, 1)).intValue;


            this.evaluationStack_Push$1(type, System.Array.get(array, index));
        },
        /**
         * 用计算堆栈上的 native int 值替换给定索引处的数组元素。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {ApolloClr.StackValueType}    type
         * @return  {void}
         */
        stelem: function (type) {
            var vs = this.evaluationStack_Pop$1(3);
            var array = Bridge.as(vs.ptr.object, Array);
            var index = (ApolloClr.StackItem.op_Addition(vs, 1)).intValue;
            var optr = (ApolloClr.StackItem.op_Addition(ApolloClr.StackItem.op_Addition(vs, 1), 1));
            switch (optr.valueType) {
                case ApolloClr.StackValueType.Ref: 
                    {
                        var obj = optr.ptr.object;
                        System.Array.set(array, obj, index);
                        break;
                    }
                default: 
                    {
                        var obj1 = optr.getValue();
                        System.Array.set(array, obj1, index);
                        break;
                    }
            }
        },
        /**
         * 无条件地将控制转移到目标指令（短格式）。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {string}    n1    
         * @param   {string}    n2    
         * @param   {number}    pc
         * @return  {void}
         */
        br: function (n1, n2, pc) {
            this.dumpAction(pc);
        },
        /**
         * 如果 value 为 false、空引用或零，则将控制转移到目标指令。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {string}    n1    
         * @param   {string}    n2    
         * @param   {number}    pc
         * @return  {void}
         */
        brfalse: function (n1, n2, pc) {
            var vs = this.evaluationStack_Pop();
            if (vs.intValue !== 1) {
                this.dumpAction(pc);
            }
        },
        /**
         * 如果 value 为 true、非空或非零，则将控制转移到目标指令（短格式）。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {string}    n1    
         * @param   {string}    n2    
         * @param   {number}    pc
         * @return  {void}
         */
        brtrue: function (n1, n2, pc) {
            var vs = this.evaluationStack_Pop();
            if (vs.intValue === 1) {
                this.dumpAction(pc);
            }
        },
        /**
         * 如果两个值相等，则将控制转移到目标指令（短格式）。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {string}    n1    
         * @param   {string}    n2    
         * @param   {number}    pc
         * @return  {void}
         */
        beq: function (n1, n2, pc) {
            var vs = this.evaluationStack_Pop$1(2);
            if (ApolloClr.StackItem.op_Equality(vs, ApolloClr.StackItem.op_Addition(vs, 1))) {
                this.dumpAction(pc);
            }
        },
        /**
         * 如果第一个值大于或等于第二个值，则将控制转移到目标指令（短格式）。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {string}    n1    
         * @param   {string}    n2    
         * @param   {number}    pc
         * @return  {void}
         */
        bge: function (n1, n2, pc) {
            var vs = this.evaluationStack_Pop$1(2);
            if (ApolloClr.StackItem.op_GreaterThanOrEqual(vs, ApolloClr.StackItem.op_Addition(vs, 1))) {
                this.dumpAction(pc);
            }
        },
        /**
         * 如果第一个值大于第二个值，则将控制转移到目标指令（短格式）。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {string}    n1    
         * @param   {string}    n2    
         * @param   {number}    pc
         * @return  {void}
         */
        bgt: function (n1, n2, pc) {
            var vs = this.evaluationStack_Pop$1(2);
            if (ApolloClr.StackItem.op_GreaterThan(vs, ApolloClr.StackItem.op_Addition(vs, 1))) {
                this.dumpAction(pc);
            }
        },
        /**
         * 如果第一个值小于或等于第二个值，则将控制转移到目标指令（短格式）。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {string}    n1    
         * @param   {string}    n2    
         * @param   {number}    pc
         * @return  {void}
         */
        ble: function (n1, n2, pc) {
            var vs = this.evaluationStack_Pop$1(2);
            if (ApolloClr.StackItem.op_LessThanOrEqual(vs, ApolloClr.StackItem.op_Addition(vs, 1))) {
                this.dumpAction(pc);
            }
        },
        /**
         * 如果第一个值小于第二个值，则将控制转移到目标指令（短格式）。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {string}    n1    
         * @param   {string}    n2    
         * @param   {number}    pc
         * @return  {void}
         */
        blt: function (n1, n2, pc) {
            var vs = this.evaluationStack_Pop$1(2);
            if (ApolloClr.StackItem.op_LessThan(vs, ApolloClr.StackItem.op_Addition(vs, 1))) {
                this.dumpAction(pc);
            }
        },
        /**
         * 引发当前位于计算堆栈上的异常对象。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        throw: function () {
            var vs = this.evaluationStack_Pop();
            this.evaluationStack_Push(vs);
            this.throwAction(vs.getValue(), -1);
        },
        /**
         * 再次引发当前异常。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        rethrow: function () {
            this.evaluationStack_Push$2(0);
            this.throwAction(null, -1);
        },
        /**
         * 退出受保护的代码区域，无条件将控制转移到特定目标指令。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {number}    i
         * @return  {void}
         */
        leave: function (i) {
            this.throwAction(null, i);
        },
        _Try: function (spc, epc, pcs) {

        },
        catch: function (spc, epc) {
            this.dumpAction(epc);
        },
        finally: function (spc, epc) {

        },
        /**
         * 将控制从异常块的 fault 或 finally 子句转移回公共语言结构 (CLI) 异常处理程序。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        endfinally: function () {

        },
        /**
         * 拷贝当前参数到目标堆栈
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {ApolloClr.Clr}    clr
         * @return  {void}
         */
        copyToArgs: function (clr) {
            var count = clr.argsVarCount;
            var vs = this.evaluationStack_Pop$1(count);
            for (var i = 0; i < count; i = (i + 1) | 0) {
                (ApolloClr.StackItem.op_Addition(clr.getArgp(), i)).copyFrom(ApolloClr.StackItem.op_Addition(vs, i));
            }

        },
        /**
         * 从当前方法返回，并将返回值（如果存在）从调用方的计算堆栈推送到被调用方的计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ret: function () {
            if (this.retResult) {
                this.resultPoint = this.evaluationStack_Pop();
            }

            this.dumpAction(9999);
        },
        /**
         * "IL_0009" : "call" "int32" "ApolloClr.Program::fib(int32)" null
         调用由传递的方法说明符指示的方法
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {string}                   retType    
         * @param   {string}                   method     
         * @param   {ApolloClr.MethodTasks}    task
         * @return  {void}
         */
        call: function (retType, method, task) {
            //如果有新的层级进来
            if (!task.isEnd) {

                var newtask = task.clone();

                //获取空余方法
                //从堆栈拷贝参数
                if (newtask.clr.argsVarCount > 0) {
                    this.copyToArgs(newtask.clr);
                }

                newtask.run();

                //如果有返回
                if (newtask.clr.retResult) {
                    //压入返回值
                    this.evaluationStack_Push(newtask.clr.resultPoint);
                }
            } else {
                if (task.clr.argsVarCount > 0) {
                    this.copyToArgs(task.clr);
                }
                //克隆 对战 并 运行
                task.run();

                //如果有返回
                if (task.clr.retResult) {
                    //压入返回值
                    this.evaluationStack_Push(task.clr.resultPoint);
                }
            }



        },
        /**
         * 向公共语言结构 (CLI) 发出信号以通知调试器已撞上了一个断点。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        break: function () {

        },
        /**
         * 实现跳转表
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {Array.<number>}    pcs
         * @return  {void}
         */
        switch: function (pcs) {
            var vs = this.evaluationStack_Pop();
            this.dumpAction(pcs[vs.intValue]);
        },
        /**
         * 通过调用约定描述的参数调用在计算堆栈上指示的方法（作为指向入口点的指针）。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        calli: function () {

        },
        /**
         * 对对象调用后期绑定方法，并且将返回值推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {string}                   instance    
         * @param   {string}                   return      
         * @param   {ApolloClr.MethodTasks}    task
         * @return  {void}
         */
        callvirt: function (instance, $return, task) {

            this.call(null, null, task);
        },
        /**
         * 创建一个值类型的新对象或新实例，并将对象引用（O 类型）推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {string}                   instance    
         * @param   {string}                   return      
         * @param   {ApolloClr.MethodTasks}    task
         * @return  {void}
         */
        newobj: function (instance, $return, task) {
            task.run();

            this.evaluationStack_Push(task.clr.resultPoint);
        },
        
        cpobj: function () {

        },
        /**
         * 将地址指向的值类型对象复制到计算堆栈的顶部。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldobj: function () {

        },
        /**
         * 尝试将引用传递的对象转换为指定的类。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        castclass: function () {

        },
        /**
         * 测试对象引用（O 类型）是否为特定类的实例。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        isinst: function () {

        },
        /**
         * 将值类型的已装箱的表示形式转换为其未装箱的形式
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {Function}    T       
         * @param   {Function}    type
         * @return  {void}
         */
        unBox: function (T, type) {
            //var vs = EvaluationStack_Pop();
            //EvaluationStack_Push(vs->Value);
        },
        /**
         * 将值类型的已装箱的表示形式转换为其未装箱的形式
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {Function}    T       
         * @param   {Function}    type
         * @return  {void}
         */
        unBox_Any: function (T, type) {
            //UnBox<T>(type);
        },
        /**
         * 将值类转换为对象引用（O 类型）。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {Function}    T       
         * @param   {Function}    type
         * @return  {void}
         */
        box: function (T, type) {
            //var vs = EvaluationStack_Pop();
            //EvaluationStack_Push(vs->Value);
        },
        /**
         * 查找对象中其引用当前位于计算堆栈的字段的值。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldfld: function () {

        },
        /**
         * 查找对象中其引用当前位于计算堆栈的字段的地址。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldflda: function () {

        },
        /**
         * 用新值替换在对象引用或指针的字段中存储的值。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        stfld: function () {

        },
        /**
         * 将静态字段的值推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldsfld: function () {

        },
        /**
         * 将静态字段的地址推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldsflda: function () {

        },
        /**
         * 用来自计算堆栈的值替换静态字段的值。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        stsfld: function () {

        },
        /**
         * 将指定类型的值从计算堆栈复制到所提供的内存地址中。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        stobj: function () {

        },
        
        refanyval: function () {

        },
        /**
         * 如果值不是有限数，则引发 ArithmeticException。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ckfinite: function () {

        },
        /**
         * 将对特定类型实例的类型化引用推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        mkrefany: function () {

        },
        /**
         * 将元数据标记转换为其运行时表示形式，并将其推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldtoken: function () {

        },
        /**
         * 返回指向当前方法的参数列表的非托管指针。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        arglist: function () {

        },
        /**
         * 将指向实现特定方法的本机代码的非托管指针（native int 类型）推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldftn: function () {

        },
        /**
         * 将指向实现与指定对象关联的特定虚方法的本机代码的非托管指针（native int 类型）推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldvirtftn: function () {

        },
        /**
         * 从本地动态内存池分配特定数目的字节并将第一个分配的字节的地址（瞬态指针，* 类型）推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        localloc: function () {

        },
        /**
         * 将控制从异常的 filter 子句转移回公共语言结构 (CLI) 异常处理程序。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        endfilter: function () {

        },
        /**
         * 指示当前位于计算堆栈上的地址可能没有与紧接的 ldind、stind、ldfld、stfld、ldobj、stobj、initblk 或 cpblk 指令的自然大小对齐。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        unaligned: function () {

        },
        /**
         * 指定当前位于计算堆栈顶部的地址可以是易失的，并且读取该位置的结果不能被缓存，或者对该地址的多个存储区不能被取消。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        volatile: function () {

        },
        /**
         * 执行后缀的方法调用指令，以便在执行实际调用指令前移除当前方法的堆栈帧。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        tail: function () {

        },
        /**
         * 将位于指定地址的值类型的每个字段初始化为空引用或适当的基元类型的 0。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        initobj: function () {

        },
        /**
         * 约束要对其进行虚方法调用的类型。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        constrained: function () {

        },
        /**
         * 将指定数目的字节从源地址复制到目标地址。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        cpblk: function () {

        },
        /**
         * 将位于特定地址的内存的指定块初始化为给定大小和初始值。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        initblk: function () {

        },
        no: function () {

        },
        /**
         * 将提供的值类型的大小（以字节为单位）推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        sizeof: function () {

        },
        /**
         * 检索嵌入在类型化引用内的类型标记。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        refanytype: function () {

        },
        /**
         * 指定后面的数组地址操作在运行时不执行类型检查，并且返回可变性受限的托管指针。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        readonly: function () {

        },
        /**
         * 将位于计算堆栈顶部的值转换为Type
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {ApolloClr.StackValueType}    type
         * @return  {void}
         */
        conv: function (type) {
            var v = this.evaluationStack_Pop();

            var value = v.intValue;
            if (v.valueType !== ApolloClr.StackValueType.i4) {
                value = v.vPoint;
            }
            switch (type) {
                case ApolloClr.StackValueType.u1: 
                    switch (v.valueType) {
                        case ApolloClr.StackValueType.i4: 
                            value = (v.intValue & 255);
                            break;
                        case ApolloClr.StackValueType.i8: 
                            value = System.Int64.clipu8(v.getValueLong());
                            break;
                        case ApolloClr.StackValueType.r4: 
                            value = Bridge.Int.clipu8(v.getValueFloat());
                            break;
                        case ApolloClr.StackValueType.r8: 
                            value = Bridge.Int.clipu8(v.getValueDouble());
                            break;
                    }
                    break;
                case ApolloClr.StackValueType.i1: 
                    switch (v.valueType) {
                        case ApolloClr.StackValueType.i4: 
                            value = Bridge.Int.sxb(v.intValue & 255);
                            break;
                        case ApolloClr.StackValueType.i8: 
                            value = System.Int64.clip8(v.getValueLong());
                            break;
                        case ApolloClr.StackValueType.r4: 
                            value = Bridge.Int.clip8(v.getValueFloat());
                            break;
                        case ApolloClr.StackValueType.r8: 
                            value = Bridge.Int.clip8(v.getValueDouble());
                            break;
                    }
                    break;
                case ApolloClr.StackValueType.u2: 
                    switch (v.valueType) {
                        case ApolloClr.StackValueType.i4: 
                            value = (v.intValue & 65535);
                            break;
                        case ApolloClr.StackValueType.i8: 
                            value = System.Int64.clipu16(v.getValueLong());
                            break;
                        case ApolloClr.StackValueType.r4: 
                            value = Bridge.Int.clipu16(v.getValueFloat());
                            break;
                        case ApolloClr.StackValueType.r8: 
                            value = Bridge.Int.clipu16(v.getValueDouble());
                            break;
                    }
                    break;
                case ApolloClr.StackValueType.i2: 
                    switch (v.valueType) {
                        case ApolloClr.StackValueType.i4: 
                            value = Bridge.Int.sxs(v.intValue & 65535);
                            break;
                        case ApolloClr.StackValueType.i8: 
                            value = System.Int64.clip16(v.getValueLong());
                            break;
                        case ApolloClr.StackValueType.r4: 
                            value = Bridge.Int.clip16(v.getValueFloat());
                            break;
                        case ApolloClr.StackValueType.r8: 
                            value = Bridge.Int.clip16(v.getValueDouble());
                            break;
                    }
                    break;
                case ApolloClr.StackValueType.u4: 
                    switch (v.valueType) {
                        case ApolloClr.StackValueType.i4: 
                            value = ((v.intValue >>> 0)) | 0;
                            break;
                        case ApolloClr.StackValueType.i8: 
                            value = (System.Int64.clipu32(v.getValueLong())) | 0;
                            break;
                        case ApolloClr.StackValueType.r4: 
                            value = (Bridge.Int.clipu32(v.getValueFloat())) | 0;
                            break;
                        case ApolloClr.StackValueType.r8: 
                            value = (Bridge.Int.clipu32(v.getValueDouble())) | 0;
                            break;
                    }
                    break;
                case ApolloClr.StackValueType.i4: 
                    switch (v.valueType) {
                        case ApolloClr.StackValueType.i4: 
                            value = v.intValue;
                            break;
                        case ApolloClr.StackValueType.i8: 
                            value = System.Int64.clip32(v.getValueLong());
                            break;
                        case ApolloClr.StackValueType.r4: 
                            value = Bridge.Int.clip32(v.getValueFloat());
                            break;
                        case ApolloClr.StackValueType.r8: 
                            value = Bridge.Int.clip32(v.getValueDouble());
                            break;
                    }
                    break;
                case ApolloClr.StackValueType.r4: 
                    switch (v.valueType) {
                        case ApolloClr.StackValueType.i4: 
                            {
                                value = v.intValue;

                                break;
                            }
                        case ApolloClr.StackValueType.i8: 
                            {
                                value = System.Int64.toNumber(v.getValueLong());

                                break;
                            }
                        case ApolloClr.StackValueType.r4: 
                            {
                                value = v.getValueFloat();

                                break;
                            }
                        case ApolloClr.StackValueType.r8: 
                            {
                                value = v.getValueDouble();

                                break;
                            }
                    }
                    break;
                case ApolloClr.StackValueType.u8: 
                    switch (v.valueType) {
                        case ApolloClr.StackValueType.i4: 
                            {
                                value = Bridge.Int.clipu64(v.intValue);

                                break;
                            }
                        case ApolloClr.StackValueType.i8: 
                            {
                                value = System.Int64.clipu64(v.getValueLong());

                                break;
                            }
                        case ApolloClr.StackValueType.r4: 
                            {
                                value = Bridge.Int.clipu64(v.getValueFloat());

                                break;
                            }
                        case ApolloClr.StackValueType.r8: 
                            {
                                value = Bridge.Int.clipu64(v.getValueDouble());

                                break;
                            }
                    }
                    break;
                case ApolloClr.StackValueType.i8: 
                    switch (v.valueType) {
                        case ApolloClr.StackValueType.i4: 
                            {
                                value = System.Int64(v.intValue);

                                break;
                            }
                        case ApolloClr.StackValueType.i8: 
                            {
                                value = v.getValueLong();

                                break;
                            }
                        case ApolloClr.StackValueType.r4: 
                            {
                                value = Bridge.Int.clip64(v.getValueFloat());

                                break;
                            }
                        case ApolloClr.StackValueType.r8: 
                            {
                                value = Bridge.Int.clip64(v.getValueDouble());

                                break;
                            }
                    }
                    break;
                case ApolloClr.StackValueType.r8: 
                    switch (v.valueType) {
                        case ApolloClr.StackValueType.i4: 
                            {
                                value = v.intValue;

                                break;
                            }
                        case ApolloClr.StackValueType.i8: 
                            {
                                value = System.Int64.toNumber(v.getValueLong());

                                break;
                            }
                        case ApolloClr.StackValueType.r4: 
                            {
                                value = v.getValueFloat();

                                break;
                            }
                        case ApolloClr.StackValueType.r8: 
                            {
                                value = v.getValueDouble();

                                break;
                            }
                    }
                    break;
            }
            switch (type) {
                case ApolloClr.StackValueType.i8: 
                case ApolloClr.StackValueType.r8: 
                case ApolloClr.StackValueType.r4: 
                    this.evaluationStack_Push$1(type, value);
                    break;
                default: 
                    this.evaluationStack_Push$1(type, System.Nullable.getValue(Bridge.cast(value, System.Int32)));
                    break;
            }


        },
        /**
         * 将 int8 类型的值作为 int32 间接加载到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {ApolloClr.StackValueType}    type
         * @return  {void}
         */
        ldind: function (type) {
            var vs = this.getStack().top();
            switch (vs.valueType) {
                case ApolloClr.StackValueType.Array: 
                    {
                        var array = Bridge.as(vs.ptr.object, Array);
                        vs.setValue(type, System.Array.get(array, vs.index));
                        break;
                    }
                case ApolloClr.StackValueType.i4: 
                case ApolloClr.StackValueType.r4: 
                case ApolloClr.StackValueType.i8: 
                case ApolloClr.StackValueType.r8: 
                case ApolloClr.StackValueType.Ref: 
                    {
                        break;
                    }
                default: 
                    throw new System.NotSupportedException();
            }
        },
        /**
         * 存储所提供地址处的对象引用值
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {ApolloClr.StackValueType}    type
         * @return  {void}
         */
        stind: function (type) {
            var vs = this.getStack().pop$1(2);
            var vsv = ApolloClr.StackItem.op_Addition(vs, 1);
            switch (vs.valueType) {
                case ApolloClr.StackValueType.Array: 
                    {
                        var array = Bridge.as(vs.ptr.object, Array);
                        System.Array.set(array, vsv.getValue(), vs.index);
                        break;
                    }
                case ApolloClr.StackValueType.i4: 
                case ApolloClr.StackValueType.r4: 
                case ApolloClr.StackValueType.i8: 
                case ApolloClr.StackValueType.r8: 
                case ApolloClr.StackValueType.Ref: 
                    {
                        break;
                    }
                default: 
                    throw new System.NotSupportedException();
            }
        },
        /**
         * 将两个值相加并将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        add: function () {
            var vs = this.evaluationStack_Pop$1(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
            var x = (vs.intValue + (ApolloClr.StackItem.op_Addition(vs, 1)).intValue) | 0;
            this.evaluationStack_Push$2(x);

        },
        /**
         * 从其他值中减去一个值并将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        sub: function () {
            var vs = this.evaluationStack_Pop$1(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
            var x = (vs.intValue - (ApolloClr.StackItem.op_Addition(vs, 1)).intValue) | 0;
            this.evaluationStack_Push$2(x);


        },
        /**
         * 将两个值相乘并将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        mul: function () {
            var vs = this.evaluationStack_Pop$1(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
            var x = (vs.intValue * (ApolloClr.StackItem.op_Addition(vs, 1)).intValue) | 0;
            this.evaluationStack_Push$2(x);


        },
        /**
         * 将两个值相除并将结果作为浮点（F 类型）或商（int32 类型）推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        div: function () {
            var vs = this.evaluationStack_Pop$1(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
            var x = (Bridge.Int.div(vs.intValue, (ApolloClr.StackItem.op_Addition(vs, 1)).intValue)) | 0;
            this.evaluationStack_Push$2(x);


        },
        /**
         * 将两个值相除并将余数推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        rem: function () {
            var vs = this.evaluationStack_Pop$1(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
            var x = vs.intValue % (ApolloClr.StackItem.op_Addition(vs, 1)).intValue;
            this.evaluationStack_Push$2(x);


        },
        /**
         * 计算两个值的按位“与”并将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        and: function () {
            var vs = this.evaluationStack_Pop$1(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
            var x = vs.intValue & (ApolloClr.StackItem.op_Addition(vs, 1)).intValue;

            this.evaluationStack_Push$2(x);

        },
        /**
         * 计算位于堆栈顶部的两个整数值的按位求补并将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        or: function () {
            var vs = this.evaluationStack_Pop$1(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
            var x = vs.intValue | (ApolloClr.StackItem.op_Addition(vs, 1)).intValue;
            this.evaluationStack_Push$2(x);

        },
        /**
         * 计算位于计算堆栈顶部的两个值的按位异或，并且将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        xor: function () {
            var vs = this.evaluationStack_Pop$1(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;

            var x = vs.intValue ^ (ApolloClr.StackItem.op_Addition(vs, 1)).intValue;
            this.evaluationStack_Push$2(x);

        },
        /**
         * 将整数值左移（用零填充）指定的位数，并将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        shl: function () {
            var vs = this.evaluationStack_Pop$1(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
            var x = vs.intValue << (ApolloClr.StackItem.op_Addition(vs, 1)).intValue;
            this.evaluationStack_Push$2(x);

        },
        /**
         * 将整数值右移（保留符号）指定的位数，并将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        shr: function () {
            var vs = this.evaluationStack_Pop$1(2);
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
            var x = vs.intValue >> (ApolloClr.StackItem.op_Addition(vs, 1)).intValue;
            this.evaluationStack_Push$2(x);

        },
        /**
         * 对一个值执行求反并将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        neg: function () {
            var vs = this.evaluationStack_Pop();
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
            var x = ~vs.intValue;
            this.evaluationStack_Push$2(x);

        },
        /**
         * 计算堆栈顶部整数值的按位求补并将结果作为相同的类型推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        not: function () {
            var vs = this.evaluationStack_Pop();
            //var x = *vs->VPoint + *(vs + 1)->VPoint;
            var x = ~vs.intValue;
            this.evaluationStack_Push$2(x);

        },
        /**
         * 比较两个值。如果这两个值相等，则将整数值 1 (int32) 推送到计算堆栈上；否则，将 0 (int32) 推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ceq: function () {
            var vs = this.evaluationStack_Pop$1(2);
            if (vs.intValue === (ApolloClr.StackItem.op_Addition(vs, 1)).intValue) {
                this.evaluationStack_Push$2(1);
            } else {
                this.evaluationStack_Push$2(0);
            }
        },
        /**
         * 比较两个值。如果第一个值大于第二个值，则将整数值 1 (int32) 推送到计算堆栈上；反之，将 0 (int32) 推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        cgt: function () {
            var vs = this.evaluationStack_Pop$1(2);
            if ((vs).intValue > (ApolloClr.StackItem.op_Addition(vs, 1)).intValue) {
                this.evaluationStack_Push$2(1);
            } else {
                this.evaluationStack_Push$2(0);
            }
        },
        /**
         * 比较两个值。如果第一个值小于第二个值，则将整数值 1 (int32) 推送到计算堆栈上；反之，将 0 (int32) 推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        clt: function () {
            var vs = this.evaluationStack_Pop$1(2);
            if ((vs).intValue < (ApolloClr.StackItem.op_Addition(vs, 1)).intValue) {
                this.evaluationStack_Push$2(1);
            } else {
                this.evaluationStack_Push$2(0);
            }
        }
    });

    Bridge.define("ApolloClr.Cross.ICrossMethodDelegate", {
        $kind: "interface"
    });

    Bridge.define("ApolloClr.Cross.CrossDomain", {
        statics: {
            methods: null,
            config: {
                init: function () {
                    this.methods = new (System.Collections.Generic.Dictionary$2(String,ApolloClr.Cross.CrossMethod))();
                }
            },
            build: function (callname) {
                //TODO ����
                if (ApolloClr.Cross.CrossDomain.methods.containsKey(callname)) {
                    return ApolloClr.Cross.CrossDomain.methods.get(callname);
                }
                var method = new ApolloClr.Cross.CrossMethod.$ctor1(callname);
                ApolloClr.Cross.CrossDomain.methods.set(callname, method);
                return method;
            }
        }
    });

    Bridge.define("ApolloClr.MethodTasks", {
        statics: {
            build$1: function (codes) {
                var list = ApolloClr.Method.ILCodeParse.readILCodes(codes);
                return ApolloClr.MethodTasks.build(ApolloClr.MethodTasks, list);
            },
            build: function (T, list, localvars, pargrams, haseResult, maxstack) {
                var $t;
                if (localvars === void 0) { localvars = null; }
                if (pargrams === void 0) { pargrams = null; }
                if (haseResult === void 0) { haseResult = true; }
                if (maxstack === void 0) { maxstack = 5; }
                var methodDefine = Bridge.merge(new T(), {
                    clr: new ApolloClr.Clr(localvars == null ? 5 : localvars.getCount(), pargrams == null ? 5 : pargrams.getCount(), haseResult, maxstack)
                } );

                var clr = methodDefine.clr;

                $t = Bridge.getEnumerator(list);
                while ($t.moveNext()) {
                    var line = $t.getCurrent();
                    if (System.String.isNullOrEmpty(line.opCode)) {
                        continue;
                    }
                    if (Bridge.referenceEquals(line.opCode, ".try")) {

                    }
                    var opcode = System.String.replaceAll(line.opCode, ".s", "");
                    var opcodeValue = opcode.split(String.fromCharCode(46));
                    var baseOp = opcodeValue[0];
                    var longOp = true;


                    var method = ApolloClr.MethodTasks.findMethod1(System.String.replaceAll(opcode, ".", "_"));
                    //ȫ

                    if (method == null && !Bridge.referenceEquals(System.String.concat(baseOp, "_", line.opArg0), System.String.replaceAll(opcode, ".", "_"))) {
                        method = ApolloClr.MethodTasks.findMethod1(System.String.concat(baseOp, "_", line.opArg0));
                        longOp = false;
                        if (method != null) {
                            opcodeValue = System.Array.init([System.String.concat(opcodeValue[0], "_", opcodeValue[1]), opcodeValue[2]], String);
                        }
                    }


                    if (method == null) {
                        method = ApolloClr.MethodTasks.findMethod(baseOp);
                        longOp = false;
                    }
                    if (method == null) {
                        throw new System.NotImplementedException(line.line);
                    }
                    if (System.String.indexOf(opcode, ".") === -1 && longOp) {
                        longOp = false;
                    }
                    var methodArg = null;
                    if (longOp) {
                        methodArg = ApolloClr.MethodTasks.argsFix(System.Array.init(["", line.arg0, line.arg1, line.arg2], String), method, list);
                    } else {
                        var subvalue = new (System.Collections.Generic.List$1(String))(opcodeValue);
                        if ((method.pi || []).length === 3) {
                            while (subvalue.getCount() < 3) {
                                subvalue.add(null);
                            }
                        }
                        subvalue.add(line.arg0);
                        subvalue.add(line.arg1);
                        subvalue.add(line.arg2);
                        methodArg = ApolloClr.MethodTasks.argsFix(subvalue.toArray(), method, list);
                    }

                    var tasktype = ApolloClr.MethodDefine.OpCodeTask;
                    var parms = (method.pi || []);
                    if (parms.length > 0) {

                        if (false) {
                            if (parms.length === 1) {
                                tasktype = System.Exction.makeGenericType(ApolloClr.MethodDefine.OpCodeTaskRef$1, [(parms[0].pt.$elementType || null)]);

                            } else if (parms.length === 2) {
                                tasktype = System.Exction.makeGenericType(ApolloClr.MethodDefine.OpCodeTaskRef$2, [(parms[0].pt.$elementType || null), (parms[1].pt.$elementType || null)]);

                            } else if (parms.length === 3) {
                                tasktype = System.Exction.makeGenericType(ApolloClr.MethodDefine.OpCodeTaskRef$3, [(parms[0].pt.$elementType || null), (parms[1].pt.$elementType || null), (parms[2].pt.$elementType || null)]);
                            } else if (parms.length === 4) {

                            }
                        } else {


                            {
                                if (parms.length === 1) {
                                    tasktype = System.Exction.makeGenericType(ApolloClr.MethodDefine.OpCodeTask$1, [parms[0].pt]);

                                } else if (parms.length === 2) {
                                    tasktype = System.Exction.makeGenericType(ApolloClr.MethodDefine.OpCodeTask$2, [parms[0].pt, parms[1].pt]);

                                } else if (parms.length === 3) {
                                    tasktype = System.Exction.makeGenericType(ApolloClr.MethodDefine.OpCodeTask$3, [parms[0].pt, parms[1].pt, parms[2].pt]);
                                } else if (parms.length === 4) {

                                }
                            }
                        }
                    }


                    var task = Bridge.as(Bridge.createInstance(tasktype), ApolloClr.IOpTask);

                    task.ApolloClr$IOpTask$setOpCode(line);

                    var funtask = Bridge.Reflection.getMembers(tasktype, 4, 284, "Func").rt;
                    var gtype = Bridge.Reflection.getMethodGenericArguments(method);
                    if (gtype.length === 0) {
                        var delage = Bridge.Reflection.midel(method, clr);

                        Bridge.Reflection.fieldAccess(Bridge.Reflection.getMembers(tasktype, 4, 284, "Func"), task, delage);
                    } else {
                        if (methodArg.length <= 0 || !Bridge.referenceEquals(Bridge.getType(methodArg[0]), Function)) {
                            throw new System.Exception("GenericMethod��First Pargram Type Mast Be System.Type!");
                        }
                        throw new System.NotSupportedException("GenericMethod, In BRIDGE Was Not Supported!");
                    }
                    for (var i = 1; i < 4; i = (i + 1) | 0) {
                        var v = Bridge.Reflection.getMembers(tasktype, 4, 284, "V" + i);
                        if (v != null) {
                            Bridge.Reflection.fieldAccess(v, task, methodArg[((i - 1) | 0)]);
                        } else {
                            break;
                        }
                    }

                    methodDefine.taskList.add(task);

                }


                return methodDefine;
            },
            argsFix: function (values, methodInfo, list) {
                var parms = (methodInfo.pi || []);
                var args = System.Array.init(parms.length, null, Object);

                for (var i = 0; i < args.length; i = (i + 1) | 0) {
                    if (values.length > i) {
                        var type = parms[i].pt;
                        args[i] = ApolloClr.MethodTasks.convert(type, values[((i + 1) | 0)], list);
                    }
                }

                return args;
            },
            convert: function (type, input, list) {
                if (Bridge.referenceEquals(type, String) || Bridge.referenceEquals(type, Object)) {
                    return input;
                }
                if (Bridge.referenceEquals(type, System.Array.type(System.Int32))) {
                    var lines = input.substr(1, ((input.length - 2) | 0)).split(String.fromCharCode(44));
                    var resule = System.Array.init(lines.length, 0, System.Int32);
                    for (var i = 0; i < lines.length; i = (i + 1) | 0) {
                        resule[i] = System.Nullable.getValue(Bridge.cast(ApolloClr.MethodTasks.convert(System.Int32, lines[i], list), System.Int32));
                    }
                    return resule;
                }
                if (Bridge.referenceEquals(type, Function)) {
                    return ApolloClr.Extensions.getTypeByName(input);
                }
                if (Bridge.Reflection.isEnum(type)) {
                    var value = System.Enum.parse(type, input, true);
                    return value;
                } else if (Bridge.referenceEquals(type, System.Single)) {
                    return System.Single.parse(input);
                } else if (Bridge.referenceEquals(type, System.Double)) {
                    return System.Double.parse(input);
                } else if (Bridge.referenceEquals(type, System.Int32)) {
                    if (System.String.startsWith(input, "IL_")) {
                        var find = System.Exction.findIndex(ApolloClr.ILCode, list, function (r) {
                            return Bridge.referenceEquals(r.lable, input);
                        });
                        if (find >= 0) {
                            return ((find - 1) | 0); //PC Move֮���++ ������ǰ��һ
                        } else {
                            throw new System.NotImplementedException();
                        }

                    }
                    if (input != null) {
                        if (System.String.startsWith(input, "m") || System.String.startsWith(input, "M")) {
                            return ((-System.Int32.parse(System.String.replaceAll(System.String.replaceAll(input.substr(1), "i", ""), "V_", ""))) | 0);
                        }
                        if (System.String.startsWith(input, "0x")) {
                            return System.Convert.toNumberInBase(input, 16, 9);
                        } else {
                            return System.Int32.parse(System.String.replaceAll(System.String.replaceAll(input, "i", ""), "V_", ""));
                        }

                    }
                    return 0;
                }
                return null;
            },
            findMethod1: function (name) {
                var $t;
                $t = Bridge.getEnumerator(Bridge.Reflection.getMembers(ApolloClr.Clr, 8, 28));
                while ($t.moveNext()) {
                    var methodInfo = $t.getCurrent();
                    if (Bridge.referenceEquals(methodInfo.n.toLowerCase(), name.toLowerCase())) {
                        return methodInfo;
                    }
                }

                return null;
            },
            findMethod: function (name) {
                var $t;
                $t = Bridge.getEnumerator(Bridge.Reflection.getMembers(ApolloClr.Clr, 8, 28));
                while ($t.moveNext()) {
                    var methodInfo = $t.getCurrent();
                    if (Bridge.referenceEquals(methodInfo.n.toLowerCase(), name.toLowerCase())) {
                        return methodInfo;
                    }
                }

                return null;
            }
        },
        clr: null,
        taskList: null,
        lines: null,
        PC: 0,
        end: 0,
        isEnd: true,
        trowException: null,
        isCatched: false,
        subTask: null,
        config: {
            properties: {
                Name: null
            },
            init: function () {
                this.taskList = new (System.Collections.Generic.List$1(ApolloClr.IOpTask))();
                this.subTask = new (System.Collections.Generic.List$1(ApolloClr.MethodTasks))();
            }
        },
        compile: function (OnCallAction, OnNewAction) {
            var $t;
            if (OnCallAction === void 0) { OnCallAction = null; }
            if (OnNewAction === void 0) { OnNewAction = null; }
            this.lines = this.taskList.toArray();
            $t = Bridge.getEnumerator(this.lines);
            while ($t.moveNext()) {
                (function () {
                    var opTask = $t.getCurrent();
                    if (Bridge.referenceEquals(opTask.ApolloClr$IOpTask$getOpCode().op, "call") || Bridge.referenceEquals(opTask.ApolloClr$IOpTask$getOpCode().op, "callvirt")) {
                        !Bridge.staticEquals(OnCallAction, null) ? OnCallAction(opTask) : null;
                    }
                    if (Bridge.referenceEquals(opTask.ApolloClr$IOpTask$getOpCode().op, "newobj")) {
                        !Bridge.staticEquals(OnNewAction, null) ? OnNewAction(opTask) : null;
                    }
                }).call(this);
            }
            this.end = this.lines.length;
            this.clr.dumpAction = (Bridge.fn.bind(this, $asm.$.ApolloClr.MethodTasks.f1));
            this.clr.throwAction = Bridge.fn.cacheBind(this, this.throwAction);

            return this;
        },
        /**
         * ����һ���쳣
         *
         * @instance
         * @public
         * @this ApolloClr.MethodTasks
         * @memberof ApolloClr.MethodTasks
         * @param   {Object}    ex    
         * @param   {number}    pc
         * @return  {void}
         */
        throwAction: function (ex, pc) {
            if (pc > 0) {
                //������һ���Ƿ���Finally
                if (Bridge.referenceEquals(this.lines[((this.PC + 1) | 0)].ApolloClr$IOpTask$getOpCode().opCode, "finally")) {

                } else {
                    this.PC = pc;
                }
            } else {
                if (ex != null) {
                    this.trowException = Bridge.as(ex, System.Exception);
                }
                this.isCatched = false;
                var nowPc = (this.PC - 1) | 0;

                for (var i = this.PC; i > 0; i = (i - 1) | 0) {
                    if (Bridge.referenceEquals(this.lines[i].ApolloClr$IOpTask$getOpCode().lable, ".try")) {
                        var value = Bridge.as(this.lines[i], ApolloClr.MethodDefine.OpCodeTask$3(System.Int32,System.Int32,System.Int32));
                        if (nowPc >= value.V1 && nowPc <= value.V2) {
                            //��ת
                            //�����ж� ���ƥ��

                            if (Bridge.referenceEquals(this.lines[value.V3].ApolloClr$IOpTask$getOpCode().opCode, "catch")) {
                                this.PC = value.V3;
                                this.isCatched = true;
                            } else {
                                this.PC = value.V3;
                            }

                            break;
                            //��ƥ�����Ѱ��
                        }
                    }
                }

            }


        },
        clone: function () {
            var any = System.Exction.find(ApolloClr.MethodTasks, this.subTask, $asm.$.ApolloClr.MethodTasks.f2);
            if (any == null) {
                this.subTask.add(this.cloneOne());
                return System.Linq.Enumerable.from(this.subTask).last();
            }
            return any;
        },
        cloneOne: function () {
            throw new System.NotSupportedException();
        },
        run: function () {
            //Console.WriteLine("==========Run===========:" + Name);
            this.PC = 0;
            this.isEnd = false;
            while (this.PC < this.end) {

                //try
                //{
                this.lines[this.PC].ApolloClr$IOpTask$run();

                //}
                //catch (Exception ex)
                //{
                //    Clr.EvaluationStack_Push(0);
                //    ThrowAction(ex, -1);
                //}

                this.PC = (this.PC + 1) | 0;
            }

            this.isEnd = true;
            //Console.WriteLine("==========Run End===========:" + Name);
            if (this.trowException != null && !this.isCatched) {
                //�����������֮����Ȼ���쳣�׳�
                throw this.trowException;
            }
        }
    });

    Bridge.ns("ApolloClr.MethodTasks", $asm.$);

    Bridge.apply($asm.$.ApolloClr.MethodTasks, {
        f1: function (r) {
            this.PC = r;
        },
        f2: function (r) {
            return r.isEnd;
        }
    });

    Bridge.define("ApolloClr.Cross.CrossMethodDelegate$2", function (T1, T2) { return {

    }; });

    Bridge.define("ApolloClr.Cross.CrossMethodDelegate$3", function (T1, T2, T3) { return {

    }; });

    Bridge.define("ApolloClr.Extensions", {
        statics: {
            deleageSetFun: null,
            setTarget: function (delegate, target) {

                var _old = delegate;
                var action = function () {
                    target.$scope = target;
                    return _old.apply(target, arguments);
                };
                delegate = action;

                return delegate;

            },
            getFSet: function (field) {
                var action = function (send, v) {
                    Bridge.Reflection.fieldAccess(field, send, v);
                };

                return action;

            },
            getValueFromStr: function (str, vtype) {
                var value = null;
                switch (vtype) {
                    case ApolloClr.StackValueType.i8: 
                        value = System.Int64.parse(str);
                        break;
                    case ApolloClr.StackValueType.r8: 
                        value = System.Double.parse(str);
                        break;
                    case ApolloClr.StackValueType.i4: 
                        if (System.String.startsWith(str, "0x")) {
                            value = System.Convert.toNumberInBase(str, 16, 9);
                        } else if (System.String.startsWith(str, "M") || System.String.startsWith(str, "m")) {
                            value = (((-System.Int32.parse(str)) | 0));
                        } else {
                            value = System.Int32.parse(str);

                        }
                        break;
                    case ApolloClr.StackValueType.r4: 
                        value = System.Single.parse(str);
                        break;
                }

                return value;
            },
            getMethodInfo: function (type, name, types) {
                var $t;
                var mi = Bridge.Reflection.getMembers(type, 8, 284, name, types);
                if (mi != null) {
                    return mi;
                }
                mi = Bridge.Reflection.getMembers(type, 8, 284, name.toLowerCase(), types);

                if (mi == null) {
                    $t = Bridge.getEnumerator(Bridge.Reflection.getMembers(type, 8, 28));
                    while ($t.moveNext()) {
                        var methodInfo = $t.getCurrent();
                        if (Bridge.referenceEquals(methodInfo.n.toLowerCase(), name.toLowerCase())) {
                            return methodInfo;
                        }
                    }
                }
                return mi;
            },
            getTypeByName: function (name) {
                name = System.String.replaceAll(name, "[mscorlib]", "");
                var type = Bridge.Reflection.getType(name);

                if (type != null) {
                    return type;
                }
                if (System.String.startsWith(name, "System")) {
                    type = Bridge.Reflection.getType(name, Bridge.Reflection.getTypeAssembly(System.Int32));

                }
                if (type == null && System.String.startsWith(name, "System")) {
                    type = Bridge.Reflection.getType(name, Bridge.Reflection.getTypeAssembly(System.Diagnostics.Stopwatch));

                    if (type == null) {

                        if (Bridge.referenceEquals("System.Console", name)) {
                            return console;
                        }
                        type = Bridge.Reflection.getType(System.String.replaceAll(name, "System.", "Bridge."), Bridge.Reflection.getTypeAssembly(System.Diagnostics.Stopwatch));
                    }
                }
                if (type != null) {
                    return type;
                }
                switch (name) {
                    case "string": 
                        return String;
                    case "int32": 
                        return System.Int32;
                    case "int64": 
                        return System.Int64;
                    case "float64": 
                        return System.Double;
                    case "float32": 
                        return System.Single;
                }

                if (type == null) {
                    throw new System.NotSupportedException(System.String.concat("Type  Was  Not Fount :", name));
                }
                return type;
            }
        }
    });

    Bridge.define("ApolloClr.ILCode", {
        lable: null,
        opCode: null,
        op: null,
        opArg0: null,
        opArg1: null,
        arg0: null,
        arg1: null,
        arg2: null,
        line: null,
        toString: function () {
            return this.line;
        }
    });

    Bridge.define("ApolloClr.IOpTask", {
        $kind: "interface"
    });

    Bridge.define("ApolloClr.Js.App", {
        statics: {
            run1: function () {
                var i = 1;
                var j = 2;
                var k = 3;
                var answer = (((i + j) | 0) + k) | 0;
                return answer;
            }
        },
        $main: function () {


            var code = "\r\n\tIL_0000: nop\r\n\tIL_0001: ldc.i4.1\r\n\tIL_0002: stloc.0\r\n\tIL_0003: ldc.i4.2\r\n\tIL_0004: stloc.1\r\n\tIL_0005: ldc.i4.3\r\n\tIL_0006: stloc.2\r\n\tIL_0007: ldloc.0\r\n\tIL_0008: ldloc.1\r\n\tIL_0009: add\r\n\tIL_000a: ldloc.2\r\n\tIL_000b: add\r\n\tIL_000c: stloc.3\r\n\tIL_000d: ldloc.3\r\n\tIL_000e: stloc.s 4\r\n\tIL_0010: br.s IL_0012\r\n\r\n\tIL_0012: ldloc.s 4\r\n\tIL_0014: ret\r\n";
            if (true) {
                var count = 100000;
                var sw = new System.Diagnostics.Stopwatch();
                var func = ApolloClr.MethodTasks.build$1(code).compile();


                sw.restart();
                sw.start();
                for (var i = 0; i < count; i = (i + 1) | 0) {
                    func.run();
                }
                sw.stop();
                Bridge.Console.log(sw.milliseconds().toString());
                sw.restart();
                sw.start();
                for (var i1 = 0; i1 < count; i1 = (i1 + 1) | 0) {
                    ApolloClr.Js.App.run1();
                }
                sw.stop();
                Bridge.Console.log(sw.milliseconds().toString());
            }

            $.ajax({ url: "out.il", data: "", contentType: "application/json; charset=utf-8", success: $asm.$.ApolloClr.Js.App.f1 });
        }
    });

    Bridge.ns("ApolloClr.Js.App", $asm.$);

    Bridge.apply($asm.$.ApolloClr.Js.App, {
        f1: function (data, str, jqxhr) {
            //Console.WriteLine(str);

            var json = System.String.concat(data, "");
            Bridge.Console.log(System.String.concat("Result:", json));
            var result = ApolloClr.TypeDefine.AssemblyDefine.readAndRun(json, "Test", "RunF1");
            Bridge.Console.log(System.String.concat("End:", JSON.stringify(result)));
        }
    });

    Bridge.define("ApolloClr.Method.ILCodeParse", {
        statics: {
            readILCodes: function (ilcodes, locals, args) {
                if (locals === void 0) { locals = null; }
                if (args === void 0) { args = null; }
                var lines = ilcodes.split(String.fromCharCode(13));
                return ApolloClr.Method.ILCodeParse.readILCodes$1(lines);
            },
            readILCodes$1: function (lines, locals, args) {
                var $t;
                if (locals === void 0) { locals = null; }
                if (args === void 0) { args = null; }


                var list = new (System.Collections.Generic.List$1(ApolloClr.ILCode))();
                //重置堆栈
                list.add(Bridge.merge(new ApolloClr.ILCode(), {
                    opCode: "Reset",
                    line: "Reset"
                } ));

                var switchStart = false;
                var sline = new System.Text.StringBuilder();


                $t = Bridge.getEnumerator(lines);
                while ($t.moveNext()) {
                    var xline = $t.getCurrent();
                    var line = xline;
                    var values = line.trim().split(String.fromCharCode(32));

                    if (values.length >= 2 && Bridge.referenceEquals(values[1], "switch")) {
                        switchStart = true;
                        sline = new System.Text.StringBuilder();

                    }
                    if (switchStart) {
                        sline.append(line);
                        if (System.String.endsWith(line, ")")) {
                            switchStart = false;
                            line = sline.toString();
                            values = line.trim().split(String.fromCharCode(32));
                        } else {
                            continue;
                        }
                    }




                    if (values.length > 4) {
                        for (var i = 5; i < values.length; i = (i + 1) | 0) {
                            values[4] = System.String.concat(values[4], (System.String.concat(" ", values[i])));
                        }
                    }
                    {
                        //如果是字符串
                        var index = System.String.indexOf(line, "\"");
                        var indexe = line.lastIndexOf("\"");
                        if (indexe !== -1 && index !== -1) {
                            var str = line.substr(((index + 1) | 0), ((((indexe - index) | 0) - 1) | 0));
                            var subline = System.String.concat(line.substr(0, ((index + 1) | 0)), "str", line.substr(indexe));
                            values = subline.trim().split(String.fromCharCode(32));
                            var indexx = new (System.Collections.Generic.List$1(String))(values).indexOf("\"str\"");
                            values[indexx] = str;
                        }
                    }


                    var illine = new ApolloClr.ILCode();
                    illine.line = line;
                    if (list.getCount() > 0 && (Bridge.referenceEquals(System.Linq.Enumerable.from(list).last().opCode, "try") || Bridge.referenceEquals(System.Linq.Enumerable.from(list).last().opCode, "catch") || Bridge.referenceEquals(System.Linq.Enumerable.from(list).last().opCode, "finally"))) {
                        System.Linq.Enumerable.from(list).last().arg1 = line;
                    }

                    list.add(illine);

                    for (var i1 = 0; i1 < values.length; i1 = (i1 + 1) | 0) {
                        if (i1 === 0) {
                            illine.lable = System.String.replaceAll(values[0], ":", "");

                        }
                        if (i1 === 1) {
                            illine.opCode = values[1];
                            var opcodeValue = illine.opCode.split(String.fromCharCode(46));
                            illine.op = opcodeValue[0];
                            if (opcodeValue.length >= 2) {
                                illine.opArg0 = opcodeValue[1];
                            }
                            if (opcodeValue.length >= 3) {
                                illine.opArg1 = opcodeValue[2];

                            }
                        }
                        if (i1 === 2) {
                            illine.arg0 = values[2];
                        }
                        if (i1 === 3) {
                            illine.arg1 = values[3];
                        }
                        if (i1 === 4) {
                            illine.arg2 = values[4];
                        }
                    }


                }
                list = ApolloClr.Method.ILCodeParse.fixTryCatchFinally(list);
                //解析 生成
                list = ApolloClr.Method.ILCodeParse.mergeCodes(list, locals, args);
                return list;
            },
            fixTryCatchFinally: function (input) {
                var $t;
                var stack = new (System.Collections.Generic.Stack$1(ApolloClr.ILCode)).ctor();
                var lastTry = null;
                for (var i = 0; i < input.getCount(); i = (i + 1) | 0) {
                    if (input.getItem(i).line == null) {
                        continue;
                    }
                    if (Bridge.referenceEquals(input.getItem(i).line, ".try") || System.String.startsWith(input.getItem(i).line, "catch") || System.String.startsWith(input.getItem(i).line, "finally")) {
                        input.getItem(i).arg0 = System.Linq.Enumerable.from(input).skip(i).first($asm.$.ApolloClr.Method.ILCodeParse.f1).lable;
                        stack.push(input.getItem(i));
                        input.getItem(i).opCode = input.getItem(i).lable;
                        if (Bridge.referenceEquals(input.getItem(i).line, ".try")) {

                        } else {
                            lastTry.arg2 = input.getItem(i).arg0;
                        }
                    }
                    if (System.String.startsWith(input.getItem(i).line, "}")) {
                        var item = stack.pop();
                        item.arg1 = System.Linq.Enumerable.from(input).take(i).last($asm.$.ApolloClr.Method.ILCodeParse.f1).lable;
                        if (Bridge.referenceEquals(item.line, ".try")) {
                            lastTry = item;
                        } else {

                        }
                    }
                }
                $t = Bridge.getEnumerator(input.toArray());
                while ($t.moveNext()) {
                    var ilCode = $t.getCurrent();
                    if (System.String.startsWith(ilCode.line, "{") || System.String.startsWith(ilCode.line, "}") || System.String.isNullOrEmpty(ilCode.line)) {
                        input.remove(ilCode);
                    }
                }

                return input;
            },
            /**
             * 指令优化，合并指令
             *
             * @static
             * @public
             * @this ApolloClr.Method.ILCodeParse
             * @memberof ApolloClr.Method.ILCodeParse
             * @param   {System.Collections.Generic.List$1}    input     
             * @param   {System.Collections.Generic.List$1}    locals    
             * @param   {System.Collections.Generic.List$1}    args
             * @return  {System.Collections.Generic.List$1}
             */
            mergeCodes: function (input, locals, args) {
                if (locals === void 0) { locals = null; }
                if (args === void 0) { args = null; }
                var outPut = new (System.Collections.Generic.List$1(ApolloClr.ILCode))();
                var opSpeed = new (System.Collections.Generic.List$1(String))(System.Array.init(["add", "sub", "mul", "div"], String));
                for (var i = 0; i < input.getCount(); i = (i + 1) | 0) {
                    var now = input.getItem(i);
                    //if (now.OpCode == "nop")
                    //{
                    //    continue;
                    //}
                    if (i > 2 && i < ((input.getCount() - 2) | 0)) {
                        var before2 = input.getItem(((((i - 1) | 0) - 1) | 0));
                        var before = input.getItem(((i - 1) | 0));
                        var next = input.getItem(((i + 1) | 0));
                        var newx2 = input.getItem(((((i + 1) | 0) + 1) | 0));
                        if (opSpeed.contains(now.op) && locals != null) {
                            if (Bridge.referenceEquals(before2.op, "ldc")) {
                                now.opCode = System.String.concat(now.opCode, (System.String.concat(".", before2.opArg0)));
                            } else if (Bridge.referenceEquals(before.op, "ldc")) {
                                now.opCode = System.String.concat(now.opCode, (System.String.concat(".", before.opArg0)));
                            } else if (Bridge.referenceEquals(before2.op, "ldloc")) {
                                now.opCode = System.String.concat(now.opCode, (System.String.concat(".", locals.getItem(System.Int32.parse(before2.opArg0)))));
                            } else if (Bridge.referenceEquals(before.op, "ldloc")) {
                                now.opCode = System.String.concat(now.opCode, (System.String.concat(".", locals.getItem(System.Int32.parse(before.opArg0)))));
                            } else if (Bridge.referenceEquals(before2.op, "ldarg")) {
                                now.opCode = System.String.concat(now.opCode, (System.String.concat(".", args.getItem(System.Int32.parse(before2.opArg0)))));
                            } else if (Bridge.referenceEquals(before.op, "ldarg")) {
                                now.opCode = System.String.concat(now.opCode, (System.String.concat(".", args.getItem(System.Int32.parse(before.opArg0)))));
                            }
                        }
                    }
                    if (i < ((input.getCount() - 2) | 0)) {

                        var next1 = input.getItem(((i + 1) | 0));
                        var newx21 = input.getItem(((((i + 1) | 0) + 1) | 0));
                    }

                    outPut.add(now);
                }

                return outPut;
            }
        }
    });

    Bridge.ns("ApolloClr.Method.ILCodeParse", $asm.$);

    Bridge.apply($asm.$.ApolloClr.Method.ILCodeParse, {
        f1: function (r) {
            return r.lable != null && System.String.startsWith(r.lable, "IL");
        }
    });

    Bridge.define("ApolloClr.MethodDefine.BaseOpTask", {
        config: {
            properties: {
                Dump: 0,
                OpCode: null,
                Method: null
            }
        },
        toString: function () {
            return System.String.concat("", this.getOpCode());
        }
    });

    Bridge.define("ApolloClr.OpCodeEnum", {
        $kind: "enum",
        statics: {
            /**
             * 如果修补操作码，则填充空间。尽管可能消耗处理周期，但未执行任何有意义的操作。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 0
             * @type ApolloClr.OpCodeEnum
             */
            Nop: 0,
            /**
             * 向公共语言结构 (CLI) 发出信号以通知调试器已撞上了一个断点。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 1
             * @type ApolloClr.OpCodeEnum
             */
            Break: 1,
            /**
             * 将索引为 0 的参数加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 2
             * @type ApolloClr.OpCodeEnum
             */
            Ldarg_0: 2,
            /**
             * 将索引为 1 的参数加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 3
             * @type ApolloClr.OpCodeEnum
             */
            Ldarg_1: 3,
            /**
             * 将索引为 2 的参数加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 4
             * @type ApolloClr.OpCodeEnum
             */
            Ldarg_2: 4,
            /**
             * 将索引为 3 的参数加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 5
             * @type ApolloClr.OpCodeEnum
             */
            Ldarg_3: 5,
            /**
             * 将索引 0 处的局部变量加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 6
             * @type ApolloClr.OpCodeEnum
             */
            Ldloc_0: 6,
            /**
             * 将索引 1 处的局部变量加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 7
             * @type ApolloClr.OpCodeEnum
             */
            Ldloc_1: 7,
            /**
             * 将索引 2 处的局部变量加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 8
             * @type ApolloClr.OpCodeEnum
             */
            Ldloc_2: 8,
            /**
             * 将索引 3 处的局部变量加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 9
             * @type ApolloClr.OpCodeEnum
             */
            Ldloc_3: 9,
            /**
             * 从计算堆栈的顶部弹出当前值并将其存储到索引 0 处的局部变量列表中。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 10
             * @type ApolloClr.OpCodeEnum
             */
            Stloc_0: 10,
            /**
             * 从计算堆栈的顶部弹出当前值并将其存储到索引 1 处的局部变量列表中。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 11
             * @type ApolloClr.OpCodeEnum
             */
            Stloc_1: 11,
            /**
             * 从计算堆栈的顶部弹出当前值并将其存储到索引 2 处的局部变量列表中。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 12
             * @type ApolloClr.OpCodeEnum
             */
            Stloc_2: 12,
            /**
             * 从计算堆栈的顶部弹出当前值并将其存储到索引 3 处的局部变量列表中。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 13
             * @type ApolloClr.OpCodeEnum
             */
            Stloc_3: 13,
            /**
             * 将参数（由指定的短格式索引引用）加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 14
             * @type ApolloClr.OpCodeEnum
             */
            Ldarg_S: 14,
            /**
             * 以短格式将参数地址加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 15
             * @type ApolloClr.OpCodeEnum
             */
            Ldarga_S: 15,
            /**
             * 将位于计算堆栈顶部的值存储在参数槽中的指定索引处（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 16
             * @type ApolloClr.OpCodeEnum
             */
            Starg_S: 16,
            /**
             * 将特定索引处的局部变量加载到计算堆栈上（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 17
             * @type ApolloClr.OpCodeEnum
             */
            Ldloc_S: 17,
            /**
             * 将位于特定索引处的局部变量的地址加载到计算堆栈上（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 18
             * @type ApolloClr.OpCodeEnum
             */
            Ldloca_S: 18,
            /**
             * 从计算堆栈的顶部弹出当前值并将其存储在局部变量列表中的 index 处（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 19
             * @type ApolloClr.OpCodeEnum
             */
            Stloc_S: 19,
            /**
             * 将空引用（O 类型）推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 20
             * @type ApolloClr.OpCodeEnum
             */
            Ldnull: 20,
            /**
             * 将整数值 -1 作为 int32 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 21
             * @type ApolloClr.OpCodeEnum
             */
            Ldc_I4_M1: 21,
            /**
             * 将整数值 0 作为 int32 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 22
             * @type ApolloClr.OpCodeEnum
             */
            Ldc_I4_0: 22,
            /**
             * 将整数值 1 作为 int32 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 23
             * @type ApolloClr.OpCodeEnum
             */
            Ldc_I4_1: 23,
            /**
             * 将整数值 2 作为 int32 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 24
             * @type ApolloClr.OpCodeEnum
             */
            Ldc_I4_2: 24,
            /**
             * 将整数值 3 作为 int32 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 25
             * @type ApolloClr.OpCodeEnum
             */
            Ldc_I4_3: 25,
            /**
             * 将整数值 4 作为 int32 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 26
             * @type ApolloClr.OpCodeEnum
             */
            Ldc_I4_4: 26,
            /**
             * 将整数值 5 作为 int32 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 27
             * @type ApolloClr.OpCodeEnum
             */
            Ldc_I4_5: 27,
            /**
             * 将整数值 6 作为 int32 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 28
             * @type ApolloClr.OpCodeEnum
             */
            Ldc_I4_6: 28,
            /**
             * 将整数值 7 作为 int32 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 29
             * @type ApolloClr.OpCodeEnum
             */
            Ldc_I4_7: 29,
            /**
             * 将整数值 8 作为 int32 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 30
             * @type ApolloClr.OpCodeEnum
             */
            Ldc_I4_8: 30,
            /**
             * 将提供的 int8 值作为 int32 推送到计算堆栈上（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 31
             * @type ApolloClr.OpCodeEnum
             */
            Ldc_I4_S: 31,
            /**
             * 将所提供的 int32 类型的值作为 int32 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 32
             * @type ApolloClr.OpCodeEnum
             */
            Ldc_I4: 32,
            /**
             * 将所提供的 int64 类型的值作为 int64 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 33
             * @type ApolloClr.OpCodeEnum
             */
            Ldc_I8: 33,
            /**
             * 将所提供的 float32 类型的值作为 F (float) 类型推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 34
             * @type ApolloClr.OpCodeEnum
             */
            Ldc_R4: 34,
            /**
             * 将所提供的 float64 类型的值作为 F (float) 类型推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 35
             * @type ApolloClr.OpCodeEnum
             */
            Ldc_R8: 35,
            /**
             * 复制计算堆栈上当前最顶端的值，然后将副本推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 36
             * @type ApolloClr.OpCodeEnum
             */
            Dup: 36,
            /**
             * 移除当前位于计算堆栈顶部的值。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 37
             * @type ApolloClr.OpCodeEnum
             */
            Pop: 37,
            /**
             * 退出当前方法并跳至指定方法。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 38
             * @type ApolloClr.OpCodeEnum
             */
            Jmp: 38,
            /**
             * 调用由传递的方法说明符指示的方法。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 39
             * @type ApolloClr.OpCodeEnum
             */
            Call: 39,
            /**
             * 通过调用约定描述的参数调用在计算堆栈上指示的方法（作为指向入口点的指针）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 40
             * @type ApolloClr.OpCodeEnum
             */
            Calli: 40,
            /**
             * 从当前方法返回，并将返回值（如果存在）从调用方的计算堆栈推送到被调用方的计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 41
             * @type ApolloClr.OpCodeEnum
             */
            Ret: 41,
            /**
             * 无条件地将控制转移到目标指令（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 42
             * @type ApolloClr.OpCodeEnum
             */
            Br_S: 42,
            /**
             * 如果 value 为 false、空引用或零，则将控制转移到目标指令。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 43
             * @type ApolloClr.OpCodeEnum
             */
            Brfalse_S: 43,
            /**
             * 如果 value 为 true、非空或非零，则将控制转移到目标指令（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 44
             * @type ApolloClr.OpCodeEnum
             */
            Brtrue_S: 44,
            /**
             * 如果两个值相等，则将控制转移到目标指令（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 45
             * @type ApolloClr.OpCodeEnum
             */
            Beq_S: 45,
            /**
             * 如果第一个值大于或等于第二个值，则将控制转移到目标指令（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 46
             * @type ApolloClr.OpCodeEnum
             */
            Bge_S: 46,
            /**
             * 如果第一个值大于第二个值，则将控制转移到目标指令（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 47
             * @type ApolloClr.OpCodeEnum
             */
            Bgt_S: 47,
            /**
             * 如果第一个值小于或等于第二个值，则将控制转移到目标指令（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 48
             * @type ApolloClr.OpCodeEnum
             */
            Ble_S: 48,
            /**
             * 如果第一个值小于第二个值，则将控制转移到目标指令（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 49
             * @type ApolloClr.OpCodeEnum
             */
            Blt_S: 49,
            /**
             * 当两个无符号整数值或不可排序的浮点型值不相等时，将控制转移到目标指令（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 50
             * @type ApolloClr.OpCodeEnum
             */
            Bne_Un_S: 50,
            /**
             * 当比较无符号整数值或不可排序的浮点型值时，如果第一个值大于第二个值，则将控制转移到目标指令（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 51
             * @type ApolloClr.OpCodeEnum
             */
            Bge_Un_S: 51,
            /**
             * 当比较无符号整数值或不可排序的浮点型值时，如果第一个值大于第二个值，则将控制转移到目标指令（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 52
             * @type ApolloClr.OpCodeEnum
             */
            Bgt_Un_S: 52,
            /**
             * 当比较无符号整数值或不可排序的浮点值时，如果第一个值小于或等于第二个值，则将控制权转移到目标指令（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 53
             * @type ApolloClr.OpCodeEnum
             */
            Ble_Un_S: 53,
            /**
             * 当比较无符号整数值或不可排序的浮点型值时，如果第一个值小于第二个值，则将控制转移到目标指令（短格式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 54
             * @type ApolloClr.OpCodeEnum
             */
            Blt_Un_S: 54,
            /**
             * 无条件地将控制转移到目标指令。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 55
             * @type ApolloClr.OpCodeEnum
             */
            Br: 55,
            /**
             * 如果 value 为 false、空引用（Visual Basic 中的 Nothing）或零，则将控制转移到目标指令。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 56
             * @type ApolloClr.OpCodeEnum
             */
            Brfalse: 56,
            /**
             * 如果 value 为 true、非空或非零，则将控制转移到目标指令。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 57
             * @type ApolloClr.OpCodeEnum
             */
            Brtrue: 57,
            /**
             * 如果两个值相等，则将控制转移到目标指令。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 58
             * @type ApolloClr.OpCodeEnum
             */
            Beq: 58,
            /**
             * 如果第一个值大于或等于第二个值，则将控制转移到目标指令。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 59
             * @type ApolloClr.OpCodeEnum
             */
            Bge: 59,
            /**
             * 如果第一个值大于第二个值，则将控制转移到目标指令。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 60
             * @type ApolloClr.OpCodeEnum
             */
            Bgt: 60,
            /**
             * 如果第一个值小于或等于第二个值，则将控制转移到目标指令。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 61
             * @type ApolloClr.OpCodeEnum
             */
            Ble: 61,
            /**
             * 如果第一个值小于第二个值，则将控制转移到目标指令。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 62
             * @type ApolloClr.OpCodeEnum
             */
            Blt: 62,
            /**
             * 当两个无符号整数值或不可排序的浮点型值不相等时，将控制转移到目标指令。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 63
             * @type ApolloClr.OpCodeEnum
             */
            Bne_Un: 63,
            /**
             * 当比较无符号整数值或不可排序的浮点型值时，如果第一个值大于第二个值，则将控制转移到目标指令。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 64
             * @type ApolloClr.OpCodeEnum
             */
            Bge_Un: 64,
            /**
             * 当比较无符号整数值或不可排序的浮点型值时，如果第一个值大于第二个值，则将控制转移到目标指令。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 65
             * @type ApolloClr.OpCodeEnum
             */
            Bgt_Un: 65,
            /**
             * 当比较无符号整数值或不可排序的浮点型值时，如果第一个值小于或等于第二个值，则将控制转移到目标指令。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 66
             * @type ApolloClr.OpCodeEnum
             */
            Ble_Un: 66,
            /**
             * 当比较无符号整数值或不可排序的浮点型值时，如果第一个值小于第二个值，则将控制转移到目标指令。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 67
             * @type ApolloClr.OpCodeEnum
             */
            Blt_Un: 67,
            /**
             * 实现跳转表。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 68
             * @type ApolloClr.OpCodeEnum
             */
            Switch: 68,
            /**
             * 将 int8 类型的值作为 int32 间接加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 69
             * @type ApolloClr.OpCodeEnum
             */
            Ldind_I1: 69,
            /**
             * 将 unsigned int8 类型的值作为 int32 间接加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 70
             * @type ApolloClr.OpCodeEnum
             */
            Ldind_U1: 70,
            /**
             * 将 int16 类型的值作为 int32 间接加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 71
             * @type ApolloClr.OpCodeEnum
             */
            Ldind_I2: 71,
            /**
             * 将 unsigned int16 类型的值作为 int32 间接加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 72
             * @type ApolloClr.OpCodeEnum
             */
            Ldind_U2: 72,
            /**
             * 将 int32 类型的值作为 int32 间接加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 73
             * @type ApolloClr.OpCodeEnum
             */
            Ldind_I4: 73,
            /**
             * 将 unsigned int32 类型的值作为 int32 间接加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 74
             * @type ApolloClr.OpCodeEnum
             */
            Ldind_U4: 74,
            /**
             * 将 int64 类型的值作为 int64 间接加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 75
             * @type ApolloClr.OpCodeEnum
             */
            Ldind_I8: 75,
            /**
             * 将 native int 类型的值作为 native int 间接加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 76
             * @type ApolloClr.OpCodeEnum
             */
            Ldind_I: 76,
            /**
             * 将 float32 类型的值作为 F (float) 类型间接加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 77
             * @type ApolloClr.OpCodeEnum
             */
            Ldind_R4: 77,
            /**
             * 将 float64 类型的值作为 F (float) 类型间接加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 78
             * @type ApolloClr.OpCodeEnum
             */
            Ldind_R8: 78,
            /**
             * 将对象引用作为 O（对象引用）类型间接加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 79
             * @type ApolloClr.OpCodeEnum
             */
            Ldind_Ref: 79,
            /**
             * 存储所提供地址处的对象引用值。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 80
             * @type ApolloClr.OpCodeEnum
             */
            Stind_Ref: 80,
            /**
             * 在所提供的地址存储 int8 类型的值。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 81
             * @type ApolloClr.OpCodeEnum
             */
            Stind_I1: 81,
            /**
             * 在所提供的地址存储 int16 类型的值。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 82
             * @type ApolloClr.OpCodeEnum
             */
            Stind_I2: 82,
            /**
             * 在所提供的地址存储 int32 类型的值。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 83
             * @type ApolloClr.OpCodeEnum
             */
            Stind_I4: 83,
            /**
             * 在所提供的地址存储 int64 类型的值。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 84
             * @type ApolloClr.OpCodeEnum
             */
            Stind_I8: 84,
            /**
             * 在所提供的地址存储 float32 类型的值。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 85
             * @type ApolloClr.OpCodeEnum
             */
            Stind_R4: 85,
            /**
             * 在所提供的地址存储 float64 类型的值。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 86
             * @type ApolloClr.OpCodeEnum
             */
            Stind_R8: 86,
            /**
             * 将两个值相加并将结果推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 87
             * @type ApolloClr.OpCodeEnum
             */
            Add: 87,
            /**
             * 从其他值中减去一个值并将结果推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 88
             * @type ApolloClr.OpCodeEnum
             */
            Sub: 88,
            /**
             * 将两个值相乘并将结果推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 89
             * @type ApolloClr.OpCodeEnum
             */
            Mul: 89,
            /**
             * 将两个值相除并将结果作为浮点（F 类型）或商（int32 类型）推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 90
             * @type ApolloClr.OpCodeEnum
             */
            Div: 90,
            /**
             * 两个无符号整数值相除并将结果 ( int32 ) 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 91
             * @type ApolloClr.OpCodeEnum
             */
            Div_Un: 91,
            /**
             * 将两个值相除并将余数推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 92
             * @type ApolloClr.OpCodeEnum
             */
            Rem: 92,
            /**
             * 将两个无符号值相除并将余数推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 93
             * @type ApolloClr.OpCodeEnum
             */
            Rem_Un: 93,
            /**
             * 计算两个值的按位“与”并将结果推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 94
             * @type ApolloClr.OpCodeEnum
             */
            And: 94,
            /**
             * 计算位于堆栈顶部的两个整数值的按位求补并将结果推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 95
             * @type ApolloClr.OpCodeEnum
             */
            Or: 95,
            /**
             * 计算位于计算堆栈顶部的两个值的按位异或，并且将结果推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 96
             * @type ApolloClr.OpCodeEnum
             */
            Xor: 96,
            /**
             * 将整数值左移（用零填充）指定的位数，并将结果推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 97
             * @type ApolloClr.OpCodeEnum
             */
            Shl: 97,
            /**
             * 将整数值右移（保留符号）指定的位数，并将结果推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 98
             * @type ApolloClr.OpCodeEnum
             */
            Shr: 98,
            /**
             * 将无符号整数值右移（用零填充）指定的位数，并将结果推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 99
             * @type ApolloClr.OpCodeEnum
             */
            Shr_Un: 99,
            /**
             * 对一个值执行求反并将结果推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 100
             * @type ApolloClr.OpCodeEnum
             */
            Neg: 100,
            /**
             * 计算堆栈顶部整数值的按位求补并将结果作为相同的类型推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 101
             * @type ApolloClr.OpCodeEnum
             */
            Not: 101,
            /**
             * 将位于计算堆栈顶部的值转换为 int8，然后将其扩展（填充）为 int32。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 102
             * @type ApolloClr.OpCodeEnum
             */
            Conv_I1: 102,
            /**
             * 将位于计算堆栈顶部的值转换为 int16，然后将其扩展（填充）为 int32。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 103
             * @type ApolloClr.OpCodeEnum
             */
            Conv_I2: 103,
            /**
             * 将位于计算堆栈顶部的值转换为 int32。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 104
             * @type ApolloClr.OpCodeEnum
             */
            Conv_I4: 104,
            /**
             * 将位于计算堆栈顶部的值转换为 int64。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 105
             * @type ApolloClr.OpCodeEnum
             */
            Conv_I8: 105,
            /**
             * 将位于计算堆栈顶部的值转换为 float32。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 106
             * @type ApolloClr.OpCodeEnum
             */
            Conv_R4: 106,
            /**
             * 将位于计算堆栈顶部的值转换为 float64。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 107
             * @type ApolloClr.OpCodeEnum
             */
            Conv_R8: 107,
            /**
             * 将位于计算堆栈顶部的值转换为 unsigned int32，然后将其扩展为 int32。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 108
             * @type ApolloClr.OpCodeEnum
             */
            Conv_U4: 108,
            /**
             * 将位于计算堆栈顶部的值转换为 unsigned int64，然后将其扩展为 int64。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 109
             * @type ApolloClr.OpCodeEnum
             */
            Conv_U8: 109,
            /**
             * 对对象调用后期绑定方法，并且将返回值推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 110
             * @type ApolloClr.OpCodeEnum
             */
            Callvirt: 110,
            
            Cpobj: 111,
            /**
             * 将地址指向的值类型对象复制到计算堆栈的顶部。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 112
             * @type ApolloClr.OpCodeEnum
             */
            Ldobj: 112,
            /**
             * 推送对元数据中存储的字符串的新对象引用。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 113
             * @type ApolloClr.OpCodeEnum
             */
            Ldstr: 113,
            /**
             * 创建一个值类型的新对象或新实例，并将对象引用（O 类型）推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 114
             * @type ApolloClr.OpCodeEnum
             */
            Newobj: 114,
            /**
             * 尝试将引用传递的对象转换为指定的类。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 115
             * @type ApolloClr.OpCodeEnum
             */
            Castclass: 115,
            /**
             * 测试对象引用（O 类型）是否为特定类的实例。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 116
             * @type ApolloClr.OpCodeEnum
             */
            Isinst: 116,
            /**
             * 将位于计算堆栈顶部的无符号整数值转换为 float32。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 117
             * @type ApolloClr.OpCodeEnum
             */
            Conv_R_Un: 117,
            /**
             * 将值类型的已装箱的表示形式转换为其未装箱的形式。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 118
             * @type ApolloClr.OpCodeEnum
             */
            Unbox: 118,
            /**
             * 引发当前位于计算堆栈上的异常对象。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 119
             * @type ApolloClr.OpCodeEnum
             */
            Throw: 119,
            /**
             * 查找对象中其引用当前位于计算堆栈的字段的值。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 120
             * @type ApolloClr.OpCodeEnum
             */
            Ldfld: 120,
            /**
             * 查找对象中其引用当前位于计算堆栈的字段的地址。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 121
             * @type ApolloClr.OpCodeEnum
             */
            Ldflda: 121,
            /**
             * 用新值替换在对象引用或指针的字段中存储的值。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 122
             * @type ApolloClr.OpCodeEnum
             */
            Stfld: 122,
            /**
             * 将静态字段的值推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 123
             * @type ApolloClr.OpCodeEnum
             */
            Ldsfld: 123,
            /**
             * 将静态字段的地址推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 124
             * @type ApolloClr.OpCodeEnum
             */
            Ldsflda: 124,
            /**
             * 用来自计算堆栈的值替换静态字段的值。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 125
             * @type ApolloClr.OpCodeEnum
             */
            Stsfld: 125,
            /**
             * 将指定类型的值从计算堆栈复制到所提供的内存地址中。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 126
             * @type ApolloClr.OpCodeEnum
             */
            Stobj: 126,
            /**
             * 将位于计算堆栈顶部的无符号值转换为有符号 int8 并将其扩展为 int32，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 127
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_I1_Un: 127,
            /**
             * 将位于计算堆栈顶部的无符号值转换为有符号 int16 并将其扩展为 int32，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 128
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_I2_Un: 128,
            /**
             * 将位于计算堆栈顶部的无符号值转换为有符号 int32，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 129
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_I4_Un: 129,
            /**
             * 将位于计算堆栈顶部的无符号值转换为有符号 int64，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 130
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_I8_Un: 130,
            /**
             * 将位于计算堆栈顶部的无符号值转换为 unsigned int8 并将其扩展为 int32，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 131
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_U1_Un: 131,
            /**
             * 将位于计算堆栈顶部的无符号值转换为 unsigned int16 并将其扩展为 int32，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 132
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_U2_Un: 132,
            /**
             * 将位于计算堆栈顶部的无符号值转换为 unsigned int32，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 133
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_U4_Un: 133,
            /**
             * 将位于计算堆栈顶部的无符号值转换为 unsigned int64，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 134
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_U8_Un: 134,
            /**
             * 将位于计算堆栈顶部的无符号值转换为有符号 native int，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 135
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_I_Un: 135,
            /**
             * 将位于计算堆栈顶部的无符号值转换为 unsigned native int，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 136
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_U_Un: 136,
            /**
             * 将值类转换为对象引用（O 类型）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 137
             * @type ApolloClr.OpCodeEnum
             */
            Box: 137,
            /**
             * 将对新的从零开始的一维数组（其元素属于特定类型）的对象引用推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 138
             * @type ApolloClr.OpCodeEnum
             */
            Newarr: 138,
            /**
             * 将从零开始的、一维数组的元素的数目推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 139
             * @type ApolloClr.OpCodeEnum
             */
            Ldlen: 139,
            
            Ldelema: 140,
            /**
             * 将位于指定数组索引处的 int8 类型的元素作为 int32 加载到计算堆栈的顶部。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 141
             * @type ApolloClr.OpCodeEnum
             */
            Ldelem_I1: 141,
            /**
             * 将位于指定数组索引处的 unsigned int8 类型的元素作为 int32 加载到计算堆栈的顶部。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 142
             * @type ApolloClr.OpCodeEnum
             */
            Ldelem_U1: 142,
            /**
             * 将位于指定数组索引处的 int16 类型的元素作为 int32 加载到计算堆栈的顶部。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 143
             * @type ApolloClr.OpCodeEnum
             */
            Ldelem_I2: 143,
            /**
             * 将位于指定数组索引处的 unsigned int16 类型的元素作为 int32 加载到计算堆栈的顶部。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 144
             * @type ApolloClr.OpCodeEnum
             */
            Ldelem_U2: 144,
            /**
             * 将位于指定数组索引处的 int32 类型的元素作为 int32 加载到计算堆栈的顶部。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 145
             * @type ApolloClr.OpCodeEnum
             */
            Ldelem_I4: 145,
            /**
             * 将位于指定数组索引处的 unsigned int32 类型的元素作为 int32 加载到计算堆栈的顶部。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 146
             * @type ApolloClr.OpCodeEnum
             */
            Ldelem_U4: 146,
            /**
             * 将位于指定数组索引处的 int64 类型的元素作为 int64 加载到计算堆栈的顶部。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 147
             * @type ApolloClr.OpCodeEnum
             */
            Ldelem_I8: 147,
            /**
             * 将位于指定数组索引处的 native int 类型的元素作为 native int 加载到计算堆栈的顶部。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 148
             * @type ApolloClr.OpCodeEnum
             */
            Ldelem_I: 148,
            /**
             * 将位于指定数组索引处的 float32 类型的元素作为 F 类型（浮点型）加载到计算堆栈的顶部。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 149
             * @type ApolloClr.OpCodeEnum
             */
            Ldelem_R4: 149,
            /**
             * 将位于指定数组索引处的 float64 类型的元素作为 F 类型（浮点型）加载到计算堆栈的顶部。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 150
             * @type ApolloClr.OpCodeEnum
             */
            Ldelem_R8: 150,
            /**
             * 将位于指定数组索引处的包含对象引用的元素作为 O 类型（对象引用）加载到计算堆栈的顶部。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 151
             * @type ApolloClr.OpCodeEnum
             */
            Ldelem_Ref: 151,
            /**
             * 用计算堆栈上的 native int 值替换给定索引处的数组元素。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 152
             * @type ApolloClr.OpCodeEnum
             */
            Stelem_I: 152,
            /**
             * 用计算堆栈上的 int8 值替换给定索引处的数组元素。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 153
             * @type ApolloClr.OpCodeEnum
             */
            Stelem_I1: 153,
            /**
             * 用计算堆栈上的 int16 值替换给定索引处的数组元素。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 154
             * @type ApolloClr.OpCodeEnum
             */
            Stelem_I2: 154,
            /**
             * 用计算堆栈上的 int32 值替换给定索引处的数组元素。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 155
             * @type ApolloClr.OpCodeEnum
             */
            Stelem_I4: 155,
            /**
             * 用计算堆栈上的 int64 值替换给定索引处的数组元素。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 156
             * @type ApolloClr.OpCodeEnum
             */
            Stelem_I8: 156,
            /**
             * 用计算堆栈上的 float32 值替换给定索引处的数组元素。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 157
             * @type ApolloClr.OpCodeEnum
             */
            Stelem_R4: 157,
            /**
             * 用计算堆栈上的 float64 值替换给定索引处的数组元素。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 158
             * @type ApolloClr.OpCodeEnum
             */
            Stelem_R8: 158,
            /**
             * 用计算堆栈上的对象 ref 值（O 类型）替换给定索引处的数组元素。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 159
             * @type ApolloClr.OpCodeEnum
             */
            Stelem_Ref: 159,
            /**
             * 按照指令中指定的类型，将指定数组索引中的元素加载到计算堆栈的顶部。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 160
             * @type ApolloClr.OpCodeEnum
             */
            Ldelem_Any: 160,
            /**
             * 用计算堆栈中的值替换给定索引处的数组元素，其类型在指令中指定。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 161
             * @type ApolloClr.OpCodeEnum
             */
            Stelem_Any: 161,
            /**
             * 将指令中指定类型的已装箱的表示形式转换成未装箱形式。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 162
             * @type ApolloClr.OpCodeEnum
             */
            Unbox_Any: 162,
            /**
             * 将位于计算堆栈顶部的有符号值转换为有符号 int8 并将其扩展为 int32，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 163
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_I1: 163,
            /**
             * 将位于计算堆栈顶部的有符号值转换为 unsigned int8 并将其扩展为 int32，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 164
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_U1: 164,
            /**
             * 将位于计算堆栈顶部的有符号值转换为有符号 int16 并将其扩展为 int32，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 165
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_I2: 165,
            /**
             * 将位于计算堆栈顶部的有符号值转换为 unsigned int16 并将其扩展为 int32，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 166
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_U2: 166,
            /**
             * 将位于计算堆栈顶部的有符号值转换为有符号 int32，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 167
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_I4: 167,
            /**
             * 将位于计算堆栈顶部的有符号值转换为 unsigned int32，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 168
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_U4: 168,
            /**
             * 将位于计算堆栈顶部的有符号值转换为有符号 int64，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 169
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_I8: 169,
            /**
             * 将位于计算堆栈顶部的有符号值转换为 unsigned int64，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 170
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_U8: 170,
            
            Refanyval: 171,
            /**
             * 如果值不是有限数，则引发 ArithmeticException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 172
             * @type ApolloClr.OpCodeEnum
             */
            Ckfinite: 172,
            /**
             * 将对特定类型实例的类型化引用推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 173
             * @type ApolloClr.OpCodeEnum
             */
            Mkrefany: 173,
            /**
             * 将元数据标记转换为其运行时表示形式，并将其推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 174
             * @type ApolloClr.OpCodeEnum
             */
            Ldtoken: 174,
            /**
             * 将位于计算堆栈顶部的值转换为 unsigned int16，然后将其扩展为 int32。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 175
             * @type ApolloClr.OpCodeEnum
             */
            Conv_U2: 175,
            /**
             * 将位于计算堆栈顶部的值转换为 unsigned int8，然后将其扩展为 int32。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 176
             * @type ApolloClr.OpCodeEnum
             */
            Conv_U1: 176,
            /**
             * 将位于计算堆栈顶部的值转换为 native int。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 177
             * @type ApolloClr.OpCodeEnum
             */
            Conv_I: 177,
            /**
             * 将位于计算堆栈顶部的有符号值转换为有符号 native int，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 178
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_I: 178,
            /**
             * 将位于计算堆栈顶部的有符号值转换为 unsigned native int，并在溢出时引发 OverflowException。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 179
             * @type ApolloClr.OpCodeEnum
             */
            Conv_Ovf_U: 179,
            /**
             * 将两个整数相加，执行溢出检查，并且将结果推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 180
             * @type ApolloClr.OpCodeEnum
             */
            Add_Ovf: 180,
            /**
             * 将两个无符号整数值相加，执行溢出检查，并且将结果推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 181
             * @type ApolloClr.OpCodeEnum
             */
            Add_Ovf_Un: 181,
            /**
             * 将两个整数值相乘，执行溢出检查，并将结果推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 182
             * @type ApolloClr.OpCodeEnum
             */
            Mul_Ovf: 182,
            /**
             * 将两个无符号整数值相乘，执行溢出检查，并将结果推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 183
             * @type ApolloClr.OpCodeEnum
             */
            Mul_Ovf_Un: 183,
            /**
             * 从另一值中减去一个整数值，执行溢出检查，并且将结果推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 184
             * @type ApolloClr.OpCodeEnum
             */
            Sub_Ovf: 184,
            /**
             * 从另一值中减去一个无符号整数值，执行溢出检查，并且将结果推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 185
             * @type ApolloClr.OpCodeEnum
             */
            Sub_Ovf_Un: 185,
            /**
             * 将控制从异常块的 fault 或 finally 子句转移回公共语言结构 (CLI) 异常处理程序。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 186
             * @type ApolloClr.OpCodeEnum
             */
            Endfinally: 186,
            /**
             * 退出受保护的代码区域，无条件将控制转移到特定目标指令。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 187
             * @type ApolloClr.OpCodeEnum
             */
            Leave: 187,
            /**
             * 退出受保护的代码区域，无条件将控制转移到目标指令（缩写形式）。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 188
             * @type ApolloClr.OpCodeEnum
             */
            Leave_S: 188,
            /**
             * 在所提供的地址存储 native int 类型的值。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 189
             * @type ApolloClr.OpCodeEnum
             */
            Stind_I: 189,
            /**
             * 将位于计算堆栈顶部的值转换为 unsigned native int，然后将其扩展为 native int。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 190
             * @type ApolloClr.OpCodeEnum
             */
            Conv_U: 190,
            /**
             * 返回指向当前方法的参数列表的非托管指针。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 191
             * @type ApolloClr.OpCodeEnum
             */
            Arglist: 191,
            /**
             * 比较两个值。如果这两个值相等，则将整数值 1 (int32) 推送到计算堆栈上；否则，将 0 (int32) 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 192
             * @type ApolloClr.OpCodeEnum
             */
            Ceq: 192,
            /**
             * 比较两个值。如果第一个值大于第二个值，则将整数值 1 (int32) 推送到计算堆栈上；反之，将 0 (int32) 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 193
             * @type ApolloClr.OpCodeEnum
             */
            Cgt: 193,
            /**
             * 比较两个无符号的或不可排序的值。如果第一个值大于第二个值，则将整数值 1 (int32) 推送到计算堆栈上；反之，将 0 (int32) 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 194
             * @type ApolloClr.OpCodeEnum
             */
            Cgt_Un: 194,
            /**
             * 比较两个值。如果第一个值小于第二个值，则将整数值 1 (int32) 推送到计算堆栈上；反之，将 0 (int32) 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 195
             * @type ApolloClr.OpCodeEnum
             */
            Clt: 195,
            /**
             * 比较无符号的或不可排序的值 value1 和 value2。如果 value1 小于 value2，则将整数值 1 (int32 ) 推送到计算堆栈上；反之，将 0 ( int32 ) 推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 196
             * @type ApolloClr.OpCodeEnum
             */
            Clt_Un: 196,
            /**
             * 将指向实现特定方法的本机代码的非托管指针（native int 类型）推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 197
             * @type ApolloClr.OpCodeEnum
             */
            Ldftn: 197,
            /**
             * 将指向实现与指定对象关联的特定虚方法的本机代码的非托管指针（native int 类型）推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 198
             * @type ApolloClr.OpCodeEnum
             */
            Ldvirtftn: 198,
            /**
             * 将参数（由指定索引值引用）加载到堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 199
             * @type ApolloClr.OpCodeEnum
             */
            Ldarg: 199,
            /**
             * 将参数地址加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 200
             * @type ApolloClr.OpCodeEnum
             */
            Ldarga: 200,
            /**
             * 将位于计算堆栈顶部的值存储到位于指定索引的参数槽中。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 201
             * @type ApolloClr.OpCodeEnum
             */
            Starg: 201,
            /**
             * 将指定索引处的局部变量加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 202
             * @type ApolloClr.OpCodeEnum
             */
            Ldloc: 202,
            /**
             * 将位于特定索引处的局部变量的地址加载到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 203
             * @type ApolloClr.OpCodeEnum
             */
            Ldloca: 203,
            /**
             * 从计算堆栈的顶部弹出当前值并将其存储到指定索引处的局部变量列表中。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 204
             * @type ApolloClr.OpCodeEnum
             */
            Stloc: 204,
            /**
             * 从本地动态内存池分配特定数目的字节并将第一个分配的字节的地址（瞬态指针，* 类型）推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 205
             * @type ApolloClr.OpCodeEnum
             */
            Localloc: 205,
            /**
             * 将控制从异常的 filter 子句转移回公共语言结构 (CLI) 异常处理程序。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 206
             * @type ApolloClr.OpCodeEnum
             */
            Endfilter: 206,
            /**
             * 指示当前位于计算堆栈上的地址可能没有与紧接的 ldind、stind、ldfld、stfld、ldobj、stobj、initblk 或 cpblk 指令的自然大小对齐。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 207
             * @type ApolloClr.OpCodeEnum
             */
            Unaligned: 207,
            /**
             * 指定当前位于计算堆栈顶部的地址可以是易失的，并且读取该位置的结果不能被缓存，或者对该地址的多个存储区不能被取消。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 208
             * @type ApolloClr.OpCodeEnum
             */
            Volatile: 208,
            /**
             * 执行后缀的方法调用指令，以便在执行实际调用指令前移除当前方法的堆栈帧。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 209
             * @type ApolloClr.OpCodeEnum
             */
            Tail: 209,
            /**
             * 将位于指定地址的值类型的每个字段初始化为空引用或适当的基元类型的 0。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 210
             * @type ApolloClr.OpCodeEnum
             */
            Initobj: 210,
            /**
             * 约束要对其进行虚方法调用的类型。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 211
             * @type ApolloClr.OpCodeEnum
             */
            Constrained: 211,
            /**
             * 将指定数目的字节从源地址复制到目标地址。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 212
             * @type ApolloClr.OpCodeEnum
             */
            Cpblk: 212,
            /**
             * 将位于特定地址的内存的指定块初始化为给定大小和初始值。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 213
             * @type ApolloClr.OpCodeEnum
             */
            Initblk: 213,
            No: 214,
            /**
             * 再次引发当前异常。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 215
             * @type ApolloClr.OpCodeEnum
             */
            Rethrow: 215,
            /**
             * 将提供的值类型的大小（以字节为单位）推送到计算堆栈上。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 216
             * @type ApolloClr.OpCodeEnum
             */
            Sizeof: 216,
            /**
             * 检索嵌入在类型化引用内的类型标记。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 217
             * @type ApolloClr.OpCodeEnum
             */
            Refanytype: 217,
            /**
             * 指定后面的数组地址操作在运行时不执行类型检查，并且返回可变性受限的托管指针。
             *
             * @static
             * @public
             * @memberof ApolloClr.OpCodeEnum
             * @constant
             * @default 218
             * @type ApolloClr.OpCodeEnum
             */
            Readonly: 218
        }
    });

    Bridge.define("ApolloClr.StackItem", {
        statics: {
            sPtrEmpty: null,
            op_Implicit: function (ptr) {
                return ApolloClr.BaseClrStack.current.getItem(ptr);
            },
            op_Addition: function (s1, offset) {
                if (offset === 0) {
                    return s1;
                }
                return s1.current.getItem(((s1.lValue + offset) | 0));
            },
            op_Equality: function (s1, s2) {
                if (s1.intValue === s2.intValue && s1.index === s2.index) {
                    return true;
                }
                return false;
            },
            op_Inequality: function (s1, s2) {
                return !(ApolloClr.StackItem.op_Equality(s1, s2));
            },
            op_GreaterThan: function (s1, s2) {
                return s1.intValue > s2.intValue;
            },
            op_LessThan: function (s1, s2) {
                return s1.intValue < s2.intValue;
            },
            op_GreaterThanOrEqual: function (s1, s2) {
                return s1.intValue >= s2.intValue;
            },
            op_LessThanOrEqual: function (s1, s2) {
                return s1.intValue <= s2.intValue;
            }
        },
        valueType: 0,
        intValue: 0,
        lValue: 0,
        index: 0,
        ptr: null,
        vPoint: null,
        current: null,
        $ctor1: function (lindex, current) {
            this.$initialize();
            this.lValue = lindex;
            this.current = current;
        },
        ctor: function () {
            this.$initialize();

        },
        getValue: function () {
            switch (this.valueType) {
                case ApolloClr.StackValueType.i4: 
                    {
                        return this.intValue;
                    }
                case ApolloClr.StackValueType.r4: 
                    {
                        return this.getValueFloat();
                    }
                case ApolloClr.StackValueType.i8: 
                    {
                        return this.getValueLong();
                    }
                case ApolloClr.StackValueType.r8: 
                    {
                        return this.getValueDouble();
                    }
            }
            return (this.ptr).object;

        },
        getValueInt: function () {
            return this.intValue;
        },
        getValueLong: function () {
            return System.Nullable.getValue(Bridge.cast(this.vPoint, System.Int64));
        },
        getValueFloat: function () {
            return System.Nullable.getValue(Bridge.cast(this.vPoint, System.Single));
        },
        getValueDouble: function () {
            return System.Nullable.getValue(Bridge.cast(this.vPoint, System.Double));
        },
        setValue: function (vtype, value) {
            switch (vtype) {
                case ApolloClr.StackValueType.i4: 
                    {
                        this.intValue = System.Nullable.getValue(Bridge.cast(value, System.Int32));
                        break;
                    }
                case ApolloClr.StackValueType.r4: 
                case ApolloClr.StackValueType.i8: 
                case ApolloClr.StackValueType.r8: 
                    this.vPoint = value;
                    break;
            }

        },
        copyFrom: function (stackItem) {
            this.index = stackItem.index;
            this.intValue = stackItem.intValue;
            this.ptr = stackItem.ptr;
            this.vPoint = stackItem.vPoint;
            this.valueType = stackItem.valueType;
        }
    });

    /** @namespace ApolloClr */

    /**
     * ����ָ��
     *
     * @public
     * @class ApolloClr.StackObject
     */
    Bridge.define("ApolloClr.StackObject", {
        statics: {
            newObject: function (obj) {
                var so = Bridge.merge(new ApolloClr.StackObject(), {
                    object: obj
                } );
                return so;
            },
            getStackObject: function (prt) {
                return Bridge.as(prt, ApolloClr.StackObject);
            },
            toObject: function (stackItem) {
                switch (stackItem.valueType) {
                    case ApolloClr.StackValueType.i4: 
                        return stackItem.intValue;
                    case ApolloClr.StackValueType.r4: 
                        return stackItem.getValueFloat();
                    case ApolloClr.StackValueType.i8: 
                        return stackItem.getValueLong();
                    case ApolloClr.StackValueType.r8: 
                        return stackItem.getValueDouble();
                    case ApolloClr.StackValueType.Ref: 
                        return ApolloClr.StackObject.getStackObject(stackItem.ptr).object;
                }

                return null;
            },
            op_Implicit: function (ptr) {
                var sitem = ptr;
                return sitem.ptr;
            },
            op_Implicit$1: function (ptr) {
                var sitem = ApolloClr.StackItem.op_Implicit(ptr);
                return sitem.ptr;
            }
        },
        /**
         * ָ��Ķ���
         *
         * @instance
         */
        object: null,
        ctor: function () {
            this.$initialize();
        }
    });

    Bridge.define("ApolloClr.StackValueType", {
        $kind: "enum",
        statics: {
            i4: 0,
            i8: 1,
            r4: 2,
            r8: 3,
            i1: 4,
            i2: 5,
            u1: 6,
            u2: 7,
            u4: 8,
            u8: 9,
            I: 10,
            Ref: 11,
            Any: 12,
            Array: 13
        }
    });

    Bridge.define("ApolloClr.TypeDefine.AssemblyDefine", {
        statics: {
            readAndRun: function (fileName, type, method) {
                var $t, $t1, $t2, $t3;


                var api = SilAPI.Disassembler.disassembleAssembly(fileName);


                $t = Bridge.getEnumerator(api.getAllClasses(), SilAPI.DisassembledClass);
                while ($t.moveNext()) {
                    $t1 = (function () {
                        var typeDefinition = $t.getCurrent();
                        if (typeDefinition == null || Bridge.referenceEquals(typeDefinition.getShortName(), type)) {
                            $t2 = Bridge.getEnumerator(typeDefinition.getMethods(), SilAPI.DisassembledMethod);
                            while ($t2.moveNext()) {
                                $t3 = (function () {
                                    var methodDefinition = $t2.getCurrent();
                                    var typedefine = new ApolloClr.TypeDefine.TypeDefine(typeDefinition).compile();

                                    var methodefine = System.Exction.find(ApolloClr.TypeDefine.MethodDefine, typedefine.getMethods(), function (r) {
                                        return Bridge.referenceEquals(r.getMethodDefinition().getShortName(), method);
                                    });
                                    methodefine.run();

                                    return {jump: 3, v: methodefine.clr.resultPoint};

                                }).call(this) || {};
                                if($t3.jump == 2) break;
                                if($t3.jump == 3) return {jump: 3, v: $t3.v};
                            }
                        }
                    }).call(this) || {};
                    if($t1.jump == 3) return $t1.v;
                }

                return null;

            }
        }
    });

    Bridge.define("ApolloClr.TypeDefine.TypeDefine", {
        config: {
            properties: {
                Methods: null,
                TypeDefinition: null
            },
            init: function () {
                this.Methods = new (System.Collections.Generic.List$1(ApolloClr.TypeDefine.MethodDefine))();
            }
        },
        ctor: function (inputType) {
            this.$initialize();            var $t;

            this.setTypeDefinition(inputType);
            $t = Bridge.getEnumerator(inputType.getMethods(), SilAPI.DisassembledMethod);
            while ($t.moveNext()) {
                var methodDefinition = $t.getCurrent();

                methodDefinition.readBody();
                var lines = methodDefinition.bodyLines;
                var codes = ApolloClr.Method.ILCodeParse.readILCodes$1(lines.toArray(), methodDefinition.localList, methodDefinition.parametersList);
                var method = ApolloClr.MethodTasks.build(ApolloClr.TypeDefine.MethodDefine, codes, methodDefinition.locals, methodDefinition.parameters, !Bridge.referenceEquals(methodDefinition.returnType.toLowerCase(), Bridge.Reflection.getTypeName(Object).toLowerCase()), methodDefinition.maxStack);
                method.setMethodDefinition(methodDefinition);
                method.setTypeDefine(this);
                this.getMethods().add(method);
            }
    },
    compile: function () {
        var $t;
        $t = Bridge.getEnumerator(this.getMethods());
        while ($t.moveNext()) {
            var methodTaskse = $t.getCurrent();
            methodTaskse.compile(Bridge.fn.cacheBind(this, this.methodCompile), Bridge.fn.cacheBind(this, this.newCompile));
        }
        return this;
    },
    methodCompile: function (r) {
        var find = System.Exction.find(ApolloClr.TypeDefine.MethodDefine, this.getMethods(), function (rx) {
            return Bridge.referenceEquals(rx.getMethodDefinition().getCallName(), System.String.concat(r.ApolloClr$IOpTask$getOpCode().arg0, " ", r.ApolloClr$IOpTask$getOpCode().arg1));
        });
        if (Bridge.referenceEquals(r.ApolloClr$IOpTask$getOpCode().arg0, "instance")) {
            find = System.Exction.find(ApolloClr.TypeDefine.MethodDefine, this.getMethods(), function (rx) {
                return Bridge.referenceEquals(rx.getMethodDefinition().getCallName(), System.String.concat(r.ApolloClr$IOpTask$getOpCode().arg1, " ", r.ApolloClr$IOpTask$getOpCode().arg2));
            });
        }
        if (find != null) {
            r.ApolloClr$IOpTask$setMethod(find);
            Bridge.Reflection.fieldAccess(Bridge.Reflection.getMembers(Bridge.getType(r), 4, 284, "V3"), r, find);
        } else {
            //try clr cross
            var method = ApolloClr.Cross.CrossDomain.build(Bridge.referenceEquals(r.ApolloClr$IOpTask$getOpCode().arg0, "instance") ? System.String.concat(r.ApolloClr$IOpTask$getOpCode().arg1, " ", r.ApolloClr$IOpTask$getOpCode().arg2) : System.String.concat(r.ApolloClr$IOpTask$getOpCode().arg0, " ", r.ApolloClr$IOpTask$getOpCode().arg1));
            r.ApolloClr$IOpTask$setMethod(method);
            Bridge.Reflection.fieldAccess(Bridge.Reflection.getMembers(Bridge.getType(r), 4, 284, "V3"), r, method);

        }
    },
    newCompile: function (r) {

        //try clr cross
        var method = ApolloClr.Cross.CrossDomain.build(System.String.concat(r.ApolloClr$IOpTask$getOpCode().arg1, " ", r.ApolloClr$IOpTask$getOpCode().arg2));
        r.ApolloClr$IOpTask$setMethod(method);
        Bridge.Reflection.fieldAccess(Bridge.Reflection.getMembers(Bridge.getType(r), 4, 284, "V3"), r, method);

    }
    });

    /** @namespace SilAPI */

    /**
     * The base class for all disassembled entities (which could be things like
     an assembly, interface, class, method etc).
     *
     * @abstract
     * @public
     * @class SilAPI.DisassembledEntity
     */
    Bridge.define("SilAPI.DisassembledEntity", {
        config: {
            properties: {
                /**
                 * Gets the full name.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.DisassembledEntity
                 * @memberof SilAPI.DisassembledEntity
                 * @function getFullName
                 * @return  {string}
                 */
                /**
                 * Gets the full name.
                 *
                 * @instance
                 * @this SilAPI.DisassembledEntity
                 * @memberof SilAPI.DisassembledEntity
                 * @function setFullName
                 * @param   {string}    value    The full name.
                 * @return  {void}
                 */
                FullName: null,
                TemplateSpecification: null,
                /**
                 * Gets the short name.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.DisassembledEntity
                 * @memberof SilAPI.DisassembledEntity
                 * @function getShortName
                 * @return  {string}
                 */
                /**
                 * Gets the short name.
                 *
                 * @instance
                 * @this SilAPI.DisassembledEntity
                 * @memberof SilAPI.DisassembledEntity
                 * @function setShortName
                 * @param   {string}    value    The short name.
                 * @return  {void}
                 */
                ShortName: null,
                /**
                 * Gets the raw IL.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.DisassembledEntity
                 * @memberof SilAPI.DisassembledEntity
                 * @function getRawIL
                 * @return  {string}
                 */
                /**
                 * Gets the raw IL.
                 *
                 * @instance
                 * @this SilAPI.DisassembledEntity
                 * @memberof SilAPI.DisassembledEntity
                 * @function setRawIL
                 * @param   {string}    value    The raw IL.
                 * @return  {void}
                 */
                RawIL: null,
                /**
                 * Gets the parent.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.DisassembledEntity
                 * @memberof SilAPI.DisassembledEntity
                 * @function getParent
                 * @return  {SilAPI.DisassembledEntity}
                 */
                /**
                 * Gets the parent.
                 *
                 * @instance
                 * @this SilAPI.DisassembledEntity
                 * @memberof SilAPI.DisassembledEntity
                 * @function setParent
                 * @param   {SilAPI.DisassembledEntity}    value    The parent.
                 * @return  {void}
                 */
                Parent: null
            }
        },
        getRawIlWithoutComments: function () {
            var builder = new System.Text.StringBuilder();
            var reader = new System.IO.StringReader(this.getRawIL());
            try {
                var line;
                while (((line = reader.readLine())) != null) {
                    if (!SilAPI.ILParseHelper.isLineSourceComment(line)) {
                        builder.appendLine(line);
                    }
                }
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }
            return builder.toString();
        },
        toString: function () {
            var $t;
            return ($t = System.String.concat("Disassembled Entity: ", this.getShortName()), $t != null ? $t : "Unknown");
        }
    });

    Bridge.define("SilAPI.DisassembledAssembly.RawILClass", {
        config: {
            properties: {
                FullName: null,
                TemplateSpecification: null,
                ILBuilder: null,
                Children: null
            }
        },
        ctor: function () {
            this.$initialize();
            this.setILBuilder(new System.Text.StringBuilder());
            this.setChildren(new (System.Collections.Generic.List$1(SilAPI.DisassembledAssembly.RawILClass))());
        }
    });

    Bridge.define("SilAPI.Disassembler", {
        inherits: [System.IDisposable],
        statics: {
            disassembleAssembly: function (assemblyPath, $short) {
                if ($short === void 0) { $short = true; }
                var disassembledAssembly = new SilAPI.DisassembledAssembly();
                disassembledAssembly.setAssemblyPath(assemblyPath);
                disassembledAssembly.setRawIL(assemblyPath);

                return disassembledAssembly;
            }
        },
        assemblyPath: null,
        rawIl: null,
        /**
         * The lazy map of file paths to thier contents.
         *
         * @instance
         */
        lazyMapFilePathsToContents: null,
        /**
         * The lazy map of class names to their contents.
         *
         * @instance
         */
        lazyMapClassNamesToContents: null,
        lazyMapStructNamesToContents: null,
        lazyMapInterfaceNamesToContents: null,
        config: {
            alias: [
            "dispose", "System$IDisposable$dispose"
            ]
        },
        ctor: function () {
            this.$initialize();
            //  Create the lazy map of file paths to their contents.
            this.lazyMapFilePathsToContents = new (System.Lazy$1(System.Collections.Generic.Dictionary$2(String,String)))(Bridge.fn.cacheBind(this, this.createMapOfFilePathsToContents));
            this.lazyMapClassNamesToContents = new (System.Lazy$1(System.Collections.Generic.Dictionary$2(String,String)))(Bridge.fn.bind(this, $asm.$.SilAPI.Disassembler.f1));
            this.lazyMapStructNamesToContents = new (System.Lazy$1(System.Collections.Generic.Dictionary$2(String,String)))(Bridge.fn.bind(this, $asm.$.SilAPI.Disassembler.f2));
            this.lazyMapInterfaceNamesToContents = new (System.Lazy$1(System.Collections.Generic.Dictionary$2(String,String)))(Bridge.fn.bind(this, $asm.$.SilAPI.Disassembler.f3));
        },
        /**
         * Creates the map of file paths to contents.
         *
         * @instance
         * @private
         * @this SilAPI.Disassembler
         * @memberof SilAPI.Disassembler
         * @return  {System.Collections.Generic.Dictionary$2}
         */
        createMapOfFilePathsToContents: function () {
            //  Create a dictionary of file paths to their contents.
            var pathsToContents = new (System.Collections.Generic.Dictionary$2(String,String))();

            //  Now start parsing the raw IL, line by line.
            var reader = new System.IO.StringReader(this.rawIl);
            try {
                //  Read each line
                var line;
                while (((line = reader.readLine())) != null) {

                }
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }

            //  Return the dictionary.
            return pathsToContents;
        },
        createMapOfClassNamesToContents: function (identifyClassType) {
            //  Create a dictionary of file paths to their contents.
            var pathsToContents = new (System.Collections.Generic.Dictionary$2(String,System.Text.StringBuilder))();

            //  Now start parsing the raw IL, line by line.
            var reader = new System.IO.StringReader(this.rawIl);
            try {
                //  Read each line
                var line;
                var currentClassName = { v : null };
                while (((line = reader.readLine())) != null) {
                    //  Is it a class start token? If so, get the class name.
                    var templateSpecification = { };
                    if (identifyClassType(line)) {
                        SilAPI.ILParseHelper.getClassNameFromClassDeclarationLine(line, currentClassName, templateSpecification);
                    }

                    //  If don't have a current class, skip.
                    if (currentClassName.v == null) {
                        continue;
                    }

                    //  Add the line to the class.
                    if (!pathsToContents.containsKey(currentClassName.v)) {
                        pathsToContents.set(currentClassName.v, new System.Text.StringBuilder());
                    }
                    pathsToContents.get(currentClassName.v).appendLine(line);

                    //  Is it a class end token? If so, clear the current class identifier.
                    if (SilAPI.ILParseHelper.isLineClassEndDeclaration(line, currentClassName.v)) {
                        currentClassName.v = null;
                    }
                }
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }

            //  Return the dictionary.
            return System.Linq.Enumerable.from(pathsToContents).toDictionary($asm.$.SilAPI.Disassembler.f4, $asm.$.SilAPI.Disassembler.f5, String, String);
        },
        /**
         * Initialises disassembler the specified assembly path.
         *
         * @instance
         * @private
         * @this SilAPI.Disassembler
         * @memberof SilAPI.Disassembler
         * @param   {string}    assemblyPath    The assembly path.
         * @return  {void}
         */
        initialise: function (assemblyPath) {
            //  We're done.
        },
        dispose: function () {

        },
        /**
         * Gets the raw IL.
         *
         * @instance
         * @public
         * @this SilAPI.Disassembler
         * @memberof SilAPI.Disassembler
         * @return  {string}        The complete raw IL.
         */
        getRawIL: function () {
            return this.rawIl;
        },
        /**
         * Gets the file names of source code files in the assembly.
         *
         * @instance
         * @public
         * @this SilAPI.Disassembler
         * @memberof SilAPI.Disassembler
         * @return  {System.Collections.Generic.IEnumerable$1}
         */
        getFileNames: function () {
            return this.lazyMapFilePathsToContents.getValue().getKeys();
        },
        getClassNames: function () {
            return this.lazyMapClassNamesToContents.getValue().getKeys();
        },
        getStructNames: function () {
            return this.lazyMapStructNamesToContents.getValue().getKeys();
        },
        getInterfaceNames: function () {
            return this.lazyMapInterfaceNamesToContents.getValue().getKeys();
        }
    });

    Bridge.ns("SilAPI.Disassembler", $asm.$);

    Bridge.apply($asm.$.SilAPI.Disassembler, {
        f1: function () {
            return this.createMapOfClassNamesToContents(SilAPI.ILParseHelper.isLineClassDeclaration);
        },
        f2: function () {
            return this.createMapOfClassNamesToContents(SilAPI.ILParseHelper.isLineStructDeclaration);
        },
        f3: function () {
            return this.createMapOfClassNamesToContents(SilAPI.ILParseHelper.isLineInterfaceDeclaration);
        },
        f4: function (d) {
            return d.key;
        },
        f5: function (d) {
            return d.value.toString();
        }
    });

    Bridge.define("SilAPI.DisassemblyException", {
        inherits: [System.Exception],
        ctor: function (message) {
            this.$initialize();
            System.Exception.ctor.call(this, message);
        },
        $ctor1: function (message, innerException) {
            this.$initialize();
            System.Exception.ctor.call(this, message, innerException);

        }
    });

    /**
     * A Disassembly Target is an object that describes an element that is being
     targetted in an assembly, such as a method, class or field.
     *
     * @public
     * @class SilAPI.DisassemblyTarget
     */
    Bridge.define("SilAPI.DisassemblyTarget", {
        config: {
            properties: {
                /**
                 * Gets or sets the type of the target.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.DisassemblyTarget
                 * @memberof SilAPI.DisassemblyTarget
                 * @function getTargetType
                 * @return  {SilAPI.DisassemblyTargetType}
                 */
                /**
                 * Gets or sets the type of the target.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.DisassemblyTarget
                 * @memberof SilAPI.DisassemblyTarget
                 * @function setTargetType
                 * @param   {SilAPI.DisassemblyTargetType}    value    The type of the target.
                 * @return  {void}
                 */
                TargetType: 0,
                /**
                 * Gets or sets the full name.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.DisassemblyTarget
                 * @memberof SilAPI.DisassemblyTarget
                 * @function getFullName
                 * @return  {string}
                 */
                /**
                 * Gets or sets the full name.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.DisassemblyTarget
                 * @memberof SilAPI.DisassemblyTarget
                 * @function setFullName
                 * @param   {string}    value    The full name.
                 * @return  {void}
                 */
                FullName: null
            }
        },
        /**
         * Initializes a new instance of the {@link } class.
         *
         * @instance
         * @public
         * @this SilAPI.DisassemblyTarget
         * @memberof SilAPI.DisassemblyTarget
         * @param   {SilAPI.DisassemblyTargetType}    targetType    Type of the target.
         * @param   {string}                          fullName      The full name.
         * @return  {void}
         */
        ctor: function (targetType, fullName) {
            this.$initialize();
            this.setTargetType(targetType);
            this.setFullName(fullName);
        },
        /**
         * Returns a {@link } that represents this instance.
         *
         * @instance
         * @public
         * @override
         * @this SilAPI.DisassemblyTarget
         * @memberof SilAPI.DisassemblyTarget
         * @return  {string}        A {@link } that represents this instance.
         */
        toString: function () {
            return System.String.format("Target: {0} - {1}", this.getTargetType(), this.getFullName());
        }
    });

    Bridge.define("SilAPI.DisassemblyTargetType", {
        $kind: "enum",
        statics: {
            Class: 0,
            Enumeration: 1,
            Method: 2,
            Property: 3,
            Field: 4,
            Structure: 5,
            Delegate: 6,
            Event: 7,
            Interface: 8
        }
    });

    Bridge.define("SilAPI.ILParseHelper", {
        statics: {
            Token_StartClass: ".class",
            Token_Field: ".field",
            Token_Method: ".method",
            Token_Property: ".property",
            Token_Event: ".event",
            Token_Structure: "sequential",
            Token_Interface: "interface",
            Token_EndClass: "} // end of class",
            Token_EndMethod: "} // end of method",
            Token_EndProperty: "} // end of property",
            Token_EndEvent: "} // end of event",
            Token_Extends: "extends",
            Token_SourceComment: "//",
            isLineTopLevelIlClassDeclaration: function (line) {
                return System.String.startsWith(line, SilAPI.ILParseHelper.Token_StartClass);
            },
            isLineAnyLevelIlClassDeclaration: function (line) {
                return System.String.startsWith(System.String.trimStart(line), SilAPI.ILParseHelper.Token_StartClass);
            },
            isLineClassDeclaration: function (line) {
                //  If the line doesn't start with the class token, it's not a class.
                if (!System.String.startsWith(line, SilAPI.ILParseHelper.Token_StartClass)) {
                    return false;
                }

                //  Get the declaration parts.
                var className = { }, templateSpecification = { };
                var modifiers = { };
                SilAPI.ILParseHelper.getClassDeclarationParts(line, modifiers, className, templateSpecification);

                //  We're a class if we're not an interface or struct.
                return !modifiers.v.contains(SilAPI.ILParseHelper.Token_Structure) && !modifiers.v.contains(SilAPI.ILParseHelper.Token_Interface);
            },
            getClassDeclarationParts: function (line, modifiers, className, templateSpecification) {
                //  Get the class name and template spec.
                SilAPI.ILParseHelper.getClassNameFromClassDeclarationLine(line, className, templateSpecification);

                //  Remove the parts we've handled.
                if (className.v != null) {
                    line = System.String.replaceAll(line, className.v, "");
                }
                if (templateSpecification.v != null) {
                    line = System.String.replaceAll(line, templateSpecification.v, "");
                }

                //  Break up the line.
                var parts = System.Linq.Enumerable.from(line.split(String.fromCharCode(32))).toList(String);

                if (parts.getCount() < 2) {
                    throw new System.InvalidOperationException("Invalid class declaration line.");
                }

                //  Remove the class part.
                parts.removeAt(0);

                //  Get the classname.
                parts.removeAt(((parts.getCount() - 1) | 0));
                modifiers.v = parts;
            },
            isLineStructDeclaration: function (line) {
                line = System.String.trimStart(line);

                //  If the line doesn't start with the class token, it's not a struct.
                if (!System.String.startsWith(line, SilAPI.ILParseHelper.Token_StartClass)) {
                    return false;
                }

                //  Get the declaration parts.
                var className = { }, templateSpecification = { };
                var modifiers = { };
                SilAPI.ILParseHelper.getClassDeclarationParts(line, modifiers, className, templateSpecification);

                return modifiers.v.contains(SilAPI.ILParseHelper.Token_Structure) && !modifiers.v.contains(SilAPI.ILParseHelper.Token_Interface);
            },
            isLineInterfaceDeclaration: function (line) {
                line = System.String.trimStart(line);

                //  If the line doesn't start with the class token, it's not an interface.
                if (!System.String.startsWith(line, SilAPI.ILParseHelper.Token_StartClass)) {
                    return false;
                }

                //  Get the declaration parts.
                var className = { }, templateSpecification = { };
                var modifiers = { };
                SilAPI.ILParseHelper.getClassDeclarationParts(line, modifiers, className, templateSpecification);

                return !modifiers.v.contains(SilAPI.ILParseHelper.Token_Structure) && modifiers.v.contains(SilAPI.ILParseHelper.Token_Interface);
            },
            readExtendsLine: function (line, baseType) {
                baseType.v = null;

                //  Trim the line.
                var trimmed = line.trim();

                //  Split into tokens.
                var tokens = System.Linq.Enumerable.from(trimmed.split(String.fromCharCode(32))).toList(String);

                //  We must have at least two tokens.
                if (tokens.getCount() < 2) {
                    return false;
                }

                //  The first token must be 'extends'.
                if (!Bridge.referenceEquals(tokens.getItem(0), SilAPI.ILParseHelper.Token_Extends)) {
                    return false;
                }

                //  The last token is the base type.
                baseType.v = System.Linq.Enumerable.from(tokens).last();
                return true;
            },
            isLineStartClassEndToken: function (line) {
                return System.String.startsWith(line, SilAPI.ILParseHelper.Token_EndClass);
            },
            isLineClassEndDeclaration: function (line, className) {
                var classEnd = System.String.concat("} // end of class ", className);
                return System.String.startsWith(System.String.trimStart(line), classEnd);
            },
            isLineFieldDeclaration: function (line) {
                return System.String.startsWith(System.String.trimStart(line), SilAPI.ILParseHelper.Token_Field);
            },
            getClassNameFromClassDeclarationLine: function (line, className, templateSpecification) {
                className.v = null;
                //  First, check for anonymous classes.
                if (System.String.contains(line,"'")) {
                    var from = System.String.indexOf(line, String.fromCharCode(39));
                    var to = line.lastIndexOf(String.fromCharCode(39));
                    className.v = line.substr(from, (((((to + 1) | 0)) - from) | 0));
                    line = System.String.replaceAll(line, className.v, "");
                }

                //  Strip out the template specification, if there is on.
                templateSpecification.v = null;
                if (System.String.contains(line,"<")) {
                    var from1 = System.String.indexOf(line, String.fromCharCode(60));
                    var to1 = line.lastIndexOf(String.fromCharCode(62));

                    templateSpecification.v = line.substr(from1, (((((to1 + 1) | 0)) - from1) | 0));
                    line = System.String.replaceAll(line, templateSpecification.v, "");
                }

                //  The class name is the last word, unless we've already got it.
                if (className.v == null) {
                    var lastSpace = line.lastIndexOf(String.fromCharCode(32));
                    className.v = line.substr(((lastSpace + 1) | 0));
                }
            },
            isLineMethodDeclaration: function (line) {
                return System.String.startsWith(System.String.trimStart(line), SilAPI.ILParseHelper.Token_Method);
            },
            getMethodNameFromDeclarationLine: function (line) {
                //   e.g. get_Species() cil managed
                var methodPart = System.Linq.Enumerable.from(line.trim().split(String.fromCharCode(32))).firstOrDefault($asm.$.SilAPI.ILParseHelper.f1, null);
                if (methodPart == null) {
                    return null;
                }
                return methodPart.substr(0, System.String.indexOf(methodPart, String.fromCharCode(40)));
            },
            isLineMethodEndDeclaration: function (line, ilClassName, methodName) {
                //  Quick check - if we don't have 'end of method', we don't need to check in detail.
                if (System.String.contains(line,SilAPI.ILParseHelper.Token_EndMethod) === false) {
                    return false;
                }

                //  If the method contains a template specification, remove it before we check the 
                //  end line, because the end line always is the name without the template spec.
                if (methodName != null && System.Linq.Enumerable.from(methodName).contains(60)) {
                    methodName = methodName.substr(0, System.String.indexOf(methodName, String.fromCharCode(60)));
                }

                var classEnd = System.String.concat("} // end of method ", ilClassName, "::", methodName);
                return System.String.contains(line,classEnd);
            },
            isLinePropertyDeclaration: function (line) {
                return System.String.startsWith(System.String.trimStart(line), SilAPI.ILParseHelper.Token_Property);
            },
            isLineEventPropertyDeclaration: function (line) {
                return System.String.startsWith(System.String.trimStart(line), SilAPI.ILParseHelper.Token_Event);
            },
            isLinePropertyEndDeclaration: function (line, ilClassName, propertyName) {
                var classEnd = System.String.concat("} // end of property ", ilClassName, "::", propertyName);
                return System.String.contains(line,classEnd);
            },
            isLineEventEndDeclaration: function (line, ilClassName, propertyName) {
                var classEnd = System.String.concat("} // end of event ", ilClassName, "::", propertyName);
                return System.String.contains(line,classEnd);
            },
            getPropertyNameFromDeclarationLine: function (line) {
                var propertyPart = System.Linq.Enumerable.from(line.trim().split(String.fromCharCode(32))).firstOrDefault($asm.$.SilAPI.ILParseHelper.f1, null);
                if (propertyPart == null) {
                    return null;
                }
                return propertyPart.substr(0, System.String.indexOf(propertyPart, String.fromCharCode(40)));
            },
            getEventNameFromDeclarationLine: function (line) {
                var propertyPart = System.Linq.Enumerable.from(line.trim().split(String.fromCharCode(32))).last();
                return propertyPart;
            },
            isLineSourceComment: function (line) {
                return System.String.startsWith(line, SilAPI.ILParseHelper.Token_SourceComment);
            }
        }
    });

    Bridge.ns("SilAPI.ILParseHelper", $asm.$);

    Bridge.apply($asm.$.SilAPI.ILParseHelper, {
        f1: function (mp) {
            return System.Linq.Enumerable.from(mp).contains(40);
        }
    });

    /**
     * A SilProcessor is an object ready to process IL from some input.
     *
     * @abstract
     * @public
     * @class SilAPI.ISilProcessor
     */
    Bridge.define("SilAPI.ISilProcessor", {
        $kind: "interface"
    });

    Bridge.define("System.Exction", {
        statics: {
            find: function (T, list, func) {
                return System.Linq.Enumerable.from(list).firstOrDefault(func, Bridge.getDefaultValue(T));
            },
            findIndex: function (T, list, func) {
                var find = System.Exction.find(T, list, func);
                return System.Array.indexOf(list, find, 0, null, T);
            },
            makeGenericType: function (type, types) {
                if (types === void 0) { types = []; }
                return type.apply(null, types);
            },
            forEach: function (T, list, loopFunc) {
                var $t;
                $t = Bridge.getEnumerator(list);
                while ($t.moveNext()) {
                    var item = $t.getCurrent();
                    loopFunc(item);
                }
            }
        }
    });

    Bridge.define("System.IO.StringReader", {
        inherits: [System.IDisposable],
        rawIL: null,
        postion: 0,
        lines: null,
        config: {
            alias: [
            "dispose", "System$IDisposable$dispose"
            ]
        },
        ctor: function (rawIL) {
            this.$initialize();
            this.rawIL = rawIL;
            this.lines = this.rawIL.split(String.fromCharCode(13));
        },
        dispose: function () {

        },
        readLine: function () {
            if (this.postion >= this.lines.length) {
                return null;
            }
            return this.lines[Bridge.identity(this.postion, (this.postion = (this.postion + 1) | 0))];
        },
        readToEnd: function () {
            return this.rawIL;
        }
    });

    Bridge.define("System.Lazy$1", function (T) { return {
        func: null,
        isInit: false,
        _Value: Bridge.getDefaultValue(T),
        ctor: function (func) {
            this.$initialize();
            this.func = func;
        },
        getValue: function () {
            if (!this.isInit) {
                this._Value = this.func();
            }

            return this._Value;
        }
    }; });

    Bridge.define("ApolloClr.Cross.BaseCrossMethodDelegate", {
        inherits: [ApolloClr.Cross.ICrossMethodDelegate],
        config: {
            properties: {
                Ptr: null,
                Instance: null,
                Result: null
            },
            alias: [
            "getPtr", "ApolloClr$Cross$ICrossMethodDelegate$getPtr",
            "setPtr", "ApolloClr$Cross$ICrossMethodDelegate$setPtr",
            "getResult", "ApolloClr$Cross$ICrossMethodDelegate$getResult",
            "setResult", "ApolloClr$Cross$ICrossMethodDelegate$setResult"
            ]
        }
    });

    Bridge.define("ApolloClr.Cross.CrossMethod", {
        inherits: [ApolloClr.MethodTasks],
        argCount: 0,
        haseResult: false,
        isStatic: false,
        config: {
            properties: {
                CallName: null,
                CrossMethodDelegate: null
            }
        },
        ctor: function () {
            this.$initialize();
            ApolloClr.MethodTasks.ctor.call(this);

        },
        $ctor1: function (callname) {
            this.$initialize();
            ApolloClr.MethodTasks.ctor.call(this);
            this.setCallName(callname);

            var values = System.String.split(callname, System.Array.init(["::", "[", "]", ",", "(", ")"], String), null, 1);
            var returnType = values[0];
            var assemblyname = values[1];
            var typeName = values[2];
            var methodName = values[3];
            var type = ApolloClr.Extensions.getTypeByName(typeName);
            var args = new (System.Collections.Generic.List$1(Function))();
            for (var i = 4; i < values.length; i = (i + 1) | 0) {
                args.add(ApolloClr.Extensions.getTypeByName(values[i]));
            }
            var methodInfo = Bridge.Reflection.getMembers(type, 8, 284, methodName, args.toArray());
            if (methodInfo == null) {
                methodInfo = ApolloClr.Extensions.getMethodInfo(type, methodName, args.toArray());
            }
            if (methodInfo == null) {
                var coninfo = null;


                if (coninfo != null) {
                    this.argCount = (coninfo.pi || []).length;
                    this.haseResult = true;
                    this.clr = new ApolloClr.Clr(1, this.argCount, this.haseResult, 1);
                    this.creatDelegate(coninfo);
                } else {

                    if (Bridge.referenceEquals(methodName, ".ctor")) {
                        //����޷��ҵ����캯����ֻ��ֱ�ӹ�����
                        this.argCount = 0;
                        this.haseResult = true;
                        this.clr = new ApolloClr.Clr(1, this.argCount, this.haseResult, 1);

                        var tasktype = System.Exction.makeGenericType(ApolloClr.Cross.ObjectBuild$1, [type]);
                        this.setCrossMethodDelegate(Bridge.as(Bridge.createInstance(tasktype), ApolloClr.Cross.ICrossMethodDelegate));
                        return;
                    }

                    throw new System.NotSupportedException(System.String.concat(callname, " methodInfo or coninfo Mast Be Not Null!"));
                }
            }

            if (methodInfo != null) {
                this.argCount = (methodInfo.pi || []).length;
                this.haseResult = !Bridge.referenceEquals(methodInfo.rt, Object);
                if (Bridge.referenceEquals(methodName, "ctor") || Bridge.referenceEquals(methodName, ".ctor")) {
                    this.haseResult = true;
                }
                if (!(methodInfo.is || false)) {
                    this.argCount = (this.argCount + 1) | 0;
                }
                this.clr = new ApolloClr.Clr(1, this.argCount, this.haseResult, 1);
                this.creatDelegate$1(methodInfo);
            }
            //����CLR


        },
        run: function () {
            var vs = this.clr.getArgp();
            var ptr = ApolloClr.StackObject.op_Implicit(vs);
            //��ֵ���� ��ֵ
            if (this.isStatic) {
                var args = System.Array.init(this.argCount, null, Object);
                for (var i = 0; i < this.argCount; i = (i + 1) | 0) {
                    args[i] = ApolloClr.StackObject.toObject(ApolloClr.StackItem.op_Addition(vs, i));
                }
                this.getCrossMethodDelegate().ApolloClr$Cross$ICrossMethodDelegate$setArgs(args);
            } else {
                var args1 = System.Array.init(this.argCount, null, Object);
                for (var i1 = 0; i1 < this.argCount; i1 = (i1 + 1) | 0) {
                    if (i1 === 0) {
                        if (!Bridge.referenceEquals(ptr, this.getCrossMethodDelegate().ApolloClr$Cross$ICrossMethodDelegate$getPtr())) {
                            args1[((this.argCount - 1) | 0)] = ApolloClr.StackObject.toObject(ApolloClr.StackItem.op_Addition(vs, i1));
                        } else {
                            //�������󴴽�
                            //�����һ���������ظ�ʹ�ã�����
                        }

                    } else {
                        args1[((i1 - 1) | 0)] = ApolloClr.StackObject.toObject(ApolloClr.StackItem.op_Addition(vs, i1));
                    }

                }
                this.getCrossMethodDelegate().ApolloClr$Cross$ICrossMethodDelegate$setArgs(args1);
                if (!this.isStatic && !Bridge.staticEquals(this.getCrossMethodDelegate().ApolloClr$Cross$ICrossMethodDelegate$getDelegate(), null)) {
                    if (!Bridge.referenceEquals(ptr, this.getCrossMethodDelegate().ApolloClr$Cross$ICrossMethodDelegate$getPtr())) {
                        this.getCrossMethodDelegate().ApolloClr$Cross$ICrossMethodDelegate$setPtr(ptr);
                        this.getCrossMethodDelegate().func = ApolloClr.Extensions.setTarget(this.getCrossMethodDelegate().ApolloClr$Cross$ICrossMethodDelegate$getDelegate(), args1[((this.argCount - 1) | 0)]);
                    }

                }
            }


            this.getCrossMethodDelegate().ApolloClr$Cross$ICrossMethodDelegate$run();
            if (this.haseResult) {
                this.clr.resultPoint = this.clr.getCsp();
                this.clr.resultPoint.valueType = ApolloClr.StackValueType.Ref;
                this.clr.resultPoint.ptr = ApolloClr.StackObject.newObject(this.getCrossMethodDelegate().ApolloClr$Cross$ICrossMethodDelegate$getResult());
            }
        },
        creatDelegate: function (methodInfo) {
            var parms = (methodInfo.pi || []);
            var tasktype = ApolloClr.Cross.ObjectBuild$1;
            if (parms.length === 0) {
                tasktype = System.Exction.makeGenericType(ApolloClr.Cross.ObjectBuild$1, [methodInfo.td]);

            } else {

            }

            this.setCrossMethodDelegate(Bridge.as(Bridge.createInstance(tasktype), ApolloClr.Cross.ICrossMethodDelegate));

        },
        creatDelegate$1: function (methodInfo) {
            var parms = (methodInfo.pi || []);
            var tasktype = ApolloClr.Cross.CrossMethodDelegate;
            var retType = methodInfo.rt;
            if (Bridge.referenceEquals(methodInfo.rt, Object)) {
                if (parms.length === 1) {
                    tasktype = System.Exction.makeGenericType(ApolloClr.Cross.CrossMethodDelegate$1, [parms[0].pt]);

                } else if (parms.length === 2) {
                    tasktype = System.Exction.makeGenericType(ApolloClr.Cross.CrossMethodDelegate$2, [parms[0].pt, parms[1].pt]);

                } else if (parms.length === 3) {
                    tasktype = System.Exction.makeGenericType(ApolloClr.Cross.CrossMethodDelegate$3, [parms[0].pt, parms[1].pt, parms[2].pt]);
                } else if (parms.length >= 4) {

                }
            } else {
                if (parms.length === 0) {
                    tasktype = System.Exction.makeGenericType(ApolloClr.Cross.CrossMethodDelegateRet$1, [retType]);

                } else {

                }
            }


            this.setCrossMethodDelegate(Bridge.as(Bridge.createInstance(tasktype), ApolloClr.Cross.ICrossMethodDelegate));
            var funtask = Bridge.Reflection.getMembers(tasktype, 4, 284, "Func").rt;
            // ��̬
            if ((methodInfo.is || false)) {
                var delage = Bridge.Reflection.midel(methodInfo, null);
                Bridge.Reflection.fieldAccess(Bridge.Reflection.getMembers(tasktype, 4, 284, "Func"), this.getCrossMethodDelegate(), delage);
                this.isStatic = true;
            } else {
                var obj = Bridge.createInstance(methodInfo.td);
                var delage1 = Bridge.Reflection.midel(methodInfo, obj);
                Bridge.Reflection.fieldAccess(Bridge.Reflection.getMembers(tasktype, 4, 284, "Func"), this.getCrossMethodDelegate(), delage1);
                this.isStatic = false;
            }



        }
    });

    Bridge.define("ApolloClr.MethodDefine.OpCodeTask", {
        inherits: [ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask],
        func: null,
        config: {
            alias: [
            "getBindFunc", "ApolloClr$IOpTask$getBindFunc",
            "run", "ApolloClr$IOpTask$run",
            "getDump", "ApolloClr$IOpTask$getDump",
            "setDump", "ApolloClr$IOpTask$setDump",
            "getOpCode", "ApolloClr$IOpTask$getOpCode",
            "setOpCode", "ApolloClr$IOpTask$setOpCode",
            "getMethod", "ApolloClr$IOpTask$getMethod",
            "setMethod", "ApolloClr$IOpTask$setMethod"
            ]
        },
        getBindFunc: function () {
            return this.func;
        },
        run: function () {
            this.func();
        }
    });

    Bridge.define("ApolloClr.MethodDefine.OpCodeTask$1", function (TV1) { return {
        inherits: [ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask],
        func: null,
        V1: Bridge.getDefaultValue(TV1),
        config: {
            alias: [
            "getBindFunc", "ApolloClr$IOpTask$getBindFunc",
            "run", "ApolloClr$IOpTask$run",
            "getDump", "ApolloClr$IOpTask$getDump",
            "setDump", "ApolloClr$IOpTask$setDump",
            "getOpCode", "ApolloClr$IOpTask$getOpCode",
            "setOpCode", "ApolloClr$IOpTask$setOpCode",
            "getMethod", "ApolloClr$IOpTask$getMethod",
            "setMethod", "ApolloClr$IOpTask$setMethod"
            ]
        },
        getBindFunc: function () {
            return this.func;
        },
        run: function () {
            this.func(this.V1);
        }
    }; });

    Bridge.define("ApolloClr.MethodDefine.OpCodeTask$2", function (TV1, TV2) { return {
        inherits: [ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask],
        func: null,
        V1: Bridge.getDefaultValue(TV1),
        V2: Bridge.getDefaultValue(TV2),
        config: {
            alias: [
            "getBindFunc", "ApolloClr$IOpTask$getBindFunc",
            "run", "ApolloClr$IOpTask$run",
            "getDump", "ApolloClr$IOpTask$getDump",
            "setDump", "ApolloClr$IOpTask$setDump",
            "getOpCode", "ApolloClr$IOpTask$getOpCode",
            "setOpCode", "ApolloClr$IOpTask$setOpCode",
            "getMethod", "ApolloClr$IOpTask$getMethod",
            "setMethod", "ApolloClr$IOpTask$setMethod"
            ]
        },
        getBindFunc: function () {
            return this.func;
        },
        run: function () {
            this.func(this.V1, this.V2);
        }
    }; });

    Bridge.define("ApolloClr.MethodDefine.OpCodeTask$3", function (TV1, TV2, TV3) { return {
        inherits: [ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask],
        func: null,
        V1: Bridge.getDefaultValue(TV1),
        V2: Bridge.getDefaultValue(TV2),
        V3: Bridge.getDefaultValue(TV3),
        config: {
            alias: [
            "getBindFunc", "ApolloClr$IOpTask$getBindFunc",
            "run", "ApolloClr$IOpTask$run",
            "getDump", "ApolloClr$IOpTask$getDump",
            "setDump", "ApolloClr$IOpTask$setDump",
            "getOpCode", "ApolloClr$IOpTask$getOpCode",
            "setOpCode", "ApolloClr$IOpTask$setOpCode",
            "getMethod", "ApolloClr$IOpTask$getMethod",
            "setMethod", "ApolloClr$IOpTask$setMethod"
            ]
        },
        getBindFunc: function () {
            return this.func;
        },
        run: function () {
            this.func(this.V1, this.V2, this.V3);
        }
    }; });

    Bridge.define("ApolloClr.MethodDefine.OpCodeTaskRef$1", function (TV1) { return {
        inherits: [ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask],
        func: null,
        V1: Bridge.getDefaultValue(TV1),
        config: {
            alias: [
            "getBindFunc", "ApolloClr$IOpTask$getBindFunc",
            "run", "ApolloClr$IOpTask$run",
            "getDump", "ApolloClr$IOpTask$getDump",
            "setDump", "ApolloClr$IOpTask$setDump",
            "getOpCode", "ApolloClr$IOpTask$getOpCode",
            "setOpCode", "ApolloClr$IOpTask$setOpCode",
            "getMethod", "ApolloClr$IOpTask$getMethod",
            "setMethod", "ApolloClr$IOpTask$setMethod"
            ]
        },
        getBindFunc: function () {
            return this.func;
        },
        run: function () {
            this.func(Bridge.ref(this, "V1"));
        }
    }; });

    Bridge.define("ApolloClr.MethodDefine.OpCodeTaskRef$2", function (TV1, TV2) { return {
        inherits: [ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask],
        func: null,
        V1: Bridge.getDefaultValue(TV1),
        V2: Bridge.getDefaultValue(TV2),
        config: {
            alias: [
            "getBindFunc", "ApolloClr$IOpTask$getBindFunc",
            "run", "ApolloClr$IOpTask$run",
            "getDump", "ApolloClr$IOpTask$getDump",
            "setDump", "ApolloClr$IOpTask$setDump",
            "getOpCode", "ApolloClr$IOpTask$getOpCode",
            "setOpCode", "ApolloClr$IOpTask$setOpCode",
            "getMethod", "ApolloClr$IOpTask$getMethod",
            "setMethod", "ApolloClr$IOpTask$setMethod"
            ]
        },
        getBindFunc: function () {
            return this.func;
        },
        run: function () {
            this.func(Bridge.ref(this, "V1"), Bridge.ref(this, "V2"));
        }
    }; });

    Bridge.define("ApolloClr.MethodDefine.OpCodeTaskRef$3", function (TV1, TV2, TV3) { return {
        inherits: [ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask],
        func: null,
        V1: Bridge.getDefaultValue(TV1),
        V2: Bridge.getDefaultValue(TV2),
        V3: Bridge.getDefaultValue(TV3),
        config: {
            alias: [
            "getBindFunc", "ApolloClr$IOpTask$getBindFunc",
            "run", "ApolloClr$IOpTask$run",
            "getDump", "ApolloClr$IOpTask$getDump",
            "setDump", "ApolloClr$IOpTask$setDump",
            "getOpCode", "ApolloClr$IOpTask$getOpCode",
            "setOpCode", "ApolloClr$IOpTask$setOpCode",
            "getMethod", "ApolloClr$IOpTask$getMethod",
            "setMethod", "ApolloClr$IOpTask$setMethod"
            ]
        },
        getBindFunc: function () {
            return this.func;
        },
        run: function () {
            this.func(Bridge.ref(this, "V1"), Bridge.ref(this, "V2"), Bridge.ref(this, "V3"));
        }
    }; });

    Bridge.define("ApolloClr.MethodDefine.OpCodeTaskT$1", function (TV1) { return {
        inherits: [ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask],
        func: null,
        V1: Bridge.getDefaultValue(TV1),
        config: {
            alias: [
            "getBindFunc", "ApolloClr$IOpTask$getBindFunc",
            "run", "ApolloClr$IOpTask$run",
            "getDump", "ApolloClr$IOpTask$getDump",
            "setDump", "ApolloClr$IOpTask$setDump",
            "getOpCode", "ApolloClr$IOpTask$getOpCode",
            "setOpCode", "ApolloClr$IOpTask$setOpCode",
            "getMethod", "ApolloClr$IOpTask$getMethod",
            "setMethod", "ApolloClr$IOpTask$setMethod"
            ]
        },
        getBindFunc: function () {
            return this.func;
        },
        run: function () {
            this.func(this.V1);
        }
    }; });

    Bridge.define("ApolloClr.MethodDefine.OpCodeTaskT$2", function (TV1, TV2) { return {
        inherits: [ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask],
        func: null,
        V1: Bridge.getDefaultValue(TV1),
        V2: Bridge.getDefaultValue(TV2),
        config: {
            alias: [
            "getBindFunc", "ApolloClr$IOpTask$getBindFunc",
            "run", "ApolloClr$IOpTask$run",
            "getDump", "ApolloClr$IOpTask$getDump",
            "setDump", "ApolloClr$IOpTask$setDump",
            "getOpCode", "ApolloClr$IOpTask$getOpCode",
            "setOpCode", "ApolloClr$IOpTask$setOpCode",
            "getMethod", "ApolloClr$IOpTask$getMethod",
            "setMethod", "ApolloClr$IOpTask$setMethod"
            ]
        },
        getBindFunc: function () {
            return this.func;
        },
        run: function () {
            this.func(this.V1, this.V2);
        }
    }; });

    Bridge.define("ApolloClr.MethodDefine.OpCodeTaskT$3", function (TV1, TV2, TV3) { return {
        inherits: [ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask],
        func: null,
        V1: Bridge.getDefaultValue(TV1),
        V2: Bridge.getDefaultValue(TV2),
        V3: Bridge.getDefaultValue(TV3),
        config: {
            alias: [
            "getBindFunc", "ApolloClr$IOpTask$getBindFunc",
            "run", "ApolloClr$IOpTask$run",
            "getDump", "ApolloClr$IOpTask$getDump",
            "setDump", "ApolloClr$IOpTask$setDump",
            "getOpCode", "ApolloClr$IOpTask$getOpCode",
            "setOpCode", "ApolloClr$IOpTask$setOpCode",
            "getMethod", "ApolloClr$IOpTask$getMethod",
            "setMethod", "ApolloClr$IOpTask$setMethod"
            ]
        },
        getBindFunc: function () {
            return this.func;
        },
        run: function () {
            this.func(this.V1, this.V2, this.V3);
        }
    }; });

    Bridge.define("ApolloClr.TypeDefine.MethodDefine", {
        inherits: [ApolloClr.MethodTasks],
        codes: null,
        config: {
            properties: {
                MethodDefinition: null,
                TypeDefine: null
            }
        },
        getName: function () {
            return this.getMethodDefinition().getCallName();
        },
        setName: function (value) {
        },
        cloneOne: function () {
            var methodDefinition = this.getMethodDefinition();

            var codes = this.codes;

            if (this.codes == null) {
                var lines = this.getMethodDefinition().bodyLines;
                this.codes = (codes = ApolloClr.Method.ILCodeParse.readILCodes$1(lines.toArray(), methodDefinition.localList, methodDefinition.parametersList));
            }

            var method = ApolloClr.MethodTasks.build(ApolloClr.TypeDefine.MethodDefine, codes, methodDefinition.locals, methodDefinition.parameters, !Bridge.referenceEquals(methodDefinition.returnType.toLowerCase(), Bridge.Reflection.getTypeName(Object).toLowerCase()), methodDefinition.maxStack);
            method.setMethodDefinition(methodDefinition);
            method.setTypeDefine(this.getTypeDefine());
            method.compile(Bridge.fn.cacheBind(this.getTypeDefine(), this.getTypeDefine().methodCompile), Bridge.fn.cacheBind(this.getTypeDefine(), this.getTypeDefine().newCompile));

            return method;
        }
    });

    /**
     * Represents an assembly that has been disassembled.
     Note that internally, most properties on this object 
     are lazy, so won't be parsed until required.
     *
     * @public
     * @class SilAPI.DisassembledAssembly
     * @augments SilAPI.DisassembledEntity
     */
    Bridge.define("SilAPI.DisassembledAssembly", {
        inherits: [SilAPI.DisassembledEntity],
        lazyDisassembledIlClasses: null,
        config: {
            properties: {
                /**
                 * Gets or sets the assembly path.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.DisassembledAssembly
                 * @memberof SilAPI.DisassembledAssembly
                 * @function getAssemblyPath
                 * @return  {string}
                 */
                /**
                 * Gets or sets the assembly path.
                 *
                 * @instance
                 * @this SilAPI.DisassembledAssembly
                 * @memberof SilAPI.DisassembledAssembly
                 * @function setAssemblyPath
                 * @param   {string}    value    The assembly path.
                 * @return  {void}
                 */
                AssemblyPath: null
            }
        },
        ctor: function () {
            this.$initialize();
            SilAPI.DisassembledEntity.ctor.call(this);
            this.lazyDisassembledIlClasses = new (System.Lazy$1(System.Collections.Generic.List$1(SilAPI.DisassembledIlClass)))(Bridge.fn.cacheBind(this, this.createDisassembledIlClasses));
        },
        /**
         * Gets the classes.
         *
         * @instance
         * @public
         * @this SilAPI.DisassembledAssembly
         * @memberof SilAPI.DisassembledAssembly
         * @function getClasses
         * @return  {System.Collections.Generic.IEnumerable$1}
         */
        /**
         * Gets the classes.
         *
         * @instance
         * @function setClasses
         */
        getClasses: function () {
            return System.Linq.Enumerable.from(this.lazyDisassembledIlClasses.getValue()).ofType(SilAPI.DisassembledClass);
        },
        /**
         * Gets the structures.
         *
         * @instance
         * @public
         * @this SilAPI.DisassembledAssembly
         * @memberof SilAPI.DisassembledAssembly
         * @function getStructures
         * @return  {System.Collections.Generic.IEnumerable$1}
         */
        /**
         * Gets the structures.
         *
         * @instance
         * @function setStructures
         */
        getStructures: function () {
            return System.Linq.Enumerable.from(this.lazyDisassembledIlClasses.getValue()).ofType(SilAPI.DisassembledStructure);
        },
        /**
         * Gets the interfaces.
         *
         * @instance
         * @public
         * @this SilAPI.DisassembledAssembly
         * @memberof SilAPI.DisassembledAssembly
         * @function getInterfaces
         * @return  {System.Collections.Generic.IEnumerable$1}
         */
        /**
         * Gets the interfaces.
         *
         * @instance
         * @function setInterfaces
         */
        getInterfaces: function () {
            return System.Linq.Enumerable.from(this.lazyDisassembledIlClasses.getValue()).ofType(SilAPI.DisassembledInterface);
        },
        /**
         * Gets the delegates.
         *
         * @instance
         * @public
         * @this SilAPI.DisassembledAssembly
         * @memberof SilAPI.DisassembledAssembly
         * @function getDelegates
         * @return  {System.Collections.Generic.IEnumerable$1}
         */
        /**
         * Gets the delegates.
         *
         * @instance
         * @function setDelegates
         */
        getDelegates: function () {
            return System.Linq.Enumerable.from(this.lazyDisassembledIlClasses.getValue()).ofType(SilAPI.DisassembledDelegate);
        },
        /**
         * Gets the enumerations.
         *
         * @instance
         * @public
         * @this SilAPI.DisassembledAssembly
         * @memberof SilAPI.DisassembledAssembly
         * @function getEnumerations
         * @return  {System.Collections.Generic.IEnumerable$1}
         */
        /**
         * Gets the enumerations.
         *
         * @instance
         * @function setEnumerations
         */
        getEnumerations: function () {
            return System.Linq.Enumerable.from(this.lazyDisassembledIlClasses.getValue()).ofType(SilAPI.DisassembledEnumeration);
        },
        /**
         * Gets all methods, this is deep and recursive - it will get all methods in all classes, nested to any level.
         *
         * @instance
         * @public
         * @this SilAPI.DisassembledAssembly
         * @memberof SilAPI.DisassembledAssembly
         * @function getAllMethods
         * @return  {System.Collections.Generic.IEnumerable$1}
         */
        /**
         * Gets all methods, this is deep and recursive - it will get all methods in all classes, nested to any level.
         *
         * @instance
         * @function setAllMethods
         */
        getAllMethods: function () {
            var $t;
            var allMethods = new (System.Collections.Generic.List$1(SilAPI.DisassembledMethod))();

            $t = Bridge.getEnumerator(this.getAllClasses(), SilAPI.DisassembledClass);
            while ($t.moveNext()) {
                var $class = $t.getCurrent();
                allMethods.addRange($class.getMethods());
            }

            return allMethods;
        },
        /**
         * Gets all properties, this is deep and recursive - it will get all methods in all classes, nested to any level.
         *
         * @instance
         * @public
         * @this SilAPI.DisassembledAssembly
         * @memberof SilAPI.DisassembledAssembly
         * @function getAllProperties
         * @return  {System.Collections.Generic.IEnumerable$1}
         */
        /**
         * Gets all properties, this is deep and recursive - it will get all methods in all classes, nested to any level.
         *
         * @instance
         * @function setAllProperties
         */
        getAllProperties: function () {
            var $t;
            var allProperties = new (System.Collections.Generic.List$1(SilAPI.DisassembledProperty))();

            $t = Bridge.getEnumerator(this.getAllClasses(), SilAPI.DisassembledClass);
            while ($t.moveNext()) {
                var $class = $t.getCurrent();
                allProperties.addRange($class.getProperties());
            }

            return allProperties;
        },
        /**
         * Gets all fields, this is deep and recursive - it will get all methods in all classes, nested to any level.
         *
         * @instance
         * @public
         * @this SilAPI.DisassembledAssembly
         * @memberof SilAPI.DisassembledAssembly
         * @function getAllFields
         * @return  {System.Collections.Generic.IEnumerable$1}
         */
        /**
         * Gets all fields, this is deep and recursive - it will get all methods in all classes, nested to any level.
         *
         * @instance
         * @function setAllFields
         */
        getAllFields: function () {
            var $t;
            var allFields = new (System.Collections.Generic.List$1(SilAPI.DisassembledField))();

            $t = Bridge.getEnumerator(this.getAllClasses(), SilAPI.DisassembledClass);
            while ($t.moveNext()) {
                var $class = $t.getCurrent();
                allFields.addRange($class.getFields());
            }

            return allFields;
        },
        getAllEvents: function () {
            var $t;
            var allFields = new (System.Collections.Generic.List$1(SilAPI.DisassembledEvent))();

            $t = Bridge.getEnumerator(this.getAllClasses(), SilAPI.DisassembledClass);
            while ($t.moveNext()) {
                var $class = $t.getCurrent();
                allFields.addRange($class.getEvents());
            }

            return allFields;
        },
        getAllClasses: function () {
            return this.getIlClassesRecursiveOfType(SilAPI.DisassembledClass);
        },
        getAllEnumerations: function () {
            return this.getIlClassesRecursiveOfType(SilAPI.DisassembledEnumeration);
        },
        getAllStructures: function () {
            return this.getIlClassesRecursiveOfType(SilAPI.DisassembledStructure);
        },
        getAllInterfaces: function () {
            return this.getIlClassesRecursiveOfType(SilAPI.DisassembledInterface);
        },
        getAllDelegates: function () {
            return this.getIlClassesRecursiveOfType(SilAPI.DisassembledDelegate);
        },
        createDisassembledIlClasses: function () {
            var $t;
            var disassembledEntities = new (System.Collections.Generic.List$1(SilAPI.DisassembledIlClass))();

            //  Parse the disassembled entities.
            var disassembledIlClasses = this.parseDisassembledIlClasses();

            //  Go through each entity.
            $t = Bridge.getEnumerator(disassembledIlClasses);
            while ($t.moveNext()) {
                var disassembledIlClass = $t.getCurrent();
                //  Create the entity type from the entity IL.
                var ilClass = this.createIlClassFromRawIlClass(disassembledIlClass);

                if (ilClass != null) {
                    //  Initialise the entity.
                    disassembledEntities.add(ilClass);

                    //  Set the parent
                    ilClass.setParent(this);

                    //  Recursively set the full names of child objects.
                    ilClass.updateFullNamesOfChildren();
                }
            }
            return disassembledEntities;
        },
        createIlClassFromRawIlClass: function (rawIlClass) {
            var $t;
            //  Get the raw IL.
            var rawIL = rawIlClass.getILBuilder().toString();

            //  Get the first and second line.
            var firstLine = null;
            var secondLine = null;
            var reader = new System.IO.StringReader(rawIL);
            try {
                firstLine = reader.readLine();
                if (firstLine != null) {
                    secondLine = reader.readLine();
                }
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }

            var ilClass = new SilAPI.DisassembledClass();

            //  We can immediately identify structures and interfaces.
            if (SilAPI.ILParseHelper.isLineStructDeclaration(firstLine)) {
                ilClass = new SilAPI.DisassembledStructure();
            } else {
                if (SilAPI.ILParseHelper.isLineInterfaceDeclaration(firstLine)) {
                    ilClass = new SilAPI.DisassembledInterface();
                } else {
                    //  Now check the second line.
                    if (secondLine == null) {
                        ilClass = new SilAPI.DisassembledClass();
                    } else {
                        var baseType = { };
                        if (!SilAPI.ILParseHelper.readExtendsLine(secondLine, baseType)) {
                            ilClass = new SilAPI.DisassembledClass();
                        }
                        if (Bridge.referenceEquals(baseType.v, "[mscorlib]System.Enum")) {
                            ilClass = new SilAPI.DisassembledEnumeration();
                        } else {
                            if (Bridge.referenceEquals(baseType.v, "[mscorlib]System.MulticastDelegate")) {
                                ilClass = new SilAPI.DisassembledDelegate();
                            }
                        }
                    }
                }
            }

            //  Set the IL.
            ilClass.setRawIL(rawIL);
            ilClass.initialiseFromIL();

            //  Add any children.
            $t = Bridge.getEnumerator(rawIlClass.getChildren());
            while ($t.moveNext()) {
                var rawChild = $t.getCurrent();
                //  Create the entity type from the entity IL.
                var childIlClass = this.createIlClassFromRawIlClass(rawChild);
                ilClass.addChild(childIlClass);
            }

            return ilClass;
        },
        parseDisassembledIlClasses: function () {
            //  We'll return a list of raw IL classes.
            var rootRawILClasses = new (System.Collections.Generic.List$1(SilAPI.DisassembledAssembly.RawILClass))();

            //  Now start parsing the raw IL, line by line.
            var reader = new System.IO.StringReader(this.getRawIL());
            try {
                //  IL classes can be nested, so when parsing them we must maintain
                //  a stack (so we can nest too).
                var rawIlClassStack = new (System.Collections.Generic.Stack$1(SilAPI.DisassembledAssembly.RawILClass)).ctor();

                //  Read each line
                var line;
                while (((line = reader.readLine())) != null) {
                    if (System.String.contains(line,"<GetVisualChildren>")) {
                        Bridge.Console.log();
                    }

                    //  Is it a class start token? If so, we can start a new builder.
                    if (SilAPI.ILParseHelper.isLineAnyLevelIlClassDeclaration(line)) {
                        var fullName = { }, templateSpecification = { };
                        SilAPI.ILParseHelper.getClassNameFromClassDeclarationLine(line, fullName, templateSpecification);

                        //  Create a new raw IL class, parse its name, add it to the list if it's top level, add it to the stack.
                        var rawIlClass = Bridge.merge(new SilAPI.DisassembledAssembly.RawILClass(), {
                            setFullName: fullName.v,
                            setTemplateSpecification: templateSpecification.v
                        } );
                        if (!System.Linq.Enumerable.from(rawIlClassStack).any()) {
                            rootRawILClasses.add(rawIlClass);
                        } else {
                            rawIlClassStack.peek().getChildren().add(rawIlClass);
                        }
                        rawIlClassStack.push(rawIlClass);
                    }

                    //  If don't have a current class, skip.
                    if (!System.Linq.Enumerable.from(rawIlClassStack).any()) {
                        continue;
                    }

                    //  Add the line to the class builder.
                    rawIlClassStack.peek().getILBuilder().appendLine(line);

                    //  Is it a class end token? If so, we've finished the class.
                    if (SilAPI.ILParseHelper.isLineClassEndDeclaration(line, rawIlClassStack.peek().getFullName())) {
                        //  Pop the stack.
                        rawIlClassStack.pop();
                    }
                }
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }

            //  Return the set of class builders.
            return rootRawILClasses;
        },
        initialiseFromIL: function () {

        },
        /**
         * Tries to find a disassembled entity, given a disassembled target.
         *
         * @instance
         * @public
         * @this SilAPI.DisassembledAssembly
         * @memberof SilAPI.DisassembledAssembly
         * @param   {SilAPI.DisassemblyTarget}     disassemblyTarget    The disassembly target.
         * @return  {SilAPI.DisassembledEntity}
         */
        findDisassembledEntity: function (disassemblyTarget) {
            //  If there's no target, we can't find anything.
            if (disassemblyTarget == null) {
                return null;
            }

            switch (disassemblyTarget.getTargetType()) {
                case SilAPI.DisassemblyTargetType.Class: 
                    //  Find the class with the given name.
                    return System.Linq.Enumerable.from(this.getAllClasses()).firstOrDefault(function (c) {
                            return Bridge.referenceEquals(c.getFullName(), disassemblyTarget.getFullName());
                        }, null);
                case SilAPI.DisassemblyTargetType.Enumeration: 
                    //  Find the enumeration with the given name.
                    return System.Linq.Enumerable.from(this.getAllEnumerations()).firstOrDefault(function (c) {
                            return Bridge.referenceEquals(c.getFullName(), disassemblyTarget.getFullName());
                        }, null);
                case SilAPI.DisassemblyTargetType.Method: 
                    //  Find the entity with the given name.
                    return System.Linq.Enumerable.from(this.getAllMethods()).firstOrDefault(function (c) {
                            return Bridge.referenceEquals(c.getFullName(), disassemblyTarget.getFullName());
                        }, null);
                case SilAPI.DisassemblyTargetType.Property: 
                    //  Find the entity with the given name.
                    return System.Linq.Enumerable.from(this.getAllProperties()).firstOrDefault(function (c) {
                            return Bridge.referenceEquals(c.getFullName(), disassemblyTarget.getFullName());
                        }, null);
                case SilAPI.DisassemblyTargetType.Field: 
                    //  Find the entity with the given name.
                    return System.Linq.Enumerable.from(this.getAllFields()).firstOrDefault(function (c) {
                            return Bridge.referenceEquals(c.getFullName(), disassemblyTarget.getFullName());
                        }, null);
                case SilAPI.DisassemblyTargetType.Structure: 
                    //  Find the structure with the given name.
                    return System.Linq.Enumerable.from(this.getAllStructures()).firstOrDefault(function (c) {
                            return Bridge.referenceEquals(c.getFullName(), disassemblyTarget.getFullName());
                        }, null);
                case SilAPI.DisassemblyTargetType.Interface: 
                    //  Find the structure with the given name.
                    return System.Linq.Enumerable.from(this.getAllInterfaces()).firstOrDefault(function (c) {
                            return Bridge.referenceEquals(c.getFullName(), disassemblyTarget.getFullName());
                        }, null);
                case SilAPI.DisassemblyTargetType.Event: 
                    //  Find the structure with the given name.
                    return System.Linq.Enumerable.from(this.getAllEvents()).firstOrDefault(function (c) {
                            return Bridge.referenceEquals(c.getFullName(), disassemblyTarget.getFullName());
                        }, null);
                case SilAPI.DisassemblyTargetType.Delegate: 
                    //  Find the structure with the given name.
                    return System.Linq.Enumerable.from(this.getAllDelegates()).firstOrDefault(function (c) {
                            return Bridge.referenceEquals(c.getFullName(), disassemblyTarget.getFullName());
                        }, null);
                default: 
                    throw new System.ArgumentOutOfRangeException();
            }
        },
        getIlClassesRecursiveOfType: function (T) {
            var $t;
            //  Create a set of classes.
            var ilClasses = new (System.Collections.Generic.List$1(T))();

            //  Go through each il class.
            $t = Bridge.getEnumerator(this.lazyDisassembledIlClasses.getValue());
            while ($t.moveNext()) {
                var ilClass = $t.getCurrent();
                //  Add it if it's the right type..
                var typedIlClass = Bridge.as(ilClass, T);
                if (typedIlClass != null) {
                    ilClasses.add(typedIlClass);
                }

                //  Recurse.
                ilClasses.addRange(ilClass.getIlClassesRecursiveOfType(T));
            }

            return ilClasses;
        }
    });

    /**
     * A DisassembledILClass is an IL .class entity. This is not the same
     as a C# class - an IL .class can be a struct, class, enum, delegate etc.
     IL .classes can in many cases contain other other elements -
     *
     * @public
     * @class SilAPI.DisassembledIlClass
     * @augments SilAPI.DisassembledEntity
     */
    Bridge.define("SilAPI.DisassembledIlClass", {
        inherits: [SilAPI.DisassembledEntity],
        modifiers: null,
        fields: null,
        methods: null,
        properties: null,
        events: null,
        childIlClasses: null,
        config: {
            properties: {
                BaseType: null
            },
            init: function () {
                this.modifiers = new (System.Collections.Generic.List$1(String))();
                this.fields = new (System.Collections.Generic.List$1(SilAPI.DisassembledField))();
                this.methods = new (System.Collections.Generic.List$1(SilAPI.DisassembledMethod))();
                this.properties = new (System.Collections.Generic.List$1(SilAPI.DisassembledProperty))();
                this.events = new (System.Collections.Generic.List$1(SilAPI.DisassembledEvent))();
                this.childIlClasses = new (System.Collections.Generic.List$1(SilAPI.DisassembledIlClass))();
            }
        },
        getModifiers: function () {
            return this.modifiers;
        },
        getFields: function () {
            return this.fields;
        },
        getMethods: function () {
            return this.methods;
        },
        getProperties: function () {
            return this.properties;
        },
        getEvents: function () {
            return this.events;
        },
        getClasses: function () {
            return System.Linq.Enumerable.from(this.childIlClasses).ofType(SilAPI.DisassembledClass);
        },
        getStructures: function () {
            return System.Linq.Enumerable.from(this.childIlClasses).ofType(SilAPI.DisassembledStructure);
        },
        getEnumerations: function () {
            return System.Linq.Enumerable.from(this.childIlClasses).ofType(SilAPI.DisassembledEnumeration);
        },
        getInterfaces: function () {
            return System.Linq.Enumerable.from(this.childIlClasses).ofType(SilAPI.DisassembledInterface);
        },
        getDelegates: function () {
            return System.Linq.Enumerable.from(this.childIlClasses).ofType(SilAPI.DisassembledDelegate);
        },
        /**
         * Gets all classes, this is deep and recursive.
         *
         * @instance
         * @public
         * @this SilAPI.DisassembledIlClass
         * @memberof SilAPI.DisassembledIlClass
         * @function getAllClasses
         * @return  {System.Collections.Generic.IEnumerable$1}
         */
        /**
         * Gets all classes, this is deep and recursive.
         *
         * @instance
         * @function setAllClasses
         */
        getAllClasses: function () {
            return this.getIlClassesRecursiveOfType(SilAPI.DisassembledClass);
        },
        /**
         * Gets all classes, this is deep and recursive.
         *
         * @instance
         * @public
         * @this SilAPI.DisassembledIlClass
         * @memberof SilAPI.DisassembledIlClass
         * @function getAllStructures
         * @return  {System.Collections.Generic.IEnumerable$1}
         */
        /**
         * Gets all classes, this is deep and recursive.
         *
         * @instance
         * @function setAllStructures
         */
        getAllStructures: function () {
            return this.getIlClassesRecursiveOfType(SilAPI.DisassembledStructure);
        },
        /**
         * Gets all classes, this is deep and recursive.
         *
         * @instance
         * @public
         * @this SilAPI.DisassembledIlClass
         * @memberof SilAPI.DisassembledIlClass
         * @function getAllEnumerations
         * @return  {System.Collections.Generic.IEnumerable$1}
         */
        /**
         * Gets all classes, this is deep and recursive.
         *
         * @instance
         * @function setAllEnumerations
         */
        getAllEnumerations: function () {
            return this.getIlClassesRecursiveOfType(SilAPI.DisassembledEnumeration);
        },
        /**
         * Gets all classes, this is deep and recursive.
         *
         * @instance
         * @public
         * @this SilAPI.DisassembledIlClass
         * @memberof SilAPI.DisassembledIlClass
         * @function getAllDelegates
         * @return  {System.Collections.Generic.IEnumerable$1}
         */
        /**
         * Gets all classes, this is deep and recursive.
         *
         * @instance
         * @function setAllDelegates
         */
        getAllDelegates: function () {
            return this.getIlClassesRecursiveOfType(SilAPI.DisassembledDelegate);
        },
        /**
         * Gets all classes, this is deep and recursive.
         *
         * @instance
         * @public
         * @this SilAPI.DisassembledIlClass
         * @memberof SilAPI.DisassembledIlClass
         * @function getAllInterfaces
         * @return  {System.Collections.Generic.IEnumerable$1}
         */
        /**
         * Gets all classes, this is deep and recursive.
         *
         * @instance
         * @function setAllInterfaces
         */
        getAllInterfaces: function () {
            return this.getIlClassesRecursiveOfType(SilAPI.DisassembledInterface);
        },
        toString: function () {
            var $t;
            return ($t = System.String.concat("Disassembled IL Class: ", this.getShortName()), $t != null ? $t : "Unknown");
        },
        initialiseFromIL: function () {
            //  Read the first two lines.
            var firstLine = null;
            var secondLine = null;
            var reader = new System.IO.StringReader(this.getRawIL());
            try {
                firstLine = reader.readLine();
                if (firstLine != null) {
                    secondLine = reader.readLine();
                }
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }

            //  From the class declaration, read the full name and tokens.
            try {
                var className = { }, templateSpecification = { };
                var classModifiers = { };
                SilAPI.ILParseHelper.getClassDeclarationParts(firstLine, classModifiers, className, templateSpecification);
                this.setFullName(className.v);
                this.setTemplateSpecification(templateSpecification.v);
                this.setShortName(System.Linq.Enumerable.from(className.v.split(String.fromCharCode(46))).last());
                this.modifiers.clear();
                this.modifiers.addRange(classModifiers.v);
            }
            catch ($e1) {
                $e1 = System.Exception.create($e1);
                //  todo
            }

            if (secondLine != null) {
                var baseType = { };
                if (SilAPI.ILParseHelper.readExtendsLine(secondLine, baseType)) {
                    this.setBaseType(baseType.v);
                }
            }

            //  Read the fields and methods.
            this.readFields();
            this.readMethods();
            this.readProperties();
            this.readEvents();
        },
        readFields: function () {
            this.fields.clear();

            //  Read all lines.
            var reader = new System.IO.StringReader(this.getRawIL());
            try {
                var line;
                while (((line = reader.readLine())) != null) {
                    if (SilAPI.ILParseHelper.isLineFieldDeclaration(line)) {
                        var field = new SilAPI.DisassembledField();
                        field.setParent(this);
                        field.setRawIL(line);
                        field.initialiseFromIL();
                        field.setFullName(System.String.concat(this.getFullName(), ".", field.getShortName()));
                        this.fields.add(field);
                    }
                }
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }
        },
        readMethods: function () {
            if (System.String.contains(this.getFullName(),"WithTemplate")) {
                Bridge.Console.log();
            }

            var methodBuilders = new (System.Collections.Generic.List$1(System.Text.StringBuilder))();

            //  Now start parsing the raw IL, line by line.
            var reader = new System.IO.StringReader(this.getRawIL());
            try {
                //  Read each line
                var line;
                var currentBuilder = null;
                var currentName = null;
                while (((line = reader.readLine())) != null) {
                    //  Is it a class start token? If so, we can start a new builder.
                    if (SilAPI.ILParseHelper.isLineMethodDeclaration(line)) {
                        currentBuilder = new System.Text.StringBuilder();
                    } else if (currentBuilder != null && currentName == null) {
                        //  We must now be on the name line.
                        currentName = SilAPI.ILParseHelper.getMethodNameFromDeclarationLine(line);
                    }

                    //  If don't have a current class, skip.
                    if (currentBuilder == null) {
                        continue;
                    }

                    //  Add the line to the class builder.
                    currentBuilder.appendLine(line);

                    //  Is it a class end token? If so, clear the current class identifier.
                    if (SilAPI.ILParseHelper.isLineMethodEndDeclaration(line, this.getShortName(), currentName)) {
                        methodBuilders.add(currentBuilder);
                        currentName = null;
                        currentBuilder = null;
                    }
                }
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }
            System.Exction.forEach(System.Text.StringBuilder, methodBuilders, Bridge.fn.bind(this, $asm.$.SilAPI.DisassembledIlClass.f1));
        },
        readProperties: function () {
            var propertyBuilders = new (System.Collections.Generic.List$1(System.Text.StringBuilder))();

            //  Now start parsing the raw IL, line by line.
            var reader = new System.IO.StringReader(this.getRawIL());
            try {
                //  Read each line
                var line;
                var currentBuilder = null;
                var currentName = null;
                while (((line = reader.readLine())) != null) {
                    //  Is it a class start token? If so, we can start a new builder.
                    if (SilAPI.ILParseHelper.isLinePropertyDeclaration(line)) {
                        currentBuilder = new System.Text.StringBuilder();
                        currentName = SilAPI.ILParseHelper.getPropertyNameFromDeclarationLine(line);
                    }

                    //  If don't have a current class, skip.
                    if (currentBuilder == null) {
                        continue;
                    }

                    //  Add the line to the class builder.
                    currentBuilder.appendLine(line);

                    //  Is it a class end token? If so, clear the current class identifier.
                    if (SilAPI.ILParseHelper.isLinePropertyEndDeclaration(line, this.getShortName(), currentName)) {
                        propertyBuilders.add(currentBuilder);
                        currentName = null;
                        currentBuilder = null;
                    }
                }
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }
            System.Exction.forEach(System.Text.StringBuilder, propertyBuilders, Bridge.fn.bind(this, $asm.$.SilAPI.DisassembledIlClass.f2));
        },
        readEvents: function () {
            var eventBuilders = new (System.Collections.Generic.List$1(System.Text.StringBuilder))();

            //  Now start parsing the raw IL, line by line.
            var reader = new System.IO.StringReader(this.getRawIL());
            try {
                //  Read each line
                var line;
                var currentBuilder = null;
                var currentName = null;
                while (((line = reader.readLine())) != null) {
                    //  Is it a class start token? If so, we can start a new builder.
                    if (SilAPI.ILParseHelper.isLineEventPropertyDeclaration(line)) {
                        currentBuilder = new System.Text.StringBuilder();
                        currentName = SilAPI.ILParseHelper.getEventNameFromDeclarationLine(line);
                    }

                    //  If don't have a current class, skip.
                    if (currentBuilder == null) {
                        continue;
                    }

                    //  Add the line to the class builder.
                    currentBuilder.appendLine(line);

                    //  Is it a class end token? If so, clear the current class identifier.
                    if (SilAPI.ILParseHelper.isLineEventEndDeclaration(line, this.getShortName(), currentName)) {
                        eventBuilders.add(currentBuilder);
                        currentName = null;
                        currentBuilder = null;
                    }
                }
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }
            System.Exction.forEach(System.Text.StringBuilder, eventBuilders, Bridge.fn.bind(this, $asm.$.SilAPI.DisassembledIlClass.f3));
        },
        addChild: function (ilClass) {
            this.childIlClasses.add(ilClass);
        },
        getIlClassesRecursiveOfType: function (T) {
            var $t;
            //  Create a set of classes.
            var ilClasses = new (System.Collections.Generic.List$1(T))();

            //  Go through each il class.
            $t = Bridge.getEnumerator(this.childIlClasses);
            while ($t.moveNext()) {
                var ilClass = $t.getCurrent();
                //  Add it if it's the right type..
                var typedIlClass = Bridge.as(ilClass, T);
                if (typedIlClass != null) {
                    ilClasses.add(typedIlClass);
                }

                //  Recurse.
                ilClasses.addRange(ilClass.getIlClassesRecursiveOfType(T));
            }

            return ilClasses;
        },
        updateFullNamesOfChildren: function () {
            var $t;
            $t = Bridge.getEnumerator(this.childIlClasses);
            while ($t.moveNext()) {
                var childIlClass = $t.getCurrent();
                childIlClass.setFullName(System.String.concat(this.getFullName(), ".", childIlClass.getFullName()));
                childIlClass.updateFullNamesOfChildren();
                childIlClass.setParent(this);
            }
        }
    });

    Bridge.ns("SilAPI.DisassembledIlClass", $asm.$);

    Bridge.apply($asm.$.SilAPI.DisassembledIlClass, {
        f1: function (mb) {
            var method = new SilAPI.DisassembledMethod();
            method.setParent(this);
            method.setRawIL(mb.toString());
            method.initialiseFromIL();
            method.setFullName(System.String.concat(this.getFullName(), ".", method.getShortName()));
            this.methods.add(method);
        },
        f2: function (mb) {
            var method = new SilAPI.DisassembledProperty();
            method.setParent(this);
            method.setRawIL(mb.toString());
            method.initialiseFromIL();
            method.setFullName(System.String.concat(this.getFullName(), ".", method.getShortName()));
            this.properties.add(method);
        },
        f3: function (mb) {
            var method = new SilAPI.DisassembledEvent();
            method.setParent(this);
            method.setRawIL(mb.toString());
            method.initialiseFromIL();
            method.setFullName(System.String.concat(this.getFullName(), ".", method.getShortName()));
            this.events.add(method);
        }
    });

    Bridge.define("SilAPI.DisassembledEvent", {
        inherits: [SilAPI.DisassembledEntity],
        toString: function () {
            var $t;
            return ($t = System.String.concat("Disassembled Event: ", this.getShortName()), $t != null ? $t : "Unknown");
        },
        initialiseFromIL: function () {
            var line;
            var reader = new System.IO.StringReader(this.getRawIL());
            try {
                while (((line = reader.readLine())) != null) {
                    var methodName = SilAPI.ILParseHelper.getEventNameFromDeclarationLine(line);
                    if (methodName != null) {
                        this.setShortName(methodName);
                        this.setFullName(methodName);
                        break;
                    }
                }
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }
        }
    });

    Bridge.define("SilAPI.DisassembledField", {
        inherits: [SilAPI.DisassembledEntity],
        modifiers: null,
        config: {
            properties: {
                FieldType: null,
                LiteralValue: null
            },
            init: function () {
                this.modifiers = new (System.Collections.Generic.List$1(String))();
            }
        },
        getModifiers: function () {
            return this.modifiers;
        },
        toString: function () {
            var $t;
            return ($t = System.String.concat("Disassembled IL Field: ", this.getShortName()), $t != null ? $t : "Unknown");
        },
        initialiseFromIL: function () {
            //  We should have one line of IL for the field.
            var fieldLine;
            var reader = new System.IO.StringReader(this.getRawIL());
            try {
                fieldLine = reader.readLine();
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }

            //  Clean the line.
            var cleanLine = fieldLine.trim();

            //  Do we have a literal?
            if (System.Linq.Enumerable.from(cleanLine).contains(61)) {
                var equalsParts = cleanLine.split(String.fromCharCode(61));
                cleanLine = equalsParts[0].trim();
                this.setLiteralValue(equalsParts[1].trim());
            }

            //  We should be in the format
            //  .field modifier modifier modifier type name.
            var parts = System.Linq.Enumerable.from(cleanLine.split(String.fromCharCode(32))).toList(String);

            //  Remove .field.
            if (System.Linq.Enumerable.from(parts).count() > 1) {
                parts.removeAt(0);
            }

            //  Read name.
            this.setFullName(System.Linq.Enumerable.from(parts).last());
            this.setShortName(this.getFullName());
            parts.removeAt(((parts.getCount() - 1) | 0));

            //  Read type.
            this.setFieldType(System.Linq.Enumerable.from(parts).last());
            parts.removeAt(((parts.getCount() - 1) | 0));

            this.modifiers.clear();
            this.modifiers.addRange(parts);
        }
    });

    Bridge.define("SilAPI.DisassembledMethod", {
        inherits: [SilAPI.DisassembledEntity],
        statics: {
            opTConvert: function (name) {
                var listA = new (System.Collections.Generic.List$1(String))(System.Array.init(["int32", "float32", "int64", "float64"], String));
                var listB = new (System.Collections.Generic.List$1(String))(System.Array.init(["i4", "r4", "i8", "r8"], String));
                var index = listA.indexOf(name);
                if (index >= 0) {
                    return listB.getItem(index);
                }
                return name;
            },
            strForm2S: function (sstr, s, e) {
                var str = "";
                var num = System.String.indexOf(sstr, s, 0, sstr.length, 3);
                if (num >= 0) {
                    var num2 = System.String.indexOf(sstr, e, ((num + s.length) | 0));
                    if (num2 >= 0) {
                        str = sstr.substr(((num + s.length) | 0), (((((num2 - num) | 0)) - s.length) | 0));
                    }
                }
                return str;
            },
            strForm2SA: function (sstr, s, e) {
                var list = new (System.Collections.Generic.List$1(String))();
                var startIndex = 0;
                var num2 = 0;
                do {
                    startIndex = System.String.indexOf(sstr, s, startIndex);
                    if ((startIndex < 0) || (num2 < 0)) {
                        break;
                    }
                    num2 = System.String.indexOf(sstr, e, ((startIndex + s.length) | 0));
                    if ((startIndex >= 0) && (num2 >= 0)) {
                        var item = sstr.substr(((startIndex + s.length) | 0), (((((num2 - startIndex) | 0)) - s.length) | 0));
                        list.add(item);
                        startIndex = num2;
                    }
                } while (startIndex >= 0);
                var strArray = System.Array.init(list.getCount(), null, String);
                for (var i = 0; i < strArray.length; i = (i + 1) | 0) {
                    strArray[i] = list.getItem(i);
                }
                return strArray;
            },
            strLeft: function (sstr, lenght) {
                if (sstr.length > lenght) {
                    return sstr.substr(0, lenght);
                }
                return sstr;
            },
            strLenght: function (sstr) {
                return sstr.length;
            },
            strRight: function (sstr, lenght) {
                if (sstr.length > lenght) {
                    return sstr.substr(((sstr.length - lenght) | 0), lenght);
                }
                return sstr;
            },
            strSplit: function (baseString, splitString, sso) {
                baseString = System.String.concat(baseString.trim(), splitString);
                var startIndex = 0;
                var num2 = 0;
                var list = new (System.Collections.Generic.List$1(String))();
                do {
                    startIndex = System.String.indexOf(baseString, splitString, startIndex, baseString.length, 3);
                    if (startIndex >= 0) {
                        var item = System.String.replaceAll(baseString.substr(num2, ((startIndex - num2) | 0)), splitString, "");
                        if (sso === 0) {
                            list.add(item);
                        }
                        if ((sso === 1) && (!Bridge.referenceEquals(item, ""))) {
                            list.add(item);
                        }
                        num2 = startIndex;
                        if ((((startIndex + 1) | 0)) > baseString.length) {
                            startIndex = -1;
                        } else {
                            startIndex = (startIndex + 1) | 0;
                        }
                    }
                } while (startIndex >= 0);
                var strArray = System.Array.init(list.getCount(), null, String);
                for (var i = 0; i < strArray.length; i = (i + 1) | 0) {
                    strArray[i] = list.getItem(i);
                }
                return strArray;
            }
        },
        maxStack: 0,
        static: false,
        returnType: null,
        locals: null,
        parameters: null,
        localsIndex: null,
        parametersIndex: null,
        localList: null,
        parametersList: null,
        bodyLines: null,
        config: {
            init: function () {
                this.locals = new (System.Collections.Generic.Dictionary$2(String,String))();
                this.parameters = new (System.Collections.Generic.Dictionary$2(String,String))();
                this.localsIndex = new (System.Collections.Generic.Dictionary$2(String,System.Int32))();
                this.parametersIndex = new (System.Collections.Generic.Dictionary$2(String,System.Int32))();
                this.localList = new (System.Collections.Generic.List$1(String))();
                this.parametersList = new (System.Collections.Generic.List$1(String))();
                this.bodyLines = new (System.Collections.Generic.List$1(String))();
            }
        },
        getCallName: function () {
            var $t;
            var sb = new System.Text.StringBuilder();
            sb.append(this.returnType);
            sb.append(" ");
            sb.append(System.String.replaceAll(this.getFullName(), System.String.concat(".", this.getShortName()), System.String.concat("::", this.getShortName())));
            sb.append("(");
            $t = Bridge.getEnumerator(this.parameters);
            while ($t.moveNext()) {
                var parameter = $t.getCurrent();
                sb.append(System.String.concat(parameter.value, ","));
            }
            if (this.parameters.getCount() > 0) {
                sb.remove(((sb.getLength() - 1) | 0), 1);
            }
            sb.append(")");
            return sb.toString();
        },
        toString: function () {
            var $t;
            return ($t = System.String.concat("Disassembled Method: ", this.getShortName()), $t != null ? $t : "Unknown");
        },
        initialiseFromIL: function () {
            var line;
            var reader = new System.IO.StringReader(this.getRawIL());
            try {
                while (((line = reader.readLine())) != null) {
                    var methodName = SilAPI.ILParseHelper.getMethodNameFromDeclarationLine(line);
                    if (methodName != null) {
                        this.setShortName(methodName);
                        this.setFullName(methodName);
                        break;
                    }
                }
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }
        },
        readBody: function () {
            var $t, $t1;
            var line;
            this.locals.clear();
            this.bodyLines.clear();
            this.localList.clear();
            this.parametersList.clear();
            var reader = new System.IO.StringReader(this.getRawIL());
            try {
                var localsStart = false;
                var bodyStart = false;
                var methodStart = false;
                var sb = new System.Text.StringBuilder();
                while (((line = reader.readLine())) != null) {
                    line = line.trim();
                    if (System.String.startsWith(line, "//")) {
                        continue;
                    }
                    if (System.String.isNullOrEmpty(line)) {
                        continue;
                    }
                    var values = line.split(String.fromCharCode(32));
                    if (System.String.startsWith(line, ".method")) {
                        methodStart = true;
                        sb = new System.Text.StringBuilder();
                    }
                    if (methodStart) {
                        if (System.String.startsWith(line, "{")) {
                            methodStart = false;
                            line = sb.toString();
                            values = line.split(String.fromCharCode(32));
                            this.static = System.String.indexOf(line, "static") >= 0;
                            if (this.static) {
                                this.returnType = values[4];
                            } else {
                                this.returnType = values[3];
                            }
                            var locals = line;
                            locals = SilAPI.DisassembledMethod.strForm2S(locals, "(", ")");
                            var localvalues = locals.split(String.fromCharCode(44));
                            $t = Bridge.getEnumerator(localvalues);
                            while ($t.moveNext()) {
                                var localvalue = $t.getCurrent();
                                if (System.String.isNullOrEmpty(localvalue)) {
                                    continue;
                                }
                                var lvs = localvalue.split(String.fromCharCode(32));
                                this.parameters.set(lvs[1], lvs[0]);
                                this.parametersIndex.set(lvs[1], this.parameters.getCount());
                                this.parametersList.add(lvs[0]);

                            }


                            continue;
                        }
                        if (sb.getLength() > 0) {
                            sb.append(System.String.concat(" ", line));
                        } else {
                            sb.append(line);
                        }

                        continue;
                    }

                    if (System.String.startsWith(line, ".maxstack")) {
                        this.maxStack = System.Int32.parse(values[2]);
                    }

                    if (System.String.startsWith(line, ".locals")) {
                        localsStart = true;
                        sb = new System.Text.StringBuilder();
                    }
                    if (localsStart) {
                        sb.appendLine(line);

                        if (System.String.endsWith(line, ")")) {
                            localsStart = false;
                            var locals1 = sb.toString();
                            locals1 = SilAPI.DisassembledMethod.strForm2S(locals1, "(", ")");
                            var localvalues1 = locals1.split(String.fromCharCode(44));
                            $t1 = Bridge.getEnumerator(localvalues1);
                            while ($t1.moveNext()) {
                                var localvalue1 = $t1.getCurrent();
                                var lvs1 = localvalue1.split(String.fromCharCode(32));

                                this.locals.set(lvs1[((lvs1.length - 1) | 0)], lvs1[((lvs1.length - 2) | 0)]);
                                this.localsIndex.set(lvs1[((lvs1.length - 1) | 0)], this.localsIndex.getCount());
                                this.localList.add(lvs1[((lvs1.length - 2) | 0)]);
                            }

                            bodyStart = true;
                            continue;
                        }
                    }
                    if (bodyStart) {
                        if (System.String.startsWith(line, "+")) {
                            this.bodyLines.setItem(((this.bodyLines.getCount() - 1) | 0), System.String.concat(this.bodyLines.getItem(((this.bodyLines.getCount() - 1) | 0)), line));
                            continue;
                        }

                        if (this.bodyLines.getCount() > 1) {
                            this.bodyLines.setItem(((this.bodyLines.getCount() - 1) | 0), System.String.replaceAll(this.bodyLines.getItem(((this.bodyLines.getCount() - 1) | 0)), "\"+ \"", ""));
                        }

                        if (System.String.startsWith(line, "} // end of method")) {
                            break;
                        }
                        line = System.String.replaceAll(System.String.replaceAll(System.String.replaceAll(System.String.replaceAll(System.String.replaceAll(line, "  ", " "), "  ", " "), "  ", " "), "  ", " "), "  ", " ");

                        if (this.locals.containsKey(System.Linq.Enumerable.from(values).last())) {
                            line = System.String.concat(System.String.remove(line, ((line.length - System.Linq.Enumerable.from(values).last().length) | 0)), this.localsIndex.get(System.Linq.Enumerable.from(values).last()));
                        }
                        if (this.parameters.containsKey(System.Linq.Enumerable.from(values).last())) {
                            line = System.String.concat(System.String.remove(line, ((line.length - System.Linq.Enumerable.from(values).last().length) | 0)), this.parametersIndex.get(System.Linq.Enumerable.from(values).last()));
                        }
                        this.bodyLines.add(line);
                    }
                }
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }

            for (var i = 0; i < this.parametersList.getCount(); i = (i + 1) | 0) {
                this.parametersList.setItem(i, SilAPI.DisassembledMethod.opTConvert(this.parametersList.getItem(i)));
            }
            for (var i1 = 0; i1 < this.localList.getCount(); i1 = (i1 + 1) | 0) {
                this.localList.setItem(i1, SilAPI.DisassembledMethod.opTConvert(this.localList.getItem(i1)));
            }
        }
    });

    Bridge.define("SilAPI.DisassembledProperty", {
        inherits: [SilAPI.DisassembledEntity],
        toString: function () {
            var $t;
            return ($t = System.String.concat("Disassembled Property: ", this.getShortName()), $t != null ? $t : "Unknown");
        },
        initialiseFromIL: function () {
            var line;
            var reader = new System.IO.StringReader(this.getRawIL());
            try {
                while (((line = reader.readLine())) != null) {
                    var methodName = SilAPI.ILParseHelper.getPropertyNameFromDeclarationLine(line);
                    if (methodName != null) {
                        this.setShortName(methodName);
                        this.setFullName(methodName);
                        break;
                    }
                }
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }
        }
    });

    /**
     * The Sil Processor is the main object that deals with Sil data.
     *
     * @public
     * @class SilAPI.StreamSilProcessor
     * @implements  SilAPI.ISilProcessor
     */
    Bridge.define("SilAPI.StreamSilProcessor", {
        inherits: [SilAPI.ISilProcessor],
        statics: {
            burnCommentBlocks: function (line, reader) {
                var linePart1 = { }, linePart2 = { };

                //  We are in lines if we're between the start and end.
                if (SilAPI.StreamSilProcessor.getLineHint(line.v, linePart1, linePart2)) {
                    //  Have we got the block magic number>
                    if (linePart1.v === 16707566 && linePart2.v === 16707566) {
                        var check;
                        while (((check = reader.readLine())) != null) {
                            //  Are we a comment?
                            if (System.String.startsWith(check, "//") === false) {
                                break;
                            }
                        }

                        //  Update the current line.
                        line.v = check;
                    }
                }
            },
            getSourceFile: function (line, sourceFilePath) {
                sourceFilePath.v = null;

                //  Source file indicators are as below:
                //  .line 22,22 : 9,10 'C:\\Users\\Dave Kerr\\documents\\visual studio 2010\\Projects\\Sil\\Sil\\ProjectSilProcessor.cs'

                //  If we don't have a line indicator, two apostrophes and one colon we're not a line indicator.
                if (System.String.contains(line,".line") === false || System.Linq.Enumerable.from(line).count($asm.$.SilAPI.StreamSilProcessor.f1) !== 2) {
                    return false;
                }

                //  Get the delimiters.
                var start = (System.String.indexOf(line, String.fromCharCode(39)) + 1) | 0;
                var end = System.String.indexOf(line, String.fromCharCode(39), start);

                //  Get the file part.
                var filePart = line.substr(start, ((end - start) | 0));

                //  If we have no part, bail.
                if (System.String.isNullOrEmpty(filePart)) {
                    return false;
                }

                //  We've got a file indicator.
                sourceFilePath.v = filePart;

                return true;
            },
            getComment: function (line, comment, linePart1) {
                comment.v = "";
                linePart1.v = -1;

                //  Comment lines start with //.
                if (System.String.startsWith(line, "//") === false) {
                    return false;
                }

                //  Then have a colon.
                var colonPos = System.String.indexOf(line, String.fromCharCode(58));
                if (colonPos === -1) {
                    return false;
                }

                //  Between is a number.
                if (System.Int32.tryParse(line.substr(2, ((colonPos - 2) | 0)), linePart1) === false) {
                    return false;
                }

                //  After the colon is the comment.
                comment.v = line.substr(((colonPos + 1) | 0)).trim();

                //  It's a comment.
                return true;
            },
            getLineHint: function (line, firstPart, secondPart) {
                var lineToken = ".line ";
                var endLineToken = " :";

                firstPart.v = -1;
                secondPart.v = -1;

                if (System.String.contains(line,lineToken) === false) {
                    return false;
                }

                //  Sub out the line part.
                var start = (System.String.indexOf(line, lineToken, 0, line.length, 4) + lineToken.length) | 0;
                var end = System.String.indexOf(line, endLineToken, start, line.length, 4);
                if (end === -1) {
                    return false;
                }

                var lineParts = line.substr(start, ((end - start) | 0)).trim();

                //  Split on the comma.
                var linePartsArray = System.Linq.Enumerable.from(lineParts.split(String.fromCharCode(44))).select($asm.$.SilAPI.StreamSilProcessor.f2).toList(String);

                //  Convert to ints.
                if (linePartsArray.getCount() > 0) {
                    System.Int32.tryParse(linePartsArray.getItem(0), firstPart);
                }
                if (linePartsArray.getCount() > 1) {
                    System.Int32.tryParse(linePartsArray.getItem(1), secondPart);
                }

                return true;
            }
        },
        /**
         * The IL for the module.
         *
         * @instance
         */
        moduleIL: null,
        /**
         * The IL for the file.
         *
         * @instance
         */
        fileIL: null,
        /**
         * The IL for the selection.
         *
         * @instance
         */
        selectionIL: null,
        config: {
            properties: {
                /**
                 * Gets or sets the source IL stream.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.StreamSilProcessor
                 * @memberof SilAPI.StreamSilProcessor
                 * @function getSourceILStream
                 * @return  {string}
                 */
                /**
                 * Gets or sets the source IL stream.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.StreamSilProcessor
                 * @memberof SilAPI.StreamSilProcessor
                 * @function setSourceILStream
                 * @param   {string}    value    The source IL stream.
                 * @return  {void}
                 */
                SourceILStream: null,
                /**
                 * Gets or sets the source file path.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.StreamSilProcessor
                 * @memberof SilAPI.StreamSilProcessor
                 * @function getSourceFilePath
                 * @return  {string}
                 */
                /**
                 * Gets or sets the source file path.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.StreamSilProcessor
                 * @memberof SilAPI.StreamSilProcessor
                 * @function setSourceFilePath
                 * @param   {string}    value    The source file path.
                 * @return  {void}
                 */
                SourceFilePath: null,
                /**
                 * Gets or sets the source file first line.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.StreamSilProcessor
                 * @memberof SilAPI.StreamSilProcessor
                 * @function getSourceFileFirstLine
                 * @return  {number}
                 */
                /**
                 * Gets or sets the source file first line.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.StreamSilProcessor
                 * @memberof SilAPI.StreamSilProcessor
                 * @function setSourceFileFirstLine
                 * @param   {number}    value    The source file first line.
                 * @return  {void}
                 */
                SourceFileFirstLine: 0,
                /**
                 * Gets or sets the source file last line.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.StreamSilProcessor
                 * @memberof SilAPI.StreamSilProcessor
                 * @function getSourceFileLastLine
                 * @return  {number}
                 */
                /**
                 * Gets or sets the source file last line.
                 *
                 * @instance
                 * @public
                 * @this SilAPI.StreamSilProcessor
                 * @memberof SilAPI.StreamSilProcessor
                 * @function setSourceFileLastLine
                 * @param   {number}    value    The source file last line.
                 * @return  {void}
                 */
                SourceFileLastLine: 0
            },
            alias: [
            "processIL", "SilAPI$ISilProcessor$processIL",
            "getSelectionIL", "SilAPI$ISilProcessor$getSelectionIL",
            "getFileIL", "SilAPI$ISilProcessor$getFileIL",
            "getModuleIL", "SilAPI$ISilProcessor$getModuleIL"
            ]
        },
        /**
         * Generates the IL.
         *
         * @instance
         * @private
         * @this SilAPI.StreamSilProcessor
         * @memberof SilAPI.StreamSilProcessor
         * @return  {void}
         */
        generateModuleIL: function () {
            var reader = new System.IO.StringReader(this.getSourceILStream());
            try {
                //  Store the output in the module IL.
                this.moduleIL = reader.readToEnd();
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }
        },
        /**
         * Parses the file IL.
         *
         * @instance
         * @private
         * @this SilAPI.StreamSilProcessor
         * @memberof SilAPI.StreamSilProcessor
         * @return  {void}
         */
        parseFileIL: function () {
            //  Create a builder for output.
            var builder = new System.Text.StringBuilder();

            //  Use a string reader to read the module IL.
            var reader = new System.IO.StringReader(this.moduleIL);
            try {
                var line;
                var inFile = false;

                //  Read line by line.
                while (((line = reader.readLine())) != null) {
                    var filePath = { };

                    //  Have we got a file part?
                    if (SilAPI.StreamSilProcessor.getSourceFile(line, filePath) === false) {
                        //  We're not a file part, append the line only if we're in the file.
                        if (inFile) {
                            builder.appendLine(line);
                        }
                    } else {
                        //  We're a file part - but are we the right one?
                    }
                }
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }

            //  Store the file IL.
            this.fileIL = builder.toString();
        },
        /**
         * Parses the selection IL.
         *
         * @instance
         * @private
         * @this SilAPI.StreamSilProcessor
         * @memberof SilAPI.StreamSilProcessor
         * @return  {void}
         */
        parseSelectionIL: function () {
            //  Create a builder for output.
            var builder = new System.Text.StringBuilder();

            //  Create a reader on the file IL.
            var reader = new System.IO.StringReader(this.fileIL);
            try {
                var line = { };
                var inLines = false;
                while (((line.v = reader.readLine())) != null) {
                    //  Get the line parts.
                    var linePart1 = { }, linePart2 = { };

                    //  If we have a line like:
                    //  .line 16707566,16707566 : 0,0 ''
                    //  then we must remove every subsequent comment line, its commenting a chunk of code, not 
                    //  line by line code.
                    SilAPI.StreamSilProcessor.burnCommentBlocks(line, reader);

                    //  We are in lines if we're between the start and end.
                    if (SilAPI.StreamSilProcessor.getLineHint(line.v, linePart1, linePart2)) {
                        inLines = linePart1.v >= this.getSourceFileFirstLine();
                        if (inLines && linePart2.v > this.getSourceFileLastLine()) {
                            inLines = false;
                        }

                        //  We're on a line hint line, so skip this now, we don't want to show them.
                        continue;
                    }

                    //  If we're not in the lines, move on.
                    if (inLines === false) {
                        continue;
                    }

                    var comment = { };
                    if (SilAPI.StreamSilProcessor.getComment(line.v, comment, linePart1)) {
                        //  Skip empty comments.
                        if (System.String.isNullOrEmpty(comment.v)) {
                            continue;
                        }

                        //  Re-write comments.
                        line.v = System.String.concat("\r\n//  Line " + linePart1.v + ": ", comment.v, "\r\n");
                    }

                    //  Add the line to the builder.
                    builder.appendLine(line.v);

                }
            }
            finally {
                if (Bridge.hasValue(reader)) {
                    reader.dispose();
                }
            }

            //  Store the result.
            this.selectionIL = builder.toString();
        },
        /**
         * Processes the IL.
         *
         * @instance
         * @public
         * @this SilAPI.StreamSilProcessor
         * @memberof SilAPI.StreamSilProcessor
         * @return  {boolean}
         */
        processIL: function () {
            try {
                //  Generate the module IL.
                this.generateModuleIL();

                //  Parse the File IL.
                this.parseFileIL();

                //  Parse the selection IL.
                this.parseSelectionIL();

                //  We're done.
                return true;
            }
            catch ($e1) {
                $e1 = System.Exception.create($e1);
                //  Processing the IL failed.
                return false;
            }
        },
        /**
         * Gets the selection IL.
         *
         * @instance
         * @public
         * @this SilAPI.StreamSilProcessor
         * @memberof SilAPI.StreamSilProcessor
         * @return  {string}        The IL for the selection.
         */
        getSelectionIL: function () {
            return this.selectionIL;
        },
        /**
         * Gets the file IL.
         *
         * @instance
         * @public
         * @this SilAPI.StreamSilProcessor
         * @memberof SilAPI.StreamSilProcessor
         * @return  {string}        The IL for the file the selection is in.
         */
        getFileIL: function () {
            return this.fileIL;
        },
        /**
         * Gets the module IL.
         *
         * @instance
         * @public
         * @this SilAPI.StreamSilProcessor
         * @memberof SilAPI.StreamSilProcessor
         * @return  {string}        The IL for the module the selection is in.
         */
        getModuleIL: function () {
            return this.moduleIL;
        }
    });

    Bridge.ns("SilAPI.StreamSilProcessor", $asm.$);

    Bridge.apply($asm.$.SilAPI.StreamSilProcessor, {
        f1: function (c) {
            return c === 39;
        },
        f2: function (lp) {
            return lp.trim();
        }
    });

    Bridge.define("ApolloClr.Cross.CrossMethodDelegate", {
        inherits: [ApolloClr.Cross.BaseCrossMethodDelegate],
        func: null,
        config: {
            alias: [
            "getDelegate", "ApolloClr$Cross$ICrossMethodDelegate$getDelegate",
            "setArgs", "ApolloClr$Cross$ICrossMethodDelegate$setArgs",
            "run", "ApolloClr$Cross$ICrossMethodDelegate$run"
            ]
        },
        getDelegate: function () {
            return this.func;
        },
        setArgs: function (values) {

        },
        run: function () {
            this.func();

        }
    });

    Bridge.define("ApolloClr.Cross.CrossMethodDelegate$1", function (T) { return {
        inherits: [ApolloClr.Cross.BaseCrossMethodDelegate],
        func: null,
        V1: Bridge.getDefaultValue(T),
        config: {
            alias: [
            "getDelegate", "ApolloClr$Cross$ICrossMethodDelegate$getDelegate",
            "run", "ApolloClr$Cross$ICrossMethodDelegate$run",
            "setArgs", "ApolloClr$Cross$ICrossMethodDelegate$setArgs"
            ]
        },
        getDelegate: function () {
            return this.func;
        },
        run: function () {
            this.func(this.V1);
        },
        setArgs: function (values) {
            this.V1 = Bridge.cast(values[0], T);
        }
    }; });

    Bridge.define("ApolloClr.Cross.CrossMethodDelegateRet$1", function (T) { return {
        inherits: [ApolloClr.Cross.BaseCrossMethodDelegate],
        func: null,
        config: {
            alias: [
            "getDelegate", "ApolloClr$Cross$ICrossMethodDelegate$getDelegate",
            "run", "ApolloClr$Cross$ICrossMethodDelegate$run",
            "setArgs", "ApolloClr$Cross$ICrossMethodDelegate$setArgs"
            ]
        },
        getDelegate: function () {
            return this.func;
        },
        run: function () {
            this.setResult(this.func());
        },
        setArgs: function (values) {

        }
    }; });

    Bridge.define("ApolloClr.Cross.ObjectBuild$1", function (T) { return {
        inherits: [ApolloClr.Cross.BaseCrossMethodDelegate],
        config: {
            alias: [
            "getDelegate", "ApolloClr$Cross$ICrossMethodDelegate$getDelegate",
            "run", "ApolloClr$Cross$ICrossMethodDelegate$run",
            "setArgs", "ApolloClr$Cross$ICrossMethodDelegate$setArgs"
            ]
        },
        getDelegate: function () {
            return null;
        },
        make: function () {
            return Bridge.createInstance(T);
        },
        run: function () {
            this.setResult(this.make());
        },
        setArgs: function (values) {

        }
    }; });

    Bridge.define("SilAPI.DisassembledClass", {
        inherits: [SilAPI.DisassembledIlClass],
        toString: function () {
            var $t;
            return ($t = System.String.concat("Disassembled Class: ", this.getShortName()), $t != null ? $t : "Unknown");
        },
        initialiseFromIL: function () {
            SilAPI.DisassembledIlClass.prototype.initialiseFromIL.call(this);
        }
    });

    Bridge.define("SilAPI.DisassembledDelegate", {
        inherits: [SilAPI.DisassembledIlClass],
        toString: function () {
            var $t;
            return ($t = System.String.concat("Disassembled Delegate: ", this.getShortName()), $t != null ? $t : "Unknown");
        },
        initialiseFromIL: function () {
            SilAPI.DisassembledIlClass.prototype.initialiseFromIL.call(this);
        }
    });

    Bridge.define("SilAPI.DisassembledEnumeration", {
        inherits: [SilAPI.DisassembledIlClass],
        toString: function () {
            var $t;
            return ($t = System.String.concat("Disassembled Enumeration: ", this.getShortName()), $t != null ? $t : "Unknown");
        },
        initialiseFromIL: function () {
            SilAPI.DisassembledIlClass.prototype.initialiseFromIL.call(this);
        }
    });

    Bridge.define("SilAPI.DisassembledInterface", {
        inherits: [SilAPI.DisassembledIlClass],
        toString: function () {
            var $t;
            return ($t = System.String.concat("Disassembled Interface: ", this.getShortName()), $t != null ? $t : "Unknown");
        },
        initialiseFromIL: function () {
            SilAPI.DisassembledIlClass.prototype.initialiseFromIL.call(this);
        }
    });

    Bridge.define("SilAPI.DisassembledStructure", {
        inherits: [SilAPI.DisassembledIlClass],
        toString: function () {
            var $t;
            return ($t = System.String.concat("Disassembled Structure: ", this.getShortName()), $t != null ? $t : "Unknown");
        },
        initialiseFromIL: function () {
            SilAPI.DisassembledIlClass.prototype.initialiseFromIL.call(this);
        }
    });

    var $m = Bridge.setMetadata,
        $n = [System.Reflection,System,ApolloClr,System.Collections.Generic,SilAPI,ApolloClr.TypeDefine,ApolloClr.Cross,System.Diagnostics,ApolloClr.Js,ApolloClr.Method,ApolloClr.MethodDefine];
    $m($n[2].Extensions, function () { return {"att":1048961,"a":2,"s":true,"m":[{"a":2,"n":"Apply","is":true,"t":8,"pi":[{"n":"input","pt":Object,"ps":0},{"n":"target","pt":Object,"ps":1}],"tpc":0,"def":function (input, target) { return input.apply(target, arguments); },"rt":Object,"p":[Object,Object]},{"a":2,"n":"GetFSet","is":true,"t":8,"pi":[{"n":"field","pt":$n[0].FieldInfo,"ps":0}],"sn":"getFSet","rt":Function,"p":[$n[0].FieldInfo]},{"a":2,"n":"GetMethodInfo","is":true,"t":8,"pi":[{"n":"type","pt":Function,"ps":0},{"n":"name","pt":String,"ps":1},{"n":"types","pt":$n[1].Array.type(Function),"ps":2}],"sn":"getMethodInfo","rt":$n[0].MethodInfo,"p":[Function,String,$n[1].Array.type(Function)]},{"a":2,"n":"GetTypeByName","is":true,"t":8,"pi":[{"n":"name","pt":String,"ps":0}],"sn":"getTypeByName","rt":Function,"p":[String]},{"a":2,"n":"GetValueFromStr","is":true,"t":8,"pi":[{"n":"str","pt":String,"ps":0},{"n":"vtype","pt":$n[2].StackValueType,"ps":1}],"sn":"getValueFromStr","rt":Object,"p":[String,$n[2].StackValueType]},{"a":2,"n":"SetTarget","is":true,"t":8,"pi":[{"n":"delegate","pt":Function,"ps":0},{"n":"target","pt":Object,"ps":1}],"sn":"setTarget","rt":Function,"p":[Function,Object]},{"a":1,"n":"DeleageSetFun","is":true,"t":4,"rt":Function,"sn":"deleageSetFun"}]}; });
    $m($n[2].Clr, function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[$n[1].Int32,$n[1].Int32,Boolean,$n[1].Int32],"pi":[{"n":"localCount","dv":5,"o":true,"pt":$n[1].Int32,"ps":0},{"n":"argCount","dv":5,"o":true,"pt":$n[1].Int32,"ps":1},{"n":"haseResult","dv":true,"o":true,"pt":Boolean,"ps":2},{"n":"maxStack","dv":5,"o":true,"pt":$n[1].Int32,"ps":3}],"sn":"ctor"},{"v":true,"a":2,"n":"Add","t":8,"sn":"add","rt":Object},{"v":true,"a":2,"n":"And","t":8,"sn":"and","rt":Object},{"a":2,"n":"Arglist","t":8,"sn":"arglist","rt":Object},{"v":true,"a":2,"n":"Beq","t":8,"pi":[{"n":"n1","pt":String,"ps":0},{"n":"n2","pt":String,"ps":1},{"n":"pc","pt":$n[1].Int32,"ps":2}],"sn":"beq","rt":Object,"p":[String,String,$n[1].Int32]},{"v":true,"a":2,"n":"Bge","t":8,"pi":[{"n":"n1","pt":String,"ps":0},{"n":"n2","pt":String,"ps":1},{"n":"pc","pt":$n[1].Int32,"ps":2}],"sn":"bge","rt":Object,"p":[String,String,$n[1].Int32]},{"v":true,"a":2,"n":"Bgt","t":8,"pi":[{"n":"n1","pt":String,"ps":0},{"n":"n2","pt":String,"ps":1},{"n":"pc","pt":$n[1].Int32,"ps":2}],"sn":"bgt","rt":Object,"p":[String,String,$n[1].Int32]},{"v":true,"a":2,"n":"Ble","t":8,"pi":[{"n":"n1","pt":String,"ps":0},{"n":"n2","pt":String,"ps":1},{"n":"pc","pt":$n[1].Int32,"ps":2}],"sn":"ble","rt":Object,"p":[String,String,$n[1].Int32]},{"v":true,"a":2,"n":"Blt","t":8,"pi":[{"n":"n1","pt":String,"ps":0},{"n":"n2","pt":String,"ps":1},{"n":"pc","pt":$n[1].Int32,"ps":2}],"sn":"blt","rt":Object,"p":[String,String,$n[1].Int32]},{"a":2,"n":"Box","t":8,"pi":[{"n":"type","pt":Function,"ps":0}],"tpc":1,"tprm":["T"],"sn":"box","rt":Object,"p":[Function]},{"v":true,"a":2,"n":"Br","t":8,"pi":[{"n":"n1","pt":String,"ps":0},{"n":"n2","pt":String,"ps":1},{"n":"pc","pt":$n[1].Int32,"ps":2}],"sn":"br","rt":Object,"p":[String,String,$n[1].Int32]},{"v":true,"a":2,"n":"Break","t":8,"sn":"break","rt":Object},{"v":true,"a":2,"n":"Brfalse","t":8,"pi":[{"n":"n1","pt":String,"ps":0},{"n":"n2","pt":String,"ps":1},{"n":"pc","pt":$n[1].Int32,"ps":2}],"sn":"brfalse","rt":Object,"p":[String,String,$n[1].Int32]},{"v":true,"a":2,"n":"Brtrue","t":8,"pi":[{"n":"n1","pt":String,"ps":0},{"n":"n2","pt":String,"ps":1},{"n":"pc","pt":$n[1].Int32,"ps":2}],"sn":"brtrue","rt":Object,"p":[String,String,$n[1].Int32]},{"a":2,"n":"Call","t":8,"pi":[{"n":"retType","pt":String,"ps":0},{"n":"method","pt":String,"ps":1},{"n":"task","pt":$n[2].MethodTasks,"ps":2}],"sn":"call","rt":Object,"p":[String,String,$n[2].MethodTasks]},{"a":2,"n":"Calli","t":8,"sn":"calli","rt":Object},{"a":2,"n":"Callvirt","t":8,"pi":[{"n":"instance","pt":String,"ps":0},{"n":"return","pt":String,"ps":1},{"n":"task","pt":$n[2].MethodTasks,"ps":2}],"sn":"callvirt","rt":Object,"p":[String,String,$n[2].MethodTasks]},{"a":2,"n":"Castclass","t":8,"sn":"castclass","rt":Object},{"v":true,"a":2,"n":"Catch","t":8,"pi":[{"n":"spc","pt":$n[1].Int32,"ps":0},{"n":"epc","pt":$n[1].Int32,"ps":1}],"sn":"catch","rt":Object,"p":[$n[1].Int32,$n[1].Int32]},{"v":true,"a":2,"n":"Ceq","t":8,"sn":"ceq","rt":Object},{"v":true,"a":2,"n":"Cgt","t":8,"sn":"cgt","rt":Object},{"a":2,"n":"Ckfinite","t":8,"sn":"ckfinite","rt":Object},{"v":true,"a":2,"n":"Clt","t":8,"sn":"clt","rt":Object},{"a":2,"n":"Constrained","t":8,"sn":"constrained","rt":Object},{"a":2,"n":"Conv","t":8,"pi":[{"n":"type","pt":$n[2].StackValueType,"ps":0}],"sn":"conv","rt":Object,"p":[$n[2].StackValueType]},{"a":2,"n":"CopyToArgs","t":8,"pi":[{"n":"clr","pt":$n[2].Clr,"ps":0}],"sn":"copyToArgs","rt":Object,"p":[$n[2].Clr]},{"a":2,"n":"Cpblk","t":8,"sn":"cpblk","rt":Object},{"a":2,"n":"Cpobj","t":8,"sn":"cpobj","rt":Object},{"v":true,"a":2,"n":"Div","t":8,"sn":"div","rt":Object},{"a":2,"n":"Dup","t":8,"sn":"dup","rt":Object},{"a":2,"n":"Endfilter","t":8,"sn":"endfilter","rt":Object},{"a":2,"n":"Endfinally","t":8,"sn":"endfinally","rt":Object},{"a":2,"n":"EvaluationStack_Pop","t":8,"sn":"evaluationStack_Pop","rt":$n[2].StackItem},{"a":2,"n":"EvaluationStack_Pop","t":8,"pi":[{"n":"count","pt":$n[1].Int32,"ps":0}],"sn":"evaluationStack_Pop$1","rt":$n[2].StackItem,"p":[$n[1].Int32]},{"a":2,"n":"EvaluationStack_Push","t":8,"pi":[{"n":"obj","pt":$n[2].StackItem,"ps":0}],"sn":"evaluationStack_Push","rt":Object,"p":[$n[2].StackItem]},{"a":2,"n":"EvaluationStack_Push","t":8,"pi":[{"n":"obj","pt":$n[1].Int32,"ps":0}],"sn":"evaluationStack_Push$2","rt":Object,"p":[$n[1].Int32]},{"a":2,"n":"EvaluationStack_Push","t":8,"pi":[{"n":"args","pt":$n[1].Array.type(System.Int32),"ps":0}],"sn":"evaluationStack_Push$3","rt":Object,"p":[$n[1].Array.type(System.Int32)]},{"a":2,"n":"EvaluationStack_Push","t":8,"pi":[{"n":"obj","pt":Object,"ps":0}],"sn":"evaluationStack_Push$4","rt":Object,"p":[Object]},{"a":2,"n":"EvaluationStack_Push","t":8,"pi":[{"n":"vtype","pt":$n[2].StackValueType,"ps":0},{"n":"value","pt":Object,"ps":1}],"sn":"evaluationStack_Push$1","rt":Object,"p":[$n[2].StackValueType,Object]},{"v":true,"a":2,"n":"Finally","t":8,"pi":[{"n":"spc","pt":$n[1].Int32,"ps":0},{"n":"epc","pt":$n[1].Int32,"ps":1}],"sn":"finally","rt":Object,"p":[$n[1].Int32,$n[1].Int32]},{"a":2,"n":"Initblk","t":8,"sn":"initblk","rt":Object},{"a":2,"n":"Initobj","t":8,"sn":"initobj","rt":Object},{"a":2,"n":"Isinst","t":8,"sn":"isinst","rt":Object},{"a":2,"n":"Jmp","t":8,"sn":"jmp","rt":Object},{"v":true,"a":2,"n":"Ldarg","t":8,"pi":[{"n":"i","pt":$n[1].Int32,"ps":0}],"sn":"ldarg","rt":Object,"p":[$n[1].Int32]},{"v":true,"a":2,"n":"Ldc","t":8,"pi":[{"n":"vtype","pt":$n[2].StackValueType,"ps":0},{"n":"value","pt":Object,"ps":1}],"sn":"ldc","rt":Object,"p":[$n[2].StackValueType,Object]},{"v":true,"a":2,"n":"Ldc_i4","t":8,"pi":[{"n":"v","pt":$n[1].Int32,"ps":0}],"sn":"ldc_i4","rt":Object,"p":[$n[1].Int32]},{"a":2,"n":"Ldelem","t":8,"pi":[{"n":"type","pt":$n[2].StackValueType,"ps":0}],"sn":"ldelem","rt":Object,"p":[$n[2].StackValueType]},{"a":2,"n":"Ldelema","t":8,"pi":[{"n":"type","pt":Function,"ps":0}],"sn":"ldelema","rt":Object,"p":[Function]},{"a":2,"n":"Ldfld","t":8,"sn":"ldfld","rt":Object},{"a":2,"n":"Ldflda","t":8,"sn":"ldflda","rt":Object},{"a":2,"n":"Ldftn","t":8,"sn":"ldftn","rt":Object},{"a":2,"n":"Ldind","t":8,"pi":[{"n":"type","pt":$n[2].StackValueType,"ps":0}],"sn":"ldind","rt":Object,"p":[$n[2].StackValueType]},{"a":2,"n":"Ldlen","t":8,"sn":"ldlen","rt":Object},{"v":true,"a":2,"n":"Ldloc","t":8,"pi":[{"n":"i","pt":$n[1].Int32,"ps":0}],"sn":"ldloc","rt":Object,"p":[$n[1].Int32]},{"v":true,"a":2,"n":"Ldloc","t":8,"pi":[{"n":"args","ip":true,"pt":$n[1].Array.type(System.Int32),"ps":0}],"sn":"ldloc$1","rt":Object,"p":[$n[1].Array.type(System.Int32)]},{"v":true,"a":2,"n":"Ldloca","t":8,"pi":[{"n":"i","pt":$n[1].Int32,"ps":0}],"sn":"ldloca","rt":Object,"p":[$n[1].Int32]},{"v":true,"a":2,"n":"Ldnull","t":8,"sn":"ldnull","rt":Object},{"a":2,"n":"Ldobj","t":8,"sn":"ldobj","rt":Object},{"a":2,"n":"Ldsfld","t":8,"sn":"ldsfld","rt":Object},{"a":2,"n":"Ldsflda","t":8,"sn":"ldsflda","rt":Object},{"v":true,"a":2,"n":"Ldstr","t":8,"pi":[{"n":"str","pt":String,"ps":0}],"sn":"ldstr","rt":Object,"p":[String]},{"a":2,"n":"Ldtoken","t":8,"sn":"ldtoken","rt":Object},{"a":2,"n":"Ldvirtftn","t":8,"sn":"ldvirtftn","rt":Object},{"a":2,"n":"Leave","t":8,"pi":[{"n":"i","pt":$n[1].Int32,"ps":0}],"sn":"leave","rt":Object,"p":[$n[1].Int32]},{"a":2,"n":"Localloc","t":8,"sn":"localloc","rt":Object},{"a":2,"n":"Mkrefany","t":8,"sn":"mkrefany","rt":Object},{"v":true,"a":2,"n":"Mul","t":8,"sn":"mul","rt":Object},{"v":true,"a":2,"n":"Neg","t":8,"sn":"neg","rt":Object},{"a":2,"n":"Newarr","t":8,"pi":[{"n":"type","pt":Function,"ps":0}],"sn":"newarr","rt":Object,"p":[Function]},{"a":2,"n":"Newobj","t":8,"pi":[{"n":"instance","pt":String,"ps":0},{"n":"return","pt":String,"ps":1},{"n":"task","pt":$n[2].MethodTasks,"ps":2}],"sn":"newobj","rt":Object,"p":[String,String,$n[2].MethodTasks]},{"a":2,"n":"No","t":8,"sn":"no","rt":Object},{"v":true,"a":2,"n":"Nop","t":8,"sn":"nop","rt":Object},{"v":true,"a":2,"n":"Not","t":8,"sn":"not","rt":Object},{"v":true,"a":2,"n":"Or","t":8,"sn":"or","rt":Object},{"v":true,"a":2,"n":"Pop","t":8,"sn":"pop","rt":Object},{"a":2,"n":"Readonly","t":8,"sn":"readonly","rt":Object},{"a":2,"n":"Refanytype","t":8,"sn":"refanytype","rt":Object},{"a":2,"n":"Refanyval","t":8,"sn":"refanyval","rt":Object},{"v":true,"a":2,"n":"Rem","t":8,"sn":"rem","rt":Object},{"v":true,"a":2,"n":"Reset","t":8,"sn":"reset","rt":Object},{"v":true,"a":2,"n":"Ret","t":8,"sn":"ret","rt":Object},{"a":2,"n":"Rethrow","t":8,"sn":"rethrow","rt":Object},{"v":true,"a":2,"n":"Shl","t":8,"sn":"shl","rt":Object},{"v":true,"a":2,"n":"Shr","t":8,"sn":"shr","rt":Object},{"a":2,"n":"Sizeof","t":8,"sn":"sizeof","rt":Object},{"a":2,"n":"Starg","t":8,"pi":[{"n":"i","pt":$n[1].Int32,"ps":0}],"sn":"starg","rt":Object,"p":[$n[1].Int32]},{"a":2,"n":"Stelem","t":8,"pi":[{"n":"type","pt":$n[2].StackValueType,"ps":0}],"sn":"stelem","rt":Object,"p":[$n[2].StackValueType]},{"a":2,"n":"Stfld","t":8,"sn":"stfld","rt":Object},{"a":2,"n":"Stind","t":8,"pi":[{"n":"type","pt":$n[2].StackValueType,"ps":0}],"sn":"stind","rt":Object,"p":[$n[2].StackValueType]},{"v":true,"a":2,"n":"Stloc","t":8,"pi":[{"n":"i","pt":$n[1].Int32,"ps":0}],"sn":"stloc","rt":Object,"p":[$n[1].Int32]},{"a":2,"n":"Stobj","t":8,"sn":"stobj","rt":Object},{"a":2,"n":"Stsfld","t":8,"sn":"stsfld","rt":Object},{"v":true,"a":2,"n":"Sub","t":8,"sn":"sub","rt":Object},{"a":2,"n":"Switch","t":8,"pi":[{"n":"pcs","pt":$n[1].Array.type(System.Int32),"ps":0}],"sn":"switch","rt":Object,"p":[$n[1].Array.type(System.Int32)]},{"a":2,"n":"Tail","t":8,"sn":"tail","rt":Object},{"a":2,"n":"Throw","t":8,"sn":"throw","rt":Object},{"a":2,"n":"UnBox","t":8,"pi":[{"n":"type","pt":Function,"ps":0}],"tpc":1,"tprm":["T"],"sn":"unBox","rt":Object,"p":[Function]},{"a":2,"n":"UnBox_Any","t":8,"pi":[{"n":"type","pt":Function,"ps":0}],"tpc":1,"tprm":["T"],"sn":"unBox_Any","rt":Object,"p":[Function]},{"a":2,"n":"Unaligned","t":8,"sn":"unaligned","rt":Object},{"a":2,"n":"Volatile","t":8,"sn":"volatile","rt":Object},{"v":true,"a":2,"n":"Xor","t":8,"sn":"xor","rt":Object},{"v":true,"a":2,"n":"_Try","t":8,"pi":[{"n":"spc","pt":$n[1].Int32,"ps":0},{"n":"epc","pt":$n[1].Int32,"ps":1},{"n":"pcs","pt":$n[1].Int32,"ps":2}],"sn":"_Try","rt":Object,"p":[$n[1].Int32,$n[1].Int32,$n[1].Int32]},{"a":2,"n":"Argp","t":16,"rt":$n[2].StackItem,"g":{"a":2,"n":"get_Argp","t":8,"sn":"getArgp","rt":$n[2].StackItem}},{"a":2,"n":"Csp","t":16,"rt":$n[2].StackItem,"g":{"a":2,"n":"get_Csp","t":8,"sn":"getCsp","rt":$n[2].StackItem}},{"a":1,"n":"Stack","t":16,"rt":$n[2].BaseClrStack,"g":{"a":1,"n":"get_Stack","t":8,"sn":"getStack","rt":$n[2].BaseClrStack}},{"a":2,"n":"ArgsVarCount","t":4,"rt":$n[1].Int32,"sn":"argsVarCount","ro":true},{"a":2,"n":"CallStack","t":4,"rt":System.Array.type(ApolloClr.StackItem),"sn":"callStack","ro":true},{"a":1,"n":"CallStackClr","t":4,"rt":$n[2].BaseClrStack,"sn":"callStackClr","ro":true},{"a":2,"n":"DumpAction","t":4,"rt":Function,"sn":"dumpAction"},{"a":2,"n":"LocalVarCount","t":4,"rt":$n[1].Int32,"sn":"localVarCount","ro":true},{"a":2,"n":"ResultPoint","t":4,"rt":$n[2].StackItem,"sn":"resultPoint"},{"a":2,"n":"RetResult","t":4,"rt":Boolean,"sn":"retResult"},{"a":2,"n":"ThrowAction","t":4,"rt":Function,"sn":"throwAction"},{"a":1,"n":"_Argp","t":4,"rt":$n[2].StackItem,"sn":"_Argp","ro":true},{"a":1,"n":"_Csp","t":4,"rt":$n[2].StackItem,"sn":"_Csp","ro":true},{"a":1,"n":"_Stack","t":4,"rt":$n[2].BaseClrStack,"sn":"_Stack"},{"a":1,"n":"conveTypes","t":4,"rt":$n[1].Array.type(Function),"sn":"conveTypes"}]}; });
    $m($n[2].OpCodeEnum, function () { return {"att":256,"a":4}; });
    $m($n[2].BaseClrStack, function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[$n[1].Int32],"pi":[{"n":"x","dv":10,"o":true,"pt":$n[1].Int32,"ps":0}],"sn":"ctor"},{"v":true,"a":2,"n":"Pop","t":8,"sn":"pop","rt":$n[2].StackItem},{"v":true,"a":2,"n":"Pop","t":8,"pi":[{"n":"count","pt":$n[1].Int32,"ps":0}],"sn":"pop$1","rt":$n[2].StackItem,"p":[$n[1].Int32]},{"v":true,"a":2,"n":"Push","t":8,"pi":[{"n":"obj","pt":$n[2].StackItem,"ps":0}],"sn":"push","rt":Object,"p":[$n[2].StackItem]},{"a":2,"n":"Push","t":8,"pi":[{"n":"obj","pt":$n[1].Int32,"ps":0}],"sn":"push$3","rt":Object,"p":[$n[1].Int32]},{"a":2,"n":"Push","t":8,"pi":[{"n":"vtype","pt":$n[2].StackValueType,"ps":0},{"n":"value","pt":$n[1].Int32,"ps":1}],"sn":"push$1","rt":Object,"p":[$n[2].StackValueType,$n[1].Int32]},{"a":2,"n":"Push","t":8,"pi":[{"n":"vtype","pt":$n[2].StackValueType,"ps":0},{"n":"value","pt":Object,"ps":1}],"sn":"push$2","rt":Object,"p":[$n[2].StackValueType,Object]},{"a":2,"n":"Reset","t":8,"sn":"reset","rt":Object},{"a":2,"n":"SetCurrent","t":8,"sn":"setCurrent","rt":Object},{"a":2,"n":"Top","t":8,"sn":"top","rt":$n[2].StackItem},{"a":2,"n":"Item","t":16,"rt":$n[2].StackItem,"p":[$n[1].Int32],"i":true,"ipi":[{"n":"index","pt":$n[1].Int32,"ps":0}],"g":{"a":2,"n":"get_Item","t":8,"pi":[{"n":"index","pt":$n[1].Int32,"ps":0}],"sn":"getItem","rt":$n[2].StackItem,"p":[$n[1].Int32]}},{"a":2,"n":"Current","is":true,"t":4,"rt":$n[2].BaseClrStack,"sn":"current"},{"a":1,"n":"Esp","t":4,"rt":$n[1].Int32,"sn":"esp"},{"a":4,"n":"EvaluationStack","t":4,"rt":System.Array.type(ApolloClr.StackItem),"sn":"evaluationStack"}]}; });
    $m($n[2].StackItem, function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":".ctor","t":1,"p":[$n[1].Int32,$n[2].BaseClrStack],"pi":[{"n":"lindex","pt":$n[1].Int32,"ps":0},{"n":"current","pt":$n[2].BaseClrStack,"ps":1}],"sn":"$ctor1"},{"a":2,"n":"CopyFrom","t":8,"pi":[{"n":"stackItem","pt":$n[2].StackItem,"ps":0}],"sn":"copyFrom","rt":Object,"p":[$n[2].StackItem]},{"a":2,"n":"SetValue","t":8,"pi":[{"n":"vtype","pt":$n[2].StackValueType,"ps":0},{"n":"value","pt":Object,"ps":1}],"sn":"setValue","rt":Object,"p":[$n[2].StackValueType,Object]},{"a":2,"n":"op_Addition","is":true,"t":8,"pi":[{"n":"s1","pt":$n[2].StackItem,"ps":0},{"n":"offset","pt":$n[1].Int32,"ps":1}],"sn":"op_Addition","rt":$n[2].StackItem,"p":[$n[2].StackItem,$n[1].Int32]},{"a":2,"n":"op_Equality","is":true,"t":8,"pi":[{"n":"s1","pt":$n[2].StackItem,"ps":0},{"n":"s2","pt":$n[2].StackItem,"ps":1}],"sn":"op_Equality","rt":Boolean,"p":[$n[2].StackItem,$n[2].StackItem]},{"a":2,"n":"op_GreaterThan","is":true,"t":8,"pi":[{"n":"s1","pt":$n[2].StackItem,"ps":0},{"n":"s2","pt":$n[2].StackItem,"ps":1}],"sn":"op_GreaterThan","rt":Boolean,"p":[$n[2].StackItem,$n[2].StackItem]},{"a":2,"n":"op_GreaterThanOrEqual","is":true,"t":8,"pi":[{"n":"s1","pt":$n[2].StackItem,"ps":0},{"n":"s2","pt":$n[2].StackItem,"ps":1}],"sn":"op_GreaterThanOrEqual","rt":Boolean,"p":[$n[2].StackItem,$n[2].StackItem]},{"a":2,"n":"op_Implicit","is":true,"t":8,"pi":[{"n":"ptr","pt":$n[1].Int32,"ps":0}],"sn":"op_Implicit","rt":$n[2].StackItem,"p":[$n[1].Int32]},{"a":2,"n":"op_Inequality","is":true,"t":8,"pi":[{"n":"s1","pt":$n[2].StackItem,"ps":0},{"n":"s2","pt":$n[2].StackItem,"ps":1}],"sn":"op_Inequality","rt":Boolean,"p":[$n[2].StackItem,$n[2].StackItem]},{"a":2,"n":"op_LessThan","is":true,"t":8,"pi":[{"n":"s1","pt":$n[2].StackItem,"ps":0},{"n":"s2","pt":$n[2].StackItem,"ps":1}],"sn":"op_LessThan","rt":Boolean,"p":[$n[2].StackItem,$n[2].StackItem]},{"a":2,"n":"op_LessThanOrEqual","is":true,"t":8,"pi":[{"n":"s1","pt":$n[2].StackItem,"ps":0},{"n":"s2","pt":$n[2].StackItem,"ps":1}],"sn":"op_LessThanOrEqual","rt":Boolean,"p":[$n[2].StackItem,$n[2].StackItem]},{"a":2,"n":"Value","t":16,"rt":Object,"g":{"a":2,"n":"get_Value","t":8,"sn":"getValue","rt":Object}},{"a":2,"n":"ValueDouble","t":16,"rt":$n[1].Double,"g":{"a":2,"n":"get_ValueDouble","t":8,"sn":"getValueDouble","rt":$n[1].Double}},{"a":2,"n":"ValueFloat","t":16,"rt":$n[1].Single,"g":{"a":2,"n":"get_ValueFloat","t":8,"sn":"getValueFloat","rt":$n[1].Single}},{"a":2,"n":"ValueInt","t":16,"rt":$n[1].Int32,"g":{"a":2,"n":"get_ValueInt","t":8,"sn":"getValueInt","rt":$n[1].Int32}},{"a":2,"n":"ValueLong","t":16,"rt":$n[1].Int64,"g":{"a":2,"n":"get_ValueLong","t":8,"sn":"getValueLong","rt":$n[1].Int64}},{"a":2,"n":"Current","t":4,"rt":$n[2].BaseClrStack,"sn":"current","ro":true},{"a":2,"n":"Index","t":4,"rt":$n[1].Int32,"sn":"index"},{"a":2,"n":"IntValue","t":4,"rt":$n[1].Int32,"sn":"intValue"},{"a":2,"n":"LValue","t":4,"rt":$n[1].Int32,"sn":"lValue","ro":true},{"a":2,"n":"Ptr","t":4,"rt":$n[2].StackObject,"sn":"ptr"},{"a":2,"n":"SPtrEmpty","is":true,"t":4,"rt":$n[2].StackItem,"sn":"sPtrEmpty"},{"a":2,"n":"VPoint","t":4,"rt":Object,"sn":"vPoint"},{"a":2,"n":"ValueType","t":4,"rt":$n[2].StackValueType,"sn":"valueType"}]}; });
    $m($n[2].StackObject, function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"GetStackObject","is":true,"t":8,"pi":[{"n":"prt","pt":Object,"ps":0}],"sn":"getStackObject","rt":$n[2].StackObject,"p":[Object]},{"a":2,"n":"NewObject","is":true,"t":8,"pi":[{"n":"obj","pt":Object,"ps":0}],"sn":"newObject","rt":$n[2].StackObject,"p":[Object]},{"a":2,"n":"ToObject","is":true,"t":8,"pi":[{"n":"stackItem","pt":$n[2].StackItem,"ps":0}],"sn":"toObject","rt":Object,"p":[$n[2].StackItem]},{"a":2,"n":"op_Implicit","is":true,"t":8,"pi":[{"n":"ptr","pt":$n[2].StackItem,"ps":0}],"sn":"op_Implicit","rt":$n[2].StackObject,"p":[$n[2].StackItem]},{"a":2,"n":"op_Implicit","is":true,"t":8,"pi":[{"n":"ptr","pt":$n[1].Int32,"ps":0}],"sn":"op_Implicit$1","rt":$n[2].StackObject,"p":[$n[1].Int32]},{"a":2,"n":"Object","t":4,"rt":Object,"sn":"object"}]}; });
    $m($n[2].StackValueType, function () { return {"att":257,"a":2}; });
    $m($n[2].ILCode, function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"ov":true,"a":2,"n":"ToString","t":8,"sn":"toString","rt":String},{"a":2,"n":"Arg0","t":4,"rt":String,"sn":"arg0"},{"a":2,"n":"Arg1","t":4,"rt":String,"sn":"arg1"},{"a":2,"n":"Arg2","t":4,"rt":String,"sn":"arg2"},{"a":2,"n":"Lable","t":4,"rt":String,"sn":"lable"},{"a":2,"n":"Line","t":4,"rt":String,"sn":"line"},{"a":2,"n":"Op","t":4,"rt":String,"sn":"op"},{"a":2,"n":"OpArg0","t":4,"rt":String,"sn":"opArg0"},{"a":2,"n":"OpArg1","t":4,"rt":String,"sn":"opArg1"},{"a":2,"n":"OpCode","t":4,"rt":String,"sn":"opCode"}]}; });
    $m($n[2].IOpTask, function () { return {"att":161,"a":2,"m":[{"ab":true,"a":2,"n":"Run","t":8,"sn":"ApolloClr$IOpTask$run","rt":Object},{"ab":true,"a":2,"n":"BindFunc","t":16,"rt":Function,"g":{"ab":true,"a":2,"n":"get_BindFunc","t":8,"sn":"ApolloClr$IOpTask$getBindFunc","rt":Function},"s":{"ab":true,"a":1,"n":"set_BindFunc","t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"ApolloClr$IOpTask$setBindFunc","rt":Object,"p":[Function]}},{"ab":true,"a":2,"n":"Dump","t":16,"rt":$n[1].Int32,"g":{"ab":true,"a":2,"n":"get_Dump","t":8,"sn":"ApolloClr$IOpTask$getDump","rt":$n[1].Int32},"s":{"ab":true,"a":2,"n":"set_Dump","t":8,"pi":[{"n":"value","pt":$n[1].Int32,"ps":0}],"sn":"ApolloClr$IOpTask$setDump","rt":Object,"p":[$n[1].Int32]}},{"ab":true,"a":2,"n":"Method","t":16,"rt":Object,"g":{"ab":true,"a":2,"n":"get_Method","t":8,"sn":"ApolloClr$IOpTask$getMethod","rt":Object},"s":{"ab":true,"a":2,"n":"set_Method","t":8,"pi":[{"n":"value","pt":Object,"ps":0}],"sn":"ApolloClr$IOpTask$setMethod","rt":Object,"p":[Object]}},{"ab":true,"a":2,"n":"OpCode","t":16,"rt":$n[2].ILCode,"g":{"ab":true,"a":2,"n":"get_OpCode","t":8,"sn":"ApolloClr$IOpTask$getOpCode","rt":$n[2].ILCode},"s":{"ab":true,"a":2,"n":"set_OpCode","t":8,"pi":[{"n":"value","pt":$n[2].ILCode,"ps":0}],"sn":"ApolloClr$IOpTask$setOpCode","rt":Object,"p":[$n[2].ILCode]}}]}; });
    $m($n[2].MethodTasks, function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"ArgsFix","is":true,"t":8,"pi":[{"n":"values","pt":$n[1].Array.type(String),"ps":0},{"n":"methodInfo","pt":$n[0].MethodInfo,"ps":1},{"n":"list","pt":$n[3].List$1(ApolloClr.ILCode),"ps":2}],"sn":"argsFix","rt":$n[1].Array.type(Object),"p":[$n[1].Array.type(String),$n[0].MethodInfo,$n[3].List$1(ApolloClr.ILCode)]},{"a":2,"n":"Build","is":true,"t":8,"pi":[{"n":"codes","pt":String,"ps":0}],"sn":"build$1","rt":$n[2].MethodTasks,"p":[String]},{"a":2,"n":"Build","is":true,"t":8,"pi":[{"n":"list","pt":$n[3].List$1(ApolloClr.ILCode),"ps":0},{"n":"localvars","dv":null,"o":true,"pt":$n[3].Dictionary$2(String,String),"ps":1},{"n":"pargrams","dv":null,"o":true,"pt":$n[3].Dictionary$2(String,String),"ps":2},{"n":"haseResult","dv":true,"o":true,"pt":Boolean,"ps":3},{"n":"maxstack","dv":5,"o":true,"pt":$n[1].Int32,"ps":4}],"tpc":1,"tprm":["T"],"sn":"build","rt":Object,"p":[$n[3].List$1(ApolloClr.ILCode),$n[3].Dictionary$2(String,String),$n[3].Dictionary$2(String,String),Boolean,$n[1].Int32]},{"v":true,"a":2,"n":"Clone","t":8,"sn":"clone","rt":$n[2].MethodTasks},{"v":true,"a":3,"n":"CloneOne","t":8,"sn":"cloneOne","rt":$n[2].MethodTasks},{"a":2,"n":"Compile","t":8,"pi":[{"n":"OnCallAction","dv":null,"o":true,"pt":Function,"ps":0},{"n":"OnNewAction","dv":null,"o":true,"pt":Function,"ps":1}],"sn":"compile","rt":$n[2].MethodTasks,"p":[Function,Function]},{"a":2,"n":"Convert","is":true,"t":8,"pi":[{"n":"type","pt":Function,"ps":0},{"n":"input","pt":String,"ps":1},{"n":"list","pt":$n[3].List$1(ApolloClr.ILCode),"ps":2}],"sn":"convert","rt":Object,"p":[Function,String,$n[3].List$1(ApolloClr.ILCode)]},{"a":2,"n":"FindMethod","is":true,"t":8,"pi":[{"n":"name","pt":String,"ps":0}],"sn":"findMethod","rt":$n[0].MethodInfo,"p":[String]},{"a":2,"n":"FindMethod1","is":true,"t":8,"pi":[{"n":"name","pt":String,"ps":0}],"sn":"findMethod1","rt":$n[0].MethodInfo,"p":[String]},{"v":true,"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"a":2,"n":"ThrowAction","t":8,"pi":[{"n":"ex","pt":Object,"ps":0},{"n":"pc","pt":$n[1].Int32,"ps":1}],"sn":"throwAction","rt":Object,"p":[Object,$n[1].Int32]},{"v":true,"a":2,"n":"Name","t":16,"rt":String,"g":{"v":true,"a":2,"n":"get_Name","t":8,"sn":"getName","rt":String},"s":{"v":true,"a":2,"n":"set_Name","t":8,"pi":[{"n":"value","pt":String,"ps":0}],"sn":"setName","rt":Object,"p":[String]}},{"a":2,"n":"Clr","t":4,"rt":$n[2].Clr,"sn":"clr"},{"a":2,"n":"End","t":4,"rt":$n[1].Int32,"sn":"end"},{"a":2,"n":"IsCatched","t":4,"rt":Boolean,"sn":"isCatched"},{"a":2,"n":"IsEnd","t":4,"rt":Boolean,"sn":"isEnd"},{"a":2,"n":"Lines","t":4,"rt":System.Array.type(ApolloClr.IOpTask),"sn":"lines"},{"a":2,"n":"PC","t":4,"rt":$n[1].Int32,"sn":"PC"},{"a":1,"n":"SubTask","t":4,"rt":$n[3].List$1(ApolloClr.MethodTasks),"sn":"subTask"},{"a":2,"n":"TaskList","t":4,"rt":$n[3].List$1(ApolloClr.IOpTask),"sn":"taskList"},{"a":2,"n":"TrowException","t":4,"rt":$n[1].Exception,"sn":"trowException"}]}; });
    $m($n[8].App, function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Main","is":true,"t":8,"sn":"main","rt":Object},{"a":2,"n":"Run1","is":true,"t":8,"sn":"run1","rt":$n[1].Int32}]}; });
    $m($n[5].AssemblyDefine, function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"ReadAndRun","is":true,"t":8,"pi":[{"n":"fileName","pt":String,"ps":0},{"n":"type","pt":String,"ps":1},{"n":"method","pt":String,"ps":2}],"sn":"readAndRun","rt":Object,"p":[String,String,String]}]}; });
    $m($n[5].MethodDefine, function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"ov":true,"a":3,"n":"CloneOne","t":8,"sn":"cloneOne","rt":$n[2].MethodTasks},{"a":2,"n":"MethodDefinition","t":16,"rt":$n[4].DisassembledMethod,"g":{"a":2,"n":"get_MethodDefinition","t":8,"sn":"getMethodDefinition","rt":$n[4].DisassembledMethod},"s":{"a":2,"n":"set_MethodDefinition","t":8,"pi":[{"n":"value","pt":$n[4].DisassembledMethod,"ps":0}],"sn":"setMethodDefinition","rt":Object,"p":[$n[4].DisassembledMethod]}},{"ov":true,"a":2,"n":"Name","t":16,"rt":String,"g":{"ov":true,"a":2,"n":"get_Name","t":8,"sn":"getName","rt":String},"s":{"ov":true,"a":2,"n":"set_Name","t":8,"pi":[{"n":"value","pt":String,"ps":0}],"sn":"setName","rt":Object,"p":[String]}},{"a":2,"n":"TypeDefine","t":16,"rt":$n[5].TypeDefine,"g":{"a":2,"n":"get_TypeDefine","t":8,"sn":"getTypeDefine","rt":$n[5].TypeDefine},"s":{"a":2,"n":"set_TypeDefine","t":8,"pi":[{"n":"value","pt":$n[5].TypeDefine,"ps":0}],"sn":"setTypeDefine","rt":Object,"p":[$n[5].TypeDefine]}},{"a":1,"n":"Codes","t":4,"rt":$n[3].List$1(ApolloClr.ILCode),"sn":"codes"}]}; });
    $m($n[5].TypeDefine, function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"p":[$n[4].DisassembledClass],"pi":[{"n":"inputType","pt":$n[4].DisassembledClass,"ps":0}],"sn":"ctor"},{"a":2,"n":"Compile","t":8,"sn":"compile","rt":$n[5].TypeDefine},{"a":2,"n":"MethodCompile","t":8,"pi":[{"n":"r","pt":$n[2].IOpTask,"ps":0}],"sn":"methodCompile","rt":Object,"p":[$n[2].IOpTask]},{"a":2,"n":"NewCompile","t":8,"pi":[{"n":"r","pt":$n[2].IOpTask,"ps":0}],"sn":"newCompile","rt":Object,"p":[$n[2].IOpTask]},{"a":2,"n":"Methods","t":16,"rt":$n[3].List$1(ApolloClr.TypeDefine.MethodDefine),"g":{"a":2,"n":"get_Methods","t":8,"sn":"getMethods","rt":$n[3].List$1(ApolloClr.TypeDefine.MethodDefine)},"s":{"a":2,"n":"set_Methods","t":8,"pi":[{"n":"value","pt":$n[3].List$1(ApolloClr.TypeDefine.MethodDefine),"ps":0}],"sn":"setMethods","rt":Object,"p":[$n[3].List$1(ApolloClr.TypeDefine.MethodDefine)]}},{"a":2,"n":"TypeDefinition","t":16,"rt":$n[4].DisassembledClass,"g":{"a":2,"n":"get_TypeDefinition","t":8,"sn":"getTypeDefinition","rt":$n[4].DisassembledClass},"s":{"a":2,"n":"set_TypeDefinition","t":8,"pi":[{"n":"value","pt":$n[4].DisassembledClass,"ps":0}],"sn":"setTypeDefinition","rt":Object,"p":[$n[4].DisassembledClass]}},{"a":1,"n":"__Property__Initializer__Methods","t":4,"rt":$n[3].List$1(ApolloClr.TypeDefine.MethodDefine),"sn":"__Property__Initializer__Methods"}]}; });
    $m($n[9].ILCodeParse, function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"FixTryCatchFinally","is":true,"t":8,"pi":[{"n":"input","pt":$n[3].List$1(ApolloClr.ILCode),"ps":0}],"sn":"fixTryCatchFinally","rt":$n[3].List$1(ApolloClr.ILCode),"p":[$n[3].List$1(ApolloClr.ILCode)]},{"a":2,"n":"MergeCodes","is":true,"t":8,"pi":[{"n":"input","pt":$n[3].List$1(ApolloClr.ILCode),"ps":0},{"n":"locals","dv":null,"o":true,"pt":$n[3].List$1(String),"ps":1},{"n":"args","dv":null,"o":true,"pt":$n[3].List$1(String),"ps":2}],"sn":"mergeCodes","rt":$n[3].List$1(ApolloClr.ILCode),"p":[$n[3].List$1(ApolloClr.ILCode),$n[3].List$1(String),$n[3].List$1(String)]},{"a":2,"n":"ReadILCodes","is":true,"t":8,"pi":[{"n":"ilcodes","pt":String,"ps":0},{"n":"locals","dv":null,"o":true,"pt":$n[3].List$1(String),"ps":1},{"n":"args","dv":null,"o":true,"pt":$n[3].List$1(String),"ps":2}],"sn":"readILCodes","rt":$n[3].List$1(ApolloClr.ILCode),"p":[String,$n[3].List$1(String),$n[3].List$1(String)]},{"a":2,"n":"ReadILCodes","is":true,"t":8,"pi":[{"n":"lines","pt":$n[1].Array.type(String),"ps":0},{"n":"locals","dv":null,"o":true,"pt":$n[3].List$1(String),"ps":1},{"n":"args","dv":null,"o":true,"pt":$n[3].List$1(String),"ps":2}],"sn":"readILCodes$1","rt":$n[3].List$1(ApolloClr.ILCode),"p":[$n[1].Array.type(String),$n[3].List$1(String),$n[3].List$1(String)]}]}; });
    $m($n[10].BaseOpTask, function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"ov":true,"a":2,"n":"ToString","t":8,"sn":"toString","rt":String},{"a":2,"n":"Dump","t":16,"rt":$n[1].Int32,"g":{"a":2,"n":"get_Dump","t":8,"sn":"getDump","rt":$n[1].Int32},"s":{"a":2,"n":"set_Dump","t":8,"pi":[{"n":"value","pt":$n[1].Int32,"ps":0}],"sn":"setDump","rt":Object,"p":[$n[1].Int32]}},{"a":2,"n":"Method","t":16,"rt":Object,"g":{"a":2,"n":"get_Method","t":8,"sn":"getMethod","rt":Object},"s":{"a":2,"n":"set_Method","t":8,"pi":[{"n":"value","pt":Object,"ps":0}],"sn":"setMethod","rt":Object,"p":[Object]}},{"a":2,"n":"OpCode","t":16,"rt":$n[2].ILCode,"g":{"a":2,"n":"get_OpCode","t":8,"sn":"getOpCode","rt":$n[2].ILCode},"s":{"a":2,"n":"set_OpCode","t":8,"pi":[{"n":"value","pt":$n[2].ILCode,"ps":0}],"sn":"setOpCode","rt":Object,"p":[$n[2].ILCode]}}]}; });
    $m($n[10].OpCodeTask$3, function (TV1, TV2, TV3) { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"a":2,"n":"BindFunc","t":16,"rt":Function,"g":{"a":2,"n":"get_BindFunc","t":8,"sn":"getBindFunc","rt":Function}},{"a":2,"n":"Func","t":4,"rt":Function,"sn":"func"},{"a":2,"n":"V1","t":4,"rt":TV1,"sn":"V1"},{"a":2,"n":"V2","t":4,"rt":TV2,"sn":"V2"},{"a":2,"n":"V3","t":4,"rt":TV3,"sn":"V3"}]}; });
    $m($n[10].OpCodeTask$2, function (TV1, TV2) { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"a":2,"n":"BindFunc","t":16,"rt":Function,"g":{"a":2,"n":"get_BindFunc","t":8,"sn":"getBindFunc","rt":Function}},{"a":2,"n":"Func","t":4,"rt":Function,"sn":"func"},{"a":2,"n":"V1","t":4,"rt":TV1,"sn":"V1"},{"a":2,"n":"V2","t":4,"rt":TV2,"sn":"V2"}]}; });
    $m($n[10].OpCodeTask$1, function (TV1) { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"a":2,"n":"BindFunc","t":16,"rt":Function,"g":{"a":2,"n":"get_BindFunc","t":8,"sn":"getBindFunc","rt":Function}},{"a":2,"n":"Func","t":4,"rt":Function,"sn":"func"},{"a":2,"n":"V1","t":4,"rt":TV1,"sn":"V1"}]}; });
    $m($n[10].OpCodeTask, function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"a":2,"n":"BindFunc","t":16,"rt":Function,"g":{"a":2,"n":"get_BindFunc","t":8,"sn":"getBindFunc","rt":Function}},{"a":2,"n":"Func","t":4,"rt":Function,"sn":"func"}]}; });
    $m(Function, function (T) { return {"att":257,"a":2}; });
    $m(Function, function (T1, T2) { return {"att":257,"a":2}; });
    $m(Function, function (T1, T2, T3) { return {"att":257,"a":2}; });
    $m($n[10].OpCodeTaskRef$3, function (TV1, TV2, TV3) { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"a":2,"n":"BindFunc","t":16,"rt":Function,"g":{"a":2,"n":"get_BindFunc","t":8,"sn":"getBindFunc","rt":Function}},{"a":2,"n":"Func","t":4,"rt":Function,"sn":"func"},{"a":2,"n":"V1","t":4,"rt":TV1,"sn":"V1"},{"a":2,"n":"V2","t":4,"rt":TV2,"sn":"V2"},{"a":2,"n":"V3","t":4,"rt":TV3,"sn":"V3"}]}; });
    $m($n[10].OpCodeTaskRef$2, function (TV1, TV2) { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"a":2,"n":"BindFunc","t":16,"rt":Function,"g":{"a":2,"n":"get_BindFunc","t":8,"sn":"getBindFunc","rt":Function}},{"a":2,"n":"Func","t":4,"rt":Function,"sn":"func"},{"a":2,"n":"V1","t":4,"rt":TV1,"sn":"V1"},{"a":2,"n":"V2","t":4,"rt":TV2,"sn":"V2"}]}; });
    $m($n[10].OpCodeTaskRef$1, function (TV1) { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"a":2,"n":"BindFunc","t":16,"rt":Function,"g":{"a":2,"n":"get_BindFunc","t":8,"sn":"getBindFunc","rt":Function}},{"a":2,"n":"Func","t":4,"rt":Function,"sn":"func"},{"a":2,"n":"V1","t":4,"rt":TV1,"sn":"V1"}]}; });
    $m($n[10].OpCodeTaskT$3, function (TV1, TV2, TV3) { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"a":2,"n":"BindFunc","t":16,"rt":Function,"g":{"a":2,"n":"get_BindFunc","t":8,"sn":"getBindFunc","rt":Function}},{"a":2,"n":"Func","t":4,"rt":Function,"sn":"func"},{"a":2,"n":"V1","t":4,"rt":TV1,"sn":"V1"},{"a":2,"n":"V2","t":4,"rt":TV2,"sn":"V2"},{"a":2,"n":"V3","t":4,"rt":TV3,"sn":"V3"}]}; });
    $m($n[10].OpCodeTaskT$2, function (TV1, TV2) { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"a":2,"n":"BindFunc","t":16,"rt":Function,"g":{"a":2,"n":"get_BindFunc","t":8,"sn":"getBindFunc","rt":Function}},{"a":2,"n":"Func","t":4,"rt":Function,"sn":"func"},{"a":2,"n":"V1","t":4,"rt":TV1,"sn":"V1"},{"a":2,"n":"V2","t":4,"rt":TV2,"sn":"V2"}]}; });
    $m($n[10].OpCodeTaskT$1, function (TV1) { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"a":2,"n":"BindFunc","t":16,"rt":Function,"g":{"a":2,"n":"get_BindFunc","t":8,"sn":"getBindFunc","rt":Function}},{"a":2,"n":"Func","t":4,"rt":Function,"sn":"func"},{"a":2,"n":"V1","t":4,"rt":TV1,"sn":"V1"}]}; });
    $m($n[6].BaseCrossMethodDelegate, function () { return {"att":1048705,"a":2,"m":[{"a":3,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"ab":true,"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"ab":true,"a":2,"n":"SetArgs","t":8,"pi":[{"n":"values","pt":$n[1].Array.type(Object),"ps":0}],"sn":"setArgs","rt":Object,"p":[$n[1].Array.type(Object)]},{"ab":true,"a":2,"n":"Delegate","t":16,"rt":Function,"g":{"ab":true,"a":2,"n":"get_Delegate","t":8,"sn":"getDelegate","rt":Function}},{"a":2,"n":"Instance","t":16,"rt":Object,"g":{"a":2,"n":"get_Instance","t":8,"sn":"getInstance","rt":Object},"s":{"a":2,"n":"set_Instance","t":8,"pi":[{"n":"value","pt":Object,"ps":0}],"sn":"setInstance","rt":Object,"p":[Object]}},{"a":2,"n":"Ptr","t":16,"rt":$n[2].StackObject,"g":{"a":2,"n":"get_Ptr","t":8,"sn":"getPtr","rt":$n[2].StackObject},"s":{"a":2,"n":"set_Ptr","t":8,"pi":[{"n":"value","pt":$n[2].StackObject,"ps":0}],"sn":"setPtr","rt":Object,"p":[$n[2].StackObject]}},{"a":2,"n":"Result","t":16,"rt":Object,"g":{"a":2,"n":"get_Result","t":8,"sn":"getResult","rt":Object},"s":{"a":2,"n":"set_Result","t":8,"pi":[{"n":"value","pt":Object,"ps":0}],"sn":"setResult","rt":Object,"p":[Object]}}]}; });
    $m($n[6].CrossDomain, function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Build","is":true,"t":8,"pi":[{"n":"callname","pt":String,"ps":0}],"sn":"build","rt":$n[6].CrossMethod,"p":[String]},{"a":1,"n":"Methods","is":true,"t":4,"rt":$n[3].Dictionary$2(String,ApolloClr.Cross.CrossMethod),"sn":"methods"}]}; });
    $m($n[6].CrossMethod, function () { return {"att":1048577,"a":2,"m":[{"a":2,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":".ctor","t":1,"p":[String],"pi":[{"n":"callname","pt":String,"ps":0}],"sn":"$ctor1"},{"a":2,"n":"CreatDelegate","t":8,"pi":[{"n":"methodInfo","pt":$n[0].ConstructorInfo,"ps":0}],"sn":"creatDelegate","rt":Object,"p":[$n[0].ConstructorInfo]},{"a":2,"n":"CreatDelegate","t":8,"pi":[{"n":"methodInfo","pt":$n[0].MethodInfo,"ps":0}],"sn":"creatDelegate$1","rt":Object,"p":[$n[0].MethodInfo]},{"ov":true,"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"a":2,"n":"CallName","t":16,"rt":String,"g":{"a":2,"n":"get_CallName","t":8,"sn":"getCallName","rt":String},"s":{"a":2,"n":"set_CallName","t":8,"pi":[{"n":"value","pt":String,"ps":0}],"sn":"setCallName","rt":Object,"p":[String]}},{"a":2,"n":"CrossMethodDelegate","t":16,"rt":$n[6].ICrossMethodDelegate,"g":{"a":2,"n":"get_CrossMethodDelegate","t":8,"sn":"getCrossMethodDelegate","rt":$n[6].ICrossMethodDelegate},"s":{"a":2,"n":"set_CrossMethodDelegate","t":8,"pi":[{"n":"value","pt":$n[6].ICrossMethodDelegate,"ps":0}],"sn":"setCrossMethodDelegate","rt":Object,"p":[$n[6].ICrossMethodDelegate]}},{"a":1,"n":"ArgCount","t":4,"rt":$n[1].Int32,"sn":"argCount"},{"a":1,"n":"HaseResult","t":4,"rt":Boolean,"sn":"haseResult"},{"a":1,"n":"IsStatic","t":4,"rt":Boolean,"sn":"isStatic"}]}; });
    $m($n[6].CrossMethodDelegate$3, function (T1, T2, T3) { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"}]}; });
    $m($n[6].CrossMethodDelegate$2, function (T1, T2) { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"}]}; });
    $m($n[6].CrossMethodDelegate$1, function (T) { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"ov":true,"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"ov":true,"a":2,"n":"SetArgs","t":8,"pi":[{"n":"values","pt":$n[1].Array.type(Object),"ps":0}],"sn":"setArgs","rt":Object,"p":[$n[1].Array.type(Object)]},{"ov":true,"a":2,"n":"Delegate","t":16,"rt":Function,"g":{"ov":true,"a":2,"n":"get_Delegate","t":8,"sn":"getDelegate","rt":Function}},{"a":2,"n":"Func","t":4,"rt":Function,"sn":"func"},{"a":2,"n":"V1","t":4,"rt":T,"sn":"V1"}]}; });
    $m($n[6].CrossMethodDelegate, function () { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"ov":true,"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"ov":true,"a":2,"n":"SetArgs","t":8,"pi":[{"n":"values","pt":$n[1].Array.type(Object),"ps":0}],"sn":"setArgs","rt":Object,"p":[$n[1].Array.type(Object)]},{"ov":true,"a":2,"n":"Delegate","t":16,"rt":Function,"g":{"ov":true,"a":2,"n":"get_Delegate","t":8,"sn":"getDelegate","rt":Function}},{"a":2,"n":"Func","t":4,"rt":Function,"sn":"func"}]}; });
    $m($n[6].CrossMethodDelegateRet$1, function (T) { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"ov":true,"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"ov":true,"a":2,"n":"SetArgs","t":8,"pi":[{"n":"values","pt":$n[1].Array.type(Object),"ps":0}],"sn":"setArgs","rt":Object,"p":[$n[1].Array.type(Object)]},{"ov":true,"a":2,"n":"Delegate","t":16,"rt":Function,"g":{"ov":true,"a":2,"n":"get_Delegate","t":8,"sn":"getDelegate","rt":Function}},{"a":2,"n":"Func","t":4,"rt":Function,"sn":"func"}]}; });
    $m($n[6].ICrossMethodDelegate, function () { return {"att":161,"a":2,"m":[{"ab":true,"a":2,"n":"Run","t":8,"sn":"ApolloClr$Cross$ICrossMethodDelegate$run","rt":Object},{"ab":true,"a":2,"n":"SetArgs","t":8,"pi":[{"n":"values","pt":$n[1].Array.type(Object),"ps":0}],"sn":"ApolloClr$Cross$ICrossMethodDelegate$setArgs","rt":Object,"p":[$n[1].Array.type(Object)]},{"ab":true,"a":2,"n":"Delegate","t":16,"rt":Function,"g":{"ab":true,"a":2,"n":"get_Delegate","t":8,"sn":"ApolloClr$Cross$ICrossMethodDelegate$getDelegate","rt":Function},"s":{"ab":true,"a":1,"n":"set_Delegate","t":8,"pi":[{"n":"value","pt":Function,"ps":0}],"sn":"ApolloClr$Cross$ICrossMethodDelegate$setDelegate","rt":Object,"p":[Function]}},{"ab":true,"a":2,"n":"Ptr","t":16,"rt":$n[2].StackObject,"g":{"ab":true,"a":2,"n":"get_Ptr","t":8,"sn":"ApolloClr$Cross$ICrossMethodDelegate$getPtr","rt":$n[2].StackObject},"s":{"ab":true,"a":2,"n":"set_Ptr","t":8,"pi":[{"n":"value","pt":$n[2].StackObject,"ps":0}],"sn":"ApolloClr$Cross$ICrossMethodDelegate$setPtr","rt":Object,"p":[$n[2].StackObject]}},{"ab":true,"a":2,"n":"Result","t":16,"rt":Object,"g":{"ab":true,"a":2,"n":"get_Result","t":8,"sn":"ApolloClr$Cross$ICrossMethodDelegate$getResult","rt":Object},"s":{"ab":true,"a":1,"n":"set_Result","t":8,"pi":[{"n":"value","pt":Object,"ps":0}],"sn":"ApolloClr$Cross$ICrossMethodDelegate$setResult","rt":Object,"p":[Object]}}]}; });
    $m($n[6].ObjectBuild$1, function (T) { return {"att":1048577,"a":2,"m":[{"a":2,"isSynthetic":true,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Make","t":8,"sn":"make","rt":T},{"ov":true,"a":2,"n":"Run","t":8,"sn":"run","rt":Object},{"ov":true,"a":2,"n":"SetArgs","t":8,"pi":[{"n":"values","pt":$n[1].Array.type(Object),"ps":0}],"sn":"setArgs","rt":Object,"p":[$n[1].Array.type(Object)]},{"ov":true,"a":2,"n":"Delegate","t":16,"rt":Function,"g":{"ov":true,"a":2,"n":"get_Delegate","t":8,"sn":"getDelegate","rt":Function}}]}; });
    $m(console, function () { return {"att":1048833,"a":2,"m":[{"a":2,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"Clear","is":true,"t":8,"sn":"clear","rt":Object},{"a":2,"n":"Read","is":true,"t":8,"tpc":0,"def":function () { return prompt(); },"rt":String},{"a":2,"n":"ReadLine","is":true,"t":8,"tpc":0,"def":function () { return prompt(); },"rt":String},{"a":2,"n":"ReadLine","is":true,"t":8,"pi":[{"n":"text","pt":String,"ps":0}],"tpc":0,"def":function (text) { return prompt(text); },"rt":String,"p":[String]},{"a":2,"n":"ReadLine","is":true,"t":8,"pi":[{"n":"text","pt":String,"ps":0},{"n":"value","pt":String,"ps":1}],"tpc":0,"def":function (text, value) { return prompt(text, value); },"rt":String,"p":[String,String]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"value","pt":Boolean,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value); },"rt":Object,"p":[Boolean]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].Char,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(String.fromCharCode(value)); },"rt":Object,"p":[$n[1].Char]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"buffer","pt":$n[1].Array.type(System.Char),"ps":0}],"sn":"write","rt":Object,"p":[$n[1].Array.type(System.Char)]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].Decimal,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value.toString()); },"rt":Object,"p":[$n[1].Decimal]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].Double,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value); },"rt":Object,"p":[$n[1].Double]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].Int32,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value); },"rt":Object,"p":[$n[1].Int32]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].Int64,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value.toString()); },"rt":Object,"p":[$n[1].Int64]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"value","pt":Object,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value); },"rt":Object,"p":[Object]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].Single,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value); },"rt":Object,"p":[$n[1].Single]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"value","pt":String,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value); },"rt":Object,"p":[String]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].UInt32,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value); },"rt":Object,"p":[$n[1].UInt32]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].UInt64,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value.toString()); },"rt":Object,"p":[$n[1].UInt64]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"format","pt":String,"ps":0},{"n":"arg0","pt":Object,"ps":1}],"tpc":0,"def":function (format, arg0) { return Bridge.Console.log(System.String.format(format, arg0)); },"rt":Object,"p":[String,Object]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"format","pt":String,"ps":0},{"n":"arg","ip":true,"pt":$n[1].Array.type(Object),"ps":1}],"tpc":0,"def":function (format, arg) { return Bridge.Console.log(System.String.format(format, arg)); },"rt":Object,"p":[String,$n[1].Array.type(Object)]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"format","pt":String,"ps":0},{"n":"arg0","pt":Object,"ps":1},{"n":"arg1","pt":Object,"ps":2}],"tpc":0,"def":function (format, arg0, arg1) { return Bridge.Console.log(System.String.format(format, arg0, arg1)); },"rt":Object,"p":[String,Object,Object]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"format","pt":String,"ps":0},{"n":"arg0","pt":Object,"ps":1},{"n":"arg1","pt":Object,"ps":2},{"n":"arg2","pt":Object,"ps":3}],"tpc":0,"def":function (format, arg0, arg1, arg2) { return Bridge.Console.log(System.String.format(format, arg0, arg1, arg2)); },"rt":Object,"p":[String,Object,Object,Object]},{"a":2,"n":"Write","is":true,"t":8,"pi":[{"n":"format","pt":String,"ps":0},{"n":"arg0","pt":Object,"ps":1},{"n":"arg1","pt":Object,"ps":2},{"n":"arg2","pt":Object,"ps":3},{"n":"arg3","pt":Object,"ps":4}],"tpc":0,"def":function (format, arg0, arg1, arg2, arg3) { return Bridge.Console.log(System.String.format(format, arg0, arg1, arg2, arg3)); },"rt":Object,"p":[String,Object,Object,Object,Object]},{"a":2,"n":"WriteLine","is":true,"t":8,"tpc":0,"def":function () { return Bridge.Console.log(); },"rt":Object},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"value","pt":Boolean,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value); },"rt":Object,"p":[Boolean]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].Char,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(String.fromCharCode(value)); },"rt":Object,"p":[$n[1].Char]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"buffer","pt":$n[1].Array.type(System.Char),"ps":0}],"sn":"writeLine","rt":Object,"p":[$n[1].Array.type(System.Char)]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].Decimal,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value.toString()); },"rt":Object,"p":[$n[1].Decimal]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].Double,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(System.Double.format(value)); },"rt":Object,"p":[$n[1].Double]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].Enum,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(System.Enum.toString(Bridge.getType(value), value)); },"rt":Object,"p":[$n[1].Enum]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].Int32,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value); },"rt":Object,"p":[$n[1].Int32]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].Int64,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value.toString()); },"rt":Object,"p":[$n[1].Int64]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].Nullable$1(System.Decimal),"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value && value.toString()); },"rt":Object,"p":[$n[1].Nullable$1(System.Decimal)]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].Nullable$1(System.Int64),"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value && value.toString()); },"rt":Object,"p":[$n[1].Nullable$1(System.Int64)]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].Nullable$1(System.UInt64),"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value && value.toString()); },"rt":Object,"p":[$n[1].Nullable$1(System.UInt64)]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"value","pt":Object,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value); },"rt":Object,"p":[Object]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].Single,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(System.Single.format(value)); },"rt":Object,"p":[$n[1].Single]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"value","pt":String,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value); },"rt":Object,"p":[String]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].UInt32,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value); },"rt":Object,"p":[$n[1].UInt32]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"value","pt":$n[1].UInt64,"ps":0}],"tpc":0,"def":function (value) { return Bridge.Console.log(value.toString()); },"rt":Object,"p":[$n[1].UInt64]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"format","pt":String,"ps":0},{"n":"arg0","pt":Object,"ps":1}],"tpc":0,"def":function (format, arg0) { return Bridge.Console.log(System.String.format(format, arg0)); },"rt":Object,"p":[String,Object]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"format","pt":String,"ps":0},{"n":"arg","ip":true,"pt":$n[1].Array.type(Object),"ps":1}],"tpc":0,"def":function (format, arg) { return Bridge.Console.log(System.String.format(format, arg)); },"rt":Object,"p":[String,$n[1].Array.type(Object)]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"format","pt":String,"ps":0},{"n":"arg0","pt":Object,"ps":1},{"n":"arg1","pt":Object,"ps":2}],"tpc":0,"def":function (format, arg0, arg1) { return Bridge.Console.log(System.String.format(format, arg0, arg1)); },"rt":Object,"p":[String,Object,Object]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"format","pt":String,"ps":0},{"n":"arg0","pt":Object,"ps":1},{"n":"arg1","pt":Object,"ps":2},{"n":"arg2","pt":Object,"ps":3}],"tpc":0,"def":function (format, arg0, arg1, arg2) { return Bridge.Console.log(System.String.format(format, arg0, arg1, arg2)); },"rt":Object,"p":[String,Object,Object,Object]},{"a":2,"n":"WriteLine","is":true,"t":8,"pi":[{"n":"format","pt":String,"ps":0},{"n":"arg0","pt":Object,"ps":1},{"n":"arg1","pt":Object,"ps":2},{"n":"arg2","pt":Object,"ps":3},{"n":"arg3","pt":Object,"ps":4}],"tpc":0,"def":function (format, arg0, arg1, arg2, arg3) { return Bridge.Console.log(System.String.format(format, arg0, arg1, arg2, arg3)); },"rt":Object,"p":[String,Object,Object,Object,Object]}]}; });
    $m(Function, function () { return {"att":1048577,"a":2,"m":[{"a":3,"n":".ctor","t":1,"sn":"ctor"},{"a":3,"n":".ctor","t":1,"p":[Object,String],"pi":[{"n":"target","pt":Object,"ps":0},{"n":"method","pt":String,"ps":1}],"sn":"ctor"},{"a":3,"n":".ctor","t":1,"p":[Function,String],"pi":[{"n":"target","pt":Function,"ps":0},{"n":"method","pt":String,"ps":1}],"sn":"ctor"},{"v":true,"a":2,"n":"Apply","t":8,"sn":"apply","rt":Object},{"v":true,"a":2,"n":"Apply","t":8,"pi":[{"n":"thisArg","pt":Object,"ps":0}],"sn":"apply","rt":Object,"p":[Object]},{"v":true,"a":2,"n":"Apply","t":8,"pi":[{"n":"thisArg","pt":Object,"ps":0},{"n":"args","pt":Array,"ps":1}],"sn":"apply","rt":Object,"p":[Object,Array]},{"v":true,"a":2,"n":"Call","t":8,"sn":"call","rt":Object},{"v":true,"a":2,"n":"Call","t":8,"pi":[{"n":"thisArg","pt":Object,"ps":0}],"sn":"call","rt":Object,"p":[Object]},{"v":true,"a":2,"n":"Call","t":8,"pi":[{"n":"thisArg","pt":Object,"ps":0},{"n":"args","ip":true,"pt":$n[1].Array.type(Object),"ps":1}],"sn":"call","rt":Object,"p":[Object,$n[1].Array.type(Object)]},{"a":2,"n":"Combine","is":true,"t":8,"pi":[{"n":"a","pt":Function,"ps":0},{"n":"b","pt":Function,"ps":1}],"tpc":0,"def":function (a, b) { return Bridge.fn.combine(a, b); },"rt":Function,"p":[Function,Function]},{"a":2,"n":"CreateDelegate","is":true,"t":8,"pi":[{"n":"type","pt":Function,"ps":0},{"n":"firstArgument","pt":Object,"ps":1},{"n":"method","pt":$n[0].MethodInfo,"ps":2}],"tpc":0,"def":function (type, firstArgument, method) { return Bridge.Reflection.midel(method, firstArgument); },"rt":Function,"p":[Function,Object,$n[0].MethodInfo]},{"a":2,"n":"Remove","is":true,"t":8,"pi":[{"n":"source","pt":Function,"ps":0},{"n":"value","pt":Function,"ps":1}],"tpc":0,"def":function (source, value) { return Bridge.fn.remove(source, value); },"rt":Function,"p":[Function,Function]},{"a":2,"n":"op_Equality","is":true,"t":8,"pi":[{"n":"a","pt":Function,"ps":0},{"n":"b","pt":Function,"ps":1}],"tpc":0,"def":function (a, b) { return Bridge.staticEquals(a, b); },"rt":Boolean,"p":[Function,Function]},{"a":2,"n":"op_Inequality","is":true,"t":8,"pi":[{"n":"a","pt":Function,"ps":0},{"n":"b","pt":Function,"ps":1}],"tpc":0,"def":function (a, b) { return !Bridge.staticEquals(a, b); },"rt":Boolean,"p":[Function,Function]},{"a":2,"n":"Length","t":16,"rt":$n[1].Int32,"g":{"a":2,"n":"get_Length","t":8,"tpc":0,"def":function () { return this.length; },"rt":$n[1].Int32}}]}; });
    $m($n[7].Stopwatch, function () { return {"att":1048577,"a":2,"m":[{"a":1,"n":".cctor","t":1,"sn":"ctor","sm":true},{"a":2,"n":".ctor","t":1,"sn":"ctor"},{"a":2,"n":"GetTimestamp","is":true,"t":8,"sn":"getTimestamp","rt":$n[1].Int64},{"a":2,"n":"Reset","t":8,"sn":"reset","rt":Object},{"a":2,"n":"Restart","t":8,"sn":"restart","rt":Object},{"a":2,"n":"Start","t":8,"sn":"start","rt":Object},{"a":2,"n":"StartNew","is":true,"t":8,"sn":"startNew","rt":$n[7].Stopwatch},{"a":2,"n":"Stop","t":8,"sn":"stop","rt":Object},{"a":2,"n":"Elapsed","t":16,"rt":$n[1].TimeSpan,"g":{"a":2,"n":"get_Elapsed","t":8,"sn":"timeSpan","rt":$n[1].TimeSpan}},{"a":2,"n":"ElapsedMilliseconds","t":16,"rt":$n[1].Int64,"g":{"a":2,"n":"get_ElapsedMilliseconds","t":8,"sn":"milliseconds","rt":$n[1].Int64}},{"a":2,"n":"ElapsedTicks","t":16,"rt":$n[1].Int64,"g":{"a":2,"n":"get_ElapsedTicks","t":8,"sn":"ticks","rt":$n[1].Int64}},{"a":2,"n":"IsRunning","t":16,"rt":Boolean,"g":{"a":2,"n":"get_IsRunning","t":8,"rt":Boolean,"fg":"isRunning"},"fn":"isRunning"},{"a":2,"n":"Frequency","is":true,"t":4,"rt":$n[1].Int64,"sn":"frequency","ro":true},{"a":2,"n":"IsHighResolution","is":true,"t":4,"rt":Boolean,"sn":"isHighResolution","ro":true}]}; });
});
