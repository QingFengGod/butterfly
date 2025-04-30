export default {
  printWidth: 120, // 一行不得超过110字符
  tabWidth: 2, // 缩进 2 个空格
  useTabs: false, // 使用空格代替tab缩进
  semi: false, // 句末使用分号
  vueIndentScriptAndStyle: false, // 不对vue中的script及style标签缩进
  singleQuote: true, // 优先使用单引号
  quoteProps: 'as-needed', // 仅在必需时为对象的key添加引号
  bracketSpacing: true, // 对象前后添加空格-eg: { foo: bar }
  trailingComma: 'none', // 未尾分号
  jsxBracketSameLine: false, // 多属性html标签的‘>’折行放置
  jsxSingleQuote: false,
  arrowParens: 'always', // 单参数箭头函数参数周围使用圆括号-eg: (x) => x
  insertPragma: false, // 无需顶部注释即可格式化
  requirePragma: false, // 在已被preitter格式化的文件顶部加上标注
  proseWrap: 'never', // props 属性换行
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'auto' // 结束行形式
}
