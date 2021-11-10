webkit技术内幕


html 树形结构 + 层次结构

绘制流程

从网页URL到DOM树 => 从DOM树到构建完Webkit绘制上下文 => 从绘制上下文到最终的图像

从DOM树到构建完Webkit绘制上下文
 * DOM树 => RenderObject树 => RenderLayer树 => 绘图上下文




 doing  看到55页