const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('api', {
  cacheLoad:  ()     => ipcRenderer.invoke('cache-load'),
  cacheSave:  (json) => ipcRenderer.invoke('cache-save', json),
  exportData: (json) => ipcRenderer.invoke('export-data', json),
  importData: ()     => ipcRenderer.invoke('import-data'),
});
