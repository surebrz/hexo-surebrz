title: VS2012的glut环境配置
date: 2015-12-06 21:50:48
tags: [opengl, 图形学]
categories: 笔记
---

开始补图形学相关姿势，本科未开课甚是遗憾。

<!--more-->

## glut下载

- 从[这里](https://www.opengl.org/resources/libraries/glut/glut_downloads.php)下载glut环境需要的文件，我下载了[这个](https://www.opengl.org/resources/libraries/glut/glutdlls37beta.zip)编译好的版本。

- 解压在英文路径下

## 在vs中配置环境

### 建立项目

- 使用vs2012解决方案中新建一个c++空项目

### 配置glut环境

- 在 项目->属性->C/C++->附加包含目录 中添加刚才glut压缩包解压后的文件夹路径

- 在 项目->属性->连接器->输入->附加依赖项 中添加 __glut32.lib__

## 测试

以上，写代码测试下吧。

    #include "windows.h"
    #include "glut.h"
    using namespace std;

    void init()
    {
        glClearColor(1.0, 1.0, 1.0, 0.0);

        glMatrixMode(GL_PROJECTION);
        gluOrtho2D(0.0, 640.0, 0.0, 480.0);
    }

    void segment()
    {
        glClear(GL_COLOR_BUFFER_BIT);

        glColor3f(1.0, 0.0, 0.0);
        glBegin(GL_LINES);
            glVertex2i(0, 0);
            glVertex2i(320, 240);
        glEnd();

        glFlush();
    }

    int main(int argc, char* argv[])
    {
        glutInit(&argc, argv);
        glutInitDisplayMode(GLUT_SINGLE|GLUT_RGB);
        glutInitWindowPosition(50, 100);
        glutInitWindowSize(640, 480);
        glutCreateWindow("p1");
        init();
        glutDisplayFunc(segment);
        glutMainLoop();
        return 0;
    }

