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


### web版本

这里通过Bridge.Net顺便移植了一个早期的版本。
仅仅能运行一些比较早期的代码，不过后续应该还会继续更近。

[运行.NetIL在Web上](http://cdn.rawgit.com/icesun963/ApolloClr/b57c8755/Bridge/www/demo.html)

