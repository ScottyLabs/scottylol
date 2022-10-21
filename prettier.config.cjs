/** @type {import("prettier").Config} */
module.exports = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  tailwindConfig: './tailwind.config.cjs',
  trailingComma: 'none',
  semi: true,
  singleQuote: true
};
