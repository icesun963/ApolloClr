# IL VM的一个 C# 实现

>just for fun!
>

### 导言
>ILDASM 反编译 DLL/EXE 到IL，然后通过构造一个.NET虚拟机，并进行运行。
>并且有很酷的Js版本。

### 提示
>早期版本

### 实现列表

    1.运行堆栈模拟
    2.通过SilAPI对IL进行解析
    3.基础函数方法和类型转换
    4.基础Clr穿透调用，ILVM调用C#，C#调用ILVM
    5.基础类实现，调用字段/静态字段
    6.基础类型转换
    7.基础跳转比较以及流程控制
    8.早期的异常支持，try catch finaly
    9.数组指令的实现


### 实现笔记

#### 类和值类型设计
    在IL层，除了地址就是地址，刚开始采用字典实现了一个比较简陋版本的类实现。
    但是在处理结构的时候遇到了麻烦，需要传递不少地址，以及对地址上的值进行操作。
    虽然可以直接写上一段，暂时不支持值类型。对象引用传递还是多少没有问题的。
    这里尝试重新定义数据结构，使用一个类以及一个数组在描述关于内部字段。
    通过预编译，把对字段的描述改变成对数组的访问，可以通过传递对象引用和索引位置，
    来模拟地址操作，RefPtr 这样的一个类型定义。
    StackItem的指向的话，采用IntPtr来处理，本质上是void*，但是Void*不能转换成Object。
    来存储和传递，回头再优化，可以省掉这么一层传递。
    
    

### web版本

这里通过Bridge.Net顺便移植了一个早期的版本。
仅仅能运行一些比较早期的代码，不过后续应该还会继续更近。

[运行.NetIL在Web上](http://cdn.rawgit.com/icesun963/ApolloClr/b57c8755/Bridge/www/demo.html)

