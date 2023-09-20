/// <reference types="vite/client" />
declare module 'wkt' {
  // 这里可以根据wkx库的API添加更多的类型声明
  // 以下是一个基本的示例，你可能需要根据实际使用的API进行调整

  // 定义Geometry类
  export class Geometry {
      // 定义从WKT字符串解析的静态方法
      static fromWKT(wkt: string): Geometry;
      // 定义转换为WKT字符串的方法
      toWKT(): string;
  }
      //定义parse方法
  export function parse(wkt: string): Geometry;
  // 其他需要的类型声明可以在这里添加
}
declare module "*.json" {
  const value: any;
  export default value;
}