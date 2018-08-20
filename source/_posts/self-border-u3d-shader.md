title: U3D自用2D像素图描边Shader
date: 2018-08-20 13:05:59
tags: [shader,Unity]
categories: Unity3D
---

Shader 学习中，基于 Sprite-Default。

# 效果
![img](http://wx3.sinaimg.cn/mw690/a94a86cbly1fug36u6j6mj209m07n3yi.jpg)

<!--more-->

# 代码

```glsl
Shader "Custom/NewSurfaceShader" 
{
	Properties
	{
		[PerRendererData] _MainTex ("Sprite Texture", 2D) = "white" {}
		_Color ("Tint", Color) = (1,1,1,1)
		[MaterialToggle] PixelSnap ("Pixel snap", Float) = 0
	}
 
	SubShader
	{
		Tags
		{ 
			"Queue"="Transparent" 
			"IgnoreProjector"="True" 
			"RenderType"="Transparent" 
			"PreviewType"="Plane"
			"CanUseSpriteAtlas"="True"
		}
 
		Cull Off         //关闭背面剔除
		Lighting Off     //关闭灯光
		ZWrite Off       //关闭Z缓冲
		Blend One OneMinusSrcAlpha     //混合源系数one(1)  目标系数OneMinusSrcAlpha(1-one=0)
 
		Pass
		{
		CGPROGRAM
			#pragma vertex vert
			#pragma fragment frag
			#pragma multi_compile _ PIXELSNAP_ON       //告诉Unity编译不同版本的Shader,这里和后面vert中的PIXELSNAP_ON对应
			#include "UnityCG.cginc"
            sampler2D _MainTex;
            float4 _MainTex_TexelSize;
			
			fixed4 _Color;
			
			struct appdata_t                           //vert输入
			{
				float4 vertex   : POSITION;
				float4 color    : COLOR;
				float2 texcoord : TEXCOORD0;
			};
 
			struct v2f                                 //vert输出数据结构
			{
				float4 vertex   : SV_POSITION;
				fixed4 color    : COLOR;
				float2 texcoord  : TEXCOORD0;
			};
 
			v2f vert(appdata_t IN)
			{
				v2f OUT;
				OUT.vertex = UnityObjectToClipPos(IN.vertex);
				OUT.texcoord = IN.texcoord;
				OUT.color = IN.color * _Color;
				#ifdef PIXELSNAP_ON
				OUT.vertex = UnityPixelSnap (OUT.vertex);
				#endif
 
				return OUT;
			}
 
			fixed4 SampleSpriteTexture (float2 uv)
			{
                fixed4 color = tex2D (_MainTex, uv);
				return color;
			}
            

			fixed4 frag(v2f IN) : SV_Target
			{
				float _CheckRange = 1;
				float _CheckAccuracy = 0.5;
				fixed4 _OutlineColor = fixed4(1,1,1,1);
				float _LineWidth = 2;
			
                fixed4 c = SampleSpriteTexture (IN.texcoord) * IN.color;
                c.rgb *= c.a;
                float isOut = step(abs(1/_LineWidth),c.a);
                if(isOut != 0)
                {
                    fixed4 pixelUp = tex2D(_MainTex, IN.texcoord + fixed2(0, _MainTex_TexelSize.y*_CheckRange));  
                    fixed4 pixelDown = tex2D(_MainTex, IN.texcoord - fixed2(0, _MainTex_TexelSize.y*_CheckRange));  
                    fixed4 pixelRight = tex2D(_MainTex, IN.texcoord + fixed2(_MainTex_TexelSize.x*_CheckRange, 0));  
                    fixed4 pixelLeft = tex2D(_MainTex, IN.texcoord - fixed2(_MainTex_TexelSize.x*_CheckRange, 0));  
                    float bOut = step((1-_CheckAccuracy),pixelUp.a*pixelDown.a*pixelRight.a*pixelLeft.a);
                    c = lerp(_OutlineColor,c,bOut);
                    return c;
                }
                return c;
                
			}
		ENDCG
		}
	}
}
```