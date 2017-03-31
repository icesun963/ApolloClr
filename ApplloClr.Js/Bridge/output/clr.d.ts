/// <reference path="./bridge.d.ts" />

declare module ApolloClr {
    export interface BaseClrStack {
        reset(): void;
        push$1(obj: number): void;
        push(obj: ApolloClr.StackItem): void;
        pop(): ApolloClr.StackItem;
        pop$1(count: number): ApolloClr.StackItem;
        top(): ApolloClr.StackItem;
    }
    export interface BaseClrStackFunc extends Function {
        prototype: BaseClrStack;
        new (x: number): BaseClrStack;
    }
    var BaseClrStack: BaseClrStackFunc;

    export interface Clr {
        /**
         * ����ƨ���� ����λ��Ϊ ����
         ����=��ǰ�ֲ�����+����ֵ+��������
         *
         * @instance
         */
        callStack: ApolloClr.StackItem[];
        /**
         * ͷָ��
         *
         * @instance
         */
        csp: ApolloClr.StackItem;
        /**
         * ����ָ��
         *
         * @instance
         */
        argp: ApolloClr.StackItem;
        /**
         * ��ǰ�ķ���ֵ
         *
         * @instance
         */
        resultPoint: ApolloClr.StackItem;
        dumpAction: {(arg: number): void};
        throwAction: {(arg1: Object, arg2: number): void};
        localVarCount: number;
        argsVarCount: number;
        retResult: boolean;
        evaluationStack_Push(obj: ApolloClr.StackItem): void;
        evaluationStack_Push$2(obj: number): void;
        evaluationStack_Push$3(args: number[]): void;
        evaluationStack_Push$1(vtype: ApolloClr.StackValueType, value: Object): void;
        evaluationStack_Push$4(obj: Object): void;
        evaluationStack_Pop(): ApolloClr.StackItem;
        evaluationStack_Pop$1(count: number): ApolloClr.StackItem;
        /**
         * �Ƴ���ǰλ�ڼ����ջ������ֵ
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        pop(): void;
        /**
         * ���Ƽ����ջ�ϵ�ǰ��˵�ֵ
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        dup(): void;
        /**
         * �˳���ǰ����������ָ������
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        jmp(): void;
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
        ldarg(i: number): void;
        ldstr(str: string): void;
        ldnull(): void;
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
        ldc_i4(v: number): void;
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
        starg(i: number): void;
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
        ldc(vtype: {v: ApolloClr.StackValueType}, value: {v: Object}): void;
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
        ldloc(i: number): void;
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
        ldloc$1(args: number[]): void;
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
        ldloca(i: number): void;
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
        stloc(i: number): void;
        /**
         * ���ô�
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        nop(): void;
        reset(): void;
        /**
         * 将从零开始的、一维数组的元素的数目推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldlen(): void;
        /**
         * 将对新的从零开始的一维数组（其元素属于特定类型）的对象引用推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @param   {Function}    T       
         * @param   {Function}    type
         * @return  {void}
         */
        newarr<T>(T: {prototype: T}, type: Function): void;
        
        ldelema<T>(T: {prototype: T}, type: Function): void;
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
        ldelem(type: ApolloClr.StackValueType): void;
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
        stelem(type: ApolloClr.StackValueType): void;
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
        br(n1: string, n2: string, pc: number): void;
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
        brfalse(n1: string, n2: string, pc: number): void;
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
        brtrue(n1: string, n2: string, pc: number): void;
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
        beq(n1: string, n2: string, pc: number): void;
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
        bge(n1: string, n2: string, pc: number): void;
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
        bgt(n1: string, n2: string, pc: number): void;
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
        ble(n1: string, n2: string, pc: number): void;
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
        blt(n1: string, n2: string, pc: number): void;
        /**
         * 引发当前位于计算堆栈上的异常对象。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        throw(): void;
        /**
         * 再次引发当前异常。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        rethrow(): void;
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
        leave(i: number): void;
        _Try(spc: number, epc: number, pcs: number): void;
        catch(spc: number, epc: number): void;
        finally(spc: number, epc: number): void;
        /**
         * 将控制从异常块的 fault 或 finally 子句转移回公共语言结构 (CLI) 异常处理程序。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        endfinally(): void;
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
        copyToArgs(clr: ApolloClr.Clr): void;
        /**
         * 从当前方法返回，并将返回值（如果存在）从调用方的计算堆栈推送到被调用方的计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ret(): void;
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
        call(retType: string, method: string, task: ApolloClr.MethodTasks): void;
        /**
         * 向公共语言结构 (CLI) 发出信号以通知调试器已撞上了一个断点。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        break(): void;
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
        switch(pcs: number[]): void;
        /**
         * 通过调用约定描述的参数调用在计算堆栈上指示的方法（作为指向入口点的指针）。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        calli(): void;
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
        callvirt(instance: string, $return: string, task: ApolloClr.MethodTasks): void;
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
        newobj(instance: string, $return: string, task: ApolloClr.MethodTasks): void;
        
        cpobj(): void;
        /**
         * 将地址指向的值类型对象复制到计算堆栈的顶部。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldobj(): void;
        /**
         * 尝试将引用传递的对象转换为指定的类。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        castclass(): void;
        /**
         * 测试对象引用（O 类型）是否为特定类的实例。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        isinst(): void;
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
        unBox<T>(T: {prototype: T}, type: Function): void;
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
        unBox_Any<T>(T: {prototype: T}, type: Function): void;
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
        box<T>(T: {prototype: T}, type: Function): void;
        /**
         * 查找对象中其引用当前位于计算堆栈的字段的值。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldfld(): void;
        /**
         * 查找对象中其引用当前位于计算堆栈的字段的地址。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldflda(): void;
        /**
         * 用新值替换在对象引用或指针的字段中存储的值。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        stfld(): void;
        /**
         * 将静态字段的值推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldsfld(): void;
        /**
         * 将静态字段的地址推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldsflda(): void;
        /**
         * 用来自计算堆栈的值替换静态字段的值。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        stsfld(): void;
        /**
         * 将指定类型的值从计算堆栈复制到所提供的内存地址中。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        stobj(): void;
        
        refanyval(): void;
        /**
         * 如果值不是有限数，则引发 ArithmeticException。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ckfinite(): void;
        /**
         * 将对特定类型实例的类型化引用推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        mkrefany(): void;
        /**
         * 将元数据标记转换为其运行时表示形式，并将其推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldtoken(): void;
        /**
         * 返回指向当前方法的参数列表的非托管指针。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        arglist(): void;
        /**
         * 将指向实现特定方法的本机代码的非托管指针（native int 类型）推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldftn(): void;
        /**
         * 将指向实现与指定对象关联的特定虚方法的本机代码的非托管指针（native int 类型）推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ldvirtftn(): void;
        /**
         * 从本地动态内存池分配特定数目的字节并将第一个分配的字节的地址（瞬态指针，* 类型）推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        localloc(): void;
        /**
         * 将控制从异常的 filter 子句转移回公共语言结构 (CLI) 异常处理程序。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        endfilter(): void;
        /**
         * 指示当前位于计算堆栈上的地址可能没有与紧接的 ldind、stind、ldfld、stfld、ldobj、stobj、initblk 或 cpblk 指令的自然大小对齐。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        unaligned(): void;
        /**
         * 指定当前位于计算堆栈顶部的地址可以是易失的，并且读取该位置的结果不能被缓存，或者对该地址的多个存储区不能被取消。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        volatile(): void;
        /**
         * 执行后缀的方法调用指令，以便在执行实际调用指令前移除当前方法的堆栈帧。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        tail(): void;
        /**
         * 将位于指定地址的值类型的每个字段初始化为空引用或适当的基元类型的 0。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        initobj(): void;
        /**
         * 约束要对其进行虚方法调用的类型。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        constrained(): void;
        /**
         * 将指定数目的字节从源地址复制到目标地址。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        cpblk(): void;
        /**
         * 将位于特定地址的内存的指定块初始化为给定大小和初始值。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        initblk(): void;
        no(): void;
        /**
         * 将提供的值类型的大小（以字节为单位）推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        sizeof(): void;
        /**
         * 检索嵌入在类型化引用内的类型标记。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        refanytype(): void;
        /**
         * 指定后面的数组地址操作在运行时不执行类型检查，并且返回可变性受限的托管指针。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        readonly(): void;
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
        conv(type: ApolloClr.StackValueType): void;
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
        ldind(type: ApolloClr.StackValueType): void;
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
        stind(type: ApolloClr.StackValueType): void;
        /**
         * 将两个值相加并将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        add(): void;
        /**
         * 从其他值中减去一个值并将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        sub(): void;
        /**
         * 将两个值相乘并将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        mul(): void;
        /**
         * 将两个值相除并将结果作为浮点（F 类型）或商（int32 类型）推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        div(): void;
        /**
         * 将两个值相除并将余数推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        rem(): void;
        /**
         * 计算两个值的按位“与”并将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        and(): void;
        /**
         * 计算位于堆栈顶部的两个整数值的按位求补并将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        or(): void;
        /**
         * 计算位于计算堆栈顶部的两个值的按位异或，并且将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        xor(): void;
        /**
         * 将整数值左移（用零填充）指定的位数，并将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        shl(): void;
        /**
         * 将整数值右移（保留符号）指定的位数，并将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        shr(): void;
        /**
         * 对一个值执行求反并将结果推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        neg(): void;
        /**
         * 计算堆栈顶部整数值的按位求补并将结果作为相同的类型推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        not(): void;
        /**
         * 比较两个值。如果这两个值相等，则将整数值 1 (int32) 推送到计算堆栈上；否则，将 0 (int32) 推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        ceq(): void;
        /**
         * 比较两个值。如果第一个值大于第二个值，则将整数值 1 (int32) 推送到计算堆栈上；反之，将 0 (int32) 推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        cgt(): void;
        /**
         * 比较两个值。如果第一个值小于第二个值，则将整数值 1 (int32) 推送到计算堆栈上；反之，将 0 (int32) 推送到计算堆栈上。
         *
         * @instance
         * @public
         * @this ApolloClr.Clr
         * @memberof ApolloClr.Clr
         * @return  {void}
         */
        clt(): void;
    }
    export interface ClrFunc extends Function {
        prototype: Clr;
        new (localCount: number, argCount: number, haseResult: boolean, maxStack: number): Clr;
    }
    var Clr: ClrFunc;

    export interface MethodTasks {
        clr: ApolloClr.Clr;
        taskList: System.Collections.Generic.List$1<ApolloClr.IOpTask>;
        lines: ApolloClr.IOpTask[];
        PC: number;
        end: number;
        isEnd: boolean;
        trowException: System.Exception;
        isCatched: boolean;
        getName(): string;
        setName(value: string): void;
        compile(OnCallAction?: {(arg: ApolloClr.IOpTask): void}, OnNewAction?: {(arg: ApolloClr.IOpTask): void}): ApolloClr.MethodTasks;
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
        throwAction(ex: Object, pc: number): void;
        clone(): ApolloClr.MethodTasks;
        cloneOne(): ApolloClr.MethodTasks;
        run(): void;
    }
    export interface MethodTasksFunc extends Function {
        prototype: MethodTasks;
        new (): MethodTasks;
        build$1(codes: string): ApolloClr.MethodTasks;
        build<T>(T: {prototype: T}, list: System.Collections.Generic.List$1<ApolloClr.ILCode>, localvars?: System.Collections.Generic.Dictionary$2<string,string>, pargrams?: System.Collections.Generic.Dictionary$2<string,string>, haseResult?: boolean, maxstack?: number): T;
        argsFix(values: string[], methodInfo: System.Reflection.MethodInfo, list: System.Collections.Generic.List$1<ApolloClr.ILCode>): Object[];
        convert(type: Function, input: string, list: System.Collections.Generic.List$1<ApolloClr.ILCode>): Object;
        findMethod1(name: string): System.Reflection.MethodInfo;
        findMethod(name: string): System.Reflection.MethodInfo;
    }
    var MethodTasks: MethodTasksFunc;

    export interface Extensions {
    }
    export interface ExtensionsFunc extends Function {
        prototype: Extensions;
        new (): Extensions;
        setTarget(delegate: Function, target: Object): void;
        getFSet(field: System.Reflection.FieldInfo): {(arg1: Object, arg2: Object): void};
        getValueFromStr(str: string, vtype: ApolloClr.StackValueType): Object;
        getTypeByName(name: string): Function;
    }
    var Extensions: ExtensionsFunc;

    export interface ILCode {
        lable: string;
        opCode: string;
        op: string;
        opArg0: string;
        opArg1: string;
        arg0: string;
        arg1: string;
        arg2: string;
        line: string;
        toString(): string;
    }
    export interface ILCodeFunc extends Function {
        prototype: ILCode;
        new (): ILCode;
    }
    var ILCode: ILCodeFunc;

    export interface IOpTask {
        ApolloClr$IOpTask$getBindFunc(): Function;
        ApolloClr$IOpTask$setBindFunc(value: Function): void;
        ApolloClr$IOpTask$getDump(): number;
        ApolloClr$IOpTask$setDump(value: number): void;
        ApolloClr$IOpTask$getOpCode(): ApolloClr.ILCode;
        ApolloClr$IOpTask$setOpCode(value: ApolloClr.ILCode): void;
        ApolloClr$IOpTask$getMethod(): Object;
        ApolloClr$IOpTask$setMethod(value: Object): void;
        run(): void;
    }
    var IOpTask: Function;

    export enum StackValueType {
        i4 = 0,
        i8 = 1,
        r4 = 2,
        r8 = 3,
        i1 = 4,
        i2 = 5,
        u1 = 6,
        u2 = 7,
        u4 = 8,
        u8 = 9,
        I = 10,
        Ref = 11,
        Any = 12,
        Array = 13
    }

    /** @namespace ApolloClr */

    /**
     * ����ָ��
     *
     * @public
     * @class ApolloClr.StackObject
     */
    export interface StackObject {
        /**
         * ָ��Ķ���
         *
         * @instance
         */
        object: Object;
    }
    export interface StackObjectFunc extends Function {
        prototype: StackObject;
        new (): StackObject;
        newObject(obj: Object): ApolloClr.StackObject;
        getStackObject(prt: Object): ApolloClr.StackObject;
        toObject(stackItem: ApolloClr.StackItem): Object;
        op_Implicit(ptr: ApolloClr.StackItem): ApolloClr.StackObject;
        op_Implicit$1(ptr: number): ApolloClr.StackObject;
    }
    var StackObject: StackObjectFunc;

    export enum OpCodeEnum {
        Nop = 0,
        Break = 1,
        Ldarg_0 = 2,
        Ldarg_1 = 3,
        Ldarg_2 = 4,
        Ldarg_3 = 5,
        Ldloc_0 = 6,
        Ldloc_1 = 7,
        Ldloc_2 = 8,
        Ldloc_3 = 9,
        Stloc_0 = 10,
        Stloc_1 = 11,
        Stloc_2 = 12,
        Stloc_3 = 13,
        Ldarg_S = 14,
        Ldarga_S = 15,
        Starg_S = 16,
        Ldloc_S = 17,
        Ldloca_S = 18,
        Stloc_S = 19,
        Ldnull = 20,
        Ldc_I4_M1 = 21,
        Ldc_I4_0 = 22,
        Ldc_I4_1 = 23,
        Ldc_I4_2 = 24,
        Ldc_I4_3 = 25,
        Ldc_I4_4 = 26,
        Ldc_I4_5 = 27,
        Ldc_I4_6 = 28,
        Ldc_I4_7 = 29,
        Ldc_I4_8 = 30,
        Ldc_I4_S = 31,
        Ldc_I4 = 32,
        Ldc_I8 = 33,
        Ldc_R4 = 34,
        Ldc_R8 = 35,
        Dup = 36,
        Pop = 37,
        Jmp = 38,
        Call = 39,
        Calli = 40,
        Ret = 41,
        Br_S = 42,
        Brfalse_S = 43,
        Brtrue_S = 44,
        Beq_S = 45,
        Bge_S = 46,
        Bgt_S = 47,
        Ble_S = 48,
        Blt_S = 49,
        Bne_Un_S = 50,
        Bge_Un_S = 51,
        Bgt_Un_S = 52,
        Ble_Un_S = 53,
        Blt_Un_S = 54,
        Br = 55,
        Brfalse = 56,
        Brtrue = 57,
        Beq = 58,
        Bge = 59,
        Bgt = 60,
        Ble = 61,
        Blt = 62,
        Bne_Un = 63,
        Bge_Un = 64,
        Bgt_Un = 65,
        Ble_Un = 66,
        Blt_Un = 67,
        Switch = 68,
        Ldind_I1 = 69,
        Ldind_U1 = 70,
        Ldind_I2 = 71,
        Ldind_U2 = 72,
        Ldind_I4 = 73,
        Ldind_U4 = 74,
        Ldind_I8 = 75,
        Ldind_I = 76,
        Ldind_R4 = 77,
        Ldind_R8 = 78,
        Ldind_Ref = 79,
        Stind_Ref = 80,
        Stind_I1 = 81,
        Stind_I2 = 82,
        Stind_I4 = 83,
        Stind_I8 = 84,
        Stind_R4 = 85,
        Stind_R8 = 86,
        Add = 87,
        Sub = 88,
        Mul = 89,
        Div = 90,
        Div_Un = 91,
        Rem = 92,
        Rem_Un = 93,
        And = 94,
        Or = 95,
        Xor = 96,
        Shl = 97,
        Shr = 98,
        Shr_Un = 99,
        Neg = 100,
        Not = 101,
        Conv_I1 = 102,
        Conv_I2 = 103,
        Conv_I4 = 104,
        Conv_I8 = 105,
        Conv_R4 = 106,
        Conv_R8 = 107,
        Conv_U4 = 108,
        Conv_U8 = 109,
        Callvirt = 110,
        Cpobj = 111,
        Ldobj = 112,
        Ldstr = 113,
        Newobj = 114,
        Castclass = 115,
        Isinst = 116,
        Conv_R_Un = 117,
        Unbox = 118,
        Throw = 119,
        Ldfld = 120,
        Ldflda = 121,
        Stfld = 122,
        Ldsfld = 123,
        Ldsflda = 124,
        Stsfld = 125,
        Stobj = 126,
        Conv_Ovf_I1_Un = 127,
        Conv_Ovf_I2_Un = 128,
        Conv_Ovf_I4_Un = 129,
        Conv_Ovf_I8_Un = 130,
        Conv_Ovf_U1_Un = 131,
        Conv_Ovf_U2_Un = 132,
        Conv_Ovf_U4_Un = 133,
        Conv_Ovf_U8_Un = 134,
        Conv_Ovf_I_Un = 135,
        Conv_Ovf_U_Un = 136,
        Box = 137,
        Newarr = 138,
        Ldlen = 139,
        Ldelema = 140,
        Ldelem_I1 = 141,
        Ldelem_U1 = 142,
        Ldelem_I2 = 143,
        Ldelem_U2 = 144,
        Ldelem_I4 = 145,
        Ldelem_U4 = 146,
        Ldelem_I8 = 147,
        Ldelem_I = 148,
        Ldelem_R4 = 149,
        Ldelem_R8 = 150,
        Ldelem_Ref = 151,
        Stelem_I = 152,
        Stelem_I1 = 153,
        Stelem_I2 = 154,
        Stelem_I4 = 155,
        Stelem_I8 = 156,
        Stelem_R4 = 157,
        Stelem_R8 = 158,
        Stelem_Ref = 159,
        Ldelem_Any = 160,
        Stelem_Any = 161,
        Unbox_Any = 162,
        Conv_Ovf_I1 = 163,
        Conv_Ovf_U1 = 164,
        Conv_Ovf_I2 = 165,
        Conv_Ovf_U2 = 166,
        Conv_Ovf_I4 = 167,
        Conv_Ovf_U4 = 168,
        Conv_Ovf_I8 = 169,
        Conv_Ovf_U8 = 170,
        Refanyval = 171,
        Ckfinite = 172,
        Mkrefany = 173,
        Ldtoken = 174,
        Conv_U2 = 175,
        Conv_U1 = 176,
        Conv_I = 177,
        Conv_Ovf_I = 178,
        Conv_Ovf_U = 179,
        Add_Ovf = 180,
        Add_Ovf_Un = 181,
        Mul_Ovf = 182,
        Mul_Ovf_Un = 183,
        Sub_Ovf = 184,
        Sub_Ovf_Un = 185,
        Endfinally = 186,
        Leave = 187,
        Leave_S = 188,
        Stind_I = 189,
        Conv_U = 190,
        Arglist = 191,
        Ceq = 192,
        Cgt = 193,
        Cgt_Un = 194,
        Clt = 195,
        Clt_Un = 196,
        Ldftn = 197,
        Ldvirtftn = 198,
        Ldarg = 199,
        Ldarga = 200,
        Starg = 201,
        Ldloc = 202,
        Ldloca = 203,
        Stloc = 204,
        Localloc = 205,
        Endfilter = 206,
        Unaligned = 207,
        Volatile = 208,
        Tail = 209,
        Initobj = 210,
        Constrained = 211,
        Cpblk = 212,
        Initblk = 213,
        No = 214,
        Rethrow = 215,
        Sizeof = 216,
        Refanytype = 217,
        Readonly = 218
    }

    export interface StackItem {
        ptr: ApolloClr.StackObject;
        vPoint: Object;
        valueType: ApolloClr.StackValueType;
        intValue: number;
        lValue: number;
        index: number;
        getValue(): Object;
        getValueInt(): number;
        getValueLong(): number;
        getValueFloat(): number;
        getValueDouble(): number;
        setValue(vtype: ApolloClr.StackValueType, value: Object): void;
        copyFrom(stackItem: ApolloClr.StackItem): void;
    }
    export interface StackItemFunc extends Function {
        prototype: StackItem;
        new (): StackItem;
        sPtrEmpty: ApolloClr.StackItem;
        op_Implicit(ptr: number): ApolloClr.StackItem;
        op_Addition(s1: ApolloClr.StackItem, offset: number): ApolloClr.StackItem;
        op_Equality(s1: ApolloClr.StackItem, s2: ApolloClr.StackItem): boolean;
        op_Inequality(s1: ApolloClr.StackItem, s2: ApolloClr.StackItem): boolean;
        op_GreaterThan(s1: ApolloClr.StackItem, s2: ApolloClr.StackItem): boolean;
        op_LessThan(s1: ApolloClr.StackItem, s2: ApolloClr.StackItem): boolean;
        op_GreaterThanOrEqual(s1: ApolloClr.StackItem, s2: ApolloClr.StackItem): boolean;
        op_LessThanOrEqual(s1: ApolloClr.StackItem, s2: ApolloClr.StackItem): boolean;
    }
    var StackItem: StackItemFunc;

}

/// <reference path="./bridge.d.ts" />

declare module ApolloClr.Cross {
    export interface CrossMethod extends ApolloClr.MethodTasks {
        getCallName(): string;
        setCallName(value: string): void;
        getCrossMethodDelegate(): ApolloClr.Cross.ICrossMethodDelegate;
        setCrossMethodDelegate(value: ApolloClr.Cross.ICrossMethodDelegate): void;
        run(): void;
        creatDelegate(methodInfo: System.Reflection.ConstructorInfo): void;
        creatDelegate$1(methodInfo: System.Reflection.MethodInfo): void;
    }
    export interface CrossMethodFunc extends Function {
        prototype: CrossMethod;
        ctor: {
            new (): CrossMethod
        };
        $ctor1: {
            new (callname: string): CrossMethod
        };
    }
    var CrossMethod: CrossMethodFunc;

    export interface BaseCrossMethodDelegate extends ApolloClr.Cross.ICrossMethodDelegate {
        getPtr(): ApolloClr.StackObject;
        setPtr(value: ApolloClr.StackObject): void;
        getInstance(): Object;
        setInstance(value: Object): void;
        getResult(): Object;
        setResult(value: Object): void;
    }
    export interface BaseCrossMethodDelegateFunc extends Function {
        prototype: BaseCrossMethodDelegate;
        new (): BaseCrossMethodDelegate;
    }
    var BaseCrossMethodDelegate: BaseCrossMethodDelegateFunc;

    export interface CrossMethodDelegate extends ApolloClr.Cross.BaseCrossMethodDelegate {
        func: {(): void};
        getDelegate(): Function;
        setArgs(values: Object[]): void;
        run(): void;
    }
    export interface CrossMethodDelegateFunc extends Function {
        prototype: CrossMethodDelegate;
        new (): CrossMethodDelegate;
    }
    var CrossMethodDelegate: CrossMethodDelegateFunc;

    export interface CrossMethodDelegate$1<T> extends ApolloClr.Cross.BaseCrossMethodDelegate {
        func: {(arg: T): void};
        V1: T;
        getDelegate(): Function;
        run(): void;
        setArgs(values: Object[]): void;
    }
    export function CrossMethodDelegate$1<T>(T: {prototype: T}): {
        prototype: CrossMethodDelegate$1<T>;
        new (): CrossMethodDelegate$1<T>;
    }

    export interface CrossMethodDelegateRet$1<T> extends ApolloClr.Cross.BaseCrossMethodDelegate {
        func: {(): T};
        getDelegate(): Function;
        run(): void;
        setArgs(values: Object[]): void;
    }
    export function CrossMethodDelegateRet$1<T>(T: {prototype: T}): {
        prototype: CrossMethodDelegateRet$1<T>;
        new (): CrossMethodDelegateRet$1<T>;
    }

    export interface ObjectBuild$1<T> extends ApolloClr.Cross.BaseCrossMethodDelegate {
        getDelegate(): Function;
        make(): T;
        run(): void;
        setArgs(values: Object[]): void;
    }
    export function ObjectBuild$1<T>(T: {prototype: T}): {
        prototype: ObjectBuild$1<T>;
        new (): ObjectBuild$1<T>;
    }

    export interface CrossDomain {
    }
    export interface CrossDomainFunc extends Function {
        prototype: CrossDomain;
        new (): CrossDomain;
        build(callname: string): ApolloClr.Cross.CrossMethod;
    }
    var CrossDomain: CrossDomainFunc;

    export interface ICrossMethodDelegate {
        ApolloClr$Cross$ICrossMethodDelegate$getPtr(): ApolloClr.StackObject;
        ApolloClr$Cross$ICrossMethodDelegate$setPtr(value: ApolloClr.StackObject): void;
        ApolloClr$Cross$ICrossMethodDelegate$getDelegate(): Function;
        ApolloClr$Cross$ICrossMethodDelegate$setDelegate(value: Function): void;
        ApolloClr$Cross$ICrossMethodDelegate$getResult(): Object;
        ApolloClr$Cross$ICrossMethodDelegate$setResult(value: Object): void;
        run(): void;
        setArgs(values: Object[]): void;
    }
    var ICrossMethodDelegate: Function;

    export interface CrossMethodDelegate$2<T1,T2> {
    }
    export function CrossMethodDelegate$2<T1,T2>(T1: {prototype: T1}, T2: {prototype: T2}): {
        prototype: CrossMethodDelegate$2<T1,T2>;
        new (): CrossMethodDelegate$2<T1,T2>;
    }

    export interface CrossMethodDelegate$3<T1,T2,T3> {
    }
    export function CrossMethodDelegate$3<T1,T2,T3>(T1: {prototype: T1}, T2: {prototype: T2}, T3: {prototype: T3}): {
        prototype: CrossMethodDelegate$3<T1,T2,T3>;
        new (): CrossMethodDelegate$3<T1,T2,T3>;
    }

}

/// <reference path="./bridge.d.ts" />

declare module ApolloClr.Js {
    export interface App {
    }
    export interface AppFunc extends Function {
        prototype: App;
        new (): App;
        main(): void;
        run1(): number;
    }
    var App: AppFunc;

}

/// <reference path="./bridge.d.ts" />

declare module ApolloClr.Method {
    export interface ILCodeParse {
    }
    export interface ILCodeParseFunc extends Function {
        prototype: ILCodeParse;
        new (): ILCodeParse;
        readILCodes(ilcodes: string, locals?: System.Collections.Generic.List$1<string>, args?: System.Collections.Generic.List$1<string>): System.Collections.Generic.List$1<ApolloClr.ILCode>;
        readILCodes$1(lines: string[], locals?: System.Collections.Generic.List$1<string>, args?: System.Collections.Generic.List$1<string>): System.Collections.Generic.List$1<ApolloClr.ILCode>;
        fixTryCatchFinally(input: System.Collections.Generic.List$1<ApolloClr.ILCode>): System.Collections.Generic.List$1<ApolloClr.ILCode>;
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
        mergeCodes(input: System.Collections.Generic.List$1<ApolloClr.ILCode>, locals?: System.Collections.Generic.List$1<string>, args?: System.Collections.Generic.List$1<string>): System.Collections.Generic.List$1<ApolloClr.ILCode>;
    }
    var ILCodeParse: ILCodeParseFunc;

}

/// <reference path="./bridge.d.ts" />

declare module ApolloClr.MethodDefine {
    export interface OpCodeTask$1<TV1> extends ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask {
        func: {(arg: TV1): void};
        V1: TV1;
        getBindFunc(): Function;
        run(): void;
    }
    export function OpCodeTask$1<TV1>(TV1: {prototype: TV1}): {
        prototype: OpCodeTask$1<TV1>;
        new (): OpCodeTask$1<TV1>;
    }

    export interface OpCodeTaskT$3<TV1,TV2,TV3> extends ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask {
        func: {(arg1: TV1, arg2: TV2, arg3: TV3): void};
        V1: TV1;
        V2: TV2;
        V3: TV3;
        getBindFunc(): Function;
        run(): void;
    }
    export function OpCodeTaskT$3<TV1,TV2,TV3>(TV1: {prototype: TV1}, TV2: {prototype: TV2}, TV3: {prototype: TV3}): {
        prototype: OpCodeTaskT$3<TV1,TV2,TV3>;
        new (): OpCodeTaskT$3<TV1,TV2,TV3>;
    }

    export interface OpCodeTaskT$2<TV1,TV2> extends ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask {
        func: {(arg1: TV1, arg2: TV2): void};
        V1: TV1;
        V2: TV2;
        getBindFunc(): Function;
        run(): void;
    }
    export function OpCodeTaskT$2<TV1,TV2>(TV1: {prototype: TV1}, TV2: {prototype: TV2}): {
        prototype: OpCodeTaskT$2<TV1,TV2>;
        new (): OpCodeTaskT$2<TV1,TV2>;
    }

    export interface OpCodeTaskT$1<TV1> extends ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask {
        func: {(arg: TV1): void};
        V1: TV1;
        getBindFunc(): Function;
        run(): void;
    }
    export function OpCodeTaskT$1<TV1>(TV1: {prototype: TV1}): {
        prototype: OpCodeTaskT$1<TV1>;
        new (): OpCodeTaskT$1<TV1>;
    }

    export interface OpCodeTaskRef$3<TV1,TV2,TV3> extends ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask {
        func: {(arg1: {v: TV1}, arg2: {v: TV2}, arg3: {v: TV3}): void};
        V1: TV1;
        V2: TV2;
        V3: TV3;
        getBindFunc(): Function;
        run(): void;
    }
    export function OpCodeTaskRef$3<TV1,TV2,TV3>(TV1: {prototype: TV1}, TV2: {prototype: TV2}, TV3: {prototype: TV3}): {
        prototype: OpCodeTaskRef$3<TV1,TV2,TV3>;
        new (): OpCodeTaskRef$3<TV1,TV2,TV3>;
    }

    export interface BaseOpTask {
        getDump(): number;
        setDump(value: number): void;
        getOpCode(): ApolloClr.ILCode;
        setOpCode(value: ApolloClr.ILCode): void;
        getMethod(): Object;
        setMethod(value: Object): void;
        toString(): string;
    }
    export interface BaseOpTaskFunc extends Function {
        prototype: BaseOpTask;
        new (): BaseOpTask;
    }
    var BaseOpTask: BaseOpTaskFunc;

    export interface OpCodeTask extends ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask {
        func: {(): void};
        getBindFunc(): Function;
        run(): void;
    }
    export interface OpCodeTaskFunc extends Function {
        prototype: OpCodeTask;
        new (): OpCodeTask;
    }
    var OpCodeTask: OpCodeTaskFunc;

    export interface OpCodeTaskRef$2<TV1,TV2> extends ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask {
        func: {(arg1: {v: TV1}, arg2: {v: TV2}): void};
        V1: TV1;
        V2: TV2;
        getBindFunc(): Function;
        run(): void;
    }
    export function OpCodeTaskRef$2<TV1,TV2>(TV1: {prototype: TV1}, TV2: {prototype: TV2}): {
        prototype: OpCodeTaskRef$2<TV1,TV2>;
        new (): OpCodeTaskRef$2<TV1,TV2>;
    }

    export interface OpCodeTask$2<TV1,TV2> extends ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask {
        func: {(arg1: TV1, arg2: TV2): void};
        V1: TV1;
        V2: TV2;
        getBindFunc(): Function;
        run(): void;
    }
    export function OpCodeTask$2<TV1,TV2>(TV1: {prototype: TV1}, TV2: {prototype: TV2}): {
        prototype: OpCodeTask$2<TV1,TV2>;
        new (): OpCodeTask$2<TV1,TV2>;
    }

    export interface OpCodeTask$3<TV1,TV2,TV3> extends ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask {
        func: {(arg1: TV1, arg2: TV2, arg3: TV3): void};
        V1: TV1;
        V2: TV2;
        V3: TV3;
        getBindFunc(): Function;
        run(): void;
    }
    export function OpCodeTask$3<TV1,TV2,TV3>(TV1: {prototype: TV1}, TV2: {prototype: TV2}, TV3: {prototype: TV3}): {
        prototype: OpCodeTask$3<TV1,TV2,TV3>;
        new (): OpCodeTask$3<TV1,TV2,TV3>;
    }

    export interface OpCodeTaskRef$1<TV1> extends ApolloClr.MethodDefine.BaseOpTask,ApolloClr.IOpTask {
        func: {(arg1: {v: TV1}): void};
        V1: TV1;
        getBindFunc(): Function;
        run(): void;
    }
    export function OpCodeTaskRef$1<TV1>(TV1: {prototype: TV1}): {
        prototype: OpCodeTaskRef$1<TV1>;
        new (): OpCodeTaskRef$1<TV1>;
    }

}

/// <reference path="./bridge.d.ts" />

declare module ApolloClr.TypeDefine {
    export interface MethodDefine extends ApolloClr.MethodTasks {
        getMethodDefinition(): SilAPI.DisassembledMethod;
        setMethodDefinition(value: SilAPI.DisassembledMethod): void;
        getTypeDefine(): ApolloClr.TypeDefine.TypeDefine;
        setTypeDefine(value: ApolloClr.TypeDefine.TypeDefine): void;
        getName(): string;
        setName(value: string): void;
        cloneOne(): ApolloClr.MethodTasks;
    }
    export interface MethodDefineFunc extends Function {
        prototype: MethodDefine;
        new (): MethodDefine;
    }
    var MethodDefine: MethodDefineFunc;

    export interface TypeDefine {
        getMethods(): System.Collections.Generic.List$1<ApolloClr.TypeDefine.MethodDefine>;
        setMethods(value: System.Collections.Generic.List$1<ApolloClr.TypeDefine.MethodDefine>): void;
        getTypeDefinition(): SilAPI.DisassembledClass;
        setTypeDefinition(value: SilAPI.DisassembledClass): void;
        compile(): ApolloClr.TypeDefine.TypeDefine;
        methodCompile(r: ApolloClr.IOpTask): void;
        newCompile(r: ApolloClr.IOpTask): void;
    }
    export interface TypeDefineFunc extends Function {
        prototype: TypeDefine;
        new (inputType: SilAPI.DisassembledClass): TypeDefine;
    }
    var TypeDefine: TypeDefineFunc;

    export interface AssemblyDefine {
    }
    export interface AssemblyDefineFunc extends Function {
        prototype: AssemblyDefine;
        new (): AssemblyDefine;
        readAndRun(fileName: string, type: string, method: string): Object;
    }
    var AssemblyDefine: AssemblyDefineFunc;

}

/// <reference path="./bridge.d.ts" />

declare module IO {
    export interface StringReader extends System.IDisposable {
        postion: number;
        lines: string[];
        dispose(): void;
        readLine(): string;
        readToEnd(): string;
    }
    export interface StringReaderFunc extends Function {
        prototype: StringReader;
        new (rawIL: string): StringReader;
    }
    var StringReader: StringReaderFunc;

}

/// <reference path="./bridge.d.ts" />

declare module SilAPI {
    export interface DisassembledField extends SilAPI.DisassembledEntity {
        getFieldType(): string;
        setFieldType(value: string): void;
        getLiteralValue(): string;
        setLiteralValue(value: string): void;
        getModifiers(): System.Collections.Generic.IEnumerable$1<string>;
        toString(): string;
        initialiseFromIL(): void;
    }
    export interface DisassembledFieldFunc extends Function {
        prototype: DisassembledField;
        new (): DisassembledField;
    }
    var DisassembledField: DisassembledFieldFunc;

    export interface DisassembledMethod extends SilAPI.DisassembledEntity {
        maxStack: number;
        static: boolean;
        returnType: string;
        locals: System.Collections.Generic.Dictionary$2<string,string>;
        parameters: System.Collections.Generic.Dictionary$2<string,string>;
        localsIndex: System.Collections.Generic.Dictionary$2<string,number>;
        parametersIndex: System.Collections.Generic.Dictionary$2<string,number>;
        localList: System.Collections.Generic.List$1<string>;
        parametersList: System.Collections.Generic.List$1<string>;
        bodyLines: System.Collections.Generic.List$1<string>;
        getCallName(): string;
        toString(): string;
        initialiseFromIL(): void;
        readBody(): void;
    }
    export interface DisassembledMethodFunc extends Function {
        prototype: DisassembledMethod;
        new (): DisassembledMethod;
        opTConvert(name: string): string;
        strForm2S(sstr: string, s: string, e: string): string;
        strForm2SA(sstr: string, s: string, e: string): string[];
        strLeft(sstr: string, lenght: number): string;
        strLenght(sstr: string): number;
        strRight(sstr: string, lenght: number): string;
        strSplit(baseString: string, splitString: string, sso: Number): string[];
    }
    var DisassembledMethod: DisassembledMethodFunc;

    export interface DisassembledProperty extends SilAPI.DisassembledEntity {
        toString(): string;
        initialiseFromIL(): void;
    }
    export interface DisassembledPropertyFunc extends Function {
        prototype: DisassembledProperty;
        new (): DisassembledProperty;
    }
    var DisassembledProperty: DisassembledPropertyFunc;

    /** @namespace SilAPI */

    /**
     * The Sil Processor is the main object that deals with Sil data.
     *
     * @public
     * @class SilAPI.StreamSilProcessor
     * @implements  SilAPI.ISilProcessor
     */
    export interface StreamSilProcessor extends SilAPI.ISilProcessor {
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
        getSourceILStream(): string;
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
        setSourceILStream(value: string): void;
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
        getSourceFilePath(): string;
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
        setSourceFilePath(value: string): void;
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
        getSourceFileFirstLine(): number;
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
        setSourceFileFirstLine(value: number): void;
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
        getSourceFileLastLine(): number;
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
        setSourceFileLastLine(value: number): void;
        /**
         * Generates the IL.
         *
         * @instance
         * @private
         * @this SilAPI.StreamSilProcessor
         * @memberof SilAPI.StreamSilProcessor
         * @return  {void}
         */
        generateModuleIL(): void;
        /**
         * Parses the file IL.
         *
         * @instance
         * @private
         * @this SilAPI.StreamSilProcessor
         * @memberof SilAPI.StreamSilProcessor
         * @return  {void}
         */
        parseFileIL(): void;
        /**
         * Parses the selection IL.
         *
         * @instance
         * @private
         * @this SilAPI.StreamSilProcessor
         * @memberof SilAPI.StreamSilProcessor
         * @return  {void}
         */
        parseSelectionIL(): void;
        /**
         * Processes the IL.
         *
         * @instance
         * @public
         * @this SilAPI.StreamSilProcessor
         * @memberof SilAPI.StreamSilProcessor
         * @return  {boolean}
         */
        processIL(): boolean;
        /**
         * Gets the selection IL.
         *
         * @instance
         * @public
         * @this SilAPI.StreamSilProcessor
         * @memberof SilAPI.StreamSilProcessor
         * @return  {string}        The IL for the selection.
         */
        getSelectionIL(): string;
        /**
         * Gets the file IL.
         *
         * @instance
         * @public
         * @this SilAPI.StreamSilProcessor
         * @memberof SilAPI.StreamSilProcessor
         * @return  {string}        The IL for the file the selection is in.
         */
        getFileIL(): string;
        /**
         * Gets the module IL.
         *
         * @instance
         * @public
         * @this SilAPI.StreamSilProcessor
         * @memberof SilAPI.StreamSilProcessor
         * @return  {string}        The IL for the module the selection is in.
         */
        getModuleIL(): string;
    }
    export interface StreamSilProcessorFunc extends Function {
        prototype: StreamSilProcessor;
        new (): StreamSilProcessor;
        burnCommentBlocks(line: {v: string}, reader: System.IO.StringReader): void;
        getSourceFile(line: string, sourceFilePath: {v: string}): boolean;
        getComment(line: string, comment: {v: string}, linePart1: {v: number}): boolean;
        getLineHint(line: string, firstPart: {v: number}, secondPart: {v: number}): boolean;
    }
    var StreamSilProcessor: StreamSilProcessorFunc;

    export interface DisassembledEnumeration extends SilAPI.DisassembledIlClass {
        toString(): string;
        initialiseFromIL(): void;
    }
    export interface DisassembledEnumerationFunc extends Function {
        prototype: DisassembledEnumeration;
        new (): DisassembledEnumeration;
    }
    var DisassembledEnumeration: DisassembledEnumerationFunc;

    export interface DisassembledDelegate extends SilAPI.DisassembledIlClass {
        toString(): string;
        initialiseFromIL(): void;
    }
    export interface DisassembledDelegateFunc extends Function {
        prototype: DisassembledDelegate;
        new (): DisassembledDelegate;
    }
    var DisassembledDelegate: DisassembledDelegateFunc;

    export interface DisassembledClass extends SilAPI.DisassembledIlClass {
        toString(): string;
        initialiseFromIL(): void;
    }
    export interface DisassembledClassFunc extends Function {
        prototype: DisassembledClass;
        new (): DisassembledClass;
    }
    var DisassembledClass: DisassembledClassFunc;

    export interface DisassembledEvent extends SilAPI.DisassembledEntity {
        toString(): string;
        initialiseFromIL(): void;
    }
    export interface DisassembledEventFunc extends Function {
        prototype: DisassembledEvent;
        new (): DisassembledEvent;
    }
    var DisassembledEvent: DisassembledEventFunc;

    export interface DisassembledStructure extends SilAPI.DisassembledIlClass {
        toString(): string;
        initialiseFromIL(): void;
    }
    export interface DisassembledStructureFunc extends Function {
        prototype: DisassembledStructure;
        new (): DisassembledStructure;
    }
    var DisassembledStructure: DisassembledStructureFunc;

    /**
     * Represents an assembly that has been disassembled.
     Note that internally, most properties on this object 
     are lazy, so won't be parsed until required.
     *
     * @public
     * @class SilAPI.DisassembledAssembly
     * @augments SilAPI.DisassembledEntity
     */
    export interface DisassembledAssembly extends SilAPI.DisassembledEntity {
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
        getAssemblyPath(): string;
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
        setAssemblyPath(value: string): void;
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
        getClasses(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledClass>;
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
        getStructures(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledStructure>;
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
        getInterfaces(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledInterface>;
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
        getDelegates(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledDelegate>;
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
        getEnumerations(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledEnumeration>;
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
        getAllMethods(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledMethod>;
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
        getAllProperties(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledProperty>;
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
        getAllFields(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledField>;
        getAllEvents(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledEvent>;
        getAllClasses(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledClass>;
        getAllEnumerations(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledEnumeration>;
        getAllStructures(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledStructure>;
        getAllInterfaces(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledInterface>;
        getAllDelegates(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledDelegate>;
        createDisassembledIlClasses(): System.Collections.Generic.List$1<SilAPI.DisassembledIlClass>;
        createIlClassFromRawIlClass(rawIlClass: SilAPI.DisassembledAssembly.RawILClass): SilAPI.DisassembledIlClass;
        parseDisassembledIlClasses(): System.Collections.Generic.List$1<SilAPI.DisassembledAssembly.RawILClass>;
        initialiseFromIL(): void;
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
        findDisassembledEntity(disassemblyTarget: SilAPI.DisassemblyTarget): SilAPI.DisassembledEntity;
        getIlClassesRecursiveOfType<T>(T: {prototype: T}): System.Collections.Generic.IEnumerable$1<T>;
    }
    export interface DisassembledAssemblyFunc extends Function {
        prototype: DisassembledAssembly;
        RawILClass: DisassembledAssembly.RawILClassFunc;
        new (): DisassembledAssembly;
    }
    var DisassembledAssembly: DisassembledAssemblyFunc;
    module DisassembledAssembly {
        export interface RawILClass {
            getFullName(): string;
            setFullName(value: string): void;
            getTemplateSpecification(): string;
            setTemplateSpecification(value: string): void;
            getILBuilder(): System.Text.StringBuilder;
            setILBuilder(value: System.Text.StringBuilder): void;
            getChildren(): System.Collections.Generic.List$1<SilAPI.DisassembledAssembly.RawILClass>;
            setChildren(value: System.Collections.Generic.List$1<SilAPI.DisassembledAssembly.RawILClass>): void;
        }
        export interface RawILClassFunc extends Function {
            prototype: RawILClass;
            new (): RawILClass;
        }
    }

    export interface DisassembledInterface extends SilAPI.DisassembledIlClass {
        toString(): string;
        initialiseFromIL(): void;
    }
    export interface DisassembledInterfaceFunc extends Function {
        prototype: DisassembledInterface;
        new (): DisassembledInterface;
    }
    var DisassembledInterface: DisassembledInterfaceFunc;

    /**
     * A SilProcessor is an object ready to process IL from some input.
     *
     * @abstract
     * @public
     * @class SilAPI.ISilProcessor
     */
    export interface ISilProcessor {
        /**
         * Processes the IL.
         *
         * @instance
         * @abstract
         * @public
         * @this SilAPI.ISilProcessor
         * @memberof SilAPI.ISilProcessor
         * @return  {boolean}        False if processing the IL failed (i.e. we got nothing back).
         */
        processIL(): boolean;
        /**
         * Gets the selection IL.
         *
         * @instance
         * @abstract
         * @public
         * @this SilAPI.ISilProcessor
         * @memberof SilAPI.ISilProcessor
         * @return  {string}        The IL for the selection.
         */
        getSelectionIL(): string;
        /**
         * Gets the file IL.
         *
         * @instance
         * @abstract
         * @public
         * @this SilAPI.ISilProcessor
         * @memberof SilAPI.ISilProcessor
         * @return  {string}        The IL for the file the selection is in.
         */
        getFileIL(): string;
        /**
         * Gets the module IL.
         *
         * @instance
         * @abstract
         * @public
         * @this SilAPI.ISilProcessor
         * @memberof SilAPI.ISilProcessor
         * @return  {string}        The IL for the module the selection is in.
         */
        getModuleIL(): string;
    }
    var ISilProcessor: Function;

    export interface ILParseHelper {
    }
    export interface ILParseHelperFunc extends Function {
        prototype: ILParseHelper;
        new (): ILParseHelper;
        isLineTopLevelIlClassDeclaration(line: string): boolean;
        isLineAnyLevelIlClassDeclaration(line: string): boolean;
        isLineClassDeclaration(line: string): boolean;
        getClassDeclarationParts(line: string, modifiers: {v: System.Collections.Generic.List$1<string>}, className: {v: string}, templateSpecification: {v: string}): void;
        isLineStructDeclaration(line: string): boolean;
        isLineInterfaceDeclaration(line: string): boolean;
        readExtendsLine(line: string, baseType: {v: string}): boolean;
        isLineStartClassEndToken(line: string): boolean;
        isLineClassEndDeclaration(line: string, className: string): boolean;
        isLineFieldDeclaration(line: string): boolean;
        getClassNameFromClassDeclarationLine(line: string, className: {v: string}, templateSpecification: {v: string}): void;
        isLineMethodDeclaration(line: string): boolean;
        getMethodNameFromDeclarationLine(line: string): string;
        isLineMethodEndDeclaration(line: string, ilClassName: string, methodName: string): boolean;
        isLinePropertyDeclaration(line: string): boolean;
        isLineEventPropertyDeclaration(line: string): boolean;
        isLinePropertyEndDeclaration(line: string, ilClassName: string, propertyName: string): boolean;
        isLineEventEndDeclaration(line: string, ilClassName: string, propertyName: string): boolean;
        getPropertyNameFromDeclarationLine(line: string): string;
        getEventNameFromDeclarationLine(line: string): string;
        isLineSourceComment(line: string): boolean;
    }
    var ILParseHelper: ILParseHelperFunc;

    export enum DisassemblyTargetType {
        Class = 0,
        Enumeration = 1,
        Method = 2,
        Property = 3,
        Field = 4,
        Structure = 5,
        Delegate = 6,
        Event = 7,
        Interface = 8
    }

    /**
     * A Disassembly Target is an object that describes an element that is being
     targetted in an assembly, such as a method, class or field.
     *
     * @public
     * @class SilAPI.DisassemblyTarget
     */
    export interface DisassemblyTarget {
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
        getTargetType(): SilAPI.DisassemblyTargetType;
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
        setTargetType(value: SilAPI.DisassemblyTargetType): void;
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
        getFullName(): string;
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
        setFullName(value: string): void;
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
        toString(): string;
    }
    export interface DisassemblyTargetFunc extends Function {
        prototype: DisassemblyTarget;
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
        new (targetType: SilAPI.DisassemblyTargetType, fullName: string): DisassemblyTarget;
    }
    var DisassemblyTarget: DisassemblyTargetFunc;

    export interface DisassemblyException extends System.Exception {
    }
    export interface DisassemblyExceptionFunc extends Function {
        prototype: DisassemblyException;
        ctor: {
            new (message: string): DisassemblyException
        };
        $ctor1: {
            new (message: string, innerException: System.Exception): DisassemblyException
        };
    }
    var DisassemblyException: DisassemblyExceptionFunc;

    export interface Disassembler extends System.IDisposable {
        /**
         * Creates the map of file paths to contents.
         *
         * @instance
         * @private
         * @this SilAPI.Disassembler
         * @memberof SilAPI.Disassembler
         * @return  {System.Collections.Generic.Dictionary$2}
         */
        createMapOfFilePathsToContents(): System.Collections.Generic.Dictionary$2<string,string>;
        createMapOfClassNamesToContents(identifyClassType: {(declarationLine: string): boolean}): System.Collections.Generic.Dictionary$2<string,string>;
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
        initialise(assemblyPath: string): void;
        dispose(): void;
        /**
         * Gets the raw IL.
         *
         * @instance
         * @public
         * @this SilAPI.Disassembler
         * @memberof SilAPI.Disassembler
         * @return  {string}        The complete raw IL.
         */
        getRawIL(): string;
        /**
         * Gets the file names of source code files in the assembly.
         *
         * @instance
         * @public
         * @this SilAPI.Disassembler
         * @memberof SilAPI.Disassembler
         * @return  {System.Collections.Generic.IEnumerable$1}
         */
        getFileNames(): System.Collections.Generic.IEnumerable$1<string>;
        getClassNames(): System.Collections.Generic.IEnumerable$1<string>;
        getStructNames(): System.Collections.Generic.IEnumerable$1<string>;
        getInterfaceNames(): System.Collections.Generic.IEnumerable$1<string>;
    }
    export interface DisassemblerFunc extends Function {
        prototype: Disassembler;
        disassembleAssembly(assemblyPath: string, $short?: boolean): SilAPI.DisassembledAssembly;
    }
    var Disassembler: DisassemblerFunc;

    /**
     * The base class for all disassembled entities (which could be things like
     an assembly, interface, class, method etc).
     *
     * @abstract
     * @public
     * @class SilAPI.DisassembledEntity
     */
    export interface DisassembledEntity {
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
        getFullName(): string;
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
        setFullName(value: string): void;
        getTemplateSpecification(): string;
        setTemplateSpecification(value: string): void;
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
        getShortName(): string;
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
        setShortName(value: string): void;
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
        getRawIL(): string;
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
        setRawIL(value: string): void;
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
        getParent(): SilAPI.DisassembledEntity;
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
        setParent(value: SilAPI.DisassembledEntity): void;
        getRawIlWithoutComments(): string;
        toString(): string;
    }
    export interface DisassembledEntityFunc extends Function {
        prototype: DisassembledEntity;
        new (): DisassembledEntity;
    }
    var DisassembledEntity: DisassembledEntityFunc;

    /**
     * A DisassembledILClass is an IL .class entity. This is not the same
     as a C# class - an IL .class can be a struct, class, enum, delegate etc.
     IL .classes can in many cases contain other other elements -
     *
     * @public
     * @class SilAPI.DisassembledIlClass
     * @augments SilAPI.DisassembledEntity
     */
    export interface DisassembledIlClass extends SilAPI.DisassembledEntity {
        getBaseType(): string;
        setBaseType(value: string): void;
        getModifiers(): System.Collections.Generic.IEnumerable$1<string>;
        getFields(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledField>;
        getMethods(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledMethod>;
        getProperties(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledProperty>;
        getEvents(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledEvent>;
        getClasses(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledClass>;
        getStructures(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledStructure>;
        getEnumerations(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledEnumeration>;
        getInterfaces(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledInterface>;
        getDelegates(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledDelegate>;
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
        getAllClasses(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledClass>;
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
        getAllStructures(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledStructure>;
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
        getAllEnumerations(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledEnumeration>;
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
        getAllDelegates(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledDelegate>;
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
        getAllInterfaces(): System.Collections.Generic.IEnumerable$1<SilAPI.DisassembledInterface>;
        toString(): string;
        initialiseFromIL(): void;
        readFields(): void;
        readMethods(): void;
        readProperties(): void;
        readEvents(): void;
        addChild(ilClass: SilAPI.DisassembledIlClass): void;
        getIlClassesRecursiveOfType<T>(T: {prototype: T}): System.Collections.Generic.IEnumerable$1<T>;
        updateFullNamesOfChildren(): void;
    }
    export interface DisassembledIlClassFunc extends Function {
        prototype: DisassembledIlClass;
        new (): DisassembledIlClass;
    }
    var DisassembledIlClass: DisassembledIlClassFunc;

}

/// <reference path="./bridge.d.ts" />

declare module System {
    export interface Exction {
    }
    export interface ExctionFunc extends Function {
        prototype: Exction;
        new (): Exction;
        find<T>(T: {prototype: T}, list: System.Collections.Generic.IList$1<T>, func: {(arg: T): boolean}): T;
        findIndex<T>(T: {prototype: T}, list: System.Collections.Generic.IList$1<T>, func: {(arg: T): boolean}): number;
        makeGenericType(type: Function, types: Function[]): Function;
        forEach<T>(T: {prototype: T}, list: System.Collections.Generic.List$1<T>, loopFunc: {(arg: T): void}): void;
    }
    var Exction: ExctionFunc;

    export interface Lazy$1<T> {
        getValue(): T;
    }
    export function Lazy$1<T>(T: {prototype: T}): {
        prototype: Lazy$1<T>;
        new (func: {(): T}): Lazy$1<T>;
    }
}
