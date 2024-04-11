// uno.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
  transformerDirectives,
} from "unocss";

export default defineConfig({
  shortcuts: [
    ["cp", "cursor-pointer"],
    [
      "btn",
      "px-4 py-1 rounded inline-block bg-stone-700 text-white cursor-pointer !outline-none hover:bg-stone-800 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50",
    ],
    [
      "icon-btn",
      "inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600",
    ],
    ["b-default", `b-1 b-rounded b-gray-200 dark:b-gray-700`],
    [/b-(\w+)-default/, ([_, p]) => `b-${p}-1 b-gray-200 dark:b-gray-700`],
    [
      /a-(\w+)/,
      ([_, color]) =>
        `cp cursor-pointer hover:underline hover:c-${color}-400 hover:dark:c-${color}-600`,
    ],
    [
      /hbg-(\w+)/,
      ([_, color]) => `hover:bg-${color}-100 dark:hover:bg-${color}-600`,
    ],
    [
      /hc-(\w+)/,
      ([_, color]) => `cp hover:c-${color}-400 hover:dark:c-${color}-600`,
    ],
    [
      /^flex-(\w+)-(\w+)/,
      ([_, col, row]) => `flex items-${col} justify-${row}`,
    ],
  ],

  presets: [
    presetIcons({
      extraProperties: {
        display: "inline-block",
        height: "1.2em",
        width: "1.2em",
        "vertical-align": "text-bottom",
      },
    }),
    presetAttributify(),
    presetUno(),
    presetWebFonts({
      fonts: {
        sans: "Inter:400,600,800",
        mono: "DM Mono:400,600",
      },
    }),
  ],
  transformers: [transformerDirectives()],
});
