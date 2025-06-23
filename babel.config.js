module.exports = {
  presets: [
    [
      "next/babel",
      {
        "preset-env": {},
        "preset-typescript": {},
        "transform-runtime": {},
        "preset-react": {
          runtime: "automatic",
        },
      },
    ],
  ],
};