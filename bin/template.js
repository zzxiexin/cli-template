module.exports = {
  local_template: ["../template/base-vite-jotai"],
  remote_template: ["base-vite-jotai", "base-vite-mobx", "base-vite-rtk", "base-vite-useContext", "base-vite-useReducer", "base-vite-zustand"].map(branch => `github:zzxiexin/react-project-template#${branch}`),
  library_template: ["github:zzxiexin/yxx-component#main"]
};
