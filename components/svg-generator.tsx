/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { presetTemplates } from "@/lib/constants";
import PresetTemplateGrid from "./PresetTemplateGrid";

export default function SvgGenerator() {
  const [text, setText] = useState("");
  const [svgs, setSvgs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const svgRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onSubmit = async () => {
    if (!text) {
      toast.error("请输入内容");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: text }),
      });

      const data = await response.json();

      if (data.svgContents && data.svgContents.length > 0) {
        setSvgs(data.svgContents);
        toast.success("SVG 生成成功");
      } else {
        toast.error("无法生成 SVG");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("生成过程中出现错误");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = (index: number) => {
    if (!svgRefs.current[index]) return;

    const svgElement = svgRefs.current[index].querySelector("svg");
    if (!svgElement) {
      toast.error("SVG 元素未找到");
      return;
    }

    // 获取原始SVG的尺寸和viewBox
    const svgWidth = svgElement.getAttribute("width");
    const svgHeight = svgElement.getAttribute("height");
    const viewBox = svgElement.getAttribute("viewBox");

    // 设置更高的分辨率
    const scale = 4;
    const width = parseInt(svgWidth || "800");
    const height = parseInt(svgHeight || "600");

    // 创建一个新的SVG元素，保留原始尺寸和viewBox
    const newSvg = svgElement.cloneNode(true) as SVGElement;
    newSvg.setAttribute("width", width.toString());
    newSvg.setAttribute("height", height.toString());
    if (viewBox) newSvg.setAttribute("viewBox", viewBox);

    const svgData = new XMLSerializer().serializeToString(newSvg);
    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, width * scale, height * scale);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              toast.error("无法创建图片");
              return;
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "generated.png";
            a.click();
            URL.revokeObjectURL(url);
            URL.revokeObjectURL(svgUrl);
          },
          "image/png",
          1.0
        );
      }
    };

    img.src = svgUrl;
  };

  const copyImageToClipboard = async (index: number) => {
    if (!svgRefs.current[index]) return;

    try {
      const svgElement = svgRefs.current[index].querySelector("svg");
      if (!svgElement) throw new Error("SVG element not found");

      // 获取原始SVG的尺寸和viewBox
      const svgWidth = svgElement.getAttribute("width");
      const svgHeight = svgElement.getAttribute("height");
      const viewBox = svgElement.getAttribute("viewBox");

      // 设置更高的分辨率
      const scale = 4;
      const width = parseInt(svgWidth || "800");
      const height = parseInt(svgHeight || "600");

      // 创建一个新的SVG元素，保留原始尺寸和viewBox
      const newSvg = svgElement.cloneNode(true) as SVGElement;
      newSvg.setAttribute("width", width.toString());
      newSvg.setAttribute("height", height.toString());
      if (viewBox) newSvg.setAttribute("viewBox", viewBox);

      const svgData = new XMLSerializer().serializeToString(newSvg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Unable to create canvas context");

        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, width * scale, height * scale);

        try {
          const blob = await new Promise<Blob>((resolve) =>
            canvas.toBlob(resolve as BlobCallback, "image/png", 1.0)
          );
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          toast.success("高清图片已复制到剪贴板");
        } catch (err) {
          console.error(err);
          toast.error("复制图片失败");
        } finally {
          URL.revokeObjectURL(svgUrl);
        }
      };

      img.src = svgUrl;
    } catch (error) {
      console.error("Error:", error);
      toast.error("复制图片失败");
    }
  };

  const handleTemplateSelect = (template: { prompt: string; svg: string }) => {
    setText(template.prompt);
    setSvgs([template.svg]);
    toast.success("模板已加载");
  };

  return (
    <div className="md:container p-4 md:p-8 min-h-[63vh]">
      <Card className="w-full mb-8 shadow-sm hover:shadow-md transition-shadow duration-300 hover:border-blue-300">
        <CardContent className="space-y-6 p-6">
          <h2 className="text-2xl font-bold mb-4">
            汉语新解 | 给汉语一个全新的解释
          </h2>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-600">
              汉语输入
            </h3>
            <Input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="输入一个汉语词汇"
              className="text-lg focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-600">
              推荐词汇
            </h3>
            <div className="flex flex-wrap gap-2">
              {presetTemplates.map((item) => (
                <Button
                  key={item.prompt}
                  variant="outline"
                  onClick={() => {
                    setText(item.prompt);
                    setSvgs([item.svg]);
                  }}
                  className="text-sm hover:bg-gray-100"
                >
                  {item.prompt}
                </Button>
              ))}
            </div>
          </div>

          <Button
            onClick={onSubmit}
            className="w-full text-lg bg-blue-600 hover:bg-blue-700 text-white"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin w-5 h-5 mr-2" />
            ) : (
              "生成汉语解释"
            )}
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, index) => (
            <Card key={index} className="h-96 shadow-sm hover:shadow-md transition-shadow duration-300 hover:border-blue-300">
              <CardContent className="flex items-center justify-center h-full">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-slate-300 h-10 w-10"></div>
                  <div className="flex-1 space-y-6 py-1">
                    <div className="h-2 bg-slate-300 rounded"></div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="h-2 bg-slate-300 rounded col-span-2"></div>
                        <div className="h-2 bg-slate-300 rounded col-span-1"></div>
                      </div>
                      <div className="h-2 bg-slate-300 rounded"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : svgs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {svgs.map((svg, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition-shadow duration-300 hover:border-blue-300">
              <CardContent className="p-6 flex flex-col items-center justify-center h-full">
                <div
                  ref={(el: HTMLDivElement | null) => { svgRefs.current[index] = el; }}
                  dangerouslySetInnerHTML={{ __html: svg }}
                  className="mb-6 w-full h-[300px] flex items-center justify-center"
                  style={{ overflow: 'visible' }}
                />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => downloadImage(index)}>
                    <Download className="w-4 h-4 mr-2" />
                    下载图片
                  </Button>
                  <Button variant="outline" onClick={() => copyImageToClipboard(index)}>
                    <Copy className="w-4 h-4 mr-2" />
                    复制图片
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      await navigator.clipboard.writeText(svg);
                      toast.success("SVG 已复制到剪贴板");
                    }}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    复制 SVG
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="h-96">
          <CardContent className="flex items-center justify-center h-full text-gray-500">
            生成的汉语解释将显示在这里
          </CardContent>
        </Card>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">汉语新解例子</h2>
        <PresetTemplateGrid
          templates={presetTemplates}
          onSelect={handleTemplateSelect}
        />
      </div>
    </div>
  );
}
