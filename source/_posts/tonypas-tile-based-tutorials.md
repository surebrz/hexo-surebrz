title: 【原创翻译】Tonypa 基于瓦片地图的游戏开发教程 (Tonypa's tile-based tutorials)
date: 2024-04-25 19:09:20
tags: [教程,翻译,游戏开发]
categories: 教程
---

教程地址：http://www.gotoandplay.it/_articles/2004/02/tonypa.php

教程原作者地址（已失效）：http://www.tonypa.pri.ee/

看到一篇非常棒的 2D 瓦片地图游戏开发教程，对瓦片地图游戏进行了手把手级别深入浅出的系统教学。鉴于原文已经是 2004 年的教程，且作者原始博客已经无法访问，为了避免教程遗失，在这里对该教程进行翻译留档。

原文在 Flash 环境使用 ActionScript 进行开发，由于 Flash 播放器在各浏览器上都已停止支持，本文并不能直接展示原教程的示例，仅提供镜像下载。本文也会使用 HTML5 + PixiJS 对教程中的示例进行复刻，仅供参考。

<!-- more -->

# 简介

略

# 为何使用瓦片？

## 为何使用瓦片？

在开始游戏编码前，我们先讨论一下基于瓦片地图的游戏。为何你一定要使用瓦片？瓦片地图游戏是否做起来更简单，或者可能更困难？Flash 是否对制作瓦片地图游戏更加便利？

瓦片从很久以前就已经在游戏开发中使用。在计算机没有上 GHz 的 CPU 和几百 MB 的内存之前，较低的运算速度和受限的内存意味着游戏开发者不得不开动脑筋，创造各种方式让游戏看起来更漂亮，运行得高效。

比如，如果你想要给游戏加入漂亮的背景图，但图片太大使得游戏运行很慢时，要怎么办呢？把图片切割成瓦片！

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p02_1.gif)

在上图中，你可以看到图片中的一些部分是完全一样的，1 和 4 相同，2 和 3 相同，5 到 9 的部分是完全一样的。将图片切割便得到了瓦片。整图比瓦片的文件大小要大得多，而你只需要 4 个不同的瓦片就可以绘制该图片。

瓦片另一个良好的特性是当你想要替换背景图片的一些部分时，并不需要完全重画，你可以仅仅重画 1 个瓦片的图片，比如你可以使用草地和鲜花的瓦片，然后在草地不变的情况下替换新的花朵。

## FLASH 和瓦片地图

众所周知，Flash 是基于矢量图的工具，因此 Flash 的图片文件通常有着较小的文件大小并且可以改变尺寸。不过因为这个你就不必基于瓦片来制作游戏了？
然而，尽管你可以轻易地在 Flash 中制作基于图片的游戏，但当你的游戏场景想要变得更大、你想为游戏增加更多特性的时候，你将会陷入麻烦。基于瓦片地图在很多方面将会更加简单（比如等距视角、寻路、图片深度排序）。别忘了，基于瓦片的游戏已经经过了长足的发展，很多理论也可以为 Flash 使用。

但在 Flash 中使用瓦片的弊端是我们并不能很好的利用他的绘制和时间线功能。我们的游戏是基于 ActionScript 的，需要编写很多的代码来修改和移动舞台上的图片。

使用位图作为瓦片是个好主意。是的，我们在 Flash 里可以画出所有事物并得到矢量图，但是当游戏运行时，播放器不得不计算屏幕里的向量，但我们并不想让任何东西使得游戏变卡。位图是一种预先渲染好的图片，并且一般情况下它们看起来效果已经很不错。如果你想向 Flash 中引入位图瓦片，最好是将它保存为 GIF 文件，并且有着透明背景。

聊的够多了，让我们开始制作些东西吧 :)

首先，我们来看看如何保存我们的瓦片地图。

# 地图格式

## 地图格式

我们将把地图保存为 Flash 提供的一个非常棒的结构里：数组。如果你不知道什么是数组，请先打开并阅读 Flash 的帮助文件。

## 二维数组

我们使用二维数组保存地图。不，他并不是指什么超出我们维度的东西！他只是每个元素都是一个数组的数组。有点迷糊了？接着看吧。

一般来说，创建一个简单的数组看起来像这样：

```
myArray = ["a", "b", "c", "d"];
```

这很简单，你可以用 `myArray[0]` 取到第一个元素 `"a"`，用 `myArray[1]` 取到第二个元素 `"b"`，以此类推。

接下来是关键，如果我们不是把 "a"，"b"，"c" 放到数组里，而想把其他数组放到数组里呢？当然可以，这里我们创建一些数组：

```
a = ["a1", "a2", "a3"];
b = ["b1", "b2", "b3"];
c = ["c1", "c2", "c3"];
myArray = [a, b, c];
```

现在，我们已经声明了一个数组 `myArray` 并且其中的每个元素也都是数组，因此，第一个元素 `myArray[0]` 是一个数组 `["a1", "a2", "a3"]`，第二个元素的值是 `["b1", "b2", "b3"]`，如果你使用：

```
myVar = myArray[2];
```

那么 `myVar` 的值取到的是 `["c1", "c2", "c3"]`。

好的，你可能会提问，但是我们还没有说完。如果你使用:

```
myVar = myArray[2][0];
```

那么它将取到 `myArray` 第 1 个元素的第 3 个元素值 `"c1"`。

让我们再来一些练习。

```
myVar=myArray[0][1]
```

取到 `myArray` 第一个元素 `a` 的第 2 个元素 `"a2"`，而

```
myVar=myArray[1][0]
```

取到值 `"b1"`。

这会儿看明白了吗？

## 制作地图

首先，我们编写代表地图瓦片信息的数组：

```
myMap = [
[1, 1, 1, 1, 1, 1, 1, 1],
[1, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 1, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 1, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 1],
[1, 1, 1, 1, 1, 1, 1, 1]
];
```

如你所见，我们的地图包含 6 行 8 列。如果主角从左上角出发，他可以向右走 8 步，向下走 6 步，然后看着虚空发呆。

一些聪明的孩子已经提出了关键问题：“这个地图数组里的数字是什么意思？”。好的，我们将用一些面向对象的知识（没错，是 `Objects`， 别跑，这并不难）来创建地图和管理我们的游戏。我们先定义一下瓦片，它们将作为我们要放到游戏里的模板，然后我们遍历地图，使用每个位置上的数字。

当我们取到数字 `1`，我们会创建一个新的 `Tile1` 模板，然后在游戏里到达那个图块时，我们将获取到那个图块的对象属性，它将包含很多的属性，但是最基本的图块可以只包含 2 个属性：是否可以行走（walkable），以及帧图片（frame）。

是否可行走（walkable）属性用来表示角色能够移动到该图块（此时设置 `walkable = true`）或不能（false）。我们不使用碰撞检测，碰撞检测效率很低并且在瓦片地图游戏中使用它一点也不酷。

帧图片（frame）属性用来表示我们要在图块位置显示的影片剪辑。它用来将瓦片显示在屏幕上。每个我们用来显示的影片剪辑图块都会默认显示第 1 帧。我们将在 **创建瓦片地图** 章节讨论更多相关内容。

因此，如果我们像这样定义瓦片：

```
//wall tile
Tile1 = function () {};
Tile1.prototype.walkable = false;
Tile1.prototype.frame = 2;
```

我们便创建好了地图里所有的数字 1 对应的瓦片 `Tile1` ，同时我们也可以说这个图块不能行走（walkable = false），并且瓦片的影片剪辑将会显示第 2 帧。

# 更多地图

## 更多地图类型

你也许会好奇我为什么选择了这种地图类型。我并不能说这是最好的方式，我不能说它可以更快地创建地图或者使得地图文件尺寸最小，我只能说经过了这几年的使用体验，我发现这种地图格式更好地满足了我的要求。但是也让我们看看其他可行的地图数据格式吧。

## JAILBITCH 方法

原 [OutsideOfSociety](https://oosmoxiecode.com/) 教程中使用了非常简单的地图格式。它同样使用二维数组，并且每个数字提供了用来展示图块的帧序号。你每次想判断下一个图块是否是墙壁（或者可拾取的东西、门、以及其他任何事物）时，你都需要检查地图数组中的数字。

当检查碰撞时，你要判断指定的帧图片是不是墙（或者物品、门）。比如，你可以约定帧序号 0 到 100 是可行走的图块，101 到 200 是墙，而大于 200 的是特殊图块。

当你的瓦片类型很少或者变动不大时，这种方式显得非常简单。

## 沙漠里的树

一些地图有着区别非常大的图块，有些部分用的非常少，比如，在沙漠中，长达数公里都只有黄沙，如果你够幸运，你可以看到绿洲。又比如海洋，到处都只有海水，仅有少量的陆地。

如果你的地图使用了大量重复的图块（沙地），只有少量的变化（树），那么二维数组并不是一个很好的格式。它将包含太多冗余的信息，在其他的数字出现前，都是 0。在这种场景下，一个更好的处理方式是只录入非 0 的信息，除此之外都是沙地。

假设你有一个 100 * 100 的地图，只有 3 棵树，你可以这样写：

```
trees = [[23,6], [37,21], [55,345]]
```

当创建地图时，遍历 `tree` 数组，设置树木图块，然后让其他的图块都是沙子的图片。这比写下 100 * 100 的二维数组简单得多。

当然，当你创建更多物体（树、灌木、草地、石头、水）的时候，这个方法将会牺牲很多编码速度，并且更难认出哪些物体放在了哪里。

## 小号，中号，大大大大号（XXXL）

如果你使用过 Flash MX 或更高的版本，你可能已经听说过神奇的魔法结构 XML。它和 HTML 类似，可以定义丰富的内容。你可以使用 XML 来保存地图数据，

下面的 XML 地图定义基于 Jobe Makar's 的著作《Macromedia Flash MX Game Design Demystified》。
让我们看一下 XML 下的简单地图：

```
<map>
	<row>
		<cell type="1">
		<cell type="1">
		<cell type="1">
	</row>
	<row>
		<cell type="1">
		<cell type="4">
		<cell type="1">
	</row>
	<row>
		<cell type="1">
		<cell type="1">
		<cell type="1">
	</row>
</map>
```

我们设置了一个 3 * 3 地图，首先有一个标记 `map`，内部是 3 个 `row` 节点，每个节点有 3 个 `cell` 子节点。

为了从外部文件加载地图，XML 是一个比较好的解决方案，因为大部分 XML 解析工作可以使用 Flash MX 内部函数。从文本文件中读取二维数组却没有这么简单，每次都要自行从字符串中解析加载变量并且分割为数组，非常的慢。

你也可以看到 XML 的缺点：它的文件更大，并且你需要 Flash 6 版本以上的播放器。

本文以下的例子都是用二维数组来保存地图数据，使用 `objects` 创建瓦片信息，详情参考章节 **地图格式**。

# 创建瓦片地图

## 创建瓦片地图

正如你在章节 **地图格式** 里看到的，我们将使用二维数组保存地图。现在我们将把瓦片显示在屏幕上，将他们设置在正确的位置，显示正确的帧图片。这个 Flash 将会像这样：

<iframe id="iframe_p5" width="240"
  height="180" src="http://www.surebrz.com/origin/html/p5.html"></iframe>

[swf](http://www.gotoandplay.it/_articles/2004/02/tonypa/img/p05_1.swf) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p05_1.swf)

首先定义对象和变量：

```
myMap = [
[1, 1, 1, 1, 1, 1, 1, 1],
[1, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 1, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 1, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 1],
[1, 1, 1, 1, 1, 1, 1, 1]
];
 
game={tileW:30, tileH:30};
 
//walkable tile
game.Tile0 = function () {};
game.Tile0.prototype.walkable = true;
game.Tile0.prototype.frame = 1;
 
//wall tile
game.Tile1 = function () {};
game.Tile1.prototype.walkable = false;
game.Tile1.prototype.frame = 2;

```

这样，我们将地图保存到变量 `myMap` 中，地图定义之后的一行定义了对象 `game`，我们将使用这个对象来管理我们需要的所有物件。我们可以将这些物件放在 _root 或其他什么地方，但是将他放在指定的变量中可以更加清晰地想起来它在哪。

注意我们为 `game` 对象设置了 2 个属性 `tileW = 30` `tileH = 30`，指出我们所有的瓦片尺寸有多大。瓦片并不一定是正方形，你也可以使用宽矩形或高矩形，当我们想要知道瓦片的尺寸时，我们可以这么写：

```
game.tileW;
game.tileH;
```

当我们想要改变瓦片尺寸时，只需要修改对应行的代码。

接下来我们设置了 `game` 对象内的原型（prototype）：

```
game.Tile0 = function () {};
game.Tile0.prototype.walkable = true;
game.Tile0.prototype.frame = 1;
```

第一行的 `game.Tile0= function () {}` 声明了一个新的对象原型，当我们从地图数据数组中取到 0 时，我们使用 `Tile0` 作为模板，在那个位置创建新瓦片。

接下来的两行为使用 `Tile0` 原型创建出来的对象设置属性。我们将让这些对象拥有属性 `walkable = true` （这意味着可以通过）以及 `frame = 1` （将会显示影片剪辑中第 1 帧的图片）。

## 显示我们的地图

你准备好创建瓦片了吗？我们将编写 `buildMap` 方法来处理所有的瓦片。如果你想创建更多关卡，可以使用相同的方法处理不同的地图数组。`buildMap` 方法将会做以下的工作：

1. 加载影片剪辑
2. 遍历地图数组
3. 给每个瓦片创建对象
4. 给每个瓦片加载影片剪辑
5. 把瓦片放在对应的位置
6. 显示正确的瓦片帧图片

以下是代码：

```
function buildMap (map)
{
	_root.attachMovie("empty", "tiles", ++d);
	game.clip = _root.tiles;
	var mapWidth = map[0].length;
	var mapHeight = map.length;
	for (var i = 0; i < mapHeight; ++i)
	{
		for (var j = 0; j < mapWidth; ++j)
		{
			var name = "t_" + i + "_" + j;
			game[name] = new game["Tile" + map[i][j]];
			game.clip.attachMovie("tile", name, i * 100 + j * 2);
			game.clip[name]._x = (j * game.tileW);
			game.clip[name]._y = (i * game.tileH);
			game.clip[name].gotoAndStop(game[name].frame);
		}
	}
}
```

方法定义的第一行设置方法的参数为 `map` 变量，当我们调用时，将 map 数组传给方法，变量 `map` 应该是一个二维数组。

下一行将影片剪辑绑定到舞台容器上：

```
_root.attachMovie("empty", "tiles", ++d);
```

你需要在 library 中创建一个空白（empty）的影片剪辑（没有图片）。右键单击影片剪辑，选择 “Linkage...” 勾选 "Export this symbol"，然后在 ID 框中输入 `empty`。现在，绑定影片剪辑的命令将会搜索名为 `empty` 的影片剪辑。它将在舞台上创建一个新的实例，名为 “tiles”。那个影片剪辑将会处理我们要在舞台上放置的所有瓦片。使用容器影片的好处是当我们想要移除瓦片（比如当游戏结束）时，我们只需要移除影片剪辑 `tiles` ，所有的瓦片都会消失。而如果你把所有的瓦片直接加载到 `_root` 上，当运行到下一帧（比如游戏结束帧）时，加载的瓦片并不会消失，你需要使用 ActionScript 来删除它们。

当我们为瓦片创建影片剪辑后，我们还需要将他绑定给我们的 `game` 对象 `game.clip = _root.tiles`。当我们想把 `tiles` 放在其他地方的时候，只需要修改这一行而不必修改所有代码。

接着我们设置两个变量 `mapWidth` 和 `mapHeight`。我们将用它们遍历地图数组。`mapWidth` 变量的值是地图数组第 1 个元素值的长度 `map[0].length`。如果你忘记了地图数组的内容格式，可以回看 **地图格式** 章节。第一个元素是另一个数组 `[1, 1, 1, 1, 1, 1, 1, 1]`，`mapWieth` 将会是它的数组长度，或者说数字的个数。现在我们知道地图的宽度了。

使用同样的方法可以获取 `mapHeight` 的值，即 `map.length` 也就是地图数组的行数。这也是我们要创建的地图行数。

我们使用下边的代码循环遍历地图数组：

```
for (var i = 0; i < mapHeight; ++i)
{
	for (var j = 0; j < mapWidth; ++j)
	{
		...
	}
}
```

我们让变量 `i` 从 0 循环至小于地图的高度，变量 `j` 从 0  循环至小于地图宽度。

变量 `name` 在 `var name = "t_"+i+"_"+j` 中给我们的新瓦片对象设置名称。假如 `i` 为 0，`j` 为 1，那么 `name` 的值为 `"t_0_1"`，假如 `i` 为 34，`j` 为 78，那么 `name` 的值为 `"t_34_78"`。

截下来我们创建新的瓦片对象：

```
game[name] = new game["Tile"+map[i][j]]
```

左边的 `game[name]` 将会表示放在 `game` 对象中的新瓦片对象，`map[i][j] ` 的值是根据 `i` 和 `j` 取到的地图数组的值（0、1），我们使用关键字 `new` 来根据之前定义的原型（Tile0、Tile1）创建瓦片对象。现在我们拥有当前瓦片对应的的瓦片对象了。

在下一行中，我们将新的影片剪辑加载到舞台中，使用 `game.clip[name]` 来访问它。影片剪辑将通过 `i`、`j` 与 瓦片图片宽高相乘后被放在正确的 x/y 坐标中，由于我们的瓦片对象继承了原型中的“frame”属性，我们可以使用它来通过 `gotoAndStop` 命令显示正确的帧图片。

当想要通过地图数组创建瓦片时，我们可以这样调用 `buildMap` 方法：

```
buildMap(myMap);
```

你可以在这里下载本章节的代码：[fla](http://www.gotoandplay.it/_articles/2004/02/tonypa/creatingTiles.fla) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/creatingTiles.fla)

# 英雄

## 英雄

没有不存在英雄的游戏。我们的英雄会拯救世界，救出公主，打败坏人。我们也会在游戏里加入英雄，他暂时还不能拯救世界，他什么有用的事都还不会做，但他就在这里：

<iframe id="iframe_p6" width="240"
  height="180" src="http://www.surebrz.com/origin/html/p6.html"></iframe>
  
[swf](http://www.gotoandplay.it/_articles/2004/02/tonypa/img/p06_1.swf) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p06_1.swf)

英雄是一个红色方块 :) 啥，他看起来不强？那你可以自己画出来你的英雄。他的影片剪辑在库里叫做 “char”，不要让英雄的影片剪辑比瓦片的尺寸更大。

另外记住，英雄的影片剪辑（红色方框）锚点在中间，而瓦片的在左上角：

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p06_2.gif)

想要一些代码吗？在 `tiles` 的定义后边加入这行：

```
char={xtile:2, ytile:1};
```

这段代码定义了一个新的 `char` 对象。 `char` 对象将会处理我们角色的所有信息，比如怎么移动，感觉舒不舒服，以及吃啥。

这次我们只给了 `char` 对象 2 个属性，`xtile` 和 `ytile`，用以表示我们的英雄站在那个瓦片上。当他移动时，我们会更新 `xtile/ytile` 属性，我们一直都知道英雄脚下是什么瓦片。比如，当 `xtile = 2`、`ytile = 1` 时（就像上边代码里那样），英雄站在瓦片 `"t_1_2"` 上。当你观察示例时，你可以看到英雄站在从左往右数第 3、从上往下数第 2 格的位置。瓦片序号从0开始计数。

接下来我们会给英雄添加更多的属性。

为了把英雄的视频剪辑加入舞台中，`buildMap` 方法的 for 循环后要加入下边的代码：

```
game.clip.attachMovie("char", "char", 10000);
char.clip = game.clip.char;
char.x = (char.xtile * game.tileW) + game.tileW / 2;
char.y = (char.ytile * game.tileW) + game.tileW / 2;
char.width = char.clip._width / 2;
char.height = char.clip._height / 2;
char.clip._x = char.x;
char.clip._y = char.y;
```

代码的第一行从库中加载了一个新的影片剪辑到 `game.clip` 里（你还记得我们在上一章节中把 _root.tiles 保存在了 `game.clip` 里），然后将实例命名为 `char`。

然后我们把 `char` 影片剪辑（game.clip.char）保存到 `char` 对象（char.clip）里，这样每次我们想要取得该影片剪辑的时候，可以简单的用 `char.clip` 代替完整的形式： `_root.tiles.char`。这样也避免了当我们想把 `char` 视频剪辑放到别的地方的时候，修改所有的代码。

接下来我们将会计算 `char` 对象的属性： `x` 和 `y`。你也许会好奇，我们已经有了 `xtile` 和 `ytile`，为什么我们还需要更多属性，记住，`xtile` 和 `ytile` 是图块的序号，`x` 和 `y` 属性是我们 `char` 影片剪辑的像素坐标。在给影片剪辑设置位置的时候，使用变量把像素坐标先记录下来是一个比较好的做法，你也许会需要改变英雄的位置，比如他撞到了墙壁或者失去平衡，修改变量的值比直接修改 `_x/_y` 会更加便捷。

我们这样计算英雄的实际位置：将瓦片的序号乘以瓦片的宽度，加上瓦片尺寸的一半来让英雄站在瓦片中心。因此，`char.xtile * game.tileW` 就是水平方向上瓦片的序号诚意瓦片的宽度。

接下来我们把英雄影片剪辑的宽高的一半保存在 `char` 对象中，这在我们计算英雄包围盒的时候会非常有用。记住，你可以构造你自己的包围计算方式，不一定是影片剪辑的宽高，有的图片可能会有会和墙壁碰撞的长发，这时要用你自己需要的 `width` 和 `height` 变量的值。

最后两行把视频剪辑 `char.clip` 放在计算出的 `x`、`y` 坐标上。

你可以在这里下载本章节的代码：[fla](http://www.gotoandplay.it/_articles/2004/02/tonypa/theHero.fla) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/theHero.fla)

# 按键移动

## 按键移动

这个章节中我们将使用 4 个方向键移动我们的英雄。在移动时他将面向移动的方向并播放动画。当他站着不动的时候动画将会停止。你可以在这里试试效果：

<iframe id="iframe_p7" width="240"
  height="180" src="http://www.surebrz.com/origin/html/p7.html"></iframe>

[swf](http://www.gotoandplay.it/_articles/2004/02/tonypa/img/p07_1.swf) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p07_1.swf)

本例中没有碰撞检测，因此英雄可以移动到舞以外，不过先不要担心，我们在接下来的章节中会处理这个问题。

首先创建我们的英雄角色。新建 3 个影片剪辑，你将会使用一个影片剪辑作为向左或向右方向的移动动画（我使用向左移动的动画），一个向上移动，一个向下移动。在这些影片剪辑中设置你的移动动画。

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p07_2.gif)

这些影片剪辑不需要写代码。

现在编辑你的 `char` 影片剪辑，创建 5 个关键帧

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p07_3.gif)


在第 1 个关键帧中放入 `char_up` 影片剪辑，第 2 个关键帧放入 `char_left` 影片剪辑，第 4 个放入 `char_right`，第 5 个放入 `char_down`。向左和向右的动作可以用相同的影片剪辑，只需要将其中一个水平翻转。现在，确认每个移动动画的示例拥有实例名 `char`。再检查一下关键帧 1 2 4 5，是否都命名为 `char`？别担心，如果你现在还不明白为什么这些动作放在这几个帧里，没关系，后续我们在移动的代码中会解释的。

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p07_4.gif)


好了，到了代码时间。

## 编码

我们的英雄将会移动，而移动需要指定移动速度。因此给我们的英雄对象增加一个速度属性：

```
char = {xtile:2, ytile:1, speed:4};
```

速度是我们的英雄在屏幕中移动的像素的数值。数值越高他移动的越快，越低移动的越慢。使用整数作为速度是一个比较好的实践，而使用小数会使得计算结果非常奇怪，你也看不出 10 像素和 10.056873 像素的区别。

你应该还记得（如果不记得的话，请回顾上一章节），我们创建了 `_root.char` 来处理英雄的信息，并且将 `char` 视频剪辑放在了 `tiles` 影片剪辑里。为了把我们的英雄叫起来移动，我们需要两个新的函数，以及一个用于检查按键输入情况的影片剪辑控制器。

将一个 `empty` 影片剪辑拖到舞台上，你可以把它放在视野以外的地方。它只是用来做函数调用的，放在哪都没有关系。给这个影片剪辑添加这些代码：

```
onClipEvent (enterFrame)
{
	_root.detectKeys();
}
```

你可以看到，每一帧我们都会调用函数 `detectKeys`，下边我们给它编写代码：

```
function detectKeys()
{
	var ob = _root.char;
	var keyPressed = false;
	if (Key.isDown(Key.RIGHT))
	{
		keyPressed = _root.moveChar(ob, 1, 0);
	}
	else if (Key.isDown(Key.LEFT))
	{
		keyPressed = _root.moveChar(ob, -1, 0);
	}
	else if (Key.isDown(Key.UP))
	{
		keyPressed = _root.moveChar(ob, 0, -1);
	}
	else if (Key.isDown(Key.DOWN))
	{
		keyPressed = _root.moveChar(ob, 0, 1);
	}
	if (!keyPressed)
	{
		ob.clip.char.gotoAndStop(1);
	}
	else
	{
		ob.clip.char.play();
	}
}
```

首先我们定义 2 个变量，设置 `ob` 来指代 `_root.char`（记住，这个是我们用来处理英雄信息的变量），设置 `keyPressed` 为 `false`，用来后边判断是否按下了按键。

接下来有 4 个相似的代码段，每个都用来判断一个方向键是否按下。如果按下了方向键，他们会调用另一个函数 `moveChar`，像这样：

```
keyPressed = _root.moveChar(ob, 1, 0);
```

这行调用 `moveChar` 函数，使用 3 个参数：第一个是变量 ob，表示我们的 `char` 对象，后两个会传入 -1、1 或 0，用来说明我们的英雄是通过修改 `x` 坐标来水平移动（第二段），还是通过修改 `y` 坐标来垂直移动（第三段）。我们将返回值赋给变量 `keyPressed`，后边你会很快看到 `moveChar` 函数总是返回 `true`，如果有任何方向键被按下，变量 `keyPressed` 都会被赋值为 `true`。

最后一段代码检查变量 `keyPressed` 的值，如果是 `false`，表示没有按下方向键，也就是说我们用 `gotoAndStop(1)` 来停止行走动画。如果值为 `true`，我们将会继续播放行走动画。

接着是第二个函数：

```
function moveChar(ob, dirx, diry)
{
	ob.x += dirx * ob.speed;
	ob.y += diry * ob.speed;
	ob.clip.gotoAndStop(dirx + diry * 2 + 3);
	ob.clip._x = ob.x;
	ob.clip._y = ob.y;
	return (true);
}
```

可以看到，`moveChar` 函数接受 3 个参数，变量 `ob` 是要移动的对象，`dirx` 和 `diry` 是表示在 x 或 y 坐标轴上移动的距离，这是一个非常通用的函数，我们可以使用它来移动游戏里的所有物品，如果我们有飞行的子弹，我们可以调用 `moveChar` 函数，传入子弹的飞行方向，如果有移动中的敌人，我们也可以再次使用这个函数来让他移动。

下两行将 `ob.speed` 加到对象的 `x` 或 `y` 变量上，同样的，如果我们传不同的对象（子弹或敌人），他们会有不同的速度。当我们检测到右方向键按下时，使用 `1, 0` 调用 `moveChar`，此时 `dirx = 1`，`diry = 0`。这时 `x` 将加上速度的值，而 `y` 保持不变。如果我们用 `0, -1` （上方向键）调用，那么 `y` 将减去速度的值，`x` 保持不变。

记住，如果我们有更多的移动条件，比如碰撞或者重力，我们会在这里计算 `x` 和 `y` 的值，这个操作会在真正修改影片剪辑的坐标值之前。这也比直接使用 `mc.hitTest` 更好。

下边这行代码：

```
ob.clip.gotoAndStop(dirx + diry * 2 + 3);
```

让角色的影片剪辑设置到正确的朝向上。你可以计算一下 `dirx/diry` 的所有情况（只有 4 组不同的情况，并不难计算），你会看到朝向对应的帧序号和我们在文章一开始设置的正好一致。

没有计算器是吧？让我们来看下这是怎么工作的：`→` 右方向键按下时，`dirx = 1`, `diry = 0`，找一下对应的帧序号：`diry * 2 = 0`，`dirx + 0 + 3` = `1 + 3` = `4`，将会显示第 4 帧，而第 4 帧是我们设置的 `char_right` 动画。

下边 2 行将 `x/y` 变量传给影片剪辑的 `_x/_y` 坐标。

最后，我们将函数返回 `true`，使得 `keyPressed` 变量拥有正确的值。

与墙壁的碰撞将在下一章实现，那会非常有趣 :)

你可以在这里下载本章节的代码：[fla](http://www.gotoandplay.it/_articles/2004/02/tonypa/keysToMove.fla) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/keysToMove.fla)

# 墙壁碰撞

## 墙壁碰撞

英雄只会行走却不会撞墙，这一点也不好玩。我们得让英雄感受一下硬邦邦砖墙或是别的什么不能行走的瓦片的力量。

<iframe id="iframe_p8" width="240"
  height="180" src="http://www.surebrz.com/origin/html/p8.html"></iframe>

[swf](http://www.gotoandplay.it/_articles/2004/02/tonypa/img/p08_1.swf) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p08_1.swf)

在第一章中，我们给瓦片设置了 `walkable` 属性，当表示某位置瓦片的对象的 `walkable` 属性设置为 `false` 时，英雄将不能移动到那里。当设置为 `true` 时，可以移动到那（这就是“逻辑”，小学就学过了，不过有些人大学才学，可怜的娃）。

为了让这个魔法生效，我们要这样做：当方向键被按下时，我们先判断对应的瓦片是否可以行走，如果可以，我们就让英雄移动，如果不能行走（墙壁），我们就忽略那次的按键。

这是一个完美的碰撞的例子：

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p08_2.gif)


英雄站在墙边，并且下一步就会进到那个方向的墙内部。我们不能让这种情况发生，所以，嘿，别动！但是这个世界并不完美，假如只是英雄身体的一部分碰撞了：

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p08_3.gif)


这就需要我们计算英雄 4 角的碰撞。如果任何角（这个例子里是左下角）将会进入墙内，我们就让英雄停下。

或者如果英雄还没有紧邻墙壁，但是下一步也会进入到墙内：

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p08_4.gif)


那么我们就让英雄紧贴着墙：

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p08_5.gif)


“噢不！”你也许要哭了，“这根本做不到！”别担心，其实并不难。

## 让我看看四个角

我们不想让英雄身体的任何部分进到墙里，所以我们不得使用不止一个点，而是 4 个点来检查英雄和不可行走瓦片的碰撞，我们用拐角的 4 点来做检查，因为大部分英雄都是矩形（没错！）。

为了实现这个功能，我们新建一个函数 `getMyCorners`：

```
function getMyCorners (x, y, ob)
{
	ob.downY = Math.floor((y + ob.height - 1) / game.tileH);
	ob.upY = Math.floor((y - ob.height) / game.tileH);
	ob.leftX = Math.floor((x - ob.width) / game.tileW);
	ob.rightX = Math.floor((x + ob.width - 1) / game.tileW);

	//check if they are walls 

	ob.upleft = game["t_" + ob.upY + "_" + ob.leftX].walkable;
	ob.downleft = game["t_" + ob.downY + "_" + ob.leftX].walkable;
	ob.upright = game["t_" + ob.upY + "_" + ob.rightX].walkable;
	ob.downright = game["t_" + ob.downY + "_" + ob.rightX].walkable;
}
```

这个函数有 3 个参数：`x/y` 表示舞台上 object 的中心点坐标（像素坐标），以及 `object`。等等，你也许会好奇，我们明明已经知道了 `object` 的 `x/y` 坐标，就存在 `char` 对象里呀？没错，但是我们保存的是 `char` 的 **当前** 位置，这里我们要计算的是它 **将要移动到** 的位置。

首先，我们计算出角色要移动的瓦片。他可能中心在一个瓦片上而左侧的边在另一个瓦片上，而他的最高点（头顶）可能在第三个瓦片上。将变量 `y` 加上英雄的高度，然后除以瓦片的高度，我们就得到了他的最低点（`downY`）所站在的瓦片。

最下边 4 行我们用计算出来的点来获取每个角所在的瓦片的 `walkable` 属性值，比如左上角 `upleft` 使用 `upY` 和 `leftX` 变量，就像你看到的，所有的点也都被存在了 `ob` 对象里，后边将会取出来用于移动 `char`。我想再次说明一下，`getMyCorner` 函数可以应用于任何可以移动的物体，不仅仅是英雄。

## 移动

当我们知道了角色四角即将进入的瓦片的类型后，就可以简单的编写 `char` 的移动了：如果所有角都是可行走的，就移动，否则就不动。另外还要做一件事，把英雄放在紧邻的要碰撞的墙边。我们修改 `moveChar` 函数来处理所有 4 种可能的方向，看起来可能比较复杂，不过大部分代码只是重复的 4 个方向的处理，让我们看一下函数内容：

```
function moveChar(ob, dirx, diry)
{
	getMyCorners (ob.x, ob.y + ob.speed * diry, ob);
	if (diry == -1)
	{
		if (ob.upleft and ob.upright)
		{
			ob.y += ob.speed * diry;
		}
		else
		{
			ob.y = ob.ytile * game.tileH + ob.height;
		}
	}
	if (diry == 1)
	{
		if (ob.downleft and ob.downright)
		{
			ob.y += ob.speed * diry;
		}
		else
		{
			ob.y = (ob.ytile + 1) * game.tileH - ob.height;
		}
	}
	getMyCorners (ob.x + ob.speed * dirx, ob.y, ob);
	if (dirx == -1)
	{
		if (ob.downleft and ob.upleft)
		{
			ob.x += ob.speed * dirx;
		}
		else
		{
			ob.x = ob.xtile * game.tileW + ob.width;
		}
	}
	if (dirx == 1)
	{
		if (ob.upright and ob.downright)
		{
			ob.x += ob.speed * dirx;
		}
		else
		{
			ob.x = (ob.xtile + 1) * game.tileW - ob.width;
		}
	}
	ob.clip._x = ob.x;
	ob.clip._y = ob.y;
	ob.clip.gotoAndStop(dirx + diry * 2 + 3);
	ob.xtile = Math.floor(ob.clip._x / game.tileW);
	ob.ytile = Math.floor(ob.clip._y / game.tileH);
	return (true);
}
```

就像往常一样，`moveChar` 函数接收 `object` 和键盘检测后的方向，下边这行：

```
getMyCorners (ob.x, ob.y + ob.speed * diry, ob);
```

对垂直方向的拐角点（`diry` 不等于 0）进行计算，计算以后，我们使用每个瓦片的 `walkable` 属性来判断影像是否可以走上去：

```
if (diry == -1)
{
	if (ob.upleft and ob.upright)
	{
		ob.y += ob.speed * diry;
	}
	else
	{
		ob.y = ob.ytile * game.tileH + ob.height;
	}
}
```

这个代码块用来处理向上的移动。当按下 `↑` 上方向键时，`diry` 的值为 `-1`，我们使用 `getMyCorner` 函数计算后的 `ob.upleft` 和 `ob.upright` 来判断是否可行走，如果都是 `true`，那么左上和右上的瓦片都可以行走，我们就让 `char` 像之前一样通过将 `y` 坐标加上 `speed * diry` 来移动。

但是如果一个角即将进入墙内，`ob.upleft` 或者 `ob.upright` 是 `false` 时，我们把那个对象放在紧贴着墙的位置上。对于紧邻上方墙的 `char` 来说，他的中心将会被设置成距离下边框 `char.height` 这么远的地方（`char.height` 的值为 `char.clip.height / 2`，参考“英雄”那个章节）。

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p08_6.gif)

`ob.ytile * game.tileH` 将会把角色中心放在两个图块的边线上，然后加上 `height` 属性的值来让他下移。使用同样的方法让 `moveChar` 函数处理向下（`diry == 1`）、向左（`dirx == -1`）、向右（`dirx == 1`）的情况。

最后一行将角色的影片剪辑放置在计算后的坐标上，让角色显示正确的帧动画，计算角色新的中心点瓦片（`xtile`、`ytile`）。和上节一样，函数返回 `true`。

你可以在这里下载本章节的代码：[fla](http://www.gotoandplay.it/_articles/2004/02/tonypa/hitTheWall.fla) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/hitTheWall.fla)

# 开门

## 开门

你能在一个房间里呆多久呢？你可以盯着同一张图片看多久？对，我们需要更多的房间来探索，也就是说，我们需要一个方法变更地图，从瓦片信息中创建新地图，然后把英雄放在正确的位置。

<iframe id="iframe_p9" width="240"
  height="180" src="http://www.surebrz.com/origin/html/p9.html"></iframe>

[swf](http://www.gotoandplay.it/_articles/2004/02/tonypa/img/p09_1.swf) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p09_1.swf)

为了创建两个房间，我们要定义两个地图：

```
myMap1 = [
[1, 1, 1, 1, 1, 1, 1, 1],
[1, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 1, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 1, 0, 1],
[1, 0, 0, 0, 0, 0, 0, 2],
[1, 1, 1, 1, 1, 1, 1, 1]
];


myMap2 = [
[1, 1, 1, 1, 1, 1, 1, 1],
[1, 0, 0, 0, 0, 0, 0, 1],
[1, 0, 1, 0, 0, 0, 0, 1],
[1, 0, 0, 0, 0, 1, 0, 1],
[3, 0, 0, 0, 0, 0, 0, 1],
[1, 1, 1, 1, 1, 1, 1, 1]
];
```
在 `game` 对象中我们也要记下当前地图的编号：

```
game={tileW:30, tileH:30, currentMap:1}
```

这样，我们就从 `myMap1` 开始探索。调用 `buildMap` 函数吧，我们计算地图信息时需要使用 `_root["myMap" + game.currentMap]`，当 `currentMap` 为 1 时，我们就取到了 `myMap1`：

```
buildMap(_root["myMap" + game.currentMap])
```

接着，我们需要一个新对象来表示 `门`：

```
game.Doors = function (newmap, newcharx, newchary)
{
	this.newmap = newmap;
	this.newcharx = newcharx;
	this.newchary = newchary;
};
game.Doors.prototype.walkable = true;
game.Doors.prototype.frame = 3;
game.Doors.prototype.door = true;
game.Tile2 = function () { };
game.Tile2.prototype = new game.Doors(2, 1, 4);
game.Tile3 = function () { };
game.Tile3.prototype = new game.Doors(1, 6, 4);
```

你已经猜到啦，门的瓦片可以踩上去，他显示第 3 帧图片，他有一个新的 `door` 属性并且为 `true`。我们将使用这个属性来判断英雄是否站在门上。

门使用了一种叫做 `继承` 的东西，听起来很可怕，不过其实是一个很好用的东西。`doors` 对象全都使用 `Doors` 模版，所有包含门的瓦片继承了 `door` 的所有属性，比如他们都是可以行走的图块，并且显示第 3 帧图片。

我们创建的所有门都必须有下列信息：下一个要显示的地图编号，角色的新的 `x` 和 `y` 坐标。如果你不把角色移动到新位置，那么地图的瓦片变化了，但是英雄还站在原来的地方，这看起来并不合理。另外，需要避免英雄在新地图中被放在门所在的位置上。如果新的 `x/y` 坐标依然是门，当角色移动时，新地图的门就会把英雄重新传送回来。记住，把英雄放在新地图的门旁边的瓦片上！

创建新的 `Doors` 对象时，我们传入 3 个参数：`newmap`、`newcharx`、`newchary`，之后这些变量会被保存在他的属性中。当数字 2 设置在 `map` 数组里时，我们知道它将被用 `Tile2` 来创建瓦片，而 `Tile2` 对象将拥有 `Doors` 的所有属性。`Tile2` 对象将会给 `Doors` 传入 `newmap = 2`，所以会将英雄传送到 `map2`。你可以在一个地推设置不止 1 扇门，你也许会希望在不同的地图里设置 `Tile2` 类型的门，他们都会把英雄传送到 `map2`。

## 更多代码

在 `moveChar` 函数中，将以下代码添加到末尾 `return true` 之前：

```
if (game["t_" + ob.ytile + "_" + ob.xtile].door and ob == _root.char)
{
	changeMap(ob);
}
```

当我们移动了 `char`（或者别的可以移动的物品）之后，我们将会检查它所站的瓦片是否是门。同时因为我们不想让子弹或者敌人踩到门上时切换地图，我们也会同时检查当前物品是否是英雄。我们用 `changeMap` 函数来处理地图切换：

```
function changeMap(ob)
{
	var name = "t_" + ob.ytile + "_" + ob.xtile;
	game.currentMap = game[name].newMap;
	ob.ytile = game[name].newchary;
	ob.xtile = game[name].newcharx;
	ob.frame = ob.clip._currentframe;
	buildMap(_root["myMap" + game.currentMap]);
}
```
这段代码需要认真看一下，从门的瓦片上取到 `currentMap`、`ytile` 和 `xtile` 的值，新的 `ob.frame` 属性将会保存英雄当前的方向数据，没有这段的话我们的英雄每次切换地图都会变成第 1 帧的图片。在 `buildMap` 方法设置了 `char` 的影片剪辑后需要使用这行代码：

```
char.clip.gotoAndStop(char.frame);
```
以上，创建一些地图然后和门玩耍吧。

你可以在这里下载本章节的代码：[fla](http://www.gotoandplay.it/_articles/2004/02/tonypa/openDoors.fla) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/openDoors.fla)

# 跳跃

## 跳跃

让我们把我们的游戏从顶视角转为侧视角，然后增加跳跃功能。在这个例子中，我们会从侧面观察，我们的英雄可以用左右键移动，也可以用空格键跳跃，就像这样：

<iframe id="iframe_p10" width="240"
  height="180" src="http://www.surebrz.com/origin/html/p10.html"></iframe>

[swf](http://www.gotoandplay.it/_articles/2004/02/tonypa/img/p10_1.swf) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p10_1.swf)


## 基本跳跃

跳跃从举高高开始，你还记得，向上在 Flash 的舞台上意味着 `y` 坐标的减少。因此，我们这样计算： `new_y = current_y - jumpspeed`。如果我们这么计算一次，英雄就会向上移动 `jumpspeed` 的距离然后停在那里。没错，我们需要一直在英雄跳跃旗舰一直计算新的 `y` 值，但是我们必须让 `jumpspeed` 变化，否则我们的英雄就飞到天上再也回不来了。

为了计算 `jumpspeed`，我们需要定义新的变量“重力” `gravity`。重力把英雄拉回到地面，向下。在每步计算中我们都会给 `jumpspeed` 增加 `gravity` 的值：`jumpspeed = jumpspeed + gravity`，你可以改变 `gravity` 的数值，如果你让重力变少，英雄就飞得更高（就像泡泡），增加 `gravity`，英雄就会更快地落地（就像石头）。因为我们有很多的物体，你可以赋予他们不同的重力值。

让我们看一个例子，`jumpspeed` 以 -10 开始，`gravity` 以 2 开始，首先，英雄向上移动 10 像素，然后 `jumpspeed` 变成了 -8，下一步，向上移动 8 像素，`jumpspeed` 变为 6。几步以后，`jumpspeed` 变为 0，意味着英雄不会再向上移动了，下一步 `jumpspeed` 变为正数，英雄将开始下落。

但是当英雄在跳跃的过程中撞到了固体瓦片（墙），如果英雄是向上撞墙，我们需要把 `jumpspeed` 设置为 0，然后英雄开始下落，如果是向下撞墙，表示他落在地上，跳跃结束了。

在基于瓦片的游戏中，需要注意，速度的值不能大于瓦片的尺寸。如果英雄速度很高，将会无法检测下一个瓦片，而且可能传过墙壁，也许有的魔法师可以穿墙，但是在游戏里这通常是个 bug。

正如你见到的，跳跃不会在水平方向上起效，水平方向的处理还和往常一样，我们只需要检查左右移动后英雄脚下是否还是固体瓦片，如果不是，他将会下落。

## 做我的英雄

我们给角色增加一些属性：

```
char = {xtile:2, ytile:1, speed:4, jumpstart:-18, gravity:2, jump:false};
```

`speed` 属性设置了左右移动的速度，`jumpstart` 是开始跳跃时的跳跃速度，`gravity` 将会把英雄拉回地面，`jump` 用来表示英雄现在是在跳跃（`jump = true`）还是站在/走在/跑在/坐在地上（`jump = false`）。

下边一行将修改 `buildMap` 函数中我们设置了英雄的起始位置以后的部分。在以前的例子中，我们把英雄放在了瓦片中央的位置，但是这样一来我们的英雄在地图加载后会总是一开始就处在掉落的状态。我们将让英雄站在起始瓦片的边缘（别忘了把设置 `char.height` 后的那行移除）：

```
char.y = ((char.ytile + 1) * game.tileW) - char.height;
```

`changeMap` 和 `getMyCorners` 函数没有变化。

## 给我翅膀

让我们从按键检测函数开始吧，我们需要增加空格键的检测，移除上下键的检测。

```
function detectKeys()
{
	var ob = _root.char;
	var keyPressed = false;
	if (Key.isDown(Key.SPACE) and !ob.jump)
	{
		ob.jump = true;
		ob.jumpspeed = ob.jumpstart;
	}
	if (Key.isDown(Key.RIGHT))
	{
		keyPressed = _root.moveChar(ob, 1, 0);
	}
	else if (Key.isDown(Key.LEFT))
	{
		keyPressed = _root.moveChar(ob, -1, 0);
	}
	if (ob.jump)
	{
		keyPressed = _root.jump(ob);
	}
	if (!keyPressed)
	{
		ob.clip.char.gotoAndStop(1);
	}
	else
	{
		ob.clip.char.play();
	}
}
```

你可以注意到，我们不会让角色在跳跃中可以再次跳跃（`!ob.jump`），空格键检测只会在一次新的跳跃中生效。如果按下了空格，英雄还没在跳跃状态，我们将设置变量 `jump` 为 `true` 然后给英雄一个起始速度。

在左右键按下以后我们会检查变量 `jump` 是否为 `true`，如果是，我们将调用新的 `jump` 函数（`jump` 函数不是变量 `jump`，我名字取得有点问题，抱歉）。这个函数只要 `jump` 为 `true` 每帧都会调用，所以我们的英雄即使空格键没有按也会持续处在跳跃中。

`jump` 函数将会给当前的 `jumpspeed` 加上重力的值，他会检查跳跃的速度有没有变得太大，如果是这样，他会把速度调整为瓦片的尺寸，最后一行会调用 `moveChar` 函数。

```
function jump (ob)
{
	ob.jumpspeed = ob.jumpspeed + ob.gravity;
	if (ob.jumpspeed > game.tileH)
	{
		ob.jumpspeed = game.tileH;
	}
	if (ob.jumpspeed < 0)
	{
		moveChar(ob, 0, -1, -1);
	}
	else if (ob.jumpspeed > 0)
	{
		moveChar(ob, 0, 1, 1);
	}
	return (true);
}
```

同时我们需要修改 `moveChar` 函数，在上一章里我们使用 `ob.speed` 来修改角色的位置，不过现在我们也需要 `jumpspeed`，而它每帧都在变化。修改 `moveChar` 方法的起始部分：

```
function moveChar(ob, dirx, diry, jump)
{
	if (Math.abs(jump) == 1)
	{
		speed = ob.jumpspeed * jump;
	}
	else
	{
		speed = ob.speed;
	}
	...
```

当 `moveChar` 是被 `jump` 函数调用时，`jump` 参数的值是 1 或 -1，该变量将会让 `speed` 变量通过 `ob.jumpspeed` 来计算值。当是被左右键检测调用时，`speed` 将等于 `ob.speed`，之前使用 `ob.speed` 计算的地方要换成 `speed`。

在向上移动的代码中，如果与上方的墙壁碰撞了，我们会把 `jumpspeed` 的值改为 0：

```
ob.y = ob.ytile * game.tileH + ob.height;
ob.jumpspeed = 0;
```

在向下移动的部分中如果我们检测到脚下是墙，我们将 `jump` 设置为 `false`：

```
ob.y = (ob.ytile + 1) * game.tileH - ob.height;
ob.jump = false;
```

在左右移动的时候，我们增加一行代码，用来检测当英雄脚底离开了平台边缘时，他将会下落：

```
ob.x += speed * dirx;
fall (ob);
```

所以我们需要编写的最后一个函数是 `fall`：

```
function fall (ob)
{
	if (!ob.jump)
	{
		getMyCorners (ob.x, ob.y + 1, ob);
		if (ob.downleft and ob.downright)
		{
			ob.jumpspeed = 0;
			ob.jump = true;
		}
	}
}
```

在已经处于跳跃状态时，我们不会开始掉落，所以我们首先要检查 `jump` 变量是否为 `false`（英雄现在正站在地上）。如果我们站着，我们调用 `getMyCorners` 函数来检查英雄的四角，我们用 `ob.y + 1` 来检测比英雄坐标靠下 1 像素的地方是否可以行走，如果脚下两个角（左下和右下）都是可行走的瓦片，那意味着我们可爱的英雄站在空中了。

为了修正不能站在空气中的情况。我们强迫英雄开始跳跃，将 `jump = true`，但是与按下空格键不同，我们将起始的跳跃速度设置为 0，这样英雄就开始下落了。

你可以在这里下载本章节的代码：[fla](http://www.gotoandplay.it/_articles/2004/02/tonypa/jumping.fla) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/jumping.fla)

# 拟态墙壁

## 云

到目前为止，我们已经让英雄和墙壁有了碰撞，这很有趣，不过坚固的墙并不是我们可以创建的唯一一种墙。许多游戏中都有着一种“云”一样的墙，允许英雄从左右穿过它或跳到上边，但是当下落时，英雄会站在上面，看一下例子：

<iframe id="iframe_p11" width="240"
  height="180" src="http://www.surebrz.com/origin/html/p11.html"></iframe>

[swf](http://www.gotoandplay.it/_articles/2004/02/tonypa/img/p11_1.swf) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p11_1.swf)

注意到区别了吗？让我们看一下图片，这是一个普通的固体墙壁瓦片，英雄从任何方向都不能进入。

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p11_2.gif)

而这是一朵云，英雄可以从除了从上往下以外的任何方向进入这个瓦片。如果英雄蠢蠢地从上方进入，我们就把他放回到云顶：

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p11_3.gif)

我们首先设定一些拥有 `cloud` 属性的云，如果哪个瓦片的 `cloud` 为 `true`，它很显然是云类型的瓦片。定义如下属性：

```
game.Tile4 = function () {};
game.Tile4.prototype.walkable = true;
game.Tile4.prototype.cloud = true;
game.Tile4.prototype.frame = 4;
```

这个瓦片的 `walkable` 属性是 `true`，所以没错，英雄可以进入它，为了让英雄掉落时能站在上面，我们编写一个新的函数：

```
function checkIfOnCloud (ob)
{
	var leftcloud = game["t_" + ob.downY + "_" + ob.leftX].cloud;
	var rightcloud = game["t_" + ob.downY + "_" + ob.rightX].cloud;
	if (leftcloud or rightcloud)
	{
		return(true);
	}
	else
	{
		return(false);
	}
}
```

我们用左下角和右下角来检查物体是否站在 `cloud` 属性为 `true` 的瓦片上。如果有这样的瓦片，我们返回 `true`，如果都不是，返回 `false`。

然后我们需要在两个地方调用这个函数：`moveChar` 函数检查向下移动的地方和 `fall` 函数检查是否站在固体瓦片上或者他开始掉落的地方。

定位到 `moveChar` 函数 `if (diry == 1)` 那行后边的：

```
if (ob.downleft and ob.downright)
{
	...
```

增加云的检查：

```
if (ob.downleft and ob.downright and !checkIfOnCloud (ob))
{
	...
```

同样地替换 `fall` 函数的这行：

```
if (ob.downleft and ob.downright)
{
	...
```

为

```
if (ob.downleft and ob.downright and !checkIfOnCloud (ob))
{
	...
```

也就是说，在我们检查到左右下角都是可移动的瓦片（`ob.downleft` 和 ob.downright` 已经在 `getMyCorners` 函数里计算出来了）后，我们再增加一条：这些瓦片不能是云。

和云、太阳还有星星一起玩耍吧 :)

你可以在这里下载本章节的代码：[fla](http://www.gotoandplay.it/_articles/2004/02/tonypa/clouds.fla) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/clouds.fla)

# 梯子

## 梯子

梯子是平台游戏移动规则中很常见的一部分，英雄可以使用梯子来爬上爬下（我希望你知道这个事）。我们将会让角色能够在站在梯子旁时可以按上下键来攀爬：

<iframe id="iframe_p11" width="240"
  height="180" src="http://www.surebrz.com/origin/html/p12.html"></iframe>

[swf](http://www.gotoandplay.it/_articles/2004/02/tonypa/img/p12_1.swf) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p12_1.swf)

虽然梯子看上去很简单，不过还是有很多事情是需要注意的，比如首先，梯子会有哪些类型？

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p12_2.gif)

如图所示，有 4 种梯子的可能情况。A 的情况中梯子在不可行走的墙壁瓦片内部，英雄在 A 中可以做什么呢？他可以上下攀爬，但是由于卡在了墙内，他不能左右移动。你可以随便问一个卡在墙里的人，他们都说不好受。

在 B 中，梯子是可行走的，他的上下边也是梯子，所以英雄可以上下攀爬，也可以左右移动，不过当左右移动时，英雄会在离开梯子时开始掉落。

在 C 中，下方并没有梯子，所以英雄不能向下攀爬，他只能向上攀爬或者左右移动。

D 的情况在任何游戏中都不能出现。不过有的人可能会觉得这只是关卡设计得不好，梯子并没有连到什么地方，它在空中就中断了，那么英雄能爬到顶部站在梯子上吗？他能走到右侧固体瓦片上吗？

这些只是简单的几个例子，实际情况中会有非常多可能的梯子类型，我希望你能够明白，在开始写代码前，严谨地定义是有多么重要。大家的游戏各不相同，有些设计在一个游戏中非常完美，但放到另一个游戏中就变得浪费时间、能源，而且影响世界和平。

## 规则

让我们写一下英雄在梯子中的移动规则：

1. 英雄可以通过上下键在梯子中攀爬。
2. 当英雄顶部或底部中点是梯子时，他可以向上爬。
3. 当英雄底部中点是梯子时，他可以向下爬。
4. 当英雄的四角都不是墙时，他可以左右移动。
5. 英雄在梯子上时，可以跳跃。

完毕。

## 来个梯子

我们将会使用不同的影片剪辑来显示梯子瓦片，这样我们就不必给不同背景的梯子绘制不同的图片。请确认你的梯子影片剪辑勾选了 `Export this movie`，并且链接了 `ladder`。
<details>
  <summary>原文</summary>
  <pre><code> 
     We will use separate movie clip with ladder graphics that will be attached in the tile when tile has ladder. That way we dont have to draw different graphics for every ladder on different backgrounds. Make sure your ladder movie clip has "Export this movie" checked and it is linked as "ladder".
  </code></pre>
</details>

梯子的影片剪辑在与瓦片相同的高度绘制了梯子图片，并且放在水平中央的位置。

和其他瓦片一样，我们定义一下梯子对应的新瓦片类型：

```
game.Tile4 = function () {};
game.Tile4.prototype.walkable = false;
game.Tile4.prototype.frame = 2;
game.Tile4.prototype.ladder = true;
game.Tile4.prototype.item = "ladder";

game.Tile5 = function () {};
game.Tile5.prototype.walkable = true;
game.Tile5.prototype.frame = 1;
game.Tile5.prototype.ladder = true;
game.Tile5.prototype.item = "ladder";
```

这两个梯子类型显示不同的帧序号，但是都有设置为 `true` 的 `ladder` 属性（我们用它来检查英雄是否靠近梯子），同时，他们拥有值为 `"ladder"` 的 `item` 属性，我们用这个来将梯子图片加载到瓦片上。

在 `buildMap` 函数中设置帧图像以后，加载梯子的影片剪辑：

```
game.clip[name].gotoAndStop(game[name].frame);
if (game[name].item != "")
{
	game.clip[name].attachMovie(game[name].item, "item", 1);
}
```

这段代码检查当前的瓦片是否有 `item` 属性值，如果有值，就加载链接名字为 `item` 值的影片剪辑，然后这个实例将会被命名为 `"item"`。你可以用这个方法加载别的物体，只要别在同一个瓦片上放太多的物体。

为了不把代码写两遍，让我们把 `moveChar` 函数的结尾拆到新的 `updateChar` 函数里，`moveChar` 函数将会这样结尾：

```
updateChar (ob, dirx, diry);
return (true);
```

而 `updateChar` 函数如下：

```
function updateChar (ob, dirx, diry)
{
	ob.clip._x = ob.x;
	ob.clip._y = ob.y;
	ob.clip.gotoAndStop(dirx + diry * 2 + 3);
	ob.xtile = Math.floor(ob.clip._x / game.tileW);
	ob.ytile = Math.floor(ob.clip._y / game.tileH);
	if (game["t_" + ob.ytile + "_" + ob.xtile].door and ob == _root.char)
	{
		changeMap (ob);
	}
}
```

在 `fall` 函数开头添加这行：

```
ob.climb = false;
```

然后修改方向键检测的函数：

```
if (Key.isDown(Key.RIGHT))
{
	getMyCorners (ob.x + ob.speed, ob.y, ob);
	if (!ob.climb or ob.downleft and ob.upleft and ob.upright and ob.downright)
	{
		keyPressed = _root.moveChar(ob, 1, 0);
	}
}
else if (Key.isDown(Key.LEFT))
{
	getMyCorners (ob.x - ob.speed, ob.y, ob);
	if (!ob.climb or ob.downleft and ob.upleft and ob.upright and ob.downright)
	{
		keyPressed = _root.moveChar(ob, -1, 0);
	}
}
else if (Key.isDown(Key.UP))
{
	if (!ob.jump and checkUpLadder (ob))
	{
		keyPressed = _root.climb(ob, -1);
	}
}
else if (Key.isDown(Key.DOWN))
{
	if (!ob.jump and checkDownLadder (ob))
	{
		keyPressed = _root.climb(ob, 1);
	}
}
```

当我们检测到左右键按下时，我们检查英雄是否没有在爬梯子 （`!ob.climb`），如果在爬梯子，我们会判断他的四角是不是将会撞墙。

当检测到上下键时，我们首先判断英雄是不是没有在跳跃（`!ob.jump`），而是否在跳跃的条件使用两个新的函数来判断：`checkUpLadder` 和 `checkDownLadder`。如果都满足，我们使用新函数 `climb` 函数来让英雄移动。

## 爬梯子函数

为了实现爬梯子，我们需要创建 3 个新函数，1个用来判断能否向上爬，一个判断能否向下爬，最后一个用来移动英雄。

```
function checkUpLadder (ob)
{
	var downY = Math.floor((ob.y + ob.height - 1) / game.tileH);
	var upY = Math.floor((ob.y - ob.height) / game.tileH);
	var upLadder = game["t_" + upY + "_" + ob.xtile].ladder;
	var downLadder = game["t_" + downY + "_" + ob.xtile].ladder;
	if (upLadder or downLadder)
	{
		return (true);
	}
	else
	{
		fall (ob);
	}
}
```

这段代码计算了英雄当前的顶部中点和底部中点坐标，如果这些坐标所在的瓦片的 `ladder` 属性为 `true`，表示我们可以向上爬，如果上方或下方不是梯子，我们检测英雄是否会掉落。

```
function checkDownLadder (ob)
{
	var downY = Math.floor((ob.speed + ob.y + ob.height) / game.tileH);
	var downLadder = game["t_" + downY + "_" + ob.xtile].ladder;
	if (downLadder)
	{
		return (true);
	}
	else
	{
		fall (ob);
	}
}
```

为了检查英雄能否向下爬，我们需要英雄下方的瓦片的 `ladder` 属性，但是与向上爬不同，我们检查的是英雄移动以后站所在的瓦片（`ob.speed + ob.y + ob.height`）。

```
function climb (ob, diry)
{
	ob.climb = true;
	ob.jump = false;
	ob.y += ob.speed * diry;
	ob.x = (ob.xtile * game.tileW) + game.tileW / 2;
	updateChar (ob, 0, diry);
	return (true);
}
```

在 `climb` 函数中，我们首先设置 `climb` 标识为 `true`，`jump` 标识为 `false`。然后计算英雄的新 `y` 坐标，之后将横坐标 `y` 放在梯子中心：

```
ob.x = (ob.xtile * game.tileW) + game.tileW / 2;
```

只要英雄的中心在梯子瓦片上，他都可以攀爬，而在梯子左右两边攀爬会看起来比较奇怪。

最后我们通过 `updateChar` 函数更新角色的实际位置。

你可以在这里下载本章节的代码：[fla](http://www.gotoandplay.it/_articles/2004/02/tonypa/clouds.fla) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/clouds.fla)

# 笨笨的敌人

# 更多敌人

# 射击

# 获取物品

# 会移动的瓦片

# 卷轴

# 更多类型的卷轴

# 深度

# 斜视角

# 鼠标移动

# 斜视角鼠标移动

# 斜视角卷轴

# 旋转主角

# 旋转背景

# 寻路

# 更多寻路

# 斜坡

## 斜坡

是时候看看如何添加斜坡了：

<iframe id="iframe_p29" width="240"
  height="180" src="http://www.surebrz.com/origin/html/p29.html"></iframe>

[swf](http://www.gotoandplay.it/_articles/2004/02/tonypa/img/p29_1.swf) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p29_1.swf)

很多人问过我：“我要怎么让英雄在斜坡瓦片上行走呢？”，而我通常会回答道：“地球上为什么会有你们这些想让英雄走在斜坡上的人?只在方块上走路不开心吗？你的英雄就不能跳到更高的瓦片上吗？”，然后他们说：“不行，我就是要用斜坡！”

可能你不知道斜坡瓦片是什么样的，在这个图片上，英雄（叫 Charlie 的鸭子）正站在斜坡上：

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p29_2.gif)

（截图来自 Mike Wiering / Wiering Software 的 《CHARLIE II》）

斜坡允许我们的英雄通过左右行走就走到在更高（或更低）的地方而不必跳跃（或下落）。因此，我们要讨论的斜坡将会是连接两个高度不同的瓦片的东西：

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p29_3.gif)

当左侧图片的英雄想要移动到右边时，他不得不跳到更高的瓦片上，但是通过斜坡，右侧图片里的英雄不需要跳跃了。没错，如果我们的英雄可以跳，那右边的英雄也可以通过跳跃来移动到目的地，不过不会跳跃的英雄就会很开心，因为他们不用跳了。

## 涉及的问题

当我们想实现斜坡瓦片时，我们会面临很多问题（我觉得你不会希望遇到问题）。首先是英雄在斜坡上的站立点。如果你还记得的话，我们的英雄是矩形的，所有的碰撞都基于他的四个角，在实现斜坡时就不能使用这个思路了，不然很多情况下英雄将会双脚离地。作为代替，我们把英雄的中心放在斜坡地面上，让他的一部分进入地面。

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p29_4.gif)

另外，游戏中的斜坡必须是讲一个瓦片的角和另一个的角连接起来的形式，在设置斜坡时必须非常小心，你不能使用其他角度和形状的斜坡，也不能设置奇怪的斜坡地图。

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p29_5.gif)

## 写代码实现吧

我们从第 7 章“跳跃”的代码开始。

定义新的瓦片类型：

```
game.Tile4 = function() {};
game.Tile4.prototype.walkable = true;
game.Tile4.prototype.slope = 1;
game.Tile4.prototype.frame = 4;
game.Tile5 = function() {};
game.Tile5.prototype.walkable = true;
game.Tile5.prototype.slope = -1;
game.Tile5.prototype.frame = 5;
```

`Tile4` 是斜上的斜坡（/），`tile5` 是斜下的斜坡（\）。在对应的 `frame` 上给这些斜坡绘制合适的帧图片。

新创建的函数是一个美好东西，他闻起来是那么的新鲜，做了你从来没有做过的事情。让我们编写 `checkForSlopes` 函数：

```
function checkForSlopes (ob, diry, dirx)
{
  if (game["t_" + (ob.ytile + 1) + "_" + ob.xtile].slope and !ob.jump)
  {
    ob.ytile += 1;
    ob.y += game.tileH;
  }
  if (game["t_" + ob.ytile + "_" + ob.xtile].slope and diry != -1)
  {
    if (diry == 1)
    {
      ob.y = (ob.ytile + 1) * game.tileH - ob.height;
    }
    var xpos = ob.x - ob.xtile * game.tileW;
    ob.onSlope = game["t_" + ob.ytile + "_" + ob.xtile].slope;
    ob.jump = false;
    if(game["t_" + ob.ytile + "_" + ob.xtile].slope == 1)
    {
      ob.addy = xpos;
      ob.clip._y = (ob.ytile + 1) * game.tileH - ob.height - ob.addy;
    }
    else
    {
      ob.addy = game.tileW - xpos;
      ob.clip._y = (ob.ytile + 1) * game.tileH - ob.height - ob.addy;
    }
  }
  else
  {
    if((ob.onSlope == 1 and dirx == 1) or (ob.onSlope == -1 and dirx == -1))
    {
      ob.ytile -= 1;
      ob.y -= game.tileH;
      ob.clip._y = ob.y;
    }
    ob.onSlope = false;
  }
}
```

这个函数将会在 `moveChar` 中被调用，包含有移动的变量 `dirx` 和 `diry`。

第一个 `if` 语句判断当前瓦片下方的瓦片是不是斜坡，用来处理英雄站在不能行走的瓦片上，但是向左或向右移动后会掉到斜坡瓦片上的情况。如果英雄下方是斜坡，我们增加 `ytile` 和 `y` 的值，不过当英雄处在跳跃中的时候我们不检查这个情况（跳跃的情况会在第 2 个 if 中处理，此时英雄掉在了斜坡上）。

接下来的 `if` 语句检查英雄当前处在斜坡上的情况。`diry != -1` 的部分忽略这次检查，这种忽略的情况是按下了空格键，英雄在向上跳。

如果我们在下落（`diry == 1`），我们将设置 `y` 属性的值，使得好像我们的英雄站在了斜坡下边的瓦片的顶部（后边会抬高它到斜坡上）。我们设置 `jump` 属性为 `false`，`onSlope` 为当前瓦片的 `slop` 值（1 或者 -1）。

`xpos` 是我们的英雄中心离当前图块左边缘的距离：

![pic](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/p29_6.gif)

如果沿着斜坡上升，我们将给英雄抬升 `xpos` 的值，如果是下降，我们将抬升 `tileW - xpos` 的值。记住，如果你不用正方形的瓦片，你需要自己设置正确的 `xpos` 值。

`else` 里的最后一部分代码检查我们正站在斜坡上同时即将离开这一格，移动到更高的瓦片的情况。

接下来对 `moveChar` 方法修改向左和向右的检查部分：

```
//left
if ((ob.downleft and ob.upleft) or ob.onSlope)
{
  ...
 
//right
if ((ob.upright and ob.downright) or ob.onSlope)
{
  ...
```

这里，只要英雄站在斜坡上，就忽略左右移动时的碰撞检测。记住，当在斜坡上的时候，他有一部分会进入墙内，所以不能使用普通的四角碰撞检测。

当设置了英雄的影片剪辑位置后，调用 `checkForSlopes` 函数：

```
ob.clip._x = ob.x;
ob.clip._y = ob.y;
checkForSlopes(ob, diry, dirx);
```

当站在斜坡上跳跃时，我们必须更新英雄的 `y` 坐标，修改按键检测的方法：

```
if (Key.isDown(Key.SPACE))
{
  if (!ob.jump)
  {
    //if we were on slope, update
    if (ob.onSlope)
    {
      ob.y -= ob.addy;
      ob.ytile = Math.floor(ob.y / game.tileH);
    }
    ob.jump = true;
    ob.jumpspeed = ob.jumpstart;
  }
}
else if (Key.isDown(Key.RIGHT))
{
  keyPressed = _root.moveChar(ob, 1, 0);
}
else if (Key.isDown(Key.LEFT))
{
  keyPressed = _root.moveChar(ob, -1, 0);
}
```

如果英雄的 `onSlope` 属性为 `true`，我们要首先把它更新，计算新的 `y` 和 `ytile` 值（此时 `ob.y` 的值一直是当前格的中心 `y` 坐标 `ytile * game.tileH - ob.height`，只是影片剪辑被显示在了抬高 `addy` 后的位置，所以跳跃时先将 `ob.y` 也实际抬高）。

你可以在这里下载本章节的代码：[fla](http://www.gotoandplay.it/_articles/2004/02/tonypa/slopes.fla) / [镜像](http://www.surebrz.com/origin/imgs/tonypas-tile-based-tutorials/slopes.fla)
