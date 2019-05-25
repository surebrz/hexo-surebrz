title: MonoDevelop 找不到 UnityEngine 上下文的解决方法
date: 2019-05-25 09:58:46
tags: [Unity, MonoDevelop]
categories: 笔记
---

# 问题

使用 MonoDevelop 编辑代码时出现了错误：

> Error CS01013: The name 'UnityEngine' does not exist in the current context.

![pic](http://wx4.sinaimg.cn/mw690/a94a86cbly1g3dc8yirz8j20di02i3ye.jpg)

找不到 UnityEngine 类库，所有相关方法都标红显示错误，但是 Unity 编辑器可以正常编译运行。

# 原因

自行编辑过项目的代码格式： __Project > Assembly-CSharp options > Source Code > Code Formatting__，导致 __Assembly-CSharp.csproj__ 文件被插入了配置代码：

```xml
<ProjectExtensions xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
  <MonoDevelop>
    <Properties>
      <Policies>
        <TextStylePolicy inheritsSet="null" scope="text/x-csharp"/>
        <CSharpFormattingPolicy NamespaceBraceStyle="EndOfLine" ClassBraceStyle="EndOfLine" InterfaceBraceStyle="EndOfLine" StructBraceStyle="EndOfLine" EnumBraceStyle="EndOfLine" MethodBraceStyle="EndOfLine" ConstructorBraceStyle="EndOfLine" DestructorBraceStyle="EndOfLine" BeforeMethodDeclarationParentheses="False" BeforeMethodCallParentheses="False" BeforeConstructorDeclarationParentheses="False" BeforeIndexerDeclarationBracket="False" BeforeDelegateDeclarationParentheses="False" AfterDelegateDeclarationParameterComma="True" NewParentheses="False" SpacesBeforeBrackets="False" inheritsSet="Mono" inheritsScope="text/x-csharp" scope="text/x-csharp"/>
      </Policies>
    </Properties>
  </MonoDevelop>
</ProjectExtensions>
```


# 解决

删除 **Assembly-CSharp.csproj** 文件，重新在 Unity 编辑器中打开代码文件，生成新的项目文件。

- **注意，修改配置需要操作的是项目根节点的配置**，而不是 __Assembly-CSharp__ 或 __Assembly-CSharp-Editor__ 项目的配置。