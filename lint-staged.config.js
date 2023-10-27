export default {
  "*.(html|css|cjs|js|ts|yml)": "prettier -w ",
  ".js,.ts": "eslint --ext .js,.ts --fix --ignore-path .gitignore",
};
